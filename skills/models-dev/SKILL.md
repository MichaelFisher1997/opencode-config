---
name: models-dev
description: Look up current LLM model information, capabilities, pricing, context windows, and comparisons using models.dev data. Use when asked about AI models, model capabilities, pricing, or provider comparisons.
license: MIT
metadata:
  category: reference
  source: https://models.dev
---

## Models.dev Reference

Live LLM model data from [models.dev](https://models.dev). Covers all major providers with up-to-date capabilities, pricing, context windows, release dates, and more.

## When to Use

Use this skill when the user asks about:
- What models a provider offers (e.g., "What models does Anthropic have?")
- Model capabilities (reasoning, tool calling, attachments, etc.)
- Pricing comparisons between models
- Context window sizes
- Which models support a specific feature
- Model release dates or knowledge cutoffs
- Comparing two or more models
- Finding the cheapest model that meets certain criteria
- Open-weight models

**Do NOT use** for local codebase questions, git operations, or non-model topics.

## Finding Latest/Flagship Models

When asked about "current," "latest," "flagship," "newest," or "state of the art" models, you **must** follow this discovery process:

1. **Query by provider first** — Run `list --provider <provider>` for each major provider (anthropic, openai, google, deepseek, mistral, etc.) in parallel. This discovers all models including ones you may not know about.

2. **Identify the latest by release_date** — From the results, find the model(s) with the most recent `release_date` per provider. Models.dev data is sorted by last_updated, but `release_date` is the authoritative field for when a model launched.

3. **Then compare** — Once you've identified the latest models per provider, use `compare` to present them side-by-side if requested.

**CRITICAL: Never assume you know model names.** The model landscape moves fast. Always query providers directly rather than searching for model names you already know. For example, searching `claude-opus-4` will miss `claude-opus-4-6`. Searching `gpt-5` will miss `gpt-5.4`.

Major providers to check:
- `anthropic` — Claude family
- `openai` — GPT and o-series
- `google` — Gemini family
- `deepseek` — DeepSeek models
- `mistral` — Mistral family
- `xai` — Grok family
- `meta` — Llama family

## How to Run

All commands use `bun` and output JSON to stdout. Run from the skill directory:

```bash
bun /home/admin/.config/opencode/skills/models-dev/models.ts <command> [args]
```

Data is fetched live from `https://models.dev/api.json` on each run.

## Commands

### Search

Find models by name, provider, ID, or family:

```bash
bun models.ts search claude
bun models.ts search gpt-5
bun models.ts search gemini
bun models.ts search reasoning
```

### List with Filters

List models with optional filters (filters combine with AND logic):

```bash
# All models from a provider
bun models.ts list --provider openai

# Models with reasoning capability
bun models.ts list --reasoning

# Models with tool calling
bun models.ts list --tool-call

# Open-weight models
bun models.ts list --open-weights

# Combine filters
bun models.ts list --provider anthropic --reasoning

# By capability name
bun models.ts list --capability tool_call

# By family
bun models.ts list --family gemini
```

### Compare Models

Side-by-side comparison of 2+ models:

```bash
bun models.ts compare claude-opus-4 gpt-5
bun models.ts compare claude-opus-4 gpt-5 gemini-2.5-pro
```

### Pricing

Find models by cost with optional filters:

```bash
# All models with pricing, sorted by input cost
bun models.ts pricing

# Models with 128k+ context
bun models.ts pricing --context 128000

# Cheapest models (input cost)
bun models.ts pricing --sort input --limit 10

# Cheapest by output cost
bun models.ts pricing --sort output --limit 10

# Cap input cost at $5/1M tokens
bun models.ts pricing --input-cost 5

# Combine filters
bun models.ts pricing --context 100000 --input-cost 10 --sort input
```

### Providers

List all providers and their model counts:

```bash
bun models.ts providers
```

## Output Format

All commands return JSON arrays. Each model object contains:

```json
{
  "provider": "anthropic",
  "providerName": "Anthropic",
  "id": "claude-opus-4",
  "name": "Claude Opus 4",
  "family": "claude",
  "reasoning": true,
  "tool_call": true,
  "attachment": true,
  "temperature": true,
  "open_weights": false,
  "knowledge": "2025-04",
  "release_date": "2025-05-22",
  "last_updated": "2025-05-22",
  "modalities": { "input": ["text", "image"], "output": ["text"] },
  "cost": { "input": 15, "output": 75 },
  "limit": { "context": 200000, "output": 32000 }
}
```

Fields may be `null` if the data is unavailable for a given model.

## Rules

- **NEVER** fabricate model information — always query the script
- If the script returns no results, say so honestly
- The data reflects models.dev's current state; it may lag behind very recent announcements
- If a model isn't found, try searching by partial name or provider
- Cite the provider and model ID when giving answers
- When answering "what's current/latest/flagship," never assume model names — always query providers directly (`list --provider <name>`) to discover the newest releases. Model names change quickly (e.g., `claude-opus-4` → `claude-opus-4-6`, `gpt-5` → `gpt-5.4`)
- Use `release_date` (not `last_updated`) to determine which model is newest

## Examples

**User**: "What's the cheapest model with 128k context?"
```bash
bun /home/admin/.config/opencode/skills/models-dev/models.ts pricing --context 128000 --sort input --limit 5
```

**User**: "Compare Claude Opus and GPT-5"
```bash
bun /home/admin/.config/opencode/skills/models-dev/models.ts compare claude-opus-4 gpt-5
```

**User**: "Which models support tool calling and have reasoning?"
```bash
bun /home/admin/.config/opencode/skills/models-dev/models.ts list --tool-call --reasoning
```

**User**: "What models does Google offer?"
```bash
bun /home/admin/.config/opencode/skills/models-dev/models.ts list --provider google
```

**User**: "What are the current flagship models?" or "What's the latest from each provider?"
```bash
# Step 1: Discover latest models per provider (run in parallel)
bun /home/admin/.config/opencode/skills/models-dev/models.ts list --provider anthropic
bun /home/admin/.config/opencode/skills/models-dev/models.ts list --provider openai
bun /home/admin/.config/opencode/skills/models-dev/models.ts list --provider google
bun /home/admin/.config/opencode/skills/models-dev/models.ts list --provider deepseek
# Step 2: Identify models with the most recent release_date per provider
# Step 3: Compare them side-by-side if needed
bun /home/admin/.config/opencode/skills/models-dev/models.ts compare claude-opus-4-6 gpt-5.4 gemini-2.5-pro
```

## Keywords

LLM, models, AI, pricing, context window, capabilities, reasoning, tool calling, provider, OpenAI, Anthropic, Google, Gemini, Claude, GPT, Mistral, DeepSeek, models.dev, model comparison
