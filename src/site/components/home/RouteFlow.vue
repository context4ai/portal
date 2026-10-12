<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

// One question end to end, both reads served by the remote search service. Two routes take turns: knowledge alone is
// enough and the agent answers over the bypass, or it goes on to read the original. Each step lights as the dot reaches it.
// The view box is about as wide as the block, so its type matches the page.
const props = defineProps({ t: { type: Object, required: true }, uid: { type: String, required: true } })
const W = 700, H = 234, BYPASS = 40, LANE = 84, STORE = 198, R = 8, SPEED = 336, GAP = .6
const X = { ask: 44, knowledge: 250, source: 452, answer: 646 }
const width = (text, cjk = 12, latin = 6.8) => [...text].reduce((w, c) => w + (/[\u2e80-\ufaff\uff00-\uffef]/.test(c) ? cjk : latin), 24)
const nodes = ['ask', 'knowledge', 'source', 'answer'].map(k => ({ k, x: X[k], text: props.t[k], w: width(props.t[k]) }))
const stores = [X.knowledge, X.source].map((x, i) => ({ x, text: props.t.stores[i], w: width(props.t.stores[i], 11.5, 6.6) }))
const top = STORE - 13, SERVICE = 142

// A route is a list of steps: a point, or a rounded corner through `at`, optionally tagged with what the dot reaches there
// and held for `hold` seconds. The dot rests a moment at each store and again when it is back at the step that asked.
const corner = (at, to, tag) => ({ c: [at, at, to], tag })
const dip = (x, i, node) => [[x - 8, LANE], { p: [x - 8, top], tag: 'store' + i, hold: .25 }, { p: [x + 8, top], tag: 'return' + i }, { p: [x + 8, LANE], tag: node, hold: .45 }]
const kx = X.knowledge + 8
const bypass = [[kx, LANE - 13], [kx, BYPASS + R], corner([kx, BYPASS], [kx + R, BYPASS], 'direct'), [X.answer - R, BYPASS], corner([X.answer, BYPASS], [X.answer, BYPASS + R]), { p: [X.answer, LANE - 13], tag: 'answer' }]
const steps = {
  direct: [{ p: [X.ask, LANE], tag: 'ask' }, { p: [X.knowledge - 8, LANE], tag: 'knowledge' }, ...dip(X.knowledge, 0, 'knowledge').slice(1), ...bypass, [X.answer, LANE]],
  verify: [{ p: [X.ask, LANE], tag: 'ask' }, { p: [X.knowledge - 8, LANE], tag: 'knowledge' }, ...dip(X.knowledge, 0, 'knowledge').slice(1), { p: [X.source - 8, LANE], tag: 'source' }, ...dip(X.source, 1, 'source').slice(1), { p: [X.answer, LANE], tag: 'answer' }],
}
const bez = (a, b, c, d, t) => a.map((_, k) => (1 - t) ** 3 * a[k] + 3 * (1 - t) ** 2 * t * b[k] + 3 * (1 - t) * t ** 2 * c[k] + t ** 3 * d[k])
// Between stops the dot leaves fast and slows into the next one; highlights are timed on the same curve.
const EASE = [.15, .6, .35, 1]
const cubic = (t, p, q) => 3 * (1 - t) ** 2 * t * p + 3 * (1 - t) * t ** 2 * q + t ** 3
const timeAt = f => { let lo = 0, hi = 1; for (let i = 0; i < 24; i++) { const m = (lo + hi) / 2; cubic(m, EASE[1], EASE[3]) < f ? lo = m : hi = m } return cubic(lo, EASE[0], EASE[2]) }
const build = list => {
  let d = '', len = 0, last
  const at = []
  for (const s of list) {
    const step = Array.isArray(s) ? { p: s } : s
    if (!last) d = `M${step.p.join(' ')}`
    else if (step.c) {
      let prev = last
      for (let i = 1; i <= 12; i++) { const q = bez(last, ...step.c, i / 12); len += Math.hypot(q[0] - prev[0], q[1] - prev[1]); prev = q }
      d += ` C${step.c.map(p => p.join(' ')).join(' ')}`
    } else { len += Math.hypot(step.p[0] - last[0], step.p[1] - last[1]); d += ` L${step.p.join(' ')}` }
    last = step.c ? step.c[2] : step.p
    at.push({ len, tag: step.tag, hold: step.hold })
  }
  at.at(-1).stop = true
  const hits = {}, points = [0], times = [0], splines = []
  let from = 0, time = 0, pending = []
  for (const s of at) {
    pending.push(s)
    if (!s.hold && !s.stop) continue
    const dur = (s.len - from) / SPEED * 1.2
    for (const p of pending) if (p.tag) (hits[p.tag] ||= []).push(time + dur * timeAt((p.len - from) / (s.len - from || 1)))
    time += dur; points.push(s.len); times.push(time); splines.push(EASE.join(' '))
    if (s.hold) { time += s.hold; points.push(s.len); times.push(time); splines.push('0 0 1 1') }
    from = s.len; pending = []
  }
  return { d, dur: time, hits, keyPoints: points.map(l => (l / len).toFixed(4)).join(';'), keyTimes: times.map(t => (t / time).toFixed(4)).join(';'), keySplines: splines.join(';') }
}
const routes = { direct: build(steps.direct), verify: build(steps.verify) }
const bypassPath = build(bypass).d
const id = k => `${props.uid}-${k}`
// SMIL begin lists, so every highlight stays in step with the dot of the route that reaches it.
const when = tag => Object.keys(routes).flatMap(k => (routes[k].hits[tag] || []).map(s => `${id(k)}.begin+${(s + .01).toFixed(2)}s`)).join(';')

