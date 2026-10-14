---
title: 文档类 Indexer
description: 面向某类文档的文档 Indexer 应包含什么——以大纲为先的规划、撰写前的全文阅读、主题分组、图像处理和测试——并附一个示例结构。
translation:
  locale: zh-CN
  artifact_ref: a3f38c25-85de-4b6f-9a99-dc86485cf82c
  source_digest: baec5db2cbbbb0424a94209641c4995e02a22de48d9e117809d26fde9fb032e3
  translated_at: 2026-10-14T11:06:04.950Z
  source_parts:
    title: 08bccde178ab8d8a52bd672fa32726c95f716630af37d3b7f1a225f3b0edf36b
    description: 276718dd6cb362ef28860584c1fa12fd4a2a82e301d925170802dff3d7c4b21d
    order:
      - goal
      - sources
      - planning
      - writing
      - visuals
      - example
      - tests
    sections:
      goal: 1885f59d6fa86d4fbc66a5cbfbf2d6c4ec3bb8358bcb1a37890275b01eb0787e
      sources: 827031551c10322a36c6f7aa9e91e1b9a2749a8cbad1ef973c5cded555d64fa6
      planning: 2d32045209a264a317796d8914796b2c1da7001c8c1a875ccb191567823d4b1b
      writing: 01d6f63c9b85a34a5937f45741a0b640f8e690a9352a5e03cca22845dad3dfed
      visuals: a9e35f8a822b47358f45d3b4fe23fbbbd16c8c730cfcbcac997e5ab06c425c51
      example: 25f45ac6a382aa96f7623df64194b936e60f27a6dac02d2f2528032dc04b3b20
      tests: f9bb0a2820df5226af88a2b361d3d2b8b27dc329f0a5e708975057a765d01532
    exterior:
      '[null,"goal"]': 46122d887c1f98187ed3f62400a63095ac3718f39fe8fc27ca8dc7366cbecb9b
      '["goal","sources"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["sources","planning"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["planning","writing"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["writing","visuals"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["visuals","example"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["example","tests"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["tests",null]': e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
---

# 文档类 Indexer

<!-- context:section id="goal" -->
文档 Indexer 帮助 Agent 解读某一类已采集的文档——设计评审、运维手册、API 规范、产品需求——并把它们转化为围绕读者问题而非来源文件组织的文章。本页参照自带的 `context-markdown-indexer`，介绍其中应包含的内容。笔记和会话摘要有各自的解读器，但可以支撑相同的读者主题。

```mermaid
flowchart LR
  outline["标题、开头摘录、<br/>H2/H3 大纲"] --> group["按读者任务<br/>和已有主题分组"]
  group -->|"报告已确认"| read["阅读每篇文章<br/>所需的段落"]
  read --> art["带有区域<br/>引用的文章"]
```
<!-- /context:section -->

<!-- context:section id="sources" -->
## 从已采集的来源开始

Indexer 处理的是已授权、已采集的 Markdown 及其来源标识。采集证明的是哪些字节可用，而不是它们的含义；标题、小标题和文件名只是导航辅助，不能证明正文已被阅读。

它不得自行抓取新文档、跟随外部链接或扩大来源授权。缺失的材料通过当前工作流申请，不可用的来源与无关的来源要区分开。
<!-- /context:section -->

<!-- context:section id="planning" -->
## 依据大纲规划

对每份文档，CLI 会提供标题、有限的引言和完整的 H2/H3 大纲，以及已有文章的标题、描述和引用。只有在读者问题、分组或权威性不明确时，Agent 才会进一步阅读——某一节或整份文档。提交计划之前并不要求全文阅读每份文档。

引导分组：

- 当某篇已有文章（包括最初从代码中发现的主题）为同一受众回答同一问题时，复用它。
- 让文档中的业务定义修正机械生成的代码主题名称，而不是把文档硬塞到代码目录下。
- 拆分不同的读者任务或生命周期；合并回答同一任务的来源。像“运维”这样宽泛的共用标签，并不意味着其下所有流程都要合并成一篇摘要。
- 文件数和标题数都不决定文章数。一份文档可以支撑多篇文章，多份文档也可以支撑一篇文章。

年代、归档位置和文字是否精炼，既不能证明权威性，也不能证明无关；要比较实质内容、受众和适用范围。第一版计划会展示在开工报告中，并在批量撰写之前等待你的反馈，全托管模式下也是如此。
<!-- /context:section -->

<!-- context:section id="writing" -->
## 撰写与修复

撰写之前，Agent 会阅读每篇文章所需的实际段落，并把权威规则、示例、决定和提议区分开——会议纪要中的一条建议并不是已实现的行为。每个小节最多引用三个真实的来源区域；CLI 负责摘要值和安全性，Agent 判断证据是否支撑讲解。局部失败在报告的小节处修复，已完成的任务可以直接提交，无需等待同一批次的其余任务。

修订会保持文章和小节的标识稳定，并保留有用的步骤、示例、图片和限制。不要虚增页数，不要每个标题写一页，也不要把缺失的证据变成推测性的文字。
<!-- /context:section -->

<!-- context:section id="visuals" -->
## 图片、表格和图表

文档中已授权的图片会作为已登记的视觉资源提供。Agent 只读取这些资源，在可用时优先使用结构化的白板或表格数据；只有当每个标签、数值和脚注都能完整保留时，才会把清晰的流程图、时序图、状态图或关系图转换为 Mermaid，或把表格转换为 Markdown。截图、照片以及以外观本身为信息的设计稿会保留原件，无法可靠读取的内容也是如此。它绝不猜测关系或数字。文档 Indexer 可以针对其文档类别中常见的图表补充指引。
<!-- /context:section -->

<!-- context:section id="example" -->
## 示例结构

一个针对设计评审文档的最小 Indexer：

```text
design-review-indexer/
  SKILL.md
  references/
    writing.md     # 决策记录和架构指南的大纲
  tests/fixtures/
    reviews/       # 三份匿名化设计评审，其中一份已被替代
```

```markdown
---
name: design-review-indexer
description: Interpret design-review documents and write decision records and architecture guides. Use when selected for a Context planning or writing task on such documents.
---

# Design Review Indexer

During planning, use the title, "Context", "Decision" and "Alternatives"
headings to group reviews by the system they change. A superseded review
still explains history; link it from the current decision instead of
dropping it.

During writing, read [writing guidance](references/writing.md). State the
decision, its rationale and limits; mark open questions as open. A proposal
without a recorded decision is not adopted behavior.
```
<!-- /context:section -->

<!-- context:section id="tests" -->
## 测试

覆盖该 Skill 声称支持的文档形式：普通的一对一文章、综合多份文档的文章、复用已有主题、小节修复、来源行变化、链接和图片，以及材料缺失。既要检查对来源的忠实度，也要检查最终页面；保持示例匿名，并验证打包后的链接。草稿和调度细节都是临时的；清空 `.tmp` 只会让新的生产从正式知识和可用来源重新开始。

创建流程参见[创建 Indexer](creating-an-indexer.md)，代码方面的对应内容参见[代码类 Indexer](code-indexers.md)，组合 Skill 参见 [Provider 与定制](providers-and-customization.md)。
<!-- /context:section -->
