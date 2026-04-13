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

## How to Run

All commands use `bun` and output JSON to stdout. Run from the skill directory:

```bash
bun /home/micqdf/.config/opencode/skills/models-dev/models.ts <command> [args]
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

## Examples

**User**: "What's the cheapest model with 128k context?"
```bash
bun /home/micqdf/.config/opencode/skills/models-dev/models.ts pricing --context 128000 --sort input --limit 5
```

**User**: "Compare Claude Opus and GPT-5"
```bash
bun /home/micqdf/.config/opencode/skills/models-dev/models.ts compare claude-opus-4 gpt-5
```

**User**: "Which models support tool calling and have reasoning?"
```bash
bun /home/micqdf/.config/opencode/skills/models-dev/models.ts list --tool-call --reasoning
```

**User**: "What models does Google offer?"
```bash
bun /home/micqdf/.config/opencode/skills/models-dev/models.ts list --provider google
```

## Keywords

LLM, models, AI, pricing, context window, capabilities, reasoning, tool calling, provider, OpenAI, Anthropic, Google, Gemini, Claude, GPT, Mistral, DeepSeek, models.dev, model comparison
