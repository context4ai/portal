---
title: Custom Output Templates
description: How to tailor the package template — the entry page, the query
  Skill and directory navigation — and what the build checks so templates stay
  honest.
type: Guide
timestamp: 2026-10-12T17:02:32.263Z
---
# Custom Output Templates

<!-- context:section id="goal" -->
Every knowledge package is rendered from a **package template** in your Context knowledge workspace, by default `src/package-templates/kb/`. The template supplies the package entry page, the query Skill and any instructions for Agents; `context build` renders it and adds the selected approved articles. The generated default is a usable generic starting point. Customize it when your package needs project terminology, curated navigation, routing rules or task-specific Skills.

```mermaid
flowchart LR
  tpl["src/package-templates/kb/"] --> render["Render with Handlebars"]
  vars["Built-in and template.vars"] --> render
  render --> out["dist/name/"]
  approved["Selected approved articles"] --> out
  out --> check["Path, link and<br/>boundary checks"]
```
<!-- /context:section -->

<!-- context:section id="layout" -->
## What the template contains

```text
src/package-templates/
├── kb/
│   ├── AGENTS.md
│   ├── wikis/
│   │   └── index.md
│   └── skills/
│       └── knowledge-query/
│           ├── SKILL.md
│           └── scripts/
│               └── search.mjs
└── llms/
    └── llms.txt
```

A knowledge package template must contain at least one `SKILL.md` and `wikis/index.md`; a template with only `AGENTS.md` is rejected. Each rendered Skill lives at `skills/<skill-name>/SKILL.md` with a matching frontmatter `name`. To give the query Skill a project prefix, rename its template folder — for example `skills/android-query/` — since Context never derives Skill names from the package name. Add another Skill only when you want behavior beyond knowledge lookup.
<!-- /context:section -->

<!-- context:section id="review" -->
## Accept or edit before the first build

A newly initialized generic template must be edited or explicitly accepted before the first build. `context status` shows this as a package template review step: the Agent either accepts the unchanged default through the command the workflow returns, or you edit files under `src/package-templates/`. Context compares file digests and records the decision; it does not judge the template's prose.
<!-- /context:section -->

<!-- context:section id="entry" -->
## The entry page and navigation

`wikis/index.md` is the package's entry page. Tell readers what the package covers, who it is for and how to query it. Every selected root — `wikis/`, `guides/`, `rules/`, `feats/` — always gets an index. By default, small directories fold into their nearest generated ancestor index and a directory gets its own `index.md` only when it would expose more than 50 entries to its parent; set `navigation.foldDirectoryIndexes: false` to generate one per directory, or change `maxInlineEntries`.

For curated navigation, loop over the built-in variables in `wikis/index.md`:

```handlebars
{{#each knowledgeGroups}}
## {{title}} ({{count}})
{{#each items}}
- [{{title}}]({{href}})
{{/each}}
{{/each}}
```

| Variable | Gives you |
| --- | --- |
| `{{displayName}}`, `{{packageName}}` | Package display name and name |
| `{{knowledgeCount}}`, `{{knowledgeTimestamp}}` | Number of selected pages and the latest timestamp |
| `{{knowledgeItems}}` | Selected page metadata for loops |
| `{{knowledgeGroups}}` | Pages grouped by root and first directory |
| `{{knowledgeTreeNodes}}`, `{{knowledgeTree}}` | Nested tree, or its Markdown preview |
| `{{wikisRoot}}` … `{{featsRoot}}` | Package-relative root paths, for links inside Skills |

The complete list, with loops, conditionals and helpers, is in [Template Variables](../../product/reference/context/template-variables.md). Custom values come from `template.vars`.
<!-- /context:section -->

<!-- context:section id="skill" -->
## The query Skill

The default `knowledge-query` Skill already carries the structure-first query discipline and a BM25 search fallback. Edit its template when you need project terminology, entry points or task workflows. Put authoring notes in template comments or separate guidance — not in a final section addressed to authors inside the delivered Skill.
<!-- /context:section -->

<!-- context:section id="rules" -->
## Rules the build enforces

- **No second knowledge source.** Template prose that describes coverage, scope, known gaps or limits must cite approved knowledge, `context-build-inventory.json` or rendered structure data; otherwise the build reports a template-boundary diagnostic. Facts belong in approved articles.
- **No collisions.** Template paths are rendered first; a rendered path may not collide with a selected knowledge path or a generated index path. Rename the template file or exclude the knowledge path with `select.exclude`.
- **Valid links.** Links in every root index and generated child index must resolve inside the package; broken ones are reported as `package/index-link-invalid`.
- **Fix at the source.** Repair the template, the approved knowledge path or the declaration and rebuild; never patch `dist/`.

`context build` and `context verify` check structure, not whether the selected knowledge is meaningful for your readers — inspect the output yourself. The template API is in [Package Templates](../../product/reference/context/package-templates.md).
<!-- /context:section -->
