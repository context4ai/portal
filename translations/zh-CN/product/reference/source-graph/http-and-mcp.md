---
title: HTTP 与 MCP 接口
description: Source Graph 全部 HTTP 路由与 MCP 工具：路径、输入、凭据、限制、输出与错误格式。
translation:
  locale: zh-CN
  artifact_ref: 7d36464b-bcce-4ff6-b9e0-9904140bd929
  source_digest: 67c87b13afe434cc042094ab8f6d6f4f1375903cf8dcc2dcc13a2d58e334180d
  translated_at: 2026-10-20T06:16:49.422Z
---

# HTTP 与 MCP 接口

<!-- context:section id="goal" -->
所有路由都位于实例源地址的 `/sourcegraph` 前缀下。查询路由在 `/sourcegraph/v1/` 下（搜索为 `/sourcegraph/api/search`），管理路由在 `/sourcegraph/api/admin/` 下，MCP 端点为 `/sourcegraph/mcp`。两类接口调用的是同一个服务，因此版本、限制和错误码完全一致。如何选择凭据，见 [接入](../../../sop/source-graph/connecting.md)。

> **可选服务。** Context 并不依赖 Source Graph 或它的 MCP 服务。两者都没有安装或配置时，Context 的查询技能仍会通过浅层、稀疏的部分克隆加 grep 在本地读取代码证据；默认的 `auto` 模式只在有可用的已授权实例时才优先使用 Source Graph。
<!-- /context:section -->

<!-- context:section id="conventions" -->
## 请求约定

- **仓库**：作用于单个仓库的路由通过 `repo` 查询参数指定仓库，格式为 `owner/repository`。
- **查询参数**：只接受 `repo` 和 `after`，另外 `/v1/repo/plugins` 接受 `revision`，`/api/admin/v1/repo/commit-options` 接受 `branch`。未知或重复的参数返回 `400 INVALID_QUERY_PARAMETERS`。
- **请求体**：JSON 对象，最大 64 KiB。未知字段、`null` 值、重复键和尾随数据都会被拒绝。查询路由的字段名首字母大写（`Revision`、`Pattern`）；管理路由使用小写字段名（`name`、`policy`）。
- **凭据**：使用 `Authorization: Bearer <service token>`，个人 Key 则为 `Bearer sgk_…`；否则使用浏览器会话或匿名访问。无效凭据返回 `401`，绝不会回退为匿名访问。
- **时间**：每个请求有 30 秒的处理预算；超时的请求返回 `503 QUERY_DEADLINE_EXCEEDED`，意外的依赖故障返回 `503 DEPENDENCY_UNAVAILABLE`。
<!-- /context:section -->

<!-- context:section id="query" -->
## 查询路由

开启公开读取时，匿名访客可以使用这些路由；所有凭据也都可以使用。

| 方法 | 路径 | 请求体 | 返回 |
| --- | --- | --- | --- |
| GET | `/v1/capabilities` | — | 协议与支持的操作 |
| GET | `/v1/repos` | —（用 `after` 翻到下一页） | 已登记的仓库，每页 100 个 |
| GET | `/v1/repo/availability` | — | 单个仓库：保留的版本、分支最新提交、路径组和任务，以及它的 `code_provider` 和登记时固定的 `code_host`，附带 `ETag` |
| GET | `/v1/repo/commits` | — | 与 availability 相同 |
| GET | `/v1/repo/plugins` | —（可选 `revision`） | 该提交中发现的仓库插件，不会运行它们 |
| POST | `/v1/repo/resolve` | `{"Revision"}` | 解析出的固定提交及其是否已建索引 |
| POST | `/api/search` | `{"Revision","Pattern","FixedStrings","IgnoreCase","Glob","Paths","Output"}` | 搜索命中和 `Meta`；见 [搜索语法](query-syntax.md) |
| POST | `/v1/repo/read` | `{"Revision","Path","StartLine","EndLine"}` | 一个文件的指定行范围 |
| POST | `/v1/repo/list` | `{"Revision","Path","First","After"}` | 单个目录的直接子项 |
| POST | `/v1/repo/diff` | `{"Base","Head","Paths","First","After"}` | 两个提交之间变更的文件与补丁 |

除 `diff` 外，`Revision` 均为可选；`diff` 必须提供 `Base` 和 `Head`。`read_many` 没有 HTTP 路由，只以 MCP 工具的形式提供。
<!-- /context:section -->

<!-- context:section id="admin" -->
## 管理路由

