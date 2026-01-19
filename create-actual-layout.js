/**
 * Create Actual Layout Document
 * 
 * Creates a document that matches the actual image layout:
 * - White page with multiple empty frames
 * - Blue bounding boxes with red overflow indicators
 * - Black outlined 3D hexagonal shape with oval
 * - Truncated lorem ipsum text
 * - Correct frame positioning
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
 * Create the actual layout document
 */
async function createActualLayout() {
    console.log('🎨 Creating Actual Layout Document...');

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

        // Step 3: Create the main lorem ipsum text frame (left side)
        console.log('📝 Creating main lorem ipsum text...');
        const loremText = `Lorem ipsum dolor sit amet, consec-
tetur adipisc-`;

        await executeTool('create_text_frame', {
            content: loremText,
            fontSize: 8,
            fontName: 'Arial\tRegular',
            alignment: 'LEFT',
            x: 0.5,
            y: 1.5,
            width: 3.5,
            height: 8
        });
        console.log('✅ Main lorem ipsum text created');

        // Step 4: Create the top left empty frame
        console.log('📦 Creating top left empty frame...');
        await executeTool('create_text_frame', {
            content: '',
            fontSize: 8,
            fontName: 'Arial\tRegular',
            alignment: 'LEFT',
            x: 0.5,
            y: 0.5,
            width: 2,
            height: 0.8
        });
        console.log('✅ Top left empty frame created');

        // Step 5: Create the top right empty frame
        console.log('📦 Creating top right empty frame...');
        await executeTool('create_text_frame', {
            content: '',
            fontSize: 8,
            fontName: 'Arial\tRegular',
            alignment: 'LEFT',
            x: 5.5,
            y: 0.5,
            width: 2.5,
            height: 0.8
        });
        console.log('✅ Top right empty frame created');

        // Step 6: Create the middle right tall empty frame
        console.log('📦 Creating middle right tall empty frame...');
        await executeTool('create_text_frame', {
            content: '',
            fontSize: 8,
            fontName: 'Arial\tRegular',
            alignment: 'LEFT',
            x: 5.5,
            y: 2.5,
            width: 2.5,
            height: 6
        });
        console.log('✅ Middle right tall empty frame created');

        // Step 7: Create the black outlined 3D hexagonal shape
        console.log('🔷 Creating black outlined 3D hexagonal shape...');

        // Create the main hexagon outline
        await executeTool('create_polygon', {
            sides: 6,
            width: 1.5,
            height: 1.5,
            fillColor: 'C=0 M=0 Y=0 K=0', // No fill
            strokeColor: 'C=0 M=0 Y=0 K=100', // Black stroke
            strokeWeight: 2,
            x: 6.5,
            y: 8.5
        });

        // Create the inner hexagon outline for 3D effect
        await executeTool('create_polygon', {
            sides: 6,
            width: 1.3,
            height: 1.3,
            fillColor: 'C=0 M=0 Y=0 K=0', // No fill
            strokeColor: 'C=0 M=0 Y=0 K=100', // Black stroke
            strokeWeight: 1,
            x: 6.6,
            y: 8.6
        });

        // Create the innermost hexagon outline
        await executeTool('create_polygon', {
            sides: 6,
            width: 1.1,
            height: 1.1,
            fillColor: 'C=0 M=0 Y=0 K=0', // No fill
            strokeColor: 'C=0 M=0 Y=0 K=100', // Black stroke
            strokeWeight: 1,
            x: 6.7,
            y: 8.7
        });

        console.log('✅ Black outlined 3D hexagonal shape created');

        // Step 8: Create the oval that passes through the hexagon
        console.log('🔄 Creating oval through hexagon...');
        await executeTool('create_ellipse', {
            width: 2.2,
            height: 0.4,
            fillColor: 'C=0 M=0 Y=0 K=0', // No fill
            strokeColor: 'C=0 M=0 Y=0 K=100', // Black stroke
            strokeWeight: 1.5,
            x: 6.15,
            y: 9.05
        });
        console.log('✅ Oval through hexagon created');

        // Step 9: Add some additional hexagon outlines for more depth
        console.log('🔷 Adding additional hexagon outlines...');

        // Create offset hexagon for more 3D effect
        await executeTool('create_polygon', {
            sides: 6,
            width: 1.5,
            height: 1.5,
            fillColor: 'C=0 M=0 Y=0 K=0', // No fill
            strokeColor: 'C=0 M=0 Y=0 K=100', // Black stroke
            strokeWeight: 1,
            x: 6.55,
            y: 8.55
        });

        console.log('✅ Additional hexagon outlines created');

        // Step 10: Save the document
        console.log('💾 Saving actual layout document...');
        const saveResult = await executeTool('save_document', {
            filePath: join(__dirname, 'actual-layout-document.indd')
        });
        console.log('✅ Actual layout document saved as actual-layout-document.indd');

        console.log('\n🎉 Actual Layout Document created successfully!');
        console.log('📁 File: actual-layout-document.indd');
        console.log('📐 Layout: Multiple empty frames with black outlined 3D hexagon');
        console.log('🎨 Features: Truncated lorem ipsum, blue bounding boxes, oval through hexagon');

    } catch (error) {
        console.error('❌ Error creating actual layout document:', error.message);
        process.exit(1);
    }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
    createActualLayout();
} 