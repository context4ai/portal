import { drawGlyph, GLYPH_HALF, quietZones, scatter } from "./glyphs.js";
import { intro } from "./intro.js";
import { SCENARIOS } from "./scenarios.js";

const THEME_KEY = "context-theme";
const LOCALE_KEY = "context-locale";
const root = document.documentElement;
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const lang = () => root.lang === "zh-CN" ? "zh" : "en";
const store = (key, value) => { try { localStorage.setItem(key, value); } catch {} };

// Both languages ship in the page; switching only changes which one is shown.
function applyLocale() {
  const l = lang();
  document.title = document.body.dataset[`title${l === "zh" ? "Zh" : "En"}`];
  document.querySelectorAll("[data-href-en]").forEach(el => { el.href = el.dataset[`href${l === "zh" ? "Zh" : "En"}`]; });
  document.querySelectorAll("[data-label-en]").forEach(el => {
    const label = el.dataset[`label${l === "zh" ? "Zh" : "En"}`];
    el.setAttribute("aria-label", label); el.title = label;
  });
}
applyLocale();
document.querySelector("[data-locale-toggle]")?.addEventListener("click", () => {
  root.lang = lang() === "zh" ? "en-US" : "zh-CN";
  store(LOCALE_KEY, root.lang);
  applyLocale();
});
document.querySelector("[data-theme-toggle]")?.addEventListener("click", () => {
  const apply = () => {
    const dark = root.classList.toggle("dark");
    document.querySelector('meta[name="theme-color"]').content = dark ? "#171716" : "#fcfcfb";
    store(THEME_KEY, dark ? "dark" : "light");
  };
  if (document.startViewTransition && !reduced) document.startViewTransition(apply);
  else apply();
});

const reveals = [...document.querySelectorAll(".reveal")];
setTimeout(() => reveals.forEach((el, i) => setTimeout(() => el.classList.add("on"), i * 90)), reduced ? 0 : 700);

const canvas = document.querySelector("[data-field]");
if (canvas) retrievalField(canvas);
intro(root, reduced);

