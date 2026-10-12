---
title: Specification
description: Field-level reference for the Agent Graph v1 protocols implemented
  by @c4a/agent-graph 0.3.1 — Provider, Skill binding, Graph, nodes, Fact
  checks, Gates, edges, Actions, Resources, Code Catalog, Outcomes, Evaluation,
  Route, Run, tests and bundles.
type: Wiki
timestamp: 2026-10-12T20:27:23.303Z
---
# Specification

<!-- context:section id="scope" -->

This page summarizes the `agent-graph.*.v1` protocols implemented by `@c4a/agent-graph@0.3.1`. The JSON Schemas shipped in the package's `schemas/` directory are normative for file shape; this page lists fields and behavioural rules. For the reasoning behind them, read [Core Model](../../../architecture/agent-graph/core-model.md); for step-by-step use, read [Authoring Graphs](../../../sop/agent-graph/authoring-graphs.md).

| Schema identity | Object |
| --- | --- |
| `agent-graph.provider.v1` | Provider manifest |
| `agent-graph.graph.v1` | Graph |
| `agent-graph.action.v1` | Action |
| `agent-graph.resource.file.v1`, `.graph-action.v1`, `.host-action.v1` | Resource descriptors |
| `agent-graph.resource-location.file.v1`, `.graph-action.v1`, `.host-action.v1` | Resolved Resource locations |
| `agent-graph.resource-read-receipts.v1` | Current-conversation read receipts |
| `agent-graph.host-action-result.v1` | Host materialization result |
| `agent-graph.code-catalog.v1` | Code Catalog |
| `agent-graph.evaluation.v1`, `agent-graph.route.v1` | Evaluation and Route output |
| `agent-graph.run.v1` | Run file |
| `agent-graph.test.v1` | Graph test |
| `agent-graph.bundle.v1` | Built bundle manifest |
| `agent-graph.error.v1` | CLI error envelope |

Unknown fields are rejected in every v1 object, so a misspelled safety field cannot be silently ignored.

<!-- /context:section -->

<!-- context:section id="provider" -->

## Provider and Skill binding

```yaml
schema: agent-graph.provider.v1
id: company/release
version: 0.1.0
graphs: [graphs/release.yaml]
catalogs:
  codes: codes.yaml
compatibility:
  agentGraph: ^0.3.0
  node: ">=20"
```

| Field | Rule |
| --- | --- |
| `id` | Identifies the Provider; runtime identities are qualified by Provider, Graph and node ID |
| `version` | Semantic version of this Provider, independent of the `@c4a/agent-graph` package version |
| `graphs` | Provider-root-relative paths; Graphs are never discovered by scanning |
| `catalogs.codes` | Optional Code Catalog |
| `compatibility` | Supported toolchain (`agentGraph`) and Node.js ranges |

All references stay inside the Provider root: no absolute paths and no escape through `..` or a symbolic link. Several Providers stay isolated — no merging and no cross-Provider Subgraphs. A source manifest may have any filename; a built bundle uses `provider.yaml` plus a generated `manifest.json`.

A bound Skill declares `metadata.agent-graph` (a `path:` locator relative to that `SKILL.md`, or a host-resolved `provider:` locator), `agent-graph.graph` and `agent-graph.entry`. The three are validated together, and an Agent must never infer Graph or Entry from prose.

<!-- /context:section -->

<!-- context:section id="graph" -->
## Graph and nodes

A Graph has `id`, `entrypoints` (public entry name → node), `nodes` and `edges`. Topology is static: target names, dates, phase IDs and queue items are Facts, not generated nodes. Every Graph needs at least one Terminal; Terminals have no outgoing edges, and reaching Terminals with conflicting Outcomes is `terminal-outcome-ambiguous` with status `error`.

| Kind | Required field | Meaning |
| --- | --- | --- |
| `action` | `action` | A Provider-relative Action can be selected |
| `gate` | `gate` | User or session authority must resolve a policy boundary |
| `subgraph` | `graph`, `entry` | Enter another Graph in the same Provider |
| `terminal` | `terminalOutcome` | End the frame with an explicit Outcome |

| Common field | Rule |
| --- | --- |
| `description` | Short human label, never a condition |
| `reasonCode` | Required on Action and Gate nodes; shape `route.<id>` |
| `priority` | Ranks Routes within one availability class; never a semantic chooser |
| `join` | `all` (default) requires all incoming edges; `any` requires one |
| `requiresFacts` | All checks must pass before the node is legal |
| `satisfiedBy` | Facts that prove an Action or Gate complete without replaying it |
| `resources.required`, `resources.recommended` | Resources selected with an Action or Gate |

Subgraph and Terminal nodes cannot carry Action or Gate resources or satisfaction rules.
<!-- /context:section -->

