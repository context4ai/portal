---
title: 文档目录
description: 将本地 Markdown 文件或文档文件夹登记为来源，用 include glob 限定范围，并采集可复现的快照。
translation:
  locale: zh-CN
  artifact_ref: 8a990784-16a3-4b84-957e-f5058ac73c3f
  source_digest: 23c8d84d7df23ccd5af73921d9901c872c43905c975534b0a3ed7ded099fcba7
  translated_at: 2026-10-14T11:06:04.950Z
  source_parts:
    title: 9c3a83044e5888b9297bc11707ee21e69696963394b0106b7ae8ae5bab22ec91
    description: 070595428a22c0232d34c0dd0e72cf0b35af033bcdb0a8ffb913ab29b8d0bd19
    order:
      - goal
      - ask
      - register
      - capture
      - sites
      - later
    sections:
      goal: 2d78059a99c17466788b7db83c80089981de9d80357e39feeb28a70254dea76a
      ask: 0413ecfbb17378b5d133992afccf5454a393cb41f034ac16f28a2b7231783743
      register: 9f922597501dbde82a96be8eaf34679f80354fb6950c0680655d48088750c8f2
      capture: 3a5bba8cbe1a3893142d63c94edc1590d57ef1f84fa492a3b1eb9aad72801c19
      sites: cd05079d8b0499b88867643b2aefc6cb382d62e2e0cb720d8228b9cada830e75
      later: 0a3fcbe170ee60ffa4d47eb999ab7471c919baf9ea04ff5fe369ab2f81dca859
    exterior:
      '[null,"goal"]': 011d5b3c7d7824a4f506b52877b57e1d5a0dd46584dbb892ff0569311228c462
      '["goal","ask"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["ask","register"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["register","capture"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["capture","sites"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["sites","later"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["later",null]': e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
---

# 文档目录

<!-- context:section id="goal" -->
当材料是本地 Markdown 时，使用文件来源：一个文件、多个文件或一个文档文件夹都可以。与代码仓库不同，文档来源需要**采集**：Context 会在 `sources/file/` 下生成可复现的快照，页面引用的是该快照，而不是实时变化的文件夹。

```mermaid
flowchart LR
  reg["登记<br/>date/module + include"] --> decl["在 src/index.ts 中<br/>声明 captureFile"]
  decl --> cap["采集<br/>在 sources/ 下生成快照"]
  cap --> write["规划与写作<br/>引用快照"]
```
<!-- /context:section -->

<!-- context:section id="ask" -->
## 告诉 Agent

说明要导入哪些文档，而不只是你当前所在的文件夹：

```text
请将 ../docs/user-guide 纳入产品文档来源，这次只需要 getting-started 和 billing 章节。
```

你交给 Agent 的运行说明、手册、计划或批次清单都会被视为任务指引，而不是来源，除非你明确要求导入它们。如果要采集哪些文档并不明确，Agent 会询问一次，而不是把这些指引本身采集进去。
<!-- /context:section -->

<!-- context:section id="register" -->
## 登记并声明采集

```bash
context source add file 20261012 --module user-guide --local ../docs/user-guide \
  --include "getting-started/**" --include "billing/**" --configure
```

| 选项 | 含义 |
| --- | --- |
| `--local` | 必填。本地 Markdown 目录或文件，用作刷新位置。 |
| `--module` | 文档模块名；省略时根据 `--local` 推导。 |
| `--include` | 相对于 `--local` 的 Markdown include glob；可重复使用以指定多个模式。 |
| `--include-list` | 一个包含 include glob 的文件，每行一个；空行和 `#` 注释会被忽略。 |
| `--configure` | 同时在简单的 `src/index.ts` 中声明该来源和默认的采集阶段。它不会执行采集。 |

登记不读取任何内容。使用 `--configure` 后，项目中会新增类似如下的声明：

```ts
const docs = source("20261012/user-guide", { type: "file" });

export default defineProject({
  sources: [docs],
  phases: [captureFile({ source: docs })],
});
```

如果 `src/index.ts` 中已有自定义条目，配置结果为 `manual`，Agent 会做针对性修改，而不是反复重试。
<!-- /context:section -->

<!-- context:section id="capture" -->
## 采集

采集属于外部读取，因此需要你在当前对话中授权。要求采集、导入或读取指定文档即视为授权；仅仅提到这些文档或要求登记则不算。之后 Agent 会运行工作流返回的采集命令，报告结果，并持续执行直到该批次的所有文档都完成。

采集只生成快照，不做分类、摘要或批准。规范化、哈希和清单由 CLI 负责，Agent 绝不手动编辑已采集的快照。
<!-- /context:section -->

<!-- context:section id="sites" -->
## 文档站点（MDX）

默认采集处理 `.md`。如果该文件夹实际上是一个文档站点——包含 `.mdx` 页面、`_meta.json`、侧边栏或文档配置——Agent 会先停下来与你确认，再修改配置。对于使用 `_meta.json` 的 MDX 站点，采集阶段会加入 MDX 处理器：

```ts
captureFile({ source: docs, processor: mdxJsonDocs() });
```

该处理器会保留路由元数据和静态组件文本作为证据。如果某个页面只是挂载运行时渲染内容的外壳，Agent 会告诉你，并请你提供渲染后的站点或其数据源，而不是凭空编造正文。
<!-- /context:section -->

<!-- context:section id="later" -->
## 文档发生变化时

页面会继续引用其写作时依据的快照。文件夹内容变化后，请发起更新：Agent 会采集新版本，并询问哪些页面需要修改。参见[更新知识](../updates-and-versions/updating-knowledge.md)。
<!-- /context:section -->
