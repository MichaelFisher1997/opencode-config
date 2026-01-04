import type { Plugin } from "@opencode-ai/plugin"
import { existsSync, readdirSync, copyFileSync, chmodSync, statSync } from "fs"
import { join } from "path"

interface HookConfig {
  hooksDirectory: string
  installToGitHooks: boolean
  onlyInstallIfExists: boolean
}

async function installGitHooks(hooksDir: string, gitHooksDir: string): Promise<void> {
  if (!existsSync(hooksDir)) {
    return
  }

  const files = readdirSync(hooksDir)
  let installed = 0

  for (const file of files) {
    const sourcePath = join(hooksDir, file)
    const stat = statSync(sourcePath)

    if (stat.isFile() && !file.startsWith(".")) {
      const destPath = join(gitHooksDir, file)
      copyFileSync(sourcePath, destPath)
      chmodSync(destPath, 0o755)
      installed++
    }
  }

  if (installed > 0) {
    console.log(`[git-hooks-plugin] Installed ${installed} git hooks from ${hooksDir}`)
  }
}

async function checkAndInstallHooks(projectDir: string): Promise<void> {
  const gitDir = join(projectDir, ".git")
  if (!existsSync(gitDir)) {
    return
  }

  const gitHooksDir = join(gitDir, "hooks")
  const githooksDir = join(projectDir, ".githooks")

  if (existsSync(githooksDir)) {
    await installGitHooks(githooksDir, gitHooksDir)
  }

  const customHooksDir = join(projectDir, ".git-hooks")
  if (existsSync(customHooksDir)) {
    await installGitHooks(customHooksDir, gitHooksDir)
  }
}

export const GitHooksPlugin: Plugin = async ({ project, directory }) => {
  return {
    "session.starting": async (input, output) => {
      const projectDir = project?.directory || directory || process.cwd()
      await checkAndInstallHooks(projectDir)
    },

    "project.opened": async (input, output) => {
      const projectDir = project?.directory || directory || process.cwd()
      await checkAndInstallHooks(projectDir)
    }
  }
}
