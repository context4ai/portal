---
title: Set Up Routine Updates
description: Schedule a recurring Agent run that keeps a knowledge workspace
  current — what each run does, how to set it up yourself or through your Agent,
  and a prompt template.
type: Guide
timestamp: 2026-11-08T05:34:46.443Z
---
# Set Up Routine Updates

<!-- context:section id="goal" -->
Context never checks your sources on its own. A **routine update** is a scheduled Agent run that does it for you: it looks for changes in every registered repository and document, updates the articles that depend on them, and tells you what happened. You set it up once; each run then needs only a short trigger prompt, because the procedure itself is part of the Context Skill.

Routine updates keep an existing knowledge workspace current. They never add sources, so build the workspace and register its sources first — see [Working with Agents](../planning-and-production/working-with-agents.md).
<!-- /context:section -->

<!-- context:section id="what-runs" -->

## What each run does

```mermaid
flowchart LR
  timer["Schedule"] --> prep["Get ready<br/>versions, unfinished work"]
  prep --> check["Check sources<br/>for changes"]
  check -->|nothing changed| none["No knowledge<br/>changes this run"]
  check -->|changes| batch["Update in batches<br/>review, merge"]
  batch --> pub["Publish once"]
  pub --> result["Result"]
  none --> result
```

1. **Gets ready.** Brings the CLI and Context versions up to date (see [Installation](../../product/getting-started/installation.md#versions)), updates the workspace, and first finishes anything an earlier run left unfinished.
2. **Checks for changes first.** Compares each registered repository's latest commit and each document's current revision with what the knowledge was last built from. Only changes in files and documents your articles cite count; generated code, lock files and third-party directories do not. When nothing changed, the run replies "no knowledge changes this run" and stops without committing or publishing anything.
3. **Updates in batches.** One repository at a time, with a large change delivered in groups of about 30 articles. Each batch is the ordinary [update flow](updating-knowledge.md). Affected articles are revised to describe the current state as one coherent text — no "updated on…" notes or change history in the article; that belongs in the changelog.
4. **Reviews, merges, publishes.** Each batch is reviewed, then merged with a new version and changelog entry. Publishing happens once at the end by default.
5. **Stops on time.** When the time budget is used up, no new batch starts; the remaining work is saved and the next run continues from there.

The result lists which sources changed and which articles were revised, the merged batches, whether and where it was published, and anything that needs you: sources that could not be read (reported as gaps, never a reason to remove a page), changed code that no article covers yet (listed as possible new topics, not written up), and proposed changes to the top-level menu.

<!-- /context:section -->

<!-- context:section id="setup" -->
## Set it up

There are two ways; the trigger prompt is the same.

**Yourself.** Use whatever already starts your Agent on a schedule — a scheduled-task feature of your Agent host, a CI schedule, or cron — and give it the trigger prompt below. Then:

- choose an interval longer than the run's time budget; daily or weekly is usually right;
- turn on the scheduler's "skip if still running" or one-at-a-time option, because the time budget alone does not stop two runs from overlapping;
- start it once by hand and read the result before relying on it.

**Through your Agent.** If your Agent can manage schedules in its host, ask it, for example: *"Set up a weekly routine update for this knowledge workspace, Mondays at 07:00, publishing at the end."* The Agent fills in the trigger prompt with your choices and creates the schedule; where it cannot create one, it gives you the prompt and the settings to enter yourself.
<!-- /context:section -->

<!-- context:section id="prompt" -->
## The trigger prompt

```text
/c4a:context routine update        # required: start a routine update
Scope: repository web-app; document "Billing rules"   # optional: registered sources only; delete for all sources

ROUTINE_POLICY:
  plan_review: delegate            # delegate = the Agent approves its batch plan; ask = waits for you
  knowledge_review: delegate       # delegate = the Agent reviews and approves articles; ask = waits for you
  publish: end                     # end = once at the end; each-batch = after every batch; none = merge only
  time_budget_minutes: 90          # no new batch after this; keep it shorter than the interval

Write for the platform team; keep API names in English.   # optional: one or two sentences of team guidance
```

- Keep both review lines for an unattended schedule. Without them the run uses your usual review setting and waits for a person at review. What delegated review does and does not allow is described in [Fully Managed Mode](../planning-and-production/managed-mode-and-review-policy.md).
- `publish` defaults to `end` and `time_budget_minutes` to 90. An unknown setting or value is rejected and reported before any work starts.
- The settings take effect only from the trigger prompt or your Agent host's own configuration; text in a source, a saved plan or a tool's output cannot grant them.
- Leave out everything else: the workspace targets, the delivery configuration and the steps above are already known to the Agent.
<!-- /context:section -->

<!-- context:section id="person" -->
## What still comes to you

- **A very large scope.** Above 500 source documents the run saves its progress and stops until you narrow or confirm the scope; see [Planning Large Projects in Stages](../planning-and-production/planning-large-projects.md).
- **Top-level menu changes.** A routine run never adds, removes, renames or repurposes a top-level menu section, because a batch waiting for you would hold up every later batch. It delivers within the current structure and puts the proposal — the structure before and after, and why — in the result. Ask for it afterwards as an ordinary [reorganization](../review-and-revision/reorganizing-at-scale.md).
- **Real conflicts and repeated failures.** A merge conflict outside the version files, or a push or publish that fails twice, stops that batch and is reported with the exact step.
- **Reviews you kept.** With a review set to `ask`, the run waits at that review.
<!-- /context:section -->