这些路由需要服务令牌或管理员的浏览器会话。个人 API Key 是只读的，在这里会得到 `403 ACCESS_DENIED`。少数读取路由（`GET /api/admin/v1/repos`、`GET /api/admin/v1/repo` 和 `GET /api/admin/v1/statistics`）也对匿名读取开放。

| 方法 | 路径 | 请求体或请求头 | 用途 |
| --- | --- | --- | --- |
| GET | `/api/admin/v1/statistics` | — | 请求与任务统计 |
| GET | `/api/admin/v1/instances` | — | 实例心跳 |
| GET | `/api/admin/v1/repos` | — | 仓库目录 |
| POST | `/api/admin/v1/repos` | 登记字段；可选 `Idempotency-Key` | 登记仓库（`202`） |
| GET | `/api/admin/v1/repo` | — | 仓库信息，附带 `ETag` |
| PATCH | `/api/admin/v1/repo` | 更新字段；`If-Match` 版本 | 修改分支、保留窗口、可见性、同步间隔、路径组；启用、停用或删除 |
| POST | `/api/admin/v1/repo/preview` | 更新字段 | 预览一次更新 |
| POST | `/api/admin/v1/repo/prepare` | `{"kind","commit","group"}`；可选 `Idempotency-Key` | 排队执行 `sync` 或 `index` 工作（`202`） |
| GET | `/api/admin/v1/repo/commit-options` | —（可选 `branch`） | 可供选择的最近已同步提交 |
| POST | `/api/admin/v1/repo/index/preview`、`/api/admin/v1/repo/index` | `{"branch","commit"}`；后者还需 `preview` 和 `If-Match` | 为某个提交添加索引 |
| POST | `/api/admin/v1/repo/cleanup/preview`、`/api/admin/v1/repo/cleanup` | `{"preview"}`，后者还需 `If-Match` | 每个分支只保留最新的索引 |
| POST | `/api/admin/v1/repo/delete/preview`、`/api/admin/v1/repo/delete` | `{"preview"}`，后者还需 `If-Match` | 永久删除仓库数据 |
| POST | `/api/admin/v1/repo/jobs/cancel` | `{"job_id"}` | 取消任务 |
| POST | `/api/admin/v1/repo/purge` | `If-Match` 版本 | 清除已停用且已删除的仓库 |

登记字段见 [登记仓库](../../../sop/source-graph/registering-repositories.md)。
<!-- /context:section -->

<!-- context:section id="other" -->
## 健康检查、登录与设置路由

| 路径 | 访问权限 | 用途 |
| --- | --- | --- |
| `GET /healthz` | 开放 | 存活检查：`{"status":"alive"}` |
| `GET /readyz` | 开放 | 就绪检查；无法读取仓库目录时返回 `503` |
| `GET /access-policy` | 开放 | `public_read`、`public_prepare`（始终为 `false`）和 `sso_enabled` |
| `GET /site-settings` | 开放 | 公开的仓库默认值 |
| `GET /v1/code-sources` | 开放 | 按显示顺序列出已配置的代码源——`id`、`name`、`host`、`username`、`anonymous`、`editable`，以及列出启动文件所设字段的 `locked`；从不返回令牌 |
| `/auth/…` | 浏览器 | 登录提供方、登录与回调、当前用户、退出登录、`api-keys`、用户管理 |
| `/auth/code-credentials` | 已登录会话 | 你自己的 GitHub 和自定义 Git 令牌 |
| `/api/admin/settings/…` | 仅限管理员会话 | 站点设置各分区，包括 `code_source`（用 `PATCH` 提交 `revision` 和 `values` 中的 `name`、`host`、`username`），以及 `code-credentials`、`query-errors`、`jobs/clear`、`storage` |

`/api/admin/settings` 下的站点管理会拒绝任何携带 `Authorization` 请求头的请求，只能从已登录管理员的浏览器访问。
<!-- /context:section -->

<!-- context:section id="mcp" -->
## MCP 端点

`/sourcegraph/mcp` 使用无状态的 Streamable HTTP，响应为 JSON；服务端标识自己为 `context-sourcegraph`。可用的工具集取决于凭据：

| 凭据 | 工具 |
| --- | --- |
| 匿名（已开启公开读取）、个人 Key | 只读：除 `prepare` 外的全部工具 |
| 以 prepare 权限创建的管理员个人 Key | 只读工具加上 `prepare`，限流为每个 Key 每分钟 10 次、总计每分钟 60 次 |
| 服务令牌 | 全部工具 |

可选的连接参数 `?plugins=` 用于设置 `read` 和 `read_many` 的默认插件选择：`auto`、`off`，或最多 16 个以逗号分隔的名称。无效值返回 `400 INVALID_PLUGINS`。
<!-- /context:section -->

