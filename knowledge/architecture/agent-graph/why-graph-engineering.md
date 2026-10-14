---
title: Graph Engineering Principles
description: The Graph Engineering principles behind Agent Graph, the problem
  they address in long Agent Skills, how each principle becomes implementation,
  and what version 1 deliberately leaves out.
type: Guide
timestamp: 2026-10-14T00:33:26.944Z
---
# Graph Engineering Principles

<!-- context:section id="what" -->
This page explains the design principles behind Agent Graph and how each one becomes part of the implementation. For what Agent Graph is, its purpose, a small worked example and when a Skill should adopt it, start with [What Is Agent Graph](../../sop/agent-graph/introduction.md).

Where to go next:

- **How it works:** [Core Model](core-model.md), [Runs and Recovery](runs-and-recovery.md), [Skills and Providers](skills-and-providers.md), [Agent Graph in Context](agent-graph-in-context.md).
- **Guides:** [Quick Start](../../sop/agent-graph/getting-started.md), [Authoring Graphs](../../sop/agent-graph/authoring-graphs.md), [Testing and Publishing](../../sop/agent-graph/testing-and-publishing.md).
- **Reference:** [Specification](../../product/reference/agent-graph/specification.md), [CLI and SDK](../../product/reference/agent-graph/cli-and-sdk.md), [Migration](../../product/reference/agent-graph/migration.md).
<!-- /context:section -->

<!-- context:section id="problem" -->
## The problem

Agents usually know enough. The harder problem in a long task is knowing which part applies **now**, which action is legal next, what proves that action is complete and where to resume after an interruption. Making the prompt longer does not solve this reliably: a complex Skill in one document has a flat topology, every rule sits next to every other and is often loaded together, and the Agent has to infer the current phase from the conversation. Such a workflow is also hard to test without running the whole model behavior.

> Context should be discovered, not accumulated. The plan is explicit; the path is selected from current reality.
<!-- /context:section -->

<!-- context:section id="principles" -->
## The Graph Engineering principles

"Graph Engineering" is an emerging architecture label, not an official protocol or a single implementation; writing under that name covers feedback and audit loops, durable multi-Agent organizations and dynamically generated task graphs. Agent Graph takes the engineering principles without claiming the term, and narrows the question to: *how can an Agent discover the next legal action and only the context it needs, while a long workflow stays observable, testable and recoverable?*

- **From prompt to topology.** Prompt engineering improves one interaction and context engineering shapes what one interaction sees. Graph Engineering adds how information, authority, actions, evidence and feedback move across many interactions. A graph does not add context; it creates boundaries so the Agent loads a small, relevant slice after a Route is chosen.
- **Reality stays outside the optimizer.** Agent Graph separates **facts** (observable state from a Provider or host), **outcomes** (explicit results of an attempted action) and **instructions** (procedures). Instructions cannot assert facts, and a recorded success without the evidence a node requires becomes `unverified`. Source digests, build receipts, test results and scoped review decisions are typical external anchors; another model agreeing is useful evidence, not an anchor.
- **Contracts, not diagrams of prose.** Only steps that are independently actionable, gated, recoverable, repeatable or testable become nodes; explanation stays in files. Every element carries a boundary contract — an Action its runner and effect, a Gate who decides, a node the facts it needs and the facts that prove it done — so the visual graph is a view of executable contracts.
- **Graphs of loops.** Review, repair, polling and re-planning loops are explicit `repeat` edges with typed Outcomes and stop conditions. Each iteration is a Route and each result an event, so a host can checkpoint, enforce budgets or hand work to another Agent.
- **Stable organization, dynamic work.** Graphs describe stable categories of work; current targets, dates and queue items are Facts resolved by stable host Actions, so the Graph never has to be rewritten per run.
- **Progressive disclosure as structure.** A thin Skill holds the bootstrap loop, evaluation returns summaries and each Route returns only its own resources as file locations with digests, never document bodies.
- **Observability without a mandatory runtime.** Evaluation can be stateless; an optional Run records events and outcomes at a path the host chooses.
- **Testability before autonomy.** Route tests assert which step a known state exposes, without calling a model.
<!-- /context:section -->

<!-- context:section id="mapping" -->
## How the principles become implementation

| Principle | Agent Graph implementation |
| --- | --- |
| External reality | Restricted fact checks and `satisfiedBy` |
| Boundary contracts | Strict JSON Schemas with closed object fields |
| Typed feedback | Eight distinct Outcomes |
| Progressive context | Required and recommended file Resource locations |
| Explicit authority | Gates plus session-scoped authority input |
| Recovery | Failure and repeat edges, Run events, checkpoint and resume |
| Explainability | Deterministic Evaluation and Route, inspection, digests |
| Stable reasons | Route reason codes plus an optional Code Catalog |
| Testability | Declarative state-to-route cases |
| Portability | Relative Provider references and host-selected stores |
| Supply-chain clarity | Action effects, reachable-file bundles, content digests |

Version 1 deliberately does **not** provide arbitrary expressions, self-modifying graphs, cross-Provider calls, model invocation or multi-Agent orchestration, parallel execution, edge-carried artifacts or shared mutable state, schedulers or durable timers, automatic trust in commands or third-party Skills, or semantic proof that an Agent's output is correct. Those limits keep it a standard and toolchain rather than another all-encompassing Agent framework.
<!-- /context:section -->
