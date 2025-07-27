#!/usr/bin/env node

/**
 * Document and Page Test
 * Creates a document, then adds a page
 * Uses unified test runner for consistency
 */

import { executeTool, getTestEnvironment } from './unified-test-runner.js';

async function testDocumentAndPage() {
    console.log('📄 Document and Page Test Suite');
    console.log('Testing document creation and page management...');

    // Get the shared test environment
    const env = getTestEnvironment();
    console.log('📋 Using shared test environment:', env);

    const tests = [
        {
            name: 'Get Document Info',
            tool: 'get_document_info',
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
            name: 'Add Page',
            tool: 'add_page',
            args: {
                afterPage: 0
            }
        },
        {
            name: 'Navigate to New Page',
            tool: 'navigate_to_page',
            args: {
                pageIndex: 1
            }
        },
        {
            name: 'Get Updated Page Info',
            tool: 'get_page_info',
            args: {
                pageIndex: 1
            }
        }
    ];

    let passed = 0;
    let failed = 0;

    console.log(`\n🧪 Running ${tests.length} document and page tests...`);

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

    console.log('\n📊 Document and Page Test Results:');
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

    if (failed > 0) {
        console.log('\n❌ Some document and page tests failed');
        process.exit(1);
    } else {
        console.log('\n✅ All document and page tests passed!');
        process.exit(0);
    }
}

// Run the tests
testDocumentAndPage().catch(error => {
    console.error('❌ Document and page test suite failed:', error);
    process.exit(1);
}); 