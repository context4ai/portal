---
title: 规范
description: "@c4a/agent-graph 0.3.1 所实现的 Agent Graph v1 协议的字段级参考，涵盖
  Provider、Skill 绑定、Graph、节点、Fact 检查、Gate、边、Action、Resource、Code
  Catalog、Outcome、Evaluation、Route、Run、测试与产物包。"
translation:
  locale: zh-CN
  artifact_ref: 1a8d06d5-bb91-453a-ac52-48ad4e4edc93
  source_digest: 6732ae9c2e36204a0524445224798d7be56b79bb9a2b1271d403eba57ec4e492
  translated_at: 2026-10-20T05:13:06.930Z
---

# 规范

<!-- context:section id="scope" -->
本页汇总 `@c4a/agent-graph@0.3.1` 所实现的 `agent-graph.*.v1` 协议。包内 `schemas/` 目录随附的 JSON Schema 是文件结构的规范依据；本页列出字段和行为规则。设计背后的考量见 [核心模型](../../../architecture/agent-graph/core-model.md)；分步用法见 [编写 Graph](../../../sop/agent-graph/authoring-graphs.md)。

| Schema 标识 | 对象 |
| --- | --- |
| `agent-graph.provider.v1` | Provider 清单 |
| `agent-graph.graph.v1` | Graph |
| `agent-graph.action.v1` | Action |
| `agent-graph.resource.file.v1`、`.graph-action.v1`、`.host-action.v1` | Resource 描述符 |
| `agent-graph.resource-location.file.v1`、`.graph-action.v1`、`.host-action.v1` | 已解析的 Resource 位置 |
| `agent-graph.resource-read-receipts.v1` | 当前会话的读取回执 |
| `agent-graph.host-action-result.v1` | 宿主物化结果 |
| `agent-graph.code-catalog.v1` | Code Catalog |
| `agent-graph.evaluation.v1`、`agent-graph.route.v1` | Evaluation 与 Route 输出 |
| `agent-graph.run.v1` | Run 文件 |
| `agent-graph.test.v1` | Graph 测试 |
| `agent-graph.bundle.v1` | 构建后的产物包清单 |
| `agent-graph.error.v1` | CLI 错误信封 |

所有 v1 对象都会拒绝未知字段，因此拼错的安全字段不会被悄悄忽略。
<!-- /context:section -->

<!-- context:section id="provider" -->
## Provider 与 Skill 绑定

```yaml
schema: agent-graph.provider.v1
id: company/release
version: 0.1.0
graphs: [graphs/release.yaml]
catalogs:
  codes: codes.yaml
compatibility:
  agentGraph: ^0.3.0
  node: ">=20"
```

| 字段 | 规则 |
| --- | --- |
| `id` | 标识 Provider；运行时标识由 Provider、Graph 和节点 ID 共同限定 |
| `version` | 该 Provider 的语义化版本，与 `@c4a/agent-graph` 包版本无关 |
| `graphs` | 相对于 Provider 根目录的路径；Graph 从不通过扫描发现 |
| `catalogs.codes` | 可选的 Code Catalog |
| `compatibility` | 支持的工具链（`agentGraph`）与 Node.js 版本范围 |

所有引用都必须位于 Provider 根目录内：不允许绝对路径，也不允许通过 `..` 或符号链接越界。多个 Provider 彼此隔离——不合并，也没有跨 Provider 的 Subgraph。源清单可以使用任意文件名；构建后的产物包使用 `provider.yaml` 加上生成的 `manifest.json`。

绑定的 Skill 需声明 `metadata.agent-graph`（相对于该 `SKILL.md` 的 `path:` 定位符，或由宿主解析的 `provider:` 定位符）、`agent-graph.graph` 和 `agent-graph.entry`。三者会一并校验，Agent 绝不能从文字描述中推断 Graph 或 Entry。
<!-- /context:section -->

<!-- context:section id="graph" -->
## Graph 与节点

