import { existsSync, statSync } from "node:fs";
import { join, normalize, relative } from "node:path";

// Serves the build output in place with the image layout: dist/home at /, dist/context-site at /context/.
// /sourcegraph/ is not proxied; use the nginx preview in README.md for the full routing.
const root = join(import.meta.dir, "..");
const mounts: [prefix: string, dir: string][] = [["/context/", join(root, "dist/context-site")], ["/", join(root, "dist/home")]];
const port = Number(process.env.PORT ?? 4180);

const missing = mounts.filter(([, dir]) => !existsSync(join(dir, "index.html")));
if (missing.length) {
  console.error(`Preview output missing: ${missing.map(([, dir]) => relative(root, dir)).join(", ")}. Run bun run build, then bun run preview.`);
  process.exit(1);
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
    const [, dir] = mounts.find(([prefix]) => path.startsWith(prefix))!;
    if (!existsSync(join(dir, "index.html"))) {
      return new Response("Preview is rebuilding or its output is missing. Wait for bun run build to finish, then reload. If no build is running, run bun run build.", {
        status: 503,
        headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store", "retry-after": "3" },
      });
    }
    const file = lookup(path);
    if (file) return new Response(Bun.file(file));
    const notFound = join(mounts.find(([p]) => path.startsWith(p))![1], "404.html");
    return new Response(existsSync(notFound) ? Bun.file(notFound) : "Not found", { status: 404, headers: { "content-type": "text/html; charset=utf-8" } });
  },
});

console.log(`preview: http://127.0.0.1:${server.port}/ (homepage), http://127.0.0.1:${server.port}/context/ (docs)`);
