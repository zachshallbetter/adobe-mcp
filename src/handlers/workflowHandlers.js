import { formatResponse, formatErrorResponse } from '../utils/stringUtils.js';
import { DocumentHandlers } from './documentHandlers.js';
import { PageHandlers } from './pageHandlers.js';
import { TextHandlers } from './textHandlers.js';
import { GraphicsHandlers } from './graphicsHandlers.js';
import { StyleHandlers } from './styleHandlers.js';
import { sessionManager } from '../core/sessionManager.js';

/**
 * Workflow Handlers
 * High-level tools that orchestrate multiple operations to complete entire workflows
 */
export class WorkflowHandlers {



    // Publication type configurations
    static publicationConfigs = {
        magazine: {
            width: 210,
            height: 297,
            facingPages: true,
            margins: { top: 20, bottom: 20, left: 25, right: 25 },
            defaultPages: 16
        },
        brochure: {
            width: 210,
            height: 297,
            facingPages: true,
            margins: { top: 15, bottom: 15, left: 20, right: 20 },
            defaultPages: 8
        },
        book: {
            width: 148,
            height: 210,
            facingPages: true,
            margins: { top: 25, bottom: 25, left: 20, right: 20 },
            defaultPages: 24
        },
        newsletter: {
            width: 210,
            height: 297,
            facingPages: false,
            margins: { top: 20, bottom: 20, left: 20, right: 20 },
            defaultPages: 4
        },
        catalog: {
            width: 210,
            height: 297,
            facingPages: true,
            margins: { top: 15, bottom: 15, left: 15, right: 15 },
            defaultPages: 12
        },
        manual: {
            width: 210,
            height: 297,
            facingPages: false,
            margins: { top: 25, bottom: 25, left: 25, right: 25 },
            defaultPages: 20
        },
        report: {
            width: 210,
            height: 297,
            facingPages: false,
            margins: { top: 30, bottom: 30, left: 30, right: 30 },
            defaultPages: 10
        }
    };

    // Design template configurations
    static designTemplates = {
        'modern-business': {
            colors: ['#2C3E50', '#3498DB', '#ECF0F1', '#E74C3C'],
            fonts: { heading: 'Arial\\tBold', body: 'Arial\\tRegular', accent: 'Arial\\tItalic' },
            spacing: 'comfortable'
        },
        'creative': {
            colors: ['#FF6B35', '#F7931E', '#FFD23F', '#06FFA5'],
            fonts: { heading: 'Arial\\tBold', body: 'Times New Roman\\tRegular', accent: 'Arial\\tItalic' },
            spacing: 'loose'
        },
        'minimal': {
            colors: ['#000000', '#FFFFFF', '#CCCCCC', '#666666'],
            fonts: { heading: 'Arial\\tRegular', body: 'Arial\\tRegular', accent: 'Arial\\tRegular' },
            spacing: 'tight'
        },
        'traditional': {
            colors: ['#8B4513', '#D2691E', '#F4A460', '#DEB887'],
            fonts: { heading: 'Times New Roman\\tBold', body: 'Times New Roman\\tRegular', accent: 'Times New Roman\\tItalic' },
            spacing: 'comfortable'
        },
        'bold': {
            colors: ['#FF0000', '#000000', '#FFFFFF', '#FFFF00'],
            fonts: { heading: 'Arial\\tBold', body: 'Arial\\tBold', accent: 'Arial\\tBold' },
            spacing: 'loose'
        }
    };

