# Changelog

All notable changes to the InDesign MCP Server project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2024-01-15

### 🚀 Added
- **Enhanced Logging System**: Comprehensive file-based logging with rotation and organization
  - Optional file logging via `FILE_LOGGING=true` environment variable
  - Separate log files for server, performance, errors, and debug messages
  - Daily log rotation with date-stamped files
  - Archive directory for historical logs
  - Performance metrics logging with operation tracking
  - Configurable log directory via `LOGS_DIR` environment variable
  - Log file size limits and cleanup via `MAX_LOG_SIZE` and `MAX_LOG_FILES`

- **Root-Level CLI Interface**: Professional command-line interface for all operations
  - Unified entry point for server management, testing, and utilities
  - `node index.js start` - Start MCP server
  - `node index.js dev` - Start in development mode with debugging
  - `node index.js test` - Run test suite with various options
  - `node index.js health` - Check server health and status
  - `node index.js logs` - Show log file information and management
  - `node index.js version` - Show version information
  - `node index.js help` - Comprehensive help system

- **Organized Test Suite**: Complete reorganization of test files into logical categories
  - 13 clear test categories: basic, document, content, advanced, workflow, mcp, graphics, help, validation, comprehensive
  - Improved test discoverability and maintenance
  - Category-based test execution: `node index.js test:category <name>`
  - Individual test execution: `node index.js test:file <name>`
  - Required vs optional test separation for CI/CD integration

- **Enhanced Server Features**: Improved server robustness and monitoring
  - Better startup detection and confirmation
  - Enhanced error handling with structured JSON responses
  - Performance monitoring with detailed metrics
  - Graceful shutdown with final metrics logging
  - Health check endpoint with comprehensive status reporting
  - Server status endpoint with detailed metrics and tool information

### 🔧 Changed
- **Package.json Updates**: Updated main entry point and npm scripts
  - Main entry point changed from `src/index.js` to `index.js`
  - All npm scripts now use the unified CLI interface
  - Added new scripts for logs, health, and version commands

- **Logging Architecture**: Complete overhaul of logging system
  - MCP-compliant stderr logging maintained for protocol compatibility
  - Optional file logging added for debugging and audit trails
  - Structured JSON logging for external process integration
  - Performance metrics integration with logging system

- **Test Infrastructure**: Unified test runner with improved organization
  - Single test runner handles all test execution logic
  - Automatic server initialization for test suites
  - Improved error handling and reporting
  - Better progress tracking and result formatting

### 🐛 Fixed
- **Import Path Issues**: Fixed all import paths after test reorganization
- **Server Initialization**: Ensured server starts properly before test execution
- **File Structure**: Removed duplicate index.js files and organized structure
- **Error Handling**: Improved error messages and debugging information

### 📚 Documentation
- **Enhanced README**: Comprehensive documentation of new CLI interface
- **Test Documentation**: Updated test README with organized structure
- **Logging Documentation**: Added logging configuration and usage examples
- **CLI Help**: Comprehensive help system with examples and categories

### 🔧 Technical Improvements
- **Code Organization**: Better separation of concerns between CLI and server logic
- **Error Recovery**: Robust error handling with graceful degradation
- **Performance Monitoring**: Detailed tracking of tool execution times and metrics
- **File Management**: Proper log file stream management and cleanup
- **Environment Configuration**: Flexible configuration via environment variables

## [1.0.0] - 2024-01-10

### 🚀 Initial Release
- **MCP Server**: Complete Model Context Protocol server implementation
- **InDesign Integration**: Full Adobe InDesign automation capabilities
- **Tool Coverage**: 135+ individual tools across 13 handlers
- **Protocol Compliance**: Full MCP protocol compliance with stdio transport
- **Error Handling**: Comprehensive error handling and reporting
- **Documentation**: Complete API documentation and usage examples

### 📋 Features
- Document management (creation, opening, saving, preferences)
- Text and graphics creation and manipulation
- Style and color management with multi-format support
- Page and layout management
- Master spread and book functionality
- Export and packaging capabilities
- Session management and smart positioning
- MCP Resources and Prompts integration

---

## Version History

### Version 1.1.0 (Current)
- Enhanced logging system with file output and rotation
- Root-level CLI interface for all operations
- Organized test suite with clear categorization
- Improved server robustness and monitoring
- Better documentation and help systems

### Version 1.0.0
- Initial release with full MCP server implementation
- Complete InDesign automation capabilities
- 135+ tools across 13 handlers
- Full protocol compliance and error handling

---

## Migration Guide

### From 1.0.0 to 1.1.0

#### CLI Changes
- **Old**: `node src/index.js` → **New**: `node index.js start`
- **Old**: `node tests/index.js` → **New**: `node index.js test`
- **Old**: `npm start` → **New**: `npm start` (same, but now uses CLI)
- **Old**: `npm test` → **New**: `npm test` (same, but now uses CLI)

#### New Commands
```bash
# Health check
node index.js health

# Log management
node index.js logs

# Version information
node index.js version

# Category-based testing
node index.js test:category connectivity

# Individual test execution
node index.js test:file test-mcp-protocol.js
```

#### Environment Variables
```bash
# Enable file logging
export FILE_LOGGING=true

# Custom log directory
export LOGS_DIR=/path/to/logs

# Log configuration
export MAX_LOG_SIZE=10485760  # 10MB
export MAX_LOG_FILES=30       # 30 days
```

#### File Structure Changes
- Root `index.js` now serves as CLI interface
- Test files organized into category subdirectories
- Logs directory created when file logging is enabled
- No breaking changes to server functionality

---

## Contributing

When contributing to this project, please:

1. Update this changelog with your changes
2. Follow the existing versioning scheme
3. Include both user-facing and technical changes
4. Group changes by type (Added, Changed, Fixed, etc.)
5. Provide migration guidance for breaking changes

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 