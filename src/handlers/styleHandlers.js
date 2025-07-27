/**
 * Style management handlers
 */
import { ScriptExecutor } from '../core/scriptExecutor.js';
import { formatResponse, escapeJsxString } from '../utils/stringUtils.js';
import { sessionManager } from '../core/sessionManager.js';

export class StyleHandlers {
    /**
     * Create a paragraph style
     */
    static async createParagraphStyle(args) {
        const {
            name,
            fontFamily = 'Arial\\tRegular',
            fontSize = 12,
            textColor = 'Black',
            alignment = 'LEFT_ALIGN',
            leading,
            spaceBefore,
            spaceAfter
        } = args;

        const escapedName = escapeJsxString(name);
        const escapedFontFamily = escapeJsxString(fontFamily);

        const script = [
            'if (app.documents.length === 0) {',
            '  "No document open";',
            '} else {',
            '  var doc = app.activeDocument;',
            '',
            '  try {',
            `    var style = doc.paragraphStyles.add({name: "${escapedName}"});`,
            '',
            '    // Apply font settings',
            '    try {',
            `      style.appliedFont = app.fonts.itemByName("${escapedFontFamily}");`,
            '    } catch (fontError) {',
            '      // Fallback to default font if specified font not found',
            '      style.appliedFont = app.fonts.itemByName("Arial\\tRegular");',
            '    }',
            `    style.pointSize = ${fontSize};`,
            '',
            '    // Apply color',
            `    if ("${textColor}" !== "Black") {`,
            '      try {',
            `        var color = doc.colors.itemByName("${textColor}");`,
            '        if (color.isValid) {',
            '          style.fillColor = color;',
            '        }',
            '      } catch (colorError) {',
            '        // Use default color if specified color not found',
            '      }',
            '    }',
            '',
            '    // Apply alignment',
            `    if ("${alignment}" === "CENTER_ALIGN") {`,
            '      style.justification = Justification.CENTER_ALIGN;',
            `    } else if ("${alignment}" === "RIGHT_ALIGN") {`,
            '      style.justification = Justification.RIGHT_ALIGN;',
            `    } else if ("${alignment}" === "JUSTIFY") {`,
            '      style.justification = Justification.FULLY_JUSTIFIED;',
            '    } else {',
            '      style.justification = Justification.LEFT_ALIGN;',
            '    }',
            '',
            ...(leading ? [`    style.leading = ${leading};`] : []),
            ...(spaceBefore ? [`    style.spaceBefore = ${spaceBefore};`] : []),
            ...(spaceAfter ? [`    style.spaceAfter = ${spaceAfter};`] : []),
            '',
            '    // Verify the style was created correctly',
            '    var actualFont = style.appliedFont.name;',
            '    var actualSize = style.pointSize;',
            '    var actualAlignment = style.justification;',
            '',
            `    "Paragraph style '${escapedName}' created successfully with font: " + actualFont + " at " + actualSize + "pt";`,
            '  } catch (error) {',
            '    "Error creating paragraph style: " + error.message;',
            '  }',
            '}'
        ].join('\n');

        const result = await ScriptExecutor.executeInDesignScript(script);
        return formatResponse(result, "Create Paragraph Style");
    }

