import { formatResponse, formatErrorResponse } from '../utils/stringUtils.js';

/**
 * Help Handlers
 * Provides comprehensive help information for the InDesign MCP Server
 */
export class HelpHandlers {

    // Tool categories and their descriptions
    static toolCategories = {
        workflow: {
            name: 'Smart Workflow Tools',
            description: 'High-level workflow tools that orchestrate multiple operations for complete tasks',
            tools: ['create_publication_document', 'setup_document_styles', 'create_content_section', 'add_visual_element', 'create_layout_template', 'apply_design_system', 'update_content_batch', 'create_data_table', 'publish_document', 'get_workflow_help', 'apply_template']
        },
        document: {
            name: 'Document Management',
            description: 'Create, open, save, and manage InDesign documents',
            tools: ['create_document', 'open_document', 'save_document', 'close_document', 'get_document_info']
        },
        page: {
            name: 'Page Operations',
            description: 'Add, delete, navigate, and manage pages',
            tools: ['add_page', 'delete_page', 'navigate_to_page', 'get_page_info', 'set_page_background']
        },
        text: {
            name: 'Text & Typography',
            description: 'Create and edit text frames, apply styles',
            tools: ['create_text_frame', 'edit_text_frame', 'get_text_info', 'apply_paragraph_style', 'apply_character_style']
        },
        graphics: {
            name: 'Graphics & Images',
            description: 'Create shapes and place images with scaling',
            tools: ['create_rectangle', 'create_ellipse', 'create_polygon', 'place_image', 'get_image_info']
        },
        styles: {
            name: 'Styles & Colors',
            description: 'Create and manage colors, paragraph, character, and object styles',
            tools: ['create_color_swatch', 'list_color_swatches', 'create_paragraph_style', 'create_character_style', 'create_object_style', 'list_styles']
        },
        layout: {
            name: 'Layout & Positioning',
            description: 'Group objects, create master spreads, manage positioning',
            tools: ['create_group', 'ungroup', 'create_master_spread', 'apply_master_spread']
        },
        export: {
            name: 'Export & Utilities',
            description: 'Export documents and run custom code',
            tools: ['export_pdf', 'export_images', 'execute_indesign_code']
        }
    };

