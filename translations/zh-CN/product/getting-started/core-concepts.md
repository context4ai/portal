---
title: 核心概念
description: Context 文档中反复出现的术语、它们之间的关系，以及延伸阅读的入口。
translation:
  locale: zh-CN
  artifact_ref: 31a5553a-c85b-4bd5-ab0f-29829bc9bbf5
  source_digest: 971695d6c28f5714662b64d56ca08f19e4816471d627ca7b53b929db2187e067
  translated_at: 2026-10-12T20:29:53.422Z
  source_parts:
    title: 6116686315702983b1d201a2553fbc3bd88b76920edf6839fe178bd8b46914a9
    description: e5f4ba0f6212d8d7cb79d7d48a832dace3234355bec1a6a78307071a3f0f6f5c
    order:
      - map
      - workspace
      - sources
      - indexers
      - candidates
      - packages
      - route
    sections:
      map: fa6beb3457516149ada04cf558e70e4c646631d275840322eaa3dca2a8fbb89b
      workspace: 45726e56a2001ec003b01c391076fb43cd1d28b6c505496201d2907612cb8ea8
      sources: 9fcfe19b911b422acdfa16b3a621d32a3ffd2114312962bf9ca16c92e8bf03bc
      indexers: 492afcacb6ed20d4580cd1e91b9838a3ae7e5b2f6f53eca0c4574c699b41c3a9
      candidates: 02b6cb86da68b6d49e621cb0a553cf494f6e888228625400b2d23035efb84b01
      packages: a7f2dc6fff641be383d04d7538304039a2b031fefe7f7fbf6df6a84ea63ddb8d
      route: 83beb1a88ff73c86c56b2dcbddff6de3882f68e5c6a9483d62b74ffcfa44017e
    exterior:
      '[null,"map"]': 339160bf3dca103519f3afa073015b40c25fafa92a9ba3e8d7f3e59bcbdac80e
      '["map","workspace"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["workspace","sources"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["sources","indexers"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["indexers","candidates"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["candidates","packages"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["packages","route"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["route",null]': e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
---

# 核心概念

<!-- context:section id="map" -->
## 概念之间的关系

```mermaid
flowchart LR
  subgraph ws["Context 知识工作区"]
    direction LR
    src["来源"] --> idx["Indexer"]
    req["需求"] --> idx
    idx --> cand["候选"]
    cand -->|审核| kn["已批准的知识"]
  end
  kn --> pkg["知识包与站点"]
  facts["Facts"] -.-> route["Route 与 Gate"]
  route -.->|下一步动作| idx
```

所有内容都放在同一个 **Context 知识工作区**里。**来源**和**需求**是输入；**Indexer** 把它们写成**候选**；**审核**把候选收录为**已批准的知识**；构建再把这些知识产出为**知识包和站点**。整个过程中，工作流读取知识工作区的 **Facts**，选出下一个 **Route**，并在需要人来决定时停在 **Gate** 处。
<!-- /context:section -->

<!-- context:section id="workspace" -->
## Context 知识工作区

一个本地目录，通常提交到 Git，保存某一套知识的全部内容：

| 目录 | 存放内容 |
| --- | --- |
| `src/` | 来源、阶段和知识包的声明，以及 `indexers.yaml` 中的需求 |
| `sources/` | 已登记的来源和采集到的证据 |
| `knowledge/` | 已批准的知识和长期有效的决策 |
| `dist/` | 构建出的知识包（可复现，被 Git 忽略） |
| `.tmp/` | 可随时丢弃的运行时状态和报告（被忽略） |

`sources/`、`knowledge/`、`dist/` 和运行时状态都由 CLI 负责写入；只有当前 Route 要求时，Agent 才会修改项目配置。每个目录和文件的说明见 [Context 知识工作区](knowledge-workspace.md)。
<!-- /context:section -->

<!-- context:section id="sources" -->
## 来源、采集、笔记与会话

**来源**是一条登记过的边界：一个仓库模块、一个本地文档目录或一篇在线文档。登记来源会记录它的身份和权限边界；它不决定要写哪些知识，也不授予读取边界之外内容的权限。**采集**把文档正文和资源保存为可审计的快照；仓库按固定提交读取，无需采集。

**笔记**是整理过的摘录和观察；**会话**是保存下来的对话摘要。两者都通过 `context source import` 直接导入，和其他来源一样成为证据。
<!-- /context:section -->

<!-- context:section id="indexers" -->
## 需求与 Indexer

`src/indexers.yaml` 中的**需求**记录了知识写给谁、必须回答哪些问题、授权使用哪些来源。**Indexer** 是 Agent 技能，每种读取一类来源并写出有来源依据的文章：内置了 Code、Markdown、Note 和 Sessions 四种 Indexer，团队也可以自行创建。Agent 在规划时为每个任务挑选合适的 Indexer。详见[社区 Indexer](../../sop/custom-indexers/community-indexers.md)和 [Indexer 体系](../../architecture/knowledge/indexer-system.md)。
<!-- /context:section -->

<!-- context:section id="candidates" -->
## 候选、审核与已批准的知识

Agent 写出的文章以**候选**的形式提交：它们是绑定了来源证据的草稿，并会检查覆盖度和过期输入。**审核**展示可读的标题、路径、摘要和内容；批准后，页面以长期保存的 Markdown 写入 `knowledge/`，拒绝则退回重写。被拒绝候选的状态只保存在临时的生命周期账本中；`knowledge/` 只存放已批准的页面。

已批准知识的每个小节都保留自己的**证据**，即指向来源确切位置的引用。它们共同构成[证据链](../../architecture/knowledge/evidence-chains.md)，让读者和 Agent 能够核实每一处陈述。**知识地图**（`knowledge/structure.yaml`）是由集合、文章和小节组成的封闭投影，站点和知识包都按它导航。
<!-- /context:section -->

<!-- context:section id="packages" -->
## 知识包与站点

**构建**把已批准的知识变成一种产出：Agent 知识包、文档站点或 LLM 文档。每次构建都会生成一份清单，把分发出去的文件对应回知识工作区。详见[知识包与站点构建](../../architecture/context/packages-and-sites.md)。
<!-- /context:section -->

<!-- context:section id="route" -->
## Route、Gate 与 Facts

**Facts** 是 CLI 在知识工作区中观察到并记录为结果的事实；对话中的说法不能作为完成的证据。工作流根据 Facts 选出一个 **Route**：当前要做的动作、为此要读的资源以及它的完成约定。**Gate** 会让 Route 暂停，等待需要人或更高权限做出的决定，例如批准开工报告或审核结果。详见[工作流运行](../../architecture/context/workflow-execution.md)。
<!-- /context:section -->
