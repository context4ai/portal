<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useData } from 'vitepress'
import { content } from './home/content.js'
import HeroArt from './home/HeroArt.vue'
import Icon from './home/Icon.vue'
import HomeSections from './home/HomeSections.vue'
import './home/home.css'

const { theme } = useData()
// Every reader language is rendered; the site stylesheet shows the active one from the first paint.
const tags = computed(() => theme.value.contextLocales?.tags || ['en-US'])
const text = tag => (tag.toLowerCase().startsWith('zh') ? content.zh : content.en)

const root = ref(null)
// The hero animation drives the readers in the entry row (who asks and the typed question)
// and the flows below (the lane and step it has reached).
const stories = {}
const story = tag => (stories[tag] ??= reactive({ reader: -1, typed: '', typing: false, lane: -1, at: -1, hover: -1 }))
const READER_ICONS = ['bot', 'terminal', 'globe']
// The prompt dialog closes itself after a short countdown; the reader can also confirm, click outside or press Escape.
const COUNTDOWN = 5
const dialog = reactive({ tag: '', copied: true, left: 0 })
const confirmButton = ref(null)
let countdown = null
async function openPrompt(tag) {
  let copied = true
  try { await navigator.clipboard.writeText(text(tag).hero.prompt) } catch { copied = false }
  Object.assign(dialog, { tag, copied, left: COUNTDOWN })
  clearInterval(countdown)
  countdown = setInterval(() => { if (--dialog.left <= 0) closePrompt() }, 1000)
  addEventListener('keydown', onKey)
  await nextTick()
  confirmButton.value?.focus({ preventScroll: true })
}
function closePrompt() {
  clearInterval(countdown)
  removeEventListener('keydown', onKey)
  dialog.tag = ''
}
const onKey = event => { if (event.key === 'Escape') closePrompt() }
const soon = ref('')
let soonTimer = null
function comingSoon(tag) {
  soon.value = tag
  clearTimeout(soonTimer)
  soonTimer = setTimeout(() => { soon.value = '' }, 1600)
}

// Blocks fade in once and their numbers count up the first time they scroll into view.
let observer = null
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches
function roll(el) {
  const target = Number(el.dataset.value), decimals = Number(el.dataset.decimals || 0)
  const format = v => v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
  if (reduced()) { el.textContent = format(target); return }
  const begin = performance.now()
  const tick = now => {
    const p = Math.min(1, (now - begin) / 900)
    el.textContent = format(target * (1 - Math.pow(1 - p, 3)))
    if (p < 1) requestAnimationFrame(tick)
  }
  el.textContent = format(0)
  requestAnimationFrame(tick)
}
function observe() {
  observer?.disconnect()
  observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      entry.target.classList.add('is-visible')
      entry.target.querySelectorAll('.cxh-roll').forEach(roll)
      observer.unobserve(entry.target)
    }
  }, { rootMargin: '0px 0px -10% 0px', threshold: .1 })
  root.value.querySelectorAll('.cxh-reveal:not(.is-visible)').forEach(el => observer.observe(el))
}
onMounted(() => { root.value.classList.add('cxh-js'); observe() })
onBeforeUnmount(() => { observer?.disconnect(); closePrompt(); clearTimeout(soonTimer) })
</script>

<template>
  <div ref="root" class="cxh">
    <div v-for="tag in tags" :key="tag" :data-context-locales="tag" :lang="tag">
      <section class="context-home-section cxh-hero" :aria-labelledby="`cxh-${tag}-hero-title`">
        <div class="cxh-hero-top">
          <div class="cxh-hero-copy">
            <h1 :id="`cxh-${tag}-hero-title`" class="cxh-title">{{ text(tag).hero.title }}</h1>
            <p class="cxh-deck">{{ text(tag).hero.deck }}</p>
          </div>
          <div class="cxh-entries">
            <button type="button" class="cxh-entry is-ink" :title="text(tag).hero.agentHint" aria-haspopup="dialog" @click="openPrompt(tag)">LLMs<span>for Agent</span></button>
            <button type="button" class="cxh-entry" aria-live="polite" @click="comingSoon(tag)">
              <template v-if="soon === tag">{{ text(tag).hero.soon }}</template>
              <template v-else>Oncall Bot<span>for Human</span></template>
            </button>
            <div class="cxh-readers" aria-hidden="true">
              <span v-for="(u, i) in text(tag).flow.users" :key="u" class="cxh-reader" :class="{ on: story(tag).reader === i }" @mouseenter="story(tag).hover = i" @mouseleave="story(tag).hover = -1"><Icon :type="READER_ICONS[i]" />{{ u }}
                <span v-if="story(tag).reader === i" class="cxh-ask"><span class="cxh-ask-text">{{ story(tag).typed }}</span><i v-if="story(tag).typing" class="cxh-caret" /></span>
              </span>
            </div>
          </div>
        </div>
        <HeroArt class="cxh-hero-art" :t="text(tag).flow" :uid="`cxh-${tag}-flow`" :copy-width="tag.toLowerCase().startsWith('zh') ? 420 : 640" :story="story(tag)" :lanes="text(tag).flows.lanes" />
      </section>
      <HomeSections :t="text(tag)" :id-prefix="`cxh-${tag}-`" :story="story(tag)" />
    </div>
    <Teleport to="body">
      <Transition name="cxh-dialog">
        <div v-if="dialog.tag" class="cxh-dialog" :lang="dialog.tag" @click.self="closePrompt">
          <div class="cxh-dialog-card" role="dialog" aria-modal="true" aria-labelledby="cxh-dialog-title">
            <button type="button" class="cxh-dialog-count" :aria-label="text(dialog.tag).hero.close" :title="text(dialog.tag).hero.close" @click="closePrompt">
              <svg viewBox="0 0 28 28" aria-hidden="true"><circle cx="14" cy="14" r="12" /><circle class="cxh-dialog-ring" cx="14" cy="14" r="12" :style="{ animationDuration: `${COUNTDOWN}s` }" /></svg>
              <span>{{ dialog.left }}</span>
            </button>
            <p id="cxh-dialog-title" class="cxh-dialog-title">{{ dialog.copied ? text(dialog.tag).hero.copied : text(dialog.tag).hero.copyFailed }}</p>
            <pre class="cxh-dialog-code"><code>{{ text(dialog.tag).hero.prompt }}</code></pre>
            <div class="cxh-dialog-foot">
              <a class="cxh-dialog-link" :href="text(dialog.tag).hero.llms" target="_blank" rel="noopener"><Icon type="link" /><span>{{ text(dialog.tag).hero.llms }}</span></a>
              <button ref="confirmButton" type="button" class="cxh-dialog-confirm" @click="closePrompt">{{ text(dialog.tag).hero.confirm }}</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
