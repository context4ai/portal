---
title: 运维：登录与权限
description: 面向自托管 Source Graph 的管理员——配置 Google 或 GitHub
  登录，了解首位管理员如何产生，控制谁可以登录，并决定匿名访客、API Key 和服务令牌各自能做什么。
translation:
  locale: zh-CN
  artifact_ref: 16b2009e-443b-447e-9823-202cc6090d42
  source_digest: fac8db9f536a831d0fd463328ee81d699d10795f295addb093cca739a990cd73
  translated_at: 2026-11-07T13:29:32.690Z
---

# 运维：登录与权限

<!-- context:section id="goal" -->
本页面向 Source Graph 实例的管理员。每个请求都会被认定为恰好一类调用方：

- **匿名访客**：开启公开阅读时，请求不带 `Authorization` 头。可在匿名限流范围内，对公开仓库执行只读操作。
- **已登录用户**：通过 Google 或 GitHub 登录后的浏览器会话。可读取公开仓库以及自己创建或管理的私有仓库，创建个人 API Key，并保存个人 GitHub 或自定义 Git 令牌。
- **管理员**：拥有管理员角色的已登录用户。可读取所有仓库，登记和维护所有仓库，并管理站点设置、用户和全局凭据。
- **仓库管理者**：被列为某个仓库管理者的已登录用户。可以读取和维护该仓库，详见 [谁可以登录](#who-may-sign-in)。
- **个人 API Key**（`sgk_…`）：供以其所有者身份运行的脚本和 Agent 使用；详见 [会话与 API Key](#sessions-and-api-keys)。
- **服务令牌**：实例的服务凭据，首次启动时由 `SOURCEGRAPH_API_TOKEN` 提供初始值，之后保存在数据库中，供你掌控的自动化使用。可对所有仓库执行所有 HTTP 和 MCP 操作。

每类调用方能看到哪些仓库，见 [公开仓库与私有仓库](#public-and-private-repositories)。其他任何 `Authorization` 值都会被拒绝并返回 `401 AUTHENTICATION_REQUIRED`；无效凭据绝不会悄悄降级为匿名访问。调用方如何获取和发送各类凭据，见“接入”中的 [选择凭据](connecting.md#choose-a-credential)。
<!-- /context:section -->

<!-- context:section id="providers" -->
## 配置登录

Source Graph 支持通过 Google（OpenID Connect）或 GitHub（OAuth）登录。某个登录提供方只有在客户端 ID 和客户端密钥都已设置时才会启用；如果两者都未配置，登录页会说明缺少什么，站点保持匿名只读状态。

| 提供方 | 环境变量 | 回调 URL | 授权范围 |
| --- | --- | --- | --- |
| Google | `GOOGLE_CLIENT_ID`、`GOOGLE_CLIENT_SECRET` | `<origin>/sourcegraph/auth/google/callback` | `openid`、`profile`、`email` |
| GitHub | `GITHUB_CLIENT_ID`、`GITHUB_CLIENT_SECRET` | `<origin>/sourcegraph/auth/github/callback` | `read:user` |

1. **登记回调地址。** `<origin>` 是 `SOURCEGRAPH_ORIGIN` 的值，即不含路径的公开源地址。在 Google 中创建类型为 **Web application** 的 OAuth 客户端，并将回调地址添加为已授权的重定向 URI；在 GitHub 中创建 **OAuth App**，并将其用作授权回调 URL。
2. **保存密钥**到你所用平台的密钥存储中，然后重启服务。某个提供方的两个值都存在时，Source Graph 会在首次启动时把它们导入加密的数据库存储；此后即使没有这些环境变量也会使用已保存的配置，且数据库记录优先于环境变量。
3. **登录。** 第一个登录的人会成为管理员，详见下文。

登录必须从配置的站点地址开始，因为提供方总是回到这个地址，登录 Cookie 也只属于一个主机。从其他地址（例如平台自带的主机名）发起的登录，会先被送到站点地址上的登录页；位于服务前面的代理通过 `X-Forwarded-Host` 转发原始主机。

当公开源地址变化时（例如服务迁移到另一个域名之后），请同时更新 `SOURCEGRAPH_ORIGIN` 和两个提供方的回调地址。

GitHub 登录只用于识别用户，并不授予仓库访问权限。私有仓库的令牌需要按代码源另行配置，详见 [登记和管理仓库](registering-repositories.md#tokens-for-private-repositories)。
<!-- /context:section -->

<!-- context:section id="admin" -->
## 首位管理员

用户通过登录提供方及该提供方下稳定的主体 ID 来识别。邮箱地址相同既不会合并身份，也不会授予管理员权限，因此同一个人分别用 Google 和 GitHub 登录，会成为两个独立的用户。

新实例上第一次通过验证的登录会以原子方式成为管理员。请先只配置一个提供方，完成所有者的首次登录，之后再添加第二个提供方或将站点设为公开。管理员可以在 **Users** 页面提升其他用户；系统中必须始终保留至少一名启用状态的管理员，且管理员不能降低自己的权限。
<!-- /context:section -->

<!-- context:section id="registration" -->
## 谁可以登录

站点设置 **Allow other users to sign in or register**（允许其他用户登录或注册）默认关闭。关闭期间只有管理员可以登录。其他人会被拒绝，并看到一个 `403` 页面：页面以两种语言显示可配置的提示，附有项目链接，并在五秒后返回上一页。关闭该设置还会切断现有非管理员用户的会话，他们的个人 API Key 也会被拒绝并返回 `REGISTRATION_CLOSED`。

匿名阅读与该设置相互独立：只要站点的访问设置中开启了公开阅读，访客仍可读取公开仓库。匿名流量受限流约束，具体限额见“运维”中的 [限流](operations.md#rate-limits)。

另一项设置 **Let signed-in users register repositories**（允许已登录用户登记仓库）同样默认关闭；在它出现之前保存的设置读取为关闭。开启后，任何已登录用户都可以登记仓库并成为其管理者。管理者和管理员可以修改该仓库的设置、建索引和清理、取消其任务、删除它，以及添加或移除管理者（最多 50 位）；其他人会得到 `403 REPOSITORY_MANAGEMENT_DENIED`。用户、站点设置和全局代码源令牌仍仅限管理员。用户登记的仓库先使用该用户自己的代码源令牌拉取，再使用站点级令牌，因此开启这项设置意味着已登录用户可以登记站点级令牌能读取的任何仓库。

## 公开仓库与私有仓库

每个仓库要么公开，要么私有，在登记时或之后在其设置中通过 **Public repository**（公开仓库）选择（`public_read`，默认为 `true`）。在这个选项出现之前登记的仓库保持公开。

| 调用方 | 公开仓库 | 私有仓库 |
| --- | --- | --- |
| 匿名访客 | 开启公开阅读时可读取 | 不可见 |
| 已登录用户 | 可读取 | 仅限自己创建或管理的仓库 |
| 在网站上登录的管理员 | 可读取 | 全部 |
| 个人 API Key | 可读取 | 仅限其所有者创建或管理的仓库，即使所有者是管理员也是如此 |
| 服务令牌 | 可读取 | 全部 |

调用方看不到的私有仓库，其表现与未登记的名称完全相同：详情、搜索、读取、列目录、差异、插件、prepare 和 MCP 工具都返回 `404 REPOSITORY_NOT_FOUND`，仓库目录中不会列出它，统计信息也会略去它的名称。要让某人获得访问权限，请把他们添加为该仓库的管理者，或将仓库设为公开。

登记一个已被登记的名称会返回 `409 REPOSITORY_EXISTS`，并在 `creator` 中给出登记人。网站会显示是谁登记的，并建议请对方把你添加为管理者；没有记录登记人时，则建议联系站点管理员。

后台同步、建索引和清理对所有仓库都会运行，与可见性无关。
<!-- /context:section -->

<!-- context:section id="sessions" -->
## 会话与 API Key

浏览器会话有效期为 90 天，保存在作用域为 `/sourcegraph` 的 HTTP-only、same-site Cookie 中，在 HTTPS 源上会标记为 secure。再次登录会替换该浏览器之前的会话。

个人 API Key 供以你的身份运行的脚本和 Agent 使用。在用户设置中创建 Key 时需填写名称，可选设置过期时间；每个 Key 都以 `sgk_` 开头，之后也可以在同一页面再次复制。Key 在以下情况会失效：到期、被你删除、你的账号被停用，或注册已关闭且你不是管理员。

Key 能读取的内容与其所有者以已登录用户身份能读取的相同，但管理员的 Key 例外，它看不到所有仓库：只能看到公开仓库以及其所有者创建或管理的私有仓库。除读取外，Key 只能调用建索引准备，即 MCP 的 `prepare` 或 `POST /sourcegraph/api/admin/v1/repo/prepare`。它可以为其所有者管理的仓库执行准备；当所有者当前是管理员时，可以为它能看到的任何仓库执行准备；每次调用都会校验这一点。只有所有者是管理员或至少管理一个仓库的 Key，MCP 才会列出 `prepare` 工具，该状态在一分钟内刷新。Key 每分钟最多调用 10 次 prepare，见 [运维：日常运维与排障](operations.md#rate-limits)；其他所有管理路由都返回 `403 ACCESS_DENIED`。

服务令牌通过 `SOURCEGRAPH_API_TOKEN` 设置，长度至少 32 个字符，以恒定时间比较，并授予完全访问权限。请像对待 root 凭据一样对待它，不要放进共享配置中。
<!-- /context:section -->

<!-- context:section id="errors" -->
## 访问错误

以下错误码专用于认证和权限。限流及其他所有错误，见“运维”中的 [常见错误](operations.md#common-errors)。

| 错误码 | 状态码 | 含义 |
| --- | --- | --- |
| `AUTHENTICATION_REQUIRED` | 401 | 没有可用凭据，或凭据无效、已过期、已停用 |
| `ACCESS_DENIED` | 403 | 凭据有效但无权访问此处，例如用个人 Key 访问 prepare 以外的管理路由 |
| `REGISTRATION_CLOSED` | 403 | 登录仅限管理员 |
| `REGISTRATION_DISABLED` | 403 | 未开启用户登记仓库时，非管理员尝试登记仓库 |
| `REPOSITORY_MANAGEMENT_DENIED` | 403 | 调用方既不是该仓库的管理者，也不是管理员 |
| `PREPARATION_NOT_ALLOWED` | 403 | 匿名调用方永远不能请求建索引 |
| `REPOSITORY_NOT_FOUND` | 404 | 仓库未登记，或者是私有仓库且调用方看不到它 |
| `REPOSITORY_EXISTS` | 409 | 该名称已被登记；`creator` 给出可以申请访问权限的登记人 |
<!-- /context:section -->
