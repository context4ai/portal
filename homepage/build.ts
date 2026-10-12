import { mkdir, rm, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { deflateSync } from "node:zlib";
import en from "./content/en";
import zh from "./content/zh";
import { faviconIco, faviconSvg, renderHome, renderZhRedirect } from "./render";

const here = import.meta.dir;
const out = join(here, "../dist/home");

await rm(out, { recursive: true, force: true });
await mkdir(join(out, "zh"), { recursive: true });

const bundle = await Bun.build({
  entrypoints: [join(here, "main.js"), join(here, "styles.css")],
  outdir: join(out, "assets"),
  naming: "[name].[hash].[ext]",
  minify: true,
  target: "browser",
});
if (!bundle.success) {
  for (const log of bundle.logs) console.error(log);
  process.exit(1);
}
const asset = (ext: string) => `/assets/${basename(bundle.outputs.find(o => o.path.endsWith(ext))!.path)}`;
const assets = { css: asset(".css"), js: asset(".js") };

await writeFile(join(out, "index.html"), renderHome({ en, zh, assets }));
await writeFile(join(out, "zh/index.html"), renderZhRedirect());
await writeFile(join(out, "favicon.svg"), faviconSvg());
await writeFile(join(out, "favicon.ico"), faviconIco(data => deflateSync(data)));
await writeFile(join(out, "robots.txt"), "User-agent: *\nAllow: /\n");
await writeFile(join(out, "404.html"), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Not found · Context for AI</title><link rel="icon" href="/favicon.svg"><link rel="stylesheet" href="${assets.css}"></head>
<body><main class="stage"><div class="copy"><h1 class="name">404</h1><p class="slogan">This page does not exist. · 页面不存在。</p>
<div class="ctas"><a class="btn btn-main" href="/">Home · 首页</a><a class="btn" href="/context/">Docs · 文档</a></div></div></main></body></html>\n`);

console.log("homepage: dist/home");
