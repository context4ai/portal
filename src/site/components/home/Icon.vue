<script setup>
import { ICONS } from './glyphs.js'

defineProps({ type: { type: String, required: true } })
</script>

<template>
  <svg class="cxh-icon" viewBox="0 0 24 24" aria-hidden="true"><path v-for="d in ICONS[type]" :key="d" :d="d" /></svg>
</template>
