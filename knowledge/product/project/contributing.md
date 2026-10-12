---
title: Contributing
type: Wiki
description: How to propose, build, verify and submit a change to Context or
  Agent Graph, and where documentation fixes belong.
timestamp: 2026-10-12T20:24:32.970Z
---
# Contributing

<!-- context:section id="overview" -->

Context and Agent Graph are developed in the open on GitHub, in [context4ai/context](https://github.com/context4ai/context) and [context4ai/agent-graph](https://github.com/context4ai/agent-graph). Both welcome bug reports, documentation, tests and implementation changes. Common ways in:

- **Report a defect** with a minimal, sanitized reproduction through the issue templates.
- **Improve the documentation.** This site is built from [context4ai/portal](https://github.com/context4ai/portal); package references live in each project's repository.
- **Share an Indexer** that teaches Context to read a new kind of source; see [Creating an Indexer](../../sop/custom-indexers/creating-an-indexer.md) and [Community Indexers](../../sop/custom-indexers/community-indexers.md).
- **Add a language extractor** under Context's `packages/extract-*`, following the `@c4a/extract` protocol.
- **Propose an Agent Graph protocol change or example.** Newcomers start with [Why Graph Engineering](../../architecture/agent-graph/why-graph-engineering.md), [Authoring Graphs](../../sop/agent-graph/authoring-graphs.md) and the repository's `getting-started` example.

The two projects follow the same rhythm:

1. Search existing Issues and Discussions first.
2. Discuss anything that changes a public contract before writing it. Small documentation fixes and isolated bug fixes can go straight to a pull request.
3. Develop with Bun, keep runtime code working on Node.js 20 or later, and run the project's verification command.
4. Open a focused pull request that explains the problem, the behavior you chose, the compatibility impact and how you verified it.

Never report a security vulnerability in a public Issue; see [Support](support.md) for private reporting.

| | Context | Agent Graph |
| --- | --- | --- |
| Discuss first | Workspace protocols, lifecycle ordering, public CLI JSON, package layout | Protocol changes, new public fields, compatibility behavior |
| Verification | `bun run verify:full` | `bun run verify` |
| Developer guide | `DEVELOPMENT.md` | `DEVELOPMENT.md` |

<!-- /context:section -->

<!-- context:section id="context" -->

## Context

```bash
git clone https://github.com/context4ai/context.git
cd context
bun install
bun run build
bun run verify
```

`bun run verify` runs type checking, lint and the default tests; `verify:full` adds the full-only CLI tests and checks of the built Node artifacts, so build first. `DEVELOPMENT.md` in the repository covers the repository layout, running a local CLI and plugin, verification scopes and releases.

A pull request is ready for review when:

- `bun run verify:full` passes;
- lifecycle behavior comes with Route and recovery coverage;
- the CLI does not make semantic decisions that belong to the Agent or the user;
- tests use neutral fixtures rather than business-specific content;
- English and Simplified Chinese user documentation still describe the same behavior;
- user-visible changes have an entry under the next version in `CHANGELOG.md`;
- no generated `dist/`, workspace data, snapshots, credentials or private source material is committed.

Write commit messages as English conventional commits that name the target version, for example `fix(v0.7.62): exempt More menu targets from knowledge map coverage`. Maintainers release by creating a GitHub Release whose tag matches the package version; the publish workflow verifies and publishes every package through npm Trusted Publishing.

<!-- /context:section -->

<!-- context:section id="agent-graph" -->
## Agent Graph

```bash
git clone https://github.com/context4ai/agent-graph.git
cd agent-graph
bun install
bun run verify
```

`bun run verify` runs type checking, lint, the tests and the build. Use GitHub Discussions for design or adoption questions and ideas that are not yet actionable. `DEVELOPMENT.md` describes the source layout, protocol rules, testing principles and the release audit.

A pull request is ready for review when:

- `bun run verify` passes;
- public TypeScript types and JSON Schemas agree;
- protocol behavior has unit or integration coverage, and at least one published example covers new protocol behavior;
- English and Simplified Chinese documentation still describe the same behavior;
- runtime code uses standard Node.js APIs rather than Bun-only APIs;
- no generated `dist/`, `.tmp/`, coverage or package archive files are committed.

Write commit messages as English conventional commits, with the project version when practical:

```text
feat(v0.3.0): add route inspection metadata
fix(v0.2.2): reject stale evaluation revisions
docs(v0.3.0): clarify provider adoption paths
```

Maintainers may ask for changes that preserve protocol portability, deterministic behavior or documentation parity. To test a Graph change end to end, see [Testing and Publishing](../../sop/agent-graph/testing-and-publishing.md).
<!-- /context:section -->

<!-- context:section id="docs" -->
## Fixing this documentation

Every article on this site ends with its sources, linked to the exact repository revision it was written from. If an article is wrong because the documentation or code it cites is wrong, fix it in that repository. Both projects keep English and Simplified Chinese documentation equivalent, so update both languages in the same pull request.

Participation in both projects is governed by their Code of Conduct.
<!-- /context:section -->
