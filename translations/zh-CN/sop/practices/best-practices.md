---
title: 最佳实践
description: 让 Context 知识生产更顺利的习惯：从第一次对话、尽早预览，到审核、重新组织，以及让上游文档保持准确。
translation:
  locale: zh-CN
  artifact_ref: 6130b9e4-4934-45ce-980b-2909ab4f206e
  source_digest: 777c24e38e2a1ec5009728ccb5c58f10d7003a2de6f9d9a86fed4259eaa3ec08
  translated_at: 2026-10-14T10:25:47.577Z
---

# 最佳实践

<!-- context:section id="goal" -->
这些实践来自使用 Context 为大型研发组织建设知识的团队。它们大多围绕一件事：**尽早纠偏**，趁代价还小的时候。
<!-- /context:section -->

<!-- context:section id="start" -->
## 先对话，再开工

初始化 Context 知识工作区后，先自由对话，不要急于开始生产。说明知识应覆盖什么、来自哪里（文档链接、仓库地址、你关心的模块），以及你期望的形式。Agent 会调研并反问，直到能写出一份**开工报告**：已确认的配置和范围、计划产出的内容，以及预期的知识包或站点结构。参见[开工报告](../planning-and-production/start-reports.md)。

之后的生产需要一些时间，平均每个任务约一分钟。Agent 会持续汇报进度和任务总数，你随时可以要求本地预览。发布后，检查知识包和其他产物；Agent 会把知识工作区提交到 Git，结束本次生产。

第一个知识库来自大量质量参差的文档（一个大型 Wiki、多年的方案和报告、几个代码仓库）时，借这次对话先探索代码、对照代码筛选文档，并在写任何内容之前定好站点结构。[知识库冷启](cold-start.md)给出了做法和两个对话示例。
<!-- /context:section -->

<!-- context:section id="preview" -->
## 尽早预览，用示例纠偏

在大型任务中，开工报告和有变更的页面一出来就打开看。如果有不对的地方，要求修订，并且说得具体：给出你想要的措辞、举一个反例、描述你要的风格。纠偏越早，最终质量越好。
<!-- /context:section -->

<!-- context:section id="review" -->
## 每次审核问三个问题

审核报告决定了哪些内容会被批准，以及它们的质量。阅读时问自己三个问题：

1. **结构**（主题、目录、文档）是否符合预期？
2. **内容**（每篇文章的意图、风格）是否符合预期？
3. 是否还有相关内容**遗漏在范围之外**，或者纳入了本该排除的内容？

参见[阅读审核报告](../review-and-revision/reading-review-reports.md)。
<!-- /context:section -->

<!-- context:section id="reorganize" -->
## 知识变多后重新组织

第一版的标题往往偏抽象，目录名称和结构也很少一开始就理想。知识积累起来后，让 Agent 重新调研已批准的知识，提出更易读、更直观的目录和文章结构；此时它会比规划阶段做得更好。修订之后，再观察一轮。修订的成本远低于重新生产，适合对结构和内容做微调。参见[大规模重新组织](../review-and-revision/reorganizing-at-scale.md)。
<!-- /context:section -->

<!-- context:section id="upstream" -->
## 文档落后于代码时

生产过程会交叉核对来源，文档落后于代码是常态。默认情况下，Agent 会按代码修订知识。如果你还想修正上游文档，可以在任务开始时或在知识工作区的 `AGENTS.md` 中加一条规则：

```text
When a revision is caused by a document lagging behind code, record it in
update-remote/<date>-<topic>.md with the context, the judgment and a suggested fix.
After the task, work through update-remote: find each upstream document and
revise it, or give a concise suggested fix for the user to decide.
```

这样上游文档能保持最新，知识也不会与它们逐渐脱节。参见[回写上游](../updates-and-versions/writing-back-upstream.md)。
<!-- /context:section -->

<!-- context:section id="batches" -->
## 超大任务分批进行

超大任务要先经过规划，每个批次最多约 30 到 50 篇文档。每个批次都要完成生产、发布、记录到计划文件（`PLAN-*.md`）并提交，然后再开始下一批。参见[规划大型项目](../planning-and-production/planning-large-projects.md)。
<!-- /context:section -->
