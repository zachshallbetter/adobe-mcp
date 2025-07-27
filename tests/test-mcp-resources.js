/**
 * Test Suite: MCP Resources
 * 
 * Tests the new MCP Resources functionality including:
 * - Resource listing
 * - Resource template listing
 * - Resource reading for different types
 * - Error handling
 */

import { executeTool } from './unified-test-runner.js';

const TEST_SUITE_NAME = 'MCP Resources';

async function testResourceListing() {
    console.log(`\n${TEST_SUITE_NAME}: Testing Resource Listing`);

    try {
        // Test listing direct resources
        const result = await executeTool('list_resources', {});

        if (result.success) {
            console.log('✅ Direct resources listed successfully');
            console.log(`   Found ${result.resources?.length || 0} resources`);

            if (result.resources && result.resources.length > 0) {
                console.log('   Available resources:');
                result.resources.forEach(resource => {
                    console.log(`   - ${resource.name}: ${resource.title}`);
                });
            }
        } else {
            console.log('❌ Failed to list direct resources');
            console.log(`   Error: ${result.message}`);
        }

        return result.success;
    } catch (error) {
        console.log('❌ Error testing resource listing');
        console.log(`   Error: ${error.message}`);
        return false;
    }
}

async function testResourceTemplates() {
    console.log(`\n${TEST_SUITE_NAME}: Testing Resource Templates`);

    try {
        // Test listing resource templates
        const result = await executeTool('list_resource_templates', {});

        if (result.success) {
            console.log('✅ Resource templates listed successfully');
            console.log(`   Found ${result.templates?.length || 0} templates`);

            if (result.templates && result.templates.length > 0) {
                console.log('   Available templates:');
                result.templates.forEach(template => {
                    console.log(`   - ${template.name}: ${template.title}`);
                    console.log(`     URI Template: ${template.uriTemplate}`);
                });
            }
        } else {
            console.log('❌ Failed to list resource templates');
            console.log(`   Error: ${result.message}`);
        }

        return result.success;
    } catch (error) {
        console.log('❌ Error testing resource templates');
        console.log(`   Error: ${error.message}`);
        return false;
    }
}

async function testDocumentResource() {
    console.log(`\n${TEST_SUITE_NAME}: Testing Document Resource`);

    try {
        // First create a document to test with
        const createResult = await executeTool('create_document', {
            name: 'Resource-Test.indd',
            width: 210,
            height: 297,
            orientation: 'portrait'
        });

        if (!createResult.success) {
            console.log('❌ Failed to create test document');
            return false;
        }

        // Test reading document resource
        const result = await executeTool('read_resource', {
            uri: 'indesign://document/active'
        });

        if (result.success && result.resource) {
            console.log('✅ Document resource read successfully');
            console.log(`   Document: ${result.resource.title}`);
            console.log(`   MIME Type: ${result.resource.mimeType}`);
            console.log(`   Content length: ${result.resource.text?.length || 0} characters`);
        } else {
            console.log('❌ Failed to read document resource');
            console.log(`   Error: ${result.message}`);
        }

        return result.success;
    } catch (error) {
        console.log('❌ Error testing document resource');
        console.log(`   Error: ${error.message}`);
        return false;
    }
}

async function testColorResource() {
    console.log(`\n${TEST_SUITE_NAME}: Testing Color Resource`);

    try {
        // First create a color to test with
        const createResult = await executeTool('create_color_swatch', {
            name: 'TestColor',
            red: 255,
            green: 0,
            blue: 0
        });

        if (!createResult.success) {
            console.log('❌ Failed to create test color');
            return false;
        }

        // Test reading color resource
        const result = await executeTool('read_resource', {
            uri: 'indesign://colors/swatches'
        });

        if (result.success && result.resource) {
            console.log('✅ Color resource read successfully');
            console.log(`   Resource: ${result.resource.title}`);
            console.log(`   MIME Type: ${result.resource.mimeType}`);
            console.log(`   Content length: ${result.resource.text?.length || 0} characters`);
        } else {
            console.log('❌ Failed to read color resource');
            console.log(`   Error: ${result.message}`);
        }

        return result.success;
    } catch (error) {
        console.log('❌ Error testing color resource');
        console.log(`   Error: ${error.message}`);
        return false;
    }
}