Graph 包含 `id`、`entrypoints`（公开入口名 → 节点）、`nodes` 和 `edges`。拓扑是静态的：目标名称、日期、阶段 ID 和队列项都是 Facts，而不是生成出来的节点。每个 Graph 至少需要一个 Terminal（终止节点）；Terminal 没有出边，若到达的多个 Terminal 的 Outcome 相互冲突，则为 `terminal-outcome-ambiguous`，状态为 `error`。

| 类型 | 必填字段 | 含义 |
| --- | --- | --- |
| `action` | `action` | 可选择一个相对于 Provider 的 Action |
| `gate` | `gate` | 需要用户或会话授权来解决某个策略边界 |
| `subgraph` | `graph`、`entry` | 进入同一 Provider 中的另一个 Graph |
| `terminal` | `terminalOutcome` | 以明确的 Outcome 结束当前帧 |

| 通用字段 | 规则 |
| --- | --- |
| `description` | 简短的人类可读标签，绝不作为条件 |
| `reasonCode` | Action 和 Gate 节点必填；格式为 `route.<id>` |
| `priority` | 在同一可用性类别内为 Route 排序；绝不用于语义选择 |
| `join` | `all`（默认）要求所有入边；`any` 只需其中一条 |
| `requiresFacts` | 所有检查通过后，该节点才合法 |
| `satisfiedBy` | 无需重放即可证明 Action 或 Gate 已完成的 Facts |
| `resources.required`、`resources.recommended` | 随 Action 或 Gate 一同选中的 Resource |

Subgraph 和 Terminal 节点不能携带 Action 或 Gate 的 Resource，也不能携带满足规则。
<!-- /context:section -->

<!-- context:section id="facts" -->
## Fact 检查

```yaml
satisfiedBy:
  - path: artifact.digest
    exists: true
  - path: verification.state
    equals: passed
```

`path` 是以点分隔的查找路径，其中数字段用于索引数组（`items.0.digest`）。每项检查必须且只能包含 `exists` 或 `equals` 之一，值为标量 JSON 值。没有 JavaScript、模板、shell 或条件语言。

| 情形 | 结果 |
| --- | --- |
| `satisfiedBy` 匹配 | `completed`，即使没有 Run 记录 |
| 已记录 `completed`，但 `satisfiedBy` 不匹配 | `unverified` |
| 显式的 `unverified` 边 | 可以路由到恢复流程 |
| 对话中的声明 | 不产生任何 Fact |
<!-- /context:section -->

<!-- context:section id="gates" -->
## Gate

| 字段 | 规则 |
| --- | --- |
| `gate.id`、`gate.prompt` | Gate 标识和一个简短问题 |
| `gate.authority` | 可以解决该 Gate 的授权 |
| `gate.delegatable` | 仅当为 true 时，会话授权才能解决该 Gate |
| `inspectionAction` | 可选的 `effect: read` Action，用于准备证据；以 `gate.inspectionAction` 暴露，等待期间执行是安全的 |
| `resolutionAction` | 可选的 `write` 或 `external` Action，在确认后记录或应用决定；以 `gate.resolutionAction` 暴露 |
| `delegated.inspection` | `skip` 会在委托 Route 上隐藏检查步骤；要求已编写检查 Action |
| `delegated.resolutionAction` | 仅在委托 Route 上替换解决 Action；取值为 `write` 或 `external` |
| `delegated.resources` | 仅在委托 Route 上替换 Gate 的 Resource |

没有授权时，Route 为 `waiting-user`，`commandPlan` 为空；拥有可委托的授权时，Route 可执行，且带有 `resolution: session-authority`。授权存在于当前输入或 Run 中，绝不在 Provider 中，也绝不会满足 Facts。当 Route 仍需要用户时，宿主不得运行解决 Action。
<!-- /context:section -->

<!-- context:section id="edges" -->
## 边

每条边包含 `from`、`to`、可选的 `kind` 和可选的 `outcomes`（默认为 `[completed]`）。

| 类型 | 语义 |
| --- | --- |
| `flow` | 一般的控制转移 |
| `consumes` | 目标消费源节点产出的产物 |
| `requires` | 源节点是目标节点的合法前置条件 |
| `gatedBy` | 由 Gate 解决目标节点的策略边界；必须从 Gate 出发 |
| `repeat` | 匹配的 Outcome 会把 Action 或 Gate 重置为待处理 |

