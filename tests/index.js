#!/usr/bin/env node

/**
 * InDesign MCP Server - Master Test Suite
 * Organized test structure with clear categorization
 */

import { runTestSuite } from './core/unified-test-runner.js';

// Test suite configuration
const TEST_SUITES = {
    // Required Test Suites (Core Functionality)
    required: [
        // Basic Connectivity
        {
            name: 'Basic Connectivity',
            description: 'Tests MCP protocol communication and InDesign accessibility',
            category: 'connectivity',
            tests: [
                './basic/test-mcp-protocol.js',
                './basic/test-indesign-basic.js'
            ],
            required: true
        },
        // Document Foundation
        {
            name: 'Document Foundation',
            description: 'Tests basic document creation and management',
            category: 'document',
            tests: [
                './basic/test-simple-document.js',
                './document/test-document-and-page.js'
            ],
            required: true
        },
        // Document Preferences
        {
            name: 'Document Preferences',
            description: 'Tests comprehensive document preferences functionality',
            category: 'document',
            tests: [
                './document/test-document-preferences.js'
            ],
            required: true
        },
        // Grid and Layout
        {
            name: 'Grid and Layout',
            description: 'Tests grid settings and layout preferences',
            category: 'layout',
            tests: [
                './document/test-grid-layout.js'
            ],
            required: true
        }
    ],

    // Optional Test Suites (Advanced Functionality)
    optional: [
        // Content Management
        {
            name: 'Content Management',
            description: 'Tests text, graphics, styles, colors, and table management',
            category: 'content',
            tests: [
                './content/test-content-management.js'
            ],
            required: false
        },
        // PageItem and Group
        {
            name: 'PageItem and Group',
            description: 'Tests PageItem and Group management functionality',
            category: 'advanced',
            tests: [
                './advanced/test-pageitem-group.js'
            ],
            required: false
        },
        // Advanced Features
        {
            name: 'Advanced Features',
            description: 'Tests master spreads, spreads, layers, export, and utility functions',
            category: 'advanced',
            tests: [
                './advanced/test-advanced-features.js'
            ],
            required: false
        },
        // Standard Document
        {
            name: 'Standard Document',
            description: 'Tests creating a complete document with proper layout and styling',
            category: 'content',
            tests: [
                './content/test-standard-document.js'
            ],
            required: false
        },
        // Basic Workflow
        {
            name: 'Basic Workflow',
            description: 'Tests essential workflow operations',
            category: 'workflow',
            tests: [
                './workflow/test-basic-workflow.js'
            ],
            required: false
        },
        // Enhanced Functionality
        {
            name: 'Enhanced Functionality',
            description: 'Tests session management, smart positioning, and new features',
            category: 'advanced',
            tests: [
                './advanced/test-enhanced-functionality.js'
            ],
            required: false
        },
        // MCP Resources
        {
            name: 'MCP Resources',
            description: 'Tests MCP resources functionality',
            category: 'mcp',
            tests: [
                './mcp/test-mcp-resources.js'
            ],
            required: false
        },
        // MCP Prompts
        {
            name: 'MCP Prompts',
            description: 'Tests MCP prompts functionality',
            category: 'mcp',
            tests: [
                './mcp/test-mcp-prompts.js'
            ],
            required: false
        },
        // Graphics and Images
        {
            name: 'Graphics and Images',
            description: 'Tests image processing, color management, and graphics functionality',
            category: 'graphics',
            tests: [
                './graphics/test-image-assets.js',
                './graphics/test-real-image.js',
                './graphics/test-swatches-and-backgrounds.js',
                './graphics/test-multi-format-colors.js'
            ],
            required: false
        },
        // Help System
        {
            name: 'Help System',
            description: 'Tests help system functionality',
            category: 'help',
            tests: [
                './help/test-help-system.js',
                './help/test-enhanced-help-system.js'
            ],
            required: false
        },
        // Validation
        {
            name: 'Validation',
            description: 'Tests error handling and bounds checking',
            category: 'validation',
            tests: [
                './validation/test-error-handling.js',
                './validation/test-bounds-checking.js'
            ],
            required: false
        },
        // Workflow Tools
        {
            name: 'Workflow Tools',
            description: 'Tests workflow tool functionality',
            category: 'workflow',
            tests: [
                './workflow/test-workflow-simple.js',
                './workflow/test-workflow-tools.js'
            ],
            required: false
        },
        // Comprehensive
        {
            name: 'Comprehensive',
            description: 'All-in-one comprehensive test suite',
            category: 'comprehensive',
            tests: [
                './comprehensive/test-comprehensive.js'
            ],
            required: false
        },
        // CLI Interface
        {
            name: 'CLI Interface',
            description: 'Tests CLI interface functionality and commands',
            category: 'cli',
            tests: [
                './cli/test-cli-interface.js'
            ],
            required: false
        },
        // Server Lifecycle
        {
            name: 'Server Lifecycle',
            description: 'Tests server startup, shutdown, and instance management',
            category: 'cli',
            tests: [
                './cli/test-server-lifecycle.js'
            ],
            required: false
        }
    ]
};

// Parse command line arguments
const args = process.argv.slice(2);
const showHelp = args.includes('--help') || args.includes('-h');
const runRequiredOnly = args.includes('--required') || args.includes('-r');
const runCategory = args.find(arg => arg.startsWith('--category='))?.split('=')[1];
const runSpecific = args.find(arg => arg.startsWith('--test='))?.split('=')[1];

