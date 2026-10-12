---
title: What is Context
description: Context turns code, documents, notes and conversations into
  reviewed, traceable knowledge for Agents, Bots and people.
type: Wiki
timestamp: 2026-10-12T20:24:32.970Z
---
# What is Context

<!-- context:section id="definition" -->

Context is a knowledge workflow for engineering teams and their AI agents. It turns code repositories, documents, notes and conversations into reviewed, versioned knowledge in which every claim leads back to its source, then builds that knowledge into Agent knowledge packages, documentation sites and LLM documents. Agents read the knowledge first and follow its evidence chain to the original only when they need exact detail.

You describe what knowledge you need and where the material lives. Your Agent reads the evidence, proposes a structure and explains its decisions. Context keeps the process legal and repeatable: it records source boundaries, checks evidence coverage, stages reviewable candidates, preserves provenance, verifies the approved result and builds the output you chose.

<!-- /context:section -->

<!-- context:section id="overview" -->
## How it fits together

The diagram shows the path from material to the people and Agents who ask questions.

```mermaid
flowchart LR
  src["Code, documents, notes, sessions"] -->|registered and captured| agent["Your Agent with Context skills"]
  agent -->|writes candidates| review["Human review"]
  review -->|approves| kb["Approved knowledge"]
  kb -->|builds| out["Package, site, LLM Docs"]
  out -->|answers with sources| users["Agents, Bots, developers"]
```

Context is not a one-shot summarizer. Source snapshots, review state, approved knowledge and package inventories stay in a local Context knowledge workspace, so the result can be inspected, versioned and refreshed when sources change.
<!-- /context:section -->

<!-- context:section id="pillars" -->
## What makes it different

- **An index with evidence chains, not copied prose.** Indexers keep only what answers a reader's questions and record where each statement came from. In one large production monorepo, about 202 MB of code and documents became about 1.75 MB of reviewed knowledge, roughly 1/115 of the source volume. See [Knowledge for Agents](../../architecture/knowledge/knowledge-for-agents.md) and [Evidence Chains and Index First](../../architecture/knowledge/evidence-chains.md).
- **Skills and a CLI inside the Agents you already use.** Context does not call an LLM and is not a hosted platform. Its skills run in Claude Code, Codex, Cursor or a managed Agent, and the local CLI performs the deterministic work. See [Why a Workflow](../../architecture/context/why-a-workflow.md).
- **Review before anything is published.** People own the goal, source permission, structure and review decisions; drafts become approved Markdown only after review. See [Knowledge Lifecycle](../../architecture/context/knowledge-lifecycle.md).
- **Knowledge that follows its sources.** Sources are pinned, and a later change reopens only the affected pages. See [Keeping Knowledge Current](../../architecture/knowledge/keeping-knowledge-current.md).
- **One body of knowledge, several outputs.** The same approved pages build an Agent knowledge package, a documentation site and LLM Docs, each mapped back to the knowledge workspace through a build inventory. See [Packages and Sites](../../architecture/context/packages-and-sites.md).
<!-- /context:section -->

<!-- context:section id="who" -->
## Who it is for

Context helps when knowledge exists but is not yet ready for an Agent to use. Typical requests:

- turn product, architecture, operations or FAQ documents into a navigable knowledge base;
- connect code structure with explanatory documents while keeping exact source evidence;
- combine several repositories and document sets into one reviewed knowledge package;
- update an existing knowledge workspace when its sources change, without rebuilding everything.

In a measured comparison on real developer questions, Agents answering from Context knowledge fully solved more questions with far fewer tool calls than with an LLM Wiki; see [Knowledge Retrieval benchmark](../../architecture/benchmark/knowledge-retrieval.md).
<!-- /context:section -->

<!-- context:section id="companions" -->

## Source Graph and Agent Graph

Two companion projects carry parts of the workflow:

- **Source Graph** searches and reads repositories at a pinned commit over the web, MCP, HTTP and a CLI. Context ships an optional evidence plugin so that an Agent reading code through Source Graph also receives the knowledge sections that cite it, without cloning the repository. See the [Source Graph overview](../../architecture/source-graph/overview.md).
- **Agent Graph** is the work-contract layer under the Context workflow. Context observes knowledge workspace facts and executes actions; Agent Graph evaluates those facts and selects the next legal step, which keeps a long workflow resumable and testable. See [Why Graph Engineering](../../architecture/agent-graph/why-graph-engineering.md) and [Workflow Execution](../../architecture/context/workflow-execution.md).

<!-- /context:section -->

<!-- context:section id="delivery" -->

## How you get it

Context is delivered as an npm CLI plus an Agent plugin. Install both once, restart the Agent session, then describe the knowledge goal to the `/c4a:context` entry in plain language. Continue with [Installation](installation.md) and [Quick Start](quick-start.md).

<!-- /context:section -->
