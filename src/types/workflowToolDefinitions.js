/**
 * Smart Workflow Tool Definitions for InDesign MCP Server
 * High-level tools that handle complete workflows instead of individual operations
 */

export const workflowToolDefinitions = [
    // =================== DOCUMENT CREATION & SETUP ===================
    {
        name: 'create_publication_document',
        description: 'Create a complete publication document with appropriate settings, pages, and basic styling',
        inputSchema: {
            type: 'object',
            properties: {
                name: { type: 'string', description: 'Document name' },
                type: {
                    type: 'string',
                    enum: ['magazine', 'brochure', 'book', 'newsletter', 'catalog', 'manual', 'report'],
                    description: 'Publication type to determine default settings',
                    default: 'magazine'
                },
                pages: { type: 'number', description: 'Number of pages to create', default: 8 },
                template: {
                    type: 'string',
                    enum: ['modern-business', 'creative', 'minimal', 'traditional', 'bold'],
                    description: 'Design template to apply',
                    default: 'modern-business'
                },
                customSettings: {
                    type: 'object',
                    description: 'Override default settings for the publication type',
                    properties: {
                        width: { type: 'number', description: 'Page width in mm' },
                        height: { type: 'number', description: 'Page height in mm' },
                        margins: { type: 'object', description: 'Custom margins in mm' },
                        facingPages: { type: 'boolean', description: 'Enable facing pages' }
                    }
                }
            },
            required: ['name'],
        },
    },
    {
        name: 'setup_document_styles',
        description: 'Create a complete style system for a document including colors, typography, and layout styles',
        inputSchema: {
            type: 'object',
            properties: {
                documentName: { type: 'string', description: 'Name of the document to style' },
                brandColors: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Array of brand colors (hex codes or color names)',
                    default: ['#000000', '#FFFFFF', '#CCCCCC']
                },
                typography: {
                    type: 'object',
                    description: 'Typography settings',
                    properties: {
                        heading: { type: 'string', description: 'Heading font family', default: 'Arial' },
                        body: { type: 'string', description: 'Body font family', default: 'Times New Roman' },
                        accent: { type: 'string', description: 'Accent font family', default: 'Arial' }
                    }
                },
                styleSystem: {
                    type: 'string',
                    enum: ['minimal', 'hierarchical', 'complex'],
                    description: 'Complexity of the style system',
                    default: 'hierarchical'
                }
            },
            required: ['documentName'],
        },
    },

    // =================== CONTENT CREATION ===================
    {
        name: 'create_content_section',
        description: 'Create a complete content section with appropriate styling and positioning',
        inputSchema: {
            type: 'object',
            properties: {
                type: {
                    type: 'string',
                    enum: ['hero', 'body', 'quote', 'callout', 'sidebar', 'feature', 'gallery'],
                    description: 'Type of content section',
                    default: 'body'
                },
                content: { type: 'string', description: 'Text content for the section' },
                position: {
                    type: 'string',
                    enum: ['top-center', 'left', 'right', 'bottom', 'full-width', 'custom'],
                    description: 'Positioning strategy',
                    default: 'top-center'
                },
                styling: {
                    type: 'string',
                    enum: ['brand-primary', 'brand-secondary', 'neutral', 'accent', 'custom'],
                    description: 'Styling theme',
                    default: 'brand-primary'
                },
                customPosition: {
                    type: 'object',
                    description: 'Custom positioning coordinates (overrides position)',
                    properties: {
                        x: { type: 'number', description: 'X position in mm' },
                        y: { type: 'number', description: 'Y position in mm' },
                        width: { type: 'number', description: 'Width in mm' },
                        height: { type: 'number', description: 'Height in mm' }
                    }
                }
            },
            required: ['content'],
        },
    },
    {
        name: 'add_visual_element',
        description: 'Add a visual element (image, chart, icon, etc.) with appropriate sizing and styling',
        inputSchema: {
            type: 'object',
            properties: {
                type: {
                    type: 'string',
                    enum: ['image', 'chart', 'icon', 'illustration', 'logo', 'background'],
                    description: 'Type of visual element',
                    default: 'image'
                },
                source: { type: 'string', description: 'Path to the visual element file' },
                purpose: {
                    type: 'string',
                    enum: ['hero-background', 'content', 'decoration', 'branding', 'data'],
                    description: 'Purpose of the visual element',
                    default: 'content'
                },
                size: {
                    type: 'string',
                    enum: ['full-width', 'large', 'medium', 'small', 'thumbnail', 'custom'],
                    description: 'Size strategy',
                    default: 'medium'
                },
                customSize: {
                    type: 'object',
                    description: 'Custom size dimensions (overrides size)',
                    properties: {
                        width: { type: 'number', description: 'Width in mm' },
                        height: { type: 'number', description: 'Height in mm' }
                    }
                },
                position: {
                    type: 'string',
                    enum: ['top', 'center', 'bottom', 'left', 'right', 'custom'],
                    description: 'Positioning strategy',
                    default: 'center'
                }
            },
            required: ['source'],
        },
    },

    // =================== LAYOUT & DESIGN ===================
    {
        name: 'create_layout_template',
        description: 'Create a reusable layout template with defined structure and elements',
        inputSchema: {
            type: 'object',
            properties: {
                name: { type: 'string', description: 'Template name' },
                structure: {
                    type: 'string',
                    enum: ['single-column', 'two-column', 'three-column', 'grid', 'magazine', 'catalog'],
                    description: 'Layout structure type',
                    default: 'single-column'
                },
                elements: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Array of element types to include',
                    default: ['title', 'content', 'image']
                },
                spacing: {
                    type: 'string',
                    enum: ['tight', 'comfortable', 'loose'],
                    description: 'Spacing between elements',
                    default: 'comfortable'
                },
                applyToPage: { type: 'number', description: 'Page number to apply template to (optional)' }
            },
            required: ['name'],
        },
    },
    {
        name: 'apply_design_system',
        description: 'Apply a complete design system to the current document',
        inputSchema: {
            type: 'object',
            properties: {
                theme: {
                    type: 'string',
                    enum: ['modern-minimal', 'classic', 'bold', 'elegant', 'playful', 'corporate'],
                    description: 'Design theme to apply',
                    default: 'modern-minimal'
                },
                spacing: {
                    type: 'string',
                    enum: ['tight', 'comfortable', 'loose'],
                    description: 'Overall spacing system',
                    default: 'comfortable'
                },
                hierarchy: {
                    type: 'string',
                    enum: ['clear', 'subtle', 'dramatic'],
                    description: 'Visual hierarchy style',
                    default: 'clear'
                },
                scope: {
                    type: 'string',
                    enum: ['entire-document', 'current-page', 'selected-elements'],
                    description: 'Scope of application',
                    default: 'entire-document'
                }
            },
            required: ['theme'],
        },
    },

    // =================== CONTENT MANAGEMENT ===================
    {
        name: 'update_content_batch',
        description: 'Update multiple content elements across the document in a single operation',
        inputSchema: {
            type: 'object',
            properties: {
                updates: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            find: { type: 'string', description: 'Text to find' },
                            replace: { type: 'string', description: 'Text to replace with' },
                            caseSensitive: { type: 'boolean', default: false },
                            wholeWord: { type: 'boolean', default: false }
                        },
                        required: ['find', 'replace']
                    },
                    description: 'Array of find/replace operations'
                },
                scope: {
                    type: 'string',
                    enum: ['entire-document', 'current-page', 'selected'],
                    description: 'Scope of the update operation',
                    default: 'entire-document'
                },
                preview: { type: 'boolean', description: 'Show preview before applying', default: false }
            },
            required: ['updates'],
        },
    },
    {
        name: 'create_data_table',
        description: 'Create a formatted table with data and appropriate styling',
        inputSchema: {
            type: 'object',
            properties: {
                data: {
                    type: 'array',
                    items: { type: 'array' },
                    description: '2D array of table data'
                },
                styling: {
                    type: 'string',
                    enum: ['professional', 'casual', 'minimal', 'bold', 'elegant'],
                    description: 'Table styling theme',
                    default: 'professional'
                },
                features: {
                    type: 'array',
                    items: { type: 'string' },
                    enum: ['sortable', 'filterable', 'alternating-rows', 'borders', 'header-row'],
                    description: 'Table features to enable',
                    default: ['header-row', 'borders']
                },
                position: {
                    type: 'string',
                    enum: ['top', 'center', 'bottom', 'custom'],
                    description: 'Table position',
                    default: 'center'
                },
                size: {
                    type: 'string',
                    enum: ['full-width', 'medium', 'compact'],
                    description: 'Table size',
                    default: 'medium'
                }
            },
            required: ['data'],
        },
    },

    // =================== EXPORT & PUBLISHING ===================
    {
        name: 'publish_document',
        description: 'Export the document in the appropriate format with optimal settings',
        inputSchema: {
            type: 'object',
            properties: {
                format: {
                    type: 'string',
                    enum: ['print-ready-pdf', 'web-pdf', 'epub', 'print', 'interactive-pdf'],
                    description: 'Export format',
                    default: 'print-ready-pdf'
                },
                quality: {
                    type: 'string',
                    enum: ['draft', 'standard', 'high', 'press'],
                    description: 'Export quality',
                    default: 'high'
                },
                options: {
                    type: 'object',
                    description: 'Format-specific options',
                    properties: {
                        includeBookmarks: { type: 'boolean', default: true },
                        cropMarks: { type: 'boolean', default: false },
                        bleed: { type: 'number', description: 'Bleed in mm', default: 3 },
                        compression: { type: 'string', enum: ['none', 'low', 'medium', 'high'], default: 'medium' }
                    }
                },
                outputPath: { type: 'string', description: 'Custom output path (optional)' }
            },
            required: ['format'],
        },
    },

    // =================== SMART HELP & GUIDANCE ===================
    {
        name: 'get_workflow_help',
        description: 'Get contextual help for workflows and tasks',
        inputSchema: {
            type: 'object',
            properties: {
                task: { type: 'string', description: 'Task or workflow you need help with' },
                experience: {
                    type: 'string',
                    enum: ['beginner', 'intermediate', 'expert'],
                    description: 'Your experience level',
                    default: 'intermediate'
                },
                format: {
                    type: 'string',
                    enum: ['step-by-step', 'overview', 'examples', 'troubleshooting'],
                    description: 'Help format',
                    default: 'step-by-step'
                },
                context: { type: 'string', description: 'Additional context about your specific situation' }
            },
            required: ['task'],
        },
    },
    {
        name: 'apply_template',
        description: 'Apply a pre-built template for common document types',
        inputSchema: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    enum: ['product-catalog', 'newsletter', 'brochure', 'annual-report', 'manual', 'portfolio'],
                    description: 'Template name'
                },
                customization: {
                    type: 'object',
                    description: 'Template customization options',
                    properties: {
                        brandColors: { type: 'array', items: { type: 'string' } },
                        logo: { type: 'string', description: 'Path to logo file' },
                        content: { type: 'object', description: 'Content to populate template' },
                        styling: { type: 'string', enum: ['modern', 'classic', 'bold', 'minimal'] }
                    }
                },
                pages: { type: 'number', description: 'Number of pages to generate', default: 8 }
            },
            required: ['name'],
        },
    }
]; 