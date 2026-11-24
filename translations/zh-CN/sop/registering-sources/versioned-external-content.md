---
title: 跟随版本化内容与归档的资料集
description: 使用其他团队按版本发布的文档并持续跟进其发布，或在原资料归档前一次性吸收一个资料集。
translation:
  locale: zh-CN
  artifact_ref: sha256:44c05e8b132571a0c84023ce6a0dc8ccb6fe8f91c681416f61eedf01ca3f777b
  source_digest: 8c71edfe9c1da363defcc06a8b8c196caf0e5e3f5f46075eabac611dfa5e676a
  translated_at: 2026-11-24T21:46:18.327Z
---

# 跟随版本化内容与归档的资料集

<!-- context:section id="goal" -->
有些你想引用的材料并不是你维护的文件夹。其他团队按版本发布它——文档仓库、已发布的知识包——或者某个团队 wiki 即将归档。Context 用文档来源处理这两种情况：

- **跟随已发布版本。** 你把一个确切版本安装为文件，Context 记录它的来源和版本，页面像引用任何本地文档一样引用它。有新版本发布时，把来源切换过去，再更新受影响的页面。
- **一次性吸收。** 你采集资料集的文件，把作者自己的判断写成笔记，并产出文章；原资料归档后，冻结该来源，它仍可被引用。

只有页面需要引用时，才把材料登记为来源。读者只需要找到的内容，保持为[外部入口](external-entrances.md)即可。
<!-- /context:section -->

<!-- context:section id="register" -->
## 跟随已发布版本

带上确切版本向 Agent 提出：

```text
把支付团队 API 文档仓库的 4f2a9c1 提交登记为来源。
保留它的文件夹；页面会引用 reference/ 和 guides/ 两个章节。
```

Context 自己从不下载这些内容。Agent 使用来源自身的工具在工作区之外完成安装，因此不会有锁文件或工具设置落入工作区；它把该版本以真实文件（而不是链接）的形式放进知识工作区的 `sources/<kind>/<name>@<version>/`，然后带上来源信息登记：

```bash
context source add file api-docs --layout tree \
  --local sources/git/api-docs@4f2a9c1 \
  --origin-kind git --origin-id https://example.com/payments/api-docs.git \
  --origin-version 4f2a9c1
```

登记时会把 `sources/<kind>/` 加入 `.gitignore`：提交的只有登记信息和采集的快照，不包括安装的文件。对于 Git 仓库，登记还会返回确切的安装命令，以及一条列出最新版本的命令。快照记录来源和版本，网站的来源列表会把每个被引用的文件链接到该版本。

`--layout tree` 保留文件夹以及文档链接的图片；页面需要以文本引用小型结构化文件时，加上 `--document-ext .json --document-ext .yaml`。请在页面引用该来源之前确定布局，因为之后切换会移动快照中的路径。采集和资源缺口参见[文档目录](document-directories.md)。
<!-- /context:section -->

<!-- context:section id="upgrade" -->
## 切换到较新版本

当你要求更新——或[例行更新](../updates-and-versions/scheduled-updates.md)运行时——Agent 会把最新可用版本与已登记的版本对比。相同则什么也不做。如果有更新的版本，Agent 把它安装到新的 `<name>@<new version>` 目录，把登记切换过去并重新采集。快照会显示哪些文件有变化，因此只修订引用了这些文件的页面，与任何[文档变化](../updates-and-versions/updating-knowledge.md)的处理方式相同。之后删除旧版本目录。
<!-- /context:section -->

<!-- context:section id="restore" -->
## 在新的克隆中

安装的文件不在 Git 中，因此知识工作区的新克隆里没有它们。这时采集会报告一个延后的缺口，其下一步就是已登记版本的安装命令。Agent 会安装的正是这个版本，而不是最新版本，这样知识就按它写作时依据的内容重建。
<!-- /context:section -->

<!-- context:section id="archive" -->
## 在归档前吸收一个资料集

若要一次性接入一个资料集而不是持续跟随，Agent 会用 `--layout tree` 登记它的文件夹并采集，把作者自己的判断——别处没有的决定、流程、对比——保存为[笔记](notes.md)，然后产出文章。原资料归档后，冻结该来源：

```bash
context source add file team-wiki --freeze
```

冻结的来源保留快照以供引用，并且永远不会再被采集，因此归档的文件夹可以消失。`--unfreeze` 恢复采集。哪些资料集跟随、哪些吸收，属于规划的一部分；参见[迁移已有知识库](../practices/migrating-a-knowledge-base.md)。
<!-- /context:section -->
