# Getting-started guidance (maintainers, 2026-10-15)

This note records guidance from Context maintainers for the Portal getting-started pages. It contains no internal platforms, people, links or business rules.

## What Context is best at

- Context's main strength is helping a team build systematic knowledge step by step from the documents and repository code it already has, taking it from nothing to a complete knowledge base.
- It suits knowledge that has to keep evolving with the code over a long time.
- To start a complex knowledge base for a whole domain or business, begin with Plan mode; see the "Planning a Large Project" guide.

## Token cost, from experience

- A knowledge base of about 200 documents used roughly 600M input tokens (about 97% served from cache) and about 6M output tokens. At Opus 5.5 API prices that averages $1–2 per document.
- This is the estimated cost of the first build. With a subscription quota (for example a Claude or GPT Max 20 plan) it drops to about 20% of that.
- In practice, do the first build locally and push the knowledge repository, then run later additions and iterations remotely.
- Once the knowledge base exists, updating a page costs about $0.1–0.2 each time, and answering a question averages $0.2–0.3.

## Reading order for newcomers

- Read "The Workflow at a Glance" before installing, so the shape of a task is clear. Installation happens once per machine (or remote Agent environment), not once per task.
- A task has two decisions that belong to the user: confirming the work-start report and approving the review. Everything else the Agent does from the workflow.
- Quick Start should show only what the user says; the Agent runs the commands. After the first build, asking a first question against the new knowledge is the natural next step, before publishing.
- An interrupted task resumes from the workspace's recorded state when the user invokes the Context entry again; nothing is redone.
