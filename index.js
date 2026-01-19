#!/usr/bin/env node

/**
 * InDesign MCP Server - CLI Interface
 * 
 * This is the main entry point for all CLI operations including:
 * - MCP Server startup (stdio transport)
 * - Test suite execution
 * - Development utilities
 * - Server management
 * - Health checks and diagnostics
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import { serverManager } from './src/utils/serverManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const CONFIG = {
    serverPath: join(__dirname, 'src', 'index.js'),
    testPath: join(__dirname, 'tests', 'index.js'),
    version: '1.1.0',
    name: 'InDesign MCP Server'
};

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0] || 'start';
const subArgs = args.slice(1);

// Display help information
function showHelp() {
    console.log(`
🚀 ${CONFIG.name} v${CONFIG.version} - CLI Interface

USAGE:
  node index.js <command> [options]

COMMANDS:
  start                    Start the MCP server (stdio transport)
  dev                      Start the MCP server in development mode with debugging
  test                     Run the test suite
  test:required            Run only required tests
  test:category <name>     Run tests in specific category
  test:file <name>         Run specific test file
  health                   Check server health and status
  logs                     Show log file information and management
  status                   Show server status and process information
  version                  Show version information
  help                     Show this help message

EXAMPLES:
  node index.js start                    # Start MCP server
  node index.js dev                      # Start in development mode
  node index.js test                     # Run all tests
  node index.js test:required            # Run required tests only
  node index.js test:category connectivity  # Run connectivity tests
  node index.js test:file test-mcp-protocol.js  # Run specific test
  node index.js health                   # Check server health
  node index.js logs                     # Show log information
  node index.js status                   # Show server status
  node index.js version                  # Show version

TEST CATEGORIES:
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

ENVIRONMENT VARIABLES:
  NODE_ENV               Set to 'development' for debug output
  DEBUG                  Enable debug logging
  PORT                   Server port (if using HTTP transport)
  LOG_LEVEL              Set logging level (debug, info, warn, error)
  FILE_LOGGING           Set to 'true' to enable file logging
  LOGS_DIR               Custom logs directory path
  MAX_LOG_SIZE           Maximum log file size in bytes (default: 10MB)
  MAX_LOG_FILES          Maximum number of log files to keep (default: 30)

For more information, see the README.md file.
`);
}

// Show version information
function showVersion() {
    console.log(`${CONFIG.name} v${CONFIG.version}`);
    console.log(`Node.js ${process.version}`);
    console.log(`Platform: ${process.platform} ${process.arch}`);
}

// Check if a file exists
function checkFile(path, name) {
    if (!existsSync(path)) {
        console.error(`❌ Error: ${name} not found at ${path}`);
        console.error(`   Please ensure the project is properly installed.`);
        process.exit(1);
    }
}

// Start the MCP server
async function startServer(devMode = false) {
    console.log(`🚀 Starting ${CONFIG.name} v${CONFIG.version}...`);

    checkFile(CONFIG.serverPath, 'Server entry point');

    try {
        // Check if server is already running
        const status = await serverManager.getServerStatus();
        if (status.running) {
            console.log(`⚠️  Server already running (PID: ${status.pid})`);
            console.log('   Killing existing instance...');
        }

        // Start server using server manager
        const success = await serverManager.startServer({ debug: devMode });

        if (!success) {
            console.error('❌ Failed to start server');
            process.exit(1);
        }

        const serverProcess = serverManager.getServerProcess();

        // Handle server output
        serverProcess.stdout.on('data', (data) => {
            const output = data.toString().trim();
            if (output) {
                console.log(`[SERVER] ${output}`);
            }
        });

        serverProcess.stderr.on('data', (data) => {
            const output = data.toString().trim();
            if (output) {
                // Check if it's JSON logging (for external processes)
                try {
                    const logData = JSON.parse(output);
                    if (logData.level === 'ERROR') {
                        console.error(`[ERROR] ${logData.message}`);
                    } else if (logData.level === 'INFO') {
                        console.log(`[INFO] ${logData.message}`);
                    } else {
                        console.log(`[${logData.level}] ${logData.message}`);
                    }
                } catch {
                    // Not JSON, treat as regular stderr
                    console.error(`[STDERR] ${output}`);
                }
            }
        });

        // Handle server process events
        serverProcess.on('error', (error) => {
            console.error(`❌ Server process error: ${error.message}`);
            process.exit(1);
        });

        serverProcess.on('exit', (code) => {
            if (code === 0) {
                console.log('✅ Server stopped gracefully');
            } else {
                console.error(`❌ Server exited with code ${code}`);
                process.exit(code);
            }
        });

        // Handle process termination
        const shutdown = async (signal) => {
            console.log(`\n🛑 Received ${signal}, shutting down server...`);
            await serverManager.stopServer();
            process.exit(0);
        };

        process.on('SIGINT', () => shutdown('SIGINT'));
        process.on('SIGTERM', () => shutdown('SIGTERM'));

        // Pass through stdin to server
        process.stdin.pipe(serverProcess.stdin);

        console.log(`✅ Server started successfully (PID: ${serverProcess.pid})`);
        return serverProcess;

    } catch (error) {
        console.error(`❌ Failed to start server: ${error.message}`);
        process.exit(1);
    }
}

// Run tests
function runTests(testArgs = []) {
    console.log(`🧪 Running test suite...`);

    checkFile(CONFIG.testPath, 'Test suite');

    const testProcess = spawn('node', [CONFIG.testPath, ...testArgs], {
        stdio: 'inherit',
        cwd: __dirname
    });

    testProcess.on('error', (error) => {
        console.error(`❌ Failed to run tests: ${error.message}`);
        process.exit(1);
    });

    testProcess.on('exit', (code) => {
        process.exit(code);
    });
}

// Show server status
async function showServerStatus() {
    console.log(`📊 ${CONFIG.name} - Server Status`);

    try {
        const status = await serverManager.getServerStatus();

        console.log('\n🖥️  Server Process:');
        console.log(`  Status: ${status.running ? '✅ Running' : '❌ Not Running'}`);

        if (status.running) {
            console.log(`  PID: ${status.pid}`);
            console.log(`  PID File: ${status.pidFile}`);

            // Check if process is actually running
            const isActuallyRunning = await serverManager.isProcessRunning(status.pid);
            console.log(`  Process Active: ${isActuallyRunning ? '✅ Yes' : '❌ No'}`);
        }

        console.log('\n📁 PID File:');
        console.log(`  Path: ${status.pidFile}`);
        console.log(`  Exists: ${existsSync(status.pidFile) ? '✅ Yes' : '❌ No'}`);

        if (status.running) {
            console.log('\n💡 Server Management:');
            console.log('  To stop the server: Ctrl+C or kill the process');
            console.log('  To restart: node index.js start');
        } else {
            console.log('\n💡 To start the server:');
            console.log('  node index.js start');
        }

    } catch (error) {
        console.error(`❌ Error getting server status: ${error.message}`);
    }
}

// Show log information and management
async function showLogs() {
    console.log(`📋 ${CONFIG.name} - Log Management`);

    const logsDir = join(__dirname, 'logs');
    const exists = existsSync(logsDir);

    console.log('\n📁 Log Directory:');
    console.log(`  Path: ${logsDir}`);
    console.log(`  Status: ${exists ? '✅ Exists' : '❌ Not found'}`);

    if (exists) {
        try {
            const fs = await import('fs/promises');
            const files = await fs.readdir(logsDir);
            const logFiles = files.filter(file => file.endsWith('.log'));

            console.log(`  Files: ${logFiles.length} log files found`);

            if (logFiles.length > 0) {
                console.log('\n📄 Log Files:');
                for (const file of logFiles) {
                    const filePath = join(logsDir, file);
                    const stats = await fs.stat(filePath);
                    const size = (stats.size / 1024).toFixed(2);
                    console.log(`  📄 ${file} (${size} KB)`);
                }
            }

            // Check archive directory
            const archiveDir = join(logsDir, 'archive');
            const archiveExists = existsSync(archiveDir);
            if (archiveExists) {
                const archiveFiles = await fs.readdir(archiveDir);
                console.log(`\n📦 Archive: ${archiveFiles.length} archived files`);
            }

        } catch (error) {
            console.log(`  ❌ Error reading logs: ${error.message}`);
        }
    }

    console.log('\n⚙️ Logging Configuration:');
    console.log(`  File Logging: ${process.env.FILE_LOGGING === 'true' ? '✅ Enabled' : '❌ Disabled'}`);
    console.log(`  Log Level: ${process.env.LOG_LEVEL || 'INFO'}`);
    console.log(`  Max Log Size: ${process.env.MAX_LOG_SIZE || '10MB'}`);
    console.log(`  Max Log Files: ${process.env.MAX_LOG_FILES || '30'}`);

    console.log('\n💡 To enable file logging:');
    console.log('  export FILE_LOGGING=true');
    console.log('  node index.js start');

    console.log('\n💡 To set custom log directory:');
    console.log('  export LOGS_DIR=/path/to/logs');
    console.log('  export FILE_LOGGING=true');
    console.log('  node index.js start');
}

// Check server health
async function checkHealth() {
    console.log(`🏥 Checking ${CONFIG.name} health...`);

    // Check if server files exist
    const files = [
        { path: CONFIG.serverPath, name: 'Server entry point' },
        { path: CONFIG.testPath, name: 'Test suite' },
        { path: join(__dirname, 'package.json'), name: 'Package configuration' },
        { path: join(__dirname, 'src', 'core', 'InDesignMCPServer.js'), name: 'Core server' },
        { path: join(__dirname, 'tests', 'core', 'unified-test-runner.js'), name: 'Test runner' }
    ];

    console.log('\n📁 File System Check:');
    let allFilesExist = true;
    for (const file of files) {
        const exists = existsSync(file.path);
        console.log(`  ${exists ? '✅' : '❌'} ${file.name}: ${exists ? 'Found' : 'Missing'}`);
        if (!exists) allFilesExist = false;
    }

    // Check Node.js version
    console.log('\n🟢 Environment Check:');
    const nodeVersion = process.version;
    const nodeMajor = parseInt(nodeVersion.slice(1).split('.')[0]);
    const nodeSupported = nodeMajor >= 18;
    console.log(`  ${nodeSupported ? '✅' : '❌'} Node.js version: ${nodeVersion} ${nodeSupported ? '(Supported)' : '(Requires Node.js 18+)'}`);

    // Check package.json
    console.log('\n📦 Package Check:');
    try {
        const packagePath = join(__dirname, 'package.json');
        const packageData = JSON.parse(await import('fs/promises').then(fs => fs.readFile(packagePath, 'utf8')));
        console.log(`  ✅ Package name: ${packageData.name}`);
        console.log(`  ✅ Package version: ${packageData.version}`);
        console.log(`  ✅ Main entry: ${packageData.main}`);
        console.log(`  ✅ Type: ${packageData.type}`);
    } catch (error) {
        console.log(`  ❌ Package.json error: ${error.message}`);
    }

    // Summary
    console.log('\n📊 Health Summary:');
    if (allFilesExist && nodeSupported) {
        console.log('  ✅ All checks passed - Server is healthy');
        process.exit(0);
    } else {
        console.log('  ❌ Some checks failed - Please review the issues above');
        process.exit(1);
    }
}

// Main CLI logic
async function main() {
    try {
        switch (command) {
            case 'start':
                await startServer(false);
                break;

            case 'dev':
                await startServer(true);
                break;

            case 'test':
                runTests(subArgs);
                break;

            case 'test:required':
                runTests(['--required']);
                break;

            case 'test:category':
                if (!subArgs[0]) {
                    console.error('❌ Error: Category name required');
                    console.error('   Usage: node index.js test:category <category>');
                    process.exit(1);
                }
                runTests([`--category=${subArgs[0]}`]);
                break;

            case 'test:file':
                if (!subArgs[0]) {
                    console.error('❌ Error: Test file name required');
                    console.error('   Usage: node index.js test:file <filename>');
                    process.exit(1);
                }
                runTests(['--test', subArgs[0]]);
                break;

            case 'health':
                await checkHealth();
                break;

            case 'logs':
                await showLogs();
                break;

            case 'status':
                await showServerStatus();
                break;

            case 'version':
                showVersion();
                break;

            case 'help':
            case '--help':
            case '-h':
                showHelp();
                break;

            default:
                console.error(`❌ Unknown command: ${command}`);
                console.error('   Use "node index.js help" for usage information');
                process.exit(1);
        }
    } catch (error) {
        console.error(`❌ CLI Error: ${error.message}`);
        process.exit(1);
    }
}

// Run the CLI
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
} 