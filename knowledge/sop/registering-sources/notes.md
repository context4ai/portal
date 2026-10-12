---
title: Notes
description: Save excerpts, summaries and observations as a note source, select
  it for knowledge work, and correct it without rewriting history.
type: Guide
timestamp: 2026-10-12T16:07:52.846Z
---
# Notes

<!-- context:section id="goal" -->
A note is Markdown you supply directly: an excerpt from a document Context cannot read, a summary of a decision, a field observation, a checklist from experience. Context saves it as a source under `sources/note/YYYYMMDD/topic.md`. There is no registry and no capture phase — the saved file *is* the evidence that pages cite.

Use a note when the material is text you already hold. Use a [session summary](session-summaries.md) when it comes from an Agent conversation, and a [document source](document-directories.md) or [Lark source](lark-documents.md) when Context can capture the original itself.
<!-- /context:section -->

<!-- context:section id="prepare" -->
## Prepare the content

A note may hold original text, selected verbatim excerpts, a summary, or a mix. No fixed template is required, but when both originals and a summary are present, separate them with headings or prose, and label any summary as a summary rather than a transcript.

- Keep qualifications, exceptions, disagreements and open questions that affect the conclusion.
- State where the material came from and what was left out, when the omission matters.
- Quote only actual input; do not invent links, speakers, dates or confirmations.
- A link in a note does not mean its target was read.

Pages cite the note as saved, so leave out anything the eventual readers must not see before you save it.
<!-- /context:section -->

<!-- context:section id="save" -->
## Save and select it

Ask the Agent in plain language:

```text
Save these release-process notes as a Context note, then use them for a
page on hotfix releases.
```

The Agent saves the body with `context source import`. Saving alone starts no knowledge work. To use the note in a production task, the Agent adds its typed reference to `src/index.ts`, keeping existing sources and phases:

```ts
source("20261012/release-process.md", { type: "note" });
```

A note that only supports an existing page does not need this: it joins that page's reading scope during a revision.
<!-- /context:section -->

<!-- context:section id="writing" -->
## How notes become knowledge

The Agent integrates what is useful into explanations, rules or steps for the reader; it does not copy the note wholesale or turn proposals into facts. A short exact passage is quoted only when its wording matters. Citations point at the stored note, never at an original the Agent could not read.
<!-- /context:section -->

<!-- context:section id="correct" -->
## Correcting a note

Two different problems, two different fixes:

| Problem | Fix |
| --- | --- |
| The note misrepresents the material | Correct the note itself through `source import`, passing its current `base_digest`. |
| The note is right but a page is misleading | Revise only that page and send it through Review. |

Approving knowledge never changes or removes the note. To rename one, `context source rename <ref> --name <name>` previews the change and then updates existing references safely.
<!-- /context:section -->
