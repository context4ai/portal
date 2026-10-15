---
title: FAQ
description: Short answers to the questions teams ask before and while adopting Context.
type: Guide
timestamp: 2026-10-15T03:52:07.709Z
---
# FAQ

<!-- context:section id="central-or-local" -->

## Does a small module need a central knowledge base?

Not necessarily. A central knowledge base suits knowledge that many people share and use remotely: the team registers its repositories, documents and meeting notes once, and its Bot, documentation site and each member's coding Agent all read the same reviewed knowledge.

Content for a small module or a single maintainer can stay in the repository's `docs/`, where it keeps evolving with the code. Registered as repository content, it stays at its original location: Context references it instead of producing it again or copying it into knowledge. See [Referencing Same-Repository Docs and Skills](../sop/registering-sources/same-repository-docs.md).

<!-- /context:section -->

<!-- context:section id="quality" -->
## Knowledge is written by AI. How is quality kept, and does it bloat?

People decide the direction; the Agent handles the detail.

- In the review report, a person judges whether the categories, update scope and granularity are right. Nothing is published before its Diff report is approved.
- Every conclusion records its source (file, line and version), and citations are checked before anything is written into knowledge.
- During production and updates the Agent cross-checks sources. It often finds upstream documents that lag behind the code, corrects the knowledge from the code, and can also write the correction back upstream when asked.
- Knowledge compresses sources around questions and keeps only what answers them. When a knowledge base grows, ask the Agent to reorganize its directories and titles.

See [Evidence Chains and Index First](../architecture/knowledge/evidence-chains.md) and [Knowledge for Agents](../architecture/knowledge/knowledge-for-agents.md).
<!-- /context:section -->

<!-- context:section id="package-vs-wiki" -->
## How is a knowledge package different from an LLM Wiki?

A knowledge package is a container; it does not prescribe how content is written. Context ships default Indexers and writing patterns, and a team can customize its own production skills and the skills a package hands to Agents.

Compared with an LLM Wiki that has only pages, a package also carries an index, evidence chains and an Agent-facing query entry. Iterations of the knowledge base maintain these directories, so nobody syncs them by hand. See [Packages and Sites](../architecture/context/packages-and-sites.md).
<!-- /context:section -->

<!-- context:section id="maintainer-steps" -->
## The update process looks long. What does a maintainer actually handle?

Only review. Committing the Context knowledge workspace, building the package and publishing the site run quietly by default; the maintainer is interrupted only for the Diff review, a permission problem, or an objection. Once the Diff report is reviewed on the website, the process continues on its own.
<!-- /context:section -->
