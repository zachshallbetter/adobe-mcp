# MCP Features Guide - Resources and Prompts

## Overview

The InDesign MCP Server now implements the complete MCP architecture with all three building blocks:

- **Tools**: 135+ individual tools + 11 workflow tools (existing)
- **Resources**: Structured access to InDesign data (new)
- **Prompts**: Template-based workflows (new)

This guide explains how to use these new features based on the [MCP Server Concepts](https://modelcontextprotocol.io/docs/learn/server-concepts) and [MCP Prompts specification](https://modelcontextprotocol.io/specification/2025-06-18/server/prompts).

## MCP Resources

### What are Resources?

Resources provide structured access to InDesign data that AI models can use as context. Unlike tools that perform actions, resources provide information that helps the AI understand the current state of your InDesign documents.

### Available Resources

#### Direct Resources

These are automatically available when you have InDesign documents open:

- **`indesign://document/active`** - Currently active document information
- **`indesign://colors/swatches`** - All color swatches in the document
- **`indesign://styles/paragraph`** - All paragraph styles
- **`indesign://styles/character`** - All character styles
- **`indesign://pages/all`** - All pages in the document

#### Resource Templates

These allow dynamic access to specific items:

- **`indesign://document/{name}`** - Access document by name
- **`indesign://page/{number}`** - Access specific page by number
- **`indesign://color/{name}`** - Access color swatch by name
- **`indesign://style/{type}/{name}`** - Access style by type and name
- **`indesign://text-frame/{id}`** - Access text frame by ID
- **`indesign://image/{id}`** - Access image by ID

### Using Resources

#### In Claude for Desktop

1. **Select Resources**: When asking Claude to help with InDesign, you can select relevant resources as context
2. **Automatic Discovery**: Claude can discover available resources and suggest relevant ones
3. **Dynamic Access**: Use resource templates to access specific items

#### Example Usage

```javascript
// Get document information
const docInfo = await resources.read("indesign://document/active");

// Get all color swatches
const colors = await resources.read("indesign://colors/swatches");

// Get specific page
const page3 = await resources.read("indesign://page/3");

// Get specific color
const brandBlue = await resources.read("indesign://color/Brand%20Blue");
```

### Resource Data Format

Resources return structured JSON data:

```json
{
  "uri": "indesign://document/active",
  "name": "active-document",
  "title": "Active Document",
  "mimeType": "application/json",
  "text": {
    "name": "Newsletter.indd",
    "pageCount": 8,
    "colorSwatches": 12,
    "paragraphStyles": 8,
    "characterStyles": 4,
    "textFrames": 24,
    "images": 6
  }
}
```

## MCP Prompts

### What are Prompts?

Prompts are structured templates that provide predefined workflows for common InDesign tasks. They make it easier to create complex documents by providing step-by-step guidance.

### Available Prompts

#### 1. **Create Newsletter**
- **Purpose**: Create a professional newsletter
- **Arguments**: title, issue, sections, brandColors
- **Use Case**: Company newsletters, client communications

#### 2. **Design Brochure**
- **Purpose**: Create marketing brochures
- **Arguments**: productName, description, features, imagePath, contactInfo
- **Use Case**: Product marketing, service promotion

#### 3. **Create Catalog**
- **Purpose**: Create product catalogs
- **Arguments**: catalogTitle, products, layout, includePricing
- **Use Case**: Product catalogs, inventory listings

#### 4. **Setup Brand Guidelines**
- **Purpose**: Create brand guideline documents
- **Arguments**: brandName, primaryColors, secondaryColors, fonts, logoPath
- **Use Case**: Brand documentation, style guides

#### 5. **Create Presentation**
- **Purpose**: Create presentation documents
- **Arguments**: title, slides, theme, includeNotes
- **Use Case**: Business presentations, educational materials

#### 6. **Design Business Card**
- **Purpose**: Create professional business cards
- **Arguments**: name, title, company, phone, email, website, logoPath
- **Use Case**: Professional networking, company branding

#### 7. **Create Flyer**
- **Purpose**: Create promotional flyers
- **Arguments**: headline, subheadline, description, date, location, imagePath, callToAction
- **Use Case**: Event promotion, product launches

#### 8. **Design Letterhead**
- **Purpose**: Create company letterhead
- **Arguments**: companyName, address, phone, email, website, logoPath, brandColors
- **Use Case**: Corporate communications, official documents

#### 9. **Create Data Report**
- **Purpose**: Create data visualization reports
- **Arguments**: reportTitle, data, chartType, includeSummary, dateRange
- **Use Case**: Business reports, data analysis

#### 10. **Design Menu**
- **Purpose**: Create restaurant menus
- **Arguments**: restaurantName, categories, logoPath, theme, includePrices
- **Use Case**: Restaurant marketing, food service

### Using Prompts

#### In Claude for Desktop

1. **Slash Commands**: Type `/` to see available prompts
2. **Command Palette**: Search for prompts by name
3. **Context Menus**: Right-click to access relevant prompts

#### Example Usage

```javascript
// Get available prompts
const prompts = await prompts.list();

// Get specific prompt details
const newsletterPrompt = await prompts.get("create-newsletter");

// Execute prompt with arguments
const result = await prompts.execute("create-newsletter", {
  title: "TechCorp Monthly",
  issue: "January 2025",
  sections: ["Company News", "Product Updates", "Team Spotlight"],
  brandColors: ["#2E86AB", "#A23B72", "#F18F01"]
});
```

### Prompt Structure

Each prompt includes:

- **Name**: Unique identifier
- **Title**: Human-readable title
- **Description**: What the prompt does
- **Arguments**: Required and optional parameters
- **Content**: Template messages with placeholders
- **Examples**: Sample usage scenarios

### Example Prompt Content

```json
{
  "name": "create-newsletter",
  "title": "Create Newsletter",
  "description": "Create a professional newsletter with header, content sections, and footer",
  "arguments": [
    { "name": "title", "type": "string", "required": true },
    { "name": "issue", "type": "string", "required": true },
    { "name": "sections", "type": "array", "required": false }
  ],
  "content": {
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "I want to create a professional newsletter with the following specifications:\n\n**Title:** {{title}}\n**Issue:** {{issue}}\n**Sections:** {{sections}}\n\nPlease create a complete newsletter document..."
          }
        ]
      }
    ]
  }
}
```

## Integration Examples

### Multi-Server Workflow

The real power comes when combining resources and prompts:

```javascript
// 1. Get current document context
const docInfo = await resources.read("indesign://document/active");

// 2. Get available styles
const styles = await resources.read("indesign://styles/paragraph");

// 3. Execute newsletter prompt with context
const result = await prompts.execute("create-newsletter", {
  title: "Company Newsletter",
  issue: "Q1 2025",
  sections: ["News", "Updates", "Events"],
  existingStyles: styles
});
```

### Context-Aware Design

```javascript
// 1. Check existing brand colors
const colors = await resources.read("indesign://colors/swatches");

// 2. Create brand guidelines using existing colors
const guidelines = await prompts.execute("setup-brand-guidelines", {
  brandName: "Our Company",
  primaryColors: colors.filter(c => c.name.includes("Primary")),
  secondaryColors: colors.filter(c => c.name.includes("Secondary"))
});
```

## Best Practices

### Using Resources

1. **Select Relevant Context**: Choose resources that provide useful information
2. **Use Templates**: Leverage resource templates for dynamic access
3. **Combine Multiple Resources**: Use several resources together for comprehensive context
4. **Check Availability**: Verify resources exist before using them

### Using Prompts

1. **Start with Templates**: Use prompts for common workflows
2. **Customize Arguments**: Provide specific information for better results
3. **Combine with Resources**: Use document context to enhance prompts
4. **Iterate and Refine**: Adjust arguments based on results

### Performance Considerations

1. **Resource Caching**: Resources are cached for better performance
2. **Selective Loading**: Only load resources you need
3. **Template Efficiency**: Use templates for dynamic access
4. **Prompt Optimization**: Provide complete arguments for better results

## Troubleshooting

### Common Issues

#### Resources Not Available
- **Cause**: No InDesign document open
- **Solution**: Open a document first, then access resources

#### Resource Templates Not Working
- **Cause**: Invalid URI parameters
- **Solution**: Check parameter encoding and validity

#### Prompts Not Found
- **Cause**: Prompt name misspelled
- **Solution**: Use `prompts.list()` to see available prompts

#### Prompt Execution Fails
- **Cause**: Missing required arguments
- **Solution**: Check prompt definition for required parameters

### Debug Mode

Enable debug logging to troubleshoot issues:

```bash
export LOG_LEVEL=DEBUG
node src/index.js
```

## Advanced Usage

### Custom Resource Templates

You can create custom resource templates for specific workflows:

```javascript
// Custom template for project-specific resources
const customTemplate = {
  uriTemplate: "indesign://project/{projectId}/assets",
  name: "project-assets",
  title: "Project Assets",
  description: "Access project-specific assets"
};
```

### Custom Prompts

Create custom prompts for your specific workflows:

```javascript
// Custom prompt for your workflow
const customPrompt = {
  name: "create-project-document",
  title: "Create Project Document",
  description: "Create a document for a specific project",
  arguments: [
    { name: "projectName", type: "string", required: true },
    { name: "projectType", type: "string", required: true }
  ]
};
```

## Conclusion

The MCP Resources and Prompts features transform the InDesign MCP Server from a tool-based system into a comprehensive AI assistant that can:

1. **Understand Context**: Access current document state and available resources
2. **Provide Guidance**: Use structured prompts for common workflows
3. **Enable Collaboration**: Share context between different operations
4. **Improve Efficiency**: Reduce the need for manual parameter specification

This implementation follows the [MCP specification](https://modelcontextprotocol.io/specification/2025-06-18/server/prompts) and provides a foundation for advanced AI-powered InDesign workflows.

For more information, refer to:
- [MCP Server Concepts](https://modelcontextprotocol.io/docs/learn/server-concepts)
- [MCP Prompts Specification](https://modelcontextprotocol.io/specification/2025-06-18/server/prompts)
- [MCP Resources Documentation](https://modelcontextprotocol.io/docs/learn/server-concepts#resources---context-data) 