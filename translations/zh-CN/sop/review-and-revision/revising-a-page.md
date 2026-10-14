---
title: 修订页面
description: 修正单个页面——无论是仍在审核中的候选，还是已批准的页面——同时保留其身份、URL 和来源引用。
translation:
  locale: zh-CN
  artifact_ref: 7e11e6c2-7029-4e7f-a717-47566aa4153f
  source_digest: 3c5bdd11edf893217b337443d88b9115e5ee3241b65e12c1eb5837023b62b2e0
  translated_at: 2026-10-12T16:11:57.590Z
  source_parts:
    title: fff94ac93d75b6855f7a68ca0e13a139f3fa52a4c8fec03c3fe9024264adf359
    description: 8ccff24081c57408b69ac183fa32366b2469845c268956148eaec8a232913542
    order:
      - goal
      - which
      - how
      - move
      - generated
      - source-wrong
    sections:
      goal: e6be8b8828e8f539e46a3932d37560cddff42d73cd8d8a51ca452f3657e653a7
      which: b66a5f57a02de193548cc203110495aaa3a020c9d6fddf8939a9b6e6950ce513
      how: 1783c602a2ee1eb3a14de3292a261a4ceb99d846e3a7895dd7c96019c24bcbdc
      move: 037fad9f9691d25e4b6cfec91bc10c595a3934d85fc8b5e8a65ba3362ecb849c
      generated: df3e7b119c4f8ea609b15bbde8ea6791831e7dfc3dd45d7f680d736bfe6056ef
      source-wrong: 9cf5cc3b1b441fe8376a153259ec2ce0ea5a38047466260b47582cdceb692044
    exterior:
      '[null,"goal"]': ac5e48d3d4d729ce40b390dba337934d7685b5aead75fa016dfc453c0d7697cb
      '["goal","which"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["which","how"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["how","move"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["move","generated"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["generated","source-wrong"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["source-wrong",null]': e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
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
