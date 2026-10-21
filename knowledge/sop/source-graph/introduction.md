---
title: What Is Source Graph
description: What Context Source Graph is, the problem it solves for AI Agents
  reading code, why it is optional for Context users, when it is worth
  connecting and how to start with the live demo or your own instance.
type: Guide
timestamp: 2026-10-21T12:18:51.603Z
---
# What Is Source Graph

<!-- context:section id="purpose" -->
**Context Source Graph lets people, scripts and AI Agents search and read code at an exact Git commit without cloning the repository.** Answers come back in milliseconds from a prepared index, and every result names the commit it was read from, so the same question gets the same evidence.

It is open source and self-hosted. A public, read-only [live demo](https://context4ai.org/sourcegraph/) serves this site's own Context knowledge workspace, `context4ai/portal`, together with the source code of `context4ai/context`, `context4ai/sourcegraph` and `context4ai/agent-graph`, so you can try both code search and knowledge-first questions right away. The guides in this section cover connecting to an instance, using it with Context, and — for administrators — registering repositories, self-hosting, securing and operating it.
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
No — Source Graph is **optional** for Context. When your Agent answers from Context knowledge, it can confirm the answer against the original code either by reading it locally, from a shallow partial clone of the cited commit, or, when Source Graph is connected, by reading it remotely at that commit without clone time. Connecting it can also return, with each knowledge page the Agent reads, the sources each section was written from. [Reading Code Evidence Remotely](../querying-knowledge/reading-code-evidence-remotely.md) explains how to turn that on and what you get.

Source Graph also works without Context. When an instance holds a team's knowledge repository as well as its code, any MCP client can answer from both with nothing but a retrieval prompt; see [Querying Through MCP in Your Agent](../querying-knowledge/querying-via-mcp.md).
<!-- /context:section -->

<!-- context:section id="when" -->
## When it is worth connecting

Connect Source Graph when Agents or scripts regularly need code from repositories they do not have locally, when answers must cite an exact commit, or when the same repositories are queried many times a day. A local checkout remains simpler for code you are editing right now.

Source Graph is a text search and reading service at fixed revisions. Each instance owns its mirrors and indexes on local disk; it scales by giving instances disjoint sets of repositories, not by running replicas over the same data.
<!-- /context:section -->

<!-- context:section id="start" -->
## Start in three steps

1. **Try the live demo.** Open [https://context4ai.org/sourcegraph/](https://context4ai.org/sourcegraph/) and search or read code in the browser; no account is needed.
2. **Connect your Agent.** Open the site's **Connect** page and copy the configuration for your Agent host. [Connecting](connecting.md) covers MCP, HTTP, the CLI and credentials. To ask questions of this site's knowledge straight away, follow [Querying Through MCP in Your Agent](../querying-knowledge/querying-via-mcp.md).
3. **Run your own instance for your repositories.** Start it with Docker, add Google or GitHub sign-in, and the first verified user becomes the administrator who registers repositories. [Self-Hosting](self-hosting.md) and [Registering Repositories](registering-repositories.md) walk through both.
<!-- /context:section -->

<!-- context:section id="next" -->
## Where to go next

| To… | Read |
| --- | --- |
| Connect your Agent, a script or the CLI | [Connecting](connecting.md) |
| Let Context read cited code without cloning | [Reading Code Evidence Remotely](../querying-knowledge/reading-code-evidence-remotely.md) |
| Answer from a team's knowledge and code in any MCP client | [Querying Through MCP in Your Agent](../querying-knowledge/querying-via-mcp.md) |
| Add repositories and monorepo path groups | [Registering Repositories](registering-repositories.md) |
| Deploy and configure your own instance | [Self-Hosting](self-hosting.md) |
| Set up sign-in and decide who can read | [Authentication and Access Control](authentication-and-access-control.md) |
| Watch health and jobs, and fix common errors | [Operations](operations.md) |
| Understand how the service is built | [Architecture Overview](../../architecture/source-graph/overview.md) and [Pinned Search and Reads](../../architecture/source-graph/pinned-search-and-reads.md) |
| Look up routes, tools, flags and settings | [HTTP and MCP](../../product/reference/source-graph/http-and-mcp.md), [CLI](../../product/reference/source-graph/cli.md), [Query Syntax](../../product/reference/source-graph/query-syntax.md) and [Configuration](../../product/reference/source-graph/configuration.md) |
<!-- /context:section -->
