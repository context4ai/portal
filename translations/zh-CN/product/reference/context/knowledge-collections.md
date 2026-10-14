---
title: 知识分类
description: 已批准的知识归入哪些分类、每个分类存放什么内容，以及它们在知识包中的落点。
translation:
  locale: zh-CN
  artifact_ref: bd4e84ed-7413-4eaf-aad0-2b9c0fde8020
  source_digest: a06e58f29ec4617d472f24288248d6c6d68f7b6a032ed41c89fac31806465bbc
  translated_at: 2026-10-12T17:06:40.056Z
  source_parts:
    title: 0472d0c740ba7fd48b356e350fc014bb9e9db722708d0c1ccd5ca3108d7e04bc
    description: bdcfafd62b7371730b0e6ed9388c40fea765a188df221e1669af0d5851a3de84
    order:
      - goal
      - table
      - roots
      - choose
      - reserved
    sections:
      goal: af65be465d4bae28b3cbafb327b1eddf3274323006bc1762ae5f8db8346886ed
      table: 91187d2ae96984122910fd49a7726f4cd4a315b2b8b2f84236f8cc1f89c5a648
      roots: 00d2159fad625a70c9c2dbe6f19fc59b52e3aad262cb5c003ce4ff53149b2565
      choose: ba3444714a3d780db3ea6740fa1bbd86e0a81c00d270e618c7b978ae5f36c0e6
      reserved: bdae6194ad2ec807aecd11b632af4bc888c5d638539b9456bf553e4c095a3956
    exterior:
      '[null,"goal"]': 3ed9fc52d5a37916fd3f9389d8019be6e0732388206d28ad837867be20385d99
      '["goal","table"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["table","roots"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["roots","choose"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["choose","reserved"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["reserved",null]': e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
---

# 知识分类

<!-- context:section id="goal" -->
`knowledge/` 中每篇已批准的文章都位于某个**知识分类**之下——即其路径的第一级目录，例如 `knowledge/sop/…`。知识分类说明这篇文章服务于哪类阅读需求。构建时，它决定文章进入哪个包根目录，包的 `select.collections` 也按它来过滤。

```mermaid
flowchart LR
  k["knowledge/collection/..."] --> w["wikis/<br/>实体与关系"]
  k --> g["guides/<br/>说明与操作步骤"]
  k --> r["rules/<br/>规范与检查"]
  k --> f["feats/<br/>功能记录"]
```
<!-- /context:section -->

<!-- context:section id="table" -->
## 分类一览

| 知识分类 | 内容 | 包内路径 | OKF 类型 |
| --- | --- | --- | --- |
| `codeindex` | 有源码依据的代码索引，可附带结构化关系 | `wikis/codeindex/` | Wiki |
| `business` | 结构化的业务实体与关系 | `wikis/business/` | Wiki |
| `product` | 结构化的产品实体、行为与关系 | `wikis/product/` | Wiki |
| `architecture` | 架构说明与设计叙述 | `guides/architecture/` | Guide |
| `sop` | 操作流程与运维手册 | `guides/sop/` | Guide |
| `faq` | 以问题为导向的解释与故障排查 | `guides/faq/` | Guide |
| `decision` | 决策记录与权衡分析 | `guides/decision/` | Guide |
| `incident` | 事故时间线、响应与后续跟进 | `guides/incident/` | Guide |
| `standards` | 规范性标准与约束 | `rules/standards/` | Rule |
| `test` | 验证规则、场景与验收检查 | `rules/test/` | Rule |
| `feats` | 功能能力记录 | `feats/` | Feature |

`codegraph` 作为代码索引分类的旧名称仍被接受，并与 `codeindex` 一样映射到 `wikis/`。
<!-- /context:section -->

<!-- context:section id="roots" -->
## 包根目录的含义

- **`wikis/`** 是结构化的实体与关系层，也是知识包必需的默认入口，从 `wikis/index.md` 开始。
- **`guides/`** 和 **`rules/`** 用于解释、落地或约束这些知识。把文章放在这里并不会与任何内容建立关系；只有 Context 记录的类型化边才会。
- **`feats/`** 存放功能记录。

除了知识分类，知识包还可以用 `select.okfRoots` 选择根目录；见[包模板](./package-templates.md)。
<!-- /context:section -->

<!-- context:section id="choose" -->
## 如何选择知识分类

Indexer 根据读者的需求而不是来源类型来建议知识分类：同一份文档可以成为 `sop` 中的运维手册、`decision` 中的决策记录，或 `standards` 中的规范。常见的对应关系：

| 读者需求 | 合适的形式 |
| --- | --- |
| 理解某个术语、边界或业务规则 | 带范围和示例的领域说明 |
| 理解架构或集成方式 | 技术说明、契约与限制 |
| 完成一项可重复的任务 | 包含前置条件、操作和检查的指南 |
| 诊断或恢复 | 包含症状、安全操作和验证的运维手册 |
| 理解某个选择 | 决策、备选方案、理由与后果 |
| 从事故中学习 | 影响、观察、原因与响应 |
| 解读一项测试 | 方法、范围以及结果能证明什么 |

之后你可以用 `context revise <target> --move-to <path>` 把已批准的文章移到其他知识分类，文章标识保持不变。
<!-- /context:section -->

<!-- context:section id="reserved" -->
## 保留名称

`index.md` 保留给包入口索引和目录索引使用。来源文档可以叫 `index.md`，但文章必须换个名字，例如 `index-page.md`；如果复制进来的知识会占用 `wikis/**/index.md`，`context build` 会拒绝构建。
<!-- /context:section -->
