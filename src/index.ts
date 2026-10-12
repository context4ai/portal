import { defineProject, kbPackage } from "@c4a/context";

// SDK docs: node_modules/@c4a/context/docs/reference/project-api.md
// Package output guide: node_modules/@c4a/context/docs/guides/package-outputs.md
// Website customization: node_modules/@c4a/context/docs/guides/page-customization.md

export default defineProject({
  sources: [],
  phases: [],
  packages: [
    kbPackage({
      name: "context-kb",
      template: { path: "src/package-templates/kb", vars: { displayName: "Context" } },
      site: {
        title: "Context",
        description: "The enterprise knowledge workflow for engineering teams and their agents.",
        lang: "en-US",
        base: "/context/",
        locales: {
          "zh-CN": {
            label: "简体中文",
            title: "Context",
            description: "企业级研发知识工作流",
          },
        },
        // Shared with the homepage so the reader's language follows them across `/` and `/context/`.
        localePreferenceKey: "context4ai-locale",
        // The brand returns to the homepage; Home opens this documentation site's home.
        titleLink: "/",
        nav: [
          { text: "Home", link: "/context/", locales: { "zh-CN": "首页" } },
        ],
        // Release Notes, Contributing and Support join this menu as `target` items once their articles are approved.
        more: [
          { text: "GitHub", link: "https://github.com/context4ai" },
        ],
        socialLinks: [{ icon: "github", link: "https://github.com/context4ai", ariaLabel: "context4ai on GitHub" }],
        extensions: {
          slots: { brand: "components/BrandMark.vue", banner: "components/HomeBanner.vue", footer: "components/HomeFooter.vue" },
        },
      },
    }),
  ],
});
