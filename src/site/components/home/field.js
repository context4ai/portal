import { noise } from './glyphs.js'

const TYPES = ['code', 'code', 'doc', 'doc', 'session', 'note']

// A jittered grid of faint source icons, kept clear of the points a scene draws on.
export function fieldGlyphs(w, h, gap, seed, avoid = [], clear = 26) {
  const out = []
  let i = 0
  for (let y = gap / 2; y < h; y += gap) {
    for (let x = gap / 2; x < w; x += gap, i++) {
      const px = x + (noise(i, seed) - .5) * gap * .7
      const py = y + (noise(i, seed + 1) - .5) * gap * .7
      if (avoid.some(p => Math.hypot(p.x - px, p.y - py) < (p.r ?? clear))) continue
      out.push({ x: +px.toFixed(1), y: +py.toFixed(1), type: TYPES[Math.floor(noise(i, seed + 2) * TYPES.length)], twinkle: noise(i, seed + 3) < .18, delay: +(noise(i, seed + 4) * 6).toFixed(2) })
    }
  }
  return out
}

// A quadratic curve from a to b bowing sideways by `bend` of its length, as on the brand page.
export function curve(a, b, bend = .14) {
  const mx = (a.x + b.x) / 2 - (b.y - a.y) * bend, my = (a.y + b.y) / 2 + (b.x - a.x) * bend
  return `M${a.x} ${a.y} Q${mx.toFixed(1)} ${my.toFixed(1)} ${b.x} ${b.y}`
}
