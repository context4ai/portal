---
title: HTTP and MCP
description: Every Source Graph HTTP route and MCP tool — paths, inputs,
  credentials, limits, output and error format.
type: Wiki
timestamp: 2026-11-09T00:57:46.373Z
---
# HTTP and MCP

<!-- context:section id="goal" -->

All routes live under the `/sourcegraph` prefix of the instance's origin. Query routes are under `/sourcegraph/v1/` (search is `/sourcegraph/api/search`), management routes under `/sourcegraph/api/admin/`, and the MCP endpoint is `/sourcegraph/mcp`. Both surfaces call the same service, so revisions, limits and error codes are identical. For how to choose a credential see [Connecting Agents, Scripts and the CLI to Source Graph](../../../sop/source-graph/connecting.md).

> **Optional service.** Context does not require Source Graph or its MCP server. When neither is installed or configured, Context's query skill still reads code evidence locally through a shallow, sparse partial clone and grep; in its default `auto` mode it prefers Source Graph only when an authorized instance is available.

<!-- /context:section -->

<!-- context:section id="conventions" -->
## Request conventions

- **Repository** — routes that act on one repository take it as the `repo` query parameter, `owner/repository`.
- **Query parameters** — only `repo` and `after` are accepted, plus `revision` on `/v1/repo/plugins`, `branch` on `/api/admin/v1/repo/commit-options`, and `kind`, `query`, `author`, `title`, `since`, `until`, `sort` and `first` on `/v1/repo/refs`. Unknown or repeated parameters return `400 INVALID_QUERY_PARAMETERS`.
- **Bodies** — JSON objects of at most 64 KiB. Unknown fields, `null` values, duplicate keys and trailing data are rejected. Query-route fields use capitalized names (`Revision`, `Pattern`); management routes use lowercase names (`name`, `policy`).
- **Credentials** — `Authorization: Bearer <service token>` or `Bearer sgk_…` for a personal key; otherwise a browser session or anonymous access. An invalid credential returns `401` and never falls back to anonymous access.
- **Time** — each request has a 30-second processing budget; a request that exceeds it returns `503 QUERY_DEADLINE_EXCEEDED`, and an unexpected dependency failure returns `503 DEPENDENCY_UNAVAILABLE`.
<!-- /context:section -->

<!-- context:section id="query" -->

## Query routes

These are available anonymously when public reading is enabled, and to every credential, for the repositories that caller can see: anonymous callers see public repositories only, and private repositories are visible to their creator, managers, administrators signed in on the website and the service token. A private repository the caller cannot see answers `404 REPOSITORY_NOT_FOUND`, exactly like an unregistered name.

| Method | Path | Body | Returns |
| --- | --- | --- | --- |
| GET | `/v1/capabilities` | — | Protocol and supported operations: `search`, `read`, `list`, `diff`, `resolve`, `refs`, `availability`, `commits` and `prepare` |
| GET | `/v1/repos` | — (`after` for the next page) | Repositories visible to the caller, 100 per page; signed-in callers also get each repository's `managers` |
| GET | `/v1/repo/availability` | — | One repository: retained versions, heads, groups and jobs, its `code_provider` and the `code_host` pinned at registration, with an `ETag` |
| GET | `/v1/repo/commits` | — | Same as availability |
| GET | `/v1/repo/plugins` | — (optional `revision`) | Repository plugins found at that commit, without running them |
| GET | `/v1/repo/refs` | — (optional `kind`, `query`, `author`, `title`, `since`, `until`, `sort`, `first`, `after`) | One page of the repository's branches or tags; see [Branches, tags and resolve](#branches-tags-and-resolve) |
| POST | `/v1/repo/resolve` | `{"Revision"}` | The fixed commit for a branch, tag or full SHA, how it was found and whether it is indexed |
| POST | `/api/search` | `{"Revision","Pattern","FixedStrings","IgnoreCase","Glob","Paths","Output"}` | Search hits and `Meta`; see [Query Syntax](query-syntax.md) |
| POST | `/v1/repo/read` | `{"Revision","Path","StartLine","EndLine"}` | One file range |
| POST | `/v1/repo/list` | `{"Revision","Path","First","After"}` | Direct children of one directory |
| POST | `/v1/repo/diff` | `{"Base","Head","Paths","First","After"}` | Changed files and patches between two commits |

