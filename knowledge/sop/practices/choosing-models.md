---
title: Choosing Models
description: Which kind of model to use for producing and querying Context
  knowledge, what an October 2026 benchmark showed about model choice, and how
  to check a model on your own questions.
type: Guide
timestamp: 2026-10-21T11:17:07.932Z
---
# Choosing Models

<!-- context:section id="goal" -->
Context works with whichever model your Agent runs. Once the knowledge is good, most current models answer correctly; what the model mainly decides is how fast the work goes and how much it costs. This page groups models into three roles, shows what our benchmark measured, and explains how to check a model before you rely on it. The model names are examples as of October 2026, not endorsements; newer models will replace them, so check the date before you rely on a figure.
<!-- /context:section -->

<!-- context:section id="roles" -->
## Three roles

| Role | Examples (October 2026) | Use it for |
| --- | --- | --- |
| **Primary** | DeepSeek V4.1 Flash 1017 (first choice), Claude Opus 5.5, Muse Wonder | Everyday production and querying. DeepSeek is the team's first choice for automation, Q&A, attribution and Chinese documents, and it was the cheapest hosted model in the benchmark. Claude Opus 5.5 is strong at organizing the logic of a first build. Muse Wonder is a newer candidate for knowledge retrieval and code Q&A; it has not been evaluated for knowledge production. |
| **Balanced** | GPT 5.6 SOL, Grok 4.6 and 4.7 | Text, code and medium-intensity code exploration at moderate speed and cost. |
| **High-end** | GPT 6.0 Astra | Planning the first build of a very large knowledge base and tracing causes deep in code. Expensive, so keep it for that kind of work. |

You do not need to orchestrate several Agents for large work. Whether writing runs in parallel is the Agent's choice, depending on what your host supports.
<!-- /context:section -->

<!-- context:section id="evidence" -->
## What the benchmark shows

The [Knowledge Retrieval Benchmark](../../architecture/benchmark/knowledge-retrieval.md) had seven runs answer the same 24 real developer questions from the same Context knowledge. Its results support the roles above:

- **Quality was close.** Every run fully solved 21 to 24 questions. Muse Wonder with Source Graph solved all 24; Claude Opus 5.5, Grok 4.7 and DeepSeek each solved 23.
- **Speed and cost differed much more.** DeepSeek V4.1 Flash 1017 with Source Graph took about a minute per question on average, at about \$0.03. Claude Opus 5.5 with Source Graph took about a minute and a half at about \$0.27. Grok 4.7 took about five minutes; its longer investigations did not solve more questions.
- **More reasoning effort did not help.** Raising DeepSeek from high to max effort solved one question fewer and cost two-thirds more.

The benchmark measured answering only, not knowledge production, and each question was answered once per run.
<!-- /context:section -->

<!-- context:section id="try" -->
## Check a model on your own questions

Before you switch the model for a knowledge base, run it on a small set of real questions from your own users and compare it with the model you use now: how many questions it fully solves, its mean and P90 time, and how many tool calls it makes. Look at the questions it gets wrong as well as the count, because two models with the same score often miss different questions. [Evaluating Your Knowledge Base](./evaluating-your-knowledge-base.md) explains how to set up such a comparison.
<!-- /context:section -->
