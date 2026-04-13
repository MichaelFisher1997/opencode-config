import type { ApiData, FlatModel, Provider } from "./lib/types";

const API_URL = "https://models.dev/api.json";

async function fetchData(): Promise<ApiData> {
  const res = await Bun.fetch(API_URL);
  if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
  return res.json() as Promise<ApiData>;
}

function flattenModels(data: ApiData): FlatModel[] {
  const result: FlatModel[] = [];
  for (const [providerId, provider] of Object.entries(data)) {
    for (const model of Object.values(provider.models)) {
      result.push({ ...model, provider: providerId, providerName: provider.name });
    }
  }
  return result;
}

function parseFlags(args: string[]): Record<string, string | boolean> {
  const flags: Record<string, string | boolean> = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith("--")) {
      const key = args[i].slice(2);
      const next = args[i + 1];
      if (next && !next.startsWith("--")) {
        flags[key] = next;
        i++;
      } else {
        flags[key] = true;
      }
    }
  }
  return flags;
}

function getFreeArgs(args: string[]): string[] {
  const result: string[] = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith("--")) {
      i++;
      continue;
    }
    result.push(args[i]);
  }
  return result;
}

function formatModel(m: FlatModel) {
  return {
    provider: m.provider,
    providerName: m.providerName,
    id: m.id,
    name: m.name,
    family: m.family ?? null,
    reasoning: m.reasoning ?? false,
    tool_call: m.tool_call ?? false,
    attachment: m.attachment ?? false,
    temperature: m.temperature ?? false,
    open_weights: m.open_weights ?? false,
    knowledge: m.knowledge ?? null,
    release_date: m.release_date ?? null,
    last_updated: m.last_updated ?? null,
    modalities: m.modalities,
    cost: m.cost ?? null,
    limit: m.limit ?? null,
  };
}

// ── Commands ──────────────────────────────────────────────

async function cmdSearch(args: string[]) {
  const query = getFreeArgs(args).join(" ").toLowerCase();
  if (!query) {
    console.error("Usage: bun models.ts search <query>");
    process.exit(1);
  }

  const data = await fetchData();
  const models = flattenModels(data);
  const results = models.filter(
    (m) =>
      m.id.toLowerCase().includes(query) ||
      m.name.toLowerCase().includes(query) ||
      m.provider.toLowerCase().includes(query) ||
      m.providerName.toLowerCase().includes(query) ||
      (m.family && m.family.toLowerCase().includes(query))
  );

  console.log(JSON.stringify(results.map(formatModel), null, 2));
}

async function cmdList(args: string[]) {
  const flags = parseFlags(args);
  const data = await fetchData();
  let models = flattenModels(data);

  if (flags.provider) {
    const p = (flags.provider as string).toLowerCase();
    models = models.filter((m) => m.provider.toLowerCase() === p);
  }

  const caps = ["reasoning", "tool_call", "attachment", "temperature", "open_weights"] as const;
  for (const cap of caps) {
    if (flags[cap]) {
      models = models.filter((m) => m[cap] === true);
    }
  }

  if (flags.capability) {
    const cap = flags.capability as string;
    if (cap === "reasoning") models = models.filter((m) => m.reasoning);
    else if (cap === "tool_call") models = models.filter((m) => m.tool_call);
    else if (cap === "attachment") models = models.filter((m) => m.attachment);
    else if (cap === "temperature") models = models.filter((m) => m.temperature);
    else if (cap === "open_weights") models = models.filter((m) => m.open_weights);
  }

  if (flags.family) {
    const f = (flags.family as string).toLowerCase();
    models = models.filter((m) => m.family?.toLowerCase().includes(f));
  }

  console.log(JSON.stringify(models.map(formatModel), null, 2));
}

function findBestMatch(query: string, models: FlatModel[]): FlatModel | null {
  const q = query.toLowerCase();
  // Exact ID or name match
  const exact = models.find((m) => m.id.toLowerCase() === q || m.name.toLowerCase() === q);
  if (exact) return exact;
  // Starts with
  const starts = models.find((m) => m.id.toLowerCase().startsWith(q) || m.name.toLowerCase().startsWith(q));
  if (starts) return starts;
  // Includes
  const partial = models.find((m) => m.id.toLowerCase().includes(q) || m.name.toLowerCase().includes(q));
  if (partial) return partial;
  // Family match
  const family = models.find((m) => m.family?.toLowerCase().includes(q));
  if (family) return family;
  return null;
}

