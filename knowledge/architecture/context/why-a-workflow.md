---
title: Why a Workflow
description: Why Context ships as skills and a CLI that run inside your own
  Agents instead of as a hosted knowledge platform.
type: Guide
timestamp: 2026-10-12T20:24:32.970Z
---
# Why a Workflow

<!-- context:section id="premise" -->
## Teams already have Agents

Engineering teams already work in Claude Code, Codex, Cursor or a managed Agent environment, and many run team Bots. A hosted knowledge platform would ask them to move their sources, permissions and review habits somewhere new. Context goes the other way: it adds skills to the Agents a team already uses, and a local CLI does the deterministic work. The same skills run in a local coding Agent or a managed Agent environment.
<!-- /context:section -->

<!-- context:section id="split" -->

## Semantic work and deterministic work

Knowledge production mixes two kinds of work:

| Kind | Examples | Done by |
| --- | --- | --- |
| Semantic | Reading evidence, proposing structure, writing and explaining | The Agent |
| Deterministic | Recording source boundaries, capturing snapshots, indexing code, checking evidence, staging candidates, applying reviews, building | The CLI |
| Decisions | Goal, source permission, scope, structure, review, output | People |

The CLI never calls an LLM and never silently clones, fetches, installs or builds a source repository; registering a source does not grant permission to read its contents, and review decisions stay with people. That keeps the parts that must be repeatable out of the model's hands, while the Agent stays free to choose the best wording and structure.

<!-- /context:section -->

<!-- context:section id="contract" -->
## A workflow, not a long prompt

The lifecycle is long: sources must be scoped and captured, articles written against evidence, human Gates may pause the run, and approved knowledge must be closed, verified and built. Putting all of that in one prompt would be fragile and expensive. Instead the workflow is a contract: at each step the CLI returns only the action that is legal now, the resources to read for it and the commands to run. Interrupting and resuming converge from the actual state of the Context knowledge workspace rather than from conversation memory. See [Workflow Execution](workflow-execution.md).
<!-- /context:section -->

<!-- context:section id="service" -->
## From one person's Agent to a knowledge service

Because the skills are platform-independent, a team can run them as a resident knowledge service: an Agent environment with the Context plugin, a Bot prompt and remote code reading, taking requests from chat, the web, schedules or an API. It produces, updates and answers continuously, and people step in only at the decisions that matter — the work-start report, the review report and scope trade-offs.

Shared knowledge that needs a lot of searching and confirmation, and answers that must be available at any time, suit such a resident service. Knowledge for a small module can simply live in the repository's `docs/`.
<!-- /context:section -->
