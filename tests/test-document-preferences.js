#!/usr/bin/env node

/**
 * Comprehensive Document Preferences Test
 * Tests all document preference types and functionality
 * Uses unified test runner for consistency
 */

import { executeTool, getTestEnvironment } from './unified-test-runner.js';

async function testDocumentPreferences() {
    console.log('⚙️ Document Preferences Test Suite');
    console.log('Testing comprehensive document preference functionality...');

    // Get the shared test environment
    const env = getTestEnvironment();
    console.log('📋 Using shared test environment:', env);

    const tests = [
        {
            name: 'Get Document Preferences',
            tool: 'get_document_preferences',
            args: {}
        },
        {
            name: 'Set Document Preferences - Margins',
            tool: 'set_document_preferences',
            args: {
                preferenceType: 'MARGINS',
                marginTop: 20,
                marginBottom: 20,
                marginLeft: 15,
                marginRight: 15
            }
        },
        {
            name: 'Set Document Preferences - Bleed',
            tool: 'set_document_preferences',
            args: {
                preferenceType: 'BLEED',
                bleedTop: 3,
                bleedBottom: 3,
                bleedLeft: 3,
                bleedRight: 3
            }
        },
        {
            name: 'Set Document Preferences - Slug',
            tool: 'set_document_preferences',
            args: {
                preferenceType: 'SLUG',
                slugTop: 10,
                slugBottom: 10,
                slugLeft: 10,
                slugRight: 10
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
        }
    ];

    let passed = 0;
    let failed = 0;

    console.log(`\n🧪 Running ${tests.length} document preferences tests...`);

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

    console.log('\n📊 Document Preferences Test Results:');
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

    if (failed > 0) {
        console.log('\n❌ Some document preferences tests failed');
        process.exit(1);
    } else {
        console.log('\n✅ All document preferences tests passed!');
        process.exit(0);
    }
}

// Run the tests
testDocumentPreferences().catch(error => {
    console.error('❌ Document preferences test suite failed:', error);
    process.exit(1);
}); 