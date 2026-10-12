---
title: Best Practices
description: Habits that make Context knowledge production go well — from the
  first conversation and early previews to review, reorganizing and keeping
  upstream documents honest.
type: Guide
timestamp: 2026-10-12T17:02:32.263Z
---
# Best Practices

<!-- context:section id="goal" -->
These practices come from teams using Context to build knowledge for large engineering organizations. Most of them are about one thing: **correct course early**, while it is cheap.
<!-- /context:section -->

<!-- context:section id="start" -->
## Talk first, then start

After initializing the Context knowledge workspace, have a free conversation before any production. Explain what the knowledge should cover, where it comes from — document links, repository addresses, the modules you care about — and what form you expect. The Agent researches and asks back until it can write a **work-start report**: the confirmed configuration and scope, the planned content, and the expected package or site layout. See [Start Reports](../planning-and-production/start-reports.md).

Production then takes time — on average about one minute per task. The Agent keeps reporting progress and the total number of tasks, and you can ask for a local preview at any point. After publication, check the package and other outputs; the Agent commits the workspace to Git to close the production.
<!-- /context:section -->

<!-- context:section id="preview" -->
## Preview early, correct with examples

On a large task, open the work-start report and the changed pages as soon as they are available. If something is off, ask for a revision and be specific: show the wording you want, give a counterexample, describe the style. The earlier you correct, the better the final quality.
<!-- /context:section -->

<!-- context:section id="review" -->
## Three questions for every review

The review report decides the scope and quality of what gets approved. Read it with three questions:

1. Does the **structure** — topics, directories, documents — match what you expected?
2. Does the **content** — the intent of each article, its style — match what you expected?
3. Is anything relevant still **missing from the scope**, or included that should be left out?

See [Reading Review Reports](../review-and-revision/reading-review-reports.md).
<!-- /context:section -->

<!-- context:section id="reorganize" -->
## Reorganize once the knowledge grows

First-version titles tend to be abstract, and directory names and structure are rarely ideal. Once the knowledge has grown, ask the Agent to research the approved knowledge again and propose a more readable, intuitive directory and article structure — it does this better now than it could during planning. Revise, then observe for another round. Revising costs far less than producing again and suits fine-tuning of both structure and content. See [Reorganizing at Scale](../review-and-revision/reorganizing-at-scale.md).
<!-- /context:section -->

<!-- context:section id="upstream" -->
## When documents lag behind code

Production cross-checks sources, and documents lagging behind code is normal. By default the Agent revises the knowledge to match the code. To fix the upstream documents as well, add a rule at the start of the task or in the workspace `AGENTS.md`:

```text
When a revision is caused by a document lagging behind code, record it in
update-remote/<date>-<topic>.md with the context, the judgment and a suggested fix.
After the task, work through update-remote: find each upstream document and
revise it, or give a concise suggested fix for the user to decide.
```

Upstream documents then stay current and the knowledge does not drift away from them. See [Writing Back Upstream](../updates-and-versions/writing-back-upstream.md).
<!-- /context:section -->

<!-- context:section id="batches" -->
## Split very large work into batches

A very large task goes through planning first, with at most about 30 to 50 documents per batch. Each batch is produced, published, recorded in the plan file (`PLAN-*.md`) and committed before the next one starts. See [Planning a Large Project](../planning-and-production/planning-large-projects.md).
<!-- /context:section -->
