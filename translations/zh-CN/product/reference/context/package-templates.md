---
title: 包模板
description: kbPackage 与 llmsPackage 声明的字段、包结构、目录索引、构建行为与选择规则。
translation:
  locale: zh-CN
  artifact_ref: ff6d102c-14a5-4f8b-a8fd-8464060dde1d
  source_digest: d70c65e37902fdef1321ea619045cdafd72ac1ef905929639f2e62e18c620aab
  translated_at: 2026-10-12T17:06:40.056Z
---

# 包模板

<!-- context:section id="goal" -->
知识包会把已批准的知识投影到 `dist/<package-name>/`。本页是 API 与模板参考；如何选择输出，见[知识包](../../../sop/outputs-and-sites/knowledge-packages.md)；如何编辑模板，见[定制输出模板](../../../sop/outputs-and-sites/custom-output-templates.md)。

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
## 字段

| 字段 | 必填 | 含义 |
| --- | --- | --- |
| `name` | 是 | 小写、可安全用作路径的包名；输出到 `dist/<name>/` |
| `template` | 是 | 模板目录，或 `{ path, vars }` |
| `select` | 否 | 已批准知识的选择器；省略时包含全部已批准的知识 |
| `navigation` | 否 | 目录索引策略；默认 `{ foldDirectoryIndexes: true, maxInlineEntries: 50 }` |
| `assets` | 否 | 资源交付方式：打包进知识包（默认）、Git raw 链接，或不交付 |
| `distribution` | 否 | 旧工作区遗留的输入，已不再影响路径——不要再添加 |

`template` 始终必填；只写 `kbPackage({ name })` 会被拒绝。`kbPackage` 还可以接收 `site` 来生成文档站点，见 [Project API](./project-api.md)。
<!-- /context:section -->

<!-- context:section id="assets" -->
## 资源

| `assets` | 行为 |
| --- | --- |
| `{ delivery: "bundle" }`（默认） | 选中的资源写入 `others/assets/`。必要时会压缩图片，使单张不超过 1 MiB、每个包不超过 40 MiB；来源快照和 `knowledge/assets/` 永远不会被修改 |
| `{ delivery: "git-raw", urlPrefix }` | 链接指向 Git 中的原始文件。不提供 `urlPrefix` 时，工作区必须位于 Git 中，Context 会根据 GitHub 远程仓库推导链接并固定到当前提交；其他托管平台需要显式提供 HTTPS 前缀，其中 `{commit}` 仅在 Git 中才会被替换 |
| `{ delivery: "omit" }` | 保留无法解析的链接并报告出来 |

解析出的提交和 raw URL 会计入包的新鲜度判断。Context 不会检查资源是否已推送或能否远程读取。显式设置的 `assets.optimize`（例如 `mode: "webp"` 搭配 `quality`，以及可选的 `maxDimension`）会覆盖自动图片策略；如果无法满足图片体积上限，构建会在替换旧包之前停止。
<!-- /context:section -->

<!-- context:section id="layout" -->
## 包结构

包根目录是扁平的，内部不会重复包名：

```text
skills/knowledge-query/SKILL.md
wikis/index.md
guides/...
rules/...
feats/...
```

知识包模板至少要包含一个 `SKILL.md` 和 `wikis/index.md`。每个 Skill 位于 `skills/<skill-name>/SKILL.md`，其 frontmatter 中的 `name` 必须与之一致；Skill 名称由作者维护，不会从包名推导。模板中可以使用 `{{wikisRoot}}`、`{{guidesRoot}}`、`{{rulesRoot}}`、`{{featsRoot}}` 和 `{{skillName}}`。安装后的示例位于 `node_modules/@c4a/context/templates/package-templates/{kb,llms}/`。

默认模板自带 `skills/knowledge-query/SKILL.md`（可复用的查询 Skill）、它的 `scripts/search.mjs`（无依赖的 BM25 兜底检索）以及 `wikis/index.md`。
<!-- /context:section -->

<!-- context:section id="indexes" -->
## 目录索引

- 每个被选中的根目录——`wikis/`、`guides/`、`rules/`、`feats/`——都有自己的 `index.md`；其中 `wikis/index.md` 由模板渲染，是默认入口。
- 当 `foldDirectoryIndexes: true` 时，索引自底向上规划：只有当某个目录向父级暴露的条目超过 `maxInlineEntries`（默认 50）时，它才会生成自己的 `index.md`。被折叠的页面会按相对路径分组，列在最近一个生成了索引的祖先目录中。计数的是导航条目，而不是行数或标题数。
- `foldDirectoryIndexes: false` 会为每个目录都生成索引。
- 生成的索引带有 OKF frontmatter（`type: Knowledge Directory`、`title`、`description`、`tags`、`timestamp`、`resource`、`package`、`package_kind`、`knowledge_count`），并先列出子索引，再列出页面。
- 根索引和生成的索引中的链接都必须能在 `dist/<package-name>/` 内解析；失效链接会报告为 `package/index-link-invalid`。
<!-- /context:section -->

<!-- context:section id="profile" -->
## 文章元数据

| 归属 | 内容 |
| --- | --- |
| 已批准的 Markdown | `title`、`type`、`description`、ISO UTC 格式的 `timestamp`；可选的 `resource` 和 `tags` |
| `knowledge/structure.yaml` | 稳定的 `article_id`、`path`、`collection`、`visibility`，以及每个 section 的引用（每个 section 最多三条：`source_ref`、`locator { path, start_line, end_line }`、`content_digest`） |

Markdown 中的 section 标记只包含 ID：`<!-- context:section id="usage" -->` … `<!-- /context:section -->`。包内页面保留面向读者的元数据，并根据引用生成一个 Sources 小节；仓库链接会带上文件和行号范围。
<!-- /context:section -->

<!-- context:section id="build" -->
## 构建行为

`context build`：

1. 从 `knowledge/` 中选出已批准的 Markdown。
2. 渲染 `template.path` 下的每个文件。
3. 把选中的文章投影为面向使用者的页面。
4. 对于 `llmsPackage`，若模板中尚未使用 `{{knowledge}}` 或 `{{approvedKnowledge}}`，则把选中的知识追加到 `llms.txt`。
5. 写入 `context-build-inventory.json`，记录每个被选中的文件及其 `selected_by` 原因和生产元数据。
6. 把所有内容写入 `dist/<package-name>/`。

构建打包的是当前 close 后的状态；当状态报告 `route.close.projection-stale` 时，先运行返回的 close 命令。渲染出的模板路径必须安全、唯一，且不能与复制进来的知识冲突——请重命名模板文件或使用 `select.exclude`。模板中关于覆盖范围、作用域或限制的描述必须引用已批准的知识、构建清单或渲染出的结构数据，否则构建会报告模板边界诊断。请在源头修复问题后重新构建，永远不要直接修改 `dist/`。
<!-- /context:section -->

<!-- context:section id="select" -->
## 选择顺序

1. `collections`——内部知识分类，例如 `architecture`、`sop`、`standards`、`feats`（见[知识分类](./knowledge-collections.md)）。
2. `okfRoots`——映射后的输出根目录：`wikis`、`guides`、`rules`、`feats`。
3. `include`——相对于 `knowledge/` 的路径模式。
4. `exclude`——在前面的过滤之后移除匹配项。

不设置 `include` 时，除被排除的内容外，所有已批准的知识都会被包含。存在 `collections` 或 `okfRoots` 时，文件必须先通过它们，路径模式才会生效。
<!-- /context:section -->
