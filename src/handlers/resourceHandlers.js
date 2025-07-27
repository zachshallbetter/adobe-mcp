/**
 * MCP Resource Handlers for InDesign
 * 
 * Provides structured access to InDesign data as context for AI models
 * Based on MCP Resources specification
 */

import { executeExtendScript } from '../utils/extendScriptUtils.js';
import { logger } from '../utils/logger.js';

export class ResourceHandlers {
    /**
     * List available direct resources
     */
    static async listResources() {
        try {
            const script = `
                try {
                    var resources = [];
                    
                    // Document resources
                    if (app.documents.length > 0) {
                        var doc = app.activeDocument;
                        resources.push({
                            uri: "indesign://document/active",
                            name: "active-document",
                            title: "Active Document",
                            description: "Currently active InDesign document",
                            mimeType: "application/json"
                        });
                        
                        resources.push({
                            uri: "indesign://document/" + doc.name,
                            name: "document-" + doc.name.replace(/[^a-zA-Z0-9]/g, '-'),
                            title: "Document: " + doc.name,
                            description: "InDesign document: " + doc.name,
                            mimeType: "application/json"
                        });
                    }
                    
                    // Color swatches
                    if (app.documents.length > 0) {
                        var doc = app.activeDocument;
                        if (doc.colorSwatches.length > 0) {
                            resources.push({
                                uri: "indesign://colors/swatches",
                                name: "color-swatches",
                                title: "Color Swatches",
                                description: "All color swatches in the active document",
                                mimeType: "application/json"
                            });
                        }
                    }
                    
                    // Styles
                    if (app.documents.length > 0) {
                        var doc = app.activeDocument;
                        if (doc.paragraphStyles.length > 0) {
                            resources.push({
                                uri: "indesign://styles/paragraph",
                                name: "paragraph-styles",
                                title: "Paragraph Styles",
                                description: "All paragraph styles in the active document",
                                mimeType: "application/json"
                            });
                        }
                        
                        if (doc.characterStyles.length > 0) {
                            resources.push({
                                uri: "indesign://styles/character",
                                name: "character-styles",
                                title: "Character Styles",
                                description: "All character styles in the active document",
                                mimeType: "application/json"
                            });
                        }
                    }
                    
                    // Pages
                    if (app.documents.length > 0) {
                        var doc = app.activeDocument;
                        if (doc.pages.length > 0) {
                            resources.push({
                                uri: "indesign://pages/all",
                                name: "all-pages",
                                title: "All Pages",
                                description: "All pages in the active document",
                                mimeType: "application/json"
                            });
                        }
                    }
                    
                    JSON.stringify(resources);
                } catch (error) {
                    "ERROR: " + error.message;
                }
            `;

            const result = await executeExtendScript(script);

            if (result.success) {
                const resources = JSON.parse(result.message);
                logger.info('Listed resources', { count: resources.length });
                return resources;
            } else {
                logger.error('Failed to list resources', { error: result.message });
                return [];
            }
        } catch (error) {
            logger.error('Error listing resources', { error: error.message });
            return [];
        }
    }

    /**
     * List available resource templates
     */
    static async listResourceTemplates() {
        const templates = [
            {
                uriTemplate: "indesign://document/{name}",
                name: "document-by-name",
                title: "Document by Name",
                description: "Access InDesign document by name",
                mimeType: "application/json"
            },
            {
                uriTemplate: "indesign://page/{number}",
                name: "page-by-number",
                title: "Page by Number",
                description: "Access specific page by number",
                mimeType: "application/json"
            },
            {
                uriTemplate: "indesign://color/{name}",
                name: "color-by-name",
                title: "Color by Name",
                description: "Access color swatch by name",
                mimeType: "application/json"
            },
            {
                uriTemplate: "indesign://style/{type}/{name}",
                name: "style-by-type-and-name",
                title: "Style by Type and Name",
                description: "Access style by type (paragraph/character) and name",
                mimeType: "application/json"
            },
            {
                uriTemplate: "indesign://text-frame/{id}",
                name: "text-frame-by-id",
                title: "Text Frame by ID",
                description: "Access text frame by ID",
                mimeType: "application/json"
            },
            {
                uriTemplate: "indesign://image/{id}",
                name: "image-by-id",
                title: "Image by ID",
                description: "Access image by ID",
                mimeType: "application/json"
            }
        ];

        logger.info('Listed resource templates', { count: templates.length });
        return templates;
    }

