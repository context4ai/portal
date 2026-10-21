---
title: Choosing Models
description: Which kind of model to use for each part of Context production and
  querying, and what an October 2026 benchmark comparison showed about how much
  model choice affects answer time.
type: Guide
timestamp: 2026-10-21T09:50:34.010Z
---
# Choosing Models

<!-- context:section id="goal" -->
Context works with whichever model your Agent runs, but the choice changes speed and cost a lot. The roles below come from teams' experience; the model names are examples of each role as of October 2026, not endorsements. Newer models will replace them, so check the date before you rely on a figure.
<!-- /context:section -->

<!-- context:section id="roles" -->

## Three roles

| Role | Examples (October 2026) | Use it for |
| --- | --- | --- |
| **Primary** | DeepSeek 4.1 Flash 1017 (first choice), Claude Opus 5.5, **Muse Wonder** | DeepSeek is the existing team choice for automation, Q&A, attribution and Chinese documents. Opus for organizing the logic of a first build, everyday production and querying. Muse is an alternative candidate for knowledge retrieval and code Q&A, supported by the scoped comparison below; that run did not evaluate knowledge production. |
| **Balanced** | GPT 5.6 SOL, Grok 4.6 | Moderate speed and cost; text, code and medium-intensity code exploration. |
| **High-end** | GPT 6.0 Astra | Planning the first build of a very large knowledge base and deep attribution in code. Expensive. |

For large work you do not need to orchestrate several Agents yourself. Whether writing runs in parallel is the Agent's choice, depending on what your host supports.

<!-- /context:section -->

<!-- context:section id="evidence" -->

## What the latest Q&A comparison shows

**In this 24-question developer knowledge-Q&A comparison, Muse Wonder + Source Graph and Claude Opus 5.5 + Source Graph performed at a similar overall level: Muse fully solved one more question, while Opus responded slightly faster.**

| Metric | Muse Wonder + Source Graph | Claude Opus 5.5 + Source Graph |
| --- | ---: | ---: |
| Fully solved | **100% (24/24)** | 95.8% (23/24) |
| Mean answer time | 106.9 s | **93.2 s** |
| P90 time | 135.0 s | **123.0 s** |
| Mean tool calls | 11.7 | 7.8 |
| Estimated cost per question | $0.210 | $0.272 |

Muse averaged about **14 seconds (15%) longer** per answer, while fully meeting the original requests in this run. It is a candidate for this kind of knowledge retrieval and code Q&A. Its measured usage averaged **388,000 tokens per question**; the cost figures are estimates for reference.

The conclusion is limited to these 24 questions. Runtime and configuration differ, so this does not establish general model equivalence, stability across workloads or an actual cost advantage. Evaluate candidates on your own questions, checking answer quality, mean and P90 time, and tool calls together.

The earlier local-retrieval comparison remains in [Knowledge Retrieval Benchmark](../../architecture/benchmark/knowledge-retrieval.md); it uses a different retrieval setup and should not be mixed with this table. To measure your own setup, see [Evaluating Your Knowledge Base](./evaluating-your-knowledge-base.md).

<!-- /context:section -->
