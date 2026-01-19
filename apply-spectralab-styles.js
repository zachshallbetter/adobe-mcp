/**
 * Apply SpectraLab Styles to Open Document
 * 
 * Applies the comprehensive SpectraLab style system to an open InDesign document:
 * - Color swatches (6 brand colors)
 * - Paragraph styles (9 styles)
 * - Character styles (4 styles)
 */

import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const SERVER_PATH = join(__dirname, 'src/index.js');

/**
 * Execute MCP tool call
 */
async function executeTool(toolName, args = {}) {
    return new Promise((resolve, reject) => {
        const request = {
            jsonrpc: '2.0',
            id: Date.now(),
            method: 'tools/call',
            params: {
                name: toolName,
                arguments: args
            }
        };

        const process = spawn('node', [SERVER_PATH], {
            stdio: ['pipe', 'pipe', 'pipe']
        });

        let stdout = '';
        let stderr = '';

        process.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        process.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        process.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`Process exited with code ${code}: ${stderr}`));
                return;
            }

            try {
                const lines = stdout.trim().split('\n');
                const lastLine = lines[lines.length - 1];
                const response = JSON.parse(lastLine);

                if (response.error) {
                    reject(new Error(`Tool call failed: ${response.error.message}`));
                } else {
                    resolve(response.result);
                }
            } catch (error) {
                reject(new Error(`Failed to parse response: ${error.message}`));
            }
        });

        // Send request
        process.stdin.write(JSON.stringify(request) + '\n');
        process.stdin.end();
    });
}

/**
 * Apply SpectraLab styles to the open document
 */
