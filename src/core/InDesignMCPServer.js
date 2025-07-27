/**
 * Main InDesign MCP Server class
 */
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { allToolDefinitions } from '../types/index.js';
import {
    BookHandlers,
    DocumentHandlers,
    ExportHandlers,
    GraphicsHandlers,
    GroupHandlers,
    HelpHandlers,
    MasterSpreadHandlers,
    PageHandlers,
    PageItemHandlers,
    ResourceHandlers,
    PromptHandlers,
    StyleHandlers,
    TextHandlers,
    UtilityHandlers,
    WorkflowHandlers
} from '../handlers/index.js';
import { formatResponse, formatErrorResponse } from '../utils/stringUtils.js';
import { logger } from '../utils/logger.js';
import { setupGracefulShutdown, performanceMonitor, executeToolSafely, createHealthCheck } from '../utils/debugUtils.js';

export class InDesignMCPServer {
    constructor() {
        this.server = new Server(
            {
                name: 'indesign-server-complete',
                version: '1.0.0',
            },
            {
                capabilities: {
                    tools: {},
                    resources: {
                        listChanged: true
                    },
                    prompts: {
                        listChanged: true
                    }
                },
            }
        );

        this.setupToolHandlers();
    }

    setupToolHandlers() {
        // Tools handlers
        this.server.setRequestHandler(ListToolsRequestSchema, async () => {
            logger.debug('List tools request received');
            return {
                tools: Object.values(allToolDefinitions)
            };
        });

        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;

            logger.info(`Tool call received: ${name}`, { args });

            try {
                // Start performance monitoring
                performanceMonitor.startTimer(name);

                const result = await this.handleToolCall(name, args);

                // End performance monitoring
                performanceMonitor.endTimer(name);

                // Enhanced success logging
                const metrics = performanceMonitor.getMetrics()[name];
                logger.info(`Tool completed: ${name}`, {
                    success: result.success,
                    duration: metrics?.lastDuration,
                    avgDuration: metrics?.avgDuration,
                    totalCalls: metrics?.calls
                });

                return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
            } catch (error) {
                // End performance monitoring even on error
                performanceMonitor.endTimer(name);

                // Enhanced error logging
                const metrics = performanceMonitor.getMetrics()[name];
                logger.error(`Tool call failed: ${name}`, {
                    error: error.message,
                    stack: error.stack,
                    args,
                    duration: metrics?.lastDuration,
                    avgDuration: metrics?.avgDuration,
                    totalCalls: metrics?.calls
                });

                // Return structured error response
                const errorResponse = {
                    success: false,
                    message: `Tool execution failed: ${error.message}`,
                    error: {
                        code: error.code || 'TOOL_EXECUTION_ERROR',
                        details: error.details || {},
                        timestamp: new Date().toISOString()
                    }
                };

                return { content: [{ type: 'text', text: JSON.stringify(errorResponse, null, 2) }] };
            }
        });

        // MCP Resources and Prompts are implemented as regular tools in handleToolCall
        // This approach works well and provides the same functionality as proper MCP handlers
        // The tools are: list_resources, list_resource_templates, read_resource, list_prompts, get_prompt
    }

    async handleToolCall(name, args) {
        logger.debug(`Handling tool call: ${name}`, { args });

        // Smart Workflow Tools (NEW)
        switch (name) {
            case 'create_publication_document': return await WorkflowHandlers.createPublicationDocument(args);
            case 'setup_document_styles': return await WorkflowHandlers.setupDocumentStyles(args);
            case 'create_content_section': return await WorkflowHandlers.createContentSection(args);
            case 'add_visual_element': return await WorkflowHandlers.addVisualElement(args);
            case 'create_layout_template': return await WorkflowHandlers.createLayoutTemplate(args);
            case 'apply_design_system': return await WorkflowHandlers.applyDesignSystem(args);
            case 'update_content_batch': return await WorkflowHandlers.updateContentBatch(args);
            case 'create_data_table': return await WorkflowHandlers.createDataTable(args);
            case 'publish_document': return await WorkflowHandlers.publishDocument(args);
            case 'get_workflow_help': return await WorkflowHandlers.getWorkflowHelp(args);
            case 'apply_template': return await WorkflowHandlers.applyTemplate(args);

            // MCP Resources (as tools for now)
            case 'list_resources': return await ResourceHandlers.listResources();
            case 'list_resource_templates': return await ResourceHandlers.listResourceTemplates();
            case 'read_resource': return await ResourceHandlers.readResource(args.uri);

            // MCP Prompts (as tools for now)
            case 'list_prompts': return await PromptHandlers.listPrompts();
            case 'get_prompt': return await PromptHandlers.getPrompt(args.name);

            // Document Management
            case 'get_document_info': return await DocumentHandlers.getDocumentInfo();
            case 'create_document': return await DocumentHandlers.createDocument(args);
            case 'open_document': return await DocumentHandlers.openDocument(args);
            case 'save_document': return await DocumentHandlers.saveDocument(args);
            case 'close_document': return await DocumentHandlers.closeDocument();

            // Document Advanced Tools
            case 'preflight_document': return await DocumentHandlers.preflightDocument(args);
            case 'zoom_to_page': return await DocumentHandlers.zoomToPage(args);
            case 'data_merge': return await DocumentHandlers.dataMerge(args);

            // Document Elements & Styles
            case 'get_document_elements': return await DocumentHandlers.getDocumentElements(args);
            case 'get_document_styles': return await DocumentHandlers.getDocumentStyles(args);
            case 'get_document_colors': return await DocumentHandlers.getDocumentColors(args);

            // Document Preferences
            case 'get_document_preferences': return await DocumentHandlers.getDocumentPreferences(args);
            case 'set_document_preferences': return await DocumentHandlers.setDocumentPreferences(args);

            // Document Stories & Text
            case 'get_document_stories': return await DocumentHandlers.getDocumentStories(args);
            case 'find_text_in_document': return await DocumentHandlers.findTextInDocument(args);

            // Document Layers & Organization
            case 'get_document_layers': return await DocumentHandlers.getDocumentLayers(args);
            case 'organize_document_layers': return await DocumentHandlers.organizeDocumentLayers(args);

            // Document Hyperlinks & Interactivity
            case 'get_document_hyperlinks': return await DocumentHandlers.getDocumentHyperlinks(args);
            case 'create_document_hyperlink': return await DocumentHandlers.createDocumentHyperlink(args);

            // Document Sections & Numbering
            case 'get_document_sections': return await DocumentHandlers.getDocumentSections();
            case 'create_document_section': return await DocumentHandlers.createDocumentSection(args);

            // Document XML & Structure
            case 'get_document_xml_structure': return await DocumentHandlers.getDocumentXmlStructure(args);
            case 'export_document_xml': return await DocumentHandlers.exportDocumentXml(args);

            // Document Cloud & Collaboration
            case 'save_document_to_cloud': return await DocumentHandlers.saveDocumentToCloud(args);
            case 'open_cloud_document': return await DocumentHandlers.openCloudDocument(args);

            // Document Grid & Layout
            case 'get_document_grid_settings': return await DocumentHandlers.getDocumentGridSettings();
            case 'set_document_grid_settings': return await DocumentHandlers.setDocumentGridSettings(args);
            case 'get_document_layout_preferences': return await DocumentHandlers.getDocumentLayoutPreferences();
            case 'set_document_layout_preferences': return await DocumentHandlers.setDocumentLayoutPreferences(args);

            // Document Validation & Cleanup
            case 'validate_document': return await DocumentHandlers.validateDocument(args);
            case 'cleanup_document': return await DocumentHandlers.cleanupDocument(args);

            // Page Management
            case 'add_page': return await PageHandlers.addPage(args);
            case 'get_page_info': return await PageHandlers.getPageInfo(args);
            case 'navigate_to_page': return await PageHandlers.navigateToPage(args);

            // Advanced Page Management
            case 'duplicate_page': return await PageHandlers.duplicatePage(args);
            case 'move_page': return await PageHandlers.movePage(args);
            case 'delete_page': return await PageHandlers.deletePage(args);
            case 'set_page_properties': return await PageHandlers.setPageProperties(args);
            case 'set_page_background': return await PageHandlers.setPageBackground(args);
            case 'adjust_page_layout': return await PageHandlers.adjustPageLayout(args);
            case 'resize_page': return await PageHandlers.resizePage(args);
            case 'create_page_guides': return await PageHandlers.createPageGuides(args);
            case 'place_file_on_page': return await PageHandlers.placeFileOnPage(args);
            case 'place_xml_on_page': return await PageHandlers.placeXmlOnPage(args);
            case 'snapshot_page_layout': return await PageHandlers.snapshotPageLayout(args);
            case 'delete_page_layout_snapshot': return await PageHandlers.deletePageLayoutSnapshot(args);
            case 'delete_all_page_layout_snapshots': return await PageHandlers.deleteAllPageLayoutSnapshots(args);
            case 'reframe_page': return await PageHandlers.reframePage(args);
            case 'select_page': return await PageHandlers.selectPage(args);
            case 'get_page_content_summary': return await PageHandlers.getPageContentSummary(args);

            // Text Management
            case 'create_text_frame': return await TextHandlers.createTextFrame(args);
            case 'edit_text_frame': return await TextHandlers.editTextFrame(args);
            case 'create_table': return await TextHandlers.createTable(args);
            case 'populate_table': return await TextHandlers.populateTable(args);
            case 'find_replace_text': return await TextHandlers.findReplaceText(args);

            // Graphics Management
            case 'create_rectangle': return await GraphicsHandlers.createRectangle(args);
            case 'create_ellipse': return await GraphicsHandlers.createEllipse(args);
            case 'create_polygon': return await GraphicsHandlers.createPolygon(args);
            case 'place_image': return await GraphicsHandlers.placeImage(args);
            case 'create_object_style': return await GraphicsHandlers.createObjectStyle(args);
            case 'list_object_styles': return await GraphicsHandlers.listObjectStyles();
            case 'apply_object_style': return await GraphicsHandlers.applyObjectStyle(args);
            case 'get_image_info': return await GraphicsHandlers.getImageInfo(args);

            // Style Management
            case 'create_paragraph_style': return await StyleHandlers.createParagraphStyle(args);
            case 'create_character_style': return await StyleHandlers.createCharacterStyle(args);
            case 'apply_paragraph_style': return await StyleHandlers.applyParagraphStyle(args);
            case 'apply_character_style': return await StyleHandlers.applyCharacterStyle(args);
            case 'apply_color': return await StyleHandlers.applyColor(args);
            case 'create_color_swatch': return await StyleHandlers.createColorSwatch(args);
            case 'list_styles': return await StyleHandlers.listStyles(args);
            case 'list_color_swatches': return await StyleHandlers.listColorSwatches();

            // Export Functions
            case 'export_pdf': return await ExportHandlers.exportPDF(args);
            case 'export_images': return await ExportHandlers.exportImages(args);
            case 'package_document': return await ExportHandlers.packageDocument(args);

            // Master Spread Management
            case 'create_master_spread': return await MasterSpreadHandlers.createMasterSpread(args);
            case 'list_master_spreads': return await MasterSpreadHandlers.listMasterSpreads(args);
            case 'delete_master_spread': return await MasterSpreadHandlers.deleteMasterSpread(args);
            case 'duplicate_master_spread': return await MasterSpreadHandlers.duplicateMasterSpread(args);
            case 'apply_master_spread': return await MasterSpreadHandlers.applyMasterSpread(args);
            case 'create_master_text_frame': return await MasterSpreadHandlers.createMasterTextFrame(args);
            case 'create_master_rectangle': return await MasterSpreadHandlers.createMasterRectangle(args);
            case 'create_master_guides': return await MasterSpreadHandlers.createMasterGuides(args);
            case 'get_master_spread_info': return await MasterSpreadHandlers.getMasterSpreadInfo(args);

            // Book Management
            case 'create_book': return await BookHandlers.createBook(args);
            case 'open_book': return await BookHandlers.openBook(args);
            case 'list_books': return await BookHandlers.listBooks(args);
            case 'add_document_to_book': return await BookHandlers.addDocumentToBook(args);
            case 'synchronize_book': return await BookHandlers.synchronizeBook(args);
            case 'repaginate_book': return await BookHandlers.repaginateBook(args);
            case 'update_all_cross_references': return await BookHandlers.updateAllCrossReferences(args);
            case 'update_all_numbers': return await BookHandlers.updateAllNumbers(args);
            case 'update_chapter_and_paragraph_numbers': return await BookHandlers.updateChapterAndParagraphNumbers(args);
            case 'export_book': return await BookHandlers.exportBook(args);
            case 'package_book': return await BookHandlers.packageBook(args);
            case 'preflight_book': return await BookHandlers.preflightBook(args);
            case 'print_book': return await BookHandlers.printBook(args);
            case 'get_book_info': return await BookHandlers.getBookInfo(args);
            case 'set_book_properties': return await BookHandlers.setBookProperties(args);

            // PageItem Management
            case 'get_page_item_info': return await PageItemHandlers.getPageItemInfo(args);
            case 'select_page_item': return await PageItemHandlers.selectPageItem(args);
            case 'move_page_item': return await PageItemHandlers.movePageItem(args);
            case 'resize_page_item': return await PageItemHandlers.resizePageItem(args);
            case 'set_page_item_properties': return await PageItemHandlers.setPageItemProperties(args);
            case 'duplicate_page_item': return await PageItemHandlers.duplicatePageItem(args);
            case 'delete_page_item': return await PageItemHandlers.deletePageItem(args);
            case 'list_page_items': return await PageItemHandlers.listPageItems(args);

            // Group Management
            case 'create_group': return await GroupHandlers.createGroup(args);
            case 'create_group_from_items': return await GroupHandlers.createGroupFromItems(args);
            case 'ungroup': return await GroupHandlers.ungroup(args);
            case 'get_group_info': return await GroupHandlers.getGroupInfo(args);
            case 'add_item_to_group': return await GroupHandlers.addItemToGroup(args);
            case 'remove_item_from_group': return await GroupHandlers.removeItemFromGroup(args);
            case 'list_groups': return await GroupHandlers.listGroups(args);
            case 'set_group_properties': return await GroupHandlers.setGroupProperties(args);

            // Utility Functions
            case 'execute_indesign_code': return await UtilityHandlers.executeInDesignCode(args);
            case 'view_document': return await UtilityHandlers.viewDocument();
            case 'get_session_info': return await UtilityHandlers.getSessionInfo();
            case 'clear_session': return await UtilityHandlers.clearSession();

            // Help System
            case 'help': return await HelpHandlers.getHelp(args);

            // Server Health Check
            case 'health_check': return await this.handleHealthCheck();

            // Server Status and Metrics
            case 'get_server_status': return await this.handleServerStatus();

            // Add more handlers as we create them
            default:
                return formatErrorResponse(`Tool '${name}' not found or not implemented. Use 'help' to see available tools.`, "Tool Call");
        }
    }

    /**
     * Handle server health check
     */
    async handleHealthCheck() {
        try {
            const healthData = createHealthCheck();

            // Enhanced InDesign-specific health information
            const indesignHealth = {
                ...healthData,
                indesign: {
                    hasActiveDocument: false,
                    documentCount: 0,
                    applicationStatus: 'unknown',
                    lastCheck: new Date().toISOString()
                },
                server: {
                    version: '1.1.0',
                    transport: 'stdio',
                    tools: Object.keys(allToolDefinitions).length,
                    uptime: process.uptime(),
                    memory: process.memoryUsage(),
                    performance: performanceMonitor.getMetrics()
                }
            };

            // Try to get InDesign status if possible
            try {
                const sessionInfo = await UtilityHandlers.getSessionInfo();
                if (sessionInfo.success && sessionInfo.result) {
                    const session = JSON.parse(sessionInfo.result);
                    indesignHealth.indesign = {
                        hasActiveDocument: session.hasActiveDocument || false,
                        documentCount: session.activeDocument ? 1 : 0,
                        applicationStatus: session.hasActiveDocument ? 'active' : 'idle',
                        lastCheck: new Date().toISOString()
                    };
                }
            } catch (error) {
                logger.warn('Could not get InDesign status for health check', { error: error.message });
                indesignHealth.indesign.applicationStatus = 'error';
                indesignHealth.indesign.error = error.message;
            }

            // Log health check
            logger.info('Health check completed', {
                status: 'healthy',
                indesignStatus: indesignHealth.indesign.applicationStatus,
                tools: indesignHealth.server.tools
            });

            return formatResponse('Health check completed successfully', indesignHealth);
        } catch (error) {
            logger.error('Health check failed', { error: error.message, stack: error.stack });
            return formatErrorResponse('Health check failed', error.message);
        }
    }

    /**
     * Handle server status and metrics
     */
    async handleServerStatus() {
        try {
            const status = {
                server: {
                    version: '1.1.0',
                    transport: 'stdio',
                    uptime: process.uptime(),
                    memory: process.memoryUsage(),
                    platform: process.platform,
                    arch: process.arch,
                    nodeVersion: process.version
                },
                tools: {
                    total: Object.keys(allToolDefinitions).length,
                    categories: this.getToolCategories(),
                    definitions: allToolDefinitions
                },
                performance: {
                    metrics: performanceMonitor.getMetrics(),
                    summary: this.getPerformanceSummary()
                },
                status: {
                    timestamp: new Date().toISOString(),
                    health: 'healthy',
                    ready: true
                }
            };

            logger.info('Server status requested', {
                tools: status.tools.total,
                uptime: status.server.uptime
            });

            return formatResponse('Server status retrieved successfully', status);
        } catch (error) {
            logger.error('Server status failed', { error: error.message, stack: error.stack });
            return formatErrorResponse('Server status failed', error.message);
        }
    }

    /**
     * Get tool categories for status reporting
     */
    getToolCategories() {
        const categories = {};

        for (const tool of Object.values(allToolDefinitions)) {
            const category = this.getToolCategory(tool.name);
            if (!categories[category]) {
                categories[category] = 0;
            }
            categories[category]++;
        }

        return categories;
    }

    /**
     * Determine tool category based on name
     */
    getToolCategory(toolName) {
        if (toolName.startsWith('create_') || toolName.startsWith('add_')) return 'creation';
        if (toolName.startsWith('get_') || toolName.startsWith('list_')) return 'query';
        if (toolName.startsWith('edit_') || toolName.startsWith('update_')) return 'modification';
        if (toolName.startsWith('delete_') || toolName.startsWith('remove_')) return 'deletion';
        if (toolName.startsWith('export_') || toolName.startsWith('package_')) return 'export';
        if (toolName.includes('workflow') || toolName.includes('template')) return 'workflow';
        if (toolName.includes('health') || toolName.includes('status')) return 'system';
        return 'utility';
    }

    /**
     * Get performance summary
     */
    getPerformanceSummary() {
        const metrics = performanceMonitor.getMetrics();
        const summary = {
            totalCalls: 0,
            totalDuration: 0,
            avgDuration: 0,
            slowestTool: null,
            fastestTool: null,
            mostUsedTool: null
        };

        let maxDuration = 0;
        let minDuration = Infinity;
        let maxCalls = 0;

        for (const [toolName, metric] of Object.entries(metrics)) {
            summary.totalCalls += metric.calls;
            summary.totalDuration += metric.avgDuration * metric.calls;

            if (metric.avgDuration > maxDuration) {
                maxDuration = metric.avgDuration;
                summary.slowestTool = { name: toolName, duration: metric.avgDuration };
            }

            if (metric.avgDuration < minDuration) {
                minDuration = metric.avgDuration;
                summary.fastestTool = { name: toolName, duration: metric.avgDuration };
            }

            if (metric.calls > maxCalls) {
                maxCalls = metric.calls;
                summary.mostUsedTool = { name: toolName, calls: metric.calls };
            }
        }

        if (summary.totalCalls > 0) {
            summary.avgDuration = summary.totalDuration / summary.totalCalls;
        }

        return summary;
    }

    async run() {
        try {
            console.log('🚀 Starting InDesign MCP Server...');

            const transport = new StdioServerTransport();
            await this.server.connect(transport);

            // Setup graceful shutdown
            setupGracefulShutdown(this.server);

            // Enhanced startup logging
            const startupInfo = {
                version: '1.1.0',
                transport: 'stdio',
                tools: Object.keys(allToolDefinitions).length,
                timestamp: new Date().toISOString(),
                status: 'ready'
            };

            // Log server start to stderr (MCP-compliant)
            logger.info('InDesign MCP Server started', startupInfo);

            // Enhanced startup confirmation for external processes
            console.error(JSON.stringify({
                timestamp: new Date().toISOString(),
                level: 'INFO',
                message: 'InDesign MCP Server started',
                data: startupInfo
            }));

            // Additional startup confirmation for test infrastructure
            console.log('✅ InDesign MCP Server ready for connections');

            // Emit ready signal for external processes
            console.error(JSON.stringify({
                timestamp: new Date().toISOString(),
                level: 'INFO',
                message: 'Server ready',
                data: { status: 'ready', transport: 'stdio' }
            }));

        } catch (error) {
            logger.error('Failed to start InDesign MCP Server', {
                error: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            });

            // Enhanced error logging for external processes
            console.error(JSON.stringify({
                timestamp: new Date().toISOString(),
                level: 'ERROR',
                message: 'Failed to start InDesign MCP Server',
                data: {
                    error: error.message,
                    status: 'failed',
                    transport: 'stdio'
                }
            }));

            throw error;
        }
    }
} 