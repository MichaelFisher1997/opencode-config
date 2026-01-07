# Global Package Manager Preference

**ALWAYS** use Bun over npm, pnpm, yarn, or any other package manager.

## When Working with Package Management

- Use `bun install` instead of `npm install`, `pnpm install`, `yarn install`
- Use `bun add <package>` instead of `npm install <package>`, `pnpm add <package>`, `yarn add <package>`
- Use `bun run <script>` instead of `npm run <script>`, `pnpm run <script>`, `yarn run <script>`
- Use `bunx` for running npx packages instead of `npx`
- Use Bun's runtime: `bun <file>.ts` or `bun <file>.js`

## When to Use Other Package Managers

Only use other package managers if:
- The project explicitly requires it (e.g., CI environment without Bun)
- User explicitly requests it
- Bun is not available in the environment
