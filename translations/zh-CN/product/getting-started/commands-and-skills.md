---
title: 命令与技能
description: 一份简短清单：你在对话中调用的入口、各 Agent 宿主中的写法，以及无需调用即可运行的 Skill。
translation:
  locale: zh-CN
  artifact_ref: 7a07aeaf-a286-43a3-90c8-d04d2a8a0011
  source_digest: e343c3fb2524996729fa1bed9764de57be42b5a64932aa2037b17b685f296ef8
  translated_at: 2026-10-12T18:39:20.106Z
  source_parts:
    title: 551889e3861b307253c671afb3de4c39e0483a53cfda4f32c544f71972fe1a2d
    description: 1fd9afd055e682d6198e12548ba0f9c2ea4eb74b56f93cde99f4752515739bf6
    order:
      - goal
      - invoke
      - hosts
      - automatic
      - never
      - requests
    sections:
      goal: c54ead24b4e40b234d4bf6c5e8ba98abb9afebb8b6a6c72fc577d99fcc4e74b7
      invoke: 96dec651d77ed0cd32dece8ee44e55ce451fabcd3b0a3968546f9171c80a9c5a
      hosts: 51e9736dc0496eb71d216513fd50d160b2ebf997a9d415c13538a506f5e65e7e
      automatic: e336afd33c6a9145472a98812ff674323105de0c38b05664684d101cdc952fad
      never: 46d68a933e524908a0367e5440166accfb2bd6a362eb7ab5cca889e8242817fb
      requests: 8e6eda579bbd5f0a6573f629a60c76b2a760c2eedf068bce0fa7c9321c83c401
    exterior:
      '[null,"goal"]': 1305505b487ba7327366db5457ea25e59d67b0f0ad1b7e3180a305dadd01a98d
      '["goal","invoke"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["invoke","hosts"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["hosts","automatic"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["automatic","never"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["never","requests"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["requests",null]': e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
---

# 命令与技能

<!-- context:section id="goal" -->
你通过少数几个对话入口使用 Context。其余一切——生命周期 CLI 命令、Indexer 以及工作流自身的步骤 Skill——都在这些入口背后运行，由当前 Route 选择，而不需要你手动输入。

```mermaid
flowchart LR
  you["你，使用自然语言"] --> entry["入口 Skill<br/>/c4a:context 等"]
  entry --> cli["context CLI<br/>当前 Route"]
  cli --> step["工作流步骤 Skill"]
  cli --> idx["Indexer Skill"]
  step --> cli
  idx --> cli
```
<!-- /context:section -->

<!-- context:section id="invoke" -->
## 你调用的入口

| 入口 | 用途 | 示例 |
| --- | --- | --- |
| `/c4a:context` | 创建或继续 Context 知识工作区，执行生产、审核、更新和构建 | *“为 ../billing-service 构建经过审核的知识，读者是值班工程师。”* |
| `/c4a:context-plan` | 在生产前分阶段规划大型项目或大范围更新 | *“为这三个仓库和设计文档目录规划知识。”* |
| `/c4a:context-inspect-search` | 基于知识包或已批准的知识提问，并附带来源 | *“退款是如何重试的？请引用代码。”* |
| `/c4a:context-repo-content` | 登记或编辑同一仓库中的文档和自编 Skill，不启动生产 | *“把 docs/ 和 .agents/skills 登记为仓库内容。”* |

`/c4a:context` 是新建和已有知识工作区的生产入口。其他三个入口自身不推进生产：需要生产知识时，规划结果、指出知识缺口的回答或已登记的仓库内容都会交回 `/c4a:context`。Context 已经处于活动状态的对话无需再次调用即可继续；普通的编码或设计对话永远不会自行启动它。

要创建新的 Indexer，用自然语言提出即可——*“在 ./skills 中为我们的 RPC 框架创建一个 Indexer Skill”*。`context-indexer-create` Skill 会接手这个请求；它不是菜单命令。
<!-- /context:section -->

<!-- context:section id="hosts" -->
## 各宿主中的写法

| 宿主 | 入口形式 |
| --- | --- |
| Claude Code | 插件命令 `/c4a:context`、`/c4a:context-plan`、`/c4a:context-inspect-search`、`/c4a:context-repo-content` |
| Cursor | 命令 `/c4a-context`、`/c4a-context-plan`、`/c4a-context-inspect-search`、`/c4a-context-repo-content` |
| Codex | 按名称调用的 Skill：`context`、`context-plan`、`context-inspect-search`、`context-repo-content` |
| 只安装到单个仓库（`context plugin install --local`） | 同样的入口，但没有 `c4a` 插件命名空间 |

安装或更新插件后，请重启或刷新宿主，让它加载当前的入口。参见[安装](installation.md)。
<!-- /context:section -->

<!-- context:section id="automatic" -->
## 自行运行的 Skill

| Skill | 何时运行 |
| --- | --- |
| `context-code-indexer`、`context-markdown-indexer`、`context-note-indexer`、`context-sessions-indexer` | 在规划和写作期间，由 Agent 根据当前来源和需求选用。安装某个 Indexer 只是让它可用，并不会在每个知识工作区中启用。参见[社区 Indexer](../../sop/custom-indexers/community-indexers.md)。 |
| `context-inspect-search` | 当宿主或 Bot 配置把知识问题路由给它时，也会运行。 |
| 工作流步骤 Skill：`work-production-stage`、`translate-site-locales`、`record-workspace-version`、Indexer 生命周期步骤，以及 `recover-workspace` | 当前 Route 选中对应步骤时运行——写作某个生产阶段、翻译站点、记录版本，或恢复卡住的任务。 |

Indexer Skill 安装时不带插件命名空间，因此在每个宿主中名称都相同。

Agent 插件中每个 Skill 的触发条件与交接关系，见[技能清单](../reference/context/skills.md)。
<!-- /context:section -->

<!-- context:section id="never" -->
## 你永远不需要输入的内容

生命周期命令——`context source add`、`context review …`、`context build` 等——都由 Agent 按 Route 返回的确切修订执行。你会在进度消息中看到它们，但你只需描述目标。没有 `context continue` 命令：Agent 启动时，`context entry` 和 `context status` 会观察知识工作区并返回下一步。完整的命令列表见 [CLI 命令参考](../reference/context/cli-commands.md)。
<!-- /context:section -->

<!-- context:section id="requests" -->
## 常用请求

| 你想要 | 可以这样说 | 延伸阅读 |
| --- | --- | --- |
| 开始 | *“在 ./kb 中为……创建一个 Context 知识工作区；读者是……”* | [快速开始](quick-start.md) |
| 添加材料 | *“把 ../docs/refunds 加入来源，并重新规划受影响的部分。”* | [与 Agent 协作](../../sop/planning-and-production/working-with-agents.md) |
| 修正页面 | *“修订重试页面：上限是五次，不是三次。”* | [修订页面](../../sop/review-and-revision/revising-a-page.md) |
| 跟进变更 | *“billing 仓库发布了新版本；更新受影响的页面。”* | [更新知识](../../sop/updates-and-versions/updating-knowledge.md) |
| 移交审核 | 在任务中添加一个 `CONTEXT_RUN_POLICY` 块 | [托管模式与审核策略](../../sop/planning-and-production/managed-mode-and-review-policy.md) |
<!-- /context:section -->
