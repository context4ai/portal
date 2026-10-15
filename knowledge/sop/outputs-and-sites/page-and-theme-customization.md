---
title: Page and Theme Customization
description: How to replace homepage sections, add a logo or chat widget,
  publish custom pages and change site colors without touching generated output.
type: Guide
timestamp: 2026-10-15T06:21:46.519Z
---
# Page and Theme Customization

<!-- context:section id="goal" -->
A Context site works without any frontend code, but you can tailor it: replace parts of the homepage, add a logo, float a chat widget on every page, publish website-only pages and change the color palette. All of this lives in your Context knowledge workspace — presentation code under `src/site/`, colors in `src/site/theme.json` — and is applied by the normal `context build`. Approved knowledge and generated output are never edited by hand.

```mermaid
flowchart LR
  ext["src/site/<br/>components, pages, CSS"] --> build["context build"]
  theme["src/site/theme.json"] --> build
  cfg["kbPackage site.extensions"] --> build
  build --> site["Website"]
```
<!-- /context:section -->

<!-- context:section id="extensions" -->
## Declaring extensions

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

Paths are relative to `root`. The folder may contain Vue components, CSS, Markdown and imported assets; use relative imports within it and declare external dependencies in the knowledge workspace's package manifest. Hidden files, `node_modules` and `dist` are not copied, and symbolic links are rejected. Never put credentials or private configuration in frontend files.
<!-- /context:section -->

<!-- context:section id="slots" -->

## Homepage and page slots

| Slot | Default | Customization |
| --- | --- | --- |
| `banner` | Homepage hero and actions | Replace with a component |
| `knowledge` | Knowledge-map card group | Replace with a component |
| `resources` | Resource card group | Replace with a component |
| `footer` | Homepage footer | Replace with a component |
| `floating` | Empty | Client-only component fixed bottom right on all pages |
| `brand` | Site title text | Component at the start of the top bar, such as a logo |

Omit a slot to keep its default, or set it to `false` to hide it. A component replaces only its slot — never the global navigation, language switch or article provenance. Components can use VitePress `useData()` and `useRoute()` and import scoped CSS. Pages prerender in the light theme; for readers whose saved choice is dark mode, slot components mount again after load so markup bound to `isDark` matches. The remounted slots finish loading before they replace the prerendered markup, so the old and new content swap in the same frame and a custom slot such as a homepage banner does not collapse.

To show the right language from the first paint, render each language and mark it with `data-context-locales="<tag>"`; the site stylesheet hides the others. `useData().lang` gives the reader's language after mount.

<!-- /context:section -->

<!-- context:section id="floating" -->
## A chat or Bot widget

The `floating` component owns its button, panel and open/close behavior. Keep the panel inside the viewport, preserve keyboard focus and a close control, and load heavy chat SDKs only when opened. The static site provides no chat backend or secret storage: send requests to an authorized service of your own, and make sure a service failure never prevents reading the documentation. Other components must render statically; use `onMounted` for browser APIs.
<!-- /context:section -->

<!-- context:section id="pages" -->
## Custom pages

Each `pages` key becomes `/custom/<key>.html` under the site base. A page is trusted Markdown and may import Vue components:

```md
# Support

<script setup>
import SupportPanel from '../components/SupportPanel.vue'
</script>

<SupportPanel />
```

Place it in navigation with an ordinary knowledge-map entry whose target is `artifact_ref: "site:support"`, setting `parent`, `title` and `order` as for any entry. Pages without an entry are still reachable directly, and several entries can point to one page. Custom pages are website-only: they are not approved articles and do not enter the knowledge package or LLM Docs. Change formal articles through revision, not with a custom page.
<!-- /context:section -->

<!-- context:section id="theme" -->
## Colors

The first website build creates `src/site/theme.json` with the default light and dark palettes if it is missing; builds never overwrite your values, and deleting the file restores the defaults. Each `light` and `dark` object accepts `brand`, `accent`, `background`, `surface`, `text`, `mutedText` and `border` as hexadecimal colors; missing keys inherit defaults.

A package can override the shared file:

```ts
kbPackage({ site: { theme: {
  light: { brand: "#6750a4" }, dark: { brand: "#d0bcff" },
} } })
```

Precedence is built-in defaults, then `theme.json`, then `site.theme`. Offline Review reports and Mermaid diagrams use the same colors. Custom components should read `--context-brand`, `--context-accent`, `--context-background`, `--context-surface`, `--context-text`, `--context-muted-text` and `--context-border` instead of hard-coding colors.
<!-- /context:section -->

<!-- context:section id="check" -->
## Building and checking

Customization needs no capture, Indexer work or new review: edit and run the usual build. Extension files and dependency manifests take part in build fingerprints, and a failed build keeps the previous output. Before publishing, preview the homepage, custom pages and floating panel on desktop and mobile, with a non-root `base`, in dark mode and with keyboard navigation. Publish only the website folder. For the base site options, see [Documentation Sites](documentation-sites.md).
<!-- /context:section -->
