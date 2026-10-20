---
title: Revising a Page
description: Correct one page, a draft still in review or an already approved
  page, while keeping its identity, URL and source citations.
type: Guide
timestamp: 2026-10-19T18:48:05.928Z
---
# Revising a Page

<!-- context:section id="goal" -->
Revision changes a page without producing it again. It starts from the current text, changes only what your instruction and the sources support, and sends the result back to review. The page keeps its identity and URL, which makes revision the right tool for wording, structure and factual fixes.
<!-- /context:section -->

<!-- context:section id="which" -->
## Two situations

| The page is | How to ask | What happens |
| --- | --- | --- |
| A draft in the current review | Write a note in the report, or say it in the conversation | The Agent repairs it within the same batch and shows an updated report |
| Already approved | *"Revise `<page>`: `<problem>`. Keep the source citations."* | The Agent revises the page and the new version goes to review |

If an approved page is not part of the batch currently in review, its revision waits until that batch is finished. You can ask for it sooner; it still goes through review. To revise several approved pages together, name them all in one request.
<!-- /context:section -->

<!-- context:section id="how" -->

## What the Agent does

- Reads the whole page first and keeps explanations that are still correct, including your earlier contributions.
- For a wording-only change, works from the approved text alone; it does not read the source again.
- For a changed fact, reads the relevant registered material. A new fact that exists only in your instruction is first saved as a [note](../registering-sources/notes.md), so the page can cite it.
- Edits one section or the whole page. Sections it does not touch keep their text and their source citations.
- When the correction needs a source outside the revision's scope, registers it first; it then stays available to the other pages in the same revision.

Before submitting, the Agent can show you the revised page next to the previous text.

<!-- /context:section -->

<!-- context:section id="move" -->
## Moving or renaming a page

Ask for the move and the revision in one request, for example *"Move `<page>` under `<new section>` and tighten the introduction."* The page keeps its identity, its own links are adjusted to the new location, and links from other pages are updated when you approve. There is no second copy to delete. To change only the title or menu position, adjust the knowledge map instead; see [Reorganizing at Scale](reorganizing-at-scale.md).
<!-- /context:section -->

<!-- context:section id="generated" -->
## Generated reference pages

Pages with generated API tables are regenerated, not hand-edited. Ask the Agent to regenerate the page; it rebuilds those tables from the current source even when the version has not changed. If the same wrong value survives regeneration, the Agent reports the page, field and source comparison instead of repeating the repair. The commands behind this are in [CLI Commands](../../product/reference/context/cli-commands.md).
<!-- /context:section -->

<!-- context:section id="source-wrong" -->
## When the source is wrong

If the page faithfully reflects a source that is itself wrong, correct the source first (capture it again, or correct the note or conversation summary) and then update the page. If the source is right and the page misleads, revise only the page.
<!-- /context:section -->
