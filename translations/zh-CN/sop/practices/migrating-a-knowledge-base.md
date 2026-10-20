---
title: 迁移已有知识库
description: 如何把现有的 LLM Wiki、Skill 集合或类似知识库迁移到 Context，同时保留它原本做得好的地方；通常需要通过分阶段计划完成。
translation:
  locale: zh-CN
  artifact_ref: f38982c1-617a-487a-b0bd-13a6a28d01cd
  source_digest: 439433424f50f1ec790bc0184781a49581baecfdbaeaa95f334efdad6b4ccf84
  translated_at: 2026-10-19T19:47:45.248Z
---

# 迁移已有知识库

<!-- context:section id="goal" -->
如果你已经有一个知识库，比如 LLM Wiki、一组 Skill 或一个文档目录，就不必从零开始。创建一个知识工作区，向 Agent 描述现有知识库，让它规划迁移，直到给出[开工报告](../planning-and-production/start-reports.md)；你在开工报告处审核方案并决定批次。

规模较大的现有知识库通常会达到分阶段计划的门槛：Agent 会先提出一份 PLAN，把迁移拆成若干阶段，之后每个阶段各自产出开工报告。阶段如何划分和审核，参见[分阶段规划大型项目](../planning-and-production/planning-large-projects.md)；如何接入第一批来源，参见[知识库冷启](cold-start.md)。
<!-- /context:section -->

<!-- context:section id="prompt" -->
## 迁移提示词

知识工作区创建好后，从下面这段开始：

```text
请先调研 Context 的能力，再帮我迁移现有知识库：

- 现有知识库的位置、内容和文档范围：
- 目前的生产方式（脚本、提示词等）：
- 期望的发布结构和形式：保留现状，还是有新的要求
- 历史问答或评测题集，用来了解知识库的实际使用方式

请整理成调研报告，继续推进到开工报告后先停下来。
我会审阅方案，再安排分批处理。
```

最后一项最重要：真实问题能告诉 Agent 这个知识库是*用来做什么的*，之后它们也会成为你的评测题集。
<!-- /context:section -->

<!-- context:section id="sources" -->
## 接入现有材料

现有材料可以用不同方式接入，取决于它应当成为新文章的来源，还是保留在原处：

- **文档目录**：把一个现有文档目录登记为来源，其内容会被采集并引用。参见[文档目录](../registering-sources/document-directories.md)。
- **同仓库文档与 Skill**：已经放在同一仓库中的文档和自编 Skill 会登记为仓库内容；原文件留在原处，随项目持续演进，Context 直接引用它们，而不是迁移它们。参见[链接已有的文档与 Skill](../registering-sources/same-repository-docs.md)。
- **外部入口**：页面需要链接到的其他位置的内容，只做声明，不下载也不采集。参见[外部入口](../registering-sources/external-entrances.md)。
<!-- /context:section -->

<!-- context:section id="validate" -->
## 测量之后再切换

在新知识库得到验证之前，保持旧知识库继续运行。用同一套题集分别测试两者，比较质量、耗时和工具调用次数，方法见[评测知识库效果](./evaluating-your-knowledge-base.md)。
<!-- /context:section -->