所有非 repeat 类型共享同一可达性规则；类型只记录因果意图。边不携带运行时值。非 repeat 边必须无环（否则为 `graph-flow-cycle`），`repeat` 的目标必须是 Action 或 Gate，Run 历史会保留之前的迭代。扇出和扇入表示可达性，而非并发。Subgraph 目标在同一 Provider 内静态解析；递归进入祖先 Graph 会被拒绝。
<!-- /context:section -->

<!-- context:section id="actions" -->
## Action

```yaml
schema: agent-graph.action.v1
id: inspect-package
runner: command
effect: read
command: npm pack --dry-run
cwd: workspace
```

| Runner | 字段 | Route 结果 |
| --- | --- | --- |
| `command` | `command` | 精确的 shell 命令 |
| `script` | `entry`、`runtime`、可选的 `args` | 运行时与已安装入口的绝对路径 |
| `agent` | `skill` | 作为必需文件 Resource 的 Skill |
| `host` | `handler` | 由宿主定义的 handler 标识 |

| 字段 | 规则 |
| --- | --- |
| `effect` | 必填：`read`、`write` 或 `external` |
| `cwd` | `workspace`（默认）或 `provider` |
| `inputSchema`、`outputSchema` | 会被打包；已安装位置在 Route 上暴露 |
| `files` | 需要打包的额外运行时文件 |

各 runner 字段互斥。位于独立目录中的 Skill 会把整个目录带入产物包；位于 Provider 根目录的 `SKILL.md` 只带上它自身。Agent Graph 只解析 Action，绝不隐式执行它们。
<!-- /context:section -->

<!-- context:section id="resources" -->
## Resource

| 协议 | 关键字段 | 行为 |
| --- | --- | --- |
| 静态文件 | Markdown frontmatter 中的 `id`、`kind`、`media-type`；或包含 `id`、`kind`、`mediaType`、`path` 的 `resource.file.v1` 描述符 | 类型为 `procedure`、`diagnostic`、`template`、`schema`、`skill`；通过绝对路径、媒体类型和内容摘要定位 |
| Graph action | `id`、`kind: context-view`、`mediaType`、`materializer` | 物化器必须是 `read` 类型的 command 或 script Action；只能通过 `resource materialize` 并配合选中它的 Route 修订号运行 |
| Host action | `id`、`kind`、`mediaType`、`materializer`、`input` | 物化器必须是 `read` 类型的 host Action，包含 `handler`、`inputSchema` 和 `outputSchema`，且每个 schema 都带有版本化的协议标识；在返回任何 Route 之前先校验输入 |

物化器会收到 `AGENT_GRAPH_PROVIDER_ROOT`、`AGENT_GRAPH_WORKSPACE`、`AGENT_GRAPH_REVISION` 和 `AGENT_GRAPH_INPUT`，以及最小化的继承环境，默认限制为 30 s、10 MiB stdout 和 1 MiB stderr。对于 host-action Resource，Agent Graph 根据 `{handler, input.schema, input.value}` 计算 `input_digest`；宿主返回 `agent-graph.host-action-result.v1`，其中包含相同的 handler 和摘要、适配器标识，以及 `inline` 或 `resource`（`ref` 加 `digest`）二者之一，由 `validateHostActionResult` 检查。

读取回执（`agent-graph.resource-read-receipts.v1`）的作用域是单个 Provider。静态回执匹配 ID 和摘要；动态回执匹配 ID 和选中它的 Route 修订号。每个 Route Resource 都会得到 `readState: current` 或 `read-required`。回执绝不影响评估，也绝不会持久化到 Run 中。
<!-- /context:section -->

<!-- context:section id="codes" -->
## Code Catalog

```yaml
schema: agent-graph.code-catalog.v1
codes:
  - code: route.release.inspect
    kind: route-reason
    summary: The release artifact still needs inspection.
    document: resources/release-checklist.md
```