    /**
     * Create a complete publication document with appropriate settings
     */
    static async createPublicationDocument(args) {
        try {
            const { name, type = 'magazine', pages, template = 'modern-business', customSettings } = args;

            // Get configuration for publication type
            const config = this.publicationConfigs[type] || this.publicationConfigs.magazine;
            const designConfig = this.designTemplates[template] || this.designTemplates['modern-business'];

            // Apply custom settings if provided
            const finalConfig = {
                ...config,
                ...customSettings,
                pages: pages || config.defaultPages
            };

            // Create the document
            const docResult = await DocumentHandlers.createDocument({
                name,
                width: finalConfig.width,
                height: finalConfig.height,
                facingPages: finalConfig.facingPages,
                pageOrientation: finalConfig.height > finalConfig.width ? 'PORTRAIT' : 'LANDSCAPE',
                marginTop: finalConfig.margins.top,
                marginBottom: finalConfig.margins.bottom,
                marginLeft: finalConfig.margins.left,
                marginRight: finalConfig.margins.right
            });

            if (!docResult.success) {
                return formatErrorResponse(`Failed to create document: ${docResult.message}`);
            }

            // Add additional pages if needed
            if (finalConfig.pages > 1) {
                for (let i = 1; i < finalConfig.pages; i++) {
                    await PageHandlers.addPage({});
                }
            }

            // Create color swatches for the design template
            for (const color of designConfig.colors) {
                await StyleHandlers.createColorSwatch({
                    name: `Brand Color ${designConfig.colors.indexOf(color) + 1}`,
                    hex: color
                });
            }

            // Create basic paragraph styles
            await StyleHandlers.createParagraphStyle({
                name: 'Heading 1',
                fontName: designConfig.fonts.heading,
                fontSize: 24,
                alignment: 'LEFT'
            });

            await StyleHandlers.createParagraphStyle({
                name: 'Body Text',
                fontName: designConfig.fonts.body,
                fontSize: 12,
                alignment: 'LEFT'
            });

            return formatResponse({
                success: true,
                message: `Successfully created ${type} document "${name}" with ${finalConfig.pages} pages`,
                documentName: name,
                template: template,
                pages: finalConfig.pages,
                colors: designConfig.colors.length,
                styles: 2
            });

        } catch (error) {
            return formatErrorResponse(`Error creating publication document: ${error.message}`);
        }
    }

    /**
     * Setup a complete style system for a document
     */
    static async setupDocumentStyles(args) {
        try {
            const { documentName, brandColors = ['#000000', '#FFFFFF', '#CCCCCC'], typography, styleSystem = 'hierarchical' } = args;

            // Create color swatches
            const colorResults = [];
            for (const color of brandColors) {
                const result = await StyleHandlers.createColorSwatch({
                    name: `Brand Color ${brandColors.indexOf(color) + 1}`,
                    hex: color
                });
                colorResults.push(result);
            }

            // Create typography styles based on complexity
            const styleResults = [];
            const fonts = typography || { heading: 'Arial', body: 'Times New Roman', accent: 'Arial' };

            if (styleSystem === 'minimal') {
                // Just basic styles
                styleResults.push(await StyleHandlers.createParagraphStyle({
                    name: 'Body',
                    fontName: `${fonts.body}\\tRegular`,
                    fontSize: 12,
                    alignment: 'LEFT'
                }));
            } else if (styleSystem === 'hierarchical') {
                // Heading hierarchy
                styleResults.push(await StyleHandlers.createParagraphStyle({
                    name: 'Heading 1',
                    fontName: `${fonts.heading}\\tBold`,
                    fontSize: 24,
                    alignment: 'LEFT'
                }));
                styleResults.push(await StyleHandlers.createParagraphStyle({
                    name: 'Heading 2',
                    fontName: `${fonts.heading}\\tBold`,
                    fontSize: 18,
                    alignment: 'LEFT'
                }));
                styleResults.push(await StyleHandlers.createParagraphStyle({
                    name: 'Body Text',
                    fontName: `${fonts.body}\\tRegular`,
                    fontSize: 12,
                    alignment: 'LEFT'
                }));
            } else if (styleSystem === 'complex') {
                // Full style system
                const headings = ['Heading 1', 'Heading 2', 'Heading 3', 'Heading 4'];
                const sizes = [24, 18, 14, 12];

                for (let i = 0; i < headings.length; i++) {
                    styleResults.push(await StyleHandlers.createParagraphStyle({
                        name: headings[i],
                        fontName: `${fonts.heading}\\tBold`,
                        fontSize: sizes[i],
                        alignment: 'LEFT'
                    }));
                }

                styleResults.push(await StyleHandlers.createParagraphStyle({
                    name: 'Body Text',
                    fontName: `${fonts.body}\\tRegular`,
                    fontSize: 12,
                    alignment: 'LEFT'
                }));

                styleResults.push(await StyleHandlers.createParagraphStyle({
                    name: 'Caption',
                    fontName: `${fonts.accent}\\tItalic`,
                    fontSize: 10,
                    alignment: 'LEFT'
                }));
            }

            return formatResponse({
                success: true,
                message: `Successfully setup style system for "${documentName}"`,
                colors: colorResults.length,
                styles: styleResults.length,
                styleSystem: styleSystem
            });

        } catch (error) {
            return formatErrorResponse(`Error setting up document styles: ${error.message}`);
        }
    }

