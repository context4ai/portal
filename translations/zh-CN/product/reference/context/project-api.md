---
title: Project API
description: src/index.ts 可以用 @c4a/context SDK 声明哪些内容——来源、采集 phase、自定义
  phase、知识包和站点选项——以及它与 src/indexers.yaml 的关系。
translation:
  locale: zh-CN
  artifact_ref: feb636b9-aed2-4aa4-886e-639810b734fc
  source_digest: afe0b102d65a00879f530d742699fcc25f84c78c1c535fa31b91b649aed9241b
  translated_at: 2026-10-20T05:13:06.930Z
---

# Project API

<!-- context:section id="goal" -->
Context 知识工作区有两份长期保存的声明，各自承担不同的职责：

| 文件 | 声明内容 |
| --- | --- |
| `src/index.ts` | 通过 `@c4a/context` SDK 声明来源引用、文档采集、不产出知识的自定义编排，以及知识包输出 |
| `src/indexers.yaml` | 长期的读者需求、已授权的目标来源和辅助来源，以及已确认的排除项 |

不要在两处描述同一种知识转换。当前 Route 要求修改配置时，由 Agent 编辑这些声明；你不需要自己写代码。
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

该定义是声明式的：加载它不得改变知识或运行时状态。
<!-- /context:section -->

<!-- context:section id="sources" -->
## 来源

```ts
const repo = source("20260901", "component-lib");
const docs = source("20260901/product-docs", { type: "file" });
const handbook = source("20260901/handbook", { type: "lark" });
const note = source("20260908/decision-context.md", { type: "note" });
const session = source("20260908/design-discussion.md", { type: "sessions" });
const everyRepo = allSources("repo"); // spread inside sources: [...everyRepo]
```

| 类型 | 解析依据 | 登记方式 |
| --- | --- | --- |
| `repo`（默认）、`file`、`lark` | `sources/<type>/index.yaml`；名称包含登记日期和模块 | `context source add …` |
| `note`、`sessions` | 保存在 `sources/note/YYYYMMDD/` 或 `sources/sessions/YYYYMMDD/` 下的 Markdown；没有单独的登记表或采集 phase | `context source import` |

保存来源并不等于选用它——还要把它的引用加入 `sources`。来源列表负责启用获取和初始选择；需求以及每个 Indexer 的目标范围和读取范围，决定它负责哪些内容、可以读取哪些内容。
<!-- /context:section -->

<!-- context:section id="capture" -->
## 采集 phase

```ts
captureFile({ source: docs });
captureFile({ source: docs, processor: mdxJsonDocs() });
captureLark({ source: handbook });
```

采集只负责生成确定、可读的快照；分类和写作由选中的 Indexer 完成。给 `context source add repo|file|lark|batch` 加上 `--configure`，就会自动在 `src/index.ts` 中生成来源引用和默认的采集 phase。它会保留已有设置，可重复执行，并且不会改动自定义或动态条目，只给出 `configuration.status: manual` 提示。

如果有许多设置相同的文档，可以映射登记表，而不必重复声明：

```ts
const registry = await loadSourcesRegistry({ rootDir: workspaceRoot });
const documents = registry.larks.map(entry => source(entry.name, { type: "lark" }));

export default defineProject({
  sources: documents,
  phases: documents.map(document => captureLark({ source: document })),
  packages: [],
});
```

文件类文档使用 `registry.files` 搭配 `captureFile`。需要子集时，可以过滤条目。`allSources("lark")` 选择整个集合，无法映射为按文档划分的 phase。采集边界并不决定文章边界。
<!-- /context:section -->

<!-- context:section id="custom" -->
## `customPhase`

```ts
customPhase("project:refresh-catalog", async (ctx) => {
  await ctx.ensureSources();
});
```

用于既不发布知识、也不绕过 Indexer 生命周期的项目编排。如果该 phase 有稳定的读取和写入，请声明出来。
<!-- /context:section -->

<!-- context:section id="packages" -->
## 知识包

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

