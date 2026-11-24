---
title: Release Notes
type: Wiki
description: What changed in recent Context and Agent Graph releases, which
  changes need action when you upgrade, and where the complete changelogs live.
timestamp: 2026-11-24T21:42:41.958Z
---
# Release Notes

<!-- context:section id="overview" -->

These notes summarize recent product releases by what readers and Agents notice. The complete history is in the [Context CHANGELOG](https://github.com/context4ai/context/blob/main/CHANGELOG.md) and the [Agent Graph CHANGELOG](https://github.com/context4ai/agent-graph/blob/main/CHANGELOG.md). The site's own **Changelog** entry in the More menu is different: it lists the versions of this documentation, not product releases.

To upgrade Context, run the same two commands as a first installation — `npm install -g @c4a/context-cli@latest` and `context plugin install` — and restart the Agent session, or let the Agent do it when you next start production; see [Installation](../getting-started/installation.md#versions). An active knowledge workspace needs no migration step: the next `context status` returns a fresh Route for the upgraded CLI, and workflow read receipts are kept when a task resumes.

<!-- /context:section -->

<!-- context:section id="context-0801" -->

## Context 0.7.100 and 0.7.101 (2026-11-16 to 2026-11-24)

**Bringing in existing knowledge**

- `context-plan` researches existing knowledge collections the same way every time: it settles purpose and constraints with you, identifies each collection's kind and real upstreams, audits a sample of claims against code, scores the ways to bring each one in, and presents a conclusions-first research report built with a bundled template (0.7.101). See [Planning Large Projects in Stages](../../sop/planning-and-production/planning-large-projects.md) and [Migrating an Existing Knowledge Base](../../sop/practices/migrating-a-knowledge-base.md).
- A document source can follow content another team publishes as versions: you install the exact version as files, Context records the origin and version in the snapshot and the site links to that version. A source can also keep its folders and linked images, capture JSON or YAML files as documents, and be frozen after its original is archived. A broken or oversized linked image is now reported as an asset gap instead of stopping capture (0.7.101). See [Following Versioned Content and Archived Collections](../../sop/registering-sources/versioned-external-content.md).
- A requirement can keep its pages as written: articles keep the original titles, sections, order and wording, and passages that contradict the code are proposed as revisions you decide on in the review report (0.7.101). See [Keeping Pages as Written](../../sop/review-and-revision/keeping-pages-as-written.md).

**Sites and packages**

- A knowledge-map group can be hidden: it stays out of the website menus and the "All articles" list but remains in knowledge packages and LLM Docs, for content that only packages should carry (0.7.101). See [Documentation Sites](../../sop/outputs-and-sites/documentation-sites.md#navigation).

**Fixes**

- In a new workspace without requirements, the first step's resource commands no longer fail with "workflow revision is invalid" (0.7.100).
- Updating one repository in a workspace with many sources not checked out lists each unreadable source once, keeping the update's instructions small; knowledge-map adjustments report the map's own input errors (0.7.101).

<!-- /context:section -->

<!-- context:section id="context-0799" -->

## Context 0.7.95 to 0.7.99 (2026-11-08 to 2026-11-13)

**Keeping knowledge current**

- `context update --pending` downloads the contents of cited files that a partial clone does not have yet, once per source; when it cannot, it stops and names the source, the number of files and the reason. An update with an explicit input file reads only what the checkouts already have (0.7.95). See [Updating Knowledge](../../sop/updates-and-versions/updating-knowledge.md).
- Source updates list the changed files that no approved page cites, grouped by directory, so new modules and interfaces are assessed too; routine updates write lasting knowledge from them into existing pages or at most five new pages per run (0.7.95). See [Set Up Routine Updates](../../sop/updates-and-versions/scheduled-updates.md).
- A routine update enters the workspace your host names, cloning it when needed and never creating one, and states its effective review, publishing and time settings before any other step (0.7.95). Its task content now starts with a plain line naming the Context Skill instead of a slash command, because some schedulers expand a leading command and drop the settings after it; update existing schedules.
- Long Git fetches and clones continue while Git shows progress, stop after about five minutes without progress and after 30 minutes at most (0.7.97). See [Code Repositories](../../sop/registering-sources/code-repositories.md#clones).

**Review and revision**

- Previews and submissions report every citation problem of a page or production article at once, a revision of a source version cannot keep citations that version no longer confirms, and results list citations a section no longer carries (0.7.95 – 0.7.97). A capture gap cannot be cited; the captured text around it can (0.7.97). See [Revising a Page](../../sop/review-and-revision/revising-a-page.md).
- `context version record` refuses while drafts await review, a version already on the remote default branch is never offered for reuse, and a knowledge-map-only change after delivery is recorded as a patch version and built straight away (0.7.96 – 0.7.97). See [Versions, Changelog and Restoring](../../sop/updates-and-versions/versions-and-changelog.md).

**Lark sources**

- With Bot identity, a document the Bot cannot open (code 3380004) is read again as you; the capture report records the identity and the reason, and `context status` keeps showing the fallback with its risk until the document is captured again (0.7.98). See [Lark Documents](../../sop/registering-sources/lark-documents.md#identity).
- A synced block whose source the reading identity cannot open becomes a permission gap that says how to close it, and refreshing an unchanged revision saves the snapshot and lists each downgrade (0.7.97).

**Rolling back a task**

- `context task rollback` finishes when the workspace has an unfinished production stage, and its preview says whether that stage is discarded or kept; a stage prepared after the rollback is kept, and a requested partial delivery it cancels is listed (0.7.99). See [CLI Commands](../reference/context/cli-commands.md#tasks).

**Installation**

- Local plugin installs also install the `resources/` folders the commands link to and keep each command's front matter; a workspace that pins its own CLI runs workflow commands with it; the entry Skill starts when you ask in the conversation to produce, update, revise, publish or recover knowledge (0.7.96). See [Installation](../getting-started/installation.md#local).
- Piping CLI output to a reader that stops early no longer crashes it (0.7.97).

<!-- /context:section -->

<!-- context:section id="context-0793" -->

## Context 0.7.83 to 0.7.94 (2026-10-24 to 2026-11-08)

**Keeping knowledge current**

- Routine updates: a scheduled Agent run checks every registered source, updates what changed in batches, publishes once and reports what needs you. See [Set Up Routine Updates](../../sop/updates-and-versions/scheduled-updates.md).
- Updates ask only about pages whose cited text no longer matches; citations whose text only moved follow it, and a re-pinned repository is processed without restating the change — its new commit is fetched when the source checkout does not have it yet. See [Updating Knowledge](../../sop/updates-and-versions/updating-knowledge.md).
- A Lark document whose new copy comes back incomplete keeps its last good copy. See [Lark Documents](../../sop/registering-sources/lark-documents.md).
- A single document can be restored from an earlier capture. See [Versions, Changelog and Restoring](../../sop/updates-and-versions/versions-and-changelog.md).

**Review and revision**

- Further changes asked for before approval join the open review, several revised pages are checked together before they are submitted, and small mechanical fixes after approval need no second review. See [Revising a Page](../../sop/review-and-revision/revising-a-page.md).
- Pages can be retired inside an open review, which shows the planned result before anything is removed. See [Reorganizing at Scale](../../sop/review-and-revision/reorganizing-at-scale.md).
- The review report starts in your workspace's language, has Previous and Next buttons and lists every navigation change, and every approved batch keeps its own copy of the report. See [Reading Review Reports](../../sop/review-and-revision/reading-review-reports.md).

**Installation and versions**

- A missing CLI is installed once when your host allows Context upgrades, and the CLI, the Context Skill and your workspace's SDK are kept on the latest release of your version line. See [Installation](../getting-started/installation.md#versions).

**Packages and sites**

- Knowledge packages share one query Skill that searches every installed Context package and follows each page's sources back to the recorded code or document. See [Using Knowledge Packages in Agents](../../sop/querying-knowledge/using-packages-in-agents.md).
- Website articles end with a map of their sources. See [Documentation Sites](../../sop/outputs-and-sites/documentation-sites.md).
- Translations of removed pages are cleaned up automatically, and links to another page's section use its section ID so they work in every language. See [Multilingual Sites](../../sop/outputs-and-sites/multilingual-sites.md).
- A knowledge workspace kept inside a larger repository compares versions within its own directory. See [Versions, Changelog and Restoring](../../sop/updates-and-versions/versions-and-changelog.md).
- Status, updates and page submissions are faster on large knowledge workspaces.

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

Local and offline retrieval keep working throughout. See [Choose how Context reads code](../../sop/source-graph/connecting.md#choose-how-context-reads-code).
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
