---
title: Operations
description: Run a Source Graph instance day to day — health checks, background
  jobs, data retention, rate limits, disk and storage, repository maintenance,
  and what common errors mean.
type: Guide
timestamp: 2026-10-12T17:42:24.143Z
---
# Operations

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

The **Query errors** page in settings keeps the most recent 1,000 failed queries with their request details; administrators can inspect or clear it.
<!-- /context:section -->

<!-- context:section id="jobs" -->
## Background jobs

Every repository has its own job list, shown on the repository page's jobs tab.

- **Kinds:** `sync` fetches monitored branches, `index` builds an index for one commit, and `prepare` synchronizes and indexes a requested commit, across all path groups if needed.
- **States:** `queued`, `running`, `succeeded`, `failed` or `cancelled`.
- **Automatic and manual work** run on separate workers, so a long manual preparation does not block scheduled syncs.
- **Recovery:** a running job holds a 45-second lease that its worker renews. If a process dies, another worker takes the job over after the lease expires; after three attempts it fails with `RECOVERY_EXHAUSTED`. Persisted jobs resume after a restart.
- **Budgets:** a sync or index job may run for 45 minutes; a prepare job up to 16 times that, one path group after another.
- **Capacity:** up to 8 active jobs per repository (or one per path group when a monorepo has more than 8 groups), and at most 256 recorded jobs. A full queue returns `QUEUE_FULL`.

You can cancel a queued or running job from the jobs tab. Finished jobs are pruned automatically (see below); **Clear completed tasks** in settings removes finished records across all repositories immediately, keeping queued and running work, repositories and indexes.
<!-- /context:section -->

<!-- context:section id="retention" -->
## What is kept, and for how long

| Data | Retention |
| --- | --- |
| Eligible commits | The repository's retention window — days or commit count — recalculated on each sync |
| Search indexes | One per indexed commit; indexes no longer referenced by any retained commit are removed in the background |
| Git mirrors | Kept until the repository is permanently deleted; changing the retention policy does not shrink them |
| Finished jobs | 24 hours, or longer while a request receipt still refers to them. Automatic jobs keep at most 32 recent entries, and automatic syncs that found no changes are dropped right away |
| Request receipts (idempotency) | 24 hours, at most 256 per repository |
| Query error log | The most recent 1,000 entries |
| Usage observations behind the statistics | 30 days |
| Browser sessions | 90 days |

Identities, settings and stored credentials are never expired automatically; back them up as described in [Self-Hosting](self-hosting.md).
<!-- /context:section -->

<!-- context:section id="limits" -->
## Rate limits

Only two kinds of traffic are rate-limited, both in one-minute windows:

| Traffic | Limit |
| --- | --- |
| Anonymous requests | 1,200 per client and 3,000 in total per minute |
| MCP `prepare` with a personal API key | 10 per key and 60 in total per minute |

An anonymous client is identified by its connection address; forwarded-for headers are not trusted. Behind a reverse proxy every anonymous request therefore arrives from the proxy's address and shares one per-client allowance. When a limit is reached the response is `429 RATE_LIMITED` with `Retry-After: 60`. Signed-in sessions, other personal-key traffic and the service token are not rate-limited, so give heavy automated callers their own credential rather than relying on anonymous access. Per-request bounds — page sizes, line and byte limits — still apply to everyone; see [HTTP and MCP](../../product/reference/source-graph/http-and-mcp.md).
<!-- /context:section -->

<!-- context:section id="disk" -->
## Disk and storage

Fetching and indexing stop with `503 INSUFFICIENT_STORAGE` when free space falls below `SOURCEGRAPH_MIN_FREE_BYTES` (1 GiB by default). Reads and searches of existing indexes keep working.

The **Storage** settings page shows where the bare Git mirrors live and lets an administrator move them to another absolute directory on the server; the service keeps them in a `space` folder inside it. Search indexes and their manifests always stay in the data root, so size both locations. Switching deletes the old Git copies and indexes, and every repository synchronizes and indexes again from the new location; preparation pauses until the old data has been cleaned up.
<!-- /context:section -->

<!-- context:section id="maintenance" -->
## Repository maintenance

The repository page offers maintenance actions, each with a preview that shows what will be kept and how many bytes will be reclaimed:

- **Add index** — index a recent commit of a monitored branch, or any full SHA inside the retention window. Ready indexes are reused.
- **Cleanup** — remove every index except the latest one of each monitored branch. It requires those latest heads to be indexed, and every path group aligned on the same head.
- **Delete** — permanently remove the repository, its Git mirror and its indexes.

Stop running jobs before maintenance; otherwise it returns `REPOSITORY_BUSY`. A repository can also be disabled or soft-deleted from its settings, which keeps its data; a disabled, deleted repository can be purged for good one minute later.
<!-- /context:section -->

<!-- context:section id="errors" -->
## Common errors

| Code | Status | What it means | What to do |
| --- | --- | --- | --- |
| `INDEX_NOT_READY` | 409 | The commit is eligible but not indexed | Wait for the head index, or prepare that commit |
| `CONTENT_NOT_READY`, `SCOPE_NOT_READY` | 409 | A monorepo path group is not prepared or synchronized at that commit | Prepare the commit for that group |
| `REVISION_NOT_ELIGIBLE` | 404 | The commit or branch head is outside the retention window | Use a retained commit, or widen the policy |
| `BRANCH_NOT_MONITORED` | 404 | The branch is not in the policy | Add it to the repository's branches |
| `SHORT_SHA_UNSUPPORTED`, `INVALID_REVISION` | 400 | Abbreviated SHA, tag, `HEAD` or another ref | Pass a full 40-character SHA or a monitored branch |
| `DEFAULT_BRANCH_NOT_OBSERVED` | 409 | No sync has recorded the default branch yet | Wait for or request a sync |
| `PATH_NOT_REGISTERED` | 400 | The path is outside the monorepo's path groups | Search registered paths, or add a group |
| `GIT_AUTH_FAILED`, `GIT_ACCESS_DENIED` | 401, 403 | The Git host rejected the credential | Update the personal or global Git credential |
| `PARTIAL_CLONE_UNSUPPORTED` | 422 | The Git server cannot filter blobs for monorepo mode | Register in full mode, or use a server that supports partial clone |
| `HISTORY_SCAN_LIMIT` | 422 | A days-based window covers too much history | Use a commit count or a shorter window |
| `INSUFFICIENT_STORAGE` | 503 | Free disk is below the configured floor | Free or add disk, or run cleanup |
| `QUEUE_FULL` | 503 | Too many active or recorded jobs | Let jobs finish, cancel some, or clear finished jobs |
| `ENGINE_RESPONSE_TOO_LARGE` | 502 | Even the smallest result page exceeded its budget | Narrow the pattern, globs or paths |
| `RATE_LIMITED` | 429 | A rate limit was reached | Retry after one minute, or use a credential |
<!-- /context:section -->
