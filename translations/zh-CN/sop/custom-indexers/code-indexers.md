---
title: 编写 Indexer 指引
description: 自己的代码或文档 Indexer 应包含什么——调研信号、有限的辅助工具、以大纲为先的规划与主题分组、撰写指引、图片和测试——并各附一个示例结构。
translation:
  locale: zh-CN
  artifact_ref: 95d27305-6115-4d2f-bb5e-ab4774b4d513
  source_digest: cb17ecfbbba70d82adeff39b6ba498a3e9db769335c18d631f34b70b2f44e528
  translated_at: 2026-10-20T06:16:49.422Z
---

# 编写 Indexer 指引

<!-- context:section id="goal" -->
当你在编写或审阅自己的 Indexer 时阅读本页，通常是在 [创建 Indexer](creating-an-indexer.md) 中请创建器生成第一版之后。Indexer 教 Agent 如何阅读某一种技术或某一类文档：规划期间可以低成本查看什么，讲解之前需要完整阅读什么，以及如何围绕读者问题组织文章。它指导调研和撰写；接下来做什么仍由 Context 工作流决定。

两类 Indexer 遵循相同的节奏：先看低成本的骨架或大纲，再由你在开工报告中确认读者主题，然后完整阅读每篇文章所需的来源。下面两节分别参照自带的 `context-code-indexer` 和 `context-markdown-indexer`。

```mermaid
flowchart LR
  sig["信号或大纲<br/>清单、入口、标题"] --> skel["骨架<br/>名称、计数、位置"]
  skel --> topics["读者主题<br/>与撰写批次"]
  topics -->|"报告已确认"| read["阅读每篇文章<br/>所需的来源"]
  read --> art["带有真实<br/>引用的文章"]
```
<!-- /context:section -->

<!-- context:section id="responsibilities" -->
## 代码类 Indexer

代码 Indexer 教 Agent 如何阅读某一种技术：它的功能声明在哪里，规划期间如何低成本地找到它们，以及在讲解之前需要完整阅读什么。

### Skill 负责什么

描述所支持的技术、激活它的信号、它能帮助回答的读者问题，以及如何调研一个已授权的模块。一个模块可以针对不同关注点使用多个 Skill——比如一个用于 Web 框架，另一个用于消息消费者。某个任务使用哪些 Skill 属于该任务的规划指引，而不是文章元数据。

让 `SKILL.md` 专注于发现和决策。把详细的撰写指引和可复用脚本放在它旁边，用相对路径链接，并清楚说明何时阅读它们。
<!-- /context:section -->

<!-- context:section id="skeleton" -->
### 骨架优先

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
### 有限的辅助工具

脚本是可选的，只服务于一个具体的、重复的任务。好的辅助工具接受明确的已授权路径和有限的选项，保持源文件只读，返回简洁的输出或把文件写到提供的临时区域，并在预算内停止。它报告已检查和未检查的范围，能继续时返回续接点，并为不完整的计数加上标注。

它不得执行仓库代码、读取凭据、遍历无关目录或联系外部服务。不支持的语法和未完成的遍历要与零匹配分开报告。完整解析属于选定文章的撰写阶段；如果某个结构性事实需要真正的解析器，请使用 [代码抽取](../../architecture/knowledge/code-extraction.md) 中介绍的内置抽取器。
<!-- /context:section -->

<!-- context:section id="writing" -->
### 撰写指引

开工报告确认后（参见 [确认开工报告](../planning-and-production/start-reports.md)），Agent 会阅读每篇文章所需的源码。引导它讲解契约、状态变化、失败行为和集成点——模块负责什么、如何进入、交出什么。解析可以定位声明，但不能证明运行时行为。保留表达式原样而不执行项目代码，把声明的默认值与实现的默认值分开，并写明未知之处。

Indexer 可以为路由组或组件这类功能类别建议一套重复使用的大纲，但不能规定固定的页数：组件手册可能需要逐个组件阅读，而每个符号一页或为大模块写一个大杂烩页面都是错误的。每个小节引用的真实源码区域最多来自三个不同文件，总计最多八个区域；如果一段讲解需要不同的证据，就把它拆开。
<!-- /context:section -->

<!-- context:section id="example" -->
### 示例结构

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
### 测试

