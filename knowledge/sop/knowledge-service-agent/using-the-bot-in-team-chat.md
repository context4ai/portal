---
title: Using the Bot in Team Chat
description: How a team works with a Context knowledge Bot in chat — message
  pattern, questions and reviews, answers with sources, capturing knowledge,
  patrols and boundaries.
type: Guide
timestamp: 2026-10-12T17:02:32.263Z
---
# Using the Bot in Team Chat

<!-- context:section id="goal" -->
These are the interaction patterns that proved to work when the Context Skills run behind a team chat Bot. They apply whether you build your own Bot or use the one planned for this site.

> **Status.** The community edition does not ship a Bot; this site's own Bot is planned. The patterns below come from running the Context Skills behind a team chat Bot.
<!-- /context:section -->

<!-- context:section id="messages" -->
## Messages: start, progress, result

- A task replies with three kinds of messages: **start**, **progress** and **final result**. Keep updating the same progress message instead of posting many.
- The Bot **asks only when someone must decide** — confirming a work-start report, confirming publication, choosing a scope — and offers selectable options. Nobody should have to reply with a code word or review code.
- When a reviewer finishes the diff report on the website, the workflow continues from there; there is no need to come back to chat to confirm.
- Maintainers should not have to think about committing the knowledge repository or publishing the package and site. These complete silently by default; the Bot interrupts only for a diff review, a permission problem or a disagreement.
<!-- /context:section -->

<!-- context:section id="answers" -->
## Answers people can check

- Every answer carries **clickable sources**: knowledge pages, code lines with their commit, and original documents. "According to the knowledge package" alone is too abstract to verify.
- Each answer has thumbs-up and thumbs-down ratings. Ratings and the conversation are used together to improve retrieval and prompts.
<!-- /context:section -->

<!-- context:section id="capture" -->
## Capturing knowledge while you talk

- When an answer is worth keeping, ask the Bot to capture it. The chat, a document you just shared, or a specific piece of code or merge request can all become sources; the Bot first proposes a plan, then runs the update flow. See [Capturing from Conversations](../updates-and-versions/capturing-from-conversations.md).
- You can also ask for an update of the whole knowledge base or part of it. The Bot analyzes what changed upstream in documents and code since the last update, presents an update plan, then a diff report against the website baseline.
- **Scheduled patrols** trigger at fixed times, track upstream changes and capture knowledge. A patrol prompt must state its scope, what to do when nothing changed, and which situations need a person. See [Scheduled Updates](../updates-and-versions/scheduled-updates.md).
<!-- /context:section -->

<!-- context:section id="speed" -->
## Speed

- **Cold start** is the main reason a first answer is slow. Preinstall the CLI, the knowledge packages and the Context knowledge workspace in the runtime so that sessions do not install and clone each time.
- **Read knowledge first**, and read originals remotely only when the evidence is not enough — fetch code by commit through Source Graph instead of cloning repositories in the sandbox. Measured effects are in [Knowledge Retrieval Benchmark](../../architecture/benchmark/knowledge-retrieval.md).
- Simple questions still have room to improve; the target is an answer within a minute.
<!-- /context:section -->

<!-- context:section id="boundaries" -->
## Boundaries for a public Bot

- Public visitors may only ask questions. Production, updates and publication are open to maintainers only, enforced by the service layer.
- The Bot reads only registered public sources. Credentials stay on the server and never enter knowledge, prompts or replies.
- Prefer a long-connection event subscription to connect the chat platform; it needs no public callback address.
<!-- /context:section -->
