---
title: Published and Archived Collections
type: Guide
description: Use documentation that another team publishes as versions, keep
  following its releases, and absorb a collection once before its original is
  archived.
timestamp: 2026-11-25T02:35:51.926Z
---
# Published and Archived Collections

<!-- context:section id="goal" -->
Some material you want to cite is not a folder you maintain. Another team publishes it as versions — a documentation repository, a released knowledge package — or a team wiki is about to be archived. Context handles both with a document source:

- **Follow a published version.** You install one exact version as files, Context records where it came from and which version it is, and pages cite it like any local document. When a newer version comes out, you move the source to it and update the pages it affects.
- **Absorb once.** You capture the collection's files, write the author's own judgments as notes and produce articles; when the original is archived, the source is frozen and stays citable.

Register material as a source only when pages cite it. Content readers only need to find stays an [external entrance](external-entrances.md).
<!-- /context:section -->

<!-- context:section id="register" -->
## Following a published version

Ask the Agent with the exact version:

```text
Register the payments team's API docs repository at commit 4f2a9c1 as a source.
Keep its folders; pages will cite the reference/ and guides/ chapters.
```

Context never downloads the content itself. The Agent installs that version as real files — not links — into `sources/<kind>/<name>@<version>/` in the knowledge workspace, using the origin's own tool outside the workspace so no lock files or tool settings land in it, and then registers the source with its origin:

```bash
context source add file api-docs --layout tree \
  --local sources/git/api-docs@4f2a9c1 \
  --origin-kind git --origin-id https://example.com/payments/api-docs.git \
  --origin-version 4f2a9c1
```

Registration adds `sources/<kind>/` to `.gitignore`: only the registration and the captured snapshot are committed, not the installed files. For a Git repository the registration also returns the exact install command and a command that lists the latest version. The snapshot records the origin and version, and the website's source list links each cited file to that version.

`--layout tree` keeps the folders and the images documents link to; add `--document-ext .json --document-ext .yaml` when pages should cite small structured files as text. Choose the layout before pages cite the source, because switching it later moves paths in the snapshot. See [Document Directories](document-directories.md) for capture and asset gaps.
<!-- /context:section -->

<!-- context:section id="upgrade" -->
## Moving to a newer version

When you ask for an update — or a [routine update](../updates-and-versions/scheduled-updates.md) runs — the Agent compares the latest available version with the registered one. If it is the same, nothing happens. If it is newer, the Agent installs it into a new `<name>@<new version>` directory, moves the registration to it and captures again. The snapshot shows which files changed, so only the pages citing them are revised, as for any [document change](../updates-and-versions/updating-knowledge.md). The old version directory is deleted afterwards.
<!-- /context:section -->

<!-- context:section id="restore" -->
## In a fresh clone

The installed files are not in Git, so a new clone of the knowledge workspace does not have them. Capture then reports a deferred gap whose next step is the install command for the registered version. The Agent installs exactly that version, not the latest, so the knowledge is rebuilt from what it was written from.
<!-- /context:section -->

<!-- context:section id="archive" -->
## Absorbing a collection before it is archived

To bring a collection in once instead of following it, the Agent registers its folder with `--layout tree`, captures it, saves the author's own judgments — decisions, procedures, comparisons that exist nowhere else — as [notes](notes.md), and produces articles. When the original is archived, the source is frozen:

```bash
context source add file team-wiki --freeze
```

A frozen source keeps its snapshot citable and is never captured again, so the archived folder can disappear. `--unfreeze` allows capturing again. Which collections to follow and which to absorb is part of planning; see [Migrating an Existing Knowledge Base](../practices/migrating-a-knowledge-base.md).
<!-- /context:section -->
