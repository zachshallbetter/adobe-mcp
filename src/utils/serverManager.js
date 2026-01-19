/**
 * Server Manager Utility
 * 
 * Handles server instance management, process detection, and graceful shutdown
 */

import { spawn, exec } from 'child_process';
import { existsSync, readFileSync, writeFileSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { logger } from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Server Manager Class
 */
export class ServerManager {
    constructor() {
        this.pidFile = join(__dirname, '../../.server.pid');
        this.portFile = join(__dirname, '../../.server.port');
        this.serverProcess = null;
        this.isRunning = false;
    }

    /**
     * Get the PID file path
     */
    getPidFilePath() {
        return this.pidFile;
    }

    /**
     * Check if server is already running
     */
    async isServerRunning() {
        try {
            if (!existsSync(this.pidFile)) {
                return false;
            }

            const pid = parseInt(readFileSync(this.pidFile, 'utf8').trim());

            // Check if process exists
            return await this.isProcessRunning(pid);
        } catch (error) {
            logger.debug('Error checking server status', { error: error.message });
            return false;
        }
    }

    /**
     * Check if a process is running
     */
    async isProcessRunning(pid) {
        return new Promise((resolve) => {
            // Use different commands based on platform
            const command = process.platform === 'win32'
                ? `tasklist /FI "PID eq ${pid}" 2>NUL | find /I /N "${pid}" >NUL`
                : `ps -p ${pid} > /dev/null 2>&1`;

            exec(command, (error) => {
                resolve(!error);
            });
        });
    }

    /**
     * Kill existing server instance
     */
    async killExistingServer() {
        try {
            if (!existsSync(this.pidFile)) {
                logger.debug('No PID file found, no existing server to kill');
                return true;
            }

            const pid = parseInt(readFileSync(this.pidFile, 'utf8').trim());

            if (await this.isProcessRunning(pid)) {
                logger.info('Killing existing server instance', { pid });

                // Try graceful shutdown first
                try {
                    process.kill(pid, 'SIGTERM');

                    // Wait for graceful shutdown
                    await this.waitForProcessEnd(pid, 5000);

                    if (await this.isProcessRunning(pid)) {
                        // Force kill if still running
                        logger.warn('Force killing server process', { pid });
                        process.kill(pid, 'SIGKILL');
                        await this.waitForProcessEnd(pid, 3000);
                    }
                } catch (error) {
                    logger.warn('Error killing process gracefully', { pid, error: error.message });

                    // Try force kill
                    try {
                        process.kill(pid, 'SIGKILL');
                        await this.waitForProcessEnd(pid, 3000);
                    } catch (forceError) {
                        logger.error('Failed to force kill process', { pid, error: forceError.message });
                        return false;
                    }
                }
            }

            // Clean up PID file
            this.cleanupPidFile();
            return true;

        } catch (error) {
            logger.error('Error killing existing server', { error: error.message });
            return false;
        }
    }

    /**
     * Wait for a process to end
     */
    async waitForProcessEnd(pid, timeout = 5000) {
        const startTime = Date.now();

        while (Date.now() - startTime < timeout) {
            if (!(await this.isProcessRunning(pid))) {
                return true;
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        return false;
    }

    /**
     * Start the server
     */
    async startServer(options = {}) {
        try {
            // Kill existing server first
            const killed = await this.killExistingServer();
            if (!killed) {
                throw new Error('Failed to kill existing server instance');
            }

            logger.info('Starting InDesign MCP Server');

            // Start server process
            const serverPath = join(__dirname, '../index.js');
            const nodeArgs = options.debug ? ['--inspect', serverPath] : [serverPath];

            this.serverProcess = spawn('node', nodeArgs, {
                stdio: ['pipe', 'pipe', 'pipe'],
                cwd: dirname(__dirname)
            });

            // Write PID file
            writeFileSync(this.pidFile, this.serverProcess.pid.toString());

            // Handle process events
            this.serverProcess.on('error', (error) => {
                logger.error('Server process error', { error: error.message });
                this.cleanupPidFile();
            });

            this.serverProcess.on('exit', (code) => {
                logger.info('Server process exited', { code });
                this.cleanupPidFile();
                this.isRunning = false;
            });

            this.isRunning = true;

            // Wait for server to start
            await this.waitForServerStart();

            logger.info('Server started successfully', { pid: this.serverProcess.pid });
            return true;

        } catch (error) {
            logger.error('Failed to start server', { error: error.message });
            this.cleanupPidFile();
            return false;
        }
    }

    /**
     * Wait for server to start
     */
    async waitForServerStart(timeout = 10000) {
        const startTime = Date.now();

        return new Promise((resolve, reject) => {
            const checkInterval = setInterval(() => {
                if (Date.now() - startTime > timeout) {
                    clearInterval(checkInterval);
                    reject(new Error('Server startup timeout'));
                    return;
                }

                if (this.isRunning && this.serverProcess && !this.serverProcess.killed) {
                    clearInterval(checkInterval);
                    resolve(true);
                }
            }, 100);
        });
    }

    /**
     * Stop the server
     */
    async stopServer() {
        try {
            if (!this.serverProcess || this.serverProcess.killed) {
                logger.debug('Server process not running');
                return true;
            }

            logger.info('Stopping server', { pid: this.serverProcess.pid });

            // Send SIGTERM for graceful shutdown
            this.serverProcess.kill('SIGTERM');

            // Wait for graceful shutdown
            const graceful = await this.waitForProcessEnd(this.serverProcess.pid, 5000);

            if (!graceful) {
                logger.warn('Force killing server process');
                this.serverProcess.kill('SIGKILL');
                await this.waitForProcessEnd(this.serverProcess.pid, 3000);
            }

            this.cleanupPidFile();
            this.isRunning = false;

            logger.info('Server stopped successfully');
            return true;

        } catch (error) {
            logger.error('Error stopping server', { error: error.message });
            return false;
        }
    }

    /**
     * Get server status
     */
    async getServerStatus() {
        const isRunning = await this.isServerRunning();

        if (isRunning && existsSync(this.pidFile)) {
            const pid = parseInt(readFileSync(this.pidFile, 'utf8').trim());
            return {
                running: true,
                pid,
                pidFile: this.pidFile
            };
        }

        return {
            running: false,
            pid: null,
            pidFile: this.pidFile
        };
    }

    /**
     * Clean up PID file
     */
    cleanupPidFile() {
        try {
            if (existsSync(this.pidFile)) {
                unlinkSync(this.pidFile);
                logger.debug('Cleaned up PID file');
            }
        } catch (error) {
            logger.debug('Error cleaning up PID file', { error: error.message });
        }
    }

    /**
     * Get server process
     */
    getServerProcess() {
        return this.serverProcess;
    }

    /**
     * Check if server is running
     */
    getIsRunning() {
        return this.isRunning;
    }
}

// Export singleton instance
export const serverManager = new ServerManager(); 