// Display help information
if (showHelp) {
    console.log(`
🚀 InDesign MCP Server - Test Suite

USAGE:
  node index.js [options]

OPTIONS:
  --help, -h              Show this help message
  --required, -r          Run only required tests
  --category=<name>       Run tests in specific category
  --test=<name>           Run specific test file

CATEGORIES:
  connectivity            Basic connectivity tests
  document               Document management tests
  layout                 Grid and layout tests
  content                Content creation tests
  advanced               Advanced feature tests
  workflow               Workflow tests
  mcp                    MCP-specific tests
  graphics               Graphics and image tests
  help                   Help system tests
  validation             Validation and error tests
  comprehensive          Comprehensive test suites
  cli                    CLI interface and server lifecycle tests

EXAMPLES:
  node index.js                    # Run all tests
  node index.js --required         # Run only required tests
  node index.js --category=basic   # Run basic connectivity tests
  node index.js --test=test-mcp-protocol.js  # Run specific test

TEST SUITES:
${TEST_SUITES.required.map(suite => `  ✅ ${suite.name} (${suite.category})`).join('\n')}
${TEST_SUITES.optional.map(suite => `  📋 ${suite.name} (${suite.category})`).join('\n')}
`);
    process.exit(0);
}

// Main test execution
async function main() {
    const startTime = Date.now();
    console.log('🚀 [%s] InDesign MCP Server - Master Test Suite', new Date().toISOString());
    console.log('ℹ️ [%s] Server Path: %s', new Date().toISOString(), './src/index.js');

    let suitesToRun = [];

    // Determine which suites to run based on arguments
    if (runRequiredOnly) {
        suitesToRun = TEST_SUITES.required;
        console.log('ℹ️ [%s] Running required tests only', new Date().toISOString());
    } else if (runCategory) {
        const allSuites = [...TEST_SUITES.required, ...TEST_SUITES.optional];
        suitesToRun = allSuites.filter(suite => suite.category === runCategory);
        console.log('ℹ️ [%s] Running tests in category: %s', new Date().toISOString(), runCategory);
    } else if (runSpecific) {
        // Find the specific test file
        const allSuites = [...TEST_SUITES.required, ...TEST_SUITES.optional];
        const targetSuite = allSuites.find(suite =>
            suite.tests.some(test => test.includes(runSpecific))
        );
        if (targetSuite) {
            suitesToRun = [targetSuite];
            console.log('ℹ️ [%s] Running specific test: %s', new Date().toISOString(), runSpecific);
        } else {
            console.error('❌ [%s] Test not found: %s', new Date().toISOString(), runSpecific);
            process.exit(1);
        }
    } else {
        suitesToRun = [...TEST_SUITES.required, ...TEST_SUITES.optional];
        console.log('ℹ️ [%s] Running all tests', new Date().toISOString());
    }

    console.log('ℹ️ [%s] Total Test Suites: %d', new Date().toISOString(), suitesToRun.length);

    // Calculate total tests
    const totalTests = suitesToRun.reduce((sum, suite) => sum + suite.tests.length, 0);
    console.log('ℹ️ [%s] Total Tests: %d', new Date().toISOString(), totalTests);

    // Run test suites
    let allPassed = true;
    let totalPassed = 0;
    let totalFailed = 0;

    for (let i = 0; i < suitesToRun.length; i++) {
        const suite = suitesToRun[i];
        const suiteNumber = i + 1;
        const totalSuites = suitesToRun.length;

        console.log('\n📋 [%s] %s', new Date().toISOString(), suite.name);
        console.log('ℹ️ [%s] Description: %s', new Date().toISOString(), suite.description);
        console.log('ℹ️ [%s] Category: %s', new Date().toISOString(), suite.category);
        console.log('ℹ️ [%s] Tests: %s', new Date().toISOString(), suite.tests.join(', '));
        console.log('ℹ️ [%s] Required: %s', new Date().toISOString(), suite.required ? 'Yes' : 'No');

        try {
            const result = await runTestSuite(suite.tests, {
                suiteName: suite.name,
                category: suite.category,
                required: suite.required
            });

            if (result.success) {
                console.log('✅ [%s] %s: ✅ PASSED (%.1fs)',
                    new Date().toISOString(), suite.name, result.duration);
                totalPassed += result.passed;
            } else {
                console.log('❌ [%s] %s: ❌ FAILED (%.1fs)',
                    new Date().toISOString(), suite.name, result.duration);
                totalFailed += result.failed;
                if (suite.required) {
                    allPassed = false;
                }
            }
        } catch (error) {
            console.log('❌ [%s] %s: ❌ ERROR - %s',
                new Date().toISOString(), suite.name, error.message);
            totalFailed += suite.tests.length;
            if (suite.required) {
                allPassed = false;
            }
        }

        // Wait between test suites
        if (i < suitesToRun.length - 1) {
            console.log('⏳ [%s] Waiting 1s before next test suite...', new Date().toISOString());
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    // Final results
    const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
    const successRate = totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(1) : '0.0';

    console.log('\n📊 [%s] Test Summary', new Date().toISOString());
    console.log('ℹ️ [%s] Total Time: %.1fs', new Date().toISOString(), totalTime);
    console.log('ℹ️ [%s] Tests Passed: %d', new Date().toISOString(), totalPassed);
    console.log('ℹ️ [%s] Tests Failed: %d', new Date().toISOString(), totalFailed);
    console.log('ℹ️ [%s] Success Rate: %s%%', new Date().toISOString(), successRate);

    if (allPassed) {
        console.log('✅ [%s] All tests passed successfully!', new Date().toISOString());
        process.exit(0);
    } else {
        console.log('❌ [%s] Some tests failed. Check the details above.', new Date().toISOString());
        process.exit(1);
    }
}

// Run the main function
main().catch(error => {
    console.error('❌ [%s] Test suite failed: %s', new Date().toISOString(), error.message);
    process.exit(1);
}); 