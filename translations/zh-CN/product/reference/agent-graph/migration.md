---
title: 版本迁移
description: 在 Agent Graph 0.1 到 0.3.0 的各个版本之间升级 Provider，并用导入器把现有的
  Skill、脚本集或依赖工作流转换为经过审查的 Provider。
translation:
  locale: zh-CN
  artifact_ref: 6a2cbadf-7325-4e5d-bf36-90738dc10226
  source_digest: 005807b13b5d4dd38f464cd139ab012d8b02e9a3e7c81aaa29db913414d1029d
  translated_at: 2026-10-12T20:29:53.422Z
  source_parts:
    title: cc149190687e0c3fcc7a9ee1c83d2da2a0dbbd63a897daeb4f217f8f5b79388b
    description: e9acbf3df3756679774dd83a236ae6063d3339e8a6f49b19fc5dea6195451ebe
    order:
      - releases
      - to-020
      - to-030
      - import-skill
      - import-other
      - review
    sections:
      releases: 2a4ad93aa978f3dd8e86acd21c8451a63f38d0585e44f1809f53ac5e7cdab3ce
      to-020: ba76a0f09bbdfc0fb14d6bddc808425b6a46bf33a1be7c0569379c2dee6142f4
      to-030: 564fc47b1734498d066d64fb0a7364097f0473124d12cdfd8fd099d3013b4fb4
      import-skill: 767d5239a61d9b7233ecc27f09e09fbb4e94e6525fb7bb9a88c9d687e8b68d17
      import-other: bec64123504cc442f958cf1cf551d4c99c5eeb04ba095eaeb77ea2f6b9d89d1e
      review: b19bd8894abf7192648186ea1efdb876d54b24ed0e54e5a65f064c6c26d16859
    exterior:
      '[null,"releases"]': ea537a45ea1b945738ab35268be5baf6ba841b03873fc0cddd86602bc3cc740d
      '["releases","to-020"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["to-020","to-030"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["to-030","import-skill"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["import-skill","import-other"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["import-other","review"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["review",null]': e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
---

# 版本迁移

<!-- context:section id="releases" -->
Agent Graph 尚处于 1.0 之前：`0.x` 版本可能会收紧某个字段或不变量，但会在文档中说明这一破坏性变更，并同步更新所有模板、示例和测试。Provider 自身的 `version` 与 `@c4a/agent-graph` 包的版本相互独立。

| 版本 | 对 Provider 作者的变化 |
| --- | --- |
| 0.1.0 | 初始的规范、SDK、CLI、schema、模板和示例 |
| 0.1.1 | 更严格的 Graph 校验和物化边界；显式的 Run 状态与恢复 |
| 0.2.0 | **破坏性变更。** Action 和 Gate 节点必须带有 `route.*` 形式的 `reasonCode`；Skill 绑定需要全部三个元数据字段；声明的 Code Catalog 是封闭集合 |
| 0.2.1 | Gate `resolutionAction`，它必须能够改变可观察的状态 |
| 0.2.2 | 只读的 Gate `inspectionAction`，与 resolution 计划分开暴露 |
| 0.2.3 | 当前会话的读取回执，以及 Route 资源上的 `readState` |
| 0.2.4 | 更新 Context 案例研究的文档与回放 |
| 0.2.5 | 把具有生命周期的证据建模为绑定修订号的普通 Facts |
| 0.2.6 | 面向会话授权 Route 的 Gate `delegated` 策略 |
| 0.2.7 | 宿主物化的资源，带有版本化的输入和输出 schema |
| 0.3.0 | **破坏性变更。** 资源标识拆分为三个相互独立的 v1 协议 |
| 0.3.1 | 脚手架、模板和示例声明 `compatibility.agentGraph: ^0.3.0`；补充了 0.3.0 Resource 迁移说明 |
<!-- /context:section -->

<!-- context:section id="to-020" -->
## 升级到 0.2.x

1. 为每个 Action 和 Gate 节点指定一个以 `route.` 开头的稳定 `reasonCode`。
2. 如果 Provider 声明了 `catalogs.codes`，把这些原因码全部添加为 `route-reason` 条目，否则校验会以 `route-reason-code-missing` 失败。
3. 更新每个已绑定的 Skill，声明全部三个字段：

```yaml
metadata:
  agent-graph: path:../../provider.yaml
  agent-graph.graph: release
  agent-graph.entry: default
```

4. 在把宿主切换到新运行时之前，校验每个 Provider。

之后的 0.2 版本都是增量式的：Gate 的 inspection 与 resolution Action、读取回执、委托策略和宿主物化的资源都需要主动启用。
<!-- /context:section -->

<!-- context:section id="to-030" -->
## 升级到 0.3.0

0.3.0 移除了带编号的资源标识 `agent-graph.resource.v1`、`agent-graph.resource.v2`、`agent-graph.resource-location.v1` 和 `agent-graph.resource-location.v2`；旧名称现在会以 `schema-invalid` 无法通过 schema 校验。请按描述符的实际用途替换：

