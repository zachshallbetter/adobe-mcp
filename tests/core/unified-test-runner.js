/**
 * Unified Test Runner for InDesign MCP Server
 * Provides consistent test execution with proper setup and teardown
 */
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TEST_CONFIG = {
    serverPath: join(__dirname, '../../src/index.js'),
    delay: 1000,
    timeout: 30000
};

// Global server process for all tests
let globalServerProcess = null;
let serverReady = false;

/**
 * Initialize the global server process
 */
export async function initializeServer() {
    if (globalServerProcess) {
        return globalServerProcess;
    }

    console.log('🚀 Starting global server process...');

    globalServerProcess = spawn('node', [TEST_CONFIG.serverPath], {
        stdio: ['pipe', 'pipe', 'pipe']
    });

    // Wait for server to be ready
    await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            reject(new Error('Server startup timeout'));
        }, 10000);

        globalServerProcess.stdout.on('data', (data) => {
            const output = data.toString();
            if (output.includes('Server started') || output.includes('ready')) {
                clearTimeout(timeout);
                serverReady = true;
                resolve();
            }
        });

        globalServerProcess.stderr.on('data', (data) => {
            const output = data.toString();
            console.log(`Server stderr: ${output}`);
            if (output.includes('InDesign MCP Server started')) {
                clearTimeout(timeout);
                serverReady = true;
                resolve();
            }
        });

        globalServerProcess.on('error', (error) => {
            clearTimeout(timeout);
            reject(error);
        });
    });

    console.log('✅ Global server process ready');
    return globalServerProcess;
}

/**
 * Shutdown the global server process
 */
export async function shutdownServer() {
    if (globalServerProcess) {
        console.log('🛑 Shutting down global server process...');
        globalServerProcess.kill();
        globalServerProcess = null;
        serverReady = false;
    }
}

/**
 * Execute a tool call against the InDesign MCP Server
 */
export async function executeTool(toolName, args = {}) {
    if (!globalServerProcess || !serverReady) {
        throw new Error('Server not initialized. Call initializeServer() first.');
    }

    return new Promise((resolve, reject) => {
        let output = '';
        let errorOutput = '';

        // Set timeout
        const timeout = setTimeout(() => {
            reject(new Error(`Tool execution timed out after ${TEST_CONFIG.timeout}ms`));
        }, TEST_CONFIG.timeout);

        // Send tool call
        const toolCall = {
            jsonrpc: '2.0',
            id: Date.now(),
            method: 'tools/call',
            params: {
                name: toolName,
                arguments: args
            }
        };

        // Write the tool call
        globalServerProcess.stdin.write(JSON.stringify(toolCall) + '\n');

        // Listen for response
        const responseHandler = (data) => {
            output += data.toString();

            // Check if we have a complete JSON response
            const lines = output.split('\n').filter(line => line.trim());
            for (let i = lines.length - 1; i >= 0; i--) {
                try {
                    const response = JSON.parse(lines[i]);
                    if (response.jsonrpc === '2.0' && response.result) {
                        clearTimeout(timeout);
                        globalServerProcess.stdout.removeListener('data', responseHandler);
                        globalServerProcess.stderr.removeListener('data', errorHandler);

                        // Extract the actual result from MCP response format
                        if (response.result && response.result.content && response.result.content[0]) {
                            const content = response.result.content[0].text;
                            let result;
                            try {
                                result = JSON.parse(content);
                            } catch (e) {
                                // If not JSON, just return as string
                                result = { success: true, operation: content };
                            }
                            resolve(result);
                        } else {
                            resolve({ success: false, error: 'Invalid response format' });
                        }
                        return;
                    }
                } catch (e) {
                    // Continue to next line
                }
            }
        };

        const errorHandler = (data) => {
            errorOutput += data.toString();
        };

        globalServerProcess.stdout.on('data', responseHandler);
        globalServerProcess.stderr.on('data', errorHandler);

        // Cleanup on timeout
        timeout.unref();
    });
}

/**
 * Run a test suite with the provided environment info and detailed progress
 */
