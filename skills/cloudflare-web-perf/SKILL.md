---
name: cloudflare-web-perf
description: Analyzes web performance using Chrome DevTools MCP. Measures Core Web Vitals (LCP, INP, CLS) and supplementary metrics, identifies render-blocking resources, network chains, layout shifts, caching issues, and accessibility gaps. Use when asked to audit, profile, debug, or optimize page load performance.
license: Apache 2.0
metadata:
  source: https://github.com/cloudflare/skills
  category: cloudflare
---

# Web Performance Audit

Your knowledge of web performance metrics, thresholds, and tooling APIs may be outdated. **Prefer retrieval over pre-training**.

## Key Guidelines

- **Be assertive**: Verify claims by checking network requests, DOM, or codebase
- **Verify before recommending**: Confirm something is unused before suggesting removal
- **Quantify impact**: Use estimated savings from insights
- **Skip non-issues**: If render-blocking resources have 0ms impact, note but don't recommend action
- **Be specific**: Say "compress hero.png (450KB) to WebP" not "optimize images"
- **Prioritize ruthlessly**: A site with 200ms LCP and 0 CLS is already excellent

## Quick Reference

| Task | Tool Call |
|------|-----------|
| Load page | `navigate_page(url: "...")` |
| Start trace | `performance_start_trace(autoStop: true, reload: true)` |
| Analyze insight | `performance_analyze_insight(insightSetId: "...", insightName: "...")` |
| List requests | `list_network_requests(resourceTypes: ["Script", "Stylesheet", ...])` |
| Request details | `get_network_request(reqid: <id>)` |
| A11y snapshot | `take_snapshot(verbose: true)` |

## Workflow

### Phase 1: Performance Trace

1. Navigate to target URL: `navigate_page(url: "<target-url>")`
2. Start trace with reload: `performance_start_trace(autoStop: true, reload: true)`

### Phase 2: Core Web Vitals Analysis

| Metric | Insight Name | What to Look For |
|--------|--------------|------------------|
| LCP | `LCPBreakdown` | Time to largest contentful paint |
| CLS | `CLSCulprits` | Elements causing layout shifts |
| Render Blocking | `RenderBlocking` | CSS/JS blocking first paint |
| Document Latency | `DocumentLatency` | Server response time |
| Network Dependencies | `NetworkRequestsDepGraph` | Request chains |

**Key thresholds (good/needs-improvement/poor):**

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| TTFB | < 800ms | < 1.8s | > 1.8s |
| FCP | < 1.8s | < 3s | > 3s |
| LCP | < 2.5s | < 4s | > 4s |
| INP | < 200ms | < 500ms | > 500ms |
| TBT | < 200ms | < 600ms | > 600ms |
| CLS | < 0.1 | < 0.25 | > 0.25 |
| Speed Index | < 3.4s | < 5.8s | > 5.8s |

### Phase 3: Network Analysis

```
list_network_requests(resourceTypes: ["Script", "Stylesheet", "Document", "Font", "Image"])
```

Look for:
1. Render-blocking resources without `async`/`defer`
2. Network chains from late-discovered dependencies
3. Missing preloads for critical resources
4. Missing or weak caching headers
5. Large uncompressed payloads
6. Unused preconnects

### Phase 4: Accessibility Snapshot

```
take_snapshot(verbose: true)
```

Flag: missing ARIA IDs, poor contrast, focus traps, missing accessible names.

### Phase 5: Codebase Analysis

Skip if auditing a third-party site. Analyze framework/bundler config, tree-shaking, unused CSS/JS, polyfills, compression.

## Output Format

1. **Core Web Vitals Summary** - Table with metric, value, rating
2. **Top Issues** - Prioritized with estimated impact
3. **Recommendations** - Specific, actionable fixes
4. **Codebase Findings** - Framework/bundler detected

## Keywords

web performance, Core Web Vitals, LCP, CLS, INP, FCP, TBT, Lighthouse, audit, Chrome DevTools, page speed
