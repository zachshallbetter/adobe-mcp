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
    serverPath: join(__dirname, '../src/index.js'),
    delay: 1000,
    timeout: 30000
};

/**
 * Execute a tool call against the InDesign MCP Server
 */
export async function executeTool(toolName, args = {}) {
    return new Promise((resolve, reject) => {
        const serverProcess = spawn('node', [TEST_CONFIG.serverPath], {
            stdio: ['pipe', 'pipe', 'pipe']
        });

        let output = '';
        let errorOutput = '';

        serverProcess.stdout.on('data', (data) => {
            output += data.toString();
        });

        serverProcess.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        // Set timeout
        const timeout = setTimeout(() => {
            serverProcess.kill();
            reject(new Error(`Tool execution timed out after ${TEST_CONFIG.timeout}ms`));
        }, TEST_CONFIG.timeout);

        // Send tool call
        const toolCall = {
            jsonrpc: '2.0',
            id: 1,
            method: 'tools/call',
            params: {
                name: toolName,
                arguments: args
            }
        };

        // Write the tool call and end the input stream
        serverProcess.stdin.write(JSON.stringify(toolCall) + '\n');
        serverProcess.stdin.end();

        serverProcess.on('close', (code) => {
            clearTimeout(timeout);

            if (code !== 0) {
                reject(new Error(`Server process exited with code ${code}`));
                return;
            }

            try {
                // Parse the last valid JSON response
                const lines = output.split('\n').filter(line => line.trim());
                let lastValidResponse = null;

                for (let i = lines.length - 1; i >= 0; i--) {
                    try {
                        const response = JSON.parse(lines[i]);
                        if (response.jsonrpc === '2.0' && response.result) {
                            lastValidResponse = response;
                            break;
                        }
                    } catch (e) {
                        // Continue to next line
                    }
                }

                if (!lastValidResponse) {
                    reject(new Error('No valid JSON-RPC response found'));
                    return;
                }

                // Extract the actual result from MCP response format
                if (lastValidResponse.result && lastValidResponse.result.content && lastValidResponse.result.content[0]) {
                    const content = lastValidResponse.result.content[0].text;
                    let result;
                    try {
                        result = JSON.parse(content);
                    } catch (e) {
                        // If not JSON, just return as string
                        result = { success: true, operation: content };
                    }
                    resolve(result);
                } else {
                    resolve({ success: false, error: 'Invalid MCP response format' });
                }
            } catch (error) {
                reject(new Error(`Failed to parse response: ${error.message}`));
            }
        });

        serverProcess.on('error', (error) => {
            clearTimeout(timeout);
            reject(error);
        });
    });
}

/**
 * Run a test suite with the provided environment info
 */
export async function runTestSuite(testFiles, environmentInfo = {}) {
    const results = {
        success: true,
        tests: [],
        passed: 0,
        failed: 0
    };

    for (const testFile of testFiles) {
        try {
            const result = await runTestFile(testFile, environmentInfo);
            results.tests.push(result);

            if (result.success) {
                results.passed++;
            } else {
                results.failed++;
                results.success = false;
            }
        } catch (error) {
            results.tests.push({
                file: testFile,
                success: false,
                error: error.message
            });
            results.failed++;
            results.success = false;
        }

        // Add delay between tests
        await delay(TEST_CONFIG.delay);
    }

    return results;
}

/**
 * Run a single test file with environment info
 */
async function runTestFile(testFile, environmentInfo = {}) {
    return new Promise((resolve, reject) => {
        const testPath = join(__dirname, testFile);
        const testProcess = spawn('node', [testPath], {
            stdio: ['pipe', 'pipe', 'pipe'],
            env: {
                ...process.env,
                TEST_ENVIRONMENT: JSON.stringify(environmentInfo)
            }
        });

        let output = '';
        let errorOutput = '';

        testProcess.stdout.on('data', (data) => {
            output += data.toString();
        });

        testProcess.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        testProcess.on('close', (code) => {
            if (code === 0) {
                resolve({
                    file: testFile,
                    success: true,
                    output,
                    errorOutput
                });
            } else {
                resolve({
                    file: testFile,
                    success: false,
                    output,
                    errorOutput,
                    code
                });
            }
        });

        testProcess.on('error', (error) => {
            reject(error);
        });
    });
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