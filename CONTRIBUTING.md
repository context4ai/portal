# Contributing to the Context Portal

Thank you for helping improve context4ai.org.

## Report a problem in an article

Open an [Issue](https://github.com/context4ai/portal/issues/new) with the page
URL, the section, and what is wrong or unclear. If the article is wrong because
the product behaves differently, link the source file or the issue in the
product repository ([Context](https://github.com/context4ai/context),
[Agent Graph](https://github.com/context4ai/agent-graph) or
[Source Graph](https://github.com/context4ai/sourcegraph)).

## Change articles

Articles under `knowledge/` and `translations/` are produced by the
[Context](https://github.com/context4ai/context) workflow and keep evidence for
every section. Do not edit them, `sources/` or `dist/` by hand; the next build
or verification would reject or overwrite the change. Instead:

1. Install Context (`npm install -g @c4a/context-cli@latest && context plugin install`).
2. In this repository, ask your Agent with `/c4a:context` to revise the page or
   to update the sources, for example after a product release.
3. Review the result, record a version, and run `bun run build`.
4. Open a pull request that includes the generated workspace changes and the
   `CHANGELOG.md` entry.

[Revising a Page](https://context4ai.org/context/pages/b75357332a63899630e3d8b2fa0346b1.html)
and [Updating Knowledge](https://context4ai.org/context/pages/d44b1e3f9b763a0bea2081fd73781a64.html)
describe these steps. Follow `AGENTS.md` for writing and diagram style.

## Change the homepage or site presentation

The homepage (`homepage/`), the docs homepage and theme (`src/site/`) and the
deployment files are ordinary source. Before opening a pull request, run:

```sh
bun install
bun run build
bun run typecheck
bun run check:links
```

Keep the English and Chinese copy in step, and check both light and dark themes.

## Commit messages

Use an English conventional commit, for example `feat(site): ...`,
`fix(home): ...` or `docs: ...`.

## Conduct

Participation is governed by the [Code of Conduct](CODE_OF_CONDUCT.md).
Report security issues privately through
[private vulnerability reporting](https://github.com/context4ai/portal/security/advisories/new).
