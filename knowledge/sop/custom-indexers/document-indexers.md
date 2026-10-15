---
title: Document Indexers
description: What a document Indexer for a family of documents should contain —
  outline-first planning, full reading before writing, topic grouping, images
  and tests — with an example outline.
type: Guide
timestamp: 2026-10-15T06:21:46.519Z
---
# Document Indexers

<!-- context:section id="goal" -->
A document Indexer helps the Agent interpret one family of captured documents — design reviews, runbooks, API specifications, product requirements — and turn them into articles organized around reader questions rather than around the source files. This page covers what to put in one, following the shipped `context-markdown-indexer`. Notes and session summaries have their own interpreters but can support the same reader topics.

```mermaid
flowchart LR
  outline["Titles, opening excerpts,<br/>H2/H3 outlines"] --> group["Group by reader task<br/>and existing topics"]
  group -->|"report confirmed"| read["Read the passages<br/>each article needs"]
  read --> art["Articles with<br/>regional references"]
```
<!-- /context:section -->

<!-- context:section id="sources" -->
## Start from captured sources

The Indexer works on authorized captured Markdown and its source identity. Capture proves which bytes are available, not what they mean; titles, headings and file names are navigation aids, not proof that the body has been read.

It must not fetch new documents, follow external links or widen source authorization on its own. Missing material is requested through the current workflow, and an unavailable source is kept distinct from an irrelevant one.
<!-- /context:section -->

<!-- context:section id="planning" -->
## Planning from outlines

For each document the CLI supplies its title, a bounded introduction and the complete H2/H3 outline, plus existing article titles, descriptions and references. The Agent reads more — a section or the whole document — only where the reader question, grouping or authority is unclear. Full reading of every document is not required before a plan can be submitted.

Guide the grouping:

- Reuse an existing article, including a topic first discovered from code, when it answers the same question for the same audience.
- Let business definitions in documents correct a mechanical code-topic name, rather than forcing a document under a code directory.
- Split distinct reader tasks or lifecycles; combine sources that answer the same task. A broad shared label such as "operations" does not make all its procedures one summary.
- Neither file count nor heading count decides article count. One document may support several articles, and several documents one article.

Age, archive location and polished language prove neither authority nor irrelevance; compare substance, audience and applicability. The first plan is shown in the work-start report and waits for your feedback before bulk writing, also in managed mode.
<!-- /context:section -->

<!-- context:section id="writing" -->

## Writing and repairs

Before writing, the Agent reads the actual passages each article needs, and keeps authoritative rules, examples, decisions and proposals distinct — a suggestion in a meeting summary is not implemented behavior. Each fragment cites real source regions from at most three files, up to eight regions in total; the CLI handles digests and safety, the Agent judges whether the evidence supports the explanation. A local failure is repaired at the reported section, and finished tasks can be submitted without waiting for the rest of a batch.

Revisions keep stable article and section identities and preserve useful steps, examples, images and limitations. Do not inflate page counts, write one page per heading or turn missing evidence into speculative prose.

<!-- /context:section -->

<!-- context:section id="visuals" -->
## Images, tables and diagrams

Authorized images in a document arrive as registered visual resources. The Agent reads only those, prefers structured whiteboard or table data when available, and converts a clear flow, sequence, state or relationship diagram to Mermaid, or a table to Markdown, only when every label, value and footnote survives. Screenshots, photos and designs where the appearance is the information are kept as originals, and so is anything it cannot read reliably. It never guesses relationships or numbers. A document Indexer can add guidance for diagrams typical of its family.
<!-- /context:section -->

<!-- context:section id="example" -->
## Example outline

A minimal Indexer for design-review documents:

```text
design-review-indexer/
  SKILL.md
  references/
    writing.md     # decision record and architecture guide outlines
  tests/fixtures/
    reviews/       # three anonymous design reviews, one superseded
```

```markdown
---
name: design-review-indexer
description: Interpret design-review documents and write decision records and architecture guides. Use when selected for a Context planning or writing task on such documents.
---

# Design Review Indexer

During planning, use the title, "Context", "Decision" and "Alternatives"
headings to group reviews by the system they change. A superseded review
still explains history; link it from the current decision instead of
dropping it.

During writing, read [writing guidance](references/writing.md). State the
decision, its rationale and limits; mark open questions as open. A proposal
without a recorded decision is not adopted behavior.
```
<!-- /context:section -->

<!-- context:section id="tests" -->
## Testing

Cover the document forms the Skill claims to support: an ordinary one-to-one article, a synthesis from several documents, reuse of an existing topic, a section repair, source line changes, links and images, and missing material. Check both fidelity to the source and the final page, keep examples anonymous and verify packaged links. Drafts and scheduling details stay temporary; clearing `.tmp` simply starts fresh production from formal knowledge and available sources.

See [Creating an Indexer](creating-an-indexer.md) for the creation flow, [Code Indexers](code-indexers.md) for the code counterpart and [Providers and Customization](providers-and-customization.md) for combining Skills.
<!-- /context:section -->