    /**
     * Create a character style
     */
    static async createCharacterStyle(args) {
        const {
            name,
            fontFamily = 'Arial\\tRegular',
            fontSize = 12,
            textColor = 'Black',
            bold = false,
            italic = false,
            underline = false
        } = args;

        const escapedName = escapeJsxString(name);
        const escapedFontFamily = escapeJsxString(fontFamily);

        const script = [
            'if (app.documents.length === 0) {',
            '  "No document open";',
            '} else {',
            '  var doc = app.activeDocument;',
            '',
            '  try {',
            `    var style = doc.characterStyles.add({name: "${escapedName}"});`,
            '',
            '    // Apply font settings',
            '    try {',
            `      style.appliedFont = app.fonts.itemByName("${escapedFontFamily}");`,
            '    } catch (fontError) {',
            '      // Fallback to default font if specified font not found',
            '      style.appliedFont = app.fonts.itemByName("Arial\\tRegular");',
            '    }',
            `    style.pointSize = ${fontSize};`,
            '',
            '    // Apply color',
            `    if ("${textColor}" !== "Black") {`,
            '      try {',
            `        var color = doc.colors.itemByName("${textColor}");`,
            '        if (color.isValid) {',
            '          style.fillColor = color;',
            '        }',
            '      } catch (colorError) {',
            '        // Use default color if specified color not found',
            '      }',
            '    }',
            '',
            '    // Apply text attributes',
            `    style.fontStyle = "${bold ? 'Bold' : 'Normal'}";`,
            `    style.underline = ${underline};`,
            `    style.underlineOffset = ${underline ? 1 : 0};`,
            `    style.underlineWeight = ${underline ? 1 : 0};`,
            '',
            '    // Verify the style was created correctly',
            '    var actualFont = style.appliedFont.name;',
            '    var actualSize = style.pointSize;',
            '    var actualStyle = style.fontStyle;',
            '',
            `    "Character style '${escapedName}' created successfully with font: " + actualFont + " at " + actualSize + "pt";`,
            '  } catch (error) {',
            '    "Error creating character style: " + error.message;',
            '  }',
            '}'
        ].join('\n');

        const result = await ScriptExecutor.executeInDesignScript(script);
        return formatResponse(result, "Create Character Style");
    }

    /**
     * Apply a paragraph style to text
     */
    static async applyParagraphStyle(args) {
        const { styleName, frameIndex = 0 } = args;
        const escapedStyleName = escapeJsxString(styleName);

        const script = [
            'if (app.documents.length === 0) {',
            '  "No document open";',
            '} else {',
            '  var doc = app.activeDocument;',
            '  var page = doc.pages[0];',
            '',
            '  try {',
            `    if (${frameIndex} >= page.textFrames.length) {`,
            '      "Text frame index out of range";',
            '    } else {',
            `      var textFrame = page.textFrames[${frameIndex}];`,
            `      var style = doc.paragraphStyles.itemByName("${escapedStyleName}");`,
            '',
            '      if (style.isValid) {',
            '        textFrame.paragraphs[0].appliedParagraphStyle = style;',
            `        "Paragraph style '${escapedStyleName}' applied successfully";`,
            '      } else {',
            `        "Paragraph style '${escapedStyleName}' not found";`,
            '      }',
            '    }',
            '  } catch (error) {',
            '    "Error applying paragraph style: " + error.message;',
            '  }',
            '}'
        ].join('\n');

        const result = await ScriptExecutor.executeInDesignScript(script);
        return formatResponse(result, "Apply Paragraph Style");
    }

    /**
     * Apply a character style to text
     */
    static async applyCharacterStyle(args) {
        const { styleName, frameIndex = 0, startIndex = 0, endIndex = -1 } = args;
        const escapedStyleName = escapeJsxString(styleName);

        const script = [
            'if (app.documents.length === 0) {',
            '  "No document open";',
            '} else {',
            '  var doc = app.activeDocument;',
            '  var page = doc.pages[0];',
            '',
            '  try {',
            `    if (${frameIndex} >= page.textFrames.length) {`,
            '      "Text frame index out of range";',
            '    } else {',
            `      var textFrame = page.textFrames[${frameIndex}];`,
            `      var style = doc.characterStyles.itemByName("${escapedStyleName}");`,
            '',
            '      if (style.isValid) {',
            `        if (${endIndex} === -1) {`,
            '          // Apply to entire text frame',
            '          textFrame.texts[0].appliedCharacterStyle = style;',
            `        } else {`,
            '          // Apply to specific range',
            `          textFrame.texts[0].characters.itemByRange(${startIndex}, ${endIndex}).appliedCharacterStyle = style;`,
            '        }',
            `        "Character style '${escapedStyleName}' applied successfully";`,
            '      } else {',
            `        "Character style '${escapedStyleName}' not found";`,
            '      }',
            '    }',
            '  } catch (error) {',
            '    "Error applying character style: " + error.message;',
            '  }',
            '}'
        ].join('\n');

        const result = await ScriptExecutor.executeInDesignScript(script);
        return formatResponse(result, "Apply Character Style");
    }

