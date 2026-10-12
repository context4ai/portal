---
title: Committing Results
description: How to commit the results of a Context task to Git — which files
  belong, how to commit only them, and how to verify the commit.
type: Guide
timestamp: 2026-10-12T17:02:32.263Z
---
# Committing Results

<!-- context:section id="goal" -->
Context has no commit command of its own: the Agent uses ordinary Git. It commits **only when you ask** — fully managed production does not by itself authorize commits or pushes. When your whole requested scope has finished close and every requested build with nothing pending, the Agent mentions once that the results can be committed; intermediate deliveries do not get that suggestion.
<!-- /context:section -->

<!-- context:section id="select" -->
## 1. Select the files

The Agent finds the Context knowledge workspace and its actual Git root — in an embedded workspace that root may be a much larger source repository — and inspects staged, unstaged and untracked changes and the ignore rules. It selects workspace files explicitly; it never runs a blanket `git add -A` or commits the entire staged index.

The `.gitignore` that `context init` writes already separates formal content from runtime state:

```text
.tmp/
node_modules/
dist/
sources/repo/*
!sources/repo/index.yaml
sources/**/.tmp/
sources/**/.cache/
```

So configuration, source records and snapshots, approved `knowledge/`, translations and changelogs are committed; `dist/`, `.tmp/` and repository checkouts are not — checkouts are recovered from `sources/repo/index.yaml`. Ignored files are never force-added, and generated files are included only if your project's rules require them. The full ownership table is in [The Context Knowledge Workspace](../../product/getting-started/knowledge-workspace.md).

If there is no Git repository yet, the Agent agrees with you where it should be before initializing one; if nothing changed, it reports that no commit is needed. An intermediate snapshot cannot resume ignored task state from Git alone.
<!-- /context:section -->

<!-- context:section id="commit" -->
## 2. Commit the selected change

The Agent summarizes the actual change and writes a message that follows your repository's conventions, committing precise paths:

```bash
git commit --only -- <paths>
```

`--only` leaves unrelated staged files out; new files must be added to the index first. Partially staged files that overlap the selection are inspected so that nothing you did not select slips in, and unrelated staged entries — including deletions — are preserved.

Git identity, hooks, signing, conflicts and permissions are diagnosed, not bypassed: the Agent does not disable hooks or signing, change global Git configuration, stash your other work or work around ignore rules. It uses an authorized alternative or reports the blocker.
<!-- /context:section -->

<!-- context:section id="verify" -->
## 3. Verify the result

The Agent reads the new commit SHA and its changed files, compares them with the selected scope, and checks that unrelated worktree and index content are unchanged. If a hook modified the result, it reports that. It finishes with the SHA and a short description, and does not push, publish or create a remote repository unless you ask for that too.
<!-- /context:section -->
