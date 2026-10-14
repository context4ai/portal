---
title: CLI
description: sourcegraph-cli 的命令、参数、环境变量、输出与退出码，以及 Git 凭据助手的作用。
translation:
  locale: zh-CN
  artifact_ref: 524c7555-fd52-4e08-82d0-93f68236b71d
  source_digest: 524ee877324cad8efc0d480111adb5ac8188dc122abe4e7960ab8e4361768a2d
  translated_at: 2026-10-14T08:53:43.639Z
  source_parts:
    title: e759793341ff3757eaa76e814db0170ec13b6b0a988a742d9a81240c505f48ec
    description: d35f98a48b0c560934e9c86a0941d447e79814c0e9244b67b2db19ae91a6c4c2
    order:
      - goal
      - env
      - commands
      - flags
      - output
      - examples
      - helper
    sections:
      goal: b5d95140005e1864d2c0eaee128ff82ebe0957081967131253ab78a59e6168a4
      env: 7f7b45105879b6a4f8bb6ee9941251c7ba1d53cf2d616d6a004323b134cf20ea
      commands: c3268827ba1b2f3731d27adf5e91e3b66a364c80a3524c35d085c0216f00515c
      flags: c2f82763f01ef43baa7b068d52a6aa0c5dfbd2429a4f0b06853ae2c9b6635c3b
      output: 1672b0bad10d0d6ae3f7ef2cea6d6b7d691cec391be4e8cbe1fe8ed3c5f19829
      examples: 287c827e33889ae996ced04d64e1aee316c4c2057f1dce29f674453a1bb8f88a
      helper: 73211ce2810cda91e9c285441e588fe085d71742a6cc650b263d4b9143f2d454
    exterior:
      '[null,"goal"]': 5a48e3ca33d4199a95b40cbf5994800731850152cf3c7f0c541c1285bc6cb4cd
      '["goal","env"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["env","commands"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["commands","flags"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["flags","output"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["output","examples"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["examples","helper"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["helper",null]': e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
---

# CLI

<!-- context:section id="goal" -->
`sourcegraph-cli` 是一个小巧、有边界的 Source Graph 实例 HTTP 客户端。每次调用只向 [HTTP 与 MCP 接口](http-and-mcp.md) 中描述的路由发送一个请求，打印 JSON 响应后退出；它从不克隆仓库，也不安装任何东西。它与服务一起构建到 `output/bin/` 中，并包含在容器镜像里。

```text
sourcegraph-cli <command> [flags] [arguments]
```
<!-- /context:section -->

<!-- context:section id="env" -->
## 环境变量

| 变量 | 默认值 | 规则 |
| --- | --- | --- |
| `SOURCEGRAPH_URL` | `https://context4ai.org/sourcegraph` | 实例的 `/sourcegraph` 基础地址。必须是 HTTPS URL，且不含用户信息、查询参数或片段 |
| `SOURCEGRAPH_API_TOKEN` | — | 可选的 Bearer 凭据——个人 API Key 或服务令牌。设置时至少 32 个字符 |

由于地址必须是 HTTPS，运行在 `http://localhost` 上的本地实例需要在前面加一个负责 TLS 终止的代理，才能供 CLI 使用。
<!-- /context:section -->

<!-- context:section id="commands" -->
## 命令

| 命令 | 路由 | 使用的参数 |
| --- | --- | --- |
| `repositories` | `GET /v1/repos` | `-after` |
| `availability` | `GET /v1/repo/availability` | `-repo` |
| `resolve` | `POST /v1/repo/resolve` | `-repo`、`-revision` |
| `search` | `POST /api/search` | `-repo`、`-revision`、`-e`、`-F`、`-i`、`-l`、`-g`；之后是 `PATTERN [PATH...]` |
| `read` | `POST /v1/repo/read` | `-repo`、`-revision`、`-path`、`-start-line`、`-end-line` |
| `list` | `POST /v1/repo/list` | `-repo`、`-revision`、`-path`、`-first`、`-after` |
| `diff` | `POST /v1/repo/diff` | `-repo`、`-base`、`-head`、`-first`、`-after` |
| `prepare` | `POST /api/admin/v1/repo/prepare` | `-repo`、`-revision`、`-kind`、`-key` |

没有 `read_many` 命令；请多次调用 `read`，或使用对应的 MCP 工具。`diff` 会比较所有已登记的路径，`prepare` 则作用于所有路径组。`prepare` 属于管理路由，因此需要服务令牌。
<!-- /context:section -->

