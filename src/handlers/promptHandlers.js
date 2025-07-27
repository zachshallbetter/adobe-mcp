/**
 * MCP Prompt Handlers for InDesign
 * 
 * Provides structured templates for common InDesign workflows
 * Based on MCP Prompts specification
 */

import { logger } from '../utils/logger.js';

export class PromptHandlers {
    /**
     * List available prompts
     */
    static async listPrompts() {
        const prompts = [
            {
                name: "create-newsletter",
                title: "Create Newsletter",
                description: "Create a professional newsletter with header, content sections, and footer",
                arguments: [
                    { name: "title", type: "string", required: true, description: "Newsletter title" },
                    { name: "issue", type: "string", required: true, description: "Issue number or date" },
                    { name: "sections", type: "array", items: { type: "string" }, required: false, description: "Content sections" },
                    { name: "brandColors", type: "array", items: { type: "string" }, required: false, description: "Brand color hex codes" }
                ]
            },
            {
                name: "design-brochure",
                title: "Design Brochure",
                description: "Create a marketing brochure with product information and images",
                arguments: [
                    { name: "productName", type: "string", required: true, description: "Product name" },
                    { name: "description", type: "string", required: true, description: "Product description" },
                    { name: "features", type: "array", items: { type: "string" }, required: false, description: "Product features" },
                    { name: "imagePath", type: "string", required: false, description: "Path to product image" },
                    { name: "contactInfo", type: "string", required: false, description: "Contact information" }
                ]
            },
            {
                name: "create-catalog",
                title: "Create Product Catalog",
                description: "Create a product catalog with multiple items and specifications",
                arguments: [
                    { name: "catalogTitle", type: "string", required: true, description: "Catalog title" },
                    { name: "products", type: "array", items: { type: "object" }, required: true, description: "Array of product objects" },
                    { name: "layout", type: "string", required: false, description: "Layout style (grid/list)" },
                    { name: "includePricing", type: "boolean", required: false, description: "Include pricing information" }
                ]
            },
            {
                name: "setup-brand-guidelines",
                title: "Setup Brand Guidelines",
                description: "Create a brand guidelines document with colors, typography, and usage examples",
                arguments: [
                    { name: "brandName", type: "string", required: true, description: "Brand name" },
                    { name: "primaryColors", type: "array", items: { type: "string" }, required: true, description: "Primary brand colors (hex)" },
                    { name: "secondaryColors", type: "array", items: { type: "string" }, required: false, description: "Secondary brand colors (hex)" },
                    { name: "fonts", type: "array", items: { type: "string" }, required: false, description: "Brand fonts" },
                    { name: "logoPath", type: "string", required: false, description: "Path to logo file" }
                ]
            },
            {
                name: "create-presentation",
                title: "Create Presentation",
                description: "Create a presentation document with multiple slides and content",
                arguments: [
                    { name: "title", type: "string", required: true, description: "Presentation title" },
                    { name: "slides", type: "array", items: { type: "object" }, required: true, description: "Array of slide objects" },
                    { name: "theme", type: "string", required: false, description: "Presentation theme" },
                    { name: "includeNotes", type: "boolean", required: false, description: "Include speaker notes" }
                ]
            },
            {
                name: "design-business-card",
                title: "Design Business Card",
                description: "Create a professional business card with contact information",
                arguments: [
                    { name: "name", type: "string", required: true, description: "Full name" },
                    { name: "title", type: "string", required: true, description: "Job title" },
                    { name: "company", type: "string", required: true, description: "Company name" },
                    { name: "phone", type: "string", required: false, description: "Phone number" },
                    { name: "email", type: "string", required: false, description: "Email address" },
                    { name: "website", type: "string", required: false, description: "Website URL" },
                    { name: "logoPath", type: "string", required: false, description: "Path to company logo" }
                ]
            },
            {
                name: "create-flyer",
                title: "Create Flyer",
                description: "Create a promotional flyer with event or product information",
                arguments: [
                    { name: "headline", type: "string", required: true, description: "Main headline" },
                    { name: "subheadline", type: "string", required: false, description: "Subheadline" },
                    { name: "description", type: "string", required: true, description: "Event/product description" },
                    { name: "date", type: "string", required: false, description: "Event date" },
                    { name: "location", type: "string", required: false, description: "Event location" },
                    { name: "imagePath", type: "string", required: false, description: "Path to image" },
                    { name: "callToAction", type: "string", required: false, description: "Call to action text" }
                ]
            },
            {
                name: "design-letterhead",
                title: "Design Letterhead",
                description: "Create a professional letterhead with company branding",
                arguments: [
                    { name: "companyName", type: "string", required: true, description: "Company name" },
                    { name: "address", type: "string", required: false, description: "Company address" },
                    { name: "phone", type: "string", required: false, description: "Phone number" },
                    { name: "email", type: "string", required: false, description: "Email address" },
                    { name: "website", type: "string", required: false, description: "Website URL" },
                    { name: "logoPath", type: "string", required: false, description: "Path to company logo" },
                    { name: "brandColors", type: "array", items: { type: "string" }, required: false, description: "Brand colors (hex)" }
                ]
            },
            {
                name: "create-data-report",
                title: "Create Data Report",
                description: "Create a data report with charts, tables, and analysis",
                arguments: [
                    { name: "reportTitle", type: "string", required: true, description: "Report title" },
                    { name: "data", type: "array", items: { type: "object" }, required: true, description: "Data array" },
                    { name: "chartType", type: "string", required: false, description: "Chart type (bar/pie/line)" },
                    { name: "includeSummary", type: "boolean", required: false, description: "Include executive summary" },
                    { name: "dateRange", type: "string", required: false, description: "Data date range" }
                ]
            },
            {
                name: "design-menu",
                title: "Design Menu",
                description: "Create a restaurant menu with categories and pricing",
                arguments: [
                    { name: "restaurantName", type: "string", required: true, description: "Restaurant name" },
                    { name: "categories", type: "array", items: { type: "object" }, required: true, description: "Menu categories with items" },
                    { name: "logoPath", type: "string", required: false, description: "Path to restaurant logo" },
                    { name: "theme", type: "string", required: false, description: "Menu theme/style" },
                    { name: "includePrices", type: "boolean", required: false, description: "Include pricing" }
                ]
            }
        ];

        logger.info('Listed prompts', { count: prompts.length });
        return prompts;
    }

