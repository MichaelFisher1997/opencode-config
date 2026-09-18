# GitHub Operations

Use `gh` with the verified repository/host, and load the existing github skill when available. The examples assume trusted shell variables REPO (HOST/OWNER/REPO or OWNER/REPO), NUMBER, HEAD_SHA, SOURCE_BRANCH, and TARGET_BRANCH. API paths use OWNER/REPO separately from HOST; use `gh api --hostname "$HOST"` for an explicit host. Verify installed flags with `--help` when needed.

## Discover and Publish

```bash
gh auth status
gh repo view "$REPO" --json nameWithOwner,defaultBranchRef,url
gh pr list --repo "$REPO" --head "$SOURCE_BRANCH" --state open
gh pr view "$NUMBER" --repo "$REPO" --json url,state,isDraft,headRefName,headRefOid,baseRefName,mergeable,mergeStateStatus,reviewDecision,statusCheckRollup
```

Inspect `.github/workflows/`, reusable workflows, `.github` PR templates, CODEOWNERS, bot configuration such as `.coderabbit.yaml`, and active rulesets/branch protection when accessible. Do not infer required checks solely from workflow names. For forks verify the source owner as well as the branch name.

Push with git to the verified source remote first. Create with `gh pr create --repo "$REPO" --base "$TARGET_BRANCH" --head "$SOURCE_BRANCH"` and explicit title/body following the template; a fork may require an owner-qualified head. Do not run creation interactively if the agent cannot answer prompts safely. Read `gh pr edit --help` before updating an existing request.

## Checks and Logs

```bash
gh pr checks "$NUMBER" --repo "$REPO" --json name,state,bucket,workflow,event,link
gh pr checks "$NUMBER" --repo "$REPO" --required
gh run list --repo "$REPO" --branch "$SOURCE_BRANCH" --commit "$HEAD_SHA"
gh run view "$RUN_ID" --repo "$REPO" --json headSha,event,status,conclusion,jobs,url
```

For failed logs, use `gh run view "$RUN_ID" --repo "$REPO" --log-failed` only through protected capture outside the repository, with restrictive file permissions and without echoing raw output into the conversation. Sanitize captured logs before emitting minimal relevant excerpts. If safe capture/sanitization is unavailable, use safe metadata and report the diagnostic limitation rather than dumping logs.

`gh pr checks` exit code 8 means pending. Failure, missing checks, and CLI/API errors need separate handling. The `--required` view complements, not replaces, the full list. An optional bounded `--watch --interval 60` watches checks only, not review comments or security surfaces.

Run-list defaults can truncate results and branch/commit filters can miss fork or test-merge runs. Follow PR check links and retrieve additional pages as needed. Use `gh api --paginate` to inspect `repos/OWNER/REPO/commits/SHA/check-runs` and `repos/OWNER/REPO/commits/SHA/statuses` when the rollup is incomplete; distinguish current results from superseded attempts. Check annotations and external providers using their reported URLs. Verify the PR association for synthetic merge commits.

After diagnosing a safe transient failure, `gh run rerun "$RUN_ID" --repo "$REPO" --failed` retries failed jobs. Check `gh run rerun --help` for a narrower job retry. Do not dispatch arbitrary workflows or rerun deployments without authorization.

## Reviews and Discussions

Use all of these surfaces; `gh pr view --comments` alone misses inline review threads:

| Surface | Operation |
| --- | --- |
| Conversation comments | `gh api --paginate repos/OWNER/REPO/issues/NUMBER/comments` |
| Formal reviews | `gh api --paginate repos/OWNER/REPO/pulls/NUMBER/reviews` |
| Inline review comments | `gh api --paginate repos/OWNER/REPO/pulls/NUMBER/comments` |
| Resolution/outdated state | `gh api graphql` querying the PR's `reviewThreads` |
| Bot check details | Check-run output, annotations, and details URLs |

For GraphQL paginate `reviewThreads` and each thread's comments independently using pageInfo/cursors. Include IDs, isResolved, isOutdated, authors, URLs, bodies, and commit associations where available. Inspect review submission state and commit ID, not just the existence of an old approval. Do not consider an old CodeRabbit/OpenCode summary proof of a review of new changes.

Reply with evidence when a finding needs clarification. Before any thread-resolution mutation, confirm its stable ID, that the issue is actually fixed, and repository permission/conventions. Avoid unnecessary bot-trigger comments.

## Security

Inspect relevant security check runs and annotations first, including CodeQL, dependency review, and third-party scanners. Then query accessible repository alert surfaces, with pagination:

| Surface | REST path |
| --- | --- |
| Code scanning | `repos/OWNER/REPO/code-scanning/alerts` |
| Dependabot | `repos/OWNER/REPO/dependabot/alerts` |
| Secret scanning | `repos/OWNER/REPO/secret-scanning/alerts` |

Use `gh api --method GET --paginate` with verified endpoint filters. For code scanning inspect the appropriate PR/head ref and instances; default-branch alerts alone do not describe the PR. Dependabot is repository-level evidence, so also inspect the PR's dependency-review check and changed manifests/lockfiles.

Never dump raw secret-scanning responses: they can include secret values. Use CLI-side `--jq` projection limited to safe fields such as alert number, state, secret_type_display_name, and html_url. Do not use verbose/debug HTTP logging for security endpoints. Use safe field projections for other alert responses too and avoid copying sensitive snippets.

Treat forbidden/not-found responses as ambiguous access/availability limitations unless independently confirmed disabled. Do not request broader token scopes or dismiss alerts automatically.

## Sources

- [PR checks](https://cli.github.com/manual/gh_pr_checks)
- [Workflow runs](https://cli.github.com/manual/gh_run)
- [Authenticated API](https://cli.github.com/manual/gh_api)
- [Code scanning API](https://docs.github.com/en/rest/code-scanning)
- [Dependabot API](https://docs.github.com/en/rest/dependabot)
- [Secret scanning API](https://docs.github.com/en/rest/secret-scanning)
