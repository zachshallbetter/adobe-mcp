/**
 * MCP Resources Test Suite
 * Tests MCP Resources functionality with shared test environment
 */
import { executeTool, getTestEnvironment } from './unified-test-runner.js';

async function runMCPResourcesTests() {
    console.log('============================================================');
    console.log('Starting MCP Resources Test Suite');
    console.log('============================================================');

    // Get the shared test environment
    const env = getTestEnvironment();
    console.log('📋 Using shared test environment:', env);

    let passed = 0;
    let failed = 0;

    // Test 1: List Direct Resources
    console.log('\nMCP Resources: Testing Resource Listing');
    try {
        const result = await executeTool('list_resources', {});
        if (result.success) {
            console.log('✅ Direct resources listed successfully');
            const resources = result.result.resources || [];
            console.log(`   Found ${resources.length} resources`);

            // Log available resources for debugging
            if (resources.length > 0) {
                console.log('   Available resources:');
                resources.forEach(resource => {
                    console.log(`     - ${resource.name}: ${resource.title}`);
                });
            }
            passed++;
        } else {
            console.log('❌ Failed to list direct resources');
            console.log(`   Error: ${result.result || result.error}`);
            failed++;
        }
    } catch (error) {
        console.log('❌ Failed to list direct resources');
        console.log(`   Error: ${error.message}`);
        failed++;
    }

    // Test 2: List Resource Templates
    console.log('\nMCP Resources: Testing Resource Templates');
    try {
        const result = await executeTool('list_resource_templates', {});
        if (result.success) {
            console.log('✅ Resource templates listed successfully');
            const templates = result.result.templates || [];
            console.log(`   Found ${templates.length} templates`);
            passed++;
        } else {
            console.log('❌ Failed to list resource templates');
            console.log(`   Error: ${result.result || result.error}`);
            failed++;
        }
    } catch (error) {
        console.log('❌ Failed to list resource templates');
        console.log(`   Error: ${error.message}`);
        failed++;
    }

    // Test 3: Read Active Document Resource
    console.log('\nMCP Resources: Testing Document Resource');
    try {
        const result = await executeTool('read_resource', { name: 'active-document' });
        if (result.success) {
            console.log('✅ Document resource read successfully');
            const docInfo = result.result;
            console.log(`   Document: ${docInfo.name || 'Unknown'}`);
            passed++;
        } else {
            console.log('❌ Failed to read document resource');
            console.log(`   Error: ${result.result || result.error}`);
            failed++;
        }
    } catch (error) {
        console.log('❌ Failed to read document resource');
        console.log(`   Error: ${error.message}`);
        failed++;
    }

    // Test 4: Read Color Swatches Resource
    console.log('\nMCP Resources: Testing Color Resource');
    try {
        const result = await executeTool('read_resource', { name: 'color-swatches' });
        if (result.success) {
            console.log('✅ Color resource read successfully');
            const colors = result.result.colors || [];
            console.log(`   Found ${colors.length} colors`);

            // Log available colors for debugging
            if (colors.length > 0) {
                console.log('   Available colors:');
                colors.forEach(color => {
                    console.log(`     - ${color.name}`);
                });
            }
            passed++;
        } else {
            console.log('❌ Failed to read color resource');
            console.log(`   Error: ${result.result || result.error}`);
            failed++;
        }
    } catch (error) {
        console.log('❌ Failed to read color resource');
        console.log(`   Error: ${error.message}`);
        failed++;
    }

    // Test 5: Read Styles Resource
    console.log('\nMCP Resources: Testing Style Resource');
    try {
        const result = await executeTool('read_resource', { name: 'paragraph-styles' });
        if (result.success) {
            console.log('✅ Style resource read successfully');
            const styles = result.result.styles || [];
            console.log(`   Found ${styles.length} paragraph styles`);

            // Log available styles for debugging
            if (styles.length > 0) {
                console.log('   Available paragraph styles:');
                styles.forEach(style => {
                    console.log(`     - ${style.name}`);
                });
            }
            passed++;
        } else {
            console.log('❌ Failed to read style resource');
            console.log(`   Error: ${result.result || result.error}`);
            failed++;
        }
    } catch (error) {
        console.log('❌ Failed to read style resource');
        console.log(`   Error: ${error.message}`);
        failed++;
    }

    // Test 6: Read Pages Resource
    console.log('\nMCP Resources: Testing Page Resource');
    try {
        const result = await executeTool('read_resource', { name: 'all-pages' });
        if (result.success) {
            console.log('✅ Pages resource read successfully');
            const pages = result.result.pages || [];
            console.log(`   Found ${pages.length} pages`);
            passed++;
        } else {
            console.log('❌ Failed to read pages resource');
            console.log(`   Error: ${result.result || result.error}`);
            failed++;
        }
    } catch (error) {
        console.log('❌ Failed to read pages resource');
        console.log(`   Error: ${error.message}`);
        failed++;
    }

    // Test 7: Read Specific Color Resource (if available)
    console.log('\nMCP Resources: Testing Specific Color Resource');
    try {
        const result = await executeTool('read_resource', { name: 'color-Primary Blue' });
        if (result.success) {
            console.log('✅ Specific color resource read successfully');
            const color = result.result;
            console.log(`   Color: ${color.name}`);
            passed++;
        } else {
            console.log('❌ Failed to read specific color resource');
            console.log(`   Error: ${result.result || result.error}`);
            failed++;
        }
    } catch (error) {
        console.log('❌ Failed to read specific color resource');
        console.log(`   Error: ${error.message}`);
        failed++;
    }

    // Test 8: Read Specific Style Resource (if available)
    console.log('\nMCP Resources: Testing Specific Style Resource');
    try {
        const result = await executeTool('read_resource', { name: 'style-Body Text' });
        if (result.success) {
            console.log('✅ Specific style resource read successfully');
            const style = result.result;
            console.log(`   Style: ${style.name}`);
            passed++;
        } else {
            console.log('❌ Failed to read specific style resource');
            console.log(`   Error: ${result.result || result.error}`);
            failed++;
        }
    } catch (error) {
        console.log('❌ Failed to read specific style resource');
        console.log(`   Error: ${error.message}`);
        failed++;
    }

    // Test 9: Error Handling - Non-existent Resource
    console.log('\nMCP Resources: Testing Error Handling');
    try {
        const result = await executeTool('read_resource', { name: 'non-existent-resource' });
        if (!result.success || (result.result && result.result.error)) {
            console.log('✅ Error handling working correctly');
            const errorMsg = result.result?.error || result.result || result.error || 'Unknown error';
            console.log(`   Expected error: ${errorMsg}`);
            passed++;
        } else {
            console.log('❌ Error handling not working as expected');
            console.log('   Should have failed for non-existent resource');
            console.log(`   Got: ${JSON.stringify(result)}`);
            failed++;
        }
    } catch (error) {
        console.log('✅ Error handling working correctly');
        console.log(`   Expected error: ${error.message}`);
        passed++;
    }

    // Results
    console.log('\n============================================================');
    console.log('MCP Resources Test Results:');
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📊 Total: ${passed + failed}`);
    console.log('============================================================');

    if (failed > 0) {
        console.log('\n❌ Some MCP Resources tests failed');
        process.exit(1);
    } else {
        console.log('\n✅ All MCP Resources tests passed!');
        process.exit(0);
    }
}

// Run the tests
runMCPResourcesTests().catch(error => {
    console.error('❌ MCP Resources test suite failed:', error);
    process.exit(1);
}); 