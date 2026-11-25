---
title: Migrating an Existing Knowledge Base
description: How to move an existing LLM Wiki, Skills collection or similar
  knowledge base into Context without losing what it already does well, usually
  through a staged plan.
type: Guide
timestamp: 2026-11-25T02:35:51.926Z
---
# Migrating an Existing Knowledge Base

<!-- context:section id="goal" -->
If you already have knowledge — an LLM-maintained wiki, a documentation folder, another knowledge workspace or a published knowledge package — you do not have to start from nothing. Create a knowledge workspace, describe what exists, and let the Agent research it and plan the move. You review a research report and the PLAN before anything is written.

An existing base usually crosses the threshold for a staged plan, so the Agent works through `context-plan`: it settles your purpose and constraints, studies each collection, proposes how to bring each one in, and then runs the stages one at a time, each with its own [work-start report](../planning-and-production/start-reports.md). See [Planning Large Projects in Stages](../planning-and-production/planning-large-projects.md) for how stages are sized and reviewed, and [Cold-Starting a Knowledge Base](cold-start.md) for getting the first sources in.
<!-- /context:section -->

<!-- context:section id="prompt" -->
## The migration prompt

Once the workspace exists, start with:

```text
Research what Context can do, then plan bringing in our existing knowledge:

- Where it lives today, who maintains it, and whether it stays maintained there:
- How it is produced today (scripts, prompts, and so on):
- Content that must keep its wording, and structure that must not change:
- Who reads the result, and whether different readers need separate packages:
- Historical Q&A or an evaluation question set, to show how the knowledge is used

Write a research report, continue up to the PLAN and pause. I will review the
approach and the stages.
```

Answer what you know; "not decided yet" is fine and is recorded as an open decision. The last item matters most: real questions tell the Agent what the knowledge is *for*, and they become your evaluation set later.

## What the research tells you

For each collection the Agent works out:

- **What kind it is** — a mirror of other documents with a summary layer, a raw archive, a wiki written from code, a team's maintained first-hand pages, or a published package — and who maintains it.
- **Where it really comes from** — the documents and repositories its pages were built from, which of them the workspace already has, and what is unique to the collection.
- **How accurate it is** — about ten concrete claims checked against code at a fixed revision, each consistent, partly consistent, inconsistent or unverifiable, with problems grouped into *written wrong* and *went stale*.
- **What it changes** — where its topics would sit in your navigation, conflicts with existing articles, and which articles each package would hold.

The research report opens with the conclusions: the recommendation per collection with its benefit next to its cost. The analysis, scores and evidence follow.
<!-- /context:section -->

<!-- context:section id="sources" -->
## Choosing how each collection comes in

Each collection, or each part of one, gets its own approach, scored against your answers with feasibility, effort and risk shown next to the score:

| Approach | When it fits | What happens to the original |
| --- | --- | --- |
| Produce articles from it | The knowledge should be rewritten for your readers and checked against code; a wiki written from code points to the questions that matter | Can be archived once the workspace maintains the topic |
| Register the original upstream | The collection mirrors or summarizes documents you can register directly; the author's own judgments become notes | The summary layer can stop being maintained |
| Keep pages as written | A team's pages must keep their wording, but should be placed in your sections and checked against code. See [Keeping Pages as Written](../review-and-revision/keeping-pages-as-written.md) | Maintained where it is |
| Follow a published version | Another team publishes the content as versions (a documentation repository or a knowledge package). See [Published and Archived Collections](../registering-sources/versioned-external-content.md) | Follows the publisher |
| Leave it where it is | It serves Agents working in its own repository, or only needs a link | Maintained where it is |

For each collection you also choose between **following** the upstream — registered with fixed versions, so routine updates track it — and **absorbing it once**: the files come in as a document source that keeps its folders, the author's judgments become notes, and the source is frozen when the original is archived.

Packages and navigation are independent. A package selects its articles by path or by explicit list, so it needs no top-level section of its own. Content that belongs only in a package goes under a hidden group in the knowledge map: it stays out of the website menus but remains in the package and LLM Docs. See [Knowledge Packages](../outputs-and-sites/knowledge-packages.md).

Material that stays where it is can still be connected:

- **Document directories** — register a folder of existing documents as a source so its contents are captured and cited. See [Document Directories](../registering-sources/document-directories.md).
- **Same-repository docs and Skills** — documents and authored Skills already kept in the same repository are registered as repository content; the originals stay where they are and Context references them instead of migrating them. See [Linking Existing Docs and Skills](../registering-sources/same-repository-docs.md).
- **External entrances** — content elsewhere that pages should link to, declared without downloading or capturing it. See [External Entrances](../registering-sources/external-entrances.md).

Skills, agents and scripts a collection carries are not knowledge; publish them through your Agent host's Skill distribution instead of packaging them.
<!-- /context:section -->

<!-- context:section id="validate" -->
## Switch over after you have measured

Keep the old knowledge base running until the new one is proven. Run the same question set against both and compare quality, time and tool calls, as described in [Evaluating Your Knowledge Base](./evaluating-your-knowledge-base.md).
<!-- /context:section -->
