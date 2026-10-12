---
title: Release Notes
type: Wiki
description: What changed in recent Context and Agent Graph releases, which
  changes need action when you upgrade, and where the complete changelogs live.
timestamp: 2026-10-12T20:24:32.970Z
---
# Release Notes

<!-- context:section id="overview" -->
These notes summarize recent product releases by what readers and Agents notice. The complete history is in the [Context CHANGELOG](https://github.com/context4ai/context/blob/main/CHANGELOG.md) and the [Agent Graph CHANGELOG](https://github.com/context4ai/agent-graph/blob/main/CHANGELOG.md). The site's own **Changelog** entry in the More menu is different: it lists the versions of this documentation, not product releases.

To upgrade Context, run the same two commands as a first installation — `npm install -g @c4a/context-cli@latest` and `context plugin install` — and restart the Agent session; see [Installation](../getting-started/installation.md). An active knowledge workspace needs no migration step: the next `context status` returns a fresh Route for the upgraded CLI, and workflow read receipts are kept when a task resumes.
<!-- /context:section -->

<!-- context:section id="context-0762" -->
## Context 0.7.62 (2026-10-13)

- An approved article that a More menu item targets no longer needs a knowledge map entry: package builds, knowledge map adjustments and structure approval accept it, and review reports no longer list it as unplaced.
- The repository README and the contributing, support and development guides link to this documentation site and describe the Context ecosystem.
<!-- /context:section -->

<!-- context:section id="context-0761" -->
## Context 0.7.61 (2026-10-12)

**Knowledge websites**

- The reader's saved light or dark choice is applied from the first paint, so pages no longer flash the system scheme while loading.
- A reader language that leaves homepage fields unset inherits the site's own homepage title, slogan, description and actions instead of falling back to defaults.
- Unknown addresses show a centred 404 page in the reader's language with a link back home.
- Diagrams render in a single frame in both offline Review and websites; edge labels are smaller and centred on their edge, and subgraph titles no longer touch the border.

**Planning**

- Broad version updates compare the cited repository files by Git object ID before reading content and fetch partial-clone objects in one batch, avoiding long stalls.
<!-- /context:section -->

<!-- context:section id="context-0760" -->
## Context 0.7.60 (2026-10-08)

**Multilingual websites**

- `site.locales` publishes one website in several languages. Translations live under `translations/<tag>/`, remember which approved version they were written from, and show a notice when stale or missing.
- `context translate status|prepare|submit|skip` validates sections, code blocks and links; translation is a workspace Route step before the version is recorded, and it counts toward package freshness with a new `translation` changelog trigger.

**Site navigation**

- `site.nav`, `site.more` and `site.socialLinks` add top links, More menu items and social icons. A More menu item may target an approved article kept outside the knowledge map — as this page is — and root-relative paths can link to sibling applications on the same domain.

See [Multilingual Sites](../../sop/outputs-and-sites/multilingual-sites.md) and [Documentation Sites](../../sop/outputs-and-sites/documentation-sites.md).
<!-- /context:section -->

<!-- context:section id="context-0750" -->
## Context 0.7.50 (2026-10-03)

**Same-repository content**

- Register a repository's own documentation and authored Skills without copying their bodies into knowledge, with safe relative symlink entrances; see [Same-Repository Docs](../../sop/registering-sources/same-repository-docs.md).
- The evidence plugin and local or remote queries understand these references, including incomplete symlink-index coverage.

**Evidence and builds**

- Evidence keeps historical repository paths and commits, detects relocated document regions, and notices changes anywhere in a Skill directory.
- Optional repository entrance pages, original-source links, localized navigation and offline build fallbacks.
- Invalid registrations stay advisory with repair guidance, and invalid build inputs are rejected without replacing the previous output.
<!-- /context:section -->

<!-- context:section id="context-074x" -->
## Context 0.7.40 – 0.7.43 (2026-09-29 to 2026-10-01)

These releases made remote code evidence part of normal querying:

- **0.7.40** — queries can use optional read-only remote code evidence at the recorded repository baselines before retrieving unavailable local sources, preserving fixed commits, returned line ranges, partial batch results and permission boundaries.
- **0.7.42** — approved knowledge and recorded code evidence can be read remotely without a checkout. The CLI bundles a read-only repository Wasm plugin that attaches section evidence and commit-specific source URLs, installed with `context evidence install` or at workspace initialization.
- **0.7.43** — the plugin moves to ABI 2 and attaches compact references to individual read items without replacing their content; remote query guidance follows bounded default reads, file-only search and per-file match limits.

Local and offline retrieval keep working throughout. See [Reading Code Evidence Remotely](../../sop/querying-knowledge/reading-code-evidence-remotely.md).
<!-- /context:section -->

<!-- context:section id="context-0735" -->
## Context 0.7.35 – 0.7.36 (2026-09-22)

- **Planning for large projects.** The `context-plan` Skill researches a project or a broad source update, hands one stage at a time to production, and recovers from a Git-backed plan. A stage is recommended at thirty documents and capped at fifty, with one newly researched repository per stage; broad discovery needs scope confirmation, and more than five hundred documents needs a person. See [Planning Large Projects](../../sop/planning-and-production/planning-large-projects.md).
- **Delegated review.** A task can delegate plan and article review while human review stays the default and authorization boundaries are kept; see [Managed Mode and Review Policy](../../sop/planning-and-production/managed-mode-and-review-policy.md).
- **Document capture.** Online document snapshots can be fetched without a workspace and imported later; directory discovery is resumable, and registrations are staged with checkpoints, status, replay and cancellation.
- **Review reports** list unplaced articles with navigation recovery guidance.

Releases before 0.7.35 are listed in the full CHANGELOG.
<!-- /context:section -->

<!-- context:section id="agent-graph" -->
## Agent Graph

**0.3.1 (2026-10-13)** raises the `compatibility.agentGraph` range in the scaffold, templates and examples to `^0.3.0`, documents the 0.3.0 Resource protocol migration, and links the repository guides to this site.

**0.3.0 (2026-08-31)** is a breaking release for Provider authors. The Resource v1/v2 split is replaced by three independent v1 protocols — file, Graph-action and Host-action resources and their locations — and the former `agent-graph.resource.v1`, `.v2`, `agent-graph.resource-location.v1` and `.v2` identifiers are removed. The Host Action input, output and recovery interface is unchanged, but each materialization authority is now explicit in serialized Routes and SDK types. Follow [Migration](../reference/agent-graph/migration.md) to rename the protocols in an existing Provider.

The 0.2 line built the contract that 0.3.0 renamed:

| Release | Main addition |
| --- | --- |
| 0.2.7 | Host-materialized resources with versioned input and output schemas and pre-dispatch Provider validation |
| 0.2.6 | Gate-owned delegated execution policies |
| 0.2.5 | Lifecycle-aware evidence as ordinary revision-bound Facts |
| 0.2.3 | Resource read receipts for the current conversation |
| 0.2.1 – 0.2.2 | Gate resolution and read-only Gate inspection Actions |
| 0.2.0 | Fact-grounded routing contracts and catalog-backed reason codes |

0.1.0 (2026-07-22) published the first specification, SDK, CLI, schemas, templates and examples. For what these terms mean, see [Core Model](../../architecture/agent-graph/core-model.md).
<!-- /context:section -->
