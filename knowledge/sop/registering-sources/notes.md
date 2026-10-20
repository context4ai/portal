---
title: Notes and Conversation Summaries
description: Save text you already hold as a note, or the conclusions of an
  Agent conversation as a summary, so pages can cite them; then correct either
  one without rewriting history.
type: Guide
timestamp: 2026-10-19T18:48:05.928Z
---
# Notes and Conversation Summaries

<!-- context:section id="goal" -->
Some material never lives in a repository or a document Context can read: an excerpt from a system it cannot reach, a summary of a decision, a field observation, a checklist from experience, or the conclusions of a design discussion with your Agent. Save it as a **note** or a **conversation summary**. The saved text itself is the evidence that pages cite; there is nothing further to capture.

| Your material | Save it as |
| --- | --- |
| Text you already hold: excerpts, summaries, observations, checklists | A note |
| What an Agent conversation settled: decisions, constraints, open questions | A conversation summary |
| Documents Context can read itself | A [document directory](document-directories.md) or [Lark document](lark-documents.md) source instead |
<!-- /context:section -->

<!-- context:section id="prepare" -->
## What to put in a note

A note may hold original text, selected verbatim excerpts, a summary, or a mix. No fixed template is required, but when both originals and a summary are present, separate them with headings or prose, and label any summary as a summary rather than a transcript.

- Keep qualifications, exceptions, disagreements and open questions that affect the conclusion.
- State where the material came from and what was left out, when the omission matters.
- Quote only actual input; do not invent links, speakers, dates or confirmations.
- A link in a note does not mean its target was read.

Pages cite the note as saved, so leave out anything the eventual readers must not see before you save it.
<!-- /context:section -->

<!-- context:section id="summary-what" -->
## What a conversation summary is

Design discussions, troubleshooting sessions and requirement conversations with an Agent often settle things that no document records. A conversation summary keeps a bounded account of such a conversation so that pages can cite it. It is a summary, never the transcript: Context does not scan your Agent's history or take in a whole conversation.
<!-- /context:section -->

<!-- context:section id="summary-keep" -->
## What to keep from a conversation

The Agent (or whoever supplies the summary) prepares it before saving:

| Keep | Drop |
| --- | --- |
| The problem, confirmed decisions and the reasons that matter | Repetitive turns |
| Constraints and open questions | Tool logs |
| Whether each statement was proposed, agreed, implemented or verified | Abandoned attempts, unless they explain a current limit |

If only a supplied summary exists, the source says so. Speakers, dates and approvals are never made up, and a conversation with nothing reusable can stay out of the knowledge workspace.
<!-- /context:section -->

<!-- context:section id="save" -->
## Saving a note

Ask the Agent in plain language:

```text
Save these release-process notes as a Context note, then use them for a
page on hotfix releases.
```

The Agent saves the note under a dated name. Saving alone starts no knowledge work; when you ask for a page, the Agent adds the note to the sources that task reads, keeping the existing ones. A note that only supports an existing page does not need this: it joins that page's reading scope during a revision.
<!-- /context:section -->

<!-- context:section id="summary-save" -->
## Saving a conversation summary

Ask at the end of the conversation:

```text
Summarize what we decided about retry limits and save it as a Context
conversation summary, linked to the merge request we just opened.
```

The Agent names the summary by the actual conversation date, or the collection date if that is unknown, and keeps the same name for later corrections. It can link the summary to one or more code changes, by commit, merge request or both; a discussion with no code needs no link. A link records an association only: it does not prove the change was merged or tested, and it does not authorize fetching the code.
<!-- /context:section -->

<!-- context:section id="use" -->
## How saved material is used

Saving starts no knowledge work. A summary that opens a new reader topic goes through the normal planning, writing and review; one that only supports an existing page joins that page's reading scope, and the page keeps its main source. Either way, the knowledge turns the conclusions into answers, explanations and procedures, not a meeting recap, and Context records which sections cite the summary.

See [Capturing from Conversations](../updates-and-versions/capturing-from-conversations.md) for the end-to-end flow after a Q&A.
<!-- /context:section -->

<!-- context:section id="writing" -->
## How notes become knowledge

The Agent integrates what is useful into explanations, rules or steps for the reader; it does not copy the note wholesale or turn proposals into facts. A short exact passage is quoted only when its wording matters. Citations point at the stored note, never at an original the Agent could not read.
<!-- /context:section -->

<!-- context:section id="correct" -->
## Correcting a note

Two different problems, two different fixes:

| Problem | What to ask |
| --- | --- |
| The note misrepresents the material | Ask the Agent to correct the note itself. |
| The note is right but a page is misleading | Ask the Agent to revise only that page; it comes back to you for review. |

Approving knowledge never changes or removes the note. To rename a note, ask the Agent: it shows you the change first and then updates the references to it.
<!-- /context:section -->

<!-- context:section id="summary-correct" -->
## Correcting a conversation summary

Ask the Agent to save a corrected version under the same name. Linked code changes are kept unless you ask to remove them. If the summary is accurate but a page is wrong, revise the page instead. Neither saving a summary nor approving knowledge approves the code change it mentions.
<!-- /context:section -->
