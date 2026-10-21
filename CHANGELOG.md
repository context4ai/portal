# Changelog

## 0.13.8 — 2026-10-21

### Benchmark rewritten as one report; query knowledge through MCP

- Knowledge Retrieval Benchmark is rewritten around three findings: knowledge replaces blind exploration, Source Graph replaces local preparation, and on the same knowledge models differ far more in speed and cost than in quality. All seven model runs, including DeepSeek V4.1 Flash 1017 and a self-hosted Qwen 3.8 Flash Next, sit in one table.
- Choosing Models is rewritten to match: the roles, a short summary of the benchmark and how to check a model on your own questions.
- New guide Querying Through MCP in Your Agent: connect any MCP client to Source Graph and give it a retrieval prompt to answer from a team's knowledge and code with nothing installed, with the public demo as a working example.
- Asking Questions now compares the three ways to reach knowledge; What Is Source Graph and Self-Hosting describe the demo's four repositories, including this site's knowledge workspace.
- zh-CN versions of all changed pages are written in natural Chinese.

Trigger: note: New benchmark runs and a verified guide to MCP querying on the public demo were recorded as notes.; translation: zh-CN pages rewritten for the changed pages.
User: qiansc (git)

## 0.13.7 — 2026-10-21

### Update model selection and retrieval comparisons

- Add Muse Wonder as a primary candidate for knowledge retrieval and code Q&A, with a scoped 24-question comparison against Opus.
- Align English and Chinese model guidance while preserving existing team preferences and anonymized evaluation boundaries.

Trigger: note: Updated aggregate evaluation results and model-selection guidance.
User: qiansc (git)

## 0.13.6 — 2026-10-20

### Polish zh-CN translations and clarify the Context definition

- Add symmetric spacing around inline links in the zh-CN translations.
- Clarify that agents read knowledge first when answering questions.
- Promote DeepSeek 4.1 Flash 1017 as the primary model in model guidance.

Trigger: translation: Polished zh-CN translations for readability and consistency.
User: qiansc (git)

## 0.13.5 — 2026-10-20

### Guides restructured around the reader's journey

- Guides now follow the order you work in: Planning and Producing, Adding Sources, Review and Revision, Outputs and Sites, Using Knowledge, Keeping Knowledge Current, Knowledge Service, Custom Indexers, Practices and Evaluation, then Source Graph and Agent Graph as the last two subsections.
- Working with Agents opens the Guides in a friendlier tone and introduces each following section under Learn more through these Guides; pages are written as requests to your Agent instead of CLI and configuration detail.
- Merged overlapping pages: session summaries into Notes and Conversation Summaries, large projects into Planning Large Projects in Stages, restoring into Versions, Changelog and Restoring, committing into Starting a New Task and Saving Your Work, document indexers into Writing Indexer Guidance, deployment recommendations into Self-Hosting, and prompt recipes into Commands and Skills.
- Clarified that the Agent commits to Git when a round ends, that the four Indexer kinds each hold several Skills, and that the benchmark results describe Context with Source Graph.
- Updated the zh-CN translations and sidebar titles for the revised Guides, and link labels on other pages now use the new page titles.
- Fixed bold text in Chinese pages that showed literal asterisks next to Chinese punctuation.

Trigger: navigation: Guides reorganized by reader task, with merged and retitled pages.; translation: zh-CN site pages re-translated for the revised Guides.
User: qiansc (git)

## 0.13.4 — 2026-10-19

### Responsive homepage and portable preview workflow

- Improve phone and tablet homepage layouts and keep documentation navigation clear of the brand.
- Serve a useful temporary response while preview output is rebuilding.
- Restore pinned source caches as self-contained repositories.
- Upgrade Context SDK and CLI to 0.7.73.

Trigger: repair: Publish the reviewed homepage, preview and source restoration improvements.
User: qiansc (git)

## 0.13.3 — 2026-10-16

### Introduction video and a quieter documentation home

- The documentation home uses one blue for links and highlights, and lighter borders across the site.
- Site Map and Tools and Resources share the heading, card and spacing of the sections above; section names on site-map cards are no longer shrunk to small gray text.
- Benchmark and compression figures use the body font in ink; blue marks only links, knowledge figures and the live path.
- Homepage diagrams use one dash pattern, lighter lines and labels of at least 12px; the footer keeps a single rule.
- The homepage slogan and docs home open the three-minute introduction at /intro/, with native fullscreen playback on phones and tablets.
- Local preview serves the homepage and documentation together; outlined entry buttons use a solid page-colored background.
- Build tooling uses Context SDK and CLI 0.7.72.

