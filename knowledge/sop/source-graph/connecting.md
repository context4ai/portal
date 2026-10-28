---
title: Connecting
description: Connect your Agent to Source Graph so Context can read cited code
  without cloning, then connect a browser, script or the command-line client,
  choose the right credential and follow the search-then-read loop.
type: Guide
timestamp: 2026-10-28T09:46:19.242Z
---
# Connecting

<!-- context:section id="goal" -->
Connecting gives your Agent, script or terminal code search and reading at a pinned commit, without cloning the repository first. Most Context users need only one thing: connect their Agent over MCP, as described in the next section, so the Agent can read the code behind an answer remotely. [What Is Source Graph](introduction.md) explains why that matters, when you need it and how to try the live demo.

Every Source Graph instance serves four entry points under the `/sourcegraph/` path of its origin. Pick the one that fits the caller; all of them run the same operations with the same rules, except that only MCP reads several ranges in one call.

| Caller | Entry point |
| --- | --- |
| A person | The website at `/sourcegraph/` — search, code reading, repositories and the **Connect** page |
| An AI Agent or MCP client | `/sourcegraph/mcp` — Streamable HTTP, stateless, JSON responses |
| A script or service | The HTTP API — `/sourcegraph/v1/…` for repository reads and `/sourcegraph/api/search` for search |
| A terminal | `sourcegraph-cli`, a small HTTP client for the same routes |

The website's **Connect** page always shows ready-to-copy configuration for the instance you are on, including the right address and whether a token is needed. Prefer it over hand-written examples when they differ.
<!-- /context:section -->

<!-- context:section id="mcp" -->
## Connect your Agent for Context

1. If the instance needs a credential, sign in and create a personal API key (see [Choose a credential](#choose-a-credential)). The public demo needs none.
2. Open the site's **Connect** page and copy the configuration for your Agent host; it shows the equivalent command or file for Claude Code, Codex and Cursor.
3. Keep the server name `context-sourcegraph`. That is the name Context's query Skill looks for when it reads cited code, as described in [Reading Code Evidence Remotely](../querying-knowledge/reading-code-evidence-remotely.md).

For any other client that supports Streamable HTTP, point it at the `/mcp` endpoint. For the public demo:

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

For an instance that needs a credential, add `"headers": { "Authorization": "Bearer <token>" }`. The optional `plugins` query parameter controls repository plugins for the whole connection: `auto` (default selection), `off`, or up to 16 comma-separated plugin names. Anonymous connections and personal keys get the read-only tools; `prepare` appears only for the service token and for administrator keys allowed to prepare. Use MCP tool discovery for the current input schemas — the [HTTP and MCP](../../product/reference/source-graph/http-and-mcp.md) reference lists them.
<!-- /context:section -->

<!-- context:section id="missing-repository" -->
## Missing a repository?

If search or reading cannot find a repository you need, it is probably not registered on that instance yet. Registration needs an administrator, and a private repository also needs a token for its code source so the service can fetch it. Ask the instance's administrator, or, on your own instance, register it yourself as described in [Registering Repositories](registering-repositories.md).
<!-- /context:section -->

<!-- context:section id="credentials" -->

## Choose a credential

| Credential | How to get it | What it allows |
| --- | --- | --- |
| None (anonymous) | — | Read-only access to repositories marked public, when the site allows public reading; rate-limited per client |
| Personal API key (`sgk_…`) | Sign in, open your user settings and create an API token | The same reads as your account, over HTTP or MCP. Administrators can create keys that may also request indexing over MCP |
| Service token | The instance's service credential, at least 32 characters. `SOURCEGRAPH_API_TOKEN` seeds it on first start (it is generated when unset); afterwards the value saved in the database is used | Every HTTP and MCP operation, including registration and indexing — for automation you control |

Send keys and tokens as `Authorization: Bearer <value>`. An invalid credential is rejected with `AUTHENTICATION_REQUIRED`; it never falls back to anonymous access. Keep credentials in your client's secret store or environment, never in shared configuration files. [Authentication and Access Control](authentication-and-access-control.md) explains each mode in detail.

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
3. **Read** the decisive ranges at that commit — directly when the file is known, several at once with `read_many`. Keep the repository, full commit SHA and path together for each range, use paths returned by search or list, and group a `read_many` call by repository and commit; `end_line` is an absolute line number, not a count.
4. **Continue** from the returned next line if the file goes on, and treat `Partial`, `Truncated` and coverage flags as limits, not as proof that something is absent.

List repositories or resolve the revision only when the repository is unknown or a request fails, not before every query. If a request fails — for example `409 INDEX_NOT_READY` when a commit has not been indexed yet — look up the code in [Operations](operations.md#common-errors) for what it means and what to do.

<!-- /context:section -->
