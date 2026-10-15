---
title: Operational Knowledge
description: How to write CLI-driven operations procedures as knowledge articles
  and run them through an Agent conversation without exposing credentials.
type: Guide
timestamp: 2026-10-15T03:52:07.709Z
---
# Operational Knowledge

<!-- context:section id="goal" -->
Operations skills that drive command-line tools — deploying, rotating a cache, checking a service — can be written as knowledge articles and then used directly through an Agent conversation. A knowledge service Agent reads the runbook, runs the commands in its runtime and reports back, so the procedure is documented and executable in one place.
<!-- /context:section -->

<!-- context:section id="capture" -->

## Getting the procedure into the knowledge base

Pick the source that matches where the procedure lives today:

- **Notes** for procedures that only exist in people's heads or chat threads. Save the steps as a note — original text, verbatim excerpts or a labeled summary — and let the Note Indexer turn it into a reader-facing article. Proposals stay proposals; the article does not turn them into facts. See [Notes](../registering-sources/notes.md).
- **Same-repository docs** for runbooks and authored Skills already kept next to the code, such as under `docs/` or `.agents/skills/`. Register them as repository content: they keep evolving with the code and Context references them instead of producing them again. See [Referencing Same-Repository Docs and Skills](../registering-sources/same-repository-docs.md).
- **Document sources** for runbooks maintained in a document system.

Write each procedure as concrete steps: the commands, the expected output, how to tell success from failure, and when to stop and ask a person.

<!-- /context:section -->

<!-- context:section id="secrets" -->
## Variables, not values

Configure the environment variables a procedure needs in the Agent runtime. The knowledge names the variables only — never their values. Credentials stay on the server side and never enter knowledge, prompts or replies, so a procedure is safe to publish in a package or on a site.
<!-- /context:section -->

<!-- context:section id="maintain" -->
## Keeping runbooks current

When a procedure changes, update its source and let the normal update flow revise the article. If the source is right but the article misleads, revise only that page. When an article ends up more accurate than the document it came from, see [Writing Back Upstream](../updates-and-versions/writing-back-upstream.md) for keeping the two from drifting apart.
<!-- /context:section -->
