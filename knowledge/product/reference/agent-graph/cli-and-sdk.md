---
title: CLI and SDK
description: Every agent-graph command and option in @c4a/agent-graph 0.3.1, the
  JSON error envelope and common error codes, and the SDK functions grouped by
  responsibility.
type: Wiki
timestamp: 2026-10-12T20:27:23.303Z
---
# CLI and SDK

<!-- context:section id="install" -->

The package `@c4a/agent-graph` (version 0.3.1, Node.js 20 or later) ships one CLI binary, `agent-graph`, an ESM SDK and the public JSON Schemas and templates. All invocation modes run the same bundled CLI:

```bash
agent-graph ...                    # installed binary
npx @c4a/agent-graph@0.3.1 ...     # npm one-shot
bunx @c4a/agent-graph@0.3.1 ...    # Bun one-shot
node ./agent-graph.mjs ...         # single file shipped beside a Provider bundle
```

| Global option | Meaning |
| --- | --- |
| `-m, --manifest <path>` | Source Provider manifest or built `manifest.json`; default `provider.yaml` |
| `--skill <path>` | Take Provider, Graph and Entry from a Skill's `agent-graph*` metadata; a conflicting explicit Graph or Entry is rejected |
| `--registry <path>` | Host registry for `provider:` Skill locators |
| `--format human\|json` | Concise terminal text (default) or one-line JSON for Agents and automation |
| `-V, --version` | Print the CLI version |

<!-- /context:section -->

<!-- context:section id="authoring" -->
## Authoring commands

| Command | What it does |
| --- | --- |
| `init [directory] --id <id>` | Create a minimal Provider: an agent Action, a bound Skill, a procedure, a Code Catalog and a route test. Refuses to replace any path it would generate |
| `import skill <SKILL.md> --into <root> [--graph <id>]` | Copy the whole Skill directory, add a relative binding to the copy, create an agent Action and Graph, append it to the Provider and write `IMPORT_REPORT.md` |
| `import scripts <files...> --into <root> [--graph <id>]` | Create a sequential Graph from scripts; runtime inferred from the extension, effect defaults to `write` |
| `import workflow <yaml-or-json> --into <root> [--graph <id>]` | Convert a compact `steps` / `dependsOn` workflow into edges with default `join: all`; gates, facts and recovery are listed as gaps in `IMPORT_REPORT.md` |

See [Migration](migration.md) for how to finish an imported draft.
<!-- /context:section -->

<!-- context:section id="discovery" -->
## Validation and discovery

| Command | What it does |
| --- | --- |
| `validate` | Load the complete reachable Provider and report `valid` or a structured error; no side effects |
| `inspect provider` | List Graphs, entries, node counts, dependencies, Actions, Resources and paths |
| `inspect skill <SKILL.md>` | Show the binding (locator, Provider, `graph#entry`) and resolved Provider; add `--registry` for `provider:` |
| `schema list` / `schema path <name>` / `schema extract <name> --output <path>` | Discover the public JSON Schemas; `extract` works even from a copied single-file CLI |
| `code list` | List the Code Catalog (`route-reason` and `diagnostic` entries) |
| `code locate <code>` | Return the code, summary and optional document location, never the document body |
| `test [file-or-directory]` | Run every YAML/JSON graph test recursively; any failure sets a non-zero exit code |
| `build [output]` | Write a deterministic bundle, default `dist/provider`; output may sit inside the source tree only if it replaces no referenced source |
<!-- /context:section -->

<!-- context:section id="routing" -->
## Routing commands

`evaluate [graph]` (omit `graph` with `--skill`) accepts:

| Option | Meaning |
| --- | --- |
| `--entry <name>` | Entry name; default `default` |
| `--state <run.json>` | Take Facts, Outcomes and authorities from a Run |
| `--facts '<json>'` or `--facts @file.json` | Facts, merged over the Run for this invocation |
| `--outcomes '<json>'` or `@file.json` | Outcomes, e.g. `'{"release/inspect":"completed"}'` |
| `--authority <id...>` | Session authorities |

`route <graph> [route-id]`, or `--skill <SKILL.md> route [route-id]`, takes the same options plus:

| Option | Meaning |
| --- | --- |
| `--revision <digest>` | The revision of the preceding Evaluation; a change returns `route-revision-stale` |
| `--resource-receipts '<json>'` or `@file.json` | Current-conversation read receipts that set each resource's `readState` |

Without `route-id`, the current primary Route is resolved. An unavailable ID returns `route-stale`. Route resolution locates files but never runs commands or materializers; a waiting Gate exposes `gate.inspectionAction` and `gate.resolutionAction` separately from its empty `commandPlan`.
<!-- /context:section -->

<!-- context:section id="run" -->
## Run commands

```text
run start <graph> --state <path> [--workspace <dir>]
run status --state <path>
run record <node-key> <outcome> --state <path> [--detail <json>]
run facts --state <path> --set <json> [--replace]
run authority --state <path> [--set <id...>]
run checkpoint --state <path> --to <path>
run resume <checkpoint> --state <path>
run events --state <path>
```

