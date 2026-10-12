---
title: Package Templates
description: The kbPackage and llmsPackage declarations, their fields, package
  layout, directory indexes, build behavior and selection rules.
type: Wiki
timestamp: 2026-10-12T17:02:32.263Z
---
# Package Templates

<!-- context:section id="goal" -->
Packages project approved knowledge into `dist/<package-name>/`. This page is the API and template reference; for choosing outputs, see [Knowledge Packages](../../../sop/outputs-and-sites/knowledge-packages.md), and for editing templates, see [Custom Output Templates](../../../sop/outputs-and-sites/custom-output-templates.md).

```ts
import { kbPackage, llmsPackage } from "@c4a/context";

kbPackage({
  name: "component-lib-kb",
  template: { path: "src/package-templates/kb", vars: { displayName: "Component Library KB" } },
  select: {
    collections: ["architecture", "sop"],
    okfRoots: ["wikis", "guides"],
    include: ["architecture/component-lib/**", "sop/component-lib/**"],
    exclude: ["**/internal/**"],
  },
  navigation: { foldDirectoryIndexes: true, maxInlineEntries: 50 },
  assets: { delivery: "bundle" },
});

llmsPackage({
  name: "component-lib-llms",
  template: "src/package-templates/llms",
  select: { include: ["codeindex/component-lib/**"] },
});
```
<!-- /context:section -->

<!-- context:section id="fields" -->
## Fields

| Field | Required | Meaning |
| --- | --- | --- |
| `name` | Yes | Lowercase, path-safe package name; output goes to `dist/<name>/` |
| `template` | Yes | Template directory, or `{ path, vars }` |
| `select` | No | Approved knowledge selector; omit to include everything approved |
| `navigation` | No | Directory-index policy; default `{ foldDirectoryIndexes: true, maxInlineEntries: 50 }` |
| `assets` | No | Resource delivery: bundled (default), Git raw links, or omitted |
| `distribution` | No | Legacy input from older workspaces; no longer changes paths — do not add it |

`template` is always required; `kbPackage({ name })` alone is rejected. A `kbPackage` can also take `site` for a documentation site — see [Project API](./project-api.md).
<!-- /context:section -->

<!-- context:section id="assets" -->
## Assets

| `assets` | Behavior |
| --- | --- |
| `{ delivery: "bundle" }` (default) | Selected resources are written under `others/assets/`. Images are compressed when needed to stay within 1 MiB each and 40 MiB per package; source snapshots and `knowledge/assets/` are never changed |
| `{ delivery: "git-raw", urlPrefix }` | Links point at raw files in Git. Without `urlPrefix`, the workspace must be in Git and GitHub remotes are derived and pinned to the current commit; other hosts need an explicit HTTPS prefix, where `{commit}` is replaced only inside Git |
| `{ delivery: "omit" }` | Leaves unresolved links and reports them |

The resolved commit and raw URL count toward package freshness. Context does not check that resources are pushed or remotely readable. An explicit `assets.optimize` (for example `mode: "webp"` with `quality`, optional `maxDimension`) overrides the automatic image policy; if it cannot meet the image budgets, the build stops before replacing the previous package.
<!-- /context:section -->

<!-- context:section id="layout" -->
## Layout

Package roots are flat; the package name is not repeated inside:

```text
skills/knowledge-query/SKILL.md
wikis/index.md
guides/...
rules/...
feats/...
```

A knowledge package template must contain at least one `SKILL.md` and `wikis/index.md`. Each Skill lives at `skills/<skill-name>/SKILL.md` with a matching frontmatter `name`; Skill names are author-maintained and never derived from the package name. Use `{{wikisRoot}}`, `{{guidesRoot}}`, `{{rulesRoot}}`, `{{featsRoot}}` and `{{skillName}}` in templates. Installed examples are in `node_modules/@c4a/context/templates/package-templates/{kb,llms}/`.

The default template ships `skills/knowledge-query/SKILL.md` (a reusable query Skill), its `scripts/search.mjs` (a dependency-free BM25 fallback), and `wikis/index.md`.
<!-- /context:section -->

<!-- context:section id="indexes" -->
## Directory indexes

- Every selected root — `wikis/`, `guides/`, `rules/`, `feats/` — gets its own `index.md`; `wikis/index.md` is rendered from the template and is the default entry.
- With `foldDirectoryIndexes: true`, indexes are planned bottom-up: a directory gets its own `index.md` only when it would expose more than `maxInlineEntries` entries (default 50) to its parent. Folded pages are listed in the nearest generated ancestor, grouped by relative path. The count is of navigation entries, not lines or headings.
- `foldDirectoryIndexes: false` generates an index for every directory.
- Generated indexes carry OKF frontmatter (`type: Knowledge Directory`, `title`, `description`, `tags`, `timestamp`, `resource`, `package`, `package_kind`, `knowledge_count`) and list child indexes before pages.
- Links in root and generated indexes must resolve inside `dist/<package-name>/`; broken ones are reported as `package/index-link-invalid`.
<!-- /context:section -->

<!-- context:section id="profile" -->
## Article metadata

| Owned by | Holds |
| --- | --- |
| Approved Markdown | `title`, `type`, `description`, ISO UTC `timestamp`; optional `resource` and `tags` |
| `knowledge/structure.yaml` | Stable `article_id`, `path`, `collection`, `visibility`, and each section's references (at most three per section: `source_ref`, `locator { path, start_line, end_line }`, `content_digest`) |

Section markers in Markdown contain only their ID: `<!-- context:section id="usage" -->` … `<!-- /context:section -->`. Package pages keep reader metadata and receive a generated Sources section from the references; repository links include file and line ranges.
<!-- /context:section -->

<!-- context:section id="build" -->
## Build behavior

`context build`:

1. Selects approved Markdown from `knowledge/`.
2. Renders every file under `template.path`.
3. Projects the selected articles into consumer pages.
4. For `llmsPackage`, appends the selected knowledge to `llms.txt` unless the template already uses `{{knowledge}}` or `{{approvedKnowledge}}`.
5. Writes `context-build-inventory.json`, recording each selected file with `selected_by` reasons and its production metadata.
6. Writes everything under `dist/<package-name>/`.

Build packages the current closed state; when status reports `route.close.projection-stale`, run the returned close command first. Rendered template paths must be safe and unique and must not collide with copied knowledge — rename the template file or use `select.exclude`. Template prose about coverage, scope or limits must cite approved knowledge, the inventory or rendered structure data, or the build reports a template-boundary diagnostic. Fix problems at the source and rebuild; never patch `dist/`.
<!-- /context:section -->

<!-- context:section id="select" -->
## Selection order

1. `collections` — internal collections such as `architecture`, `sop`, `standards`, `feats` (see [Knowledge Collections](./knowledge-collections.md)).
2. `okfRoots` — output roots after mapping: `wikis`, `guides`, `rules`, `feats`.
3. `include` — path patterns relative to `knowledge/`.
4. `exclude` — removes matches after the previous filters.

Without `include`, all approved knowledge is included unless excluded. When `collections` or `okfRoots` are present, a file must pass them before path patterns apply.
<!-- /context:section -->