    // Tool definitions with detailed information
    static toolDefinitions = {
        create_document: {
            name: 'create_document',
            description: 'Create a new InDesign document',
            parameters: {
                name: 'Document name',
                width: 'Page width in mm (default: 210)',
                height: 'Page height in mm (default: 297)',
                facingPages: 'Enable facing pages (default: false)',
                pageOrientation: 'PORTRAIT or LANDSCAPE (default: PORTRAIT)',
                marginTop: 'Top margin in mm (default: 25)',
                marginBottom: 'Bottom margin in mm (default: 25)',
                marginLeft: 'Left margin in mm (default: 25)',
                marginRight: 'Right margin in mm (default: 25)'
            },
            example: {
                name: 'My Document',
                width: 210,
                height: 297,
                facingPages: false,
                pageOrientation: 'PORTRAIT'
            }
        },
        create_text_frame: {
            name: 'create_text_frame',
            description: 'Create a text frame with content',
            parameters: {
                content: 'Text content to display',
                x: 'X position in mm (default: 10)',
                y: 'Y position in mm (default: 10)',
                width: 'Frame width in mm',
                height: 'Frame height in mm',
                fontSize: 'Font size in points (default: 12)',
                fontName: 'Font name in format "FontName\\tStyle" (default: "Arial\\tRegular")',
                textColor: 'Text color name (default: "Black")',
                alignment: 'Text alignment: LEFT, CENTER, RIGHT, JUSTIFY (default: LEFT)',
                paragraphStyle: 'Paragraph style name to apply (optional)',
                characterStyle: 'Character style name to apply (optional)'
            },
            example: {
                content: 'Hello World',
                x: 25,
                y: 25,
                width: 160,
                height: 50,
                fontSize: 24,
                fontName: 'Arial\\tBold',
                alignment: 'CENTER'
            }
        },
        place_image: {
            name: 'place_image',
            description: 'Place an image on the active page with scaling options',
            parameters: {
                filePath: 'Absolute path to the image file (required)',
                x: 'X position in mm (default: 10)',
                y: 'Y position in mm (default: 10)',
                width: 'Frame width in mm',
                height: 'Frame height in mm',
                scale: 'Scale percentage 1-1000 (default: 100)',
                fitMode: 'Fitting mode: PROPORTIONALLY, FILL_FRAME, FIT_CONTENT, FIT_FRAME (default: PROPORTIONALLY)',
                linkImage: 'Link the image (default: true)'
            },
            example: {
                filePath: '/path/to/image.jpg',
                x: 25,
                y: 25,
                width: 100,
                height: 75,
                scale: 150,
                fitMode: 'PROPORTIONALLY'
            }
        },
        create_color_swatch: {
            name: 'create_color_swatch',
            description: 'Create a custom color swatch with support for multiple formats (RGB, CMYK, Hex, arrays)',
            parameters: {
                name: 'Color name (required)',
                colorType: 'Color type: PROCESS or SPOT (default: PROCESS)',
                // RGB format
                red: 'Red value 0-255 (for RGB format)',
                green: 'Green value 0-255 (for RGB format)',
                blue: 'Blue value 0-255 (for RGB format)',
                // CMYK format
                cyan: 'Cyan value 0-100 (for CMYK format)',
                magenta: 'Magenta value 0-100 (for CMYK format)',
                yellow: 'Yellow value 0-100 (for CMYK format)',
                black: 'Black value 0-100 (for CMYK format)',
                // Hex format
                hex: 'Hex color code (e.g., "#FF0000" or "FF0000")',
                // Array format
                colorValue: 'Color values array: [r,g,b] for RGB or [c,m,y,k] for CMYK'
            },
            example: {
                name: 'Brand Blue',
                hex: '#0072C6'
            }
        },
        create_paragraph_style: {
            name: 'create_paragraph_style',
            description: 'Create a paragraph style for consistent typography',
            parameters: {
                name: 'Style name (required)',
                fontName: 'Font name in format "FontName\\tStyle" (default: "Arial\\tRegular")',
                fontSize: 'Font size in points (default: 12)',
                fillColor: 'Text color name (default: "Black")',
                alignment: 'Text alignment: LEFT, CENTER, RIGHT, JUSTIFY (default: LEFT)',
                leading: 'Line spacing in points (optional)',
                spaceBefore: 'Space before paragraph in points (optional)',
                spaceAfter: 'Space after paragraph in points (optional)'
            },
            example: {
                name: 'Heading 1',
                fontName: 'Arial\\tBold',
                fontSize: 32,
                fillColor: 'Brand Blue',
                alignment: 'CENTER'
            }
        },
        set_page_background: {
            name: 'set_page_background',
            description: 'Set the background color of a page',
            parameters: {
                pageIndex: 'Page index (0-based) (required)',
                backgroundColor: 'Color swatch name (default: "White")',
                opacity: 'Opacity percentage 0-100 (default: 100)'
            },
            example: {
                pageIndex: 0,
                backgroundColor: 'Brand Blue',
                opacity: 50
            }
        },
        // Smart Workflow Tools
        create_publication_document: {
            name: 'create_publication_document',
            description: 'Create a complete publication document with appropriate settings, pages, and basic styling',
            parameters: {
                name: 'Document name (required)',
                type: 'Publication type: magazine, brochure, book, newsletter, catalog, manual, report (default: magazine)',
                pages: 'Number of pages to create (default: 8)',
                template: 'Design template: modern-business, creative, minimal, traditional, bold (default: modern-business)',
                customSettings: 'Override default settings for the publication type (optional)'
            },
            example: {
                name: 'My Magazine',
                type: 'magazine',
                pages: 16,
                template: 'modern-business'
            }
        },
        setup_document_styles: {
            name: 'setup_document_styles',
            description: 'Create a complete style system for a document including colors, typography, and layout styles',
            parameters: {
                documentName: 'Name of the document to style (required)',
                brandColors: 'Array of brand colors (hex codes or color names) (default: ["#000000", "#FFFFFF", "#CCCCCC"])',
                typography: 'Typography settings with heading, body, accent fonts (optional)',
                styleSystem: 'Complexity: minimal, hierarchical, complex (default: hierarchical)'
            },
            example: {
                documentName: 'My Document',
                brandColors: ['#2C3E50', '#3498DB', '#E74C3C'],
                styleSystem: 'hierarchical'
            }
        },
        create_content_section: {
            name: 'create_content_section',
            description: 'Create a complete content section with appropriate styling and positioning',
            parameters: {
                type: 'Content type: hero, body, quote, callout, sidebar, feature, gallery (default: body)',
                content: 'Text content for the section (required)',
                position: 'Positioning: top-center, left, right, bottom, full-width, custom (default: top-center)',
                styling: 'Styling theme: brand-primary, brand-secondary, neutral, accent, custom (default: brand-primary)',
                customPosition: 'Custom positioning coordinates (overrides position) (optional)'
            },
            example: {
                type: 'hero',
                content: 'Welcome to Our Publication',
                position: 'top-center',
                styling: 'brand-primary'
            }
        },
        add_visual_element: {
            name: 'add_visual_element',
            description: 'Add a visual element (image, chart, icon, etc.) with appropriate sizing and styling',
            parameters: {
                type: 'Element type: image, chart, icon, illustration, logo, background (default: image)',
                source: 'Path to the visual element file (required)',
                purpose: 'Purpose: hero-background, content, decoration, branding, data (default: content)',
                size: 'Size strategy: full-width, large, medium, small, thumbnail, custom (default: medium)',
                position: 'Positioning: top, center, bottom, left, right, custom (default: center)',
                customSize: 'Custom size dimensions (overrides size) (optional)'
            },
            example: {
                type: 'image',
                source: '/path/to/image.jpg',
                purpose: 'content',
                size: 'medium',
                position: 'center'
            }
        },
        create_layout_template: {
            name: 'create_layout_template',
            description: 'Create a reusable layout template with defined structure and elements',
            parameters: {
                name: 'Template name (required)',
                structure: 'Layout structure: single-column, two-column, three-column, grid, magazine, catalog (default: single-column)',
                elements: 'Array of element types to include (default: ["title", "content", "image"])',
                spacing: 'Spacing: tight, comfortable, loose (default: comfortable)',
                applyToPage: 'Page number to apply template to (optional)'
            },
            example: {
                name: 'Article Template',
                structure: 'two-column',
                elements: ['title', 'content', 'image', 'sidebar'],
                spacing: 'comfortable'
            }
        },
        apply_design_system: {
            name: 'apply_design_system',
            description: 'Apply a complete design system to the current document',
            parameters: {
                theme: 'Design theme: modern-minimal, classic, bold, elegant, playful, corporate (default: modern-minimal)',
                spacing: 'Spacing system: tight, comfortable, loose (default: comfortable)',
                hierarchy: 'Visual hierarchy: clear, subtle, dramatic (default: clear)',
                scope: 'Scope: entire-document, current-page, selected-elements (default: entire-document)'
            },
            example: {
                theme: 'modern-minimal',
                spacing: 'comfortable',
                hierarchy: 'clear',
                scope: 'entire-document'
            }
        },
        update_content_batch: {
            name: 'update_content_batch',
            description: 'Update multiple content elements across the document in a single operation',
            parameters: {
                updates: 'Array of find/replace operations (required)',
                scope: 'Scope: entire-document, current-page, selected (default: entire-document)',
                preview: 'Show preview before applying (default: false)'
            },
            example: {
                updates: [
                    { find: 'old text', replace: 'new text' },
                    { find: 'company name', replace: 'Acme Corp' }
                ],
                scope: 'entire-document',
                preview: true
            }
        },
        create_data_table: {
            name: 'create_data_table',
            description: 'Create a formatted table with data and appropriate styling',
            parameters: {
                data: '2D array of table data (required)',
                styling: 'Table styling: professional, casual, minimal, bold, elegant (default: professional)',
                features: 'Table features: sortable, filterable, alternating-rows, borders, header-row (default: ["header-row", "borders"])',
                position: 'Table position: top, center, bottom, custom (default: center)',
                size: 'Table size: full-width, medium, compact (default: medium)'
            },
            example: {
                data: [['Name', 'Age', 'City'], ['John', '30', 'New York'], ['Jane', '25', 'Los Angeles']],
                styling: 'professional',
                features: ['header-row', 'borders'],
                position: 'center'
            }
        },
        publish_document: {
            name: 'publish_document',
            description: 'Export the document in the appropriate format with optimal settings',
            parameters: {
                format: 'Export format: print-ready-pdf, web-pdf, epub, print, interactive-pdf (default: print-ready-pdf)',
                quality: 'Export quality: draft, standard, high, press (default: high)',
                options: 'Format-specific options (optional)',
                outputPath: 'Custom output path (optional)'
            },
            example: {
                format: 'print-ready-pdf',
                quality: 'high',
                options: { includeBookmarks: true, cropMarks: false }
            }
        },
        get_workflow_help: {
            name: 'get_workflow_help',
            description: 'Get contextual help for workflows and tasks',
            parameters: {
                task: 'Task or workflow you need help with (required)',
                experience: 'Experience level: beginner, intermediate, expert (default: intermediate)',
                format: 'Help format: step-by-step, overview, examples, troubleshooting (default: step-by-step)',
                context: 'Additional context about your specific situation (optional)'
            },
            example: {
                task: 'create a magazine layout',
                experience: 'beginner',
                format: 'step-by-step'
            }
        },
        apply_template: {
            name: 'apply_template',
            description: 'Apply a pre-built template for common document types',
            parameters: {
                name: 'Template name: product-catalog, newsletter, brochure, annual-report, manual, portfolio (required)',
                customization: 'Template customization options (optional)',
                pages: 'Number of pages to generate (default: 8)'
            },
            example: {
                name: 'newsletter',
                customization: { brandColors: ['#2C3E50', '#3498DB'] },
                pages: 12
            }
        },
        create_master_spread: {
            name: 'create_master_spread',
            description: 'Create a master spread for consistent page layouts',
            parameters: {
                name: 'Master spread name (required)',
                pages: 'Number of pages in spread (default: 2)',
                layout: 'Layout type: single-page, facing-pages, three-page (default: facing-pages)',
                elements: 'Array of elements to include (optional)'
            },
            example: {
                name: 'Article Master',
                pages: 2,
                layout: 'facing-pages',
                elements: ['header', 'footer', 'page-number']
            }
        },
        apply_master_spread: {
            name: 'apply_master_spread',
            description: 'Apply a master spread to pages',
            parameters: {
                masterName: 'Name of master spread to apply (required)',
                pageRange: 'Page range to apply to (e.g., "1-5" or "all") (default: "all")',
                replaceExisting: 'Replace existing master spreads (default: false)'
            },
            example: {
                masterName: 'Article Master',
                pageRange: '1-10',
                replaceExisting: false
            }
        }
    };

