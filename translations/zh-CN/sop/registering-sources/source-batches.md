---
title: 选择添加材料的方式
description: 每种材料（代码、文档目录、飞书文档、笔记、会话摘要、同仓库的文档与 Skill，或外部入口）该用哪种方式添加，以及如何在一次请求中添加多个来源。
translation:
  locale: zh-CN
  artifact_ref: 8d6384ca-b7a3-46ae-8a46-82c64a65008a
  source_digest: e364bae889d2e4797b840015ad044adec76d6cfc2035a3095a19b51a968da340
  translated_at: 2026-10-20T06:16:49.422Z
---

# 选择添加材料的方式

<!-- context:section id="goal" -->
在 Agent 写任何内容之前，它需要知道可以阅读和引用哪些材料。本小节介绍如何添加每一类材料。添加来源只记录哪些内容在范围内；它并不决定要写什么，那是之后在 [开工报告](../planning-and-production/start-reports.md) 中决定的。

添加大量来源并不等同于生产一个大型知识库。如果工作涉及超过 30 份文档，或需要对两个及以上仓库做实质性调研，Agent 会先把它分阶段规划；参见 [分阶段规划大型项目](../planning-and-production/planning-large-projects.md)。
<!-- /context:section -->

<!-- context:section id="material-kinds" -->
## 哪种方式适合你的材料

| 你的材料 | 添加方式 | 指南 |
| --- | --- | --- |
| 代码仓库，或 monorepo 中的包 | 固定到 Agent 读取的 commit | [代码仓库](code-repositories.md) |
| 本地 Markdown 文件或文档目录 | 采集为供页面引用的快照 | [文档目录](document-directories.md) |
| 飞书文档和 Wiki 页面 | 连同其中的图片、表格、附件和其他嵌入资源一起采集 | [飞书文档](lark-documents.md) |
| 你手头已有的文字：摘录、决定、观察 | 保存为笔记 | [笔记与会话摘要](notes.md) |
| 一次 Agent 对话得出的结论 | 保存为会话摘要 | [笔记与会话摘要](notes.md) |
| 与知识工作区放在同一仓库中的文档和 Skill | 原地链接和引用，不复制 | [链接已有的文档与 Skill](same-repository-docs.md) |
| 读者应能访问的站点、Skill、仓库或包 | 声明为供链接的入口，不作为证据读取 | [外部入口](external-entrances.md) |

如果不确定，描述一下材料以及读者需要从中得到什么；Agent 会提出合适的类别，并在这一选择会改变范围时询问你。
<!-- /context:section -->

<!-- context:section id="checkpoint" -->
## 一次请求添加多个来源

你不必逐个添加来源。在一次请求中把它们全部点名即可：

```text
把 ../billing-service 作为代码，把 ../docs/user-guide.md 作为产品文档，
再加上这个 Wiki 页面：https://example.larkoffice.com/wiki/example-token
```

Agent 会在一个批次中一起登记它们，因此它们不会相互干扰。耗时较长的登记会随时保存进度：如果中断了，请 Agent 继续，它会从停下的地方恢复，并对照已登记的内容重新检查每个来源，而不是信任中断前的记录。其背后的命令见 [CLI 命令](../../product/reference/context/cli-commands.md)。
<!-- /context:section -->

<!-- context:section id="failure" -->
## 出现失败时

失败会保留已经成功的部分：失败项之前的来源保持已登记状态，Agent 会告诉你哪些已完成、哪一个失败了，以便你修复那一个后继续。

一个知识工作区同一时间只能运行一次登记。如果 Agent 仍在忙于某次登记，请等待它完成，不要另起一次。如果强制停止导致知识工作区被阻塞，请先让 Agent 恢复它，再继续执行。
<!-- /context:section -->
