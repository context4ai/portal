---
title: 在 Agent 中使用知识包
description: 知识包包含哪些内容，Agent 如何借助内置的查询 Skill 和搜索脚本浏览它，以及如何让其他 Agent 也能使用它。
translation:
  locale: zh-CN
  artifact_ref: e9c6dca7-c6c3-40f5-8439-726ad9262b15
  source_digest: 3a9c86454e67279608167fd196e6a90901c8961b40a2efaac9f7eba366551437
  translated_at: 2026-10-12T16:11:57.590Z
---

# 在 Agent 中使用知识包

<!-- context:section id="goal" -->
`context build` 会把已批准的知识转换为 `dist/<name>/` 下的**知识包**：一个由 Markdown 组成的普通文件夹，任何 Agent 都能读取，并附带一个教 Agent 如何读取的内置 Skill。如果某些 Agent 只需要*使用*这些知识，而不需要生产它的 Context 知识工作区，你交给它们的就是这个知识包。
<!-- /context:section -->

<!-- context:section id="layout" -->
## 包里有什么

```text
dist/<package>/
├── AGENTS.md                       # how to use this package
├── skills/knowledge-query/         # bundled query Skill and search script
├── wikis/index.md                  # entities and relationships
├── guides/                         # architecture, procedures, FAQs, decisions
├── rules/                          # standards, constraints, test scenarios
├── context-build-inventory.json    # package coverage
├── context-site-map.json           # page → website URL
└── others/assets/                  # images and files the pages use
```

已批准的集合会映射到不同的根目录：`codeindex`、`business` 和 `product` 放入 `wikis/`；`architecture`、`sop`、`faq`、`decision` 和 `incident` 放入 `guides/`；`standards` 和 `test` 放入 `rules/`。未选中的根目录不会出现。
<!-- /context:section -->

<!-- context:section id="query" -->
## 查询 Skill 如何读取知识包

内置的 `knowledge-query` Skill 要求 Agent 先浏览再搜索：

1. 对请求分类：查找、解释、操作流程、规则、关系、细节或覆盖范围。
2. 打开对应的根索引，沿链接找到可能的页面。
3. 只阅读需要的章节；标题和描述用于选定范围，但不能作为结论的依据。
4. 根据可见的章节内容作答，并引用页面和标题。
5. 当知识包缺少证据时，报告这一缺口以及已经检查过的内容。

当索引无法缩小范围时，它才会搜索：精确的名称或错误字符串用 `rg`；多个词或非英文短语则使用内置的 BM25 脚本：

```bash
node <knowledge-query Skill directory>/scripts/search.mjs --query '<terms>' --limit 8
```

命中结果只是线索；Agent 会先打开页面再作答。
<!-- /context:section -->

<!-- context:section id="share" -->
## 让知识包可用

知识包可以在构建位置使用，也可以通过全局安装使用，或放在 Agent 宿主能读取的任意目录中。你可以让 Agent 指向该文件夹，或者把 `skills/knowledge-query` 安装到宿主的技能目录；如果 Skill 最终位于知识包目录树之外，搜索脚本可以通过 `--root <package directory>` 指定知识包目录，或通过 `--base <package collection>` 按清单名称查找知识包。

发布知识包之前，请用项目的术语、常见意图和首选入口页面替换或修改通用的查询 Skill 模板，或者在知识包模板审核时明确接受默认模板。
<!-- /context:section -->

<!-- context:section id="sources" -->
## 回到来源

知识包页面带有导出的来源归属信息。当知识包不够用时，`/c4a:context-inspect-search` 可以依据这些归属信息，追溯到记录版本下的原始文档和代码。请参阅[提问](asking-questions.md)和[远程读取代码证据](reading-code-evidence-remotely.md)。
<!-- /context:section -->
