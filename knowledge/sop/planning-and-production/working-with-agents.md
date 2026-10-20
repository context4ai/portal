---
title: Working with Agents
description: What the Guides cover and who does what, how to brief the Agent,
  which decisions are yours, how to steer early, stop and resume, what happens
  when a round ends, and where to go next in the Guides.
type: Guide
timestamp: 2026-10-20T00:29:39.129Z
---
# Working with Agents

<!-- context:section id="goal" -->
If you have already read [Quick Start](../../product/getting-started/quick-start.md) and the other getting-started pages, the Guides are where you can learn more. Each guide walks through one task you will meet while building and using knowledge: adding material, planning and producing pages, reviewing them, building outputs, answering questions and keeping it all up to date.

From start to finish, everyone has a clear part to play:

| Who | Does what |
| --- | --- |
| **You** | Decide the goal, the readers, the scope and the approvals |
| **The Agent** | Reads the material, proposes a plan, writes the pages and reports back |
| **Context** | Records sources and decisions, checks every page against its evidence, and builds the packages and sites |

You simply talk to the Agent in plain language. Invoke `/c4a:context` (Cursor: `/c4a-context`), describe the knowledge you need and answer the questions it brings back; the Agent runs the commands for you. Context never steps into ordinary coding or design conversations on its own, so invoke it when you want it, or carry on in a conversation where it is already active. For the steps of a task at a glance, see [The Workflow at a Glance](../../product/getting-started/workflow-at-a-glance.md).
<!-- /context:section -->

<!-- context:section id="brief" -->
## Brief the Agent well

A clear first message saves you questions later. Try to cover three things:

- **Readers and questions** — who will use the knowledge and what they need to answer.
- **Sources** — repositories, modules, document folders or links, and what to skip.
- **Output** — a package for Agents, a website, or both, and the language.

```text
/c4a:context Initialize a Context knowledge workspace in ./kb and build knowledge for
../billing-service and ../docs/billing. Readers are on-call engineers who need
to diagnose failed invoices. Skip the legacy-export module. Investigate first,
then give me the work-start report.
```

Anything you have already answered is remembered for the rest of the task, so the Agent will not ask again at every step.
<!-- /context:section -->

<!-- context:section id="who-decides" -->
## The decisions that are yours

| You decide | The Agent decides |
| --- | --- |
| Which sources and modules are in scope | Which Indexer Skills to use |
| Which readers and questions matter | Topics, page boundaries and organization within the approved plan |
| Whether two subjects should be documented as one | Wording and structure of each page |
| Whether a custom Indexer or executable extension is acceptable | The individual steps of the workflow |
| Whether the work-start report and the written pages are approved | — |

Even in [Fully Managed Mode](managed-mode-and-review-policy.md), the Agent still checks with you whenever a missing purpose or scope would change the outcome. Before indexing a large area, it goes through the actual material with you to set aside what is obsolete or irrelevant, rather than judging by names alone.

Your judgment matters most at two moments: the work-start report and the review report. [Confirming the Work-Start Report](start-reports.md) and [Reading Review Reports](../review-and-revision/reading-review-reports.md) show what to look for at each.
<!-- /context:section -->

<!-- context:section id="progress" -->
## Steer and preview early

Writing takes the longest, about a minute per article on average. Along the way the Agent reports progress against the total number of tasks, and you can ask for a local preview whenever you like. Its updates stay short: what changed, where things stand and what needs your decision next.

It pays to look at the [work-start report](start-reports.md) and the first pages early. If something feels off, such as the tone, a missing counterexample or a style rule, just say so. The earlier a correction lands, the better the final result.
<!-- /context:section -->

<!-- context:section id="mid-task" -->
## Add material or change course

Plans can change along the way. Just tell the Agent in the conversation:

```text
Add ../docs/refunds to the sources, re-plan the affected part and give me a
new work-start report.
```

New material that fits the confirmed purpose joins the plan, and finished work is kept. A new purpose or a new kind of source comes back to you for confirmation first. To fix a single page, see [Revising a Page](../review-and-revision/revising-a-page.md).
<!-- /context:section -->


<!-- context:section id="resume" -->
## Stop and resume at any time

Your progress lives in the knowledge workspace, not in the conversation. If you close a session, or it crashes, open a new conversation in the same knowledge workspace and invoke `/c4a:context` again; the Agent picks up right where the work stands, and nothing already accepted is redone. If you want to redo part of the task, ask the Agent rather than deleting files in the workspace.
<!-- /context:section -->

<!-- context:section id="git" -->
## When a round ends

Once you approve the review, the approved pages are applied to `knowledge/` and the outputs rebuilt. The Agent then commits the knowledge workspace to Git, and the round is complete. Pushing, publishing or deploying happens only when you ask.

The knowledge workspace stays ready for the next round. When sources change or you spot a gap, start again with `/c4a:context`, and the Agent reopens only the affected pages.
<!-- /context:section -->

<!-- context:section id="guides-map" -->
## Learn more through these Guides

The Guides follow a knowledge base from its first material to everyday use. Start wherever you need to; each subsection opens with the page linked below.

1. **Planning and Producing** — briefing, the work-start report, large projects and managed mode, starting with this page and [Confirming the Work-Start Report](start-reports.md).
2. **Adding Sources** — which kind of material to add and how: [Choosing How to Add Material](../registering-sources/source-batches.md).
3. **Review and Revision** — judging and correcting pages: [Reading Review Reports](../review-and-revision/reading-review-reports.md).
4. **Outputs and Sites** — packages, documentation sites and LLM Docs: [Knowledge Packages](../outputs-and-sites/knowledge-packages.md).
5. **Using Knowledge** — getting answers from what you built: [Asking Questions](../querying-knowledge/asking-questions.md).
6. **Keeping Knowledge Current** — updates, versions and saving your work: [Updating Knowledge](../updates-and-versions/updating-knowledge.md).
7. **Knowledge Service** — producing and answering for a team: [Building a Knowledge Service](../knowledge-service-agent/building-a-knowledge-service.md).
8. **Custom Indexers** — the Skills that read your material, and making your own: [Built-in Indexers](../custom-indexers/community-indexers.md).
9. **Practices and Evaluation** — habits that work and how to measure the result: [Best Practices](../practices/best-practices.md).
10. **Source Graph** — reading code evidence from a pinned code search service: [What Is Source Graph](../source-graph/introduction.md).
11. **Agent Graph** — the workflow engine behind Context, for Skill authors: [What Is Agent Graph](../agent-graph/introduction.md).
<!-- /context:section -->