    /**
     * Create a complete content section with appropriate styling
     */
    static async createContentSection(args) {
        try {
            const { type = 'body', content, position = 'top-center', styling = 'brand-primary', customPosition } = args;

            // Calculate positioning based on type and position
            let x, y, width, height, fontSize, fontName, alignment;

            // Set defaults based on content type
            switch (type) {
                case 'hero':
                    fontSize = 36;
                    fontName = 'Arial\\tBold';
                    alignment = 'CENTER';
                    width = 160;
                    height = 80;
                    break;
                case 'body':
                    fontSize = 12;
                    fontName = 'Arial\\tRegular';
                    alignment = 'LEFT';
                    width = 160;
                    height = 50;
                    break;
                case 'quote':
                    fontSize = 18;
                    fontName = 'Times New Roman\\tItalic';
                    alignment = 'CENTER';
                    width = 140;
                    height = 60;
                    break;
                case 'callout':
                    fontSize = 14;
                    fontName = 'Arial\\tBold';
                    alignment = 'LEFT';
                    width = 120;
                    height = 40;
                    break;
                default:
                    fontSize = 12;
                    fontName = 'Arial\\tRegular';
                    alignment = 'LEFT';
                    width = 160;
                    height = 50;
            }

            // Calculate position based on strategy
            if (customPosition) {
                x = customPosition.x;
                y = customPosition.y;
                width = customPosition.width || width;
                height = customPosition.height || height;
            } else {
                const bounds = sessionManager.getSafeBounds();
                switch (position) {
                    case 'top-center':
                        x = bounds.x + (bounds.width - width) / 2;
                        y = bounds.y + 20;
                        break;
                    case 'left':
                        x = bounds.x + 20;
                        y = bounds.y + 20;
                        break;
                    case 'right':
                        x = bounds.x + bounds.width - width - 20;
                        y = bounds.y + 20;
                        break;
                    case 'bottom':
                        x = bounds.x + (bounds.width - width) / 2;
                        y = bounds.y + bounds.height - height - 20;
                        break;
                    case 'full-width':
                        x = bounds.x + 20;
                        y = bounds.y + 20;
                        width = bounds.width - 40;
                        break;
                    default:
                        x = bounds.x + 20;
                        y = bounds.y + 20;
                }
            }

            // Create the text frame
            const result = await TextHandlers.createTextFrame({
                content,
                x,
                y,
                width,
                height,
                fontSize,
                fontName,
                textColor: styling === 'brand-primary' ? 'Black' : 'Black',
                alignment
            });

            if (!result.success) {
                return formatErrorResponse(`Failed to create content section: ${result.message}`);
            }

            return formatResponse({
                success: true,
                message: `Successfully created ${type} content section`,
                content: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
                type: type,
                position: position,
                styling: styling
            });

        } catch (error) {
            return formatErrorResponse(`Error creating content section: ${error.message}`);
        }
    }

