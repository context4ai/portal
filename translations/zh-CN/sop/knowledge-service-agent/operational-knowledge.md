---
title: 运维知识
description: 如何把以 CLI 驱动的运维流程写成知识文章，并在不暴露凭据的前提下通过 Agent 对话执行。
translation:
  locale: zh-CN
  artifact_ref: da3d3b26-40b2-4183-b9d7-73cff0b8980f
  source_digest: a7fbee372fd89f604653997903ba67639c25cbc1dddffa3a69e8563f92910ab5
  translated_at: 2026-10-12T17:06:40.056Z
---

# 运维知识

<!-- context:section id="goal" -->
驱动命令行工具的运维技能——部署、轮换缓存、检查服务——可以写成知识文章，再直接通过 Agent 对话使用。知识服务 Agent 阅读运维手册，在自己的运行时中执行命令并汇报结果，于是流程的文档和执行都集中在一处。
<!-- /context:section -->

<!-- context:section id="capture" -->
## 把流程放进知识库

按流程目前所在的位置选择对应的来源：

- **笔记**：适用于只存在于人脑或聊天记录中的流程。把步骤保存为笔记——原文、逐字摘录或带标注的摘要——再由 Note Indexer 把它整理成面向读者的文章。提议仍是提议；文章不会把它们写成事实。参见[笔记](../registering-sources/notes.md)。
- **同仓库文档**：适用于已经和代码放在一起的运维手册和自编 Skill，例如位于 `docs/` 或 `.agents/skills/` 下的内容。把它们登记为入口；原文仍是唯一的编辑位置。参见[同仓库文档](../registering-sources/same-repository-docs.md)。
- **文档来源**：适用于在文档系统中维护的运维手册。

把每个流程写成具体步骤：要执行的命令、预期输出、如何区分成功与失败，以及何时应停下来询问人。
<!-- /context:section -->

<!-- context:section id="secrets" -->
## 只写变量，不写值

在 Agent 运行时中配置流程所需的环境变量。知识里只写变量名——绝不写它们的值。凭据保留在服务端，绝不进入知识、提示词或回复，因此流程可以放心地发布到知识包或站点中。
<!-- /context:section -->

<!-- context:section id="maintain" -->
## 保持运维手册最新

流程变化时，更新它的来源，让常规的更新流程去修订文章。如果来源没错而文章有误导，只修订那一页。当文章最终比它所依据的文档更准确时，参见[回写上游](../updates-and-versions/writing-back-upstream.md)，避免两者逐渐脱节。
<!-- /context:section -->
