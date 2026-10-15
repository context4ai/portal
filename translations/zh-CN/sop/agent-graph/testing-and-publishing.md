---
title: 测试与发布
description: 为每个重要的 Route 编写确定性的 Graph 测试，在 CI 中运行校验和测试，构建可复现的产物包，并随你自己的包一起发布。
translation:
  locale: zh-CN
  artifact_ref: cde7ef93-fa8b-4b5d-95e8-40164f98bb61
  source_digest: 06d0bfecead43126560082e9a3f018337f2d25f50772eaae33e55560afae542e
  translated_at: 2026-10-12T18:13:07.981Z
---

# 测试与发布

<!-- context:section id="tests" -->
Graph 测试提供一个状态——`facts`、`outcomes` 和 `authorities`——并断言 Evaluation 和 Route 应有的结果。它从不执行命令，也不调用模型，因此快速、确定，在 CI 中运行也很安全。

```yaml
schema: agent-graph.test.v1
name: claimed publication without a URL is checked
graph: report
entry: default
state:
  facts:
    report: { digest: "sha256:abc", approved: true }
  outcomes:
    report/publish: completed
expect:
  statusCode: actionable
  primaryNode: check-publication
```

Outcome 的键使用与 `afterAction.recordNode` 相同的 `<graph>/<node>` 形式。

| 断言分组 | `expect` 字段 |
| --- | --- |
| 状态与选择 | `statusCode`、`primaryNode`、`primaryReasonCode`、`alternativeNodes`、`availability`、`outcome` |
| Route 执行什么 | `command`、`handler`、`recordNode` |
| Route 加载什么 | `requiredResources`、`recommendedResources` |
| Gate | `gateResolution`、`inspectionCommand`、`inspectionHandler`、`inspectionSkill`、`inspectionInputSchema`、`resolutionCommand`、`resolutionHandler`、`resolutionSkill`、`resolutionInputSchema` |
| 诊断 | `diagnosticsInclude` |

针对 schema 字段和代码做断言，永远不要针对人类可读的描述。
<!-- /context:section -->

<!-- context:section id="matrix" -->
## 需要覆盖什么

对每个生产环境的 Graph，为以下情况各写一个用例：

- 初始 Route 及其稳定的原因码；
- 每个分支 Outcome；
- 用户 Gate 和显式委托的 Gate；
- 缺失必需的 Facts；
- 由 Facts 支撑的完成，以及声称完成却无证据（`unverified`）；
- 批次部分完成和失败后的恢复；
- 用到时的 `join: all` 和 `join: any`；
- 重复继续与终止停止；
- Subgraph 子 Route 与父级继续；
- 多个 Route 同时合法时的主选与备选排序；
- 每个预期会阻止执行的诊断。

[编写 Graph](authoring-graphs.md) 中的周报 Graph 需要七个用例才能达到这一标准：

| 用例 | 状态 | 预期 |
| --- | --- | --- |
| 新的一周 | 无 | `actionable`、`draft`、`route.report.draft` |
| 循环 | `report/draft: partial` | `actionable`，再次 `draft` |
| 已观察到草稿 | `report.digest` | `waiting-user`、`approve`、`gateResolution: user` |
| 已委托 | `report.digest`，授权 `report.publish` | `actionable`、`approve`、`gateResolution: session-authority` |
| 已批准 | `report.digest`、`report.approved: true` | `actionable`、`publish` |
| 发布未经证实 | 已批准，`report/publish: completed`，无 URL | `actionable`、`check-publication` |
| 完成 | 已批准，`publication.url` | `complete`、`outcome: completed` |

如果 Provider 使用动态或宿主生成的 Resource，还要覆盖：三种资源协议并存、分发前拒绝错误的宿主输入、内联结果与托管资源结果、handler 或 schema 不匹配、过期的修订号，以及已持久化结果的恢复。
<!-- /context:section -->

<!-- context:section id="ci" -->
## 在 CI 中运行

```bash
npx @c4a/agent-graph@0.3.0 --manifest provider.yaml validate
npx @c4a/agent-graph@0.3.0 --manifest provider.yaml test tests
npx @c4a/agent-graph@0.3.0 --manifest provider.yaml build dist/provider
npx @c4a/agent-graph@0.3.0 --manifest dist/provider/manifest.json validate
```

固定版本号，以保证自动化可复现。失败时以非零状态退出；加上 `--format json` 时会输出 `agent-graph.error.v1` 信封，请根据 `error.code` 分支处理。编写过程中常见的代码：

| 代码 | 原因 |
| --- | --- |
| `graph-flow-cycle` | 普通边形成了循环；请改用 `repeat` 边 |
| `route-reason-code-missing` | 节点的 `reasonCode` 未在 Code Catalog 中声明 |
| `test-path-missing` | 测试路径不存在——空路径或缺失的路径属于错误，而不是空洞的通过 |

校验还会单独捕获缺失的文件、重复的 ID、逃出 Provider 的路径、缺失的 Subgraph 入口、无效的重复目标以及递归。
<!-- /context:section -->

<!-- context:section id="bundle" -->
## 产物包

`build` 会加载并校验所有可达内容，然后只复制运行时需要的部分：Graph、被引用的 Action 及其入口、schema 和声明的 `files`、被引用 Skill 所在的目录、静态和动态 Resource 定义及其内容、物化器 Action，以及 Code Catalog 及其文档。测试和无关文件不会被包含。

`manifest.json` 记录每个文件的摘要、目录（catalog）、同一 Provider 内的 Graph 依赖索引以及整体摘要。它不含时间戳，因此输入不变时摘要也不变——把周报 Provider 构建两次，会得到完全相同的 `sha256:` 摘要。构建器拒绝覆盖被引用的源文件，并拒绝任何包含源 Provider 绝对路径的文件。加载产物包时会校验整体摘要和逐文件摘要、Provider 标识，并确认没有缺失或多余的可达文件。
<!-- /context:section -->

<!-- context:section id="ship" -->
## 发布

Provider 项目通常依赖 `@c4a/agent-graph`，并把构建好的产物包放进自己的包中发布——插件、CLI 或产品。也可以把 CLI 的单文件 `dist/agent-graph.mjs` 复制到产物包旁边，作为免安装的入口；该文件在 Node.js 20+ 上即可校验和路由，它是同一份实现，而不是第二套实现。

无论以何种方式安装——从源码、链接、打包的 tarball 还是 registry——Provider 都应返回相同的 Graph、Action 和 Resource 标识。只有绝对的 `filePath` 值会不同；只要相关定义或输入发生变化，Route ID 就会改变。

发布前请检查：

1. 测试、fixture 或产物包中都不包含凭据、业务数据或特定于机器的路径；
2. 构建得到的摘要与已安装的文件一致；
3. `path:` Skill 绑定在迁移后仍能解析，`provider:` 绑定能通过干净的 registry 解析；
4. 动态视图物化只写入显式指定的缓存；
5. 宿主生成的 Resource 从不在 Agent Graph 内部执行，其结果能经受序列化和恢复校验。
<!-- /context:section -->

<!-- context:section id="security" -->
## 安全边界

校验证明的是结构，而不是安全性。Provider 作者以及安装它们的宿主，必须把 Action 的命令、effect、脚本和资源当作可执行的供应链内容来审查。`effect: read` 只是一种声明，不是沙箱；`external` effect 通常应放在显式的 Gate 或产品策略之后。具体命令和 SDK 函数见 [CLI 与 SDK](../../product/reference/agent-graph/cli-and-sdk.md)。
<!-- /context:section -->
