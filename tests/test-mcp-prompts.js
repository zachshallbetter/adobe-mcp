/**
 * Test Suite: MCP Prompts
 * 
 * Tests the new MCP Prompts functionality including:
 * - Prompt listing
 * - Prompt retrieval
 * - Template workflows
 * - Error handling
 */

import { executeTool } from './unified-test-runner.js';

const TEST_SUITE_NAME = 'MCP Prompts';

async function testPromptListing() {
    console.log(`\n${TEST_SUITE_NAME}: Testing Prompt Listing`);

    try {
        // Test listing prompts
        const result = await executeTool('list_prompts', {});

        if (result.success) {
            console.log('✅ Prompts listed successfully');
            console.log(`   Found ${result.prompts?.length || 0} prompts`);

            if (result.prompts && result.prompts.length > 0) {
                console.log('   Available prompts:');
                result.prompts.forEach(prompt => {
                    console.log(`   - ${prompt.name}: ${prompt.title}`);
                    console.log(`     Description: ${prompt.description}`);
                });
            }
        } else {
            console.log('❌ Failed to list prompts');
            console.log(`   Error: ${result.message}`);
        }

        return result.success;
    } catch (error) {
        console.log('❌ Error testing prompt listing');
        console.log(`   Error: ${error.message}`);
        return false;
    }
}

async function testGetPrompt() {
    console.log(`\n${TEST_SUITE_NAME}: Testing Get Prompt`);

    try {
        // Test getting a specific prompt
        const result = await executeTool('get_prompt', {
            name: 'Create Newsletter'
        });

        if (result.success && result.prompt) {
            console.log('✅ Prompt retrieved successfully');
            console.log(`   Prompt: ${result.prompt.title}`);
            console.log(`   Description: ${result.prompt.description}`);
            console.log(`   Arguments: ${result.prompt.arguments?.length || 0} arguments`);

            if (result.prompt.arguments && result.prompt.arguments.length > 0) {
                console.log('   Available arguments:');
                result.prompt.arguments.forEach(arg => {
                    console.log(`   - ${arg.name}: ${arg.description}`);
                });
            }
        } else {
            console.log('❌ Failed to get prompt');
            console.log(`   Error: ${result.message}`);
        }

        return result.success;
    } catch (error) {
        console.log('❌ Error testing get prompt');
        console.log(`   Error: ${error.message}`);
        return false;
    }
}

async function testNewsletterPrompt() {
    console.log(`\n${TEST_SUITE_NAME}: Testing Newsletter Prompt`);

    try {
        // Test getting the newsletter prompt
        const result = await executeTool('get_prompt', {
            name: 'Create Newsletter'
        });

        if (result.success && result.prompt) {
            console.log('✅ Newsletter prompt retrieved successfully');
            console.log(`   Prompt: ${result.prompt.title}`);
            console.log(`   Description: ${result.prompt.description}`);
            console.log(`   Arguments: ${result.prompt.arguments?.length || 0} arguments`);
        } else {
            console.log('❌ Failed to get newsletter prompt');
            console.log(`   Error: ${result.message}`);
        }

        return result.success;
    } catch (error) {
        console.log('❌ Error testing newsletter prompt');
        console.log(`   Error: ${error.message}`);
        return false;
    }
}

async function testBrochurePrompt() {
    console.log(`\n${TEST_SUITE_NAME}: Testing Brochure Prompt`);

    try {
        // Test getting the brochure prompt
        const result = await executeTool('get_prompt', {
            name: 'Design Brochure'
        });

        if (result.success && result.prompt) {
            console.log('✅ Brochure prompt retrieved successfully');
            console.log(`   Prompt: ${result.prompt.title}`);
            console.log(`   Description: ${result.prompt.description}`);
            console.log(`   Arguments: ${result.prompt.arguments?.length || 0} arguments`);
        } else {
            console.log('❌ Failed to get brochure prompt');
            console.log(`   Error: ${result.message}`);
        }

        return result.success;
    } catch (error) {
        console.log('❌ Error testing brochure prompt');
        console.log(`   Error: ${error.message}`);
        return false;
    }
}

async function testReportPrompt() {
    console.log(`\n${TEST_SUITE_NAME}: Testing Report Prompt`);

    try {
        // Test getting the report prompt
        const result = await executeTool('get_prompt', {
            name: 'Generate Report'
        });

        if (result.success && result.prompt) {
            console.log('✅ Report prompt retrieved successfully');
            console.log(`   Prompt: ${result.prompt.title}`);
            console.log(`   Description: ${result.prompt.description}`);
            console.log(`   Arguments: ${result.prompt.arguments?.length || 0} arguments`);
        } else {
            console.log('❌ Failed to get report prompt');
            console.log(`   Error: ${result.message}`);
        }

        return result.success;
    } catch (error) {
        console.log('❌ Error testing report prompt');
        console.log(`   Error: ${error.message}`);
        return false;
    }
}

async function testCatalogPrompt() {
    console.log(`\n${TEST_SUITE_NAME}: Testing Catalog Prompt`);

    try {
        // Test getting the catalog prompt
        const result = await executeTool('get_prompt', {
            name: 'Create Product Catalog'
        });

        if (result.success && result.prompt) {
            console.log('✅ Catalog prompt retrieved successfully');
            console.log(`   Prompt: ${result.prompt.title}`);
            console.log(`   Description: ${result.prompt.description}`);
            console.log(`   Arguments: ${result.prompt.arguments?.length || 0} arguments`);
        } else {
            console.log('❌ Failed to get catalog prompt');
            console.log(`   Error: ${result.message}`);
        }

        return result.success;
    } catch (error) {
        console.log('❌ Error testing catalog prompt');
        console.log(`   Error: ${error.message}`);
        return false;
    }
}

