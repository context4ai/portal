---
title: Starting a New Task and Saving Your Work
description: When to ask for a fresh start in a knowledge workspace, what is
  discarded and what is kept, and how the Agent commits your work to Git when a
  round ends.
type: Guide
timestamp: 2026-10-19T18:48:05.928Z
---
# Starting a New Task and Saving Your Work

<!-- context:section id="goal" -->
A knowledge workspace keeps two kinds of state: the lasting results — approved pages, sources and configuration — and the progress of the task you are working on. This page covers both ends of a task: clearing out an old, unfinished task so you can start fresh, and saving finished work to Git.

Ask for a fresh start when an earlier task was abandoned or interrupted and you want to begin something new without it:

```text
Prepare this workspace for the next task.
```

A clear request like this is enough; the Agent tells you what will be discarded and asks only when the target is unclear or something would be lost that you have not agreed to.
<!-- /context:section -->

<!-- context:section id="capture" -->
If you only want to add documents without starting any knowledge work, you do not need a fresh start: the Agent registers them, reports what was captured and stops, leaving existing tasks, drafts and approved pages untouched. See [Choosing How to Add Material](../registering-sources/source-batches.md).
<!-- /context:section -->

<!-- context:section id="scope" -->
## What the Agent checks first

The Agent looks at the current work, anything still running, uncommitted changes and the registered sources, and tells you which unfinished drafts and queued updates will be discarded. If a writer is still running, it waits for the result first. A workspace whose status cannot be read is investigated, not assumed to be empty.

Registered sources are not part of a task. A fresh start does not change which sources are registered, and leaving a source out of one task never deletes it or its evidence.
<!-- /context:section -->

<!-- context:section id="end" -->
## What is discarded and what is kept

| Discarded | Always kept |
| --- | --- |
| Unfinished production steps, drafts, review state and queued updates | Approved pages, source records and snapshots, project configuration, repository checkouts and existing outputs |

The Agent first shows you exactly what would be removed and goes ahead once you agree. Reports, unique material, unknown files and modified checkouts are kept unless you agree to lose them. Repository checkouts are kept too, because removing them means a slow clone on the next update, and so are the saved source baselines that let later updates tell moved text from changed text.

Ask for a fresh start after a round has finished, not in the middle of one: recording the version, building and retries still need the current task. A successful round already cleans up its own drafts and review state.
<!-- /context:section -->

<!-- context:section id="sources" -->
## Making sure sources are usable

| Source | What the Agent does |
| --- | --- |
| Repositories | Reuses a matching local checkout, or clones a missing one at its registered commit when you allow it — never a newer one. Modules that share a repository and commit are cloned once. A checkout you changed yourself is never reset. |
| Lark documents | Checks the stored text and attachments and repairs them. If the live document differs from the saved snapshot, that is an [update](../updates-and-versions/updating-knowledge.md) for you to decide, not a repair. |
| Notes, conversation summaries, local files | Keeps the saved content and checks it is in place. Lost originals are never reconstructed from generated knowledge. |
<!-- /context:section -->

<!-- context:section id="finish" -->
## When the workspace is ready

The workspace is ready when no task is left, nothing is running, the configuration loads and the selected sources are at their registered versions. The Agent reports anything that blocks this, with the next step, and then stops — it does not start writing or re-capture everything. To go back to an older version instead, see [Versions, Changelog and Restoring](../updates-and-versions/versions-and-changelog.md).
<!-- /context:section -->

<!-- context:section id="commit-when" -->
## Saving your work to Git

When a round ends — after you have confirmed the results — the Agent commits the knowledge workspace to Git. In a project [planned in stages](../planning-and-production/planning-large-projects.md), the approved plan settles how work is committed across stages.

To commit at another time, just ask:

```text
Commit the knowledge workspace now.
```

If there is no Git repository yet, the Agent agrees with you where it should be before creating one; if nothing changed, it tells you no commit is needed.
<!-- /context:section -->

<!-- context:section id="select" -->
### Which files are included

The commit holds the lasting state of the knowledge: configuration, source records and snapshots, approved pages, translations and the changelog. Build output, temporary task progress and repository checkouts are left out — outputs can be rebuilt and checkouts restored from the source records. The full list is in [The Context Knowledge Workspace](../../product/getting-started/knowledge-workspace.md).

When the workspace sits inside a larger repository, only the workspace's files are committed; other changes you have made, staged or not, are left as they are.
<!-- /context:section -->

<!-- context:section id="commit" -->
### The commit message and problems

The Agent summarizes the actual change in a message that follows your repository's conventions. If Git identity, hooks, signing, conflicts or permissions get in the way, it tells you what is wrong rather than working around it.
<!-- /context:section -->

<!-- context:section id="verify" -->
### Checking the commit

The Agent finishes with the commit ID and a short description of what changed, after checking that the commit contains the intended files and nothing unrelated was touched. If a hook changed the result, it says so. It does not push, publish or create a remote repository unless you ask for that too.
<!-- /context:section -->
