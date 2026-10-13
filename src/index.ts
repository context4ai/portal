import { defineProject, kbPackage, source } from "@c4a/context";

// SDK docs: node_modules/@c4a/context/docs/reference/project-api.md
// Package output guide: node_modules/@c4a/context/docs/guides/package-outputs.md
// Website customization: node_modules/@c4a/context/docs/guides/page-customization.md

const context = source("20261012", "context");
const sourcegraph = source("20261012", "sourcegraph");
const agentGraph = source("20261012", "agent-graph");
const notes = ["usage-practices", "compression", "benchmark-summary", "knowledge-service-agent", "faq", "portal-production"]
  .map((name) => source(`20261012/${name}.md`, { type: "note" }));
const demoDeployment = source("20261013/demo-deployment.md", { type: "note" });

export default defineProject({
  sources: [context, sourcegraph, agentGraph, ...notes, demoDeployment],
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
          { text: "Home", link: "/context/", position: "start", locales: { "zh-CN": "首页" } },
        ],
        // Targets are approved articles kept outside the knowledge map, shown only in this menu.
        more: [
          { text: "Release Notes", target: { artifact_ref: "sha256:6633b4690c3eb582de872f2146b3f64e4a9875065aaadf45701e590516810fd8" }, locales: { "zh-CN": "发布说明" } },
          { text: "Contributing", target: { artifact_ref: "sha256:72f512c94144d0b098315550139d8a361e49260daa79bac892cf4c7c0a4561a5" }, locales: { "zh-CN": "参与贡献" } },
          { text: "Support", target: { artifact_ref: "sha256:9d796e7c1ddbca5eadc0e9604bf8890eff78a8b2eb69cd4d3fa0883cabf07155" }, locales: { "zh-CN": "支持" } },
          { text: "GitHub", link: "https://github.com/context4ai/context" },
        ],
        socialLinks: [{ icon: "github", link: "https://github.com/context4ai/context", ariaLabel: "Context on GitHub" }],
        extensions: {
          slots: { brand: "components/BrandMark.vue", banner: "components/HomeBanner.vue", footer: "components/HomeFooter.vue" },
        },
      },
    }),
  ],
});
