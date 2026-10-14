---
title: Indexer 体系
description: 四个内置 Indexer 技能、工作流如何使用它们，以及团队如何添加自己的 Indexer。
translation:
  locale: zh-CN
  artifact_ref: 6272ae5a-8966-42cd-a06d-5986828764fd
  source_digest: a95e9eb11571231816e2386f547e476283396f3dcbb6f1f95de5e6224c0b300d
  translated_at: 2026-10-13T05:38:06.765Z
  source_parts:
    title: 80aaff382c3c920336942f6fa9d52bcb4faa4d2cd2bdbca1e6f0d26f9feb90d3
    description: 09c9132c5c436d8b4579bfd3ae7c611782b3d20c5a1a04d8cf3470eaa9791351
    order:
      - what
      - built-in
      - built-in-install
      - usage
      - create
    sections:
      what: 722e34d236b7b7442f4de2e73b5b2d6674d630fd9ca733625f57ca4bfcb998f3
      built-in: 3104b499022ddda377cdca17daa8e4f46d39f49b070aa65d76b95378c7ffe7cc
      built-in-install: ff19e556130ebbdde59810521b74e0702c205ffa983fc8f138039ed860b29ce8
      usage: a3d4e02293f0e6cff4c6bea791ad4e58c5f35f4f6b961956e8a53758b2e079f6
      create: 744d805529b3e82cf597cacce771f2d2bf5cfcdd8ca807622266606c987f7b00
    exterior:
      '[null,"what"]': 68bd72b3fb37187fa78d254d8e8b1dddef35bad43bc0661649426522ac4c7a97
      '["what","built-in"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["built-in","built-in-install"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["built-in-install","usage"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["usage","create"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["create",null]': e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
---

# Indexer 体系

<!-- context:section id="what" -->
## Indexer 是什么

Indexer 是一种 Agent 技能，帮助 Agent 展示来源的骨架，并据此撰写基于来源的文章。它是阅读和写作的指引，既不是强制的全量扫描，也不是 CLI 内部的分类器。CLI 负责准备每个阶段、提供资料和验收规则并检查结果；Indexer 贡献的是如何调查和讲解某一类来源。
<!-- /context:section -->

<!-- context:section id="built-in" -->
## 四个内置 Indexer

| Indexer | 读取 | 起点 |
| --- | --- | --- |
| `context-code-indexer` | 仓库模块 | 目录和文件导航、清单文件、入口和注册点；撰写时再详细阅读代码 |
| `context-markdown-indexer` | 采集的文档和同仓库文档 | 标题、有限的开头摘录以及 H2/H3 大纲；撰写前阅读全文 |
| `context-note-indexer` | 保存的笔记、摘录和观察记录 | 直接阅读，无解析器 |
| `context-sessions-indexer` | 保存的会话摘要 | 直接阅读，无解析器 |

<!-- /context:section -->

<!-- context:section id="built-in-install" -->
这四个 Indexer 都随插件安装，在所有支持的宿主中都可被发现。安装 Indexer 只是让它可用，并不代表选中它。[社区 Indexer 一览](../../sop/custom-indexers/community-indexers.md)对每个 Indexer 有更详细的介绍。
<!-- /context:section -->

<!-- context:section id="usage" -->
## 工作流如何使用它们

```mermaid
flowchart LR
  req["需求"] --> plan["计划"]
  plan -->|"选择 Indexer"| usage["indexer_usage"]
  usage --> write["阶段撰写"]
  write -->|"CLI 检查"| cand["候选"]
```

- `src/indexers.yaml` 只保存已确认的需求：目的、读者目标、覆盖领域和已授权的来源。
- 在计划阶段，Agent 选择相关的 Indexer，并在临时计划中记录为 `indexer_usage`；这一选择不会持久化到文章上。
- 多个 Indexer 可以讲解同一模块的不同方面，它们的发现可以共同支撑一篇文章。没有主负责方，没有 Provider 解析步骤，也不对技能做版本或哈希固定。
- 每个撰写任务在临时目录中产出 Markdown 和引用；CLI 接收它们，并负责候选、审核和正式输出。
<!-- /context:section -->

<!-- context:section id="create" -->
## 创建自己的 Indexer

当某种技术或某类文档需要专门指引时，`/c4a:context-indexer-create` 会在你选择的目录中编写一个新的可复用 Indexer 技能。新 Indexer 从有用的骨架起步——来源结构、可识别特征、名称、已确定的数量和入口位置——并可以为其技术添加一个范围有限的辅助工具。它交付一个 `SKILL.md`，外加确实有帮助的参考资料、模板或脚本，并用真实的匿名资料进行验证。它不会登记 Provider 清单，也不会启动知识生产；安装后即可供 Agent 选择。分步指南见[创建 Indexer](../../sop/custom-indexers/creating-an-indexer.md)；组合、替换和禁用 Indexer 的方法见 [Provider 与定制](../../sop/custom-indexers/providers-and-customization.md)。

如果缺少所需的结构性事实，写作指引无法凭空创造——那需要解析器。参见[代码抽取](code-extraction.md)。
<!-- /context:section -->
