/**
 * Content Management Test Suite
 * Tests text, graphics, styles, colors, and table management
 * Uses the shared test environment and root test functionality
 */
import { RootTest } from './root-test.js';

async function runContentManagementTests() {
    console.log('🎨 Content Management Test Suite');
    console.log('Testing text, graphics, styles, colors, and table management...');

    // Create root test instance
    const rootTest = new RootTest('Content Management');

    // Run comprehensive test suite
    await rootTest.runComprehensiveTest();
}

// Run the tests
runContentManagementTests().catch(error => {
    console.error('❌ Content management test suite failed:', error);
    process.exit(1);
}); 