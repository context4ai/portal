<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import Glyph from './Glyph.vue'
import Pill from './Pill.vue'
import { fieldGlyphs } from './field.js'
import { noise, pillWidth } from './glyphs.js'

// One picture: information scattered above, a half-ellipse of knowledge below. Icons shrink into dots
// as they near the knowledge. A production run starts with a request typed to the team bot; one to three
// pieces of information fly into the knowledge and settle as a small area, sending a ripple through the dots
// around it. A reader in the entry row then types a question; a line runs from it to the new knowledge,
// the evidence is traced back to the original and the answer appears under the question.
// Before mount and with reduced motion only the arranged picture is shown.
const props = defineProps({
  t: { type: Object, required: true },
  uid: { type: String, default: 'cxh-hero' },
  copyWidth: { type: Number, default: 880 },
  story: { type: Object, required: true },
})

// The canvas reaches TOP above the copy, up to the top of the page, and ends at the bottom row of dots.
const W = 1376, TOP = 36, COPY_BOTTOM = 236
const CX = 744, BASE = 424, RX = 430, RY = 163, PITCH = 11, H = BASE - 10
const ell = (x, y) => ((x - CX) / RX) ** 2 + ((y - BASE) / RY) ** 2

// The knowledge: a dot matrix clipped to the dome, thinning toward its edge.
// The bottom row is the ground line: unbroken, and LEDGE dots longer on each side.
const FLOOR = BASE - 16, LEDGE = 2
const dots = []
for (let y = FLOOR; y > BASE - RY; y -= PITCH) for (let x = CX - RX - LEDGE * PITCH; x <= CX + RX + LEDGE * PITCH; x += PITCH) {
  const e = ell(x, y), n = dots.length + Math.round(x * 3 + y)
  const keep = y === FLOOR ? Math.abs(x - CX) <= RX * Math.sqrt(.985 - ((y - BASE) / RY) ** 2) + LEDGE * PITCH : e < .985 && !(e > .55 && noise(n, 42) < (e - .55) / .45 * .7)
  if (keep) dots.push({ x, y, kb: e < .985 && noise(n, 41) < .1, fade: e > .55 ? +Math.max(.45, 1 - (e - .55) / .45 * .55).toFixed(2) : 1, e })
}

// Information: icons outside the dome, shrinking toward it and turning into dots at its edge.
const upper = g => Math.max(g.x > props.copyWidth ? Math.min(1, (g.x - props.copyWidth) / 140) : 0, g.y > COPY_BOTTOM ? Math.min(1, (g.y - COPY_BOTTOM) / 40) : 0, g.y < 28 ? Math.min(1, (28 - g.y) / 24) : 0)
const info = fieldGlyphs(W, H + TOP, 30, 7)
  .map((g, i) => ({ ...g, i, y: +(g.y - TOP).toFixed(1), e: ell(g.x, g.y - TOP) }))
  .filter(g => g.e > 1.06 && g.y < H - 4)
  .map(g => {
    const near = Math.min(1, (g.e - 1.06) / .9)
    return { ...g, fade: noise(g.i, 9) < .3 * near ? 0 : upper(g), size: +(6 + 6 * near).toFixed(1), dot: near < .16 }
  })
  .filter(g => g.fade > 0)
// Production, and the question after it, stay on the left half so the lines from the readers on the right cross the picture.
const sources = info.filter(g => !g.dot && g.size > 9.5 && g.fade > .9 && g.x > 80 && g.x < W - 80 && g.y > 210 && g.y < BASE - 10)
const targets = dots.filter(d => d.e < .6 && d.y < BASE - 40 && d.x < CX - 40)
const cluster = c => dots.filter(d => Math.hypot(d.x - c.x, d.y - c.y) < 20)
// The ripple pushes the dots it passes a few pixels outward and tints some of them; the settled area stays still.
const RIPPLE_R = 120, RIPPLE_T = .45
function ripple(c, id) {
  const els = svg.value?.querySelectorAll('.cxh-grid, .cxh-kb')
  if (!els) return
  const hit = []
  dots.forEach((d, i) => {
    const dist = Math.hypot(d.x - c.x, d.y - c.y)
    if (dist < 20 || dist > RIPPLE_R) return
    const el = els[i], k = (1 - dist / RIPPLE_R) * 2 / dist
    el.style.setProperty('--wx', (d.x - c.x) * k + 'px')
    el.style.setProperty('--wy', (d.y - c.y) * k + 'px')
    el.style.setProperty('--wd', (dist / RIPPLE_R * RIPPLE_T).toFixed(2) + 's')
    el.classList.remove('cxh-wave', 'tint')
    hit.push([el, noise(i + id * 7, 54) < .35 * (1 - dist / RIPPLE_R)])
  })
  // Restart the animation on dots a previous ripple already touched.
  void svg.value.getBoundingClientRect()
  hit.forEach(([el, tint]) => el.classList.add('cxh-wave', ...(tint ? ['tint'] : [])))
}

