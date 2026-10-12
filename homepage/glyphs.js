// Icons are shared with the docs homepage; the quiet zones belong to the brand page only.
export { drawGlyph, GLYPH_HALF, scatter } from "../src/site/components/home/glyphs.js";

// Areas around page controls where the field neither reacts to the pointer nor starts scenes.
export function quietZones(selectors) {
  let rects = [];
  const update = () => { rects = selectors.flatMap(s => [...document.querySelectorAll(s)]).map(el => el.getBoundingClientRect()); };
  const at = (x, y, pad = 56) => {
    let v = 0;
    for (const r of rects) {
      const dx = Math.max(r.left - x, 0, x - r.right), dy = Math.max(r.top - y, 0, y - r.bottom);
      v = Math.max(v, 1 - Math.min(1, Math.hypot(dx, dy) / pad));
    }
    return v;
  };
  return { update, at };
}
