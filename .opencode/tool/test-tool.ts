import { tool } from "@opencode-ai/plugin"

export default tool({
  description: "Test tool to verify tool system works",
  args: {
    message: tool.schema.string().describe("Test message"),
  },
  async execute(args) {
    return `Test successful: ${args.message}`
  },
})
