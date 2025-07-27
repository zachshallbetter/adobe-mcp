# MCP Configuration Guide

## Overview

This guide provides comprehensive instructions for configuring the InDesign MCP Server with various MCP clients, following the [official MCP documentation](https://modelcontextprotocol.io/quickstart/server#node).

## Prerequisites

- Node.js 18.0.0 or higher
- Adobe InDesign 2025 or later
- MCP-compatible client (Claude for Desktop, etc.)

## Installation

```bash
# Clone the repository
git clone https://github.com/lucdesign/indesign-mcp-server.git
cd indesign-mcp-server

# Install dependencies
npm install

# Verify installation
npm start
```

## Client Configuration

### Claude for Desktop

1. **Install Claude for Desktop** from the [official website](https://claude.ai/download)

2. **Create/Edit Configuration File**:
   ```bash
   # macOS
   code ~/Library/Application\ Support/Claude/claude_desktop_config.json
   
   # Windows
   code %APPDATA%\Claude\claude_desktop_config.json
   ```

3. **Add Server Configuration**:
   ```json
   {
     "mcpServers": {
       "indesign": {
         "command": "node",
         "args": [
           "/ABSOLUTE/PATH/TO/indesign-mcp-server/src/index.js"
         ],
         "env": {
           "NODE_ENV": "development",
           "LOG_LEVEL": "INFO"
         }
       }
     }
   }
   ```

4. **Restart Claude for Desktop**

### Other MCP Clients

#### Cursor IDE
```json
{
  "mcpServers": {
    "indesign": {
      "command": "node",
      "args": ["/path/to/indesign-mcp-server/src/index.js"]
    }
  }
}
```

#### Custom MCP Client
```javascript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const client = new Client({
  name: 'my-client',
  version: '1.0.0'
});

const transport = new StdioClientTransport({
  command: 'node',
  args: ['/path/to/indesign-mcp-server/src/index.js']
});

await client.connect(transport);
```

## Environment Variables

| Variable        | Description              | Default       | Options                          |
| --------------- | ------------------------ | ------------- | -------------------------------- |
| `NODE_ENV`      | Environment mode         | `development` | `development`, `production`      |
| `LOG_LEVEL`     | Logging verbosity        | `INFO`        | `ERROR`, `WARN`, `INFO`, `DEBUG` |
| `INDESIGN_PATH` | InDesign executable path | Auto-detected | Custom path                      |
| `MCP_TRANSPORT` | Transport type           | `stdio`       | `stdio`, `http`                  |

## Logging Configuration

### MCP-Compliant Logging

The server uses stderr for logging to comply with MCP requirements:

```bash
# View logs
node src/index.js 2> server.log

# Follow logs in real-time
node src/index.js 2>&1 | tee server.log
```

### Log Levels

- **ERROR**: Critical errors only
- **WARN**: Warnings and errors
- **INFO**: General information (default)
- **DEBUG**: Detailed debugging information

### Log Format

```json
{
  "timestamp": "2025-01-27T10:30:00.000Z",
  "level": "INFO",
  "message": "Tool called: create_document",
  "data": {
    "args": { "name": "test.indd" },
    "success": true,
    "message": "Document created successfully"
  }
}
```

## Troubleshooting

### Common Issues

#### 1. Server Not Starting

**Symptoms**: Client can't connect to server

**Solutions**:
```bash
# Check Node.js version
node --version  # Should be >= 18.0.0

# Check dependencies
npm list @modelcontextprotocol/sdk

# Test server directly
node src/index.js
```

#### 2. InDesign Not Found

**Symptoms**: "InDesign application not found" errors

**Solutions**:
```bash
# Set InDesign path explicitly
export INDESIGN_PATH="/Applications/Adobe InDesign 2025/Adobe InDesign 2025.app"

# Or in configuration
{
  "mcpServers": {
    "indesign": {
      "command": "node",
      "args": ["/path/to/server/src/index.js"],
      "env": {
        "INDESIGN_PATH": "/Applications/Adobe InDesign 2025/Adobe InDesign 2025.app"
      }
    }
  }
}
```

#### 3. Permission Issues

**Symptoms**: "Permission denied" or "Access denied" errors

**Solutions**:
```bash
# Check file permissions
ls -la src/index.js

# Fix permissions if needed
chmod +x src/index.js

# Check InDesign permissions
ls -la "/Applications/Adobe InDesign 2025/"
```

#### 4. MCP Protocol Errors

**Symptoms**: JSON-RPC parsing errors or connection failures

**Solutions**:
```bash
# Check for stdout logging (should be none)
node src/index.js | head -10

# Verify stderr logging only
node src/index.js 2>&1 | grep -v "console.log"

# Test with minimal configuration
node src/index.js --test
```

### Debug Mode

Enable debug logging for detailed troubleshooting:

```bash
# Set debug environment
export LOG_LEVEL=DEBUG
export NODE_ENV=development

# Run with debug output
node src/index.js 2> debug.log
```

### Performance Monitoring

The server includes built-in performance monitoring:

```javascript
// Get performance metrics
await tools.call("get_session_info", {});

// Check tool execution times
// Metrics are automatically logged to stderr
```

## Security Considerations

### File Path Validation

- All file paths are validated before use
- Absolute paths are preferred over relative paths
- InDesign document files are restricted to safe locations

### Environment Isolation

- Server runs in isolated environment
- No access to system files outside InDesign scope
- ExtendScript execution is sandboxed

### Error Handling

- Sensitive information is not logged
- Errors are sanitized before client transmission
- Stack traces are only logged in debug mode

## Advanced Configuration

### Custom ExtendScript Paths

```json
{
  "mcpServers": {
    "indesign": {
      "command": "node",
      "args": ["/path/to/server/src/index.js"],
      "env": {
        "EXTENDSCRIPT_PATH": "/path/to/custom/scripts",
        "SCRIPT_TEMPLATES": "/path/to/templates"
      }
    }
  }
}
```

### Multiple Server Instances

```json
{
  "mcpServers": {
    "indesign-dev": {
      "command": "node",
      "args": ["/path/to/server/src/index.js"],
      "env": { "NODE_ENV": "development" }
    },
    "indesign-prod": {
      "command": "node",
      "args": ["/path/to/server/src/index.js"],
      "env": { "NODE_ENV": "production" }
    }
  }
}
```

### HTTP Transport (Advanced)

For HTTP-based transport (not recommended for InDesign):

```json
{
  "mcpServers": {
    "indesign-http": {
      "command": "node",
      "args": ["/path/to/server/src/index.js", "--http"],
      "env": { "MCP_TRANSPORT": "http" }
    }
  }
}
```

## Testing Configuration

### Basic Connectivity Test

```bash
# Test server startup
node src/index.js --test

# Test tool listing
node src/index.js --list-tools

# Test specific tool
node src/index.js --test-tool create_document
```

### Integration Test

```javascript
// Test with MCP client
const { Client } = require('@modelcontextprotocol/sdk/client/index.js');

const client = new Client({
  name: 'test-client',
  version: '1.0.0'
});

// Connect and test tools
await client.connect(transport);
const tools = await client.listTools();
console.log('Available tools:', tools.tools.length);
```

## Best Practices

### 1. Use Absolute Paths

Always use absolute paths in configuration:

```json
{
  "args": ["/Users/username/projects/indesign-mcp-server/src/index.js"]
}
```

### 2. Environment-Specific Configs

Create separate configurations for different environments:

```bash
# Development
cp claude_desktop_config.json claude_desktop_config.dev.json

# Production  
cp claude_desktop_config.json claude_desktop_config.prod.json
```

### 3. Regular Testing

Test configuration changes:

```bash
# Test configuration
npm run test:config

# Test connectivity
npm run test:connectivity

# Test tools
npm run test:tools
```

### 4. Monitor Logs

Regularly check server logs:

```bash
# Monitor logs in real-time
tail -f server.log

# Check for errors
grep ERROR server.log

# Check performance
grep "Tool completed" server.log
```

## Support

For additional support:

1. **Check Logs**: Review stderr logs for detailed error information
2. **Test Isolation**: Test server independently of client
3. **Version Compatibility**: Ensure all components are up to date
4. **Documentation**: Refer to [MCP documentation](https://modelcontextprotocol.io/)
5. **Issues**: Report issues on [GitHub](https://github.com/lucdesign/indesign-mcp-server/issues)

## References

- [MCP Server Development Guide](https://modelcontextprotocol.io/quickstart/server#node)
- [MCP Specification](https://modelcontextprotocol.io/specification)
- [Claude for Desktop Documentation](https://docs.anthropic.com/claude/docs/claude-for-desktop)
- [Node.js MCP SDK](https://github.com/modelcontextprotocol/sdk-javascript) 