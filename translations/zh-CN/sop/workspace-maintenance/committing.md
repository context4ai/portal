---
title: 提交结果
description: 如何把 Context 任务的结果提交到 Git——哪些文件应当提交、如何只提交它们，以及如何验证提交。
translation:
  locale: zh-CN
  artifact_ref: dd7b0c11-4cb7-49fc-aa33-b2cdaadeacaa
  source_digest: f85f5b943f3e4bdb0380227b11b81a10c48c1f6a2f0c0251e773f32f5c7822a3
  translated_at: 2026-10-12T17:06:40.056Z
---

# 提交结果

<!-- context:section id="goal" -->
Context 没有自己的提交命令：Agent 使用普通的 Git。它**只在你要求时**才提交——全托管模式的生产本身并不授权提交或推送。当你请求的整个范围都已完成 close 和所有请求的构建、且没有待处理事项时，Agent 会提示一次结果可以提交；中间交付不会给出这一提示。
<!-- /context:section -->

<!-- context:section id="select" -->
## 1. 选择文件

Agent 找到 Context 知识工作区及其实际的 Git 根目录——在嵌入式知识工作区中，这个根目录可能是一个大得多的源码仓库——并检查已暂存、未暂存和未跟踪的变更以及忽略规则。它会显式选择知识工作区文件；绝不会笼统地运行 `git add -A`，也不会提交整个暂存区。

`context init` 写入的 `.gitignore` 已经把正式内容与运行时状态区分开：

```text
.tmp/
node_modules/
dist/
sources/repo/*
!sources/repo/index.yaml
sources/**/.tmp/
sources/**/.cache/
```

因此，配置、来源记录和快照、已批准的 `knowledge/`、翻译和 Changelog 会被提交；`dist/`、`.tmp/` 和仓库检出不会提交——检出可以根据 `sources/repo/index.yaml` 恢复。被忽略的文件绝不会被强制添加，生成的文件只有在你的项目规则要求时才会包含。完整的归属表见 [Context 知识工作区](../../product/getting-started/knowledge-workspace.md)。

如果还没有 Git 仓库，Agent 会先与你商定仓库应放在哪里，再进行初始化；如果没有任何变化，它会报告无需提交。仅凭 Git 中的中间快照无法恢复被忽略的任务状态。
<!-- /context:section -->

<!-- context:section id="commit" -->
## 2. 提交所选变更

Agent 概括实际的变更，按照你的仓库约定撰写提交信息，并提交精确的路径：

```bash
git commit --only -- <paths>
```

`--only` 会把无关的已暂存文件排除在外；新文件必须先加入暂存区。与所选范围重叠的部分暂存文件会被检查，确保没有你未选择的内容混入；无关的暂存条目——包括删除——都会保留。

Git 身份、hook、签名、冲突和权限问题会被诊断，而不是被绕过：Agent 不会禁用 hook 或签名、修改全局 Git 配置、stash 你的其他工作，也不会绕开忽略规则。它会使用经授权的替代方案，或者报告阻塞项。
<!-- /context:section -->

<!-- context:section id="verify" -->
## 3. 验证结果

Agent 读取新提交的 SHA 及其变更文件，与所选范围进行比较，并检查无关的工作区和暂存区内容没有变化。如果 hook 修改了结果，它会报告这一点。最后它给出 SHA 和一段简短说明；除非你也提出要求，否则不会推送、发布或创建远程仓库。
<!-- /context:section -->
