/**
 * Root Test - Comprehensive Testing Foundation
 * Provides detailed progress tracking, font size testing, and shared functionality
 * All other tests should extend or reference this for consistency
 */
import { executeTool, getTestEnvironment } from './unified-test-runner.js';

export class RootTest {
    constructor(testName = 'Root Test') {
        this.testName = testName;
        this.testResults = {
            passed: 0,
            failed: 0,
            total: 0,
            details: []
        };
        this.startTime = Date.now();
    }

    /**
     * Log test step with detailed progress
     */
    logStep(stepNumber, totalSteps, stepName, description = '') {
        const progress = ((stepNumber / totalSteps) * 100).toFixed(1);
        const progressBar = '█'.repeat(Math.floor(progress / 2)) + '░'.repeat(50 - Math.floor(progress / 2));
        const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(1);

        console.log(`\n  📋 [${stepNumber}/${totalSteps}] ${stepName}`);
        console.log(`     [${progressBar}] ${progress}% [${elapsed}s]`);
        if (description) {
            console.log(`     ℹ️  ${description}`);
        }
    }

    /**
     * Log test result
     */
    logResult(stepNumber, totalSteps, testName, success, result = '', error = '') {
        if (success) {
            console.log(`     ✅ [${stepNumber}/${totalSteps}] ${testName}: PASSED`);
            if (result) {
                console.log(`        Result: ${result}`);
            }
            this.testResults.passed++;
        } else {
            console.log(`     ❌ [${stepNumber}/${totalSteps}] ${testName}: FAILED`);
            if (error) {
                console.log(`        Error: ${error}`);
            }
            this.testResults.failed++;
        }
        this.testResults.total++;

        // Store detailed result
        this.testResults.details.push({
            step: stepNumber,
            name: testName,
            success,
            result,
            error,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Comprehensive font size testing
     */
    async testFontSizes() {
        console.log('\n🔤 Testing Comprehensive Font Sizes...');

        const fontTests = [
            { name: 'Display Large (48pt)', fontSize: 48, style: 'Display Large', content: 'DISPLAY LARGE TEXT' },
            { name: 'Display Medium (36pt)', fontSize: 36, style: 'Display Medium', content: 'Display Medium Text' },
            { name: 'Heading 1 (24pt)', fontSize: 24, style: 'Heading 1', content: 'Heading 1 Text' },
            { name: 'Heading 2 (18pt)', fontSize: 18, style: 'Heading 2', content: 'Heading 2 Text' },
            { name: 'Heading 3 (16pt)', fontSize: 16, style: 'Heading 3', content: 'Heading 3 Text' },
            { name: 'Body Large (14pt)', fontSize: 14, style: 'Body Large', content: 'Body Large Text' },
            { name: 'Body Text (12pt)', fontSize: 12, style: 'Body Text', content: 'Body Text Content' },
            { name: 'Body Small (10pt)', fontSize: 10, style: 'Body Small', content: 'Body Small Text' },
            { name: 'Caption (9pt)', fontSize: 9, style: 'Caption', content: 'Caption Text' },
            { name: 'Footnote (8pt)', fontSize: 8, style: 'Footnote', content: 'Footnote Text' }
        ];

        for (let i = 0; i < fontTests.length; i++) {
            const test = fontTests[i];
            this.logStep(i + 1, fontTests.length, `Testing ${test.name}`, `Creating text frame with ${test.fontSize}pt font`);

            try {
                const result = await executeTool('create_text_frame', {
                    content: test.content,
                    fontSize: test.fontSize,
                    fontName: test.fontSize >= 24 ? 'Arial\\tBold' : 'Arial\\tRegular',
                    alignment: test.fontSize >= 24 ? 'CENTER' : 'LEFT',
                    paragraphStyle: test.style,
                    characterStyle: test.fontSize >= 24 ? 'Bold' : 'Italic'
                });

                this.logResult(i + 1, fontTests.length, test.name, result.success,
                    result.result || result.operation || 'Success',
                    result.result || result.error || '');
            } catch (error) {
                this.logResult(i + 1, fontTests.length, test.name, false, '', error.message);
            }
        }
    }

    /**
     * Comprehensive color testing
     */
    async testColors() {
        console.log('\n🎨 Testing Comprehensive Colors...');

        const colorTests = [
            { name: 'Primary Blue Rectangle', color: 'Primary Blue', width: 80, height: 40 },
            { name: 'Primary Blue Light Rectangle', color: 'Primary Blue Light', width: 80, height: 40 },
            { name: 'Primary Blue Dark Rectangle', color: 'Primary Blue Dark', width: 80, height: 40 },
            { name: 'Secondary Gray Rectangle', color: 'Secondary Gray', width: 80, height: 40 },
            { name: 'Secondary Gray Light Rectangle', color: 'Secondary Gray Light', width: 80, height: 40 },
            { name: 'Secondary Gray Dark Rectangle', color: 'Secondary Gray Dark', width: 80, height: 40 },
            { name: 'Accent Red Ellipse', color: 'Accent Red', width: 60, height: 60, shape: 'ellipse' },
            { name: 'Accent Green Ellipse', color: 'Accent Green', width: 60, height: 60, shape: 'ellipse' },
            { name: 'Accent Orange Ellipse', color: 'Accent Orange', width: 60, height: 60, shape: 'ellipse' }
        ];

        for (let i = 0; i < colorTests.length; i++) {
            const test = colorTests[i];
            this.logStep(i + 1, colorTests.length, `Testing ${test.name}`, `Creating ${test.shape || 'rectangle'} with ${test.color}`);

            try {
                const toolName = test.shape === 'ellipse' ? 'create_ellipse' : 'create_rectangle';
                const result = await executeTool(toolName, {
                    width: test.width,
                    height: test.height,
                    fillColor: test.color,
                    strokeColor: 'Pure Black',
                    strokeWeight: 1
                });

                this.logResult(i + 1, colorTests.length, test.name, result.success,
                    result.result || result.operation || 'Success',
                    result.result || result.error || '');
            } catch (error) {
                this.logResult(i + 1, colorTests.length, test.name, false, '', error.message);
            }
        }
    }

    /**
     * Test character styles
     */
    async testCharacterStyles() {
        console.log('\n🔤 Testing Character Styles...');

        const styleTests = [
            { name: 'Bold Text', style: 'Bold', content: 'Bold Text Sample' },
            { name: 'Italic Text', style: 'Italic', content: 'Italic Text Sample' },
            { name: 'Bold Italic Text', style: 'Bold Italic', content: 'Bold Italic Text Sample' },
            { name: 'Highlight Text', style: 'Highlight', content: 'Highlight Text Sample' },
            { name: 'Small Caps Text', style: 'Small Caps', content: 'Small Caps Text Sample' }
        ];

        for (let i = 0; i < styleTests.length; i++) {
            const test = styleTests[i];
            this.logStep(i + 1, styleTests.length, `Testing ${test.name}`, `Creating text with ${test.style} character style`);

            try {
                const result = await executeTool('create_text_frame', {
                    content: test.content,
                    fontSize: 12,
                    fontName: 'Arial\\tRegular',
                    alignment: 'LEFT',
                    paragraphStyle: 'Body Text',
                    characterStyle: test.style
                });

                this.logResult(i + 1, styleTests.length, test.name, result.success,
                    result.result || result.operation || 'Success',
                    result.result || result.error || '');
            } catch (error) {
                this.logResult(i + 1, styleTests.length, test.name, false, '', error.message);
            }
        }
    }

    /**
     * Test table creation
     */
    async testTables() {
        console.log('\n📊 Testing Table Creation...');

        const tableTests = [
            { name: 'Simple Table (3x3)', rows: 3, columns: 3, width: 150, height: 90 },
            { name: 'Header Table (4x4)', rows: 4, columns: 4, width: 200, height: 120, headerRow: true },
            { name: 'Large Table (5x5)', rows: 5, columns: 5, width: 250, height: 150, headerRow: true }
        ];

        for (let i = 0; i < tableTests.length; i++) {
            const test = tableTests[i];
            this.logStep(i + 1, tableTests.length, `Testing ${test.name}`, `Creating ${test.rows}x${test.columns} table`);

            try {
                const result = await executeTool('create_table', {
                    rows: test.rows,
                    columns: test.columns,
                    width: test.width,
                    height: test.height,
                    headerRow: test.headerRow || false
                });

                this.logResult(i + 1, tableTests.length, test.name, result.success,
                    result.result || result.operation || 'Success',
                    result.result || result.error || '');
            } catch (error) {
                this.logResult(i + 1, tableTests.length, test.name, false, '', error.message);
            }
        }
    }

    /**
     * Test resource listing
     */
    async testResources() {
        console.log('\n📋 Testing Resource Management...');

        const resourceTests = [
            { name: 'List All Resources', tool: 'list_resources', args: {} },
            { name: 'List Resource Templates', tool: 'list_resource_templates', args: {} },
            { name: 'List All Styles', tool: 'list_styles', args: {} },
            { name: 'List All Colors', tool: 'list_color_swatches', args: {} }
        ];

        for (let i = 0; i < resourceTests.length; i++) {
            const test = resourceTests[i];
            this.logStep(i + 1, resourceTests.length, `Testing ${test.name}`, `Listing ${test.name.toLowerCase()}`);

            try {
                const result = await executeTool(test.tool, test.args);

                this.logResult(i + 1, resourceTests.length, test.name, result.success,
                    result.result || result.operation || 'Success',
                    result.result || result.error || '');
            } catch (error) {
                this.logResult(i + 1, resourceTests.length, test.name, false, '', error.message);
            }
        }
    }

    /**
     * Run comprehensive test suite
     */
    async runComprehensiveTest() {
        console.log(`🚀 Starting ${this.testName} - Comprehensive Test Suite`);
        console.log('📋 Using shared test environment:', getTestEnvironment());

        const testSuites = [
            { name: 'Font Sizes', method: this.testFontSizes.bind(this) },
            { name: 'Colors', method: this.testColors.bind(this) },
            { name: 'Character Styles', method: this.testCharacterStyles.bind(this) },
            { name: 'Tables', method: this.testTables.bind(this) },
            { name: 'Resources', method: this.testResources.bind(this) }
        ];

        for (let i = 0; i < testSuites.length; i++) {
            const suite = testSuites[i];
            console.log(`\n📋 [${i + 1}/${testSuites.length}] Running ${suite.name} tests...`);
            await suite.method();
        }

        this.printFinalResults();
    }

    /**
     * Print final test results
     */
    printFinalResults() {
        const totalTime = ((Date.now() - this.startTime) / 1000).toFixed(1);
        const successRate = ((this.testResults.passed / this.testResults.total) * 100).toFixed(1);

        console.log('\n============================================================');
        console.log(`${this.testName} - Final Results`);
        console.log('============================================================');
        console.log(`⏱️  Total Time: ${totalTime}s`);
        console.log(`📊 Total Tests: ${this.testResults.total}`);
        console.log(`✅ Passed: ${this.testResults.passed}`);
        console.log(`❌ Failed: ${this.testResults.failed}`);
        console.log(`📈 Success Rate: ${successRate}%`);
        console.log('============================================================');

        if (this.testResults.failed > 0) {
            console.log('\n❌ Some tests failed. Check the details above.');
            process.exit(1);
        } else {
            console.log('\n✅ All tests passed successfully!');
            process.exit(0);
        }
    }
}

// Export for use in other tests 