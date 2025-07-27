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
            name: 'Create Text Frame with Display Large Style',
            tool: 'create_text_frame',
            args: {
                content: 'This is a display large text frame using the shared environment.',
                fontSize: 48,
                fontName: 'Arial\\tBold',
                alignment: 'CENTER',
                paragraphStyle: 'Display Large',
                characterStyle: 'Bold'
            }
        },
        {
            name: 'Create Text Frame with Body Text Style',
            tool: 'create_text_frame',
            args: {
                content: 'This is a body text frame with regular styling.',
                fontSize: 12,
                fontName: 'Arial\\tRegular',
                alignment: 'LEFT',
                paragraphStyle: 'Body Text',
                characterStyle: 'Italic'
            }
        },
        {
            name: 'Create Rectangle with Primary Blue',
            tool: 'create_rectangle',
            args: {
                width: 100,
                height: 60,
                fillColor: 'Primary Blue',
                strokeColor: 'Secondary Gray',
                strokeWeight: 2
            }
        },
        {
            name: 'Create Ellipse with Accent Red',
            tool: 'create_ellipse',
            args: {
                width: 80,
                height: 80,
                fillColor: 'Accent Red',
                strokeColor: 'Pure Black',
                strokeWeight: 1
            }
        },
        {
            name: 'Create Table with Header',
            tool: 'create_table',
            args: {
                rows: 5,
                columns: 4,
                width: 200,
                height: 120,
                headerRow: true
            }
        },
        {
            name: 'Create Text Frame with Caption Style',
            tool: 'create_text_frame',
            args: {
                content: 'This is a caption text frame with small italic text.',
                fontSize: 9,
                fontName: 'Arial\\tItalic',
                alignment: 'CENTER',
                paragraphStyle: 'Caption',
                characterStyle: 'Italic'
            }
        },
        {
            name: 'Create Rectangle with Gradient Colors',
            tool: 'create_rectangle',
            args: {
                width: 120,
                height: 40,
                fillColor: 'Primary Blue Light',
                strokeColor: 'Primary Blue Dark',
                strokeWeight: 3
            }
        },
        {
            name: 'List All Styles',
            tool: 'list_styles',
            args: {}
        },
        {
            name: 'List All Color Swatches',
            tool: 'list_color_swatches',
            args: {}
        }
    ];

    let passed = 0;
    let failed = 0;

    console.log(`\n🧪 Running ${tests.length} content management tests...`);

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