`Revision` is optional everywhere except `diff`, where `Base` and `Head` are required. Only `resolve` accepts branch and tag names that are not monitored; every other route takes a monitored branch or a full SHA, so resolve any other branch or tag first and use the returned SHA. `read_many` has no HTTP route; it exists only as an MCP tool.

<!-- /context:section -->

<!-- context:section id="refs-resolve" -->

## Branches, tags and resolve

`resolve` — the MCP tool or `POST /v1/repo/resolve` — turns a revision into one full commit. It never downloads code or builds an index.

| `revision` | Resolution | `source` |
| --- | --- | --- |
| Omitted, or a monitored branch (also as `refs/heads/<name>`) | The last synchronized head. The remote is not asked, so it may lag behind the remote's latest commit; a bare name equal to a monitored branch is not checked for a same-named tag, so pass `refs/tags/<name>` for the tag | `observed` |
| A full 40-character lowercase SHA | An observed or retained version of this repository; otherwise `REVISION_NOT_ELIGIBLE` | `observed` |
| Any other branch or tag name, `refs/heads/<name>` or `refs/tags/<name>` | The repository's ref catalog when it is fresh and not truncated; otherwise an exact lookup on the remote, which downloads only that ref's commit and tag objects, without file trees, into a scratch directory, confirms the object type and commit details, and deletes it | `catalog` or `remote` |
| A short SHA, `HEAD`, a revision expression, another ref namespace or a name with characters the service does not accept, such as spaces or parentheses | Rejected with `SHORT_SHA_UNSUPPORTED` or `INVALID_REVISION`; such names still appear in `refs` | — |

| Output field | Meaning |
| --- | --- |
| `commit`, `indexed`, `committer_time` | The full SHA, whether it has a search index, and its committer time |
| `kind` | `branch`, `tag` or `commit` (a SHA was passed) |
| `source` | `observed`, `catalog` or `remote`, as in the table above |
| `monitored` | Whether the branch is one of the repository's monitored branches |
| `ref` | The full ref name, such as `refs/heads/main`, when known |
| `created_at`, `author`, `title` | When known: the commit time, author and title; for an annotated tag, the tagging time, the tagger and the first line of the tag message, while `committer_time` stays the commit's |
| `hint` | Present when the commit has no index: this caller may prepare the full SHA, or a repository manager can |

