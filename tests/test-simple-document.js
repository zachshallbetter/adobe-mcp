#!/usr/bin/env node

/**
 * Simple Document Test
 * Tests basic document creation and activation
 * Uses unified test runner for consistency
 */

import { executeTool, getTestEnvironment } from './unified-test-runner.js';

async function testSimpleDocument() {
    console.log('📄 Simple Document Test Suite');
    console.log('Testing basic document creation and activation...');

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
            name: 'Create Document',
            tool: 'create_document',
            args: {
                name: 'Simple Test Document',
                width: 210,
                height: 297
            }
        },
        {
            name: 'Get Document Info',
            tool: 'get_document_info',
            args: {}
        },
        {
            name: 'Save Document',
            tool: 'save_document',
            args: {
                filePath: '/tmp/test-document.indd'
            }
        },
        {
            name: 'Close Document',
            tool: 'close_document',
            args: {}
        }
    ];

    let passed = 0;
    let failed = 0;

    console.log(`\n🧪 Running ${tests.length} simple document tests...`);

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

    console.log('\n📊 Simple Document Test Results:');
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

    if (failed > 0) {
        console.log('\n❌ Some simple document tests failed');
        process.exit(1);
    } else {
        console.log('\n✅ All simple document tests passed!');
        process.exit(0);
    }
}

// Run the tests
testSimpleDocument().catch(error => {
    console.error('❌ Simple document test suite failed:', error);
    process.exit(1);
}); 