---
title: Using a Package in Your Agent
description: Give your Agent a knowledge package to use, know what it does with
  the package when you ask questions, and follow citations back to the sources.
type: Guide
timestamp: 2026-10-28T03:53:56.231Z
---
# Using a Package in Your Agent

<!-- context:section id="goal" -->
A knowledge package is a plain folder of Markdown with a bundled query Skill, built from approved knowledge. It lets your Agent *use* the knowledge without the knowledge workspace that produced it — handy when you consume knowledge someone else maintains, or want answers in a project that has no workspace of its own.

This page is for people using a package. What a package contains and how it is built is in [Knowledge Packages](../outputs-and-sites/knowledge-packages.md).
<!-- /context:section -->

<!-- context:section id="share" -->

## Giving your Agent a package

A package can be used where it was built, from a global installation, or from any folder your Agent host can read. There are two simple ways to make it available:

- **Point the Agent at the folder** for the question at hand.
- **Install the package's query Skill** into your host's Skills directory, so the Agent can reach the package in later tasks too.

```text
Use the knowledge package in ./dist/billing-kb to answer questions in this
project. Install its query Skill for this host.
```

Every Context package ships the same `context-knowledge-query` Skill, so one installed copy serves all of them. It finds the packages it can reach: the package around it, a folder you name with `--root` or a collection with `--base`, directories listed in `CONTEXT_KNOWLEDGE_PACKAGES`, and packages recorded by your host's package manager when it supports them. After that, just ask your question — see [Asking Questions](asking-questions.md). You do not need to move files around.

### Before you share a package

If you build a package for others, tailor its search guide first: put your project's terminology, synonyms, common questions and preferred entry pages in `others/context/search-guide.md`, or explicitly accept the default when the package templates are reviewed. Leave the query Skill itself unchanged; Context keeps it identical across packages and replaces edited copies on build. See [Custom Output Templates](../outputs-and-sites/custom-output-templates.md).

<!-- /context:section -->

<!-- context:section id="query" -->

## What your Agent does with it

The bundled query Skill makes the Agent navigate before it searches. It first lists the packages it can read and, unless you named one, picks those whose index and search guide match the question. It then works out what kind of question you asked — a lookup, an explanation, a procedure, a rule, a relationship, a detail or a coverage question — opens the matching index and follows links to the likely page. It reads only the sections it needs and cites the page and heading it answered from; titles and descriptions help it choose where to look but never support a claim on their own.

When the indexes do not narrow things down, it searches the packages for exact names, error strings or several terms at once. Search results are only leads: the Agent opens the page before answering. When the packages lack evidence, it says so and tells you what it checked.

<!-- /context:section -->

<!-- context:section id="sources" -->

## Going back to the sources

Package pages keep their source citations. When a page's text does not settle a question, the query Skill follows its Sources entries itself: repository links at their recorded commit through the tools your host allows, document links at the current document. For code evidence read remotely, `/c4a:context-inspect-search` can follow those citations to the original documents and code at their recorded versions. See [Asking Questions](asking-questions.md) and [Reading Code Evidence Remotely](reading-code-evidence-remotely.md).

<!-- /context:section -->
