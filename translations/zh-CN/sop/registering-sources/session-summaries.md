---
title: 会话摘要
description: 把与 Agent 对话中的有用结论整理为 sessions 来源，并可选择关联其产生的 commit 或合并请求。
translation:
  locale: zh-CN
  artifact_ref: 38889376-c545-487e-99b1-c4f2c1d2dcec
  source_digest: 9c0a52edcf88041a74e53a4e0441e3d7bc8939abbb3690947782601ce5c81889
  translated_at: 2026-10-14T11:06:04.950Z
  source_parts:
    title: f6bcb42b0bac9e7317ab35240064ee3ca8089cf519b8cf94141873c7403b69e0
    description: e722544543073ff6eb6a3f1f625384aed04476f52fb8cc05ffade5068e4bd9bc
    order:
      - goal
      - prepare
      - save
      - use
      - correct
    sections:
      goal: c2dda54ad8128c543ec7fd9dd52e34cbe22f9d9b2a78a4aff9fbd34f0f2f2026
      prepare: 01a71e0233c6381813574a1714a58f69fbb59dd689ddc1ff36c35ce4cc1cce36
      save: 892f55f7487cbd8690d8be2896d48e40bb3e9c36ae9b1145a4cbe50c3c9a8477
      use: a094d79160593c5b541c82a397f16055ee8dc8657a4637ff6680111ca85513b8
      correct: 03b3dfa3d6d5fd4bbf06203b82ed66f15a03bbc0e31a069db8b025d935cbb542
    exterior:
      '[null,"goal"]': ab6e6ee282e5f993dd2cebfb63795bd9c45c527665cad6b9ab64db843b348d6f
      '["goal","prepare"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["prepare","save"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["save","use"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["use","correct"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["correct",null]': e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
---

# 会话摘要

<!-- context:section id="goal" -->
与 Agent 进行的设计讨论、问题排查和需求沟通，常常会敲定一些没有任何文档记录的事情。**sessions** 来源会保存这类对话的一份有边界的摘要，供页面引用。它是摘要，绝不是完整记录：Context 不会扫描你的 Agent 历史，也不会摄入整段对话。
<!-- /context:section -->

<!-- context:section id="prepare" -->
## 保留什么

Agent（或提供摘要的人）会在导入前准备好摘要：

| 保留 | 舍弃 |
| --- | --- |
| 问题、已确认的决定以及关键理由 | 重复的对话轮次 |
| 约束和未决问题 | 工具日志 |
| 每条陈述处于提议、已同意、已实现还是已验证状态 | 已放弃的尝试，除非它们能解释当前的某个限制 |

如果只有一份他人提供的摘要，来源中会如实注明。发言人、日期和批准情况绝不会被编造；没有可复用内容的对话可以不进入 Context 知识工作区。
<!-- /context:section -->

<!-- context:section id="save" -->
## 保存

在对话结束时提出：

```text
请把我们刚才确认的重试次数限制整理成 Context 会话摘要，关联到刚创建的合并请求。
```

Agent 会用 `context source import --input <file>` 导入类似下面的载荷：

```yaml
type: sessions
name: 20261012/retry-limits.md
markdown: |
  # Retry limits for payment callbacks
  ...
changes:
  - mr: https://git.example.org/team/payments/merge_requests/42
```

请使用对话的实际日期；若不清楚，则使用收集日期。后续更正时保持同一个名称。可选的 `changes` 字段用于关联一个或多个代码变更：每一行填写完整的 `commit` SHA、`mr` URL 或两者兼有，另可选填 `repository`。没有代码的讨论可以省略该字段。关联只记录一种联系；它不能证明变更已合并或已测试，也不授权抓取代码。
<!-- /context:section -->

<!-- context:section id="use" -->
## 如何使用

保存不会启动任何知识工作。开启新读者主题的摘要会经过常规的结构审核和写作；只用于支撑现有页面的摘要会加入该页面的阅读范围，而该页面保留其主要来源。无论哪种情况，知识都会把结论转化为解答、解释和操作步骤——而不是会议纪要——并由 `knowledge/structure.yaml` 记录哪些章节引用了该摘要。

问答之后的端到端流程，参见[从对话中采集](../updates-and-versions/capturing-from-conversations.md)。
<!-- /context:section -->

<!-- context:section id="correct" -->
## 更正

要更正有误的摘要，请带上其当前的 `base_digest` 重新导入；现有的 `changes` 会被保留，除非你删除它们，`changes: []` 则会清空它们。如果摘要准确但页面有误，请修订页面。保存摘要和批准知识都不代表批准了其中提到的上游代码变更。
<!-- /context:section -->
