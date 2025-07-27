/**
 * Comprehensive Test Suite
 * Master test that demonstrates all functionality with detailed progress tracking
 * This test can be referenced by other tests or run independently
 */
import { RootTest } from './root-test.js';

async function runComprehensiveTests() {
    console.log('🚀 Comprehensive Test Suite');
    console.log('Testing all InDesign MCP Server functionality with detailed progress...');

    // Create root test instance
    const rootTest = new RootTest('Comprehensive Test Suite');

    // Run comprehensive test suite
    await rootTest.runComprehensiveTest();
}

// Run the tests
runComprehensiveTests().catch(error => {
    console.error('❌ Comprehensive test suite failed:', error);
    process.exit(1);
}); 