<!-- context:section id="tools" -->
## MCP 工具

| 工具 | 必填 | 可选（默认值） |
| --- | --- | --- |
| `repositories` | — | `after` |
| `availability` | `repo` | `job_id`、`include_plugins`、`revision` |
| `resolve` | `repo` | `revision` |
| `search` | `repo`、`pattern` | `revision`、`fixed_strings`、`ignore_case`、`glob`、`paths`、`output`（`content` 或 `files`）、`max_lines_per_file`（10，范围 1–1000） |
| `read` | `repo`、`path` | `revision`、`start_line`（1）、`end_line`（起始行 + 499）、`plugins` |
| `read_many` | `repo`、`files`（1–10 项，每项含 `path`、`start_line`、`end_line`） | `revision`（整批只解析一次）、`plugins` |
| `list` | `repo`、`first`（1–1000） | `revision`、`path`、`after` |
| `diff` | `repo`、`base`、`head`、`first`（1–100） | `paths`、`after` |
| `prepare` | `repo`、`idempotency_key`（8–128 字节） | `revision`、`group` |

`plugins` 是一个列表，例如 `[{"name":"context-evidence"}]`；传 `[]` 会在本次调用中关闭增强，而以 `plugins=off` 打开的连接始终关闭增强。`prepare` 接受省略版本（默认分支）、监控分支，或保留窗口内的完整 SHA；它是异步的，之后请轮询 `availability`。
<!-- /context:section -->

<!-- context:section id="output" -->
## MCP 输出

`search`、`read` 和 `read_many` 返回可读文本，而不是原始 JSON：

- **search** 依次以 `Repository`、`Commit`、`Status`、`Partial`、`Truncated`、一行 `Coverage`、已登记的 `Paths` 和 `Groups`，以及返回文件数与总文件数开头，然后列出每个 `File` 及其带行号的匹配行。
- **read** 以 `Repository` 开头，接着是 `Path`、`Commit` 和 `Lines: start-end`；还有剩余内容时给出续读字段（`Truncated`、`HasMore`、`NextStartLine`），并附上符号链接、子模块和 LFS 指针的说明，最后是 `N: text` 格式的带行号内容。
- **read_many** 为每一项返回一个文本块，每块包含 `Item N; RequestedLines`，该项失败时有一行 `Error`，其余为相同的文件头和内容行。

插件输出追加在所属项之后；插件诊断信息放在单独的块中，绝不会替换原始文本。其他工具返回紧凑的 JSON。错误以标记为错误的工具结果返回，其文本为 `{"code","message"}`，未就绪状态会附带恢复提示。
<!-- /context:section -->

<!-- context:section id="limits" -->
## 限制

| 限制项 | 值 |
| --- | --- |
| 仓库目录分页 | 100 个仓库 |
| 搜索模式 | 8,192 字节；不能匹配换行符或空字符串 |
| 搜索 glob | 64 个，每个最多 1,024 字节 |
| 搜索或差异路径 | 64 个目录 |
| 搜索分页 | 100 个文件、1,000 条匹配，带 2 行上下文，超出时逐级缩小；响应 2 MiB；截止时间 5 秒 |
| 引擎匹配上限 | 10,000 条匹配 |
| 读取 | 每次调用 500 行、256 KiB |
| `read_many` | 1–10 项，共享 1,000 行、256 KiB 和 30 秒 |
| 列目录分页 | 1–1,000 个条目 |
| 差异分页 | 1–100 个文件；补丁每个文件 64 KiB，总计 256 KiB |
| 请求体 | 64 KiB |
<!-- /context:section -->

<!-- context:section id="errors" -->
## 错误格式

HTTP 错误返回一个 JSON 体，其中包含 `Error` 消息，以及含有 `Protocol`、`RequestID`、`Status`、`Code` 和 `Retryable` 的 `Meta`。传输层错误码包括 `NOT_FOUND`、`METHOD_NOT_ALLOWED`、`INVALID_QUERY_PARAMETERS`、`INVALID_REQUEST`、`AUTHENTICATION_REQUIRED`、`ACCESS_DENIED`、`RATE_LIMITED`、`PRECONDITION_REQUIRED`、`QUERY_DEADLINE_EXCEEDED` 和 `DEPENDENCY_UNAVAILABLE`。`INDEX_NOT_READY`、`REVISION_NOT_ELIGIBLE`、`INVALID_PATTERN` 或 `READ_BUDGET_EXCEEDED` 等操作错误码有各自的状态码。[运维](../../../sop/source-graph/operations.md) 解释了常见错误码及处理方法。
<!-- /context:section -->
