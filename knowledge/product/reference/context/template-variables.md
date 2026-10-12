---
title: Template Variables
description: The Handlebars syntax, helpers and built-in variables available to
  package templates, with the fields of knowledgeItems, knowledgeGroups and
  knowledgeTreeNodes.
type: Wiki
timestamp: 2026-10-12T17:02:32.263Z
---
# Template Variables

<!-- context:section id="goal" -->
Files under `src/package-templates/**` are rendered with Handlebars during `context build`. Templates can render values, loop over arrays, branch on conditions and carry template-only comments; they cannot run JavaScript. Variables work in file contents and in file paths. Custom values come from `template.vars`.
<!-- /context:section -->

<!-- context:section id="syntax" -->
## Syntax

```handlebars
Package: {{packageName}}
Approved pages: {{knowledgeCount}}
Inventory name: {{buildInventory.package.name}}

{{#each knowledgeGroups}}
## {{title}}
{{#each items}}
{{inc @index}}. [{{title}}]({{href}})
{{/each}}
{{/each}}

{{#if description}}
Description: {{description}}
{{/if}}
```

- Values support dotted paths.
- Loops can nest; `{{@index}}` is zero-based.
- `{{#if}}` renders when the value exists and is not `false`, an empty string or an empty array.

Template-only comments are stripped from the output:

```handlebars
{{! Removed by Handlebars. }}

<!-- context:template
Explain why this section exists and where to edit it.
-->
```

| Helper | Example | Meaning |
| --- | --- | --- |
| `inc` | `{{inc @index}}` | Adds 1 — for numbered lists |
| `json` | `{{json knowledgeGroups}}` | Formatted JSON, for debugging or machine-readable docs |
<!-- /context:section -->

<!-- context:section id="builtins" -->
## Built-in variables

| Variable | Type | Meaning |
| --- | --- | --- |
| `packageName` | string | Package name from the declaration |
| `packageKind` | string | `kb` or `llms` |
| `displayName` | string | Title-cased `packageName` unless `template.vars.displayName` overrides it |
| `skillsRoot`, `wikisRoot`, `guidesRoot`, `rulesRoot`, `featsRoot` | string | Final package roots: `skills`, `wikis`, `guides`, `rules`, `feats` |
| `skillName`, `skillPath` | string | Name and package-relative `SKILL.md` path of the Skill being rendered; empty outside a Skill |
| `knowledgeCount` | number | Number of selected approved pages |
| `knowledgeTimestamp` | string | Latest selected `timestamp`, or the epoch when empty |
| `knowledge`, `approvedKnowledge` | string | All selected pages concatenated for consumers, with path headings and without lifecycle metadata — can be large |
| `knowledgeItems` | array | One record per selected page |
| `knowledgeGroups` | array | Pages grouped by root and first directory |
| `knowledgeTreeNodes` | array | Nested path tree, for custom navigation |
| `knowledgeTree` | string | Markdown tree preview |
| `knowledgeItemsMarkdown` | string | Markdown list of up to 50 pages |
| `knowledgeGroupsMarkdown` | string | Navigation for the current index: direct links for folded directories, index links for expanded ones |
| `buildInventory`, `buildInventoryJson`, `buildInventoryPath` | object, string, string | The deterministic build inventory, its JSON, and its path `context-build-inventory.json` |
| `knowledgeStructure`, `knowledgeStructureJson`, `knowledgeStructurePath` | object or null, string, string | The selected-package projection of `knowledge/structure.yaml`; not copied into the package unless a template renders it |
| `knowledgeNamespace`, `namespacedKnowledge` | string, boolean | Legacy; empty and `false` for new workspaces |

`buildInventory.structure.edge_records` holds typed edges whose endpoints are in the package — use them for package-local relationship evidence.
<!-- /context:section -->

<!-- context:section id="items" -->
## `knowledgeItems` fields

| Field | Meaning |
| --- | --- |
| `path` (`dist_path`) | Package-relative path, such as `guides/architecture/entity/button.md` |
| `sourcePath` (`approved_path`) | Approved path before mapping, such as `architecture/entity/button.md` |
| `article_id` | Stable article identity |
| `collection` (`internalCollection`, `internal_collection`) | Internal collection |
| `okf_root`, `okf_root_path` | Output root and its final path |
| `pathWithinCollection` | Path below the root |
| `href` (`hrefFromTemplate`) | Link relative to the template file being rendered — use this |
| `hrefFromPackageRoot` | Link from a root file such as `AGENTS.md` |
| `hrefFromCollectionIndex` | Link from the current root index |
| `title`, `type`, `description`, `timestamp`, `tags` | Frontmatter values; `title` falls back to the file name |
| `source` | First source reference, or the group name |
| `group`, `parentPath`, `depth`, `segments` | Position below the root |
<!-- /context:section -->

<!-- context:section id="groups" -->
## `knowledgeGroups` fields

| Field | Meaning |
| --- | --- |
| `name` | First directory under the root, or `root` |
| `title` | Display title; defaults to `name`, or the root title |
| `count` | Number of pages |
| `collection` (`internalCollection`, `internal_collection`) | Internal collection |
| `okf_root`, `okf_root_path` | Output root and its final path |
| `hasIndex` (`has_index`) | Whether the navigation policy generates `indexPath` |
| `indexPath` | Index path, such as `wikis/codeindex/index.md` |
| `indexHrefFromTemplate`, `indexHrefFromCollectionIndex` | Links to `indexPath`; check `hasIndex` first |
| `items` | The group's `knowledgeItems` |

```handlebars
{{#each knowledgeGroups}}
## {{title}} ({{count}})
{{#if hasIndex}}
[Open directory index]({{indexHrefFromTemplate}})
{{/if}}
{{#each items}}
- [{{title}}]({{href}}) - {{type}}
{{/each}}
{{/each}}
```
<!-- /context:section -->

<!-- context:section id="tree" -->
## `knowledgeTreeNodes` fields

Each node has `name`, `title`, `path`, `depth`, `count` (pages under it), `items` (pages directly under it) and `children`. Handlebars has no recursive partials by default, so keep tree templates shallow or write sections for the levels you care about.
<!-- /context:section -->

<!-- context:section id="starter" -->
## The starter `wikis/index.md`

The default template uses these variables for the bundle count and timestamp in its frontmatter, direct links for folded directories, and links to generated indexes for directories over the threshold. It is only a starter: edit `src/package-templates/kb/` when the package needs different reading paths, or accept the unchanged starter explicitly through the package-template review step.
<!-- /context:section -->
