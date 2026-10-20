---
title: 页面与主题定制
description: 面向站点作者——如何替换首页区块、添加 Logo 或聊天组件、发布自定义页面、修改站点颜色，以及浅色和深色模式的行为。
translation:
  locale: zh-CN
  artifact_ref: 2ff9d5b0-528c-4222-beac-85e3ea3cda8c
  source_digest: 1b7e4a803ab5fa78027cb57b94f714c9e74d15d9a925afac2f50e58c7eee02a6
  translated_at: 2026-10-20T05:13:06.930Z
---

# 页面与主题定制

<!-- context:section id="goal" -->
Context 站点无需任何前端代码即可使用，但站点作者可以按需定制：替换首页的部分区块、添加 Logo、在每个页面上悬浮一个聊天组件、发布仅属于网站的页面，以及修改配色方案。这些内容都位于你的知识工作区中——展示代码放在 `src/site/` 下，颜色放在 `src/site/theme.json` 中——并由常规构建应用。已批准的知识和生成的产出永远不手动编辑。

你可以自己编写这些文件，也可以让 Agent 来做，例如：

> 在顶栏加上我们的 Logo，并添加一个从侧边栏链接过去的支持页面。

```mermaid
flowchart LR
  ext["src/site/<br/>组件、页面、CSS"] --> build["构建"]
  theme["src/site/theme.json"] --> build
  cfg["知识包声明中的<br/>站点扩展"] --> build
  build --> site["网站"]
```
<!-- /context:section -->

<!-- context:section id="extensions" -->
## 声明扩展

```ts
site: {
  title: "Engineering handbook",
  extensions: {
    root: "src/site",
    slots: {
      banner: "components/Banner.vue",
      floating: "components/Chat.vue",
    },
    pages: { support: "pages/support.md" },
  },
}
```

路径相对于 `root`。该文件夹可以包含 Vue 组件、CSS、Markdown 和被导入的资源；在其中使用相对导入，并在知识工作区的包清单中声明外部依赖。隐藏文件、`node_modules` 和 `dist` 不会被复制，符号链接会被拒绝。永远不要在前端文件中放入凭据或私有配置。全部站点选项见 [Project API](../../product/reference/context/project-api.md)。
<!-- /context:section -->

<!-- context:section id="slots" -->
## 首页与页面插槽

| 插槽 | 默认内容 | 定制方式 |
| --- | --- | --- |
| `banner` | 首页首屏与操作按钮 | 替换为组件 |
| `knowledge` | 知识地图卡片组 | 替换为组件 |
| `resources` | 资源卡片组 | 替换为组件 |
| `footer` | 首页页脚 | 替换为组件 |
| `floating` | 空 | 仅在客户端渲染的组件，固定在所有页面的右下角 |
| `brand` | 站点标题文字 | 位于顶栏起始处的组件，例如 Logo |

省略某个插槽即保留其默认内容，设为 `false` 则隐藏它。组件只替换它所在的插槽——绝不会替换全局导航、语言切换或页面来源信息。组件可以使用 VitePress 的 `useData()` 和 `useRoute()`，并导入作用域 CSS。

如果想从首次绘制起就显示正确的语言，请为每种语言分别渲染内容，并用 `data-context-locales="<tag>"` 标记；站点样式表会隐藏其他语言。挂载后，`useData().lang` 会给出读者的语言。参见 [多语言站点](multilingual-sites.md)。
<!-- /context:section -->

<!-- context:section id="floating" -->
## 聊天或 Bot 组件

`floating` 组件自行负责其按钮、面板和打开／关闭行为。请让面板保持在视口之内，保留键盘焦点和关闭控件，并且只在打开时才加载较重的聊天 SDK。静态站点不提供聊天后端或密钥存储：请把请求发送到你自己的已授权服务，并确保服务故障绝不会妨碍阅读文档。其他组件必须能静态渲染；使用浏览器 API 时请放在 `onMounted` 中。
<!-- /context:section -->

<!-- context:section id="pages" -->
## 自定义页面

每个 `pages` 键都会成为站点地址前缀下的 `/custom/<key>.html`。页面是受信任的 Markdown，可以导入 Vue 组件：

```md
# Support

<script setup>
import SupportPanel from '../components/SupportPanel.vue'
</script>

<SupportPanel />
```

要把它放进导航，请添加一个普通的知识地图条目，其目标为 `artifact_ref: "site:support"`，并像其他条目一样设置 `parent`、`title` 和 `order`。没有条目的页面仍然可以直接访问，多个条目也可以指向同一个页面。自定义页面只属于网站：它们不是已批准的页面，也不会进入知识包或 LLM Docs。修改正式页面请通过 [修订](../review-and-revision/revising-a-page.md)，而不是用自定义页面。
<!-- /context:section -->

<!-- context:section id="theme" -->
## 颜色与浅色／深色模式

如果 `src/site/theme.json` 不存在，第一次网站构建会创建它，并写入默认的浅色和深色配色；构建绝不会覆盖你设置的值，删除该文件即可恢复默认值。`light` 和 `dark` 对象都接受 `brand`、`accent`、`background`、`surface`、`text`、`mutedText` 和 `border`，取值为十六进制颜色；缺失的键沿用默认值。

知识包可以覆盖这个共享文件：

```ts
kbPackage({ site: { theme: {
  light: { brand: "#6750a4" }, dark: { brand: "#d0bcff" },
} } })
```

优先级依次为内置默认值、`theme.json`、知识包自己的主题。离线 [审核报告](../review-and-revision/reading-review-reports.md)和 Mermaid 图表也使用相同的颜色。自定义组件应读取 `--context-brand`、`--context-accent`、`--context-background`、`--context-surface`、`--context-text`、`--context-muted-text` 和 `--context-border`，而不是硬编码颜色。

无论读者的系统配色如何，站点都以浅色模式打开。读者的浅色或深色选择会在整个源（origin）范围内记住，因此同一源下的所有 Context 站点共享这一选择；它从首次绘制起就会生效，页面加载时不会闪现另一种配色。
<!-- /context:section -->

<!-- context:section id="check" -->
## 构建与检查

定制不需要新的来源、Indexer 工作或审核：修改后重新构建即可。构建失败时会保留之前的产出。发布前，请在桌面端和移动端、在非根路径的地址前缀下、在深色模式下以及使用键盘导航时，预览首页、自定义页面和悬浮面板。只部署网站文件夹。站点的基础选项和部署见 [文档站](documentation-sites.md)。
<!-- /context:section -->
