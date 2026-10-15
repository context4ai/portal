---
title: Migrating an Existing Knowledge Base
description: How to move an existing LLM Wiki, Skills collection or similar
  knowledge base into Context without losing what it already does well.
type: Guide
timestamp: 2026-10-15T03:52:07.709Z
---
# Migrating an Existing Knowledge Base

<!-- context:section id="goal" -->
If you already have a knowledge base — an LLM Wiki, a set of Skills, a documentation folder — you do not have to start from nothing. Create a Context knowledge workspace, describe the existing base to the Agent, and let it plan the migration up to the work-start report, where you review the approach and decide the batches.
<!-- /context:section -->

<!-- context:section id="prompt" -->
## The migration prompt

Once the workspace exists, start with:

```text
Research what Context can do, then migrate the current knowledge base:

- Location, content and document scope of the current knowledge base:
- How it is produced today (scripts, prompts, and so on):
- Desired published structure and form: keep it as is, or new requirements
- Historical Q&A or an evaluation question set, to show how the knowledge base is used

Turn this into a research report, continue up to the work-start report and pause.
I will review the approach and plan the batches.
```

The last item matters most: real questions tell the Agent what the knowledge base is *for*, and they become your evaluation set later.
<!-- /context:section -->

<!-- context:section id="sources" -->

## Bringing the existing material in

Existing material can be connected in different ways, depending on whether it should become a source of new articles or stay where it is:

- **Document directories** — register a folder of existing documents as a source so its contents are captured and cited. See [Document Directories](../registering-sources/document-directories.md).
- **Same-repository docs and Skills** — documents and authored Skills already kept in the same repository are registered as repository content; the originals stay where they are and keep evolving with the project, and Context references them instead of migrating them. See [Referencing Same-Repository Docs and Skills](../registering-sources/same-repository-docs.md).
- **External entrances** — content elsewhere that pages should link to, declared in `imports.yaml` without downloading or capturing it. See [External Entrances](../registering-sources/external-entrances.md).

<!-- /context:section -->

<!-- context:section id="validate" -->
## Switch over after you have measured

Keep the old knowledge base running until the new one is proven. Run the same question set against both and compare quality, time and tool calls, as described in [Evaluating Your Knowledge Base](./evaluating-your-knowledge-base.md).
<!-- /context:section -->
