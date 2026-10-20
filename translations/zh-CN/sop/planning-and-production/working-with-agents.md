---
title: 与 Agent 协作
description: 指南讲些什么、大家如何分工；怎样向 Agent 交代任务，哪些事由你拍板，如何尽早纠偏、随时中断与恢复，一轮工作结束时会发生什么，以及接下来可以读哪些指南。
translation:
  locale: zh-CN
  artifact_ref: ef41f849-6248-47da-afec-638ab2542c22
  source_digest: c13f92750a9d65d64a8ae51ed78815745e1de7ca5ee92fad10a46b6d36b01744
  translated_at: 2026-10-20T06:16:49.422Z
---

# 与 Agent 协作

<!-- context:section id="goal" -->
如果你已经读过 [快速开始](../../product/getting-started/quick-start.md) 等入门文档，可以通过这组指南进一步了解 Context。每篇指南都围绕你在构建和使用知识时会遇到的一项任务展开：添加材料、规划并生产页面、审核页面、构建产物、回答问题，以及让知识始终保持最新。

整个过程中，每一方各司其职：

| 谁 | 做什么 |
| --- | --- |
| **你** | 确定目标、读者和范围，并负责审批 |
| **Agent** | 阅读材料、提出计划、撰写页面并向你汇报 |
| **Context** | 记录来源和决定，逐页对照证据检查，并构建知识包和站点 |

你只需要用平常说话的方式和 Agent 交流：调用 `/c4a:context`（Cursor 中为 `/c4a-context`），说明你需要什么知识，再回答它提出的问题，具体命令都由 Agent 来执行。Context 不会自己介入普通的编码或设计对话，需要它时直接调用即可，也可以在它已经启用的对话里接着聊。想先看一项任务的完整步骤，可以读 [工作流概览](../../product/getting-started/workflow-at-a-glance.md)。
<!-- /context:section -->

<!-- context:section id="brief" -->
## 把任务交代清楚

第一条消息说得越清楚，后面要回答的问题就越少。建议讲清楚三件事：

- **读者和问题**：谁会用这些知识，他们需要解决哪些问题。
- **来源**：涉及哪些仓库、模块、文档目录或链接，哪些内容可以跳过。
- **产出**：需要给 Agent 用的知识包、网站，还是两者都要，以及使用哪种语言。

```text
/c4a:context 请在 ./kb 初始化 Context 知识工作区，为 ../billing-service 和 ../docs/billing 整理知识。
读者是需要排查开票失败问题的值班工程师，legacy-export 模块不纳入这次范围。
请先调研，再给我一份开工报告。
```

你回答过的问题会在整个任务中沿用，Agent 不会每一步都再问一遍。
<!-- /context:section -->

<!-- context:section id="who-decides" -->
## 哪些事由你拍板

| 由你决定 | 由 Agent 决定 |
| --- | --- |
| 哪些来源和模块纳入范围 | 使用哪些 Indexer Skill |
| 重点服务哪些读者、解决哪些问题 | 在已批准的计划内划分主题、页面边界和组织方式 |
| 两个主题是否合并成一份文档 | 每个页面的措辞和结构 |
| 是否接受自定义 Indexer 或可执行扩展 | 工作流中的具体步骤 |
| 是否批准开工报告和写好的页面 | — |

即使在 [全托管模式](managed-mode-and-review-policy.md) 下，只要缺少的目的或范围会影响结果，Agent 仍然会先来问你。在为一大片内容建立索引之前，它会和你一起根据实际材料筛掉过时或无关的部分，而不是只看名称就下判断。

你的判断在两个环节最为关键：开工报告和审核报告。[确认开工报告](start-reports.md) 和 [阅读审核报告](../review-and-revision/reading-review-reports.md) 分别介绍了这两个环节该关注什么。
<!-- /context:section -->

<!-- context:section id="progress" -->
## 尽早纠偏和预览

撰写是最耗时的阶段，平均每篇文章大约需要一分钟。这期间 Agent 会对照任务总数汇报进度，你也可以随时让它启动本地预览。它的进度消息都很简短：改了什么、进行到哪一步，以及接下来需要你决定什么。

建议尽早看看 [开工报告](start-reports.md) 和最先写好的几篇页面。如果觉得哪里不对，比如语气、缺了反例或者某条风格规则，直接告诉它就好。越早纠正，最终效果越好。
<!-- /context:section -->

<!-- context:section id="mid-task" -->
## 补充材料或调整方向

计划在途中也可以调整，直接在对话里告诉 Agent：

```text
请把 ../docs/refunds 加入来源，重新规划受影响的部分，再给我一份新的开工报告。
```

符合已确认目的的新材料会加入计划，已经完成的工作会保留；如果目的变了，或者加入了新类型的来源，Agent 会先回来找你确认。只想修正某一个页面，请看 [修订页面](../review-and-revision/revising-a-page.md)。
<!-- /context:section -->

<!-- context:section id="resume" -->
## 随时中断与恢复

进度保存在知识工作区里，而不是对话里。关掉会话也好，会话意外中断也好，只要在同一个知识工作区里新开一个对话，再次调用 `/c4a:context`，Agent 就会从工作实际进行到的地方接着做，已经通过的工作不会重做。如果想让某一部分重新来过，请直接告诉 Agent，不要自己去删工作区里的文件。
<!-- /context:section -->

<!-- context:section id="git" -->
## 一轮工作结束时

你批准审核后，已批准的页面会写入 `knowledge/`，产物也会随之重新构建。接着 Agent 把知识工作区提交到 Git，这一轮就完成了。至于推送、发布或部署，只有你开口它才会去做。

知识工作区会一直为下一轮做好准备。来源有了变化，或者你发现哪里还缺内容，再次调用 `/c4a:context` 就能开始，Agent 只会重新打开受影响的页面。
<!-- /context:section -->

<!-- context:section id="guides-map" -->
## 通过以下指南了解更多

这组指南沿着知识库从第一批材料到日常使用的过程展开。你可以从需要的部分读起，每个小节都从下面链接的页面开始。

1. **规划与生产**：交代任务、开工报告、大型项目和全托管模式，从本页和 [确认开工报告](start-reports.md) 读起。
2. **添加来源**：该添加哪类材料、怎么添加，见 [选择添加材料的方式](../registering-sources/source-batches.md)。
3. **审核与修订**：评判和修正页面，见 [阅读审核报告](../review-and-revision/reading-review-reports.md)。
4. **输出与站点**：知识包、文档站和 LLM Docs，见 [知识包](../outputs-and-sites/knowledge-packages.md)。
5. **使用知识**：从你构建的知识中获得回答，见 [提问](../querying-knowledge/asking-questions.md)。
6. **保持知识最新**：更新、版本以及保存工作，见 [更新知识](../updates-and-versions/updating-knowledge.md)。
7. **知识服务**：为团队生产知识、回答问题，见 [构建知识服务](../knowledge-service-agent/building-a-knowledge-service.md)。
8. **定制 Indexer**：负责读懂各类材料的 Skill，以及如何编写自己的 Skill，见 [内置 Indexer](../custom-indexers/community-indexers.md)。
9. **实践与测评**：行之有效的做法，以及如何衡量效果，见 [最佳实践](../practices/best-practices.md)。
10. **Source Graph**：从固定版本的代码搜索服务读取代码证据，见 [Source Graph 是什么](../source-graph/introduction.md)。
11. **Agent Graph**：Context 背后的工作流引擎，适合 Skill 作者阅读，见 [Agent Graph 是什么](../agent-graph/introduction.md)。
<!-- /context:section -->
