---
title: HTTP and MCP
description: Every Source Graph HTTP route and MCP tool — paths, inputs,
  credentials, limits, output and error format.
type: Wiki
timestamp: 2026-10-22T19:00:07.419Z
---
# HTTP and MCP

<!-- context:section id="goal" -->

All routes live under the `/sourcegraph` prefix of the instance's origin. Query routes are under `/sourcegraph/v1/` (search is `/sourcegraph/api/search`), management routes under `/sourcegraph/api/admin/`, and the MCP endpoint is `/sourcegraph/mcp`. Both surfaces call the same service, so revisions, limits and error codes are identical. For how to choose a credential see [Connecting](../../../sop/source-graph/connecting.md).

> **Optional service.** Context does not require Source Graph or its MCP server. When neither is installed or configured, Context's query skill still reads code evidence locally through a shallow, sparse partial clone and grep; in its default `auto` mode it prefers Source Graph only when an authorized instance is available.

<!-- /context:section -->

<!-- context:section id="conventions" -->
## Request conventions

- **Repository** — routes that act on one repository take it as the `repo` query parameter, `owner/repository`.
- **Query parameters** — only `repo` and `after` are accepted, plus `revision` on `/v1/repo/plugins` and `branch` on `/api/admin/v1/repo/commit-options`. Unknown or repeated parameters return `400 INVALID_QUERY_PARAMETERS`.
- **Bodies** — JSON objects of at most 64 KiB. Unknown fields, `null` values, duplicate keys and trailing data are rejected. Query-route fields use capitalized names (`Revision`, `Pattern`); management routes use lowercase names (`name`, `policy`).
- **Credentials** — `Authorization: Bearer <service token>` or `Bearer sgk_…` for a personal key; otherwise a browser session or anonymous access. An invalid credential returns `401` and never falls back to anonymous access.
- **Time** — each request has a 30-second processing budget; a request that exceeds it returns `503 QUERY_DEADLINE_EXCEEDED`, and an unexpected dependency failure returns `503 DEPENDENCY_UNAVAILABLE`.
<!-- /context:section -->

<!-- context:section id="query" -->
## Query routes

These are available anonymously when public reading is enabled, and to every credential.

| Method | Path | Body | Returns |
| --- | --- | --- | --- |
| GET | `/v1/capabilities` | — | Protocol and supported operations |
| GET | `/v1/repos` | — (`after` for the next page) | Registered repositories, 100 per page |
| GET | `/v1/repo/availability` | — | One repository: retained versions, heads, groups and jobs, its `code_provider` and the `code_host` pinned at registration, with an `ETag` |
| GET | `/v1/repo/commits` | — | Same as availability |
| GET | `/v1/repo/plugins` | — (optional `revision`) | Repository plugins found at that commit, without running them |
| POST | `/v1/repo/resolve` | `{"Revision"}` | The fixed commit and whether it is indexed |
| POST | `/api/search` | `{"Revision","Pattern","FixedStrings","IgnoreCase","Glob","Paths","Output"}` | Search hits and `Meta`; see [Query Syntax](query-syntax.md) |
| POST | `/v1/repo/read` | `{"Revision","Path","StartLine","EndLine"}` | One file range |
| POST | `/v1/repo/list` | `{"Revision","Path","First","After"}` | Direct children of one directory |
| POST | `/v1/repo/diff` | `{"Base","Head","Paths","First","After"}` | Changed files and patches between two commits |

`Revision` is optional everywhere except `diff`, where `Base` and `Head` are required. `read_many` has no HTTP route; it exists only as an MCP tool.
<!-- /context:section -->

<!-- context:section id="admin" -->
## Management routes

These need the service token or an administrator's browser session. Personal API keys are read-only and get `403 ACCESS_DENIED` here. A few read routes — `GET /api/admin/v1/repos`, `GET /api/admin/v1/repo` and `GET /api/admin/v1/statistics` — are also open to anonymous reading.

| Method | Path | Body or headers | Purpose |
| --- | --- | --- | --- |
| GET | `/api/admin/v1/statistics` | — | Request and job statistics |
| GET | `/api/admin/v1/instances` | — | Instance heartbeats |
| GET | `/api/admin/v1/repos` | — | Repository catalog |
| POST | `/api/admin/v1/repos` | Registration fields; optional `Idempotency-Key` | Register a repository (`202`) |
| GET | `/api/admin/v1/repo` | — | Repository with `ETag` |
| PATCH | `/api/admin/v1/repo` | Update fields; `If-Match` revision | Change branches, window, visibility, interval, path groups; enable, disable or delete |
| POST | `/api/admin/v1/repo/preview` | Update fields | Preview an update |
| POST | `/api/admin/v1/repo/prepare` | `{"kind","commit","group"}`; optional `Idempotency-Key` | Queue `sync` or `index` work (`202`) |
| GET | `/api/admin/v1/repo/commit-options` | — (optional `branch`) | Recent synchronized commits to choose from |
| POST | `/api/admin/v1/repo/index/preview`, `/api/admin/v1/repo/index` | `{"branch","commit"}`; the second also `preview` and `If-Match` | Add an index for one commit |
| POST | `/api/admin/v1/repo/cleanup/preview`, `/api/admin/v1/repo/cleanup` | `{"preview"}` and `If-Match` for the second | Keep only the latest index per branch |
| POST | `/api/admin/v1/repo/delete/preview`, `/api/admin/v1/repo/delete` | `{"preview"}` and `If-Match` for the second | Permanently delete repository data |
| POST | `/api/admin/v1/repo/jobs/cancel` | `{"job_id"}` | Cancel a job |
| POST | `/api/admin/v1/repo/purge` | `If-Match` revision | Purge a disabled, deleted repository |