Trigger: other: Review of the documentation home found sections with different heading, card and color styles; the quieter variant was chosen without changing the layout.; other: Requested the introduction video, local preview and solid button backgrounds.
User: qiansc (git)

## 0.13.2 — 2026-10-15

### Citations re-confirmed against Context 0.7.71 sources

- Citations on 42 pages point to the current source positions; 17 cited passages had changed (version numbers, links, the Bun requirement, marketplace install text) and were re-read.
- Project API documents the nav link position option; Page and Theme Customization notes that sites open in light mode and remember the reader's choice per origin.
- Chinese translations follow both changes.

Trigger: repair: Source regions cited by pages written before region baselines existed no longer matched the 0.7.71 sources.
User: qiansc (git)

## 0.13.1 — 2026-10-15

### Plugin marketplace install and Context 0.7.63–0.7.71 updates

- Installation adds installing the c4a plugin in Claude Code or Codex by adding the context4ai/context repository as a plugin marketplace; the CLI is still installed from npm.
- The knowledge-workspace page links to Referencing Same-Repository Docs and Skills by its current title.
- Release Notes add Context 0.7.63–0.7.67 (light-mode default, builds without source checkouts, inline code links, section landing cards, start nav links) and 0.7.70–0.7.71 (marketplace install, heading and quote locators, up to eight regions per fragment, kept citations on revision, relocated citations after updates, incremental translation drafts).
- Documentation Sites, Page and Theme Customization, Multilingual Sites, Revising a Page, Updating Knowledge, Evidence Chains, CLI Commands, Package Templates and the Code and Document Indexer guides follow these changes.
- Chinese translations follow every change.

Trigger: module: Context and Agent Graph sources updated to the Context 0.7.71 release.; other: Requested documentation of the plugin marketplace installation and a corrected link title.
User: qiansc (git)

## 0.13.0 — 2026-10-15

### Clearer getting-started path, cost guidance and same-repository content

- What is Context states its main strength (building systematic knowledge step by step from existing docs and code), defines LLM Wiki, says what a round produces and sets the reading order.
- The Workflow at a Glance now has five steps after a one-time installation, marks the two decisions that are yours, and adds token cost from experience for a first build, updates and answers.
- Quick Start drops commands the Agent runs for you, adds resuming after an interruption and a first question; Core Concepts explains the work-start report and managed mode and separates knowledge/structure.yaml from the navigation map.
- Commands and Skills puts common requests first and summarizes automatic Skills; Installation adds Bun and notes it happens once per machine.
- Same-Repository Docs is now Referencing Same-Repository Docs and Skills: register docs and Skills maintained beside the code so Context references them instead of producing them again; related pages and the FAQ link to it.
- Chinese translations follow every change.

Trigger: note: New getting-started guidance note: main strengths, reading order and token cost.; other: Port reader-facing refinements from another Context knowledge base's getting-started pages, excluding organization-specific infrastructure.; translation: Update zh-CN translations of the revised pages.
User: qiansc (git)

## 0.12.1 — 2026-10-14

### Natural Chinese example prompts and language-stable anchors

- Translate plain-text example prompts and explanatory comments into natural Chinese while preserving commands, paths and placeholders.
- Links to a section keep the Chinese reader on the Chinese page and scroll to the matching heading, including repeated clicks and back/forward.

Trigger: translation: Refresh Chinese text blocks without changing approved source articles.; module: Context CLI 0.7.70 permits translated prose in text, txt and plaintext fences, keeps anchors in the reader's language and records translation baselines for incremental updates.
User: qiansc (git)

## 0.12.0 — 2026-10-14

### Cold-starting a knowledge base

- New guide Cold-Starting a Knowledge Base: explore code before registering, screen each source group by relevance, reader fit, authority, recency, verifiability and conflict, name a baseline, settle a three-level structure before writing, and keep raw material apart from sources, with two example opening conversations.
- Knowledge for Agents explains how deep code knowledge goes: locating and contract layers up front, implementation read on demand at a pinned commit.
- External Entrances separates registered sources, entrances and a raw folder; Best Practices and Prompt Recipes link the new guide.

Trigger: note: A desensitized note on cold-start practice and two example conversations.; navigation: Cold-Starting a Knowledge Base placed second under Practices.; translation: Chinese translations for the new and revised pages.
User: qiansc (git)

## 0.11.3 — 2026-10-14

### Source Graph code source settings

