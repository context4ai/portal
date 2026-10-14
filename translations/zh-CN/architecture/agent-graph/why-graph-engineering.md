---
title: Graph Engineering 设计原则
description: Agent Graph 背后的 Graph Engineering 原则、它们针对长篇 Agent Skill
  解决的问题、每条原则如何落到实现，以及第 1 版有意不提供的能力。
translation:
  locale: zh-CN
  artifact_ref: 5cdd4f61-6dd2-434e-a112-cc6352704faf
  source_digest: e3206d657ab6ec2a9ca252ceaafbb765981b3703c0086220ed77cd7be0e6e6c2
  translated_at: 2026-10-14T00:33:49.600Z
---

# Graph Engineering 设计原则

<!-- context:section id="what" -->
本页说明 Agent Graph 背后的设计原则，以及每条原则如何成为实现的一部分。Agent Graph 是什么、目的是什么、一个小例子以及 Skill 何时应当采用它，请先看 [Agent Graph 是什么](../../sop/agent-graph/introduction.md)。

接下来可以阅读：

- **工作原理：**[核心模型](core-model.md)、[运行与恢复](runs-and-recovery.md)、[技能与 Provider](skills-and-providers.md)、[在 Context 中的应用](agent-graph-in-context.md)。
- **指南：**[快速上手](../../sop/agent-graph/getting-started.md)、[编写 Graph](../../sop/agent-graph/authoring-graphs.md)、[测试与发布](../../sop/agent-graph/testing-and-publishing.md)。
- **参考：**[规范](../../product/reference/agent-graph/specification.md)、[CLI 与 SDK](../../product/reference/agent-graph/cli-and-sdk.md)、[版本迁移](../../product/reference/agent-graph/migration.md)。
<!-- /context:section -->

<!-- context:section id="problem" -->
## 问题所在

Agent 通常知道得足够多。长任务中更难的问题在于：**此刻**适用的是哪一部分，下一步哪个动作合法，什么能证明这个动作已经完成，以及中断后从哪里恢复。把提示词写得更长并不能可靠地解决这些问题：把复杂 Skill 写在一份文档里，拓扑是扁平的，所有规则彼此相邻，往往被一起加载，Agent 只能从对话中推断当前所处的阶段。这样的工作流也很难在不运行完整模型行为的情况下进行测试。

> 上下文应当被发现，而不是被堆积。计划是显式的；路径则依据当前的现实来选择。
<!-- /context:section -->

<!-- context:section id="principles" -->
## Graph Engineering 原则

“Graph Engineering”是一个新兴的架构标签，而不是官方协议或某个单一实现；以这个名义发表的内容涵盖反馈与审计循环、持久化的多 Agent 组织，以及动态生成的任务图。Agent Graph 吸收了其中的工程原则，但并不占用这个术语，并把问题收窄为：*如何让 Agent 发现下一个合法动作以及它所需的那部分上下文，同时让长工作流保持可观察、可测试、可恢复？*

- **从提示词到拓扑。** 提示词工程改进的是单次交互，上下文工程塑造的是单次交互能看到什么。Graph Engineering 进一步关注信息、授权、动作、证据和反馈如何在多次交互之间流动。图本身并不增加上下文；它划出边界，让 Agent 在 Route 选定之后只加载一小块相关内容。
- **现实留在优化器之外。** Agent Graph 区分 **facts**（来自 Provider 或宿主的可观察状态）、**outcomes**（一次动作尝试的显式结果）和 **instructions**（操作步骤）。指令不能断言事实；如果记录了成功但缺少节点要求的证据，结果会变为 `unverified`。来源摘要值、构建回执、测试结果和限定范围的审核决定是典型的外部锚点；另一个模型表示同意是有用的证据，但不是锚点。
- **契约，而不是散文画成的图。** 只有可独立执行、受 Gate 控制、可恢复、可重复或可测试的步骤才会成为节点；说明性内容留在文件中。每个元素都带有边界契约——Action 带有它的 runner 和 effect，Gate 带有由谁决定，节点带有它需要的事实以及证明其完成的事实——因此可视化的图是可执行契约的一个视图。
- **由循环组成的图。** 审核、修复、轮询和重新规划循环都是显式的 `repeat` 边，带有类型化的 Outcome 和停止条件。每次迭代都是一个 Route，每个结果都是一个事件，因此宿主可以设置检查点、执行预算限制，或把工作交给另一个 Agent。
- **稳定的组织，动态的工作。** Graph 描述的是稳定的工作类别；当前目标、日期和队列项是由稳定的 Host Action 解析出的 Facts，因此 Graph 永远不必为每次运行而重写。
- **把渐进式披露做成结构。** 一个精简的 Skill 只承载引导循环，评估只返回摘要，每个 Route 只以带摘要值的文件位置形式返回自己的资源，从不返回文档正文。
- **可观察，但不强制运行时。** 评估可以是无状态的；可选的 Run 会在宿主选定的路径上记录事件和 Outcome。
- **先可测试，再谈自主。** Route 测试断言某个已知状态会暴露哪一步，无需调用模型。
<!-- /context:section -->

<!-- context:section id="mapping" -->
## 原则如何落地为实现

| 原则 | Agent Graph 实现 |
| --- | --- |
| 外部现实 | 受限的 Fact 检查与 `satisfiedBy` |
| 边界契约 | 对象字段封闭的严格 JSON Schema |
| 类型化反馈 | 八种互不相同的 Outcome |
| 渐进式上下文 | 必需和推荐的文件 Resource 位置 |
| 显式授权 | Gate 加上会话范围的授权输入 |
| 恢复 | 失败边与 repeat 边、Run 事件、检查点与恢复 |
| 可解释性 | 确定性的 Evaluation 与 Route、检查、摘要值 |
| 稳定的原因 | Route 原因码加可选的 Code Catalog |
| 可测试性 | 声明式的状态到 Route 用例 |
| 可移植性 | 相对 Provider 引用与宿主选择的存储 |
| 供应链清晰度 | Action effect、可达文件产物包、内容摘要值 |

第 1 版刻意**不**提供：任意表达式、自修改的图、跨 Provider 调用、模型调用或多 Agent 编排、并行执行、由边携带的产物或共享可变状态、调度器或持久化定时器、对命令或第三方 Skill 的自动信任，以及对 Agent 输出正确性的语义证明。这些限制让它保持为一套标准和工具链，而不是又一个包罗万象的 Agent 框架。
<!-- /context:section -->
