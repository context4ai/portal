---
title: 支持
description: 在哪里提问、如何带上维护者需要的信息报告缺陷、哪些版本会得到修复，以及如何私下报告 Context 和 Agent Graph 的安全漏洞。
translation:
  locale: zh-CN
  artifact_ref: sha256:9d796e7c1ddbca5eadc0e9604bf8890eff78a8b2eb69cd4d3fa0883cabf07155
  source_digest: 94449ef09f2a9af54c08c2ea90179c33adfd499f558f65e2e9d6d52add164864
  translated_at: 2026-10-20T06:16:49.422Z
---

# 支持

<!-- context:section id="channels" -->
按需求选择渠道：

| 需求 | Context | Agent Graph |
| --- | --- | --- |
| 使用、集成或设计问题 | [Discussions](https://github.com/context4ai/context/discussions) | [Discussions](https://github.com/context4ai/agent-graph/discussions) |
| 可复现的缺陷 | [问题报告](https://github.com/context4ai/context/issues/new/choose) | [问题报告](https://github.com/context4ai/agent-graph/issues/new/choose) |
| 疑似安全漏洞 | [私下报告](https://github.com/context4ai/context/security/advisories/new) | [私下报告](https://github.com/context4ai/agent-graph/security/advisories/new) |

Agent Graph 的 Discussions 也接受尚不能落地的想法。两个项目都优先指向本站，答案往往已经在这里：安装检查见 [安装](../getting-started/installation.md)，查询知识见 [提问](../../sop/querying-knowledge/asking-questions.md)，另有 [常见问题](../../faq/context-faq.md)。
<!-- /context:section -->

<!-- context:section id="diagnose" -->
## 报告前先检查

- **安装。** `context --version` 和 `context plugin status` 用于确认 CLI 和宿主插件。如果入口存在但缺少 `context` 可执行文件，入口会指出需要执行的安装步骤。
- **工作流状态。** `context status --format json` 显示当前 Route、它的原因码和诊断信息。请从这个 Route 继续，而不是重复之前的命令。
- **追踪。** `context debug enable` 会在 `.tmp/context-runtime/debug/` 下记录知识工作区本地的追踪，`context debug export` 会生成可供查看的回放；参见 [CLI 命令](../reference/context/cli-commands.md)。
- **Agent Graph。** `npx @c4a/agent-graph validate --format json` 会加载整个 Provider，无副作用地返回结构化错误；Graph 测试无需宿主即可重放 Route，便于分享最小复现；参见 [测试与发布](../../sop/agent-graph/testing-and-publishing.md)。
<!-- /context:section -->

<!-- context:section id="bug-reports" -->
## 问题报告应包含什么

| Context | Agent Graph |
| --- | --- |
| Context 版本（`context --version`）和安装方式 | Agent Graph 版本 |
| Node.js 和 Bun 版本 | Node.js 和 Bun 版本 |
| Agent 宿主，例如 Claude Code、Codex 或 Cursor | |
| 你运行的命令或入口 | 你运行的命令 |
| 脱敏后的诊断输出 | 完整的错误输出，去掉密钥 |
| | 尽可能附上最小的 Provider 或 Graph |

不要把私有材料放进公开 Issue。对 Context，不要公开来源文档、审核载荷、凭证、私有路径或由私有知识工作区生成的知识；请把问题缩减为中性的内容。
<!-- /context:section -->

<!-- context:section id="security" -->
## 安全

不要为疑似漏洞开公开 Issue。两个项目都使用 GitHub 的私下漏洞报告（链接见上文）。请包含：

- 受影响的版本和组件；
- 复现步骤或概念验证；
- 安全影响；
- 建议的缓解措施（如有）；
- 该问题是否已在其他地方披露。

Context 的安全修复只针对最新发布的版本；Agent Graph 尚处于 1.0 之前，修复只针对最新发布的次版本系列，因此报告前最好先升级。Agent Graph 维护者力争在五个工作日内确认收到报告，验证后与报告者协调修复、披露时间和致谢。

适用范围包括不安全的文件访问、命令执行、路径穿越、凭证或来源泄露、授权与信任边界绕过、知识包和构建产物的完整性问题，以及 Context 的审核 Gate 绕过。漏洞可能存在于任何已发布的部分：CLI、SDK、提取器、插件、schema 或产物。一般问题和普通缺陷请使用 Discussions 或 Issues。
<!-- /context:section -->