    /**
     * Read resource content
     */
    static async readResource(uri) {
        try {
            logger.debug('Reading resource', { uri });

            if (uri.startsWith('indesign://document/')) {
                return await this.readDocumentResource(uri);
            } else if (uri.startsWith('indesign://colors/')) {
                return await this.readColorResource(uri);
            } else if (uri.startsWith('indesign://styles/')) {
                return await this.readStyleResource(uri);
            } else if (uri.startsWith('indesign://pages/')) {
                return await this.readPageResource(uri);
            } else if (uri.startsWith('indesign://page/')) {
                return await this.readSpecificPageResource(uri);
            } else if (uri.startsWith('indesign://color/')) {
                return await this.readSpecificColorResource(uri);
            } else if (uri.startsWith('indesign://style/')) {
                return await this.readSpecificStyleResource(uri);
            } else if (uri.startsWith('indesign://text-frame/')) {
                return await this.readTextFrameResource(uri);
            } else if (uri.startsWith('indesign://image/')) {
                return await this.readImageResource(uri);
            } else {
                throw new Error(`Unknown resource URI: ${uri}`);
            }
        } catch (error) {
            logger.error('Error reading resource', { uri, error: error.message });
            throw error;
        }
    }

    /**
     * Read document resource
     */
    static async readDocumentResource(uri) {
        const script = `
            try {
                if (app.documents.length === 0) {
                    "ERROR: No documents open";
                }
                
                var doc = app.activeDocument;
                var documentInfo = {
                    name: doc.name,
                    fullName: doc.fullName,
                    pageCount: doc.pages.length,
                    colorSwatches: doc.colorSwatches.length,
                    paragraphStyles: doc.paragraphStyles.length,
                    characterStyles: doc.characterStyles.length,
                    objectStyles: doc.objectStyles.length,
                    textFrames: 0,
                    images: 0,
                    rectangles: 0,
                    ellipses: 0,
                    polygons: 0,
                    groups: 0,
                    documentBounds: {
                        width: doc.documentBounds.width,
                        height: doc.documentBounds.height
                    },
                    documentPreferences: {
                        pageWidth: doc.documentPreferences.pageWidth,
                        pageHeight: doc.documentPreferences.pageHeight,
                        facingPages: doc.documentPreferences.facingPages,
                        pageOrientation: doc.documentPreferences.pageOrientation.toString()
                    }
                };
                
                // Count page items
                for (var i = 0; i < doc.pages.length; i++) {
                    var page = doc.pages[i];
                    for (var j = 0; j < page.allPageItems.length; j++) {
                        var item = page.allPageItems[j];
                        if (item.constructor.name === "TextFrame") {
                            documentInfo.textFrames++;
                        } else if (item.constructor.name === "Rectangle") {
                            documentInfo.rectangles++;
                        } else if (item.constructor.name === "Oval") {
                            documentInfo.ellipses++;
                        } else if (item.constructor.name === "Polygon") {
                            documentInfo.polygons++;
                        } else if (item.constructor.name === "Group") {
                            documentInfo.groups++;
                        }
                    }
                }
                
                // Count images
                for (var i = 0; i < doc.rectangles.length; i++) {
                    var rect = doc.rectangles[i];
                    if (rect.images.length > 0) {
                        documentInfo.images++;
                    }
                }
                
                JSON.stringify(documentInfo);
            } catch (error) {
                "ERROR: " + error.message;
            }
        `;

        const result = await executeExtendScript(script);

        if (result.success) {
            const data = JSON.parse(result.message);
            return {
                uri,
                name: "document-info",
                title: `Document: ${data.name}`,
                mimeType: "application/json",
                text: JSON.stringify(data, null, 2)
            };
        } else {
            throw new Error(result.message);
        }
    }

