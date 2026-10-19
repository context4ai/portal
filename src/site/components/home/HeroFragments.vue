<script setup>
import Glyph from './Glyph.vue'
import { fieldGlyphs } from './field.js'

const fragments = fieldGlyphs(960, 480, 32, 7)
</script>

<template>
  <svg class="cxh-hero-fragments" viewBox="0 0 960 480" preserveAspectRatio="xMidYMin slice" aria-hidden="true">
    <Glyph v-for="(g, i) in fragments" :key="i" :type="g.type" :x="g.x" :y="g.y" :size="11" :class="{ 'cxh-dome-space': ((g.x - 520) / 310) ** 2 + ((g.y - 430) / 170) ** 2 < 1.1 }" />
  </svg>
</template>
