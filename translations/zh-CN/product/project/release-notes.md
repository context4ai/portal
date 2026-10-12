---
title: 发布说明
description: 近期 Context 与 Agent Graph 版本有哪些变化、升级时哪些变化需要处理，以及完整的变更日志在哪里。
translation:
  locale: zh-CN
  artifact_ref: sha256:6633b4690c3eb582de872f2146b3f64e4a9875065aaadf45701e590516810fd8
  source_digest: fdcfb367e0595ccfe3763bed3e0804265f660eff4df114645b1cc2d22f62052e
  translated_at: 2026-10-12T20:29:53.422Z
---

# 发布说明

<!-- context:section id="overview" -->
这里按读者和 Agent 能感知到的变化，汇总近期的产品版本。完整历史见 [Context CHANGELOG](https://github.com/context4ai/context/blob/main/CHANGELOG.md) 和 [Agent Graph CHANGELOG](https://github.com/context4ai/agent-graph/blob/main/CHANGELOG.md)。“更多”菜单里本站自己的 **Changelog** 是另一回事：它列出的是这套文档的版本，而不是产品版本。

升级 Context 时，运行与首次安装相同的两条命令——`npm install -g @c4a/context-cli@latest` 和 `context plugin install`——然后重启 Agent 会话；参见[安装](../getting-started/installation.md)。进行中的知识工作区不需要迁移步骤：下一次 `context status` 会为升级后的 CLI 返回新的 Route，任务恢复时也会保留工作流的读取回执。
<!-- /context:section -->

<!-- context:section id="context-0762" -->
## Context 0.7.62（2026-10-13）

- 被“更多”菜单项指向的已批准文章不再需要出现在知识地图中：知识包构建、知识地图调整和结构批准都接受这类文章，审核报告也不再把它们列为未放置。
- 仓库 README 以及贡献、支持和开发指南都链接到本文档站点，并介绍 Context 生态。
<!-- /context:section -->

<!-- context:section id="context-0761" -->
## Context 0.7.61（2026-10-12）

**知识站点**

- 读者保存的浅色或深色选择从首次绘制起生效，页面加载时不再先闪现系统配色。
- 某个读者语言未设置的首页字段，会沿用站点自身首页的标题、标语、描述和操作按钮，而不是回退到默认值。
- 访问不存在的地址时，显示居中的 404 页面，使用读者的语言，并提供返回首页的链接。
- 图表在离线审核和站点中都一次渲染完成；连线标签字号更小、居中压在所标注的连线上，子图标题不再贴住边框。

**规划**

- 大范围版本更新时，先按 Git 对象 ID 比较被引用的仓库文件再读取内容，并在部分克隆中一次性批量拉取对象，避免长时间卡顿。
<!-- /context:section -->

<!-- context:section id="context-0760" -->
## Context 0.7.60（2026-10-08）

**多语言站点**

- `site.locales` 让一个站点以多种语言发布。译文存放在 `translations/<tag>/` 下，记录它译自哪个已批准版本，过期或缺失时显示提示。
- `context translate status|prepare|submit|skip` 会校验章节、代码块和链接；翻译是记录版本之前的一个知识工作区 Route 步骤，并计入知识包的新鲜度，同时新增 `translation` Changelog 触发项。

**站点导航**

- `site.nav`、`site.more` 和 `site.socialLinks` 用于添加顶部链接、“更多”菜单条目和社交图标。“更多”菜单条目可以指向放在知识地图之外的已批准文章——本页就是这样——以根目录开头的路径还可以链接到同一域名下的兄弟应用。

参见[多语言站点](../../sop/outputs-and-sites/multilingual-sites.md)和[文档站](../../sop/outputs-and-sites/documentation-sites.md)。
<!-- /context:section -->

<!-- context:section id="context-0750" -->
## Context 0.7.50（2026-10-03）

**同仓库内容**

- 登记仓库自身的文档和自编 Skill，不把正文复制进知识，并维护安全的相对符号链接入口；参见[同仓库文档](../../sop/registering-sources/same-repository-docs.md)。
- 证据插件以及本地或远程查询都能识别这类引用，包括符号链接索引覆盖不完整的情况。

**证据与构建**

- 证据保留历史上的仓库路径和提交，能发现文档区域的位置移动，也能察觉 Skill 目录中任意位置的变化。
- 可选的仓库入口页、原始来源链接、本地化导航和离线构建回退。
- 无效的登记只作为提示并给出修复指引；无效的构建输入会被拒绝，且不会替换上一次的输出。
<!-- /context:section -->

<!-- context:section id="context-074x" -->
## Context 0.7.40 – 0.7.43（2026-09-29 至 2026-10-01）

这几个版本让远程代码证据成为日常查询的一部分：

- **0.7.40**——查询在获取本地不可用的来源之前，可以先在记录的仓库基线上使用可选的只读远程代码证据，同时保留固定提交、返回的行范围、部分批量结果和权限边界。
- **0.7.42**——无需检出仓库即可远程读取已批准的知识和记录的代码证据。CLI 内置一个只读的仓库 Wasm 插件，为读取结果附上章节证据和指向具体提交的源码 URL，通过 `context evidence install` 或在初始化知识工作区时安装。
- **0.7.43**——插件升级到 ABI 2，为每个读取项附上紧凑的引用而不替换其内容；远程查询指引改为遵循有界的默认读取、仅文件搜索和按文件的匹配上限。

本地和离线检索始终可用。参见[远程读取代码证据](../../sop/querying-knowledge/reading-code-evidence-remotely.md)。
<!-- /context:section -->

<!-- context:section id="context-0735" -->
## Context 0.7.35 – 0.7.36（2026-09-22）

- **大型项目规划。** `context-plan` Skill 负责调研项目或大范围的来源更新，每次把一个阶段交给生产，并依靠 Git 中的计划恢复进度。建议每个阶段三十篇文档、最多五十篇，每个阶段只新调研一个仓库；大范围发现需要确认范围，超过五百篇文档需要人工介入。参见[规划大型项目](../../sop/planning-and-production/planning-large-projects.md)。
- **委托审核。** 任务可以委托计划审核和文章审核，同时人工审核仍是默认方式，授权边界保持不变；参见[托管模式与审核策略](../../sop/planning-and-production/managed-mode-and-review-policy.md)。
- **文档采集。** 在线文档快照可以脱离知识工作区先抓取、之后再导入；目录发现可以断点续跑，登记以暂存方式进行，支持检查点、状态查询、重放和取消。
- **审核报告**会列出未放入导航的文章，并给出导航恢复指引。

0.7.35 之前的版本见完整的 CHANGELOG。
<!-- /context:section -->

<!-- context:section id="agent-graph" -->
## Agent Graph

**0.3.1（2026-10-13）**把脚手架、模板和示例中的 `compatibility.agentGraph` 范围提高到 `^0.3.0`，补充了 0.3.0 Resource 协议的迁移说明，并让仓库中的各指南链接到本站。

**0.3.0（2026-08-31）**对 Provider 作者是一个不兼容版本。原来的 Resource v1/v2 划分被三个相互独立的 v1 协议取代——文件、Graph-action 和 Host-action 三类资源及其位置——原有的 `agent-graph.resource.v1`、`.v2`、`agent-graph.resource-location.v1` 和 `.v2` 标识被移除。Host Action 的输入、输出和恢复接口不变，但每种物化授权现在都在序列化的 Route 和 SDK 类型中明确写出。按[版本迁移](../reference/agent-graph/migration.md)重命名现有 Provider 中的协议。

0.2 系列构建了 0.3.0 所重命名的契约：

| 版本 | 主要新增 |
| --- | --- |
| 0.2.7 | 由宿主物化的资源，带版本化的输入输出 schema，以及调度前的 Provider 校验 |
| 0.2.6 | 由 Gate 持有的委托执行策略 |
| 0.2.5 | 把感知生命周期的证据作为普通的、绑定修订号的 Facts |
| 0.2.3 | 当前会话中的资源读取回执 |
| 0.2.1 – 0.2.2 | Gate 解决动作和只读的 Gate 检查动作 |
| 0.2.0 | 基于 Facts 的路由契约和由目录支撑的原因码 |

0.1.0（2026-07-22）发布了最初的规范、SDK、CLI、schema、模板和示例。这些术语的含义见[核心模型](../../architecture/agent-graph/core-model.md)。
<!-- /context:section -->
