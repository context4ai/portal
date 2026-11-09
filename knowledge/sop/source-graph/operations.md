---
title: "Ops: Day-to-Day Operations"
description: Run a Source Graph instance day to day — health checks, background
  jobs, data retention, rate limits, disk and storage, repository maintenance,
  and what common errors mean.
type: Guide
timestamp: 2026-11-09T02:42:52.164Z
---
# Ops: Day-to-Day Operations

<!-- context:section id="goal" -->
A Source Graph instance mostly runs itself: background workers synchronize repositories, index new branch heads and remove retired indexes. Operating it means watching health and jobs, keeping enough disk, reclaiming space when needed and knowing what an error code is telling you. Administrators do most of this from the website's **Operations**, **Repositories** and **Settings** pages; the same actions exist under `/sourcegraph/api/admin/`.
<!-- /context:section -->

<!-- context:section id="health" -->

## Health and status

| Check | Use |
| --- | --- |
| `GET /sourcegraph/healthz` | Liveness — returns `{"status":"alive"}`; suitable for platform health checks |
| `GET /sourcegraph/readyz` | Readiness — succeeds only when the repository catalog can be read; `503` otherwise |
| `GET /sourcegraph/access-policy` | Whether public reading and sign-in are enabled |
| **Operations** page | Service status, request counts, mean and maximum time and error rate for search, read and `read_many`, active jobs, and per-instance heartbeats |

The **Query errors** page in settings keeps the most recent 1,000 failed queries with their request details; administrators can inspect or clear it. One entry represents one request. A `read_many` request also records batch counters — total items, succeeded, failed and returned content items — so a partly failed batch shows how much was still read: an empty file counts as a success, and an item that returned part of a file together with an error counts as failed with content. Older entries without counters are shown as unknown.

<!-- /context:section -->

<!-- context:section id="jobs" -->

## Background jobs

Every repository has its own job list, shown on the repository page's jobs tab.

