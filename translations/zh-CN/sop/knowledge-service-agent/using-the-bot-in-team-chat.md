---
title: 在团队聊天中使用 Bot
description: 团队如何在聊天中与 Context 知识 Bot 协作——消息模式、提问与审核、带来源的回答、采集知识、巡检与边界。
translation:
  locale: zh-CN
  artifact_ref: cadb9370-2f17-4d24-8482-f4e4696d0812
  source_digest: f59e8e9f005b72d7c9e8cc884200de452e5677309ec62db7f3ee9a5898a47f20
  translated_at: 2026-10-12T17:06:40.056Z
---

# 在团队聊天中使用 Bot

<!-- context:section id="goal" -->
以下是在团队聊天 Bot 背后运行 Context Skills 时被证明有效的交互模式。无论你自建 Bot，还是使用本站规划中的 Bot，都同样适用。

> **状态。** 社区版不提供 Bot；本站自有的 Bot 尚在规划中。下面的模式来自在团队聊天 Bot 背后运行 Context Skills 的实践。
<!-- /context:section -->

<!-- context:section id="messages" -->
## 消息：开始、进度、结果

- 一个任务会回复三类消息：**开始**、**进度**和**最终结果**。持续更新同一条进度消息，而不是发很多条。
- Bot **只在需要有人决定时才提问**——确认开工报告、确认发布、选择范围——并提供可选的选项。谁都不应该需要回复暗号或审核代码。
- 审核人在网站上看完 Diff 报告后，工作流会从那里继续；不必再回到聊天里确认。
- 维护者不应该操心提交知识仓库或发布知识包和站点。这些默认静默完成；只有遇到 Diff 审核、权限问题或意见分歧时，Bot 才会打断。
<!-- /context:section -->

<!-- context:section id="answers" -->
## 可供核查的回答

- 每个回答都带有**可点击的来源**：知识页面、带提交号的代码行，以及原始文档。只说“根据知识包”太抽象，无从核实。
- 每个回答都有点赞和点踩评价。评价和对话会一起用于改进检索和提示词。
<!-- /context:section -->

<!-- context:section id="capture" -->
## 边聊边采集知识

- 当某个回答值得保留时，让 Bot 把它采集下来。聊天内容、你刚分享的文档，或者某段具体代码、某个合并请求，都可以成为来源；Bot 会先提出计划，再运行更新流程。参见[从对话中采集](../updates-and-versions/capturing-from-conversations.md)。
- 你也可以要求更新整个知识库或其中一部分。Bot 会分析自上次更新以来上游文档和代码的变化，给出更新计划，再给出相对网站基线的 Diff 报告。
- **定时巡检**在固定时间触发，跟踪上游变化并采集知识。巡检提示词必须写明范围、没有变化时怎么做，以及哪些情况需要人介入。参见[定时更新](../updates-and-versions/scheduled-updates.md)。
<!-- /context:section -->

<!-- context:section id="speed" -->
## 速度

- **冷启动**是首次回答慢的主要原因。在运行时中预装 CLI、知识包和 Context 知识工作区，让会话不必每次都安装和克隆。
- **先读知识**，只有证据不够时才远程读取原文——通过 Source Graph 按提交获取代码，而不是在沙箱里克隆仓库。实测效果见[知识检索测评](../../architecture/benchmark/knowledge-retrieval.md)。
- 简单问题仍有提升空间；目标是一分钟内给出回答。
<!-- /context:section -->

<!-- context:section id="boundaries" -->
## 公开 Bot 的边界

- 公开访客只能提问。生产、更新和发布只对维护者开放，由服务层强制执行。
- Bot 只读取已登记的公开来源。凭据保留在服务端，绝不进入知识、提示词或回复。
- 接入聊天平台时优先使用长连接事件订阅；它不需要公网回调地址。
<!-- /context:section -->
