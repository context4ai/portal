---
title: Planning Large Projects in Stages
description: When a Context task counts as large, how the Agent researches it
  and splits it into stages, what to check in the PLAN report, how big a stage
  may be, and how to steer, resume and finish.
type: Guide
timestamp: 2026-11-24T21:42:41.958Z
---
# Planning Large Projects in Stages

<!-- context:section id="goal" -->
A large knowledge project is easier to get right in bounded pieces. **Plan mode**, the `context-plan` Skill, researches the whole scope, proposes a **PLAN report** that divides the work into **stages**, and then runs one stage at a time through the ordinary workflow. Each stage still gets its own [work-start report](start-reports.md), writing and review.

```mermaid
flowchart TD
  ask["You describe the project"] --> research["Agent researches the scope"]
  research --> plan["PLAN report"]
  plan -->|"you approve"| stage["Run one stage"]
  stage --> deliver["Write, review, build"]
  deliver -->|"results recorded in the PLAN"| next{"More stages?"}
  next -->|yes| stage
  next -->|no| close["PLAN removed in the final commit"]
```
<!-- /context:section -->

<!-- context:section id="when" -->
## When a task is large

Plan in stages when the scope has **more than 30 source documents, or at least two repositories that need real investigation**, or for a broad update across source versions. Starting a new knowledge project whose scope still needs research is also a good reason to plan first. Small bounded tasks go straight through `/c4a:context`.

Ask for it explicitly, continue an existing PLAN, or let `/c4a:context` hand over when an authorized task crosses the threshold:

```text
/c4a:context-plan Build a knowledge base for our three payment services and the
design folder. Readers are new backend engineers. Plan it in stages and report
after each stage.
```

In Cursor the command is `/c4a-context-plan`. A very large monorepo with several business directions may be better served by one knowledge workspace per direction; plan mode does not split or migrate existing knowledge workspaces on its own.
<!-- /context:section -->

<!-- context:section id="research" -->
## What happens during research

The Agent works in scratch space that stays out of Git. **It first settles the purpose and constraints.** It reads what you already supplied — meeting notes, proposals, a filled source checklist, earlier PLANs — and then asks, in one exchange, only what is still unknown:

- where knowledge lives today and who maintains it, and whether it stays maintained there or moves into the knowledge workspace;
- what must keep its original wording;
- who reads the result (coding Agents, Q&A, on-call, onboarding) and whether different readers need separate packages;
- structural limits such as keeping the existing top-level sections.

"Not decided yet" is a valid answer; it is recorded as an open decision and does not hold up research. The answers become the criteria the research and the report are judged by.

The Agent then starts from directory listings, versions and existing coverage, reads representative material and code entry points, and expands only as far as needed to divide the work. A branch or "latest" is pinned to an exact commit before it is used as evidence, and the PLAN keeps enough about each source to resume even if the scratch files disappear.

Before proposing any article, it reads how the knowledge workspace is organized today and the relevant approved pages, and decides per topic: **reuse unchanged**, **revise or extend**, **consolidate**, **add**, or **investigate** an unresolved conflict or access gap. Research never changes approved knowledge.

**When you bring existing knowledge collections** — a wiki or knowledge repository, a documentation directory, another workspace or a published package — the Agent also identifies each one's kind and its real upstreams, and audits about ten concrete claims per collection against code at a fixed revision. Each claim is consistent, partly consistent, inconsistent or unverifiable, and problems are grouped into *written wrong* and *went stale*. From that evidence it scores how to bring each collection in; the choices are described in [Migrating an Existing Knowledge Base](../practices/migrating-a-knowledge-base.md).

For a broad source update, each repository is compared between the version the knowledge was built from and the new one, looking only at the files the approved articles actually cite. A changed file is a reason to investigate, not proof that an article must be rewritten.

Planning asks once whether a prepared source checklist exists and takes its link. The `context` Skill carries a template under `references/source-checklist.md`. It is never required — without one, planning continues from the conversation.
<!-- /context:section -->

<!-- context:section id="report" -->
## Reading the PLAN report

When you must choose between approaches, or the research covers existing knowledge collections, the Agent first gives you a **research report**: a single-page HTML document built from Markdown chapters with the template bundled in the Skill (`templates/research-report/build.mjs`, no dependencies). It puts the conclusions first — the current state, the recommendation per collection with its benefit next to its cost, and the next steps — followed by the approaches and their scores, the recommended plan, the impact on navigation, the packages and their articles, a comparison with existing knowledge, the audit results and the background. Each chapter opens with its own conclusion. Decisions you make while discussing it are recorded in the PLAN before you are asked to approve.