    /**
     * Read color resource
     */
    static async readColorResource(uri) {
        const script = `
            try {
                if (app.documents.length === 0) {
                    "ERROR: No documents open";
                }
                
                var doc = app.activeDocument;
                var colors = [];
                
                for (var i = 0; i < doc.colorSwatches.length; i++) {
                    var color = doc.colorSwatches[i];
                    var colorInfo = {
                        name: color.name,
                        colorType: color.colorType.toString(),
                        model: color.model.toString(),
                        colorValue: color.colorValue
                    };
                    colors.push(colorInfo);
                }
                
                JSON.stringify(colors);
            } catch (error) {
                "ERROR: " + error.message;
            }
        `;

        const result = await executeExtendScript(script);

        if (result.success) {
            const data = JSON.parse(result.message);
            return {
                uri,
                name: "color-swatches",
                title: "Color Swatches",
                mimeType: "application/json",
                text: JSON.stringify(data, null, 2)
            };
        } else {
            throw new Error(result.message);
        }
    }

    /**
     * Read style resource
     */
    static async readStyleResource(uri) {
        const styleType = uri.includes('paragraph') ? 'paragraph' : 'character';

        const script = `
            try {
                if (app.documents.length === 0) {
                    "ERROR: No documents open";
                }
                
                var doc = app.activeDocument;
                var styles = [];
                var styleCollection = doc.${styleType}Styles;
                
                for (var i = 0; i < styleCollection.length; i++) {
                    var style = styleCollection[i];
                    var styleInfo = {
                        name: style.name,
                        appliedFont: style.appliedFont ? style.appliedFont.name : null,
                        pointSize: style.pointSize,
                        fillColor: style.fillColor ? style.fillColor.name : null,
                        justification: style.justification ? style.justification.toString() : null
                    };
                    styles.push(styleInfo);
                }
                
                JSON.stringify(styles);
            } catch (error) {
                "ERROR: " + error.message;
            }
        `;

        const result = await executeExtendScript(script);

        if (result.success) {
            const data = JSON.parse(result.message);
            return {
                uri,
                name: `${styleType}-styles`,
                title: `${styleType.charAt(0).toUpperCase() + styleType.slice(1)} Styles`,
                mimeType: "application/json",
                text: JSON.stringify(data, null, 2)
            };
        } else {
            throw new Error(result.message);
        }
    }

    /**
     * Read page resource
     */
    static async readPageResource(uri) {
        const script = `
            try {
                if (app.documents.length === 0) {
                    "ERROR: No documents open";
                }
                
                var doc = app.activeDocument;
                var pages = [];
                
                for (var i = 0; i < doc.pages.length; i++) {
                    var page = doc.pages[i];
                    var pageInfo = {
                        name: page.name,
                        index: page.documentOffset,
                        pageItems: page.allPageItems.length,
                        textFrames: 0,
                        rectangles: 0,
                        ellipses: 0,
                        polygons: 0,
                        groups: 0,
                        images: 0
                    };
                    
                    for (var j = 0; j < page.allPageItems.length; j++) {
                        var item = page.allPageItems[j];
                        if (item.constructor.name === "TextFrame") {
                            pageInfo.textFrames++;
                        } else if (item.constructor.name === "Rectangle") {
                            pageInfo.rectangles++;
                        } else if (item.constructor.name === "Oval") {
                            pageInfo.ellipses++;
                        } else if (item.constructor.name === "Polygon") {
                            pageInfo.polygons++;
                        } else if (item.constructor.name === "Group") {
                            pageInfo.groups++;
                        }
                    }
                    
                    pages.push(pageInfo);
                }
                
                JSON.stringify(pages);
            } catch (error) {
                "ERROR: " + error.message;
            }
        `;

        const result = await executeExtendScript(script);

        if (result.success) {
            const data = JSON.parse(result.message);
            return {
                uri,
                name: "all-pages",
                title: "All Pages",
                mimeType: "application/json",
                text: JSON.stringify(data, null, 2)
            };
        } else {
            throw new Error(result.message);
        }
    }

