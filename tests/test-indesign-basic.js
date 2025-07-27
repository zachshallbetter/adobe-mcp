#!/usr/bin/env node

/**
 * Basic InDesign Test
 * Tests if InDesign is accessible and can execute basic commands
 * Uses unified test runner for consistency
 */

import { executeTool, getTestEnvironment } from './unified-test-runner.js';

async function testInDesignBasic() {
    console.log('🎨 InDesign Basic Test Suite');
    console.log('Testing basic InDesign accessibility and commands...');

    // Get the shared test environment
    const env = getTestEnvironment();
    console.log('📋 Using shared test environment:', env);

    const tests = [
        {
            name: 'Get Session Info',
            tool: 'get_session_info',
            args: {}
        },
        {
            name: 'Get Document Info',
            tool: 'get_document_info',
            args: {}
        },
        {
            name: 'List Color Swatches',
            tool: 'list_color_swatches',
            args: {}
        },
        {
            name: 'List Styles',
            tool: 'list_styles',
            args: {}
        },
        {
            name: 'Get Page Info',
            tool: 'get_page_info',
            args: {
                pageIndex: 0
            }
        },
        {
            name: 'Navigate to Page',
            tool: 'navigate_to_page',
            args: {
                pageIndex: 0
            }
        }
    ];

    let passed = 0;
    let failed = 0;

    console.log(`\n🧪 Running ${tests.length} InDesign basic tests...`);

    for (let i = 0; i < tests.length; i++) {
        const test = tests[i];
        const testNumber = i + 1;
        const totalTests = tests.length;

        console.log(`\n  📋 [${testNumber}/${totalTests}] Testing: ${test.name}`);

        try {
            const result = await executeTool(test.tool, test.args);

            if (result.success) {
                console.log(`    ✅ [${testNumber}/${totalTests}] ${test.name}: PASSED`);
                const operation = result.result || result.operation || 'Success';
                console.log(`       Result: ${operation}`);
                passed++;
            } else {
                console.log(`    ❌ [${testNumber}/${totalTests}] ${test.name}: FAILED`);
                const error = result.result || result.error || 'Unknown error';
                console.log(`       Error: ${error}`);
                failed++;
            }
        } catch (error) {
            console.log(`    ❌ [${testNumber}/${totalTests}] ${test.name}: ERROR`);
            console.log(`       Error: ${error.message}`);
            failed++;
        }
    }

    console.log('\n📊 InDesign Basic Test Results:');
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

    if (failed > 0) {
        console.log('\n❌ Some InDesign basic tests failed');
        process.exit(1);
    } else {
        console.log('\n✅ All InDesign basic tests passed!');
        process.exit(0);
    }
}

// Run the tests
testInDesignBasic().catch(error => {
    console.error('❌ InDesign basic test suite failed:', error);
    process.exit(1);
}); 