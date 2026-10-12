---
title: 常用提示词
description: 常见 Context 请求的示例说法：开工、补充材料、修订、重新组织、更新、评估、迁移、规划、构建和提问。
translation:
  locale: zh-CN
  artifact_ref: 5c111951-9200-413d-98d2-5ac1bc2bb128
  source_digest: a87c542af44207f84a7dbfbf90994a1dd5cd2b873519e82c136ae4bdf53a8c52
  translated_at: 2026-10-12T17:06:40.056Z
---

# 常用提示词

<!-- context:section id="goal" -->
你通过与 Agent 对话来驱动 Context。下面是适用于常见请求的说法；请替换尖括号中的占位符。每条都只是起点：Agent 会调研，必要时反问，并在需要你决定的地方停下来。
<!-- /context:section -->

<!-- context:section id="produce" -->
## 生产与修订

| 你想要 | 这样说 | 会发生什么 |
| --- | --- | --- |
| 开工 | “在 `<directory>` 初始化一个 Context 知识工作区，为 `<repository or module>` 和 `<document link>` 建设知识。先调研，再给我开工报告。” | 搭建知识工作区、调研来源，然后给出开工报告供你确认 |
| 补充材料 | “把 `<new material>` 登记为来源，重新规划受影响的部分，并给我一份新的开工报告。” | 登记来源并修订计划 |
| 修订 | “修订 `<article>`：`<problem>`。保留来源引用。” | 一个修订任务，以及针对变更页面的审核报告 |
| 重新组织 | “重新调研已批准的知识，提出更直观的目录和标题结构。等我确认后再修订。” | 先给出结构方案，然后执行修订 |
| 规划大型项目 | “为 `<repositories and documents>` 规划一个知识项目。” | `context-plan` Skill 进行调研，并写出一份 `PLAN-*.md` 供审核 |
<!-- /context:section -->

<!-- context:section id="maintain" -->
## 更新、评估与迁移

| 你想要 | 这样说 | 会发生什么 |
| --- | --- | --- |
| 更新 | “来源已经更新到 `<version>`。找出受影响的知识，并审核这些更新。” | 影响评估、定向修订和审核报告 |
| 评估 | “用 `<question set>` 评估当前知识库，按四档判据给每个回答评分，并给我 P50/P90。” | 一次评估运行，包含评分和耗时 |
| 迁移 | “调研 Context 能做什么，然后迁移当前知识库……” | 完整提示词见[迁移已有知识库](./migrating-a-knowledge-base.md) |
<!-- /context:section -->

<!-- context:section id="deliver" -->
## 构建与提问

| 你想要 | 这样说 | 会发生什么 |
| --- | --- | --- |
| 构建并预览 | “构建知识包和文档站点，并给我一个本地预览。” | 执行 `context build`，然后启动本地 HTTP 预览，其 URL 经检查后才会给你；发布到托管环境需要你单独授权 |
| 提问 | “根据 `<package>` 的知识，`<feature>` 是如何工作的？” | `context-inspect-search` 基于知识作答并附上来源，同时报告知识缺口 |

这些请求背后的命令和 Skill 列在[命令与技能](../../product/getting-started/commands-and-skills.md)中。
<!-- /context:section -->
