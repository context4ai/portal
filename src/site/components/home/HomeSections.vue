<script setup>
import FlowLanes from './FlowLanes.vue'
import Icon from './Icon.vue'
import RouteFlow from './RouteFlow.vue'
import { skillHref } from './content.js'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  t: { type: Object, required: true },
  idPrefix: { type: String, default: 'cxh-' },
  story: { type: Object, default: null },
})

const fmt = (v, d = 0) => v.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })
const q = computed(() => props.t.results.quality)
const sp = computed(() => props.t.results.speed)
// Query times span three orders of magnitude, so the chart uses a log scale from 0.5 ms to 1 s.
const LOG_MIN = Math.log10(.5), LOG_MAX = Math.log10(1000)
const logX = v => (Math.log10(v) - LOG_MIN) / (LOG_MAX - LOG_MIN) * 100

// Arch wires: one curve from each entry card into the middle of the agent, and from there to each output card.
// Duplex entries also get an arrow back, since the agent replies to them.
const arch = ref(null)
const wires = ref({ w: 0, h: 0, paths: [] })
const curve = (x1, y1, x2, y2) => { const m = (x1 + x2) / 2; return `M${x1} ${y1}C${m} ${y1} ${m} ${y2} ${x2} ${y2}` }
function layoutWires() {
  const el = arch.value
  if (!el) return
  const box = el.getBoundingClientRect(), agent = el.querySelector(".cxh-arch-agent").getBoundingClientRect()
  const y = r => r.top + r.height / 2 - box.top, ay = y(agent)
  const rects = sel => [...el.querySelectorAll(sel)].map(e => e.getBoundingClientRect())
  wires.value = { w: box.width, h: box.height, paths: [
    ...rects(".is-entry .cxh-arch-item").map((r, i) => ({ d: curve(r.right - box.left, y(r), agent.left - box.left, ay), back: props.t.arch.entry.items[i]?.duplex })),
    ...rects(".is-out .cxh-arch-item").map(r => ({ d: curve(agent.right - box.left, ay, r.left - box.left, y(r)), arrow: true })),
  ], tip: { x: agent.left - box.left, y: ay } }
}
let observer
onMounted(() => { observer = new ResizeObserver(layoutWires); observer.observe(arch.value); layoutWires() })
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <section class="context-home-section cxh-sec" :aria-labelledby="idPrefix + 'flows'">
    <div class="cxh-split cxh-reveal">
      <h2 :id="idPrefix + 'flows'" class="cxh-h2">{{ t.flows.title }}</h2>
      <p class="cxh-lede">{{ t.flows.deck }}</p>
    </div>
    <div class="cxh-flows-scroll cxh-reveal"><FlowLanes :t="t.flows" :story="story" /></div>
  </section>

  <section class="context-home-section cxh-sec" :aria-labelledby="idPrefix + 'arch'">
    <div class="cxh-split cxh-reveal">
      <h2 :id="idPrefix + 'arch'" class="cxh-h2">{{ t.arch.title }}</h2>
      <p class="cxh-lede">{{ t.arch.deck }}</p>
    </div>
    <div ref="arch" class="cxh-arch cxh-reveal">
      <svg class="cxh-arch-wires" aria-hidden="true" :viewBox="`0 0 ${wires.w} ${wires.h}`">
        <defs><marker :id="idPrefix + 'arch-arrow'" viewBox="0 0 6 8" refX="6" refY="4" markerWidth="6" markerHeight="8" markerUnits="userSpaceOnUse" orient="auto-start-reverse"><path d="M0 0 6 4 0 8z" /></marker></defs>
        <path v-for="(p, i) in wires.paths" :key="i" :d="p.d" :marker-start="p.back ? `url(#${idPrefix}arch-arrow)` : undefined" :marker-end="p.arrow ? `url(#${idPrefix}arch-arrow)` : undefined" />
        <path v-if="wires.tip" class="cxh-arch-tip" :d="`M${wires.tip.x - 6} ${wires.tip.y - 4}l6 4-6 4z`" />
      </svg>
      <ul class="cxh-arch-side is-entry"><li v-for="it in t.arch.entry.items" :key="it.text"><component :is="it.href ? 'a' : 'span'" class="cxh-arch-item" :class="{ 'is-link': it.href }" :href="it.href"><Icon :type="it.icon" />{{ it.text }}</component></li></ul>
      <div class="cxh-arch-agent">
        <div class="cxh-arch-head">
          <p class="cxh-arch-label">{{ t.arch.agent.runtime }}</p>
          <p class="cxh-arch-chips"><span v-for="r in t.arch.agent.runtimes" :key="r">{{ r }}</span></p>
          <component :is="t.arch.agent.botHref ? 'a' : 'span'" class="cxh-arch-bot" :class="{ 'is-link': t.arch.agent.botHref }" :href="t.arch.agent.botHref"><Icon type="bot" />{{ t.arch.agent.bot }}</component>
        </div>
        <div class="cxh-arch-skills">
          <div class="cxh-arch-plugin">
            <a class="cxh-arch-label" :href="t.arch.agent.pluginHref" target="_blank" rel="noreferrer">{{ t.arch.agent.plugin }} <i aria-hidden="true">↗</i></a>
            <p class="cxh-arch-chips"><a v-for="s in t.arch.agent.skills" :key="s.skill" :href="skillHref(s.skill)" target="_blank" rel="noreferrer">{{ s.text }}<i aria-hidden="true">↗</i></a></p>
          </div>
          <div class="cxh-arch-tools"><component :is="it.href ? 'a' : 'div'" v-for="it in t.arch.agent.tools" :key="it.text" class="cxh-arch-plugin cxh-arch-tool" :class="{ 'is-link': it.href }" :href="it.href"><Icon :type="it.icon" /><span class="cxh-arch-label">{{ it.text }}</span><i v-if="it.href" aria-hidden="true">↗</i></component></div>
        </div>
      </div>
      <ul class="cxh-arch-side is-out"><li v-for="it in t.arch.out.items" :key="it.text"><span class="cxh-arch-item"><Icon :type="it.icon" />{{ it.text }}</span></li></ul>
    </div>
  </section>

  <section class="context-home-section cxh-sec" :aria-labelledby="idPrefix + 'results'">
    <div class="cxh-split cxh-reveal">
      <h2 :id="idPrefix + 'results'" class="cxh-h2">{{ t.results.title }}</h2>
      <p class="cxh-lede">{{ t.results.deck }}<a v-if="t.results.more" class="cxh-more" :href="t.results.more.href">{{ t.results.more.text }} →</a></p>
    </div>
    <div class="cxh-cards cxh-reveal">
      <div v-for="c in t.results.cards" :key="c.label" class="cxh-card">
        <p class="cxh-card-label">{{ c.label }}</p>
        <p class="cxh-card-vals">
          <span class="cxh-card-from"><small>{{ t.results.from }}</small>{{ c.prefix }}{{ fmt(c.from, c.decimals) }}<small>{{ c.unit }}</small></span>
          <span class="cxh-card-arrow" aria-hidden="true">→</span>
          <span class="cxh-card-to"><small>{{ t.results.to }}</small>{{ c.prefix }}<b class="cxh-roll" :data-value="c.to" :data-decimals="c.decimals || 0">{{ fmt(c.to, c.decimals) }}</b><small>{{ c.unit }}</small></span>
        </p>
        <p class="cxh-card-change">{{ c.change }}</p>
      </div>
    </div>

    <div class="cxh-part cxh-reveal">
      <div class="cxh-part-head">
        <span class="cxh-group-index">01</span>
        <h3>{{ q.name }}</h3>
        <p>{{ q.text }}<a v-if="q.more" class="cxh-more" :href="q.more.href">{{ q.more.text }} →</a></p>
      </div>
      <div class="cxh-blocks">
        <div class="cxh-block">
          <p class="cxh-fig">{{ q.extract.title }}</p>
          <p class="cxh-extract-src">{{ q.extract.source }}</p>
          <ul class="cxh-extract-rows">
            <li v-for="(r, i) in q.extract.rows" :key="r.path" :class="{ keep: r.keep }" :style="{ '--i': i }">
              <code>{{ r.path }}</code><span>{{ r.text }}</span>
            </li>
          </ul>
          <p class="cxh-extract-flow"><span class="cxh-extract-indexer">{{ q.extract.indexer }}</span><span class="cxh-extract-arrow" aria-hidden="true" /><span class="cxh-extract-out">{{ q.extract.out }}</span></p>
        </div>
        <div class="cxh-block">
          <p class="cxh-fig">{{ q.ratio.title }}</p>
          <p class="cxh-ratio-value">{{ q.ratio.value }}</p>
          <div class="cxh-ratio-grid" aria-hidden="true"><i v-for="n in 115" :key="n" :class="{ on: n === 58 }" /></div>
          <dl class="cxh-ratio-legend">
            <div v-for="(r, k) in { from: q.ratio.from, to: q.ratio.to }" :key="k" :class="'is-' + k"><dt><i :class="{ on: k === 'to' }" />{{ r.label }}<b>{{ r.size }}</b></dt><dd v-for="l in r.detail" :key="l">{{ l }}</dd></div>
          </dl>
        </div>
        <div class="cxh-block">
          <p class="cxh-fig"><a v-if="q.chain.href" class="cxh-fig-link" :href="q.chain.href">{{ q.chain.title }} →</a><template v-else>{{ q.chain.title }}</template></p>
          <p class="cxh-chain-article">{{ q.chain.article }}</p>
          <ol class="cxh-chain">
            <li v-for="(r, i) in q.chain.rows" :key="r.at" :style="{ '--i': i }">
              <p class="cxh-chain-claim">{{ r.text }}<sup>{{ i + 1 }}</sup></p>
              <p class="cxh-chain-src"><span>{{ r.at }}</span><em>{{ r.rev }}</em></p>
            </li>
          </ol>
          <p class="cxh-block-note">{{ q.chain.note }}</p>
        </div>
      </div>
    </div>

    <div class="cxh-part cxh-reveal">
      <div class="cxh-part-head">
        <span class="cxh-group-index">02</span>
        <h3>{{ sp.name }}</h3>
        <p>{{ sp.text }}<a v-if="sp.more" class="cxh-more" :href="sp.more.href">{{ sp.more.text }} →</a></p>
      </div>
      <div class="cxh-blocks two">
        <div class="cxh-block">
          <p class="cxh-fig">{{ sp.route.title }}</p>
          <RouteFlow :t="sp.route" :uid="idPrefix + 'route'" />
        </div>
        <div class="cxh-block">
          <p class="cxh-fig">{{ sp.latency.title }}</p>
          <div class="cxh-latency">
            <div v-for="(r, i) in sp.latency.rows" :key="r.name" class="cxh-latency-row" :class="{ live: r.live }" :style="{ '--i': i }">
              <span class="cxh-latency-name">{{ r.name }}</span>
              <span class="cxh-latency-track"><i :style="{ left: logX(r.min) + '%', width: logX(r.max) - logX(r.min) + '%' }" /></span>
              <span class="cxh-latency-val">{{ r.min }}–{{ r.max }} ms</span>
            </div>
            <div class="cxh-latency-axis" aria-hidden="true"><span /><span class="cxh-latency-track"><em v-for="v in [1, 10, 100, 1000]" :key="v" :style="{ left: logX(v) + '%' }">{{ v }}</em></span><span /></div>
          </div>
          <p class="cxh-block-note">{{ sp.latency.note }}</p>
          <dl class="cxh-facts">
            <div v-for="f in sp.facts" :key="f.value"><dt>{{ f.value }}</dt><dd>{{ f.label }}</dd></div>
          </dl>
        </div>
      </div>
    </div>
  </section>
</template>
