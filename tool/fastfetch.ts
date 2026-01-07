import { tool } from "@opencode-ai/plugin"

export default tool({
  description: "FastFetch - system information fetcher like neofetch. Displays OS, kernel, CPU, memory, shell info quickly.",
  args: {
    format: tool.schema.string().optional().describe("Output format (default: auto). Options: auto, json, neofetch, cjk, pfetch"),
    noColor: tool.schema.boolean().default(false).describe("Disable colored output"),
    pipe: tool.schema.boolean().default(false).describe("Pipe output (no ASCII art)"),
  },
  async execute(args) {
    const argsArray = ['fastfetch']
    if (args.format) argsArray.push('--format', args.format)
    if (args.noColor) argsArray.push('--no-color')
    if (args.pipe) argsArray.push('--pipe')

    const result = await Bun.$`${argsArray}`.text()
    return result.trim()
  },
})
