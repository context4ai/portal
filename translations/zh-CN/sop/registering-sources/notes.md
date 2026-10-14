---
title: 笔记
description: 将摘录、摘要和观察记录保存为笔记来源，选用它开展知识工作，并在不改写历史的前提下修正它。
translation:
  locale: zh-CN
  artifact_ref: f3b6fd09-85a3-4a4b-9941-23c6eca881f4
  source_digest: 5a4fe12c42a6f43eb41ca8c4471f5d4b28b4696485a3b64fb0a0e6161d218ed9
  translated_at: 2026-10-14T11:06:04.950Z
  source_parts:
    title: 8a7525b1492fb84833f5c4a69b30f4bfbb134f9b666b61a2c1872d63d234c085
    description: bd73a8b8e33251233ee3bc0fb1f091f63e46953b48e623eb8efc721f31d8f131
    order:
      - goal
      - prepare
      - save
      - writing
      - correct
    sections:
      goal: 834178baba2d98fbcf50493039ad00d7b65a9dc3cf16a8edb6037347b1ef23ca
      prepare: 19fa6dbfc12c05763486d43090aefb0de048930ac374d9d82a8053bb946a4744
      save: c8127c661195f7238b1f763f5f4cdba2cf120c38167b0483910c5f55563c61df
      writing: 26fa3b3ba783e9a9070683a014502d7116055528340a98b02881e42b365e32a2
      correct: fc13e5e61b24ab9c8654462581b52b78b529f8af05c00410f30d13ef027aa36a
    exterior:
      '[null,"goal"]': a510c5cf6eb3f60d592443e63d03bcda952e157eea94c9cd76a4695426cb51e9
      '["goal","prepare"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["prepare","save"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["save","writing"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["writing","correct"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["correct",null]': e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
---

# 笔记

<!-- context:section id="goal" -->
笔记是你直接提供的 Markdown：Context 无法读取的文档中的摘录、一项决策的摘要、一线观察记录、经验总结出的检查清单。Context 将其保存为来源，路径为 `sources/note/YYYYMMDD/topic.md`。它没有登记表，也没有采集阶段——保存下来的文件*本身*就是页面所引用的证据。

当材料是你手头已有的文本时，使用笔记。如果内容来自 Agent 对话，使用[会话摘要](session-summaries.md)；如果 Context 能自行采集原文，则使用[文档来源](document-directories.md)或[飞书来源](lark-documents.md)。
<!-- /context:section -->

<!-- context:section id="prepare" -->
## 准备内容

笔记可以包含原文、精选的逐字摘录、摘要，或几者混合。没有固定模板要求，但如果同时包含原文和摘要，请用标题或文字把它们分开，并将摘要明确标注为摘要，而不是原始记录。

- 保留会影响结论的限定条件、例外、分歧和未决问题。
- 当省略内容很重要时，说明材料的出处以及略去了什么。
- 只引用真实的输入；不要编造链接、发言人、日期或确认信息。
- 笔记中出现某个链接，并不代表其目标已被读取。

页面按保存时的样子引用笔记，所以在保存之前，请删去最终读者不应看到的任何内容。
<!-- /context:section -->

<!-- context:section id="save" -->
## 保存并选用

用自然语言告诉 Agent：

```text
请把这些发布流程笔记保存为 Context 笔记，再用它们整理一篇热修复发布指南。
```

Agent 会通过 `context source import` 保存正文。仅保存不会启动任何知识工作。要在生产任务中使用该笔记，Agent 会在 `src/index.ts` 中加入它的类型化引用，同时保留已有的来源和阶段：

```ts
source("20261012/release-process.md", { type: "note" });
```

如果笔记只用于支撑某个已有页面，则无需这样做：在修订时它会被纳入该页面的阅读范围。
<!-- /context:section -->

<!-- context:section id="writing" -->
## 笔记如何变成知识

Agent 会把有用的内容融入面向读者的讲解、规则或步骤中；它不会整篇照搬笔记，也不会把提议当成事实。只有在措辞本身很重要时，才会引用一小段原文。引用指向存储的笔记，绝不指向 Agent 无法读取的原始材料。
<!-- /context:section -->

<!-- context:section id="correct" -->
## 修正笔记

两类不同的问题，对应两种不同的修复方式：

| 问题 | 修复方式 |
| --- | --- |
| 笔记没有如实反映材料 | 通过 `source import` 修正笔记本身，并传入它当前的 `base_digest`。 |
| 笔记无误，但某个页面有误导 | 只修订该页面，并提交审核。 |

批准知识绝不会修改或删除笔记。如需重命名笔记，`context source rename <ref> --name <name>` 会先预览变更，再安全地更新已有引用。
<!-- /context:section -->