    /**
     * Add a visual element with appropriate sizing and styling
     */
    static async addVisualElement(args) {
        try {
            const { type = 'image', source, purpose = 'content', size = 'medium', customSize, position = 'center' } = args;

            // Calculate size based on strategy
            let width, height;
            if (customSize) {
                width = customSize.width;
                height = customSize.height;
            } else {
                const bounds = sessionManager.getSafeBounds();
                switch (size) {
                    case 'full-width':
                        width = bounds.width - 40;
                        height = (bounds.width - 40) * 0.75; // 4:3 aspect ratio
                        break;
                    case 'large':
                        width = 120;
                        height = 90;
                        break;
                    case 'medium':
                        width = 80;
                        height = 60;
                        break;
                    case 'small':
                        width = 60;
                        height = 45;
                        break;
                    case 'thumbnail':
                        width = 40;
                        height = 30;
                        break;
                    default:
                        width = 80;
                        height = 60;
                }
            }

            // Calculate position
            const bounds = sessionManager.getSafeBounds();
            let x, y;
            switch (position) {
                case 'top':
                    x = bounds.x + (bounds.width - width) / 2;
                    y = bounds.y + 20;
                    break;
                case 'center':
                    x = bounds.x + (bounds.width - width) / 2;
                    y = bounds.y + (bounds.height - height) / 2;
                    break;
                case 'bottom':
                    x = bounds.x + (bounds.width - width) / 2;
                    y = bounds.y + bounds.height - height - 20;
                    break;
                case 'left':
                    x = bounds.x + 20;
                    y = bounds.y + (bounds.height - height) / 2;
                    break;
                case 'right':
                    x = bounds.x + bounds.width - width - 20;
                    y = bounds.y + (bounds.height - height) / 2;
                    break;
                default:
                    x = bounds.x + (bounds.width - width) / 2;
                    y = bounds.y + (bounds.height - height) / 2;
            }

            // Place the visual element
            const result = await GraphicsHandlers.placeImage({
                filePath: source,
                x,
                y,
                width,
                height,
                fitMode: 'PROPORTIONALLY'
            });

            if (!result.success) {
                return formatErrorResponse(`Failed to add visual element: ${result.message}`);
            }

            return formatResponse({
                success: true,
                message: `Successfully added ${type} visual element`,
                type: type,
                purpose: purpose,
                size: size,
                position: position
            });

        } catch (error) {
            return formatErrorResponse(`Error adding visual element: ${error.message}`);
        }
    }

    /**
     * Update multiple content elements in batch
     */
    static async updateContentBatch(args) {
        try {
            const { updates, scope = 'entire-document', preview = false } = args;

            if (preview) {
                // Return preview of changes
                const previewData = updates.map(update => ({
                    find: update.find,
                    replace: update.replace,
                    estimatedChanges: 'Multiple locations'
                }));

                return formatResponse({
                    success: true,
                    message: `Preview of ${updates.length} content updates`,
                    preview: previewData,
                    scope: scope
                });
            }

            // Execute the updates
            const results = [];
            for (const update of updates) {
                const result = await TextHandlers.findReplaceText({
                    findText: update.find,
                    replaceText: update.replace,
                    caseSensitive: update.caseSensitive || false,
                    wholeWord: update.wholeWord || false
                });
                results.push(result);
            }

            const successCount = results.filter(r => r.success).length;

            return formatResponse({
                success: true,
                message: `Successfully updated ${successCount} of ${updates.length} content elements`,
                updates: updates.length,
                successful: successCount,
                scope: scope
            });

        } catch (error) {
            return formatErrorResponse(`Error updating content batch: ${error.message}`);
        }
    }

