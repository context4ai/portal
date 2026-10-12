---
title: Session Summaries
description: Turn the useful conclusions of an Agent conversation into a
  sessions source, optionally linked to the commits or merge requests it
  produced.
type: Guide
timestamp: 2026-10-12T16:07:52.846Z
---
# Session Summaries

<!-- context:section id="goal" -->
Design discussions, troubleshooting sessions and requirement conversations with an Agent often settle things that no document records. A **sessions** source keeps a bounded summary of such a conversation so that pages can cite it. It is a summary, never the transcript: Context does not scan your Agent's history or ingest a whole conversation.
<!-- /context:section -->

<!-- context:section id="prepare" -->
## What to keep

The Agent (or whoever supplies the summary) prepares it before import:

| Keep | Drop |
| --- | --- |
| The problem, confirmed decisions and the reasons that matter | Repetitive turns |
| Constraints and open questions | Tool logs |
| Whether each statement was proposed, agreed, implemented or verified | Abandoned attempts, unless they explain a current limit |

If only a supplied summary exists, the source says so. Speakers, dates and approvals are never made up, and a conversation with nothing reusable can stay out of the Context knowledge workspace.
<!-- /context:section -->

<!-- context:section id="save" -->
## Save it

Ask at the end of the conversation:

```text
Summarize what we decided about retry limits and save it as a Context
session summary, linked to the merge request we just opened.
```

The Agent imports a payload like this with `context source import --input <file>`:

```yaml
type: sessions
name: 20261012/retry-limits.md
markdown: |
  # Retry limits for payment callbacks
  ...
changes:
  - mr: https://git.example.org/team/payments/merge_requests/42
```

Use the actual conversation date, or the collection date if unknown, and keep the same name for later corrections. The optional `changes` field links one or more code changes: each row takes a full `commit` SHA, an `mr` URL, or both, plus an optional `repository`. Omit it for a discussion with no code. A link records an association; it does not prove the change was merged or tested, and it does not authorize fetching the code.
<!-- /context:section -->

<!-- context:section id="use" -->
## How it is used

Saving starts no knowledge work. A summary that opens a new reader topic goes through the normal structure review and writing; one that only supports an existing page joins that page's reading scope while the page keeps its primary source. Either way, knowledge turns the conclusions into answers, explanations and procedures — not a meeting recap — and `knowledge/structure.yaml` records which sections cite the summary.

See [Capturing from Conversations](../updates-and-versions/capturing-from-conversations.md) for the end-to-end flow after a Q&A.
<!-- /context:section -->

<!-- context:section id="correct" -->
## Corrections

Correct a faulty summary by importing it again with its current `base_digest`; existing `changes` are kept unless you remove them, and `changes: []` clears them. If the summary is accurate but a page is wrong, revise the page instead. Neither saving a summary nor approving knowledge approves the upstream code change it mentions.
<!-- /context:section -->
