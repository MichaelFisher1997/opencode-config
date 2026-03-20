---
name: kernel
description: Browser automation and deployment using the Kernel CLI. Use when creating, managing, or automating cloud browsers, deploying serverless browser apps, managing extensions, proxies, and browser pools.
license: Apache 2.0
---

# Kernel CLI

Kernel is a browsers-as-a-service platform for web agents, automation, and browser-based apps. Use the `kernel` CLI to manage browser sessions, deploy serverless apps, and automate browser interactions.

## Authentication

```bash
kernel login              # OAuth login (opens browser)
kernel logout             # Clear stored credentials
kernel auth               # Show auth status (user, org, token expiry)
```

Or use an API key:
```bash
export KERNEL_API_KEY=<YOUR_API_KEY>
```

Global flags: `--version`, `--no-color`, `--log-level <level>` (trace/debug/info/warn/error/fatal/print).

Many commands support `-o json` for machine-readable output.

## Browser Sessions

### Create
```bash
kernel browsers create                    # Basic session
kernel browsers create --stealth          # Reduce automation fingerprints
kernel browsers create --headless         # No GUI/VNC
kernel browsers create --kiosk            # Chrome kiosk mode
kernel browsers create -o json            # JSON output with session ID
```

### List & Inspect
```bash
kernel browsers list                      # All sessions
kernel browsers list -o json              # JSON array
kernel browsers get <session-id>          # Session details
kernel browsers get <session-id> -o json
```

### View & SSH
```bash
kernel browsers view <session-id>         # Live view URL for remote control
kernel browsers view <session-id> -o json # JSON with liveViewUrl
kernel browsers ssh <session-id>          # Interactive SSH (requires websocat)
kernel browsers ssh <session-id> -i /path/to/key  # With SSH key
```

### Delete
```bash
kernel browsers delete <session-id>       # With confirmation
kernel browsers delete <session-id> -y    # Skip confirmation
```

## Browser Logs & Replays

```bash
kernel browsers logs stream <session-id> --source supervisor --follow
kernel browsers logs stream <session-id> --source path --path /var/log/app.log

kernel browsers replays list <session-id>         # List recordings
kernel browsers replays start <session-id>         # Start recording
kernel browsers replays start <session-id> --framerate 30 --max-duration 60
kernel browsers replays stop <session-id> <replay-id>  # Stop recording
kernel browsers replays download <session-id> <replay-id> -o ./recording.mp4
```

## Process Control

Run commands inside the browser VM:

```bash
# Synchronous execution
kernel browsers process exec <session-id> -- ls -la /tmp
kernel browsers process exec <session-id> --command "python3" --args "script.py" --cwd /app
kernel browsers process exec <session-id> --as-root -- uname -a
kernel browsers process exec <session-id> --timeout 30 -o json -- curl example.com

# Asynchronous execution
kernel browsers process spawn <session-id> -- node server.js
kernel browsers process spawn <session-id> --command "python3" --args "worker.py" -o json

# Process management
kernel browsers process status <session-id> <process-id>
kernel browsers process kill <session-id> <process-id>          # SIGTERM
kernel browsers process kill <session-id> <process-id> --signal KILL
kernel browsers process stdin <session-id> <process-id> --data-b64 <base64-data>
kernel browsers process stdout-stream <session-id> <process-id>  # Stream output
```

## Filesystem

Manipulate the browser VM's filesystem:

```bash
# Read & Write
kernel browsers fs read-file <session-id> --path /etc/hosts
kernel browsers fs read-file <session-id> --path /tmp/output.json -o ./local-copy.json
kernel browsers fs write-file <session-id> --path /remote/file.txt --source ./local/file.txt
kernel browsers fs write-file <session-id> --path /remote/script.sh --source ./script.sh --mode 755

# List & Info
kernel browsers fs list-files <session-id> --path /tmp
kernel browsers fs list-files <session-id> --path /app -o json
kernel browsers fs file-info <session-id> --path /etc/hosts -o json

# Directories
kernel browsers fs new-directory <session-id> --path /app/data
kernel browsers fs new-directory <session-id> --path /app/data --mode 755
kernel browsers fs delete-directory <session-id> --path /tmp/old-data

# Delete & Move
kernel browsers fs delete-file <session-id> --path /tmp/cache.json
kernel browsers fs move <session-id> --src /tmp/old.txt --dest /tmp/new.txt

# Upload & Download
kernel browsers fs upload <session-id> --file ./local.txt:/remote.txt
kernel browsers fs upload <session-id> --dest-dir /app --paths ./file1.txt ./file2.txt
kernel browsers fs upload-zip <session-id> --zip ./assets.zip --dest-dir /app/public
kernel browsers fs download-dir-zip <session-id> --path /app/output -o ./output.zip
```