async function applySpectraLabStyles() {
    console.log('🎨 Applying SpectraLab Styles to Proposal Draft...');

    try {
        // Step 1: Create Color Swatches
        console.log('🎨 Creating SpectraLab Color Swatches...');

        const colorSwatches = [
            {
                name: 'SpectraLab Primary Blue',
                usage: 'Headers, key UI elements',
                hex: '#3bb1d0',
                cmyk: 'C=70 M=10 Y=0 K=0'
            },
            {
                name: 'SpectraLab Orange',
                usage: 'Taglines, accent details',
                hex: '#e37b25',
                cmyk: 'C=0 M=50 Y=85 K=10'
            },
            {
                name: 'SpectraLab Purple',
                usage: 'Gradient components, overlays',
                hex: '#70317c',
                cmyk: 'C=60 M=80 Y=0 K=30'
            },
            {
                name: 'SpectraLab Dark Navy',
                usage: 'Hero titles, strong emphasis',
                hex: '#2f2c6e',
                cmyk: 'C=80 M=70 Y=0 K=50'
            },
            {
                name: 'SpectraLab Light Gray',
                usage: 'Subtle backgrounds',
                hex: '#f4f4f4',
                cmyk: 'C=0 M=0 Y=0 K=5'
            },
            {
                name: 'SpectraLab Charcoal',
                usage: 'Body text and content',
                hex: '#231f20',
                cmyk: 'C=0 M=0 Y=0 K=90'
            }
        ];

        for (const color of colorSwatches) {
            await executeTool('create_color_swatch', {
                name: color.name,
                colorType: 'PROCESS',
                colorValue: color.cmyk,
                model: 'CMYK'
            });
            console.log(`✅ Created color: ${color.name}`);
        }

        // Step 2: Create Paragraph Styles
        console.log('📝 Creating SpectraLab Paragraph Styles...');

        const paragraphStyles = [
            {
                name: 'Hero Title',
                fontSize: 48,
                fontName: 'Arial\tBold',
                alignment: 'CENTER',
                colorName: 'SpectraLab Dark Navy',
                leading: 52,
                spaceBefore: 0,
                spaceAfter: 24
            },
            {
                name: 'H1',
                fontSize: 36,
                fontName: 'Arial\tBold',
                alignment: 'LEFT',
                colorName: 'SpectraLab Dark Navy',
                leading: 40,
                spaceBefore: 24,
                spaceAfter: 16
            },
            {
                name: 'H2',
                fontSize: 28,
                fontName: 'Arial\tBold',
                alignment: 'LEFT',
                colorName: 'SpectraLab Primary Blue',
                leading: 32,
                spaceBefore: 20,
                spaceAfter: 12
            },
            {
                name: 'H3',
                fontSize: 22,
                fontName: 'Arial\tBold',
                alignment: 'LEFT',
                colorName: 'SpectraLab Primary Blue',
                leading: 26,
                spaceBefore: 16,
                spaceAfter: 8
            },
            {
                name: 'H4',
                fontSize: 18,
                fontName: 'Arial\tBold',
                alignment: 'LEFT',
                colorName: 'SpectraLab Charcoal',
                leading: 22,
                spaceBefore: 14,
                spaceAfter: 6
            },
            {
                name: 'H5',
                fontSize: 14,
                fontName: 'Arial\tBold',
                alignment: 'LEFT',
                colorName: 'SpectraLab Charcoal',
                leading: 18,
                spaceBefore: 12,
                spaceAfter: 4
            },
            {
                name: 'Section Header',
                fontSize: 32,
                fontName: 'Arial\tBold',
                alignment: 'LEFT',
                colorName: 'SpectraLab Primary Blue',
                leading: 36,
                spaceBefore: 24,
                spaceAfter: 12
            },
            {
                name: 'Subsection Header',
                fontSize: 24,
                fontName: 'Arial\tBold',
                alignment: 'LEFT',
                colorName: 'SpectraLab Charcoal',
                leading: 28,
                spaceBefore: 18,
                spaceAfter: 8
            },
            {
                name: 'Body Copy',
                fontSize: 12,
                fontName: 'Arial\tRegular',
                alignment: 'LEFT',
                colorName: 'SpectraLab Charcoal',
                leading: 14,
                spaceBefore: 0,
                spaceAfter: 0
            },
            {
                name: 'Pull Quote',
                fontSize: 18,
                fontName: 'Arial\tItalic',
                alignment: 'CENTER',
                colorName: 'SpectraLab Primary Blue',
                leading: 22,
                spaceBefore: 16,
                spaceAfter: 16
            },
            {
                name: 'Caption',
                fontSize: 10,
                fontName: 'Arial\tRegular',
                alignment: 'LEFT',
                colorName: 'SpectraLab Charcoal',
                leading: 12,
                spaceBefore: 4,
                spaceAfter: 0
            },
            {
                name: 'Tagline',
                fontSize: 16,
                fontName: 'Arial\tRegular',
                alignment: 'CENTER',
                colorName: 'SpectraLab Orange',
                leading: 18,
                spaceBefore: 8,
                spaceAfter: 8
            },
            {
                name: 'Table Content',
                fontSize: 11,
                fontName: 'Arial\tRegular',
                alignment: 'LEFT',
                colorName: 'SpectraLab Charcoal',
                leading: 13,
                spaceBefore: 2,
                spaceAfter: 2
            },
            {
                name: 'Table Header',
                fontSize: 11,
                fontName: 'Arial\tBold',
                alignment: 'LEFT',
                colorName: 'SpectraLab Dark Navy',
                leading: 13,
                spaceBefore: 4,
                spaceAfter: 4
            }
        ];

        for (const style of paragraphStyles) {
            await executeTool('create_paragraph_style', {
                name: style.name,
                fontSize: style.fontSize,
                fontName: style.fontName,
                alignment: style.alignment,
                colorName: style.colorName,
                leading: style.leading,
                spaceBefore: style.spaceBefore,
                spaceAfter: style.spaceAfter
            });
            console.log(`✅ Created paragraph style: ${style.name}`);
        }

        // Step 3: Create Character Styles
        console.log('🔤 Creating SpectraLab Character Styles...');

        const characterStyles = [
            {
                name: 'Bold Highlight',
                fontName: 'Arial\tBold',
                colorName: 'SpectraLab Primary Blue',
                fontSize: 12
            },
            {
                name: 'Italic Emphasis',
                fontName: 'Arial\tItalic',
                colorName: 'SpectraLab Charcoal',
                fontSize: 12
            },
            {
                name: 'Brand Color',
                fontName: 'Arial\tRegular',
                colorName: 'SpectraLab Orange',
                fontSize: 12
            },
            {
                name: 'Strong Emphasis',
                fontName: 'Arial\tBold',
                colorName: 'SpectraLab Dark Navy',
                fontSize: 12
            }
        ];

        for (const style of characterStyles) {
            await executeTool('create_character_style', {
                name: style.name,
                fontName: style.fontName,
                colorName: style.colorName,
                fontSize: style.fontSize
            });
            console.log(`✅ Created character style: ${style.name}`);
        }

        // Step 4: Apply styles to existing content (if any)
        console.log('📄 Applying styles to existing content...');

        // Get all text frames in the document
        const textFrames = await executeTool('get_text_frames', {});

        if (textFrames && textFrames.length > 0) {
            console.log(`📝 Found ${textFrames.length} text frames to style...`);

            for (let i = 0; i < textFrames.length; i++) {
                const frame = textFrames[i];

                // Apply Body Copy style by default
                await executeTool('apply_paragraph_style', {
                    frameIndex: i,
                    styleName: 'Body Copy'
                });

                console.log(`✅ Applied Body Copy style to text frame ${i + 1}`);
            }
        } else {
            console.log('📝 No existing text frames found - styles are ready for new content');
        }

        console.log('\n🎉 SpectraLab Styles Applied Successfully!');
        console.log('🎨 Colors: 6 brand colors created');
        console.log('📝 Paragraph Styles: 14 styles created (including H1-H5)');
        console.log('🔤 Character Styles: 4 styles created');
        console.log('📄 Document: "Proposal Draft" now has SpectraLab branding');
        console.log('\n💡 Next Steps:');
        console.log('   • Apply "Hero Title" to cover pages and major dividers');
        console.log('   • Use "H1" for main document headings');
        console.log('   • Use "H2-H5" for hierarchical content structure');
        console.log('   • Apply "Body Copy" to main content');
        console.log('   • Use character styles for inline emphasis');

    } catch (error) {
        console.error('❌ Error applying SpectraLab styles:', error.message);
        process.exit(1);
    }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
    applySpectraLabStyles();
} 