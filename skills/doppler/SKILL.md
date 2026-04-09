---
name: doppler
description: Manage project secrets using the Doppler CLI. Use when setting up, accessing, injecting, or managing environment secrets, service tokens, CI/CD integration, or secret rotation for any language or platform.
license: Apache 2.0
metadata:
  category: secrets-management
  cli: doppler
  docs: https://docs.doppler.com/docs/cli
---
# Doppler Secrets Management

- Prefer using `doppler` CLI for all secrets operations over manual `.env` file management.
- Use `doppler run` to inject secrets as environment variables into any process.
- Never print secret values to terminal output unless the user explicitly requests it.
- Use service tokens (not personal auth) in CI/CD and production environments.
- Recommend removing `.env` files after migrating to Doppler.

## When to Use

Use this skill when:
- Setting up Doppler for a new project or environment
- Accessing or injecting secrets into applications
- Managing secrets (get, set, delete, import, download)
- Creating service tokens for CI/CD or production
- Integrating Doppler with GitHub Actions, Docker, or other platforms
- Troubleshooting secrets access or CLI issues

## Setup & Authentication

### Local Development

```bash
doppler login
```

This opens a browser for auth. Only needed once per workplace.

### Project Setup

```bash
doppler setup
```

Selects project and config for the current directory. Optionally pre-configure with `doppler.yaml`:

```yaml
setup:
  - project: my-project
    config: dev_personal
```

For monorepos, map subdirectories to different projects:

```yaml
setup:
  - project: backend
    config: dev_personal
    path: backend/
  - project: frontend
    config: dev_personal
    path: frontend/
```

Then run non-interactively:

```bash
doppler setup --no-interactive
```

### Service Token Auth (Production/CI)

```bash
echo 'dp.st.prd.xxxx' | doppler configure set token --scope /
```

Or set the `DOPPLER_TOKEN` environment variable:

```bash
export DOPPLER_TOKEN="dp.st.prd.xxxx"
```

## Running with Secrets

### Single Command

```bash
doppler run -- your-command-here
```

### Multiple Commands

```bash
doppler run --command="./configure && ./process-jobs; ./cleanup"
```

### With Project/Config Flags

```bash
doppler run -p PROJECT -c CONFIG -- your-command-here
```

### Auto-Restart on Secret Changes

```bash
doppler run --watch -- your-command-here
```

Requires Team plan. Automatically restarts your process when secrets change.

### Accessing Secrets in Code

Doppler injects secrets as environment variables. Access them via the standard env API for your language:

- **Node.js**: `process.env["SECRET_NAME"]`
- **Python**: `os.getenv("SECRET_NAME")`
- **Go**: `os.Getenv("SECRET_NAME")`
- **Ruby**: `ENV["SECRET_NAME"]`
- **Java/Kotlin**: `System.getenv("SECRET_NAME")`
- **Rust**: `env::var("SECRET_NAME")`
- **PHP**: `$_ENV["SECRET_NAME"]`
- **C/C++**: `getenv("SECRET_NAME")`

### One-Off Secret Access

```bash
doppler run --command='echo $SECRET_NAME'
doppler run --command="echo \$SECRET_NAME"
echo $(doppler secrets get SECRET_NAME --plain)
```

## Managing Secrets

### List Secrets

```bash
doppler secrets
doppler secrets list -p PROJECT -c CONFIG
```

### Get a Secret

```bash
doppler secrets get SECRET_NAME
doppler secrets get SECRET_NAME --plain
```

### Set a Secret

```bash
doppler secrets set SECRET_NAME=value
doppler secrets set SECRET_NAME=value -p PROJECT -c CONFIG
```

### Delete a Secret

```bash
doppler secrets delete SECRET_NAME
```

### Download Secrets

```bash
doppler secrets download --no-file --format=json
doppler secrets download --no-file --format=env
doppler secrets download --no-file --format=yaml
```

### Upload/Import Secrets

```bash
doppler secrets upload secrets.json
doppler secrets upload .env
```

### Generate a Secret

```bash
doppler secrets generate SECRET_NAME --length 64
```

## Projects & Configs

### List Projects

```bash
doppler projects
doppler projects list
```

### Create a Project

```bash
doppler projects create my-project
```

### List Configs

```bash
doppler configs -p PROJECT
```

### List Environments

```bash
doppler environments -p PROJECT
```

## Service Tokens

### Create Ephemeral Token

```bash
doppler configs tokens create token-name -p PROJECT -c CONFIG --max-age 1m --plain
```

### Use in Scripts

