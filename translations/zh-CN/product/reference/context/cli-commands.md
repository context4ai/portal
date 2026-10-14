---
title: CLI 命令
description: context CLI 的全部命令与子命令，按用途分组，并说明每条命令的作用和主要选项。
translation:
  locale: zh-CN
  artifact_ref: 1feca038-19bc-4153-827e-39ca30832dc6
  source_digest: 4e7e98fe79db789edfc7f51e38b5f837cd6fd19e9f1af10242f1337be2f2fa40
  translated_at: 2026-10-12T17:06:40.056Z
  source_parts:
    title: 388d541bd9b95d3acab7bd991eca6a19b117096166bab674d9c6e0a91915aa97
    description: 3a838cf5fef3c34a97c24b9705435812ab1dfa56cd45f8942604207abd360855
    order:
      - goal
      - setup
      - workflow
      - tasks
      - review
      - delivery
      - versions
      - sources
      - debug
    sections:
      goal: 45b42e3478151b0673c2de3a0720b046fd61e915c03051090da112e9c6d479a5
      setup: fa3d98fa2ab23b66607bae9b5f51be3c4348f743660a40888e225f028bec45e3
      workflow: 438752902fa38dbce10841260bb51d63bbecc561205e1fa2719f24a05c6762c1
      tasks: c2820b73a510e7f8c960643219a5a7b9743d8f166bcc105a8a16c74ac0f31bff
      review: 60e8a1c469937794994e1de7fece6e536655c9527c19608b685ac77859a2e192
      delivery: 7eda6ca2b1263ca2c407e832b8c5347021d69952ca73f50e8de3cbd19f264774
      versions: d66bff9e92a60d8fe8d545619903a31589e23c0452a7a5e46153502194437faf
      sources: aac8d03f425cebc54d742c8876eefa5b7a1e0f181ae53d3e2a9b48a67d69a17a
      debug: 40512c79cff949bfe3ff879047e48deef939b858cff34c0d9a34a09477cebf54
    exterior:
      '[null,"goal"]': 2e42f3181db69c46193ad033044aecb8822fcf255861235abab3bb8c34dfeda5
      '["goal","setup"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["setup","workflow"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["workflow","tasks"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["tasks","review"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["review","delivery"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["delivery","versions"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["versions","sources"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["sources","debug"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["debug",null]': e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
---

# CLI 命令

<!-- context:section id="goal" -->
`context` CLI 保存 Context 知识工作区的工作流状态。你很少需要亲自输入这些命令：它们由 Agent 执行，而且大多数由当前 **Route** 返回——Route 是 `context status` 或上一条命令交回的唯一下一步，通常还附带需要传入的确切 `--revision`。驱动工作流的命令在使用 `--format json` 时输出 JSON，Agent 读取的正是这份输出。

运行 `context <command> --help` 可查看任一命令的完整选项列表。调用这些命令的 Skill 见 [Skill](./skills.md)；简要介绍见[命令与技能](../../getting-started/commands-and-skills.md)。
<!-- /context:section -->

<!-- context:section id="setup" -->
## 安装与设置

| 命令 | 作用 | 主要选项 |
| --- | --- | --- |
| `context entry [dir]` | 解析唯一的 Agent 入口：为新目录规划初始化，或评估已有知识工作区的工作流 | `--name`、`--language en\|zh-CN`、`--managed`、`--authority` |
| `context init [dir]` | 在该目录中初始化 Context 知识工作区 | `--name`、`--language`、`--allow-nonempty`（需明确确认后使用） |
| `context plugin path` | 输出安装时使用的内置插件根目录 | |
| `context plugin status` | 显示内置插件根目录，以及哪些 Agent 已全局安装该插件 | |
| `context plugin install` | 全局安装 Agent 插件，或把独立 Skill 复制到某个仓库 | `--agent claude\|codex\|cursor\|all`、`--local <repo>`（也可为 `auto-detect`、`standalone`）、`--dry-run` |
| `context evidence install [dir]` | 安装或安全升级内置的远程代码证据插件，不会启动生产 | |
| `context clean-cache` | 删除孤立的 Claude Code 插件缓存 | `--dry-run` |
<!-- /context:section -->

<!-- context:section id="workflow" -->
## 工作流

| 命令 | 作用 | 主要选项 |
| --- | --- | --- |
| `context status` | 输出知识工作区概览和下一个 Route | `--format table\|json`、`--view summary\|full`、`--managed`、`--authority` |
| `context run [phase]` | 检查或运行某个已声明的 phase；不指定 phase 时，推进确定性的 Route | `--list`、`--dry-run`、`--until blocked-or-complete`、`--max-steps`、`--deliver`、`--resume-writing` |
| `context resource acknowledge-current` | 记录当前 Route 要求的所有资源均已读取 | |
| `context resource materialize <id>` | 把一个绑定修订的 Context 视图写入本地文件 | |
| `context action prepare-current` | 准备或重试当前生产批次的目录，不会重新提交已接受的文章 | `--revision`、`--input` |
| `context action complete-current` | 针对确切的当前修订提交语义输出——报告决定、草稿或 Gate 回答 | `--revision`、`--input`、`--managed`、`--multi-agent`、`--preview` |
<!-- /context:section -->

<!-- context:section id="tasks" -->
## 任务与维护

