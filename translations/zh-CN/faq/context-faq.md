---
title: 常见问题
description: 团队在采用 Context 之前和使用过程中最常问的问题及简短回答。
translation:
  locale: zh-CN
  artifact_ref: c159a1f9-e117-446a-92b5-b8a5a46703f9
  source_digest: 3016a6ce3c15d078485b7b45d43552a13b66846e885ae824d5986970e3d1d0f5
  translated_at: 2026-10-12T16:45:10.508Z
  source_parts:
    title: dbc468a14b601d5d9240aeb72b9fcd2f8aed2f4e30932876edf8d16ec313846b
    description: 4b6c198f80701b98645b912520d90068020aa26c09d013becaf429d3bb627e0f
    order:
      - central-or-local
      - quality
      - package-vs-wiki
      - maintainer-steps
    sections:
      central-or-local: 0a3bc84618224b239731d1846c883ee385453a9c7b87aa3c735f023cbbd4df25
      quality: 2368c18cc6e09222fb949bb45359c9b40a0fa4226219a76bde581a4a419695c3
      package-vs-wiki: 382a6bda52c077f74d3102bda843b8d05f8ee864ea51c5eed291023911cb2942
      maintainer-steps: 7738c4c855fd61dc7335f18f41782d8124b43dcb498b0462c3e99cc38db0b98c
    exterior:
      '[null,"central-or-local"]': 55c515123d1848de1d09d780eba2493376e27db968bdd550a3f6b179332e3d64
      '["central-or-local","quality"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["quality","package-vs-wiki"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["package-vs-wiki","maintainer-steps"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["maintainer-steps",null]': e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
---

# 常见问题

<!-- context:section id="central-or-local" -->
## 小模块也需要中心知识库吗？

不一定。中心知识库适合多人共享、需要远程使用的知识：团队把仓库、文档和会议纪要登记一次，团队的 Bot、文档站点和每位成员的编码 Agent 读到的都是同一份经过审核的知识。

小模块或只有一位维护者的内容，放在仓库的 `docs/` 里即可。Context 可以把同仓库的文档登记为仓库内容，而不必复制进知识库。
<!-- /context:section -->

<!-- context:section id="quality" -->
## 知识由 AI 撰写，质量如何保证？会不会越写越臃肿？

人把握方向，细节交给 Agent。

- 在审核报告中，由人判断分类、更新范围和粒度是否合适。Diff 报告批准之前，任何内容都不会发布。
- 每条结论都记录来源（文件、行号和版本），写入知识之前会先检查引用。
- 在生产和更新过程中，Agent 会交叉核对来源。它经常发现上游文档落后于代码，于是依据代码修正知识；如有需要，也可以把修正回写到上游。
- 知识围绕问题压缩来源，只保留能回答问题的内容。知识库变大后，可以让 Agent 重新整理目录和标题。

详见[证据链与索引优先](../architecture/knowledge/evidence-chains.md)和[写给 Agent 的知识](../architecture/knowledge/knowledge-for-agents.md)。
<!-- /context:section -->

<!-- context:section id="package-vs-wiki" -->
## 知识包和 LLM Wiki 有什么不同？

知识包是一个容器，并不规定内容怎么写。Context 提供默认的 Indexer 和写作模式，团队也可以定制自己的生产技能，以及知识包交给 Agent 使用的技能。

与只有页面的 LLM Wiki 相比，知识包还带有索引、证据链和面向 Agent 的查询入口。这些目录随知识库的每次迭代自动维护，无需任何人手动同步。详见[知识包与站点构建](../architecture/context/packages-and-sites.md)。
<!-- /context:section -->

<!-- context:section id="maintainer-steps" -->
## 更新流程看起来很长，维护者实际要处理什么？

只需要审核。提交 Context 知识工作区、构建知识包和发布站点默认都在后台静默完成；只有在 Diff 审核、权限问题或有异议时才会打扰维护者。在网站上审核完 Diff 报告后，流程会自动继续。
<!-- /context:section -->