- Registering Repositories and Configuration now describe the Code sources settings page, with one card per source holding its token and, for the custom Git source, its name, host and HTTPS username, and the personal Code source tokens.
- The GitHub environment token is SOURCEGRAPH\_GITHUB\_TOKEN, with SOURCEGRAPH\_GIT\_TOKEN still read while it is unset.
- Source Graph pages cite its new code sources and tokens reference; their other guidance is unchanged.

Trigger: module: Source Graph reorganized its code source settings, renamed the GitHub environment token and added a code sources reference.; translation: Chinese translations for the revised pages.
User: qiansc (git)

## 0.11.2 — 2026-10-14

### Context 0.7.67

- The site opens in light mode regardless of the system color scheme; the reader's light/dark and language choices are shared across sites on this origin.
- Pages are built without reading the source repositories; CI fails when context verify reports a changed or moved cited source region.

Trigger: other: Upgrade to Context 0.7.67, which leaves source-region checks to verify.
User: qiansc (git)

## 0.11.1 — 2026-10-14

### Source Graph code sources

- Registering Repositories now explains the two code sources, GitHub and a custom Git host, that the repository host is fixed at registration, and the token order: your own, global, environment, then anonymous for GitHub.
- Configuration gained a Code sources section covering deployment defaults, the custom Git settings on the website and the SOURCEGRAPH\_CONFIG\_FILE startup file, locked fields and the in-use host rule; SOURCEGRAPH\_CUSTOM\_GIT\_TOKEN is listed.
- HTTP and MCP lists GET /v1/code-sources and the code\_source settings section; the CLI page describes the host-bound credential helper; Authentication and Operations now refer to per-source tokens.

Trigger: module: Source Graph added configurable GitHub and custom Git code sources.; translation: Chinese translations for the six revised pages.
User: qiansc (git)

## 0.11.0 — 2026-10-14

### Source Graph and Agent Graph introductions

- Added What Is Source Graph and What Is Agent Graph as the first Guide pages, explaining why each exists, what problem it solves and where to start.
- Moved self-hosting, deployment, sign-in and operations pages into a separate Operating Source Graph group so Source Graph users see the introduction, connecting and registering first.
- Renamed Agent Graph Getting Started to Quick Start and replaced its path table with what the tutorial delivers and a link to the introduction.
- Connecting to Source Graph now opens with why to connect and links the introduction; the optional-use note moved there.
- Renamed Why Graph Engineering to Graph Engineering Principles and removed the example and usage guidance now covered by the introduction.
- Renamed the Source Graph overview to Architecture Overview and kept it to surfaces, components and access, linking the introduction for purpose.

Trigger: navigation: Guides now lead with introduction pages; operator pages and renamed How It Works pages moved accordingly.; translation: Chinese translations for the new and revised pages.
User: qiansc (git)

## 0.10.1 — 2026-10-13

### Guide order

- Guides reorder their groups to follow how readers meet them: registering sources, planning and production, review, outputs and sites, querying, updates and versions, and workspace maintenance, then the knowledge service Agent, custom Indexers, Source Graph, Agent Graph, practices and evaluation
- Custom Indexers lists the community Indexers first, then combining, replacing and disabling them, then creating and writing your own; the Community Indexers page's next steps follow the same order

Trigger: navigation: Guide groups and Indexer guides reordered; translation: zh-CN translation of the revised Community Indexers page
User: qiansc (git)

## 0.10.0 — 2026-10-13

### Evaluation guides

- New Guides › Evaluation group: Evaluating Your Knowledge Base, Scoring and Timing Standard, and Knowledge Retrieval Benchmark; Benchmark Results is no longer under How It Works
- Evaluating Your Knowledge Base now covers the full design: scope, questions and per-question guides, frozen conditions, evidence, blind grading, attribution, deliverables and a copyable Agent prompt
- New Scoring and Timing Standard: metrics, material errors, four grades, fairness, calibration, denominators, timing and tool calls, with the industry methods it draws on
- Knowledge Retrieval Benchmark adds a three-model comparison, error and overhead causes, a startup estimate and next improvements
- Homepage evidence links follow the default branch, and the Source Graph card on the docs home opens the service directly

Trigger: note: New evaluation method note; navigation: Evaluation group replaces Benchmark Results; repair: Homepage links returned 404; translation: zh-CN translations
User: qiansc (git)

## 0.9.1 — 2026-10-13

### Clickable Indexer names and source paths

- The Indexer System drops its separate Source column: each built-in Indexer name now links to its Skill directory at the cited revision.
- Community Indexers drops the Source directory column; Skill names in the overview and the source path at the end of each section link to the cited revision instead of hand-written GitHub links.
- Both pages are updated in Simplified Chinese.
- Upgrades Context to 0.7.65, which links cited repository paths and Skill names in article text.

