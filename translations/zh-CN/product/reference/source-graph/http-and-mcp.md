---
title: HTTP 与 MCP 接口
description: Source Graph 全部 HTTP 路由与 MCP 工具：路径、输入、凭据、限制、输出与错误格式。
translation:
  locale: zh-CN
  artifact_ref: 7d36464b-bcce-4ff6-b9e0-9904140bd929
  source_digest: 59b3560603f9e65a502b798adb710a32d4848434c046e95ba43ae8c0e369533b
  translated_at: 2026-11-09T01:07:08.071Z
---

# HTTP 与 MCP 接口

<!-- context:section id="goal" -->
所有路由都位于实例源地址的 `/sourcegraph` 前缀下。查询路由在 `/sourcegraph/v1/` 下（搜索为 `/sourcegraph/api/search`），管理路由在 `/sourcegraph/api/admin/` 下，MCP 端点为 `/sourcegraph/mcp`。两类接口调用的是同一个服务，因此版本、限制和错误码完全一致。如何选择凭据，见 [连接 Agent、脚本和命令行使用 Source Graph](../../../sop/source-graph/connecting.md)。

> **可选服务。** Context 并不依赖 Source Graph 或它的 MCP 服务。两者都没有安装或配置时，Context 的查询技能仍会通过浅层、稀疏的部分克隆加 grep 在本地读取代码证据；默认的 `auto` 模式只在有可用的已授权实例时才优先使用 Source Graph。
<!-- /context:section -->

<!-- context:section id="conventions" -->
## 请求约定

- **仓库**：作用于单个仓库的路由通过 `repo` 查询参数指定仓库，格式为 `owner/repository`。
- **查询参数**：只接受 `repo` 和 `after`，另外 `/v1/repo/plugins` 接受 `revision`，`/api/admin/v1/repo/commit-options` 接受 `branch`，`/v1/repo/refs` 接受 `kind`、`query`、`author`、`title`、`since`、`until`、`sort` 和 `first`。未知或重复的参数返回 `400 INVALID_QUERY_PARAMETERS`。
- **请求体**：JSON 对象，最大 64 KiB。未知字段、`null` 值、重复键和尾随数据都会被拒绝。查询路由的字段名首字母大写（`Revision`、`Pattern`）；管理路由使用小写字段名（`name`、`policy`）。
- **凭据**：使用 `Authorization: Bearer <service token>`，个人 Key 则为 `Bearer sgk_…`；否则使用浏览器会话或匿名访问。无效凭据返回 `401`，绝不会回退为匿名访问。
- **时间**：每个请求有 30 秒的处理预算；超时的请求返回 `503 QUERY_DEADLINE_EXCEEDED`，意外的依赖故障返回 `503 DEPENDENCY_UNAVAILABLE`。
<!-- /context:section -->

<!-- context:section id="query" -->
## 查询路由

开启公开读取时，匿名访客可以使用这些路由；所有凭据也都可以使用，范围限于调用方能看到的仓库：匿名调用方只能看到公开仓库，私有仓库只对其创建者、管理者、在网站上登录的管理员和服务令牌可见。调用方看不到的私有仓库会返回 `404 REPOSITORY_NOT_FOUND`，与未登记的名称完全相同。

