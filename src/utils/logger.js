/**
 * Enhanced MCP-Compliant Logging Utility
 * 
 * For STDIO-based MCP servers, we must never write to stdout as it interferes
 * with the JSON-RPC protocol. This utility provides proper logging to stderr
 * and optionally to files with rotation and organization.
 */

import { createWriteStream, existsSync, mkdirSync, appendFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
 * Enhanced MCP-compliant logger with optional file logging
 */
class MCPLogger {
    constructor() {
        this.enabled = process.env.NODE_ENV !== 'production';
        this.logLevel = process.env.LOG_LEVEL || 'INFO';
        this.fileLogging = process.env.FILE_LOGGING === 'true';
        this.logsDir = process.env.LOGS_DIR || join(__dirname, '../../logs');
        this.maxLogSize = parseInt(process.env.MAX_LOG_SIZE) || 10 * 1024 * 1024; // 10MB
        this.maxLogFiles = parseInt(process.env.MAX_LOG_FILES) || 30; // 30 days

        // Initialize file logging if enabled
        if (this.fileLogging) {
            this.initializeFileLogging();
        }
    }

    /**
     * Initialize file logging directories and streams
     */
    initializeFileLogging() {
        try {
            // Create logs directory if it doesn't exist
            if (!existsSync(this.logsDir)) {
                mkdirSync(this.logsDir, { recursive: true });
            }

            // Create archive directory
            const archiveDir = join(this.logsDir, 'archive');
            if (!existsSync(archiveDir)) {
                mkdirSync(archiveDir, { recursive: true });
            }

            // Create log files with today's date
            const today = new Date().toISOString().split('T')[0];
            this.logFiles = {
                server: join(this.logsDir, `server-${today}.log`),
                performance: join(this.logsDir, `performance-${today}.log`),
                errors: join(this.logsDir, `errors-${today}.log`),
                debug: join(this.logsDir, `debug-${today}.log`)
            };

            // Create write streams
            this.writeStreams = {};
            for (const [type, path] of Object.entries(this.logFiles)) {
                this.writeStreams[type] = createWriteStream(path, { flags: 'a' });
            }

            // Log initialization
            this._writeToFile('server', LogLevel.INFO, 'File logging initialized', {
                logsDir: this.logsDir,
                logFiles: Object.keys(this.logFiles)
            });

        } catch (error) {
            console.error('Failed to initialize file logging:', error.message);
            this.fileLogging = false;
        }
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

        // Write to file if enabled
        if (this.fileLogging) {
            this._writeToFile('server', level, message, data);

            // Write errors to separate error log
            if (level === LogLevel.ERROR) {
                this._writeToFile('errors', level, message, data);
            }

            // Write debug messages to separate debug log
            if (level === LogLevel.DEBUG) {
                this._writeToFile('debug', level, message, data);
            }
        }
    }

    /**
     * Write message to specific log file
     */
    _writeToFile(logType, level, message, data = null) {
        try {
            const timestamp = new Date().toISOString();
            const logEntry = {
                timestamp,
                level,
                message,
                ...(data && { data })
            };

            const stream = this.writeStreams[logType];
            if (stream && !stream.destroyed) {
                stream.write(JSON.stringify(logEntry) + '\n');
            }
        } catch (error) {
            // Fallback to stderr if file writing fails
            console.error(`Failed to write to ${logType} log:`, error.message);
        }
    }

    /**
     * Write performance metrics to performance log
     */
    _writePerformance(operation, duration, metadata = null) {
        if (!this.fileLogging) return;

        try {
            const timestamp = new Date().toISOString();
            const logEntry = {
                timestamp,
                level: LogLevel.INFO,
                type: 'PERFORMANCE',
                operation,
                duration,
                ...(metadata && { metadata })
            };

            const stream = this.writeStreams.performance;
            if (stream && !stream.destroyed) {
                stream.write(JSON.stringify(logEntry) + '\n');
            }
        } catch (error) {
            console.error('Failed to write performance log:', error.message);
        }
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

    /**
     * Log performance metrics
     */
    performance(operation, duration, metadata = null) {
        this._writePerformance(operation, duration, metadata);

        // Also log to debug if enabled
        if (this.logLevel === 'DEBUG') {
            this.debug(`Performance: ${operation}`, {
                duration,
                metadata
            });
        }
    }

    /**
     * Log server startup
     */
    serverStartup(version, config) {
        this.info('Server starting', {
            version,
            config,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Log server shutdown
     */
    serverShutdown(signal, uptime) {
        this.info('Server shutting down', {
            signal,
            uptime,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Get log file paths
     */
    getLogFiles() {
        return this.fileLogging ? this.logFiles : null;
    }

    /**
     * Get logs directory
     */
    getLogsDir() {
        return this.logsDir;
    }

    /**
     * Check if file logging is enabled
     */
    isFileLoggingEnabled() {
        return this.fileLogging;
    }

    /**
     * Close all log file streams
     */
    close() {
        if (this.writeStreams) {
            for (const stream of Object.values(this.writeStreams)) {
                if (stream && !stream.destroyed) {
                    stream.end();
                }
            }
        }
    }
}

// Create singleton logger instance
export const logger = new MCPLogger();

// Export convenience functions
export const logError = (message, data) => logger.error(message, data);
export const logWarn = (message, data) => logger.warn(message, data);
export const logInfo = (message, data) => logger.info(message, data);
export const logDebug = (message, data) => logger.debug(message, data);
export const logToolCall = (toolName, args, result) => logger.toolCall(toolName, args, result);
export const logExtendScript = (script, result) => logger.extendScript(script, result);
export const logPerformance = (operation, duration, metadata) => logger.performance(operation, duration, metadata);
export const logServerStartup = (version, config) => logger.serverStartup(version, config);
export const logServerShutdown = (signal, uptime) => logger.serverShutdown(signal, uptime); 