---
title: Scoring and Timing Standard
description: The single set of rules for grading, calibrating, counting and
  timing a knowledge base evaluation — two primary metrics, material errors,
  four grades, fairness and counterexamples, grader calibration, denominators,
  end-to-end timing, percentiles, tool calls and run evidence — and the industry
  methods they draw on.
type: Guide
timestamp: 2026-10-19T18:48:05.928Z
---
# Scoring and Timing Standard

<!-- context:section id="overview" -->
This page is the rulebook for [Evaluating Your Knowledge Base](./evaluating-your-knowledge-base.md), and the one place where grading, calibration and timing rules are defined. Use it as written, or adapt it and say what you changed. It covers how one answer is graded, how graders are checked, how grades become rates, and how time, tool calls and run evidence are recorded. [Knowledge Retrieval Benchmark](../../architecture/benchmark/knowledge-retrieval.md) applies it.
<!-- /context:section -->

<!-- context:section id="industry" -->
## Industry methods it draws on

The standard borrows ideas from published work. The four grades, sampling and recording conventions are choices made for this project, not an industry-wide standard.

| Source | What was borrowed |
| --- | --- |
| [SimpleQA](https://openai.com/index/introducing-simpleqa/) (OpenAI) | Classify answers as correct, incorrect or not attempted, and count "not attempted" separately so refusals are neither errors nor successes. |
| [FACTS Grounding](https://deepmind.google/blog/facts-grounding-a-new-benchmark-for-evaluating-the-factuality-of-large-language-models/) (Google DeepMind) | First judge whether the answer addresses the request, then check its factual grounding — two separate judgements. |
| [Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) (Anthropic) | Grade an Agent by its outcome rather than a fixed tool order or path; keep the full trace to explain the result. |
| [Ragas Factual Correctness](https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/factual_correctness/) and [Faithfulness](https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/faithfulness/) | Distinguish "agrees with the reference facts" from "agrees with the retrieved material": material can be stale or miss a condition, so faithfulness is not correctness. |
| [Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena](https://arxiv.org/abs/2306.05685) | Model judges show position, verbosity and self-preference bias; swap order, anonymize and check with calibration samples. |
| Nearest-rank percentile | P90 is the ⌈0.9 × n⌉-th sorted sample, so the figure is always a real, checkable run. |
<!-- /context:section -->

<!-- context:section id="metrics" -->
## Two primary metrics and material errors

| Metric | What is judged | Recorded value |
| --- | --- | --- |
| Core-conclusion correctness | Do the key conclusions given hold within the question's scope? Is a condition missing that makes them misleading? | correct / material error / no gradable conclusion / pending |
| Request fulfilment | Was what the user asked for actually delivered? Judged only against the question and its necessary context. | full / partial / not met / pending |

Material errors are recorded separately as yes, no or pending. For a yes, record the exact claim, the evidence against it and its effect on the user's judgement or action. Any one of these, once confirmed, is a material error:

1. the core conclusion is wrong;
2. a key recommendation would lead the user to do the wrong thing;
3. deciding evidence is fabricated;
4. an unverified live situation is asserted as confirmed fact;
5. a necessary condition is left out, turning the answer into a wrong unconditional statement.

Typos and minor wording issues that change no judgement or action are only noted. A correct main conclusion with a materially wrong side recommendation is still a material error. Correct but irrelevant extra information earns nothing.
<!-- /context:section -->

<!-- context:section id="grades" -->
## Four grades and the grading order

| Grade | Rule |
| --- | --- |
| Fully resolved (`resolved`) | Core conclusion correct, request fully met, nothing materially misleading. |
| Partially resolved (`partially_resolved`) | Useful, correct content delivered, but part of the request or a needed fact is missing; no confirmed material error. |
| Material error (`material_error`) | The core conclusion or a key recommendation is materially wrong, including misleading unconditional generalizations and fabricated deciding evidence. |
| Not resolved (`unresolved`) | No substantive answer — only a plan, only a request for more information, or "cannot answer". A wrong refusal that itself contains a confirmed key error is still a material error. |

**Order:** first look for confirmed material errors, then judge coverage of the request. Correct content does not offset a key error.

**Pending verification** (`pending_verification`) is a review state, not a fifth grade. When a deciding fact cannot be checked yet, keep the check open and do not grade; never record it as pass or fail. If existing evidence already confirms a material error, grade it directly. **Needs more information** is an interaction state that can coexist with a grade: only asking questions is not resolved; answering part and then asking can be partially resolved.
<!-- /context:section -->

<!-- context:section id="fairness" -->
## Fairness rules

- Accept semantically equivalent short answers, long answers, lists, tables and different valid evidence paths. Check meaning and facts; do not match the reference text, fixed wording, headings or tool order. Form gains or loses nothing unless it actually hinders understanding, hides a key condition or creates ambiguity.
- A condition is necessary only if it changes the conclusion or what the user does. Do not universally require version fields, full call chains, parameter flows, edge-case lists or next steps.
- For "how do I debug this", the actionable method, prerequisites and steps are the deliverable; how the Agent searched need not appear.
- For "list all", check the complete set within the question's scope — a few correct examples may be only partial. Side topics the user did not ask about are not omissions.
- The user's assumptions, counts or terms may be wrong. Correcting the premise accurately and answering the real question can be fully resolved.
- Separate static rules from live facts. Honestly admitting an evidence gap is not an error, but the unfinished part of the request is still recorded.
- Missing citations, an unshown process or a short reply are not grounds for calling a conclusion wrong. Sources are a deliverable only when the user or the shared test protocol asks for them, told identically to every setup. Volunteered citations are checked for existence and support, not counted for points; a temporarily unreachable link is not fabrication. Local evidence existing, a link path being correct, and the link opening for the user's account are three different checks.
<!-- /context:section -->

<!-- context:section id="counterexamples" -->
## Using counterexamples

The grader asks: within the question's scope, is there an evidenced case that overturns a deciding claim, or shows that an omission would change the user's judgement? The counterexample must belong to the question's scope and affect the conclusion — do not widen the question on the fly. The answer need not contain a "counterexamples" section; a correct condition or scope statement is enough. Not mentioning a branch is not itself an error. An answer that keeps its scope and generalizes nothing wrongly but skips part of the request is partially resolved.
<!-- /context:section -->

<!-- context:section id="calibration-examples" -->
## Three calibration patterns

These patterns are rewritten from real grading decisions with every business detail removed.

**A definition existing is not a call happening.** *Where does the front end call an old endpoint?* The code keeps a request wrapper and a monitoring list registers the address, but nothing in the checked scope calls it; pages now use a newer endpoint.

- Saying "no business call was found in the checked scope" fully resolves it.
- Listing the wrapper without judging whether it is called is partial.
- Treating the monitoring entry as a request, or claiming the endpoint is absent from the code entirely, is a material error.
- Only suggesting searches is not resolved.

Lesson: grade the real meaning and the user's intent, allow correcting the premise, and never score by how often an address appears.

**Role differences are also gated by state and permission.** *What can an owner do on a list page that a non-owner cannot?* In reality each action has its own conditions — role, workflow state, item type — and a detail entry is further controlled by a switch and an organization grant, so non-owners may also reach it.

- Stating the differences with their conditions fully resolves it.
- "Non-owners see no actions" or "owners can always act" is a material error.

Lesson: counterexamples test unconditional generalizations. Necessary conditions come from the question's scope; the answer need not show the grader's whole control chain.

**An outer choice and an inner data switch are different layers.** *When the current workflow is the new version, does viewing an old snapshot bring back the old interface?* The parent page picks a component from the *current* workflow; switching history inside it only changes the data. Only a different component renders history by its own version, and a revision number is not a version generation.

- Explaining both layers fully resolves it.
- Asserting that history always restores the old interface, or treating the revision number as the generation, is a material error.

Lesson: when existing knowledge misses the parent-level condition, go back to the source and correct the criteria — do not treat a knowledge page as the answer key.
<!-- /context:section -->

<!-- context:section id="reviewers" -->
## Grader calibration and review

- Give each answer a random alias per question and record the seed. First-pass grading hides setup, time, tool count and earlier scores. Links or wording inside an answer can still reveal its origin, so state that anonymity is limited.
- Check consistency with separate calibration samples: the same facts short and long, as a paragraph and as a table, should get the same grade, and swapping the display order of two answers should not change the judgement. Store calibration samples apart from the real questions.
- Review every material error, pending item, partial resolution and borderline call, and spot-check full resolutions. Graders give reasons someone else can check; length, style, tool order and whether the process is shown are not universal plus or minus points.
- With only model graders and no human-labelled samples, call it an *internal consistency review*, never human calibration.
<!-- /context:section -->

<!-- context:section id="statistics" -->
## Denominators and statistics

- With Q frozen questions and R repeats, each configuration plans **N = Q × R** runs. Every grade rate divides by N; a partial resolution is never counted as half.
- Grade counts + pending + not run = N. Graded coverage = runs placed in one of the four grades ÷ N.
- A delivery failure or timeout with no answer is graded not resolved, and the platform, tool or cancellation reason is kept; it is not automatically a knowledge error.
- The default is three runs per question. A question counts toward the **stable-resolution count** only if all three runs are fully resolved; with single runs, do not report a stable-resolution rate.
- Compare performance on all questions *and* on the **common subset** every setup fully resolved, showing each denominator, so setups are not compared on different, easier questions.
- Label every improvement figure as **measured**, **conditional estimate** (with formula and assumptions) or **untested direction**.
<!-- /context:section -->

<!-- context:section id="timing" -->
## Timing

- **Primary end-to-end (E2E) time** = when the tester received the complete final answer − when the question was submitted. It includes network, platform initialization, retrieval, tools, polling and delivery. Unit: seconds.
- Keep full timestamps with time zone. Across systems, state clock skew and precision; a missing value is never 0.
- Startup, first progress, first token, model text finished, runner finished and user received the final answer are different events. Name each by what was actually captured and never substitute one for another. A first progress message is not the final answer, and a task marked done still needs its answer confirmed as delivered.
- If only platform creation and final send receipts exist, report a separate **platform E2E** marked as a proxy; never mix it with receiver-side E2E.
- Agree the timeout before running; 600 seconds is a reasonable default. It is an execution limit, not a business target. Record the actual stop time for a timeout and give a re-run its own run ID; a timeout is never a successful 600-second sample. Failures without a final answer are not latency samples of successful delivery, but their rate and waiting time must be shown.
- **Mean** = sum of same-definition times ÷ sample count. **P50** = median (average of the middle two for an even count). **P90** = nearest-rank, the ⌈0.9 × n⌉-th sorted value. Always show the sample count; with repeats, also report each question's median.
<!-- /context:section -->

<!-- context:section id="tools" -->
## Tool calls, run evidence and channel overhead

- Count tool calls by unique call ID and state the coverage — events the platform exposes; internal calls of unexposed sub-Agents are not counted. One shell call may run several commands. Tool calls describe the execution path; they are not model calls or tokens. The span from first to last tool event includes reasoning, waiting and concurrency, so do not call it pure tool time.
- For every attempt, keep the start and end timestamps with time zone, task or session IDs and links, the complete final answer, the raw tool events, the status, timing precision and any anomaly.
- Keep original receipts for platform failures, timeouts, cancellations, quota refusals and retries. Link an extra run to the attempt it repeats; never replace a result with the best one. When a question needs the user to supply more information, define one multi-turn protocol for all setups and label ad hoc follow-ups and resumes.
- **Channel overhead:** an Agent configured for a chat channel — for example one that assembles reply cards — may still detect the channel, read card instructions and resolve links when called directly. For pure question answering, switch to a reply policy suited to direct calls, or record and exclude that overhead.
<!-- /context:section -->