    // Tool difficulty levels
    static toolDifficulties = {
        // Beginner tools
        'create_document': 'beginner',
        'create_text_frame': 'beginner',
        'create_color_swatch': 'beginner',
        'place_image': 'beginner',
        'save_document': 'beginner',
        'get_document_info': 'beginner',

        // Intermediate tools
        'create_paragraph_style': 'intermediate',
        'create_character_style': 'intermediate',
        'create_object_style': 'intermediate',
        'create_group': 'intermediate',
        'set_page_background': 'intermediate',
        'export_pdf': 'intermediate',

        // Expert tools
        'create_master_spread': 'expert',
        'apply_master_spread': 'expert',
        'execute_indesign_code': 'expert',

        // Workflow tools (mostly intermediate)
        'create_publication_document': 'intermediate',
        'setup_document_styles': 'intermediate',
        'create_content_section': 'intermediate',
        'add_visual_element': 'intermediate',
        'create_layout_template': 'expert',
        'apply_design_system': 'expert',
        'update_content_batch': 'expert',
        'create_data_table': 'intermediate',
        'publish_document': 'intermediate',
        'get_workflow_help': 'beginner',
        'apply_template': 'intermediate'
    };

    // Best practices for tools
    static toolBestPractices = {
        'create_document': [
            'Start with standard page sizes (A4, Letter) for compatibility',
            'Use facing pages for multi-page publications',
            'Set appropriate margins based on your content type',
            'Consider bleed settings for print projects'
        ],
        'create_text_frame': [
            'Use paragraph and character styles for consistency',
            'Set appropriate font sizes (12pt for body, 18pt+ for headings)',
            'Consider line spacing (leading) for readability',
            'Use proper alignment based on content type'
        ],
        'create_color_swatch': [
            'Use hex codes for web-safe colors',
            'Create a consistent color palette',
            'Consider CMYK values for print projects',
            'Name colors descriptively (e.g., "Brand Blue" not "Blue1")'
        ],
        'place_image': [
            'Use high-resolution images (300 DPI for print)',
            'Maintain aspect ratio when scaling',
            'Consider image placement in layout context',
            'Use appropriate scaling percentages'
        ],
        'create_publication_document': [
            'Choose the right publication type for your content',
            'Start with a design template that matches your brand',
            'Plan your page count before creating',
            'Consider your target audience when selecting settings'
        ],
        'setup_document_styles': [
            'Create a hierarchical style system',
            'Use consistent naming conventions',
            'Start with brand colors and build from there',
            'Consider typography hierarchy (H1, H2, H3, body)'
        ]
    };

