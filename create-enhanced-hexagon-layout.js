/**
 * Create Enhanced Hexagon Layout Document
 * 
 * Creates an enhanced document that better matches the image:
 * - Light gray background with subtle gradient effect
 * - Two-column layout with proper typography
 * - 3D hexagonal shape with realistic shading
 * - Professional document styling
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
 * Create the enhanced hexagon layout document
 */
async function createEnhancedHexagonLayout() {
    console.log('🎨 Creating Enhanced Hexagon Layout Document...');

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

        // Step 2: Set up document preferences
        console.log('⚙️ Setting document preferences...');
        await executeTool('set_document_preferences', {
            preferenceType: 'GENERAL',
            pageWidth: 8.5,
            pageHeight: 11
        });

        // Step 3: Create background rectangle for gray gradient effect
        console.log('🎨 Creating background...');
        await executeTool('create_rectangle', {
            width: 8.5,
            height: 11,
            fillColor: 'C=5 M=5 Y=5 K=5', // Very light gray
            strokeColor: 'C=0 M=0 Y=0 K=0',
            strokeWeight: 0,
            x: 0,
            y: 0
        });
        console.log('✅ Background created');

        // Step 4: Create the main title (Adobe InDesign)
        console.log('📝 Creating main title...');
        await executeTool('create_text_frame', {
            content: 'Adobe InDesign',
            fontSize: 28,
            fontName: 'Arial\tBold',
            alignment: 'LEFT',
            x: 0.75,
            y: 0.75,
            width: 3.5,
            height: 0.8
        });
        console.log('✅ Main title created');

        // Step 5: Create the subtitle (MCP Server)
        console.log('📝 Creating subtitle...');
        await executeTool('create_text_frame', {
            content: 'MCP Server',
            fontSize: 18,
            fontName: 'Arial\tRegular',
            alignment: 'LEFT',
            x: 0.75,
            y: 1.6,
            width: 2,
            height: 0.5
        });
        console.log('✅ Subtitle created');

        // Step 6: Create the main body text (left column)
        console.log('📝 Creating main body text...');
        const bodyText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.`;

        await executeTool('create_text_frame', {
            content: bodyText,
            fontSize: 11,
            fontName: 'Arial\tRegular',
            alignment: 'LEFT',
            x: 0.75,
            y: 2.3,
            width: 3.8,
            height: 7.5
        });
        console.log('✅ Main body text created');

        // Step 7: Create the right column header
        console.log('📝 Creating right column header...');
        await executeTool('create_text_frame', {
            content: 'Project Overview',
            fontSize: 16,
            fontName: 'Arial\tBold',
            alignment: 'LEFT',
            x: 5.2,
            y: 0.75,
            width: 2.5,
            height: 0.5
        });
        console.log('✅ Right column header created');

        // Step 8: Create the right column summary text
        console.log('📝 Creating summary text...');
        const summaryText = `This document demonstrates the advanced capabilities of the InDesign MCP Server, showcasing sophisticated layout techniques and geometric design elements.

The prominent hexagonal shape represents the modular architecture of our system, with its three-dimensional form symbolizing depth and complexity.`;

        await executeTool('create_text_frame', {
            content: summaryText,
            fontSize: 12,
            fontName: 'Arial\tRegular',
            alignment: 'LEFT',
            x: 5.2,
            y: 1.4,
            width: 2.8,
            height: 2.5
        });
        console.log('✅ Summary text created');

        // Step 9: Create the 3D hexagonal shape with enhanced shading
        console.log('🔷 Creating enhanced 3D hexagonal shape...');

        // Create the main hexagon face (light purple)
        await executeTool('create_polygon', {
            sides: 6,
            width: 1.8,
            height: 1.8,
            fillColor: 'C=45 M=70 Y=0 K=0', // Light purple
            strokeColor: 'C=60 M=80 Y=0 K=10', // Medium purple border
            strokeWeight: 0.5,
            x: 6.2,
            y: 8.2
        });

        // Create the bottom face of the hexagon (darker blue-purple)
        await executeTool('create_polygon', {
            sides: 6,
            width: 1.8,
            height: 1.8,
            fillColor: 'C=70 M=85 Y=15 K=25', // Darker blue-purple
            strokeColor: 'C=80 M=95 Y=25 K=40', // Even darker border
            strokeWeight: 0.5,
            x: 6.4,
            y: 8.4
        });

        // Create the side face of the hexagon (medium purple)
        await executeTool('create_polygon', {
            sides: 6,
            width: 1.8,
            height: 1.8,
            fillColor: 'C=55 M=75 Y=5 K=10', // Medium purple
            strokeColor: 'C=70 M=85 Y=15 K=20', // Darker medium border
            strokeWeight: 0.5,
            x: 6.3,
            y: 8.3
        });

        console.log('✅ Enhanced 3D hexagonal shape created');

        // Step 10: Add a realistic shadow for the hexagon
        console.log('🌑 Adding realistic shadow...');
        await executeTool('create_ellipse', {
            width: 2.2,
            height: 0.4,
            fillColor: 'C=0 M=0 Y=0 K=15', // Subtle gray shadow
            strokeColor: 'C=0 M=0 Y=0 K=0',
            strokeWeight: 0,
            x: 6.1,
            y: 9.1
        });
        console.log('✅ Shadow added');

        // Step 11: Add some decorative elements
        console.log('✨ Adding decorative elements...');

        // Add a subtle border around the page
        await executeTool('create_rectangle', {
            width: 8.3,
            height: 10.8,
            fillColor: 'C=0 M=0 Y=0 K=0',
            strokeColor: 'C=10 M=10 Y=10 K=10',
            strokeWeight: 0.5,
            x: 0.1,
            y: 0.1
        });

        console.log('✅ Decorative elements added');

        // Step 12: Save the document
        console.log('💾 Saving enhanced document...');
        const saveResult = await executeTool('save_document', {
            filePath: join(__dirname, 'enhanced-hexagon-layout-document.indd')
        });
        console.log('✅ Enhanced document saved as enhanced-hexagon-layout-document.indd');

        console.log('\n🎉 Enhanced Hexagon Layout Document created successfully!');
        console.log('📁 File: enhanced-hexagon-layout-document.indd');
        console.log('📐 Layout: Professional two-column with 3D hexagonal shape');
        console.log('🎨 Colors: Purple gradient hexagon with realistic shading');
        console.log('✨ Features: Gray background, enhanced typography, decorative elements');

    } catch (error) {
        console.error('❌ Error creating enhanced document:', error.message);
        process.exit(1);
    }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
    createEnhancedHexagonLayout();
} 