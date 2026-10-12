---
title: 大规模重组
description: 知识库成长到一定规模后，请 Agent 提出更清晰的目录和标题结构，再通过调整知识地图、移动页面、拆分、合并和下线来落实。
translation:
  locale: zh-CN
  artifact_ref: 271298e1-6876-41ac-861c-902752b63828
  source_digest: b763012bf537d5adf733cf60e0db4e5ccb63d8bdf0ec286c5ef52f7f77a78791
  translated_at: 2026-10-12T16:11:57.590Z
---

# 大规模重组

<!-- context:section id="goal" -->
第一轮的标题往往偏抽象，最初的目录结构也很少是理想的。当知识库达到可用的规模后，Agent 可以梳理已批准的内容，提出一个更易读、更直接的结构——此时它的方案会优于规划阶段能做到的任何方案，因为内容已经存在。落实之后，再观察一轮。重组是一系列修订，成本远低于重新生产。

```text
Survey the approved knowledge and propose a more direct directory and title
structure. Show me the before/after, then revise once I confirm.
```
<!-- /context:section -->

<!-- context:section id="tools" -->
## 选择最轻量的工具

```mermaid
flowchart TB
  q{"需要改变什么？"} -->|菜单标题、顺序、分组| map["调整知识地图<br/>不重写正文"]
  q -->|页面位置| move["revise --move-to<br/>身份不变，链接同步更新"]
  q -->|内容边界| split["拆分或合并<br/>新增任务和修订任务"]
  split --> retire["下线过时页面<br/>在目标页面批准之后"]
```

| 变更 | 工具 | 保持不变的内容 |
| --- | --- | --- |
| 重命名目录、调整顺序、重新分组、把页面放到第二个位置 | 知识地图调整 | 文章身份、URL 和正文 |
| 把页面移动到其他路径 | `context revise <page> --move-to <path>` | 身份和章节 ID；指向它的 Markdown 链接在批准时更新 |
| 拆分一个页面，或合并多个页面 | 普通的新增任务和修订任务 | 有用的细节，直到其目标位置获得批准 |
| 删除已在别处覆盖的页面 | `context task retire` | 来源和共享资产 |
<!-- /context:section -->

<!-- context:section id="map" -->
## 知识地图调整

知识地图同时控制网站导航和 LLM Docs 的组织方式。在对话中提出即可：移动某个主题、重命名目录、调整顺序，或为另一种读者任务重新组织同一批文章；这在生产过程中或之后都可以进行，无需重新采集来源。每个条目都有一个稳定的键，因此重命名菜单不需要新文章，移动菜单条目也不会改变文章 URL。

优先顺序如下：修订现有文章，把页面加入匹配的分类，新增一个内容连贯的子分类。**顶级**的新增、重命名或删除会附带变更前后的目录树作为提案，并需要你明确批准。
<!-- /context:section -->

<!-- context:section id="split" -->
## 拆分与合并

Agent 会先阅读受影响的页面和当前来源，再决定哪些保留、深化、拆分、合并或下线。目标内容先获得批准；之后才会修订原页面及指向它的链接。有用的条件、步骤和解释在删除任何内容之前都必须有去处——在审核中略去某个页面只会拒绝该候选，并不会下线已批准的文章。
<!-- /context:section -->

<!-- context:section id="retire" -->
## 下线页面

```yaml
reason: These reader tasks are now covered by the approved guide.
targets:
  - path: architecture/old-guide.md
    replacement: sop/current-guide.md
```

`context task retire --input <file>` 会预览下线操作；它不经过 HTML 审核，一旦你批准了删除，Agent 就会直接执行返回的命令，不再询问。下线会同时删除 Markdown 和结构条目，把指向该页面的链接改指向替代页面，并返回一份用于回滚的恢复输入。指向被拆分页面中某个具体段落的链接会先行修复，因为 CLI 无法推断某个段落去了哪里。

具有持续价值的页面——例如旧版本的文档——通常会保留。新文本更短或菜单有变化，都不是下线的理由。
<!-- /context:section -->

<!-- context:section id="record" -->
## 让新结构保持下去

交付前，请检查每个页面都位于其主要读者任务之下、标题与正文相符、同级页面的顺序经过斟酌，且没有空目录或意外重复的目录。在 Context 知识工作区的 `AGENTS.md` 中简要记录每个分类的长期意图，以便后续更新以同样的方式放置新页面。
<!-- /context:section -->
