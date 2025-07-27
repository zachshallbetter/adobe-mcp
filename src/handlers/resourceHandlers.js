/**
 * MCP Resource Handlers for InDesign
 * 
 * Provides structured access to InDesign data as context for AI models
 * Based on MCP Resources specification
 */

import { ScriptExecutor } from '../core/scriptExecutor.js';
import { formatResponse, formatErrorResponse } from '../utils/stringUtils.js';
import { logger } from '../utils/logger.js';

export class ResourceHandlers {
    /**
     * List available direct resources
     */
    static async listResources() {
        try {
            const script = `var docCount = app.documents.length;
var result = "SUCCESS:";

if (docCount > 0) {
    result = result + "active-document|Active Document|indesign://document/active;";
    
    var doc = app.activeDocument;
    result = result + "document-" + doc.name + "|Document: " + doc.name + "|indesign://document/" + doc.name + ";";
    
    if (doc.colors.length > 0) {
        result = result + "color-swatches|Color Swatches|indesign://colors/swatches;";
    }
    
    if (doc.paragraphStyles.length > 0) {
        result = result + "paragraph-styles|Paragraph Styles|indesign://styles/paragraph;";
    }
    
    if (doc.characterStyles.length > 0) {
        result = result + "character-styles|Character Styles|indesign://styles/character;";
    }
    
    if (doc.pages.length > 0) {
        result = result + "all-pages|All Pages|indesign://pages/all;";
    }
}

result;`;

            const result = await ScriptExecutor.executeInDesignScript(script);

            // ScriptExecutor returns a string directly, not an object
            try {
                // Parse the simple string format
                const message = result;
                if (message.startsWith('SUCCESS:')) {
                    const resourcesData = message.substring(8);
                    const resources = [];

                    if (resourcesData) {
                        const resourceStrings = resourcesData.split(';').filter(s => s.trim());
                        for (const resourceString of resourceStrings) {
                            const parts = resourceString.split('|');
                            if (parts.length >= 3) {
                                resources.push({
                                    name: parts[0],
                                    title: parts[1],
                                    uri: parts[2],
                                    description: "InDesign resource",
                                    mimeType: "application/json"
                                });
                            }
                        }
                    }

                    logger.info('Listed resources', { count: resources.length });
                    return formatResponse({ resources }, "List Resources");
                } else {
                    const errorMessage = `Unexpected response format: ${message}`;
                    logger.error('Unexpected response format', { error: errorMessage });
                    return formatErrorResponse(errorMessage, "List Resources");
                }
            } catch (parseError) {
                const errorMessage = `Failed to parse resources: ${parseError.message}. Raw result: ${result}`;
                logger.error('Failed to parse resources', { error: errorMessage });
                return formatErrorResponse(errorMessage, "List Resources");
            }
        } catch (error) {
            const errorMessage = error.message || 'Unknown error occurred';
            logger.error('Error listing resources', { error: errorMessage });
            return formatErrorResponse(errorMessage, "List Resources");
        }
    }

    /**
     * List available resource templates
     */
    static async listResourceTemplates() {
        try {
            const script = `var templates = [];
templates.push({
    uri: "indesign://document/active",
    name: "active-document",
    title: "Active Document",
    description: "Currently active InDesign document",
    mimeType: "application/json"
});
templates.push({
    uri: "indesign://colors/swatches",
    name: "color-swatches",
    title: "Color Swatches",
    description: "All color swatches in the active document",
    mimeType: "application/json"
});
templates.push({
    uri: "indesign://styles/paragraph",
    name: "paragraph-styles",
    title: "Paragraph Styles",
    description: "All paragraph styles in the active document",
    mimeType: "application/json"
});
templates.push({
    uri: "indesign://styles/character",
    name: "character-styles",
    title: "Character Styles",
    description: "All character styles in the active document",
    mimeType: "application/json"
});
templates.push({
    uri: "indesign://pages/all",
    name: "all-pages",
    title: "All Pages",
    description: "All pages in the active document",
    mimeType: "application/json"
});

var result = "SUCCESS:";
for (var i = 0; i < templates.length; i++) {
    var template = templates[i];
    result = result + template.name + "|" + template.title + "|" + template.uri + "|" + template.description;
    if (i < templates.length - 1) result = result + ";";
}
result;`;

            const result = await ScriptExecutor.executeInDesignScript(script);

            try {
                const message = result;
                if (message.startsWith('SUCCESS:')) {
                    const templatesData = message.substring(8);
                    const templates = [];

                    if (templatesData) {
                        const templateStrings = templatesData.split(';').filter(s => s.trim());
                        for (const templateString of templateStrings) {
                            const parts = templateString.split('|');
                            if (parts.length >= 4) {
                                templates.push({
                                    name: parts[0],
                                    title: parts[1],
                                    uri: parts[2],
                                    description: parts[3],
                                    mimeType: "application/json"
                                });
                            }
                        }
                    }

                    logger.info('Listed resource templates', { count: templates.length });
                    return formatResponse({ templates }, "List Resource Templates");
                } else {
                    const errorMessage = `Unexpected response format: ${message}`;
                    logger.error('Unexpected response format', { error: errorMessage });
                    return formatErrorResponse(errorMessage, "List Resource Templates");
                }
            } catch (parseError) {
                const errorMessage = `Failed to parse resource templates: ${parseError.message}. Raw result: ${result}`;
                logger.error('Failed to parse resource templates', { error: errorMessage });
                return formatErrorResponse(errorMessage, "List Resource Templates");
            }
        } catch (error) {
            const errorMessage = error.message || 'Unknown error occurred';
            logger.error('Error listing resource templates', { error: errorMessage });
            return formatErrorResponse(errorMessage, "List Resource Templates");
        }
    }

