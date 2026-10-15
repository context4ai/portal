---
title: 修订页面
description: 修正单个页面——无论是仍在审核中的候选，还是已批准的页面——同时保留其身份、URL 和来源引用。
translation:
  locale: zh-CN
  artifact_ref: 7e11e6c2-7029-4e7f-a717-47566aa4153f
  source_digest: dc9818154a2c9908372637f50a798f30f7ab37b6c3dd6d5bd67f77ade1e5a450
  translated_at: 2026-10-15T06:25:34.171Z
---

# 修订页面

<!-- context:section id="goal" -->
修订是在不重新生产的前提下修改页面。它从当前文本出发，只改动你的指令和来源所支持的内容，然后把结果重新提交审核。页面会保留其身份和 URL，因此措辞、结构和事实层面的修正都适合用修订来完成。
<!-- /context:section -->

<!-- context:section id="which" -->
## 两种情况

| 页面状态 | 如何提出 | 会发生什么 |
| --- | --- | --- |
| 当前审核中的候选 | 在报告中写备注，或在对话中直接说明 | Agent 在同一批次内修复它，并展示更新后的报告 |
| 已批准 | *“修订 `<page>`：`<problem>`，保留来源引用”* | Agent 运行 `context revise <page> --instruction "<text>"`；新版本进入审核 |

对于不在当前批次中的已批准页面，修订会进入队列，默认在该批次结束后执行；`--timing priority` 可请求更早交付，但绝不会跳过审核。多个已批准页面可以通过 `context task maintain` 一起修订。
<!-- /context:section -->

<!-- context:section id="how" -->
## Agent 会做什么

- 先通读整个页面，保留仍然正确的讲解，包括你此前贡献的内容。
- 仅修改措辞时，只依据已批准的文本；不会重新采集或重新解析来源。
- 修改事实时，读取相关的已登记材料。只存在于你指令中的新事实，会先保存为来源，例如一条[笔记](../registering-sources/notes.md)。
- 可以编辑单个章节或整个页面。编辑章节时，其他章节及其引用保持不变；修改引用会替换该章节的引用，Context 会重新计算其指纹。
- 编辑省略 `references` 时，保留该章节已验证的引用；列出引用则会按本次修订的来源重新确认。引用可以用 Markdown 标题或精确引文代替行号来定位，并以行号范围保存。
- 修正需要修订范围之外的来源作为证据时，登记该来源，在 `src/indexers.yaml` 中将其关联到需求，并运行 `context task adjust`。新增的来源对同一修订中排队的其余页面仍可引用。

提交之前，Agent 可以预览组装后的页面和之前的文本，而不必接受这次编辑。
<!-- /context:section -->

<!-- context:section id="move" -->
## 移动或重命名页面

`context revise <page> --move-to <new-path>` 可一步完成修订和移动。页面保留其文章身份和章节 ID，相对链接会基于新位置重新计算，批准时会一并更新指向它的 Markdown 链接——不会产生第二份副本，也无需手动删除。如果只想修改标题或菜单位置，请调整知识地图；参见[大规模重组](reorganizing-at-scale.md)。
<!-- /context:section -->

<!-- context:section id="generated" -->
## 生成的参考页面

带有生成式 API 表格的页面需要重新生成，而不是手动编辑：`--regenerate` 会根据当前来源重建其程序块，即使版本没有变化也是如此。如果重新生成后同样的错误值依然存在，Agent 会报告该页面、字段以及与来源的对比，而不是重复修复。
<!-- /context:section -->

<!-- context:section id="source-wrong" -->
## 当来源本身有误时

如果页面忠实反映了一个本身有误的来源，请修正来源——重新采集，或修正笔记或会话摘要——然后再更新页面。如果来源无误而页面有误导，则只修订页面。
<!-- /context:section -->
