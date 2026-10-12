---
title: 参与贡献
description: 如何为 Context 或 Agent Graph 提出、构建、验证和提交改动，以及文档问题应该在哪里修正。
translation:
  locale: zh-CN
  artifact_ref: sha256:72f512c94144d0b098315550139d8a361e49260daa79bac892cf4c7c0a4561a5
  source_digest: 9dd4ab4d413556768e092a7958c40dc6d0665973419b69fb93a51fa6f594b153
  translated_at: 2026-10-12T20:29:53.422Z
---

# 参与贡献

<!-- context:section id="overview" -->
Context 和 Agent Graph 都在 GitHub 上公开开发，仓库分别是 [context4ai/context](https://github.com/context4ai/context) 和 [context4ai/agent-graph](https://github.com/context4ai/agent-graph)。两个项目都欢迎问题报告、文档、测试和实现改动。常见的参与方式：

- **报告缺陷**：通过 issue 模板提交一个最小、已脱敏的复现。
- **改进文档**：本站由 [context4ai/portal](https://github.com/context4ai/portal) 构建；各包的参考文档放在各自项目的仓库中。
- **分享 Indexer**：教 Context 读取一种新的来源；参见[创建 Indexer](../../sop/custom-indexers/creating-an-indexer.md)和[社区 Indexer 一览](../../sop/custom-indexers/community-indexers.md)。
- **添加语言提取器**：放在 Context 的 `packages/extract-*` 下，遵循 `@c4a/extract` 协议。
- **提出 Agent Graph 协议变更或示例**：新人可先读[为什么是 Graph Engineering](../../architecture/agent-graph/why-graph-engineering.md)和[编写 Graph](../../sop/agent-graph/authoring-graphs.md)，再运行仓库中的 `getting-started` 示例。

两个项目的节奏相同：

1. 先搜索已有的 Issues 和 Discussions。
2. 凡是会改变公开契约的改动，先讨论再动手。小的文档修正和孤立的缺陷修复可以直接提交 pull request。
3. 用 Bun 开发，保证运行时代码在 Node.js 20 及以上版本可用，并运行项目的验证命令。
4. 提交聚焦的 pull request，说明问题、你选择的行为、兼容性影响以及如何验证。

不要在公开 Issue 中报告安全漏洞；私下报告的方式见[支持](support.md)。

| | Context | Agent Graph |
| --- | --- | --- |
| 需要先讨论 | 知识工作区协议、生命周期顺序、公开的 CLI JSON、知识包布局 | 协议变更、新增公开字段、兼容性行为 |
| 验证 | `bun run verify:full` | `bun run verify` |
| 开发指南 | `DEVELOPMENT.md` | `DEVELOPMENT.md` |
<!-- /context:section -->

<!-- context:section id="context" -->
## Context

```bash
git clone https://github.com/context4ai/context.git
cd context
bun install
bun run build
bun run verify
```

`bun run verify` 运行类型检查、lint 和默认测试；`verify:full` 还会运行仅在完整模式下执行的 CLI 测试和构建出的 Node 产物检查，因此要先构建。仓库中的 `DEVELOPMENT.md` 介绍仓库结构、运行本地 CLI 与插件、验证范围和发布。

满足以下条件的 pull request 即可进入审查：

- `bun run verify:full` 通过；
- 生命周期行为附带 Route 和恢复的测试覆盖；
- CLI 不替 Agent 或用户做语义判断；
- 测试使用中性的夹具，而不是具体业务内容；
- 英文和简体中文的用户文档描述的仍是同样的行为；
- 用户可见的改动在 `CHANGELOG.md` 的下一个版本下有对应条目；
- 不提交生成的 `dist/`、知识工作区数据、快照、凭证或私有来源材料。

提交信息使用英文 conventional commit 并写明目标版本，例如 `fix(v0.7.62): exempt More menu targets from knowledge map coverage`。维护者通过创建 tag 与包版本一致的 GitHub Release 来发版；发布工作流会验证所有包，并通过 npm Trusted Publishing 发布。
<!-- /context:section -->

<!-- context:section id="agent-graph" -->
## Agent Graph

```bash
git clone https://github.com/context4ai/agent-graph.git
cd agent-graph
bun install
bun run verify
```

`bun run verify` 运行类型检查、lint、测试和构建。设计或接入方面的问题、尚不能落地的想法，请发到 GitHub Discussions。`DEVELOPMENT.md` 介绍源码结构、协议规则、测试原则和发布审计。

满足以下条件的 pull request 即可进入审查：

- `bun run verify` 通过；
- 公开的 TypeScript 类型与 JSON Schema 一致；
- 协议行为有单元或集成测试覆盖，并且至少有一个已发布的示例覆盖新的协议行为；
- 英文和简体中文文档描述的仍是同样的行为；
- 运行时代码使用标准 Node.js API，而不是 Bun 专有 API；
- 不提交生成的 `dist/`、`.tmp/`、覆盖率报告或包归档文件。

提交信息使用英文的 conventional commit，可行时带上项目版本：

```text
feat(v0.3.0): add route inspection metadata
fix(v0.2.2): reject stale evaluation revisions
docs(v0.3.0): clarify provider adoption paths
```

维护者可能会要求修改，以保持协议的可移植性、行为的确定性或文档的一致。要端到端测试一个 Graph 改动，参见[测试与发布](../../sop/agent-graph/testing-and-publishing.md)。
<!-- /context:section -->

<!-- context:section id="docs" -->
## 修正本站文档

本站每篇文章末尾都列出了来源，并链接到撰写时依据的确切仓库修订。如果文章出错是因为它引用的文档或代码有误，请到对应仓库中修正。两个项目都要求英文和简体中文文档保持一致，所以请在同一个 pull request 中同时更新两种语言。

参与这两个项目都需遵守各自的行为准则（Code of Conduct）。
<!-- /context:section -->
