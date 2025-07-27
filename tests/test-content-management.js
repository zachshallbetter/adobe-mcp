/**
 * Content Management Test Suite
 * Tests text, graphics, styles, colors, and table management
 * Uses the shared test environment for efficiency
 */
import { executeTool, getTestEnvironment } from './unified-test-runner.js';

async function runContentManagementTests() {
    console.log('🎨 Content Management Test Suite');
    console.log('Testing text, graphics, styles, colors, and table management...');

    // Get the shared test environment
    const env = getTestEnvironment();
    console.log('📋 Using shared test environment:', env);

    const tests = [
        {
            name: 'Create Text Frame with Style',
            tool: 'create_text_frame',
            args: {
                content: 'This is a styled text frame using the shared environment.',
                fontSize: 14,
                fontName: 'Arial\\tRegular',
                alignment: 'LEFT',
                paragraphStyle: 'Body Text',
                characterStyle: 'Bold'
            }
        },
        {
            name: 'Create Rectangle with Color',
            tool: 'create_rectangle',
            args: {
                width: 80,
                height: 40,
                fillColor: 'Primary Blue',
                strokeColor: 'Secondary Gray',
                strokeWeight: 2
            }
        },
        {
            name: 'Create Table',
            tool: 'create_table',
            args: {
                rows: 4,
                columns: 3,
                width: 150,
                height: 100,
                headerRow: true
            }
        },
        {
            name: 'Create Ellipse',
            tool: 'create_ellipse',
            args: {
                width: 60,
                height: 60,
                fillColor: 'Accent Red',
                strokeColor: 'None'
            }
        },
        {
            name: 'List Styles',
            tool: 'list_styles',
            args: {}
        },
        {
            name: 'List Color Swatches',
            tool: 'list_color_swatches',
            args: {}
        }
    ];

    let passed = 0;
    let failed = 0;

    for (const test of tests) {
        try {
            console.log(`\n🧪 Testing: ${test.name}`);

            const result = await executeTool(test.tool, test.args);

            if (result.success) {
                console.log(`✅ ${test.name}: PASSED`);
                console.log(`   Result: ${result.result || result.operation || 'Success'}`);
                passed++;
            } else {
                console.log(`❌ ${test.name}: FAILED`);
                console.log(`   Error: ${result.result || result.error || 'Unknown error'}`);
                failed++;
            }
        } catch (error) {
            console.log(`❌ ${test.name}: ERROR`);
            console.log(`   Error: ${error.message}`);
            failed++;
        }
    }

    console.log('\n📊 Content Management Test Results:');
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

    if (failed > 0) {
        console.log('\n❌ Some content management tests failed');
        process.exit(1);
    } else {
        console.log('\n✅ All content management tests passed!');
        process.exit(0);
    }
}

// Run the tests
runContentManagementTests().catch(error => {
    console.error('❌ Content management test suite failed:', error);
    process.exit(1);
}); 