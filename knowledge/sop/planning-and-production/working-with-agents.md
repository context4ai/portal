---
title: Working with Agents
description: How to brief the Agent, what it decides versus what it asks you,
  how to follow progress, add material mid-task, resume after an interruption
  and use several Agents.
type: Guide
timestamp: 2026-10-12T16:07:52.846Z
---
# Working with Agents

<!-- context:section id="goal" -->
You drive Context through your Agent, not through the CLI. Invoke `/c4a:context` (Cursor: `/c4a-context`), describe the knowledge in normal language, and answer the decisions it brings back. The Agent reads the workflow's current Route from the CLI, runs the returned commands and writes the pages; the CLI validates sources and page identities, derives paths and owns Review, `knowledge/` and `dist/`.

Ordinary coding or design conversations never start Context on their own; invoke it explicitly, or continue a conversation where it is already active.
<!-- /context:section -->

<!-- context:section id="brief" -->
## Brief it well

The more the first message settles, the fewer questions follow. Cover:

- **Readers and questions** — who will use the knowledge and what they need to answer.
- **Sources** — repositories, modules, document folders or links, and what to skip.
- **Output** — a package for Agents, a website, or both, and the language.

```text
/c4a:context Initialize a Context knowledge workspace in ./kb and build knowledge for
../billing-service and ../docs/billing. Readers are on-call engineers who need
to diagnose failed invoices. Skip the legacy-export module. Investigate first,
then give me the work-start report.
```

Answers you have already given are reused for the rest of the task, not asked again at every step.
<!-- /context:section -->

<!-- context:section id="who-decides" -->
## What it asks you, and what it decides

| You decide | The Agent decides |
| --- | --- |
| Which sources and modules are in scope | Which Indexer Skills to use |
| Which readers and questions matter | Topics, page boundaries and organization within the approved plan |
| Whether two subjects are the same knowledge owner | Wording and structure of each page |
| Whether a custom Indexer or executable extension is acceptable | Mechanical steps returned by the Route |
| Whether the outline and the candidate pages are approved | — |

Even in fully managed mode the Agent asks when missing purpose or scope would change the outcome. Before indexing a large boundary it identifies obsolete or irrelevant areas with you from the actual material, rather than guessing from names.
<!-- /context:section -->

<!-- context:section id="progress" -->
## Following progress

Production is the long phase — roughly a minute per article task on average. The Agent reports progress against the task total, and you can ask for a local preview at any time. Transition reports stay short: what changed, the current state and the next decision.

Look at the work-start report and the first changed pages early. If something is off — tone, a counterexample, a style rule — say so. The earlier a correction lands, the better the final result.
<!-- /context:section -->

<!-- context:section id="mid-task" -->
## Adding material or changing course

Say it in the conversation:

```text
Add ../docs/refunds to the sources, re-plan the affected part and give me a
new work-start report.
```

New material within the confirmed purpose becomes a plan amendment that keeps completed work; a new purpose or source still goes back through your confirmation. To correct a page, see [Revising a Page](../review-and-revision/revising-a-page.md).
<!-- /context:section -->

<!-- context:section id="resume" -->
## Interruptions and resuming

Workflow state lives in the knowledge workspace, not in the conversation. After a closed session or a crash, open a new conversation in the same knowledge workspace and invoke `/c4a:context`; the Agent reads the current Route and continues. Accepted tasks are never resubmitted, and deleting temporary runtime files is not a way to restart — it does not authorize replaying accepted work.
<!-- /context:section -->

<!-- context:section id="multi" -->
## Several Agents in parallel

When your host can coordinate child Agents, the work can be split across them. The CLI decides which batches are eligible; each worker writes only its assigned drafts, and one coordinator submits everything to Context. Without that capability the Agent uses a single batch — no simulated workers. Parallelism never waives a decision that is yours.
<!-- /context:section -->

<!-- context:section id="git" -->
## Git and publishing

Completing Context work does not authorize Git operations. The Agent stages, commits, pushes, publishes or deploys only when you ask.
<!-- /context:section -->
