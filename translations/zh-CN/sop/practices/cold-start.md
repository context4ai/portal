---
title: 知识库冷启
description: 来源很多、质量参差时如何启动一个知识库：先探索再登记，筛选并裁决来源，定好结构再写，附两个开场对话示例。
translation:
  locale: zh-CN
  artifact_ref: f211b25b-8b5f-4134-8d16-36aabef6dd0e
  source_digest: f01d17bdde36783ed41a3d6819ee1d53be6dfd3bc0c428a73cbba69118cea19e
  translated_at: 2026-10-14T10:25:47.577Z
---

# 知识库冷启

<!-- context:section id="goal" -->
第一个知识库很少从一份干净的来源清单开始。Wiki 上有成百上千篇文档，有的是最新的，有的已经好几年没动，有的只是周报，没人确定哪些还成立。把它们全部登记、直接要文章，得到的是一个庞大而参差的站点，噪声和知识一起被抄了进来。

更可行的做法是：**先筛来源，再定结构，最后写。** 本页的每一步都是你在第一次对话里让 Agent 去做的事；Agent 调研、汇报，并在写任何文章之前停下来等你决定。

```mermaid
flowchart LR
  explore["探索代码<br/>不登记"] --> screen["对照代码<br/>筛选文档"]
  screen --> decide["给每组来源下结论"]
  decide --> structure["确定一到三级目录<br/>和文章清单"]
  structure --> plan["你批准的 PLAN"]
  plan --> write["登记、采集、撰写"]
```
<!-- /context:section -->

<!-- context:section id="explore" -->
## 先探索，再登记

1. 先让 Agent 加载 Context Skill，知道要做的事和工作流怎么走。
2. 把代码仓库给它探索。只读 clone 就够了，这时还不需要登记或采集任何东西。
3. 再给它一批文档或一个 Wiki 范围，让它找出哪些文档和代码相关，并按相关性和更新时间筛选。
4. 范围清楚之后，再讨论结果应该长什么样：站点的一、二、三级目录，以及每篇文章放在哪里。

这样你就有了一份**来源**描述和一份**目标**描述，也就是输入什么、产出什么。这两份描述就是后续工作的提示词，看到结果后再调整。

超过 30 份文档或涉及两个以上代码仓库时，Agent 会进入[规划模式](../planning-and-production/planning-large-projects.md)：调研在临时目录里进行，`PLAN-*.md` 报告等你批准；超过 100 或 500 份时，它会先和你确认范围再继续。大型 Wiki 树见[飞书文档](../registering-sources/lark-documents.md)。
<!-- /context:section -->

<!-- context:section id="screen" -->
## 筛选并给每组来源下结论

让 Agent 用同样的维度评估每组来源：

| 维度 | 看什么 |
| --- | --- |
| 相关性 | 是否回答读者的问题，代码里有没有对应的模块、接口或配置？ |
| 读者适配 | 是否面向同样的读者、同样的适用范围？ |
| 权威性 | 是基准或正式文档，还是二手摘要、个人笔记、过程记录？ |
| 时效 | 最近什么时候更新？只是信号，不能单独定论。 |
| 可验证性 | 关键结论能否用代码或其他正式来源核对？ |
| 冲突 | 是否与基准文档或代码矛盾？如果矛盾，以谁为准、为什么？ |

每组来源给出一个结论：**采用**、**辅助**、**仅留证**、**排除**或**待确认**。排除的来源都列出理由，不会被悄悄丢掉。

日期、标题、归档位置和文字是否精致，都不能证明一份文档权威或已经过时。Agent 比较的是实质内容、目标读者和适用范围；旧的决策或做法也可能仍然回答读者的问题。如果你给出“近一两年有更新”这类筛选条件，要写明截止日期，并把例外说清楚，例如“顶层设计类除外”。
<!-- /context:section -->

<!-- context:section id="baseline" -->
## 指定基准，记录冲突

如果有一份文档是当前、权威的领域描述，直接说出来。在它覆盖的范围内，它优先。其他文档或代码与它不一致时，要求 Agent 记录裁决结论和理由，而不是让更新日期最新的那份自动胜出。

文章里同时保留历史做法和现行做法时，要写明各自的适用范围（版本、时期或区域），以及哪个替代了哪个，不要悄悄合并。
<!-- /context:section -->

<!-- context:section id="structure" -->
## 写之前先定结构

在写任何文章之前，先商定面向读者的结构：一、二、三级目录，以及每个目录下的文章清单。大项目写在 PLAN 里，小任务写在[开工报告](../planning-and-production/start-reports.md)里。如果已有站点的结构很好用，可以拿来当样板。

来源和成品分开。原文、图表和版本信息保留为证据；文章按读者任务组织。文章之间不要重叠：每篇回答自己的问题，通过链接关联其他文章，而不是一份原文对应一篇文章。
<!-- /context:section -->

<!-- context:section id="raw" -->
## 原始材料放在哪里

调研时，很自然会把原文收集到一个 `raw/` 目录，再用一份 YAML 记下文档链接。这是有用的证据清单，但不要让它变成第二套来源系统：