    // Related tools mapping
    static relatedTools = {
        'create_document': [
            { name: 'create_publication_document', description: 'Create complete publication with styling' },
            { name: 'setup_document_styles', description: 'Set up style system for document' },
            { name: 'save_document', description: 'Save the created document' }
        ],
        'create_text_frame': [
            { name: 'create_paragraph_style', description: 'Create paragraph style for text' },
            { name: 'create_character_style', description: 'Create character style for text' },
            { name: 'create_content_section', description: 'Create complete content section' }
        ],
        'create_color_swatch': [
            { name: 'setup_document_styles', description: 'Set up complete style system' },
            { name: 'apply_design_system', description: 'Apply design system to document' },
            { name: 'list_color_swatches', description: 'List all available colors' }
        ],
        'place_image': [
            { name: 'add_visual_element', description: 'Add visual element with smart sizing' },
            { name: 'create_layout_template', description: 'Create layout template with images' },
            { name: 'get_image_info', description: 'Get information about placed image' }
        ],
        'create_publication_document': [
            { name: 'setup_document_styles', description: 'Set up styles for the publication' },
            { name: 'create_content_section', description: 'Add content to the publication' },
            { name: 'publish_document', description: 'Export the publication' }
        ]
    };

    /**
     * Get tool difficulty level
     */
    static getToolDifficulty(toolName) {
        return this.toolDifficulties[toolName] || 'intermediate';
    }

