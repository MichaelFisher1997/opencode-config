# Git Hooks Plugin for OpenCode

Automatically installs git hooks from your project when sessions start.

## What This Does

When you start an OpenCode session in a project, this plugin checks for git hooks in common locations and installs them:

- `.githooks/` - Standard git hooks directory
- `.git-hooks/` - Alternative hooks directory

Any executable scripts in these directories will be copied to `.git/hooks/` with the same filename.

## Installation

1. Add to your OpenCode config (`~/.config/opencode/opencode.jsonc`):
   ```json
   "include": [
     "~/.config/opencode/plugin/*.ts"
   ]
   ```

2. Create the plugin:
   ```bash
   mkdir -p ~/.config/opencode/plugin
   # Copy git-hooks.ts to this directory
   ```

## Creating Git Hooks

### For Your Projects

Create a `.githooks/` directory in your project root:

```
my-project/
├── .githooks/
│   ├── pre-commit
│   ├── pre-push
│   └── post-commit
└── .git/
```

### Example: Pre-commit Secret Scanner

Create `.githooks/pre-commit`:

```bash
#!/bin/bash
# Pre-commit hook to scan for secrets

if command -v gitleaks &> /dev/null; then
    echo "🔍 Scanning for secrets..."
    if gitleaks detect --verbose --redact=false; then
        echo "✅ No secrets detected"
        exit 0
    else
        echo "🚨 Secrets detected! Commit blocked."
        exit 1
    fi
else
    echo "⚠️  Gitleaks not installed. Install from: https://github.com/gitleaks/gitleaks"
    exit 0
fi
```

### Making Hooks Executable

```bash
chmod +x .githooks/pre-commit
```

## How It Works

1. When you start an OpenCode session in a project directory
2. The plugin checks for `.githooks/` or `.git-hooks/` directories
3. It copies all executable scripts to `.git/hooks/`
4. Git automatically runs these hooks on relevant git operations

## Hook Types

Git supports various hook types:

- `pre-commit` - Before a commit is created
- `pre-push` - Before changes are pushed to remote
- `post-commit` - After a commit is created
- `post-merge` - After a merge completes
- `pre-receive` - Before receiving pushed changes (remote)
- `post-receive` - After receiving pushed changes (remote)

## Example Hooks

### Simple Pre-commit Check

```bash
#!/bin/bash
echo "🔍 Running pre-commit checks..."

# Check for debug statements
if grep -r "console.log" --include="*.js" . 2>/dev/null; then
    echo "⚠️  Found console.log statements. Consider removing them."
fi
```

### Pre-push Test Runner

```bash
#!/bin/bash
echo "🧪 Running tests before push..."

if command -v npm &> /dev/null; then
    npm test
    if [ $? -ne 0 ]; then
        echo "🚨 Tests failed! Push blocked."
        exit 1
    fi
fi
```

## Troubleshooting

### Hooks Not Installing

1. Check that the hooks directory exists in your project:
   ```bash
   ls -la .githooks/
   ```

2. Verify hooks are executable:
   ```bash
   chmod +x .githooks/*
   ```

3. Check OpenCode logs for plugin errors

### Hooks Not Running

1. Verify git hooks are installed:
   ```bash
   ls -la .git/hooks/
   ```

2. Check hook permissions:
   ```bash
   chmod +x .git/hooks/*
   ```

3. Test hook manually:
   ```bash
   .git/hooks/pre-commit
   ```

## Best Practices

1. **Keep hooks small and fast** - They run on every git operation
2. **Don't commit secrets in hooks** - Hooks are in your repo
3. **Use exit codes properly** - 0 = success, non-zero = failure
4. **Document your hooks** - Explain what each hook does
5. **Version control your hooks** - Store in `.githooks/` in git

## License

MIT