| 命令 | 作用 |
| --- | --- |
| `context task prepare` | 预览或丢弃当前任务状态；保留知识、来源和其他临时文件 |
| `context task resume` | 根据已登记的需求和保留的知识，显式重新开启已清除的生产 |
| `context task adjust` | 调整当前的来源和模块输入或知识地图，不影响无关的工作（`--input`、`--schema`、`--inspect`） |
| `context task maintain` | 登记限定范围的页面修订、重新生成或已批准输出的重建 |
| `context task advance-maintenance` | 执行当前的维护转换 |
| `context task maintenance-status` | 显示维护请求和当前的取消修订 |
| `context task cancel-maintenance <id>` | 取消待处理的维护请求，不会丢弃进行中的草稿 |
| `context task retire` | 预览或执行已批准文章的下线，并清理对它的引用 |
| `context task recover` | 在正常 Route 之外检查或预览限定范围的恢复 |
| `context task rollback` | 预览用户选定的确切回退和将被丢弃的草稿；绝不会重置仓库 |
| `context task finish-rollback` | 在 close 和所有构建成功后完成回滚 |
| `context update` | 在已确认的范围内，将已获取的来源变更与已批准的知识进行比对（`--input`） |
| `context revise <target>` | 通过 Indexer 生命周期修复一份草稿或一个已批准页面（`--instruction`、`--regenerate`、`--timing after-batch\|priority`、`--move-to`） |
<!-- /context:section -->

<!-- context:section id="review" -->
## 审核

| 命令 | 作用 | 主要选项 |
| --- | --- | --- |
| `context review html [collection]` | 生成一份自包含的本地审核报告 | `--all`、`--out`、`--open` |
| `context review list [collection]` | 在终端中列出草稿候选 | |
| `context review apply <file>` | 应用限定范围的 JSON 或 JSONL 决定和修订指令 | |
| `context review approve-all [collection]` | 批准当前审核范围内的全部内容 | `--all`、`--confirmed`（你的确认）、`--managed` |
| `context review approve <id>` / `reject <id>` | 批准或拒绝单个草稿候选 | |
| `context review deprecate <article-id>` | 将已批准页面标记为已弃用，但不删除 | |
<!-- /context:section -->

<!-- context:section id="delivery" -->
## 交付

| 命令 | 作用 | 主要选项 |
| --- | --- | --- |
| `context close` | close（归档）已批准的知识：生成 `structure.yaml` 并执行最终验证 | `--format` |
| `context verify` | 验证知识工作区 | `--compact`、`--view diagnostics`、`--page-size`、`--page-token` |
| `context build` | 构建已声明的知识包和站点 | `--verbose` |
| `context translate status` | 按语言报告翻译是否为最新 | |
| `context translate prepare` | 写出待处理的翻译任务 | |
| `context translate submit` | 校验并保存翻译后的文章和导航标题 | `--input` |
| `context translate skip` | 暂时以主语言发布待翻译内容 | |
<!-- /context:section -->

<!-- context:section id="versions" -->
## 版本与知识包

| 命令 | 作用 | 主要选项 |
| --- | --- | --- |
| `context version inspect` | 显示自当前版本标签或指定 ref 以来的正式变更 | `--base` |
| `context version record` | 记录知识工作区的 SemVer 和 Changelog 条目 | `--input` |
| `context package site-url <package> <url>` | 在站点地图中记录已部署站点的根地址，不做网络检查 | |
| `context package template accept [package]` | 显式接受未修改过的生成起始模板 | |
<!-- /context:section -->

<!-- context:section id="sources" -->
## 来源与 Indexer

| 命令 | 作用 |
| --- | --- |
| `context source add repo\|file\|lark [date]` | 在某个 `YYYYMMDD` 批次下登记仓库、本地文件或飞书文档模块 |
| `context source add batch [date]` | 在同一批次下登记多个模块 |
| `context source import` | 单个或批量导入托管的 Markdown（笔记、会话摘要）或预先抓取的飞书内容 |
| `context source discover` / `fetch` | 发现来源清单，或抓取可移植的快照，不登记任何内容 |
| `context source batch-status <job-id>` | 读取已保存的登记检查点 |
| `context source list` / `get <id>` | 列出登记表条目，或显示其中一条 |
| `context source rename <id>` | 重命名笔记或会话摘要，并更新对它的引用 |
| `context source remove <id>` | 预览或删除未被引用的来源及其快照 |
| `context source inspect [name]` | 显示仓库的模块边界，不进行抽取 |
| `context source ensure [name]` | 检查仓库检出，不执行克隆、检出或重置 |
| `context source recovery-plan [name]` | 规划缺失仓库检出的恢复，不修改文件 |
| `context source restore` | 根据明确的本地或克隆决定恢复仓库检出 |
| `context indexer catalog` | 列出内置 Skill 的名称、描述和入口 |
| `context indexer report-benchmark` | 基于独立加载的 oracle 生成前向测试报告 |
<!-- /context:section -->

<!-- context:section id="debug" -->
## 诊断

| 命令 | 作用 |
| --- | --- |
| `context debug enable` / `disable` | 开启或关闭知识工作区本地的追踪；关闭时保留已有的追踪记录 |
| `context debug status` | 显示调试配置、计数和追踪路径 |
| `context debug export` | 根据事件流生成回放投影 |

也可以在创建时通过 `context init --debug` 开启追踪。
<!-- /context:section -->