<!-- context:section id="flags" -->
## 参数

参数采用 Go 语法：前面加一个或两个短横线都可以（`-repo` 或 `--repo`），并且所有参数都必须放在位置参数之前。

| 参数 | 默认值 | 含义 |
| --- | --- | --- |
| `-repo` | — | 仓库键，格式为 `owner/repository` |
| `-revision` | — | 监控分支或完整 SHA；省略时使用默认分支。对 `prepare` 而言，表示要准备的提交 |
| `-e` | — | 搜索模式，类似 `rg -e`；不指定时取第一个位置参数 |
| `-F` | `false` | 将模式作为字面量匹配，类似 `rg -F` |
| `-i` | `false` | 忽略大小写，类似 `rg -i` |
| `-l` | `false` | 只打印匹配的路径，类似 `rg -l` |
| `-g` | — | 按 glob 包含文件，或用 `!` 排除文件，类似 `rg -g`；可重复指定 |
| `-path` | — | 相对仓库根目录的文件或目录 |
| `-start-line` | `1` | 读取的起始行 |
| `-end-line` | `100` | 读取的结束行 |
| `-first` | `100` | `list`（1–1000）和 `diff`（1–100）的分页大小 |
| `-after` | — | 上一页返回的游标 |
| `-base`、`-head` | — | `diff` 比较的两个版本 |
| `-key` | — | `prepare` 的幂等键，以 `Idempotency-Key` 发送 |
| `-kind` | `index` | `prepare` 的类型：`index` 或 `sync` |

搜索模式之后的参数是限定搜索范围的目录，类似 `rg` 的 `PATH` 参数。
<!-- /context:section -->

<!-- context:section id="output" -->
## 输出与退出码

CLI 会把响应体（始终是 JSON）原样写到标准输出，上限为 3 MiB，诊断信息则写到标准错误。每个请求的超时时间为 35 秒，并且拒绝重定向。

| 退出码 | 含义 |
| --- | --- |
| `0` | 成功 |
| `1` | 请求失败、超时、返回的响应体无效或过大，或状态码不是 2xx |
| `2` | 用法错误：未知命令、参数错误、缺少搜索模式、`SOURCEGRAPH_URL` 或令牌无效 |
| `3` | 已受理但尚未就绪——`202 Accepted` 或 `409 INDEX_NOT_READY` |

超时后无法确定请求是否已送达；重试 `prepare` 之前，请先用 `availability` 检查。
<!-- /context:section -->

<!-- context:section id="examples" -->
## 示例

```bash
export SOURCEGRAPH_URL="https://context4ai.org/sourcegraph"

# Literal search in TypeScript files under packages/
sourcegraph-cli search -repo context4ai/context -F -g '*.ts' 'defineProject' packages

# Read lines 1–40 at the commit returned in Meta.Commit
sourcegraph-cli read -repo context4ai/context -revision <commit> -path README.md -end-line 40

# List the repository root
sourcegraph-cli list -repo context4ai/context -first 50

# Ask an instance you administer to index a commit (service token required)
SOURCEGRAPH_API_TOKEN=... sourcegraph-cli prepare -repo acme/app -revision <full-sha> -key index-<full-sha>
```
<!-- /context:section -->

<!-- context:section id="helper" -->
## Git 凭据助手

`git-credential-sourcegraph` 供服务自身使用，而不是给人使用的。每次执行 Git 拉取时，服务会从仓库所属的代码源中挑选一个令牌——先用创建者自己的令牌，再用全局令牌，然后是代码源的环境令牌，GitHub 最后还会尝试匿名访问，详见[登记仓库](../../../sop/source-graph/registering-repositories.md#tokens-for-private-repositories)。随后它带着三个环境变量运行 Git：

| 变量 | 取值 |
| --- | --- |
| `SOURCEGRAPH_GIT_TOKEN` | 选中的令牌；匿名尝试时为空 |
| `SOURCEGRAPH_GIT_HOST` | 正在拉取的远程地址的托管地址 |
| `SOURCEGRAPH_GIT_USERNAME` | 代码源的 HTTPS 用户名 |

凭据助手只响应 Git 的 `get` 操作，且只处理托管地址等于 `SOURCEGRAPH_GIT_HOST` 的 HTTPS 请求。它返回用户名（未设置时为 `oauth2`），并把令牌作为密码返回。托管地址不匹配、令牌为空，或任一值包含换行符或 NUL 字符时，它不输出任何内容，因此令牌绝不会提供给其他托管地址。
<!-- /context:section -->
