---
title: 常见问题
description: 团队在采用 Context 之前和使用过程中最常问的问题及简短回答。
translation:
  locale: zh-CN
  artifact_ref: c159a1f9-e117-446a-92b5-b8a5a46703f9
  source_digest: effdd2cbc3ac23a59a56c1037fedf98d3624d8112f1e21bb641f6126af0ed6c7
  translated_at: 2026-10-20T06:16:49.422Z
---

# 常见问题

<!-- context:section id="central-or-local" -->
## 小模块也需要中心知识库吗？

不一定。中心知识库适合多人共享、需要远程使用的知识：团队把仓库、文档和会议纪要登记一次，团队的 Bot、文档站点和每位成员的编码 Agent 读到的都是同一份经过审核的知识。

小模块或只有一位维护者的内容，放在仓库的 `docs/` 里即可，它会随代码持续演进。登记为仓库内容后，它仍留在原位置：Context 直接引用它，不再重新生产，也不复制进知识库。参见 [链接已有的文档与 Skill](../sop/registering-sources/same-repository-docs.md)。
<!-- /context:section -->

<!-- context:section id="quality" -->
## 知识由 AI 撰写，质量如何保证？会不会越写越臃肿？

人把握方向，细节交给 Agent。

- 在审核报告中，由人判断分类、更新范围和粒度是否合适。Diff 报告批准之前，任何内容都不会发布。
- 每条结论都记录来源（文件、行号和版本），写入知识之前会先检查引用。
- 在生产和更新过程中，Agent 会交叉核对来源。它经常发现上游文档落后于代码，于是依据代码修正知识；如有需要，也可以把修正回写到上游。
- 知识围绕问题压缩来源，只保留能回答问题的内容。知识库变大后，可以让 Agent 重新整理目录和标题。

详见 [证据链与索引优先](../architecture/knowledge/evidence-chains.md) 和 [写给 Agent 的知识](../architecture/knowledge/knowledge-for-agents.md)。
<!-- /context:section -->

<!-- context:section id="package-vs-wiki" -->
## 知识包和 LLM Wiki 有什么不同？

知识包是一个容器，并不规定内容怎么写。Context 提供默认的 Indexer 和写作模式，团队也可以定制自己的生产技能，以及知识包交给 Agent 使用的技能。

与只有页面的 LLM Wiki 相比，知识包还带有索引、证据链和面向 Agent 的查询入口。这些目录随知识库的每次迭代自动维护，无需任何人手动同步。详见 [知识包与站点构建](../architecture/context/packages-and-sites.md)。
<!-- /context:section -->

<!-- context:section id="maintainer-steps" -->
## 更新流程看起来很长，维护者实际要处理什么？

只需要审核。提交 Context 知识工作区、构建知识包和发布站点默认都在后台静默完成；只有在 Diff 审核、权限问题或有异议时才会打扰维护者。在网站上审核完 Diff 报告后，流程会自动继续。
<!-- /context:section -->
