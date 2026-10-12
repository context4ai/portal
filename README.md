# Context Portal

Source for [context4ai.org](https://context4ai.org): the homepage, the Context documentation site served at `/context/`, and the reverse proxy to the community Source Graph at `/sourcegraph/`.

The repository root is a [Context](https://github.com/context4ai/context) knowledge workspace. The documentation site is built from its approved knowledge; follow `AGENTS.md` for anything under `src/`, `sources/`, `knowledge/` and `translations/`.

## Layout

| Path | Purpose |
| --- | --- |
| `src/index.ts` | Workspace configuration and the `context-kb` package with its site settings |
| `src/site/` | Docs site presentation: `theme.json`, the footer, and the docs homepage in `HomeBanner.vue` with its sections, copy and icon field under `components/home/` |
| `homepage/` | The `/` brand page (`/zh/` redirects to it): copy in `content/`, markup in `render.ts`, styles in `styles.css`, the retrieval field in `main.js` and `scenarios.js`; icons come from `src/site/components/home/glyphs.js` |
| `deploy/nginx.conf.template` | Routing, caching and the Source Graph proxy |
| `Dockerfile`, `fly.toml` | Static image on nginx, deployed to Fly.io as `context4ai-portal` |
| `scripts/check-links.ts` | Internal link check over the combined output |

## Develop

Requires Node.js 22 and Bun 1.3.

```sh
bun install
bun run build         # context build, then the homepage
bun run check:links
```

`bun run build:home` rebuilds only the homepage into `dist/home/`.

To preview the combined site with the production routing:

```sh
mkdir -p .tmp/www && cp -R dist/home/. .tmp/www/ && cp -R dist/context-site .tmp/www/context
docker run --rm -p 8088:8080 \
  -e SOURCEGRAPH_UPSTREAM=https://context4ai-sourcegraph.fly.dev -e NGINX_RESOLVER=1.1.1.1 \
  -v "$PWD/deploy/nginx.conf.template:/etc/nginx/templates/default.conf.template:ro" \
  -v "$PWD/.tmp/www:/usr/share/nginx/html:ro" nginx:1.29-alpine
```

## Routes

| Path | Served by |
| --- | --- |
| `/`, `/zh/` | Homepage |
| `/context/` | Documentation site, one URL per page for every language; `/context` redirects here |
| `/sourcegraph/` | Proxied to Source Graph with its prefix, query, cookies and authorization intact |
| `/llms.txt` | Redirects to `/context/llms.txt` |
| `/healthz` | Health check |

The homepage and the docs site share the theme (`context-theme:context-kb:/context/`) and language (`context4ai-locale`) preferences.

## Deploy

CI only verifies. Deploy manually:

```sh
fly deploy
context package site-url context-kb https://context4ai.org/context/
```

The Source Graph upstream is reached over Flycast (`http://context4ai-sourcegraph.flycast`); allocate its private address once with `fly ips allocate-v6 --private -a context4ai-sourcegraph`.

## License

[MIT](LICENSE)
