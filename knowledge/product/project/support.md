---
title: Support
type: Wiki
description: Where to ask questions, how to report a bug with the details
  maintainers need, which releases receive fixes, and how to report a
  vulnerability privately for Context and Agent Graph.
timestamp: 2026-10-12T20:24:32.970Z
---
# Support

<!-- context:section id="channels" -->

Pick the channel that matches the request:

| Need | Context | Agent Graph |
| --- | --- | --- |
| Usage, integration or design question | [Discussions](https://github.com/context4ai/context/discussions) | [Discussions](https://github.com/context4ai/agent-graph/discussions) |
| Reproducible defect | [Bug report](https://github.com/context4ai/context/issues/new/choose) | [Bug report](https://github.com/context4ai/agent-graph/issues/new/choose) |
| Suspected vulnerability | [Private report](https://github.com/context4ai/context/security/advisories/new) | [Private report](https://github.com/context4ai/agent-graph/security/advisories/new) |

Agent Graph Discussions also take ideas that are not yet actionable. Both projects point to this site first, and the answer is often already here: [Installation](../getting-started/installation.md) for setup checks, [Asking Questions](../../sop/querying-knowledge/asking-questions.md) for querying knowledge, and the [FAQ](../../faq/context-faq.md).

<!-- /context:section -->

<!-- context:section id="diagnose" -->
## Check before reporting

- **Installation.** `context --version` and `context plugin status` confirm the CLI and the host plugins. If an entry is present but the `context` executable is missing, the entry names the installation step to run.
- **Workflow state.** `context status --format json` shows the current Route, its reason code and diagnostics. Resume from that Route rather than repeating an earlier command.
- **Traces.** `context debug enable` records workspace-local traces under `.tmp/context-runtime/debug/`, and `context debug export` builds a replay you can inspect; see [CLI Commands](../reference/context/cli-commands.md).
- **Agent Graph.** `npx @c4a/agent-graph validate --format json` loads the whole Provider and returns a structured error without side effects, and the Graph tests replay Routes without a host, which makes a minimal reproduction easy to share; see [Testing and Publishing](../../sop/agent-graph/testing-and-publishing.md).
<!-- /context:section -->

<!-- context:section id="bug-reports" -->

## What to include in a bug report

| Context | Agent Graph |
| --- | --- |
| Context version (`context --version`) and installation mode | Agent Graph version |
| Node.js and Bun versions | Node.js and Bun versions |
| The Agent host, such as Claude Code, Codex or Cursor | |
| The command or entry you ran | The command you ran |
| Sanitized diagnostic output | The complete error output, secrets removed |
| | A minimal Provider or Graph, when possible |

Keep private material out of public Issues. For Context, do not publish source documents, review payloads, credentials, private paths or knowledge generated from a private workspace; reduce the case to neutral content instead.

<!-- /context:section -->

<!-- context:section id="security" -->
## Security

Do not open a public Issue for a suspected vulnerability. Both projects use GitHub's private vulnerability reporting (links above). Include:

- the affected version and component;
- reproduction steps or a proof of concept;
- the security impact;
- any suggested mitigation;
- whether the issue has been disclosed elsewhere.

Context applies security fixes to its latest published release; Agent Graph, which is pre-1.0, applies them to its latest published minor line, so upgrade before reporting if you can. Agent Graph maintainers aim to acknowledge a report within five business days and, after validation, coordinate the fix, disclosure timing and credit with the reporter.

In scope are unsafe file access, command execution, path traversal, credential or source disclosure, authority and trust-boundary bypasses, integrity failures of packages and build artifacts, and — for Context — review-gate bypasses. Vulnerabilities can be in any published part: the CLI, SDK, extractors, plugins, schemas or artifacts. General questions and ordinary bugs belong in Discussions or Issues.
<!-- /context:section -->