async function cmdCompare(args: string[]) {
  const modelIds = getFreeArgs(args);
  if (modelIds.length < 2) {
    console.error("Usage: bun models.ts compare <model1> <model2> [...more]");
    process.exit(1);
  }

  const data = await fetchData();
  const models = flattenModels(data);

  const found: FlatModel[] = [];
  for (const id of modelIds) {
    const match = findBestMatch(id, models);
    if (match) {
      found.push(match);
    } else {
      found.push({ id: id.toLowerCase(), name: id, provider: "NOT_FOUND", providerName: "NOT FOUND", modalities: { input: [], output: [] } } as FlatModel);
    }
  }

  console.log(JSON.stringify(found.map(formatModel), null, 2));
}

async function cmdPricing(args: string[]) {
  const flags = parseFlags(args);
  const data = await fetchData();
  let models = flattenModels(data).filter((m) => m.cost);

  if (flags.context) {
    const min = Number(flags.context);
    models = models.filter((m) => (m.limit?.context ?? 0) >= min);
  }
  if (flags["input-cost"]) {
    const max = Number(flags["input-cost"]);
    models = models.filter((m) => (m.cost?.input ?? Infinity) <= max);
  }
  if (flags["output-cost"]) {
    const max = Number(flags["output-cost"]);
    models = models.filter((m) => (m.cost?.output ?? Infinity) <= max);
  }

  const sort = (flags.sort as string) || "input";
  models.sort((a, b) => {
    if (sort === "output") return (a.cost?.output ?? Infinity) - (b.cost?.output ?? Infinity);
    if (sort === "total") {
      const ta = (a.cost?.input ?? 0) + (a.cost?.output ?? 0);
      const tb = (b.cost?.input ?? 0) + (b.cost?.output ?? 0);
      return ta - tb;
    }
    return (a.cost?.input ?? Infinity) - (b.cost?.input ?? Infinity);
  });

  const limit = flags.limit ? Number(flags.limit) : 50;
  models = models.slice(0, limit);

  console.log(JSON.stringify(models.map(formatModel), null, 2));
}

async function cmdProviders() {
  const data = await fetchData();
  const providers = Object.entries(data).map(([id, p]: [string, Provider]) => ({
    id,
    name: p.name,
    doc: p.doc ?? null,
    api: p.api ?? null,
    modelCount: Object.keys(p.models).length,
    models: Object.keys(p.models),
  }));

  console.log(JSON.stringify(providers, null, 2));
}

// ── Main ──────────────────────────────────────────────────

const [,, command, ...args] = process.argv;

const commands: Record<string, (args: string[]) => Promise<void>> = {
  search: cmdSearch,
  list: cmdList,
  compare: cmdCompare,
  pricing: cmdPricing,
  providers: cmdProviders,
};

if (!command || !commands[command]) {
  console.log(`models-dev CLI — Query LLM model data from models.dev

Usage: bun models.ts <command> [args] [flags]

Commands:
  search <query>                  Search models by name, provider, or family
  list [--provider X] [--reasoning] [--tool-call] [--open-weights] [--family X] [--capability X]
                                  List models with optional filters (flags combine with AND)
  compare <m1> <m2> [...more]     Compare 2+ models side by side
  pricing [--context N] [--input-cost N] [--output-cost N] [--sort input|output|total] [--limit N]
                                  List models by pricing with optional filters
  providers                       List all providers and their model counts

Flags:
  --provider <id>    Filter by provider ID (e.g., openai, anthropic, google)
  --capability <cap> Filter by capability: reasoning, tool_call, attachment, temperature, open_weights
  --reasoning        Shorthand for --capability reasoning
  --tool-call        Shorthand for --capability tool_call
  --family <name>    Filter by model family
  --context <N>      Minimum context window size
  --input-cost <N>   Maximum input cost per 1M tokens
  --output-cost <N>  Maximum output cost per 1M tokens
  --sort <field>     Sort pricing by: input, output, total (default: input)
  --limit <N>        Max results for pricing (default: 50)
`);
  process.exit(command ? 0 : 1);
}

try {
  await commands[command](args);
} catch (err) {
  console.error(`Error: ${(err as Error).message}`);
  process.exit(1);
}
