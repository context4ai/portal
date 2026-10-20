---
title: Best Practices
description: A short checklist of habits that make Context knowledge production
  go well, each linked to the guide that explains it, plus how to keep upstream
  documents honest when they lag behind code.
type: Guide
timestamp: 2026-10-19T18:48:05.928Z
---
# Best Practices

<!-- context:section id="goal" -->
These habits come from teams using Context to build knowledge for large engineering organizations. Most of them are about one thing: **correct course early**, while it is cheap. Each line links to the guide that explains it.

## Checklist
<!-- /context:section -->

<!-- context:section id="start" -->
- **Talk first, then start.** Describe what the knowledge should cover, where it comes from — document links, repository addresses, the modules you care about — and what form you expect. Let the Agent ask back until it writes a work-start report for you to confirm. See [Confirming the Work-Start Report](../planning-and-production/start-reports.md).
- **Screen many mixed-quality sources before registering them.** When the first knowledge base starts from a large wiki, years of designs or several repositories, let the Agent explore the code, check the documents against it and settle the site structure first. See [Cold-Starting a Knowledge Base](cold-start.md).
- **Check the outputs when a round ends.** Look at the package and the site; the Agent commits the workspace to Git when the round ends. See [Starting a New Task and Saving Your Work](../workspace-maintenance/preparing.md).
<!-- /context:section -->

<!-- context:section id="preview" -->
- **Preview early, correct with examples.** On a large task, open the changed pages as soon as they are available. If something is off, show the wording you want, a counterexample or the style. See [Revising a Page](../review-and-revision/revising-a-page.md).
<!-- /context:section -->

<!-- context:section id="review" -->
- **Ask three questions of every review report.** Does the structure match what you expected? Does the content? Is anything missing from the scope, or included that should be left out? See [Reading Review Reports](../review-and-revision/reading-review-reports.md).
<!-- /context:section -->

<!-- context:section id="reorganize" -->
- **Reorganize once the knowledge grows.** First-version titles and directories are rarely ideal. Ask the Agent to propose a clearer directory and article structure from the approved knowledge; revising costs far less than producing again. See [Reorganizing at Scale](../review-and-revision/reorganizing-at-scale.md).
<!-- /context:section -->

<!-- context:section id="batches" -->
- **Split very large work into stages.** Plan first, then produce, publish and commit one batch at a time. See [Planning Large Projects in Stages](../planning-and-production/planning-large-projects.md).
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
