---
title: Agent Graph 快速上手
description: 用最新版 CLI，在大约十分钟内创建、校验、测试、评估、路由、运行并构建一个入门 Agent Graph Provider。
translation:
  locale: zh-CN
  artifact_ref: 3eab390f-44a1-49e0-a4d5-317b4705b6b9
  source_digest: 4bd1d5343437b0e21c808904228a219b21d40e2f014a29656d860718d0b0559c
  translated_at: 2026-10-19T19:47:45.248Z
---

# Agent Graph 快速上手

<!-- context:section id="choose" -->
大约十分钟后，你会得到一个可运行的入门 Provider：它能通过校验和 Graph 测试，能为 Agent 的下一步返回 Route，会记录一次 Run，并能构建成可随你自己的包一起发布的可迁移产物包。

本教程适合新建 Skill 或工作流。执行这些命令只会创建一个 Provider 开发项目，本身不会接入任何 Skill，也不会改变 Agent 的工作方式。如果你要改进现有 Skill，或在产品中嵌入 Agent Graph，请先在 [Agent Graph 是什么](introduction.md) 中选择对应路径。

你需要 Node.js 20 或更高版本。每条命令都通过 `npx @c4a/agent-graph@latest` 运行最新版 CLI，因此无需事先安装任何东西。
<!-- /context:section -->

<!-- context:section id="init" -->
## 1. 创建 Provider

```bash
npx @c4a/agent-graph@latest init ./example-provider --id example-provider
cd example-provider
```

生成的项目是一个完整而最小的 Provider：

| 文件 | 说明 |
| --- | --- |
| `provider.yaml` | Provider 清单：ID、版本、Graph 列表和 Code Catalog |
| `graphs/main.yaml` | 一个 Graph，入口为 `default`，包含 Action 节点 `work` 和 Terminal（终止节点）`done` |
| `actions/work.yaml` | 一个 Agent Action（`runner: agent`、`effect: write`），绑定到下面的 Skill |
| `skills/getting-started/SKILL.md` | 一个轻量 Skill，其元数据绑定 Provider、Graph `main` 和 Entry `default` |
| `resources/procedure.md` | Route 要求 Agent 读取的流程 |
| `codes.yaml` | 声明原因码 `route.main.work` 的 Code Catalog |
| `tests/main.yaml` | 一个 Graph 测试，断言入门 Route 处于可执行状态 |

不会创建任何运行时目录。Run 文件存放在哪里由宿主决定；协议不预留任何目录。
<!-- /context:section -->

<!-- context:section id="validate" -->
## 2. 校验与测试

```bash
npx @c4a/agent-graph@latest validate --format json
npx @c4a/agent-graph@latest test tests --format json
```

校验会检查 JSON Schema、相对路径是否留在 Provider 内、ID 与引用、入口、显式的 Terminal、边的端点、Subgraph 调用、递归、动态资源物化器以及重复的身份标识。它从不执行 Action。对于入门项目，它报告 `"state":"valid"`，包含 1 个 Graph、2 个节点和 1 条边；测试运行报告 `"state":"passed","total":1,"failed":0`。
<!-- /context:section -->

<!-- context:section id="evaluate" -->
## 3. 找到当前 Route

```bash
npx @c4a/agent-graph@latest evaluate main --format json
```

Evaluation 包含一个稳定的 `statusCode`、一个 `revision` 摘要、一个 `primaryRoute`、精简的备选项和诊断。对于入门项目，主 Route 是 `work` 节点，带有 `reasonCode: route.main.work`、`availability: immediate` 以及目录提示 “The requested work is ready to perform.”。不会内联任何 Skill 或流程正文。

使用同一次 Evaluation 中的两个值来解析该 Route：

```bash
npx @c4a/agent-graph@latest route main <route-id> --revision <revision> --format json
```

Route 返回选中的节点及其调用路径、Action、一个空的 `commandPlan`（Agent Action 不运行命令）、必需的资源——Skill 和 `resources/procedure.md`，每项都以绝对文件路径给出，带有内容摘要和 `readState: read-required`——以及 `afterAction: {evaluate: true, recordNode: "main/work"}`。如果期间某个 Provider 文件或输入发生了变化，CLI 会拒绝这个过期的修订号（revision），而不是返回一个不匹配的计划。

由于 Skill 已经绑定了 Provider、Graph 和 Entry，仅凭 Skill 也能完成同样的 Evaluation：

```bash
npx @c4a/agent-graph@latest --skill ./skills/getting-started/SKILL.md evaluate --format json
```
<!-- /context:section -->

<!-- context:section id="run" -->
## 4. 用 Run 跟踪长任务

```bash
npx @c4a/agent-graph@latest run start main --state ./runtime/run.json --workspace "$PWD"
# ... the Agent reads the required resources and does the work ...
npx @c4a/agent-graph@latest run record main/work completed --state ./runtime/run.json
npx @c4a/agent-graph@latest run status --manifest ./provider.yaml --state ./runtime/run.json --format json
```

记录时使用 `afterAction.recordNode` 给出的确切键。`run record` 会提醒你，记录的 Outcome 并不能证明 Facts；`run status` 会再次评估：对于入门项目，它现在返回 `statusCode: complete` 和 `outcome: completed`。在真实的 Graph 中，历史上的 `completed` 不能覆盖缺失的 Fact 检查；下一次 Evaluation 可能会转向校验或恢复。见 [运行与恢复](../../architecture/agent-graph/runs-and-recovery.md)。
<!-- /context:section -->

<!-- context:section id="build" -->
## 5. 构建可迁移的产物包

```bash
npx @c4a/agent-graph@latest build ./dist/provider --format json
npx @c4a/agent-graph@latest --manifest ./dist/provider/manifest.json validate
```

产物包只包含可达的 Provider 文件、一个规范化的 `provider.yaml`，以及一个 `manifest.json`，其中记录每个文件的摘要、Graph 依赖索引和整体摘要。测试不会被打包，也不会写入源机器上的任何绝对路径，因此产物包可以随你自己的包一起分发。
<!-- /context:section -->

<!-- context:section id="next" -->
## 下一步

- 把入门项目扩展为带有 Facts、Gate、恢复和循环的真实工作流：[编写 Graph](authoring-graphs.md)。
- 在 CI 中覆盖每个分支并分发产物包：[测试与发布](testing-and-publishing.md)。
- 了解你刚才运行的内容背后的评估模型：[核心模型](../../architecture/agent-graph/core-model.md)。
- 浏览仓库 `examples/` 目录中可运行的模式，例如 `review-gate`、`facts-recovery`、`fact-driven-batch`、`monitoring-loop` 和 `subgraphs`。
<!-- /context:section -->
