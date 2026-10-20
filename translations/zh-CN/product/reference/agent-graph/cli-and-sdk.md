---
title: CLI 与 SDK
description: "@c4a/agent-graph 0.3.1 中的全部 agent-graph 命令与选项、JSON
  错误信封与常见错误码，以及按职责分组的 SDK 函数。"
translation:
  locale: zh-CN
  artifact_ref: 86ec3c09-beb2-468a-b28a-60d7a5c8fcce
  source_digest: 3bbf502cdd7b2d789705d694db2af070a7489b8c2df3b2e6993cf7db85f88f4f
  translated_at: 2026-10-20T05:13:06.930Z
---

# CLI 与 SDK

<!-- context:section id="install" -->
`@c4a/agent-graph` 包（版本 0.3.1，需要 Node.js 20 或更高版本）提供一个 CLI 可执行文件 `agent-graph`、一个 ESM SDK，以及公开的 JSON Schema 和模板。所有调用方式运行的都是同一个打包好的 CLI：

```bash
agent-graph ...                    # installed binary
npx @c4a/agent-graph@0.3.1 ...     # npm one-shot
bunx @c4a/agent-graph@0.3.1 ...    # Bun one-shot
node ./agent-graph.mjs ...         # single file shipped beside a Provider bundle
```

| 全局选项 | 含义 |
| --- | --- |
| `-m, --manifest <path>` | 源 Provider 清单或构建后的 `manifest.json`；默认为 `provider.yaml` |
| `--skill <path>` | 从 Skill 的 `agent-graph*` 元数据中获取 Provider、Graph 和 Entry；与之冲突的显式 Graph 或 Entry 会被拒绝 |
| `--registry <path>` | 用于 `provider:` Skill 定位符的宿主注册表 |
| `--format human\|json` | 简洁的终端文本（默认），或面向 Agent 和自动化的单行 JSON |
| `-V, --version` | 打印 CLI 版本 |
<!-- /context:section -->

<!-- context:section id="authoring" -->
## 编写命令

| 命令 | 作用 |
| --- | --- |
| `init [directory] --id <id>` | 创建一个最小的 Provider：一个 agent Action、一个已绑定的 Skill、一个 procedure、一个 Code Catalog 和一个路由测试。拒绝替换任何将要生成的路径 |
| `import skill <SKILL.md> --into <root> [--graph <id>]` | 复制整个 Skill 目录，为副本添加相对绑定，创建 agent Action 和 Graph，将其追加到 Provider，并写入 `IMPORT_REPORT.md` |
| `import scripts <files...> --into <root> [--graph <id>]` | 根据脚本创建一个顺序执行的 Graph；运行时由扩展名推断，effect 默认为 `write` |
| `import workflow <yaml-or-json> --into <root> [--graph <id>]` | 将精简的 `steps` / `dependsOn` 工作流转换为边，默认 `join: all`；Gate、Facts 和恢复会作为缺口列在 `IMPORT_REPORT.md` 中 |

如何完善导入后的草稿，见 [版本迁移](migration.md)。
<!-- /context:section -->

<!-- context:section id="discovery" -->
## 校验与发现

| 命令 | 作用 |
| --- | --- |
| `validate` | 加载完整的可达 Provider，报告 `valid` 或结构化错误；无副作用 |
| `inspect provider` | 列出 Graph、入口、节点数、依赖、Action、Resource 和路径 |
| `inspect skill <SKILL.md>` | 显示绑定（定位符、Provider、`graph#entry`）和解析后的 Provider；对 `provider:` 需加上 `--registry` |
| `schema list` / `schema path <name>` / `schema extract <name> --output <path>` | 发现公开的 JSON Schema；即使是复制出来的单文件 CLI，`extract` 也能使用 |
| `code list` | 列出 Code Catalog（`route-reason` 和 `diagnostic` 条目） |
| `code locate <code>` | 返回代码、摘要和可选的文档位置，绝不返回文档正文 |
| `test [file-or-directory]` | 递归运行所有 YAML/JSON Graph 测试；任何失败都会设置非零退出码 |
| `build [output]` | 写入确定性的产物包，默认为 `dist/provider`；只有在不替换任何被引用源文件时，输出才可以位于源码树内 |
<!-- /context:section -->

<!-- context:section id="routing" -->
## 路由命令

`evaluate [graph]`（使用 `--skill` 时省略 `graph`）接受以下选项：

| 选项 | 含义 |
| --- | --- |
| `--entry <name>` | Entry 名称；默认为 `default` |
| `--state <run.json>` | 从 Run 中获取 Facts、Outcome 和授权 |
| `--facts '<json>'` 或 `--facts @file.json` | Facts，本次调用中合并覆盖 Run 中的值 |
| `--outcomes '<json>'` 或 `@file.json` | Outcome，例如 `'{"release/inspect":"completed"}'` |
| `--authority <id...>` | 会话授权 |

`route <graph> [route-id]`，或 `--skill <SKILL.md> route [route-id]`，接受相同的选项，另外还有：

| 选项 | 含义 |
| --- | --- |
| `--revision <digest>` | 上一次 Evaluation 的修订号（revision）；若已变化，则返回 `route-revision-stale` |
| `--resource-receipts '<json>'` 或 `@file.json` | 当前会话的读取回执，用于设置每个 Resource 的 `readState` |

不提供 `route-id` 时，解析当前的主 Route。不可用的 ID 返回 `route-stale`。Route 解析只定位文件，绝不运行命令或物化器；处于等待中的 Gate 会在空的 `commandPlan` 之外，分别暴露 `gate.inspectionAction` 和 `gate.resolutionAction`。
<!-- /context:section -->

<!-- context:section id="run" -->
## Run 命令