    /**
     * Read specific page resource
     */
    static async readSpecificPageResource(uri) {
        const pageNumber = uri.split('/').pop();

        const script = `
            try {
                if (app.documents.length === 0) {
                    "ERROR: No documents open";
                }
                
                var doc = app.activeDocument;
                var pageIndex = parseInt("${pageNumber}") - 1;
                
                if (pageIndex < 0 || pageIndex >= doc.pages.length) {
                    "ERROR: Page number out of range";
                }
                
                var page = doc.pages[pageIndex];
                var pageInfo = {
                    name: page.name,
                    index: page.documentOffset,
                    pageItems: page.allPageItems.length,
                    items: []
                };
                
                for (var i = 0; i < page.allPageItems.length; i++) {
                    var item = page.allPageItems[i];
                    var itemInfo = {
                        id: item.id,
                        name: item.name,
                        type: item.constructor.name,
                        bounds: {
                            geometricBounds: item.geometricBounds,
                            visibleBounds: item.visibleBounds
                        }
                    };
                    
                    if (item.constructor.name === "TextFrame") {
                        itemInfo.textContent = item.contents;
                        itemInfo.textLength = item.texts[0].contents.length;
                    }
                    
                    pageInfo.items.push(itemInfo);
                }
                
                JSON.stringify(pageInfo);
            } catch (error) {
                "ERROR: " + error.message;
            }
        `;

        const result = await executeExtendScript(script);

        if (result.success) {
            const data = JSON.parse(result.message);
            return {
                uri,
                name: `page-${pageNumber}`,
                title: `Page ${pageNumber}`,
                mimeType: "application/json",
                text: JSON.stringify(data, null, 2)
            };
        } else {
            throw new Error(result.message);
        }
    }

    /**
     * Read specific color resource
     */
    static async readSpecificColorResource(uri) {
        const colorName = decodeURIComponent(uri.split('/').pop());

        const script = `
            try {
                if (app.documents.length === 0) {
                    "ERROR: No documents open";
                }
                
                var doc = app.activeDocument;
                var color = doc.colorSwatches.itemByName("${colorName}");
                
                if (!color.isValid) {
                    "ERROR: Color not found: ${colorName}";
                }
                
                var colorInfo = {
                    name: color.name,
                    colorType: color.colorType.toString(),
                    model: color.model.toString(),
                    colorValue: color.colorValue,
                    space: color.space.toString()
                };
                
                JSON.stringify(colorInfo);
            } catch (error) {
                "ERROR: " + error.message;
            }
        `;

        const result = await executeExtendScript(script);

        if (result.success) {
            const data = JSON.parse(result.message);
            return {
                uri,
                name: `color-${colorName}`,
                title: `Color: ${colorName}`,
                mimeType: "application/json",
                text: JSON.stringify(data, null, 2)
            };
        } else {
            throw new Error(result.message);
        }
    }

    /**
     * Read specific style resource
     */
    static async readSpecificStyleResource(uri) {
        const parts = uri.split('/');
        const styleType = parts[parts.length - 2];
        const styleName = decodeURIComponent(parts[parts.length - 1]);

        const script = `
            try {
                if (app.documents.length === 0) {
                    "ERROR: No documents open";
                }
                
                var doc = app.activeDocument;
                var styleCollection = doc.${styleType}Styles;
                var style = styleCollection.itemByName("${styleName}");
                
                if (!style.isValid) {
                    "ERROR: Style not found: ${styleName}";
                }
                
                var styleInfo = {
                    name: style.name,
                    appliedFont: style.appliedFont ? style.appliedFont.name : null,
                    pointSize: style.pointSize,
                    fillColor: style.fillColor ? style.fillColor.name : null,
                    justification: style.justification ? style.justification.toString() : null,
                    leading: style.leading,
                    tracking: style.tracking,
                    horizontalScale: style.horizontalScale,
                    verticalScale: style.verticalScale
                };
                
                JSON.stringify(styleInfo);
            } catch (error) {
                "ERROR: " + error.message;
            }
        `;

        const result = await executeExtendScript(script);

        if (result.success) {
            const data = JSON.parse(result.message);
            return {
                uri,
                name: `style-${styleType}-${styleName}`,
                title: `${styleType.charAt(0).toUpperCase() + styleType.slice(1)} Style: ${styleName}`,
                mimeType: "application/json",
                text: JSON.stringify(data, null, 2)
            };
        } else {
            throw new Error(result.message);
        }
    }