## Computer Controls

Automate mouse, keyboard, and screen interactions:

```bash
# Screenshots
kernel browsers computer screenshot <session-id> --to ./screen.png
kernel browsers computer screenshot <session-id> --to ./crop.png --x 100 --y 100 --width 800 --height 600

# Mouse
kernel browsers computer click-mouse <session-id> --x 500 --y 300
kernel browsers computer click-mouse <session-id> --x 500 --y 300 --button right --num-clicks 2
kernel browsers computer move-mouse <session-id> --x 200 --y 400
kernel browsers computer scroll <session-id> --x 500 --y 500 --delta-y -300
kernel browsers computer drag-mouse <session-id> --point 100,100 --point 200,200 --point 300,100

# Keyboard
kernel browsers computer type <session-id> --text "Hello World"
kernel browsers computer type <session-id> --text "slow typing" --delay 100
kernel browsers computer press-key <session-id> --key Enter
kernel browsers computer press-key <session-id> --key a --hold-key Control  # Ctrl+A
kernel browsers computer press-key <session-id> --key Tab --hold-key Control --hold-key Shift  # Ctrl+Shift+Tab
```

## Playwright Execution

Run Playwright/TypeScript code directly against a browser session:

```bash
kernel browsers playwright execute <session-id> 'await page.goto("https://example.com"); return await page.title();'
kernel browsers playwright execute <session-id> --timeout 30 'const el = await page.$("h1"); return await el?.textContent();'
```

The code has access to `page`, `context`, and `browser` variables. Use `return` to get a value back.

## App Deployment

### Deploy
```bash
kernel deploy index.ts                        # Deploy TypeScript app
kernel deploy main.py                         # Deploy Python app
kernel deploy index.ts --version v2           # Specific version label
kernel deploy index.ts --force                # Overwrite existing version
kernel deploy index.ts -e API_KEY=secret      # Set env vars
kernel deploy index.ts --env-file .env        # Load env from file
kernel deploy index.ts -o json                # JSONL output (deployment events)
```

### Deploy Logs
```bash
kernel deploy logs <deployment-id>            # Show logs
kernel deploy logs <deployment-id> -f         # Follow/stream logs
kernel deploy logs <deployment-id> -s 5m      # Last 5 minutes
kernel deploy logs <deployment-id> -t         # With timestamps
```

### Invoke
```bash
kernel invoke my-app my-action                          # Async invoke
kernel invoke my-app my-action -p '{"key":"value"}'     # With JSON payload
kernel invoke my-app my-action --sync                   # Wait for result (60s timeout)
kernel invoke my-app my-action --sync -o json           # JSONL output
kernel invoke my-app my-action -v v2                    # Specific version
```

Press Ctrl+C to cancel an in-flight invocation (browser sessions cleaned up automatically).

### App Management
```bash
kernel app list                               # List all apps
kernel app list --name my-app                 # Filter by name
kernel app list --name my-app --version v1    # Filter by version
kernel app list -o json

kernel app history my-app                     # Deployment history
kernel app history my-app --limit 10
kernel app history my-app -o json
```

### Logs
```bash
kernel logs my-app                            # Tail logs (latest version)
kernel logs my-app -v v1                      # Specific version
kernel logs my-app -f                         # Follow/stream
kernel logs my-app -s 1h                      # Last hour
```

## Extensions

Manage browser extensions for Kernel browsers:

