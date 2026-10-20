---
title: 最佳实践
description: 让 Context 知识生产更顺利的一份简短习惯清单，每条都链接到详细说明的指南，并介绍上游文档落后于代码时如何让它们保持准确。
translation:
  locale: zh-CN
  artifact_ref: 6130b9e4-4934-45ce-980b-2909ab4f206e
  source_digest: afe42e7269f9db9c77dd5325b22a5cf53f19b2b77be51840cfbe71595b4b784f
  translated_at: 2026-10-20T05:13:06.930Z
---

# 最佳实践

<!-- context:section id="goal" -->
这些习惯来自使用 Context 为大型研发组织建设知识的团队。它们大多围绕一件事：**尽早纠偏**，趁代价还小的时候。每一条都链接到详细说明的指南。

## 清单
<!-- /context:section -->

<!-- context:section id="start" -->
- **先对话，再开工。** 说明知识应覆盖什么、来自哪里（文档链接、仓库地址、你关心的模块），以及你期望的形式。让 Agent 反问，直到它写出一份开工报告供你确认。参见 [确认开工报告](../planning-and-production/start-reports.md)。
- **登记前先筛选大量质量参差的来源。** 当第一个知识库来自一个大型 Wiki、多年的方案或几个代码仓库时，先让 Agent 探索代码、对照代码核查文档，并定好站点结构。参见 [知识库冷启动](cold-start.md)。
- **一轮结束时检查产物。** 查看知识包和站点；Agent 会在一轮结束时把知识工作区提交到 Git。参见 [开始新任务与保存工作](../workspace-maintenance/preparing.md)。
<!-- /context:section -->

<!-- context:section id="preview" -->
- **尽早预览，用示例纠偏。** 在大型任务中，有变更的页面一出来就打开看。如果有不对的地方，给出你想要的措辞、一个反例或你要的风格。参见 [修订页面](../review-and-revision/revising-a-page.md)。
<!-- /context:section -->

<!-- context:section id="review" -->
- **每份审核报告都问三个问题。** 结构是否符合预期？内容是否符合预期？是否有内容遗漏在范围之外，或纳入了本该排除的内容？参见 [阅读审核报告](../review-and-revision/reading-review-reports.md)。
<!-- /context:section -->

<!-- context:section id="reorganize" -->
- **知识变多后重新组织。** 第一版的标题和目录很少一开始就理想。让 Agent 基于已批准的知识提出更清晰的目录和文章结构；修订的成本远低于重新生产。参见 [大规模重组](../review-and-revision/reorganizing-at-scale.md)。
<!-- /context:section -->

<!-- context:section id="batches" -->
- **把超大任务分阶段进行。** 先规划，再一次一个批次地生产、发布和提交。参见 [分阶段规划大型项目](../planning-and-production/planning-large-projects.md)。
<!-- /context:section -->

<!-- context:section id="upstream" -->
## 文档落后于代码时

生产过程会交叉核对来源，文档落后于代码是常态。默认情况下，Agent 会按代码修订知识。如果你还想修正上游文档，可以在任务开始时或在知识工作区的 `AGENTS.md` 中加一条规则：

```text
如果这次修订是因为文档落后于代码，请在 update-remote/<date>-<topic>.md 记录背景、判断和修改建议。
任务完成后，请逐项处理 update-remote：找到对应的上游文档并修订，
或给用户一份简短的修改建议，由用户来决定。
```

这样上游文档能保持最新，知识也不会与它们逐渐脱节。参见 [回写上游](../updates-and-versions/writing-back-upstream.md)。
<!-- /context:section -->
