---
title: Using Packages in Agents
description: What a knowledge package contains, how an Agent navigates it with
  the bundled query Skill and search script, and how to make it available to
  another Agent.
type: Guide
timestamp: 2026-10-12T16:07:52.846Z
---
# Using Packages in Agents

<!-- context:section id="goal" -->
`context build` turns approved knowledge into a **knowledge package** under `dist/<name>/`: a plain folder of Markdown that any Agent can read, with a bundled Skill that teaches it how. The package is what you hand to Agents that should *use* the knowledge without the Context knowledge workspace that produced it.
<!-- /context:section -->

<!-- context:section id="layout" -->
## What is inside

```text
dist/<package>/
├── AGENTS.md                       # how to use this package
├── skills/knowledge-query/         # bundled query Skill and search script
├── wikis/index.md                  # entities and relationships
├── guides/                         # architecture, procedures, FAQs, decisions
├── rules/                          # standards, constraints, test scenarios
├── context-build-inventory.json    # package coverage
├── context-site-map.json           # page → website URL
└── others/assets/                  # images and files the pages use
```

Approved collections map to roots: `codeindex`, `business` and `product` go to `wikis/`; `architecture`, `sop`, `faq`, `decision` and `incident` go to `guides/`; `standards` and `test` go to `rules/`. A root that was not selected is simply absent.
<!-- /context:section -->

<!-- context:section id="query" -->
## How the query Skill reads it

The bundled `knowledge-query` Skill makes the Agent navigate before it searches:

1. Classify the request: lookup, explanation, procedure, rule, relationship, detail or coverage.
2. Open the matching root index and follow links to a likely page.
3. Read only the needed sections; titles and descriptions select scope but do not support claims.
4. Answer from visible section content and cite the page and heading.
5. When the package lacks evidence, report the gap and what was checked.

When indexes do not narrow the scope, it searches: `rg` for an exact name or error string, and for several terms or non-English phrases the bundled BM25 script:

```bash
node <knowledge-query Skill directory>/scripts/search.mjs --query '<terms>' --limit 8
```

Hits are leads; the Agent opens the page before answering.
<!-- /context:section -->

<!-- context:section id="share" -->
## Making it available

A package can be used where it was built, from a global installation, or from any directory your Agent host can read. Point the Agent at the folder, or install `skills/knowledge-query` into the host's skills directory; if the Skill ends up outside the package tree, the search script takes `--root <package directory>`, or `--base <package collection>` to find the package by its inventory name.

Before publishing a package, replace or edit the generic query Skill template with your project's terminology, common intents and preferred entry pages — or explicitly accept the default during package-template review.
<!-- /context:section -->

<!-- context:section id="sources" -->
## Going back to the sources

Package pages carry exported source attributions. When the package is not enough, `/c4a:context-inspect-search` can trace those attributions to the original documents and code at their recorded versions. See [Asking Questions](asking-questions.md) and [Reading Code Evidence Remotely](reading-code-evidence-remotely.md).
<!-- /context:section -->
