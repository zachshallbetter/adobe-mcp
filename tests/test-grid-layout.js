#!/usr/bin/env node

/**
 * Test Grid and Layout Tools
 * Tests the new comprehensive grid and layout functionality
 * Uses unified test runner for consistency
 */

import { executeTool, getTestEnvironment } from './unified-test-runner.js';

async function testGridAndLayoutTools() {
    console.log('📐 Grid and Layout Test Suite');
    console.log('Testing comprehensive grid and layout functionality...');

    // Get the shared test environment
    const env = getTestEnvironment();
    console.log('📋 Using shared test environment:', env);

    const tests = [
        {
            name: 'Get Document Grid Settings',
            tool: 'get_document_grid_settings',
            args: {}
        },
        {
            name: 'Set Document Grid Settings',
            tool: 'set_document_grid_settings',
            args: {
                documentGridIncrement: 12,
                documentGridSubdivision: 4,
                gridViewThreshold: 50,
                baselineGridIncrement: 12,
                baselineGridOffset: 0
            }
        },
        {
            name: 'Get Document Layout Preferences',
            tool: 'get_document_layout_preferences',
            args: {}
        },
        {
            name: 'Set Document Layout Preferences',
            tool: 'set_document_layout_preferences',
            args: {
                facingPages: true,
                pageNumbering: 'section',
                startPageNumber: 1
            }
        },
        {
            name: 'Get Document Preferences - Grid',
            tool: 'get_document_preferences',
            args: {
                preferenceType: 'GRID'
            }
        },
        {
            name: 'Set Document Preferences - Grid',
            tool: 'set_document_preferences',
            args: {
                preferenceType: 'GRID',
                documentGridIncrement: 12,
                documentGridSubdivision: 4,
                baselineGridIncrement: 12
            }
        }
    ];

    let passed = 0;
    let failed = 0;

    console.log(`\n🧪 Running ${tests.length} grid and layout tests...`);

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

    console.log('\n📊 Grid and Layout Test Results:');
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

    if (failed > 0) {
        console.log('\n❌ Some grid and layout tests failed');
        process.exit(1);
    } else {
        console.log('\n✅ All grid and layout tests passed!');
        process.exit(0);
    }
}

// Run the tests
testGridAndLayoutTools().catch(error => {
    console.error('❌ Grid and layout test suite failed:', error);
    process.exit(1);
}); 