Trigger: repair: User-requested revision so repository names and paths are clickable instead of listed in separate columns.; translation: Simplified Chinese translations of both revised pages.; other: Context 0.7.65 release.
User: qiansc (git)

## 0.9.0 — 2026-10-13

### Source Graph deployment recommendations

- New guide, Source Graph Deployment Recommendations: choosing one instance or repository-sharded instances, sizing and sharding rules, and how the public demo behind this site is deployed on Fly.io.
- HTTP and MCP notes that Source Graph is optional for Context: without it, the query skill reads code through a shallow sparse clone and grep.
- Every new and changed page is available in Simplified Chinese.
- Connecting explains that Source Graph is optional and points to the public demo as a ready target.
- Reading Code Evidence Remotely states up front that Source Graph is optional and that the query skill falls back to a shallow sparse clone with grep.
- Why Graph Engineering links the Agent Graph GitHub repository.
- Source Graph Overview adds the GitHub repository, the live demo endpoints that serve this site's knowledge service, and that Source Graph is optional for Context.
- The How it works diagram on What is Context is split into three rows: produce, review and use.
- Self-Hosting keeps building, databases and backups, and points to Deployment Recommendations for topology and the Fly.io example.

Trigger: note: Registered a maintainer note on the public Fly.io demo deployment.; navigation: Added Deployment Recommendations to Guides › Source Graph.; translation: Simplified Chinese translation of the new page.; repair: User-requested revisions to existing pages.
User: qiansc (git)

## 0.8.0 — 2026-10-12

### Context 0.7.62 and Agent Graph 0.3.1

- Updated for Context v0.7.62: What is Context follows the new positioning as a knowledge workflow for engineering teams and their AI agents, and the getting-started pages match the rewritten README and installation steps.
- Release Notes add Context 0.7.62 and Agent Graph 0.3.1; Contributing and Support follow the projects' new contributing and support guides.
- Agent Graph pages document 0.3.1: Provider compatibility ^0.3.0, file, Graph-action and Host-action location envelopes in Routes, and the 0.3.0 upgrade steps in Migration.
- Core Concepts no longer claims that rejected material keeps a durable fingerprint; Module Layout lists the plugin's bundled Skills.
- Source citations follow the moved lines in the updated repositories, and every changed page is available in Simplified Chinese.

Trigger: module: Updated the Context repository source to v0.7.62 and the Agent Graph source to v0.3.1.; translation: Simplified Chinese translation of the revised pages.
User: qiansc (git)

## 0.7.0 — 2026-10-12

### Context 0.7.61 and the More menu

- More menu: new Release Notes, Contributing and Support pages for Context and Agent Graph.
- Updated for Context v0.7.61: the production entry and the other public Skills, first-paint theme and localized 404 pages on documentation sites, homepage fallback for reader languages, and object-ID comparison when planning broad updates.
- Fixed the More menu order in the Project API reference: custom items come before LLM Docs and Changelog.
- Module Layout now states where extractor and evidence-plugin changes land; What is Context links to the Source Graph and Agent Graph sections.
- Every changed page is available in Simplified Chinese.

Trigger: module: Updated the Context repository source from v0.7.60 to v0.7.61.; note: Updated the note on how this site is produced to cover the source update.; navigation: Added Release Notes, Contributing and Support to the More menu.; translation: Simplified Chinese translation of the new and revised pages.
User: qiansc (git)

## 0.6.0 — 2026-10-12

### Agent Graph

- How It Works › Agent Graph: why Graph Engineering, the core model, runs and recovery, Skills and Providers, and how Context uses Agent Graph, including how this site was built with Context.
- Guides › Agent Graph: getting started, authoring Graphs with a worked example, and testing and publishing.
- Reference › Agent Graph: the v1 specification, the CLI and SDK, and migration across releases.
- Fixed a diagram that did not render on the Skills and Providers page.
- Every new page and navigation title is available in Simplified Chinese.

Trigger: module: Added the Agent Graph repository, pinned at v0.3.0, as a source for the fifth stage.; note: Added a reviewed note describing how this documentation site is produced with Context.; navigation: Added Agent Graph sections under How It Works, Guides and Reference.; translation: Simplified Chinese translation of the new pages and navigation.
User: qiansc (git)

## 0.5.0 — 2026-10-12

### Source Graph: how it works, guides and reference

