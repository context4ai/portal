---
title: 连接 Agent、脚本和命令行使用 Source Graph
description: 把你的 Agent 接入 Source Graph，让 Context
  无需克隆就能读取被引用的代码；再接入浏览器、脚本或命令行客户端，选择合适的凭据，选定要读取的分支、标签或提交，并遵循先搜索、再读取的循环。
translation:
  locale: zh-CN
  artifact_ref: 154d582d-953d-40e3-afd5-f214c2c17909
  source_digest: f8ad13dcd3440a205cd0b003d2897ca6f236a2b976e78e083e31c022baa18190
  translated_at: 2026-11-09T01:07:08.071Z
---

# 连接 Agent、脚本和命令行使用 Source Graph

<!-- context:section id="goal" -->
接入后，你的 Agent、脚本或终端无需先克隆仓库，就能在固定提交上搜索和阅读代码。大多数 Context 用户只需要做一件事：按下一节所述通过 MCP 接入自己的 Agent，让 Agent 能远程读取回答背后的代码。为什么这很重要、什么时候需要它，以及如何试用在线演示，见 [Source Graph 是什么](introduction.md)。

每个 Source Graph 实例都在其源站的 `/sourcegraph/` 路径下提供四个入口。按调用方选择合适的入口即可；它们执行相同的操作，遵循相同的规则，只是一次调用读取多段代码仅 MCP 支持，而 CLI 没有列出分支和标签的命令。

| 调用方 | 入口 |
| --- | --- |
| 人 | 位于 `/sourcegraph/` 的网站：搜索、代码阅读、仓库以及 **Connect**（接入）页面 |
| AI Agent 或 MCP 客户端 | `/sourcegraph/mcp`：Streamable HTTP，无状态，返回 JSON |
| 脚本或服务 | HTTP API：仓库读取使用 `/sourcegraph/v1/…`，搜索使用 `/sourcegraph/api/search` |
| 终端 | `sourcegraph-cli`，一个调用相同路由的小型 HTTP 客户端 |

网站的 **Connect** 页面始终会展示当前实例可直接复制的配置，包括正确的地址以及是否需要令牌。当它与手写示例不一致时，以该页面为准。
<!-- /context:section -->

<!-- context:section id="mcp" -->
## 为 Context 接入你的 Agent

