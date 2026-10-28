---
title: Evidence Chains and Index First
description: How every section of Context knowledge stays tied to exact source
  regions, and how Agents use that chain to go from an answer back to the
  original.
type: Guide
timestamp: 2026-10-28T03:53:56.231Z
---
# Evidence Chains and Index First

<!-- context:section id="chain" -->
## The chain

```mermaid
flowchart LR
  q["Question"] --> map["Knowledge map and indexes"]
  map --> page["Article section"]
  page -->|source_ref + file and lines| region["Source region at a pinned version"]
  region -->|content digest| check["Verified at write and verify time"]
```

An answer starts from the knowledge map, lands on an article section, and from there follows a reference to an exact region of a registered source. Each step is checkable: the reference names the source and the lines; the source is pinned; the region's content is fingerprinted.
<!-- /context:section -->

<!-- context:section id="sections" -->

## Sections carry their own evidence

Approved articles are divided into sections. Each written fragment cites regions of registered sources: at most three distinct source files, several regions of one file allowed, up to eight regions in total. Each reference is a `source_ref` plus a `locator`. An Agent may locate a region by line range, by a Markdown heading (optionally with its `##` marker, which also selects the heading level) or by an exact quote; the CLI resolves the heading or quote against the captured text and stores the line range. When an article is submitted, the CLI checks that each cited source is authorized for that task, reads the current captured text and computes the region's content digest. Unknown or unauthorized paths and source-version drift are errors, not warnings. There is no separate fact table or claim ledger to maintain — the references are the evidence.

`source_ref` values are opaque, verified identities. Agents copy them exactly; they are not file-system paths.

<!-- /context:section -->

<!-- context:section id="verify" -->

## Checked again before delivery

`context verify` re-checks approved pages before close and build: source references for freshness and verbatim match, frontmatter identity, section blocks, assets and the derived structure. Verification errors block close and build. `context build` itself no longer compares cited source regions, so a publishing build does not need the registered source checkouts; `verify` still reports changed, moved or missing regions, so run it before publishing. Approved Markdown keeps a stable identity in frontmatter and section metadata, so a page can be revised without losing its history. Reader pages also expose each fragment ID as an anchor, so a link such as `page.md#upgrade` resolves unless a heading on that page already owns the slug.

<!-- /context:section -->

<!-- context:section id="index-first" -->

## Index first, then the original

Agents answering from a knowledge package start from directory indexes and the edge records in the build inventory, read the candidate pages, and cite their headings and passages. When the package does not cover a requested fact, they report the gap instead of guessing. The shared `context-knowledge-query` Skill can search every Context package available to the project, and when a page's text does not settle a question it follows that page's Sources entries: repositories at their recorded commit, documents at their current URL. Consumer packages omit section metadata to stay small; a maintainer can map any page back to the Context knowledge workspace through the inventory to see its full evidence.

With Source Graph, the chain reaches the code without a clone: the optional evidence plugin joins section markers, `knowledge/structure.yaml` and source registrations, so an Agent reading code at a pinned revision also receives the knowledge sections that cite it. The plugin is read-only; it does not verify source contents or modify knowledge.

<!-- /context:section -->

<!-- context:section id="site" -->

## Visible to readers

On a documentation site, each article ends with a source map built from its recorded references: the article's sections are linked to the documents they cite, grouped by where each document comes from, and a list view shows the same documents with their cited lines. Repository entries link to the recorded revision and document entries to their registered URL; `site.sourceMap: false` shows a plain source list instead. Inline code in the article that spells a cited repository file or directory exactly also links to it at the recorded revision. Links are never inferred from prose.

<!-- /context:section -->
