// Small line icons shared by the brand page and the docs homepage.
// Path data from Lucide (ISC License, https://lucide.dev).
export const ICONS = {
  knowledge: ["M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z", "M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"],
  code: ["m16 18 6-6-6-6", "m8 6-6 6 6 6"],
  doc: ["M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", "M14 2v4a2 2 0 0 0 2 2h4"],
  note: ["m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"],
  session: ["M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"],
  inbox: ["M22 12h-6l-2 3h-4l-2-3H2", "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"],
  pen: ["M12 20h9", "M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"],
  check: ["M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0", "m9 12 2 2 4-4"],
  package: ["m7.5 4.27 9 5.15", "M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z", "m3.3 7 8.7 5 8.7-5", "M12 22V12"],
  search: ["M3 11a8 8 0 1 0 16 0a8 8 0 1 0-16 0", "m21 21-4.3-4.3"],
  terminal: ["m4 17 6-6-6-6", "M12 19h8"],
  bot: ["M12 8V4H8", "M6 8h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z", "M2 14h2", "M20 14h2", "M15 13v2", "M9 13v2"],
  refresh: ["M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", "M21 3v5h-5", "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", "M8 16H3v5"],
  globe: ["M2 12a10 10 0 1 0 20 0a10 10 0 1 0-20 0", "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20", "M2 12h20"],
  map: ["M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z", "M15 5.764v15", "M9 3.236v15"],
  lightbulb: ["M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5", "M9 18h6", "M10 22h4"],
  upload: ["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", "m17 8-5-5-5 5", "M12 3v12"],
  archive: ["M3 3h18v5H3z", "M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8", "M10 12h4"],
};
const SIZE = 10.5;  // rendered box at scale 1; icons sit on a 24-unit grid
// Path2D does not exist during static rendering, so paths are built on first draw.
let paths = null;

// Half of each icon's drawn height at scale 1, for placing labels a fixed gap away.
export const GLYPH_HALF = { knowledge: 3.9, code: 2.6, doc: 4.4, note: 3.9, session: 3.9 };

export function drawGlyph(ctx, type, x, y, s, color) {
  paths ??= Object.fromEntries(Object.entries(ICONS).map(([t, ds]) => [t, ds.map(d => new Path2D(d))]));
  const box = SIZE * s, k = box / 24;
  ctx.save();
  ctx.translate(x - box / 2, y - box / 2); ctx.scale(k, k);
  ctx.strokeStyle = color; ctx.lineWidth = 1.1 * Math.min(1.4, s) / k; ctx.lineCap = ctx.lineJoin = "round";
  for (const p of paths[type]) ctx.stroke(p);
  ctx.restore();
}

// Approximate rendered width of a label pill at 11px, matching the brand page's tags.
export function pillWidth(text, kind = "k") {
  let w = 0;
  for (const c of text) w += /[\u2e80-\ufaff\uff00-\uffef]/.test(c) ? 11 : 6.3;
  return w + (kind === "q" ? 22 : 14);
}

// Deterministic 0..1 noise, so server-rendered and hydrated SVG agree.
export function noise(i, seed = 1) {
  let x = Math.imul(i ^ seed, 2654435761) ^ (seed >>> 13);
  x = Math.imul(x ^ (x >>> 15), 2246822519);
  x ^= x >>> 13;
  return (x >>> 0) / 4294967296;
}

// Bridson Poisson-disc sampling: irregular spacing that never crowds.
export function scatter(W, H, r, pad = 14) {
  const cell = r / Math.SQRT2, cols = Math.ceil(W / cell) + 1, rows = Math.ceil(H / cell) + 1;
  const grid = new Array(cols * rows).fill(-1), pts = [], active = [];
  const add = (x, y) => { pts.push([x, y]); active.push(pts.length - 1); grid[Math.floor(y / cell) * cols + Math.floor(x / cell)] = pts.length - 1; };
  add(pad + Math.random() * (W - pad * 2), pad + Math.random() * (H - pad * 2));
  while (active.length) {
    const i = Math.floor(Math.random() * active.length), [px, py] = pts[active[i]];
    let placed = false;
    for (let n = 0; n < 24; n++) {
      const a = Math.random() * Math.PI * 2, d = r * (1 + Math.random());
      const x = px + Math.cos(a) * d, y = py + Math.sin(a) * d;
      if (x < pad || y < pad || x > W - pad || y > H - pad) continue;
      const gx = Math.floor(x / cell), gy = Math.floor(y / cell);
      let ok = true;
      for (let yy = Math.max(0, gy - 2); ok && yy <= Math.min(rows - 1, gy + 2); yy++)
        for (let xx = Math.max(0, gx - 2); xx <= Math.min(cols - 1, gx + 2); xx++) {
          const j = grid[yy * cols + xx];
          if (j >= 0 && Math.hypot(pts[j][0] - x, pts[j][1] - y) < r) { ok = false; break; }
        }
      if (ok) { add(x, y); placed = true; break; }
    }
    if (!placed) active.splice(i, 1);
  }
  return pts;
}
