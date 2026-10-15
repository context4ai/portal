---
title: 代码类 Indexer
description: 面向某个框架或技术的代码 Indexer 应包含什么——调研信号、有限的辅助工具、撰写指引和测试——并附一个示例结构。
translation:
  locale: zh-CN
  artifact_ref: 95d27305-6115-4d2f-bb5e-ab4774b4d513
  source_digest: f158c97da74552ef1629a3af70c7d52dedc1ab53e40bedc10c82a71455422aeb
  translated_at: 2026-10-15T06:25:34.171Z
---

# 代码类 Indexer

<!-- context:section id="goal" -->
代码 Indexer 教 Agent 如何阅读某一种技术：它的功能声明在哪里，规划期间如何低成本地找到它们，以及在讲解之前需要完整阅读什么。它展示模块的骨架并指导基于来源的撰写；它不会重新实现工作流的路由。本页参照自带的 `context-code-indexer`，介绍其中应包含的内容。

```mermaid
flowchart LR
  sig["信号<br/>清单、入口、注册"] --> skel["骨架<br/>名称、计数、位置"]
  skel --> topics["读者主题<br/>与撰写批次"]
  topics -->|"报告已确认"| read["阅读每篇文章<br/>所需的代码"]
  read --> art["带有真实<br/>引用的文章"]
```
<!-- /context:section -->

<!-- context:section id="responsibilities" -->
## Skill 负责什么

描述所支持的技术、激活它的信号、它能帮助回答的读者问题，以及如何调研一个已授权的模块。一个模块可以针对不同关注点使用多个 Skill——比如一个用于 Web 框架，另一个用于消息消费者。生产之前不存在独占的主负责方、版本锁定、完整性回执或注册步骤；Skill 名称和使用选择是临时的规划指引，而不是文章元数据。

让 `SKILL.md` 专注于发现和决策。把详细的撰写指引和可复用脚本放在它旁边，用相对路径链接，并清楚说明何时阅读它们。
<!-- /context:section -->

<!-- context:section id="skeleton" -->
## 骨架优先

在规划期间，Indexer 应当引导 Agent 查看目录、清单文件、注册点并进行有限的搜索——可以直接查看，也可以借助适合该技术栈的快速辅助工具——并报告匹配的名称、已知计数和文件位置。在提出文章之前，它不得要求完整提取符号、构建调用图或阅读每一处实现。

典型信号及其引出的问题：

| 信号 | 引出的问题 |
| --- | --- |
| 公开导出或组件声明 | 如何使用某项能力 |
| 入站注册或接口定义 | 提供了哪些操作 |
| 事件或定时任务注册 | 什么触发了工作，工作如何完成 |
| 存储接口 | 数据归属和事务边界 |
| 适配器和生成的客户端 | 外部交接处的契约 |
| 包和工作区入口 | 职责与使用边界 |

信号只是提示主题，并不能证明含义。路由注册可以提示一个 API 主题，但不能说明它的错误行为。文件数不是功能数，中途停止的扫描也绝不是完整总数。
<!-- /context:section -->

<!-- context:section id="helpers" -->
## 有限的辅助工具

脚本是可选的，只服务于一个具体的、重复的任务。好的辅助工具接受明确的已授权路径和有限的选项，保持源文件只读，返回简洁的输出或把文件写到提供的临时区域，并在预算内停止。它报告已检查和未检查的范围，能继续时返回续接点，并为不完整的计数加上标注。

它不得执行仓库代码、读取凭据、遍历无关目录或联系外部服务。不支持的语法和未完成的遍历要与零匹配分开报告。完整解析属于选定的撰写任务；如果某个结构性事实需要真正的解析器，请使用[代码抽取](../../architecture/knowledge/code-extraction.md)中介绍的内置抽取器。
<!-- /context:section -->

<!-- context:section id="writing" -->
## 撰写指引

开工报告确认后，Agent 会阅读每篇文章所需的源码。引导它讲解契约、状态变化、失败行为和集成点——模块负责什么、如何进入、交出什么。解析可以定位声明，但不能证明运行时行为。保留表达式原样而不执行项目代码，把声明的默认值与实现的默认值分开，并写明未知之处。

Indexer 可以为路由组或组件这类功能类别建议一套重复使用的大纲，但不能规定固定的页数：组件手册可能需要逐个组件阅读，而每个符号一页或为大模块写一个大杂烩页面都是错误的。每个片段引用的真实源码区域最多来自三个文件——同一文件可引用多个区域，总计最多八个区域；如果一段讲解需要不同的证据，就把它拆开。
<!-- /context:section -->

<!-- context:section id="example" -->
## 示例结构

一个针对假想的 Acme RPC 框架的最小 Indexer：

```text
acme-rpc-indexer/
  SKILL.md
  references/
    investigate.md   # 服务、方法和中间件的声明位置
    writing.md       # 接入和维护指南的大纲
  scripts/
    list-services.mjs  # 限定在给定路径内，输出服务和方法名称及位置
  tests/fixtures/
    orders-service/  # 匿名化的示例模块
```

```markdown
---
name: acme-rpc-indexer
description: Investigate services built on Acme RPC and write integration and maintenance articles. Use when selected for a Context planning or writing task on such a module.
---

# Acme RPC Indexer

During planning, read `service.yaml` files and `@Method` registrations in the
authorized module. Report service names, method counts and file locations;
mark partial counts as partial. For large modules run
`scripts/list-services.mjs <paths> --max-files 2000`.

During writing, read [writing guidance](references/writing.md). For each
method, explain the request contract, errors and middleware actually applied.
A generated client is outbound, not proof that this module serves the method.
```
<!-- /context:section -->

<!-- context:section id="tests" -->
## 测试

用匿名测试夹具测试所支持的技术：功能发现、有限停止、不支持的输入、不同路径中的重名，以及最终文章中的引用。对于生成的 API 讲解，除了辅助工具的输出，还要在最终页面中检查默认值、共享类型和未解析的跨文件链接。使用与该技术相关的测试夹具，而不是一组互不相关的技术栈矩阵。

验证打包后的相对链接和可执行的辅助工具，并确保社区示例不包含公司特定的服务；组织知识应放在它们自己的 Skill 中。创建流程参见[创建 Indexer](creating-an-indexer.md)，组合 Skill 参见 [Provider 与定制](providers-and-customization.md)。
<!-- /context:section -->
