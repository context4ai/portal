---
title: 代码仓库
description: 将一个仓库或 monorepo 中选定的包登记为固定到某个 commit 的来源，并了解代码继续演进时会发生什么。
translation:
  locale: zh-CN
  artifact_ref: d929e5f1-7f84-4525-93f8-4bfd5729453d
  source_digest: 5264cf9165a0fd9fa38548f0b5b5818ffbf0624f82df5a3df80606e2f5dc3976
  translated_at: 2026-10-14T11:06:04.950Z
  source_parts:
    title: 2d414746fb663bb53f2dba62bd400f602eee5f1a912fdeb1f1bab0d70e37061f
    description: ac641134c708ca204315dfd2c9dca9aa84453dbb59cae2a13bc42890383ad8ad
    order:
      - goal
      - ask
      - recorded
      - monorepo
      - parsers
      - clones
      - later
    sections:
      goal: fdd36c5cf8b4f699eedc74383aca478efc4d42128f7c5ba87d3355cdcc7e0f09
      ask: bb8f184984dd70cfa2f4f680f921e50e850eb8e3bdcc59f18cd0d9acd636ca02
      recorded: 784068965004d4919e248dd2d78aa250a4ff6e4f9896ebf9a2fc5a98bc90558f
      monorepo: d1ce2f3c46d45fa1437ed1456246a7e16eb29acc5b0285fdcab119d4f85761c6
      parsers: e82066450190874d549b5d590f92be3375a1b8da0d56d4b82d784e6d9d6eeaf7
      clones: 67c923a0476e6768a26c27e88125e13ce94dae388af2623f7a36a79f0cf2ec69
      later: 536030fcd68c5483c6191ba6a1f0ace5c4129af9165d37648620b6662f500248
    exterior:
      '[null,"goal"]': 2e56e6bd767fd0c2769cf540471ebffee370b28c32fbb212913faefdf6bdbdcb
      '["goal","ask"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["ask","recorded"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["recorded","monorepo"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["monorepo","parsers"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["parsers","clones"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["clones","later"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["later",null]': e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
---

# 代码仓库

<!-- context:section id="goal" -->
已登记的仓库是一个**来源边界**：Agent 在编写知识时可以阅读和引用的代码。登记会把仓库固定到一个 commit，因此每条引用指向的代码都不会在其下发生变动。登记并不决定要写什么；那是之后在开工报告中决定的。

```mermaid
flowchart LR
  you["你指定一个本地检出"] --> agent["Agent 解析路径"]
  agent --> cli["CLI 读取 origin 和 HEAD"]
  cli --> reg["已登记的来源<br/>date/module @ commit"]
  reg --> plan["规划和写作<br/>只读取该 commit"]
```
<!-- /context:section -->

<!-- context:section id="ask" -->
## 告诉 Agent

说明检出目录以及读者需要其中的哪一部分，用自然语言即可：

```text
请把 ../payments-service 作为代码来源。读者需要了解退款流程，旧的管理模块就不纳入了。
```

如果你的请求已经点名了确切的本地模块，Agent 不会让你重复，也不会要求你提供远程 URL：它会把每个名称解析到一个本地目录，并让 CLI 读取该检出的 Git 根目录、`origin` 和当前 commit。只有当名称有歧义、没有匹配项，或选择某个匹配项会扩大你给定的范围时，它才会询问。
<!-- /context:section -->

<!-- context:section id="recorded" -->
## 记录了什么

Agent 会用类似下面的命令登记模块：

```bash
context source add repo 20261012 --module payments-service --local ../payments-service --configure
```

| 选项 | 含义 |
| --- | --- |
| `20261012` | 采集批次日期。多个仓库和文档可以共用同一个日期。 |
| `--module` | 必填。具体的仓库或包名。 |
| `--local` | 本地检出路径；可以指向 monorepo 的子目录。 |
| `--remote` / `--ref` | 远程 URL 和固定的 commit。省略时从本地 `origin` 和 `HEAD` 推断。 |
| `--configure` | 同时在简单的 `src/index.ts` 中选中该来源。它从不执行任何采集。 |

来源以 `date/module` 的形式寻址，例如 `20261012/payments-service`。这个名称会出现在来源引用中；稳定的代码知识路径使用不带日期的模块名。代码来源不需要采集阶段：Agent 直接读取固定 commit 下的检出。
<!-- /context:section -->

<!-- context:section id="monorepo" -->
## Monorepo：选择包，而不是整棵树

Context 从不依据当前目录、包名或 Git 远程来扩大边界。当 monorepo 中有多个包边界时，Agent 会展示它们的路径，并询问哪些应成为来源。把 `--local` 分别指向每个选中的包。

在来源内部过滤文件无法选中 monorepo 的包，因此请明确选择包。在索引过时或无关的区域之前先讨论一下——不必要的代码会耗费阅读时间和 token——但不要仅仅因为某个目录名字看起来陈旧就舍弃它。
<!-- /context:section -->

<!-- context:section id="parsers" -->
## 代码如何被读取

解析是所选 Indexer 的细节，不需要你按仓库配置。Indexer 会检查语言、清单文件、入口、路由和契约，然后使用能回答读者问题的最小解析器集合。社区解析器覆盖 TypeScript/JavaScript、Go、Rush monorepo、Thrift、Protobuf、Markdown/MDX、API 契约、样式表和 SQL schema。解析器产出的事实如何变成页面，参见[代码抽取](../../architecture/knowledge/code-extraction.md)。
<!-- /context:section -->

<!-- context:section id="clones" -->
## 在另一台机器上的检出

Git 只为仓库来源保存恢复配方：远程地址、固定的 commit 和模块路径，并不保存检出本身。当 Context 知识工作区在别处打开、且某个任务需要这份代码时，Agent 会提供三种选择：

1. 指向一个已有的本地检出；
2. 指定一个有边界的目录，让它在其中扫描匹配的检出；或
3. 允许 Context 把已登记的仓库克隆到 `.tmp/repo/`。

恢复克隆始终使用已登记的 commit，因此现有知识保持可复现。在普通模式下，Agent 会在克隆前询问；它从不扫描未指定的磁盘根目录，也不会用其他分支或相近的仓库代替。
<!-- /context:section -->

<!-- context:section id="later" -->
## 代码继续演进时

登记会一直保持其 commit，直到你另作决定。要把知识更新到更新的 commit，请提出更新：Agent 会准备新版本，将其与现有页面引用的内容进行比较，并询问哪些页面需要修改。只有在所选修订被批准并构建之后，已处理的基线才会前移。参见[更新知识](../updates-and-versions/updating-knowledge.md)。
<!-- /context:section -->
