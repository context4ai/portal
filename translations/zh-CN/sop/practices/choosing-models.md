---
title: 模型选择
description: Context 生产和查询的各个环节分别适合用哪类模型，以及模型选择对回答耗时的影响有多大。
translation:
  locale: zh-CN
  artifact_ref: 2a85ff63-f20d-46ed-ad05-5d5f8cb6cd7a
  source_digest: c37ef9866af271198f81a483fb753073d3230873e49417dd5f54776784aefdda
  translated_at: 2026-10-12T17:06:40.056Z
---

# 模型选择

<!-- context:section id="goal" -->
Context 可以搭配你的 Agent 所运行的任意模型，但模型选择会显著影响速度和成本。下面的角色划分来自各团队的经验；模型名称只是撰写时各角色的示例，并非推荐背书。
<!-- /context:section -->

<!-- context:section id="roles" -->
## 四种角色

| 角色 | 示例 | 适用场景 |
| --- | --- | --- |
| **主力** | Claude Opus 5.5 | 首次创建、日常生产和查询。速度约为其他模型的两到三倍，实际消耗也更少。 |
| **均衡** | GPT 5.6 SOL, Grok 4.6 | 速度和成本适中；适合文本、代码以及中等强度的代码探索。 |
| **低成本、快速** | DeepSeek 4.1 Flash | 处理面向人阅读的文档、总结代码。 |
| **高端** | GPT 6.0 Astra | 规划超大知识库的首次构建，以及在代码中做深度归因。价格昂贵。 |

处理大型工作时，你不需要自己编排多个 Agent：Context 内置的多 Agent 调度会并行执行这些工作。
<!-- /context:section -->

<!-- context:section id="evidence" -->
## 对回答的影响有多大

在一次测评中，使用相同的知识和相同的检索方式，两个模型都完全解决了 24 道题中的 23 道，但一个平均耗时 139.3 秒，另一个平均 304.0 秒，约为前者的 2.2 倍。在质量相同的情况下，模型选择可能让回答耗时翻倍以上。

这只是在一套题集上的单次运行，请把它当作参考，而不是排名。方法及其局限见[知识检索测评](../../architecture/benchmark/knowledge-retrieval.md)；如果要测量你自己的配置，参见[评测知识库效果](./evaluating-your-knowledge-base.md)。
<!-- /context:section -->
