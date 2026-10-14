---
title: Quick Start
description: Create, validate, test, evaluate, route, run and build a starter
  Agent Graph Provider with the pinned CLI in about ten minutes.
type: Guide
timestamp: 2026-10-14T00:36:43.613Z
---
# Quick Start

<!-- context:section id="choose" -->
In about ten minutes you will have a runnable starter Provider: it validates, passes its graph test, returns a Route for the Agent's next step, records a Run and builds into a relocatable bundle you can ship inside your own package.

This tutorial suits creating a new Skill or workflow. Running the commands creates a Provider development project; it does not by itself integrate a Skill or change how any Agent works. If you are improving an existing Skill or embedding Agent Graph in a product, pick that path in [What Is Agent Graph](introduction.md) first.

You need Node.js 20 or later. Every command pins the CLI with `npx @c4a/agent-graph@0.3.0` so the results are reproducible.
<!-- /context:section -->

<!-- context:section id="init" -->
## 1. Create a Provider

```bash
npx @c4a/agent-graph@0.3.0 init ./example-provider --id example-provider
cd example-provider
```

The generated project is a complete, minimal Provider:

| File | What it is |
| --- | --- |
| `provider.yaml` | The Provider manifest: ID, version, Graph list and Code Catalog |
| `graphs/main.yaml` | One Graph, entry `default`, an Action node `work` and a Terminal `done` |
| `actions/work.yaml` | An Agent Action (`runner: agent`, `effect: write`) bound to the Skill below |
| `skills/getting-started/SKILL.md` | A thin Skill whose metadata binds Provider, Graph `main` and Entry `default` |
| `resources/procedure.md` | The procedure the Route requires the Agent to read |
| `codes.yaml` | The Code Catalog declaring the reason code `route.main.work` |
| `tests/main.yaml` | One graph test asserting the starter Route is actionable |

No runtime directory is created. Where a host keeps Run files is the host's choice; the protocol reserves no directory.
<!-- /context:section -->

<!-- context:section id="validate" -->
## 2. Validate and test

```bash
npx @c4a/agent-graph@0.3.0 validate --format json
npx @c4a/agent-graph@0.3.0 test tests --format json
```

Validation checks JSON Schemas, that relative paths stay inside the Provider, IDs and references, entrypoints, explicit Terminals, edge endpoints, Subgraph calls, recursion, dynamic resource materializers and duplicate identities. It never executes an Action. For the starter it reports `"state":"valid"` with 1 Graph, 2 nodes and 1 edge; the test run reports `"state":"passed","total":1,"failed":0`.
<!-- /context:section -->

<!-- context:section id="evaluate" -->
## 3. Find the current Route

```bash
npx @c4a/agent-graph@0.3.0 evaluate main --format json
```

The Evaluation contains a stable `statusCode`, a `revision` digest, one `primaryRoute`, compact alternatives and diagnostics. For the starter, the primary Route is the `work` node with `reasonCode: route.main.work`, `availability: immediate` and the catalog hint "The requested work is ready to perform." No Skill or procedure body is inlined.

Resolve that Route using both values from the same Evaluation:

```bash
npx @c4a/agent-graph@0.3.0 route main <route-id> --revision <revision> --format json
```

The Route returns the selected node and its call path, the Action, an empty `commandPlan` (an Agent Action runs no command), the required resources — the Skill and `resources/procedure.md`, each as an absolute file path with a content digest and `readState: read-required` — and `afterAction: {evaluate: true, recordNode: "main/work"}`. If a Provider file or input changed in between, the CLI rejects the stale revision instead of returning a mismatched plan.

Because the Skill already binds Provider, Graph and Entry, the same Evaluation works from the Skill alone:

```bash
npx @c4a/agent-graph@0.3.0 --skill ./skills/getting-started/SKILL.md evaluate --format json
```
<!-- /context:section -->

<!-- context:section id="run" -->
## 4. Track a long task with a Run

```bash
npx @c4a/agent-graph@0.3.0 run start main --state ./runtime/run.json --workspace "$PWD"
# ... the Agent reads the required resources and does the work ...
npx @c4a/agent-graph@0.3.0 run record main/work completed --state ./runtime/run.json
npx @c4a/agent-graph@0.3.0 run status --manifest ./provider.yaml --state ./runtime/run.json --format json
```

Record with the exact `afterAction.recordNode` key. `run record` reminds you that recorded Outcomes are not proof of Facts, and `run status` evaluates again: for the starter it now returns `statusCode: complete` with `outcome: completed`. In a real Graph a historical `completed` does not override a missing fact check; the next Evaluation may route to verification or recovery instead. See [Runs and Recovery](../../architecture/agent-graph/runs-and-recovery.md).
<!-- /context:section -->

<!-- context:section id="build" -->
## 5. Build a relocatable bundle

```bash
npx @c4a/agent-graph@0.3.0 build ./dist/provider --format json
npx @c4a/agent-graph@0.3.0 --manifest ./dist/provider/manifest.json validate
```

The bundle contains only reachable Provider files, a normalized `provider.yaml` and a `manifest.json` with every file digest, the Graph dependency index and an overall digest. Tests stay out, and no source-machine absolute path is written, so the bundle can be shipped inside your own package.
<!-- /context:section -->

<!-- context:section id="next" -->
## Next steps

- Turn the starter into a real workflow with Facts, a Gate, recovery and a loop: [Authoring Graphs](authoring-graphs.md).
- Cover every branch in CI and ship the bundle: [Testing and Publishing](testing-and-publishing.md).
- Learn the evaluation model behind what you just ran: [Core Model](../../architecture/agent-graph/core-model.md).
- Browse runnable patterns in the repository's `examples/` directory, such as `review-gate`, `facts-recovery`, `fact-driven-batch`, `monitoring-loop` and `subgraphs`.
<!-- /context:section -->
