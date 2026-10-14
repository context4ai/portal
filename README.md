# Context Portal

Source for [context4ai.org](https://context4ai.org): the Context for AI
homepage, the [documentation site](https://context4ai.org/context/) at
`/context/`, and the reverse proxy to the community
[Source Graph](https://github.com/context4ai/sourcegraph) at `/sourcegraph/`.

[Documentation](https://context4ai.org/context/) ·
[Contributing](CONTRIBUTING.md) ·
[Changelog](CHANGELOG.md)

## Built with Context

The repository root is a [Context](https://github.com/context4ai/context)
knowledge workspace. Its sources are the community repositories at pinned
revisions plus reviewed notes; Agents write the articles through the Context
workflow, every section keeps its evidence, and each release is recorded as a
version in [CHANGELOG.md](CHANGELOG.md). The English articles are translated
into Simplified Chinese, and one URL serves both languages.

[Agent Graph in Context](https://context4ai.org/context/pages/e0028d6618a071cc8e8f14135d034285.html)
describes how this site was produced. To write a site like it, start with
[Documentation Sites](https://context4ai.org/context/pages/089c3c9e0212ca13bb27c8e8d2fe6080.html)
and [Multilingual Sites](https://context4ai.org/context/pages/c1dc07fb24e9ea500fee02e9e275f4b7.html).

## Layout

| Path | Purpose |
| --- | --- |
| `src/index.ts` | Workspace configuration and the `context-kb` package with its site settings |
| `src/knowledge-map.yaml` | Navigation: sections and the articles bound to them |
| `sources/` | Registered repository sources and notes |
| `knowledge/`, `translations/` | Approved articles and their translations, written by the Context workflow |
| `src/site/` | Docs site presentation: `theme.json`, diagram styles, the footer, and the docs homepage under `components/home/` |
| `homepage/` | The `/` brand page (`/zh/` redirects to it): copy in `content/`, markup in `render.ts`, styles in `styles.css`, the retrieval field in `main.js` and `scenarios.js` |
| `deploy/nginx.conf.template` | Routing, caching and the Source Graph proxy |
| `Dockerfile`, `fly.toml` | Static image on nginx, deployed to Fly.io as `context4ai-portal` |
| `scripts/check-links.ts` | Internal link check over the combined output |

## Develop

Requires Node.js 22 and Bun 1.3.

```sh
bun install
bun run sources:restore   # pinned source repositories under .tmp/, once per clone
bunx context verify       # checks every cited source region
bun run build             # context build, then the homepage
bun run check:links
```

Only `context verify` reads the source checkouts; it reports cited regions that
changed or moved, and CI fails on them. The build does not need them, so the
image build skips the checkouts.

`bun run build:home` rebuilds only the homepage into `dist/home/`.

To preview the combined site with the production routing:

```sh
mkdir -p .tmp/www && cp -R dist/home/. .tmp/www/ && cp -R dist/context-site .tmp/www/context
docker run --rm -p 8088:8080 \
  -e SOURCEGRAPH_UPSTREAM=https://context4ai-sourcegraph.fly.dev -e NGINX_RESOLVER=1.1.1.1 \
  -v "$PWD/deploy/nginx.conf.template:/etc/nginx/templates/default.conf.template:ro" \
  -v "$PWD/.tmp/www:/usr/share/nginx/html:ro" nginx:1.29-alpine
```

Open <http://localhost:8088/>.

## Routes

| Path | Served by |
| --- | --- |
| `/`, `/zh/` | Homepage |
| `/context/` | Documentation site, one URL per page for every language; `/context` redirects here |
| `/sourcegraph/` | Proxied to Source Graph with its prefix, query, cookies and authorization intact |
| `/llms.txt` | Redirects to `/context/llms.txt` |
| `/healthz` | Health check |

The homepage, the docs site and Source Graph share the theme (`context-theme`, light
by default) and language (`context-locale`) preferences.

## Deploy

CI only verifies. Deploy manually:

```sh
fly deploy
```

The Source Graph upstream is reached over the private network at
`http://context4ai-sourcegraph.internal:8080`. Flycast is not used because the
Source Graph app forces HTTPS, which redirects plain proxied requests.

## Contributing

Report a wrong or unclear article with an Issue that links the page. Article
changes go through the Context workflow rather than direct edits to
`knowledge/`; see [CONTRIBUTING.md](CONTRIBUTING.md). Presentation changes to
the homepage and docs site are ordinary pull requests.

## License

[MIT](LICENSE)