// Lines stop short of what they point at, so they never cover an icon or a dot.
const unit = (a, b) => { const l = Math.hypot(b.x - a.x, b.y - a.y) || 1; return { x: (b.x - a.x) / l, y: (b.y - a.y) / l } }
function link(a, b, bend, ra = 0, rb = 0) {
  const m = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, n = unit(a, b)
  const c = { x: m.x - n.y * bend * Math.hypot(b.x - a.x, b.y - a.y), y: m.y + n.x * bend * Math.hypot(b.x - a.x, b.y - a.y) }
  const ua = unit(a, c), ub = unit(c, b)
  const s = { x: a.x + ua.x * ra, y: a.y + ua.y * ra }, e = { x: b.x - ub.x * rb, y: b.y - ub.y * rb }
  return { d: `M${s.x.toFixed(1)} ${s.y.toFixed(1)} Q${c.x.toFixed(1)} ${c.y.toFixed(1)} ${e.x.toFixed(1)} ${e.y.toFixed(1)}`, dir: ub }
}

const svg = ref(null)
const fresh = ref([])
const run = ref(null)
const ask = ref(null)
let timers = [], runs = 0, qi = -1, ri = -1
const later = (fn, ms) => timers.push(setTimeout(fn, ms))
const begin = id => nextTick(() => document.getElementById(id)?.beginElement())
const FLY = 1300, STAGGER = 200, TYPE = 70
// Types text into the story's question line and calls done once it is complete.
function type(text, done) {
  const st = props.story, chars = [...text]
  st.typed = ''; st.answer = ''; st.typing = true
  chars.forEach((_, k) => later(() => { st.typed = chars.slice(0, k + 1).join('') }, 120 + k * TYPE))
  later(() => { st.typing = false; done() }, 120 + chars.length * TYPE + 300)
}

// The team bot is asked to update the knowledge from a source, then the production runs.
function request() {
  ri = (ri + 1) % props.t.requests.length
  props.story.reader = 0
  type(props.t.requests[ri].q, produce)
}

function produce() {
  const n = 1 + Math.floor(noise(runs, 51) * 3)
  const to = targets[Math.floor(noise(runs, 52) * targets.length)]
  const near = sources.filter(g => g.x < to.x + 60 && Math.hypot(g.x - to.x, g.y - to.y) < 380), pool = near.length ? near : sources
  const from = Array.from({ length: n }, (_, k) => ({ g: pool[Math.floor(noise(runs * 3 + k, 53) * pool.length)], d: k * STAGGER / 1000 }))
  const id = runs++
  run.value = { id, from, to }
  later(() => {
    fresh.value = [...fresh.value.slice(-11), { id, ...to, dots: cluster(to) }]
    ripple(to, id)
    run.value = null
    props.story.answer = props.t.requests[ri].a.replace('{n}', n)
    later(() => { Object.assign(props.story, { reader: -1, typed: '', answer: '' }); later(() => question(to, from[0].g), 500) }, 1800)
  }, FLY + (n - 1) * STAGGER)
}