<!-- context:section id="facts" -->
## Fact checks

```yaml
satisfiedBy:
  - path: artifact.digest
    exists: true
  - path: verification.state
    equals: passed
```

`path` is a dotted lookup in which numeric segments index arrays (`items.0.digest`). Each check has exactly one of `exists` or `equals`, with a scalar JSON value. There is no JavaScript, templating, shell or condition language.

| Situation | Result |
| --- | --- |
| `satisfiedBy` matches | `completed`, even with no Run record |
| Recorded `completed`, `satisfiedBy` does not match | `unverified` |
| Explicit `unverified` edge | Can route to recovery |
| A claim made in conversation | Creates no Fact |
<!-- /context:section -->

<!-- context:section id="gates" -->
## Gates

| Field | Rule |
| --- | --- |
| `gate.id`, `gate.prompt` | Gate identity and a short question |
| `gate.authority` | Authority that may resolve it |
| `gate.delegatable` | Only when true can a session authority resolve it |
| `inspectionAction` | Optional `effect: read` Action that prepares evidence; exposed as `gate.inspectionAction`, safe while waiting |
| `resolutionAction` | Optional `write` or `external` Action that records or applies the decision after confirmation; exposed as `gate.resolutionAction` |
| `delegated.inspection` | `skip` hides the inspection on the delegated Route; requires an authored inspection Action |
| `delegated.resolutionAction` | Replaces the resolution Action on the delegated Route only; `write` or `external` |
| `delegated.resources` | Replaces the Gate's resources on the delegated Route only |

Without the authority the Route is `waiting-user` with an empty `commandPlan`; with a delegatable authority it is actionable with `resolution: session-authority`. Authorities live in the current input or Run, never in the Provider, and never satisfy Facts. A host must not run a resolution Action while the Route still requires the user.
<!-- /context:section -->

<!-- context:section id="edges" -->
## Edges

Each edge has `from`, `to`, optional `kind` and optional `outcomes` (default `[completed]`).

| Kind | Semantics |
| --- | --- |
| `flow` | General control transition |
| `consumes` | The target consumes an artifact produced by the source |
| `requires` | The source is a legal prerequisite of the target |
| `gatedBy` | A Gate resolves the target's policy boundary; must start at a Gate |
| `repeat` | A matching Outcome resets an Action or Gate to pending |

All non-repeat kinds share the same reachability rule; the kind records causal intent only. Edges carry no runtime values. Non-repeat edges must be acyclic (`graph-flow-cycle` otherwise), `repeat` must target an Action or Gate, and Run history keeps earlier iterations. Fan-out and fan-in are reachability, not concurrency. A Subgraph target is resolved statically in the same Provider; recursion into an ancestor is rejected.
<!-- /context:section -->

<!-- context:section id="actions" -->
## Actions

```yaml
schema: agent-graph.action.v1
id: inspect-package
runner: command
effect: read
command: npm pack --dry-run
cwd: workspace
```

| Runner | Fields | Route result |
| --- | --- | --- |
| `command` | `command` | Exact shell command |
| `script` | `entry`, `runtime`, optional `args` | Runtime and absolute installed entry path |
| `agent` | `skill` | The Skill as a required file resource |
| `host` | `handler` | Host-defined handler identity |

| Field | Rule |
| --- | --- |
| `effect` | Required: `read`, `write` or `external` |
| `cwd` | `workspace` (default) or `provider` |
| `inputSchema`, `outputSchema` | Bundled; installed locations exposed on the Route |
| `files` | Extra runtime files to package |

Runner fields are mutually exclusive. A Skill in its own directory carries that directory into the bundle; a Provider-root `SKILL.md` carries only itself. Agent Graph resolves Actions and never executes them implicitly.
<!-- /context:section -->

<!-- context:section id="resources" -->
## Resources

| Protocol | Key fields | Behaviour |
| --- | --- | --- |
| Static file | Markdown frontmatter `id`, `kind`, `media-type`; or a `resource.file.v1` descriptor with `id`, `kind`, `mediaType`, `path` | Kinds `procedure`, `diagnostic`, `template`, `schema`, `skill`; located by absolute path, media type and content digest |
| Graph action | `id`, `kind: context-view`, `mediaType`, `materializer` | Materializer must be a `read` command or script Action; runs only through `resource materialize` with the selecting Route revision |
| Host action | `id`, `kind`, `mediaType`, `materializer`, `input` | Materializer must be a `read` host Action with `handler`, `inputSchema` and `outputSchema`, each schema with a versioned protocol identity; input validated before any Route is returned |

