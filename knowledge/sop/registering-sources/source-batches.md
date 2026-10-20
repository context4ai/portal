---
title: Choosing How to Add Material
description: Which way to add each kind of material — code, document folders,
  Lark documents, notes, conversation summaries, same-repository docs and
  Skills, or external entrances — and how to add many sources in one request.
type: Guide
timestamp: 2026-10-19T18:48:05.928Z
---
# Choosing How to Add Material

<!-- context:section id="goal" -->
Before the Agent can write anything, it needs to know which material it may read and cite. This subsection covers how to add each kind. Adding a source records what is in scope; it does not decide what to write — that comes later, in the [work-start report](../planning-and-production/start-reports.md).

Adding many sources is not the same as producing a large knowledge base. When the work spans more than 30 documents or needs real investigation of two or more repositories, the Agent plans it in stages first; see [Planning Large Projects in Stages](../planning-and-production/planning-large-projects.md).
<!-- /context:section -->

<!-- context:section id="material-kinds" -->
## Which way fits your material

| Your material | How it is added | Guide |
| --- | --- | --- |
| A code repository, or packages of a monorepo | Pinned to the commit the Agent reads | [Code Repositories](code-repositories.md) |
| Local Markdown files or a documentation folder | Captured as a snapshot that pages cite | [Document Directories](document-directories.md) |
| Lark documents and Wiki pages | Captured with their images, sheets, attachments and other embedded resources | [Lark Documents](lark-documents.md) |
| Text you already hold: an excerpt, a decision, an observation | Saved as a note | [Notes and Conversation Summaries](notes.md) |
| Conclusions from an Agent conversation | Saved as a conversation summary | [Notes and Conversation Summaries](notes.md) |
| Docs and Skills kept in the same repository as the knowledge workspace | Linked and cited in place, not copied | [Linking Existing Docs and Skills](same-repository-docs.md) |
| Sites, Skills, repositories or packages readers should be able to reach | Declared as an entrance to link to, not read as evidence | [External Entrances](external-entrances.md) |

If you are unsure, describe the material and what readers need from it; the Agent proposes the right kind and asks when the choice would change the scope.
<!-- /context:section -->

<!-- context:section id="checkpoint" -->
## Many sources in one request

You do not have to add sources one at a time. Name them all in one request:

```text
Add ../billing-service as code, ../docs/user-guide.md as product documentation,
and this Wiki page: https://example.larkoffice.com/wiki/example-token
```

The Agent registers them together in one batch, so they do not interfere with each other. A long registration keeps its progress as it goes: if it is interrupted, ask the Agent to continue, and it resumes from where it stopped, checking each source again against what is already registered rather than trusting what was recorded before the interruption. The commands behind this are in [CLI Commands](../../product/reference/context/cli-commands.md).
<!-- /context:section -->

<!-- context:section id="failure" -->
## If something fails

A failure keeps what already succeeded: sources before the failing one stay registered, and the Agent tells you which ones are done and which one failed, so you can fix that one and continue.

Only one registration can run in a knowledge workspace at a time. If the Agent is still busy with one, wait for it to finish instead of starting another. If a forced stop leaves the workspace blocked, ask the Agent to recover it before resuming.
<!-- /context:section -->
