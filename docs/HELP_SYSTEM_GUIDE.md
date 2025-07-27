# InDesign MCP Server - Help System Guide

## Overview

The InDesign MCP Server features a comprehensive, intelligent help system designed to make InDesign automation accessible to users of all experience levels. This guide covers all aspects of the help system and how to use it effectively.

## Quick Start

### Basic Help Commands

```javascript
// Get general help overview
await tools.call("help", {});

// Get help for a specific tool
await tools.call("help", { tool: "create_document" });

// Get help for a category of tools
await tools.call("help", { category: "workflow" });

// Get detailed help with examples
await tools.call("help", { tool: "create_text_frame", format: "examples" });
```

## Help System Features

### 1. Difficulty Levels

Every tool is categorized by complexity to help you choose appropriate tools:

- **🟢 Beginner**: Basic tools for getting started
  - `create_document`, `create_text_frame`, `create_color_swatch`, `place_image`
- **🟡 Intermediate**: Tools requiring some experience
  - `create_paragraph_style`, `create_publication_document`, `setup_document_styles`
- **🔴 Expert**: Advanced tools for complex workflows
  - `create_master_spread`, `apply_master_spread`, `execute_indesign_code`

### 2. Best Practices

Each tool includes specific tips and recommendations:

```javascript
// Example: create_text_frame best practices
- Use paragraph and character styles for consistency
- Set appropriate font sizes (12pt for body, 18pt+ for headings)
- Consider line spacing (leading) for readability
- Use proper alignment based on content type
```

### 3. Related Tools

Smart suggestions for tools that work well together:

```javascript
// Example: create_color_swatch related tools
- setup_document_styles: Set up complete style system
- apply_design_system: Apply design system to document
- list_color_swatches: List all available colors
```

### 4. Troubleshooting Guides

Comprehensive solutions for common issues:

#### Available Troubleshooting Topics:
- `colors-not-appearing`: Colors appearing black or incorrect
- `fonts-not-loading`: Fonts not applying correctly
- `images-not-placing`: Image placement issues
- `document-not-saving`: Document save problems
- `workflow-tools-failing`: Workflow tool issues

#### Usage:
```javascript
await tools.call("help", { troubleshooting: "colors-not-appearing" });
```

### 5. Scenario-Based Workflows

Complete step-by-step workflows for common tasks:

#### Available Scenarios:
- `create-newsletter`: Professional newsletter creation
- `design-brochure`: Marketing brochure design
- `create-catalog`: Product catalog creation

#### Usage:
```javascript
await tools.call("help", { scenario: "create-newsletter" });
```

## Help Parameters

### Core Parameters

| Parameter  | Type   | Description                                            | Default        |
| ---------- | ------ | ------------------------------------------------------ | -------------- |
| `tool`     | string | Specific tool name to get help for                     | null           |
| `category` | string | Category of tools to list                              | 'all'          |
| `format`   | string | Output format: 'summary', 'detailed', 'examples'       | 'summary'      |
| `level`    | string | Experience level: 'beginner', 'intermediate', 'expert' | 'intermediate' |

### Advanced Parameters

| Parameter         | Type   | Description                      | Options                          |
| ----------------- | ------ | -------------------------------- | -------------------------------- |
| `troubleshooting` | string | Get troubleshooting help         | See troubleshooting topics above |
| `scenario`        | string | Get scenario-based workflow help | See scenarios above              |

## Tool Categories

### Smart Workflow Tools
High-level workflow tools that orchestrate multiple operations:
- `create_publication_document`
- `setup_document_styles`
- `create_content_section`
- `add_visual_element`
- `create_layout_template`
- `apply_design_system`
- `update_content_batch`
- `create_data_table`
- `publish_document`
- `get_workflow_help`
- `apply_template`

### Document Management
Create, open, save, and manage InDesign documents:
- `create_document`
- `open_document`
- `save_document`
- `close_document`
- `get_document_info`

### Page Operations
Add, delete, navigate, and manage pages:
- `add_page`
- `delete_page`
- `navigate_to_page`
- `get_page_info`
- `set_page_background`

