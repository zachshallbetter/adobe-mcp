# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-07-27

### 🚀 Added
- **Smart Workflow Tools**: 11 high-level workflow tools that reduce complexity from 135+ individual tools to intuitive, task-oriented operations
- **Multi-Format Color Support**: Comprehensive color creation supporting RGB, CMYK, Hex codes, and color arrays with automatic conversion
- **Help System**: Comprehensive `help` command with tool-specific help, category filtering, and multiple output formats
- **Image Scaling**: Advanced image placement with precise scaling (1-1000%) and multiple fit modes
- **Smart Positioning**: Enhanced session management with automatic bounds checking and optimal content placement
- **Color Management**: Fixed RGB to CMYK conversion with proper color swatch creation
- **Style Application**: Direct style application during text frame creation
- **Page Backgrounds**: Full-page background color application with opacity control
- **Enhanced Error Handling**: Improved error reporting and validation across all handlers
- **Comprehensive Documentation**: Added MCP_INSTRUCTIONS.md and LLM_PROMPT.md for better user guidance

### 🔧 Enhanced
- **Session Management**: Upgraded to EventTarget-based system with import/export capabilities
- **Tool Definitions**: Expanded from 35+ to 135+ professional tools with 11 smart workflow tools
- **Color System**: Multi-format color support with automatic RGB/CMYK/Hex conversion
- **Image Handling**: Robust image placement with absolute path support and error recovery
- **Font Management**: Improved font application with fallback handling
- **Style System**: Enhanced paragraph, character, and object style creation and application
- **Layout Tools**: Advanced positioning and grouping capabilities
- **Export Functions**: Comprehensive PDF and image export options
- **Workflow Automation**: High-level tools for complete publication workflows

### 🐛 Fixed
- **Color Creation**: Fixed RGB to CMYK conversion formula for accurate color representation
- **Multi-Format Colors**: Enhanced color creation to support RGB, CMYK, Hex, and array formats
- **Workflow Tools**: Fixed color creation in smart workflow tools to use proper hex conversion
- **Font Application**: Resolved font name formatting issues in ExtendScript
- **Image Placement**: Fixed file path resolution and error handling for image placement
- **Style Application**: Corrected style application during text frame creation
- **Error Reporting**: Improved error message clarity and debugging information
- **Session Persistence**: Fixed session management across tool calls

### 📚 Documentation
- **MCP Instructions**: Comprehensive setup and usage guide for MCP integration
- **LLM Prompt**: Concise instructions for AI assistants using the MCP server
- **README Updates**: Enhanced documentation with examples and best practices
- **Help System**: Built-in documentation accessible via the `help` command

### 🧪 Testing
- **Unified Test Runner**: Single-document test suite for better session management testing
- **Workflow Tools Testing**: Comprehensive tests for all 11 smart workflow tools
- **Multi-Format Color Testing**: Tests for RGB, CMYK, Hex, and array color formats
- **Comprehensive Coverage**: Tests for all major functionality including edge cases
- **Error Handling Tests**: Validation of error scenarios and recovery
- **Performance Tests**: Verification of scaling and positioning accuracy

### 🔧 Technical Improvements
- **Modular Architecture**: Clean separation of concerns with dedicated handler classes
- **Type Safety**: Comprehensive tool definitions with parameter validation
- **Error Recovery**: Graceful handling of missing resources and invalid inputs
- **Performance**: Optimized ExtendScript execution and response handling

## [1.0.0] - 2025-07-26

### 🎉 Initial Release
- **Core MCP Server**: Model Context Protocol implementation for Adobe InDesign
- **Document Management**: Create, open, save, and manage InDesign documents
- **Page Operations**: Add, delete, and manipulate pages
- **Content Creation**: Text frames, graphics, and basic styling
- **Basic Export**: PDF and image export capabilities
- **35+ Tools**: Comprehensive set of InDesign automation tools

---

## Version History

### v1.1.0 (Current)
- Major feature release with smart workflow tools and multi-format color support
- 135+ professional tools with 11 high-level workflow tools for comprehensive InDesign automation
- Multi-format color creation (RGB, CMYK, Hex, arrays) with automatic conversion
- Improved documentation and user guidance

### v1.0.0
- Initial release with core MCP functionality
- Basic InDesign automation capabilities
- 35+ tools for document and content management

---

## Migration Guide

### From v1.0.0 to v1.1.0

#### New Features
- Use the 11 smart workflow tools for high-level automation (e.g., `create_publication_document`, `setup_document_styles`)
- Leverage multi-format color support (RGB, CMYK, Hex, arrays) with `create_color_swatch`
- Use the `help` command to explore new functionality
- Leverage image scaling with `place_image` tool
- Take advantage of smart positioning for better layouts
- Use the enhanced color management system

#### Breaking Changes
- None - all existing functionality remains compatible

#### Deprecations
- None in this release

---

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 