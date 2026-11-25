---
title: 按版本发布与即将归档的资料
description: 引用其他团队按版本发布的文档并跟进新版本；资料即将归档时，先一次性吸收再冻结。
translation:
  locale: zh-CN
  artifact_ref: sha256:44c05e8b132571a0c84023ce6a0dc8ccb6fe8f91c681416f61eedf01ca3f777b
  source_digest: 9d9481edd73255516f4a418cce182603387b825c8fd6fde2c49401a1a97a8452
  translated_at: 2026-11-25T02:37:02.309Z
---

# 按版本发布与即将归档的资料

<!-- context:section id="goal" -->
有些要引用的资料并不在你维护的文件夹里：可能是其他团队按版本发布的文档仓库或知识包，也可能是即将归档的团队 wiki。这两种情况都用文档来源处理：

- **跟进已发布的版本**：把某个确切版本安装成文件，Context 记下它的出处和版本，页面像引用本地文档一样引用它。有新版本时，把来源切换过去，再更新受影响的页面。
- **一次性吸收**：采集资料集里的文件，把作者自己的判断整理成笔记，再据此写出文章。原资料归档后冻结这个来源，已有的引用照样有效。

只有页面需要引用的资料才登记为来源。读者只需要知道去哪里找的内容，作为[外部入口](external-entrances.md)登记就够了。
<!-- /context:section -->

<!-- context:section id="register" -->
## 跟进已发布的版本

告诉 Agent 要登记哪个确切版本，例如：

```text
把支付团队 API 文档仓库的 4f2a9c1 提交登记为来源。
保留它的文件夹，页面会引用 reference/ 和 guides/ 两部分。
```

Context 本身不下载这些内容。Agent 用来源自己的工具在工作区外完成安装，因此锁文件和工具配置都不会混进工作区。装好后，Agent 把这个版本以真实文件（而不是链接）的形式放到知识工作区的 `sources/<kind>/<name>@<version>/`，再连同出处一起登记：

```bash
context source add file api-docs --layout tree \
  --local sources/git/api-docs@4f2a9c1 \
  --origin-kind git --origin-id https://example.com/payments/api-docs.git \
  --origin-version 4f2a9c1
```

登记时会把 `sources/<kind>/` 加进 `.gitignore`：提交到仓库的只有登记信息和采集快照，安装的文件不会提交。如果来源是 Git 仓库，登记结果还会给出准确的安装命令，以及查看最新版本的命令。快照会记下出处和版本，网站的来源列表也会把每个被引用的文件链接到对应版本。

`--layout tree` 会保留文件夹，以及文档里链接到的图片。如果页面要把小型结构化文件当作文本引用，再加上 `--document-ext .json --document-ext .yaml`。布局要在页面开始引用这个来源之前定好，之后再改会使快照里的路径发生变化。采集方式和资源缺口见[文档目录](document-directories.md)。
<!-- /context:section -->

<!-- context:section id="upgrade" -->
## 切换到新版本

你要求更新时，或[例行更新](../updates-and-versions/scheduled-updates.md)运行时，Agent 会拿最新可用版本和已登记的版本比较。版本没变就什么也不做；有新版本时，Agent 把它装到新的 `<name>@<new version>` 目录，把登记切换过去并重新采集。快照会标出哪些文件有变化，所以只需修订引用了这些文件的页面，做法和处理其他[文档变化](../updates-and-versions/updating-knowledge.md)一样。最后删掉旧版本的目录。
<!-- /context:section -->

<!-- context:section id="restore" -->
## 在新克隆的工作区里

安装的文件不进 Git，所以新克隆的知识工作区里没有它们。这时采集会报告一个待补的缺口，给出的下一步就是安装已登记版本的命令。Agent 安装的是登记的那个版本，而不是最新版，这样重建出来的知识与当初写作时依据的内容一致。
<!-- /context:section -->

<!-- context:section id="archive" -->
## 归档前一次性吸收资料集

如果只想一次性接入某个资料集、不打算持续跟进，Agent 会用 `--layout tree` 登记它的文件夹并采集，把作者自己的判断（别处找不到的决定、流程和对比）保存为[笔记](notes.md)，然后写出文章。原资料归档后，冻结这个来源：

```bash
context source add file team-wiki --freeze
```

冻结的来源会保留快照供引用，以后也不再采集，所以原来的文件夹删掉也没关系。需要恢复采集时，使用 `--unfreeze`。哪些资料集持续跟进、哪些一次性吸收，在规划阶段决定，参见[迁移已有知识库](../practices/migrating-a-knowledge-base.md)。
<!-- /context:section -->
