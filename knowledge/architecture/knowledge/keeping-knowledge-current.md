---
title: Keeping Knowledge Current
description: How Context finds the knowledge affected by a source change,
  re-checks it, and moves the baseline forward only after the update is
  delivered.
type: Guide
timestamp: 2026-10-12T16:39:19.026Z
---
# Keeping Knowledge Current

<!-- context:section id="flow" -->
## The update loop

```mermaid
flowchart LR
  change["Source changes"] --> cmp["Compare versions"]
  cmp --> decide["Keep, revise, add"]
  decide --> write["Write"]
  write --> review["Review"]
  review --> deliver["Close and build"]
  deliver --> base["New baseline"]
```

Building completes the currently approved state; it does not freeze the Context knowledge workspace. When a source moves on, `context update` opens a new round for the selected change. The workflow hands the Agent the fixed old and new source versions and the confirmed requirement scope, plus a list of pages that cite the changed material.
<!-- /context:section -->

<!-- context:section id="decide" -->
## Deciding what to change

The listed pages are candidates to inspect, not an instruction to rewrite all of them. For each page the Agent reads its current approved Markdown and the change, then submits one decision: no change, or a concrete correction. Unrelated content and readers' earlier improvements are preserved.

Existing references cannot discover every new topic, so the Agent also inspects additions and shared dependencies and lists necessary **new pages**, each with a path, title, registered sources and instruction. New pages go through the same writing and review as revisions. A renamed subject is revised in place rather than given a new identity; a retirement explains what disappeared and which readers are affected instead of silently deleting pages.
<!-- /context:section -->

<!-- context:section id="baseline" -->
## Moving the baseline

The CLI keeps the previous processed version until every requested page has been approved, closed and built. If temporary progress is lost, the next inspection starts again from that version and keeps pages already approved. A saved report or acquisition receipt does not prove the update was completed. See [Version-Aware Knowledge](version-aware-knowledge.md).
<!-- /context:section -->

<!-- context:section id="scope" -->
## Keep the update local

For one or two documents or a clearly bounded module, the update stays local: which articles to add or revise, and where readers expect them. It does not turn into a taxonomy for the whole knowledge workspace or a navigation redesign. Only the sources needed for the current change are restored; missing material stays a gap rather than being treated as investigated.
<!-- /context:section -->

<!-- context:section id="triggers" -->
## Ways an update starts

| Trigger | How |
| --- | --- |
| A source changed | Tell `/c4a:context` the new version; it runs `context update` for the selected scope |
| A page is wrong or incomplete | `context revise "<page>" --instruction "<correction>"` continues through Review and delivery, with no recapture for wording-only changes |
| Unattended or scheduled runs | An authorized task can pass `CONTEXT_RUN_POLICY` with `plan_review` and `knowledge_review` set to `ask` or `delegate`; human-only Gates still stop |

Gaps found while answering questions are handled the same way: they become revision tasks for the affected pages.
<!-- /context:section -->