async function testStyleResource() {
    console.log(`\n${TEST_SUITE_NAME}: Testing Style Resource`);

    try {
        // First create a style to test with
        const createResult = await executeTool('create_paragraph_style', {
            name: 'TestStyle',
            fontSize: 12,
            alignment: 'LEFT_ALIGN'
        });

        if (!createResult.success) {
            console.log('❌ Failed to create test style');
            return false;
        }

        // Test reading style resource
        const result = await executeTool('read_resource', {
            uri: 'indesign://styles/paragraph'
        });

        if (result.success && result.resource) {
            console.log('✅ Style resource read successfully');
            console.log(`   Resource: ${result.resource.title}`);
            console.log(`   MIME Type: ${result.resource.mimeType}`);
            console.log(`   Content length: ${result.resource.text?.length || 0} characters`);
        } else {
            console.log('❌ Failed to read style resource');
            console.log(`   Error: ${result.message}`);
        }

        return result.success;
    } catch (error) {
        console.log('❌ Error testing style resource');
        console.log(`   Error: ${error.message}`);
        return false;
    }
}

async function testPageResource() {
    console.log(`\n${TEST_SUITE_NAME}: Testing Page Resource`);

    try {
        // Test reading page resource
        const result = await executeTool('read_resource', {
            uri: 'indesign://pages/all'
        });

        if (result.success && result.resource) {
            console.log('✅ Pages resource read successfully');
            console.log(`   Resource: ${result.resource.title}`);
            console.log(`   MIME Type: ${result.resource.mimeType}`);
            console.log(`   Content length: ${result.resource.text?.length || 0} characters`);
        } else {
            console.log('❌ Failed to read pages resource');
            console.log(`   Error: ${result.message}`);
        }

        return result.success;
    } catch (error) {
        console.log('❌ Error testing page resource');
        console.log(`   Error: ${error.message}`);
        return false;
    }
}

async function testSpecificPageResource() {
    console.log(`\n${TEST_SUITE_NAME}: Testing Specific Page Resource`);

    try {
        // Test reading specific page resource
        const result = await executeTool('read_resource', {
            uri: 'indesign://page/1'
        });

        if (result.success && result.resource) {
            console.log('✅ Specific page resource read successfully');
            console.log(`   Resource: ${result.resource.title}`);
            console.log(`   MIME Type: ${result.resource.mimeType}`);
            console.log(`   Content length: ${result.resource.text?.length || 0} characters`);
        } else {
            console.log('❌ Failed to read specific page resource');
            console.log(`   Error: ${result.message}`);
        }

        return result.success;
    } catch (error) {
        console.log('❌ Error testing specific page resource');
        console.log(`   Error: ${error.message}`);
        return false;
    }
}

async function testSpecificColorResource() {
    console.log(`\n${TEST_SUITE_NAME}: Testing Specific Color Resource`);

    try {
        // Test reading specific color resource
        const result = await executeTool('read_resource', {
            uri: 'indesign://color/TestColor'
        });

        if (result.success && result.resource) {
            console.log('✅ Specific color resource read successfully');
            console.log(`   Resource: ${result.resource.title}`);
            console.log(`   MIME Type: ${result.resource.mimeType}`);
            console.log(`   Content length: ${result.resource.text?.length || 0} characters`);
        } else {
            console.log('❌ Failed to read specific color resource');
            console.log(`   Error: ${result.message}`);
        }

        return result.success;
    } catch (error) {
        console.log('❌ Error testing specific color resource');
        console.log(`   Error: ${error.message}`);
        return false;
    }
}