### Text & Typography
Create and edit text frames, apply styles:
- `create_text_frame`
- `edit_text_frame`
- `get_text_info`
- `apply_paragraph_style`
- `apply_character_style`

### Graphics & Images
Create shapes and place images with scaling:
- `create_rectangle`
- `create_ellipse`
- `create_polygon`
- `place_image`
- `get_image_info`

### Styles & Colors
Create and manage colors, paragraph, character, and object styles:
- `create_color_swatch`
- `list_color_swatches`
- `create_paragraph_style`
- `create_character_style`
- `create_object_style`
- `list_styles`

### Layout & Positioning
Group objects, create master spreads, manage positioning:
- `create_group`
- `ungroup`
- `create_master_spread`
- `apply_master_spread`

### Export & Utilities
Export documents and run custom code:
- `export_pdf`
- `export_images`
- `execute_indesign_code`

## Usage Examples

### For Beginners

```javascript
// Start with basic help overview
await tools.call("help", {});

// Get help for a simple tool
await tools.call("help", { tool: "create_document", format: "detailed" });

// Learn about workflow tools
await tools.call("help", { category: "workflow" });

// Get troubleshooting help
await tools.call("help", { troubleshooting: "fonts-not-loading" });
```

### For Intermediate Users

```javascript
// Get examples and best practices
await tools.call("help", { tool: "create_text_frame", format: "examples" });

// Learn about related tools
await tools.call("help", { tool: "create_color_swatch", format: "detailed" });

// Follow a complete workflow
await tools.call("help", { scenario: "design-brochure" });
```

### For Experts

```javascript
// Get expert-level tool help
await tools.call("help", { tool: "create_master_spread", level: "expert" });

// Get advanced troubleshooting
await tools.call("help", { troubleshooting: "workflow-tools-failing" });

// Get detailed workflow information
await tools.call("help", { tool: "apply_design_system", format: "examples" });
```

## Troubleshooting Common Issues

### Colors Not Appearing Correctly

**Issue**: Colors appearing black or incorrect in InDesign

**Solutions**:
- Use hex codes instead of RGB values for better compatibility
- Ensure color swatch names are unique
- Check that colors are being applied to the correct elements
- Use the multi-format color support (RGB, CMYK, Hex)
- Verify color values are within valid ranges (0-255 for RGB, 0-100 for CMYK)

### Fonts Not Loading or Applying

**Issue**: Fonts not appearing or applying incorrectly

**Solutions**:
- Use the correct font name format: "FontName\tStyle" (e.g., "Arial\tBold")
- Ensure fonts are installed on your system
- Use common fonts like Arial, Helvetica, or Times New Roman
- Check font name spelling and case sensitivity
- Try using the default font fallback: "Arial\tRegular"

### Images Not Placing Correctly

**Issue**: Images not appearing or placing with errors

**Solutions**:
- Use absolute file paths instead of relative paths
- Ensure image files exist and are accessible
- Check file format compatibility (JPG, PNG, TIFF, etc.)
- Verify image file permissions
- Use appropriate scaling percentages (1-1000%)

### Document Not Saving

**Issue**: Issues with saving documents

**Solutions**:
- Ensure you have write permissions in the target directory
- Use absolute file paths for saving
- Check available disk space
- Close the document in InDesign before saving programmatically
- Use descriptive file names without special characters

### Workflow Tools Failing

**Issue**: Smart workflow tools not working as expected

**Solutions**:
- Start with basic tools before using workflow tools
- Ensure document is open before using workflow tools
- Check that required parameters are provided
- Use the get_workflow_help tool for specific guidance
- Try individual tools first to isolate issues

## Scenario Workflows

### Creating a Newsletter

Complete workflow for creating a professional newsletter:

1. **Create newsletter document** with appropriate settings
2. **Set up brand colors and typography**
3. **Add newsletter header**
4. **Add main content**
5. **Export as PDF**

### Designing a Brochure

Complete workflow for creating a marketing brochure:

1. **Create brochure document**
2. **Set up brand styling**
3. **Add product images**
4. **Add product specifications**
5. **Export for print**

### Creating a Product Catalog

Complete workflow for creating a product catalog:

