---
title: 技能清单
description: Context Agent 插件中的全部 Skill——由谁启动、何时激活、交给谁继续，以及各宿主中的写法。
translation:
  locale: zh-CN
  artifact_ref: 5adb572a-fc06-4bb9-a0aa-944b7c1dc1bb
  source_digest: 255eab2c8cade551134a4a1cb7477edfc99438a6d62d7b59bb31f76c88a4f9e3
  translated_at: 2026-10-12T20:29:53.422Z
  source_parts:
    title: 66d0f523a379b2de6f8d5fba3a817ebc395f7bcaa54cc132ca9dfa665d1e9378
    description: defe298cdb44a1f68b0851cffa7328624ee645183b2b6e1b7fbed611561eb087
    order:
      - goal
      - entries
      - authoring
      - indexers
      - hosts
    sections:
      goal: fc5d1a02843783b06c2359edad073bbe34c7b86734486eead776bee9c6f097c0
      entries: 9434472134fe79576c60a8bf5a79128815cfb47bf65cf438bcfb5e5b9fd3599c
      authoring: 02cff3d1b875b8560ec89d059bcfb9a7a8fae5474be1379a21d9642fe952ddb6
      indexers: 53cf83b60413a4278d2958382ae39a3d159486df12378364e8569a07b18a73a3
      hosts: b3cde3437b0c35891c48515bba4f1f934093d131c44982eb8528d45872d46915
    exterior:
      '[null,"goal"]': 794d50f79bd6daaadd007491d12ee219532cc7f2406ecfb84eebd8aec0a58f33
      '["goal","entries"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["entries","authoring"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["authoring","indexers"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["indexers","hosts"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["hosts",null]': e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
---

# 技能清单

<!-- context:section id="goal" -->
Context Agent 插件包含九个 Skill。其中四个是由你调用的**入口**，一个是用自然语言启动的**创作助手**，另外四个是由工作流选用的 **Indexer**。它们都把知识工作区状态和生命周期决策交给 `context` CLI。面向初次使用者的简要介绍见[命令与技能](../../getting-started/commands-and-skills.md)。
<!-- /context:section -->

<!-- context:section id="entries" -->
## 入口

| Skill | 何时激活 | 作用 | 交给 |
| --- | --- | --- | --- |
| `context` | 你显式调用 Context，要求重新组织已有的知识地图或站点导航，或继续进行中的 Context 工作流以构建、检查、更新、恢复或打包知识 | 创建或继续 Context 知识工作区，并按照 CLI 的当前 Route 完成生产、审核、更新和构建 | CLI；每个阶段选用的 Indexer |
| `context-plan` | 你要求做项目规划或继续某个 `PLAN-*.md`，或某个已授权的 Context 任务涉及 30 份以上来源文档，或需要实质性调查至少两个仓库 | 在临时存储中调研，并在根目录写出 `PLAN-YYYYMMDD-topic.md` 供审核，然后逐个阶段运行项目 | `context`，由它执行每个阶段 |
| `context-inspect-search` | 你提出知识问题，或宿主或 Bot 配置把问题路由到这里 | 基于知识包或已批准的知识回答，并把答案追溯到来源；只读，不需要知识工作区 | 对于被接受的改进建议，交给 `context` |
| `context-repo-content` | 你要求创建、编辑或登记同一仓库中的文档和自编 Skill | 维护 `repo-content.yaml` 及其符号链接视图，在项目目录中只保留一份原件；绝不启动生产、构建、发布或提交 | — |

在普通的规划、设计或编码中，它们都不会自行启动。
<!-- /context:section -->

<!-- context:section id="authoring" -->
## 创作助手

| Skill | 何时激活 | 作用 |
| --- | --- | --- |
| `context-indexer-create` | 你明确要求为代码、文档、笔记或会话摘要创建新的 Indexer Skill | 把一个可复用的 Skill 写入你选择的目录；不会初始化知识工作区，也不会启动生产。它没有菜单命令——用自然语言提出即可。参见[创建 Indexer](../../../sop/custom-indexers/creating-an-indexer.md)。 |
<!-- /context:section -->

<!-- context:section id="indexers" -->
## Indexer

| Skill | 解读对象 | 选用时机 |
| --- | --- | --- |
| `context-code-indexer` | 已授权模块的代码骨架，用于撰写基于来源的文章 | 用于当前的规划或写作任务——不作为独立的仓库审计 |
| `context-markdown-indexer` | 已采集文档的大纲 | 用于当前已授权的规划或写作任务——不作为导入工作流 |
| `context-note-indexer` | 已保存的笔记、摘录和观察记录 | 当前已授权的任务选用它时——不用于导入来源或扫描对话历史 |
| `context-sessions-indexer` | 已保存的对话摘要 | 当前已授权的任务选用它时——限制与笔记相同 |

安装某个 Indexer 只是让它可被发现，并不会在每个知识工作区中启用：Agent 根据当前的来源和需求选择 Indexer，CLI 提供任务目录并检查每一处来源引用。Indexer 安装时不带插件命名空间，因此在每个宿主中名称都相同。参见[社区 Indexer](../../../sop/custom-indexers/community-indexers.md)。
<!-- /context:section -->

<!-- context:section id="hosts" -->
## 各宿主中的写法

| 宿主 | 入口 |
| --- | --- |
| Claude Code | `/c4a:context`、`/c4a:context-plan`、`/c4a:context-inspect-search`、`/c4a:context-repo-content` |
| Cursor | `/c4a-context`、`/c4a-context-plan`、`/c4a-context-inspect-search`、`/c4a-context-repo-content` |
| Codex | 按名称调用的 Skill：`context`、`context-plan`、`context-inspect-search`、`context-repo-content` |

通过 `context plugin install --local` 只安装到单个仓库时，没有插件命名空间；宿主会在该仓库自己的目录中发现这些入口。安装或更新插件后，请重启 Agent 会话。
<!-- /context:section -->