    /**
     * List all styles in the document
     */
    static async listStyles(args) {
        const { styleType = 'ALL' } = args;

        const script = [
            'if (app.documents.length === 0) {',
            '  "No document open";',
            '} else {',
            '  var doc = app.activeDocument;',
            '  var info = "=== STYLES LIST ===\\n";',
            '',
            '  // Helper function to get alignment name',
            '  function getAlignmentName(alignment) {',
            '    if (alignment === Justification.LEFT_ALIGN) return "LEFT_ALIGN";',
            '    if (alignment === Justification.CENTER_ALIGN) return "CENTER_ALIGN";',
            '    if (alignment === Justification.RIGHT_ALIGN) return "RIGHT_ALIGN";',
            '    if (alignment === Justification.FULLY_JUSTIFIED) return "FULLY_JUSTIFIED";',
            '    return "UNKNOWN (" + alignment + ")";',
            '  }',
            '',
            `  if ("${styleType}" === "PARAGRAPH" || "${styleType}" === "ALL") {`,
            '    info += "\\n=== PARAGRAPH STYLES ===\\n";',
            '    for (var i = 0; i < doc.paragraphStyles.length; i++) {',
            '      var style = doc.paragraphStyles[i];',
            '      if (style.isValid) {',
            '        info += "Name: " + style.name + "\\n";',
            '        if (style.appliedFont && style.appliedFont.isValid) {',
            '          info += "  Font: " + style.appliedFont.name + "\\n";',
            '        } else {',
            '          info += "  Font: [Not set]\\n";',
            '        }',
            '        info += "  Size: " + style.pointSize + "pt\\n";',
            '        info += "  Alignment: " + getAlignmentName(style.justification) + "\\n";',
            '        if (style.fillColor && style.fillColor.isValid) {',
            '          info += "  Color: " + style.fillColor.name + "\\n";',
            '        }',
            '        info += "\\n";',
            '      }',
            '    }',
            '  }',
            '',
            `  if ("${styleType}" === "CHARACTER" || "${styleType}" === "ALL") {`,
            '    info += "\\n=== CHARACTER STYLES ===\\n";',
            '    for (var i = 0; i < doc.characterStyles.length; i++) {',
            '      var style = doc.characterStyles[i];',
            '      if (style.isValid) {',
            '        info += "Name: " + style.name + "\\n";',
            '        if (style.appliedFont && style.appliedFont.isValid) {',
            '          info += "  Font: " + style.appliedFont.name + "\\n";',
            '        } else {',
            '          info += "  Font: [Not set]\\n";',
            '        }',
            '        info += "  Size: " + style.pointSize + "pt\\n";',
            '        info += "  Style: " + style.fontStyle + "\\n";',
            '        if (style.fillColor && style.fillColor.isValid) {',
            '          info += "  Color: " + style.fillColor.name + "\\n";',
            '        }',
            '        info += "\\n";',
            '      }',
            '    }',
            '  }',
            '',
            '  info;',
            '}'
        ].join('\n');

        const result = await ScriptExecutor.executeInDesignScript(script);
        return formatResponse(result, "List Styles");
    }

