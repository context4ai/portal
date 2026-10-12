import type { HomeContent } from "./content/types";

export interface RenderInput { en: HomeContent; zh: HomeContent; assets: { css: string; js: string } }

export const THEME_KEY = "context-theme:context-kb:/context/";
export const LOCALE_KEY = "context4ai-locale";
const MARK = "0111010001100011000101110";

const esc = (value: string) => value.replace(/[&<>"']/gu, c => `&#${c.charCodeAt(0)};`);
/** Both languages are in the page; the boot script picks one before first paint. */
const both = (en: string, zh: string) => `<span data-l="en">${esc(en)}</span><span data-l="zh" lang="zh-CN">${esc(zh)}</span>`;

function mark(size = 22) {
  const dots = [...MARK].map((bit, i) => {
    const x = (i % 5) * 4.8 + 2.4, y = Math.floor(i / 5) * 4.8 + 2.4;
    return i === 24 ? "" : `<circle cx="${x}" cy="${y}" r="1.35" opacity="${bit === "1" ? 1 : 0.22}"/>`;
  }).join("");
  return `<svg class="mark" width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true"><g fill="currentColor">${dots}</g><circle class="mark-live" cx="21.6" cy="21.6" r="1.35"/></svg>`;
}

const icon = {
  github: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>',
  sun: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  moon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z"/></svg>',
};

function header(en: HomeContent, zh: HomeContent) {
  return `<header class="top">
  <a class="brand" href="/" aria-label="Context for AI">${mark()}<span>Context for AI</span></a>
  <nav class="top-tools" aria-label="Site">
    <a class="tool" href="/context/llms.txt">${esc(en.header.llms)}</a>
    <button class="tool tool-icon" type="button" data-theme-toggle data-label-en="${esc(en.header.theme)}" data-label-zh="${esc(zh.header.theme)}"><span class="i-sun">${icon.sun}</span><span class="i-moon">${icon.moon}</span></button>
    <a class="tool tool-icon" href="https://github.com/context4ai" target="_blank" rel="noopener" aria-label="GitHub" title="GitHub">${icon.github}</a>
    <button class="tool" type="button" data-locale-toggle data-label-en="${esc(en.header.switchTitle)}" data-label-zh="${esc(zh.header.switchTitle)}">${both(en.header.switchLabel, zh.header.switchLabel)}</button>
  </nav>
</header>`;
}

function stage(en: HomeContent, zh: HomeContent) {
  const entries = en.entries.map((e, i) => {
    const z = zh.entries[i];
    return `<a class="btn${e.primary ? " btn-main" : ""}" href="${e.href}" data-href-en="${e.href}" data-href-zh="${z.href}" data-focus="${e.area}" aria-describedby="desc-${e.area}">${esc(e.label)}${e.primary ? ' <span aria-hidden="true">→</span>' : ""}</a>`;
  }).join("\n      ");
  const descs = en.entries.map((e, i) => `<span id="desc-${e.area}" data-desc="${e.area}">${both(e.description, zh.entries[i].description)}</span>`).join("\n      ");
  return `<main class="stage" id="main">
  <div class="copy">
    <h1 class="name reveal">Context for AI</h1>
    <p class="slogan reveal">${both(en.slogan, zh.slogan)}</p>
    <div class="ctas reveal">
      ${entries}
    </div>
    <div class="desc" aria-live="polite">
      ${descs}
    </div>
  </div>
</main>`;
}

function bootScript(en: HomeContent, zh: HomeContent) {
  const meta = { "en-US": en.meta, "zh-CN": zh.meta };
  return `(function(){var d=document.documentElement,t=null,l=null;try{t=localStorage.getItem(${JSON.stringify(THEME_KEY)});l=localStorage.getItem(${JSON.stringify(LOCALE_KEY)})}catch(e){}
if(t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches))d.classList.add("dark");
if(l!=="zh-CN"&&l!=="en-US")l=(navigator.languages||[navigator.language]).some(function(x){return /^zh/i.test(x)})?"zh-CN":"en-US";
d.lang=l;document.title=${JSON.stringify(meta)}[l].title;})();`;
}

export function renderHome({ en, zh, assets }: RenderInput) {
  return `<!doctype html>
<html lang="en-US">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(en.meta.title)}</title>
<meta name="description" content="${esc(en.meta.description)}">
<meta name="theme-color" content="#fcfcfb" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#171716" media="(prefers-color-scheme: dark)">
<link rel="canonical" href="https://context4ai.org/">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(en.meta.title)}">
<meta property="og:description" content="${esc(en.meta.description)}">
<meta property="og:url" content="https://context4ai.org/">
<script>${bootScript(en, zh)}</script>
<link rel="stylesheet" href="${assets.css}">
<script type="module" src="${assets.js}"></script>
</head>
<body data-title-en="${esc(en.meta.title)}" data-title-zh="${esc(zh.meta.title)}">
<a class="skip" href="#main">${both(en.header.skip, zh.header.skip)}</a>
<canvas class="field" data-field aria-hidden="true"></canvas>
${header(en, zh)}
${stage(en, zh)}
</body>
</html>
`;
}

/** The former Chinese address: remember the choice and continue to the single homepage. */
export function renderZhRedirect() {
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><title>Context for AI</title><link rel="canonical" href="https://context4ai.org/">
<script>try{localStorage.setItem(${JSON.stringify(LOCALE_KEY)},"zh-CN")}catch(e){}location.replace("/"+location.hash)</script>
<meta http-equiv="refresh" content="0; url=/"></head><body><a href="/">Context for AI</a></body></html>
`;
}

/** 32×32 PNG of the mark on a light tile, wrapped in an ICO container for `/favicon.ico`. */
export function faviconIco(deflate: (data: Uint8Array) => Uint8Array) {
  const size = 32, px = new Uint8Array(size * size * 4);
  const paint = (cx: number, cy: number, r: number, rgb: number[], alpha = 255) => {
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
      const d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy);
      const cover = Math.max(0, Math.min(1, r + 0.5 - d));
      if (!cover) continue;
      const i = (y * size + x) * 4, a = (cover * alpha) / 255, keep = 1 - a;
      for (let c = 0; c < 3; c++) px[i + c] = Math.round(rgb[c] * a + px[i + c] * keep);
      px[i + 3] = Math.max(px[i + 3], Math.round(cover * 255));
    }
  };
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const dx = Math.max(0, Math.abs(x + 0.5 - 16) - 10), dy = Math.max(0, Math.abs(y + 0.5 - 16) - 10);
    if (Math.hypot(dx, dy) <= 6) px.set([252, 252, 251, 255], (y * size + x) * 4);
  }
  [...MARK].forEach((bit, i) => {
    if (i === 24) return;
    const x = 6.4 + (i % 5) * 4.8, y = 6.4 + Math.floor(i / 5) * 4.8;
    paint(x, y, 1.5, [10, 10, 8], bit === "1" ? 255 : 56);
  });
  paint(6.4 + 4 * 4.8, 6.4 + 4 * 4.8, 1.6, [43, 127, 255]);

  const crcTable = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
  const crc = (bytes: Uint8Array) => { let c = 0xffffffff; for (const b of bytes) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  const chunk = (type: string, data: Uint8Array) => {
    const body = new Uint8Array(4 + data.length); body.set(new TextEncoder().encode(type)); body.set(data, 4);
    const out = new Uint8Array(12 + data.length), view = new DataView(out.buffer);
    view.setUint32(0, data.length); out.set(body, 4); view.setUint32(8 + data.length, crc(body));
    return out;
  };
  const header = new Uint8Array(13), hv = new DataView(header.buffer);
  hv.setUint32(0, size); hv.setUint32(4, size); header.set([8, 6, 0, 0, 0], 8);
  const raw = new Uint8Array(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) raw.set(px.subarray(y * size * 4, (y + 1) * size * 4), y * (size * 4 + 1) + 1);
  const png = concat([new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]), chunk("IHDR", header), chunk("IDAT", deflate(raw)), chunk("IEND", new Uint8Array())]);
  const ico = new Uint8Array(22), iv = new DataView(ico.buffer);
  iv.setUint16(2, 1, true); iv.setUint16(4, 1, true);
  ico.set([size, size, 0, 0], 6); iv.setUint16(10, 1, true); iv.setUint16(12, 32, true);
  iv.setUint32(14, png.length, true); iv.setUint32(18, 22, true);
  return concat([ico, png]);
}

function concat(parts: Uint8Array[]) {
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let offset = 0;
  for (const part of parts) { out.set(part, offset); offset += part.length; }
  return out;
}

export function faviconSvg() {
  return mark(24).replace('class="mark"', 'xmlns="http://www.w3.org/2000/svg"').replace('class="mark-live"', 'fill="#2b7fff"')
    .replace('fill="currentColor"', 'fill="#0a0a08"');
}