    /**
     * Read a specific resource
     */
    static async readResource(uri) {
        try {
            const script = `try {
    var uri = "${uri}";
    var result = {};
    
    if (uri === "indesign://document/active") {
        if (app.documents.length > 0) {
            var doc = app.activeDocument;
            result = {
                name: doc.name,
                pageCount: doc.pages.length,
                colorSwatches: doc.colors.length,
                paragraphStyles: doc.paragraphStyles.length,
                characterStyles: doc.characterStyles.length,
                width: doc.documentPreferences.pageWidth,
                height: doc.documentPreferences.pageHeight
            };
        } else {
            result = { error: "No active document" };
        }
    } else if (uri === "indesign://colors/swatches") {
        if (app.documents.length > 0) {
            var doc = app.activeDocument;
            var colors = [];
            
            for (var i = 0; i < doc.colors.length; i++) {
                var color = doc.colors[i];
                var colorInfo = {
                    name: color.name,
                    model: color.model,
                    colorValue: color.colorValue
                };
                colors.push(colorInfo);
            }
            result = { colors: colors };
        } else {
            result = { error: "No active document" };
        }
    } else if (uri === "indesign://styles/paragraph") {
        if (app.documents.length > 0) {
            var doc = app.activeDocument;
            var styles = [];
            
            for (var i = 0; i < doc.paragraphStyles.length; i++) {
                var style = doc.paragraphStyles[i];
                var styleInfo = {
                    name: style.name,
                    appliedFont: style.appliedFont ? style.appliedFont.name : "None",
                    fontSize: style.fontStyle
                };
                styles.push(styleInfo);
            }
            result = { paragraphStyles: styles };
        } else {
            result = { error: "No active document" };
        }
    } else if (uri === "indesign://styles/character") {
        if (app.documents.length > 0) {
            var doc = app.activeDocument;
            var styles = [];
            
            for (var i = 0; i < doc.characterStyles.length; i++) {
                var style = doc.characterStyles[i];
                var styleInfo = {
                    name: style.name,
                    appliedFont: style.appliedFont ? style.appliedFont.name : "None",
                    fontSize: style.fontStyle
                };
                styles.push(styleInfo);
            }
            result = { characterStyles: styles };
        } else {
            result = { error: "No active document" };
        }
    } else if (uri === "indesign://pages/all") {
        if (app.documents.length > 0) {
            var doc = app.activeDocument;
            var pages = [];
            
            for (var i = 0; i < doc.pages.length; i++) {
                var page = doc.pages[i];
                var pageInfo = {
                    name: page.name,
                    index: page.documentOffset,
                    width: page.bounds[3] - page.bounds[1],
                    height: page.bounds[2] - page.bounds[0]
                };
                pages.push(pageInfo);
            }
            result = { pages: pages };
        } else {
            result = { error: "No active document" };
        }
    } else {
        result = { error: "Unknown resource URI: " + uri };
    }
    
    var resultStr = "SUCCESS:";
    for (var key in result) {
        if (result.hasOwnProperty(key)) {
            resultStr = resultStr + key + ":" + result[key] + ";";
        }
    }
    resultStr;
} catch (error) {
    "ERROR:" + error.message;
}`;

            const result = await ScriptExecutor.executeInDesignScript(script);

            try {
                const message = result;
                if (message.startsWith('SUCCESS:')) {
                    const data = message.substring(8);
                    const resourceData = {};

                    if (data) {
                        const pairs = data.split(';').filter(s => s.trim());
                        for (const pair of pairs) {
                            const colonIndex = pair.indexOf(':');
                            if (colonIndex > 0) {
                                const key = pair.substring(0, colonIndex);
                                const value = pair.substring(colonIndex + 1);
                                resourceData[key] = value;
                            }
                        }
                    }

                    logger.info('Read resource', { uri });
                    return formatResponse(resourceData, "Read Resource");
                } else if (message.startsWith('ERROR:')) {
                    const errorMessage = message.substring(6);
                    logger.error('Failed to read resource', { error: errorMessage, uri });
                    return formatErrorResponse(errorMessage, "Read Resource");
                } else {
                    const errorMessage = `Unexpected response format: ${message}`;
                    logger.error('Unexpected response format', { error: errorMessage });
                    return formatErrorResponse(errorMessage, "Read Resource");
                }
            } catch (parseError) {
                const errorMessage = `Failed to parse resource data: ${parseError.message}. Raw result: ${result}`;
                logger.error('Failed to parse resource data', { error: errorMessage });
                return formatErrorResponse(errorMessage, "Read Resource");
            }
        } catch (error) {
            const errorMessage = error.message || 'Unknown error occurred';
            logger.error('Error reading resource', { error: errorMessage, uri });
            return formatErrorResponse(errorMessage, "Read Resource");
        }
    }
} 