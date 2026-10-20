---
title: Source Graph 是什么
description: Context Source Graph 是什么、为 AI Agent 读代码解决什么问题、为什么它对 Context
  用户是可选的、什么时候值得接入，以及如何从在线演示或你自己的实例开始。
translation:
  locale: zh-CN
  artifact_ref: 21b1ee4b-5485-4486-8e5c-60598d6e8dea
  source_digest: 806f00e1da838dccb988a3f5da9e69aab9beaae6b36e36e41b42f4bc93530832
  translated_at: 2026-10-20T06:16:49.422Z
---

# Source Graph 是什么

<!-- context:section id="purpose" -->
**Context Source Graph 让人、脚本和 AI Agent 无需克隆仓库，就能在确定的 Git 提交上搜索和阅读代码。** 结果来自预先建好的索引，毫秒级返回；每个结果都标明读取所用的提交，同一个问题总能拿到同样的证据。

它开源、可自托管。公开的只读 [在线演示](https://context4ai.org/sourcegraph/) 索引了 `context4ai/context` 和 `context4ai/sourcegraph`。本节的指南介绍如何接入实例、如何与 Context 配合使用，以及面向管理员的登记仓库、自托管、安全保护和运维。
<!-- /context:section -->

<!-- context:section id="problem" -->
## 它解决什么问题

Agent 回答代码问题时，通常只需要少量确切的代码行，而不是整个仓库。它的工作是针对并未检出的代码，进行很多轮小而精确的“先搜索、再阅读”。把每个仓库都按正确版本克隆到每个 Agent 沙箱里很慢；在检出目录上运行 `rg` 或 `git grep`，每次调用又要把同样的内容完整扫描一遍。

Source Graph 把这部分工作挪到提问之前：它在后台为每个已登记仓库保持镜像和索引，查询读取的是预先建好的索引，而不是扫描工作树。仓库越大，差距越明显。
<!-- /context:section -->

<!-- context:section id="what" -->
## 你能得到什么

- **快速搜索。** 服务端的索引搜索通常在 5 ms 内完成；与调用方部署在同一区域时，含网络在内的完整请求也远低于 100 ms。在演示实例上，一次在本地检出目录里 `rg` 约需 61 ms 的字面量搜索，大约 1 ms 就能返回。速度从何而来，见 [固定版本的搜索与阅读](../../architecture/source-graph/pinned-search-and-reads.md)。
- **可复现的读取。** 分支和标签在读取任何内容之前都先解析为一个提交，因此搜索命中、它指向的文件和之后的差异，描述的是同一个快照。
- **为 Agent 而生。** 同样的操作（列出仓库、搜索、读取一段或多段代码、列出目录、比较两个提交）在网站、HTTP API、MCP 服务器和命令行客户端上都可用。任何支持 Streamable HTTP 的 MCP 客户端都能接入；匿名访问为只读，且仅限公开仓库。
- **占用小。** 一个进程同时管理 Git 镜像、搜索引擎和后台建索引。默认数据库为 SQLite，也支持 PostgreSQL 和 MongoDB。
<!-- /context:section -->

<!-- context:section id="context" -->
## Context 用户需要它吗？

不需要：Source Graph 对 Context 是**可选的**。当你的 Agent 根据 Context 知识作答时，它可以对照原始代码确认答案，方式有两种：在本地读取，即对所引用的提交做浅层的部分克隆；或者在接入了 Source Graph 时，在该提交上远程读取，无需等待克隆。接入后，Agent 每读取一个知识页面，还能同时拿到每个章节的写作来源。如何开启以及能得到什么，见 [远程读取代码证据](../querying-knowledge/reading-code-evidence-remotely.md)。
<!-- /context:section -->

<!-- context:section id="when" -->
## 什么时候值得接入

当 Agent 或脚本经常需要本地没有的仓库代码、回答必须引用确切的提交，或者同一批仓库每天被反复查询时，就值得接入 Source Graph。对于你正在修改的代码，本地检出仍然更简单。

Source Graph 是一个在固定版本上做文本搜索与阅读的服务。每个实例在本地磁盘上持有自己的镜像和索引；扩容的方式是让多个实例分别负责互不重叠的仓库，而不是在同一份数据上运行多个副本。
<!-- /context:section -->

<!-- context:section id="start" -->
## 三步开始

1. **试用在线演示。** 打开 [https://context4ai.org/sourcegraph/](https://context4ai.org/sourcegraph/)，直接在浏览器中搜索和阅读代码，无需账号。
2. **接入你的 Agent。** 打开站点的 **Connect**（接入）页面，复制适用于你的 Agent 宿主的配置。MCP、HTTP、CLI 和凭据的用法见 [接入](connecting.md)。
3. **为自己的仓库运行实例。** 用 Docker 启动，配置 Google 或 GitHub 登录，第一个完成验证的用户会成为管理员并登记仓库。具体步骤见 [自托管](self-hosting.md) 和 [登记仓库](registering-repositories.md)。
<!-- /context:section -->

<!-- context:section id="next" -->
## 下一步

| 如果你想… | 阅读 |
| --- | --- |
| 接入你的 Agent、脚本或 CLI | [接入](connecting.md) |
| 让 Context 无需克隆即可读取所引用的代码 | [远程读取代码证据](../querying-knowledge/reading-code-evidence-remotely.md) |
| 添加仓库和 Monorepo 路径组 | [登记仓库](registering-repositories.md) |
| 部署并配置自己的实例 | [自托管](self-hosting.md) |
| 设置登录并决定谁可以读取 | [登录与准入](authentication-and-access-control.md) |
| 监控健康状态和任务，并修复常见错误 | [运维](operations.md) |
| 了解服务是如何构建的 | [架构概览](../../architecture/source-graph/overview.md) 和 [固定版本的搜索与阅读](../../architecture/source-graph/pinned-search-and-reads.md) |
| 查阅路由、工具、参数和设置 | [HTTP 与 MCP 接口](../../product/reference/source-graph/http-and-mcp.md)、[CLI](../../product/reference/source-graph/cli.md)、[搜索语法](../../product/reference/source-graph/query-syntax.md) 和 [配置](../../product/reference/source-graph/configuration.md) |
<!-- /context:section -->