| 之前 | 用途 | 之后 |
| --- | --- | --- |
| 带 `path` 的 `agent-graph.resource.v1` | 非 Markdown 文件（schema、模板、诊断） | `agent-graph.resource.file.v1` |
| 带 `materializer` 的 `agent-graph.resource.v1` | 命令或脚本上下文视图 | `agent-graph.resource.graph-action.v1` |
| `agent-graph.resource.v2` | 宿主物化的资源 | `agent-graph.resource.host-action.v1` |
| `agent-graph.resource-location.v1` | 解析后的文件或上下文视图位置 | `agent-graph.resource-location.file.v1` 或 `.graph-action.v1` |
| `agent-graph.resource-location.v2` | 解析后的 Host Action 位置 | `agent-graph.resource-location.host-action.v1` |

然后把 Provider 的 `compatibility.agentGraph` 提高到 `^0.3.0`，并运行 `agent-graph validate`；`examples/host-materialized-resource` 示例展示了一个 Host-action 资源。在 frontmatter 中带有 `id`、`kind` 和 `media-type` 的 Markdown 资源不受影响。读取 Route 资源的宿主应根据新的位置 schema 名称分支处理；Host Action 的输入输出 ABI 及其恢复规则保持不变。
<!-- /context:section -->

<!-- context:section id="import-skill" -->
## 导入现有 Skill

```bash
agent-graph init ./provider --id product-workflow
agent-graph import skill ../legacy-skill/SKILL.md --into ./provider --graph legacy-capability
agent-graph --manifest ./provider/provider.yaml validate
```

导入器会把整个 Skill 目录复制到 `skills/<graph>/`，在复制出的 `SKILL.md` 中添加 Provider、Graph 和 Entry 绑定，并创建一个 agent Action 和一个 Graph。原有说明会完整保留，不会被拆分成猜测出来的阶段，源 Skill 也保持不变。
<!-- /context:section -->

<!-- context:section id="import-other" -->
## 导入脚本和工作流

```bash
agent-graph import scripts ./inspect.sh ./package.sh --into ./provider --graph package-flow
agent-graph import workflow ./workflow.yaml --into ./provider
```

- **脚本**会变成一个顺序执行的 Graph。扩展名决定使用 Node、Bun、Python 还是 shell；effect 默认为 `write`，因为导入器无法知道哪些脚本是只读的或会影响外部。
- **工作流**使用一种紧凑的结构——`id` 加上 `steps`，每个步骤包含 `id`、`command`、`effect` 和 `dependsOn`。导入器在写入任何内容之前，会检查步骤结构、缺失的依赖、ID 冲突和环；然后把依赖转换为边（扇入使用 `join: all`），添加一个起始 Action，并在叶子节点之后添加一个 Terminal（终止节点），同时为每个步骤登记一个原因码。拓扑结构并不意味着并行执行。模板、表达式、密钥、矩阵和各厂商的重试策略都不会被解释。

每次导入都会在 `provider.yaml` 旁边的 `IMPORT_REPORT.md` 中追加一节，并拒绝替换已有的 Graph、Action、脚本目录或已复制的 Skill。报告列出了不能靠猜测的内容——effect、Outcome、恢复、Gate、资源以及由 Facts 支撑的完成。请把它当作编写检查清单，然后按你所在仓库的策略删除或归档。
<!-- /context:section -->

<!-- context:section id="review" -->
## 完善草稿

审查导入后的 Provider，确认：

- 哪些操作是独立的 Action；
- 哪些资源只被一个 Route 需要；
- 每个 Action 的 effect（`read`、`write`、`external`）；
- 人工 Gate，以及是否允许委托；
- 能证明成功的 Facts；
- `failed`、`partial`、`unverified` 及恢复转换；
- 重复工作的停止条件。

对于大型 Skill，请以小而可测试的步骤逐步修改：

1. 导入，但不修改源 Skill。
2. 校验生成的 Provider。
3. 为当前的正常路径添加一个 Graph 测试。
4. 把确定性的命令提取到 Action 文件中。
5. 把长篇的、特定于阶段的说明移到 Route 资源中。
6. 在信任记录下来的成功之前，先添加 Facts 和 `satisfiedBy`。
7. 添加显式的 Gate，以及失败和恢复 Outcome。
8. 如果工作可能重复，添加循环测试。
9. 构建并测试可迁移的产物包。
10. 只有在此之后，才用更轻量的绑定入口替换原来的 Skill。

并非每一段都应变成节点：节点是可独立执行、受 Gate 控制、可恢复或可测试的转换，其余内容仍作为 Resource。参见 [编写 Graph](../../../sop/agent-graph/authoring-graphs.md) 和 [测试与发布](../../../sop/agent-graph/testing-and-publishing.md)。
<!-- /context:section -->
