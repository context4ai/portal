<script setup>
import Icon from './Icon.vue'
import { skillHref } from './content.js'

// Three lanes cross one column of knowledge: steps left of it write, steps right of it build on what was written.
// Each side has fixed slots so like steps line up across lanes; steps sit next to the knowledge column.
// Each step links to the skill that carries it; hovering or focusing a step shows the skill and what it does.
// The hero story lights the lane it is playing: steps it has passed, the step it is on, and the line up to it.
const props = defineProps({ t: { type: Object, required: true }, story: { type: Object, default: null } })
const SLOTS = { before: Math.max(...props.t.lanes.map(l => l.before.length)), after: Math.max(...props.t.lanes.map(l => l.after.length)) }
const skillName = s => (s.skill === 'indexers' ? props.t.indexers : s.skill)
const slot = (side, n, i) => (side === 'before' ? SLOTS.before - n + i + 1 : i + 1)
// Steps count along the lane: before steps, the knowledge column, then after steps.
const at = li => (props.story?.lane === li ? props.story.at : -1)
const seq = (lane, side, i) => (side === 'before' ? i : lane.before.length + 1 + i)
const state = (li, k) => { const a = at(li); return a < k ? '' : a === k ? 'is-on' : 'is-done' }
// How far along its track the lit line reaches, as a share of the track width.
function fill(li, lane, side) {
  const a = at(li), nb = lane.before.length, n = lane[side].length
  if (side === 'before') return a >= nb ? 1 : (SLOTS.before - n + Math.max(a, 0) + .5) / SLOTS.before
  return a > nb ? (a - nb - .5) / SLOTS.after : 0
}
</script>

<template>
  <div class="cxh-flows" :style="{ '--before': SLOTS.before, '--after': SLOTS.after, gridTemplateColumns: `200px minmax(0, ${SLOTS.before}fr) 96px minmax(0, ${SLOTS.after}fr)` }">
    <div class="cxh-spine" aria-hidden="true"><span>{{ t.knowledge }}</span></div>
    <template v-for="(lane, li) in t.lanes" :key="lane.name">
      <div class="cxh-lane-head" :class="{ 'is-live': at(li) >= 0 }" :style="{ gridRow: li + 1 }">
        <h3>{{ lane.name }}</h3>
        <p>{{ lane.text }}</p>
      </div>
      <div v-for="side in ['before', 'after']" :key="side" class="cxh-track" :class="[side, { 'is-live': at(li) >= 0 }]" :style="{ gridRow: li + 1, '--n': lane[side].length, '--fill': fill(li, lane, side) }">
        <a v-for="(s, i) in lane[side]" :key="s.name" class="cxh-step" :class="state(li, seq(lane, side, i))" :style="{ gridColumn: slot(side, lane[side].length, i) }" :href="skillHref(s.skill)" target="_blank" rel="noopener" :aria-label="`${s.name} · ${skillName(s)}`">
          <span class="cxh-step-dot"><Icon :type="s.icon" /></span>
          <span class="cxh-step-name">{{ s.name }}</span>
          <span class="cxh-tip" role="tooltip"><b>{{ skillName(s) }}</b>{{ s.tip }}</span>
        </a>
      </div>
      <div class="cxh-cross" :class="[state(li, lane.before.length), { 'is-live': at(li) >= lane.before.length }]" :style="{ gridRow: li + 1 }" aria-hidden="true"><span class="cxh-step-dot"><Icon type="knowledge" /></span></div>
    </template>
  </div>
</template>
