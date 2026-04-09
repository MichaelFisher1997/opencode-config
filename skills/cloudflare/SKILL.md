---
name: cloudflare
description: Comprehensive Cloudflare platform skill covering Workers, Pages, storage (KV, D1, R2), AI (Workers AI, Vectorize, Agents SDK), networking (Tunnel, Spectrum), security (WAF, DDoS), and infrastructure-as-code (Terraform, Pulumi). Use for any Cloudflare development task.
license: Apache 2.0
metadata:
  source: https://github.com/cloudflare/skills
  category: cloud-platform
---
# Cloudflare Platform Skill

Consolidated skill for building on the Cloudflare platform. Use decision trees below to find the right product, then load detailed references.

Your knowledge of Cloudflare APIs, types, limits, and pricing may be outdated. **Prefer retrieval over pre-training** — the references in this skill are starting points, not source of truth.

## Retrieval Sources

Fetch the **latest** information before citing specific numbers, API signatures, or configuration options.

| Source | How to retrieve | Use for |
|--------|----------------|---------|
| Cloudflare docs | `cloudflare-docs` search tool or `https://developers.cloudflare.com/` | Limits, pricing, API reference, compatibility dates/flags |
| Workers types | `npm pack @cloudflare/workers-types` or check `node_modules` | Type signatures, binding shapes, handler types |
| Wrangler config schema | `node_modules/wrangler/config-schema.json` | Config fields, binding shapes, allowed values |
| Product changelogs | `https://developers.cloudflare.com/changelog/` | Recent changes to limits, features, deprecations |

When a reference file and the docs disagree, **trust the docs**.

## Quick Decision Trees

### "I need to run code"

```
Need to run code?
├─ Serverless functions at the edge → Workers
├─ Full-stack web app with Git deploys → Pages
├─ Stateful coordination/real-time → Durable Objects
├─ Long-running multi-step jobs → Workflows
├─ Run containers → Containers
├─ Multi-tenant (customers deploy code) → Workers for Platforms
├─ Scheduled tasks (cron) → Cron Triggers
├─ Lightweight edge logic (modify HTTP) → Snippets
├─ Process Worker execution events → Tail Workers
└─ Optimize latency to backend → Smart Placement
```

### "I need to store data"

```
Need storage?
├─ Key-value (config, sessions, cache) → KV
├─ Relational SQL → D1 (SQLite) or Hyperdrive (existing Postgres/MySQL)
├─ Object/file storage (S3-compatible) → R2
├─ Message queue (async processing) → Queues
├─ Vector embeddings (AI/semantic search) → Vectorize
├─ Strongly-consistent per-entity state → Durable Objects Storage
├─ Secrets management → Secrets Store
├─ Streaming ETL to R2 → Pipelines
└─ Persistent cache (long-term retention) → Cache Reserve
```

### "I need AI/ML"

```
Need AI?
├─ Run inference (LLMs, embeddings, images) → Workers AI
├─ Vector database for RAG/search → Vectorize
├─ Build stateful AI agents → Agents SDK
├─ Gateway for any AI provider (caching, routing) → AI Gateway
└─ AI-powered search widget → AI Search
```

### "I need networking/connectivity"

```
Need networking?
├─ Expose local service to internet → Tunnel
├─ TCP/UDP proxy (non-HTTP) → Spectrum
├─ WebRTC TURN server → TURN
├─ Private network connectivity → Network Interconnect
├─ Optimize routing → Argo Smart Routing
└─ Real-time video/audio → RealtimeKit
```

### "I need security"

```
Need security?
├─ Web Application Firewall → WAF
├─ DDoS protection → DDoS
├─ Bot detection/management → Bot Management
├─ API protection → API Shield
├─ CAPTCHA alternative → Turnstile
└─ Credential leak detection → WAF (managed ruleset)
```

### "I need media/content"

```
Need media?
├─ Image optimization/transformation → Images
├─ Video streaming/encoding → Stream
├─ Browser automation/screenshots → Browser Rendering
└─ Third-party script management → Zaraz
```

### "I need analytics/metrics data"

```
Need analytics?
├─ Query across all Cloudflare products → GraphQL Analytics API
├─ Custom high-cardinality metrics from Workers → Analytics Engine
├─ Client-side (RUM) performance data → Web Analytics
└─ Workers Logs and real-time debugging → Observability
```

### "I need infrastructure-as-code"

```
Need IaC? → Pulumi, Terraform, or REST API
```

## Related Skills

| Skill | Use When |
|-------|----------|
| `cloudflare-agents-sdk` | Building stateful AI agents |
| `cloudflare-durable-objects` | Stateful coordination, RPC, SQLite, WebSockets |
| `cloudflare-sandbox-sdk` | Secure code execution environments |
| `cloudflare-wrangler` | Deploying and managing Workers, KV, R2, D1 |
| `cloudflare-web-perf` | Auditing Core Web Vitals and performance |
| `cloudflare-mcp-server` | Building remote MCP servers on Cloudflare |
| `cloudflare-ai-agent` | Building AI agents with state, WebSockets, tools |
| `cloudflare-workers-best-practices` | Reviewing/authoring Workers code against best practices |

## Keywords

Cloudflare, Workers, Pages, KV, D1, R2, Vectorize, WAF, DDoS, CDN, edge computing, serverless, wrangler