async function testSpecificStyleResource() {
    console.log(`\n${TEST_SUITE_NAME}: Testing Specific Style Resource`);

    try {
        // Test reading specific style resource
        const result = await executeTool('read_resource', {
            uri: 'indesign://style/paragraph/TestStyle'
        });

        if (result.success && result.resource) {
            console.log('✅ Specific style resource read successfully');
            console.log(`   Resource: ${result.resource.title}`);
            console.log(`   MIME Type: ${result.resource.mimeType}`);
            console.log(`   Content length: ${result.resource.text?.length || 0} characters`);
        } else {
            console.log('❌ Failed to read specific style resource');
            console.log(`   Error: ${result.message}`);
        }

        return result.success;
    } catch (error) {
        console.log('❌ Error testing specific style resource');
        console.log(`   Error: ${error.message}`);
        return false;
    }
}

async function testTextFrameResource() {
    console.log(`\n${TEST_SUITE_NAME}: Testing Text Frame Resource`);

    try {
        // First create a text frame to test with
        const createResult = await executeTool('create_text_frame', {
            content: 'Test text frame for resource testing',
            fontSize: 12
        });

        if (!createResult.success) {
            console.log('❌ Failed to create test text frame');
            return false;
        }

        // Extract frame ID from the result (this would need to be implemented)
        const frameId = '1'; // Placeholder - would need to extract from createResult

        // Test reading text frame resource
        const result = await executeTool('read_resource', {
            uri: `indesign://text-frame/${frameId}`
        });

        if (result.success && result.resource) {
            console.log('✅ Text frame resource read successfully');
            console.log(`   Resource: ${result.resource.title}`);
            console.log(`   MIME Type: ${result.resource.mimeType}`);
            console.log(`   Content length: ${result.resource.text?.length || 0} characters`);
        } else {
            console.log('❌ Failed to read text frame resource');
            console.log(`   Error: ${result.message}`);
        }

        return result.success;
    } catch (error) {
        console.log('❌ Error testing text frame resource');
        console.log(`   Error: ${error.message}`);
        return false;
    }
}

async function testErrorHandling() {
    console.log(`\n${TEST_SUITE_NAME}: Testing Error Handling`);

    try {
        // Test reading non-existent resource
        const result = await executeTool('read_resource', {
            uri: 'indesign://nonexistent/resource'
        });

        if (!result.success) {
            console.log('✅ Error handling working correctly');
            console.log(`   Expected error for non-existent resource`);
        } else {
            console.log('❌ Error handling not working as expected');
            console.log(`   Should have failed for non-existent resource`);
        }

        return !result.success; // Should fail for non-existent resource
    } catch (error) {
        console.log('✅ Error handling working correctly');
        console.log(`   Expected error for non-existent resource`);
        return true;
    }
}

async function runMCPResourcesTests() {
    console.log('============================================================');
    console.log('Starting MCP Resources Test Suite');
    console.log('============================================================');

    const tests = [
        testResourceListing,
        testResourceTemplates,
        testDocumentResource,
        testColorResource,
        testStyleResource,
        testPageResource,
        testSpecificPageResource,
        testSpecificColorResource,
        testSpecificStyleResource,
        testTextFrameResource,
        testErrorHandling
    ];

    let passed = 0;
    let failed = 0;

    for (const test of tests) {
        try {
            const result = await test();
            if (result) {
                passed++;
            } else {
                failed++;
            }
        } catch (error) {
            console.log(`❌ Test failed with error: ${error.message}`);
            failed++;
        }
    }

    console.log('\n============================================================');
    console.log('MCP Resources Test Results:');
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📊 Total: ${passed + failed}`);
    console.log('============================================================');

    return { passed, failed, total: passed + failed };
}

// Export for use in main test runner
export { runMCPResourcesTests };

// Run directly if this file is executed
if (import.meta.url === `file://${process.argv[1]}`) {
    runMCPResourcesTests().then(result => {
        process.exit(result.failed > 0 ? 1 : 0);
    }).catch(error => {
        console.error('Test suite failed:', error);
        process.exit(1);
    });
} 