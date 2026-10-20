import { existsSync, statSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

// Mirrors the image layout: dist/home at /, dist/context-site at /context/.
const root = join(import.meta.dir, "..");
const mounts: [prefix: string, dir: string][] = [["/context/", join(root, "dist/context-site")], ["/", join(root, "dist/home")]];
// Served by nginx rules rather than files.
const routed = [/^\/sourcegraph\/?/u, /^\/llms\.txt$/u, /^\/healthz$/u, /^\/context$/u];

async function* htmlFiles(dir: string): AsyncGenerator<string> {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(path);
    else if (entry.name.endsWith(".html")) yield path;
  }
}

function resolve(url: string) {
  const path = decodeURIComponent(url.split(/[?#]/u)[0]);
  const [prefix, dir] = mounts.find(([p]) => path.startsWith(p))!;
  const local = join(dir, path.slice(prefix.length));
  const candidates = path.endsWith("/") ? [join(local, "index.html")] : [local, `${local}.html`, join(local, "index.html")];
  return candidates.some(file => existsSync(file) && statSync(file).isFile());
}

const broken: string[] = [];
let checked = 0;
for (const [, dir] of mounts) {
  if (!existsSync(dir)) { console.error(`missing build output: ${relative(root, dir)}`); process.exit(1); }
  for await (const file of htmlFiles(dir)) {
    const html = await readFile(file, "utf8");
    for (const [, url] of html.matchAll(/\s(?:href|src)="(\/[^"]*)"/gu)) {
      if (url.startsWith("//") || routed.some(rule => rule.test(url))) continue;
      checked++;
      if (!resolve(url)) broken.push(`${relative(root, file)} → ${url}`);
    }
  }
}

// Canvas scene links are created at runtime and are absent from the HTML.
const { SCENARIOS } = await import(join(root, "homepage/scenarios.js")) as { SCENARIOS: { link: string }[] };
for (const scene of SCENARIOS) {
  checked++;
  if (!resolve(scene.link)) broken.push(`homepage/scenarios.js → ${scene.link}`);
}

if (broken.length) {
  console.error(`broken links (${broken.length}):\n${[...new Set(broken)].join("\n")}`);
  process.exit(1);
}
console.log(`links ok: ${checked} internal references`);