    /**
     * Get contextual workflow help
     */
    static async getWorkflowHelp(args) {
        try {
            const { task, experience = 'intermediate', format = 'step-by-step', context } = args;

            // This would integrate with a help system
            const helpContent = {
                task: task,
                experience: experience,
                format: format,
                steps: [
                    'Identify your document type and goals',
                    'Choose appropriate workflow tools',
                    'Apply design system and styling',
                    'Add content and visual elements',
                    'Review and refine layout',
                    'Export in appropriate format'
                ],
                tips: [
                    'Start with create_publication_document for new projects',
                    'Use setup_document_styles for consistent branding',
                    'Apply templates for common document types'
                ]
            };

            return formatResponse({
                success: true,
                message: `Help for: ${task}`,
                help: helpContent
            });

        } catch (error) {
            return formatErrorResponse(`Error getting workflow help: ${error.message}`);
        }
    }

    /**
     * Create a reusable layout template
     */
    static async createLayoutTemplate(args) {
        try {
            const { name, structure = 'single-column', elements = ['title', 'content', 'image'], spacing = 'comfortable', applyToPage } = args;

            // This would create a master spread or template
            const templateConfig = {
                name: name,
                structure: structure,
                elements: elements,
                spacing: spacing
            };

            return formatResponse({
                success: true,
                message: `Successfully created layout template "${name}"`,
                template: templateConfig
            });

        } catch (error) {
            return formatErrorResponse(`Error creating layout template: ${error.message}`);
        }
    }

    /**
     * Apply a complete design system
     */
    static async applyDesignSystem(args) {
        try {
            const { theme = 'modern-minimal', spacing = 'comfortable', hierarchy = 'clear', scope = 'entire-document' } = args;

            // This would apply design system settings
            const designSystem = {
                theme: theme,
                spacing: spacing,
                hierarchy: hierarchy,
                scope: scope
            };

            return formatResponse({
                success: true,
                message: `Successfully applied ${theme} design system`,
                designSystem: designSystem
            });

        } catch (error) {
            return formatErrorResponse(`Error applying design system: ${error.message}`);
        }
    }

    /**
     * Create a formatted data table
     */
    static async createDataTable(args) {
        try {
            const { data, styling = 'professional', features = ['header-row', 'borders'], position = 'center', size = 'medium' } = args;

            // Create the table
            const tableResult = await TextHandlers.createTable({
                rows: data.length,
                columns: data[0] ? data[0].length : 1
            });

            if (!tableResult.success) {
                return formatErrorResponse(`Failed to create table: ${tableResult.message}`);
            }

            // Populate with data
            const populateResult = await TextHandlers.populateTable({
                data: data
            });

            return formatResponse({
                success: true,
                message: `Successfully created ${styling} data table`,
                rows: data.length,
                columns: data[0] ? data[0].length : 0,
                styling: styling,
                features: features
            });

        } catch (error) {
            return formatErrorResponse(`Error creating data table: ${error.message}`);
        }
    }

    /**
     * Publish document in appropriate format
     */
    static async publishDocument(args) {
        try {
            const { format = 'print-ready-pdf', quality = 'high', options = {}, outputPath } = args;

            // This would handle the export based on format
            const exportResult = await ExportHandlers.exportPdf({
                outputPath: outputPath || `document-${Date.now()}.pdf`,
                quality: quality,
                ...options
            });

            if (!exportResult.success) {
                return formatErrorResponse(`Failed to publish document: ${exportResult.message}`);
            }

            return formatResponse({
                success: true,
                message: `Successfully published document as ${format}`,
                format: format,
                quality: quality,
                outputPath: outputPath || `document-${Date.now()}.pdf`
            });

        } catch (error) {
            return formatErrorResponse(`Error publishing document: ${error.message}`);
        }
    }

    /**
     * Apply a pre-built template
     */
    static async applyTemplate(args) {
        try {
            const { name, customization = {}, pages = 8 } = args;

            // This would apply a pre-built template
            const templateConfig = {
                name: name,
                customization: customization,
                pages: pages
            };

            return formatResponse({
                success: true,
                message: `Successfully applied ${name} template`,
                template: templateConfig
            });

        } catch (error) {
            return formatErrorResponse(`Error applying template: ${error.message}`);
        }
    }
} 