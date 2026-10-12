---
title: Migration
description: Upgrade Providers across Agent Graph releases from 0.1 to 0.3.0,
  and turn an existing Skill, script set or dependency workflow into a reviewed
  Provider with the importers.
type: Wiki
timestamp: 2026-10-12T20:24:32.970Z
---
# Migration

<!-- context:section id="releases" -->

Agent Graph is pre-1.0: a `0.x` release may tighten a field or invariant, but documents the break and updates every template, example and test. A Provider's own `version` is independent of the `@c4a/agent-graph` package version.

| Release | What changed for Provider authors |
| --- | --- |
| 0.1.0 | Initial specification, SDK, CLI, schemas, templates and examples |
| 0.1.1 | Stricter Graph validation and materialization boundaries; explicit Run state and recovery |
| 0.2.0 | **Breaking.** Action and Gate nodes require a `route.*` `reasonCode`; Skill bindings need all three metadata fields; a declared Code Catalog is a closed set |
| 0.2.1 | Gate `resolutionAction`, which must be able to change observable state |
| 0.2.2 | Read-only Gate `inspectionAction`, exposed separately from the resolution plan |
| 0.2.3 | Current-conversation read receipts and `readState` on Route resources |
| 0.2.4 | Documentation and replay updates to the Context case study |
| 0.2.5 | Lifecycle-aware evidence modelled as ordinary revision-bound Facts |
| 0.2.6 | Gate `delegated` policies for session-authority Routes |
| 0.2.7 | Host-materialized resources with versioned input and output schemas |
| 0.3.0 | **Breaking.** Resource identifiers split into three independent v1 protocols |
| 0.3.1 | Scaffold, templates and examples declare `compatibility.agentGraph: ^0.3.0`; the 0.3.0 Resource migration is documented |

<!-- /context:section -->

<!-- context:section id="to-020" -->
## Upgrading to 0.2.x

1. Give every Action and Gate node a stable `reasonCode` beginning with `route.`.
2. If the Provider declares `catalogs.codes`, add every one of those codes as a `route-reason` entry, or validation fails with `route-reason-code-missing`.
3. Update every bound Skill to declare all three fields:

```yaml
metadata:
  agent-graph: path:../../provider.yaml
  agent-graph.graph: release
  agent-graph.entry: default
```

4. Validate every Provider before switching hosts to the new runtime.

The later 0.2 releases are additive: Gate inspection and resolution Actions, read receipts, delegated policies and host-materialized resources are opt-in.
<!-- /context:section -->

<!-- context:section id="to-030" -->

## Upgrading to 0.3.0

0.3.0 removed the numbered resource identifiers `agent-graph.resource.v1`, `agent-graph.resource.v2`, `agent-graph.resource-location.v1` and `agent-graph.resource-location.v2`; the old names now fail schema validation with `schema-invalid`. Replace them by what the descriptor actually is:

| Before | Used for | After |
| --- | --- | --- |
| `agent-graph.resource.v1` with `path` | A non-Markdown file (schema, template, diagnostic) | `agent-graph.resource.file.v1` |
| `agent-graph.resource.v1` with `materializer` | A command or script context view | `agent-graph.resource.graph-action.v1` |
| `agent-graph.resource.v2` | A host-materialized resource | `agent-graph.resource.host-action.v1` |
| `agent-graph.resource-location.v1` | Resolved file or context-view location | `agent-graph.resource-location.file.v1` or `.graph-action.v1` |
| `agent-graph.resource-location.v2` | Resolved host-action location | `agent-graph.resource-location.host-action.v1` |

Then raise the Provider's `compatibility.agentGraph` to `^0.3.0` and run `agent-graph validate`; the `examples/host-materialized-resource` example shows a Host-action resource. Markdown resources that carry `id`, `kind` and `media-type` in frontmatter are unaffected. Hosts that read Route resources should branch on the new location schema names; the host-action input and output ABI and its recovery rules are unchanged.

<!-- /context:section -->

<!-- context:section id="import-skill" -->
## Importing an existing Skill

```bash
agent-graph init ./provider --id product-workflow
agent-graph import skill ../legacy-skill/SKILL.md --into ./provider --graph legacy-capability
agent-graph --manifest ./provider/provider.yaml validate
```

The importer copies the whole Skill directory to `skills/<graph>/`, adds the Provider, Graph and Entry binding to the copied `SKILL.md` and creates one agent Action and one Graph. The original instructions are preserved, not split into guessed phases, and the source Skill is left untouched.
<!-- /context:section -->

<!-- context:section id="import-other" -->
## Importing scripts and workflows

```bash
agent-graph import scripts ./inspect.sh ./package.sh --into ./provider --graph package-flow
agent-graph import workflow ./workflow.yaml --into ./provider
```

- **Scripts** become a sequential Graph. The extension selects Node, Bun, Python or shell; the effect defaults to `write`, because the importer cannot know which scripts are read-only or external.
- **Workflows** use a compact shape — `id` plus `steps` with `id`, `command`, `effect` and `dependsOn`. The importer checks step shapes, missing dependencies, ID collisions and cycles before writing anything, turns dependencies into edges (fan-in uses `join: all`), adds a start Action and a Terminal after the leaves, and registers a reason code per step. Topology does not mean parallel execution. Templating, expressions, secrets, matrices and vendor retry policies are not interpreted.

Every import appends a section to `IMPORT_REPORT.md` beside `provider.yaml` and refuses to replace an existing Graph, Action, script directory or copied Skill. The report lists what must not be guessed — effects, Outcomes, recovery, Gates, resources and fact-backed completion. Treat it as an authoring checklist, then remove or archive it per your repository policy.
<!-- /context:section -->

<!-- context:section id="review" -->
## Finishing the draft

Review the imported Provider for:

- which operations are separate Actions;
- which resources are needed by only one Route;
- each Action's effect (`read`, `write`, `external`);
- human Gates and whether delegation is allowed;
- Facts that prove success;
- `failed`, `partial`, `unverified` and recovery transitions;
- stopping conditions for repeated work.

For a large Skill, change it in small, testable steps:

1. Import without changing the source Skill.
2. Validate the generated Provider.
3. Add one graph test for today's happy path.
4. Extract deterministic commands into Action files.
5. Move long phase-specific instructions into Route resources.
6. Add Facts and `satisfiedBy` before trusting recorded success.
7. Add explicit Gates and failure and recovery Outcomes.
8. Add loop tests if work can repeat.
9. Build and test the relocatable bundle.
10. Only then replace the original Skill with a thinner bound entry.

Not every paragraph should become a node: nodes are independently actionable, gated, recoverable or testable transitions, and the rest stays a Resource. See [Authoring Graphs](../../../sop/agent-graph/authoring-graphs.md) and [Testing and Publishing](../../../sop/agent-graph/testing-and-publishing.md).
<!-- /context:section -->
