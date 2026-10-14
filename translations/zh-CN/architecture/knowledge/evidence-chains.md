---
title: 证据链与索引优先
description: Context 知识的每个章节如何始终关联到确切的来源区域，以及 Agent 如何沿着这条链从答案回到原文。
translation:
  locale: zh-CN
  artifact_ref: dd332587-8faa-4ebe-88ca-247cfb146ba5
  source_digest: 293faab9054497d09a6448f7b738557ce1c30f8cd84e28bf1ef055e203947a00
  translated_at: 2026-10-12T16:45:10.508Z
  source_parts:
    title: a6df28bbcafb55c80528181c7dbcefe8dd329a5baf7c3eae7814b23c6e91b152
    description: 416ea4877802430e553d97d8b67f6e64903eb6fcdc6c88a9d5b04d9995b8c404
    order:
      - chain
      - sections
      - verify
      - index-first
      - site
    sections:
      chain: ebfde52d775d6d0bd56337fc3da14073425a9753d054d45707c0ad42d508f72e
      sections: 883ac64875c1add606eb053a13bc2b1d4a5447a09e8c49516ef0cc8d90263bdb
      verify: 3486d347654558dc5c63b8adc8a06f988854eb9bed21f01e80b4cac135f91d54
      index-first: 94af68cafc81ef90062f7d08d1ee47cbf65b2d2d46fe074e925410e63a639144
      site: 2f95540f5fc7445dbf2872584f7f656c4e7fb2e96aa2571ac962e90ff4600e84
    exterior:
      '[null,"chain"]': 3ab45e44e6b05496b528d87c6ea26f7bcb61325172d8bc3f2ad9d99c73540c7a
      '["chain","sections"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["sections","verify"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["verify","index-first"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["index-first","site"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["site",null]': e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
---

# 证据链与索引优先

<!-- context:section id="chain" -->
## 证据链

```mermaid
flowchart LR
  q["问题"] --> map["知识地图与索引"]
  map --> page["文章章节"]
  page -->|source_ref + 文件与行号| region["固定版本的来源区域"]
  region -->|内容摘要| check["写入和验证时校验"]
```

回答从知识地图出发，落到某篇文章的章节，再沿引用到达已登记来源中的确切区域。每一步都可校验：引用写明了来源和行号；来源固定在某个版本；区域内容带有指纹。
<!-- /context:section -->

<!-- context:section id="sections" -->
## 章节自带证据

已批准的文章按章节划分。每个写作片段最多引用三个来源位置，每个位置由一个 `source_ref` 加上文件和行号 `locator` 组成。提交文章时，CLI 会检查每个被引用的来源是否已授权给该任务，读取当前采集到的文本，并计算该区域的内容摘要。未知或未授权的路径以及来源版本漂移都是错误，而不是警告。无需另外维护事实表或论断台账——引用本身就是证据。

`source_ref` 的值是不透明的、经过校验的标识。Agent 需原样复制它们；它们不是文件系统路径。
<!-- /context:section -->

<!-- context:section id="verify" -->
## 交付前再次检查

`context verify` 会在 close 和构建之前重新检查已批准的页面：来源引用是否最新、是否逐字匹配，frontmatter 标识、章节块、资源文件以及派生结构。验证错误会阻止 close 和构建。已批准的 Markdown 在 frontmatter 和章节元数据中保持稳定的标识，因此页面可以修订而不丢失历史。
<!-- /context:section -->

<!-- context:section id="index-first" -->
## 先查索引，再看原文

基于知识包回答问题的 Agent，从目录索引和构建清单中的边记录出发，阅读候选页面，并引用其中的标题和段落。当知识包未覆盖所需事实时，Agent 会报告缺口，而不是猜测。面向使用者的知识包会省略章节元数据以保持精简；维护者可以通过清单把任意页面映射回 Context 知识工作区，查看其完整证据。

借助 Source Graph，这条链无需克隆即可到达代码：可选的证据插件把章节标记、`knowledge/structure.yaml` 和来源登记关联起来，因此 Agent 在固定版本上阅读代码时，也能拿到引用这段代码的知识章节。该插件是只读的；它不校验来源内容，也不修改知识。
<!-- /context:section -->

<!-- context:section id="site" -->
## 对读者可见

在文档站点上，每篇文章末尾都有一个根据其记录的引用生成的来源页脚：仓库条目链接到记录的版本和模块，文档条目链接到其登记的 URL。链接从不从正文推断。
<!-- /context:section -->
