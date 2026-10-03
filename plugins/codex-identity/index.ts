import { Plugin } from "@opencode/plugin"

export default Plugin.define({
  id: "codex-identity",
  async setup(ctx) {
    await ctx.session.hook("model.request", (event) => {
      event.headers.originator = "codex_cli_rs"
      event.headers["User-Agent"] = "codex_cli_rs/0.0.0 (OpenCode)"
    }, { providerID: "openai" })
  },
})