async function testFlyerPrompt() {
    console.log(`\n${TEST_SUITE_NAME}: Testing Flyer Prompt`);

    try {
        // Test getting the flyer prompt
        const result = await executeTool('get_prompt', {
            name: 'Design Flyer'
        });

        if (result.success && result.prompt) {
            console.log('✅ Flyer prompt retrieved successfully');
            console.log(`   Prompt: ${result.prompt.title}`);
            console.log(`   Description: ${result.prompt.description}`);
            console.log(`   Arguments: ${result.prompt.arguments?.length || 0} arguments`);
        } else {
            console.log('❌ Failed to get flyer prompt');
            console.log(`   Error: ${result.message}`);
        }

        return result.success;
    } catch (error) {
        console.log('❌ Error testing flyer prompt');
        console.log(`   Error: ${error.message}`);
        return false;
    }
}

async function testBusinessCardPrompt() {
    console.log(`\n${TEST_SUITE_NAME}: Testing Business Card Prompt`);

    try {
        // Test getting the business card prompt
        const result = await executeTool('get_prompt', {
            name: 'Create Business Card'
        });

        if (result.success && result.prompt) {
            console.log('✅ Business card prompt retrieved successfully');
            console.log(`   Prompt: ${result.prompt.title}`);
            console.log(`   Description: ${result.prompt.description}`);
            console.log(`   Arguments: ${result.prompt.arguments?.length || 0} arguments`);
        } else {
            console.log('❌ Failed to get business card prompt');
            console.log(`   Error: ${result.message}`);
        }

        return result.success;
    } catch (error) {
        console.log('❌ Error testing business card prompt');
        console.log(`   Error: ${error.message}`);
        return false;
    }
}

async function testPosterPrompt() {
    console.log(`\n${TEST_SUITE_NAME}: Testing Poster Prompt`);

    try {
        // Test getting the poster prompt
        const result = await executeTool('get_prompt', {
            name: 'Design Poster'
        });

        if (result.success && result.prompt) {
            console.log('✅ Poster prompt retrieved successfully');
            console.log(`   Prompt: ${result.prompt.title}`);
            console.log(`   Description: ${result.prompt.description}`);
            console.log(`   Arguments: ${result.prompt.arguments?.length || 0} arguments`);
        } else {
            console.log('❌ Failed to get poster prompt');
            console.log(`   Error: ${result.message}`);
        }

        return result.success;
    } catch (error) {
        console.log('❌ Error testing poster prompt');
        console.log(`   Error: ${error.message}`);
        return false;
    }
}

async function testBookletPrompt() {
    console.log(`\n${TEST_SUITE_NAME}: Testing Booklet Prompt`);

    try {
        // Test getting the booklet prompt
        const result = await executeTool('get_prompt', {
            name: 'Create Booklet'
        });

        if (result.success && result.prompt) {
            console.log('✅ Booklet prompt retrieved successfully');
            console.log(`   Prompt: ${result.prompt.title}`);
            console.log(`   Description: ${result.prompt.description}`);
            console.log(`   Arguments: ${result.prompt.arguments?.length || 0} arguments`);
        } else {
            console.log('❌ Failed to get booklet prompt');
            console.log(`   Error: ${result.message}`);
        }

        return result.success;
    } catch (error) {
        console.log('❌ Error testing booklet prompt');
        console.log(`   Error: ${error.message}`);
        return false;
    }
}

async function testErrorHandling() {
    console.log(`\n${TEST_SUITE_NAME}: Testing Error Handling`);

    try {
        // Test getting non-existent prompt
        const result = await executeTool('get_prompt', {
            name: 'NonExistentPrompt'
        });

        if (!result.success) {
            console.log('✅ Error handling working correctly');
            console.log(`   Expected error for non-existent prompt`);
        } else {
            console.log('❌ Error handling not working as expected');
            console.log(`   Should have failed for non-existent prompt`);
        }

        return !result.success; // Should fail for non-existent prompt
    } catch (error) {
        console.log('✅ Error handling working correctly');
        console.log(`   Expected error for non-existent prompt`);
        return true;
    }
}

async function runMCPPromptsTests() {
    console.log('============================================================');
    console.log('Starting MCP Prompts Test Suite');
    console.log('============================================================');

    const tests = [
        testPromptListing,
        testGetPrompt,
        testNewsletterPrompt,
        testBrochurePrompt,
        testReportPrompt,
        testCatalogPrompt,
        testFlyerPrompt,
        testBusinessCardPrompt,
        testPosterPrompt,
        testBookletPrompt,
        testErrorHandling
    ];

    let passed = 0;
    let failed = 0;

    for (const test of tests) {
        try {
            const result = await test();
            if (result) {
                passed++;
            } else {
                failed++;
            }
        } catch (error) {
            console.log(`❌ Test failed with error: ${error.message}`);
            failed++;
        }
    }

    console.log('\n============================================================');
    console.log('MCP Prompts Test Results:');
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📊 Total: ${passed + failed}`);
    console.log('============================================================');

    return { passed, failed, total: passed + failed };
}

// Export for use in main test runner
export { runMCPPromptsTests };

// Run directly if this file is executed
if (import.meta.url === `file://${process.argv[1]}`) {
    runMCPPromptsTests().then(result => {
        process.exit(result.failed > 0 ? 1 : 0);
    }).catch(error => {
        console.error('Test suite failed:', error);
        process.exit(1);
    });
} 