- **Kinds:** `sync` fetches monitored branches, `index` builds an index for one commit, and `prepare` synchronizes and indexes a requested commit, across all path groups if needed.
- **States:** `queued`, `running`, `succeeded`, `failed` or `cancelled`.
- **Automatic and manual work** run on separate workers, so a long manual preparation does not block scheduled syncs.
- **Recovery:** a running job holds a 45-second lease that its worker renews. If a process dies, another worker takes the job over after the lease expires; after three attempts it fails with `RECOVERY_EXHAUSTED`. Persisted jobs resume after a restart.
- **Budgets:** a sync or index job may run for 45 minutes, or for the repository's Git timeout if that is longer (at most 60 minutes); a prepare job up to 16 times that, one path group after another.
- **Capacity:** up to 8 active jobs per repository (or one per path group when a monorepo has more than 8 groups), and at most 256 recorded jobs. A full queue returns `QUEUE_FULL`.
- **Storage upkeep:** jobs keep the repository within its storage budget themselves. A sync checks the budget before its Git fetch, a prepare job before fetching a SHA and an index job before it builds, releasing the oldest unprotected snapshots when needed. Preparation and index tasks first finish any Git collection still pending for the repository, and apply retention as soon as they publish. See [Disk and storage](#disk-and-storage).

Besides jobs, two background passes run every minute: an index collection round and a separate Git collection pass, both described in [Disk and storage](#disk-and-storage). Neither appears in the job list.

You can cancel a queued or running job from the jobs tab. Failed jobs also leave a short failure summary — task ID, kind, path group, commit, error code, attempts, completion time and duration, without raw error output or credentials — that outlives the job record (see below). It is history for diagnosis, not a sign of current readiness, and it does not use queue capacity or affect scheduling. Each completed job is also written to the service log as a structured `repository_task_completed` event with its repository, task, state and error code; unchanged automatic syncs that succeed are left out. Finished jobs are pruned automatically (see below); **Clear completed tasks** in settings removes finished records across all repositories immediately, keeping queued and running work, repositories and indexes; clearing failure history removes failure summaries with the same cutoff.

<!-- /context:section -->

<!-- context:section id="retention" -->

## What is kept, and for how long

| Data | Retention |
| --- | --- |
| Snapshots | Current branch heads, pinned snapshots and commits of queued or running jobs are protected and always kept. Other snapshots follow the repository's retention — days since first observation or the number of most recently observed snapshots — applied after each successful sync and right after each preparation or index task publishes. When a path group reaches 4096 snapshots or the repository reaches its storage budget, the oldest unprotected snapshots are released first (see [Disk and storage](#disk-and-storage)) |
| Search indexes | One per indexed commit; generations no retained snapshot references are removed when snapshots are released and by the background collection round |
| Git objects | Objects not reachable from any retained snapshot are removed by Git collection once snapshots are released; retained snapshots keep their complete trees and available files. Without synchronization, preparation or indexing nothing expires automatically |
| Branch and tag catalogs | Kept in service memory and refreshed in the background once older than 5 minutes (or three times the last refresh duration); exact lookups are cached for 30 seconds. Downloaded ref objects are deleted right after parsing |
| Finished jobs | 24 hours, or longer while a request receipt still refers to them. Automatic jobs keep at most 32 recent entries, and automatic syncs that found no changes are dropped right away |
| Job failure summaries | 7 days, at most 128 per repository; the oldest are dropped first |
| Request receipts (idempotency) | 24 hours, at most 256 per repository |
| Query error log | The most recent 1,000 entries |
| Usage observations behind the statistics | 30 days |
| Browser sessions | 90 days |

Identities, settings, pins, retention settings and stored credentials are never expired automatically; back them up as described in [Ops: Self-Hosting Source Graph](self-hosting.md).

<!-- /context:section -->

<!-- context:section id="limits" -->

## Rate limits

Two kinds of traffic are rate-limited in one-minute windows:

| Traffic | Limit |
| --- | --- |
| Anonymous requests | 1,200 per client and 3,000 in total per minute |
| MCP `prepare` with a personal API key | 10 per key and 60 in total per minute |

An anonymous client is identified by its connection address; forwarded-for headers are not trusted. Behind a reverse proxy every anonymous request therefore arrives from the proxy's address and shares one per-client allowance. When a limit is reached the response is `429 RATE_LIMITED` with `Retry-After: 60`. Signed-in sessions, other personal-key traffic and the service token are not rate-limited, so give heavy automated callers their own credential rather than relying on anonymous access. Per-request bounds — page sizes, line and byte limits — still apply to everyone; see [HTTP and MCP](../../product/reference/source-graph/http-and-mcp.md).

Manual preparation is also paced per repository, whoever asks and through whichever surface — the website, HTTP or MCP. A request identical to a queued or running job (same path group, kind and revision) simply returns that job and adds no load. Any other new manual request within 30 seconds of the repository's last accepted one returns `429 RATE_LIMITED` with `Retry-After` set to the remaining seconds. One request that queues every monorepo group counts once, and scheduled syncs and indexing are not paced.

<!-- /context:section -->

<!-- context:section id="disk" -->

## Disk and storage

Fetching, indexing and ref downloads stop with `INSUFFICIENT_STORAGE` when the instance's free space falls below `SOURCEGRAPH_MIN_FREE_BYTES` (1 GiB by default). This floor protects the whole instance and is separate from any repository's budget. Reads and searches of existing indexes keep working. Keep extra free space for replacement packs, index builds, Git compaction and ref downloads.

**Repository storage budget.** Each repository has its own **Storage budget** (100 GiB by default, 1 GiB to 10 TiB) covering its Git objects, index shards and active preparation files. When usage reaches it, or a path group reaches 4096 snapshots, the oldest unprotected snapshots — by first observation — and their indexes are released instead of refusing work. Branch heads, pinned snapshots and commits of queued or running jobs are never released. Releases happen only at safe points inside the repository's own jobs:

- before the Git fetch of a sync or of a SHA preparation;
- before an index build starts, reserving 1.2 times the size of the path group's previous index;
- after a preparation or index task finishes.

The service first removes expired indexes, then releases at most 64 snapshots per batch in one update while holding the query lock, so reads of those versions finish first. Indexes that nothing references are removed, Git keeps only the retained snapshots and repacks reachable objects after checking free space, and usage is measured again; further batches follow until the reservation fits or nothing unprotected remains. Each batch is logged as `snapshot_eviction`. Released versions answer `REVISION_NOT_ELIGIBLE` and can be prepared again. A running build releases nothing, because its files are in use, and is stopped with `REPOSITORY_STORAGE_LIMIT` only above 120% of the budget; the release after it brings usage back under budget. Git compaction needs temporary working space and may briefly exceed the budget while it reclaims objects. When protected snapshots alone fill the budget or the 4096 versions, work stops with `REPOSITORY_STORAGE_LIMIT` or `SNAPSHOT_LIMIT`; remove pins you do not need or raise the budget.

**Index collection.** Index generations that no retained snapshot references are collected once their manifest is more than five minutes old: right after retention or a capacity release, and in a background round every minute that works repository by repository within a 30-second budget, deferring a repository with a running job to the next round. The **Operations** page shows pending expired indexes, deferred repositories, the last reclaim and the last problem; the same figures are in `index_collection` of `GET /sourcegraph/api/admin/v1/statistics`. The repository list can be sorted by disk usage to find the largest repositories.

**Git collection.** The control data decides which snapshots exist, and Git collection follows it. Each path group's Git store keeps a retention marker naming the snapshots it was last collected for. Before any change that releases versions commits — retention after a sync, preparation or index task, a capacity release or the 4096 limit — the marker of each affected path group is removed; if that fails, nothing is committed and the request returns `RECLAIM_FAILED`. A missing marker, or one naming a released commit, therefore means collection is unfinished, and only a successful collection writes it again. A separate background pass every minute, one pass at a time, finishes collection for such repositories using each repository's Git timeout rather than the index round's 30-second budget; a repository that is busy waits for the next pass. When a repository's files cannot be inspected, the pass logs `git_reclaim_check` with the repository, path group and a reason such as `permission_denied`, and checks it again next time. Preparation and index tasks also finish pending collection before they start, so an interrupted process or a failing later sync does not keep released space.

**Ref discovery.** Branch and tag catalogs (`refs`) and exact lookups of unmonitored names (`resolve`) download only commit and tag objects, without file trees, into scratch directories under `refcache/tmp` in the data directory. Each directory is removed after parsing, and any left by a stopped process are removed at startup. Every download is checked each second against its own limit — 256 MiB for a catalog refresh, 16 MiB for a lookup — a 4 GiB total for all ref downloads together and the instance free-space reserve, and is stopped and deleted when any is exceeded; a catalog over its limit is served with names only. At most 4 catalog refreshes run per instance; lookups run at most 2 per repository and 8 per instance, with at most 64 running or waiting, and a repository whose remote fails is backed off from 10 seconds up to 5 minutes. Catalogs live in service memory; beyond 1,000,000 refs in total the least recently used ones are dropped. A first listing that is not ready in time returns `REFS_CATALOG_PREPARING`, a busy, failing or backed-off remote `REMOTE_UNAVAILABLE`, and a remote the repository's code-source token cannot read `REMOTE_ACCESS_DENIED`; see [Common errors](#common-errors).

**Storage location.** The **Storage** settings page shows where the bare Git mirrors live and lets an administrator move them to another absolute directory on the server; the service keeps them in a `space` folder inside it. Search indexes and their manifests always stay in the data root, so size both locations. Switching deletes the old Git copies and indexes, and every repository synchronizes and indexes again from the chosen location; preparation pauses until the old data has been cleaned up.

<!-- /context:section -->

<!-- context:section id="maintenance" -->

## Repository maintenance

The repository page offers maintenance actions, each with a preview that shows what will be kept and how many bytes will be reclaimed:

- **Create index** — index a recent snapshot of a monitored branch, or any full 40-character SHA. A SHA that has not been synchronized is fetched directly and kept as an ordinary snapshot, released oldest first by retention and capacity like any other; add it to **Pinned snapshots** in settings to keep it. Ready indexes are reused.
- **Clean old indexes** — remove indexes other than the latest one of each monitored branch and the pinned snapshots. When a latest index is not ready yet, it removes only expired indexes and keeps the index of every retained version; the preview then shows `expired_only: true`.
- **Delete** — permanently remove the repository, its Git mirror and its indexes.

Stop running jobs before maintenance; otherwise it returns `REPOSITORY_BUSY`. A repository can also be disabled or soft-deleted from its settings, which keeps its data; a disabled, deleted repository can be purged for good one minute later.

<!-- /context:section -->

<!-- context:section id="errors" -->

## Common errors

| Code | Status | What it means | What to do |
| --- | --- | --- | --- |
| `INDEX_NOT_READY` | 409 | The commit is eligible but not indexed | Wait for the head index, or prepare that commit |
| `CONTENT_NOT_READY`, `SCOPE_NOT_READY` | 409 | A monorepo path group is not prepared or synchronized at that commit | Prepare the commit for that group |
| `REVISION_NOT_ELIGIBLE` | 404 | The commit is not among the repository's retained snapshots: it was never observed or prepared, or retention or capacity released it | Check the repository and full SHA together; to use a specific commit, prepare its full SHA. Never substitute another commit |
| `REPOSITORY_NOT_FOUND` | 404 | The repository is not registered, or it is private and your credential cannot see it | Check the name, or ask its creator, a manager or an administrator for access |
| `BRANCH_NOT_MONITORED` | 404 | The branch is not in the policy | Resolve it to a full SHA with `resolve` and prepare that, or add it to the repository's branches |
| `SHORT_SHA_UNSUPPORTED`, `INVALID_REVISION` | 400 | Abbreviated SHA, `HEAD`, a revision expression or a name with unsupported characters | Pass a full 40-character SHA or a monitored branch; find the commit of a branch or tag with `refs` or `resolve` |
| `DEFAULT_BRANCH_NOT_OBSERVED` | 409 | No sync has recorded the default branch yet | Wait for or request a sync |
| `PATH_NOT_REGISTERED` | 400 | The path is outside the monorepo's path groups | Search registered paths, or add a group |
| `GIT_AUTH_FAILED`, `GIT_ACCESS_DENIED` | 401, 403 | The Git host rejected the token | Update the personal or global token for the repository's code source (GitHub or custom Git) |
| `GIT_REPOSITORY_UNAVAILABLE` | 404 | The repository does not exist, or the token used cannot see it; code hosts answer both the same way | Check the repository name, then the token's access to it. A user-registered repository is fetched with its creator's token first, then the global one |
| `PARTIAL_CLONE_UNSUPPORTED` | 422 | The Git server cannot filter blobs for monorepo mode | Register in full mode, or use a server that supports partial clone |
| `HISTORY_SCAN_LIMIT` | 422 | A fetch would scan more history than allowed | Narrow the retention policy or use a count |
| `REPOSITORY_STORAGE_LIMIT` | 409 | Protected snapshots — branch heads, pins and active jobs — alone fill the repository's storage budget, or a running build passed 120% of it | Remove pins you do not need or raise the budget; older ordinary snapshots are released before the next attempt |
| `SNAPSHOT_LIMIT` | 409 | Protected snapshots fill a path group's 4096 versions | Remove pins you do not need |
| `INSUFFICIENT_STORAGE` | 503 (507 from ref discovery) | The instance's free disk is below `SOURCEGRAPH_MIN_FREE_BYTES`; this is not the repository budget | Free or add disk |
| `RECLAIM_FAILED` | 503 | Releasing snapshots could not be completed safely, or their collection did not finish; collection continues in the background | Retry shortly; if it persists, check the `retention_marker`, `git_reclaim` and `git_reclaim_check` log events |
| `REFS_CATALOG_PREPARING` | 503 | The first branch or tag listing of the repository is still being prepared | Retry after `Retry-After`, or resolve a complete branch or tag name meanwhile |
| `REMOTE_UNAVAILABLE` | 502, 503 | The remote is unavailable, timed out or backed off, or ref downloads are using their whole disk allowance | Retry after `Retry-After` |
| `REMOTE_ACCESS_DENIED` | 502 | The code-source token this repository uses cannot read its remote; the caller's own key is not the cause | A repository manager checks the creator's or global token for the code source |
| `QUEUE_FULL` | 503 | Too many active or recorded jobs | Let jobs finish, cancel some, or clear finished jobs |
| `ENGINE_RESPONSE_TOO_LARGE` | 502 | Even the smallest result page exceeded its budget | Narrow the pattern, globs or paths |
| `RATE_LIMITED` | 429 | A rate limit or the per-repository preparation pacing was reached | Wait for the `Retry-After` seconds, or use a credential |

Git fetches and object hydration stop after the repository's Git timeout: 15 minutes by default, set globally in system settings to 15, 30, 45 or 60 minutes and overridable per repository. A task takes the value current when it starts; changing it does not interrupt running work or remove indexes, and it does not limit total indexing time. The background Git collection pass uses the same per-repository timeout.

<!-- /context:section -->