    /**
     * Get best practices for a tool
     */
    static getToolBestPractices(toolName) {
        const practices = this.toolBestPractices[toolName] || [];
        if (practices.length === 0) {
            return 'No specific best practices available for this tool.\n';
        }
        return practices.map(practice => `- ${practice}`).join('\n') + '\n';
    }

    /**
     * Get related tools for a tool
     */
    static getRelatedTools(toolName) {
        return this.relatedTools[toolName] || [];
    }

    /**
     * Get help information
     */
    static async getHelp(args) {
        const { tool, category, format, level, scenario, troubleshooting } = args;

        try {
            // If specific tool requested
            if (tool) {
                return this.getToolHelp(tool, format, level);
            }

            // If category requested
            if (category && category !== 'all') {
                return this.getCategoryHelp(category, format, level);
            }

            // If troubleshooting requested
            if (troubleshooting) {
                return this.getTroubleshootingHelp(troubleshooting);
            }

            // If scenario-based help requested
            if (scenario) {
                return this.getScenarioHelp(scenario, level);
            }

            // Default: show all tools summary
            return this.getAllToolsHelp(format, level);

        } catch (error) {
            return formatErrorResponse(`Error getting help: ${error.message}`, 'Get Help');
        }
    }

    /**
     * Get help for a specific tool
     */
    static getToolHelp(toolName, format = 'summary', level = 'intermediate') {
        const toolDef = this.toolDefinitions[toolName];

        if (!toolDef) {
            return formatErrorResponse(`Tool '${toolName}' not found. Use 'help' without parameters to see all available tools.`, 'Get Help');
        }

        let helpText = `# ${toolDef.name}\n\n`;
        helpText += `**Description:** ${toolDef.description}\n\n`;

        // Add difficulty level indicator
        const difficultyLevels = {
            'beginner': '🟢 Beginner',
            'intermediate': '🟡 Intermediate',
            'expert': '🔴 Expert'
        };
        const difficulty = this.getToolDifficulty(toolName);
        helpText += `**Difficulty:** ${difficultyLevels[difficulty] || difficultyLevels.intermediate}\n\n`;

        if (format === 'detailed' || format === 'examples') {
            helpText += `## Parameters\n\n`;
            for (const [param, desc] of Object.entries(toolDef.parameters)) {
                helpText += `- **${param}**: ${desc}\n`;
            }
            helpText += '\n';
        }

        if (format === 'examples') {
            helpText += `## Example\n\n`;
            helpText += '```javascript\n';
            helpText += `await tools.call("${toolName}", ${JSON.stringify(toolDef.example, null, 2)});\n`;
            helpText += '```\n\n';

            // Add best practices
            helpText += `## Best Practices\n\n`;
            helpText += this.getToolBestPractices(toolName);
            helpText += '\n';
        }

        // Add related tools
        const relatedTools = this.getRelatedTools(toolName);
        if (relatedTools.length > 0) {
            helpText += `## Related Tools\n\n`;
            for (const related of relatedTools) {
                helpText += `- \`${related.name}\`: ${related.description}\n`;
            }
            helpText += '\n';
        }

        return formatResponse(helpText, 'Get Help');
    }

