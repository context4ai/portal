---
title: External Entrances
description: Declare external knowledge sites and Skills in imports.yaml so
  readers can navigate to them, without capturing them as evidence.
type: Guide
timestamp: 2026-10-15T03:52:07.709Z
---
# External Entrances

<!-- context:section id="goal" -->

Some content belongs next to your knowledge without becoming part of it: a team's engineering handbook on another site, a Skill published in another repository. `imports.yaml` at the root of the Context knowledge workspace declares such **entrances**. Context never downloads, installs or captures them; it only knows where they are so pages and packages can link to them.

| You need | Use |
| --- | --- |
| A link readers can follow | An import in `imports.yaml` |
| A conclusion that must be traceable and tracked for change | A registered, captured source |
| Docs or Skills in this same repository | [Referencing Same-Repository Docs and Skills](same-repository-docs.md) |

<!-- /context:section -->

<!-- context:section id="declare" -->
## Declare an entrance

Ask the Agent to keep a lasting association; quick lookups during a question do not register anything.

```yaml
protocol: context.imports/v1
imports:
  engineering-guide:
    kind: knowledge
    url: https://docs.example.org/engineering/
    description: Engineering conventions
  release-check:
    kind: skill
    url: https://github.com/example/skills/tree/v1/skills/release-check
    path: skills/release-check
    version: v1
```

The stable ID and `url` are required; `kind`, `format`, `title`, `description`, `path` and `version` are optional free-form hints. URLs must be HTTP(S) without credentials — never put access tokens in query strings. Use a new ID when the target's identity changes.
<!-- /context:section -->

<!-- context:section id="link" -->
## Link to it from a page

```markdown
See the [Engineering guide](context:import/engineering-guide).
```

Build turns this into the declared URL as-is; it never guesses provider URLs, appends `path` or rewrites the version. An unknown ID keeps the label as plain text and produces a build warning.

To give readers a directory of all entrances, enable the imports page on the package; `importsPage: { site: true }` also adds it to the website navigation:

```ts
kbPackage({ name: "handbook", template: { path: "src/package-templates/kb" }, importsPage: true });
```

The page lists declared metadata only. Check that every entrance suits the audience before exposing private ones.
<!-- /context:section -->

<!-- context:section id="evidence" -->
## Entrances are not evidence

An import adds nothing to `knowledge/structure.yaml` references and has no citation format. When asked to check imports, the Agent compares current versions with `version` using its own authorized tools; a target it cannot reach is reported as "version unknown", never as a change. The CLI itself never contacts providers.
<!-- /context:section -->
<!-- context:section id="raw-material" -->
## Entrances, sources and a raw folder

While researching a new knowledge base it is natural to collect originals in a `raw/` folder with a YAML list of document links. Keep that inventory from becoming a second source system:

| Material | Where it goes |
| --- | --- |
| Conclusions that must stay traceable or tracked for change | Registered as a source and captured with a snapshot |
| Content readers only need to jump to | Declared in `imports.yaml` as an entrance |
| Hand-collected evidence that cannot be captured reliably | A `raw/` folder, each item labelled with its origin, retrieval time, version, authority status and what it replaces |

An entrance never becomes evidence by being listed, and a `raw/` file does not replace capture when the conclusion depends on it. The screening that decides which documents belong in each row is described in [Cold-Starting a Knowledge Base](../practices/cold-start.md).

<!-- /context:section -->
