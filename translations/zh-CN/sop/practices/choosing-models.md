---
title: 模型选择
description: 生产和查询 Context 知识时该用哪类模型，2026 年 10 月的测评对模型选择有什么启示，以及如何用自己的问题检验一个模型。
translation:
  locale: zh-CN
  artifact_ref: 2a85ff63-f20d-46ed-ad05-5d5f8cb6cd7a
  source_digest: 28b1b1cbee29c83fe580b5944434547ea084264449e63cbf82173b4d30df7163
  translated_at: 2026-10-21T11:18:58.549Z
---

# 模型选择

<!-- context:section id="goal" -->
Context 可以搭配你的 Agent 所用的任何模型。知识到位之后，当前的大多数模型都能答对问题；模型主要决定的是工作有多快、花费有多少。本页把模型分为三类角色，介绍我们的测评结果，并说明在正式使用前如何检验一个模型。文中的模型名称只是 2026 年 10 月的示例，并非推荐背书；新模型会不断出现，引用数字前请留意日期。
<!-- /context:section -->

<!-- context:section id="roles" -->
## 三类角色

| 角色 | 示例（2026 年 10 月） | 适用场景 |
| --- | --- | --- |
| **主力** | DeepSeek V4.1 Flash 1017（首选）、Claude Opus 5.5、Muse Wonder | 日常的知识生产与查询。DeepSeek 是团队在自动化、问答、归因和中文文档上的首选，也是测评中费用最低的托管模型。Claude Opus 5.5 擅长梳理首次构建的整体逻辑。Muse Wonder 是知识检索与代码问答的新候选，尚未在知识生产上测评过。 |
| **均衡** | GPT 5.6 SOL、Grok 4.6 与 4.7 | 速度和成本适中，适合文本、代码以及中等强度的代码探索。 |
| **高阶** | GPT 6.0 Astra | 规划超大型知识库的首次构建，以及在代码深处追查原因。费用高，留给这类工作即可。 |

大型任务不需要你自己编排多个 Agent。写作是否并行由 Agent 根据宿主的支持情况决定。
<!-- /context:section -->

<!-- context:section id="evidence" -->
## 测评结果说明了什么

[知识检索测评](../../architecture/benchmark/knowledge-retrieval.md)让七轮运行基于同一份 Context 知识回答同样的 24 个真实研发问题，结果与上面的角色划分一致：

- **质量相差不大**。每一轮都完全解决了 21 到 24 题。Muse Wonder 加 Source Graph 全部解决；Claude Opus 5.5、Grok 4.7 和 DeepSeek 各解决 23 题。
- **速度和成本差距大得多**。DeepSeek V4.1 Flash 1017 加 Source Graph 平均每题约 1 分钟，费用约 \$0.03；Claude Opus 5.5 加 Source Graph 约 1 分半钟，费用约 \$0.27；Grok 4.7 约 5 分钟，更长的探索并没有多解决问题。
- **提高推理强度没有带来收益**。DeepSeek 从 high 调到 max 后，少解决了 1 题，费用却增加了约三分之二。

该测评只衡量作答，不涉及知识生产，而且每轮运行中每道题只作答一次。
<!-- /context:section -->

<!-- context:section id="try" -->
## 用自己的问题检验模型

为知识库更换模型之前，先挑一小组来自你自己用户的真实问题，让新模型和当前模型分别作答，比较完全解决的题数、平均与 P90 耗时以及工具调用次数。除了看分数，也要看它答错了哪些题，因为得分相同的两个模型往往错在不同的地方。如何搭建这样的对比，请看[评测知识库效果](./evaluating-your-knowledge-base.md)。
<!-- /context:section -->
