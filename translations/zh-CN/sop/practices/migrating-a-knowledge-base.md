---
title: 迁移已有知识库
description: 如何把现有的 LLM Wiki、Skill 集合或类似知识库迁移到 Context，同时保留它原本做得好的地方。
translation:
  locale: zh-CN
  artifact_ref: f38982c1-617a-487a-b0bd-13a6a28d01cd
  source_digest: 822d952e22b2ddcb87e8c18120add84884f7c0a7c165fc519a54c7c172aeea1d
  translated_at: 2026-10-12T17:06:40.056Z
---

# 迁移已有知识库

<!-- context:section id="goal" -->
如果你已经有一个知识库，比如 LLM Wiki、一组 Skill 或一个文档目录，就不必从零开始。创建一个 Context 知识工作区，向 Agent 描述现有知识库，让它规划迁移，直到给出开工报告；你在开工报告处审核方案并决定批次。
<!-- /context:section -->

<!-- context:section id="prompt" -->
## 迁移提示词

知识工作区创建好后，从下面这段开始：

```text
Research what Context can do, then migrate the current knowledge base:

- Location, content and document scope of the current knowledge base:
- How it is produced today (scripts, prompts, and so on):
- Desired published structure and form: keep it as is, or new requirements
- Historical Q&A or an evaluation question set, to show how the knowledge base is used

Turn this into a research report, continue up to the work-start report and pause.
I will review the approach and plan the batches.
```

最后一项最重要：真实问题能告诉 Agent 这个知识库是*用来做什么的*，之后它们也会成为你的评估题集。
<!-- /context:section -->

<!-- context:section id="sources" -->
## 接入现有材料

现有材料可以用不同方式接入，取决于它应当成为新文章的来源，还是保留在原处：

- **文档目录**：把一个现有文档目录登记为来源，其内容会被采集并引用。参见[文档目录](../registering-sources/document-directories.md)。
- **同仓库文档与 Skill**：已经放在同一仓库中的文档和自编 Skill 会登记为入口；原文件留在原处，并且仍是唯一的编辑位置。参见[同仓库文档](../registering-sources/same-repository-docs.md)。
- **外部入口**：页面需要链接到的其他位置的内容，在 `imports.yaml` 中声明，不下载也不采集。参见[外部入口](../registering-sources/external-entrances.md)。
<!-- /context:section -->

<!-- context:section id="validate" -->
## 测量之后再切换

在新知识库得到验证之前，保持旧知识库继续运行。用同一套题集分别测试两者，比较质量、耗时和工具调用次数，方法见[评测知识库效果](./evaluating-your-knowledge-base.md)。
<!-- /context:section -->
