---
title: What Is Source Graph
description: What Context Source Graph is, the problem it solves for AI Agents
  reading code, how it pairs with Context, when it is worth connecting and how
  to start with the live demo or your own instance.
type: Guide
timestamp: 2026-10-14T00:29:03.049Z
---
# What Is Source Graph

<!-- context:section id="purpose" -->
**Context Source Graph lets people, scripts and AI Agents search and read code at an exact Git commit without cloning the repository.** Answers come back in milliseconds from a prepared index, and every result names the commit it was read from, so the same question gets the same evidence.

It is open source and self-hosted. A public, read-only [live demo](https://context4ai.org/sourcegraph/) indexes `context4ai/context` and `context4ai/sourcegraph`.
<!-- /context:section -->

<!-- context:section id="problem" -->
## The problem it solves

An Agent answering a question about code usually needs a handful of exact lines, not a whole repository. Its work is many small, precise rounds of *search, then read* against code it does not have checked out. Cloning every repository into every Agent sandbox at the right revision is slow, and running `rg` or `git grep` over a checkout repeats the same full scan on every call.

Source Graph moves that work ahead of the question: it keeps each registered repository mirrored and indexed in the background, so a query reads a prepared index instead of scanning a working tree. The gap widens as repositories grow.
<!-- /context:section -->

<!-- context:section id="what" -->
## What you get

- **Fast search.** Indexed search typically completes in under 5 ms on the server; in the same region as its callers, a full request including the network stays well under 100 ms. On the demo, a literal search that takes `rg` about 61 ms over a local checkout returns in about 1 ms. [Pinned Search and Reads](../../architecture/source-graph/pinned-search-and-reads.md) explains where the speed comes from.
- **Reproducible reads.** Branches and tags resolve to one commit before anything is read, so a search hit, the file it points to and a later diff describe the same snapshot.
- **Ready for Agents.** The same operations — list repositories, search, read one range or several, list a directory, diff two commits — are available on a website, an HTTP API, an MCP server and a command-line client. Any MCP client that speaks Streamable HTTP can connect, and anonymous access is read-only and limited to public repositories.
- **Small footprint.** One process manages the Git mirrors, the search engine and background indexing. SQLite is the default database; PostgreSQL and MongoDB are supported.
<!-- /context:section -->

<!-- context:section id="context" -->
## How it works with Context

Context knowledge pages point back to the code that supports each statement. When an Agent answers with Context, its query Skill reads that original code to confirm the answer. In the default `auto` mode it uses an authorized `context-sourcegraph` MCP server when one is configured, and otherwise falls back to local retrieval: a shallow, sparse partial clone of the recorded commit searched with grep or rg.

So Source Graph is **optional** for Context. Connect it when you want Agents to read pinned code remotely, without local checkouts or clone time. Repositories can also ship reading plugins (`<name>.sourcegraph.wasm`) that add information to `read` results; Context uses one so that reading a knowledge page through Source Graph also returns the sources each section was written from — see [Evidence for Context](../../architecture/source-graph/evidence-for-context.md).
<!-- /context:section -->

<!-- context:section id="when" -->
## When it is worth connecting

Connect Source Graph when Agents or scripts regularly need code from repositories they do not have locally, when answers must cite an exact commit, or when the same repositories are queried many times a day. A local checkout remains simpler for code you are editing right now.

Source Graph is a text search and reading service at fixed revisions. Each instance owns its mirrors and indexes on local disk; it scales by giving instances disjoint sets of repositories, not by running replicas over the same data.
<!-- /context:section -->

<!-- context:section id="start" -->
## Start in three steps

1. **Try the live demo.** Open [https://context4ai.org/sourcegraph/](https://context4ai.org/sourcegraph/) and search or read code in the browser; no account is needed.
2. **Connect your Agent.** Open the site's **Connect** page and copy the configuration for your Agent host, or point any Streamable HTTP MCP client at `https://context4ai.org/sourcegraph/mcp`. [Connecting](connecting.md) covers MCP, HTTP, the CLI and credentials.
3. **Run your own instance for your repositories.** Start it with Docker, add Google or GitHub sign-in, and the first verified user becomes the administrator who registers repositories. [Self-Hosting](self-hosting.md) and [Registering Repositories](registering-repositories.md) walk through both.
<!-- /context:section -->

<!-- context:section id="next" -->
## Where to go next

| To… | Read |
| --- | --- |
| Connect an MCP client, script or the CLI | [Connecting](connecting.md) |
| Add repositories and monorepo path groups | [Registering Repositories](registering-repositories.md) |
| Understand how the service is built | [Architecture Overview](../../architecture/source-graph/overview.md) and [Pinned Search and Reads](../../architecture/source-graph/pinned-search-and-reads.md) |
| Deploy, secure and operate your own instance | [Self-Hosting](self-hosting.md), [Deployment Recommendations](deployment-recommendations.md), [Authentication and Access Control](authentication-and-access-control.md) and [Operations](operations.md) |
| Look up routes, tools, flags and settings | [HTTP and MCP](../../product/reference/source-graph/http-and-mcp.md), [CLI](../../product/reference/source-graph/cli.md), [Query Syntax](../../product/reference/source-graph/query-syntax.md) and [Configuration](../../product/reference/source-graph/configuration.md) |
<!-- /context:section -->
