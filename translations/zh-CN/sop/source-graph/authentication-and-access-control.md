---
title: 登录与准入
description: 面向自托管 Source Graph 的管理员——配置 Google 或 GitHub
  登录，了解首位管理员如何产生，控制谁可以登录，并决定匿名访客、API Key 和服务令牌各自能做什么。
translation:
  locale: zh-CN
  artifact_ref: 16b2009e-443b-447e-9823-202cc6090d42
  source_digest: 2f77aa43ca6728a5db92d6526da9db90a22f1daa1ede898c464e21bac1ab5f21
  translated_at: 2026-10-20T06:16:49.422Z
---

# 登录与准入

<!-- context:section id="goal" -->
本页面向 Source Graph 实例的管理员。每个请求都会被认定为恰好一类调用方：

- **匿名访客**：开启公开阅读时，请求不带 `Authorization` 头。可在匿名限流范围内，对标记为公开的仓库执行只读操作。
- **已登录用户**：通过 Google 或 GitHub 登录后的浏览器会话。可读取所有已登记的仓库，创建个人 API Key，并保存个人 GitHub 或自定义 Git 令牌。
- **管理员**：拥有管理员角色的已登录用户。另可登记和维护仓库，管理站点设置、用户和全局凭据。
- **个人 API Key**（`sgk_…`）：供以其所有者身份运行的脚本和 Agent 使用；详见 [会话与 API Key](#sessions-and-api-keys)。
- **服务令牌**：实例的 `SOURCEGRAPH_API_TOKEN`，供你掌控的自动化使用。可执行所有 HTTP 和 MCP 操作。

其他任何 `Authorization` 值都会被拒绝并返回 `401 AUTHENTICATION_REQUIRED`；无效凭据绝不会悄悄降级为匿名访问。调用方如何获取和发送各类凭据，见“接入”中的 [选择凭据](connecting.md#choose-a-credential)。
<!-- /context:section -->

<!-- context:section id="providers" -->
## 配置登录

Source Graph 支持通过 Google（OpenID Connect）或 GitHub（OAuth）登录。某个登录提供方只有在客户端 ID 和客户端密钥都已设置时才会启用；如果两者都未配置，登录页会说明缺少什么，站点保持匿名只读状态。

| 提供方 | 环境变量 | 回调 URL | 授权范围 |
| --- | --- | --- | --- |
| Google | `GOOGLE_CLIENT_ID`、`GOOGLE_CLIENT_SECRET` | `<origin>/sourcegraph/auth/google/callback` | `openid`、`profile`、`email` |
| GitHub | `GITHUB_CLIENT_ID`、`GITHUB_CLIENT_SECRET` | `<origin>/sourcegraph/auth/github/callback` | `read:user` |

1. **登记回调地址。** `<origin>` 是 `SOURCEGRAPH_ORIGIN` 的值，即不含路径的公开源地址。在 Google 中创建类型为 **Web application** 的 OAuth 客户端，并将回调地址添加为已授权的重定向 URI；在 GitHub 中创建 **OAuth App**，并将其用作授权回调 URL。
2. **保存密钥**到你所用平台的密钥存储中，然后重启服务。
3. **登录。** 第一个登录的人会成为管理员，详见下文。

当公开源地址变化时（例如服务迁移到另一个域名之后），请同时更新 `SOURCEGRAPH_ORIGIN` 和两个提供方的回调地址。

GitHub 登录只用于识别用户，并不授予仓库访问权限。私有仓库的令牌需要按代码源另行配置，详见 [登记仓库](registering-repositories.md#tokens-for-private-repositories)。
<!-- /context:section -->

<!-- context:section id="admin" -->
## 首位管理员

用户通过登录提供方及该提供方下稳定的主体 ID 来识别。邮箱地址相同既不会合并身份，也不会授予管理员权限，因此同一个人分别用 Google 和 GitHub 登录，会成为两个独立的用户。

新实例上第一次通过验证的登录会以原子方式成为管理员。请先只配置一个提供方，完成所有者的首次登录，之后再添加第二个提供方或将站点设为公开。管理员可以在 **Users** 页面提升其他用户；系统中必须始终保留至少一名启用状态的管理员，且管理员不能降低自己的权限。
<!-- /context:section -->

<!-- context:section id="registration" -->
## 谁可以登录

站点设置 **Allow other users to sign in or register**（允许其他用户登录或注册）默认关闭。关闭期间只有管理员可以登录。其他人会被拒绝，并看到一个 `403` 页面：页面以两种语言显示可配置的提示，附有项目链接，并在五秒后返回上一页。关闭该设置还会切断现有非管理员用户的会话，他们的个人 API Key 也会被拒绝并返回 `REGISTRATION_CLOSED`。

匿名阅读与该设置相互独立：只要站点的访问设置中开启了公开阅读，访客仍可读取标记为公开的仓库。以 `public_read: false` 登记的仓库只对匿名访客隐藏；所有被准入的已登录用户都能读取它。匿名流量受限流约束，具体限额见“运维”中的 [限流](operations.md#rate-limits)。
<!-- /context:section -->

<!-- context:section id="sessions" -->
## 会话与 API Key

浏览器会话有效期为 90 天，保存在作用域为 `/sourcegraph` 的 HTTP-only、same-site Cookie 中，在 HTTPS 源上会标记为 secure。再次登录会替换该浏览器之前的会话。

个人 API Key 供以你的身份运行的脚本和 Agent 使用。在用户设置中创建 Key 时需填写名称，可选设置过期时间；每个 Key 都以 `sgk_` 开头，之后也可以在同一页面再次复制。Key 在以下情况会失效：到期、被你删除、你的账号被停用，或注册已关闭且你不是管理员。

个人 Key 在 HTTP 上是只读的。在 MCP 上它只能使用只读工具，除非是管理员创建且带有 **Prepare index** 权限的 Key；这时还可以使用 `prepare` 工具，受 [运维](operations.md#rate-limits) 中列出的 prepare 限流约束。该权限会在每次请求时重新校验，因此一旦所有者不再是管理员，权限即失效。

服务令牌通过 `SOURCEGRAPH_API_TOKEN` 设置，长度至少 32 个字符，以恒定时间比较，并授予完全访问权限。请像对待 root 凭据一样对待它，不要放进共享配置中。
<!-- /context:section -->

<!-- context:section id="errors" -->
## 访问错误

以下错误码专用于认证和权限。限流及其他所有错误，见“运维”中的 [常见错误](operations.md#common-errors)。

| 错误码 | 状态码 | 含义 |
| --- | --- | --- |
| `AUTHENTICATION_REQUIRED` | 401 | 没有可用凭据，或凭据无效、已过期、已停用 |
| `ACCESS_DENIED` | 403 | 凭据有效但无权访问此处，例如用个人 Key 访问管理路由 |
| `ADMIN_REQUIRED` | 403 | 非管理员尝试创建带 prepare 权限的 Key |
| `REGISTRATION_CLOSED` | 403 | 登录仅限管理员 |
| `PREPARATION_NOT_ALLOWED` | 403 | 匿名调用方永远不能请求建索引 |
<!-- /context:section -->