Registration fields are listed in [Registering Repositories](../../../sop/source-graph/registering-repositories.md).
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

`/sourcegraph/mcp` speaks stateless Streamable HTTP with JSON responses; the server identifies itself as `context-sourcegraph`. The toolset depends on the credential:

| Credential | Tools |
| --- | --- |
| Anonymous (public reading on), personal key | Read-only: every tool except `prepare` |
| Administrator personal key created with prepare permission | Read-only tools plus `prepare`, rate-limited to 10 per key and 60 in total per minute |
| Service token | All tools |

The optional connection parameter `?plugins=` sets the default plugin selection for `read` and `read_many`: `auto`, `off`, or up to 16 comma-separated names. Invalid values return `400 INVALID_PLUGINS`.
<!-- /context:section -->

<!-- context:section id="tools" -->

## MCP tools

| Tool | Required | Optional (default) |
| --- | --- | --- |
| `repositories` | — | `after` |
| `availability` | `repo` | `job_id`, `include_plugins`, `revision` |
| `resolve` | `repo` | `revision` |
| `search` | `repo`, `pattern` | `revision`, `fixed_strings`, `ignore_case`, `glob`, `paths`, `output` (`content` or `files`), `max_lines_per_file` (10, range 1–1000) |
| `read` | `repo`, `path` | `revision`, `start_line` (1), `end_line` (start + 499), `plugins` |
| `read_many` | `repo`, `files` (1–10 items of `path`, `start_line`, `end_line`) | `revision` (resolved once for the batch), `plugins` |
| `list` | `repo`, `first` (1–1000) | `revision`, `path`, `after` |
| `diff` | `repo`, `base`, `head`, `first` (1–100) | `paths`, `after` |
| `prepare` | `repo`, `idempotency_key` (8–128 bytes) | `revision`, `group` |

`plugins` is a list such as `[{"name":"context-evidence"}]`; `[]` disables enhancements for that call, and a connection opened with `plugins=off` always disables them. `prepare` accepts an omitted revision (default branch), a monitored branch or a full SHA inside the retention window; it is asynchronous, so poll `availability` afterwards.

Treat the repository, the original full SHA and the path as one source identity: do not reconstruct a SHA or reuse it in another repository. Group `read_many` requests by repository and revision, use paths returned by `search` or `list`, and give `end_line` as an inclusive absolute line number, not a line count.

`availability` over HTTP also returns `job_failures`, a bounded history of failed task summaries whose retention is described in [Operations](../../../sop/source-graph/operations.md). Over MCP, `availability` with a specific `job_id` returns `job_failure` and `job_lookup.state=archived_failure` when the live task has been pruned but its failure summary remains. This is historical evidence, not current readiness or a task that can be resumed, and a missing history does not mean the task succeeded.

<!-- /context:section -->

<!-- context:section id="output" -->
## MCP output

`search`, `read` and `read_many` return readable text rather than raw JSON:

- **search** starts with `Repository`, `Commit`, `Status`, `Partial`, `Truncated`, a `Coverage` line, registered `Paths` and `Groups`, and the returned and total file counts, then lists each `File` with numbered matching lines.
- **read** starts with `Repository`, then `Path`, `Commit` and `Lines: start-end`, continuation fields when more remains (`Truncated`, `HasMore`, `NextStartLine`), notes for symlinks, submodules and LFS pointers, then numbered lines `N: text`.
- **read_many** returns one text block per item, each with `Item N; RequestedLines`, an `Error` line if that item failed, and the same file header and lines.

Plugin output is appended after the item it belongs to; plugin diagnostics come in a separate block and never replace the original text. The other tools return compact JSON. Errors come back as a tool result marked as an error, whose text is `{"code","message"}`, with a recovery hint for not-ready states.
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
| Request body | 64 KiB |
<!-- /context:section -->

<!-- context:section id="errors" -->
## Error format

HTTP errors return a JSON body with an `Error` message and `Meta` containing `Protocol`, `RequestID`, `Status`, `Code` and `Retryable`. Transport-level codes include `NOT_FOUND`, `METHOD_NOT_ALLOWED`, `INVALID_QUERY_PARAMETERS`, `INVALID_REQUEST`, `AUTHENTICATION_REQUIRED`, `ACCESS_DENIED`, `RATE_LIMITED`, `PRECONDITION_REQUIRED`, `QUERY_DEADLINE_EXCEEDED` and `DEPENDENCY_UNAVAILABLE`. Operation codes such as `INDEX_NOT_READY`, `REVISION_NOT_ELIGIBLE`, `INVALID_PATTERN` or `READ_BUDGET_EXCEEDED` carry their own status. [Operations](../../../sop/source-graph/operations.md) explains the common ones and what to do about them.
<!-- /context:section -->
