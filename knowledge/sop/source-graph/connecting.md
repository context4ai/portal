---
title: Connecting
description: Connect a browser, an MCP client, a script or the command-line
  client to Source Graph, choose the right credential, and follow the
  search-then-read loop at one commit.
type: Guide
timestamp: 2026-10-13T01:11:43.187Z
---
# Connecting

<!-- context:section id="goal" -->
Every Source Graph instance serves four entry points under the `/sourcegraph/` path of its origin. Pick the one that fits the caller; all of them run the same operations with the same rules.

| Caller | Entry point |
| --- | --- |
| A person | The website at `/sourcegraph/` — search, code reading, repositories and the **Connect** page |
| An AI Agent or MCP client | `/sourcegraph/mcp` — Streamable HTTP, stateless, JSON responses |
| A script or service | The HTTP API — `/sourcegraph/v1/…` for repository reads and `/sourcegraph/api/search` for search |
| A terminal | `sourcegraph-cli`, a small HTTP client for the same routes |

The website's **Connect** page always shows ready-to-copy configuration for the instance you are on, including the right address and whether a token is needed. Prefer it over hand-written examples when they differ.
<!-- /context:section -->

<!-- context:section id="optional" -->
## Source Graph is optional

Context does not require Source Graph. If you never install or configure it, Context's query skill still reads code evidence by itself: it makes a shallow, sparse partial clone of the recorded commit and searches it with grep or rg. In the default `auto` mode the skill prefers Source Graph only when an authorized instance is available, so connect one when you want pinned remote reads without local checkouts.

To try it without deploying anything, use the public demo at [https://context4ai-portal.fly.dev/sourcegraph/](https://context4ai-portal.fly.dev/sourcegraph/); its MCP endpoint is `/sourcegraph/mcp`.
<!-- /context:section -->

<!-- context:section id="credentials" -->
## Choose a credential

| Credential | How to get it | What it allows |
| --- | --- | --- |
| None (anonymous) | — | Read-only access to repositories marked public, when the site allows public reading; rate-limited per client |
| Personal API key (`sgk_…`) | Sign in, open your user settings and create an API token | The same reads as your account, over HTTP or MCP. Administrators can create keys that may also request indexing over MCP |
| Service token | The `SOURCEGRAPH_API_TOKEN` setting of the instance, at least 32 characters | Every HTTP and MCP operation, including registration and indexing — for automation you control |

Send keys and tokens as `Authorization: Bearer <value>`. An invalid credential is rejected with `AUTHENTICATION_REQUIRED`; it never falls back to anonymous access. Keep credentials in your client's secret store or environment, never in shared configuration files. [Authentication and Access Control](authentication-and-access-control.md) explains each mode in detail.
<!-- /context:section -->

<!-- context:section id="mcp" -->
## Connect an MCP client

Point any client that supports Streamable HTTP at the `/mcp` endpoint. For the public demo:

```json
{
  "mcpServers": {
    "context-sourcegraph": {
      "type": "http",
      "url": "https://context4ai.org/sourcegraph/mcp?plugins=auto"
    }
  }
}
```

For an instance that needs a credential, add `"headers": { "Authorization": "Bearer <token>" }`. The Connect page also shows the equivalent command or file for Claude Code, Codex and Cursor. Naming the server `context-sourcegraph` lets Context's query Skill find it, as described in [Reading Code Evidence Remotely](../querying-knowledge/reading-code-evidence-remotely.md).

The optional `plugins` query parameter controls repository plugins for the whole connection: `auto` (default selection), `off`, or up to 16 comma-separated plugin names. Anonymous connections and personal keys get the read-only tools; `prepare` appears only for the service token and for administrator keys allowed to prepare. Use MCP tool discovery for the current input schemas — the [HTTP and MCP](../../product/reference/source-graph/http-and-mcp.md) reference lists them.
<!-- /context:section -->

<!-- context:section id="http" -->
## Call the HTTP API

Every repository-specific request names the repository with the `repo` query parameter, as `owner/repository`. Request bodies are JSON objects with capitalized field names; unknown fields are rejected.

```bash
# Search at the default branch head
curl -s -X POST 'https://context4ai.org/sourcegraph/api/search?repo=context4ai/context' \
  -H 'Content-Type: application/json' \
  -d '{"Pattern":"timeout","IgnoreCase":true,"Paths":["packages"]}'

# Read lines at the commit returned in Meta.Commit
curl -s -X POST 'https://context4ai.org/sourcegraph/v1/repo/read?repo=context4ai/context' \
  -H 'Content-Type: application/json' \
  -d '{"Revision":"<commit>","Path":"README.md","StartLine":1,"EndLine":40}'
```

`read_many` is available only over MCP; over HTTP, issue several `read` calls.
<!-- /context:section -->

<!-- context:section id="cli" -->
## Use the command-line client

`sourcegraph-cli` is built with the service and reads two environment variables: `SOURCEGRAPH_URL`, the instance's `/sourcegraph` base address (default `https://context4ai.org/sourcegraph`, and it must be HTTPS), and the optional `SOURCEGRAPH_API_TOKEN`. Search flags follow `rg`:

```bash
export SOURCEGRAPH_URL="https://context4ai.org/sourcegraph"
sourcegraph-cli search -repo context4ai/context -g '*.ts' 'OnboardingVersion' packages
sourcegraph-cli read -repo context4ai/context -revision <commit> \
  -path README.md -start-line 1 -end-line 40
```

It prints the raw JSON response and exits with `3` when a request is accepted but not ready yet. All commands and flags are in the [CLI](../../product/reference/source-graph/cli.md) reference.
<!-- /context:section -->

<!-- context:section id="loop" -->
## The search-then-read loop

Agents get the most from Source Graph with a short loop:

1. **Search** the repository. Omit the revision to use its default branch head, or pass a monitored branch or a full commit you already know.
2. **Pin the commit** returned in the result's metadata.
3. **Read** the decisive ranges at that commit — directly when the file is known, several at once with `read_many`.
4. **Continue** from the returned next line if the file goes on, and treat `Partial`, `Truncated` and coverage flags as limits, not as proof that something is absent.

There is no need to list repositories or resolve the revision before every query; do that only when the repository is unknown or a request fails. A `409 INDEX_NOT_READY` means that commit has not been indexed yet — see [Operations](operations.md) for what to do.
<!-- /context:section -->
