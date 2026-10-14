---
title: Source Graph 是什么
description: Context Source Graph 是什么、为 AI Agent 读代码解决什么问题、如何与 Context
translation:
  locale: zh-CN
  artifact_ref: 21b1ee4b-5485-4486-8e5c-60598d6e8dea
  source_digest: 88ed066d576af5836612d6712415480a8942c8ca2fdc3c7d90ea9b17a11e87b6
  translated_at: 2026-10-14T02:42:13.456Z
  source_parts:
    title: 931ffe75557588a0d1967e36e4cdcf0fbb3c1eeced8df5c1939fe3d2a61b15de
    description: 44497f4dd8f87ad8227b11a0b3bfb6b60f0c7f018bace830f072fb83629ae0bb
    order:
      - purpose
      - problem
      - what
      - context
      - when
      - start
      - next
    sections:
      purpose: 80665302253d444209646f24d5d04a17bdc7fded93985bab481883ed62a94247
      problem: 44b7d56fb2431a55f89d115d685ba66c694ad1ce4a7d33d1c0ef83d7e1f60acb
      what: 976f2ea5fc72f7a346d315c8a5635d50d148b6fb319b637ec680b88794ca6a71
      context: 84042b57521eb7e5002d640258c72772b8426694a689cb41e93b7c7bb8aa9f23
      when: 272ecd5f59f20ffb4e6df744336c335c500210725386bfc3f1ff987008a1984d
      start: 8c66a7e3b8e4b6a9d88e5907a606fb63eed0f998c678cc33027ba55d13995847
      next: 26a02d1c80aac48174b1b65b20b18002d511b10deb3399d73ef954d6383cfb43
    exterior:
      '[null,"purpose"]': 8fe9cd2206b45277432f7123b4ce16c31993a9b22119a08fdf6da0720c666c46
      '["purpose","problem"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["problem","what"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["what","context"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["context","when"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["when","start"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["start","next"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["next",null]': e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
---

# Source Graph 是什么

<!-- context:section id="purpose" -->
**Context Source Graph 让人、脚本和 AI Agent 无需克隆仓库，就能在确定的 Git 提交上搜索和阅读代码。** 结果来自预先建好的索引，毫秒级返回；每个结果都标明读取所用的提交，同一个问题总能拿到同样的证据。

