---
title: Registering Repositories
description: Register a GitHub or custom Git repository with its branches,
  retention window, visibility and sync interval, supply tokens for private
  repositories, and split a monorepo into path groups.
type: Guide
timestamp: 2026-10-14T02:19:13.383Z
---
# Registering Repositories

<!-- context:section id="goal" -->
A repository becomes searchable once it is registered: Source Graph then mirrors its monitored branches, keeps a window of eligible commits and indexes each branch head. Registration needs an administrator — signed in on the website — or the instance's service token.

On the website, open **Repositories** and choose **Register a repository**. Over HTTP, send the same fields to `POST /sourcegraph/api/admin/v1/repos`, optionally with an `Idempotency-Key` header so retries do not register twice:

```json
{
  "name": "context4ai/context",
  "code_provider": "github",
  "public_read": true,
  "index_mode": "full",
  "policy": { "default_branch": true, "count": 20 },
  "sync_interval_minutes": 5
}
```

The request returns `202 Accepted` and queues the first sync; the repository page's jobs tab shows progress.
<!-- /context:section -->

<!-- context:section id="fields" -->
## Registration fields

| Field | Meaning |
| --- | --- |
| `name` | The repository's path on its code source, such as `owner/repository` (nested `a/b/c` paths are allowed, up to 512 characters). The Git remote is `<code source host>/<name>.git` |
| `code_provider` | The code source: `github` (default) or `git` for the custom Git host. It is fixed at registration and decides both the host and which tokens are tried |
| `public_read` | Whether anonymous visitors may read it. Omitted means public |
| `index_mode` | `full` (default) indexes the whole repository; `monorepo` indexes only path groups |
| `path_groups` | Required for `monorepo`; see below |
| `policy.branches` | Exact branch names to monitor |
| `policy.default_branch` | Also follow the remote's default branch, discovered on each sync |
| `policy.days` or `policy.count` | The retention window — exactly one of days (1–365) or first-parent commits per branch (1–4096). Omit both to use the site's repository defaults (initially 30 days) |
| `sync_interval_minutes` | 1, 3, 5, 10, 30, 60, 180, 360, 720 or 1440; default 5 |

A policy monitors one to eight branches in total, counting the default branch. Tags are never fetched, so they cannot be searched or read.

## Code sources

Every instance offers exactly two code sources, always listed in this order:

| Source | `code_provider` | Host | Without a token |
| --- | --- | --- | --- |
| GitHub | `github` | `https://github.com` | Public repositories can be fetched anonymously |
| Custom Git | `git` | None until an administrator or the startup file sets one | A token is required |

To use your own Git server, set the custom source's host under **Settings › Access settings** or in the startup file; see [Configuration](../../product/reference/source-graph/configuration.md#code-sources). A source without a host cannot be used for registration (`409 CODE_SOURCE_NOT_CONFIGURED`).

Registration records the source's current host on the repository as `code_host`, and every later fetch uses that host. Changing a code source's configuration therefore never moves a repository that is already registered.
<!-- /context:section -->

<!-- context:section id="private" -->
## Tokens for private repositories

Public GitHub repositories need no token. For private ones, store a token for the repository's code source in one of two places:

- **Your own token** — signed-in users save a GitHub or custom Git token for their account. Repositories they register use it first.
- **The global token** — administrators save a site-wide token for each source under **Settings › Access settings**. Each card names the host it connects to. It is the fallback for every repository of that source.

For each fetch the service follows the repository's `code_provider`:

1. the creator's own token for that source;
2. the global token for that source;
3. the environment token — `SOURCEGRAPH_GIT_TOKEN` for GitHub, `SOURCEGRAPH_CUSTOM_GIT_TOKEN` for the custom source — used only while no global token of that source has been saved;
4. for GitHub only, anonymous access. GitHub rejects a revoked token even for a public repository, so anonymous access is tried last rather than skipped.

The two sources never use each other's tokens. Tokens are encrypted with the instance's credential key and shown as ready, expiring (within seven days), expired or invalid. The bundled Git credential helper hands the chosen token only to the host of the repository being fetched, with the source's Git username (`oauth2` by default).

Registering a private repository does not hide it from signed-in users; `public_read: false` only removes it from anonymous access. Use sign-in and registration policy to control who is a signed-in user, as described in [Authentication and Access Control](authentication-and-access-control.md).
<!-- /context:section -->

<!-- context:section id="monorepo" -->
## Monorepo path groups

A very large repository can be registered with `index_mode: "monorepo"` and one or more **path groups**, so that only the directories you need are fetched and indexed:

```json
{
  "name": "acme/platform",
  "index_mode": "monorepo",
  "path_groups": [
    { "name": "web", "paths": ["apps/web", "packages/ui"] },
    { "name": "api", "paths": ["services/api"] }
  ],
  "policy": { "branches": ["main"], "count": 50 }
}
```

The rules:

- 1 to 16 groups and at most 64 directories in total. Group names use letters, digits, `_` and `-`, up to 64 characters; an empty name becomes `default`.
- Paths are relative directories without wildcards, traversal or `.git`. A directory inside another one in the same group is merged; overlapping directories in different groups are rejected.
- Each group has its own partial Git mirror fetched with blob filtering, so the Git server must support partial clone (`PARTIAL_CLONE_UNSUPPORTED` otherwise).
- Searches, reads, listings and diffs only see registered paths (`PATH_NOT_REGISTERED` otherwise), and a read needs its group prepared at that commit (`CONTENT_NOT_READY`).
- A commit counts as ready for the repository only when every group is indexed at that same commit.
<!-- /context:section -->

<!-- context:section id="after" -->
## After registration

Once registered, a repository runs on its own:

1. The first sync fetches the monitored branches, records each head and builds the eligible versions from the retention window.
2. Each branch head that is not yet indexed is queued for indexing; a head that fails three times is not retried until the next change.
3. A scanner checks every minute and queues the next sync when the interval has elapsed.

To search an older commit inside the window, ask for it to be prepared — from the repository page, with `POST /sourcegraph/api/admin/v1/repo/prepare`, or with the MCP `prepare` tool for authorized callers. Preparation is asynchronous; accepted does not mean ready.

Editing a repository's branches or retention window clears its observed heads and versions, cancels queued and running work and waits for a fresh sync. Disabling and deleting keep the data; a deleted, disabled repository can be purged permanently after one minute. [Operations](operations.md) covers cleanup and maintenance.

An instance started with `SOURCEGRAPH_SEED_DEMO=true` registers the two public example repositories, `context4ai/context` and `context4ai/sourcegraph`, following their default branch with one retained commit and an hourly sync.
<!-- /context:section -->