- 结论需要可追溯的材料，登记为 Context 来源并保留快照；
- 读者只需要跳转过去的内容，在 `imports.yaml` 里声明为[外部入口](../registering-sources/external-entrances.md)；
- `raw/` 目录只保留无法稳定采集、手工收集的证据，并标明来源、获取时间、版本、状态以及它替代了什么。

代码做到多深也是同样的思路：建立术语、位置和契约的索引，实现细节按需读取，见[写给 Agent 的知识](../../architecture/knowledge/knowledge-for-agents.md)。
<!-- /context:section -->

<!-- context:section id="case-business" -->
## 示例一：在工程知识库上补业务知识

某前端团队的知识库已有两百多篇工程文章，团队想从一个有几千个节点的文档空间里，补一层代码里看不出来的业务规则。开场这样说：

```text
Look at every document under the <area A>, <area B>, <onboarding> and <technical designs> subtrees of the
<space> document space and cross-check them against the 5 registered repositories. Keep only business
definitions, rules, processes and boundaries that cannot be read from the code.

Recency:
- skip documents not updated in 500 days, except top-level designs such as one-pagers, overviews and architecture guides;
- skip SOPs and conventions not updated in 365 days;
- always skip daily and weekly reports, surveys, tests, on-call notes, archives and templates.

Do not add repositories; use the code only to check the rules in the documents.
Write me a research plan first: the screening steps, the decision and destination for each document, the
relation to existing knowledge and how the directory should change. Do not start production before I approve it.
```

返回的 PLAN 记录了筛选漏斗：空间里有几千个节点，指定子树里有几百个，按标题、类型、更新时间、内容类型排除后不到两百个，几乎全部抓到全文并阅读。之后每篇文档被判定为*全文录入*（代码里看不出来的业务定义、规则或状态）、*只提关键规则*（技术方案或 SOP，只保留有代码佐证的结论或代码里缺失的约束）、*仅作索引*（导航页或内容已被覆盖，作为延伸阅读链接），或*排除*并写明理由。PLAN 还对照代码抽查了两条结论（其中一条“当前生效”口径在代码里的取法不同），把来源从原文到早期的 LLM 推断分了级，定下“冲突时以代码为准、注明旧说法”的规则，提出只改导航的目录调整方案，把工作拆成 7 个每阶段不超过 30 份来源的阶段，并列出需要决定的事项。回复：

```text
The directory proposal is fine, but keep the top-level name and split "events" and "incentives" at the
second level. For the threshold conflict, write both versions and mark it "to confirm with the business";
I will ask them. Leave the personal notes out for now. Run the rest as planned, and wait for my review after each stage.
```
<!-- /context:section -->

<!-- context:section id="case-domain" -->
## 示例二：从零搭建一个领域知识库

一个基础设施方向（这里以流量接入为例）需要一个知识库，首批面向 XXXX 业务的研发，后续还要支撑知识 Bot 和运维 Skill。来源包括几个新旧混杂的 Wiki 范围、项目里的运维文档、一个团队维护的 LLM Wiki、已安装的运维 Skill，以及散落在各处的基建背景。开场这样说：

```text
I want a knowledge base for traffic access. The first readers are XXXX business engineers; later it will
back a knowledge Bot, operations Skills and operations capabilities such as queries and attribution.

Sources:
- every article under wiki range A, including diagrams and embedded tables;
- range B is the focus; document C is the core and the latest baseline;
- weigh other documents by update date; where they conflict with C, C and the code win, with the reason recorded;
- the operations docs under docs/ in the project;
- the team's LLM Wiki is also a baseline; use it but keep references, it will be linked later;
- the first few XXXX business services and their repositories: <list>.

Requirements:
- do not repeat what installed operations Skills cover; write the glossary, key facts and preconditions and link the Skill;
- fill in infrastructure facts that are not tools (data centres, deployment architecture, network and compliance boundaries);
- keep articles orthogonal and link them to each other.

Research thoroughly: retrieve the originals and summarize the evidence, then propose topics, a three-level
structure and each article's content as a PLAN. I will review it before anything is written. Use <existing site> as a structural reference.
```

PLAN 里应该有：拉取的范围和数量；每份来源的角色，以及它与基准文档、代码、LLM Wiki 的关系和每处冲突的裁决理由；三级结构和文章清单，例如领域概览与术语、接入路径、基础设施与部署约束、首批服务目录、接入与排障手册；与运维 Skill 的边界；分阶段计划和待决定事项。回复：

```text
The structure is mostly fine. Do the service catalog for the first 3 services only and move the rest to a
later stage. The deployment architecture article must state the constraints it puts on XXXX business access,
not just the concepts. Organize troubleshooting by the problems users hit, not by source; give each guide its
preconditions, decision path and stop conditions, and leave the queries to the Skills. Where the LLM Wiki
conflicts with the baseline in two places, the baseline wins; note it in the articles.
```

批准后，各阶段按正常工作流执行，每个阶段都有自己的审核。让结果不跑偏的习惯见[最佳实践](best-practices.md)。
<!-- /context:section -->
