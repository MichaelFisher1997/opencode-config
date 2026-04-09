---
name: use-railway
description: Operate Railway infrastructure. Create projects, provision services and databases, manage object storage buckets, deploy code, configure environments and variables, manage domains, troubleshoot failures, check status and metrics, and query Railway docs. Use this skill whenever the user mentions Railway, deployments, services, environments, buckets, object storage, build failures, or infrastructure operations.
license: MIT
metadata:
  source: https://github.com/railwayapp/railway-skills
  category: infrastructure
  cli: railway
---

# Use Railway

## Railway Resource Model

- **Workspace** is the billing and team scope.
- **Project** is a collection of services under one workspace.
- **Environment** is an isolated configuration plane inside a project (e.g., `production`, `staging`).
- **Service** is a single deployable unit (app from repo, Docker image, or managed database).
- **Bucket** is an S3-compatible object storage resource inside a project.
- **Deployment** is a point-in-time release of a service in an environment.

Most CLI commands operate on the linked project/environment/service context. Use `railway status --json` to see the context, and `--project`, `--environment`, `--service` flags to override.

## Parsing Railway URLs

Users often paste Railway dashboard URLs. Extract IDs:

```
https://railway.com/project/<PROJECT_ID>/service/<SERVICE_ID>?environmentId=<ENV_ID>
```

**Prefer passing explicit IDs** to CLI commands instead of running `railway link`.

## Preflight

Before any mutation, verify context:

```bash
command -v railway                # CLI installed
railway whoami --json             # authenticated
railway --version                 # check CLI version
```

If the CLI is missing, guide the user to install it:

```bash
bash <(curl -fsSL cli.new)       # Shell script (macOS, Linux)
brew install railway               # Homebrew (macOS)
npm i -g @railway/cli             # npm (requires Node.js 16+)
```

If not authenticated, run `railway login`. If a command is not recognized, upgrade with `railway upgrade`.

## Common Quick Operations

```bash
railway status --json                                    # current context
railway whoami --json                                    # auth and workspace info
railway project list --json                              # list projects
railway service status --all --json                      # all services in current context
railway variable list --service <svc> --json             # list variables
railway variable set KEY=value --service <svc>           # set a variable
railway logs --service <svc> --lines 200 --json          # recent logs
railway up --detach -m "<summary>"                       # deploy current directory
railway bucket list --json                               # list buckets in current environment
railway bucket info --bucket <name> --json               # bucket storage and object count
railway bucket credentials --bucket <name> --json        # S3-compatible credentials
```

## Routing by Intent

| Intent | Use for |
|---|---|
| Create or connect resources | Projects, services, databases, buckets, templates, workspaces |
| Ship code or manage releases | Deploy, redeploy, restart, build config, monorepo, Dockerfile |
| Change configuration | Environments, variables, config patches, domains, networking |
| Check health or debug failures | Status, logs, metrics, build/runtime triage, recovery |
| Analyze a database | Database introspection and performance analysis |
| Request from API or docs | Railway GraphQL API queries/mutations, metrics, official docs |

## Execution Rules

1. Prefer Railway CLI. Fall back to API scripts for operations the CLI doesn't expose.
2. Use `--json` output where available for reliable parsing.
3. Resolve context before mutation. Know which project, environment, and service you're acting on.
4. For destructive actions (delete service, remove deployment, drop database), confirm intent before executing.
5. After mutations, verify the result with a read-back command.

## User-Only Commands (NEVER execute directly)

These modify database state and require the user to run them in their terminal:

| Command | Why user-only |
|---------|---------------|
| `python3 scripts/enable-pg-stats.py --service <name>` | Modifies shared_preload_libraries, may restart |
| `python3 scripts/pg-extensions.py --service <name> install <ext>` | Installs database extension |
| `ALTER SYSTEM SET ...` | Changes PostgreSQL configuration |
| `CREATE/DROP EXTENSION ...` | Modifies database extensions |

Show the command, explain side effects, and wait for user confirmation.

## Setup Decision Flow

When the user wants to create or deploy something:

1. Run `railway status --json` in the current directory.
2. **If linked**: add a service to the existing project. Do not create a new project unless explicitly requested.
3. **If not linked**: check parent directory.
   - **Parent linked**: monorepo sub-app. Add a service and set `rootDirectory`.
   - **Parent not linked**: check for matching project name, or create new project.
4. When multiple workspaces exist, match by name from `railway whoami --json`.

## Response Format

1. What was done (action and scope).
2. The result (IDs, status, key output).
3. What to do next (or confirmation that the task is complete).

## Keywords

Railway, deploy, infrastructure, services, databases, environments, variables, domains, logs, metrics, buckets, object storage, S3, monorepo, Dockerfile, build failures
