# GitLab Operations

Use `glab` and git. Verify installed commands with `--help`; GitLab features and security APIs vary by server version and subscription. Prefer non-interactive API reads to the interactive `glab ci view` terminal UI.

Examples assume verified HOST, numeric PROJECT_ID for the target project, MR_IID (project-local MR number), SOURCE_BRANCH, TARGET_BRANCH, PIPELINE_ID, PIPELINE_PROJECT_ID, JOB_ID, and JOB_PROJECT_ID. Source jobs can belong to a fork or downstream project, not PROJECT_ID. Never mix a global MR ID with an IID.

## Discover and Publish

```bash
glab auth status
glab api --hostname "$HOST" "projects/$PROJECT_ID"
glab api --hostname "$HOST" --method GET --paginate "projects/$PROJECT_ID/merge_requests" -f state=opened -f source_branch="$SOURCE_BRANCH"
glab api --hostname "$HOST" "projects/$PROJECT_ID/merge_requests/$MR_IID"
```

Read default_branch from project metadata. Inspect MR source_project_id, target_project_id, source_branch, target_branch, sha/diff_refs, draft state, head_pipeline, detailed_merge_status, and discussion/approval requirements. Filter candidate MRs by source project as well as branch. A status still being calculated is not confirmed mergeability.

Inspect `.gitlab-ci.yml`, referenced includes/child pipelines, `.gitlab/merge_request_templates/`, CODEOWNERS, review integrations, and enabled security jobs. Protected branch and approval rules may require additional API access; disclose gaps.

Push to the verified source remote first. Use `glab mr create` with explicit `--source-branch`, `--target-branch`, title, and description following the template. Check `glab mr create --help` for the installed version's fork/target-project options; do not assume that a repo selector changes fork semantics. Reuse matching MRs and preserve draft state and user-authored descriptions.

## Pipelines and Jobs

```bash
glab api --hostname "$HOST" --paginate "projects/$PROJECT_ID/merge_requests/$MR_IID/pipelines"
glab api --hostname "$HOST" "projects/$PIPELINE_PROJECT_ID/pipelines/$PIPELINE_ID"
glab api --hostname "$HOST" --paginate "projects/$PIPELINE_PROJECT_ID/pipelines/$PIPELINE_ID/jobs?include_retried=true"
glab api --hostname "$HOST" --paginate "projects/$PIPELINE_PROJECT_ID/pipelines/$PIPELINE_ID/bridges"
```

For job logs, request `projects/$JOB_PROJECT_ID/jobs/$JOB_ID/trace` with `glab api` only through protected capture outside the repository, with restrictive file permissions and without echoing raw output into the conversation. Sanitize captured traces before emitting minimal relevant excerpts. If safe capture/sanitization is unavailable, use safe metadata and report the diagnostic limitation. The jobs query includes retry history; distinguish superseded attempts from current results while retaining evidence of flakes.

Use the MR's current pipeline association, not simply the latest branch pipeline. Include relevant branch pipelines, merged-results pipelines, and merge trains if present. Synthetic merge SHAs can differ from source sha; verify their MR association and freshness. Follow each bridge's downstream_pipeline project/id and inspect its jobs/bridges recursively, deduplicating visited pipelines.

A green parent does not prove downstream success. Evaluate allow_failure jobs, retried attempts, manual jobs, skipped jobs, and external status checks separately. Do not play manual production/deployment jobs to clear a gate. Read approval state and unresolved discussions independently from pipeline success.

For a diagnosed, safe transient failure, the narrow retry is:

```bash
glab api --hostname "$HOST" --method POST "projects/$JOB_PROJECT_ID/jobs/$JOB_ID/retry"
```

Record the returned job ID and follow the new attempt. Retry an entire pipeline only when needed and safe, using the documented endpoint or installed `glab ci retry` interface. Do not repeatedly launch duplicate pipelines while the current one is still running.

## Reviews and Discussions

```bash
glab api --hostname "$HOST" --paginate "projects/$PROJECT_ID/merge_requests/$MR_IID/notes"
glab api --hostname "$HOST" --paginate "projects/$PROJECT_ID/merge_requests/$MR_IID/discussions"
```

Read bot summaries and every discussion note, including resolvable/resolved state, authors, IDs, positions, and diff/head associations. Check MR approvals using the server-supported approval APIs when applicable. Automated findings can also arrive as Code Quality reports, pipeline annotations, or security reports rather than bot comments.

Validate fixes before replying or resolving threads. Use the installed server's documented discussion-update endpoint only after confirming the correct discussion ID and permission/conventions. A resolved thread or old approval is not evidence that a reviewer evaluated the latest push.

## Security

Inspect enabled SAST, dependency scanning, secret detection, container scanning, and other security jobs. Read accessible MR security results and current pipeline report artifacts; compare with the target baseline to identify introduced findings. A successful scanner job means the scanner ran, not necessarily that it found no vulnerabilities.

Use documented APIs for the installed server/version or authenticated UI when API access is unavailable. Do not guess a universal vulnerabilities endpoint: security-report and vulnerability features depend on version, tier, and permissions. Report exactly which surfaces were checked, disabled, or not verified.

Inspect only needed artifacts, avoid executing downloaded content, and redact secrets/sensitive snippets before tool output or comments. Secret-detection reports can contain exposed values. Use a protected local processing path with safe-field projection rather than displaying raw reports. Never turn on HTTP debug output around credentials or security responses.

Report pre-existing findings separately; do not dismiss vulnerabilities or change project security policies to make an MR look healthy.

## Sources

- [Authenticated API](https://docs.gitlab.com/cli/api/)
- [MR commands](https://docs.gitlab.com/cli/mr/)
- [Merge requests API](https://docs.gitlab.com/api/merge_requests/)
- [Pipelines API](https://docs.gitlab.com/api/pipelines/)
- [Jobs API](https://docs.gitlab.com/api/jobs/)
- [Discussions API](https://docs.gitlab.com/api/discussions/)
- [Application security](https://docs.gitlab.com/user/application_security/)
