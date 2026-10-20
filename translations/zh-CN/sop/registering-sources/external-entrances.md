---
title: 外部入口
description: 声明外部知识站点和 Skill，让读者可以跳转过去，而不把它们作为证据采集。
translation:
  locale: zh-CN
  artifact_ref: 9e5aef24-16bb-4f72-9488-298444ea7de7
  source_digest: 06b929d92de436a5ca87eaac09460f84c008872e2b9e140f4b4bcd1e0240a12d
  translated_at: 2026-10-19T19:47:45.248Z
---

# 外部入口

<!-- context:section id="goal" -->
有些内容应当放在你的知识旁边，却不应成为知识的一部分：例如另一个站点上的团队工程手册，或发布在另一个仓库中的 Skill。知识工作区可以在 `imports.yaml` 中声明这类**入口**。Context 从不下载、安装或采集它们，只记录它们的位置，以便页面和知识包链接过去。

| 你需要 | 使用 |
| --- | --- |
| 读者可以点击跳转的链接 | 外部入口 |
| 必须可追溯、需要跟踪变化的结论 | 已登记并已采集的来源，参见[选择添加材料的方式](source-batches.md) |
| 同一仓库中的文档或 Skill | [链接已有的文档与 Skill](same-repository-docs.md) |
<!-- /context:section -->

<!-- context:section id="declare" -->
## 声明入口

需要建立长期关联时请告诉 Agent；回答问题过程中的临时查阅不会登记任何内容。

```text
把我们的工程手册 https://docs.example.org/engineering/ 添加为外部入口，
命名为 engineering-guide，描述为“Engineering conventions”。
```

每个入口都有一个稳定 ID 和一个 URL。类型（如知识或 Skill）、标题、描述、路径和版本是可选提示。URL 必须是不含凭据的 HTTP(S) 地址，切勿在查询字符串中放入访问令牌。当目标的身份发生变化时，请使用新的 ID。
<!-- /context:section -->

<!-- context:section id="link" -->
## 在页面中链接入口

请 Agent 在读者需要的位置链接该入口。在页面源文件中，链接通过 ID 指明入口：

```markdown
See the [Engineering guide](context:import/engineering-guide).
```

构建时会把它原样替换为声明的 URL；不会猜测地址、追加路径或改写版本。未知的 ID 会保留链接文字作为纯文本，并产生一条构建警告。

如果想给读者提供所有入口的目录，可以请 Agent 在知识包中添加一个入口页，也可以选择把它加入网站导航。该页面只列出声明的信息，因此在暴露私有入口之前，请确认每个入口都适合目标读者。
<!-- /context:section -->

<!-- context:section id="evidence" -->
## 入口不是证据

入口从不被引用，也不会给页面的参考来源增加任何内容。当你要求 Agent 检查入口时，它会使用自身获得授权的工具，把当前版本与声明的版本进行比较；无法访问的目标会报告为“版本未知”，而不会报告为发生了变化。Context 本身从不联系这些服务。

首次组建知识库、手工收集原文时，入口、来源和手工收集的材料如何配合，参见[知识库冷启](../practices/cold-start.md)。
<!-- /context:section -->
