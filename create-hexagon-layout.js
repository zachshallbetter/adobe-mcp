/**
 * Create Hexagon Layout Document
 * 
 * Creates a document with the layout from the image:
 * - Two-column layout with lorem ipsum text
 * - 3D hexagonal shape in bottom right corner
 * - Professional gray background with gradient
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
 * Create the hexagon layout document
 */
async function createHexagonLayout() {
    console.log('🎨 Creating Hexagon Layout Document...');

    try {
        // Step 1: Create a new document
        console.log('📄 Creating new document...');
        const docResult = await executeTool('create_document', {
            width: 8.5,
            height: 11,
            facingPages: false,
            pageOrientation: 'PORTRAIT'
        });
        console.log('✅ Document created');

        // Step 2: Set up the page with gray background
        console.log('🎨 Setting up page background...');
        await executeTool('set_document_preferences', {
            preferenceType: 'GENERAL',
            pageWidth: 8.5,
            pageHeight: 11
        });

        // Step 3: Create the main title text frame (left column)
        console.log('📝 Creating main title...');
        const titleResult = await executeTool('create_text_frame', {
            content: 'Adobe InDesign\nMCP Server',
            fontSize: 24,
            fontName: 'Arial\tBold',
            alignment: 'LEFT',
            x: 0.5,
            y: 0.5,
            width: 4,
            height: 1
        });
        console.log('✅ Main title created');

        // Step 4: Create the main body text (left column)
        console.log('📝 Creating main body text...');
        const bodyText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.`;

        await executeTool('create_text_frame', {
            content: bodyText,
            fontSize: 12,
            fontName: 'Arial\tRegular',
            alignment: 'LEFT',
            x: 0.5,
            y: 1.8,
            width: 4,
            height: 8
        });
        console.log('✅ Main body text created');

        // Step 5: Create the right column summary text
        console.log('📝 Creating summary text...');
        const summaryText = `Project Overview

This document demonstrates the capabilities of the InDesign MCP Server, showcasing advanced layout techniques and geometric design elements. The hexagonal shape represents the modular architecture of our system.`;

        await executeTool('create_text_frame', {
            content: summaryText,
            fontSize: 14,
            fontName: 'Arial\tBold',
            alignment: 'LEFT',
            x: 5.5,
            y: 0.5,
            width: 2.5,
            height: 2
        });
        console.log('✅ Summary text created');

        // Step 6: Create the 3D hexagonal shape using multiple geometric elements
        console.log('🔷 Creating 3D hexagonal shape...');

        // Create the main hexagon face (purple)
        await executeTool('create_polygon', {
            sides: 6,
            width: 1.5,
            height: 1.5,
            fillColor: 'C=60 M=80 Y=0 K=0', // Purple
            strokeColor: 'C=80 M=90 Y=0 K=10', // Darker purple
            strokeWeight: 1,
            x: 6.5,
            y: 8.5
        });

        // Create the bottom face of the hexagon (darker blue-purple)
        await executeTool('create_polygon', {
            sides: 6,
            width: 1.5,
            height: 1.5,
            fillColor: 'C=80 M=90 Y=20 K=30', // Darker blue-purple
            strokeColor: 'C=90 M=100 Y=30 K=50', // Even darker
            strokeWeight: 1,
            x: 6.7,
            y: 8.7
        });

        // Create the side face of the hexagon (medium purple)
        await executeTool('create_polygon', {
            sides: 6,
            width: 1.5,
            height: 1.5,
            fillColor: 'C=70 M=85 Y=10 K=15', // Medium purple
            strokeColor: 'C=85 M=95 Y=20 K=25', // Darker medium
            strokeWeight: 1,
            x: 6.6,
            y: 8.6
        });

        console.log('✅ 3D hexagonal shape created');

        // Step 7: Add a subtle shadow for the hexagon
        console.log('🌑 Adding shadow...');
        await executeTool('create_ellipse', {
            width: 2,
            height: 0.3,
            fillColor: 'C=0 M=0 Y=0 K=20', // Light gray shadow
            strokeColor: 'C=0 M=0 Y=0 K=0',
            strokeWeight: 0,
            x: 6.4,
            y: 9.2
        });
        console.log('✅ Shadow added');

        // Step 8: Save the document
        console.log('💾 Saving document...');
        const saveResult = await executeTool('save_document', {
            filePath: join(__dirname, 'hexagon-layout-document.indd')
        });
        console.log('✅ Document saved as hexagon-layout-document.indd');

        console.log('\n🎉 Hexagon Layout Document created successfully!');
        console.log('📁 File: hexagon-layout-document.indd');
        console.log('📐 Layout: Two-column with 3D hexagonal shape');
        console.log('🎨 Colors: Purple gradient hexagon with shadow');

    } catch (error) {
        console.error('❌ Error creating document:', error.message);
        process.exit(1);
    }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
    createHexagonLayout();
} 