    /**
     * Read text frame resource
     */
    static async readTextFrameResource(uri) {
        const frameId = uri.split('/').pop();

        const script = `
            try {
                if (app.documents.length === 0) {
                    "ERROR: No documents open";
                }
                
                var doc = app.activeDocument;
                var textFrame = null;
                
                // Search through all pages for the text frame
                for (var i = 0; i < doc.pages.length; i++) {
                    var page = doc.pages[i];
                    for (var j = 0; j < page.allPageItems.length; j++) {
                        var item = page.allPageItems[j];
                        if (item.constructor.name === "TextFrame" && item.id.toString() === "${frameId}") {
                            textFrame = item;
                            break;
                        }
                    }
                    if (textFrame) break;
                }
                
                if (!textFrame) {
                    "ERROR: Text frame not found with ID: ${frameId}";
                }
                
                var frameInfo = {
                    id: textFrame.id,
                    name: textFrame.name,
                    contents: textFrame.contents,
                    textLength: textFrame.texts[0].contents.length,
                    geometricBounds: textFrame.geometricBounds,
                    visibleBounds: textFrame.visibleBounds,
                    appliedParagraphStyle: textFrame.appliedParagraphStyle ? textFrame.appliedParagraphStyle.name : null,
                    appliedCharacterStyle: textFrame.appliedCharacterStyle ? textFrame.appliedCharacterStyle.name : null,
                    fillColor: textFrame.fillColor ? textFrame.fillColor.name : null,
                    strokeColor: textFrame.strokeColor ? textFrame.strokeColor.name : null
                };
                
                JSON.stringify(frameInfo);
            } catch (error) {
                "ERROR: " + error.message;
            }
        `;

        const result = await executeExtendScript(script);

        if (result.success) {
            const data = JSON.parse(result.message);
            return {
                uri,
                name: `text-frame-${frameId}`,
                title: `Text Frame ${frameId}`,
                mimeType: "application/json",
                text: JSON.stringify(data, null, 2)
            };
        } else {
            throw new Error(result.message);
        }
    }

    /**
     * Read image resource
     */
    static async readImageResource(uri) {
        const imageId = uri.split('/').pop();

        const script = `
            try {
                if (app.documents.length === 0) {
                    "ERROR: No documents open";
                }
                
                var doc = app.activeDocument;
                var image = null;
                
                // Search through all rectangles for images
                for (var i = 0; i < doc.rectangles.length; i++) {
                    var rect = doc.rectangles[i];
                    if (rect.images.length > 0) {
                        for (var j = 0; j < rect.images.length; j++) {
                            var img = rect.images[j];
                            if (img.id.toString() === "${imageId}") {
                                image = img;
                                break;
                            }
                        }
                    }
                    if (image) break;
                }
                
                if (!image) {
                    "ERROR: Image not found with ID: ${imageId}";
                }
                
                var imageInfo = {
                    id: image.id,
                    name: image.name,
                    fullName: image.fullName,
                    filePath: image.filePath,
                    geometricBounds: image.geometricBounds,
                    visibleBounds: image.visibleBounds,
                    width: image.geometricBounds[3] - image.geometricBounds[1],
                    height: image.geometricBounds[2] - image.geometricBounds[0]
                };
                
                JSON.stringify(imageInfo);
            } catch (error) {
                "ERROR: " + error.message;
            }
        `;

        const result = await executeExtendScript(script);

        if (result.success) {
            const data = JSON.parse(result.message);
            return {
                uri,
                name: `image-${imageId}`,
                title: `Image ${imageId}`,
                mimeType: "application/json",
                text: JSON.stringify(data, null, 2)
            };
        } else {
            throw new Error(result.message);
        }
    }
} 