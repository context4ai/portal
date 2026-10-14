---
title: 知识包与站点构建
description: 已批准的知识如何构建为 Agent 知识包、文档站点和 LLM Docs，以及每种产物如何对应回 Context 知识工作区。
translation:
  locale: zh-CN
  artifact_ref: a0aef936-cc16-4cde-b209-b9c53d6ee254
  source_digest: 21e11807c58f2ccb33467ecc40d18574e1be6ae370dc201c28af7a1fa6b944fa
  translated_at: 2026-10-14T11:06:04.950Z
  source_parts:
    title: ac5a33615a7496d76511abaefe958444ba737a4fc5cf9cae611b414a5d13415e
    description: 1a774139166fcbfb5cd33082c15cdd521590cd9febe128a7e4bd6d12c52965fd
    order:
      - outputs
      - kb
      - site
      - llms
      - custom
    sections:
      outputs: e74c12a8018f734e5c63dceafffd3f5a8d546538412ed4860c3ebaf738d6dbbd
      kb: 0938357c1998632328a557584379799127a0a4190f2594de1428587d1eaf236a
      site: 3920d5bff30e4abc9c7d2f76251d1854d6487de65a4c5f93a0aaa8ef08127ecb
      llms: 7408c678876524fb63ca62d317646d43f40d51c73803e1501c6a37079a2667c7
      custom: 8459e448aa979519b425c222d6339814f270d8a3be03c4f592b20a85ddeb5637
    exterior:
      '[null,"outputs"]': d4653a46480de190fc47a9df270d49d819e14199b67ddb785a59752b08cd7cbe
      '["outputs","kb"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["kb","site"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["site","llms"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["llms","custom"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["custom",null]': e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
---

# 知识包与站点构建

<!-- context:section id="outputs" -->
## 一套知识，多种产物

```mermaid
flowchart LR
  kn["已批准的知识"] --> build["context build"]
  kmap["知识地图"] --> build
  tpl["知识包模板"] --> build
  build --> kb["知识包"]
  build --> site["文档站点"]
  build --> llms["LLM Docs"]
  build --> inv["构建清单"]
```

构建只使用已批准且已 close 的知识。多种输出渠道可以组合；对于新的知识工作区，Agent 默认建议知识包加网站，LLM 文本是额外选项。每次构建都会产出一份清单，把分发出去的文件对应回知识工作区中已批准的知识。
<!-- /context:section -->

<!-- context:section id="kb" -->
## Agent 知识包

知识包使用扁平的根目录：

| 根目录 | 内部集合 |
| --- | --- |
| `wikis/` | `codegraph`、`business`、`product` |
| `guides/` | `architecture`、`sop`、`faq`、`decision`、`incident` |
| `rules/` | `standards`、`test` |
| `feats/` | `feats` |

默认的 `knowledge-query` 技能是面向 Agent 的入口：它从目录索引开始，沿清单中的关系记录查找，阅读候选页面并引用其标题；当知识包没有覆盖某个事实时，会报告缺口。如果索引无法缩小范围，它会用自带的 `scripts/search.mjs` 在本地对 Markdown 分块排序。面向使用者的页面不包含 `sources` 和章节元数据；精确的出处保留在知识工作区中，可通过清单找到。
<!-- /context:section -->

<!-- context:section id="site" -->
## 文档站点

在知识包上启用 `site` 后，还会生成 `dist/<base>-site/`：一个包含文章页面、本地搜索、脚本和样式的静态站点。它在相邻的临时目录中构建，因此站点构建失败时会保留上一次的产物。

- **导航**来自已接受的 `src/knowledge-map.yaml`。条目绑定到文章身份，因此修改标签和分组不会改变 URL，同一篇文章也可以出现在多个位置。
- **首页**把第一级知识地图作为完整的站点地图。
- **图表**用 Mermaid 编写，在浏览器中按站点主题渲染，并提供适应窗口、缩放、全屏和查看源码等控件。
- **来源页脚**位于每篇文章底部，仓库链接到记录的修订版本，文档链接到登记的 URL。
- **多语言**可通过 `site.locales` 添加；未翻译的页面显示原文并附带提示。

Context 不负责部署。可以用任意静态 HTTP 服务器预览，再用你自己的托管服务部署 `dist/<base>-site/` 中的内容。
<!-- /context:section -->

<!-- context:section id="llms" -->
## LLM Docs

`llmsPackage()` 生成一个文本包，可用于模型上下文、离线评估或下游导入：

```text
llms.txt                   # 知识地图索引
llms-full.txt              # 汇总后的已审核正文
llms/pages/<identity>.txt  # 单篇文章
```
<!-- /context:section -->

<!-- context:section id="custom" -->
## 定制分发，而不分叉知识

知识包模板决定分发形态，例如额外的 Agent 指令、静态文件和查询辅助工具，但永远不会取代已批准的知识成为事实来源。站点的展示源码，例如首页插槽、自定义页面和主题组件，放在 `src/site/` 下，与生成的知识分开。
<!-- /context:section -->