A bare name that is both a branch and a tag returns `REF_AMBIGUOUS` listing both; pass the full form. A missing name returns `REF_NOT_FOUND`, and a tag that ends at a tree or blob returns `REF_NOT_COMMIT`. Resolution uses the ref as actually downloaded, so a branch that moves between listing and download resolves to the downloaded commit; an object that cannot be verified returns a retryable `REMOTE_UNAVAILABLE`. Identical concurrent remote lookups share one request, and their answers, including "not found", are cached briefly (see [Limits](#limits)). Visibility is checked first, so a private repository the caller cannot see answers `404 REPOSITORY_NOT_FOUND` without asking the remote. Over HTTP the response carries the same fields together with the rest of the stored version record.

`refs` — the MCP tool or `GET /v1/repo/refs?repo=` — lists one page of a registered repository's branches or tags. Listing never indexes.

| Parameter | Values | Default |
| --- | --- | --- |
| `kind` | `branch`, `tag` or `all` | `branch` |
| `query` | Case-insensitive substring of the branch or tag name | — |
| `author` | Case-insensitive substring of the author's name or email; the tagger for annotated tags | — |
| `title` | Case-insensitive substring of the commit title or the first line of an annotated tag's message | — |
| `since`, `until` | RFC 3339 or `YYYY-MM-DD`, compared with `created_at` | — |
| `sort` | `created` (newest first) or `name` | `created`; `name` for a names-only catalog |
| `first` | 1–100 | 30 |
| `after` | The previous page's `next_cursor`, with the other parameters unchanged | — |

Invalid values return `400` with `INVALID_KIND`, `INVALID_SORT`, `INVALID_LIMIT`, `INVALID_CURSOR` or `INVALID_TIME`.

| Response field | Meaning |
| --- | --- |
| `repo` | The repository |
| `catalog` | `state`, `reason`, `refreshed_at`, `total` and `truncated`, described below |
| `sort` | The order applied: `created` or `name` |
| `refs` | Entries with `name`, `ref`, `kind`, `monitored` and `indexed`. Entries verified to end at a commit add `commit`, `created_at`, `committer_time`, `author` and `title`; annotated tags add `annotated`; tags of trees, blobs or unverifiable objects carry `object` and `target_type` instead of `commit` |
| `next_cursor`, `has_more` | Pass `next_cursor` as `after` while `has_more` is `true` |
| `hint` | Guidance, for example that a truncated list covers only part of the repository |

`created_at` is the commit time for branches and lightweight tags and the tagging time for annotated tags.

| `catalog.state` | Meaning |
| --- | --- |
| `ready` | A fresh catalog with commit details |
| `stale` | The catalog expired or its refresh failed; the last successful catalog is returned with its `refreshed_at` while a refresh runs in the background |
| `names_only` | Names without commit details. `catalog.reason` is `filter_unsupported` (the remote cannot send commit objects without trees), `ref_limit` (more than 200,000 branches or tags) or `size_limit` (the download exceeded 256 MiB). Sorting defaults to `name`; an explicit `author`, `title`, `since`, `until` or `sort=created` returns `REFS_FILTER_UNAVAILABLE` |

`catalog.truncated: true` means only the first 200,000 names of a kind are listed and `query` searches only those; `resolve` with a complete name does not depend on the catalog. The cursor is an offset, so a refresh between pages can repeat or skip a few entries.

Catalogs live in service memory. A refresh lists the remote first, so the ref limit applies before anything is downloaded, then downloads branch and tag commit and tag objects, without file trees, into a scratch directory that is parsed and deleted. A catalog stays fresh for 5 minutes or three times its last refresh duration, whichever is longer; an expired catalog is served while one background refresh per repository runs. Without any catalog, a request waits for the first refresh within its remaining deadline less 2 seconds and otherwise returns `REFS_CATALOG_PREPARING` with `Retry-After` while the refresh continues; resolving a complete name works meanwhile. A failed refresh without an earlier catalog returns the remote error; with one, the stale catalog is returned.

<!-- /context:section -->

<!-- context:section id="admin" -->

## Management routes

These need the service token or an administrator's browser session. A repository's managers can also use every `?repo=` route on that repository, and others get `403 REPOSITORY_MANAGEMENT_DENIED`. When the site lets signed-in users register repositories, any signed-in user can register one and becomes its manager; otherwise registration returns `403 REGISTRATION_DISABLED`. Users, site settings, global code-source tokens and other site-wide routes stay administrator-only. Personal API keys can call only `POST /api/admin/v1/repo/prepare` here, for repositories their owner manages or, when the owner is an administrator, any repository the key can see; every other management route returns `403 ACCESS_DENIED`. A few read routes — `GET /api/admin/v1/repos`, `GET /api/admin/v1/repo` and `GET /api/admin/v1/statistics` — are also open to anonymous reading, limited to what the caller can see; statistics leave out the names of repositories the caller cannot see.

| Method | Path | Body or headers | Purpose |
| --- | --- | --- | --- |
| GET | `/api/admin/v1/statistics` | — | Request and job statistics, and the latest index collection round |
| GET | `/api/admin/v1/instances` | — | Instance heartbeats |
| GET | `/api/admin/v1/repos` | — | Repository catalog |
| POST | `/api/admin/v1/repos` | Registration fields; optional `Idempotency-Key` | Register a repository (`202`); a name that is already registered returns `409 REPOSITORY_EXISTS` with the registrant in `creator` |
| GET | `/api/admin/v1/repo` | — | Repository with `ETag` |
| PATCH | `/api/admin/v1/repo` | Update fields; `If-Match` revision | Change branches, window, visibility, interval, path groups, pinned snapshots and storage budget; enable, disable or delete |
| POST | `/api/admin/v1/repo/preview` | Update fields | Preview an update |
| POST | `/api/admin/v1/repo/prepare` | `{"kind","commit","group"}`; optional `Idempotency-Key` | Queue `sync` or `index` work (`202`) |
| GET | `/api/admin/v1/repo/commit-options` | — (optional `branch`) | Recent synchronized commits to choose from |
| POST | `/api/admin/v1/repo/index/preview`, `/api/admin/v1/repo/index` | `{"branch","commit"}`; the second also `preview` and `If-Match` | Add an index for one commit |
| POST | `/api/admin/v1/repo/cleanup/preview`, `/api/admin/v1/repo/cleanup` | `{"preview"}` and `If-Match` for the second | Remove old indexes, keeping branch-head and pinned ones |
| POST | `/api/admin/v1/repo/delete/preview`, `/api/admin/v1/repo/delete` | `{"preview"}` and `If-Match` for the second | Permanently delete repository data |
| POST | `/api/admin/v1/repo/jobs/cancel` | `{"job_id"}` | Cancel a job |
| POST | `/api/admin/v1/repo/purge` | `If-Match` revision | Purge a disabled, deleted repository |
| POST | `/api/admin/v1/repo/managers` | `{"add":"<user id>"}` or `{"remove":"<user id>"}`; `If-Match` revision | Add or remove a manager (at most 50); an unknown or disabled user returns `404 USER_NOT_FOUND` |
| GET | `/auth/users/search?q=` | — | Signed-in users find up to 20 enabled users by name or email to choose a manager |

Registration and `PATCH` also accept `git_timeout_minutes` (0 inherits the site default; 15, 30, 45 or 60 override it) and `public_read` (`false` makes the repository private). `PATCH` also accepts `pinned_commits`, full SHAs that neither retention nor capacity release ever removes (at most 4096, otherwise `PIN_LIMIT`); pins are added only here, never by preparation. It also accepts `max_storage_bytes`, the repository's storage budget from 1 GiB to 10 TiB (default 100 GiB); when usage reaches it, the oldest unprotected snapshots are released first. Repository details add `can_manage`, and for signed-in callers `creator` and `managers`; `GET /access-policy` adds `user_repositories`. Registration fields are listed in [Registering and Managing Repositories](../../../sop/source-graph/registering-repositories.md).

Manual preparation is paced per repository across the website, HTTP and MCP. A request identical to a queued or running job (same group, kind and revision) returns that job and adds no queue load. Any other new manual request within 30 seconds of the repository's last accepted one returns `429 RATE_LIMITED` with `Retry-After`; one request that queues every monorepo group counts once, and scheduled work is not paced.

<!-- /context:section -->

<!-- context:section id="other" -->
## Health, sign-in and settings routes

| Path | Access | Purpose |
| --- | --- | --- |
| `GET /healthz` | Open | Liveness: `{"status":"alive"}` |
| `GET /readyz` | Open | Readiness; `503` when the catalog cannot be read |
| `GET /access-policy` | Open | `public_read`, `public_prepare` (always `false`) and `sso_enabled` |
| `GET /site-settings` | Open | Public repository defaults |
| `GET /v1/code-sources` | Open | The configured code sources in display order — `id`, `name`, `host`, `username`, `anonymous`, `editable`, and `locked` for fields set by the startup file; never tokens |
| `/auth/…` | Browser | Providers, sign-in and callback, current user, sign-out, `api-keys`, user administration |
| `/auth/code-credentials` | Signed-in session | Your own GitHub and custom Git tokens |
| `/api/admin/settings/…` | Administrator session only | Site settings sections, including `code_source` (`PATCH` with `revision` and `values` `name`, `host`, `username`), plus `code-credentials`, `query-errors`, `jobs/clear`, `storage` |

Site administration under `/api/admin/settings` refuses any request that carries an `Authorization` header — it is reachable only from a signed-in administrator's browser.
<!-- /context:section -->

<!-- context:section id="mcp" -->

## MCP endpoint

`/sourcegraph/mcp` speaks stateless Streamable HTTP with JSON responses; the server identifies itself as `context-sourcegraph`. Every tool works only on repositories the credential can see. The toolset depends on the credential:

| Credential | Tools |
| --- | --- |
| Anonymous (public reading on) | Read-only: every tool except `prepare` |
| Personal key whose owner is an administrator or manages at least one repository | Read-only tools plus `prepare`, for repositories the owner manages or, for an administrator, any repository the key can see; rate-limited to 10 per key and 60 in total per minute |
| Other personal keys | Read-only: every tool except `prepare` |
| Service token | All tools |

Whether a key's owner manages a repository is cached for up to a minute, so a newly added manager may see `prepare` after a short delay. Each `prepare` call is still checked against the current role and manager list.

The optional connection parameter `?plugins=` sets the default plugin selection for `read` and `read_many`: `auto`, `off`, or up to 16 comma-separated names. Invalid values return `400 INVALID_PLUGINS`.

<!-- /context:section -->

<!-- context:section id="tools" -->

## MCP tools

| Tool | Required | Optional (default) |
| --- | --- | --- |
| `repositories` | — | `after` |
| `availability` | `repo` | `job_id`, `include_plugins`, `revision` |
| `resolve` | `repo` | `revision` (a branch or tag name, `refs/heads/<name>`, `refs/tags/<name>` or a full SHA) |
| `refs` | `repo` | `kind` (`branch`), `query`, `author`, `title`, `since`, `until`, `sort` (`created`), `first` (30, range 1–100), `after` |
| `search` | `repo`, `pattern` | `revision`, `fixed_strings`, `ignore_case`, `glob`, `paths`, `output` (`content` or `files`), `max_lines_per_file` (10, range 1–1000) |
| `read` | `repo`, `path` | `revision`, `start_line` (1), `end_line` (start + 499), `plugins` |
| `read_many` | `repo`, `files` (1–10 items of `path`, `start_line`, `end_line`) | `revision` (resolved once for the batch), `plugins` |
| `list` | `repo`, `first` (1–1000) | `revision`, `path`, `after` |
| `diff` | `repo`, `base`, `head`, `first` (1–100) | `paths`, `after` |
| `prepare` | `repo`, `idempotency_key` (8–128 bytes) | `revision`, `group` |

`resolve` and `refs` work as described in [Branches, tags and resolve](#branches-tags-and-resolve). The other tools accept a monitored branch or a full SHA and return `BRANCH_NOT_MONITORED` for any other branch: find it with `refs` if needed, `resolve` it, and pass the returned SHA. When `indexed` is false, someone allowed to prepare that repository prepares the SHA first.

`plugins` is a list such as `[{"name":"context-evidence"}]`; `[]` disables enhancements for that call, and a connection opened with `plugins=off` always disables them. `prepare` accepts an omitted revision (default branch), a monitored branch or a full 40-character SHA. A SHA that has not been synchronized is fetched as an ordinary snapshot: preparation does not pin it, so retention and the storage budget release it in order like any other snapshot, and only `pinned_commits` keeps it permanently, as described in [Registering and Managing Repositories](../../../sop/source-graph/registering-repositories.md). It is asynchronous: a repeated identical request returns the queued or running job, a different new request within 30 seconds returns `RATE_LIMITED` with the seconds to wait, and you poll `availability` afterwards.

Treat the repository, the original full SHA and the path as one source identity: do not reconstruct a SHA or reuse it in another repository. Group `read_many` requests by repository and revision, use paths returned by `search` or `list`, and give `end_line` as an inclusive absolute line number, not a line count.

`availability` over HTTP also returns `job_failures`, a bounded history of failed task summaries whose retention is described in [Ops: Day-to-Day Operations](../../../sop/source-graph/operations.md). Over MCP, `availability` with a specific `job_id` returns `job_failure` and `job_lookup.state=archived_failure` when the live task has been pruned but its failure summary remains. This is historical evidence, not current readiness or a task that can be resumed, and a missing history does not mean the task succeeded.

<!-- /context:section -->

<!-- context:section id="output" -->
## MCP output

`search`, `read` and `read_many` return readable text rather than raw JSON:

- **search** starts with `Repository`, `Commit`, `Status`, `Partial`, `Truncated`, a `Coverage` line, registered `Paths` and `Groups`, and the returned and total file counts, then lists each `File` with numbered matching lines.
- **read** starts with `Repository`, then `Path`, `Commit` and `Lines: start-end`, continuation fields when more remains (`Truncated`, `HasMore`, `NextStartLine`), notes for symlinks, submodules and LFS pointers, then numbered lines `N: text`.
- **read_many** returns one text block per item, each with `Item N; RequestedLines`, an `Error` line if that item failed, and the same file header and lines.

Plugin output is appended after the item it belongs to; plugin diagnostics come in a separate block and never replace the original text. The other tools return compact JSON; `resolve` returns `commit`, `indexed`, `committer_time`, `kind`, `source` and `monitored` plus `ref`, `created_at`, `author`, `title` and `hint` when present, and `refs` returns the page described in [Branches, tags and resolve](#branches-tags-and-resolve). Errors come back as a tool result marked as an error, whose text is `{"code","message"}`, with a recovery hint for not-ready states.
<!-- /context:section -->

<!-- context:section id="limits" -->
## Limits

| Limit | Value |
| --- | --- |
| Catalog page | 100 repositories |
| Search pattern | 8,192 bytes; cannot match a newline or the empty string |
| Search globs | 64, each up to 1,024 bytes |
| Search or diff paths | 64 directories |
| Search page | 100 files and 1,000 matches with 2 context lines, then smaller fallbacks; 2 MiB response; 5-second deadline |
| Engine match cap | 10,000 matches |
| Read | 500 lines and 256 KiB per call |
| `read_many` | 1–10 items, 1,000 lines, 256 KiB and 30 seconds shared |
| List page | 1–1,000 entries |
| Diff page | 1–100 files; patches 64 KiB per file and 256 KiB total |
| Refs page | 1–100 entries, default 30 |
| Ref catalog size | 200,000 branches and 200,000 tags with details; beyond that, names only and `truncated` |
| Ref catalogs in memory | 1,000,000 refs across repositories; the least recently used catalogs are dropped beyond that |
| Ref catalog freshness | 5 minutes or three times the last refresh duration, whichever is longer; one refresh per repository and 4 per instance at a time |
| Ref scratch downloads | 256 MiB per catalog refresh, 16 MiB per resolve lookup, 4 GiB across all downloads, always within the instance free-space reserve |
| Remote ref lookups | 2 per repository and 8 per instance at a time, 64 running or waiting; answers, including "not found", cached for 30 seconds (10,000 entries); backoff after failures from 10 seconds to 5 minutes per repository |
| Snapshots | 4,096 per path group; the oldest unprotected snapshot is released to make room |
| Pinned snapshots | 4,096 per repository |
| Request body | 64 KiB |
<!-- /context:section -->

<!-- context:section id="errors" -->

## Error format

HTTP errors return a JSON body with an `Error` message and `Meta` containing `Protocol`, `RequestID`, `Status`, `Code` and `Retryable`; a refusal with a known earliest retry time, such as paced preparation or a busy remote, also sets `Retry-After`. Transport-level codes include `NOT_FOUND`, `METHOD_NOT_ALLOWED`, `INVALID_QUERY_PARAMETERS`, `INVALID_REQUEST`, `AUTHENTICATION_REQUIRED`, `ACCESS_DENIED`, `RATE_LIMITED`, `PRECONDITION_REQUIRED`, `QUERY_DEADLINE_EXCEEDED` and `DEPENDENCY_UNAVAILABLE`. Operation codes such as `INDEX_NOT_READY`, `REVISION_NOT_ELIGIBLE`, `INVALID_PATTERN` or `READ_BUDGET_EXCEEDED` carry their own status, as do the management codes `REPOSITORY_MANAGEMENT_DENIED`, `REGISTRATION_DISABLED`, `REPOSITORY_EXISTS` and `USER_NOT_FOUND`, the pin and budget validation codes `PIN_LIMIT` and `INVALID_STORAGE_BUDGET`, and the Git fetch codes such as `GIT_REPOSITORY_UNAVAILABLE`, which covers both a missing repository and one the credential cannot see. `REPOSITORY_NOT_FOUND` is returned both for an unregistered name and for a private repository the caller cannot see.

Branch, tag, remote and capacity codes:

| Code | Status | Meaning |
| --- | --- | --- |
| `REF_NOT_FOUND` | 404 | No branch or tag with that name exists on the remote; names are case-sensitive, so search with `refs` |
| `REF_AMBIGUOUS` | 409 | A branch and a tag share the name; pass `refs/heads/<name>` or `refs/tags/<name>` |
| `REF_NOT_COMMIT` | 409 | The tag ends at a tree or blob, so it cannot be used to read code |
| `REFS_CATALOG_PREPARING` | 503 | The first listing is still being prepared; retry after `Retry-After`, or resolve a complete name meanwhile |
| `REFS_FILTER_UNAVAILABLE` | 409 | The catalog has names only; filter with `query` and sort by name |
| `BRANCH_NOT_MONITORED` | 404 | An operation other than `resolve` received a branch that is not monitored; resolve it to a SHA first |
| `REMOTE_ACCESS_DENIED` | 502 | The code-source token this repository uses cannot read its remote; a repository manager should check it. The caller's own key is not the cause |
| `REMOTE_UNAVAILABLE` | 502 or 503 | The remote is unavailable, timed out or backing off, too many lookups are waiting, or a ref's object could not be verified; retryable, with `Retry-After` |
| `INSUFFICIENT_STORAGE` | 503 or 507 | The instance's free disk space is below its reserve; this is not the repository budget |
| `RECLAIM_FAILED` | 503 | Older snapshots could not be released safely, or released snapshots are not collected yet; collection continues in the background, so retry shortly |
| `REPOSITORY_STORAGE_LIMIT` | 409 | Protected snapshots — branch heads, pins and snapshots of active jobs — alone fill the storage budget, or a running preparation exceeds 120% of it; remove pins you no longer need or raise the budget |
| `SNAPSHOT_LIMIT` | 409 | Protected snapshots alone fill a path group's 4,096 versions; remove pins you no longer need |

Unprotected snapshots never cause `SNAPSHOT_LIMIT` or `REPOSITORY_STORAGE_LIMIT`: they are released oldest first to make room. [Ops: Day-to-Day Operations](../../../sop/source-graph/operations.md) explains the common codes and what to do about them.

<!-- /context:section -->
