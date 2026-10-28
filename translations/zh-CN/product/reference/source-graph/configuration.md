---
title: 配置
description: 一处汇总 Source Graph 的全部设置：环境变量、构建时的部署设置、代码源、运行时的站点设置、仓库策略、插件限制和数据目录布局。
translation:
  locale: zh-CN
  artifact_ref: f9fdba75-0059-4d7d-8e58-17859b4cfea0
  source_digest: af9a230ebbb5764a425e5d2b51faf93d3b78d210927c99f486432b404758f7bd
  translated_at: 2026-10-28T10:00:49.620Z
---

# 配置

<!-- context:section id="layers" -->
Source Graph 的配置分为四层，每层的负责人和生效周期各不相同：

| 层级 | 位置 | 修改者 | 生效时机 |
| --- | --- | --- | --- |
| 环境变量 | 进程环境，例如 Fly.io secrets 或容器 env 文件 | 运维人员 | 重启后 |
| 部署设置 | `config/deployment.json`，构建时嵌入 | 构建镜像的人 | 下次构建后 |
| 站点设置 | 数据库，在 **Settings**（设置）页面编辑 | 管理员 | 立即生效，带版本校验 |
| 仓库策略 | 数据库，按仓库在登记时或之后设置 | 管理员 | 下次同步时 |

