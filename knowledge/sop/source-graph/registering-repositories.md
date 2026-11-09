---
title: Registering and Managing Repositories
description: Register a GitHub or custom Git repository with its branches,
  retention window, visibility and sync interval, supply tokens for private
  repositories, and split a monorepo into path groups.
type: Guide
timestamp: 2026-11-09T00:57:46.373Z
---
# Registering and Managing Repositories

<!-- context:section id="goal" -->

A repository becomes searchable once it is registered: Source Graph then synchronizes snapshots of its monitored branch heads, keeps the snapshots its retention policy allows and indexes each branch head. Registration needs an administrator — signed in on the website — or the instance's service token. When an administrator turns on **Let signed-in users register repositories**, any signed-in user can register one too and becomes its manager; see [Repository managers](#repository-managers).

On the website, open **Repositories** and choose **Register a repository**. The list can be filtered by manager and sorted by disk usage. Over HTTP, send the same fields to `POST /sourcegraph/api/admin/v1/repos`, optionally with an `Idempotency-Key` header so retries do not register twice:

```json
{
  "name": "context4ai/context",
  "code_provider": "github",
  "public_read": true,
  "index_mode": "full",
  "policy": { "default_branch": true, "count": 20 },
  "sync_interval_minutes": 180
}
```

The request returns `202 Accepted` and queues the first sync; the repository page's jobs tab shows progress. If the name is already registered, the request returns `409 REPOSITORY_EXISTS` and the website shows who registered it, so you can ask them to add you as a manager.

## Repository managers

Administrators manage every repository. A repository registered by a signed-in user lists that user as its only manager; repositories registered before managers existed treat their creator as manager until the list is first edited. Managers can change the repository's settings, preview, prepare and add indexes, clean up, cancel jobs, delete and purge it, and add or remove managers, including themselves, up to 50. Add a manager on the repository page by searching for a signed-in user by name or email.

<!-- /context:section -->

<!-- context:section id="fields" -->

## Registration fields

