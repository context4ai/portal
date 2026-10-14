---
title: 接入
description: 将浏览器、MCP 客户端、脚本或命令行客户端接入 Source
  Graph，无需克隆即可在固定提交上搜索和读取代码；选择合适的凭据，并遵循“先搜索、再读取”的循环。
translation:
  locale: zh-CN
  artifact_ref: 154d582d-953d-40e3-afd5-f214c2c17909
  source_digest: 6cb62f2cb0d66eb0d16021ca0176fe42d8ca7682e43b8cf31c1723941c473fd4
  translated_at: 2026-10-14T00:35:17.174Z
---

# 接入

<!-- context:section id="goal" -->
接入后，你的 Agent、脚本或终端无需先克隆仓库，就能在固定提交上搜索和阅读代码。为什么这很重要、什么时候需要它，以及如何试用在线演示，见 [Source Graph 是什么](introduction.md)。

每个 Source Graph 实例都在其源站的 `/sourcegraph/` 路径下提供四个入口。按调用方选择合适的入口即可；它们执行相同的操作，遵循相同的规则。

| 调用方 | 入口 |
| --- | --- |
| 人 | 位于 `/sourcegraph/` 的网站：搜索、代码阅读、仓库以及 **Connect**（接入）页面 |
| AI Agent 或 MCP 客户端 | `/sourcegraph/mcp`：Streamable HTTP，无状态，返回 JSON |
| 脚本或服务 | HTTP API：仓库读取使用 `/sourcegraph/v1/…`，搜索使用 `/sourcegraph/api/search` |
| 终端 | `sourcegraph-cli`，一个调用相同路由的小型 HTTP 客户端 |

网站的 **Connect** 页面始终会展示当前实例可直接复制的配置，包括正确的地址以及是否需要令牌。当它与手写示例不一致时，以该页面为准。
<!-- /context:section -->

<!-- context:section id="credentials" -->
## 选择凭据

| 凭据 | 获取方式 | 允许的操作 |
| --- | --- | --- |
| 无（匿名） | — | 当站点允许公开读取时，只读访问标记为公开的仓库；按客户端限流 |
| 个人 API Key（`sgk_…`） | 登录后打开用户设置，创建 API 令牌 | 通过 HTTP 或 MCP 执行与你的账号相同的读取操作。管理员创建的 Key 还可以通过 MCP 请求建索引 |
| 服务令牌 | 实例的 `SOURCEGRAPH_API_TOKEN` 设置，至少 32 个字符 | 所有 HTTP 和 MCP 操作，包括登记和建索引，适用于你自己掌控的自动化流程 |

以 `Authorization: Bearer <value>` 的形式发送 Key 和令牌。无效凭据会被拒绝并返回 `AUTHENTICATION_REQUIRED`，绝不会回退为匿名访问。请将凭据保存在客户端的密钥存储或环境变量中，不要放进共享的配置文件。各模式的详细说明见[登录与准入](authentication-and-access-control.md)。
<!-- /context:section -->

<!-- context:section id="mcp" -->
## 接入 MCP 客户端

将任何支持 Streamable HTTP 的客户端指向 `/mcp` 端点。公开演示实例的配置如下：

```json
{
  "mcpServers": {
    "context-sourcegraph": {
      "type": "http",
      "url": "https://context4ai.org/sourcegraph/mcp?plugins=auto"
    }
  }
}
```

如果实例需要凭据，添加 `"headers": { "Authorization": "Bearer <token>" }`。Connect 页面还会展示 Claude Code、Codex 和 Cursor 对应的命令或配置文件。将服务器命名为 `context-sourcegraph`，Context 的查询 Skill 就能找到它，详见[远程读取代码证据](../querying-knowledge/reading-code-evidence-remotely.md)。

可选的 `plugins` 查询参数控制整个连接使用的仓库插件：`auto`（默认选择）、`off`，或最多 16 个以逗号分隔的插件名称。匿名连接和个人 Key 只能获得只读工具；`prepare` 只对服务令牌以及被允许执行准备的管理员 Key 可见。当前的输入 schema 请通过 MCP 工具发现获取，[HTTP 与 MCP 接口](../../product/reference/source-graph/http-and-mcp.md)参考文档中列出了这些工具。
<!-- /context:section -->

<!-- context:section id="http" -->
## 调用 HTTP API

每个针对具体仓库的请求都通过 `repo` 查询参数指定仓库，格式为 `owner/repository`。请求体是字段名首字母大写的 JSON 对象，未知字段会被拒绝。

```bash
# Search at the default branch head
curl -s -X POST 'https://context4ai.org/sourcegraph/api/search?repo=context4ai/context' \
  -H 'Content-Type: application/json' \
  -d '{"Pattern":"timeout","IgnoreCase":true,"Paths":["packages"]}'

# Read lines at the commit returned in Meta.Commit
curl -s -X POST 'https://context4ai.org/sourcegraph/v1/repo/read?repo=context4ai/context' \
  -H 'Content-Type: application/json' \
  -d '{"Revision":"<commit>","Path":"README.md","StartLine":1,"EndLine":40}'
```

`read_many` 只能通过 MCP 使用；通过 HTTP 时，请发起多次 `read` 调用。
<!-- /context:section -->

<!-- context:section id="cli" -->
## 使用命令行客户端

`sourcegraph-cli` 随服务一同构建，读取两个环境变量：`SOURCEGRAPH_URL` 是实例的 `/sourcegraph` 基础地址（默认 `https://context4ai.org/sourcegraph`，必须是 HTTPS）；`SOURCEGRAPH_API_TOKEN` 可选。搜索参数沿用 `rg` 的风格：

```bash
export SOURCEGRAPH_URL="https://context4ai.org/sourcegraph"
sourcegraph-cli search -repo context4ai/context -g '*.ts' 'OnboardingVersion' packages
sourcegraph-cli read -repo context4ai/context -revision <commit> \
  -path README.md -start-line 1 -end-line 40
```

它会输出原始 JSON 响应；当请求已被接受但尚未就绪时，以 `3` 退出。所有命令和参数见 [CLI](../../product/reference/source-graph/cli.md) 参考文档。
<!-- /context:section -->

<!-- context:section id="loop" -->
## 先搜索、再读取的循环

Agent 用一个简短的循环就能充分利用 Source Graph：

1. **搜索**仓库。省略 revision 时使用默认分支的最新提交，也可以传入监控分支或已知的完整提交。
2. **固定提交**：记下结果元数据中返回的提交。
3. 在该提交上**读取**关键范围：已知文件时直接读取，需要多处时用 `read_many` 一次读取。
4. 如果文件还有后续内容，从返回的下一行**继续**读取；将 `Partial`、`Truncated` 和覆盖范围标记视为限制，而不是内容不存在的证明。

无需在每次查询前都列出仓库或解析 revision；只有在仓库未知或请求失败时才这样做。`409 INDEX_NOT_READY` 表示该提交尚未建好索引，处理方法见[运维](operations.md)。
<!-- /context:section -->
