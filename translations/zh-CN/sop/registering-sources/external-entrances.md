---
title: 外部入口
description: 在 imports.yaml 中声明外部知识站点和 Skill，让读者可以跳转过去，而不把它们作为证据采集。
translation:
  locale: zh-CN
  artifact_ref: 9e5aef24-16bb-4f72-9488-298444ea7de7
  source_digest: e52ff628ed5a184987d51bf694007ad91b576aaf7f7e0e7db8103fbe984730a5
  translated_at: 2026-10-14T10:25:47.577Z
---

# 外部入口

<!-- context:section id="goal" -->
有些内容应当放在你的知识旁边，却不应成为知识的一部分：例如另一个站点上的团队工程手册，或发布在另一个仓库中的 Skill。Context 知识工作区根目录下的 `imports.yaml` 用于声明这类**入口**。Context 从不下载、安装或采集它们，只记录它们的位置，以便页面和知识包链接过去。

| 你需要 | 使用 |
| --- | --- |
| 读者可以点击跳转的链接 | `imports.yaml` 中的一个导入项 |
| 必须可追溯、需要跟踪变化的结论 | 已登记并已采集的来源 |
| 同一仓库中的文档或 Skill | [同仓库文档](same-repository-docs.md) |
<!-- /context:section -->

<!-- context:section id="declare" -->
## 声明入口

需要建立长期关联时请告诉 Agent；提问过程中的临时查阅不会登记任何内容。

```yaml
protocol: context.imports/v1
imports:
  engineering-guide:
    kind: knowledge
    url: https://docs.example.org/engineering/
    description: Engineering conventions
  release-check:
    kind: skill
    url: https://github.com/example/skills/tree/v1/skills/release-check
    path: skills/release-check
    version: v1
```

稳定 ID 和 `url` 是必填项；`kind`、`format`、`title`、`description`、`path` 和 `version` 是可选的自由格式提示。URL 必须是不含凭据的 HTTP(S) 地址，切勿在查询字符串中放入访问令牌。当目标的身份发生变化时，请使用新的 ID。
<!-- /context:section -->

<!-- context:section id="link" -->
## 在页面中链接入口

```markdown
See the [Engineering guide](context:import/engineering-guide).
```

构建时会把它原样替换为声明的 URL；不会猜测 Provider 的 URL、追加 `path` 或改写版本。未知的 ID 会保留链接文字作为纯文本，并产生一条构建警告。

如果想给读者提供所有入口的目录，可以在知识包上启用导入页；`importsPage: { site: true }` 还会把它加入网站导航：

```ts
kbPackage({ name: "handbook", template: { path: "src/package-templates/kb" }, importsPage: true });
```

该页面只列出声明的元数据。在暴露私有入口之前，请确认每个入口都适合目标读者。
<!-- /context:section -->

<!-- context:section id="evidence" -->
## 入口不是证据

导入项不会向 `knowledge/structure.yaml` 的引用中添加任何内容，也没有引用格式。当你要求检查导入项时，Agent 会使用自身获得授权的工具，把当前版本与 `version` 进行比较；无法访问的目标会报告为“版本未知”，而不会报告为发生了变化。CLI 本身从不联系 Provider。
<!-- /context:section -->

<!-- context:section id="raw-material" -->
## 入口、来源与 raw 目录

为新知识库调研时，很自然会把原文收集到一个 `raw/` 目录，再配一份记录文档链接的 YAML。别让这份清单变成第二套来源系统：

| 材料 | 放在哪里 |
| --- | --- |
| 需要保持可追溯、需要跟踪变化的结论 | 登记为来源，并保留快照 |
| 读者只需要跳转过去的内容 | 在 `imports.yaml` 里声明为入口 |
| 无法稳定采集、手工收集的证据 | `raw/` 目录，每项标明来源、获取时间、版本、权威状态以及它替代了什么 |

入口不会因为被列出来就变成证据；结论依赖某份材料时，放进 `raw/` 也不能代替采集。决定每份文档归入哪一行的筛选过程，见[知识库冷启](../practices/cold-start.md)。
<!-- /context:section -->
