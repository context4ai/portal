# Cold-starting a knowledge base (desensitized)

This note is the source for the Portal guide on cold-starting a knowledge base. It summarizes a 2026-10-14 discussion between Context maintainers and a team adopting Context, and a reviewed research PLAN from another team. It contains no internal platforms, people, links, repository names or business rules; business directions are written as "XXXX business".

## The questions

- At initialization there are too many documents; nobody knows which ones are useful, and some are probably outdated.
- Is it worth turning code into knowledge, or should the Agent re-read the code each time? Otherwise the knowledge has to be kept fresh.

## How to open a cold start

1. Let the Agent load the Context Skill first, so it knows the work and the background.
2. Give it the code repositories to understand first: a plain clone it explores, without registering or capturing anything.
3. Then give it a batch of documents or a wiki range, and let it explore which documents relate to the code and screen them, by relevance and how recently they were updated.
4. With the scope settled, discuss what the result should look like: the first, second and third levels of the site, and which articles go where.
5. That gives a "source" description and a "target" description, which together serve as the prompt; adjust as results come in.
6. Working site structures were reached the same way, step by step in conversation.

## Screening and adjudicating sources

| Dimension | What to look at |
| --- | --- |
| Relevance | Does it answer the readers' questions; can a matching module, interface or configuration be found in the code? |
| Reader fit | Are its readers and scope the same as this knowledge base's? |
| Authority | Baseline or formal document, or a second-hand summary, personal note or process record? |
| Recency | Last update time; a signal only, never a verdict on its own |
| Verifiability | Can key claims be checked against code or another formal source? |
| Conflict | Does it contradict the baseline or the code; which wins and why? |

Each group of sources gets one decision: adopt, supporting, evidence only, exclude or to confirm.

- Dates, titles, archive locations and polished language alone prove neither authority nor obsolescence; compare substance, audience and applicability. Historical decisions and procedures may still answer readers' questions.
- A baseline document named by the user takes precedence within its scope; when another document or the code disagrees with it, record the decision and its reason instead of letting the newest date win.
- When a historical practice is kept, the article states where each version applies and which replaced which.

## Keeping sources and results apart

- Originals, diagrams and version information stay as evidence; results are reorganized around reader tasks. Articles should not overlap; they link to each other instead of mirroring source documents one by one.
- During research it is natural to keep originals in a `raw/` folder with a YAML list of document links as an evidence inventory, but it should not become a second source system: material whose conclusions must be traceable is registered as a source with a snapshot; content readers only jump to is declared in `imports.yaml`; `raw/` keeps only hand-collected evidence that cannot be captured reliably, labelled with origin, retrieval time, version, authority status and what it replaces.

## How deep code knowledge goes

- Without any code knowledge the Agent starts blind: it does not know which repository or module to open, and its search is partly random.
- With a layer of code knowledge it knows the terms and which repositories and paths they map to; searches gain a pull toward the right module, for strong and weaker models alike.
- The hard part is granularity. The Code Indexer works at the level of interfaces, page routes and IDL; it does not build a symbol table or internal dependency graph.
- Three layers: locating (terms, repositories, modules), contracts (entries, routes, IDL, service identifiers, configuration), and implementation, which is not pre-written but read at a pinned commit when a question needs it.
- Freshness follows change impact: compare source versions and revisit only affected articles, rather than rebuilding everything or updating every source at the same frequency.

## Example 1: business knowledge on top of an engineering knowledge base

A frontend team's knowledge base had more than two hundred engineering articles; the team wanted a layer of business rules not visible in code, from a document space with thousands of nodes. Opening message (paraphrased):

```text
Look at every document under the <area A>, <area B>, <onboarding> and <technical designs> subtrees of the
<space> document space and cross-check them against the 5 registered repositories. Keep only business
definitions, rules, processes and boundaries that cannot be read from the code.

Recency:
- skip documents not updated in 500 days, except top-level designs such as one-pagers, overviews and architecture guides;
- skip SOPs and conventions not updated in 365 days;
- always skip daily and weekly reports, surveys, tests, on-call notes, archives and templates.

Do not add repositories; use the code only to check the rules in the documents.
Write me a research plan first: the screening steps, the decision and destination for each document, the
relation to existing knowledge and how the directory should change. Do not start production before I approve it.
```

The resulting PLAN recorded the funnel: thousands of nodes in the space, several hundred in the named subtrees, under two hundred after excluding by title, type, update time and content type, nearly all of them retrieved and read. Each document was judged full text (business definitions, rules or states not visible in code), key rules only (designs or SOPs, keeping conclusions backed by code or constraints missing from it), index only (navigation or covered content, linked as further reading) or excluded with a reason; roughly a quarter to two fifths of the read documents landed in each of the full text, key rules and excluded groups, and a small remainder was index only. It spot-checked two conclusions against code and found one "currently effective" rule computed differently in code; graded sources from originals down to earlier LLM inferences; set the rule that code wins on conflict with the old wording noted; proposed a navigation-only restructuring; split the work into seven stages of at most 30 sources; and listed the decisions it needed.

Reply (paraphrased):

```text
The directory proposal is fine, but keep the top-level name and split "events" and "incentives" at the
second level. For the threshold conflict, write both versions and mark it "to confirm with the business";
I will ask them. Leave the personal notes out for now. Run the rest as planned, and wait for my review after each stage.
```

## Example 2: a new domain knowledge base

An infrastructure direction (traffic access, as an example) needed a knowledge base, first for the engineers of XXXX business, later backing a knowledge Bot and operations Skills. Sources: several wiki ranges of mixed age, operations docs in the project, a team-maintained LLM Wiki, installed operations Skills, and scattered infrastructure background. Opening message (paraphrased):

```text
I want a knowledge base for traffic access. The first readers are XXXX business engineers; later it will
back a knowledge Bot, operations Skills and operations capabilities such as queries and attribution.

Sources:
- every article under wiki range A, including diagrams and embedded tables;
- range B is the focus; document C is the core and the latest baseline;
- weigh other documents by update date; where they conflict with C, C and the code win, with the reason recorded;
- the operations docs under docs/ in the project;
- the team's LLM Wiki is also a baseline; use it but keep references, it will be linked later;
- the first few XXXX business services and their repositories: <list>.

Requirements:
- do not repeat what installed operations Skills cover; write the glossary, key facts and preconditions and link the Skill;
- fill in infrastructure facts that are not tools (data centres, deployment architecture, network and compliance boundaries);
- keep articles orthogonal and link them to each other.

Research thoroughly: retrieve the originals and summarize the evidence, then propose topics, a three-level
structure and each article's content as a PLAN. I will review it before anything is written. Use <existing site> as a structural reference.
```

Expected in the PLAN: retrieved scope and counts; each source's role and its relation to the baseline, the code and the LLM Wiki, with the reason for each conflict decision; a three-level structure and article list (for example domain overview and terms, access paths, infrastructure and deployment constraints, a catalog of the first services, access and troubleshooting guides); the boundary with the operations Skills; stages and open decisions.

Reply (paraphrased):

```text
The structure is mostly fine. Do the service catalog for the first 3 services only and move the rest to a
later stage. The deployment architecture article must state the constraints it puts on XXXX business access,
not just the concepts. Organize troubleshooting by the problems users hit, not by source; give each guide its
preconditions, decision path and stop conditions, and leave the queries to the Skills. Where the LLM Wiki
conflicts with the baseline in two places, the baseline wins; note it in the articles.
```