// The background: a field of source marks. Questions trace to a knowledge page, then to the evidence behind it.
function retrievalField(canvas) {
  const ctx = canvas.getContext("2d");
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const mix = (a, b, t) => { const p = a.split(","), q = b.split(","); return p.map((v, i) => Math.round(+v + (q[i] - v) * t)).join(","); };
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const sec = () => performance.now() / 1000;
  const palette = () => root.classList.contains("dark")
    ? { ink: "250,250,249", live: "102,163,255", paper: "23,23,22" }
    : { ink: "10,10,8", live: "43,127,255", paper: "252,252,251" };
  const quiet = quietZones([".brand", ".top-tools", ".ctas", ".desc"]);
  const chrome = quietZones([".brand", ".top-tools"]);

  // Timing in seconds.
  const ASK_AUTO = 1.6, ASK_USER = .75;  // the question is shown alone before retrieval starts
  const MORPH = .3;                      // a reader's "?" widens into the question card, then the text appears
  const TRACE = 2.5;                     // question → knowledge → evidence
  const HOLD_AUTO = 1.8, HOLD_USER = 5;
  const USER_COOLDOWN = 4;               // after the reader's own scene or last gesture, before autoplay resumes
  const NEAR = 110;                      // a pointer within this distance keeps a finished scene on screen
  const PROBE_SHOW = .2, PROBE_FADE = 2; // a resting pointer fades in a "?", then asks
  const REPEL = 200;
  const BLOOM_R = 380, BLOOM_T = 3, BLOOM_DELAY = .5; // invisible ripple after a knowledge update: radius (px), lifetime and start delay (s)
  const TINT_HOLD = .6, TINT_FADE = .985;  // tinted icons stay blue briefly, then ease back
  const REVISED_HOLD = 4.3, REVISED_FADE = 1.9; // build time (s) when the revised node starts fading back, and how long that takes
  const NODE_GAP = 13;                   // lit icons reach ~9px from their centre; lines stop short of that
  const PROBE_R = 6.5;                   // about the size of a field icon
  const PROBE_OFFSET = -2.5;               // up and left, so the cursor tip seems to press it
  // One neutral tone for the retrieval path; only the question is blue.
  const NEUTRAL = .42;
  const PATH_GLYPH = .36;                // filled shapes read darker than antialiased text at the same alpha
  const LABEL_GAP = 8;
  const SANS = 'system-ui, -apple-system, "PingFang SC", sans-serif';

  let W, H, units, knowledge, t0, waves = [], blooms = [], runs = [], builds = [], hits = [], hover = null;
  let nextRun = 0, nextBuild = 0, focus = null, lastGesture = -99, lastUserRunGone = -99, recent = [];
  let copyC = { x: 0, y: 0 };
  const probe = { x: 0, y: 0, a: 0 };
  const fl = { context: 0, source: 0, agent: 0 };
  const mouse = { x: -999, y: -999, vx: 0, vy: 0, px: -999, py: -999, fired: true, movedAt: 0 };
  const flow = (x, y, t) => Math.sin(x * .006 + t * .33) * .5 + Math.sin(y * .008 - t * .26) * .5 + Math.sin((x * .7 - y) * .0046 + t * .18) * .6;
  const measureCopy = () => { const r = document.querySelector(".copy").getBoundingClientRect(); copyC = { x: r.left + r.width / 2, y: r.top + r.height / 2 }; };
  const calm = (x, y) => Math.exp(-(Math.pow((x - copyC.x) / 430, 2) + Math.pow((y - copyC.y) / 170, 2)));
  const labelOffset = (u, h = 20) => GLYPH_HALF[u.type] * (1 + Math.min(1, u.lit) * .7) + h / 2 + LABEL_GAP;

  function setup() {
    const dpr = Math.min(2, devicePixelRatio || 1);
    W = innerWidth; H = innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const G = W < 700 ? 30 : 36;
    units = [];
    for (const [jx, jy] of scatter(W, H, G * .84, 0)) {
      const r = Math.random();
      const type = r < .1 ? "knowledge" : r < .52 ? "code" : r < .72 ? "doc" : r < .86 ? "note" : "session";
      units.push({ type, rx: jx, ry: jy, x: jx, y: jy, vx: 0, vy: 0, glow: 0, lit: 0, merge: 0, tint: 0, tintHold: 0, pin: 0, pull: null, hold: null, hv: 0,
        born: Math.hypot(jx - W / 2, jy - H / 2) / Math.hypot(W, H) * 1.3 + Math.random() * .3, ph: Math.random() * 6.28 });
    }
    knowledge = [];
    for (const u of units) {
      if (u.type !== "knowledge") continue;
      if (knowledge.some(k => Math.hypot(k.rx - u.rx, k.ry - u.ry) < G * 2.6)) u.type = "code";
      else { knowledge.push(u); u.scene = SCENARIOS[knowledge.length % SCENARIOS.length]; }
    }
    waves = []; blooms = []; runs = []; builds = [];
    t0 = sec(); if (reduced) t0 -= 10;
    nextRun = 0; nextBuild = 0;
    measureCopy(); quiet.update(); chrome.update(); setTimeout(() => { measureCopy(); quiet.update(); chrome.update(); }, 1600);
  }

  // Poisson-disc sampling (Bridson): irregular, yet no two points closer than `gap`.
  function pickScenario() {
    let pool = SCENARIOS.filter(s => !recent.includes(s) && (!focus || s.area === focus));
    if (!pool.length) pool = SCENARIOS.filter(s => !focus || s.area === focus);
    const s = pool[Math.floor(Math.random() * pool.length)];
    recent = [s, ...recent].slice(0, 6);
    return s;
  }

  function startRun(ox, oy, user) {
    if (quiet.at(ox, oy, 90) > 0) return false;
    const busy = new Set(runs.flatMap(r => [r.k, ...r.ev.map(e => e.u)]));
    const others = user ? [] : runs;
    if (!user && (runs.length > 1 || others.some(r => Math.hypot(r.ox - ox, r.oy - oy) < 420 || Math.hypot(r.k.x - ox, r.k.y - oy) < 320))) return false;
    const ks = knowledge.filter(k => !busy.has(k) && calm(k.x, k.y) < .35 && quiet.at(k.x, k.y, 120) === 0 &&
      k.x > 90 && k.x < W - 140 && k.y > 70 && k.y < H - 60 &&
      !others.some(r => Math.hypot(r.k.x - k.x, r.k.y - k.y) < 420 || Math.hypot(r.ox - k.x, r.oy - k.y) < 320));
    if (!ks.length) return false;
    const dist = k => Math.hypot(k.x - ox, k.y - oy);
    const far = ks.filter(k => dist(k) > 170 && dist(k) < 480);
    const pool = (far.length ? far : ks).sort((a, b) => dist(a) - dist(b));
    const k = user ? pool[0] : pool[Math.floor(Math.random() * Math.min(4, pool.length))];
    const sc = pickScenario();
    const near = units.filter(u => u.type !== "knowledge" && !busy.has(u) && calm(u.x, u.y) < .4 && quiet.at(u.x, u.y, 80) === 0 &&
      Math.hypot(u.x - k.x, u.y - k.y) < 240 && Math.hypot(u.x - k.x, u.y - k.y) > 100 && Math.hypot(u.x - ox, u.y - oy) > 120);
    const ev = [];
    for (const item of sc.ev) {
      const taken = ev.map(e => e.u);
      const apart = u => taken.every(v => Math.hypot(u.x - v.x, u.y - v.y) > 110);
      const same = near.filter(u => u.type === item.type && apart(u)), any = near.filter(apart);
      const u = (same.length ? same : any)[Math.floor(Math.random() * (same.length || any.length))];
      if (u) { u.type = item.type; ev.push({ u, item }); }
    }
    if (user) {
      lastGesture = sec();
      for (const r of runs) { r.dismissed = true; r.endAt = Math.min(r.endAt ?? Infinity, sec()); }
    }
    k.scene = sc;
    runs.push({ ox, oy, k, ev, sc, start: sec(), user, ask: user ? ASK_USER : ASK_AUTO, endAt: null, alpha: user ? 1 : 0, sides: [] });
    return true;
  }

  function startBuild() {
    const busy = new Set(runs.map(r => r.k));
    const ks = knowledge.filter(k => !busy.has(k) && !builds.some(b => b.k === k) && Math.hypot(mouse.x - k.x, mouse.y - k.y) > REPEL && calm(k.x, k.y) < .3 && quiet.at(k.x, k.y, 120) === 0 && k.x > 120 && k.x < W - 160 &&
      !runs.some(r => Math.hypot(r.k.x - k.x, r.k.y - k.y) < 300 || Math.hypot(r.ox - k.x, r.oy - k.y) < 260));
    if (!ks.length) return false;
    const k = ks[Math.floor(Math.random() * ks.length)];
    const src = units.filter(u => u.type !== "knowledge" && !u.pull && !u.pin && Math.hypot(u.rx - k.rx, u.ry - k.ry) < 150)
      .sort(() => Math.random() - .5).slice(0, 6);
    src.forEach(u => u.pull = k);
    builds.push({ k, src, t: 0 });
    return true;
  }

  function curve(a, b, bend, u) {
    const mx = (a.x + b.x) / 2 - (b.y - a.y) * bend, my = (a.y + b.y) / 2 + (b.x - a.x) * bend;
    return [(1 - u) * (1 - u) * a.x + 2 * (1 - u) * u * mx + u * u * b.x, (1 - u) * (1 - u) * a.y + 2 * (1 - u) * u * my + u * u * b.y];
  }
  // Which side of `b` a label goes: away from the end of the curve arriving from `a` (-1 above, 1 below).
  function awaySide(a, b, bend) {
    const my = (a.y + b.y) / 2 + (b.x - a.x) * bend;
    return my > b.y ? -1 : 1;
  }
  // The box `tag` would draw, for keeping a scene's labels apart.
  function labelBox(x, cy, text, kind, link) {
    const S = kind === "q" ? { font: `500 12px ${SANS}`, h: 24, pad: 11 } : { font: `500 11px ${SANS}`, h: 20, pad: 7 };
    ctx.font = S.font;
    const w = S.pad * 2 + ctx.measureText(text).width + (link ? ctx.measureText(" ↗").width : 0), lx = clamp(x - w / 2, 8, W - w - 8);
    return { x0: lx, y0: cy - S.h / 2, x1: lx + w, y1: cy + S.h / 2 };
  }
  const overlaps = (a, b, pad = 4) => a.x0 < b.x1 + pad && b.x0 < a.x1 + pad && a.y0 < b.y1 + pad && b.y0 < a.y1 + pad;
  // Draws the curve from a to b, stopping `gapA` / `gapB` short of each end so it never crosses an icon.
  function strokeCurve(a, b, bend, grow, dash, color, now, gapA = 0, gapB = NODE_GAP) {
    if (grow <= 0) return;
    const N = 48;
    let t0 = 0, t1 = 1;
    for (let i = 0; i <= N; i++) { const [x, y] = curve(a, b, bend, i / N); if (Math.hypot(x - a.x, y - a.y) >= gapA) { t0 = i / N; break; } }
    for (let i = N; i >= 0; i--) { const [x, y] = curve(a, b, bend, i / N); if (Math.hypot(x - b.x, y - b.y) >= gapB) { t1 = i / N; break; } }
    if (t1 <= t0) return;
    const end = t0 + (t1 - t0) * grow;
    ctx.strokeStyle = color; ctx.lineWidth = 1;
    ctx.setLineDash(dash ? [3, 4] : []); ctx.lineDashOffset = -now * 16;
    ctx.beginPath();
    for (let i = 0; i <= 28; i++) { const [x, y] = curve(a, b, bend, t0 + (end - t0) * i / 28); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    ctx.stroke(); ctx.setLineDash([]);
    if (grow < 1) { const [x, y] = curve(a, b, bend, end); ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, 2.4, 0, 7); ctx.fill(); }
  }

  // Question: a blue pill centred on its origin. Knowledge and evidence: text with ↗; linked labels register a hit area.
  function tag(x, cy, text, a, C, opt = {}) {
    if (a <= .01) return;
    const kind = opt.kind || "k", link = opt.link, anchor = opt.anchor;
    const on = link && hover && hover.href === link && hover.anchor === anchor;
    if (anchor) anchor.hv += ((on ? 1 : 0) - anchor.hv) * .18;
    const hv = anchor ? anchor.hv : 0;
    const live = kind === "q" || opt.live;
    const rgb = live ? C.live : C.ink;
    const rest = g => `rgba(${rgb},${g * (1 - hv) * a})`, lit = g => `rgba(${rgb},${g * hv * a})`;
    const S = kind === "q" ? { font: `500 12px ${SANS}`, h: 24, pad: 11, r: 12 } : { font: `500 11px ${SANS}`, h: 20, pad: 7, r: 5 };
    ctx.font = S.font;
    const icon = link ? " ↗" : "";
    const tw = ctx.measureText(text).width, iw = icon ? ctx.measureText(icon).width : 0;
    const m = opt.morph === undefined ? 1 : ease(opt.morph), textA = opt.textA ?? 1;
    const h = m < 1 ? PROBE_R * 2 + (S.h - PROBE_R * 2) * m : S.h, r = m < 1 ? h / 2 : S.r;
    const w = m < 1 ? PROBE_R * 2 + (S.pad * 2 + tw + iw - PROBE_R * 2) * m : S.pad * 2 + tw + iw;
    const lx = clamp(x - w / 2, 8, W - w - 8), top = cy - h / 2;
    ctx.beginPath(); ctx.roundRect(lx, top, w, h, r);
    ctx.fillStyle = `rgba(${C.paper},${a})`; ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = rest(live ? .55 : NEUTRAL); ctx.stroke();
    if (hv > .01) { ctx.strokeStyle = lit(.85); ctx.stroke(); }
    const layer = (draw, g) => { ctx.fillStyle = rest(g); draw(); if (hv > .01) { ctx.fillStyle = lit(1); draw(); } };
    ctx.textBaseline = "middle";
    if (m < 1 && opt.morph < .4) drawMark(lx + w / 2, cy, a * (1 - opt.morph / .4), C);
    const tx = lx + S.pad;
    if (textA > .01) layer(() => ctx.fillText(text, tx, cy + .5), (kind === "q" ? .9 : live ? .8 : NEUTRAL) * textA);
    if (icon) layer(() => ctx.fillText(icon, tx + tw, cy + .5), NEUTRAL);
    ctx.textBaseline = "alphabetic";
    if (link && a > .5) {
      hits.push({ href: link, anchor, x0: Math.min(lx, anchor.x - 12), y0: Math.min(top, anchor.y - 12), x1: Math.max(lx + w, anchor.x + 12), y1: Math.max(top + h, anchor.y + 12) });
    }
  }
  function drawMark(x, y, a, C) {
    ctx.font = `600 9px ${SANS}`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillStyle = `rgba(${C.live},${.9 * a})`; ctx.fillText("?", x, y + .5);
    ctx.textAlign = "start"; ctx.textBaseline = "alphabetic";
  }
  function drawProbe(x, y, a, C) {
    ctx.beginPath(); ctx.arc(x, y, PROBE_R, 0, 7);
    ctx.fillStyle = `rgba(${C.paper},${a})`; ctx.fill();
    ctx.lineWidth = 1; ctx.strokeStyle = `rgba(${C.live},${.55 * a})`; ctx.stroke();
    drawMark(x, y, a, C);
  }
  const hitAt = (x, y, pad = 0) => hits.find(h => x >= h.x0 - pad && x <= h.x1 + pad && y >= h.y0 - pad && y <= h.y1 + pad) || null;
  const runNear = r => [{ x: r.ox, y: r.oy }, r.k, ...r.ev.map(e => e.u)].some(p => Math.hypot(p.x - mouse.px, p.y - mouse.py) < NEAR);

  function frame() {
    const now = sec(), t = now - t0, C = palette();
    ctx.clearRect(0, 0, W, H);
    // While the intro video plays, retrieval and knowledge updates stop at once and none start; the field keeps drifting.
    const hush = root.classList.contains("intro-on");
    if (hush && (runs.length || builds.length || blooms.length || waves.length)) {
      builds.forEach(b => b.src.forEach(s => { s.pull = null; }));
      runs = []; builds = []; blooms = []; waves = [];
      for (const u of units) u.lit = u.tint = u.merge = u.glow = 0;
      probe.a = 0; mouse.fired = true;
    }
    for (const k in fl) fl[k] += ((focus === k ? 1 : 0) - fl[k]) * .08;
    mouse.vx *= .85; mouse.vy *= .85;
    const mspeed = Math.hypot(mouse.vx, mouse.vy), mq = 1 - quiet.at(mouse.x, mouse.y);

    if (mouse.px > -999 && (mouse.px !== mouse.x || mouse.py !== mouse.y) && performance.now() - lastMove >= 50) sample(mouse.px, mouse.py, performance.now());
    hover = hitAt(mouse.px, mouse.py);
    canvas.style.cursor = hover ? "pointer" : "";
    hits = [];

    const userRun = runs.some(r => r.user);
    // Dwell: a blue "?" follows the resting pointer, then turns into the question card.
    const still = now - mouse.movedAt;
    const canAsk = !hush && !mouse.fired && !hover && mouse.x > 0 && calm(mouse.x, mouse.y) < .5 && quiet.at(mouse.x, mouse.y, 90) === 0 &&
      !runs.some(r => r.user && !r.dismissed && runNear(r));
    const px = mouse.x + PROBE_OFFSET, py = mouse.y + PROBE_OFFSET;
    if (probe.a <= 0) { probe.x = px; probe.y = py; } else { probe.x += (px - probe.x) * .35; probe.y += (py - probe.y) * .35; }
    probe.a = canAsk && still > PROBE_SHOW ? Math.max(probe.a, ease(clamp((still - PROBE_SHOW) / PROBE_FADE))) : clamp(probe.a - 1 / 6);
    if (canAsk && still > PROBE_SHOW + PROBE_FADE) { mouse.fired = true; if (startRun(probe.x, probe.y, true)) probe.a = 0; }
    for (let i = waves.length - 1; i >= 0; i--) { waves[i].r += 9; waves[i].a *= .975; if (waves[i].a < .02) waves.splice(i, 1); }
    for (let i = blooms.length - 1; i >= 0; i--) {
      const w = blooms[i]; w.t += 1 / 60;
      const p = clamp((w.t - BLOOM_DELAY) / BLOOM_T); w.r = BLOOM_R * (1 - Math.pow(1 - p, 3)); w.a = 1 - p;
      if (p >= 1) blooms.splice(i, 1);
    }

    // Autoplay only while the reader is not driving the scene; hovering an entry counts as an invitation.
    const autoOK = !hush && !reduced && !userRun && (focus || now - Math.max(lastGesture, lastUserRunGone) > USER_COOLDOWN);
    if (t > 1.6 && autoOK && now > nextRun) {
      const oy = Math.random() < .5 ? 90 + Math.random() * 140 : H - 90 - Math.random() * 140;
      if (startRun(Math.random() * W, oy, false)) nextRun = now + (4.2 - fl.context * 1.6) + Math.random() * 1.5;
    }
    // Knowledge updates run on their own clock, regardless of what the reader is doing.
    if (t > 3 && !hush && !reduced && now > nextBuild) nextBuild = now + (startBuild() ? (7 - fl.context * 2.5) + Math.random() * 2.5 : .5);

    for (const u of units) u.pin = 0;
    for (const r of runs) { r.k.pin = 1; r.ev.forEach(e => e.u.pin = 1); }
    for (const u of units) { if (u.pin && !u.hold) u.hold = { x: u.x, y: u.y }; else if (!u.pin) u.hold = null; }

    for (const u of units) {
      const appear = reduced ? 1 : clamp((t - u.born) / .5);
      if (appear <= 0) continue;
      const f = flow(u.rx, u.ry, now);
      let tx = u.rx + Math.cos(f * 2 + u.ph * .3) * 3, ty = u.ry + Math.sin(f * 1.7) * 3, spring = .07;
      if (u.pull) { tx = u.pull.x + (u.rx - u.pull.rx) * .18; ty = u.pull.y + (u.ry - u.pull.ry) * .18; spring = .03; }
      if (u.hold) { u.x = u.hold.x; u.y = u.hold.y; u.vx = u.vy = 0; }
      let ax = (tx - u.x) * spring, ay = (ty - u.y) * spring;
      if (!u.pin && !reduced) {
        const mx = u.x - mouse.x, my = u.y - mouse.y, md = Math.hypot(mx, my);
        if (md < REPEL) {
          const fall = Math.pow(1 - md / REPEL, 2) * mq;
          ax += mx / (md || 1) * fall * 2 + mouse.vx * fall * .08; ay += my / (md || 1) * fall * 2 + mouse.vy * fall * .08;
          u.glow = Math.max(u.glow, fall * Math.min(1, mspeed / 25) * .7);
        }
        for (const r of runs) { const dx = u.x - r.ox, dy = u.y - r.oy, d = Math.hypot(dx, dy); if (d < 34) { const k = (1 - d / 34) * 3 * Math.max(.3, r.alpha); ax += dx / (d || 1) * k; ay += dy / (d || 1) * k; } }
        for (const w of blooms) {
          if (u === w.k || w.t < BLOOM_DELAY) continue;
          const wd = Math.hypot(u.x - w.x, u.y - w.y), fr = Math.abs(wd - w.r);
          if (fr < 26) {
            const k = (1 - fr / 26) * w.a;
            ax += (u.x - w.x) / (wd || 1) * k * 1.6; ay += (u.y - w.y) / (wd || 1) * k * 1.6;
            u.glow = Math.max(u.glow, k * .5);
            const peak = k * (u.ph % 1 > .55 ? 1 : .45);
            if (peak > u.tint) u.tint = peak;
            u.tintHold = now + TINT_HOLD;
          }
        }
        for (const w of waves) { const wd = Math.hypot(u.x - w.x, u.y - w.y), fr = Math.abs(wd - w.r); if (fr < 40) { const k = (1 - fr / 40) * w.a; ax += (u.x - w.x) / (wd || 1) * k * 5; ay += (u.y - w.y) / (wd || 1) * k * 5; u.glow = Math.max(u.glow, k * .8); } }
      }
      if (!u.hold) { u.vx = (u.vx + ax) * .84; u.vy = (u.vy + ay) * .84; u.x += u.vx; u.y += u.vy; }
      u.glow *= .95; u.lit *= .97;
      if (now > u.tintHold) u.tint *= TINT_FADE;

      // Icons fade out around the copy and around the header brand and tools.
      const dim = (1 - .82 * calm(u.x, u.y)) * (1 - .85 * chrome.at(u.x, u.y, 72));
      const base = .17 * appear * dim * (.85 + .15 * Math.sin(now * 1.2 + u.ph));
      const interact = u.glow * .7 > u.lit;
      const alpha = !interact && u.lit > .15 ? base + (PATH_GLYPH - base) * Math.min(1, u.lit) : Math.max(base, u.glow * .7, u.lit * .7);
      const melt = 1 - u.merge;
      const scale = (1 + u.lit * .7 + (u.hold ? 0 : u.glow * .3)) * (1 - .45 * u.merge);
      u.merge *= .93;
      drawGlyph(ctx, u.type, u.x, u.y, scale, u.tint > .02 ? `rgba(${mix(C.ink, C.live, u.tint)},${Math.max(alpha, u.tint * .75) * melt})` : `rgba(${C.ink},${alpha * melt})`);
    }

    // Labels are drawn after every line so no line crosses a card.
    const labels = [];
    // Production: nearby sources are drawn into a knowledge unit, which turns blue and sends out a ripple.
    for (let i = builds.length - 1; i >= 0; i--) {
      const b = builds[i]; b.t += 1 / 60;
      const lineA = .3 * (b.t < 1.3 ? 1 : clamp(1 - (b.t - 1.3) / 1.4));
      b.src.forEach((s, j) => {
        if (b.t < 1.3) { s.glow = Math.max(s.glow, .35); s.merge = Math.max(s.merge, ease(clamp((b.t - .6) / .7)) * .9); }
        if (b.t > .1 && lineA > .01) strokeCurve(s, b.k, j % 2 ? -.16 : .16, ease(clamp((b.t - .1) / .9)), false, `rgba(${C.ink},${lineA})`, now, 8);
      });
      if (b.t > 1.3 && !b.released) {
        b.released = true; b.src.forEach(s => s.pull = null);
        blooms.push({ x: b.k.x, y: b.k.y, k: b.k, t: 0, r: 0, a: 1 });
      }
      if (b.released) {
        // The revised icon and its label stay blue together, then fade back as one.
        const out = b.t < REVISED_HOLD ? 1 : 1 - ease(clamp((b.t - REVISED_HOLD) / REVISED_FADE));
        b.k.tint = out; b.k.tintHold = now + 1; b.k.lit = Math.max(b.k.lit, out);
        const a = Math.min(clamp((b.t - 1.3) / .5), out);
        labels.push(() => tag(b.k.x, b.k.y - labelOffset(b.k), `${b.k.scene.k[lang()]} · ${lang() === "zh" ? "已修订" : "revised"}`, a, C, { kind: "k", live: true }));
      }
      if (b.t > REVISED_HOLD + REVISED_FADE) builds.splice(i, 1);
    }

    // Retrieval: question (held) → knowledge → evidence → original source.
    for (let i = runs.length - 1; i >= 0; i--) {
      const r = runs[i], e = now - r.start, rt = e - r.ask;
      const near = runNear(r);
      if (rt >= TRACE && r.endAt === null) r.endAt = now + (r.user ? HOLD_USER : HOLD_AUTO);
      if (r.endAt !== null && near && !r.dismissed && rt >= 0) r.endAt = Math.max(r.endAt, now + .6);
      const target = r.endAt !== null && now > r.endAt ? 0 : 1;
      r.alpha = clamp(r.alpha + (target ? 1 / 30 : -1 / 48));
      if (target === 0 && r.alpha <= 0) { if (r.user) lastUserRunGone = now; runs.splice(i, 1); continue; }
      const fade = r.alpha, o = { x: r.ox, y: r.oy }, line = `rgba(${C.ink},${NEUTRAL * fade})`;

      strokeCurve(o, r.k, .12, ease(clamp(rt / .7)), false, line, now);
      const kText = r.sc.k[lang()], kY = r.k.y + awaySide(o, r.k, .12) * labelOffset(r.k);
      const boxes = [labelBox(o.x, o.y, r.sc.q[lang()], "q"), labelBox(r.k.x, kY, kText, "k", true)];
      if (rt > .7) {
        r.k.lit = Math.max(r.k.lit, fade);
        const ka = clamp((rt - .7) / .3) * fade;
        labels.push(() => tag(r.k.x, kY, kText, ka, C, { kind: "k", link: r.sc.link, anchor: r.k }));
      }
      r.ev.forEach(({ u, item }, j) => {
        const st = 1.15 + j * .22, g = ease(clamp((rt - st) / .6));
        strokeCurve(r.k, u, j % 2 ? -.18 : .18, g, true, line, now, NODE_GAP);
        if (g >= 1) {
          u.lit = Math.max(u.lit, fade);
          if (r.sides[j] === undefined) {
            const prefer = awaySide(r.k, u, j % 2 ? -.18 : .18);
            const clash = side => boxes.some(b => overlaps(b, labelBox(u.x, u.y + side * labelOffset(u), item.label, "ev", true)));
            r.sides[j] = clash(prefer) && !clash(-prefer) ? -prefer : prefer;
          }
          const evY = u.y + r.sides[j] * labelOffset(u);
          boxes.push(labelBox(u.x, evY, item.label, "ev", true));
          const ea = clamp((rt - st - .6) / .25) * fade;
          labels.push(() => tag(u.x, evY, item.label, ea, C, { kind: "ev", link: item.href, anchor: u }));
        }
      });
      if (r.user) labels.push(() => tag(o.x, o.y, r.sc.q[lang()], fade, C, { kind: "q", morph: clamp(e / MORPH), textA: clamp((e - MORPH) / .2) }));
      else labels.push(() => tag(o.x, o.y, r.sc.q[lang()], clamp(e / .5) * fade, C, { kind: "q" }));
    }
    labels.forEach(draw => draw());
    if (probe.a > .01) drawProbe(probe.x, probe.y, probe.a, C);
    requestAnimationFrame(frame);
  }

  addEventListener("resize", setup);
  // Pointer samples are throttled to 50 ms; the trailing sample is taken once the pointer settles.
  let lastMove = 0;
  function sample(x, y, now) {
    const dt = now - lastMove, k = 16 / Math.min(Math.max(dt, 16), 120);
    mouse.vx = (x - (mouse.x > -999 ? mouse.x : x)) * k; mouse.vy = (y - (mouse.y > -999 ? mouse.y : y)) * k;
    if (Math.hypot(x - mouse.x, y - mouse.y) > 4) {
      mouse.movedAt = now / 1000; mouse.fired = false;
      if (quiet.at(x, y) === 0) lastGesture = now / 1000;
    }
    mouse.x = x; mouse.y = y; lastMove = now;
  }
  addEventListener("pointermove", e => {
    mouse.px = e.clientX; mouse.py = e.clientY;
    const now = performance.now();
    if (now - lastMove >= 50) sample(e.clientX, e.clientY, now);
  });
  document.addEventListener("pointerleave", () => { mouse.x = mouse.y = mouse.px = mouse.py = -999; });
  // A tap brings no pointermove first, so a press tests its own position; fingers get a wider target.
  // The link opens on the following click, which mobile browsers accept as a gesture for a new tab.
  let pressed = null;
  addEventListener("pointerdown", e => {
    pressed = null;
    if (root.classList.contains("intro-on") || e.target.closest("a,button,.brand,.top-tools")) return;
    pressed = hitAt(e.clientX, e.clientY, e.pointerType === "mouse" ? 0 : 12);
    if (pressed) return;
    if (quiet.at(e.clientX, e.clientY, 90) > 0) return;
    lastGesture = sec(); mouse.fired = true;
    waves.push({ x: e.clientX, y: e.clientY, r: 0, a: 1 });
    if (calm(e.clientX, e.clientY) < .5) startRun(e.clientX + PROBE_OFFSET, e.clientY + PROBE_OFFSET, true);
  });
  canvas.addEventListener("click", () => {
    if (pressed) window.open(pressed.href, "_blank", "noopener");
    pressed = null;
  });

  const descs = [...document.querySelectorAll("[data-desc]")];
  const showDesc = key => descs.forEach(d => d.classList.toggle("on", d.dataset.desc === key));
  document.querySelectorAll("[data-focus]").forEach(el => {
    const enter = () => { focus = el.dataset.focus; showDesc(focus); nextRun = Math.min(nextRun, sec() + .5); };
    const leave = () => { focus = null; showDesc(null); };
    el.addEventListener("pointerenter", enter); el.addEventListener("focus", enter);
    el.addEventListener("pointerleave", leave); el.addEventListener("blur", leave);
  });

  setup(); requestAnimationFrame(frame);
}
