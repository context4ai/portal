---
title: Registering Repositories
description: Register a repository with its branches, retention window,
  visibility and sync interval, connect private repositories with credentials,
  and split a monorepo into path groups.
type: Guide
timestamp: 2026-10-12T17:40:29.856Z
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
| `name` | The repository key, `owner/repository` (nested `a/b/c` paths are allowed, up to 512 characters). The Git remote is `<code host>/<name>.git` |
| `code_provider` | `github` (default) or `git`; selects which stored credential kind is used |
| `public_read` | Whether anonymous visitors may read it. Omitted means public |
| `index_mode` | `full` (default) indexes the whole repository; `monorepo` indexes only path groups |
| `path_groups` | Required for `monorepo`; see below |
| `policy.branches` | Exact branch names to monitor |
| `policy.default_branch` | Also follow the remote's default branch, discovered on each sync |
| `policy.days` or `policy.count` | The retention window — exactly one of days (1–365) or first-parent commits per branch (1–4096). Omit both to use the site's repository defaults (initially 30 days) |
| `sync_interval_minutes` | 1, 3, 5, 10, 30, 60, 180, 360, 720 or 1440; default 5 |

A policy monitors one to eight branches in total, counting the default branch. Tags are never fetched, so they cannot be searched or read. The code host is part of the build's deployment defaults (`https://github.com` in the published image); see [Configuration](../../product/reference/source-graph/configuration.md).
<!-- /context:section -->

<!-- context:section id="private" -->
## Private repositories

Public GitHub repositories need no credential. For private ones, store a Git access token in one of two places:

- **Your own credential** — signed-in users can save a token for their account. Repositories they register use it first.
- **The global credential** — administrators can save a site-wide token in settings. It is the fallback for every repository.

Each credential is stored per kind (`github` or `git`), encrypted with the instance's credential key, and shown as ready, expiring (within seven days), expired or invalid. As an alternative for GitHub, the `SOURCEGRAPH_GIT_TOKEN` environment variable acts as a legacy global credential: the bundled Git credential helper supplies it only for HTTPS requests to `github.com`.

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