// Converts a page point to canvas coordinates; the question lives in the entry row, outside the canvas.
function toCanvas(x, y) {
  const m = svg.value?.getScreenCTM()
  if (!m) return null
  const p = svg.value.createSVGPoint(); p.x = x; p.y = y
  return p.matrixTransform(m.inverse())
}
function question(to, src) {
  qi = (qi + 1) % props.t.queries.length
  const q = props.t.queries[qi], st = props.story
  st.reader = qi
  type(q.q, () => {
    const el = svg.value?.closest('section')?.querySelector('.cxh-ask')
    const r = el?.getBoundingClientRect()
    const from = r && toCanvas(r.left - 6, r.top + r.height / 2)
    if (!from) return later(() => finish(), 2000)
    const line = link(from, to, -.12, 0, 6)
    const ev = link(to, src, src.x < to.x ? .16 : -.16, 6, 11)
    const w = pillWidth(q.at)
    let pill = Math.abs(ev.dir.x) > Math.abs(ev.dir.y)
      ? { x: src.x + Math.sign(ev.dir.x) * (14 + w / 2), y: src.y }
      : { x: src.x, y: src.y + Math.sign(ev.dir.y) * 20 }
    if (pill.x - w / 2 < 4 || pill.x + w / 2 > W - 4) pill = { x: Math.min(Math.max(src.x, 4 + w / 2), W - 4 - w / 2), y: src.y - 20 }
    ask.value = { to, src, line: line.d, evidence: ev.d, pill, at: q.at, step: 1 }
    later(() => { ask.value.step = 2; begin(`${props.uid}-trace`) }, 800)
    later(() => { ask.value.step = 3; st.answer = `${q.a} · ${q.at}` }, 1900)
    later(finish, 4800)
  })
}
function finish() {
  ask.value = null
  Object.assign(props.story, { reader: -1, typed: '', answer: '', typing: false })
  later(request, 600)
}

const ready = ref(false)
onMounted(() => {
  ready.value = true
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  later(request, 700)
})
onBeforeUnmount(() => timers.forEach(clearTimeout))
</script>

<template>
  <svg ref="svg" class="cxh-art" :class="{ 'is-ready': ready }" :viewBox="`0 ${-TOP} ${W} ${H + TOP}`" preserveAspectRatio="xMidYMax meet" role="img" :aria-label="t.label">
    <g v-once>
      <template v-for="g in info" :key="g.i">
        <circle v-if="g.dot" :cx="g.x" :cy="g.y" r="1.3" class="cxh-info-dot" :style="{ '--fade': g.fade }" />
        <Glyph v-else :type="g.type" :x="g.x" :y="g.y" :size="g.size" class="cxh-field" :class="{ twinkle: g.twinkle }" :style="{ '--fade': g.fade, '--tw': g.delay + 's' }" />
      </template>
      <circle v-for="(d, i) in dots" :key="i" :cx="d.x" :cy="d.y" :r="d.kb ? 1.6 : 1.3" :class="d.kb ? 'cxh-kb' : 'cxh-grid'" :opacity="d.fade" />
    </g>

    <!-- production: information flies into the knowledge and settles there -->
    <g v-if="run" :key="'run' + run.id">
      <g v-for="(f, k) in run.from" :key="k" class="cxh-fly" :style="{ '--dx': run.to.x - f.g.x + 'px', '--dy': run.to.y - f.g.y + 'px', '--d': f.d + 's' }">
        <Glyph :type="f.g.type" :x="f.g.x" :y="f.g.y" :size="f.g.size" />
      </g>
    </g>
    <g v-for="c in fresh" :key="'c' + c.id" class="cxh-fresh">
      <circle v-for="(d, i) in c.dots" :key="i" :cx="d.x" :cy="d.y" r="1.7" :style="{ '--o': (Math.hypot(d.x - c.x, d.y - c.y) / 60).toFixed(2) + 's' }" />
    </g>

    <!-- retrieval: from the typed question to the knowledge, then out along the evidence to the original -->
    <g v-if="ask">
      <path :d="ask.line" pathLength="1" class="cxh-qline" />
      <circle :cx="ask.to.x" :cy="ask.to.y" r="3.2" class="cxh-dot live" />
      <g class="cxh-trace" :class="{ on: ask.step >= 2 }">
        <path :id="`${uid}-ev`" :d="ask.evidence" class="cxh-evidence" />
        <circle :cx="ask.src.x" :cy="ask.src.y" r="10" class="cxh-src-ring" />
        <Glyph :type="ask.src.type" :x="ask.src.x" :y="ask.src.y" :size="12" class="cxh-src" />
      </g>
      <Pill v-if="ask.step >= 3" class="cxh-pop" :x="ask.pill.x" :y="ask.pill.y" :text="ask.at" kind="live" />
      <circle v-if="ask.step === 2" r="2.6" class="cxh-dot live">
        <animateMotion :id="`${uid}-trace`" begin="indefinite" dur="1s" fill="freeze"><mpath :href="`#${uid}-ev`" /></animateMotion>
      </circle>
    </g>
  </svg>
</template>
