---
title: Code Extraction
description: The parser packages behind the Code Indexer, what structural facts
  each one yields, and how Indexers use them.
type: Guide
timestamp: 2026-10-12T15:08:14.058Z
---
# Code Extraction

<!-- context:section id="role" -->
## Parsers produce facts, not knowledge

Parser packages read code and interface definitions and emit deterministic structural facts: symbols, source spans, imports and exports, routes, contracts. They never create Candidates, write `knowledge/` or control Review. The selected Indexer interprets those facts together with the readable source and writes reader-oriented articles.

```mermaid
flowchart LR
  code["Pinned module"] --> parsers["Parsers"]
  parsers --> facts["Structural facts"]
  facts --> indexer["Code Indexer"]
  code --> indexer
  indexer --> art["Articles"]
```
<!-- /context:section -->

<!-- context:section id="packages" -->
## Available parsers

| Package | Structural facts |
| --- | --- |
| `@c4a/extract-ts` | TypeScript/JavaScript symbols, exports, imports, calls and React Router routes |
| `@c4a/extract-go` | Go declarations, imports, calls and common HTTP routes |
| `@c4a/extract-rush` | Rush projects, tags, entries, dependencies and owner boundaries |
| `@c4a/extract-thrift` | Thrift services, methods and declared data types |
| `@c4a/extract-proto` | Protobuf messages, fields and service definitions |
| `@c4a/extract-mdx` | Markdown/MDX structure, component references, examples and source spans |
| `@c4a/extract-contract` | Supported structured API contract declarations (OpenAPI, GraphQL) |
| `@c4a/extract-style` | Stylesheet declarations and selectors |
| `@c4a/extract-sql` | Supported SQL schema declarations |
| `@c4a/extract` | The shared extraction protocol, plugin runner, scanner and snapshot records |

All of them ship inside `@c4a/context-cli`.
<!-- /context:section -->

<!-- context:section id="selection" -->
## Smallest parser set first

Parsing is an Indexer implementation detail, not a separate phase in `src/index.ts`. The order is:

1. identify the target boundary and the reader's questions;
2. let the Indexer inspect language, manifests, entries, routes and contracts;
3. use the smallest parser set that covers those questions;
4. keep parser output as facts and write articles from facts plus readable source.

During planning, the Code Indexer does not run a full-repository parse just to learn whether a feature exists; deep extraction belongs to writing a selected topic.
<!-- /context:section -->

<!-- context:section id="unsupported" -->
## When a technology is not supported

Distinguish a parser limitation from missing writing guidance. Configuration can select supported behavior, but instructions and templates cannot create missing structural facts. The workflow reports the capability gap and the smallest supported step; when a technology is useful across projects, a reusable parser is preferred over a project-local pipeline.
<!-- /context:section -->