1. **Create catalog document**
2. **Set up catalog styling**
3. **Create product page template**
4. **Add product table**
5. **Export catalog**

## Best Practices

### General Tips

1. **Start Simple**: Begin with basic tools before using workflow tools
2. **Use Help**: Always check the help system for guidance
3. **Test Incrementally**: Test individual tools before combining them
4. **Follow Scenarios**: Use scenario-based workflows for common tasks
5. **Check Parameters**: Verify all required parameters are provided

### Tool-Specific Tips

#### Document Creation
- Start with standard page sizes (A4, Letter) for compatibility
- Use facing pages for multi-page publications
- Set appropriate margins based on your content type
- Consider bleed settings for print projects

#### Text and Typography
- Use paragraph and character styles for consistency
- Set appropriate font sizes (12pt for body, 18pt+ for headings)
- Consider line spacing (leading) for readability
- Use proper alignment based on content type

#### Colors and Styles
- Use hex codes for web-safe colors
- Create a consistent color palette
- Consider CMYK values for print projects
- Name colors descriptively (e.g., "Brand Blue" not "Blue1")

#### Images and Graphics
- Use high-resolution images (300 DPI for print)
- Maintain aspect ratio when scaling
- Consider image placement in layout context
- Use appropriate scaling percentages

#### Workflow Tools
- Choose the right publication type for your content
- Start with a design template that matches your brand
- Plan your page count before creating
- Consider your target audience when selecting settings

## Advanced Usage

### Custom Help Queries

```javascript
// Get help for multiple tools
const tools = ['create_document', 'create_text_frame', 'place_image'];
for (const tool of tools) {
    const help = await tools.call("help", { tool, format: "summary" });
    console.log(help);
}

// Get help for all categories
const categories = ['workflow', 'document', 'text', 'graphics', 'styles'];
for (const category of categories) {
    const help = await tools.call("help", { category });
    console.log(help);
}
```

### Integration with Workflows

```javascript
// Get help before starting a workflow
const workflowHelp = await tools.call("help", { scenario: "create-newsletter" });

// Get troubleshooting help when issues arise
const troubleshootingHelp = await tools.call("help", { 
    troubleshooting: "colors-not-appearing" 
});

// Get tool-specific help during development
const toolHelp = await tools.call("help", { 
    tool: "create_publication_document", 
    format: "examples" 
});
```

## Help System Architecture

### Core Components

1. **HelpHandlers Class** (`src/handlers/helpHandlers.js`)
   - Main help system implementation
   - Tool categories and definitions
   - Difficulty levels and best practices
   - Related tools mapping

2. **Tool Definitions** (`src/types/toolDefinitionsContent.js`)
   - Enhanced help tool definition
   - New parameters for advanced help features
   - Comprehensive parameter descriptions

3. **Workflow Integration**
   - Smart workflow tools included in help system
   - Scenario-based guidance
   - Best practices for workflow tools

### Data Structures

The help system uses several key data structures:

- **Tool Categories**: Organized grouping of related tools
- **Difficulty Levels**: Complexity indicators for each tool
- **Best Practices**: Specific tips for each tool
- **Related Tools**: Suggestions for workflow enhancement
- **Troubleshooting**: Solutions for common issues
- **Scenarios**: Complete workflow guides

## Testing

The help system is thoroughly tested with comprehensive test suites:

- **Basic Help System Test** (`tests/test-help-system.js`)
- **Enhanced Help System Test** (`tests/test-enhanced-help-system.js`)

Test coverage includes:
- All help formats and parameters
- Difficulty level display
- Best practices inclusion
- Related tools suggestions
- Troubleshooting functionality
- Scenario-based workflows
- Tool definition accuracy

## Conclusion

The enhanced help system transforms the InDesign MCP Server into an intelligent, user-friendly platform that guides users through complex workflows while providing comprehensive support for troubleshooting and best practices. Whether you're a beginner learning the basics or an expert working on complex projects, the help system provides the guidance you need to succeed with InDesign automation.

For additional support, refer to the main documentation in the `docs/` directory or use the help system itself to explore available tools and workflows. 