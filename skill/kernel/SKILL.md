---
name: kernel
description: Remote browser automation using the Kernel CLI. Use when the agent needs to interact with cloud browsers for web automation, scraping, screenshots, or running browser-based tasks.
license: Apache 2.0
---

# Kernel CLI — Remote Browser Automation

Kernel provides cloud-hosted browsers for automation. Use `kernel` CLI commands to spin up browser sessions, take screenshots, click/type/scroll, run Playwright code, execute commands in the browser VM, and transfer files.

Use `-o json` on most commands for machine-readable output.

## Browser Sessions

```bash
kernel browsers create                    # New session
kernel browsers create --stealth          # Reduce automation fingerprints
kernel browsers create --headless         # No GUI
kernel browsers create -o json            # Returns { "id": "..." }

kernel browsers list                      # All active sessions
kernel browsers list -o json

kernel browsers get <session-id>          # Session details
kernel browsers get <session-id> -o json

kernel browsers delete <session-id>       # Cleanup when done
kernel browsers delete <session-id> -y    # Skip confirmation
```

Always delete sessions when finished to avoid charges.

## Screenshots

```bash
kernel browsers computer screenshot <session-id> --to ./screen.png
kernel browsers computer screenshot <session-id> --to ./crop.png --x 100 --y 100 --width 800 --height 600
```

## Mouse Controls

```bash
kernel browsers computer click-mouse <session-id> --x 500 --y 300
kernel browsers computer click-mouse <session-id> --x 500 --y 300 --button right --num-clicks 2
kernel browsers computer move-mouse <session-id> --x 200 --y 400
kernel browsers computer scroll <session-id> --x 500 --y 500 --delta-y -300
kernel browsers computer drag-mouse <session-id> --point 100,100 --point 200,200 --point 300,100
```

## Keyboard Controls

```bash
kernel browsers computer type <session-id> --text "Hello World"
kernel browsers computer type <session-id> --text "slow" --delay 100
kernel browsers computer press-key <session-id> --key Enter
kernel browsers computer press-key <session-id> --key a --hold-key Control   # Ctrl+A
kernel browsers computer press-key <session-id> --key s --hold-key Control --hold-key Shift  # Ctrl+Shift+S
```

## Playwright Execution

Run Playwright/TypeScript code directly against the browser. Code has access to `page`, `context`, and `browser`. Use `return` to get a value back.

```bash
kernel browsers playwright execute <session-id> 'await page.goto("https://example.com"); return await page.title();'

kernel browsers playwright execute <session-id> --timeout 30 '
  const el = await page.$("h1");
  return await el?.textContent();
'
```

## Process Control

Run shell commands inside the browser VM:

```bash
# Sync
kernel browsers process exec <session-id> -- curl -s https://api.example.com
kernel browsers process exec <session-id> --as-root -- apt-get install -y curl
kernel browsers process exec <session-id> --timeout 30 -o json -- python3 script.py

# Async
kernel browsers process spawn <session-id> -- node server.js
```

## Filesystem

Transfer files to/from the browser VM:

```bash
kernel browsers fs read-file <session-id> --path /tmp/output.json -o ./local.json
kernel browsers fs write-file <session-id> --path /remote/file.txt --source ./local.txt
kernel browsers fs list-files <session-id> --path /tmp -o json
kernel browsers fs upload <session-id> --file ./local.txt:/remote.txt
kernel browsers fs upload <session-id> --dest-dir /app --paths ./a.txt ./b.txt
kernel browsers fs download-dir-zip <session-id> --path /app/output -o ./output.zip
```

## Common Workflows

### Take a Screenshot of a Page
```bash
sid=$(kernel browsers create -o json | jq -r '.id')
kernel browsers playwright execute "$sid" 'await page.goto("https://example.com"); return await page.title();'
kernel browsers computer screenshot "$sid" --to ./page.png
kernel browsers delete "$sid" -y
```

### Extract Page Content
```bash
kernel browsers playwright execute <session-id> '
  await page.goto("https://example.com");
  return await page.textContent("body");
'
```

### Fill and Submit a Form
```bash
kernel browsers computer click-mouse <session-id> --x 400 --y 250
kernel browsers computer type <session-id> --text "user@example.com"
kernel browsers computer press-key <session-id> --key Tab
kernel browsers computer type <session-id> --text "password123"
kernel browsers computer press-key <session-id> --key Enter
```

### Run Commands in Browser VM
```bash
kernel browsers process exec <session-id> --as-root -- apt-get install -y curl jq
kernel browsers process exec <session-id> -- curl -s https://api.example.com/data | jq .
```

## Keywords
kernel, browser, automation, playwright, screenshot, click, type, scroll, web scraping, remote browser