- Add a Source Graph group under How It Works: Source Graph Overview, Pinned Search and Reads, Evidence for Context.
- Add a Source Graph group under Guides: Connecting, Registering Repositories, Self-Hosting, Authentication and Access Control, Operations.
- Add a Source Graph group under Reference: HTTP and MCP, CLI, Query Syntax, Configuration.
- Correct the Operations guide: the Storage page moves only Git mirrors; indexes stay in the data root.
- Add Simplified Chinese translations for all new pages and navigation titles.

Trigger: module: New pages written from the community Source Graph repository and the Context remote code evidence integration.; navigation: How It Works, Guides and Reference each gain a Source Graph group.; translation: Simplified Chinese added for new pages.
User: qiansc (git)

## 0.4.0 — 2026-10-12

### Outputs and sites, knowledge service Agent, workspace maintenance, practices and the Context reference

- Add an Outputs and Sites group: Knowledge Packages, Documentation Sites, Page and Theme Customization, LLM Docs, Multilingual Sites, Custom Output Templates.
- Add a Knowledge Service Agent group: Building a Knowledge Service, Using the Bot in Team Chat, Operational Knowledge.
- Add a Workspace Maintenance group: Preparing, Restoring, Committing.
- Add a Practices group: Best Practices, Choosing Models, Prompt Recipes, Migrating an Existing Knowledge Base, Evaluating Your Knowledge Base.
- Add a Reference section with a Context group: CLI Commands, Project API, Skills, Package Templates, Template Variables, Knowledge Collections.
- Link Commands and Skills to the new CLI Commands and Skills references.
- Add Simplified Chinese translations for all new pages and navigation titles.

Trigger: module: New guides and reference pages written from the Context repository's CLI, SDK, plugin Skills and manuals.; note: Practices and knowledge service guides written from reviewed usage, service design and benchmark notes.; navigation: Guides gain four groups; a top-level Reference section is added.; translation: Simplified Chinese added for new pages.
User: qiansc (git)

## 0.3.0 — 2026-10-12

### Knowledge workspace overview, commands, large projects and custom Indexers

- Add The Context Knowledge Workspace and Commands and Skills to Getting Started.
- Add Planning a Large Project to Planning and Production.
- Add a Custom Indexers group: Community Indexers, Creating an Indexer, Code Indexers, Document Indexers, Providers and Customization.
- Call the user's repository the Context knowledge workspace throughout Getting Started and How It Works; link the Indexer System to each Indexer's source.
- Update Simplified Chinese translations for new and revised pages.

Trigger: module: New guides written from the Context repository's CLI, plugin Skills and manuals.; navigation: Getting Started reordered; Custom Indexers group added.; translation: Simplified Chinese updated for new and revised pages.
User: qiansc (git)

## 0.2.0 — 2026-10-12

### Guides for registering sources, production, review, updates and querying

- Guides › Registering Sources: code repositories, document directories, Lark documents, notes, session summaries, source batches, external entrances and same-repository docs.
- Guides › Planning and Production: work-start reports, working with Agents, and managed mode with every confirmation policy switch, custom Bot defaults and task-scoped review policy.
- Guides › Review and Revision: reading review reports, revising a page and reorganizing at scale.
- Guides › Updates and Versions: updating knowledge, capturing from conversations, scheduled updates, writing back upstream, and versions and changelog.
- Guides › Querying Knowledge: asking questions, using packages in Agents and reading code evidence remotely.
- Pages use one name, Context knowledge workspace, and are available in Simplified Chinese.

Trigger: module: Second stage of the context4ai.org documentation plan, written from the Context repository and reviewed notes.; repair: Review feedback: enumerate all policy switches and unify workspace naming.; translation: Simplified Chinese translation of the new pages and navigation.
User: qiansc (git)

## 0.1.0 — 2026-10-12

### Getting Started and How It Works for Context

- Getting Started: what Context is, installation, a quick start, the six-step workflow, large projects, core concepts and an FAQ.
- How It Works › Context Architecture: overview, why Context is a workflow, the knowledge lifecycle, module layout, workflow execution, and packages and sites.
- How It Works › Knowledge Mechanisms: knowledge written for Agents, evidence chains and index-first reading, version-aware knowledge, keeping knowledge current, the Indexer system and code extraction.
- How It Works › Benchmark Results: the knowledge retrieval benchmark.
- Every page is available in Simplified Chinese, and diagrams follow the site's visual style.

Trigger: initial: First stage of the context4ai.org documentation plan, written from the Context repository and reviewed notes.; translation: Simplified Chinese translation of the new pages and navigation.
User: qiansc (git)