```text
run start <graph> --state <path> [--workspace <dir>]
run status --state <path>
run record <node-key> <outcome> --state <path> [--detail <json>]
run facts --state <path> --set <json> [--replace]
run authority --state <path> [--set <id...>]
run checkpoint --state <path> --to <path>
run resume <checkpoint> --state <path>
run events --state <path>
```

`run status` 会重新评估 Graph，因此同样需要 Provider 选项（`--manifest` 或 `--skill`）。`run record` 使用 `route.afterAction.recordNode` 中的精确键，例如 `main/work`。`run facts` 默认合并，使用 `--replace` 时替换。`run start`、`run checkpoint` 和 `run resume` 拒绝覆盖已存在的目标（`run-target-exists`）。见 [运行与恢复](../../../architecture/agent-graph/runs-and-recovery.md)。
<!-- /context:section -->

<!-- context:section id="resource" -->
## Resource 命令

| 命令 | 作用 |
| --- | --- |
| `resource locate <id-or-path>` | 返回已安装的静态文件及其摘要，或动态 Resource 的物化引用 |
| `resource materialize <id-or-path> --cache <dir> --revision <digest>` | 运行只读的 command 或 script 物化器，写入按内容寻址的输出以及一份回执 |

| `materialize` 选项 | 默认值 |
| --- | --- |
| `--workspace <dir>` | 当前目录 |
| `--input '<json>'` 或 `@file.json` | 无 |
| `--timeout-ms <ms>` | `30000` |
| `--max-output-bytes <bytes>` | `10485760` |
| `--max-error-bytes <bytes>` | `1048576` |

传入选中该视图的 Route 的修订号。host-action Resource 绝不会由 CLI 运行，而是返回 `materializer-host-required`。
<!-- /context:section -->

<!-- context:section id="errors" -->
## 错误

使用 `--format json` 时，失败信息输出到 stderr，并返回非零退出码：

```json
{
  "schema": "agent-graph.error.v1",
  "state": "error",
  "error": { "code": "route-stale", "message": "...", "diagnostics": [] }
}
```

请根据 `error.code` 和诊断码进行分支判断，绝不要依据消息文本。

| 领域 | 错误码 |
| --- | --- |
| 路由 | `route-revision-stale`、`route-stale`、`route-unavailable` |
| Graph 校验 | `graph-flow-cycle`、`graph-terminal-missing`、`graph-entry-missing`、`graph-edge-node-missing`、`graph-repeat-target-invalid`、`graph-gated-by-source-invalid`、`graph-recursion`、`terminal-outcome-ambiguous`、`route-reason-code-missing` |
| Gate | `gate-inspection-effect-invalid`、`gate-resolution-effect-invalid`、`gate-delegated-policy-invalid`、`gate-delegated-inspection-missing` |
| 路径与文件 | `path-outside-provider`、`path-symlink-outside-provider`、`absolute-path-forbidden`、`file-missing` |
| Skill 绑定 | `skill-binding-missing`、`skill-graph-missing`、`skill-entry-missing`、`skill-graph-conflict`、`skill-entry-conflict`、`provider-unresolved` |
| Run | `run-target-exists`、`run-provider-mismatch` |
| 物化 | `materializer-timeout`、`materializer-output-limit`、`materializer-error-limit`、`materializer-failed`、`materializer-host-required` |
| 宿主结果 | `host-action-handler-mismatch`、`host-action-input-stale`、`host-action-output-schema-mismatch` |
| 产物包 | `build-output-overlaps-source`、`build-absolute-path-leak`、`bundle-digest-mismatch`、`bundle-file-digest-mismatch`、`bundle-files-mismatch` |
| 测试 | `test-path-missing`、`test-cases-empty` |

评估问题会作为诊断出现在成功的 Evaluation 中，而不是以错误信封报告：例如 `required-fact-missing`（到达的节点被 `requiresFacts` 阻塞）、`no-route`（没有可执行或可到达的 Terminal），以及备选 Route 超过三条时给出的提示性诊断 `route-alternatives-truncated`。
<!-- /context:section -->

<!-- context:section id="sdk" -->
## SDK

```ts
import { evaluateGraph, loadProvider, resolveRoute, resolveSkillBinding } from "@c4a/agent-graph";
```

| 职责 | 函数 |
| --- | --- |
| Provider 发现 | `readSkillBinding`、`resolveSkillBinding`、`readProviderRegistry`、`loadProvider` |
| 路由 | `evaluateGraph`、`computeRevision`、`resolveRoute`、`nodeStateKey` |
| Resource 与代码 | `locateResource`、`materializeResource`、`locateCode`、`hostActionInputDigest`、`validateHostActionResult`、`hostActionOutputDigest`、`hostActionResourceReadReceipt` |
| 可选的 Run 文件 | `createRun`、`loadRun`、`recordOutcome`、`updateRunFacts`、`updateRunAuthorities`、`checkpointRun`、`resumeRun` |
| 编写 | `initProvider`、`importSkill`、`importScripts`、`importWorkflow` |
| 质量与发布 | `validateSchema`、`runGraphTests`、`buildProviderBundle`、`inspectProvider` |

评估和 Route 解析没有副作用；只有上面列出的编写、Run、构建和物化函数会写入文件。SDK 返回的路径会针对当前安装位置进行解析，而定义本身保持相对路径。`materializeResource` 接受 `timeoutMs`、`maxOutputBytes` 和 `maxErrorBytes`，受信任的宿主还可以通过 `env` 添加变量（Agent Graph 自身的变量优先）。错误是带有 `code` 和 `diagnostics` 的 `AgentGraphError` 实例。该包还导出了 `./schemas/*` 和 `./templates/*`。完整的宿主循环示例见 [技能与 Provider](../../../architecture/agent-graph/skills-and-providers.md)。
<!-- /context:section -->
