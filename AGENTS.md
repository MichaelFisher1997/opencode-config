# OpenCode AI Configuration - Agent Guidelines

## Build/Package Commands
```bash
# Install dependencies (uses Bun)
bun install

# No build step required - this is a configuration project
# No test framework configured - tools/skills are tested through OpenCode AI
# No linting/typechecking commands configured
```

## Code Style Guidelines

### Language and Runtime
- **Language**: TypeScript/JavaScript for tools and skills
- **Runtime**: Bun (not Node.js)
- **No TypeScript configuration**: Files are directly interpreted by the OpenCode AI plugin

### Tool Creation Patterns
Tools are defined in `tool/` directory using the `@opencode-ai/plugin`:

```typescript
import { tool } from "@opencode-ai/plugin"

export default tool({
  description: "Tool description string",
  args: {
    paramName: tool.schema.string().describe("Description"),
    optionalParam: tool.schema.number().default(10).describe("Description"),
    flagParam: tool.schema.boolean().default(false).describe("Description"),
  },
  async execute(args) {
    // Implementation
    const result = await Bun.$`command ${args.param}`.text()
    return result.trim()
  },
})
```

### Schema Types
Use `tool.schema.*()` for argument validation:
- `string()`, `number()`, `boolean()`
- `.default(value)` for optional parameters
- `.describe("text")` for documentation (required for AI understanding)

### Shell Execution
Use Bun's shell syntax for command execution:
```typescript
const result = await Bun.$`command arg1 ${args.param}`.text()
// Use .text() for string output
// Use .trim() to clean whitespace
```

### Skills Structure
Skills go in `skill/` directory:
- Each skill in its own subdirectory (kebab-case naming)
- Create `SKILL.md` with skill definition and instructions
- Format: YAML frontmatter with `name`, `description`, `license`
- Include usage examples (Do/Don't patterns)
- Keywords section for discoverability

### Naming Conventions
- **Files**: kebab-case (e.g., `my-tool.ts`)
- **Skills**: kebab-case directory names (e.g., `solid-auditor`)
- **Arguments**: camelCase in schema, natural language in descriptions
- **Functions**: camelCase for all identifiers

### Documentation
- **Tools**: Must include `description` parameter in `tool()` call
- **Schema arguments**: Must include `.describe()` for each parameter
- **Skills**: Both `SKILL.md` (instructions) and `README.md` (context) required
- SKILL.md frontmatter keys: `name`, `description`, `license` (Apache 2.0)

### Error Handling
- Shell commands are executed via Bun `$` syntax
- No explicit error handling shown - rely on Bun's built-in error propagation
- Return simple string outputs from `execute()`

### Dependencies
- Add dependencies to root `package.json`, not `.opencode/package.json`
- Main dependency: `@opencode-ai/plugin`
- Tool-specific deps: install via `bun add <package>`

### Configuration Files
- `opencode.json` - Main OpenCode AI config with providers and MCP servers
- `package.json` - Project dependencies
- `.gitignore` - Ignores: node_modules, package.json, bun.lock

### MCP Integrations
MCP servers configured in `opencode.json`:
```json
{
  "mcp": {
    "serverName": {
      "type": "local",
      "command": ["executable", "arg"],
      "enabled": true
    }
  }
}
```

### Key Patterns
- Tools export default using `export default tool({...})`
- Use async/await for all I/O operations
- Trim string outputs before returning
- Schema descriptions are critical for AI tool discovery
- Skills loaded dynamically by OpenCode AI plugin
- Browser automation via Chrome DevTools MCP (chromium at `/home/micqdf/.nix-profile/bin/chromium`)
- Use Zod patterns (via `tool.schema`) for validation when needed

### File Organization
```
├── tool/           # Custom tools
│   └── *.ts        # Tool implementations
├── skill/          # Skill definitions
│   └── skill-name/ # Individual skills
├── opencode.json   # AI + MCP configuration
├── package.json    # Dependencies
└── AGENTS.md       # This file
```
