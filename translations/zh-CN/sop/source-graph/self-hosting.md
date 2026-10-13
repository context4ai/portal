---
title: 自部署与数据库选择
description: 使用 Docker 或从源码运行你自己的 Source Graph 实例，选定数据库并做好备份；在单实例与分片多实例之间如何选择，见部署建议。
translation:
  locale: zh-CN
  artifact_ref: ee8e6608-6a4a-4146-b856-467974297a1d
  source_digest: a7a924ec3779be0c4fa8d05000c4c7a8031bb5903e5f395b55fe136802aaa5a7
  translated_at: 2026-10-13T01:46:59.041Z
---

# 自部署与数据库选择

<!-- context:section id="goal" -->
一个 Source Graph 实例就是一个容器或一个进程，外加一个持久化的数据目录。最快的试用方式是使用从仓库构建的 Docker 镜像：

```bash
docker build -t context-sourcegraph .
docker volume create sourcegraph-data
docker run --rm -p 8080:8080 -v sourcegraph-data:/data \
  -e SOURCEGRAPH_ORIGIN=http://localhost:8080 \
  -e SOURCEGRAPH_SEED_DEMO=true \
  context-sourcegraph
```

打开 `http://localhost:8080/sourcegraph/`。设置 `SOURCEGRAPH_SEED_DEMO=true` 后，实例会登记两个公开示例仓库；公开的 GitHub 仓库无需令牌。未配置登录提供方时，站点是匿名且只读的；要管理站点，请添加 Google 或 GitHub 登录，详见[登录与准入](authentication-and-access-control.md)。

镜像包含四个二进制文件：服务 `repo-service`、命令行客户端 `sourcegraph-cli`、Git 凭据助手和 Zoekt 搜索服务器。它以非特权用户运行，数据根目录为 `/data`，暴露 8080 端口。
<!-- /context:section -->

<!-- context:section id="source" -->
## 从源码构建

本地构建需要 Go 1.26 或更高版本、Bun 1.3.9 和 Git：

```bash
bun install --frozen-lockfile
bun run build:web
bun run build
SOURCEGRAPH_DATA_ROOT="$PWD/.tmp/data" SOURCEGRAPH_ORIGIN=http://localhost:8080 output/bin/repo-service
```

构建完成后，`output/bin` 中包含同样的四个二进制文件。服务会自行启动搜索服务器并管理后台建索引，无需运行其他组件。所有设置都是环境变量，列在[配置](../../product/reference/source-graph/configuration.md)中。凭据只能放在环境变量或平台的密钥存储中，绝不要写进部署 JSON、源代码或镜像。
<!-- /context:section -->

<!-- context:section id="topology" -->
## 选择拓扑

Source Graph 可以作为单个大磁盘实例运行，也可以按仓库分片为多个实例：多个实例共享一个 PostgreSQL 或 MongoDB 数据库，各自在自己的卷上负责互不重叠的一组仓库。每个实例都把 Git 镜像和索引放在本地磁盘上，因此按磁盘规划容量，并把实例部署在调用方所在的区域。如何选择、规划容量和分片，见[部署建议](deployment-recommendations.md)。
<!-- /context:section -->

<!-- context:section id="database" -->
## 选择数据库

| 数据库 | `SOURCEGRAPH_DATABASE` | 适用场景 |
| --- | --- | --- |
| SQLite（默认） | `sqlite` | 单实例。文件默认位于 `/data/sourcegraph.db`，启用预写日志和完全同步提交 |
| PostgreSQL | `postgres` | 分片实例的共享状态，或已有的托管数据库。使用可串行化事务 |
| MongoDB | `mongodb` | 在 MongoDB 上保存共享状态。登录准入需要事务，因此请使用副本集或托管集群 |

通过 `DATABASE_URL` 传入连接信息：SQLite 文件路径、PostgreSQL DSN 或 MongoDB URI。更换数据库不会迁移数据：请从空的目标库开始，或执行经过单独评审的导出与导入。外部数据库无法替代实例的持久化卷，卷上仍保存着 Git、索引和凭据加密密钥。
<!-- /context:section -->

<!-- context:section id="fly" -->
## 示例：Fly.io

仓库中的 `fly.toml` 部署一个实例，数据卷 `sourcegraph_data` 挂载在 `/data`，健康检查为 `/sourcegraph/healthz`。[部署建议](deployment-recommendations.md)介绍了公开示例如何据此部署在 Fly.io 上，包括部署命令，以及把 Source Graph 放在其他站点反向代理之后时的规则。
<!-- /context:section -->

<!-- context:section id="backup" -->
## 备份与恢复

Source Graph 没有内置的备份任务。请将以下四项备份到机器之外，并限制访问权限：数据库、凭据加密密钥、运行时存储配置和仓库元数据。索引和裸 Git 镜像可以从远程仓库重建；身份、设置、凭据及其密钥则无法重建。

- **SQLite**：使用在线备份 API，绝不要单独复制正在运行的 `sourcegraph.db`。例如：`sqlite3 /data/sourcegraph.db '.backup /data/sourcegraph-backup.db'`，然后将结果连同密钥和配置文件复制到别处。也可以先停止服务，再将数据库连同其预写日志一起复制。
- **PostgreSQL**：`pg_dump`。**MongoDB**：使用副本集或托管集群的备份方案。

恢复时，先停止实例，将数据库与其匹配的密钥和配置一起恢复，启动一个实例，然后检查管理员访问、仓库元数据和索引恢复情况。回滚镜像和恢复数据库是两项独立的操作；请保留一个已知可用的镜像，并在升级前做好备份。
<!-- /context:section -->
