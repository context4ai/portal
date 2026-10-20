---
title: Reading Code Evidence Remotely
description: Let your Agent read cited knowledge and code at their pinned
  commits through Source Graph, with each section's sources attached, so answers
  are checked against the original code without cloning.
type: Guide
timestamp: 2026-10-19T18:55:52.431Z
---
# Reading Code Evidence Remotely

<!-- context:section id="goal" -->
Answering from knowledge sometimes needs the code behind it. Cloning repositories into every Agent sandbox is slow; instead, your Agent can read both the knowledge workspace and the source code through Source Graph, a read-only code service, at exactly the commit the knowledge cites, and get each section's sources attached to what it reads.

> **Source Graph is optional.** You do not need to install or configure it. Without it, your Agent still checks answers against code by reading it locally: it makes a small partial clone of the cited commit and searches that. By default it uses Source Graph only when an authorized instance is connected.
<!-- /context:section -->

<!-- context:section id="enable" -->
## Turn it on

1. **Connect your Agent host to Source Graph** over MCP, naming the server `context-sourcegraph` so the query Skill can find it. [Connecting](../source-graph/connecting.md) walks through the Connect page and the credential you may need. The instance must cover the knowledge workspace and its source repositories; if one is missing, see [Registering Repositories](../source-graph/registering-repositories.md).
2. **Choose how strictly to read remotely.** By default your Agent reuses suitable local material, otherwise prefers Source Graph before any local checkout. You can also have it read only through Source Graph and never clone, even on failure, or only locally with no service at all. An explicit request in your conversation, such as "work offline", always wins. The setting comes from your Agent host or Bot configuration; [Asking Questions](asking-questions.md) lists it with the other query settings.

Endpoints and credentials belong to your Agent host's configuration, never to the Skill or the knowledge itself. On the Context side nothing else needs configuring: the evidence plugin ships compiled with the CLI.
<!-- /context:section -->

<!-- context:section id="read" -->
## What you get

- **Answers checked at the cited commit.** Your Agent reads the knowledge pages at one pinned commit, then reads only the code ranges that decide the answer at each source's recorded commit. The knowledge commit and each source commit are kept separate, and neither is swapped for a newer default branch.
- **Sources attached to every page read.** Each knowledge page your Agent reads comes back with the sources its sections were written from, as commit-specific links where the code host supports it, so the Agent can go straight to the code.
- **No clone time.** Nothing is checked out in the Agent's sandbox.
<!-- /context:section -->

<!-- context:section id="limits" -->
## How it works and what can go wrong

The sources come from the optional **context-evidence** plugin, a small read-only WebAssembly module that runs inside Source Graph and joins each section of a knowledge page to its recorded sources. It does not check source contents, search code or change knowledge, and a listed source shows where a statement came from; it does not prove the source was reread in this answer. [Evidence for Context](../../architecture/source-graph/evidence-for-context.md) explains the plugin in detail.

If Source Graph or the plugin is unavailable, your Agent keeps what it could read and continues. By default it may fall back to reading locally; if you asked for remote reading only, it qualifies the affected parts of the answer instead of cloning.
<!-- /context:section -->

<!-- context:section id="next" -->
## Running the service

Registering repositories, monorepo path groups, self-hosting, authentication and day-to-day operations are covered in the other Source Graph guides. Start with [What Is Source Graph](../source-graph/introduction.md).
<!-- /context:section -->