代码源由部署默认值、网站上的自定义 Git 设置和可选的启动文件合并而成，见 [代码源](#code-sources)。

机密信息，包括 GitHub 和自定义 Git 令牌、OAuth 客户端密钥、服务令牌、凭据加密密钥以及带密码的数据库 URL，只能放在环境变量或数据库中，绝不能放进部署文件、启动文件或镜像。部署步骤见 [自部署与数据库选择](../../../sop/source-graph/self-hosting.md)。
<!-- /context:section -->

<!-- context:section id="environment" -->
## 环境变量

| 变量 | 默认值 | 用途 |
| --- | --- | --- |
| `SOURCEGRAPH_LISTEN` | `0.0.0.0:8080` | 监听地址 |
| `SOURCEGRAPH_ORIGIN` | `http://localhost:8080` | 公开源地址，用于登录回调和链接 |
| `SOURCEGRAPH_DATA_ROOT` | `/data` | 存放 Git 镜像、索引和清单的数据目录；必须是绝对路径 |
| `SOURCEGRAPH_DATABASE` | `sqlite` | `sqlite`、`postgres` 或 `mongodb` |
| `DATABASE_URL` | SQLite 为 `<data root>/sourcegraph.db` | 数据库位置或连接字符串 |
| `SOURCEGRAPH_MIN_FREE_BYTES` | `1073741824`（1 GiB） | 剩余空间下限，低于该值时拉取和建索引会停止，并返回 `INSUFFICIENT_STORAGE` |
| `SOURCEGRAPH_API_TOKEN` | 缺省时自动生成 | 首次启动时作为服务凭据的初始值（至少 32 个字符）；之后使用保存在数据库中的值。匹配的 Bearer 令牌拥有完整的 HTTP API 访问权限，但站点设置除外，站点设置需要浏览器会话。CLI 也读取同一变量 |
| `SOURCEGRAPH_CREDENTIAL_KEY` | 未设置 | 32 字节的 Base64，在升级一个用它加密过代码令牌的实例时读取一次；否则导入已有的 `code-credentials.key`，全新数据库则生成自己的密钥。此后密钥保存在数据库中 |
| `SOURCEGRAPH_GITHUB_TOKEN` | 未设置 | GitHub 令牌，仅在尚未保存全局 GitHub 令牌时使用；未设置时仍读取旧变量 `SOURCEGRAPH_GIT_TOKEN` |
| `SOURCEGRAPH_CUSTOM_GIT_TOKEN` | 未设置 | 自定义 Git 令牌，仅在尚未保存全局自定义 Git 令牌时使用 |
| `SOURCEGRAPH_CONFIG_FILE` | 未设置 | 覆盖代码源的 JSON 启动文件路径，见 [代码源](#code-sources) |
| `GOOGLE_CLIENT_ID`、`GOOGLE_CLIENT_SECRET` | 未设置 | Google 登录，首次配置时一并导入数据库 |
| `GITHUB_CLIENT_ID`、`GITHUB_CLIENT_SECRET` | 未设置 | GitHub 登录，首次配置时一并导入数据库 |
| `SOURCEGRAPH_SEED_DEMO` | 未设置 | 设为 `true` 时，若 `context4ai/context` 和 `context4ai/sourcegraph` 尚未登记，会在启动时登记它们 |

这些密钥以数据库为准：一旦保存，修改对应的环境变量不会轮换它，替换主机时只需要数据库和非机密配置。请完整备份数据库，包括其中的密钥。升级方法见 [自部署与数据库选择](../../../sop/source-graph/self-hosting.md)。使用 PostgreSQL 或 MongoDB 时，多个实例可以共享同一个数据库，同时各自保留自己的数据目录。
<!-- /context:section -->

<!-- context:section id="deployment" -->
## 部署设置

`config/deployment.json` 会被编译进二进制文件，描述的是这个部署是什么，而不是如何保障其安全：

| 字段 | 社区版默认值 | 含义 |
| --- | --- | --- |
| `code_sources` | GitHub，然后是一个没有托管地址的自定义 Git 代码源 | 本构建提供的代码源，按显示顺序排列，每项包含 `id`、`name`、`host`、`username`、`token_env`、`anonymous` 和 `editable` |
| `example_repo` | `context4ai/context` | 界面示例中使用的仓库 |
| `public_url` | `https://context4ai.org/sourcegraph` | 在链接和连接代码片段中显示的公开地址 |
| `source_repository` | `https://github.com/context4ai/sourcegraph` | 界面中显示的源码链接 |
| `sso` | Google 签发方和端点，客户端 ID 为空 | 登录提供方元数据，另含 `registration_url`，即运维人员创建 OAuth 客户端的提供方控制台；不含任何机密 |

以自己的名称或地址部署的 fork 需要修改此文件并重新构建；登录所用的客户端 ID 和密钥仍来自环境变量。
<!-- /context:section -->

<!-- context:section id="code-sources" -->
## 代码源

每个实例恰好提供两个代码源：先是 GitHub，然后是一个自定义 Git 托管地址，例如自建的 Gitea 或 GitLab。它们的字段由三层合并而成，后面的非空值优先：

1. **部署默认值**：`config/deployment.json` 中的 `code_sources` 决定有哪些代码源及其顺序。自定义代码源默认没有托管地址。
2. **网站**：管理员在 **System settings › Code sources**（系统设置 › 代码源）的自定义 Git 卡片上编辑该代码源的名称、托管地址和 HTTPS 用户名，全局令牌也在同一张卡片上，修改立即生效。
3. **启动文件**：服务启动时，`SOURCEGRAPH_CONFIG_FILE` 指定的 JSON 文件按代码源 id 覆盖字段。

```json
{"code_sources": {"git": {"name": "Gitea", "host": "https://git.example.com", "username": "oauth2", "token_env": "SOURCEGRAPH_CUSTOM_GIT_TOKEN"}}}
```

| 字段 | 规则 |
| --- | --- |
| `name` | 显示名称 |
| `host` | HTTPS 源地址，不含路径、用户、查询参数或片段；以小写存储 |
| `username` | 随令牌发送的 Git 用户名，1–64 个字母、数字、`.`、`_`、`@` 和 `-`；默认 `oauth2` |
| `token_env` | 存放默认令牌的环境变量名，只能是大写字母、数字和 `_`；网站上不能设置。GitHub 默认为 `SOURCEGRAPH_GITHUB_TOKEN`，未设置时读取 `legacy_token_env` 中的旧变量 `SOURCEGRAPH_GIT_TOKEN`；启动文件设置 `token_env` 后不再读取旧变量 |

- 启动文件只能覆盖已有的 id；未知 id 或无效值会导致启动失败。令牌绝不能写进该文件。
- 启动文件设置的字段在网站上只读；在网站上修改会返回 `409 CODE_SOURCE_LOCKED`。
- 仓库保留登记时记录的托管地址（`code_host`）。启动时，没有该字段的记录会补上当前托管地址；已记录的地址从不改写，与当前配置不一致时只记日志。
- 只要有任何仓库记录（包括已删除的）使用自定义代码源，修改其托管地址就会返回 `409 CODE_SOURCE_IN_USE`；名称和用户名仍可修改。
- `GET /sourcegraph/v1/code-sources` 按顺序返回生效的代码源，`locked` 列出由启动文件设置的字段；它从不返回令牌或变量名。
<!-- /context:section -->

<!-- context:section id="site" -->
## 站点设置

管理员可以在 **Settings** 页面或通过 `/api/admin/settings` 编辑三个分区。每次保存都会携带该分区的当前版本；过期的版本会被拒绝，避免两位管理员在不知情的情况下互相覆盖。

| 分区 | 字段 | 默认值 | 含义 |
| --- | --- | --- | --- |
| `repository_defaults` | `git_timeout_minutes` | 15 | 默认的 Git 拉取与对象补全超时：15、30、45 或 60 分钟。仓库默认继承它，也可以单独设置；新任务使用开始时的当前值 |
| | `retention_mode` | `days` | 新登记仓库的默认保留策略：`days` 或 `count` |
| | `retention_days` | 30 | 保留的历史天数，1–365 |
| | `retention_count` | 20 | 每个分支保留的提交数，1–4,096 |
| `access` | `public_read` | `true` | 匿名访客能否搜索和阅读公开仓库 |
| | `allow_registration` | `false` | 首次登录时是否创建账号 |
| | `registration_notice_zh`、`registration_notice_en` | 内置提示 | 向无法注册的人显示的文本 |
| | `allow_user_repositories` | `false` | 是否允许已登录用户登记仓库；登记者成为该仓库的管理者 |
| `code_source` | `name`、`host`、`username` | 空，即沿用部署中的值 | 自定义 Git 代码源，见 [代码源](#code-sources) |

对 `/api/admin/settings` 的请求必须使用浏览器会话；携带 `Authorization` 请求头的请求会被拒绝。全局代码令牌在同一页面单独保存。**Storage**（存储）页面另外负责迁移 Git 镜像的存放位置；见 [运维](../../../sop/source-graph/operations.md)。
<!-- /context:section -->

<!-- context:section id="policy" -->
## 仓库策略

每份登记信息都有自己的策略，初始值取自仓库默认值：

| 设置 | 范围 | 默认值 |
| --- | --- | --- |
| 监控分支 | 1–8 个 | 默认分支 |
| 保留策略 | 天数 1–365 **或**提交数 1–4,096，二者不可同时设置 | 站点默认值 |
| 同步间隔（分钟） | 1、3、5、10、30、60、180、360、720 或 1440 | 5 |
| 索引模式 | 整个仓库，或 Monorepo 中已登记的路径组 | 整个仓库 |
| Git 超时（`git_timeout_minutes`） | 0 表示继承站点默认值，或 15、30、45、60 | 继承 |
| 管理者 | 除管理员外，最多 50 位可以管理该仓库的已登录用户 | 登记者 |
| 公开读取 | 开或关 | 开 |
| 代码源（`code_provider`） | `github` 或 `git`，登记时确定；先尝试登记人自己为该代码源保存的令牌，再尝试全局令牌 | `github` |
| 托管地址（`code_host`） | 登记时代码源的托管地址，之后每次拉取都使用它 | — |

关闭公开读取的仓库只对匿名访客隐藏；所有已登录用户仍然可以阅读。分支和保留策略如何决定哪些提交可被搜索，见 [登记仓库](../../../sop/source-graph/registering-repositories.md)。
<!-- /context:section -->

<!-- context:section id="plugins" -->
## 插件限制

Wasm 证据插件在服务内部运行，受 `SOURCEGRAPH_PLUGINS_*` 变量设置的资源防护约束。无效值会导致启动失败，而不是移除对应的防护。

| 变量后缀 | 默认值 | 限制内容 |
| --- | --- | --- |
| `DISABLED` | 未设置 | 设为 `1` 时禁用插件 |
| `TIMEOUT` | `10s` | 每次运行的墙钟时间（Go duration 格式） |
| `MEMORY_MIB` | 256 | 每个实例的内存，最多 4,096 |
| `ARTIFACT_BYTES` | 32 MiB | 插件模块大小 |
| `METADATA_BYTES` | 256 KiB | 插件元数据大小 |
| `FILE_BYTES` | 32 MiB | 插件读取的单个文件大小 |
| `READ_BYTES` | 128 MiB | 每次运行读取的总字节数 |
| `READ_CALLS` | 1,024 | 每次运行的文件读取次数 |
| `OUTPUT_BYTES` | 2 MiB | 输出大小 |
| `CONCURRENCY` | 8 | 并发运行数 |
| `CACHE_ENTRIES` | 16 | 保留的已编译模块数 |
| `IDLE_INSTANCES` | 8 | 保留的预热实例数 |
<!-- /context:section -->

<!-- context:section id="fixed" -->
## 内置限制

有些限制在代码中写死，无法配置：请求体最大 64 KiB，请求截止时间 30 秒，HTTP 服务器超时分别为请求头 5 秒、读取 120 秒、写入 125 秒，以及 [HTTP 与 MCP 接口](http-and-mcp.md) 中描述的搜索、读取、列目录和差异分页大小。搜索引擎作为本地辅助进程运行在 `127.0.0.1:6070` 上，从不对外暴露。
<!-- /context:section -->

<!-- context:section id="data" -->
## 数据目录

| 数据根目录下的路径 | 内容 | 可否重建 |
| --- | --- | --- |
| `sourcegraph.db` | SQLite 数据库：用户、Key、设置、登记信息、凭据，以及应用密钥及其加密密钥 | 否 |
| `code-credentials.key` | 仅存在于从旧版本（凭据密钥保存在磁盘上）升级而来的实例；首次启动时导入数据库，之后只为恢复升级前的备份而保留。全新数据库不会创建密钥文件 | 升级验证完成前不可 |
| `storage.json` | 本机上 Git 镜像的存放位置 | 否 |
| `space/` | 裸 Git 镜像，除非已在 **Storage** 页面迁移 | 可以，从远端重新拉取 |
| `index/`、`manifests/` | 搜索索引分片及描述它们的清单 | 可以，重新建索引即可 |

容器以非特权用户（uid 10001）运行，需要对整个数据根目录拥有写权限。
<!-- /context:section -->
