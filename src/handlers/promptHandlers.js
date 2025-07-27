/**
 * MCP Prompt Handlers for InDesign
 * 
 * Provides structured templates for common InDesign workflows
 * Based on MCP Prompts specification
 */

import { formatResponse, formatErrorResponse } from '../utils/stringUtils.js';
import { logger } from '../utils/logger.js';

export class PromptHandlers {
    /**
     * List available prompts
     */
    static async listPrompts() {
        try {
            const prompts = [
                {
                    name: 'Create Newsletter',
                    title: 'Create Newsletter',
                    description: 'Create a professional newsletter with multiple sections and styling',
                    arguments: [
                        {
                            name: 'title',
                            description: 'Newsletter title',
                            type: 'string',
                            required: true
                        },
                        {
                            name: 'issue',
                            description: 'Issue number or date',
                            type: 'string',
                            required: true
                        },
                        {
                            name: 'sections',
                            description: 'Array of section names',
                            type: 'array',
                            items: { type: 'string' },
                            required: true
                        },
                        {
                            name: 'brandColors',
                            description: 'Array of brand colors (hex codes)',
                            type: 'array',
                            items: { type: 'string' },
                            required: false
                        }
                    ]
                },
                {
                    name: 'Design Brochure',
                    title: 'Design Brochure',
                    description: 'Create a professional brochure with multiple panels',
                    arguments: [
                        {
                            name: 'title',
                            description: 'Brochure title',
                            type: 'string',
                            required: true
                        },
                        {
                            name: 'panels',
                            description: 'Number of panels (3, 4, or 6)',
                            type: 'number',
                            required: true
                        },
                        {
                            name: 'content',
                            description: 'Array of content sections',
                            type: 'array',
                            items: { type: 'string' },
                            required: true
                        },
                        {
                            name: 'images',
                            description: 'Array of image file paths',
                            type: 'array',
                            items: { type: 'string' },
                            required: false
                        }
                    ]
                },
                {
                    name: 'Generate Report',
                    title: 'Generate Report',
                    description: 'Create a professional report with data tables and charts',
                    arguments: [
                        {
                            name: 'title',
                            description: 'Report title',
                            type: 'string',
                            required: true
                        },
                        {
                            name: 'data',
                            description: 'Report data object',
                            type: 'object',
                            required: true
                        },
                        {
                            name: 'sections',
                            description: 'Array of report sections',
                            type: 'array',
                            items: { type: 'string' },
                            required: true
                        },
                        {
                            name: 'includeCharts',
                            description: 'Whether to include charts',
                            type: 'boolean',
                            required: false
                        }
                    ]
                },
                {
                    name: 'Create Product Catalog',
                    title: 'Create Product Catalog',
                    description: 'Create a product catalog with images and descriptions',
                    arguments: [
                        {
                            name: 'title',
                            description: 'Catalog title',
                            type: 'string',
                            required: true
                        },
                        {
                            name: 'products',
                            description: 'Array of product objects',
                            type: 'array',
                            items: { type: 'object' },
                            required: true
                        },
                        {
                            name: 'layout',
                            description: 'Layout style (grid, list, featured)',
                            type: 'string',
                            required: false
                        }
                    ]
                },
                {
                    name: 'Design Flyer',
                    title: 'Design Flyer',
                    description: 'Create a promotional flyer with event information',
                    arguments: [
                        {
                            name: 'title',
                            description: 'Flyer title',
                            type: 'string',
                            required: true
                        },
                        {
                            name: 'date',
                            description: 'Event date',
                            type: 'string',
                            required: true
                        },
                        {
                            name: 'location',
                            description: 'Event location',
                            type: 'string',
                            required: true
                        },
                        {
                            name: 'description',
                            description: 'Event description',
                            type: 'string',
                            required: true
                        },
                        {
                            name: 'callToAction',
                            description: 'Call to action text',
                            type: 'string',
                            required: false
                        }
                    ]
                },
                {
                    name: 'Create Business Card',
                    title: 'Create Business Card',
                    description: 'Create a professional business card',
                    arguments: [
                        {
                            name: 'name',
                            description: 'Full name',
                            type: 'string',
                            required: true
                        },
                        {
                            name: 'title',
                            description: 'Job title',
                            type: 'string',
                            required: true
                        },
                        {
                            name: 'company',
                            description: 'Company name',
                            type: 'string',
                            required: true
                        },
                        {
                            name: 'phone',
                            description: 'Phone number',
                            type: 'string',
                            required: false
                        },
                        {
                            name: 'email',
                            description: 'Email address',
                            type: 'string',
                            required: false
                        },
                        {
                            name: 'website',
                            description: 'Website URL',
                            type: 'string',
                            required: false
                        }
                    ]
                },
                {
                    name: 'Design Poster',
                    title: 'Design Poster',
                    description: 'Create a promotional poster',
                    arguments: [
                        {
                            name: 'title',
                            description: 'Poster title',
                            type: 'string',
                            required: true
                        },
                        {
                            name: 'subtitle',
                            description: 'Poster subtitle',
                            type: 'string',
                            required: false
                        },
                        {
                            name: 'date',
                            description: 'Event date',
                            type: 'string',
                            required: true
                        },
                        {
                            name: 'location',
                            description: 'Event location',
                            type: 'string',
                            required: true
                        },
                        {
                            name: 'description',
                            description: 'Event description',
                            type: 'string',
                            required: true
                        },
                        {
                            name: 'imagePath',
                            description: 'Path to background image',
                            type: 'string',
                            required: false
                        }
                    ]
                },
                {
                    name: 'Create Booklet',
                    title: 'Create Booklet',
                    description: 'Create a multi-page booklet',
                    arguments: [
                        {
                            name: 'title',
                            description: 'Booklet title',
                            type: 'string',
                            required: true
                        },
                        {
                            name: 'pages',
                            description: 'Number of pages',
                            type: 'number',
                            required: true
                        },
                        {
                            name: 'content',
                            description: 'Array of page content',
                            type: 'array',
                            items: { type: 'string' },
                            required: true
                        },
                        {
                            name: 'layout',
                            description: 'Layout style (single, double, magazine)',
                            type: 'string',
                            required: false
                        }
                    ]
                }
            ];

            logger.info('Listed prompts', { count: prompts.length });
            return formatResponse({ prompts }, "List Prompts");
        } catch (error) {
            logger.error('Error listing prompts', { error: error.message });
            return formatErrorResponse(error.message, "List Prompts");
        }
    }