| 方法 | 路径 | 请求体 | 返回 |
| --- | --- | --- | --- |
| GET | `/v1/capabilities` | — | 协议与支持的操作：`search`、`read`、`list`、`diff`、`resolve`、`refs`、`availability`、`commits` 和 `prepare` |
| GET | `/v1/repos` | —（用 `after` 翻到下一页） | 调用方可见的仓库，每页 100 个；已登录调用方还会得到每个仓库的 `managers` |
| GET | `/v1/repo/availability` | — | 单个仓库：保留的版本、分支最新提交、路径组和任务，以及它的 `code_provider` 和登记时固定的 `code_host`，附带 `ETag` |
| GET | `/v1/repo/commits` | — | 与 availability 相同 |
| GET | `/v1/repo/plugins` | —（可选 `revision`） | 该提交中发现的仓库插件，不会运行它们 |
| GET | `/v1/repo/refs` | —（可选 `kind`、`query`、`author`、`title`、`since`、`until`、`sort`、`first`、`after`） | 仓库分支或标签的一页列表；见 [分支、标签与 resolve](#branches-tags-and-resolve) |
| POST | `/v1/repo/resolve` | `{"Revision"}` | 分支、标签或完整 SHA 对应的固定提交、它的查找方式及其是否已建索引 |
| POST | `/api/search` | `{"Revision","Pattern","FixedStrings","IgnoreCase","Glob","Paths","Output"}` | 搜索命中和 `Meta`；见 [搜索语法](query-syntax.md) |
| POST | `/v1/repo/read` | `{"Revision","Path","StartLine","EndLine"}` | 一个文件的指定行范围 |
| POST | `/v1/repo/list` | `{"Revision","Path","First","After"}` | 单个目录的直接子项 |
| POST | `/v1/repo/diff` | `{"Base","Head","Paths","First","After"}` | 两个提交之间变更的文件与补丁 |

除 `diff` 外，`Revision` 均为可选；`diff` 必须提供 `Base` 和 `Head`。只有 `resolve` 接受未被监控的分支名和标签名；其他路由都只接受监控分支或完整 SHA，因此其他分支或标签要先解析，再使用返回的 SHA。`read_many` 没有 HTTP 路由，只以 MCP 工具的形式提供。

<!-- /context:section -->

<!-- context:section id="refs-resolve" -->

## 分支、标签与 resolve

`resolve`（MCP 工具或 `POST /v1/repo/resolve`）把一个版本转换为一个完整提交。它从不下载代码，也不建索引。

| `revision` | 解析方式 | `source` |
| --- | --- | --- |
| 省略，或一个监控分支（也可写作 `refs/heads/<name>`） | 最近一次同步的最新提交。不会询问远端，因此可能落后于远端的最新提交；与监控分支同名的裸名称不会检查是否存在同名标签，要使用标签请传 `refs/tags/<name>` | `observed` |
| 40 位小写完整 SHA | 该仓库已观察到或已保留的版本；否则返回 `REVISION_NOT_ELIGIBLE` | `observed` |
| 其他任意分支名或标签名、`refs/heads/<name>` 或 `refs/tags/<name>` | 引用目录新鲜且未截断时使用仓库的引用目录；否则在远端精确查找：只把该引用的提交对象和标签对象（不含文件树）下载到临时目录，确认对象类型和提交详情后删除该目录 | `catalog` 或 `remote` |
| 短 SHA、`HEAD`、版本表达式、其他引用命名空间，或包含服务不接受字符（如空格或括号）的名称 | 拒绝，返回 `SHORT_SHA_UNSUPPORTED` 或 `INVALID_REVISION`；这类名称仍会出现在 `refs` 中 | — |

| 输出字段 | 含义 |
| --- | --- |
| `commit`、`indexed`、`committer_time` | 完整 SHA、是否已有搜索索引，以及提交者时间 |
| `kind` | `branch`、`tag` 或 `commit`（传入的是 SHA） |
| `source` | `observed`、`catalog` 或 `remote`，见上表 |
| `monitored` | 该分支是否是仓库的监控分支之一 |
| `ref` | 已知时为完整引用名，例如 `refs/heads/main` |
| `created_at`、`author`、`title` | 已知时为提交时间、作者和标题；对于附注标签，则是打标签的时间、打标签者和标签消息的第一行，而 `committer_time` 仍是提交的时间 |
| `hint` | 提交没有索引时出现：说明当前调用方可以准备该完整 SHA，或者需要由仓库管理者准备 |

同时是分支和标签的裸名称返回 `REF_AMBIGUOUS` 并列出两者；请传完整形式。不存在的名称返回 `REF_NOT_FOUND`，最终指向树或 blob 的标签返回 `REF_NOT_COMMIT`。解析以实际下载到的引用为准，因此在列出与下载之间移动过的分支会解析到实际下载的提交；无法验证的对象返回可重试的 `REMOTE_UNAVAILABLE`。相同的并发远端查询共用一个请求，其结果（包括“未找到”）会短暂缓存（见 [限制](#limits)）。可见性最先检查，因此调用方看不到的私有仓库会直接返回 `404 REPOSITORY_NOT_FOUND`，不会询问远端。通过 HTTP 调用时，响应包含相同的字段，以及已存储版本记录的其余字段。

`refs`（MCP 工具或 `GET /v1/repo/refs?repo=`）列出已登记仓库的分支或标签的一页。列出操作从不建索引。

| 参数 | 取值 | 默认值 |
| --- | --- | --- |
| `kind` | `branch`、`tag` 或 `all` | `branch` |
| `query` | 分支名或标签名的子串，不区分大小写 | — |
| `author` | 作者姓名或邮箱的子串，不区分大小写；附注标签匹配打标签者 | — |
| `title` | 提交标题或附注标签消息第一行的子串，不区分大小写 | — |
| `since`、`until` | RFC 3339 或 `YYYY-MM-DD`，与 `created_at` 比较 | — |
| `sort` | `created`（最新在前）或 `name` | `created`；只有名称的目录为 `name` |
| `first` | 1–100 | 30 |
| `after` | 上一页的 `next_cursor`，其他参数保持不变 | — |

无效值返回 `400`，错误码为 `INVALID_KIND`、`INVALID_SORT`、`INVALID_LIMIT`、`INVALID_CURSOR` 或 `INVALID_TIME`。

| 响应字段 | 含义 |
| --- | --- |
| `repo` | 仓库 |
| `catalog` | `state`、`reason`、`refreshed_at`、`total` 和 `truncated`，说明见下文 |
| `sort` | 实际采用的排序：`created` 或 `name` |
| `refs` | 条目，包含 `name`、`ref`、`kind`、`monitored` 和 `indexed`。已验证最终指向提交的条目还包含 `commit`、`created_at`、`committer_time`、`author` 和 `title`；附注标签还包含 `annotated`；指向树、blob 或无法验证对象的标签以 `object` 和 `target_type` 代替 `commit` |
| `next_cursor`、`has_more` | `has_more` 为 `true` 时，把 `next_cursor` 作为 `after` 传入 |
| `hint` | 指引信息，例如说明截断的列表只覆盖了仓库的一部分 |

对于分支和轻量标签，`created_at` 是提交时间；对于附注标签，则是打标签的时间。

| `catalog.state` | 含义 |
| --- | --- |
| `ready` | 新鲜的目录，含提交详情 |
| `stale` | 目录已过期或刷新失败；返回上一次成功的目录及其 `refreshed_at`，同时在后台刷新 |
| `names_only` | 只有名称，没有提交详情。`catalog.reason` 为 `filter_unsupported`（远端无法只发送不含文件树的提交对象）、`ref_limit`（分支或标签超过 200,000 个）或 `size_limit`（下载超过 256 MiB）。排序默认为 `name`；显式传入 `author`、`title`、`since`、`until` 或 `sort=created` 会返回 `REFS_FILTER_UNAVAILABLE` |

`catalog.truncated: true` 表示某一类引用只列出了前 200,000 个名称，`query` 也只在这些名称中搜索；用完整名称调用 `resolve` 不依赖目录。游标是一个偏移量，因此翻页期间如果发生刷新，可能会重复或跳过少量条目。

目录保存在服务内存中。刷新时先列出远端引用，因此在下载任何内容之前就会应用引用数量上限；随后把分支和标签的提交对象与标签对象（不含文件树）下载到临时目录，解析后即删除。目录在 5 分钟与上次刷新耗时的三倍中较长的时间内保持新鲜；目录过期后仍会继续提供，同时每个仓库在后台运行一次刷新。如果还没有任何目录，请求会在剩余截止时间减去 2 秒的时间内等待首次刷新，否则返回 `REFS_CATALOG_PREPARING` 并带 `Retry-After`，刷新继续进行；在此期间解析完整名称不受影响。刷新失败时，如果之前没有目录，则返回远端错误；如果有，则返回过期的目录。

<!-- /context:section -->

<!-- context:section id="admin" -->
## 管理路由

这些路由需要服务令牌或管理员的浏览器会话。仓库的管理者也可以对该仓库使用所有带 `?repo=` 的路由，其他人会得到 `403 REPOSITORY_MANAGEMENT_DENIED`。站点允许已登录用户登记仓库时，任何已登录用户都可以登记仓库并成为其管理者；否则登记会返回 `403 REGISTRATION_DISABLED`。用户、站点设置、全局代码源令牌和其他站点级路由仍仅限管理员。个人 API Key 在这里只能调用 `POST /api/admin/v1/repo/prepare`，范围是其所有者管理的仓库；若所有者是管理员，则为该 Key 能看到的任何仓库。其他所有管理路由都返回 `403 ACCESS_DENIED`。少数读取路由（`GET /api/admin/v1/repos`、`GET /api/admin/v1/repo` 和 `GET /api/admin/v1/statistics`）也对匿名读取开放，但仅限调用方能看到的内容；统计信息会略去调用方看不到的仓库名称。

| 方法 | 路径 | 请求体或请求头 | 用途 |
| --- | --- | --- | --- |
| GET | `/api/admin/v1/statistics` | — | 请求与任务统计，以及最近一轮索引回收 |
| GET | `/api/admin/v1/instances` | — | 实例心跳 |
| GET | `/api/admin/v1/repos` | — | 仓库目录 |
| POST | `/api/admin/v1/repos` | 登记字段；可选 `Idempotency-Key` | 登记仓库（`202`）；名称已被登记时返回 `409 REPOSITORY_EXISTS`，并在 `creator` 中给出登记人 |
| GET | `/api/admin/v1/repo` | — | 仓库信息，附带 `ETag` |
| PATCH | `/api/admin/v1/repo` | 更新字段；`If-Match` 版本 | 修改分支、保留窗口、可见性、同步间隔、路径组、固定快照和存储预算；启用、停用或删除 |
| POST | `/api/admin/v1/repo/preview` | 更新字段 | 预览一次更新 |
| POST | `/api/admin/v1/repo/prepare` | `{"kind","commit","group"}`；可选 `Idempotency-Key` | 排队执行 `sync` 或 `index` 工作（`202`） |
| GET | `/api/admin/v1/repo/commit-options` | —（可选 `branch`） | 可供选择的最近已同步提交 |
| POST | `/api/admin/v1/repo/index/preview`、`/api/admin/v1/repo/index` | `{"branch","commit"}`；后者还需 `preview` 和 `If-Match` | 为某个提交添加索引 |
| POST | `/api/admin/v1/repo/cleanup/preview`、`/api/admin/v1/repo/cleanup` | `{"preview"}`，后者还需 `If-Match` | 删除旧索引，保留分支最新提交和已固定快照的索引 |
| POST | `/api/admin/v1/repo/delete/preview`、`/api/admin/v1/repo/delete` | `{"preview"}`，后者还需 `If-Match` | 永久删除仓库数据 |
| POST | `/api/admin/v1/repo/jobs/cancel` | `{"job_id"}` | 取消任务 |
| POST | `/api/admin/v1/repo/purge` | `If-Match` 版本 | 清除已停用且已删除的仓库 |
| POST | `/api/admin/v1/repo/managers` | `{"add":"<user id>"}` 或 `{"remove":"<user id>"}`；`If-Match` 版本 | 添加或移除管理者（最多 50 位）；用户不存在或已停用时返回 `404 USER_NOT_FOUND` |
| GET | `/auth/users/search?q=` | — | 已登录用户按姓名或邮箱查找最多 20 位启用中的用户，用于选择管理者 |

登记和 `PATCH` 还接受 `git_timeout_minutes`（0 表示继承站点默认值；15、30、45 或 60 表示覆盖）和 `public_read`（`false` 表示将仓库设为私有）。`PATCH` 还接受 `pinned_commits`，即保留策略和容量释放都不会移除的完整 SHA（最多 4096 个，否则返回 `PIN_LIMIT`）；固定只能在这里添加，准备不会添加固定。它还接受 `max_storage_bytes`，即仓库的存储预算，范围 1 GiB 到 10 TiB（默认 100 GiB）；用量达到预算时，会先释放最旧的未受保护快照。仓库详情还包含 `can_manage`，对已登录调用方还会返回 `creator` 和 `managers`；`GET /access-policy` 还返回 `user_repositories`。登记字段见 [登记和管理仓库](../../../sop/source-graph/registering-repositories.md)。

手动准备在网站、HTTP 和 MCP 之间按仓库统一限速。与已排队或正在运行的任务完全相同（同一路径组、类型和版本）的请求会直接返回该任务，不增加队列负载。距该仓库上一次被接受的请求不足 30 秒的其他新手动请求，会返回 `429 RATE_LIMITED` 并附带 `Retry-After`；一次为 Monorepo 所有路径组排队的请求只计一次，定时任务不受限速。
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

`/sourcegraph/mcp` 使用无状态的 Streamable HTTP，响应为 JSON；服务端标识自己为 `context-sourcegraph`。每个工具都只作用于该凭据能看到的仓库。可用的工具集取决于凭据：

| 凭据 | 工具 |
| --- | --- |
| 匿名（已开启公开读取） | 只读：除 `prepare` 外的全部工具 |
| 所有者是管理员或至少管理一个仓库的个人 Key | 只读工具加上 `prepare`，范围是所有者管理的仓库；若所有者是管理员，则为该 Key 能看到的任何仓库；限流为每个 Key 每分钟 10 次、总计每分钟 60 次 |
| 其他个人 Key | 只读：除 `prepare` 外的全部工具 |
| 服务令牌 | 全部工具 |

Key 的所有者是否管理某个仓库最多缓存一分钟，因此新添加的管理者可能要稍等片刻才能看到 `prepare`。每次 `prepare` 调用仍会按当前的角色和管理者名单进行检查。

可选的连接参数 `?plugins=` 用于设置 `read` 和 `read_many` 的默认插件选择：`auto`、`off`，或最多 16 个以逗号分隔的名称。无效值返回 `400 INVALID_PLUGINS`。
<!-- /context:section -->

<!-- context:section id="tools" -->
## MCP 工具

| 工具 | 必填 | 可选（默认值） |
| --- | --- | --- |
| `repositories` | — | `after` |
| `availability` | `repo` | `job_id`、`include_plugins`、`revision` |
| `resolve` | `repo` | `revision`（分支名或标签名、`refs/heads/<name>`、`refs/tags/<name>` 或完整 SHA） |
| `refs` | `repo` | `kind`（`branch`）、`query`、`author`、`title`、`since`、`until`、`sort`（`created`）、`first`（30，范围 1–100）、`after` |
| `search` | `repo`、`pattern` | `revision`、`fixed_strings`、`ignore_case`、`glob`、`paths`、`output`（`content` 或 `files`）、`max_lines_per_file`（10，范围 1–1000） |
| `read` | `repo`、`path` | `revision`、`start_line`（1）、`end_line`（起始行 + 499）、`plugins` |
| `read_many` | `repo`、`files`（1–10 项，每项含 `path`、`start_line`、`end_line`） | `revision`（整批只解析一次）、`plugins` |
| `list` | `repo`、`first`（1–1000） | `revision`、`path`、`after` |
| `diff` | `repo`、`base`、`head`、`first`（1–100） | `paths`、`after` |
| `prepare` | `repo`、`idempotency_key`（8–128 字节） | `revision`、`group` |

`resolve` 和 `refs` 的行为见 [分支、标签与 resolve](#branches-tags-and-resolve)。其他工具接受监控分支或完整 SHA，对其他分支返回 `BRANCH_NOT_MONITORED`：需要时先用 `refs` 找到它，再用 `resolve` 解析，然后传入返回的 SHA。`indexed` 为 false 时，由有权准备该仓库的人先准备该 SHA。

`plugins` 是一个列表，例如 `[{"name":"context-evidence"}]`；传 `[]` 会在本次调用中关闭增强，而以 `plugins=off` 打开的连接始终关闭增强。`prepare` 接受省略版本（默认分支）、监控分支，或 40 位完整 SHA。尚未同步的 SHA 会作为普通快照拉取：准备不会固定它，因此保留策略和存储预算会像对待其他快照一样按顺序释放它，只有 `pinned_commits` 才能永久保留它，详见 [登记和管理仓库](../../../sop/source-graph/registering-repositories.md)。它是异步的：重复的相同请求会返回已排队或正在运行的任务，30 秒内的其他新请求会返回 `RATE_LIMITED` 及需要等待的秒数，之后请轮询 `availability`。

把仓库、原始完整 SHA 和路径作为一个整体的来源标识：不要自行重建 SHA，也不要在另一个仓库中复用它。按仓库和版本对 `read_many` 请求分组，使用 `search` 或 `list` 返回的路径，并把 `end_line` 作为包含在内的绝对行号，而不是行数。

通过 HTTP 调用 `availability` 时还会返回 `job_failures`，即失败任务摘要的有限历史，其保留规则见 [运维：日常运维与排障](../../../sop/source-graph/operations.md)。通过 MCP 用指定的 `job_id` 调用 `availability` 时，如果实时任务已被清理但失败摘要仍在，会返回 `job_failure` 和 `job_lookup.state=archived_failure`。这只是历史证据，不代表当前已就绪，也不是可以继续执行的任务；没有历史记录也不意味着任务成功。
<!-- /context:section -->

<!-- context:section id="output" -->
## MCP 输出

`search`、`read` 和 `read_many` 返回可读文本，而不是原始 JSON：

- **search** 依次以 `Repository`、`Commit`、`Status`、`Partial`、`Truncated`、一行 `Coverage`、已登记的 `Paths` 和 `Groups`，以及返回文件数与总文件数开头，然后列出每个 `File` 及其带行号的匹配行。
- **read** 以 `Repository` 开头，接着是 `Path`、`Commit` 和 `Lines: start-end`；还有剩余内容时给出续读字段（`Truncated`、`HasMore`、`NextStartLine`），并附上符号链接、子模块和 LFS 指针的说明，最后是 `N: text` 格式的带行号内容。
- **read_many** 为每一项返回一个文本块，每块包含 `Item N; RequestedLines`，该项失败时有一行 `Error`，其余为相同的文件头和内容行。

插件输出追加在所属项之后；插件诊断信息放在单独的块中，绝不会替换原始文本。其他工具返回紧凑的 JSON；`resolve` 返回 `commit`、`indexed`、`committer_time`、`kind`、`source` 和 `monitored`，存在时还返回 `ref`、`created_at`、`author`、`title` 和 `hint`；`refs` 返回 [分支、标签与 resolve](#branches-tags-and-resolve) 中描述的分页结果。错误以标记为错误的工具结果返回，其文本为 `{"code","message"}`，未就绪状态会附带恢复提示。
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
| 引用分页 | 1–100 个条目，默认 30 |
| 引用目录大小 | 200,000 个分支和 200,000 个标签（含详情）；超出部分只保留名称，并标记 `truncated` |
| 内存中的引用目录 | 所有仓库合计 1,000,000 个引用；超出时丢弃最近最少使用的目录 |
| 引用目录新鲜度 | 5 分钟与上次刷新耗时的三倍，取较长者；每个仓库同时 1 个刷新，每个实例同时 4 个 |
| 引用临时下载 | 每次目录刷新 256 MiB，每次 resolve 查询 16 MiB，所有下载合计 4 GiB，始终遵守实例的空闲空间预留 |
| 远端引用查询 | 每个仓库同时 2 个，每个实例同时 8 个，运行中与等待中合计 64 个；结果（包括“未找到”）缓存 30 秒（10,000 条）；失败后按仓库退避，从 10 秒到 5 分钟 |
| 快照 | 每个路径组 4,096 个；释放最旧的未受保护快照以腾出空间 |
| 固定快照 | 每个仓库 4,096 个 |
| 请求体 | 64 KiB |
<!-- /context:section -->

<!-- context:section id="errors" -->
## 错误格式

HTTP 错误返回一个 JSON 体，其中包含 `Error` 消息，以及含有 `Protocol`、`RequestID`、`Status`、`Code` 和 `Retryable` 的 `Meta`；如果拒绝时已知最早可重试的时间（例如受限速的准备请求或繁忙的远端），还会设置 `Retry-After`。传输层错误码包括 `NOT_FOUND`、`METHOD_NOT_ALLOWED`、`INVALID_QUERY_PARAMETERS`、`INVALID_REQUEST`、`AUTHENTICATION_REQUIRED`、`ACCESS_DENIED`、`RATE_LIMITED`、`PRECONDITION_REQUIRED`、`QUERY_DEADLINE_EXCEEDED` 和 `DEPENDENCY_UNAVAILABLE`。`INDEX_NOT_READY`、`REVISION_NOT_ELIGIBLE`、`INVALID_PATTERN` 或 `READ_BUDGET_EXCEEDED` 等操作错误码有各自的状态码；管理类错误码 `REPOSITORY_MANAGEMENT_DENIED`、`REGISTRATION_DISABLED`、`REPOSITORY_EXISTS`、`USER_NOT_FOUND`，固定与预算校验错误码 `PIN_LIMIT`、`INVALID_STORAGE_BUDGET`，以及 `GIT_REPOSITORY_UNAVAILABLE` 等 Git 拉取错误码也是如此，其中 `GIT_REPOSITORY_UNAVAILABLE` 同时涵盖仓库不存在和凭据看不到该仓库两种情况。对于未登记的名称和调用方看不到的私有仓库，都会返回 `REPOSITORY_NOT_FOUND`。

分支、标签、远端与容量相关错误码：

| 错误码 | 状态码 | 含义 |
| --- | --- | --- |
| `REF_NOT_FOUND` | 404 | 远端不存在该名称的分支或标签；名称区分大小写，请用 `refs` 搜索 |
| `REF_AMBIGUOUS` | 409 | 分支和标签同名；请传 `refs/heads/<name>` 或 `refs/tags/<name>` |
| `REF_NOT_COMMIT` | 409 | 该标签最终指向树或 blob，无法用于读取代码 |
| `REFS_CATALOG_PREPARING` | 503 | 首次列出仍在准备中；请在 `Retry-After` 之后重试，或在此期间解析完整名称 |
| `REFS_FILTER_UNAVAILABLE` | 409 | 目录只有名称；请用 `query` 过滤并按名称排序 |
| `BRANCH_NOT_MONITORED` | 404 | `resolve` 以外的操作收到了未被监控的分支；请先把它解析为 SHA |
| `REMOTE_ACCESS_DENIED` | 502 | 该仓库使用的代码源令牌无法读取其远端，应由仓库管理者检查。原因不在调用方自己的 Key |
| `REMOTE_UNAVAILABLE` | 502 或 503 | 远端不可用、超时或正在退避，等待中的查询过多，或某个引用的对象无法验证；可重试，并带 `Retry-After` |
| `INSUFFICIENT_STORAGE` | 503 或 507 | 实例的磁盘空闲空间低于预留值；这不是仓库的存储预算 |
| `RECLAIM_FAILED` | 503 | 无法安全释放较早的快照，或已释放的快照尚未回收；回收会在后台继续，请稍后重试 |
| `REPOSITORY_STORAGE_LIMIT` | 409 | 受保护的快照（分支最新提交、固定快照和活动任务所用的快照）本身就占满了存储预算，或正在进行的准备超出预算的 120%；请移除不再需要的固定或提高预算 |
| `SNAPSHOT_LIMIT` | 409 | 受保护的快照本身就占满了某个路径组的 4,096 个版本；请移除不再需要的固定 |

未受保护的快照从不导致 `SNAPSHOT_LIMIT` 或 `REPOSITORY_STORAGE_LIMIT`：它们会按从旧到新的顺序被释放以腾出空间。[运维：日常运维与排障](../../../sop/source-graph/operations.md) 解释了常见错误码及处理方法。
<!-- /context:section -->
