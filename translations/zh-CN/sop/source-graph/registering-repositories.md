---
title: 登记仓库
description: 登记 GitHub 或自定义 Git 仓库并设置分支、保留窗口、可见性和同步间隔，为私有仓库提供令牌，并将 Monorepo 拆分为路径组。
translation:
  locale: zh-CN
  artifact_ref: 56556e26-509e-4b66-a927-11c76940f7e9
  source_digest: 6ce48d5fc51bccb68abedd5a1c52039889c221595c00432d13f8a00a96da9db6
  translated_at: 2026-10-20T05:13:06.930Z
---

# 登记仓库

<!-- context:section id="goal" -->
仓库登记后即可被搜索：Source Graph 会镜像其监控分支，保留一个窗口内的可用提交，并为每个分支最新提交建索引。登记需要管理员（在网站上登录）或实例的服务令牌。

在网站上打开 **Repositories**（仓库），选择 **Register a repository**。通过 HTTP 时，将相同的字段发送到 `POST /sourcegraph/api/admin/v1/repos`，可以附带 `Idempotency-Key` 请求头，避免重试时重复登记：

```json
{
  "name": "context4ai/context",
  "code_provider": "github",
  "public_read": true,
  "index_mode": "full",
  "policy": { "default_branch": true, "count": 20 },
  "sync_interval_minutes": 5
}
```

请求返回 `202 Accepted`，并将首次同步加入队列；仓库页面的任务标签页会显示进度。
<!-- /context:section -->

<!-- context:section id="fields" -->
## 登记字段

| 字段 | 含义 |
| --- | --- |
| `name` | 仓库在其代码源上的路径，例如 `owner/repository`（允许 `a/b/c` 这样的嵌套路径，最长 512 个字符）。Git 远程地址为 `<code source host>/<name>.git` |
| `code_provider` | 代码源：`github`（默认），或表示自定义 Git 托管地址的 `git`。它在登记时确定，同时决定托管地址和要尝试哪些令牌 |
| `public_read` | 匿名访客能否读取。省略时视为公开 |
| `index_mode` | `full`（默认）为整个仓库建索引；`monorepo` 只为路径组建索引 |
| `path_groups` | `monorepo` 模式下必填，见下文 |
| `policy.branches` | 要监控的确切分支名 |
| `policy.default_branch` | 同时跟踪远程的默认分支，每次同步时重新发现 |
| `policy.days` 或 `policy.count` | 保留窗口：天数（1–365）或每个分支的第一父提交数（1–4096），二者只能填一个。两者都省略时使用站点的仓库默认值（初始为 30 天） |
| `sync_interval_minutes` | 1、3、5、10、30、60、180、360、720 或 1440；默认 5 |

一个策略总共监控一到八个分支，默认分支也计算在内。标签从不拉取，因此无法搜索或读取。

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

两个代码源之间从不互用令牌。令牌使用实例的凭据加密密钥加密，状态显示为就绪、即将过期（七天内）、已过期或无效。内置的 Git 凭据助手只会把选中的令牌交给正在拉取的仓库所在的托管地址，并附带代码源的 HTTPS 用户名（默认 `oauth2`）。

登记私有仓库并不会对已登录用户隐藏它；`public_read: false` 只会取消匿名访问。要控制谁能成为已登录用户，请使用登录和注册策略，详见 [登录与准入](authentication-and-access-control.md)。
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

1. 首次同步拉取监控分支，记录每个分支的最新提交，并根据保留窗口生成可用版本。
2. 尚未建索引的分支最新提交会被加入索引队列；连续失败三次的最新提交在下次变更之前不再重试。
3. 扫描器每分钟检查一次，在同步间隔到期时将下一次同步加入队列。

要搜索窗口内较旧的提交，需要请求准备该提交：在仓库页面操作，调用 `POST /sourcegraph/api/admin/v1/repo/prepare`，或由有权限的调用方使用 MCP `prepare` 工具。准备是异步的；请求被接受并不代表已就绪。

修改仓库的分支或保留窗口会清除已观测到的最新提交和版本，取消排队中和运行中的任务，并等待一次新的同步。禁用和删除都会保留数据；已删除且已禁用的仓库在一分钟后可以被永久清除。清理与维护见 [运维](operations.md)。

以 `SOURCEGRAPH_SEED_DEMO=true` 启动的实例会登记两个公开示例仓库 `context4ai/context` 和 `context4ai/sourcegraph`，跟踪它们的默认分支，保留一个提交，每小时同步一次。
<!-- /context:section -->
