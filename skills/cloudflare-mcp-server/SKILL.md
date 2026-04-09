---
name: cloudflare-mcp-server
description: Build remote MCP (Model Context Protocol) servers on Cloudflare Workers with tools, OAuth authentication, and production deployment. Use when building MCP servers, creating MCP tools, remote MCP, deploying MCP, or adding OAuth to MCP.
license: Apache 2.0
metadata:
  source: https://github.com/cloudflare/skills
  category: cloudflare
---

# Building MCP Servers on Cloudflare

## Retrieval Sources

| Source | URL |
|--------|-----|
| MCP docs | `https://developers.cloudflare.com/agents/mcp/` |
| MCP spec | `https://modelcontextprotocol.io/` |
| Workers docs | `https://developers.cloudflare.com/workers/` |

## When to Use

- User wants to build a remote MCP server
- User needs to expose tools via MCP
- User asks about MCP authentication or OAuth
- User wants to deploy MCP to Cloudflare Workers

## Quick Start - Public Server (No Auth)

```bash
npm create cloudflare@latest -- my-mcp-server \
  --template=cloudflare/ai/demos/remote-mcp-authless
cd my-mcp-server
npm start
```

Server runs at `http://localhost:8788/mcp`

## Quick Start - Authenticated Server (OAuth)

```bash
npm create cloudflare@latest -- my-mcp-server \
  --template=cloudflare/ai/demos/remote-mcp-github-oauth
cd my-mcp-server
```

## Define Tools

```typescript
import { McpAgent } from "agents/mcp";
import { z } from "zod";

export class MyMCP extends McpAgent {
  server = new Server({ name: "my-mcp", version: "1.0.0" });

  async init() {
    this.server.tool(
      "add",
      { a: z.number(), b: z.number() },
      async ({ a, b }) => ({
        content: [{ type: "text", text: String(a + b) }],
      })
    );

    this.server.tool(
      "get_weather",
      { city: z.string() },
      async ({ city }) => {
        const response = await fetch(`https://api.weather.com/${city}`);
        const data = await response.json();
        return {
          content: [{ type: "text", text: JSON.stringify(data) }],
        };
      }
    );
  }
}
```

## Entry Point

```typescript
import { MyMCP } from "./mcp";

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);
    if (url.pathname === "/mcp") {
      return MyMCP.serveSSE("/mcp").fetch(request, env, ctx);
    }
    return new Response("MCP Server", { status: 200 });
  },
};

export { MyMCP };
```

## Deploy

```bash
npx wrangler deploy
```

Server accessible at `https://[worker-name].[account].workers.dev/mcp`

## Connect Clients

**Claude Desktop** (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "my-server": {
      "command": "npx",
      "args": ["mcp-remote", "https://my-mcp.workers.dev/mcp"]
    }
  }
}
```

## Tool Return Types

```typescript
return { content: [{ type: "text", text: "result" }] };
return {
  content: [
    { type: "text", text: "Here's the data:" },
    { type: "text", text: JSON.stringify(data, null, 2) },
  ],
};
```

## Input Validation with Zod

```typescript
this.server.tool(
  "create_user",
  {
    email: z.string().email(),
    name: z.string().min(1).max(100),
    role: z.enum(["admin", "user", "guest"]),
    age: z.number().int().min(0).optional(),
  },
  async (params) => { }
);
```

## Accessing Bindings

```typescript
export class MyMCP extends McpAgent<Env> {
  async init() {
    this.server.tool("query_db", { sql: z.string() }, async ({ sql }) => {
      const result = await this.env.DB.prepare(sql).all();
      return { content: [{ type: "text", text: JSON.stringify(result) }] };
    });
  }
}
```

## Wrangler Configuration

```toml
name = "my-mcp-server"
main = "src/index.ts"
compatibility_date = "2024-12-01"

[durable_objects]
bindings = [{ name = "MCP", class_name = "MyMCP" }]

[[migrations]]
tag = "v1"
new_classes = ["MyMCP"]
```

## OAuth Providers Supported

GitHub, Google, Auth0, Stytch, WorkOS, and any OAuth 2.0 compliant provider.

## Keywords

Cloudflare, MCP, Model Context Protocol, remote MCP, OAuth, tools, server, Workers
