---
title: 模型选择
description: Context 生产和查询的各个环节分别适合用哪类模型，以及模型选择对回答耗时的影响有多大。
translation:
  locale: zh-CN
  artifact_ref: 2a85ff63-f20d-46ed-ad05-5d5f8cb6cd7a
  source_digest: c37ef9866af271198f81a483fb753073d3230873e49417dd5f54776784aefdda
  translated_at: 2026-10-12T17:06:40.056Z
  source_parts:
    title: 1f41e3d47cf6f3ba92b45da9da641455bb1d5cd15482429e7cdc20524de6a9e6
    description: 6f2a14bc7d21c1442e3a8ec58e5f18cd75d6155bee96531dcfe5056741f6246d
    order:
      - goal
      - roles
      - evidence
    sections:
      goal: c8eaa9066cf842b31edb9d6775f29e9ff49c680224b90d960189605ca01feb78
      roles: 48c8cfbb2273ff4ecc07095487a2a36f6fb6c26a35f199baf3347836eb898046
      evidence: d8db88290aa1eb0f47531b6ca7520da8139b04cd2a74a4dbbb347f44e5fda95d
    exterior:
      '[null,"goal"]': 7df4ac94254f002de2f5ee53e95d27d0cd8734e1684ee2cf0615e259b1190b96
      '["goal","roles"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["roles","evidence"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["evidence",null]': e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
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