    /**
     * Get specific prompt details
     */
    static async getPrompt(name) {
        const prompts = await this.listPrompts();
        const prompt = prompts.find(p => p.name === name);

        if (!prompt) {
            throw new Error(`Prompt not found: ${name}`);
        }

        // Add detailed content for each prompt
        const promptContent = await this.getPromptContent(name);

        return {
            ...prompt,
            content: promptContent
        };
    }

    /**
     * Get detailed content for a specific prompt
     */
    static async getPromptContent(name) {
        const contentMap = {
            "create-newsletter": {
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: "I want to create a professional newsletter with the following specifications:\n\n**Title:** {{title}}\n**Issue:** {{issue}}\n**Sections:** {{sections}}\n**Brand Colors:** {{brandColors}}\n\nPlease create a complete newsletter document with:\n1. Professional header with title and issue\n2. Table of contents\n3. Content sections with proper typography\n4. Footer with contact information\n5. Consistent branding throughout\n\nUse the InDesign MCP Server tools to create this newsletter step by step."
                            }
                        ]
                    }
                ],
                examples: [
                    {
                        title: "Company Newsletter",
                        arguments: {
                            title: "TechCorp Monthly",
                            issue: "January 2025",
                            sections: ["Company News", "Product Updates", "Team Spotlight", "Industry Insights"],
                            brandColors: ["#2E86AB", "#A23B72", "#F18F01"]
                        }
                    }
                ]
            },
            "design-brochure": {
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: "I need to create a marketing brochure for the following product:\n\n**Product Name:** {{productName}}\n**Description:** {{description}}\n**Features:** {{features}}\n**Image Path:** {{imagePath}}\n**Contact Info:** {{contactInfo}}\n\nPlease design a professional brochure that includes:\n1. Eye-catching cover with product name and image\n2. Product description and benefits\n3. Feature list with icons or graphics\n4. Call-to-action section\n5. Contact information\n\nUse the InDesign MCP Server to create this brochure with proper layout and styling."
                            }
                        ]
                    }
                ],
                examples: [
                    {
                        title: "Software Product Brochure",
                        arguments: {
                            productName: "DesignPro Suite",
                            description: "Professional design software for creative professionals",
                            features: ["Advanced vector tools", "Real-time collaboration", "Cloud integration", "24/7 support"],
                            imagePath: "/path/to/product-image.jpg",
                            contactInfo: "sales@designpro.com | (555) 123-4567"
                        }
                    }
                ]
            },
            "create-catalog": {
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: "I need to create a product catalog with the following specifications:\n\n**Catalog Title:** {{catalogTitle}}\n**Products:** {{products}}\n**Layout:** {{layout}}\n**Include Pricing:** {{includePricing}}\n\nPlease create a comprehensive catalog that includes:\n1. Professional cover page\n2. Table of contents\n3. Product listings with images and descriptions\n4. Pricing information (if requested)\n5. Index or search functionality\n6. Contact and ordering information\n\nUse the InDesign MCP Server to create this catalog with consistent formatting and professional layout."
                            }
                        ]
                    }
                ],
                examples: [
                    {
                        title: "Electronics Catalog",
                        arguments: {
                            catalogTitle: "2025 Electronics Catalog",
                            products: [
                                { name: "Smartphone X1", price: "$599", description: "Latest smartphone with advanced features" },
                                { name: "Laptop Pro", price: "$1299", description: "Professional laptop for work and gaming" }
                            ],
                            layout: "grid",
                            includePricing: true
                        }
                    }
                ]
            },
            "setup-brand-guidelines": {
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: "I need to create brand guidelines for the following brand:\n\n**Brand Name:** {{brandName}}\n**Primary Colors:** {{primaryColors}}\n**Secondary Colors:** {{secondaryColors}}\n**Fonts:** {{fonts}}\n**Logo Path:** {{logoPath}}\n\nPlease create comprehensive brand guidelines that include:\n1. Brand overview and mission\n2. Logo usage guidelines\n3. Color palette with hex codes and usage rules\n4. Typography guidelines\n5. Layout and spacing standards\n6. Examples of correct and incorrect usage\n\nUse the InDesign MCP Server to create this document with proper examples and clear guidelines."
                            }
                        ]
                    }
                ],
                examples: [
                    {
                        title: "Startup Brand Guidelines",
                        arguments: {
                            brandName: "InnovateCorp",
                            primaryColors: ["#1E3A8A", "#3B82F6"],
                            secondaryColors: ["#F59E0B", "#10B981"],
                            fonts: ["Inter", "Roboto"],
                            logoPath: "/path/to/logo.svg"
                        }
                    }
                ]
            },
            "create-presentation": {
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: "I need to create a presentation with the following specifications:\n\n**Title:** {{title}}\n**Slides:** {{slides}}\n**Theme:** {{theme}}\n**Include Notes:** {{includeNotes}}\n\nPlease create a professional presentation that includes:\n1. Title slide with presentation name\n2. Agenda or overview slide\n3. Content slides based on the provided data\n4. Consistent design theme throughout\n5. Speaker notes (if requested)\n6. Professional transitions and layout\n\nUse the InDesign MCP Server to create this presentation with proper slide layouts and professional formatting."
                            }
                        ]
                    }
                ],
                examples: [
                    {
                        title: "Business Strategy Presentation",
                        arguments: {
                            title: "Q1 2025 Strategy Review",
                            slides: [
                                { title: "Executive Summary", content: "Key highlights and achievements" },
                                { title: "Financial Performance", content: "Revenue, growth, and projections" },
                                { title: "Market Analysis", content: "Competitive landscape and opportunities" }
                            ],
                            theme: "corporate",
                            includeNotes: true
                        }
                    }
                ]
            },
            "design-business-card": {
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: "I need to design a business card with the following information:\n\n**Name:** {{name}}\n**Title:** {{title}}\n**Company:** {{company}}\n**Phone:** {{phone}}\n**Email:** {{email}}\n**Website:** {{website}}\n**Logo Path:** {{logoPath}}\n\nPlease create a professional business card that includes:\n1. Company logo prominently displayed\n2. Name and title clearly visible\n3. Contact information (phone, email, website)\n4. Professional typography and layout\n5. Standard business card dimensions\n6. Clean, modern design\n\nUse the InDesign MCP Server to create this business card with proper sizing and professional appearance."
                            }
                        ]
                    }
                ],
                examples: [
                    {
                        title: "Executive Business Card",
                        arguments: {
                            name: "Sarah Johnson",
                            title: "Chief Executive Officer",
                            company: "TechCorp Industries",
                            phone: "(555) 123-4567",
                            email: "sarah.johnson@techcorp.com",
                            website: "www.techcorp.com",
                            logoPath: "/path/to/company-logo.png"
                        }
                    }
                ]
            },
            "create-flyer": {
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: "I need to create a promotional flyer with the following information:\n\n**Headline:** {{headline}}\n**Subheadline:** {{subheadline}}\n**Description:** {{description}}\n**Date:** {{date}}\n**Location:** {{location}}\n**Image Path:** {{imagePath}}\n**Call to Action:** {{callToAction}}\n\nPlease create an eye-catching flyer that includes:\n1. Bold, attention-grabbing headline\n2. Compelling subheadline\n3. Clear event/product description\n4. Date and location information\n5. High-quality image\n6. Strong call-to-action\n7. Contact information\n\nUse the InDesign MCP Server to create this flyer with professional design and effective layout."
                            }
                        ]
                    }
                ],
                examples: [
                    {
                        title: "Event Flyer",
                        arguments: {
                            headline: "Tech Conference 2025",
                            subheadline: "The Future of Innovation",
                            description: "Join industry leaders for three days of cutting-edge technology discussions and networking opportunities.",
                            date: "March 15-17, 2025",
                            location: "Convention Center, Downtown",
                            imagePath: "/path/to/conference-image.jpg",
                            callToAction: "Register Now at techconf2025.com"
                        }
                    }
                ]
            },
            "design-letterhead": {
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: "I need to design a letterhead with the following company information:\n\n**Company Name:** {{companyName}}\n**Address:** {{address}}\n**Phone:** {{phone}}\n**Email:** {{email}}\n**Website:** {{website}}\n**Logo Path:** {{logoPath}}\n**Brand Colors:** {{brandColors}}\n\nPlease create a professional letterhead that includes:\n1. Company logo in the header\n2. Company name and tagline\n3. Contact information (address, phone, email, website)\n4. Professional typography\n5. Brand colors integration\n6. Clean, modern design\n7. Proper margins for letter content\n\nUse the InDesign MCP Server to create this letterhead with professional appearance and proper branding."
                            }
                        ]
                    }
                ],
                examples: [
                    {
                        title: "Corporate Letterhead",
                        arguments: {
                            companyName: "Global Solutions Inc.",
                            address: "123 Business Ave, Suite 100, New York, NY 10001",
                            phone: "(555) 987-6543",
                            email: "info@globalsolutions.com",
                            website: "www.globalsolutions.com",
                            logoPath: "/path/to/company-logo.png",
                            brandColors: ["#2C3E50", "#3498DB"]
                        }
                    }
                ]
            },
            "create-data-report": {
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: "I need to create a data report with the following specifications:\n\n**Report Title:** {{reportTitle}}\n**Data:** {{data}}\n**Chart Type:** {{chartType}}\n**Include Summary:** {{includeSummary}}\n**Date Range:** {{dateRange}}\n\nPlease create a comprehensive data report that includes:\n1. Executive summary (if requested)\n2. Data visualization with charts\n3. Detailed data tables\n4. Key insights and analysis\n5. Professional formatting and layout\n6. Clear data presentation\n7. Conclusions and recommendations\n\nUse the InDesign MCP Server to create this report with proper data visualization and professional presentation."
                            }
                        ]
                    }
                ],
                examples: [
                    {
                        title: "Sales Performance Report",
                        arguments: {
                            reportTitle: "Q4 2024 Sales Performance Report",
                            data: [
                                { month: "October", sales: 125000, growth: 12 },
                                { month: "November", sales: 138000, growth: 15 },
                                { month: "December", sales: 152000, growth: 18 }
                            ],
                            chartType: "bar",
                            includeSummary: true,
                            dateRange: "Q4 2024"
                        }
                    }
                ]
            },
            "design-menu": {
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: "I need to design a restaurant menu with the following information:\n\n**Restaurant Name:** {{restaurantName}}\n**Categories:** {{categories}}\n**Logo Path:** {{logoPath}}\n**Theme:** {{theme}}\n**Include Prices:** {{includePrices}}\n\nPlease create a professional menu that includes:\n1. Restaurant logo and branding\n2. Menu categories clearly organized\n3. Dish descriptions and pricing\n4. Professional typography and layout\n5. Appealing design theme\n6. Contact information\n7. Professional presentation\n\nUse the InDesign MCP Server to create this menu with proper organization and professional appearance."
                            }
                        ]
                    }
                ],
                examples: [
                    {
                        title: "Fine Dining Menu",
                        arguments: {
                            restaurantName: "Bistro Elegante",
                            categories: [
                                {
                                    name: "Appetizers",
                                    items: [
                                        { name: "Bruschetta", price: "$12", description: "Fresh tomatoes, basil, and mozzarella" },
                                        { name: "Calamari", price: "$16", description: "Crispy fried squid with marinara" }
                                    ]
                                },
                                {
                                    name: "Main Courses",
                                    items: [
                                        { name: "Grilled Salmon", price: "$32", description: "Atlantic salmon with seasonal vegetables" },
                                        { name: "Beef Tenderloin", price: "$38", description: "8oz tenderloin with garlic mashed potatoes" }
                                    ]
                                }
                            ],
                            logoPath: "/path/to/restaurant-logo.png",
                            theme: "elegant",
                            includePrices: true
                        }
                    }
                ]
            }
        };

        return contentMap[name] || {
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: "Please help me with the {{name}} workflow using the InDesign MCP Server tools."
                        }
                    ]
                }
            ],
            examples: []
        };
    }

    /**
     * Execute a prompt with arguments
     */
    static async executePrompt(name, arguments) {
        try {
            logger.info('Executing prompt', { name, arguments });

            const prompt = await this.getPrompt(name);

            // Validate arguments
            this.validatePromptArguments(prompt, arguments);

            // Generate the prompt content with substituted arguments
            const content = this.substituteArguments(prompt.content, arguments);

            return {
                success: true,
                prompt: name,
                content: content,
                arguments: arguments,
                message: `Prompt '${name}' executed successfully with provided arguments`
            };
        } catch (error) {
            logger.error('Error executing prompt', { name, error: error.message });
            return {
                success: false,
                prompt: name,
                error: error.message,
                message: `Failed to execute prompt '${name}': ${error.message}`
            };
        }
    }

    /**
     * Validate prompt arguments against the prompt definition
     */
    static validatePromptArguments(prompt, arguments) {
        const errors = [];

        for (const arg of prompt.arguments) {
            if (arg.required && arguments[arg.name] === undefined) {
                errors.push(`Missing required argument: ${arg.name}`);
            }
        }

        if (errors.length > 0) {
            throw new Error(`Invalid arguments: ${errors.join(', ')}`);
        }
    }

    /**
     * Substitute arguments in prompt content
     */
    static substituteArguments(content, arguments) {
        const substituteInText = (text) => {
            let result = text;
            for (const [key, value] of Object.entries(arguments)) {
                const placeholder = `{{${key}}}`;
                if (typeof value === 'object') {
                    result = result.replace(placeholder, JSON.stringify(value, null, 2));
                } else {
                    result = result.replace(placeholder, String(value));
                }
            }
            return result;
        };

        const substituteInContent = (content) => {
            if (Array.isArray(content)) {
                return content.map(item => substituteInContent(item));
            } else if (typeof content === 'object') {
                const result = {};
                for (const [key, value] of Object.entries(content)) {
                    if (key === 'text') {
                        result[key] = substituteInText(value);
                    } else {
                        result[key] = substituteInContent(value);
                    }
                }
                return result;
            } else {
                return content;
            }
        };

        return substituteInContent(content);
    }
} 