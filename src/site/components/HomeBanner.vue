<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
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
const copied = ref(false)
async function copy(prompt) {
  try { await navigator.clipboard.writeText(prompt) } catch { return }
  copied.value = true
  setTimeout(() => { copied.value = false }, 1600)
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
onBeforeUnmount(() => observer?.disconnect())
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
            <button type="button" class="cxh-entry is-ink" :title="text(tag).hero.agentHint" @click="copy(text(tag).hero.prompt)">
              <template v-if="copied">{{ text(tag).hero.copied }}</template>
              <template v-else>LLMs<span>for Agent</span></template>
            </button>
            <button type="button" class="cxh-entry" aria-disabled="true">Oncall Bot<span>for Human</span></button>
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
  </div>
</template>