export async function runTestSuite(testFiles, environmentInfo = {}) {
    const results = {
        success: true,
        tests: [],
        passed: 0,
        failed: 0
    };

    // Initialize server if not already initialized
    if (!globalServerProcess || !serverReady) {
        try {
            await initializeServer();
        } catch (error) {
            console.log(`  ❌ Failed to initialize server: ${error.message}`);
            results.success = false;
            results.failed = testFiles.length;
            return results;
        }
    }

    console.log(`  🧪 Running ${testFiles.length} test files...`);

    for (let i = 0; i < testFiles.length; i++) {
        const testFile = testFiles[i];
        const testNumber = i + 1;
        const totalTests = testFiles.length;

        console.log(`    📋 [${testNumber}/${totalTests}] Running: ${testFile}`);

        try {
            const result = await runTestFile(testFile, environmentInfo);
            results.tests.push(result);

            if (result.success) {
                console.log(`    ✅ [${testNumber}/${totalTests}] ${testFile}: PASSED`);
                results.passed++;
            } else {
                console.log(`    ❌ [${testNumber}/${totalTests}] ${testFile}: FAILED`);
                if (result.errorOutput) {
                    console.log(`       Error: ${result.errorOutput.trim()}`);
                }
                results.failed++;
                results.success = false;
            }
        } catch (error) {
            console.log(`    ❌ [${testNumber}/${totalTests}] ${testFile}: ERROR`);
            console.log(`       Error: ${error.message}`);
            results.tests.push({
                file: testFile,
                success: false,
                error: error.message
            });
            results.failed++;
            results.success = false;
        }

        // Add delay between tests
        if (i < testFiles.length - 1) {
            console.log(`    ⏳ Waiting ${TEST_CONFIG.delay}ms before next test...`);
            await delay(TEST_CONFIG.delay);
        }
    }

    console.log(`  📊 Test suite results: ${results.passed} passed, ${results.failed} failed`);
    return results;
}

/**
 * Run a single test file with environment info
 */
async function runTestFile(testFile, environmentInfo = {}) {
    try {
        // Import and run the test function directly
        const testPath = join(__dirname, '..', testFile);
        const testModule = await import(testPath);

        // Find the main test function (usually the default export or a function named after the file)
        let testFunction = null;

        if (testModule.default && typeof testModule.default === 'function') {
            testFunction = testModule.default;
        } else if (testModule.testMCPProtocol) {
            testFunction = testModule.testMCPProtocol;
        } else if (testModule.testInDesignBasic) {
            testFunction = testModule.testInDesignBasic;
        } else if (testModule.testSimpleDocument) {
            testFunction = testModule.testSimpleDocument;
        } else if (testModule.testDocumentAndPage) {
            testFunction = testModule.testDocumentAndPage;
        } else if (testModule.testDocumentPreferences) {
            testFunction = testModule.testDocumentPreferences;
        } else if (testModule.testGridAndLayoutTools) {
            testFunction = testModule.testGridAndLayoutTools;
        } else if (testModule.runComprehensiveTests) {
            testFunction = testModule.runComprehensiveTests;
        } else if (testModule.runContentManagementTests) {
            testFunction = testModule.runContentManagementTests;
        } else {
            // Try to find any exported function
            const exportedFunctions = Object.entries(testModule)
                .filter(([_, value]) => typeof value === 'function')
                .map(([name, _]) => name);

            if (exportedFunctions.length > 0) {
                testFunction = testModule[exportedFunctions[0]];
            }
        }

        if (!testFunction) {
            throw new Error(`No test function found in ${testFile}`);
        }

        // Set up environment for the test
        process.env.TEST_ENVIRONMENT = JSON.stringify(environmentInfo);

        // Run the test function
        await testFunction();

        return {
            file: testFile,
            success: true,
            output: 'Test completed successfully',
            errorOutput: ''
        };

    } catch (error) {
        return {
            file: testFile,
            success: false,
            output: '',
            errorOutput: error.message
        };
    }
}

/**
 * Utility function to add delay
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Get test environment info from process environment
 */
export function getTestEnvironment() {
    try {
        const envData = process.env.TEST_ENVIRONMENT;
        return envData ? JSON.parse(envData) : {};
    } catch (error) {
        console.warn('Failed to parse test environment:', error.message);
        return {};
    }
}