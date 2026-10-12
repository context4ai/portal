---
title: Revising a Page
description: Correct one page — a candidate still in Review or an already
  approved page — while keeping its identity, URL and source citations.
type: Guide
timestamp: 2026-10-12T16:07:52.846Z
---
# Revising a Page

<!-- context:section id="goal" -->
Revision changes a page without producing it again. It starts from the current text, changes only what your instruction and the sources support, and sends the result back through Review. The page keeps its identity and URL, which makes revision the right tool for wording, structure and factual fixes.
<!-- /context:section -->

<!-- context:section id="which" -->
## Two situations

| The page is | How to ask | What happens |
| --- | --- | --- |
| A candidate in the current Review | Write a note in the report, or say it in the conversation | The Agent repairs it within the same batch and shows an updated report |
| Already approved | *"Revise `<page>`: `<problem>`, keep the source citations"* | The Agent runs `context revise <page> --instruction "<text>"`; the new version enters Review |

For an approved page outside the active batch, the revision is queued and runs after the batch by default; `--timing priority` asks for earlier delivery but never skips Review. Several approved pages can be revised together with `context task maintain`.
<!-- /context:section -->

<!-- context:section id="how" -->
## What the Agent does

- Reads the whole page first and keeps explanations that are still correct, including your earlier contributions.
- For a wording-only change, uses the approved text alone; it does not recapture or re-parse the source.
- For a changed fact, reads the relevant registered material. A new fact that only exists in your instruction is first saved as a source, such as a [note](../registering-sources/notes.md).
- Edits one section or the whole page. Section edits leave other sections and their citations untouched; a citation change replaces that section's references, which Context re-fingerprints.

Before submitting, the Agent can preview the assembled page and the previous text without accepting the edit.
<!-- /context:section -->

<!-- context:section id="move" -->
## Moving or renaming a page

`context revise <page> --move-to <new-path>` revises and moves in one step. The page keeps its article identity and section IDs, its relative links are rebased to the new location, and approval updates incoming Markdown links together — no second copy and no manual deletion. To change only the title or menu position, adjust the knowledge map instead; see [Reorganizing at Scale](reorganizing-at-scale.md).
<!-- /context:section -->

<!-- context:section id="generated" -->
## Generated reference pages

Pages with generated API tables are regenerated, not hand-edited: `--regenerate` rebuilds their program blocks from the current source even when the version has not changed. If the same wrong value survives regeneration, the Agent reports the page, field and source comparison instead of repeating the repair.
<!-- /context:section -->

<!-- context:section id="source-wrong" -->
## When the source is wrong

If the page faithfully reflects a source that is itself wrong, correct the source — recapture it, or correct the note or session summary — and then update the page. If the source is right and the page misleads, revise only the page.
<!-- /context:section -->
