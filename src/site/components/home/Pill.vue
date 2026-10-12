<script setup>
import { computed } from 'vue'
import { pillWidth } from './glyphs.js'

// kind: q = a question (blue, round); k = knowledge or evidence (neutral); live = a revised item (blue).
const props = defineProps({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  text: { type: String, required: true },
  kind: { type: String, default: 'k' },
  link: { type: Boolean, default: false },
})
const label = computed(() => props.text + (props.link ? ' ↗' : ''))
const w = computed(() => pillWidth(label.value, props.kind))
const h = computed(() => (props.kind === 'q' ? 22 : 20))
</script>

<template>
  <g class="cxh-pill" :class="'is-' + kind">
    <rect :x="x - w / 2" :y="y - h / 2" :width="w" :height="h" :rx="kind === 'q' ? h / 2 : 5" />
    <text :x="x" :y="y + 3.8" text-anchor="middle">{{ label }}</text>
  </g>
</template>
