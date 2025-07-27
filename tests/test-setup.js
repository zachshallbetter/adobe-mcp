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
            // Extract document name from the result
            const message = result.result;
            const match = message.match(/Document name: (.+)/);
            this.documentName = match ? match[1] : 'Test Environment';
            console.log(`  ✅ Document created: ${this.documentName}`);
        } else {
            throw new Error(`Failed to create document: ${result.result}`);
        }
    }

    /**
     * Set up styles after document creation
     */
    async setupStyles() {
        if (this.stylesCreated) {
            console.log('  ⏭️  Styles already created, skipping...');
            return;
        }

        console.log('  🎨 Setting up styles...');

        // Create paragraph styles
        const paragraphStyles = [
            { name: 'Heading 1', fontName: 'Arial\\tBold', fontSize: 24, alignment: 'center' },
            { name: 'Heading 2', fontName: 'Arial\\tBold', fontSize: 18, alignment: 'left' },
            { name: 'Body Text', fontName: 'Arial\\tRegular', fontSize: 12, alignment: 'left' },
            { name: 'Caption', fontName: 'Arial\\tItalic', fontSize: 10, alignment: 'center' }
        ];

        for (const style of paragraphStyles) {
            const result = await executeTool('create_paragraph_style', style);
            if (!result.success) {
                console.warn(`  ⚠️  Failed to create paragraph style '${style.name}': ${result.result}`);
            }
        }

        // Create character styles
        const characterStyles = [
            { name: 'Bold', fontName: 'Arial\\tBold' },
            { name: 'Italic', fontName: 'Arial\\tItalic' },
            { name: 'Highlight', fontName: 'Arial\\tRegular' }
        ];

        for (const style of characterStyles) {
            const result = await executeTool('create_character_style', style);
            if (!result.success) {
                console.warn(`  ⚠️  Failed to create character style '${style.name}': ${result.result}`);
            }
        }

        // Create colors
        const colors = [
            { name: 'Primary Blue', red: 0, green: 102, blue: 204 },
            { name: 'Secondary Gray', red: 128, green: 128, blue: 128 },
            { name: 'Accent Red', red: 204, green: 0, blue: 0 }
        ];

        for (const color of colors) {
            const result = await executeTool('create_color_swatch', color);
            if (!result.success) {
                console.warn(`  ⚠️  Failed to create color '${color.name}': ${result.result}`);
            }
        }

        this.stylesCreated = true;
        console.log('  ✅ Styles setup completed');
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