const root = ref(null), on = ref(false)
let io
onMounted(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  io = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting || on.value) return
    on.value = true
    nextTick(() => document.getElementById(id('direct'))?.beginElement())
  }, { threshold: .4 })
  io.observe(root.value)
})
onBeforeUnmount(() => io?.disconnect())
</script>

<template>
  <svg ref="root" class="cxh-routeflow" :viewBox="`0 0 ${W} ${H}`" role="img" :aria-label="`${t.ask} → ${t.knowledge} → ${t.answer}; ${t.ask} → ${t.knowledge} → ${t.source} → ${t.answer}`">
    <text x="0" y="12" class="cxh-rf-label">{{ t.agent }}</text>
    <path :d="`M${X.ask} ${LANE} H${X.answer}`" class="cxh-rf-lane" />
    <path :d="bypassPath" class="cxh-rf-bypass" />
    <text :x="(X.knowledge + X.answer) / 2" :y="BYPASS - 7" class="cxh-rf-return is-mid" opacity=".7">{{ t.direct }}<animate v-if="on" attributeName="opacity" values="1;1;.7" keyTimes="0;.6;1" dur="1s" :begin="when('direct')" /></text>
    <template v-if="on">
      <circle v-for="(r, k) in routes" :key="k" r="3" class="cxh-rf-dot" opacity="0">
        <animateMotion :id="id(k)" :begin="k === 'direct' ? `indefinite;${id('verify')}.end+${GAP}s` : `${id('direct')}.end+${GAP}s`" :dur="r.dur.toFixed(2) + 's'" :path="r.d" calcMode="spline" :keyPoints="r.keyPoints" :keyTimes="r.keyTimes" :keySplines="r.keySplines" />
        <!-- Chrome drops a sync base with no offset, hence the 10 ms. -->
        <animate attributeName="opacity" values="1;1" :begin="`${id(k)}.begin+0.01s`" :dur="(r.dur - .01).toFixed(2) + 's'" />
      </circle>
    </template>
    <rect x="4" :y="SERVICE" :width="W - 8" :height="H - SERVICE" rx="10" class="cxh-rf-service" />
    <text x="18" :y="STORE + 4" class="cxh-rf-label">{{ t.service }}</text>
    <template v-for="(s, i) in stores" :key="s.text">
      <path :d="`M${s.x - 8} ${LANE + 13} V${top}`" class="cxh-rf-down" />
      <path :d="`M${s.x + 8} ${top} V${LANE + 13}`" class="cxh-rf-up" />
      <text v-if="t.returns[i]" :x="s.x + 16" :y="(LANE + 13 + SERVICE) / 2 + 4" class="cxh-rf-return" opacity=".7">{{ t.returns[i] }}<animate v-if="on" attributeName="opacity" values="1;1;.7" keyTimes="0;.6;1" dur="1s" :begin="when('return' + i)" /></text>
      <g class="cxh-rf-node is-store">
        <rect :x="s.x - s.w / 2" :y="STORE - 13" :width="s.w" height="26" rx="7" />
        <text :x="s.x" :y="STORE + 4">{{ s.text }}</text>
        <g class="lit" opacity="0">
          <animate v-if="on" attributeName="opacity" values="1;1;0" keyTimes="0;.5;1" dur=".8s" :begin="when('store' + i)" />
          <rect :x="s.x - s.w / 2" :y="STORE - 13" :width="s.w" height="26" rx="7" /><text :x="s.x" :y="STORE + 4">{{ s.text }}</text>
        </g>
      </g>
    </template>
    <g v-for="n in nodes" :key="n.k" class="cxh-rf-node" :class="n.k === 'knowledge' || n.k === 'source' ? 'is-key' : 'is-end'">
      <rect :x="n.x - n.w / 2" :y="LANE - 13" :width="n.w" height="26" rx="7" />
      <text :x="n.x" :y="LANE + 4">{{ n.text }}</text>
      <g class="lit" opacity="0">
        <animate v-if="on" attributeName="opacity" values="1;1;0" keyTimes="0;.5;1" dur=".8s" :begin="when(n.k)" />
        <rect :x="n.x - n.w / 2" :y="LANE - 13" :width="n.w" height="26" rx="7" /><text :x="n.x" :y="LANE + 4">{{ n.text }}</text>
      </g>
    </g>
  </svg>
</template>
