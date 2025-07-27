/**
 * MCP Debugging Utilities
 * 
 * Based on MCP documentation best practices for debugging servers
 */

import { logger } from './logger.js';

/**
 * Enhanced error handling for MCP tool calls
 */
export class MCPError extends Error {
    constructor(message, code, details = {}) {
        super(message);
        this.name = 'MCPError';
        this.code = code;
        this.details = details;
        this.timestamp = new Date().toISOString();
    }

    toJSON() {
        return {
            name: this.name,
            message: this.message,
            code: this.code,
            details: this.details,
            timestamp: this.timestamp,
            stack: this.stack
        };
    }
}

/**
 * Tool execution wrapper with enhanced error handling
 */
export async function executeToolSafely(toolName, args, handler) {
    const startTime = Date.now();

    try {
        logger.debug(`Executing tool: ${toolName}`, { args });

        const result = await handler(args);
        const duration = Date.now() - startTime;

        logger.toolCall(toolName, args, result);
        logger.debug(`Tool completed: ${toolName}`, { duration, success: result.success });

        return result;
    } catch (error) {
        const duration = Date.now() - startTime;

        logger.error(`Tool failed: ${toolName}`, {
            error: error.message,
            stack: error.stack,
            duration,
            args
        });

        // Return structured error response
        return {
            success: false,
            message: `Tool execution failed: ${error.message}`,
            error: {
                code: error.code || 'TOOL_EXECUTION_ERROR',
                details: error.details || {},
                timestamp: new Date().toISOString()
            }
        };
    }
}

/**
 * ExtendScript execution wrapper with error handling
 */
export async function executeExtendScriptSafely(script, context = {}) {
    const startTime = Date.now();

    try {
        logger.debug('Executing ExtendScript', {
            scriptLength: script.length,
            context: Object.keys(context)
        });

        // Execute the ExtendScript (this would be your actual execution logic)
        const result = await executeExtendScript(script, context);
        const duration = Date.now() - startTime;

        logger.extendScript(script, result);
        logger.debug('ExtendScript completed', { duration, success: result.success });

        return result;
    } catch (error) {
        const duration = Date.now() - startTime;

        logger.error('ExtendScript failed', {
            error: error.message,
            stack: error.stack,
            duration,
            scriptPreview: script.substring(0, 200) + '...'
        });

        return {
            success: false,
            message: `ExtendScript execution failed: ${error.message}`,
            error: {
                code: 'EXTENDSCRIPT_ERROR',
                details: { scriptLength: script.length },
                timestamp: new Date().toISOString()
            }
        };
    }
}

/**
 * Validate tool arguments against schema
 */
export function validateToolArgs(toolName, args, schema) {
    const errors = [];

    // Check required fields
    if (schema.required) {
        for (const field of schema.required) {
            if (args[field] === undefined) {
                errors.push(`Missing required field: ${field}`);
            }
        }
    }

    // Check field types
    if (schema.properties) {
        for (const [field, value] of Object.entries(args)) {
            const fieldSchema = schema.properties[field];
            if (fieldSchema && !validateFieldType(value, fieldSchema)) {
                errors.push(`Invalid type for field '${field}': expected ${fieldSchema.type}, got ${typeof value}`);
            }
        }
    }

    if (errors.length > 0) {
        throw new MCPError(
            `Invalid arguments for tool '${toolName}'`,
            'INVALID_ARGS',
            { errors, providedArgs: args }
        );
    }
}

/**
 * Validate individual field type
 */
function validateFieldType(value, schema) {
    switch (schema.type) {
        case 'string':
            return typeof value === 'string';
        case 'number':
            return typeof value === 'number' && !isNaN(value);
        case 'integer':
            return Number.isInteger(value);
        case 'boolean':
            return typeof value === 'boolean';
        case 'array':
            return Array.isArray(value);
        case 'object':
            return typeof value === 'object' && value !== null && !Array.isArray(value);
        default:
            return true; // Unknown type, assume valid
    }
}

/**
 * Performance monitoring for tool execution
 */
export class PerformanceMonitor {
    constructor() {
        this.metrics = new Map();
    }

    startTimer(toolName) {
        this.metrics.set(toolName, {
            startTime: Date.now(),
            calls: (this.metrics.get(toolName)?.calls || 0) + 1
        });
    }

    endTimer(toolName) {
        const metric = this.metrics.get(toolName);
        if (metric) {
            metric.duration = Date.now() - metric.startTime;
            metric.avgDuration = (metric.avgDuration || 0) * 0.9 + metric.duration * 0.1;
        }
    }

    getMetrics() {
        const result = {};
        for (const [toolName, metric] of this.metrics) {
            result[toolName] = {
                calls: metric.calls,
                avgDuration: metric.avgDuration,
                lastDuration: metric.duration
            };
        }
        return result;
    }

    logMetrics() {
        const metrics = this.getMetrics();
        logger.info('Performance metrics', { metrics });
    }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * Health check utility for MCP server
 */
export function createHealthCheck() {
    return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.1.0',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        performance: performanceMonitor.getMetrics()
    };
}

/**
 * Graceful shutdown handler
 */
export function setupGracefulShutdown(server) {
    const shutdown = (signal) => {
        logger.info(`Received ${signal}, shutting down gracefully`);

        // Log final metrics
        performanceMonitor.logMetrics();

        // Close server connections
        if (server && typeof server.close === 'function') {
            server.close(() => {
                logger.info('Server closed successfully');
                process.exit(0);
            });
        } else {
            process.exit(0);
        }
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
        logger.error('Uncaught exception', { error: error.message, stack: error.stack });
        shutdown('uncaughtException');
    });

    process.on('unhandledRejection', (reason, promise) => {
        logger.error('Unhandled rejection', { reason, promise });
        shutdown('unhandledRejection');
    });
} 