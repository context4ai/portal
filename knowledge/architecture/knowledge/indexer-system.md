---
title: The Indexer System
description: The four built-in Indexer skills, how the workflow uses them, and
  how teams add their own.
type: Guide
timestamp: 2026-10-13T05:37:29.810Z
---
# The Indexer System

<!-- context:section id="what" -->
## What an Indexer is

An Indexer is an Agent skill that helps the Agent expose a source's skeleton and write source-grounded articles from it. It is guidance for reading and writing, not a mandatory full scan and not a classifier inside the CLI. The CLI prepares each stage, supplies its material and acceptance rules, and checks the result; the Indexer contributes how to investigate and explain one kind of source.
<!-- /context:section -->

<!-- context:section id="built-in" -->
## Four built-in Indexers

| Indexer | Reads | Starts from |
| --- | --- | --- |
| `context-code-indexer` | Repository modules | Directory and file navigation, manifests, entries and registrations; detailed code reading during writing |
| `context-markdown-indexer` | Captured documents and same-repository docs | Titles, bounded opening excerpts and H2/H3 outlines; full text before writing |
| `context-note-indexer` | Saved notes, excerpts and observations | Direct reading, no parser |
| `context-sessions-indexer` | Saved conversation summaries | Direct reading, no parser |

<!-- /context:section -->

<!-- context:section id="built-in-install" -->
All four are installed with the plugin and discoverable in every supported host. Installing an Indexer makes it available; it does not select it. [Community Indexers](../../sop/custom-indexers/community-indexers.md) describes each one in more detail.
<!-- /context:section -->

<!-- context:section id="usage" -->
## How the workflow uses them

```mermaid
flowchart LR
  req["Requirements"] --> plan["Planning"]
  plan -->|"picks Indexers"| usage["indexer_usage"]
  usage --> write["Stage writing"]
  write -->|"CLI checks"| cand["Candidates"]
```

- `src/indexers.yaml` holds only confirmed requirements: purpose, reader goals, coverage domains and authorized sources.
- During planning the Agent chooses the relevant Indexers and records them as `indexer_usage` in the temporary plan; that choice is not persisted on articles.
- Several Indexers may explain different aspects of the same module, and their findings can support one article. There is no primary owner, no Provider resolution step and no version or hash pinning of skills.
- Each writing task produces Markdown and references in a temporary directory; the CLI accepts them and owns Candidates, Review and formal output.
<!-- /context:section -->

<!-- context:section id="create" -->
## Creating your own

When a technology or document family needs specialist guidance, `/c4a:context-indexer-create` writes a new reusable Indexer skill in a directory you choose. A new Indexer starts with a useful skeleton — source structure, recognizable features, names, established counts and entry locations — and may add a bounded helper for its technology. It delivers a `SKILL.md` plus only the references, templates or scripts that help, and is validated against realistic anonymous material. It does not register a Provider manifest or start production; after installation it is available for the Agent to select. See [Creating an Indexer](../../sop/custom-indexers/creating-an-indexer.md) for the step-by-step guide and [Providers and Customization](../../sop/custom-indexers/providers-and-customization.md) for combining, replacing and disabling Indexers.

Where a needed structural fact is missing, writing guidance cannot create it — that calls for a parser. See [Code Extraction](code-extraction.md).
<!-- /context:section -->
