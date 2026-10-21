---
title: 模型选择
description: Context 生产和查询的各个环节分别适合用哪类模型，以及 2026 年 10 月的一次测评对比显示模型选择对回答耗时的影响有多大。
translation:
  locale: zh-CN
  artifact_ref: 2a85ff63-f20d-46ed-ad05-5d5f8cb6cd7a
  source_digest: 8e5e931c63aedd65fc93a9c171b7f56c476372dd91eb9cac15af02c7b1be2daa
  translated_at: 2026-10-21T09:51:24.230Z
---

# 模型选择

<!-- context:section id="goal" -->
Context 可以搭配你的 Agent 所运行的任意模型，但模型选择会显著影响速度和成本。下面的角色划分来自各团队的经验；模型名称只是截至 2026 年 10 月各角色的示例，并非推荐背书。更新的模型会取代它们，因此在依赖某个数字之前，请先确认日期。
<!-- /context:section -->

<!-- context:section id="roles" -->
## 三种角色

| 角色 | 示例（2026 年 10 月） | 适用场景 |
| --- | --- | --- |
| **主力** | DeepSeek 4.1 Flash 1017（首选）、Claude Opus 5.5、**Muse Wonder** | DeepSeek 是团队现有的自动化、问答、归因和中文文档处理选择；Opus 适合首次创建时的逻辑梳理、日常生产与查询。Muse 是知识检索与代码问答的备选，依据是下方限定范围的对照；该轮没有评测知识生产能力。 |
| **均衡** | GPT 5.6 SOL, Grok 4.6 | 速度和成本适中；适合文本、代码以及中等强度的代码探索。 |
| **高端** | GPT 6.0 Astra | 规划超大知识库的首次构建，以及在代码中做深度归因。价格昂贵。 |

处理大型工作时，你不需要自己编排多个 Agent。撰写是否并行进行由 Agent 决定，取决于你的宿主环境支持什么。
<!-- /context:section -->

<!-- context:section id="evidence" -->

## 最新问答对照说明了什么

**在本轮 24 道开发者知识问答中，Muse Wonder + Source Graph 与 Claude Opus 5.5 + Source Graph 整体表现接近：Muse 多完全解决一题，Opus 响应稍快。**

| 指标 | Muse Wonder + Source Graph | Claude Opus 5.5 + Source Graph |
| --- | ---: | ---: |
| 完全解决率 | **100%（24/24）** | 95.8%（23/24） |
| 平均答复耗时 | 106.9 秒 | **93.2 秒** |
| P90 耗时 | 135.0 秒 | **123.0 秒** |
| 平均工具调用 | 11.7 次 | 7.8 次 |
| 单题预估费用 | $0.210 | $0.272 |

Muse 平均每题慢约 **14 秒（15%）**，但本轮全部完成了原问要求，可以作为这类知识检索与代码问答场景的候选模型。Muse 实测平均 **38.8 万 Token/题**；费用是估算参考。

结论仅限于这组 24 题。运行环境与配置存在差异，不能据此证明模型普遍等效、跨场景表现稳定或实际成本更低。请用自己的问题集比较候选模型，同时检查答案质量、平均与 P90 耗时以及工具调用。

较早的本地检索对照保留在[知识检索测评](../../architecture/benchmark/knowledge-retrieval.md)中；它采用不同的检索配置，不应与本表混用。要测量自己的配置，参见[评测知识库效果](./evaluating-your-knowledge-base.md)。

<!-- /context:section -->