    /**
     * Get troubleshooting help
     */
    static getTroubleshootingHelp(issue) {
        const troubleshooting = {
            'colors-not-appearing': {
                title: 'Colors Not Appearing Correctly',
                description: 'Colors appearing black or incorrect in InDesign',
                solutions: [
                    'Use hex codes instead of RGB values for better compatibility',
                    'Ensure color swatch names are unique',
                    'Check that colors are being applied to the correct elements',
                    'Use the multi-format color support (RGB, CMYK, Hex)',
                    'Verify color values are within valid ranges (0-255 for RGB, 0-100 for CMYK)'
                ]
            },
            'fonts-not-loading': {
                title: 'Fonts Not Loading or Applying',
                description: 'Fonts not appearing or applying incorrectly',
                solutions: [
                    'Use the correct font name format: "FontName\\tStyle" (e.g., "Arial\\tBold")',
                    'Ensure fonts are installed on your system',
                    'Use common fonts like Arial, Helvetica, or Times New Roman',
                    'Check font name spelling and case sensitivity',
                    'Try using the default font fallback: "Arial\\tRegular"'
                ]
            },
            'images-not-placing': {
                title: 'Images Not Placing Correctly',
                description: 'Images not appearing or placing with errors',
                solutions: [
                    'Use absolute file paths instead of relative paths',
                    'Ensure image files exist and are accessible',
                    'Check file format compatibility (JPG, PNG, TIFF, etc.)',
                    'Verify image file permissions',
                    'Use appropriate scaling percentages (1-1000%)'
                ]
            },
            'document-not-saving': {
                title: 'Document Not Saving',
                description: 'Issues with saving documents',
                solutions: [
                    'Ensure you have write permissions in the target directory',
                    'Use absolute file paths for saving',
                    'Check available disk space',
                    'Close the document in InDesign before saving programmatically',
                    'Use descriptive file names without special characters'
                ]
            },
            'workflow-tools-failing': {
                title: 'Workflow Tools Failing',
                description: 'Smart workflow tools not working as expected',
                solutions: [
                    'Start with basic tools before using workflow tools',
                    'Ensure document is open before using workflow tools',
                    'Check that required parameters are provided',
                    'Use the get_workflow_help tool for specific guidance',
                    'Try individual tools first to isolate issues'
                ]
            }
        };

        const issueInfo = troubleshooting[issue];
        if (!issueInfo) {
            return formatErrorResponse(`Troubleshooting guide for '${issue}' not found. Available issues: ${Object.keys(troubleshooting).join(', ')}`, 'Get Help');
        }

        let helpText = `# ${issueInfo.title}\n\n`;
        helpText += `**Issue:** ${issueInfo.description}\n\n`;
        helpText += `## Solutions\n\n`;

        for (const solution of issueInfo.solutions) {
            helpText += `- ${solution}\n`;
        }

        helpText += `\n## Next Steps\n\n`;
        helpText += `If these solutions don't resolve your issue:\n`;
        helpText += `1. Check the error messages for specific details\n`;
        helpText += `2. Try using individual tools instead of workflow tools\n`;
        helpText += `3. Verify your InDesign version and setup\n`;
        helpText += `4. Use the \`help\` command for specific tool guidance\n`;

        return formatResponse(helpText, 'Get Help');
    }

