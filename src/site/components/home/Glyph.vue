<script setup>
import { ICONS } from './glyphs.js'

defineProps({
  type: { type: String, required: true },
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
  size: { type: Number, default: 11 },
})
</script>

<template>
  <g class="cxh-glyph" :transform="`translate(${x - size / 2} ${y - size / 2}) scale(${size / 24})`">
    <path v-for="d in ICONS[type]" :key="d" :d="d" />
  </g>
</template>
