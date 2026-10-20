---
title: 模型选择
description: Context 生产和查询的各个环节分别适合用哪类模型，以及 2026 年 10 月的一次测评对比显示模型选择对回答耗时的影响有多大。
translation:
  locale: zh-CN
  artifact_ref: 2a85ff63-f20d-46ed-ad05-5d5f8cb6cd7a
  source_digest: dd0e46d63eacab7d7e31f533001b3fc023db48f74ab399f1dd805401b6761aa6
  translated_at: 2026-10-20T05:44:31.457Z
---

# 模型选择

<!-- context:section id="goal" -->
Context 可以搭配你的 Agent 所运行的任意模型，但模型选择会显著影响速度和成本。下面的角色划分来自各团队的经验；模型名称只是截至 2026 年 10 月各角色的示例，并非推荐背书。更新的模型会取代它们，因此在依赖某个数字之前，请先确认日期。
<!-- /context:section -->

<!-- context:section id="roles" -->
## 三种角色

| 角色 | 示例（2026 年 10 月） | 适用场景 |
| --- | --- | --- |
| **主力** | DeepSeek 4.1 Flash 1017（首选）、Claude Opus 5.5 | DeepSeek 4.1 Flash 1017 适合自动化、问答、归因和中文文档处理，是目前最快的模型，适合创建和持续使用；Claude Opus 5.5 适合首次创建时的整体逻辑梳理和感知。 |
| **均衡** | GPT 5.6 SOL, Grok 4.6 | 速度和成本适中；适合文本、代码以及中等强度的代码探索。 |
| **高端** | GPT 6.0 Astra | 规划超大知识库的首次构建，以及在代码中做深度归因。价格昂贵。 |

处理大型工作时，你不需要自己编排多个 Agent。撰写是否并行进行由 Agent 决定，取决于你的宿主环境支持什么。
<!-- /context:section -->

<!-- context:section id="evidence" -->
## 对回答的影响有多大

在 2026 年 10 月记录的一次测评对比中，三个模型使用相同的 Context 知识和相同的检索方式回答了同样的 24 道题。Claude Opus 5.5 和 Grok 4.7 都完全解决了 24 道题中的 23 道，但 Claude Opus 5.5 平均耗时 139.3 秒，Grok 4.7 平均 304.0 秒，约为前者的 2.2 倍。GPT 5.6 SOL 完全解决了 24 道中的 21 道，平均耗时 157.1 秒。在质量相同的情况下，模型选择可能让回答耗时翻倍以上。

这只是在一套题集上的单次运行，请把它当作参考，而不是排名。方法及其局限见 [知识检索测评](../../architecture/benchmark/knowledge-retrieval.md)；如果要测量你自己的配置，参见 [评测知识库效果](./evaluating-your-knowledge-base.md)。
<!-- /context:section -->
