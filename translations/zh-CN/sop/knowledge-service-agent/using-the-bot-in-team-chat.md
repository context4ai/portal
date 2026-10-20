---
title: 在团队聊天中使用 Bot
description: 团队如何在聊天中与 Context 知识 Bot 协作——问什么、在话题中会看到什么、带来源的回答、保存知识、速度与边界。
translation:
  locale: zh-CN
  artifact_ref: cadb9370-2f17-4d24-8482-f4e4696d0812
  source_digest: 707d7ad885ef9044400b5e8db1fdf90aeff2178a797e56b3c88b9110c9e22981
  translated_at: 2026-10-20T05:13:06.930Z
---

# 在团队聊天中使用 Bot

<!-- context:section id="goal" -->
团队聊天中的知识 Bot 运行的是你在本地使用的同一套 Context Skills，因此一个 Bot 就能回答问题、启动生产和更新，并带大家完成报告审核。以下是在团队聊天 Bot 背后运行 Context Skills 时行之有效的交互模式。如何搭建背后的服务见 [构建知识服务](./building-a-knowledge-service.md)；本页讲的是日常使用。
<!-- /context:section -->

<!-- context:section id="asking" -->
## 问什么

像询问一位读过团队知识的同事那样向 Bot 提问：

```text
@Bot 这个知识库涵盖哪些内容？它的网站在哪里？
@Bot 为什么 <feature> 会拒绝 <case>？把定义它的代码和文档给我看看。
@Bot 怎样在我的 Agent 中安装这个知识包？
```

Bot 会先读团队已批准的知识，只有当知识确实存在缺口时，才回到原始代码和文档。怎样提问才能得到精确的回答，见 [提问](../querying-knowledge/asking-questions.md)。在你自己的 Agent 中安装同一份知识，见 [在 Agent 中使用知识包](../querying-knowledge/using-packages-in-agents.md)。
<!-- /context:section -->

<!-- context:section id="messages" -->
## 在话题中会看到什么

- 一个任务会回复三类消息：**开始**、**进度**和**最终结果**。Bot 会持续更新同一条进度消息，而不是发很多条。
- Bot **只在需要有人决定时才提问**——确认开工报告、确认发布、选择范围——并提供可选的选项。谁都不需要回复暗号或审核代码。参见 [确认开工报告](../planning-and-production/start-reports.md)。
- 你在网站上看完 Diff 报告后，工作流会从那里继续；不必再回到聊天里确认。
- 提交知识仓库、发布知识包和站点都会不间断地完成。只有遇到 Diff 审核、权限问题或意见分歧时，Bot 才会停下来。
<!-- /context:section -->

<!-- context:section id="answers" -->
## 可供核查的回答

- 每个回答都带有**可点击的来源**：知识页面、带提交号的代码行，以及原始文档。只说“根据知识包”太抽象，无从核实。
- 每个回答都有点赞和点踩评价。评价和对话会一起用于改进检索和提示词。
<!-- /context:section -->

<!-- context:section id="capture" -->
## 保存你学到的内容

当某个回答值得保留时，在同一话题中让 Bot 把它保存为知识。聊天内容、你刚分享的文档，或者某段具体代码、某个合并请求，都可以成为来源。

```text
@Bot 把这个话题的结论保存为知识，并把我刚分享的文档也加进去。
```

Bot 会先提出计划，运行更新，然后给你一份相对网站的 Diff 报告。阅读报告后，发送修订意见或直接确认；之后发布会自动完成。要关注哪些内容见 [阅读审核报告](../review-and-revision/reading-review-reports.md)，对话如何成为来源见 [从对话中采集](../updates-and-versions/capturing-from-conversations.md)。

你也可以要求更新整个知识库或其中一部分。Bot 会分析自上次更新以来上游文档和代码的变化，给出更新计划，再给出相对网站的 Diff 报告。

**定时巡检**在固定时间运行，跟踪上游变化并采集知识。巡检提示词必须写明范围、没有变化时怎么做，以及哪些情况需要人介入。参见 [定时更新](../updates-and-versions/scheduled-updates.md)。
<!-- /context:section -->

<!-- context:section id="speed" -->
## 速度

- **冷启动**是首次回答慢的主要原因。在运行时中预装 CLI、知识包和知识工作区，让会话不必每次都安装和克隆。
- **先读知识**，只有证据不够时才远程读取原文——通过 Source Graph 按提交获取代码，而不是在沙箱里克隆仓库。实测效果见 [知识检索测评](../../architecture/benchmark/knowledge-retrieval.md)。
- 简单问题的目标是一分钟内给出回答。
<!-- /context:section -->

<!-- context:section id="boundaries" -->
## 公开 Bot 的边界

- 公开访客只能提问。生产、更新和发布只对维护者开放，由服务层强制执行。
- Bot 只读取已登记的公开来源。凭据保留在服务端，绝不进入知识、提示词或回复。
- 接入聊天平台时优先使用长连接事件订阅；它不需要公网回调地址。
<!-- /context:section -->
