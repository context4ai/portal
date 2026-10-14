---
title: Provider 与定制
description: 多个 Indexer 如何在同一模块上组合、如何替换或禁用某个 Indexer、自定义 Indexer 放在哪里，以及工作流会记录哪些相关信息。
translation:
  locale: zh-CN
  artifact_ref: 1a348ca1-024e-4348-b2eb-df8a7870c7f6
  source_digest: b254653da124eb2e3fcc2f72ea90d09a0cc88a319fb1903d37b868128a3ba779
  translated_at: 2026-10-12T16:45:10.508Z
  source_parts:
    title: dbc87d09e0649ffa76c1a9cf70d16ac267cecad591ddb4fae0ff6362a8da3fc4
    description: ae8d96ed3186c31e99b02cc6a4d2a2e8dcc0dc780351f32990ba298e3673baba
    order:
      - goal
      - selection
      - combine
      - steer
      - where
      - records
      - manifest
    sections:
      goal: 32aaeb020e48b34d2ce0fe9f495a76ebef33bfd4e74bb1400826b3ca7db9751c
      selection: e2d524a61411ffce3dcd40cc90adae9c37a1eb6c57dbf0795bdcf83335532a9e
      combine: bb7c2a1c817a4953b41df56104fb076fc02dc3b01342493a1c8e46b10752b2df
      steer: 65e7a517798448af19a7a3c8a357717618ec09ec67b9b249d9530d526a26fe52
      where: 7fa3f0a5094df3e3d8bf280f5c82c4b17753d7d24f49a42522d0b05b269564db
      records: 0d693073b16da44bb2cce6937200ac65a385c201187d62d5aaa119f18d1e2b42
      manifest: 4928f1d6ec30c2d1676285c22171b6da7272379945ba153dd5d0ecc29de43d73
    exterior:
      '[null,"goal"]': 10f1eff751590aa31b0b932f189dab061495781e81326e6cad68e7914b1e0d3e
      '["goal","selection"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["selection","combine"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["combine","steer"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["steer","where"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["where","records"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["records","manifest"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["manifest",null]': e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
---

# Provider 与定制

<!-- context:section id="goal" -->
在 Context 中，Indexer Skill 也称为 **Indexer Provider**：为某一类来源提供调研和撰写指引的一组内容。本页说明如何为你的 Context 知识工作区选择和组合 Provider，如何引导这一选择——添加专用 Indexer、替换内置 Indexer、禁用某个 Indexer——以及哪些相关信息会被记录、哪些不会。

```mermaid
flowchart TD
  host["你的 Agent 宿主中可见的 Skill"] --> avail["可用的 Indexer"]
  disabled["被禁用的 Skill"] -.->|"排除"| avail
  replace["明确的业务替换"] -.->|"优先"| avail
  avail --> pick["Agent 按材料<br/>和读者任务选择"]
  pick --> usage["临时阶段计划中的<br/>indexer_usage"]
  usage --> write["撰写任务"]
```
<!-- /context:section -->

<!-- context:section id="selection" -->
## 选择如何进行

规划某个阶段时，Agent 会声明当前宿主中可用的相关 Skill，以及它能否调度子 Agent。随后它挑选适合实际材料和读者任务的 Indexer，并把它们连同相关配置作为 `indexer_usage` 记录在临时阶段计划中；CLI 在规划和撰写期间会把这些指引交回给 Agent。

不存在 Provider 解析阶段，也没有需要选定的主负责方。Agent 不会检查缓存、比较 Skill 哈希、解析确切版本或另建一套安装注册表——安装和启用 Skill 是宿主的职责。Skill 名称只是发现线索，并不能证明该 Skill 适用。
<!-- /context:section -->

<!-- context:section id="combine" -->
## 在同一模块上组合 Indexer

多个 Indexer 可以讲解同一模块的不同方面，它们的发现可以支撑同一篇文章。典型的组合是通用的 `context-code-indexer` 加上针对该模块框架的专用 Indexer，或者用代码 Indexer 讲结构、用笔记解释业务意图。组合不需要主/扩展绑定：每个 Skill 各自贡献指引，仅仅来源类型不同并不需要另起一页。
<!-- /context:section -->

<!-- context:section id="steer" -->
## 添加、替换和禁用

| 你想要 | 这样做 |
| --- | --- |
| 添加专用 Indexer | 按照[创建 Indexer](creating-an-indexer.md)创建，并安装到宿主可见的位置。安装只是让它可用，并不等于被选用。 |
| 对某些材料优先使用团队的 Indexer 而非内置 Indexer | 在请求或常驻指令中明确说明替换；Agent 会尊重明确的业务替换。 |
| 阻止某个 Indexer 被使用 | 在 Agent 宿主中禁用该 Skill；Agent 会尊重被禁用的 Skill。 |
| 为单个任务调整指引 | 在任务中说明。记录在 `indexer_usage` 中的选择是临时的，不会改变该 Skill。 |

如果代码中缺少某个所需的结构性事实，撰写指引无法凭空创造它；这需要解析器。参见[代码抽取](../../architecture/knowledge/code-extraction.md)。
<!-- /context:section -->

<!-- context:section id="where" -->
## 自定义 Indexer 放在哪里

| 位置 | 可见范围 |
| --- | --- |
| 仓库的 `.claude`、`.cursor` 或 `.agents` 目录 | 在对应宿主中打开该仓库的任何人；无插件命名空间 |
| 用户级目录：`~/.agents/skills`（Codex、Cursor）或 `~/.claude/skills`（Claude Code） | 你在该机器上的所有项目；自带的 Indexer 也安装在这里 |
| 你分发的插件 | 安装该插件的所有人 |

保持包的可移植性，并使用你常用的安装渠道。Indexer 的发行版本可以携带普通的版本元数据，但生产在工作前从不校验 Indexer 的版本或哈希。
<!-- /context:section -->

<!-- context:section id="records" -->
## 工作流记录什么

| 会记录 | 不会记录 |
| --- | --- |
| 正式文章、其来源和真实引用 | 文章、小节或生产结果上的 Skill 身份 |
| `src/indexers.yaml` 中的长期需求：目的、读者目标、覆盖领域和已授权来源 | 生产分配或 Indexer 选择 |
| `.tmp` 下的临时 `indexer_usage`、草稿和回执 | Skill 哈希、版本锁定或生产者日志 |

临时状态完好时，当前工作可以恢复或重试。清空 `.tmp` 或在别处克隆后，新的生产会从正式知识和来源开始，而不会恢复之前的 Skill 包。
<!-- /context:section -->

<!-- context:section id="manifest" -->
## Provider 清单

自带的 Indexer 还附带一个 `context-indexer.yaml` Provider 清单（协议为 `context.indexer.provider/v1`），声明它们的领域、激活信号、画像、资源和支持的定制步骤。SDK 提供了这一协议及其校验器。新的 Indexer 不需要清单——`context-indexer-create` 有意不生成清单——生产也不依赖它。关于该协议以及工作流如何使用 Indexer，参见 [Indexer 体系](../../architecture/knowledge/indexer-system.md)。
<!-- /context:section -->
