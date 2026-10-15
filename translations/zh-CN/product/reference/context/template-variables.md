---
title: 模板变量
description: 包模板可用的 Handlebars 语法、辅助函数和内置变量，以及 knowledgeItems、knowledgeGroups 和
  knowledgeTreeNodes 的字段。
translation:
  locale: zh-CN
  artifact_ref: 2b26b459-d582-4c66-b5d6-d1d2bcac0cdc
  source_digest: 4b8273af59b130249f603b4f95c0f47a91d733c01c9dcf1fd23252092c84d69d
  translated_at: 2026-10-12T17:06:40.056Z
---

# 模板变量

<!-- context:section id="goal" -->
`src/package-templates/**` 下的文件会在 `context build` 期间用 Handlebars 渲染。模板可以输出值、遍历数组、按条件分支，并携带仅模板可见的注释；但不能运行 JavaScript。变量既可用于文件内容，也可用于文件路径。自定义值来自 `template.vars`。
<!-- /context:section -->

<!-- context:section id="syntax" -->
## 语法

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

- 值支持点号路径。
- 循环可以嵌套；`{{@index}}` 从 0 开始。
- `{{#if}}` 在值存在且不是 `false`、空字符串或空数组时渲染。

仅模板可见的注释会从输出中去除：

```handlebars
{{! Removed by Handlebars. }}

<!-- context:template
Explain why this section exists and where to edit it.
-->
```

| 辅助函数 | 示例 | 含义 |
| --- | --- | --- |
| `inc` | `{{inc @index}}` | 加 1——用于编号列表 |
| `json` | `{{json knowledgeGroups}}` | 格式化的 JSON，用于调试或机器可读的文档 |
<!-- /context:section -->

<!-- context:section id="builtins" -->
## 内置变量

| 变量 | 类型 | 含义 |
| --- | --- | --- |
| `packageName` | string | 声明中的包名 |
| `packageKind` | string | `kb` 或 `llms` |
| `displayName` | string | 首字母大写形式的 `packageName`，除非被 `template.vars.displayName` 覆盖 |
| `skillsRoot`, `wikisRoot`, `guidesRoot`, `rulesRoot`, `featsRoot` | string | 最终的包根目录：`skills`、`wikis`、`guides`、`rules`、`feats` |
| `skillName`, `skillPath` | string | 正在渲染的 Skill 的名称，及其相对于包的 `SKILL.md` 路径；不在 Skill 中时为空 |
| `knowledgeCount` | number | 选中的已批准页面数量 |
| `knowledgeTimestamp` | string | 选中页面中最新的 `timestamp`；为空时取纪元时间 |
| `knowledge`, `approvedKnowledge` | string | 为使用者拼接好的全部选中页面，带路径标题、不含生命周期元数据——可能很大 |
| `knowledgeItems` | array | 每个选中页面一条记录 |
| `knowledgeGroups` | array | 按根目录和第一级目录分组的页面 |
| `knowledgeTreeNodes` | array | 嵌套的路径树，用于自定义导航 |
| `knowledgeTree` | string | Markdown 树形预览 |
| `knowledgeItemsMarkdown` | string | 最多 50 个页面的 Markdown 列表 |
| `knowledgeGroupsMarkdown` | string | 当前索引的导航：折叠目录直接链接到页面，展开目录链接到其索引 |
| `buildInventory`, `buildInventoryJson`, `buildInventoryPath` | object, string, string | 确定性的构建清单、其 JSON，以及其路径 `context-build-inventory.json` |
| `knowledgeStructure`, `knowledgeStructureJson`, `knowledgeStructurePath` | object or null, string, string | `knowledge/structure.yaml` 在所选包上的投影；除非模板渲染它，否则不会复制进包 |
| `knowledgeNamespace`, `namespacedKnowledge` | string, boolean | 遗留变量；新工作区中分别为空和 `false` |

`buildInventory.structure.edge_records` 保存两端都在包内的类型化边——可用作包内关系的证据。
<!-- /context:section -->

<!-- context:section id="items" -->
## `knowledgeItems` 字段

| 字段 | 含义 |
| --- | --- |
| `path` (`dist_path`) | 相对于包的路径，例如 `guides/architecture/entity/button.md` |
| `sourcePath` (`approved_path`) | 映射前的已批准路径，例如 `architecture/entity/button.md` |
| `article_id` | 稳定的文章标识 |
| `collection` (`internalCollection`, `internal_collection`) | 内部知识分类 |
| `okf_root`, `okf_root_path` | 输出根目录及其最终路径 |
| `pathWithinCollection` | 根目录下的路径 |
| `href` (`hrefFromTemplate`) | 相对于当前渲染模板文件的链接——请使用它 |
| `hrefFromPackageRoot` | 从 `AGENTS.md` 等根文件出发的链接 |
| `hrefFromCollectionIndex` | 从当前根索引出发的链接 |
| `title`, `type`, `description`, `timestamp`, `tags` | frontmatter 中的值；`title` 缺省时回退为文件名 |
| `source` | 第一条来源引用，或分组名 |
| `group`, `parentPath`, `depth`, `segments` | 在根目录下的位置 |
<!-- /context:section -->

<!-- context:section id="groups" -->
## `knowledgeGroups` 字段

| 字段 | 含义 |
| --- | --- |
| `name` | 根目录下的第一级目录，或 `root` |
| `title` | 显示标题；默认为 `name`，或根目录标题 |
| `count` | 页面数量 |
| `collection` (`internalCollection`, `internal_collection`) | 内部知识分类 |
| `okf_root`, `okf_root_path` | 输出根目录及其最终路径 |
| `hasIndex` (`has_index`) | 导航策略是否生成 `indexPath` |
| `indexPath` | 索引路径，例如 `wikis/codeindex/index.md` |
| `indexHrefFromTemplate`, `indexHrefFromCollectionIndex` | 指向 `indexPath` 的链接；使用前先检查 `hasIndex` |
| `items` | 该分组的 `knowledgeItems` |

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
## `knowledgeTreeNodes` 字段

每个节点包含 `name`、`title`、`path`、`depth`、`count`（其下的页面数）、`items`（直接位于其下的页面）和 `children`。Handlebars 默认不支持递归 partial，因此请保持树形模板层级较浅，或者只为你关心的层级分别编写段落。
<!-- /context:section -->

<!-- context:section id="starter" -->
## 起步用的 `wikis/index.md`

默认模板用这些变量在 frontmatter 中生成包内页面数和时间戳，为折叠目录生成直接链接，并为超过阈值的目录生成指向其索引的链接。它只是一个起点：当知识包需要不同的阅读路径时，请编辑 `src/package-templates/kb/`；或者在包模板审核步骤中显式接受未修改的起步模板。
<!-- /context:section -->
