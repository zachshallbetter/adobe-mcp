# Indesign MCP Server

![Category](https://img.shields.io/badge/Category-JavaScript%20Project-blue)

> Generative Layout Systems: moving beyond "templates" to algorithmic layouts where the grid itself is generated based on the content density.

## Overview

InDesign MCP is a specialized Model Context Protocol (MCP) server that provides AI agents with a powerful interface for programmatically controlling Adobe InDesign. It enables LLMs to generate complex layouts, apply sophisticated styling, and manage document assets through standard RPC calls.

## Core Concepts




- **Primary language/artifacts**: JavaScript.
- **Key directories**: `docs/`, `logs/`, `src/`, `test-images/`, `tests/`.
- **Entry points**: `src/index.js`.
- **Tooling**: npm scripts available (build, dev, health, help, logs, start, status, test, test:category, test:file…).

## Technology Stack

- **Root**: Node.js

## Getting Started

```bash
npm install
npm run dev
```

## Scripts

```text
build: echo 'No build step required for Node.js'
dev: node index.js dev
health: node index.js health
help: node index.js help
logs: node index.js logs
start: node index.js start
status: node index.js status
test: node index.js test
test:category: node index.js test:category
test:file: node index.js test:file
test:required: node index.js test:required
version: node index.js version
```

## Repository Layout

- `docs/`
- `logs/`
- `src/`
- `test-images/`
- `tests/`

## Configuration

No required environment variables were detected (no `.env*.example` found).

## Upstream

`https://github.com/zachshallbetter/indesign-mcp-server.git`

## Notes

- Keep this README factual and repository-grounded.
