---
title: 定制输出模板
description: 如何在首次构建前接受或调整知识包模板（入口页、查询 Skill 和目录导航），以及每次构建对模板强制执行的规则。
translation:
  locale: zh-CN
  artifact_ref: 145efe1c-4969-48ef-8514-1e016773a775
  source_digest: 90c941138093519239060128bc32545aa4e409017956a9294e393dcd73f72113
  translated_at: 2026-10-28T03:56:06.139Z
---

# 定制输出模板

<!-- context:section id="goal" -->
每个知识包都由你的知识工作区中的一个**知识包模板**渲染而成，默认位于 `src/package-templates/kb/`。模板提供知识包的入口页、查询 Skill 以及给 Agent 的各种说明；构建会渲染模板并加入选中的已批准页面。生成的默认模板是一个可用的通用起点。当你的知识包需要项目术语、精选导航、路由规则或面向特定任务的 Skill 时，再对它进行定制，例如：

> 把查询 Skill 重命名为 `android-query`，并让入口页按模块分组。

```mermaid
flowchart LR
  tpl["src/package-templates/kb/"] --> render["用 Handlebars 渲染"]
  vars["内置变量和自定义变量"] --> render
  render --> out["dist/name/"]
  approved["选中的已批准页面"] --> out
  out --> check["路径、链接和<br/>如实性检查"]
```
<!-- /context:section -->

<!-- context:section id="review" -->
## 首次构建前接受或修改

新生成的模板必须先原样接受或进行修改，才能进行首次构建。Agent 会请你确认：接受通用默认模板，或修改 `src/package-templates/` 下的文件（你自己修改，或请 Agent 修改）。Context 会记录你接受了哪些模板文件；它不会评判模板的文字内容。
<!-- /context:section -->

<!-- context:section id="layout" -->
## 模板包含什么

```text
src/package-templates/
├── kb/
│   ├── AGENTS.md
│   ├── wikis/
│   │   └── index.md
│   ├── others/
│   │   └── context/
│   │       └── search-guide.md
│   └── skills/
│       └── context-knowledge-query/
│           ├── SKILL.md
│           └── scripts/
│               └── search.mjs
└── llms/
    └── llms.txt
```

知识包模板至少必须包含一个 `SKILL.md` 和 `wikis/index.md`；只有 `AGENTS.md` 的模板会被拒绝。每个渲染出的 Skill 都位于 `skills/<skill-name>/SKILL.md`，且 frontmatter 中的 `name` 与之匹配；Context 绝不会根据知识包名称推导 Skill 名称。只有当你需要知识查找之外的行为时，才添加其他 Skill。
<!-- /context:section -->

<!-- context:section id="entry" -->
## 入口页与导航

`wikis/index.md` 是知识包的入口页。请告诉读者这个知识包覆盖什么、面向谁，以及如何查询它。每个选中的根目录（`wikis/`、`guides/`、`rules/`、`feats/`）始终都会有一个索引。默认情况下，小目录会折叠到最近的已生成上级索引中，只有当某个目录会向其父级暴露超过 50 个条目时，才会获得自己的 `index.md`；你可以要求为每个目录生成一个索引，或使用不同的阈值。

如需精选导航，可在 `wikis/index.md` 中遍历内置变量：

```handlebars
{{#each knowledgeGroups}}
## {{title}} ({{count}})
{{#each items}}
- [{{title}}]({{href}})
{{/each}}
{{/each}}
```

| 变量 | 提供的内容 |
| --- | --- |
| `{{displayName}}`、`{{packageName}}` | 知识包显示名称和名称 |
| `{{knowledgeCount}}`、`{{knowledgeTimestamp}}` | 选中页面的数量和最新时间戳 |
| `{{knowledgeItems}}` | 供循环使用的选中页面元数据 |
| `{{knowledgeGroups}}` | 按根目录和一级目录分组的页面 |
| `{{knowledgeTreeNodes}}`、`{{knowledgeTree}}` | 嵌套树，或其 Markdown 预览 |
| `{{wikisRoot}}` … `{{featsRoot}}` | 相对于知识包的根路径，用于 Skill 内的链接 |

包括循环、条件和辅助函数在内的完整列表见 [模板变量](../../product/reference/context/template-variables.md)。你自己的值可以作为自定义变量传给模板。
<!-- /context:section -->

<!-- context:section id="skill" -->
## 查询 Skill

默认的 `context-knowledge-query` Skill 内置了结构优先的查询规范和搜索兜底，并且在每个 Context 知识包中都相同，因此安装一份即可服务所有知识包。它由 Context 管理：如果模板中的副本较旧或被修改过，`context build` 会替换它，所以在其中做的修改不会保留。

请改为在 `others/context/search-guide.md` 中为你的知识包调整检索：项目术语和同义词、常见问题，以及每类任务的首选入口页面。Skill 在检索前会先读取这份指南。如果某个知识包需要自己的查询 Skill，请把它放在不同的目录下并使用不同的 `name`，这样它会与共享 Skill 并列安装。

使用早期 `skills/knowledge-query/` 模板创建的工作区会在下一次构建时迁移：Context 会用同一语言的 `context-knowledge-query` 替换它，在缺少检索指南时添加一份，并报告这次替换。请把旧 Skill 中针对该知识包的措辞移到检索指南中。
<!-- /context:section -->

<!-- context:section id="rules" -->
## 构建强制执行的规则

- **不能有第二个知识来源。** 描述覆盖范围、范围边界、已知缺口或限制的模板文字，必须有已批准的知识、知识包清单或渲染后的结构数据作为依据；否则构建会报告。事实应放在已批准的页面中。
- **不能冲突。** 模板文件会先渲染；渲染后的路径不能落在选中的页面或生成的索引上。请重命名模板文件，或把该页面排除出知识包。
- **链接必须有效。** 每个根索引和生成的子索引中的链接都必须能在知识包内解析；失效的链接会被报告。
- **在源头修复。** 修复模板、已批准的页面或知识包声明，然后重新构建；永远不要修补 `dist/`。

这些检查覆盖的是结构，而不是选中的知识对你的读者是否有意义，请自己检查产出。模板 API 见 [包模板](../../product/reference/context/package-templates.md)。
<!-- /context:section -->
