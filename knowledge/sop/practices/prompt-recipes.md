---
title: Prompt Recipes
description: Example phrasing for common Context requests — starting, adding
  material, revising, reorganizing, updating, evaluating, migrating, planning,
  building and asking.
type: Guide
timestamp: 2026-10-12T17:02:32.263Z
---
# Prompt Recipes

<!-- context:section id="goal" -->
You drive Context by talking to your Agent. These are phrasings that work for common requests; replace the placeholders in angle brackets. Each one is a starting point — the Agent researches, asks back where needed, and stops at the decisions that are yours.
<!-- /context:section -->

<!-- context:section id="produce" -->
## Producing and revising

| You want to | Say | What happens |
| --- | --- | --- |
| Start | "Initialize a Context knowledge workspace in `<directory>` and build knowledge for `<repository or module>` and `<document link>`. Research first, then give me the work-start report." | Workspace setup, source research, then a work-start report for you to confirm |
| Add material | "Add `<new material>` as a source, re-plan the affected parts and give me a new work-start report." | Source registration and a revised plan |
| Revise | "Revise `<article>`: `<problem>`. Keep the source references." | A revision task and a review report for the changed page |
| Reorganize | "Research the approved knowledge again and propose a more intuitive directory and title structure. Revise after I confirm." | A structure proposal, then revisions |
| Plan a large project | "Plan a knowledge project for `<repositories and documents>`." | The `context-plan` Skill researches and writes a `PLAN-*.md` for review |
<!-- /context:section -->

<!-- context:section id="maintain" -->
## Updating, evaluating and migrating

| You want to | Say | What happens |
| --- | --- | --- |
| Update | "The sources have moved to `<version>`. Find the affected knowledge and review the updates." | Impact assessment, targeted revisions, a review report |
| Evaluate | "Evaluate the current knowledge base with `<question set>`, grade each answer on the four-level criteria and give me P50/P90." | An evaluation run with grades and timings |
| Migrate | "Research what Context can do, then migrate the current knowledge base …" | See [Migrating an Existing Knowledge Base](./migrating-a-knowledge-base.md) for the full prompt |
<!-- /context:section -->

<!-- context:section id="deliver" -->
## Building and asking

| You want to | Say | What happens |
| --- | --- | --- |
| Build and preview | "Build the knowledge package and documentation site, and give me a local preview." | `context build`, then a local HTTP preview whose URL is checked before it is shared; publishing to hosting needs your separate authorization |
| Ask a question | "Using the `<package>` knowledge, how does `<feature>` work?" | `context-inspect-search` answers from the knowledge with sources and reports gaps |

The commands and Skills behind these requests are listed in [Commands and Skills](../../product/getting-started/commands-and-skills.md).
<!-- /context:section -->
