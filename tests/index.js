/**
 * Master Test Suite for InDesign MCP Server
 * Runs all test suites with proper setup and teardown
 */
import { testSetup } from './test-setup.js';
import { runTestSuite } from './unified-test-runner.js';

// Test suite definitions with categories and descriptions
const TEST_SUITES = {
    'Basic Connectivity': {
        description: 'Tests basic InDesign connectivity and MCP protocol',
        category: 'connectivity',
        tests: ['test-mcp-protocol.js', 'test-indesign-basic.js'],
        required: true
    },
    'Document Foundation': {
        description: 'Tests basic document creation and management',
        category: 'document',
        tests: ['test-simple-document.js', 'test-document-and-page.js'],
        required: true
    },
    'Document Preferences': {
        description: 'Tests comprehensive document preferences functionality',
        category: 'document',
        tests: ['test-document-preferences.js'],
        required: true
    },
    'Grid and Layout': {
        description: 'Tests grid settings and layout preferences',
        category: 'layout',
        tests: ['test-grid-layout.js'],
        required: true
    },
    'Content Management': {
        description: 'Tests text, graphics, styles, colors, and table management',
        category: 'content',
        tests: ['test-content-management.js'],
        required: false
    },
    'PageItem and Group': {
        description: 'Tests PageItem and Group management functionality',
        category: 'advanced',
        tests: ['test-pageitem-group.js'],
        required: false
    },
    'Bounds and Validation': {
        description: 'Tests bounds checking and validation functionality',
        category: 'validation',
        tests: ['test-bounds-checking.js'],
        required: false
    },
    'Image Handling': {
        description: 'Tests image placement and manipulation',
        category: 'graphics',
        tests: ['test-image-assets.js', 'test-real-image.js'],
        required: false
    },
    'Swatches and Backgrounds': {
        description: 'Tests color swatches and page backgrounds',
        category: 'styling',
        tests: ['test-swatches-and-backgrounds.js'],
        required: false
    },
    'Error Handling': {
        description: 'Tests error handling and edge cases',
        category: 'validation',
        tests: ['test-error-handling.js'],
        required: false
    },
    'Enhanced Functionality': {
        description: 'Tests enhanced features and advanced functionality',
        category: 'advanced',
        tests: ['test-enhanced-functionality.js'],
        required: false
    },
    'Advanced Features': {
        description: 'Tests advanced InDesign features and capabilities',
        category: 'advanced',
        tests: ['test-advanced-features.js'],
        required: false
    },
    'Standard Document': {
        description: 'Tests standard document creation and management',
        category: 'document',
        tests: ['test-standard-document.js'],
        required: false
    },
    'Basic Workflow': {
        description: 'Tests basic workflow automation',
        category: 'workflow',
        tests: ['test-basic-workflow.js'],
        required: false
    },
    'Workflow Tools': {
        description: 'Tests smart workflow tools',
        category: 'workflow',
        tests: ['test-workflow-tools.js', 'test-workflow-simple.js'],
        required: false
    },
    'Help System': {
        description: 'Tests help system functionality',
        category: 'help',
        tests: ['test-help-system.js', 'test-enhanced-help-system.js'],
        required: false
    },
    'Multi-Format Colors': {
        description: 'Tests multi-format color support',
        category: 'styling',
        tests: ['test-multi-format-colors.js'],
        required: false
    },
    'MCP Resources': {
        description: 'Tests MCP Resources functionality',
        category: 'mcp',
        tests: ['test-mcp-resources.js'],
        required: false
    },
    'MCP Prompts': {
        description: 'Tests MCP Prompts functionality',
        category: 'mcp',
        tests: ['test-mcp-prompts.js'],
        required: false
    }
};

// Handler coverage mapping
const HANDLER_COVERAGE = {
    'DocumentHandlers': {
        tested: ['test-simple-document.js', 'test-document-and-page.js', 'test-document-preferences.js', 'test-standard-document.js'],
        tools: [
            'create_document', 'close_document', 'save_document', 'open_document',
            'create_page', 'delete_page', 'navigate_to_page', 'get_page_info',
            'set_document_preferences', 'get_document_preferences', 'set_grid_preferences', 'get_grid_preferences',
            'create_master_spread', 'apply_master_spread'
        ]
    },
    'TextHandlers': {
        tested: ['test-content-management.js', 'test-bounds-checking.js'],
        tools: [
            'create_text_frame', 'edit_text', 'set_text_properties', 'get_text_properties',
            'create_table', 'edit_table', 'set_table_properties', 'get_table_properties'
        ]
    },
    'GraphicsHandlers': {
        tested: ['test-image-assets.js', 'test-real-image.js', 'test-content-management.js'],
        tools: [
            'place_image', 'resize_image', 'move_image', 'rotate_image',
            'create_rectangle', 'create_ellipse', 'create_polygon', 'create_line'
        ]
    },
    'StyleHandlers': {
        tested: ['test-content-management.js', 'test-multi-format-colors.js'],
        tools: [
            'create_paragraph_style', 'create_character_style', 'apply_paragraph_style', 'apply_character_style',
            'create_color_swatch', 'list_color_swatches', 'delete_color_swatch'
        ]
    },
    'WorkflowHandlers': {
        tested: ['test-workflow-tools.js', 'test-workflow-simple.js'],
        tools: [
            'create_newsletter', 'design_brochure', 'create_business_card', 'design_poster',
            'create_flyer', 'design_catalog', 'create_annual_report', 'design_magazine',
            'create_presentation', 'design_booklet', 'create_brand_guidelines'
        ]
    },
    'ResourceHandlers': {
        tested: ['test-mcp-resources.js'],
        tools: [
            'list_resources', 'list_resource_templates', 'read_resource'
        ]
    },
    'PromptHandlers': {
        tested: ['test-mcp-prompts.js'],
        tools: [
            'list_prompts', 'get_prompt'
        ]
    }
};

