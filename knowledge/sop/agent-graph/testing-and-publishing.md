---
title: Testing and Publishing
description: Write deterministic graph tests for every Route that matters, run
  validation and tests in CI, build a reproducible bundle and ship it inside
  your own package.
type: Guide
timestamp: 2026-10-12T18:07:53.547Z
---
# Testing and Publishing

<!-- context:section id="tests" -->
A graph test supplies a state — `facts`, `outcomes` and `authorities` — and asserts what the Evaluation and Route must be. It never runs a command or calls a model, so it is fast, deterministic and safe in CI.

```yaml
schema: agent-graph.test.v1
name: claimed publication without a URL is checked
graph: report
entry: default
state:
  facts:
    report: { digest: "sha256:abc", approved: true }
  outcomes:
    report/publish: completed
expect:
  statusCode: actionable
  primaryNode: check-publication
```

Outcome keys use the same `<graph>/<node>` form as `afterAction.recordNode`.

| Assertion group | `expect` fields |
| --- | --- |
| Status and selection | `statusCode`, `primaryNode`, `primaryReasonCode`, `alternativeNodes`, `availability`, `outcome` |
| What the Route runs | `command`, `handler`, `recordNode` |
| What the Route loads | `requiredResources`, `recommendedResources` |
| Gates | `gateResolution`, `inspectionCommand`, `inspectionHandler`, `inspectionSkill`, `inspectionInputSchema`, `resolutionCommand`, `resolutionHandler`, `resolutionSkill`, `resolutionInputSchema` |
| Diagnostics | `diagnosticsInclude` |

Assert on schema fields and codes, never on human descriptions.
<!-- /context:section -->

<!-- context:section id="matrix" -->
## What to cover

For each production Graph, write a case for:

- the initial Route, and its stable reason code;
- every branch Outcome;
- the user Gate and the explicitly delegated Gate;
- missing required Facts;
- fact-backed completion, and claimed completion without proof (`unverified`);
- partial and failed batch recovery;
- `join: all` and `join: any` where used;
- repeat continuation and terminal stopping;
- Subgraph child Routes and parent continuation;
- primary and alternative ranking where several Routes are legal;
- every diagnostic expected to block execution.

The weekly-report Graph from [Authoring Graphs](authoring-graphs.md) needs seven cases to reach that bar:

| Case | State | Expected |
| --- | --- | --- |
| Fresh week | none | `actionable`, `draft`, `route.report.draft` |
| Loop | `report/draft: partial` | `actionable`, `draft` again |
| Draft observed | `report.digest` | `waiting-user`, `approve`, `gateResolution: user` |
| Delegated | `report.digest`, authority `report.publish` | `actionable`, `approve`, `gateResolution: session-authority` |
| Approved | `report.digest`, `report.approved: true` | `actionable`, `publish` |
| Unproven publish | approved, `report/publish: completed`, no URL | `actionable`, `check-publication` |
| Done | approved, `publication.url` | `complete`, `outcome: completed` |

If a Provider uses dynamic or host-produced Resources, also cover coexistence of the three resource protocols, rejection of bad host input before dispatch, inline and managed-resource results, handler or schema mismatches, stale revisions and recovery of persisted results.
<!-- /context:section -->

<!-- context:section id="ci" -->
## Run it in CI

```bash
npx @c4a/agent-graph@0.3.0 --manifest provider.yaml validate
npx @c4a/agent-graph@0.3.0 --manifest provider.yaml test tests
npx @c4a/agent-graph@0.3.0 --manifest provider.yaml build dist/provider
npx @c4a/agent-graph@0.3.0 --manifest dist/provider/manifest.json validate
```

Pin the version for reproducible automation. Failures exit non-zero and, with `--format json`, print an `agent-graph.error.v1` envelope; branch on `error.code`. Typical codes while authoring:

| Code | Cause |
| --- | --- |
| `graph-flow-cycle` | An ordinary edge closes a loop; use a `repeat` edge |
| `route-reason-code-missing` | A node's `reasonCode` is not declared in the Code Catalog |
| `test-path-missing` | The test path does not exist — an empty or missing path is an error, not a vacuous pass |

Validation separately catches missing files, duplicate IDs, paths that escape the Provider, missing Subgraph entries, invalid repeat targets and recursion.
<!-- /context:section -->

<!-- context:section id="bundle" -->
## The bundle

`build` loads and validates everything reachable, then copies only what the runtime needs: Graphs, referenced Actions and their entries, schemas and declared `files`, the directories of referenced Skills, static and dynamic Resource definitions with their content, materializer Actions, and the Code Catalog with its documents. Tests and unrelated files stay out.

`manifest.json` records every file digest, catalogs, the same-Provider Graph dependency index and an overall digest. It has no timestamp, so unchanged inputs give the same digest — building the weekly-report Provider twice yields an identical `sha256:` digest. The builder refuses to overwrite referenced sources and rejects any file that contains the source Provider's absolute path. Loading the bundle verifies the overall and per-file digests, the Provider identity, and that no reachable file is missing or extra.
<!-- /context:section -->

<!-- context:section id="ship" -->
## Ship it

A Provider project normally depends on `@c4a/agent-graph` and publishes its built bundle inside its own package — a plugin, CLI or product. It can also copy the CLI's single-file `dist/agent-graph.mjs` next to the bundle for a no-install entry; that file validates and routes on Node.js 20+ and is the same implementation, not a second one.

Whichever way you install it — from source, a link, a packed tarball or a registry — the Provider should return the same Graph, Action and Resource identities. Only absolute `filePath` values differ, and Route IDs change whenever relevant definitions or inputs change.

Before releasing, check that:

1. no test, fixture or bundle contains credentials, business data or machine-specific paths;
2. built digests match the installed files;
3. `path:` Skill bindings still resolve after relocation, and `provider:` bindings resolve through a clean registry;
4. dynamic view materialization writes only to the explicit cache;
5. host-produced Resources never execute inside Agent Graph, and their results survive serialization and recovery validation.
<!-- /context:section -->

<!-- context:section id="security" -->
## Security boundary

Validation proves structure, not safety. Provider authors and the hosts that install them must review Action commands, effects, scripts and resources as executable supply-chain content. `effect: read` is a declaration, not a sandbox, and `external` effects should normally sit behind an explicit Gate or product policy. For the exact commands and SDK functions, see [CLI and SDK](../../product/reference/agent-graph/cli-and-sdk.md).
<!-- /context:section -->