    /**
     * Get specific prompt details
     */
    static async getPrompt(name) {
        try {
            logger.debug('Getting prompt', { name });

            // Get all prompts and find the one with matching name
            const listResult = await this.listPrompts();

            if (!listResult.success) {
                throw new Error('Failed to list prompts');
            }

            const prompts = listResult.result.prompts;
            const prompt = prompts.find(p => p.name === name);

            if (!prompt) {
                throw new Error(`Prompt not found: ${name}`);
            }

            logger.info('Retrieved prompt', { name });
            return formatResponse({ prompt }, "Get Prompt");
        } catch (error) {
            logger.error('Error getting prompt', { name, error: error.message });
            return formatErrorResponse(error.message, "Get Prompt");
        }
    }

    /**
     * Execute a prompt with arguments
     */
    static async executePrompt(name, args) {
        try {
            logger.debug('Executing prompt', { name, args });

            // Get the prompt template
            const promptResult = await this.getPrompt(name);

            if (!promptResult.success) {
                throw new Error(`Failed to get prompt: ${name}`);
            }

            const prompt = promptResult.result.prompt;

            // Validate arguments
            const validationResult = this.validatePromptArguments(prompt, args);
            if (!validationResult.valid) {
                throw new Error(`Invalid arguments: ${validationResult.errors.join(', ')}`);
            }

            // Execute the prompt based on its name
            let result;
            switch (name) {
                case 'Create Newsletter':
                    result = await this.executeNewsletterPrompt(args);
                    break;
                case 'Design Brochure':
                    result = await this.executeBrochurePrompt(args);
                    break;
                case 'Generate Report':
                    result = await this.executeReportPrompt(args);
                    break;
                case 'Create Product Catalog':
                    result = await this.executeCatalogPrompt(args);
                    break;
                case 'Design Flyer':
                    result = await this.executeFlyerPrompt(args);
                    break;
                case 'Create Business Card':
                    result = await this.executeBusinessCardPrompt(args);
                    break;
                case 'Design Poster':
                    result = await this.executePosterPrompt(args);
                    break;
                case 'Create Booklet':
                    result = await this.executeBookletPrompt(args);
                    break;
                default:
                    throw new Error(`Unknown prompt: ${name}`);
            }

            logger.info('Executed prompt successfully', { name });
            return formatResponse({ result }, "Execute Prompt");
        } catch (error) {
            logger.error('Error executing prompt', { name, error: error.message });
            return formatErrorResponse(error.message, "Execute Prompt");
        }
    }

