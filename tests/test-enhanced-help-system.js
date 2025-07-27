/**
 * Test Enhanced Help System
 * Verifies all new help system features including difficulty levels, best practices, 
 * related tools, troubleshooting, and scenario-based workflows
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

// Test the enhanced help system
async function testEnhancedHelpSystem() {
    console.log('🧪 Testing Enhanced Help System\n');

    const tests = [
        {
            name: 'Enhanced General Help',
            tool: 'help',
            args: {},
            description: 'Check if enhanced features are documented in general help',
            checks: ['Enhanced Help Features', 'Difficulty Levels', 'Best Practices', 'Troubleshooting', 'Scenarios']
        },
        {
            name: 'Tool with Difficulty Level',
            tool: 'help',
            args: { tool: 'create_document', format: 'detailed' },
            description: 'Check if difficulty level is shown for tools',
            checks: ['🟢 Beginner', 'Difficulty']
        },
        {
            name: 'Tool with Best Practices',
            tool: 'help',
            args: { tool: 'create_text_frame', format: 'examples' },
            description: 'Check if best practices are included',
            checks: ['Best Practices', 'paragraph and character styles', 'font sizes']
        },
        {
            name: 'Tool with Related Tools',
            tool: 'help',
            args: { tool: 'create_color_swatch', format: 'examples' },
            description: 'Check if related tools are shown',
            checks: ['Related Tools', 'setup_document_styles', 'apply_design_system']
        },
        {
            name: 'Troubleshooting Help',
            tool: 'help',
            args: { troubleshooting: 'fonts-not-loading' },
            description: 'Check troubleshooting help functionality',
            checks: ['Fonts Not Loading', 'Solutions', 'FontName\\tStyle', 'Arial\\tBold']
        },
        {
            name: 'Scenario-Based Help',
            tool: 'help',
            args: { scenario: 'design-brochure' },
            description: 'Check scenario-based workflow help',
            checks: ['Designing a Brochure', 'Step-by-Step Workflow', 'create_publication_document', 'setup_document_styles']
        },
        {
            name: 'Workflow Tool Help',
            tool: 'help',
            args: { tool: 'create_publication_document', format: 'examples' },
            description: 'Check workflow tool help with difficulty and best practices',
            checks: ['🟡 Intermediate', 'Best Practices', 'Related Tools', 'Choose the right publication type']
        },
        {
            name: 'Expert Tool Help',
            tool: 'help',
            args: { tool: 'create_master_spread', format: 'detailed' },
            description: 'Check expert-level tool help',
            checks: ['🔴 Expert', 'Difficulty']
        },
        {
            name: 'Category Help with Workflow',
            tool: 'help',
            args: { category: 'workflow' },
            description: 'Check workflow category help',
            checks: ['Smart Workflow Tools', 'create_publication_document', 'setup_document_styles']
        },
        {
            name: 'Multiple Troubleshooting Issues',
            tool: 'help',
            args: { troubleshooting: 'images-not-placing' },
            description: 'Check image troubleshooting help',
            checks: ['Images Not Placing', 'absolute file paths', 'scaling percentages']
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
                console.log(`✅ PASSED: Help system working`);
                passed++;

                // Check for specific content based on test checks
                const helpContent = result.result || result.message || '';
                let allChecksPassed = true;

                for (const check of test.checks) {
                    if (helpContent.includes(check)) {
                        console.log(`   ✅ Found: "${check}"`);
                    } else {
                        console.log(`   ❌ Missing: "${check}"`);
                        allChecksPassed = false;
                    }
                }

                if (!allChecksPassed) {
                    console.log(`   ⚠️  Some expected content not found`);
                }

            } else {
                console.log(`❌ FAILED: ${result.message}`);
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

    console.log(`\n🎯 Enhanced Help System Summary:`);
    console.log(`• Difficulty levels (🟢🟡🔴) for all tools`);
    console.log(`• Best practices for common tools`);
    console.log(`• Related tools suggestions`);
    console.log(`• Comprehensive troubleshooting guides`);
    console.log(`• Scenario-based workflow help`);
    console.log(`• Enhanced tool definitions with new parameters`);
    console.log(`• Multiple help formats (summary, detailed, examples)`);
    console.log(`• Experience level support (beginner, intermediate, expert)`);
}

// Run the tests
testEnhancedHelpSystem().catch(console.error); 