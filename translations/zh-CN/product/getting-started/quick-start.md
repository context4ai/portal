---
title: 快速开始
description: 创建 Context 知识工作区，登记一个仓库和一个文档目录，把第一批审核通过的页面构建成知识包和站点，并提出第一个问题。
translation:
  locale: zh-CN
  artifact_ref: a5f433c5-3840-4ddf-8306-59b6a59e4dac
  source_digest: 009c15daff6c7f07a9fe712a330f1f32cd6aaca5b1365d9b31ba43ba6042a67b
  translated_at: 2026-10-15T03:57:38.476Z
---

# 快速开始

<!-- context:section id="goal" -->
本教程把一个代码模块和一个本地文档目录整理成经过审核的知识包，并附带可浏览的站点。你用自然语言下达指令，Agent 执行工作流返回的命令，所以下面的示例只展示你要说的话。

请先完成[安装](installation.md)——包括 Node.js 20 和用于为新知识工作区安装依赖的 Bun——并重启 Agent 会话以加载插件。
<!-- /context:section -->

<!-- context:section id="init" -->
## 1. 创建知识工作区

告诉 Agent Context 知识工作区放在哪里、用来做什么：

```text
/c4a:context 请在 ./context 创建一个 Context 知识工作区，整理我们的组件库和产品文档。
读者是刚开始使用这个组件库的前端开发者。
```

Agent 会创建目录并安装依赖。得到的目录结构如下：

```text
context/
├── AGENTS.md       # 给 Agent 的使用说明
├── src/            # 来源、阶段和知识包声明
├── sources/        # 已登记的来源和采集到的证据
├── knowledge/      # 已审核的知识（目前为空）
├── dist/           # 构建后的知识包（Git 忽略）
└── .tmp/           # 运行状态和报告（Git 忽略）
```
<!-- /context:section -->

<!-- context:section id="register" -->
## 2. 指定来源

说明要用哪些材料，以及 Agent 应该跳过什么：

```text
代码请使用 ../component-lib，产品文档使用 ../docs。
已经废弃的 v1 文件夹就不纳入了。
```

Agent 会逐一登记每个边界。登记只记录范围内有哪些内容，并不决定要写什么。

对于 monorepo，挑出读者真正需要的包或服务即可。无关材料会浪费阅读时间和 token，但也不要仅因为文件名看起来旧就把它排除。

> 如果要为整个领域或业务开始建设复杂的知识库，请参阅[规划大型项目](../../sop/planning-and-production/planning-large-projects.md)。
<!-- /context:section -->

<!-- context:section id="plan" -->
## 3. 确认开工报告

Agent 会阅读有代表性的材料，就可能改变范围的问题向你确认，记录读者目标，然后给出一份**开工报告**，包括：

- 已确认的来源和范围；
- 将使用的 Indexer 技能；
- 预计产出的第一批页面，以及它们在站点中的位置。

在你批准报告之前，不会写入任何内容。如果计划不对，直接说要改什么——例如“合并两个 API 页面”或“增加一个故障排查页面”——Agent 会据此修订。
<!-- /context:section -->

<!-- context:section id="produce" -->
## 4. 让它写作，然后审核

批准后，Agent 逐页写作，引用精确到来源行，并提交检查覆盖度和过期输入。每个写作任务大约需要一分钟；Agent 会汇报进度和任务总数，你也可以随时要求本地预览。

写作完成后，你会收到一份审核报告，列出每个页面的标题、路径、摘要和内容。你可以批准、拒绝部分页面，或要求修订。批准的页面以 Markdown 形式落入 `knowledge/`；被拒绝或要求修订的页面回到写作环节。

```mermaid
flowchart LR
  write["Agent 写作页面"] --> review["你来审核"]
  review -->|"修订"| write
  review -->|"批准"| kn["knowledge/"]
  kn --> build["构建"]
  build --> kb["dist/component-kb/"]
  build --> site["dist/component-site/"]
```

**如果中途被打断**，可以先关闭对话，稍后在知识工作区中再次调用 `/c4a:context`。它会根据知识工作区记录的状态继续，而不是根据对话，因此不会重做任何工作。
<!-- /context:section -->

<!-- context:section id="build" -->
## 5. 构建知识包和站点

对于新的知识工作区，Agent 默认会建议两个产物，构建会同时产出：

- `dist/component-kb/`——供 Agent 安装和查询的知识包；
- `dist/component-site/`——供人阅读的静态文档站点，包含文章页面和本地搜索。

想查看站点时，可以说 *“在本地预览站点。”* 产物声明位于 `src/index.ts`；如果需要其他产物，参见[知识包](../../sop/outputs-and-sites/knowledge-packages.md)。把知识工作区提交到 Git，以便之后检查、做版本管理和刷新。
<!-- /context:section -->

<!-- context:section id="ask" -->
## 6. 提出第一个问题

马上试用新知识：

```text
/c4a:context-inspect-search Button 组件是如何处理加载状态的？请引用代码。
```

回答会引用已批准的页面及其背后的来源行。回答中暴露的缺口很适合作为下一轮的内容：告诉 `/c4a:context` 缺了什么。
<!-- /context:section -->

<!-- context:section id="next" -->
## 下一步

- 代码或文档变化时，告诉 `/c4a:context` 改了什么；它只会重新打开受影响的页面。
- 范围更大时，请阅读[复杂任务](large-projects.md)。
- 所有可调用的入口，以及会自行运行的 Skill，见[命令与技能](commands-and-skills.md)。
<!-- /context:section -->