用匿名测试夹具测试所支持的技术：功能发现、有限停止、不支持的输入、不同路径中的重名，以及最终文章中的引用。对于生成的 API 讲解，除了辅助工具的输出，还要在最终页面中检查默认值、共享类型和未解析的跨文件链接。使用与该技术相关的测试夹具，而不是一组互不相关的技术栈矩阵。

验证打包后的相对链接和可执行的辅助工具，并确保示例不包含特定组织的服务；组织知识应放在它们自己的 Skill 中。
<!-- /context:section -->

<!-- context:section id="documents" -->
## 文档类 Indexer

文档 Indexer 帮助 Agent 解读某一类已采集的文档——设计评审、运维手册、API 规范、产品需求——并把它们转化为围绕读者问题而非来源文件组织的文章。笔记和会话摘要有各自的 Indexer，但可以支撑相同的读者主题。
<!-- /context:section -->

<!-- context:section id="sources" -->
### 从已采集的来源开始

Indexer 处理的是已授权、已采集的文档。采集证明的是哪些内容可用，而不是它们的含义；标题、小标题和文件名只是导航辅助，不能证明正文已被阅读。

它不得自行抓取新文档、跟随外部链接或扩大来源授权。缺失的材料通过当前任务申请，不可用的来源与无关的来源要区分开。
<!-- /context:section -->

<!-- context:section id="planning" -->
### 依据大纲规划

对每份文档，Agent 会拿到标题、简短的引言和完整的 H2/H3 大纲，以及已有文章的标题、描述和引用。只有在读者问题、分组或权威性不明确时，它才会进一步阅读——某一节或整份文档。提出计划之前并不要求全文阅读每份文档。

引导分组：

- 当某篇已有文章（包括最初从代码中发现的主题）为同一受众回答同一问题时，复用它。
- 让文档中的业务定义修正机械生成的代码主题名称，而不是把文档硬塞到代码目录下。
- 拆分不同的读者任务或生命周期；合并回答同一任务的来源。像“运维”这样宽泛的共用标签，并不意味着其下所有流程都要合并成一篇摘要。
- 文件数和标题数都不决定文章数。一份文档可以支撑多篇文章，多份文档也可以支撑一篇文章。

年代、归档位置和文字是否精炼，既不能证明权威性，也不能证明无关；要比较实质内容、受众和适用范围。第一版计划会展示在开工报告中，并在批量撰写之前等待你的反馈，全托管模式下也是如此；参见 [确认开工报告](../planning-and-production/start-reports.md)。
<!-- /context:section -->

<!-- context:section id="doc-writing" -->
### 撰写与修复

撰写之前，Agent 会阅读每篇文章所需的实际段落，并把权威规则、示例、决定和提议区分开——会议纪要中的一条建议并不是已实现的行为。每个小节引用的真实来源区域最多来自三个不同文件，总计最多八个区域；Agent 判断证据是否支撑讲解。局部问题在受影响的小节处修复，已完成的文章可以直接提交，无需等待同一批次的其余文章。

修订会保持文章和小节的标识稳定，并保留有用的步骤、示例、图片和限制。不要虚增页数，不要每个标题写一页，也不要把缺失的证据变成推测性的文字。
<!-- /context:section -->

<!-- context:section id="visuals" -->
### 图片、表格和图表

Agent 只读取文档附带的已授权图片，在可用时优先使用结构化的白板或表格数据；只有当每个标签、数值和脚注都能完整保留时，才会把清晰的流程图、时序图、状态图或关系图转换为 Mermaid，或把表格转换为 Markdown。截图、照片以及以外观本身为信息的设计稿会保留原件，无法可靠读取的内容也是如此。它绝不猜测关系或数字。文档 Indexer 可以针对其文档类别中常见的图表补充指引。
<!-- /context:section -->

<!-- context:section id="doc-example" -->
### 示例结构

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

<!-- context:section id="doc-tests" -->
### 测试

覆盖该 Skill 声称支持的文档形式：普通的一对一文章、综合多份文档的文章、复用已有主题、小节修复、来源行变化、链接和图片，以及材料缺失。既要检查对来源的忠实度，也要检查最终页面；保持示例匿名，并验证打包后的链接。

创建流程参见 [创建 Indexer](creating-an-indexer.md)，同时使用多个 Skill 参见 [选择、替换与停用 Indexer](providers-and-customization.md)。
<!-- /context:section -->
