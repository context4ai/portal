---
title: Release Notes
type: Wiki
description: What changed in recent Context and Agent Graph releases, which
  changes need action when you upgrade, and where the complete changelogs live.
timestamp: 2026-10-23T04:46:46.644Z
---
# Release Notes

<!-- context:section id="overview" -->
These notes summarize recent product releases by what readers and Agents notice. The complete history is in the [Context CHANGELOG](https://github.com/context4ai/context/blob/main/CHANGELOG.md) and the [Agent Graph CHANGELOG](https://github.com/context4ai/agent-graph/blob/main/CHANGELOG.md). The site's own **Changelog** entry in the More menu is different: it lists the versions of this documentation, not product releases.

To upgrade Context, run the same two commands as a first installation — `npm install -g @c4a/context-cli@latest` and `context plugin install` — and restart the Agent session; see [Installation](../getting-started/installation.md). An active knowledge workspace needs no migration step: the next `context status` returns a fresh Route for the upgraded CLI, and workflow read receipts are kept when a task resumes.
<!-- /context:section -->

<!-- context:section id="context-0782" -->
## Context 0.7.81 and 0.7.82 (2026-10-22 to 2026-10-23)

**Registering monorepo packages**

- A repository source can name its module directory as a repository-relative `subpath`: as the `subpath` field of a repo item in `context source add batch`, or as `context source add repo --subpath <dir>`. A package can therefore be registered from the repository's `remote` and pinned `ref` alone, before any checkout exists, or from a checkout root plus the package directory (0.7.81).
- Pointing `local` at a directory inside the checkout still sets the scope by itself; a `subpath` that names a different directory is rejected instead of silently overriding it. Absolute paths and paths that leave the repository with `..` are refused, and `.` selects the repository root.
- A batch item with a field Context does not accept now names the fields that item type does accept, so the Agent can correct the entry in one attempt. The source-capture guidance names the registration fields directly instead of asking the Agent to look them up.

**Website navigation**

- Website sidebars and section landing pages follow the knowledge map order at every level. Articles and directories can be interleaved, for example an overview and a quick start before a Guides directory and a Reference directory; earlier versions always moved directories ahead of their sibling articles (0.7.82).
- On a section landing page each directory is a card, and consecutive loose articles share one card at their position in the map. A site whose map already lists directories first looks the same after upgrading.
<!-- /context:section -->

<!-- context:section id="context-0780" -->

## Context 0.7.72 to 0.7.80 (2026-10-15 to 2026-10-21)

**Updates and revisions**

- Settling a source update or a revision queue no longer leaves `knowledge/structure.yaml` stale. Previously, relocated citations or advanced repository content references kept the old input hash, so `verify` reported "Structure is stale; run Close" until Close ran again.
- Citations can be relocated on a machine without the local source region cache, such as a fresh clone: for repository sources Context reads the cited region from the previously settled commit and uses it only when it still matches the recorded digest. Otherwise the citation is kept and reported as before.
- A source update that names `processed_version` while the repository checkout differs from its pinned ref returns the error and no longer leaves the workspace write lock behind.
- Kept pages whose `repo-content:` citations changed or cannot be confirmed are now listed in the update's `reference_warnings`. Their citations are still re-signed to the current repository text, so the receipt is the place to find them.

**Installation and sites**

- `context plugin install` and `context plugin status` look up the `claude` and `codex` commands on the inherited `PATH` of the shell that runs them, and quote executable names safely (0.7.73).
- The package output guide now states that websites open in light mode until the reader switches, rather than following the operating system.

**Performance**

- Within one command and its in-process workflow steps, Markdown link parsing is reused through a separate, bounded cache. File freshness and workflow authority checks are unchanged, and there is no background service or cross-process cache (0.7.80).

<!-- /context:section -->

<!-- context:section id="context-0771" -->
## Context 0.7.70 and 0.7.71 (2026-10-14)

**Installation**

- Claude Code and Codex can also install the `c4a` plugin by adding the context4ai/context repository as a plugin marketplace; the CLI is still installed from npm. The installation instructions list Bun next to Node.js 20, because knowledge workspaces install their dependencies with `bun install`. See [Installation](../getting-started/installation.md).

**Revisions and updates**

- A revised section that omits `references` keeps its validated citations; listing references re-confirms them against the task's sources. Citations can be located by Markdown heading or exact quote, and a fragment may cite regions from up to three source files, eight regions in total. Earlier CLIs cannot read structures with more than three regions in a fragment.
- Rejected references and incomplete source-update decisions are reported as user input, naming the fragment, the input path and the allowed sources or pages. A revision that needs a source outside its scope explains how to register it, associate it with the requirement in `src/indexers.yaml` and run `context task adjust`; the added source stays citable by the remaining queued pages.
- When a source update settles, citations of kept pages whose text only moved are relocated. Kept pages whose cited text changed or cannot be confirmed are listed in `reference_warnings`, to be corrected with `context revise` after the update queue finishes.

**Translation**

- `translate prepare` is incremental: each pending article gets a draft — its stale translation, or the approved source when missing — and a `source_diff` when Git history holds the version it was translated from. Edited drafts are kept and drafts are removed after a successful submission. Translations no longer store `source_parts`.
- Prose in `text`, `txt` and `plaintext` code blocks may be translated. In-page and cross-page anchors keep the reader's language, and reader pages expose each fragment ID as an anchor.

See [Revising a Page](../../sop/review-and-revision/revising-a-page.md), [Updating Knowledge](../../sop/updates-and-versions/updating-knowledge.md) and [Multilingual Sites](../../sop/outputs-and-sites/multilingual-sites.md).
<!-- /context:section -->

<!-- context:section id="context-0767" -->
## Context 0.7.63 to 0.7.67 (2026-10-13 to 2026-10-14)

**Knowledge websites**

- Sites open in light mode regardless of the system color scheme. The reader's light/dark and language choices are remembered per origin by default, so sites on one origin share them.
- `context build` no longer compares cited source regions, so publishing builds do not need the registered source checkouts; run `context verify` before publishing.
- Inline code that names a cited repository file, one of its directories or the unique name of such a directory links to that path at the recorded revision; uncited or ambiguous names stay plain text.
- Section landing pages show each first-level group as a card. A `site.nav` link with `position: "start"` appears before the sections, pages outside every section show no sidebar, and the homepage highlights a nav link to the current page instead of the first section.
- Custom slots such as a homepage banner no longer collapse for readers in dark mode, and collapsed changelog cards keep long titles on one truncated line.

See [Documentation Sites](../../sop/outputs-and-sites/documentation-sites.md).
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
