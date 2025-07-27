/**
 * Test Smart Workflow Tools
 * Demonstrates the new high-level workflow tools that replace multiple low-level operations
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
                if (lastValidJson.content && lastValidJson.content[0] && lastValidJson.content[0].text) {
                    try {
                        const content = JSON.parse(lastValidJson.content[0].text);
                        resolve(content);
                    } catch (e) {
                        resolve({ success: false, message: lastValidJson.content[0].text });
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

// Test the new workflow tools
async function testWorkflowTools() {
    console.log('🧪 Testing Smart Workflow Tools\n');
    console.log('This demonstrates how 11 workflow tools can replace 135+ individual operations\n');

    const tests = [
        {
            name: 'Create Publication Document',
            tool: 'create_publication_document',
            args: {
                name: 'Workflow Test Magazine',
                type: 'magazine',
                pages: 4,
                template: 'modern-business'
            },
            description: 'Creates a complete magazine document with proper settings, pages, and styling'
        },
        {
            name: 'Setup Document Styles',
            tool: 'setup_document_styles',
            args: {
                documentName: 'Workflow Test Magazine',
                brandColors: ['#2C3E50', '#3498DB', '#E74C3C'],
                typography: {
                    heading: 'Arial',
                    body: 'Times New Roman',
                    accent: 'Arial'
                },
                styleSystem: 'hierarchical'
            },
            description: 'Creates a complete style system with colors and typography'
        },
        {
            name: 'Create Hero Content Section',
            tool: 'create_content_section',
            args: {
                type: 'hero',
                content: 'Welcome to Our Magazine',
                position: 'top-center',
                styling: 'brand-primary'
            },
            description: 'Creates a hero section with appropriate styling and positioning'
        },
        {
            name: 'Create Body Content Section',
            tool: 'create_content_section',
            args: {
                type: 'body',
                content: 'This is the main body content of our magazine. It demonstrates how the workflow tools can create properly styled content sections with minimal user input.',
                position: 'left',
                styling: 'brand-secondary'
            },
            description: 'Creates a body text section with proper formatting'
        },
        {
            name: 'Add Visual Element',
            tool: 'add_visual_element',
            args: {
                type: 'image',
                source: '/Users/zachshallbetter/Sites/indesign-mcp-server/test-images/sample-image.jpg',
                purpose: 'content',
                size: 'medium',
                position: 'right'
            },
            description: 'Adds a visual element with appropriate sizing and positioning'
        },
        {
            name: 'Update Content Batch',
            tool: 'update_content_batch',
            args: {
                updates: [
                    { find: 'magazine', replace: 'publication' },
                    { find: 'content', replace: 'material' }
                ],
                scope: 'entire-document',
                preview: true
            },
            description: 'Updates multiple content elements in a single operation'
        },
        {
            name: 'Get Workflow Help',
            tool: 'get_workflow_help',
            args: {
                task: 'create a magazine layout',
                experience: 'beginner',
                format: 'step-by-step'
            },
            description: 'Provides contextual help for workflows'
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
                console.log(`✅ PASSED: ${result.message}`);
                passed++;
            } else {
                console.log(`❌ FAILED: ${result.message}`);
                failed++;
            }

            // Show additional details if available
            if (result.documentName) console.log(`   Document: ${result.documentName}`);
            if (result.pages) console.log(`   Pages: ${result.pages}`);
            if (result.colors) console.log(`   Colors: ${result.colors}`);
            if (result.styles) console.log(`   Styles: ${result.styles}`);
            if (result.type) console.log(`   Type: ${result.type}`);
            if (result.position) console.log(`   Position: ${result.position}`);
            if (result.updates) console.log(`   Updates: ${result.updates}`);
            if (result.successful) console.log(`   Successful: ${result.successful}`);

        } catch (error) {
            console.log(`❌ ERROR: ${error.message}`);
            failed++;
        }
    }

    console.log(`\n📊 Test Results:`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

    console.log(`\n🎯 Workflow Tools Benefits:`);
    console.log(`• Reduced from 135+ tools to 11 intuitive workflow tools`);
    console.log(`• Complete tasks in single operations instead of multiple steps`);
    console.log(`• Smart defaults and intelligent positioning`);
    console.log(`• Context-aware styling and formatting`);
    console.log(`• Better user experience and faster results`);
}

// Run the tests
testWorkflowTools().catch(console.error); 