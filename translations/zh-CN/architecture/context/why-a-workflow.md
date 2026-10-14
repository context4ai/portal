---
title: 为什么是工作流
description: 为什么 Context 以技能和 CLI 的形式运行在你自己的 Agent 中，而不是做成一个托管的知识平台。
translation:
  locale: zh-CN
  artifact_ref: 0fd00adc-8f91-4c1d-8e50-ec78c403288e
  source_digest: db9a152a6c4feb733d76022ec0dcf2c3933ab8be9a055607bcb81cf6763739d4
  translated_at: 2026-10-12T20:29:53.422Z
  source_parts:
    title: 1dcb4a6da8f8d371c75802e88b8f6bf88bb7b89fdcf36e36ad20c6f943a98176
    description: 57074a8859427206582c4fbb63aef9bd021b51b9c33f1c65b36a6e51352aea7a
    order:
      - premise
      - split
      - contract
      - service
    sections:
      premise: 7e7bd8cd14ba84aeddba906fe1e5b733cefc1582796541fea7bcb1cc0a8c9033
      split: a1ec574357f82367cbb00971574f118a66cfc4dbebd03673a5610b3c6db27f65
      contract: a0fd4ebf854fdf2df0c2bcd4f1a88462bd0403a1edc518536e2435af42cf8807
      service: 021129fa3a2958c9b13f9c70046e2eaba4b6858005c12fb29aed05a34da11f7c
    exterior:
      '[null,"premise"]': 76d11762cdd3505a89f16955a0f800a7bcd2c6441e921d3d47d01a9322846fdd
      '["premise","split"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["split","contract"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["contract","service"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["service",null]': e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
---

# 为什么是工作流

<!-- context:section id="premise" -->
## 团队已经有了 Agent

研发团队已经在 Claude Code、Codex、Cursor 或托管 Agent 环境中工作，很多团队还运行着自己的 Bot。托管的知识平台会要求他们把来源、权限和审核习惯搬到一个新地方。Context 反其道而行：它为团队已在使用的 Agent 增加技能，由本地 CLI 完成确定性工作。同一套技能既能在本地编码 Agent 中运行，也能在托管 Agent 环境中运行。
<!-- /context:section -->

<!-- context:section id="split" -->
## 语义工作与确定性工作

知识生产混合了两类工作：

| 类型 | 示例 | 由谁完成 |
| --- | --- | --- |
| 语义 | 阅读证据、提出结构、撰写和解释 | Agent |
| 确定性 | 记录来源边界、采集快照、索引代码、检查证据、暂存候选、应用审核结果、构建 | CLI |
| 决策 | 目标、来源权限、范围、结构、审核、产出 | 人 |

CLI 从不调用 LLM，也从不悄悄克隆、拉取、安装或构建来源仓库；登记来源并不授予读取其内容的权限，审核决定始终由人做出。这样，必须可重复的部分就不交给模型，而 Agent 仍可自由选择最合适的措辞和结构。
<!-- /context:section -->

<!-- context:section id="contract" -->
## 是工作流，而不是长提示词

整个生命周期很长：来源要划定范围并采集，文章要依据证据撰写，人工 Gate 可能让运行暂停，已批准的知识还要经过 close（归档）、校验和构建。把这些全部塞进一个提示词既脆弱又昂贵。因此工作流是一份约定：每一步，CLI 只返回当前合法的动作、为此要读的资源和要运行的命令。中断与恢复都从 Context 知识工作区的实际状态收敛，而不依赖对话记忆。详见[工作流运行](workflow-execution.md)。
<!-- /context:section -->

<!-- context:section id="service" -->
## 从个人 Agent 到知识服务

由于这些技能与平台无关，团队可以把它们作为常驻的知识服务来运行：一个装有 Context 插件、Bot 提示词和远程代码读取能力的 Agent 环境，接收来自聊天、网页、定时任务或 API 的请求。它持续地生产、更新和回答，人只在关键决策处介入——开工报告、审核报告以及范围取舍。

需要大量检索和确认的共享知识，以及必须随时可用的回答，适合这种常驻服务。小模块的知识直接放在仓库的 `docs/` 里即可。
<!-- /context:section -->
