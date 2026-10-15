---
title: Skills
description: Every Skill in the Context Agent plugin — who starts it, when it
  activates, what it hands off to, and how each host spells it.
type: Wiki
timestamp: 2026-10-15T03:52:07.709Z
---
# Skills

<!-- context:section id="goal" -->
The Context Agent plugin contains nine Skills. Four are **entries** you invoke, one is an **authoring assistant** you start in plain language, and four are **Indexers** the workflow selects. All of them leave workspace state and lifecycle decisions to the `context` CLI. For a short tour aimed at first-time users, see [Commands and Skills](../../getting-started/commands-and-skills.md).
<!-- /context:section -->

<!-- context:section id="entries" -->

## Entries

| Skill | Activates when | Does | Hands off to |
| --- | --- | --- | --- |
| `context` | You invoke Context explicitly, ask to reorganize an existing knowledge map or site navigation, or continue an active Context workflow to build, inspect, update, recover or package knowledge | Creates or continues a Context knowledge workspace and follows the CLI's current Route through production, review, update and build | The CLI; Indexers selected for each stage |
| `context-plan` | You ask for project planning or continue a `PLAN-*.md`, or an authorized Context task involves more than 30 source documents or substantive investigation of at least two repositories | Researches in temporary storage and writes a root `PLAN-YYYYMMDD-topic.md` for review, then runs the project one stage at a time | `context`, which performs each stage |
| `context-inspect-search` | You ask a knowledge question, or a host or Bot configuration routes questions here | Answers from knowledge packages or approved knowledge and traces answers to their sources; read-only, no workspace required | `context` for accepted improvement suggestions |
| `context-repo-content` | You want Context to reference docs and authored Skills already maintained in the same repository, or to create or edit them | Maintains `repo-content.yaml` and its symlink view, keeping one original in its project directory; never starts production, builds, publishes or commits | — |

None of them starts on its own for ordinary planning, design or coding.

<!-- /context:section -->

<!-- context:section id="authoring" -->
## Authoring assistant

| Skill | Activates when | Does |
| --- | --- | --- |
| `context-indexer-create` | You explicitly ask to create a new Indexer Skill for code, documents, notes or session summaries | Writes a reusable Skill into the directory you choose; does not initialize a workspace or start production. It has no menu command — ask in plain language. See [Creating an Indexer](../../../sop/custom-indexers/creating-an-indexer.md). |
<!-- /context:section -->

<!-- context:section id="indexers" -->
## Indexers

| Skill | Interprets | Selected |
| --- | --- | --- |
| `context-code-indexer` | Code skeletons of an authorized module, to write source-grounded articles | For the current planning or writing task — not as a standalone repository audit |
| `context-markdown-indexer` | Outlines of captured documents | For the current authorized planning or writing task — not as an import workflow |
| `context-note-indexer` | Saved notes, excerpts and observations | When the current authorized task selects it — not for importing sources or scanning conversation history |
| `context-sessions-indexer` | Saved conversation summaries | When the current authorized task selects it — same limits as notes |

Installing an Indexer makes it discoverable, not enabled for every workspace: the Agent chooses Indexers for the current sources and requirements, and the CLI supplies task directories and checks every source reference. Indexers are installed without a plugin namespace, so their names are the same in every host. See [Community Indexers](../../../sop/custom-indexers/community-indexers.md).
<!-- /context:section -->

<!-- context:section id="hosts" -->

## Host spelling

| Host | Entries |
| --- | --- |
| Claude Code | `/c4a:context`, `/c4a:context-plan`, `/c4a:context-inspect-search`, `/c4a:context-repo-content` |
| Cursor | `/c4a-context`, `/c4a-context-plan`, `/c4a-context-inspect-search`, `/c4a-context-repo-content` |
| Codex | Skills by name: `context`, `context-plan`, `context-inspect-search`, `context-repo-content` |

A local install into one repository with `context plugin install --local` has no plugin namespace; the host discovers the entries in its own directory. Restart the Agent session after installing or updating the plugin.

<!-- /context:section -->
