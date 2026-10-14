---
title: 迁移已有知识库
description: 如何把现有的 LLM Wiki、Skill 集合或类似知识库迁移到 Context，同时保留它原本做得好的地方。
translation:
  locale: zh-CN
  artifact_ref: f38982c1-617a-487a-b0bd-13a6a28d01cd
  source_digest: 822d952e22b2ddcb87e8c18120add84884f7c0a7c165fc519a54c7c172aeea1d
  translated_at: 2026-10-14T11:06:04.950Z
  source_parts:
    title: 790f523aa5ffe407e30fc91eb4f3ec6cffcb162ad91d8c2d6199cc8b3de70616
    description: de49170ec4db78e28abeea7d55a20cb37427fb95c6cf052348b5abf63a8d570a
    order:
      - goal
      - prompt
      - sources
      - validate
    sections:
      goal: 6aeeb4f1fae1272bf13c57cbdd44f04721fdcb6652cd9329aa257779e7b769fe
      prompt: f8b90554cdf127cd5db620461dc090d328b23d094cd2bfc49cde6ad77880995b
      sources: 863341dc0fa7a8b1e8448ec571c8101518fad5613a820d2cbdef1ca8c22dcbaf
      validate: 2986a86f0edcbc39ff2e90d1d46a5c1729e0711fec83f26a2ff0db8f1bdddddb
    exterior:
      '[null,"goal"]': fc7a42ef766c73b4479ed7fc225d3079d20f85ce1a67579959bdaab813408835
      '["goal","prompt"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["prompt","sources"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["sources","validate"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["validate",null]': e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
---

# 迁移已有知识库

<!-- context:section id="goal" -->
如果你已经有一个知识库，比如 LLM Wiki、一组 Skill 或一个文档目录，就不必从零开始。创建一个 Context 知识工作区，向 Agent 描述现有知识库，让它规划迁移，直到给出开工报告；你在开工报告处审核方案并决定批次。
<!-- /context:section -->

<!-- context:section id="prompt" -->
## 迁移提示词

知识工作区创建好后，从下面这段开始：

```text
请先调研 Context 的能力，再帮我迁移现有知识库：

- 现有知识库的位置、内容和文档范围：
- 目前的生产方式（脚本、提示语等）：
- 期望的发布结构和形式：保留现状，还是有新的要求
- 历史问答或评测题集，用来了解知识库的实际使用方式

请整理成调研报告，继续推进到开工报告后先停下来。
我会审阅方案，再安排分批处理。
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
