/**
 * Main entry point for InDesign MCP Server
 * Enhanced with better error handling, startup management, and performance monitoring
 */
import { InDesignMCPServer } from './core/InDesignMCPServer.js';
import { performanceMonitor, createHealthCheck } from './utils/debugUtils.js';
import { logger, logServerStartup, logServerShutdown } from './utils/logger.js';

async function main() {
    const startTime = Date.now();
    let server = null;

    try {
        console.log('🚀 Initializing InDesign MCP Server...');

        // Log startup information
        logServerStartup('1.1.0', {
            nodeVersion: process.version,
            platform: process.platform,
            arch: process.arch,
            fileLogging: logger.isFileLoggingEnabled(),
            logsDir: logger.getLogsDir()
        });

        server = new InDesignMCPServer();
        await server.run();

        const startupTime = ((Date.now() - startTime) / 1000).toFixed(2);

        // Enhanced startup confirmation
        const startupInfo = {
            status: 'ready',
            startupTime: parseFloat(startupTime),
            timestamp: new Date().toISOString(),
            version: '1.1.0',
            transport: 'stdio'
        };

        console.log(`✅ InDesign MCP Server started successfully in ${startupTime}s`);

        // Log startup confirmation for external processes
        console.error(JSON.stringify({
            timestamp: new Date().toISOString(),
            level: 'INFO',
            message: 'InDesign MCP Server startup complete',
            data: startupInfo
        }));

        // Setup graceful shutdown handlers
        const shutdown = (signal) => {
            const uptime = ((Date.now() - startTime) / 1000).toFixed(2);
            console.log(`\n🛑 Received ${signal}, shutting down gracefully after ${uptime}s uptime...`);

            // Log final metrics
            performanceMonitor.logMetrics();

            // Log shutdown
            logServerShutdown(signal, parseFloat(uptime));

            // Close logger streams
            logger.close();

            process.exit(0);
        };

        process.on('SIGINT', () => shutdown('SIGINT'));
        process.on('SIGTERM', () => shutdown('SIGTERM'));

    } catch (error) {
        const startupTime = ((Date.now() - startTime) / 1000).toFixed(2);

        // Enhanced error logging
        logger.error('Failed to start InDesign MCP Server', {
            error: error.message,
            stack: error.stack,
            startupTime: parseFloat(startupTime),
            timestamp: new Date().toISOString()
        });

        // Log to stderr instead of stdout to avoid interfering with MCP protocol
        console.error(`❌ Failed to start InDesign MCP Server after ${startupTime}s:`, error.message);

        if (error.stack) {
            console.error('Stack trace:', error.stack);
        }

        // Log error for external processes
        console.error(JSON.stringify({
            timestamp: new Date().toISOString(),
            level: 'ERROR',
            message: 'InDesign MCP Server startup failed',
            data: {
                error: error.message,
                startupTime: parseFloat(startupTime),
                status: 'failed'
            }
        }));

        process.exit(1);
    }
}

// Enhanced uncaught exception handling
process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception', {
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
    });

    console.error('❌ Uncaught Exception:', error.message);
    if (error.stack) {
        console.error('Stack trace:', error.stack);
    }

    // Log for external processes
    console.error(JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'ERROR',
        message: 'Uncaught Exception',
        data: {
            error: error.message,
            status: 'critical_error'
        }
    }));

    process.exit(1);
});

// Enhanced unhandled promise rejection handling
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Promise Rejection', {
        reason: reason?.message || reason,
        promise: promise.toString(),
        timestamp: new Date().toISOString()
    });

    console.error('❌ Unhandled Promise Rejection at:', promise, 'reason:', reason);

    // Log for external processes
    console.error(JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'ERROR',
        message: 'Unhandled Promise Rejection',
        data: {
            reason: reason?.message || reason,
            status: 'critical_error'
        }
    }));

    process.exit(1);
});

main(); 