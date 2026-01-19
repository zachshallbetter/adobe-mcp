/**
 * Add New Page with Black Circle
 * 
 * Adds a new page to the open document and places a black circle in the center
 */

import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const SERVER_PATH = join(__dirname, 'src/index.js');

/**
 * Execute MCP tool call
 */
async function executeTool(toolName, args = {}) {
    return new Promise((resolve, reject) => {
        const request = {
            jsonrpc: '2.0',
            id: Date.now(),
            method: 'tools/call',
            params: {
                name: toolName,
                arguments: args
            }
        };

        const process = spawn('node', [SERVER_PATH], {
            stdio: ['pipe', 'pipe', 'pipe']
        });

        let stdout = '';
        let stderr = '';

        process.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        process.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        process.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`Process exited with code ${code}: ${stderr}`));
                return;
            }

            try {
                const lines = stdout.trim().split('\n');
                const lastLine = lines[lines.length - 1];
                const response = JSON.parse(lastLine);

                if (response.error) {
                    reject(new Error(`Tool call failed: ${response.error.message}`));
                } else {
                    resolve(response.result);
                }
            } catch (error) {
                reject(new Error(`Failed to parse response: ${error.message}`));
            }
        });

        // Send request
        process.stdin.write(JSON.stringify(request) + '\n');
        process.stdin.end();
    });
}

/**
 * Add new page with black circle
 */
async function addPageWithCircle() {
    console.log('📄 Adding new page with black circle...');

    try {
        // Step 1: Add a new page
        console.log('📄 Adding new page...');
        const pageResult = await executeTool('add_page', {
            pageWidth: 8.5,
            pageHeight: 11
        });
        console.log('✅ New page added');

        // Step 2: Get page dimensions to calculate center
        console.log('📏 Calculating page center...');
        const pageWidth = 8.5;
        const pageHeight = 11;

        // Calculate center coordinates (convert to points)
        const centerX = (pageWidth * 72) / 2; // Convert inches to points
        const centerY = (pageHeight * 72) / 2;

        // Circle size (1 inch diameter)
        const circleSize = 1 * 72; // 1 inch in points
        const circleRadius = circleSize / 2;

        // Position circle at center (subtract radius to center the circle)
        const circleX = centerX - circleRadius;
        const circleY = centerY - circleRadius;

        // Step 3: Create black circle in the center
        console.log('⚫ Creating black circle in center...');
        await executeTool('create_ellipse', {
            width: circleSize,
            height: circleSize,
            fillColor: 'C=0 M=0 Y=0 K=100', // Black fill
            strokeColor: 'C=0 M=0 Y=0 K=100', // Black stroke
            strokeWeight: 1,
            x: circleX,
            y: circleY
        });
        console.log('✅ Black circle created in center');

        console.log('\n🎉 New page with black circle added successfully!');
        console.log('📄 Page: New page added to document');
        console.log('⚫ Circle: 1-inch black circle centered on page');
        console.log('📏 Position: Centered at page coordinates');

    } catch (error) {
        console.error('❌ Error adding page with circle:', error.message);
        process.exit(1);
    }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
    addPageWithCircle();
} 