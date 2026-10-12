<script setup>
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'

const { theme, lang } = useData()
const tags = computed(() => theme.value.contextLocales?.tags || ['en-US'])
const isZh = tag => tag.toLowerCase().startsWith('zh')
const links = [
  { text: ['首页', 'Home'], href: '/', self: true },
  { text: ['Source Graph', 'Source Graph'], href: '/sourcegraph/', self: true },
  { text: ['LLM Docs', 'LLM Docs'], href: withBase('/llms/index.html') },
  { text: ['更新日志', 'Changelog'], href: withBase('/changelog.html') },
  { text: ['GitHub', 'GitHub'], href: 'https://github.com/context4ai' },
]
</script>

<template>
  <footer class="cx-footer">
    <p>
      <span class="cx-footer-dot" aria-hidden="true"></span>
      <span v-for="tag in tags" :key="tag" :data-context-locales="tag" :lang="tag">{{ isZh(tag) ? '本站由 Context 生产，源仓库 context4ai/portal。' : 'Produced with Context from the context4ai/portal workspace.' }}</span>
    </p>
    <nav :aria-label="isZh(lang) ? '站点链接' : 'Site links'">
      <a v-for="link in links" :key="link.href" :href="link.href" :target="link.self ? '_self' : undefined"><span
        v-for="tag in tags" :key="tag" :data-context-locales="tag" :lang="tag">{{ link.text[isZh(tag) ? 0 : 1] }}</span></a>
    </nav>
    <p class="cx-footer-by">Built by Context4AI</p>
  </footer>
</template>

<style scoped>
.cx-footer {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px 24px;
  width: var(--context-content, calc(100% - 48px));
  margin: 64px auto 0;
  padding: 28px 0 40px;
  border-top: 1px solid var(--vp-c-divider);
  font-size: 13px;
  color: var(--vp-c-text-2);
}
.cx-footer p { margin: 0; }
.cx-footer-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  margin-right: 8px;
  border-radius: 50%;
  background: var(--context-accent, #2b7fff);
  vertical-align: middle;
}
.cx-footer nav { display: flex; flex-wrap: wrap; gap: 16px; }
.cx-footer a { color: var(--vp-c-text-2); text-decoration: none; }
.cx-footer a:hover { color: var(--vp-c-text-1); }
.cx-footer-by { grid-column: 1 / -1; font: 11px/1 var(--vp-font-family-mono); letter-spacing: 0.04em; }
@media (max-width: 720px) { .cx-footer { grid-template-columns: 1fr; } }
</style>
