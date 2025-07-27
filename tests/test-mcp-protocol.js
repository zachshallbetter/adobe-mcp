#!/usr/bin/env node

/**
 * Simple MCP Protocol Test
 * Tests basic MCP communication before running comprehensive tests
 * Uses unified test runner for consistency
 */

import { executeTool, getTestEnvironment } from './unified-test-runner.js';

async function testMCPProtocol() {
    console.log('🔗 MCP Protocol Test Suite');
    console.log('Testing basic MCP communication...');

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
        }
    ];

    let passed = 0;
    let failed = 0;

    console.log(`\n🧪 Running ${tests.length} MCP protocol tests...`);

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

    console.log('\n📊 MCP Protocol Test Results:');
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

    if (failed > 0) {
        console.log('\n❌ Some MCP protocol tests failed');
        process.exit(1);
    } else {
        console.log('\n✅ All MCP protocol tests passed!');
        process.exit(0);
    }
}

// Run the tests
testMCPProtocol().catch(error => {
    console.error('❌ MCP protocol test suite failed:', error);
    process.exit(1);
}); 