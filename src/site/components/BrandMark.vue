<script setup>
// The homepage mark: a 5x5 dot matrix with a live corner dot.
const MARK = '0111010001100011000101110'
const dots = [...MARK].slice(0, 24).map((bit, i) => ({ x: (i % 5) * 4.8 + 2.4, y: Math.floor(i / 5) * 4.8 + 2.4, on: bit === '1' }))
</script>

<template>
  <svg class="brand-mark" width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
    <g fill="currentColor"><circle v-for="(d, i) in dots" :key="i" :cx="d.x" :cy="d.y" r="1.35" :opacity="d.on ? 1 : .22" /></g>
    <circle class="brand-live" cx="21.6" cy="21.6" r="1.35" />
  </svg>
  <span>Context for AI</span>
</template>

<style scoped>
.brand-mark { display: block; flex: none; }
.brand-live { fill: #2b7fff; }
.dark .brand-live { fill: #66a3ff; }
</style>