    /**
     * Create a color swatch
     */
    static async createColorSwatch(args) {
        const {
            name,
            colorType = 'PROCESS',
            // RGB format
            red,
            green,
            blue,
            // CMYK format
            cyan,
            magenta,
            yellow,
            black,
            // Hex format
            hex,
            // Direct color value
            colorValue
        } = args;

        const escapedName = escapeJsxString(name);

        let cyanValue, magentaValue, yellowValue, blackValue;
        let sourceFormat = '';

        // Determine which color format is being used and convert to CMYK
        if (hex) {
            // Convert hex to RGB, then to CMYK
            const hexClean = hex.replace('#', '');
            const r = parseInt(hexClean.substr(0, 2), 16);
            const g = parseInt(hexClean.substr(2, 2), 16);
            const b = parseInt(hexClean.substr(4, 2), 16);

            const rgb = r / 255;
            const rgbG = g / 255;
            const rgbB = b / 255;
            const max = Math.max(rgb, rgbG, rgbB);
            const k = 1 - max;
            const c = max === 0 ? 0 : (max - rgb) / max;
            const m = max === 0 ? 0 : (max - rgbG) / max;
            const y = max === 0 ? 0 : (max - rgbB) / max;

            cyanValue = Math.round(c * 100);
            magentaValue = Math.round(m * 100);
            yellowValue = Math.round(y * 100);
            blackValue = Math.round(k * 100);
            sourceFormat = `hex ${hex}`;
        } else if (cyan !== undefined && magenta !== undefined && yellow !== undefined && black !== undefined) {
            // Direct CMYK values
            cyanValue = Math.round(cyan);
            magentaValue = Math.round(magenta);
            yellowValue = Math.round(yellow);
            blackValue = Math.round(black);
            sourceFormat = `CMYK [${cyan}, ${magenta}, ${yellow}, ${black}]`;
        } else if (red !== undefined && green !== undefined && blue !== undefined) {
            // RGB format - convert to CMYK
            const r = red / 255;
            const g = green / 255;
            const b = blue / 255;
            const max = Math.max(r, g, b);
            const k = 1 - max;
            const c = max === 0 ? 0 : (max - r) / max;
            const m = max === 0 ? 0 : (max - g) / max;
            const y = max === 0 ? 0 : (max - b) / max;

            cyanValue = Math.round(c * 100);
            magentaValue = Math.round(m * 100);
            yellowValue = Math.round(y * 100);
            blackValue = Math.round(k * 100);
            sourceFormat = `RGB [${red}, ${green}, ${blue}]`;
        } else if (colorValue && Array.isArray(colorValue)) {
            // Direct color value array (CMYK or RGB)
            if (colorValue.length === 4) {
                // CMYK array
                cyanValue = Math.round(colorValue[0]);
                magentaValue = Math.round(colorValue[1]);
                yellowValue = Math.round(colorValue[2]);
                blackValue = Math.round(colorValue[3]);
                sourceFormat = `CMYK array [${colorValue.join(', ')}]`;
            } else if (colorValue.length === 3) {
                // RGB array - convert to CMYK
                const r = colorValue[0] / 255;
                const g = colorValue[1] / 255;
                const b = colorValue[2] / 255;
                const max = Math.max(r, g, b);
                const k = 1 - max;
                const c = max === 0 ? 0 : (max - r) / max;
                const m = max === 0 ? 0 : (max - g) / max;
                const y = max === 0 ? 0 : (max - b) / max;

                cyanValue = Math.round(c * 100);
                magentaValue = Math.round(m * 100);
                yellowValue = Math.round(y * 100);
                blackValue = Math.round(k * 100);
                sourceFormat = `RGB array [${colorValue.join(', ')}]`;
            } else {
                throw new Error('Invalid colorValue array length. Expected 3 (RGB) or 4 (CMYK) values.');
            }
        } else {
            throw new Error('No valid color format provided. Use hex, RGB (red/green/blue), CMYK (cyan/magenta/yellow/black), or colorValue array.');
        }

        const script = [
            'if (app.documents.length === 0) {',
            '  "No document open";',
            '} else {',
            '  var doc = app.activeDocument;',
            '',
            '  try {',
            `    var color = doc.colors.add({name: "${escapedName}"});`,
            '',
            '    // Set CMYK values directly (InDesign defaults to process color)',
            `    color.colorValue = [${cyanValue}, ${magentaValue}, ${yellowValue}, ${blackValue}];`,
            '',
            '    // Verify the color was set correctly',
            '    var actualValues = color.colorValue;',
            '',
            `    "Color swatch '${escapedName}' created successfully with CMYK values [" + actualValues[0] + ", " + actualValues[1] + ", " + actualValues[2] + ", " + actualValues[3] + "] (from ${sourceFormat})";`,
            '  } catch (error) {',
            '    "Error creating color swatch: " + error.message;',
            '  }',
            '}'
        ].join('\n');

        const result = await ScriptExecutor.executeInDesignScript(script);
        return formatResponse(result, "Create Color Swatch");
    }

