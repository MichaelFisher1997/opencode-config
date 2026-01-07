---
name: tool-optimization
description: Guides agents to use specialized tools for common tasks instead of general approaches, saving tokens and improving speed
license: Apache 2.0
---

## Tool Optimization Rules

Use specialized tools over general approaches when available:

### JSON Operations
- **jsonq** for filtering/extracting JSON fields
- **DO NOT** read entire JSON file + manual parsing
- **DO NOT** use Python for JSON manipulation

### System Information
- **fastfetch** for quick system info
- **DO NOT** run multiple bash commands to gather system details

### Search Operations
- **mgrep** for semantic file/content search
- **DO NOT** use grep, glob, or built-in WebSearch

## When to Use Each Tool

**jsonq**: Use when you need to:
- Extract specific field from package.json
- Get nested configuration values
- Filter array elements from JSON data
- Query JSON files without reading full content

**fastfetch**: Use when you need to:
- Check system specifications
- Verify environment details
- Get OS/kernel/CPU info
- Display system overview

**mgrep**: Use when you need to:
- Search codebase semantically
- Find files by content
- Search web for information
- Search in specific directories

## Benefits

- **Token Savings**: Specialized tools return only needed data
- **Speed**: Purpose-built tools are faster than general approaches
- **Consistency**: Same tool = predictable output format
- **Maintainability**: Less code per request, cleaner interactions

## Keywords

optimization, efficiency, token savings, jsonq, fastfetch, mgrep, specialized tools