async function runMasterTestSuite() {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();

    console.log(`🚀 [${timestamp}] InDesign MCP Server - Master Test Suite`);
    console.log(`ℹ️ [${timestamp}] Server Path: ${process.cwd()}/src/index.js`);
    console.log(`ℹ️ [${timestamp}] Total Test Suites: ${Object.keys(TEST_SUITES).length}`);

    const allTests = Object.values(TEST_SUITES).flatMap(suite => suite.tests);
    console.log(`ℹ️ [${timestamp}] Total Tests: ${allTests.length}`);

    // Parse command line arguments
    const args = process.argv.slice(2);
    const testCategory = args.find(arg => arg.startsWith('--'))?.substring(2);
    const runRequiredOnly = args.includes('--required');
    const runContentOnly = args.includes('--content');
    const runAdvancedOnly = args.includes('--advanced');
    const runMCPOnly = args.includes('--mcp');

    // Filter test suites based on arguments
    let suitesToRun = Object.entries(TEST_SUITES);

    if (runRequiredOnly) {
        suitesToRun = suitesToRun.filter(([_, suite]) => suite.required);
    } else if (runContentOnly) {
        suitesToRun = suitesToRun.filter(([_, suite]) => suite.category === 'content');
    } else if (runAdvancedOnly) {
        suitesToRun = suitesToRun.filter(([_, suite]) => suite.category === 'advanced');
    } else if (runMCPOnly) {
        suitesToRun = suitesToRun.filter(([_, suite]) => suite.category === 'mcp');
    } else if (testCategory) {
        suitesToRun = suitesToRun.filter(([_, suite]) => suite.category === testCategory);
    }

    console.log(`ℹ️ [${timestamp}] Running ${suitesToRun.length} test suites`);

    // Initialize test environment once
    console.log(`📋 [${timestamp}] Initializing shared test environment...`);
    const setupSuccess = await testSetup.initialize();

    if (!setupSuccess) {
        console.error(`❌ [${timestamp}] Failed to initialize test environment. Aborting tests.`);
        process.exit(1);
    }

    const environmentInfo = testSetup.getEnvironmentInfo();
    console.log(`ℹ️ [${timestamp}] Test environment ready:`, environmentInfo);

    let passedTests = 0;
    let failedTests = 0;
    let totalTests = 0;

    // Run each test suite
    for (let i = 0; i < suitesToRun.length; i++) {
        const [suiteName, suiteConfig] = suitesToRun[i];
        totalTests += suiteConfig.tests.length;

        console.log(`📋 [${timestamp}] \n${suiteName}`);
        console.log(`ℹ️ [${timestamp}] Description: ${suiteConfig.description}`);
        console.log(`ℹ️ [${timestamp}] Category: ${suiteConfig.category}`);
        console.log(`ℹ️ [${timestamp}] Tests: ${suiteConfig.tests.join(', ')}`);
        console.log(`ℹ️ [${timestamp}] Required: ${suiteConfig.required ? 'Yes' : 'No'}`);

        const progress = ((i + 1) / suitesToRun.length * 100).toFixed(1);
        const progressBar = '█'.repeat(Math.floor(progress / 2)) + '░'.repeat(50 - Math.floor(progress / 2));
        console.log(`[${progressBar}] ${progress}% (${i + 1}/${suitesToRun.length}) Running: ${suiteName} [${((Date.now() - startTime) / 1000).toFixed(1)}s]`);

        try {
            const result = await runTestSuite(suiteConfig.tests, environmentInfo);

            if (result.success) {
                console.log(`✅ [${timestamp}] ${suiteName}: ✅ PASSED`);
                passedTests += suiteConfig.tests.length;
            } else {
                console.log(`❌ [${timestamp}] ${suiteName}: ❌ FAILED`);
                failedTests += suiteConfig.tests.length;
            }
        } catch (error) {
            console.log(`❌ [${timestamp}] ${suiteName}: ❌ ERROR - ${error.message}`);
            failedTests += suiteConfig.tests.length;
        }
    }

    // Final summary
    const endTime = Date.now();
    const totalTime = (endTime - startTime) / 1000;

    console.log(`\n📊 [${timestamp}] Test Summary`);
    console.log(`ℹ️ [${timestamp}] Total Time: ${totalTime.toFixed(1)}s`);
    console.log(`ℹ️ [${timestamp}] Tests Passed: ${passedTests}`);
    console.log(`ℹ️ [${timestamp}] Tests Failed: ${failedTests}`);
    console.log(`ℹ️ [${timestamp}] Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

    // Cleanup test environment
    console.log(`\n🧹 [${timestamp}] Cleaning up test environment...`);
    await testSetup.cleanup();

    if (failedTests > 0) {
        console.log(`\n❌ [${timestamp}] Some tests failed. Check the output above for details.`);
        process.exit(1);
    } else {
        console.log(`\n✅ [${timestamp}] All tests passed successfully!`);
        process.exit(0);
    }
}

// Run the master test suite
runMasterTestSuite().catch(error => {
    console.error('❌ Master test suite failed:', error);
    process.exit(1);
}); 