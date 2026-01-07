---
name: json-queries
description: Best practices for querying JSON files efficiently using jsonq tool
license: Apache 2.0
---

## JSON Query Patterns

Use **jsonq** for JSON operations instead of reading files manually.

### Dot Notation

Access nested properties with dots:
```
jsonq package.json .dependencies
jsonq tsconfig.json .compilerOptions.target
jsonq data.json .config.theme.colors
```

### Array Access

Access array elements with bracket notation:
```
jsonq items.json .items[0]
jsonq users.json .users[3]
jsonq data.json .results[0:5]  // First 5 items
```

### Common Use Cases

**Package.json operations:**
- Get dependencies: `jsonq package.json .dependencies`
- Get scripts: `jsonq package.json .scripts`
- Get version: `jsonq package.json .version`
- Get name: `jsonq package.json .name`

**Config files:**
- Tailwind theme: `jsonq tailwind.config.js .theme`
- TypeScript config: `jsonq tsconfig.json .compilerOptions`
- Next.js config: `jsonq next.config.js .images`

### Examples

```
User: "What version of React is installed?"
Use: jsonq package.json .dependencies.react

User: "What scripts are available?"
Use: jsonq package.json .scripts

User: "Get first item from data.json"
Use: jsonq data.json .items[0]

User: "Extract theme colors"
Use: jsonq config.json .theme.colors
```

## Limitations

jsonq supports:
- Dot notation for nested access
- Array index access: `.items[0]`, `.users[3]`
- Array slicing: `.items[0:5]`

jsonq does NOT support:
- Pipe operations
- Filtering/select expressions
- Mathematical operations
- Complex jq features

For complex operations, use a script or read the full file.

## Keywords

JSON, jsonq, jq, package.json, config, query, filter, extract
