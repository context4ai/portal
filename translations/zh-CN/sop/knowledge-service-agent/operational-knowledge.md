---
title: 把运维手册写成知识
description: 如何把运维手册写成知识文章，通过 Agent 对话使用它们，避免凭据进入知识，并让运维手册保持最新。
translation:
  locale: zh-CN
  artifact_ref: da3d3b26-40b2-4183-b9d7-73cff0b8980f
  source_digest: 373dc6d52c8ab314eee5f2545094ff5d2adf5ff3ab705feea7a550dff5482f10
  translated_at: 2026-10-20T06:16:49.422Z
---

# 把运维手册写成知识

<!-- context:section id="goal" -->
驱动命令行工具的运维流程——部署、轮换缓存、检查服务——可以写成知识文章，再直接通过 Agent 对话使用。流程的文档和使用集中在一处：人在站点上阅读它；当你提出请求时，知识服务 Agent 阅读运维手册，在自己的运行时中执行命令并汇报结果。

```text
按我们的“重启卡住的消费者”运维手册处理 payments 集群，在做任何改动之前先告诉我你发现了什么。
```

如何搭建这样的 Agent，见 [构建知识服务](./building-a-knowledge-service.md)。
<!-- /context:section -->

<!-- context:section id="capture" -->
## 把流程放进知识库

按流程目前所在的位置选择对应的来源：

- **笔记**：适用于只存在于人脑或聊天记录中的流程。把步骤保存为笔记——原文、逐字摘录或带标注的摘要——再由 Agent 把它整理成面向读者的文章。提议仍是提议；文章不会把它们写成事实。参见 [笔记与会话摘要](../registering-sources/notes.md)。
- **仓库中已有的文档**：适用于已经和代码放在一起的运维手册和自编 Skill，例如位于 `docs/` 或 `.agents/skills/` 下的内容。把它们链接为仓库内容：它们随代码持续演进，Context 直接引用它们，不再重新生产。参见 [链接已有的文档与 Skill](../registering-sources/same-repository-docs.md)。
- **文档来源**：适用于在文档系统中维护的运维手册；参见 [文档目录](../registering-sources/document-directories.md) 和 [飞书文档](../registering-sources/lark-documents.md)。

```text
把 docs/runbooks 下的值班运维手册添加为仓库内容，并把这个讨论串里的步骤保存为缓存清空流程的笔记。
```

把每个流程写成具体步骤：要执行的命令、预期输出、如何区分成功与失败，以及何时应停下来询问人。

如果别处发布的某个 Skill 已经涵盖这些命令，就在文章中链接它，而不是复制其中的步骤，做法是把它声明为入口；参见 [外部入口](../registering-sources/external-entrances.md)。入口只用于导航，因此必须保持可追溯的结论仍需要有自己的来源。
<!-- /context:section -->

<!-- context:section id="secrets" -->
## 只写变量，不写值

在 Agent 运行时中配置流程所需的环境变量。知识里只写变量名——绝不写它们的值。凭据保留在服务端，绝不进入知识、提示词或回复，因此流程可以放心地发布到知识包或站点中。
<!-- /context:section -->

<!-- context:section id="maintain" -->
## 保持运维手册最新

流程变化时，更新它的来源，并让 Agent 更新知识；它会修订受影响的文章。如果来源没错而文章有误导，只修订那一页；参见 [修订页面](../review-and-revision/revising-a-page.md)。当文章最终比它所依据的文档更准确时，参见 [回写上游](../updates-and-versions/writing-back-upstream.md)，避免两者逐渐脱节。
<!-- /context:section -->
