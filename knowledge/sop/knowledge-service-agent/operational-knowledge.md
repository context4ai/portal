---
title: Operations Runbooks as Knowledge
description: How to turn operations runbooks into knowledge articles, use them
  through an Agent conversation, keep credentials out, and keep the runbooks
  current.
type: Guide
timestamp: 2026-10-19T18:48:05.928Z
---
# Operations Runbooks as Knowledge

<!-- context:section id="goal" -->
Operations procedures that drive command-line tools — deploying, rotating a cache, checking a service — can be written as knowledge articles and then used directly through an Agent conversation. The procedure is documented and usable in one place: people read it on the site, and a knowledge service Agent reads the runbook, runs the commands in its runtime and reports back when you ask.

```text
Follow our "restart a stuck consumer" runbook for the payments cluster and tell me what you find before changing anything.
```

How such an Agent is set up is in [Building a Knowledge Service](./building-a-knowledge-service.md).
<!-- /context:section -->

<!-- context:section id="capture" -->
## Getting the procedure into the knowledge base

Pick the source that matches where the procedure lives today:

- **Notes** for procedures that only exist in people's heads or chat threads. Save the steps as a note — original text, verbatim excerpts or a labeled summary — and the Agent turns it into a reader-facing article. Proposals stay proposals; the article does not turn them into facts. See [Notes and Conversation Summaries](../registering-sources/notes.md).
- **Existing docs in the repository** for runbooks and authored Skills already kept next to the code, such as under `docs/` or `.agents/skills/`. Link them as repository content: they keep evolving with the code, and Context references them instead of producing them again. See [Linking Existing Docs and Skills](../registering-sources/same-repository-docs.md).
- **Document sources** for runbooks maintained in a document system; see [Document Directories](../registering-sources/document-directories.md) and [Lark Documents](../registering-sources/lark-documents.md).

```text
Add our on-call runbooks under docs/runbooks as repository content, and save the steps from this thread as a note for the cache-flush procedure.
```

Write each procedure as concrete steps: the commands, the expected output, how to tell success from failure, and when to stop and ask a person.

If a Skill published elsewhere already covers the commands, link it from the article instead of copying its steps, by declaring it as an entrance; see [External Entrances](../registering-sources/external-entrances.md). An entrance is navigation only, so a conclusion that must stay traceable still needs its own source.
<!-- /context:section -->

<!-- context:section id="secrets" -->
## Variables, not values

Configure the environment variables a procedure needs in the Agent runtime. The knowledge names the variables only — never their values. Credentials stay on the server side and never enter knowledge, prompts or replies, so a procedure is safe to publish in a package or on a site.
<!-- /context:section -->

<!-- context:section id="maintain" -->
## Keeping runbooks current

When a procedure changes, update its source and ask the Agent to update the knowledge; it revises the affected article. If the source is right but the article misleads, revise only that page; see [Revising a Page](../review-and-revision/revising-a-page.md). When an article ends up more accurate than the document it came from, see [Writing Back Upstream](../updates-and-versions/writing-back-upstream.md) for keeping the two from drifting apart.
<!-- /context:section -->
