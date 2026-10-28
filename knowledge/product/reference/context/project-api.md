---
title: Project API
description: What src/index.ts can declare with the @c4a/context SDK — sources,
  capture phases, custom phases, packages and site options — and how it relates
  to src/indexers.yaml.
type: Wiki
timestamp: 2026-10-28T03:53:56.231Z
---
# Project API

<!-- context:section id="goal" -->
A Context knowledge workspace has two durable declarations with separate jobs:

| File | Declares |
| --- | --- |
| `src/index.ts` | Source references, document capture, custom non-knowledge orchestration, and package outputs — through the `@c4a/context` SDK |
| `src/indexers.yaml` | Long-term reader requirements, authorized target and supporting sources, and confirmed exclusions |

Never describe the same knowledge transformation in both. The Agent edits these declarations when the current Route asks for a configuration change; you do not need to write code yourself.
<!-- /context:section -->

<!-- context:section id="define" -->
## `defineProject`

```ts
import { defineProject } from "@c4a/context";

export default defineProject({
  sources: [],
  phases: [],
  packages: [],
});
```

The definition is declarative: loading it must not change knowledge or runtime state.
<!-- /context:section -->

<!-- context:section id="sources" -->
## Sources

```ts
const repo = source("20260901", "component-lib");
const docs = source("20260901/product-docs", { type: "file" });
const handbook = source("20260901/handbook", { type: "lark" });
const note = source("20260908/decision-context.md", { type: "note" });
const session = source("20260908/design-discussion.md", { type: "sessions" });
const everyRepo = allSources("repo"); // spread inside sources: [...everyRepo]
```

| Type | Resolves against | Registered with |
| --- | --- | --- |
| `repo` (default), `file`, `lark` | `sources/<type>/index.yaml`; the name includes the registration date and module | `context source add …` |
| `note`, `sessions` | Saved Markdown under `sources/note/YYYYMMDD/` or `sources/sessions/YYYYMMDD/`; no separate registry or capture phase | `context source import` |

Saving a source does not select it — include its reference in `sources`. The source list enables acquisition and initial selection; the requirements and each Indexer's target and read scopes decide what it owns and may read.
<!-- /context:section -->

<!-- context:section id="capture" -->
## Capture phases

```ts
captureFile({ source: docs });
captureFile({ source: docs, processor: mdxJsonDocs() });
captureLark({ source: handbook });
```

Capture only creates a deterministic, readable snapshot; classification and writing follow the selected Indexer. Adding `--configure` to `context source add repo|file|lark|batch` generates the source references and default capture phases in `src/index.ts` for you. It keeps existing settings, is idempotent, and leaves custom or dynamic entries untouched with a `configuration.status: manual` hint.

For many documents with the same settings, map the registry instead of repeating declarations:

```ts
const registry = await loadSourcesRegistry({ rootDir: workspaceRoot });
const documents = registry.larks.map(entry => source(entry.name, { type: "lark" }));

export default defineProject({
  sources: documents,
  phases: documents.map(document => captureLark({ source: document })),
  packages: [],
});
```

File documents use `registry.files` with `captureFile`. Filter entries for a subset. `allSources("lark")` selects a whole collection and cannot be mapped into per-document phases. Capture boundaries do not dictate article boundaries.
<!-- /context:section -->

<!-- context:section id="custom" -->
## `customPhase`

```ts
customPhase("project:refresh-catalog", async (ctx) => {
  await ctx.ensureSources();
});
```

For project orchestration that neither publishes knowledge nor bypasses the Indexer lifecycle. Declare stable reads and writes when the phase has them.
<!-- /context:section -->

<!-- context:section id="packages" -->
## Packages

```ts
kbPackage({
  name: "component-kb",
  template: "src/package-templates/kb",
  select: { collections: ["codeindex", "architecture"] },
  site: { title: "Component knowledge", base: "/" },
});

llmsPackage({
  name: "component-context",
  template: "src/package-templates/llms",
  select: { collections: ["codeindex"] },
});
```

