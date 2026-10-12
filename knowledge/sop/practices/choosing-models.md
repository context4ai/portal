---
title: Choosing Models
description: Which kind of model to use for each part of Context production and
  querying, and how much model choice affects answer time.
type: Guide
timestamp: 2026-10-12T17:02:32.263Z
---
# Choosing Models

<!-- context:section id="goal" -->
Context works with whichever model your Agent runs, but the choice changes speed and cost a lot. The roles below come from teams' experience; the model names are examples of each role at the time of writing, not endorsements.
<!-- /context:section -->

<!-- context:section id="roles" -->
## Four roles

| Role | Example | Use it for |
| --- | --- | --- |
| **Primary** | Claude Opus 5.5 | First creation, everyday production and querying. Roughly two to three times faster than the others, and in practice it consumes less. |
| **Balanced** | GPT 5.6 SOL, Grok 4.6 | Moderate speed and cost; text, code and medium-intensity code exploration. |
| **Low-cost and fast** | DeepSeek 4.1 Flash | Processing documents meant for people and summarizing code. |
| **High-end** | GPT 6.0 Astra | Planning the first build of a very large knowledge base and deep attribution in code. Expensive. |

For large work you do not need to orchestrate several Agents yourself: Context's built-in multi-Agent scheduling runs the work in parallel.
<!-- /context:section -->

<!-- context:section id="evidence" -->
## How much it matters when answering

In one benchmark run, with the same knowledge and the same retrieval method, two models both fully resolved 23 of 24 questions — but one averaged 139.3 seconds and the other 304.0 seconds, about 2.2 times as long. At equal quality, model choice can more than double answer time.

This is a single run on one question set, so treat it as an indication rather than a ranking. The method and its limits are in [Knowledge Retrieval Benchmark](../../architecture/benchmark/knowledge-retrieval.md); to measure your own setup, see [Evaluating Your Knowledge Base](./evaluating-your-knowledge-base.md).
<!-- /context:section -->
