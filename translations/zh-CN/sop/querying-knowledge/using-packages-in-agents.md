---
title: 在 Agent 中使用知识包
description: 把知识包交给你的 Agent 使用，了解提问时 Agent 会如何使用知识包，并沿引用回到来源。
translation:
  locale: zh-CN
  artifact_ref: e9c6dca7-c6c3-40f5-8439-726ad9262b15
  source_digest: 96b8e462992a3f5c81ea6a3e6c954cb54fa5bce43e121de61b5da359d7dcb693
  translated_at: 2026-10-20T05:13:06.930Z
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

之后直接提问即可——参见 [提问](asking-questions.md)。如果查询 Skill 最终位于知识包文件夹之外，Agent 仍然能找到知识包；你不需要移动文件。

### 分享知识包之前

如果你为他人构建知识包，请先定制它的查询 Skill：用项目的术语、常见问题和首选入口页面替换或修改通用模板，或者在知识包模板审核时明确接受默认模板。参见 [定制输出模板](../outputs-and-sites/custom-output-templates.md)。
<!-- /context:section -->

<!-- context:section id="query" -->
## Agent 会如何使用它

随包提供的查询 Skill 让 Agent 先浏览再搜索。它会判断你提的是哪类问题——查找、解释、操作流程、规则、关系、细节还是覆盖范围——打开对应的索引，沿链接找到可能的页面。它只阅读需要的章节，并引用作答所依据的页面和标题；标题和描述帮助它决定去哪里找，但本身绝不能作为结论的依据。

当索引无法缩小范围时，它会在知识包中搜索精确的名称、错误字符串或同时搜索多个词。搜索结果只是线索：Agent 会先打开页面再作答。当知识包缺少证据时，它会如实说明，并告诉你它检查了哪些内容。
<!-- /context:section -->

<!-- context:section id="sources" -->
## 回到来源

知识包页面保留了来源引用。当知识包不够用时，`/c4a:context-inspect-search` 可以沿这些引用，追溯到记录版本下的原始文档和代码。请参阅 [提问](asking-questions.md)和 [远程读取代码证据](reading-code-evidence-remotely.md)。
<!-- /context:section -->