| Field | Required | Meaning |
| --- | --- | --- |
| `name` | Yes | Lowercase, path-safe; output goes to `dist/<name>/` |
| `template` | Yes | Template directory, or `{ path, vars }` |
| `select` | No | `collections`, `okfRoots`, `include`, `exclude`; omit for all approved knowledge |
| `navigation` | No | Directory-index policy; default `{ foldDirectoryIndexes: true, maxInlineEntries: 50 }` |
| `assets` | No | `{ delivery: "bundle" }` (default), `"git-raw"` with `urlPrefix`, or `"omit"`; optional `optimize` |
| `site` | No (`kbPackage` only) | Adds a documentation site at `dist/<base>-site/`, where `<base>` is the name without one trailing `-kb` |

Packages read approved `knowledge/` only; `dist/` is generated. Details are in [Package Templates](./package-templates.md).
<!-- /context:section -->

<!-- context:section id="site" -->

## Site options

| Option | Meaning |
| --- | --- |
| `title`, `description` | Site title and description |
| `lang` | Primary language, default `en-US` |
| `base` | Deployment path such as `/` or `/docs/` |
| `titleLink` | Target of the top-bar title; defaults to the site home |
| `home` | `title`, `slogan`, `description`, hero `actions` (`text`, `link`, `theme`), and `resources` (each needs `href`, `command` or both) |
| `locales` | Additional reader languages keyed by BCP 47 tag, each with optional `label`, `title`, `description`, `home`; must differ from `lang` |
| `nav` | Top links: `text`, `link`, optional per-locale `locales` text and `position` — `"start"` places a link before the knowledge sections, the default `"end"` after them |
| `more` | Items placed in the More menu before the built-in LLM Docs and Changelog entries: `text` with exactly one of `link` or `target.artifact_ref` (an approved article shown only there) |
| `socialLinks` | `icon` (`github`, `discord`, `x`, `youtube`, `slack`, `linkedin`, `mastodon`, `npm`), an https `link`, optional `ariaLabel` |
| `localePreferenceKey` | Storage key for the reader's language choice; default `context-locale`, which sites on one origin share unless one sets its own |
| `sourceMap` | `false` replaces the per-article source map with a plain source list; on by default |
| `theme` | `light` and `dark` colors: `brand`, `accent`, `background`, `surface`, `text`, `mutedText`, `border` as hex values |
| `extensions` | Trusted presentation code: `root` (default `src/site`), `slots` (`brand`, `banner`, `knowledge`, `resources`, `footer`, `floating`; `false` hides one) and custom Markdown `pages` |

Links accept https or `mailto:` URLs, root-relative paths or page anchors. Custom pages are placed in the knowledge map with `target.artifact_ref: "site:<page-key>"`. See [Documentation Sites](../../../sop/outputs-and-sites/documentation-sites.md) and [Customizing Pages and Themes](../../../sop/outputs-and-sites/page-and-theme-customization.md).

<!-- /context:section -->

<!-- context:section id="requirements" -->
## Requirements and Indexer Skills

When `src/indexers.yaml` is missing, the configuration Route supplies its schema. Write `requirements` only — no `protocol`, `indexers`, Provider selections or profiles. Which installed Indexer Skills to use, and their optional configuration, belongs to `indexer_usage` in the temporary production plan, not to this durable file. The Agent writes drafts and references under the returned temporary directory; the CLI accepts them and owns candidates, review and formal output.
<!-- /context:section -->

<!-- context:section id="state" -->
## Durable and runtime state

Source registries and snapshots, saved notes and summaries, project declarations, package templates and approved knowledge are durable inputs, versioned in Git when Git operations are authorized. `.tmp/context-runtime/` holds unfinished execution state and stays out of Git. `knowledge/structure.yaml` keeps shared page and source metadata and compact `processed_scopes`; a partial update or failed build does not advance a whole range's processed version. Use the CLI to adjust or roll back work rather than editing these baselines.

The workspace `package.json` also accepts `context.convertVisuals` (default `true`): a capable Agent may convert source diagrams and tables into faithful text structures, keeping the original image when it cannot preserve the meaning.
<!-- /context:section -->
