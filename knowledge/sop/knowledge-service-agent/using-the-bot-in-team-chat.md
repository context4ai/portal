---
title: Using the Bot in Team Chat
description: How a team works with a Context knowledge Bot in chat — what to
  ask, what you see in the thread, answers with sources, saving knowledge, speed
  and boundaries.
type: Guide
timestamp: 2026-10-19T18:48:05.928Z
---
# Using the Bot in Team Chat

<!-- context:section id="goal" -->
A knowledge Bot in team chat runs the same Context Skills you use locally, so one Bot can answer questions, start production and updates, and take people through report reviews. These are the interaction patterns that work well when the Context Skills run behind a team chat Bot. Setting up the service behind it is covered in [Building a Knowledge Service](./building-a-knowledge-service.md); this page is about using it day to day.
<!-- /context:section -->

<!-- context:section id="asking" -->
## What to ask

Ask the Bot the way you would ask a colleague who has read the team's knowledge:

```text
@Bot What does this knowledge base cover, and where is its website?
@Bot Why does <feature> reject <case>? Show me the code and the document that define it.
@Bot How do I install this knowledge package in my Agent?
```

The Bot reads the team's approved knowledge first and goes back to the original code and documents only when the knowledge leaves a real gap. How to phrase a question so the answer comes back precise is in [Asking Questions](../querying-knowledge/asking-questions.md). Installing the same knowledge in your own Agent is in [Using a Package in Your Agent](../querying-knowledge/using-packages-in-agents.md).
<!-- /context:section -->

<!-- context:section id="messages" -->
## What you see in the thread

- A task replies with three kinds of messages: **start**, **progress** and **final result**. The Bot keeps updating the same progress message instead of posting many.
- The Bot **asks only when someone must decide** — confirming a work-start report, confirming publication, choosing a scope — and offers selectable options. Nobody has to reply with a code word or review code. See [Confirming the Work-Start Report](../planning-and-production/start-reports.md).
- When you finish reviewing the diff report on the website, the workflow continues from there; you do not need to come back to chat to confirm.
- Committing the knowledge repository and publishing the package and site complete without interruptions. The Bot stops only for a diff review, a permission problem or a disagreement.
<!-- /context:section -->

<!-- context:section id="answers" -->
## Answers people can check

- Every answer carries **clickable sources**: knowledge pages, code lines with their commit, and original documents. "According to the knowledge package" alone is too abstract to verify.
- Each answer has thumbs-up and thumbs-down ratings. Ratings and the conversation are used together to improve retrieval and prompts.
<!-- /context:section -->

<!-- context:section id="capture" -->
## Saving what you learned

When an answer is worth keeping, ask the Bot in the same thread to save it as knowledge. The chat, a document you just shared, or a specific piece of code or merge request can all become sources.

```text
@Bot Save the conclusion of this thread as knowledge, and include the document I just shared.
```

The Bot first proposes a plan, runs the update, then gives you a diff report against the website. Read the report, then either send revision notes or confirm; publishing then completes on its own. What to look for is in [Reading Review Reports](../review-and-revision/reading-review-reports.md), and how a conversation becomes a source is in [Capturing from Conversations](../updates-and-versions/capturing-from-conversations.md).

You can also ask for an update of the whole knowledge base or part of it. The Bot works out what changed upstream in documents and code since the last update, presents an update plan, then a diff report against the website.

**Scheduled patrols** run at fixed times, track upstream changes and capture knowledge. A patrol prompt must state its scope, what to do when nothing changed, and which situations need a person. See [Scheduled Updates](../updates-and-versions/scheduled-updates.md).
<!-- /context:section -->

<!-- context:section id="speed" -->
## Speed

- **Cold start** is the main reason a first answer is slow. Preinstall the CLI, the knowledge packages and the knowledge workspace in the runtime so that sessions do not install and clone each time.
- **Read knowledge first**, and read originals remotely only when the evidence is not enough — fetch code by commit through Source Graph instead of cloning repositories in the sandbox. Measured effects are in [Knowledge Retrieval Benchmark](../../architecture/benchmark/knowledge-retrieval.md).
- The target for a simple question is an answer within a minute.
<!-- /context:section -->

<!-- context:section id="boundaries" -->
## Boundaries for a public Bot

- Public visitors may only ask questions. Production, updates and publication are open to maintainers only, enforced by the service layer.
- The Bot reads only registered public sources. Credentials stay on the server and never enter knowledge, prompts or replies.
- Prefer a long-connection event subscription to connect the chat platform; it needs no public callback address.
<!-- /context:section -->
