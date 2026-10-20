---
title: 远程读取代码证据
description: 让 Agent 通过 Source Graph 在固定的提交上读取被引用的知识和代码，并附上每个章节的来源，从而无需克隆就能对照原始代码核查答案。
translation:
  locale: zh-CN
  artifact_ref: 01b7ffc6-89eb-4581-980e-264943d58736
  source_digest: db143e9106c513111472c0d16688b02cc1a9b166bf57fdf44ef2d1630a5ee2a0
  translated_at: 2026-10-19T19:47:45.248Z
---

# 远程读取代码证据

<!-- context:section id="goal" -->
基于知识作答时，有时需要查看其背后的代码。把仓库克隆进每个 Agent 沙箱很慢；你的 Agent 可以改为通过只读代码服务 Source Graph，在知识所引用的那个提交上，同时读取知识工作区和源代码，并在读到的内容上附带每个章节的来源。

> **Source Graph 是可选的。** 你不必安装或配置它。没有它时，你的 Agent 仍会在本地读取代码来核查答案：它对被引用的提交做一次小规模的部分克隆，再在其中搜索。默认情况下，它只在连接了已授权的实例时才使用 Source Graph。
<!-- /context:section -->

<!-- context:section id="enable" -->
## 启用

1. **把你的 Agent 宿主连接到 Source Graph**，通过 MCP 连接，并把服务命名为 `context-sourcegraph`，以便查询 Skill 能找到它。[接入](../source-graph/connecting.md)介绍了 Connect 页面以及你可能需要的凭据。该实例必须覆盖知识工作区及其来源仓库；如果缺少某个仓库，参见[登记仓库](../source-graph/registering-repositories.md)。
2. **选择远程读取的严格程度。** 默认情况下，你的 Agent 会复用合适的本地材料，否则优先使用 Source Graph，再考虑本地检出。你也可以让它只通过 Source Graph 读取、即使失败也绝不克隆，或者只在本地读取、完全不使用服务。对话中的明确要求（例如“离线工作”）始终优先。该设置来自你的 Agent 宿主或 Bot 配置；[提问](asking-questions.md)把它和其他查询设置列在一起。

端点和凭据属于 Agent 宿主的配置，绝不放在 Skill 或知识本身中。Context 这一侧无需其他配置：证据插件已编译并随 CLI 一同发布。
<!-- /context:section -->

<!-- context:section id="read" -->
## 你能得到什么

- **在被引用的提交上核查答案。** 你的 Agent 在一个固定的提交上读取知识页面，然后只在每个来源记录的提交上读取决定答案的那些代码范围。知识的提交与每个来源的提交分开保存，两者都不会被更新的默认分支替代。
- **每个读到的页面都附带来源。** Agent 读到的每个知识页面，都会带回其各章节所依据的来源；在代码托管平台支持时以特定提交的链接形式给出，Agent 可以直接跳到代码。
- **没有克隆耗时。** Agent 的沙箱中不会检出任何内容。
<!-- /context:section -->

<!-- context:section id="limits" -->
## 工作原理与可能的问题

来源由可选的 **context-evidence** 插件提供。它是运行在 Source Graph 内部的一个小型只读 WebAssembly 模块，把知识页面的每个章节与其记录的来源关联起来。它不校验来源内容、不搜索代码、也不修改知识；列出的来源只说明某个陈述出自哪里，并不能证明本次回答重新读过该来源。插件的详细说明见[与 Context 协同](../../architecture/source-graph/evidence-for-context.md)。

当 Source Graph 或插件不可用时，你的 Agent 保留已读到的内容并继续。默认情况下它可能回退到本地读取；如果你要求只远程读取，它会对答案中受影响的部分加以限定说明，而不是克隆仓库。
<!-- /context:section -->

<!-- context:section id="next" -->
## 运行服务

登记仓库、monorepo 路径分组、自托管、认证和日常运维见其他 Source Graph 指南。可以从 [Source Graph 是什么](../source-graph/introduction.md) 开始。
<!-- /context:section -->
