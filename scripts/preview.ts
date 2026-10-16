import { existsSync, statSync } from "node:fs";
import { join, normalize, relative } from "node:path";

// Serves the build output in place with the image layout: dist/home at /, dist/context-site at /context/.
// /sourcegraph/ is not proxied; use the nginx preview in README.md for the full routing.
const root = join(import.meta.dir, "..");
const mounts: [prefix: string, dir: string][] = [["/context/", join(root, "dist/context-site")], ["/", join(root, "dist/home")]];
const port = Number(process.env.PORT ?? 4180);

for (const [prefix, dir] of mounts) {
  if (!existsSync(dir)) console.warn(`${relative(root, dir)} is missing; ${prefix} returns 404 until it is built`);
}

function lookup(path: string) {
  const [prefix, dir] = mounts.find(([p]) => path.startsWith(p))!;
  const local = normalize(join(dir, path.slice(prefix.length)));
  if (!local.startsWith(dir)) return undefined;
  const candidates = path.endsWith("/") ? [join(local, "index.html")] : [local, `${local}.html`, join(local, "index.html")];
  return candidates.find(file => existsSync(file) && statSync(file).isFile());
}

const server = Bun.serve({
  port,
  hostname: "127.0.0.1",
  fetch(request) {
    const path = decodeURIComponent(new URL(request.url).pathname);
    if (path === "/context") return Response.redirect("/context/", 301);
    if (path === "/llms.txt") return Response.redirect("/context/llms.txt", 302);
    const file = lookup(path);
    if (file) return new Response(Bun.file(file));
    const notFound = join(mounts.find(([p]) => path.startsWith(p))![1], "404.html");
    return new Response(existsSync(notFound) ? Bun.file(notFound) : "Not found", { status: 404, headers: { "content-type": "text/html; charset=utf-8" } });
  },
});

console.log(`preview: http://127.0.0.1:${server.port}/ (homepage), http://127.0.0.1:${server.port}/context/ (docs)`);