| Field | Meaning |
| --- | --- |
| `name` | The repository's path on its code source, such as `owner/repository` (nested `a/b/c` paths are allowed, up to 512 characters). The Git remote is `<code source host>/<name>.git` |
| `code_provider` | The code source: `github` (default) or `git` for the custom Git host. It is fixed at registration and decides both the host and which tokens are tried |
| `public_read` | **Public repository**. `true` (the default) makes it public; `false` makes it private, visible only to its creator, its managers and administrators, as described in [Ops: Sign-in and Permissions](authentication-and-access-control.md#public-and-private-repositories) |
| `index_mode` | `full` (default) indexes the whole repository; `monorepo` indexes only path groups |
| `path_groups` | Required for `monorepo`; see below |
| `policy.branches` | Exact branch names to monitor |
| `policy.default_branch` | Also follow the remote's default branch, discovered on each sync |
| `policy.days` or `policy.count` | Retention for ordinary snapshots — exactly one of days since first observation (1–365) or the number of most recently observed snapshots to keep (1–4096). Omit both to use the site's repository defaults (initially 30 days) |
| `sync_interval_minutes` | 1, 3, 5, 10, 30, 60, 180, 360, 720 or 1440; default 180 for new registrations |
| `git_timeout_minutes` | Git fetch and hydration timeout: 0 or omitted inherits the site default (initially 15 minutes); 15, 30, 45 or 60 override it |

A policy monitors one to eight branches in total, counting the default branch. Tags are never fetched, so they cannot be searched or read. After registration, repository settings also hold **Pinned snapshots** (`pinned_commits`) and the **Storage budget** (`max_storage_bytes`), described in [Snapshots and storage](#snapshots-and-storage).

<!-- /context:section -->

<!-- context:section id="code-sources" -->

## Code sources

Every instance offers exactly two code sources, always listed in this order:

| Source | `code_provider` | Host | Without a token |
| --- | --- | --- | --- |
| GitHub | `github` | `https://github.com` | Public repositories can be fetched anonymously |
| Custom Git | `git` | None until an administrator or the startup file sets one | A token is required |

To use your own Git server, set the custom source's host on its card under **System settings › Code sources** or in the startup file; see [Configuration](../../product/reference/source-graph/configuration.md#code-sources). A source without a host cannot be used for registration (`409 CODE_SOURCE_NOT_CONFIGURED`).

Registration records the source's current host on the repository as `code_host`, and every later fetch uses that host. Changing a code source's configuration therefore never moves a repository that is already registered.

<!-- /context:section -->

<!-- context:section id="private" -->

## Tokens for private repositories

Public GitHub repositories need no token. For private ones, store a token for the repository's code source in one of two places:

- **Your own token** — signed-in users save a GitHub or custom Git token under **User settings › Code source tokens**, one per code source. Repositories they register use it first.
- **The global token** — administrators save a site-wide token under **System settings › Code sources**, which shows one card per code source naming the host it fetches from. The custom Git card also holds the source's name, host and HTTPS username; the GitHub card holds only the token. Each token can carry an optional expiry, used to warn seven days ahead. It is the fallback for every repository of that source.

For each fetch the service follows the repository's `code_provider`:

1. the creator's own token for that source;
2. the global token for that source;
3. the environment token — `SOURCEGRAPH_GITHUB_TOKEN` for GitHub (the earlier `SOURCEGRAPH_GIT_TOKEN` is still read while it is unset), `SOURCEGRAPH_CUSTOM_GIT_TOKEN` for the custom source — used only while no global token of that source has been saved;
4. for GitHub only, anonymous access. GitHub rejects a revoked token even for a public repository, so anonymous access is tried last rather than skipped.

The two sources never use each other's tokens. Because a user-registered repository is fetched with the site-wide token when its creator has none, letting signed-in users register repositories lets them register anything that token can read. A failed fetch names its cause — `GIT_REPOSITORY_UNAVAILABLE` for a missing repository or one the token cannot see, `GIT_ACCESS_DENIED`, `GIT_AUTH_FAILED`, `GIT_CREDENTIAL_UNAVAILABLE` or `GIT_FETCH_FAILED` — and the repository page links to the creator's code-source token settings.

Tokens are encrypted with the instance's credential key, kept in the database, and shown as ready, expiring (within seven days), expired, invalid or unreadable. An unreadable token cannot be repaired by editing its metadata: enter a replacement or clear it. The bundled Git credential helper hands the chosen token only to the host of the repository being fetched, with the source's HTTPS username (`oauth2` by default).

A code-source token only lets the service fetch the code. Who can read a registered repository on Source Graph is decided separately by its **Public repository** setting: clear it to make the repository private, so that only its creator, its managers and administrators can see it.

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

1. Each sync fetches depth-one snapshots of the monitored branch heads, without their parent history, and records each head. Later syncs reuse existing Git objects and add newly observed heads; commits pushed between two syncs are not indexed automatically.
2. Each branch head that is not yet indexed is queued for indexing; a head that fails three times is not retried until the next change.
3. A scanner checks every minute and queues the next sync when the interval has elapsed.

Any other commit — an older snapshot, a commit that was never a synchronized head, the tip of an unmonitored branch or a tag — is prepared by its full 40-character SHA: from the repository page with **Create index**, with `POST /sourcegraph/api/admin/v1/repo/prepare`, or with the MCP `prepare` tool for authorized callers. For a branch or tag name, find its commit first with `refs` or `resolve`, as described in [HTTP and MCP](../../product/reference/source-graph/http-and-mcp.md#query-routes). A SHA that has not been synchronized is fetched directly from the code source, without deepening the history; the server must allow fetching that SHA, and a refused request fails rather than using another commit. The prepared commit is kept as an ordinary snapshot, not a pinned one; see [Snapshots and storage](#snapshots-and-storage). Preparation is asynchronous; accepted does not mean ready. Manual requests are paced per repository, as described in [Ops: Day-to-Day Operations](operations.md#rate-limits).

Editing a repository's branches or retention cancels its queued and running work; the edited retention applies at the next successful sync, preparation or index task, and pinned snapshots and branch heads stay available. Changing path groups additionally clears the observed heads and versions and waits for a fresh sync. Disabling and deleting keep the data; a deleted, disabled repository can be purged permanently after one minute. [Ops: Day-to-Day Operations](operations.md) covers cleanup and maintenance.

An instance started with `SOURCEGRAPH_SEED_DEMO=true` registers the two public example repositories, `context4ai/context` and `context4ai/sourcegraph`, following their default branch with one retained commit and an hourly sync.

<!-- /context:section -->

<!-- context:section id="snapshots" -->

## Snapshots and storage

Synchronization records depth-one snapshots of the monitored branch heads; every other commit enters the repository only when it is prepared by full SHA, as described in [After registration](#after-registration). Commit choices on the website show up to 20 observed snapshots, not the full Git history.

Each path group's snapshots are either protected or ordinary:

- **Protected** — the current branch heads, the **Pinned snapshots** in repository settings and the commits of queued or running jobs. Retention and capacity limits never release them.
- **Ordinary** — every other snapshot, including commits prepared by SHA. They are kept by days since first observation or by the configured number of most recently observed snapshots. Retention is applied after each successful sync and again as soon as a preparation or index task publishes its index.

Pins are added only in repository settings, by the repository's managers or an administrator, one full SHA per line and up to 4096; preparing a commit never pins it. Adding a pin alone does not fetch or index an absent snapshot, so prepare the SHA first. Removing a SHA releases its pin and returns the snapshot to ordinary retention.

Each repository also has a **Storage budget**, 100 GiB by default and configurable from 1 GiB to 10 TiB, covering its Git objects, index shards and active preparation files. When a path group reaches 4096 snapshots, or the repository reaches its storage budget, the oldest unprotected snapshots (by first observation) and their indexes are released, in batches of at most 64, instead of refusing work. A released version answers `REVISION_NOT_ELIGIBLE` and can be prepared again by its SHA. Releases happen only at safe points between steps, so the budget is a protective limit rather than an exact quota: a running index build is stopped only above 120% of the budget, and Git compaction needs temporary space while it reclaims objects. [Ops: Day-to-Day Operations](operations.md#disk-and-storage) describes the safe points and collection in detail.

A limit becomes an error only when protected snapshots alone fill it:

| Code | Meaning | What to do |
| --- | --- | --- |
| `REPOSITORY_STORAGE_LIMIT` | Protected snapshots fill the storage budget, or a running build passed 120% of it | Remove pins you do not need, or raise the budget |
| `SNAPSHOT_LIMIT` | Protected snapshots fill a path group's 4096 versions | Remove pins you do not need |

`INSUFFICIENT_STORAGE` is different: the instance's free disk space is below its reserve, whatever the repository's budget; see [Ops: Day-to-Day Operations](operations.md#disk-and-storage).

<!-- /context:section -->
