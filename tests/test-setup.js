/**
 * Test Setup Utility
 * Provides a standardized test environment with document, styles, and master page
 */
import { executeTool } from './unified-test-runner.js';

export class TestSetup {
    constructor() {
        this.documentName = null;
        this.masterPageName = null;
        this.stylesCreated = false;
    }

    /**
     * Initialize the test environment
     */
    async initialize() {
        console.log('🔄 Initializing test environment...');

        try {
            // Step 1: Create a test document
            await this.createTestDocument();

            // Step 2: Set up styles after document creation
            await this.setupStyles();

            // Step 3: Create a master page
            await this.createMasterPage();

            console.log('✅ Test environment initialized successfully');
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize test environment:', error.message);
            return false;
        }
    }

    /**
     * Create a test document
     */
    async createTestDocument() {
        console.log('  📄 Creating test document...');

        const result = await executeTool('create_document', {
            name: 'Test Environment',
            width: 210,
            height: 297
        });

        if (result.success) {
            // Extract document name from the result - handle different response formats
            const message = result.result || result.operation || '';
            let documentName = 'Test Environment';

            // Try to extract document name from various response formats
            const match = message.match(/Document name: (.+)/);
            if (match) {
                documentName = match[1];
            } else if (message.includes('created successfully')) {
                // If it just says "created successfully", use the default name
                documentName = 'Test Environment';
            }

            this.documentName = documentName;
            console.log(`  ✅ Document created: ${this.documentName}`);
        } else {
            throw new Error(`Failed to create document: ${result.result || result.error || 'Unknown error'}`);
        }
    }

    /**
     * Set up styles after document creation with comprehensive font sizes
     */
    async setupStyles() {
        if (this.stylesCreated) {
            console.log('  ⏭️  Styles already created, skipping...');
            return;
        }

        console.log('  🎨 Setting up comprehensive styles...');

        // Create paragraph styles with various font sizes
        const paragraphStyles = [
            { name: 'Display Large', fontName: 'Arial\\tBold', fontSize: 48, alignment: 'center' },
            { name: 'Display Medium', fontName: 'Arial\\tBold', fontSize: 36, alignment: 'center' },
            { name: 'Heading 1', fontName: 'Arial\\tBold', fontSize: 24, alignment: 'left' },
            { name: 'Heading 2', fontName: 'Arial\\tBold', fontSize: 18, alignment: 'left' },
            { name: 'Heading 3', fontName: 'Arial\\tBold', fontSize: 16, alignment: 'left' },
            { name: 'Body Large', fontName: 'Arial\\tRegular', fontSize: 14, alignment: 'left' },
            { name: 'Body Text', fontName: 'Arial\\tRegular', fontSize: 12, alignment: 'left' },
            { name: 'Body Small', fontName: 'Arial\\tRegular', fontSize: 10, alignment: 'left' },
            { name: 'Caption', fontName: 'Arial\\tItalic', fontSize: 9, alignment: 'center' },
            { name: 'Footnote', fontName: 'Arial\\tRegular', fontSize: 8, alignment: 'left' }
        ];

        console.log('    📝 Creating paragraph styles...');
        for (let i = 0; i < paragraphStyles.length; i++) {
            const style = paragraphStyles[i];
            const result = await executeTool('create_paragraph_style', style);
            if (result.success) {
                console.log(`      ✅ ${style.name} (${style.fontSize}pt)`);
            } else {
                console.warn(`      ⚠️  Failed to create paragraph style '${style.name}': ${result.result}`);
            }
        }

        // Create character styles
        const characterStyles = [
            { name: 'Bold', fontName: 'Arial\\tBold' },
            { name: 'Italic', fontName: 'Arial\\tItalic' },
            { name: 'Bold Italic', fontName: 'Arial\\tBold Italic' },
            { name: 'Highlight', fontName: 'Arial\\tRegular' },
            { name: 'Small Caps', fontName: 'Arial\\tRegular' }
        ];

        console.log('    🔤 Creating character styles...');
        for (let i = 0; i < characterStyles.length; i++) {
            const style = characterStyles[i];
            const result = await executeTool('create_character_style', style);
            if (result.success) {
                console.log(`      ✅ ${style.name}`);
            } else {
                console.warn(`      ⚠️  Failed to create character style '${style.name}': ${result.result}`);
            }
        }

        // Create colors with various shades
        const colors = [
            { name: 'Primary Blue', red: 0, green: 102, blue: 204 },
            { name: 'Primary Blue Light', red: 51, green: 153, blue: 255 },
            { name: 'Primary Blue Dark', red: 0, green: 51, blue: 102 },
            { name: 'Secondary Gray', red: 128, green: 128, blue: 128 },
            { name: 'Secondary Gray Light', red: 192, green: 192, blue: 192 },
            { name: 'Secondary Gray Dark', red: 64, green: 64, blue: 64 },
            { name: 'Accent Red', red: 204, green: 0, blue: 0 },
            { name: 'Accent Green', red: 0, green: 153, blue: 0 },
            { name: 'Accent Orange', red: 255, green: 153, blue: 0 },
            { name: 'Pure Black', red: 0, green: 0, blue: 0 },
            { name: 'Pure White', red: 255, green: 255, blue: 255 }
        ];

        console.log('    🎨 Creating color swatches...');
        for (let i = 0; i < colors.length; i++) {
            const color = colors[i];
            const result = await executeTool('create_color_swatch', color);
            if (result.success) {
                console.log(`      ✅ ${color.name}`);
            } else {
                console.warn(`      ⚠️  Failed to create color '${color.name}': ${result.result}`);
            }
        }

        this.stylesCreated = true;
        console.log('  ✅ Comprehensive styles setup completed');
    }

    /**
     * Create a master page
     */
    async createMasterPage() {
        console.log('  📋 Creating master page...');

        const result = await executeTool('create_master_spread', {
            name: 'A-Master',
            pageWidth: 210,
            pageHeight: 297
        });

        if (result.success) {
            this.masterPageName = 'A-Master';
            console.log(`  ✅ Master page created: ${this.masterPageName}`);
        } else {
            console.warn(`  ⚠️  Failed to create master page: ${result.result}`);
        }
    }

    /**
     * Get the current test environment info
     */
    getEnvironmentInfo() {
        return {
            documentName: this.documentName,
            masterPageName: this.masterPageName,
            stylesCreated: this.stylesCreated
        };
    }

    /**
     * Clean up the test environment
     */
    async cleanup() {
        console.log('🧹 Cleaning up test environment...');

        try {
            // Close the test document
            if (this.documentName) {
                const result = await executeTool('close_document', {});
                if (result.success) {
                    console.log('  ✅ Test document closed');
                }
            }
        } catch (error) {
            console.warn('  ⚠️  Cleanup warning:', error.message);
        }
    }
}

// Global test setup instance
export const testSetup = new TestSetup();

// Auto-cleanup on process exit
process.on('exit', () => {
    if (testSetup.documentName) {
        console.log('🔄 Auto-cleaning up test environment...');
        // Note: We can't use async/await here, so just log
    }
});

process.on('SIGINT', () => {
    console.log('\n🔄 Received SIGINT, cleaning up...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🔄 Received SIGTERM, cleaning up...');
    process.exit(0);
}); 