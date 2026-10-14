---
title: 恢复版本
description: 如何把 Context 知识工作区恢复到某个历史提交——确定目标、只恢复它的文件和来源，并验证结果。
translation:
  locale: zh-CN
  artifact_ref: 95637888-eeb2-4ea2-816a-490f0ab1ba73
  source_digest: 62f3a6b416787517e59aae11d6717772a34695af48a5bbeaac8e19a6988a873a
  translated_at: 2026-10-12T17:06:40.056Z
  source_parts:
    title: 357c2a1e3af3200aabc59884bfbbcb34121c84a3c198867d59e7242f3f689d91
    description: dd4eda3a0a7bc86342277141e352bb7515fdfea0f602fac857db11b30f2f50b7
    order:
      - goal
      - target
      - restore
      - verify
    sections:
      goal: 9677a00f96b5c0c707bb62d50256aaf9ee101ca9be2bf6874fabcbc336505966
      target: 8d4b80cbfc193841476bd1a72115bca3ff1da7f67beba8b0c6f13d0a94157075
      restore: 7752ad9a51404b11266a8a56e63e1aa0c167399c8c104a86f527b5fc4d3b49c5
      verify: 1fd805cfb666ac7090ca5a81c44bc2bfb816aab2664f917da7b081419e4207f0
    exterior:
      '[null,"goal"]': 70c82edaec88fbeac1b1292998fe7bd65c857f7a0674bad333fef1d32df4778f
      '["goal","target"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["target","restore"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["restore","verify"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["verify",null]': e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
---

# 恢复版本

<!-- context:section id="goal" -->
恢复会把 Context 知识工作区带回 Git 中保存过的某个状态：包括它的文件和这些文件所需的来源。它**不会**重置整个仓库、回退来源仓库，也不会找回被忽略的运行时进度。当目标和受影响的文件都明确时，明确的恢复请求无需二次批准。

```mermaid
flowchart LR
  target["确定目标<br/>提交 SHA 和路径范围"] --> clear["结束未完成的工作"]
  clear --> files["恢复约定的路径"]
  files --> src["恢复固定版本的来源"]
  src --> check["验证并停止"]
```
<!-- /context:section -->

<!-- context:section id="target" -->
## 1. 确定目标

Agent 查看知识工作区路径的 Git 历史，把你的请求转换为**具体的提交 SHA 和路径范围**：

| 你说 | 目标 |
| --- | --- |
| 没有具体说明 | 最近一次保存知识工作区的提交——这会撤销未提交的结果 |
| “上一个版本” | 知识工作区上一个保存过的状态，而不只是大仓库的 `HEAD~1` |
| 一个 SHA | 校验通过后的该 SHA |
| 一个日期 | 按你的时区和含义解释（例如截至当天结束）；有歧义的候选会与你确认 |

随后它将目标与当前已跟踪、未跟踪和已暂存的文件进行比较。目标之后新增的文件会被建议删除；无关文件、已有的暂存工作和被忽略的来源检出都会保留。移动和重命名也会被考虑在内。
<!-- /context:section -->

<!-- context:section id="restore" -->
## 2. 恢复文件和来源

1. 等待任何正在运行的 Context 写入进程结束，然后用[准备知识工作区](./preparing.md)中描述的任务状态预览和应用来放弃未完成的工作。之后不会复用旧的 Route。
2. 只恢复约定的路径，保留分支历史：

   ```bash
   git restore --source=<sha> --worktree -- <paths>
   ```

   目标之后新增的文件会被显式删除。绝不会用 `reset --hard` 和 `clean -fdx` 走捷径。
3. 用恢复后的来源记录恢复固定的仓库版本、模块路径、文档快照和附件。更新的远程内容不能替代丢失的旧快照，可用的来源也不会被重新克隆。

旧的构建产出并不对应恢复后的版本。如果你需要产出，Agent 会运行当前的 close 和构建；在此之前，它会把现有产出报告为已过期。它不会仅仅因为旧配置回来了就启动全量索引；如果历史格式不兼容，它会报告需要在迁移和工具版本之间做出的选择，而不是悄悄重写页面。
<!-- /context:section -->

<!-- context:section id="verify" -->
## 3. 验证并停止

Agent 将恢复后的文件与目标提交进行比较，确认无关的变更和索引条目都完好保留，并检查来源已就绪、没有残留旧的任务状态。如果只有部分来源能够恢复，它会报告部分完成，并说明缺少的访问权限或版本。不会自动提交、重写或推送任何内容；请另行使用[提交结果](./committing.md)提交结果。
<!-- /context:section -->
