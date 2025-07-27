# InDesign MCP Server - Test Suite Organization Plan

## Current State Analysis

We currently have **30 test files** with some overlap and inconsistent organization:

### Current Files by Category:
- **Core Infrastructure**: `unified-test-runner.js`, `root-test.js`, `test-setup.js`, `index.js`
- **Basic Functionality**: `test-mcp-protocol.js`, `test-indesign-basic.js`, `test-simple-document.js`
- **Document Management**: `test-document-and-page.js`, `test-document-preferences.js`, `test-grid-layout.js`
- **Content Creation**: `test-content-management.js`, `test-standard-document.js`
- **Advanced Features**: `test-advanced-features.js`, `test-pageitem-group.js`, `test-bounds-checking.js`
- **Workflow**: `test-basic-workflow.js`, `test-workflow-simple.js`, `test-workflow-tools.js`
- **MCP Features**: `test-mcp-resources.js`, `test-mcp-prompts.js`
- **Help System**: `test-help-system.js`, `test-enhanced-help-system.js`
- **Graphics & Images**: `test-image-assets.js`, `test-real-image.js`, `test-swatches-and-backgrounds.js`
- **Utilities**: `test-error-handling.js`, `test-enhanced-functionality.js`, `test-multi-format-colors.js`
- **Comprehensive**: `test-comprehensive.js`

## Proposed Organization Structure

```
tests/
├── core/                          # Core test infrastructure
│   ├── unified-test-runner.js     # Main test runner
│   ├── root-test.js              # Base test class
│   ├── test-setup.js             # Test environment setup
│   └── index.js                  # Main test orchestrator
│
├── basic/                         # Basic functionality tests
│   ├── test-mcp-protocol.js      # MCP protocol communication
│   ├── test-indesign-basic.js    # Basic InDesign connectivity
│   └── test-simple-document.js   # Simple document creation
│
├── document/                      # Document management tests
│   ├── test-document-and-page.js # Document and page operations
│   ├── test-document-preferences.js # Document preferences
│   └── test-grid-layout.js       # Grid and layout settings
│
├── content/                       # Content creation tests
│   ├── test-content-management.js # Text, graphics, styles
│   ├── test-standard-document.js # Complete document workflow
│   └── test-bounds-checking.js   # Content positioning validation
│
├── advanced/                      # Advanced feature tests
│   ├── test-advanced-features.js # Master spreads, layers, export
│   ├── test-pageitem-group.js    # PageItem and group operations
│   └── test-enhanced-functionality.js # Session management, smart positioning
│
├── workflow/                      # Workflow tests
│   ├── test-basic-workflow.js    # Basic workflow operations
│   ├── test-workflow-simple.js   # Simple workflow scenarios
│   └── test-workflow-tools.js    # Workflow tool testing
│
├── mcp/                          # MCP-specific tests
│   ├── test-mcp-resources.js     # MCP resources functionality
│   └── test-mcp-prompts.js       # MCP prompts functionality
│
├── graphics/                     # Graphics and image tests
│   ├── test-image-assets.js      # Image asset management
│   ├── test-real-image.js        # Real image processing
│   ├── test-swatches-and-backgrounds.js # Color swatches and backgrounds
│   └── test-multi-format-colors.js # Multi-format color support
│
├── help/                         # Help system tests
│   ├── test-help-system.js       # Basic help functionality
│   └── test-enhanced-help-system.js # Enhanced help features
│
├── validation/                   # Validation and error tests
│   ├── test-error-handling.js    # Error handling scenarios
│   └── test-bounds-checking.js   # Content bounds validation
│
├── comprehensive/                # Comprehensive test suites
│   ├── test-comprehensive.js     # All-in-one test suite
│   └── test-standard-document.js # Complete document workflow
│
├── data/                         # Test data files
│   └── test-data.csv             # Sample data for testing
│
└── README.md                     # Test documentation
```

## Consolidation Opportunities

### 1. **Merge Similar Tests**
- `test-basic-workflow.js` + `test-workflow-simple.js` → `workflow/test-workflow-basic.js`
- `test-help-system.js` + `test-enhanced-help-system.js` → `help/test-help-system.js`
- `test-bounds-checking.js` (duplicate) → Keep in `validation/` and `content/`

### 2. **Consolidate Graphics Tests**
- `test-image-assets.js` + `test-real-image.js` → `graphics/test-image-processing.js`
- `test-swatches-and-backgrounds.js` + `test-multi-format-colors.js` → `graphics/test-color-management.js`

### 3. **Streamline Workflow Tests**
- `test-workflow-tools.js` → Integrate into `workflow/test-workflow-advanced.js`

## Benefits of Reorganization

### 1. **Clear Structure**
- Logical grouping by functionality
- Easy to find specific test types
- Clear separation of concerns

### 2. **Reduced Duplication**
- Eliminate overlapping test coverage
- Consolidate similar functionality
- Reduce maintenance overhead

### 3. **Better Maintainability**
- Easier to add new tests in appropriate categories
- Clear ownership of test areas
- Simplified test discovery

### 4. **Improved CI/CD Integration**
- Can run specific test categories
- Better parallel test execution
- Clearer test reporting

## Implementation Plan

### Phase 1: Create Directory Structure
1. Create new directory structure
2. Move files to appropriate locations
3. Update import paths

### Phase 2: Consolidate Similar Tests
1. Merge overlapping test files
2. Remove duplicate functionality
3. Update test references

### Phase 3: Update Test Runner
1. Update `index.js` to reflect new structure
2. Update `unified-test-runner.js` paths
3. Update documentation

### Phase 4: Validation
1. Run all tests to ensure they still work
2. Update README.md with new structure
3. Verify CI/CD integration

## Expected Outcome

- **Reduced from 30 files to ~20 files**
- **Clear categorization by functionality**
- **Eliminated duplicate test coverage**
- **Improved maintainability and discoverability**
- **Better CI/CD integration capabilities** 