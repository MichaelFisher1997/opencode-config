import { tool } from "@opencode-ai/plugin"

export default tool({
  description: "Semantic search using mgrep. Use instead of Grep/Glob/WebSearch.",
  args: {
    query: tool.schema.string().describe("Search query"),
    web: tool.schema.boolean().default(false).describe("Include web search"),
    answer: tool.schema.boolean().default(false).describe("Summarize results"),
    maxResults: tool.schema.number().default(10).optional().describe("Limit results"),
    path: tool.schema.string().optional().describe("Directory to search"),
  },
  async execute(args) {
    const argsArray = ['mgrep']
    if (args.web) argsArray.push('-w')
    if (args.answer) argsArray.push('-a')
    if (args.maxResults && args.maxResults !== 10) argsArray.push('-m', String(args.maxResults))
    argsArray.push(args.query)
    if (args.path) argsArray.push(args.path)

    const result = await Bun.$`${argsArray}`.text()
    return result.trim()
  },
})
