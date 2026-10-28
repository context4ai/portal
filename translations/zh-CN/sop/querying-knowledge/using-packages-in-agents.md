---
title: 在 Agent 中使用知识包
description: 把知识包交给你的 Agent 使用，了解提问时 Agent 会如何使用知识包，并沿引用回到来源。
translation:
  locale: zh-CN
  artifact_ref: e9c6dca7-c6c3-40f5-8439-726ad9262b15
  source_digest: c86e87480b988e8463bec55ae501efbbccaa99aeba6bcf4f19e0d949e3d675bf
  translated_at: 2026-10-28T03:56:06.139Z
---

# 在 Agent 中使用知识包

<!-- context:section id="goal" -->
知识包是一个由 Markdown 组成的普通文件夹，附带一个查询 Skill，由已批准的知识构建而成。它让你的 Agent 无需生产它的知识工作区也能*使用*这些知识——当你使用别人维护的知识，或想在一个没有自己知识工作区的项目中获得回答时，这会很方便。

本页面向使用知识包的人。知识包包含什么以及如何构建，见 [知识包](../outputs-and-sites/knowledge-packages.md)。
<!-- /context:section -->

<!-- context:section id="share" -->
## 把知识包交给你的 Agent

知识包可以在构建位置使用，也可以通过全局安装使用，或放在 Agent 宿主能读取的任意文件夹中。有两种简单的方式让它可用：

- **让 Agent 指向该文件夹**，用于当前的问题。
- **把知识包的查询 Skill 安装**到宿主的 Skills 目录，这样 Agent 在之后的任务中也能找到这个知识包。

```text
使用 ./dist/billing-kb 中的知识包回答这个项目里的问题。
为当前宿主安装它的查询 Skill。
```

每个 Context 知识包都带有相同的 `context-knowledge-query` Skill，因此安装一份即可服务所有知识包。它会找到能访问的知识包：它所在的知识包、你用 `--root` 指定的文件夹或用 `--base` 指定的集合、`CONTEXT_KNOWLEDGE_PACKAGES` 中列出的目录，以及宿主包管理器（如果支持）记录的知识包。之后直接提问即可——参见 [提问](asking-questions.md)。你不需要移动文件。

### 分享知识包之前

如果你为他人构建知识包，请先定制它的检索指南：把项目的术语、同义词、常见问题和首选入口页面写进 `others/context/search-guide.md`，或者在知识包模板审核时明确接受默认模板。查询 Skill 本身请保持不变；Context 会让它在各知识包中保持一致，并在构建时替换被修改的副本。参见 [定制输出模板](../outputs-and-sites/custom-output-templates.md)。
<!-- /context:section -->

<!-- context:section id="query" -->
## Agent 会如何使用它

随包提供的查询 Skill 让 Agent 先浏览再搜索。它会先列出能读取的知识包，如果你没有指定，就挑选索引和检索指南与问题相符的那些。然后它会判断你提的是哪类问题——查找、解释、操作流程、规则、关系、细节还是覆盖范围——打开对应的索引，沿链接找到可能的页面。它只阅读需要的章节，并引用作答所依据的页面和标题；标题和描述帮助它决定去哪里找，但本身绝不能作为结论的依据。

当索引无法缩小范围时，它会在这些知识包中搜索精确的名称、错误字符串或同时搜索多个词。搜索结果只是线索：Agent 会先打开页面再作答。当这些知识包缺少证据时，它会如实说明，并告诉你它检查了哪些内容。
<!-- /context:section -->

<!-- context:section id="sources" -->
## 回到来源

知识包页面保留了来源引用。当页面正文不足以回答问题时，查询 Skill 会自行沿其 Sources 条目查找：仓库链接通过宿主允许的工具按记录的提交读取，文档链接打开当前文档。需要远程读取代码证据时，`/c4a:context-inspect-search` 可以沿这些引用，追溯到记录版本下的原始文档和代码。请参阅 [提问](asking-questions.md) 和 [远程读取代码证据](reading-code-evidence-remotely.md)。
<!-- /context:section -->