    /**
     * Get scenario-based help
     */
    static getScenarioHelp(scenario, level = 'intermediate') {
        const scenarios = {
            'create-newsletter': {
                title: 'Creating a Newsletter',
                description: 'Complete workflow for creating a professional newsletter',
                steps: [
                    {
                        tool: 'create_publication_document',
                        description: 'Create newsletter document with appropriate settings',
                        args: { name: 'Company Newsletter', type: 'newsletter', pages: 8, template: 'modern-business' }
                    },
                    {
                        tool: 'setup_document_styles',
                        description: 'Set up brand colors and typography',
                        args: { documentName: 'Company Newsletter', brandColors: ['#2C3E50', '#3498DB', '#E74C3C'], styleSystem: 'hierarchical' }
                    },
                    {
                        tool: 'create_content_section',
                        description: 'Add newsletter header',
                        args: { type: 'hero', content: 'Company Newsletter', position: 'top-center', styling: 'brand-primary' }
                    },
                    {
                        tool: 'create_content_section',
                        description: 'Add main content',
                        args: { type: 'body', content: 'Your newsletter content here...', position: 'center', styling: 'brand-secondary' }
                    },
                    {
                        tool: 'publish_document',
                        description: 'Export as PDF',
                        args: { format: 'print-ready-pdf', quality: 'high' }
                    }
                ]
            },
            'design-brochure': {
                title: 'Designing a Brochure',
                description: 'Complete workflow for creating a marketing brochure',
                steps: [
                    {
                        tool: 'create_publication_document',
                        description: 'Create brochure document',
                        args: { name: 'Product Brochure', type: 'brochure', pages: 6, template: 'creative' }
                    },
                    {
                        tool: 'setup_document_styles',
                        description: 'Set up brand styling',
                        args: { documentName: 'Product Brochure', brandColors: ['#1ABC9C', '#F39C12', '#9B59B6'], styleSystem: 'complex' }
                    },
                    {
                        tool: 'add_visual_element',
                        description: 'Add product images',
                        args: { type: 'image', source: '/path/to/product.jpg', purpose: 'content', size: 'large', position: 'center' }
                    },
                    {
                        tool: 'create_data_table',
                        description: 'Add product specifications',
                        args: { data: [['Feature', 'Value'], ['Size', '10x15cm'], ['Weight', '500g']], styling: 'professional', position: 'bottom' }
                    },
                    {
                        tool: 'publish_document',
                        description: 'Export for print',
                        args: { format: 'print-ready-pdf', quality: 'press' }
                    }
                ]
            },
            'create-catalog': {
                title: 'Creating a Product Catalog',
                description: 'Complete workflow for creating a product catalog',
                steps: [
                    {
                        tool: 'create_publication_document',
                        description: 'Create catalog document',
                        args: { name: 'Product Catalog', type: 'catalog', pages: 20, template: 'modern-business' }
                    },
                    {
                        tool: 'setup_document_styles',
                        description: 'Set up catalog styling',
                        args: { documentName: 'Product Catalog', brandColors: ['#34495E', '#E67E22', '#27AE60'], styleSystem: 'hierarchical' }
                    },
                    {
                        tool: 'create_layout_template',
                        description: 'Create product page template',
                        args: { name: 'Product Page', structure: 'two-column', elements: ['title', 'image', 'description', 'price'], spacing: 'comfortable' }
                    },
                    {
                        tool: 'create_data_table',
                        description: 'Add product table',
                        args: { data: [['Product', 'Price', 'SKU'], ['Item 1', '$99.99', 'SKU001'], ['Item 2', '$149.99', 'SKU002']], styling: 'professional' }
                    },
                    {
                        tool: 'publish_document',
                        description: 'Export catalog',
                        args: { format: 'print-ready-pdf', quality: 'high' }
                    }
                ]
            }
        };

        const scenarioInfo = scenarios[scenario];
        if (!scenarioInfo) {
            return formatErrorResponse(`Scenario '${scenario}' not found. Available scenarios: ${Object.keys(scenarios).join(', ')}`, 'Get Help');
        }

        let helpText = `# ${scenarioInfo.title}\n\n`;
        helpText += `${scenarioInfo.description}\n\n`;
        helpText += `## Step-by-Step Workflow\n\n`;

        for (let i = 0; i < scenarioInfo.steps.length; i++) {
            const step = scenarioInfo.steps[i];
            helpText += `### Step ${i + 1}: ${step.description}\n\n`;
            helpText += `**Tool:** \`${step.tool}\`\n\n`;
            helpText += `**Example:**\n`;
            helpText += '```javascript\n';
            helpText += `await tools.call("${step.tool}", ${JSON.stringify(step.args, null, 2)});\n`;
            helpText += '```\n\n';
        }

        helpText += `## Tips for Success\n\n`;
        helpText += `- Start with the workflow tools for faster results\n`;
        helpText += `- Customize the parameters to match your specific needs\n`;
        helpText += `- Use the \`help\` command for detailed tool information\n`;
        helpText += `- Test individual steps before running the complete workflow\n`;

        return formatResponse(helpText, 'Get Help');
    }

    /**
     * Get help for a specific category
     */
    static getCategoryHelp(category, format = 'summary') {
        const catInfo = this.toolCategories[category];

        if (!catInfo) {
            return formatErrorResponse(`Category '${category}' not found. Available categories: ${Object.keys(this.toolCategories).join(', ')}`, 'Get Help');
        }

        let helpText = `# ${catInfo.name}\n\n`;
        helpText += `${catInfo.description}\n\n`;

        helpText += `## Available Tools\n\n`;
        for (const toolName of catInfo.tools) {
            const toolDef = this.toolDefinitions[toolName];
            if (toolDef) {
                helpText += `- **${toolName}**: ${toolDef.description}\n`;
            } else {
                helpText += `- **${toolName}**: Tool available\n`;
            }
        }

        if (format === 'detailed') {
            helpText += '\n## Detailed Information\n\n';
            for (const toolName of catInfo.tools) {
                const toolDef = this.toolDefinitions[toolName];
                if (toolDef) {
                    helpText += `### ${toolName}\n`;
                    helpText += `${toolDef.description}\n\n`;
                    helpText += '**Parameters:**\n';
                    for (const [param, desc] of Object.entries(toolDef.parameters)) {
                        helpText += `- ${param}: ${desc}\n`;
                    }
                    helpText += '\n';
                }
            }
        }

        return formatResponse(helpText, 'Get Help');
    }