1. 如果实例需要凭据，请登录并创建个人 API Key（见 [选择凭据](#choose-a-credential)）。公开演示实例不需要凭据。
2. 打开站点的 **Connect** 页面，复制适用于你的 Agent 宿主的配置；页面会展示 Claude Code、Codex 和 Cursor 对应的命令或配置文件。
3. 保持服务器名称为 `context-sourcegraph`。Context 的查询 Skill 读取被引用的代码时，查找的就是这个名称，详见 [选择 Context 读取代码的方式](#choose-how-context-reads-code)。

对于其他支持 Streamable HTTP 的客户端，将其指向 `/mcp` 端点。公开演示实例的配置如下：

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

如果实例需要凭据，添加 `"headers": { "Authorization": "Bearer <token>" }`。可选的 `plugins` 查询参数控制整个连接使用的仓库插件：`auto`（默认选择）、`off`，或最多 16 个以逗号分隔的插件名称。匿名连接只能获得只读工具。个人 Key 的所有者是管理员或至少管理一个仓库时，该 Key 还能获得 `prepare`；服务令牌可以使用所有工具。当前的输入 schema 请通过 MCP 工具发现获取，[HTTP 与 MCP 接口](../../product/reference/source-graph/http-and-mcp.md) 参考文档中列出了这些工具。
<!-- /context:section -->

<!-- context:section id="evidence" -->
## 选择 Context 读取代码的方式

接入服务器 `context-sourcegraph` 后，Context 会用它读取被引用的代码。默认情况下，Agent 会复用合适的本地材料，否则优先使用 Source Graph，其次才是本地检出。要改变这一点，可以在对话中要求只通过 Source Graph 读取或只在本地读取，例如“离线工作”；明确的要求始终优先。对于知识 Bot，请在 Bot 的提示词中设置读取方式。

实例必须覆盖知识工作区以及回答所依赖的每个源码仓库；如果缺少某个仓库，见 [缺少某个仓库？](#missing-a-repository)。这能为你的回答带来什么，见 [Source Graph 是什么](introduction.md#a-faster-option-for-context)。
<!-- /context:section -->

<!-- context:section id="missing-repository" -->
## 缺少某个仓库？

如果搜索或读取找不到你需要的仓库，要么它还没有在该实例上登记，要么它是你的凭据看不到的私有仓库；这两种情况都返回 `REPOSITORY_NOT_FOUND`。私有仓库只对其创建者、管理者和管理员可见，因此请联系其中一位，请对方把你添加为管理者。如果你尝试登记一个已存在的名称，网站会告诉你是谁登记的，让你知道该找谁。尚未登记的仓库需要管理员来登记；如果站点允许用户登记仓库，任何已登录用户也可以登记。代码托管平台上的私有仓库还需要其代码来源的令牌，服务才能拉取它。如果是你自己的实例，按 [登记和管理仓库](registering-repositories.md) 中的说明登记即可。
<!-- /context:section -->

<!-- context:section id="credentials" -->
## 选择凭据

| 凭据 | 获取方式 | 允许的操作 |
| --- | --- | --- |
| 无（匿名） | — | 当站点允许公开读取时，只读访问公开仓库；按客户端限流 |
| 个人 API Key（`sgk_…`） | 登录后打开用户设置，创建 API 令牌 | 通过 HTTP 或 MCP 读取公开仓库以及你创建或管理的私有仓库；管理员的 Key 不会扩展到所有仓库。它还可以为你管理的仓库请求建索引；当你是管理员时，可以为它能看到的任何仓库请求建索引 |
| 服务令牌 | 实例的服务凭据，至少 32 个字符。`SOURCEGRAPH_API_TOKEN` 在首次启动时提供初始值（未设置时自动生成）；之后使用保存在数据库中的值 | 对所有仓库执行所有 HTTP 和 MCP 操作，包括登记和建索引，适用于你自己掌控的自动化流程 |

以 `Authorization: Bearer <value>` 的形式发送 Key 和令牌。无效凭据会被拒绝并返回 `AUTHENTICATION_REQUIRED`，绝不会回退为匿名访问。请将凭据保存在客户端的密钥存储或环境变量中，不要放进共享的配置文件。各模式的详细说明见 [运维：登录与权限](authentication-and-access-control.md)。
<!-- /context:section -->

<!-- context:section id="versions" -->

## 选择要读取的版本

搜索、读取、列目录和差异比较都在监控分支（实例保持同步的分支，由 `repositories` 列出）或 40 位完整提交 SHA 上进行。省略 revision 时使用默认分支最近一次同步的最新提交。其他任何分支以及所有标签，都要先转换为完整提交：

1. **用 `refs` 查找**：不知道确切名称时使用。`refs` 从远端列出仓库的分支或标签，最新的在前，每项都带有提交、`created_at`、作者、标题，以及是否被监控、是否已建索引。可以用 `kind`（默认 `branch`，也可以是 `tag` 或 `all`）、`query`（名称的一部分）、`author`、`title`、`since` 和 `until` 缩小范围；可以按 `name` 而不是创建时间排序；用 `first`（1–100）分页，并把返回的 `next_cursor` 作为 `after` 传入。
2. **用 `resolve` 解析**：它接受已登记仓库的任意分支名或标签名，以及 `refs/heads/<name>` 和 `refs/tags/<name>`，返回完整的 `commit`、该提交是否已建索引（`indexed`），并在 `source` 中说明它是如何找到的：监控分支为 `observed`，解析到其最近一次同步的最新提交，可能落后于远端；其他分支和标签为 `catalog` 或 `remote`。
3. **在该 SHA 上读取**：使用搜索、读取、列目录或差异比较。`indexed` 为 false 时，需要先准备该提交：由仓库管理者准备这个完整 SHA（如果当前连接的工具包含 `prepare`，也可以由它自己准备），等 availability 显示就绪后，Agent 再在该提交上读取。列出和解析从不下载代码，也不建索引。

分支名和标签名区分大小写。同时是分支和标签的裸名称会返回 `REF_AMBIGUOUS`；请改传 `refs/heads/<name>` 或 `refs/tags/<name>`。`REF_NOT_FOUND` 表示不存在该分支或标签，`REF_NOT_COMMIT` 表示标签没有指向提交。不接受短 SHA、`HEAD` 和版本表达式；把未被监控的分支名直接传给搜索或读取会返回 `BRANCH_NOT_MONITORED`。大型仓库首次列出时可能返回 `REFS_CATALOG_PREPARING`；请在 `Retry-After` 间隔之后重试，或在此期间解析完整名称。

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

# Find the ten newest tags created since 1 October 2026
curl -s 'https://context4ai.org/sourcegraph/v1/repo/refs?repo=context4ai/context&kind=tag&since=2026-10-01&first=10'

# Resolve a tag to its full commit and check whether it is indexed
curl -s -X POST 'https://context4ai.org/sourcegraph/v1/repo/resolve?repo=context4ai/context' \
  -H 'Content-Type: application/json' \
  -d '{"Revision":"refs/tags/v0.7.95"}'
```

`refs` 通过查询参数接收过滤条件（`kind`、`query`、`author`、`title`、`since`、`until`、`sort`、`first` 和 `after`），每个参数最多出现一次。`read_many` 只能通过 MCP 使用；通过 HTTP 时，请发起多次 `read` 调用。
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

`resolve` 接受与 HTTP 路由相同的分支、标签以及 `refs/heads/` 或 `refs/tags/` 形式，其他命令则接受监控分支或完整 SHA。CLI 没有 `refs` 命令；请通过 HTTP 路由或 MCP 工具查找分支和标签。它会输出原始 JSON 响应；当请求已被接受但尚未就绪时，以 `3` 退出。所有命令和参数见 [CLI](../../product/reference/source-graph/cli.md) 参考文档。
<!-- /context:section -->

<!-- context:section id="loop" -->
## 先搜索、再读取的循环

Agent 用一个简短的循环就能充分利用 Source Graph：

1. **搜索**仓库。省略 revision 时使用默认分支的最新提交，也可以传入监控分支或已知的完整提交；对于其他分支或标签，先按 [选择要读取的版本](#choose-the-version-to-read) 中的说明解析。
2. **固定提交**：记下结果元数据中返回的提交。
3. 在该提交上**读取**关键范围：已知文件时直接读取，需要多处时用 `read_many` 一次读取。每个范围都要同时保留仓库、完整提交 SHA 和路径，使用 search 或 list 返回的路径，并按仓库和提交对 `read_many` 调用分组；`end_line` 是绝对行号，而不是行数。
4. 如果文件还有后续内容，从返回的下一行**继续**读取；将 `Partial`、`Truncated` 和覆盖范围标记视为限制，而不是内容不存在的证明。

无需在每次查询前都列出仓库、查找分支和标签或解析 revision；只有在仓库或版本未知、或请求失败时才这样做。如果请求失败——例如某个提交尚未建好索引时返回 `409 INDEX_NOT_READY`——请在 [运维：日常运维与排障](operations.md#common-errors) 中查找该错误码的含义和处理方法。
<!-- /context:section -->
