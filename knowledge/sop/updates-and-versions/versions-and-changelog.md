---
title: Versions, Changelog and Restoring
description: How a knowledge workspace gets one version and one changelog entry
  per completed round, where readers see the history, and how to go back to an
  earlier version.
type: Guide
timestamp: 2026-10-19T18:48:05.928Z
---
# Versions, Changelog and Restoring

<!-- context:section id="goal" -->
A knowledge workspace has its own version number, in SemVer form. Each completed round of work records **one** new version with a short changelog entry, and the package, the website and LLM Docs all carry it. Intermediate batches and partial results never get their own version.
<!-- /context:section -->

<!-- context:section id="bump" -->
## Which number changes

| Change in the round | Increment |
| --- | --- |
| Added modules or material that expands coverage | Minor |
| Corrections, updates to existing modules, navigation, persistent status | Patch |
| Anything you explicitly call a major version | Major — only on your instruction |

The first version is `0.1.0` unless the knowledge workspace already has a higher one or you specify another. Work in progress never changes the version.
<!-- /context:section -->

<!-- context:section id="record" -->
## How it is recorded

Near the end of a round, after the pages are approved and before the final build, the Agent looks at what actually changed — article text, assets, structure, navigation and templates — and writes the changelog entry: a title, the main changes and what prompted them, such as a new module, a note, an update or a fix. Related changes are merged so each entry stays short. Entries never contain credentials, raw conversation text, local paths or private account IDs, and the author is taken from your Git identity rather than guessed.

The version number and the changelog are updated together. Recording a version does not by itself publish or deploy anything. The commands behind this are listed in [CLI Commands](../../product/reference/context/cli-commands.md).
<!-- /context:section -->

<!-- context:section id="retries" -->
## Retries and republishing

A failed build reuses the recorded version; retrying does not bump it. If content has to change after a failed build, a version that has not been published can still be amended. Once content has been published, any further change needs a higher version. A local build alone does not seal a version.
<!-- /context:section -->

<!-- context:section id="readers" -->
## Where readers see it

The website has a history page: cards newest first, the latest three expanded and older ones collapsed. The History button beside the theme switch and the footer's update time link to it. Knowledge packages and LLM Docs carry the same version and changelog.
<!-- /context:section -->

<!-- context:section id="restore" -->
## Going back to an earlier version

Ask the Agent to restore a version:

```text
Restore the knowledge as of last Friday.
```

It works out which saved state you mean, ends any unfinished work, and restores only the knowledge workspace's own files and the sources that version used. It never resets the rest of the repository or brings back temporary task progress. A clear restore request needs no second approval when the target and the affected files are clear; when they are not, the Agent asks.
<!-- /context:section -->

<!-- context:section id="target" -->
### What "earlier version" means

| You say | Target |
| --- | --- |
| Nothing specific | The last saved state of the workspace — this undoes results not yet committed |
| "The previous version" | The preceding saved state of the workspace, not simply the previous commit of a large repository |
| A commit | That commit, after checking it |
| A date | Read in your timezone and meaning (for example, as of the end of that day); if several states could match, the Agent confirms with you |

Before restoring, the Agent shows you what will change. Files added since then are proposed for removal; unrelated files, work you already staged and source checkouts are kept. Moves and renames are accounted for.
<!-- /context:section -->

<!-- context:section id="restore-result" -->
### What you get back

- The workspace files as they were at the target, with branch history preserved.
- The sources that version used — repository versions, document snapshots and attachments. Newer remote content is never used in place of a lost old snapshot, and sources that are still usable are not fetched again.
- Existing outputs are reported as out of date until you ask for a rebuild. Restoring an old configuration does not start a full re-indexing; if the old format is incompatible, the Agent tells you the choice to make instead of rewriting pages silently.

The Agent then checks the restored files against the target and that nothing unrelated changed. If some sources could not be restored, it reports a partial result with what access or version is missing. Restoring itself does not commit or push; ask the Agent to commit the restored state when you are satisfied — see [Starting a New Task and Saving Your Work](../workspace-maintenance/preparing.md).
<!-- /context:section -->