Materializers receive `AGENT_GRAPH_PROVIDER_ROOT`, `AGENT_GRAPH_WORKSPACE`, `AGENT_GRAPH_REVISION` and `AGENT_GRAPH_INPUT`, a minimal inherited environment, and default limits of 30 s, 10 MiB stdout and 1 MiB stderr. For host-action Resources, Agent Graph computes `input_digest` from `{handler, input.schema, input.value}`; the host returns `agent-graph.host-action-result.v1` with the same handler and digest, adapter identity and exactly one of `inline` or `resource` (`ref` plus `digest`), checked by `validateHostActionResult`.

Read receipts (`agent-graph.resource-read-receipts.v1`) are scoped to one Provider. A static receipt matches ID and digest; a dynamic one matches ID and selecting Route revision. Every Route resource gets `readState: current` or `read-required`. Receipts never affect evaluation and are never persisted in Runs.
<!-- /context:section -->

<!-- context:section id="codes" -->
## Code Catalog

```yaml
schema: agent-graph.code-catalog.v1
codes:
  - code: route.release.inspect
    kind: route-reason
    summary: The release artifact still needs inspection.
    document: resources/release-checklist.md
```

`kind` is `route-reason` or `diagnostic` (which may add `severity`, including `info`). `summary` is a hint, never a condition; `document` is an optional static Resource. Without a Catalog, `reasonCode` is only shape-checked; with one, every Action and Gate `reasonCode` must resolve to a `route-reason` entry.
<!-- /context:section -->

<!-- context:section id="evaluation" -->

## Outcomes, Evaluation and Route

Outcomes are `completed`, `partial`, `failed`, `unverified`, `skipped`, `pending`, `blocked` and `waiting-user`. They are not aliases; `partial`, `unverified` and `skipped` never become `completed`.

| Evaluation field | Content |
| --- | --- |
| `provider`, `graph`, `entry` | Identities |
| `revision` | Digest of the Graph's same-Provider dependency closure, Facts, normalized Outcomes and authorities |
| `statusCode` | `actionable`, `waiting-user`, `blocked`, `complete` or `error` |
| `outcome` | Terminal Outcome, when complete |
| `primaryRoute`, `alternativeRoutes` | One primary and up to three alternatives, each with `routeId`, `node`, `reasonCode`, optional `hint`, `availability` |
| `diagnostics` | Compact diagnostics |

Evaluation is read-only and deterministic; outcome timestamps and files used only by unrelated Graphs do not change the revision.

A Route (`agent-graph.route.v1`) carries `revision` and `routeId`, Graph, node and `callPath`, `statusCode`, `reasonCode`, `hint`, `availability`, optional Gate resolution and Gate Actions, the Action with its effect, `commandPlan` or handler, resolved working directory, required and recommended resource locations — each keeping its complete file, Graph-action or Host-action location envelope — with `readState`, and `afterAction: {evaluate: true, recordNode}`. A Route ID is accepted only while still available, and a revision mismatch is rejected before any command plan is returned.

<!-- /context:section -->

<!-- context:section id="run" -->
## Run, tests and bundle

A Run (`agent-graph.run.v1`) is optional host-owned memory: Provider, Graph, entry, optional workspace, Facts, the latest Outcome per state key, session authorities, append-only numbered events and timestamps. A checkpoint is a validated copy without authorities; resume copies it to an explicit path, clears authorities and appends an event. No default state directory exists.

A graph test (`agent-graph.test.v1`) declares `state` (`facts`, `outcomes`, `authorities`) and `expect` assertions, and never executes Actions or calls a model; see [Testing and Publishing](../../../sop/agent-graph/testing-and-publishing.md).

`build` validates everything reachable, copies reachable files, writes a normalized `provider.yaml` and a `manifest.json` with catalogs, file digests, the Graph dependency index and an overall digest, excludes tests, refuses to overwrite sources and rejects any file containing the source absolute path. Loading a bundle rejects digest mismatches, missing or extra files, incomplete catalogs, identity mismatches and inconsistent dependency indexes.
<!-- /context:section -->

<!-- context:section id="compat" -->

## Compatibility

Until `@c4a/agent-graph` reaches `1.0.0`, the v1 family is in public draft finalization: a `0.x` release may tighten a required field or invariant, but must document the break and update every shipped template, example and test. `0.2.0` made Action and Gate `reasonCode` mandatory and completed the Skill binding with explicit Graph and Entry fields; `0.3.0` replaced the numbered Resource and Resource Location protocols with separate file, Graph-action and Host-action protocols. After `1.0.0`, incompatible semantics need a new schema version and compatible additions need a defined extension point. Hosts branch on schema identities, status codes, reason codes and diagnostic codes — never on human text. Version-by-version changes are in [Migration](migration.md).

<!-- /context:section -->