```bash
kernel extensions list                        # List all extensions
kernel extensions list -o json

kernel extensions upload ./my-extension       # Upload unpacked extension
kernel extensions upload ./my-extension --name ad-blocker

kernel extensions download my-extension --to ./downloads/
kernel extensions delete my-extension         # With confirmation
kernel extensions delete my-extension -y      # Skip confirmation

# Download from Chrome Web Store
kernel extensions download-web-store https://chromewebstore.google.com/detail/EXT_ID --to ./ext --os linux

# Build Web Bot Auth extension (RFC 9421 HTTP signatures)
kernel extensions build-web-bot-auth --to ./web-bot-auth
kernel extensions build-web-bot-auth --to ./web-bot-auth --key ./signing-key.jwk
kernel extensions build-web-bot-auth --to ./web-bot-auth --upload my-bot-auth
```

Upload extensions into a running browser:
```bash
kernel browsers extensions upload <session-id> ./ext1 ./ext2
```

## Proxies

```bash
kernel proxies list                           # List proxy configs
kernel proxies list -o json
kernel proxies get <proxy-id> -o json

kernel proxies create --name us-residential --type residential --country US
kernel proxies create --name my-custom --type custom --host proxy.example.com --port 8080
kernel proxies create --name dc-proxy --type datacenter --country DE --protocol http

kernel proxies delete <proxy-id>
kernel proxies delete <proxy-id> -y
```

Types: `datacenter`, `isp`, `residential`, `mobile`, `custom`.

## Browser Pools

Pre-configure reserved browsers for immediate acquisition:

```bash
kernel browser-pools list                     # List pools
kernel browser-pools list -o json

kernel browser-pools create --name my-pool --size 5
kernel browser-pools create --name fast-pool --size 10 --fill-rate 50 --timeout 300

kernel browser-pools get <pool-id-or-name> -o json
kernel browser-pools update <pool-id-or-name> --size 10
kernel browser-pools update <pool-id-or-name> --discard-all-idle

kernel browser-pools acquire <pool-id-or-name>                  # Get a browser from pool
kernel browser-pools acquire <pool-id-or-name> --timeout 30 -o json

kernel browser-pools release <pool-id-or-name> --session-id <sid>   # Return browser
kernel browser-pools release <pool-id-or-name> --session-id <sid> --reuse

kernel browser-pools delete <pool-id-or-name>                   # Delete pool
kernel browser-pools delete <pool-id-or-name> --force           # Even if browsers leased
kernel browser-pools flush <pool-id-or-name>                    # Destroy idle browsers
```

## Profiles

Persist browser state (cookies, localStorage) across sessions:

```bash
kernel profiles list                          # List profiles
kernel profiles list -o json
kernel profiles get <profile-id-or-name> -o json
kernel profiles create --name my-profile     # Create new profile
kernel profiles create --name my-profile -o json
```

## MCP Server

Install Kernel MCP server for AI tools:

```bash
kernel mcp install --target cursor
kernel mcp install --target claude
kernel mcp install --target claude-code
kernel mcp install --target vscode
kernel mcp install --target windsurf
```

Supported targets: `cursor`, `claude`, `claude-code`, `windsurf`, `vscode`, `goose`, `zed`.

## Common Workflows

### Quick Screenshot
```bash
sid=$(kernel browsers create -o json | jq -r '.id')
kernel browsers computer screenshot "$sid" --to ./page.png
kernel browsers delete "$sid" -y
```

### Navigate & Extract Content
```bash
kernel browsers playwright execute <session-id> '
  await page.goto("https://example.com");
  return await page.textContent("body");
'
```

### Deploy & Invoke
```bash
kernel deploy index.ts --env API_KEY=$API_KEY
kernel invoke my-app scrape --sync -p '{"url":"https://example.com"}' -o json
```

### Automated Form Fill
```bash
kernel browsers computer click-mouse <session-id> --x 400 --y 250
kernel browsers computer type <session-id> --text "user@example.com"
kernel browsers computer press-key <session-id> --key Tab
kernel browsers computer type <session-id> --text "password123"
kernel browsers computer press-key <session-id> --key Enter
```

### Run Commands in Browser VM
```bash
kernel browsers process exec <session-id> --as-root -- apt-get install -y curl
kernel browsers process exec <session-id> -- curl -s https://api.example.com/data
```

## Keywords
kernel, browser, automation, playwright, deploy, invoke, cloud browser, headless, screenshot, web scraping, browser pool, extension, proxy, MCP