`kind` 为 `route-reason` 或 `diagnostic`（后者可以添加 `severity`，包括 `info`）。`summary` 只是提示，绝不作为条件；`document` 是可选的静态 Resource。没有 Catalog 时，`reasonCode` 只做格式检查；有 Catalog 时，每个 Action 和 Gate 的 `reasonCode` 都必须解析到一个 `route-reason` 条目。
<!-- /context:section -->

<!-- context:section id="evaluation" -->
## Outcome、Evaluation 与 Route

Outcome 包括 `completed`、`partial`、`failed`、`unverified`、`skipped`、`pending`、`blocked` 和 `waiting-user`。它们互不为别名；`partial`、`unverified` 和 `skipped` 绝不会变成 `completed`。

| Evaluation 字段 | 内容 |
| --- | --- |
| `provider`、`graph`、`entry` | 标识 |
| `revision` | 对 Graph 在同一 Provider 内的依赖闭包、Facts、规范化后的 Outcome 和授权计算出的摘要 |
| `statusCode` | `actionable`、`waiting-user`、`blocked`、`complete` 或 `error` |
| `outcome` | 完成时的 Terminal Outcome |
| `primaryRoute`、`alternativeRoutes` | 一条主 Route 和至多三条备选 Route，每条包含 `routeId`、`node`、`reasonCode`、可选的 `hint` 和 `availability` |
| `diagnostics` | 精简的诊断 |

Evaluation 是只读且确定性的；Outcome 时间戳以及仅被无关 Graph 使用的文件都不会改变修订号（revision）。

Route（`agent-graph.route.v1`）携带 `revision` 和 `routeId`、Graph、节点和 `callPath`、`statusCode`、`reasonCode`、`hint`、`availability`、可选的 Gate 解决方式与 Gate Action、带有 effect 的 Action、`commandPlan` 或 handler、解析后的工作目录、必需与推荐的 Resource 位置（每个都保留完整的 file、Graph-action 或 Host-action 位置信封）及其 `readState`，以及 `afterAction: {evaluate: true, recordNode}`。Route ID 只有在仍然可用时才会被接受，修订号不匹配会在返回任何命令计划之前被拒绝。
<!-- /context:section -->

<!-- context:section id="run" -->
## Run、测试与产物包

Run（`agent-graph.run.v1`）是可选的、由宿主持有的记忆：包括 Provider、Graph、入口、可选的知识工作区、Facts、每个状态键的最新 Outcome、会话授权、只追加的编号事件和时间戳。检查点是不含授权的已校验副本；恢复会把它复制到显式指定的路径，清除授权并追加一条事件。不存在默认的状态目录。

Graph 测试（`agent-graph.test.v1`）声明 `state`（`facts`、`outcomes`、`authorities`）和 `expect` 断言，绝不执行 Action，也不调用模型；见 [测试与发布](../../../sop/agent-graph/testing-and-publishing.md)。

`build` 会校验所有可达内容，复制可达文件，写入规范化的 `provider.yaml` 以及包含 catalog、文件摘要、Graph 依赖索引和整体摘要的 `manifest.json`；它会排除测试，拒绝覆盖源文件，并拒绝任何包含源绝对路径的文件。加载产物包时，会拒绝摘要不匹配、文件缺失或多余、catalog 不完整、标识不匹配以及依赖索引不一致的情况。
<!-- /context:section -->

<!-- context:section id="compat" -->
## 兼容性

在 `@c4a/agent-graph` 达到 `1.0.0` 之前，v1 系列处于公开草案定稿阶段：`0.x` 版本可以收紧某个必填字段或不变量，但必须记录这一破坏性变更，并更新所有随附的模板、示例和测试。`0.2.0` 使 Action 和 Gate 的 `reasonCode` 成为必填，并用显式的 Graph 和 Entry 字段补全了 Skill 绑定；`0.3.0` 用相互独立的 file、Graph-action 和 Host-action 协议取代了带编号的 Resource 和 Resource Location 协议。`1.0.0` 之后，不兼容的语义需要新的 schema 版本，兼容的新增内容需要已定义的扩展点。宿主应根据 schema 标识、状态码、原因码和诊断码进行分支判断——绝不依据人类可读文本。各版本的变更见 [版本迁移](migration.md)。
<!-- /context:section -->
