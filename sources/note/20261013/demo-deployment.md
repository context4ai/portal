# 本站 Source Graph 在线示例的部署方式

本笔记由维护者整理，记录 context4ai 社区站点在 Fly.io 上的公开部署事实，来源是 Portal 仓库的 `fly.toml`、`Dockerfile` 与 `deploy/nginx.conf.template`，以及 Source Graph 仓库的 `fly.toml`。核对时间为 2026-10-13，只包含公开信息。

## 两个 Fly App

- **Portal**（App 名 `context4ai-portal`）：一个 nginx 容器，提供首页 `/`、Context 文档站 `/context/` 和 `/llms.txt`；区域 `sin`，`shared-cpu-1x`、256 MB 内存，关闭自动停机，至少保持一台 Machine，健康检查 `/healthz`。
- **Source Graph**（App 名 `context4ai-sourcegraph`）：按 Source Graph 仓库的 `fly.toml` 部署单实例；区域 `sin`，1 个共享 CPU、1 GB 内存，关闭自动停机，数据卷 `sourcegraph_data` 挂在 `/data`，数据库为 SQLite，开启示例数据 `SOURCEGRAPH_SEED_DEMO`，健康检查 `/sourcegraph/healthz`。

## 同域访问

- Portal 把整个 `/sourcegraph/` 前缀原样反代到 Source Graph，上游地址默认是 Fly 私网地址 `http://context4ai-sourcegraph.internal:8080`（`Dockerfile` 中的 `SOURCEGRAPH_UPSTREAM`），不经过公网。
- 因此同一个 Source Graph 有两个公开入口：经 Portal 的 `https://context4ai-portal.fly.dev/sourcegraph/`，以及 Source Graph 自己的 `https://context4ai-sourcegraph.fly.dev/sourcegraph/`。MCP 端点为 `/sourcegraph/mcp`。
- 计划中的正式域名是 `context4ai.org`，届时入口为 `https://context4ai.org/sourcegraph/`；截至核对时该域名尚未指向 Fly。

## 示例实例的内容

- 核对时实例以匿名可读方式公开两个仓库：`context4ai/context` 与 `context4ai/sourcegraph`，默认分支 `main`，每 60 分钟同步一次，各保留最新一个版本的索引。
- 这些仓库也是本文档站知识的来源之一，所以文档站的知识服务可以通过这个实例按固定提交读取原始代码；Agent Graph 仓库当前不在该实例中，读取它时走本地检索。

## 部署

- 两个 App 分别部署；Source Graph 仓库的 main 分支构建成功后由 GitHub Actions 部署到 Fly，单实例部署时可能短暂中断请求与索引，持久化的任务会在重启后恢复。
- 示例实例是演示用途的单实例，不代表生产容量建议。