    /**
     * Get help for all tools
     */
    static getAllToolsHelp(format = 'summary', level = 'intermediate') {
        let helpText = `# InDesign MCP Server - Available Tools\n\n`;
        helpText += `This server provides programmatic access to Adobe InDesign through Model Context Protocol (MCP).\n\n`;

        helpText += `## Quick Start\n\n`;
        helpText += `1. **Create a document**: \`create_document\`\n`;
        helpText += `2. **Add text**: \`create_text_frame\`\n`;
        helpText += `3. **Add images**: \`place_image\`\n`;
        helpText += `4. **Create styles**: \`create_paragraph_style\`, \`create_color_swatch\`\n`;
        helpText += `5. **Save**: \`save_document\`\n\n`;

        // Add new help features
        helpText += `## Enhanced Help Features\n\n`;
        helpText += `- **Difficulty Levels**: Tools are marked with difficulty levels (🟢 Beginner, 🟡 Intermediate, 🔴 Expert)\n`;
        helpText += `- **Best Practices**: Get tips and best practices for each tool\n`;
        helpText += `- **Related Tools**: Discover related tools for your workflow\n`;
        helpText += `- **Troubleshooting**: Get help for common issues\n`;
        helpText += `- **Scenarios**: Complete workflows for common tasks\n\n`;

        helpText += `## Help Commands\n\n`;
        helpText += `- \`help()\` - Show this overview\n`;
        helpText += `- \`help({ tool: "create_document" })\` - Get help for specific tool\n`;
        helpText += `- \`help({ category: "workflow" })\` - Get help for tool category\n`;
        helpText += `- \`help({ format: "detailed" })\` - Get detailed information\n`;
        helpText += `- \`help({ format: "examples" })\` - Get examples and best practices\n`;
        helpText += `- \`help({ troubleshooting: "colors-not-appearing" })\` - Get troubleshooting help\n`;
        helpText += `- \`help({ scenario: "create-newsletter" })\` - Get scenario-based workflow\n\n`;

        helpText += `## Tool Categories\n\n`;

        for (const [category, info] of Object.entries(this.toolCategories)) {
            helpText += `### ${info.name}\n`;
            helpText += `${info.description}\n\n`;

            if (format === 'summary') {
                helpText += `**Tools:** ${info.tools.join(', ')}\n\n`;
            } else {
                for (const toolName of info.tools) {
                    const toolDef = this.toolDefinitions[toolName];
                    if (toolDef) {
                        helpText += `- **${toolName}**: ${toolDef.description}\n`;
                    } else {
                        helpText += `- **${toolName}**: Tool available\n`;
                    }
                }
                helpText += '\n';
            }
        }

        helpText += `## Usage Examples\n\n`;
        helpText += `### Basic Document Creation\n`;
        helpText += '```javascript\n';
        helpText += '// Create document\n';
        helpText += 'await tools.call("create_document", {\n';
        helpText += '  name: "My Document",\n';
        helpText += '  width: 210,\n';
        helpText += '  height: 297\n';
        helpText += '});\n\n';
        helpText += '// Add text\n';
        helpText += 'await tools.call("create_text_frame", {\n';
        helpText += '  content: "Hello World",\n';
        helpText += '  x: 25, y: 25,\n';
        helpText += '  width: 160, height: 50,\n';
        helpText += '  fontSize: 24,\n';
        helpText += '  fontName: "Arial\\\\tBold"\n';
        helpText += '});\n\n';
        helpText += '// Save\n';
        helpText += 'await tools.call("save_document", { filePath: "./output.indd" });\n';
        helpText += '```\n\n';

        helpText += `## Help Options\n\n`;
        helpText += `- \`help()\` - Show this overview\n`;
        helpText += `- \`help({ tool: "create_document" })\` - Get help for specific tool\n`;
        helpText += `- \`help({ category: "text" })\` - Get help for tool category\n`;
        helpText += `- \`help({ format: "detailed" })\` - Get detailed information\n`;
        helpText += `- \`help({ format: "examples" })\` - Get examples\n\n`;

        helpText += `## Important Notes\n\n`;
        helpText += `- **Font Names**: Use format "FontName\\\\tStyle" (e.g., "Arial\\\\tBold")\n`;
        helpText += `- **Colors**: RGB values (0-255) for color swatches\n`;
        helpText += `- **Positioning**: x, y coordinates in millimeters\n`;
        helpText += `- **Image Paths**: Use absolute file paths\n`;
        helpText += `- **Scaling**: 1-1000% for images\n`;

        return formatResponse(helpText, 'Get Help');
    }
} 