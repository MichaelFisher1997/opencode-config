import { tool } from "@opencode-ai/plugin"

export default tool({
  description: "Lightweight jq-like filter for JSON files. Accepts file path + jq expression, returns only matching slice (no pretty print). Saves tokens vs full read.",
  args: {
    file: tool.schema.string().describe("Path to JSON file to filter"),
    expression: tool.schema.string().describe("JQ-style expression to filter JSON (e.g., '.dependencies', '.data.items[0]')"),
  },
  async execute(args) {
    const content = await Bun.file(args.file).text()
    const json = JSON.parse(content)

    const result = args.expression.split('.').filter(k => k !== '').reduce((obj, key) => {
      if (obj === null || obj === undefined) return null

      if (key.match(/^\d+$/)) {
        const index = parseInt(key)
        if (obj && Array.isArray(obj)) {
          return obj.slice(0, index)
        }
        return obj?.[index]
      }

      if (key.includes('[')) {
        const arrayMatch = key.match(/([^\[]+)\[(\d+)\]/)
        if (arrayMatch) {
          const [, prop, index] = arrayMatch
          const idx = parseInt(index)
          return obj[prop]?.[idx]
        }
      }

      return obj[key]
    }, json)

    return JSON.stringify(result)
  },
})