它开源、可自部署。公开的只读[在线演示](https://context4ai.org/sourcegraph/)索引了 `context4ai/context` 和 `context4ai/sourcegraph`。
<!-- /context:section -->

<!-- context:section id="problem" -->
## 它解决什么问题

Agent 回答代码问题时，通常只需要少量确切的代码行，而不是整个仓库。它的工作是针对并未检出的代码，进行很多轮小而精确的「先搜索、再阅读」。把每个仓库都按正确版本克隆到每个 Agent 沙箱里很慢；在检出目录上运行 `rg` 或 `git grep`，每次调用又要把同样的内容完整扫描一遍。

Source Graph 把这部分工作挪到提问之前：它在后台为每个已登记仓库保持镜像和索引，查询读取的是预先建好的索引，而不是扫描工作树。仓库越大，差距越明显。
<!-- /context:section -->

<!-- context:section id="what" -->
## 你能得到什么

- **快速搜索。** 服务端的索引搜索通常在 5 ms 内完成；与调用方部署在同一区域时，含网络在内的完整请求也远低于 100 ms。在演示实例上，一次在本地检出目录里 `rg` 约需 61 ms 的字面量搜索，大约 1 ms 就能返回。速度从何而来，见[固定版本的搜索与阅读](../../architecture/source-graph/pinned-search-and-reads.md)。
- **可复现的读取。** 分支和标签在读取任何内容之前都先解析为一个提交，因此搜索命中、它指向的文件和之后的差异，描述的是同一个快照。
- **为 Agent 而生。** 列出仓库、搜索、读取一段代码、列出目录、比较两个提交，这些操作在网站、HTTP API、MCP 服务器和命令行客户端上都一样可用；MCP 还能在一次调用中读取多段代码。任何支持 Streamable HTTP 的 MCP 客户端都能接入；匿名访问为只读，且仅限公开仓库。
- **占用小。** 一个进程同时管理 Git 镜像、搜索引擎和后台建索引。默认数据库为 SQLite，也支持 PostgreSQL 和 MongoDB。
<!-- /context:section -->

<!-- context:section id="context" -->
## 如何与 Context 配合

Context 的知识页面会回指支撑每条结论的代码。Agent 用 Context 回答问题时，查询技能会去读取这些原始代码来确认答案。在默认的 `auto` 模式下，只要配置了已授权的 `context-sourcegraph` MCP 服务器，它就会使用该服务；否则回退到本地检索：对记录的提交做浅层、稀疏的部分克隆，再用 grep 或 rg 搜索。

所以 Source Graph 对 Context 是**可选的**。当你希望 Agent 远程读取固定版本的代码、不想在本地检出或等待克隆时，再接入它。仓库还可以附带读取插件（`<name>.sourcegraph.wasm`），在 `read` 结果中追加信息；Context 就用这样一个插件，让你通过 Source Graph 读取知识页面时，同时拿到每个章节的写作来源，见[与 Context 协同](../../architecture/source-graph/evidence-for-context.md)。
<!-- /context:section -->

<!-- context:section id="when" -->
## 什么时候值得接入

当 Agent 或脚本经常需要本地没有的仓库代码、回答必须引用确切的提交，或者同一批仓库每天被反复查询时，就值得接入 Source Graph。对于你正在修改的代码，本地检出仍然更简单。

Source Graph 是一个在固定版本上做文本搜索与阅读的服务。每个实例在本地磁盘上持有自己的镜像和索引；扩容的方式是让多个实例分别负责互不重叠的仓库，而不是在同一份数据上运行多个副本。
<!-- /context:section -->

<!-- context:section id="start" -->
## 三步开始

1. **试用在线演示。** 打开 [https://context4ai.org/sourcegraph/](https://context4ai.org/sourcegraph/)，直接在浏览器中搜索和阅读代码，无需账号。
2. **接入你的 Agent。** 打开站点的 **Connect**（接入）页面，复制适用于你的 Agent 宿主的配置；或者把任意支持 Streamable HTTP 的 MCP 客户端指向 `https://context4ai.org/sourcegraph/mcp`。MCP、HTTP、CLI 和凭据的用法见[接入](connecting.md)。
3. **为自己的仓库运行实例。** 用 Docker 启动，配置 Google 或 GitHub 登录，第一个完成验证的用户会成为管理员并登记仓库。具体步骤见[自部署与数据库选择](self-hosting.md)和[登记仓库](registering-repositories.md)。
<!-- /context:section -->

<!-- context:section id="next" -->
## 下一步

| 如果你想… | 阅读 |
| --- | --- |
| 接入 MCP 客户端、脚本或 CLI | [接入](connecting.md) |
| 添加仓库和 Monorepo 路径组 | [登记仓库](registering-repositories.md) |
| 了解服务是如何构建的 | [架构概览](../../architecture/source-graph/overview.md)和[固定版本的搜索与阅读](../../architecture/source-graph/pinned-search-and-reads.md) |
| 部署、保护并运维自己的实例 | [自部署与数据库选择](self-hosting.md)、[部署建议](deployment-recommendations.md)、[登录与准入](authentication-and-access-control.md)和[运维](operations.md) |
| 查阅路由、工具、参数和设置 | [HTTP 与 MCP 接口](../../product/reference/source-graph/http-and-mcp.md)、[CLI](../../product/reference/source-graph/cli.md)、[搜索语法](../../product/reference/source-graph/query-syntax.md)和[配置](../../product/reference/source-graph/configuration.md) |
<!-- /context:section -->