The PLAN itself is ordinary Markdown at the project's Git root. Check each part:

| Section | What to check |
| --- | --- |
| Outcome and current position | The readers and requested outcome are yours; the knowledge workspace and repository are right |
| Purpose, constraints and decisions | Your answers, what was derived from documents, the decision log and the open decisions are recorded as you meant them |
| Research scope and findings | Every source you meant is listed with an exact version; access gaps are named, not hidden |
| Existing knowledge collections | Each collection's kind, maintenance, upstreams, unique content, audit result and chosen approach with its reason |
| Existing knowledge and material relationships | Overlaps with pages you already have are reused or revised, not duplicated |
| Target structure and packages | The navigation changes and each package's audience and articles |
| Proposed stages | Each stage has a clear reader outcome, its sources and versions, and sensible prerequisites |
| Approval and execution choices | Review, progress reporting, publishing destination and Git process match what you intend |
| Current stage | What the next stage covers and which decisions it must preserve |
| Results | What each finished stage actually produced, reviewed, published and committed |
| Resume notes | The exact position and next action if work is interrupted |

To change it, say so — *"split S03 into references and guides"*, *"drop the legacy folder"*. Approving the PLAN does not approve any article, source permission, Git operation or publication.
<!-- /context:section -->

<!-- context:section id="limits" -->
## Stage size and large scopes

This is the one place these limits are kept:

| Boundary | Default |
| --- | --- |
| Source documents per stage | Recommended 30; never more than 50, with the reason recorded in the PLAN for groups above 30 |
| New repository investigation | One repository per stage; repositories studied earlier may support later stages |
| Revision stage | At most 30 target articles |
| More than 100 documents | The Agent checks with you whether bounded research can establish a useful scope |
| More than 500 documents | The whole task pauses until a person narrows the scope or explicitly keeps all of it |

These are planning boundaries the Agent follows, not hard stops in the tool. Filters you may be offered include selected directories or domains, excluding archives, a recent-update cutoff with its date, or durable documentation only. Nothing is excluded silently. The 500-document pause cannot be lifted by delegation, fully managed mode or a scheduled trigger.
<!-- /context:section -->

<!-- context:section id="review" -->
## Who reviews the PLAN

The Agent asks you to review the PLAN by default, including in fully managed mode. You can hand this review to the Agent for one task (see [Fully Managed Mode](managed-mode-and-review-policy.md)); it then reads the whole report, checks scope, stage limits, dependencies, overlaps, evidence gaps and publishing settings, and fixes what is missing before recording its decision. Article review is separate: delegating the PLAN review does not change how pages are reviewed.

The Agent also settles how you want to hear about progress: once after all stages, or after each stage — and for stage reports, whether to continue automatically or wait for your reply. A research-only request stops at the report; running the plan needs your explicit go-ahead.
<!-- /context:section -->

<!-- context:section id="steer" -->
## Steer early

On a large task, preview the work-start report and the first changed pages as soon as they exist. If the wording, examples or style are off, say so with counter-examples. Corrections made in the first stage carry into every later stage; the earlier you correct, the higher the final quality.
<!-- /context:section -->

<!-- context:section id="stages" -->
## Running the stages

Each stage runs the ordinary workflow for its own scope only, carrying the sources, target articles, reuse and revision decisions, and the review, reporting and publishing choices from the approved PLAN.

After each stage the Agent records what actually happened — research, writing, review, merge and publishing — in the PLAN and commits it before the next stage begins. A stage that must be published counts as done only after publication succeeds; a local build or an open merge request is not publication. Before the next stage, the Agent rechecks the affected knowledge, including pages from earlier stages, so nothing is recreated or overwritten.
<!-- /context:section -->

<!-- context:section id="resume" -->
## Interruptions and finishing

If a session ends, the PLAN keeps the current position and next action. Open a new conversation in the same knowledge workspace and invoke `/c4a:context-plan`; it resumes the current stage instead of repeating the project-wide research. A delegated PLAN review saved in the PLAN is only a record: on resume, the Agent honors it only if your instructions for the task still grant it.

When every agreed stage is finished and merged, the PLAN is removed in the final commit. Its history stays in Git.
<!-- /context:section -->