`run status` re-evaluates the Graph, so it also needs the Provider options (`--manifest` or `--skill`). `run record` takes the exact key from `route.afterAction.recordNode`, such as `main/work`. `run facts` merges by default and replaces with `--replace`. `run start`, `run checkpoint` and `run resume` refuse to overwrite an existing target (`run-target-exists`). See [Runs and Recovery](../../../architecture/agent-graph/runs-and-recovery.md).
<!-- /context:section -->

<!-- context:section id="resource" -->
## Resource commands

| Command | What it does |
| --- | --- |
| `resource locate <id-or-path>` | Return an installed static file and digest, or a materialization reference for a dynamic resource |
| `resource materialize <id-or-path> --cache <dir> --revision <digest>` | Run a read-only command or script materializer and write content-addressed output plus a receipt |

| `materialize` option | Default |
| --- | --- |
| `--workspace <dir>` | Current directory |
| `--input '<json>'` or `@file.json` | none |
| `--timeout-ms <ms>` | `30000` |
| `--max-output-bytes <bytes>` | `10485760` |
| `--max-error-bytes <bytes>` | `1048576` |

Pass the revision of the Route that selected the view. A host-action Resource is never run by the CLI and returns `materializer-host-required`.
<!-- /context:section -->

<!-- context:section id="errors" -->
## Errors

With `--format json`, failures go to stderr with a non-zero exit code:

```json
{
  "schema": "agent-graph.error.v1",
  "state": "error",
  "error": { "code": "route-stale", "message": "...", "diagnostics": [] }
}
```

Branch on `error.code` and diagnostic codes, never on message text.

| Area | Codes |
| --- | --- |
| Routing | `route-revision-stale`, `route-stale`, `route-unavailable` |
| Graph validation | `graph-flow-cycle`, `graph-terminal-missing`, `graph-entry-missing`, `graph-edge-node-missing`, `graph-repeat-target-invalid`, `graph-gated-by-source-invalid`, `graph-recursion`, `terminal-outcome-ambiguous`, `route-reason-code-missing` |
| Gates | `gate-inspection-effect-invalid`, `gate-resolution-effect-invalid`, `gate-delegated-policy-invalid`, `gate-delegated-inspection-missing` |
| Paths and files | `path-outside-provider`, `path-symlink-outside-provider`, `absolute-path-forbidden`, `file-missing` |
| Skill binding | `skill-binding-missing`, `skill-graph-missing`, `skill-entry-missing`, `skill-graph-conflict`, `skill-entry-conflict`, `provider-unresolved` |
| Runs | `run-target-exists`, `run-provider-mismatch` |
| Materialization | `materializer-timeout`, `materializer-output-limit`, `materializer-error-limit`, `materializer-failed`, `materializer-host-required` |
| Host results | `host-action-handler-mismatch`, `host-action-input-stale`, `host-action-output-schema-mismatch` |
| Bundles | `build-output-overlaps-source`, `build-absolute-path-leak`, `bundle-digest-mismatch`, `bundle-file-digest-mismatch`, `bundle-files-mismatch` |
| Tests | `test-path-missing`, `test-cases-empty` |

Evaluation problems are reported as diagnostics inside a successful Evaluation rather than as an error envelope: for example `required-fact-missing` (a reached node is blocked by `requiresFacts`), `no-route` (nothing actionable or terminal is reachable) and the informational `route-alternatives-truncated` when more than three alternatives exist.
<!-- /context:section -->

<!-- context:section id="sdk" -->
## SDK

```ts
import { evaluateGraph, loadProvider, resolveRoute, resolveSkillBinding } from "@c4a/agent-graph";
```

| Responsibility | Functions |
| --- | --- |
| Provider discovery | `readSkillBinding`, `resolveSkillBinding`, `readProviderRegistry`, `loadProvider` |
| Routing | `evaluateGraph`, `computeRevision`, `resolveRoute`, `nodeStateKey` |
| Resources and codes | `locateResource`, `materializeResource`, `locateCode`, `hostActionInputDigest`, `validateHostActionResult`, `hostActionOutputDigest`, `hostActionResourceReadReceipt` |
| Optional Run files | `createRun`, `loadRun`, `recordOutcome`, `updateRunFacts`, `updateRunAuthorities`, `checkpointRun`, `resumeRun` |
| Authoring | `initProvider`, `importSkill`, `importScripts`, `importWorkflow` |
| Quality and release | `validateSchema`, `runGraphTests`, `buildProviderBundle`, `inspectProvider` |

Evaluation and route resolution are side-effect free; only the named authoring, Run, build and materialization functions write files. Paths returned by the SDK are resolved for the current installation while definitions stay relative. `materializeResource` accepts `timeoutMs`, `maxOutputBytes` and `maxErrorBytes`, and a trusted host may add variables with `env` (Agent Graph's own variables take precedence). Errors are `AgentGraphError` instances with `code` and `diagnostics`. The package also exports `./schemas/*` and `./templates/*`. A complete host loop is shown in [Skills and Providers](../../../architecture/agent-graph/skills-and-providers.md).
<!-- /context:section -->
