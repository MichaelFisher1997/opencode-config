# Global Agent Instructions

## Interaction Style
- Use the `question` tool when you need clarification, preferences, or decisions
- Don't ask open-ended questions in plain text — offer structured options with descriptions
- Be concise. No unnecessary preambles or postambles ("Here is what I will do next...")
- Ask before doing destructive actions (deleting files, force pushing, etc.)

## Code Quality
- Follow SOLID principles: keep modules focused, extend through composition and interfaces, preserve substitutability, use focused interfaces, and depend on abstractions.
- Use Bun for package management (`bun install`, `bun add`, `bun run`, `bunx`) and for running TypeScript/JavaScript files. Use another package manager only when a project requires it, the user requests it, or Bun is unavailable.
- Prefer TypeScript with strict mode
- Follow existing code conventions in the project you're working in
- Run lint/typecheck commands after making changes when available
- Never introduce code that exposes or logs secrets and keys

## Workflow
- Use todo lists for multi-step tasks
- Read files before editing them
- Check existing patterns before introducing new libraries
- Verify solutions with tests when possible
- Use the Task tool for complex parallel work
- If OpenCode behaves inconsistently after config changes, check `~/.local/share/ai.opencode.desktop/` for stale state before assuming the live config is wrong
- Keep `snapshots` enabled in `opencode.jsonc` when you want workspace state preserved across restarts

## Refactoring
- Understand the code's purpose before changing it
- Preserve existing behavior unless explicitly asked to change it
- Break large changes into smaller, reviewable steps