| 字段 | 是否必填 | 含义 |
| --- | --- | --- |
| `name` | 是 | 小写、可安全用作路径；输出到 `dist/<name>/` |
| `template` | 是 | 模板目录，或 `{ path, vars }` |
| `select` | 否 | `collections`、`okfRoots`、`include`、`exclude`；省略时包含全部已批准的知识 |
| `navigation` | 否 | 目录索引策略；默认为 `{ foldDirectoryIndexes: true, maxInlineEntries: 50 }` |
| `assets` | 否 | `{ delivery: "bundle" }`（默认）、搭配 `urlPrefix` 的 `"git-raw"`，或 `"omit"`；可选 `optimize` |
| `site` | 否（仅限 `kbPackage`） | 在 `dist/<base>-site/` 生成文档站点，其中 `<base>` 是去掉末尾一个 `-kb` 后的名称 |

知识包只读取已批准的 `knowledge/`；`dist/` 是生成产物。详见 [包模板](./package-templates.md)。
<!-- /context:section -->

<!-- context:section id="site" -->
## 站点选项

| 选项 | 含义 |
| --- | --- |
| `title`、`description` | 站点标题和描述 |
| `lang` | 主语言，默认为 `en-US` |
| `base` | 部署路径，例如 `/` 或 `/docs/` |
| `titleLink` | 顶栏标题的链接目标；默认为站点首页 |
| `home` | `title`、`slogan`、`description`、首屏 `actions`（`text`、`link`、`theme`），以及 `resources`（每项需要 `href`、`command` 或两者兼有） |
| `locales` | 额外的读者语言，以 BCP 47 标签为键，每项可选 `label`、`title`、`description`、`home`；不能与 `lang` 相同 |
| `nav` | 顶部链接：`text`、`link`，可选按语言提供的 `locales` 文本和 `position`——`"start"` 把链接放在知识分区之前，默认 `"end"` 放在之后 |
| `more` | 放在“更多”菜单中内置的 LLM Docs 和 Changelog 之前的条目：`text`，并且 `link` 与 `target.artifact_ref`（仅在此处显示的已批准文章）二者只能选一 |
| `socialLinks` | `icon`（`github`、`discord`、`x`、`youtube`、`slack`、`linkedin`、`mastodon`、`npm`）、一个 https `link`，可选 `ariaLabel` |
| `localePreferenceKey` | 共享的存储键，让同一源下的多个站点保持相同的读者语言 |
| `theme` | `light` 和 `dark` 两套颜色：`brand`、`accent`、`background`、`surface`、`text`、`mutedText`、`border`，均为十六进制值 |
| `extensions` | 受信任的展示代码：`root`（默认 `src/site`）、`slots`（`brand`、`banner`、`knowledge`、`resources`、`footer`、`floating`；设为 `false` 可隐藏其中之一）以及自定义 Markdown `pages` |

链接可以是 https 或 `mailto:` URL、以根目录开头的相对路径，或页面锚点。自定义页面通过 `target.artifact_ref: "site:<page-key>"` 放入知识地图。参见 [文档站](../../../sop/outputs-and-sites/documentation-sites.md)和 [页面与主题定制](../../../sop/outputs-and-sites/page-and-theme-customization.md)。
<!-- /context:section -->

<!-- context:section id="requirements" -->
## 需求与 Indexer 技能

当 `src/indexers.yaml` 缺失时，配置 Route 会提供它的 schema。只写 `requirements`——不要写 `protocol`、`indexers`、Provider 选择或 profile。使用哪些已安装的 Indexer 技能及其可选配置，属于临时生产计划中的 `indexer_usage`，而不属于这份长期保存的文件。Agent 在返回的临时目录下写入草稿和引用；CLI 负责接收它们，并掌管候选、审核和正式输出。
<!-- /context:section -->

<!-- context:section id="state" -->
## 持久状态与运行时状态

来源登记表和快照、已保存的笔记和摘要、项目声明、知识包模板以及已批准的知识，都是持久输入；在获准执行 Git 操作时，它们纳入 Git 版本管理。`.tmp/context-runtime/` 保存未完成的执行状态，不纳入 Git。`knowledge/structure.yaml` 保存共享的页面和来源元数据，以及精简的 `processed_scopes`；部分更新或构建失败不会推进整个范围的已处理版本。请使用 CLI 调整或回滚工作，而不要直接编辑这些基线。

知识工作区的 `package.json` 还支持 `context.convertVisuals`（默认 `true`）：有能力的 Agent 可以把来源中的图表和表格转换为忠实的文本结构；无法保留原意时，则保留原始图片。
<!-- /context:section -->
