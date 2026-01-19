# InDesign MCP - Layout Orchestration Bridge

InDesign MCP is a specialized Model Context Protocol (MCP) server that provides AI agents with a powerful interface for programmatically controlling Adobe InDesign. It enables LLMs to generate complex layouts, apply sophisticated styling, and manage document assets through standard RPC calls.

## Key Features

- **Programmatic Layout Generation**: Pre-built tools for creating complex geometric layouts, including **Hexagonal** and **Enhanced Hexagon** structures.
- **Dynamic Styling Engine**: Automated application of brand-specific styles (e.g., `Spectralab` styles) across entire InDesign documents.
- **Real-Time Document Interaction**: Directly manipulate objects, colors, and text within an active InDesign session.
- **Artifact Management**: Specialized tools for handling `.indd` files and linked assets within an orchestrated environment.
- **Modular JavaScript Scripts**: A library of reusable layout and styling scripts (`create-actual-layout.js`, `add-page-with-circle.js`) ready for agent execution.

## Technical Implementation

- **Node.js Core**: Asynchronous orchestration of InDesign automation via the `indesign-mcp` interface.
- **Adobe InDesign Scripting**: Leverages the ExtendScript engine for high-precision document manipulation.
- **Process Orchestration**: Built-in server management (`.server.pid`) for stable, long-running agent interactions.
- **Comprehensive Docs**: Detailed system documentation and user guides included in the `docs/` module.

## Future Research & Ideas

- **AI-Guided Layout Synthesis**: Implement an "Autodraw" feature where agents can generate pixel-perfect InDesign layouts based on rough hand-drawn sketches.
- **Real-Time Style Propagation**: Automatically sync changes in a CSS-like styling file to an active InDesign document.
- **Automated Pre-Flight Check**: An MCP tool that performs industry-standard pre-flight checks and automatically fixes simple errors (e.g., missing links or overset text).
- **InDesign to Web Bridge**: Automated tools for exporting complex InDesign layouts directly to clean, interactive React components via the MCP server.
