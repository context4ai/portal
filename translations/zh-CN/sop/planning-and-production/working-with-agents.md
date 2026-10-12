---
title: 与 Agent 协作
description: 如何向 Agent 交代任务，哪些事由它决定、哪些会问你，如何跟进进度、在任务中途补充材料、在中断后恢复，以及如何使用多个 Agent。
translation:
  locale: zh-CN
  artifact_ref: ef41f849-6248-47da-afec-638ab2542c22
  source_digest: c117de6a05292d8f9bea538dd18d1e6a1b7ab458b772f6b4191f92fa601ec29f
  translated_at: 2026-10-12T16:11:57.590Z
---

# 与 Agent 协作

<!-- context:section id="goal" -->
你通过 Agent 驱动 Context，而不是直接操作 CLI。调用 `/c4a:context`（Cursor 中为 `/c4a-context`），用自然语言描述你需要的知识，并回答它带回来的决策问题。Agent 从 CLI 读取工作流当前的 Route，执行返回的命令并撰写页面；CLI 负责校验来源和页面身份、推导路径，并掌管知识审核、`knowledge/` 和 `dist/`。

普通的编码或设计对话不会自行启动 Context；你需要显式调用它，或在 Context 已经激活的对话中继续。
<!-- /context:section -->

<!-- context:section id="brief" -->
## 把任务交代清楚

第一条消息确定的内容越多，后续的问题就越少。请覆盖以下几点：

- **读者和问题**：谁会使用这些知识，他们需要回答哪些问题。
- **来源**：仓库、模块、文档文件夹或链接，以及需要跳过的内容。
- **产出**：面向 Agent 的知识包、网站，还是两者都要，以及使用的语言。

```text
/c4a:context Initialize a Context knowledge workspace in ./kb and build knowledge for
../billing-service and ../docs/billing. Readers are on-call engineers who need
to diagnose failed invoices. Skip the legacy-export module. Investigate first,
then give me the work-start report.
```

你已经给出的回答会在整个任务中复用，不会在每一步重复询问。
<!-- /context:section -->

<!-- context:section id="who-decides" -->
## 哪些会问你，哪些由它决定

| 由你决定 | 由 Agent 决定 |
| --- | --- |
| 哪些来源和模块在范围内 | 使用哪些 Indexer 技能 |
| 哪些读者和问题是重点 | 在已批准的计划内划分主题、页面边界和组织方式 |
| 两个主题是否属于同一个知识归属 | 每个页面的措辞和结构 |
| 是否接受自定义 Indexer 或可执行扩展 | Route 返回的机械步骤 |
| 大纲和候选页面是否批准 | — |

即使在全托管模式下，如果缺失的目的或范围会改变结果，Agent 也会询问你。在对一个大范围建立索引之前，它会根据实际材料与你一起识别过时或无关的部分，而不是凭名称猜测。
<!-- /context:section -->

<!-- context:section id="progress" -->
## 跟进进度

生产是耗时最长的阶段，平均每个文章任务大约一分钟。Agent 会对照任务总数汇报进度，你也可以随时要求本地预览。阶段切换时的汇报保持简短：发生了什么变化、当前状态以及下一个决策。

尽早查看开工报告和最先改动的页面。如果有不对的地方，比如语气、某个反例或某条风格规则，直接指出。纠正越早，最终结果越好。
<!-- /context:section -->

<!-- context:section id="mid-task" -->
## 补充材料或调整方向

直接在对话中说明：

```text
Add ../docs/refunds to the sources, re-plan the affected part and give me a
new work-start report.
```

在已确认目的范围内的新材料会成为一次计划修订，已完成的工作会保留；新的目的或来源仍需回到你这里确认。要修正某个页面，请参阅[修订页面](../review-and-revision/revising-a-page.md)。
<!-- /context:section -->

<!-- context:section id="resume" -->
## 中断与恢复

工作流状态保存在知识工作区中，而不是对话里。会话关闭或崩溃后，在同一个知识工作区中打开新对话并调用 `/c4a:context`，Agent 会读取当前 Route 并继续。已接受的任务永远不会重新提交；删除临时运行时文件也不是重新开始的方式，这样做并不会授权重放已接受的工作。
<!-- /context:section -->

<!-- context:section id="multi" -->
## 多个 Agent 并行

当你的宿主能够协调子 Agent 时，工作可以拆分给它们。CLI 决定哪些批次可以并行；每个 worker 只撰写分配给它的草稿，由一个协调者统一提交给 Context。如果宿主不具备这种能力，Agent 会使用单个批次，不会模拟 worker。并行永远不会免除本应由你做出的决定。
<!-- /context:section -->

<!-- context:section id="git" -->
## Git 与发布

完成 Context 工作并不代表授权进行 Git 操作。只有在你要求时，Agent 才会暂存、提交、推送、发布或部署。
<!-- /context:section -->