```bash
DOPPLER_TOKEN=$(doppler configs tokens create ci-job -p my-project -c dev --max-age 1m --plain)
doppler run -- your-command-here
```

### Get Current Token

```bash
doppler configure get token --plain
```

## CI/CD Integration

### GitHub Actions

Use the official CLI action in your workflow:

```yaml
steps:
  - name: Install Doppler CLI
    uses: dopplerhq/cli-action@v3

  - name: Run with secrets
    run: doppler run -- your-command
    env:
      DOPPLER_TOKEN: ${{ secrets.DOPPLER_TOKEN }}
```

**Setup steps:**
1. Create a `DOPPLER_TOKEN` secret in your GitHub repository (use a Doppler service token)
2. Add `dopplerhq/cli-action@v3` step before any step that needs secrets
3. Wrap commands with `doppler run --`

**GitHub Integration (Automated Sync):**
- Install the Doppler GitHub App from repository settings
- Configure sync from Doppler dashboard: Projects > Integrations > GitHub
- Supports Actions, Codespaces, and Dependabot
- Can sync to specific GitHub Environments
- Can sync to Organization-level secrets
- Secrets changes in Doppler are instantly reflected in GitHub

**Import existing GitHub secrets to Doppler:**
GitHub's API doesn't expose secret values. Use a `workflow_dispatch` workflow with `doppler secrets upload` to migrate.

### Docker

Install the CLI in your Dockerfile:

```dockerfile
RUN (curl -Ls --tlsv1.2 --proto "=https" --retry 3 https://cli.doppler.com/install.sh || wget -t 3 -qO- https://cli.doppler.com/install.sh) | sh
```

**CMD approach (recommended):**

```dockerfile
CMD ["doppler", "run", "--", "your-command-here"]
```

**ENTRYPOINT approach:**

```dockerfile
ENTRYPOINT ["doppler", "run", "--"]
CMD ["your-command-here"]
```

Run the container with a service token:

```bash
docker run -e DOPPLER_TOKEN="$DOPPLER_TOKEN" your-image
```

**Local development with ephemeral token:**

```bash
docker run --rm -it \
  -e DOPPLER_TOKEN="$(doppler configs tokens create docker --max-age 1m --plain)" \
  your-image
```

If the base image has no home directory, use:

```dockerfile
ENV DOPPLER_CONFIG_DIR=/tmp/.doppler
```

### Generic CI/CD

Install via shell script (no package manager required):

```bash
(curl -Ls --tlsv1.2 --proto "=https" --retry 3 https://cli.doppler.com/install.sh || wget -t 3 -qO- https://cli.doppler.com/install.sh) | sh
```

Then authenticate with a service token and run:

```bash
export DOPPLER_TOKEN="$DOPPLER_TOKEN"
doppler run -- your-command
```

### OIDC Authentication

For platforms that support OIDC (GitHub, GitLab, etc.), use service account identities instead of static tokens:

```bash
doppler oidc login --scope=. --identity=YOUR_IDENTITY_ID --token=$OIDC_TOKEN
```

## Fallback Files

Encrypted fallback files ensure secrets are available offline or during Doppler outages:

```bash
doppler run --fallback=path/to/fallback.json -- your-command
```

Fallback files are created automatically during `doppler run` and encrypted with your config's key.

## Security Rules

- Never log, print, or expose secret values unless the user explicitly requests it
- Always prefer `doppler run` over downloading secrets to plain files
- Use service tokens in CI/CD - never use personal auth tokens
- Use the `--plain` flag only when necessary and never in CI output
- Remove `.env` files from the project after migrating to Doppler
- Add `.env` files to `.gitignore` if they still exist
- Use ephemeral tokens with `--max-age` for temporary access
- Prefer `doppler.yaml` for project setup to avoid passing `-p`/`-c` flags repeatedly
- Use `--no-file` when downloading secrets to prevent writing fallback files to disk unnecessarily

## Common Commands

```bash
doppler --version
doppler update
doppler login
doppler setup
doppler run -- your-command
doppler run --watch -- your-command
doppler secrets
doppler secrets get SECRET_NAME --plain
doppler secrets set SECRET_NAME=value
doppler secrets delete SECRET_NAME
doppler secrets download --no-file --format=json
doppler secrets upload .env
doppler projects list
doppler configs list -p PROJECT
doppler configure get token --plain
doppler me
doppler open
doppler tui
```

## Keywords

Doppler, secrets, environment variables, env, service token, secrets management, Doppler CLI, secret injection, secret rotation, CI/CD secrets, Docker secrets, GitHub Actions secrets
