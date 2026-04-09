---
name: cloudflare-workers-best-practices
description: Reviews and authors Cloudflare Workers code against production best practices. Use when writing new Workers, reviewing Worker code, configuring wrangler.jsonc, or checking for common Workers anti-patterns.
license: Apache 2.0
metadata:
  source: https://github.com/cloudflare/skills
  category: cloudflare
---

# Cloudflare Workers Best Practices

Your knowledge of Cloudflare Workers APIs, types, and configuration may be outdated. **Prefer retrieval over pre-training**.

## Rules Quick Reference

### Configuration

| Rule | Summary |
|------|---------|
| Compatibility date | Set `compatibility_date` to today on new projects; update periodically |
| nodejs_compat | Enable the `nodejs_compat` flag — many libraries depend on Node.js built-ins |
| wrangler types | Run `wrangler types` to generate `Env` — never hand-write binding interfaces |
| Secrets | Use `wrangler secret put`, never hardcode secrets in config or source |
| wrangler.jsonc | Use JSONC config for non-secret settings — newer features are JSON-only |

### Request & Response Handling

| Rule | Summary |
|------|---------|
| Streaming | Stream large/unknown payloads — never `await response.text()` on unbounded data |
| waitUntil | Use `ctx.waitUntil()` for post-response work; do not destructure `ctx` |

### Architecture

| Rule | Summary |
|------|---------|
| Bindings over REST | Use in-process bindings (KV, R2, D1, Queues) — not the Cloudflare REST API |
| Queues & Workflows | Move async/background work off the critical path |
| Service bindings | Use service bindings for Worker-to-Worker calls — not public HTTP |
| Hyperdrive | Always use Hyperdrive for external PostgreSQL/MySQL connections |

### Observability

| Rule | Summary |
|------|---------|
| Logs & Traces | Enable `observability` in config with `head_sampling_rate`; use structured JSON logging |

### Code Patterns

| Rule | Summary |
|------|---------|
| No global request state | Never store request-scoped data in module-level variables |
| Floating promises | Every Promise must be `await`ed, `return`ed, `void`ed, or passed to `ctx.waitUntil()` |

### Security

| Rule | Summary |
|------|---------|
| Web Crypto | Use `crypto.randomUUID()` / `crypto.getRandomValues()` — never `Math.random()` |
| No passThroughOnException | Use explicit try/catch with structured error responses |

## Anti-Patterns to Flag

| Anti-pattern | Why it matters |
|-------------|----------------|
| `await response.text()` on unbounded data | Memory exhaustion — 128 MB limit |
| Hardcoded secrets in source or config | Credential leak |
| `Math.random()` for tokens/IDs | Not cryptographically secure |
| Bare `fetch()` without `await` or `waitUntil` | Floating promise |
| Module-level mutable variables for request state | Cross-request data leaks |
| Cloudflare REST API from inside a Worker | Unnecessary latency |
| `ctx.passThroughOnException()` as error handling | Hides bugs |
| Hand-written `Env` interface | Drifts from actual config |
| Direct string comparison for secret values | Timing side-channel |
| Destructuring `ctx` | Loses `this` binding |
| `any` on `Env` or handler params | Defeats type safety |
| `as unknown as T` double-cast | Hides real incompatibilities |
| `implements` on platform base classes | Legacy — loses `this.ctx`, `this.env` |
| `env.X` inside platform base class | Should be `this.env.X` |

## Review Workflow

1. Retrieve latest best practices page, workers types, and wrangler schema
2. Read full files — not just diffs; context matters
3. Check types — binding access, handler signatures, no `any`
4. Check config — compatibility_date, nodejs_compat, observability, secrets
5. Check patterns — streaming, floating promises, global state
6. Check security — crypto usage, secret handling, error handling
7. Validate with tools — `npx tsc --noEmit`, lint for `no-floating-promises`

## Keywords

Cloudflare, Workers, best practices, code review, anti-patterns, streaming, bindings, secrets, observability
