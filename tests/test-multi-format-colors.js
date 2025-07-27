/**
 * Test Multi-Format Color Creation
 * Verifies that createColorSwatch works with RGB, CMYK, and Hex formats
 */

import { spawn } from 'child_process';

// Helper function to execute a tool
async function executeTool(toolName, args = {}) {
    return new Promise((resolve, reject) => {
        const child = spawn('node', ['src/index.js'], {
            stdio: ['pipe', 'pipe', 'pipe']
        });

        let output = '';
        let errorOutput = '';

        child.stdout.on('data', (data) => {
            output += data.toString();
        });

        child.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        child.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`Process exited with code ${code}: ${errorOutput}`));
                return;
            }

            try {
                // Parse the last valid JSON object from output
                const lines = output.trim().split('\n');
                let lastValidJson = null;

                for (let i = lines.length - 1; i >= 0; i--) {
                    try {
                        const parsed = JSON.parse(lines[i]);
                        if (parsed && typeof parsed === 'object') {
                            lastValidJson = parsed;
                            break;
                        }
                    } catch (e) {
                        continue;
                    }
                }

                if (!lastValidJson) {
                    reject(new Error('No valid JSON found in output'));
                    return;
                }

                // Extract content field and parse it
                if (lastValidJson.result && lastValidJson.result.content && lastValidJson.result.content[0] && lastValidJson.result.content[0].text) {
                    try {
                        const content = JSON.parse(lastValidJson.result.content[0].text);
                        resolve(content);
                    } catch (e) {
                        resolve({ success: false, message: lastValidJson.result.content[0].text });
                    }
                } else {
                    resolve(lastValidJson);
                }
            } catch (error) {
                reject(new Error(`Failed to parse response: ${error.message}`));
            }
        });

        // Send the tool call
        const toolCall = {
            jsonrpc: '2.0',
            id: 1,
            method: 'tools/call',
            params: {
                name: toolName,
                arguments: args
            }
        };

        child.stdin.write(JSON.stringify(toolCall) + '\n');
        child.stdin.end();
    });
}

// Test all color formats
async function testMultiFormatColors() {
    console.log('🧪 Testing Multi-Format Color Creation\n');

    const tests = [
        {
            name: 'Create Document',
            tool: 'create_document',
            args: {
                name: 'Multi-Format Color Test',
                width: 210,
                height: 297,
                facingPages: false
            },
            description: 'Create a test document'
        },
        {
            name: 'RGB Color (Red)',
            tool: 'create_color_swatch',
            args: {
                name: 'RGB Red',
                red: 255,
                green: 0,
                blue: 0
            },
            description: 'Create red color using RGB values'
        },
        {
            name: 'CMYK Color (Blue)',
            tool: 'create_color_swatch',
            args: {
                name: 'CMYK Blue',
                cyan: 100,
                magenta: 100,
                yellow: 0,
                black: 0
            },
            description: 'Create blue color using CMYK values'
        },
        {
            name: 'Hex Color (Green)',
            tool: 'create_color_swatch',
            args: {
                name: 'Hex Green',
                hex: '#00FF00'
            },
            description: 'Create green color using hex code'
        },
        {
            name: 'Hex Color (Yellow) - No Hash',
            tool: 'create_color_swatch',
            args: {
                name: 'Hex Yellow',
                hex: 'FFFF00'
            },
            description: 'Create yellow color using hex code without hash'
        },
        {
            name: 'RGB Array Color (Purple)',
            tool: 'create_color_swatch',
            args: {
                name: 'RGB Array Purple',
                colorValue: [128, 0, 128]
            },
            description: 'Create purple color using RGB array'
        },
        {
            name: 'CMYK Array Color (Orange)',
            tool: 'create_color_swatch',
            args: {
                name: 'CMYK Array Orange',
                colorValue: [0, 50, 100, 0]
            },
            description: 'Create orange color using CMYK array'
        },
        {
            name: 'List All Colors',
            tool: 'list_color_swatches',
            args: {},
            description: 'List all created color swatches'
        }
    ];

    let passed = 0;
    let failed = 0;

    for (const test of tests) {
        console.log(`\n📋 Test: ${test.name}`);
        console.log(`📝 Description: ${test.description}`);
        console.log(`🔧 Tool: ${test.tool}`);

        try {
            const result = await executeTool(test.tool, test.args);

            if (result.success) {
                console.log(`✅ PASSED: ${result.message || result.result}`);
                passed++;

                // Show additional details for color creation
                if (test.tool === 'create_color_swatch') {
                    console.log(`   Color created successfully`);
                }

            } else {
                console.log(`❌ FAILED: ${result.message || result.result}`);
                failed++;
            }

        } catch (error) {
            console.log(`❌ ERROR: ${error.message}`);
            failed++;
        }
    }

    console.log(`\n📊 Test Results:`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

    console.log(`\n🎯 Multi-Format Color Support Summary:`);
    console.log(`• RGB format: red, green, blue parameters (0-255)`);
    console.log(`• CMYK format: cyan, magenta, yellow, black parameters (0-100)`);
    console.log(`• Hex format: hex parameter with or without # prefix`);
    console.log(`• Array format: colorValue array for RGB [r,g,b] or CMYK [c,m,y,k]`);
    console.log(`• All formats automatically convert to CMYK for InDesign`);
    console.log(`• Check InDesign swatches panel to verify all colors display correctly`);
}

// Run the tests
testMultiFormatColors().catch(console.error); 