    /**
     * List all color swatches
     */
    static async listColorSwatches() {
        const script = [
            'if (app.documents.length === 0) {',
            '  "No document open";',
            '} else {',
            '  var doc = app.activeDocument;',
            '  var info = "=== COLOR SWATCHES ===\\n";',
            '',
            '  try {',
            '    for (var i = 0; i < doc.colors.length; i++) {',
            '      var color = doc.colors[i];',
            '      if (color && color.isValid) {',
            '        info += "Name: " + color.name + "\\n";',
            '        if (color.colorValue && color.colorValue.length >= 4) {',
            '          info += "  CMYK: [" + color.colorValue[0] + ", " + color.colorValue[1] + ", " + color.colorValue[2] + ", " + color.colorValue[3] + "]\\n";',
            '        } else if (color.colorValue && color.colorValue.length >= 3) {',
            '          info += "  RGB: [" + color.colorValue[0] + ", " + color.colorValue[1] + ", " + color.colorValue[2] + "]\\n";',
            '        } else {',
            '          info += "  Values: [No values set]\\n";',
            '        }',
            '        info += "\\n";',
            '      }',
            '    }',
            '  } catch (error) {',
            '    info += "Error listing colors: " + error.message + "\\n";',
            '  }',
            '',
            '  info;',
            '}'
        ].join('\n');

        const result = await ScriptExecutor.executeInDesignScript(script);
        return formatResponse(result, "List Color Swatches");
    }

    /**
     * Apply a color to text or graphics
     */
    static async applyColor(args) {
        const { colorName, targetType = 'text', frameIndex = 0 } = args;
        const escapedColorName = escapeJsxString(colorName);

        const script = [
            'if (app.documents.length === 0) {',
            '  "No document open";',
            '} else {',
            '  var doc = app.activeDocument;',
            '  var page = doc.pages[0];',
            '',
            '  try {',
            `    var color = doc.colors.itemByName("${escapedColorName}");`,
            '    if (!color.isValid) {',
            `      "Color '${escapedColorName}' not found";`,
            '    } else {',
            `      if ("${targetType}" === "text") {`,
            `        if (${frameIndex} >= page.textFrames.length) {`,
            '          "Text frame index out of range";',
            '        } else {',
            `          var textFrame = page.textFrames[${frameIndex}];`,
            '          textFrame.texts[0].fillColor = color;',
            `          "Color '${escapedColorName}' applied to text";`,
            '        }',
            `      } else if ("${targetType}" === "rectangle") {`,
            `        if (${frameIndex} >= page.rectangles.length) {`,
            '          "Rectangle index out of range";',
            '        } else {',
            `          var rectangle = page.rectangles[${frameIndex}];`,
            '          rectangle.fillColor = color;',
            `          "Color '${escapedColorName}' applied to rectangle";`,
            '        }',
            `      } else if ("${targetType}" === "ellipse") {`,
            `        if (${frameIndex} >= page.ovals.length) {`,
            '          "Ellipse index out of range";',
            '        } else {',
            `          var ellipse = page.ovals[${frameIndex}];`,
            '          ellipse.fillColor = color;',
            `          "Color '${escapedColorName}' applied to ellipse";`,
            '        }',
            '      } else {',
            '        "Invalid target type. Use: text, rectangle, or ellipse";',
            '      }',
            '    }',
            '  } catch (error) {',
            '    "Error applying color: " + error.message;',
            '  }',
            '}'
        ].join('\n');

        const result = await ScriptExecutor.executeInDesignScript(script);
        return formatResponse(result, "Apply Color");
    }
} 