    /**
     * Validate prompt arguments
     */
    static validatePromptArguments(prompt, args) {
        const errors = [];

        // Check required arguments
        for (const arg of prompt.arguments) {
            if (arg.required && !(arg.name in args)) {
                errors.push(`Missing required argument: ${arg.name}`);
            }
        }

        // Check argument types
        for (const arg of prompt.arguments) {
            if (arg.name in args) {
                const value = args[arg.name];
                const expectedType = arg.type;

                switch (expectedType) {
                    case 'string':
                        if (typeof value !== 'string') {
                            errors.push(`Argument ${arg.name} must be a string`);
                        }
                        break;
                    case 'number':
                        if (typeof value !== 'number') {
                            errors.push(`Argument ${arg.name} must be a number`);
                        }
                        break;
                    case 'boolean':
                        if (typeof value !== 'boolean') {
                            errors.push(`Argument ${arg.name} must be a boolean`);
                        }
                        break;
                    case 'array':
                        if (!Array.isArray(value)) {
                            errors.push(`Argument ${arg.name} must be an array`);
                        }
                        break;
                    case 'object':
                        if (typeof value !== 'object' || value === null || Array.isArray(value)) {
                            errors.push(`Argument ${arg.name} must be an object`);
                        }
                        break;
                }
            }
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Substitute arguments in prompt content
     */
    static substituteArguments(content, args) {
        let result = content;

        // Replace {{argument}} placeholders with actual values
        for (const [key, value] of Object.entries(args)) {
            const placeholder = `{{${key}}}`;
            const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
            result = result.replace(new RegExp(placeholder, 'g'), stringValue);
        }

        return result;
    }

    // Individual prompt execution methods
    static async executeNewsletterPrompt(args) {
        // Implementation for newsletter creation
        return { message: 'Newsletter prompt executed', args };
    }

    static async executeBrochurePrompt(args) {
        // Implementation for brochure creation
        return { message: 'Brochure prompt executed', args };
    }

    static async executeReportPrompt(args) {
        // Implementation for report generation
        return { message: 'Report prompt executed', args };
    }

    static async executeCatalogPrompt(args) {
        // Implementation for catalog creation
        return { message: 'Catalog prompt executed', args };
    }

    static async executeFlyerPrompt(args) {
        // Implementation for flyer creation
        return { message: 'Flyer prompt executed', args };
    }

    static async executeBusinessCardPrompt(args) {
        // Implementation for business card creation
        return { message: 'Business card prompt executed', args };
    }

    static async executePosterPrompt(args) {
        // Implementation for poster creation
        return { message: 'Poster prompt executed', args };
    }

    static async executeBookletPrompt(args) {
        // Implementation for booklet creation
        return { message: 'Booklet prompt executed', args };
    }
} 