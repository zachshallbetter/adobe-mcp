/**
 * MCP-Compliant Logging Utility
 * 
 * For STDIO-based MCP servers, we must never write to stdout as it interferes
 * with the JSON-RPC protocol. This utility provides proper logging to stderr.
 */

import { createWriteStream } from 'fs';

// Create a write stream to stderr for logging
const stderrStream = process.stderr;

/**
 * Log levels for different types of messages
 */
export const LogLevel = {
    ERROR: 'ERROR',
    WARN: 'WARN',
    INFO: 'INFO',
    DEBUG: 'DEBUG'
};

/**
 * MCP-compliant logger that writes to stderr
 */
class MCPLogger {
    constructor() {
        this.enabled = process.env.NODE_ENV !== 'production';
        this.logLevel = process.env.LOG_LEVEL || 'INFO';
    }

    /**
     * Write message to stderr with timestamp and level
     */
    _write(level, message, data = null) {
        if (!this.enabled) return;

        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level,
            message,
            ...(data && { data })
        };

        // Write to stderr (safe for MCP)
        stderrStream.write(JSON.stringify(logEntry) + '\n');
    }

    /**
     * Log error messages
     */
    error(message, data = null) {
        this._write(LogLevel.ERROR, message, data);
    }

    /**
     * Log warning messages
     */
    warn(message, data = null) {
        if (this.logLevel === 'ERROR') return;
        this._write(LogLevel.WARN, message, data);
    }

    /**
     * Log info messages
     */
    info(message, data = null) {
        if (['ERROR', 'WARN'].includes(this.logLevel)) return;
        this._write(LogLevel.INFO, message, data);
    }

    /**
     * Log debug messages
     */
    debug(message, data = null) {
        if (this.logLevel !== 'DEBUG') return;
        this._write(LogLevel.DEBUG, message, data);
    }

    /**
     * Log tool execution for debugging
     */
    toolCall(toolName, args, result) {
        this.debug(`Tool called: ${toolName}`, {
            args,
            success: result.success,
            message: result.message
        });
    }

    /**
     * Log ExtendScript execution
     */
    extendScript(script, result) {
        this.debug('ExtendScript executed', {
            script: script.substring(0, 100) + '...',
            success: result.success,
            message: result.message
        });
    }
}

// Export singleton instance
export const logger = new MCPLogger();

/**
 * Convenience functions for common logging patterns
 */
export const logError = (message, data) => logger.error(message, data);
export const logWarn = (message, data) => logger.warn(message, data);
export const logInfo = (message, data) => logger.info(message, data);
export const logDebug = (message, data) => logger.debug(message, data);
export const logToolCall = (toolName, args, result) => logger.toolCall(toolName, args, result);
export const logExtendScript = (script, result) => logger.extendScript(script, result); 