---
title: 会话摘要
description: 把与 Agent 对话中的有用结论整理为 sessions 来源，并可选择关联其产生的 commit 或合并请求。
translation:
  locale: zh-CN
  artifact_ref: 38889376-c545-487e-99b1-c4f2c1d2dcec
  source_digest: 9c0a52edcf88041a74e53a4e0441e3d7bc8939abbb3690947782601ce5c81889
  translated_at: 2026-10-12T16:11:57.590Z
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
Summarize what we decided about retry limits and save it as a Context
session summary, linked to the merge request we just opened.
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
