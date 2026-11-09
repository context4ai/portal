---
title: 登记和管理仓库
description: 登记 GitHub 或自定义 Git 仓库并设置分支、保留窗口、可见性和同步间隔，为私有仓库提供令牌，并将 Monorepo 拆分为路径组。
translation:
  locale: zh-CN
  artifact_ref: 56556e26-509e-4b66-a927-11c76940f7e9
  source_digest: cadb5508a93abbb050dd9d6ca8e92e44cbebf59975ebbe90f733da0f56735d75
  translated_at: 2026-11-09T01:07:08.071Z
---

# 登记和管理仓库

<!-- context:section id="goal" -->
仓库登记后即可被搜索：Source Graph 会同步其监控分支最新提交的快照，保留其保留策略允许的快照，并为每个分支最新提交建索引。登记需要管理员（在网站上登录）或实例的服务令牌。管理员开启 **Let signed-in users register repositories**（允许已登录用户登记仓库）后，任何已登录用户也可以登记仓库并成为其管理者，见 [仓库管理者](#repository-managers)。

在网站上打开 **Repositories**（仓库），选择 **Register a repository**。列表可以按管理者筛选，并按磁盘用量排序。通过 HTTP 时，将相同的字段发送到 `POST /sourcegraph/api/admin/v1/repos`，可以附带 `Idempotency-Key` 请求头，避免重试时重复登记：

```json
{
  "name": "context4ai/context",
  "code_provider": "github",
  "public_read": true,
  "index_mode": "full",
  "policy": { "default_branch": true, "count": 20 },
  "sync_interval_minutes": 180
}
```

请求返回 `202 Accepted`，并将首次同步加入队列；仓库页面的任务标签页会显示进度。如果该名称已被登记，请求会返回 `409 REPOSITORY_EXISTS`，网站会显示是谁登记的，你可以请对方把你添加为管理者。

## 仓库管理者

管理员管理所有仓库。已登录用户登记的仓库会把该用户列为唯一的管理者；在管理者功能出现之前登记的仓库，在首次编辑名单之前把创建者视为管理者。管理者可以修改仓库设置，预览、准备和添加索引，清理，取消任务，删除和清除仓库，以及添加或移除管理者（包括自己），最多 50 位。在仓库页面按姓名或邮箱搜索已登录用户即可添加管理者。
<!-- /context:section -->

<!-- context:section id="fields" -->
## 登记字段

| 字段 | 含义 |
| --- | --- |
| `name` | 仓库在其代码源上的路径，例如 `owner/repository`（允许 `a/b/c` 这样的嵌套路径，最长 512 个字符）。Git 远程地址为 `<code source host>/<name>.git` |
| `code_provider` | 代码源：`github`（默认），或表示自定义 Git 托管地址的 `git`。它在登记时确定，同时决定托管地址和要尝试哪些令牌 |
| `public_read` | **Public repository**（公开仓库）。`true`（默认）表示公开；`false` 表示私有，只对其创建者、管理者和管理员可见，详见 [运维：登录与权限](authentication-and-access-control.md#public-and-private-repositories) |
| `index_mode` | `full`（默认）为整个仓库建索引；`monorepo` 只为路径组建索引 |
| `path_groups` | `monorepo` 模式下必填，见下文 |
| `policy.branches` | 要监控的确切分支名 |
| `policy.default_branch` | 同时跟踪远程的默认分支，每次同步时重新发现 |
| `policy.days` 或 `policy.count` | 普通快照的保留规则：自首次观察到之后的天数（1–365），或要保留的最近观察到的快照数量（1–4096），二者只能填一个。两者都省略时使用站点的仓库默认值（初始为 30 天） |
| `sync_interval_minutes` | 1、3、5、10、30、60、180、360、720 或 1440；新登记仓库默认 180 |
| `git_timeout_minutes` | Git 拉取与对象补全超时：0 或省略表示继承站点默认值（初始为 15 分钟）；15、30、45 或 60 表示覆盖 |

一个策略总共监控一到八个分支，默认分支也计算在内。标签从不拉取，因此无法搜索或读取。登记之后，仓库设置中还包含 **Pinned snapshots**（固定快照，`pinned_commits`）和 **Storage budget**（存储预算，`max_storage_bytes`），详见 [快照与存储](#snapshots-and-storage)。
<!-- /context:section -->

<!-- context:section id="code-sources" -->
## 代码源

每个实例恰好提供两个代码源，始终按以下顺序列出：

| 代码源 | `code_provider` | 托管地址 | 没有令牌时 |
| --- | --- | --- | --- |
| GitHub | `github` | `https://github.com` | 公开仓库可以匿名拉取 |
| 自定义 Git | `git` | 无，需由管理员或启动文件设置 | 必须提供令牌 |

要使用你自己的 Git 服务器，请在 **System settings › Code sources**（系统设置 › 代码源）中自定义 Git 卡片上或启动文件中设置自定义代码源的托管地址，见 [配置](../../product/reference/source-graph/configuration.md#code-sources)。没有托管地址的代码源不能用于登记（`409 CODE_SOURCE_NOT_CONFIGURED`）。

登记时会把代码源当前的托管地址记录到仓库的 `code_host` 上，之后每次拉取都使用这个地址。因此修改代码源配置永远不会挪动已登记的仓库。
<!-- /context:section -->

<!-- context:section id="private" -->
## 私有仓库的令牌

公开的 GitHub 仓库无需令牌。对于私有仓库，请把仓库所属代码源的令牌保存在以下两处之一：

- **你自己的令牌**：已登录用户在 **User settings › Code source tokens**（用户设置 › 代码源令牌）中为每个代码源保存 GitHub 或自定义 Git 令牌，他们登记的仓库会优先使用它。
- **全局令牌**：管理员在 **System settings › Code sources**（系统设置 › 代码源）中保存站点级令牌，这里每个代码源一张卡片，标明它从哪个托管地址拉取。自定义 Git 卡片还包含该代码源的名称、托管地址和 HTTPS 用户名，GitHub 卡片只有令牌。每个令牌可以设置过期时间，用于提前七天预警。它是该代码源所有仓库的兜底令牌。

每次拉取时，服务按仓库的 `code_provider` 依次尝试：

1. 创建者为该代码源保存的令牌；
2. 该代码源的全局令牌；
3. 环境令牌——GitHub 用 `SOURCEGRAPH_GITHUB_TOKEN`（未设置时仍读取旧变量 `SOURCEGRAPH_GIT_TOKEN`），自定义代码源用 `SOURCEGRAPH_CUSTOM_GIT_TOKEN`——仅在该代码源尚未保存全局令牌时使用；
4. 仅限 GitHub：匿名访问。即使是公开仓库，GitHub 也会拒绝已吊销的令牌，所以匿名访问放在最后尝试，而不是直接跳过。

两个代码源之间从不互用令牌。由于用户登记的仓库在其创建者没有令牌时会使用站点级令牌拉取，允许已登录用户登记仓库意味着他们可以登记该令牌能读取的任何仓库。拉取失败时会说明原因——`GIT_REPOSITORY_UNAVAILABLE`（仓库不存在或令牌看不到它）、`GIT_ACCESS_DENIED`、`GIT_AUTH_FAILED`、`GIT_CREDENTIAL_UNAVAILABLE` 或 `GIT_FETCH_FAILED`——仓库页面会链接到创建者的代码源令牌设置。

令牌使用实例的凭据加密密钥加密并保存在数据库中，状态显示为就绪、即将过期（七天内）、已过期、无效或无法读取。无法读取的令牌不能通过编辑其元数据修复：请输入新的令牌或清除它。内置的 Git 凭据助手只会把选中的令牌交给正在拉取的仓库所在的托管地址，并附带代码源的 HTTPS 用户名（默认 `oauth2`）。

代码源令牌只让服务能够拉取代码。谁能在 Source Graph 上读取已登记的仓库，由仓库的 **Public repository**（公开仓库）设置单独决定：取消勾选即可将仓库设为私有，此后只有其创建者、管理者和管理员能看到它。
<!-- /context:section -->

<!-- context:section id="monorepo" -->
## Monorepo 路径组

超大仓库可以用 `index_mode: "monorepo"` 加一个或多个**路径组**来登记，这样只会拉取并索引你需要的目录：

```json
{
  "name": "acme/platform",
  "index_mode": "monorepo",
  "path_groups": [
    { "name": "web", "paths": ["apps/web", "packages/ui"] },
    { "name": "api", "paths": ["services/api"] }
  ],
  "policy": { "branches": ["main"], "count": 50 }
}
```

规则如下：

- 1 到 16 个组，目录总数不超过 64 个。组名可使用字母、数字、`_` 和 `-`，最长 64 个字符；名称为空时视为 `default`。
- 路径必须是相对目录，不能包含通配符、路径穿越或 `.git`。同一组内被另一目录包含的目录会被合并；不同组之间目录重叠会被拒绝。
- 每个组都有自己的部分 Git 镜像，通过 blob 过滤拉取，因此 Git 服务器必须支持部分克隆（否则返回 `PARTIAL_CLONE_UNSUPPORTED`）。
- 搜索、读取、列目录和差异只能看到已登记的路径（否则返回 `PATH_NOT_REGISTERED`）；读取还要求对应的组已在该提交上准备完毕（否则返回 `CONTENT_NOT_READY`）。
- 只有当所有组都在同一个提交上建好索引时，该提交才算对整个仓库就绪。
<!-- /context:section -->

<!-- context:section id="after" -->
## 登记之后

登记完成后，仓库会自行运转：

1. 每次同步都会拉取监控分支最新提交的深度为一的快照（不含其父提交历史），并记录每个最新提交。之后的同步会复用已有的 Git 对象并加入新观察到的最新提交；两次同步之间推送的提交不会被自动建索引。
2. 尚未建索引的分支最新提交会被加入索引队列；连续失败三次的最新提交在下次变更之前不再重试。
3. 扫描器每分钟检查一次，在同步间隔到期时将下一次同步加入队列。

其他任何提交——较旧的快照、从未作为分支最新提交被同步过的提交、未被监控分支的最新提交或标签——都通过其 40 位完整 SHA 来准备：在仓库页面通过 **Create index** 操作，调用 `POST /sourcegraph/api/admin/v1/repo/prepare`，或由有权限的调用方使用 MCP `prepare` 工具。对于分支名或标签名，先用 `refs` 或 `resolve` 找到它的提交，详见 [HTTP 与 MCP 接口](../../product/reference/source-graph/http-and-mcp.md#query-routes)。尚未同步的 SHA 会直接从代码源拉取，不会加深历史；服务器必须允许拉取该 SHA，请求被拒绝时会直接失败，而不会改用其他提交。准备好的提交作为普通快照保留，而不是固定快照；见 [快照与存储](#snapshots-and-storage)。准备是异步的；请求被接受并不代表已就绪。手动请求按仓库限速，详见 [运维：日常运维与排障](operations.md#rate-limits)。

修改仓库的分支或保留策略会取消其排队中和运行中的任务；修改后的保留策略在下一次成功的同步、准备或索引任务时生效，被固定的快照和分支最新提交仍然可用。修改路径组还会清除已观测到的最新提交和版本，并等待一次新的同步。禁用和删除都会保留数据；已删除且已禁用的仓库在一分钟后可以被永久清除。清理与维护见 [运维：日常运维与排障](operations.md)。

以 `SOURCEGRAPH_SEED_DEMO=true` 启动的实例会登记两个公开示例仓库 `context4ai/context` 和 `context4ai/sourcegraph`，跟踪它们的默认分支，保留一个提交，每小时同步一次。
<!-- /context:section -->

<!-- context:section id="snapshots" -->
## 快照与存储

同步会记录监控分支最新提交的深度为一的快照；其他任何提交只有在通过完整 SHA 准备后才会进入仓库，详见 [登记之后](#after-registration)。网站上的提交选择项最多显示 20 个观察到的快照，而不是完整的 Git 历史。

每个路径组的快照要么受保护，要么是普通快照：

- **受保护**——当前的分支最新提交、仓库设置中的 **Pinned snapshots**（固定快照），以及排队中或运行中任务所用的提交。保留策略和容量限制永远不会释放它们。
- **普通**——其他所有快照，包括通过 SHA 准备的提交。它们按首次观察到之后的天数，或按配置的最近观察到的快照数量保留。保留策略在每次同步成功后应用，并在准备或索引任务发布其索引后立即再应用一次。

固定只能由仓库管理者或管理员在仓库设置中添加，每行一个完整 SHA，最多 4096 个；准备提交从不会固定它。仅添加固定不会拉取缺失的快照，也不会为其建索引，因此请先准备该 SHA。移除某个 SHA 会解除它的固定，该快照回到普通保留规则之下。

每个仓库还有一个 **Storage budget**（存储预算），默认 100 GiB，可在 1 GiB 到 10 TiB 之间配置，涵盖其 Git 对象、索引分片和进行中的准备文件。当某个路径组达到 4096 个快照，或仓库达到其存储预算时，服务会按首次观察时间释放最旧的未受保护快照及其索引，每批最多 64 个，而不是拒绝工作。已释放的版本返回 `REVISION_NOT_ELIGIBLE`，可以通过其 SHA 再次准备。释放只在步骤之间的安全时机进行，因此存储预算是一种保护性限制，而不是精确的配额：正在进行的建索引只有在超出预算的 120% 时才会停止，Git 压缩在回收对象时也需要临时空间。安全时机和回收的详细说明见 [运维：日常运维与排障](operations.md#disk-and-storage)。

只有当受保护的快照本身就占满某项限制时，才会报错：

| 错误码 | 含义 | 处理方式 |
| --- | --- | --- |
| `REPOSITORY_STORAGE_LIMIT` | 受保护的快照占满了存储预算，或正在进行的构建超出预算的 120% | 移除不需要的固定，或提高预算 |
| `SNAPSHOT_LIMIT` | 受保护的快照占满了某个路径组的 4096 个版本 | 移除不需要的固定 |

`INSUFFICIENT_STORAGE` 则不同：它表示实例的可用磁盘空间低于预留值，与仓库的存储预算无关；见 [运维：日常运维与排障](operations.md#disk-and-storage)。
<!-- /context:section -->
