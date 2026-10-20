---
title: External Entrances
description: Declare external knowledge sites and Skills so readers can navigate
  to them, without capturing them as evidence.
type: Guide
timestamp: 2026-10-19T18:48:05.928Z
---
# External Entrances

<!-- context:section id="goal" -->
Some content belongs next to your knowledge without becoming part of it: a team's engineering handbook on another site, a Skill published in another repository. The knowledge workspace can declare such **entrances** in its `imports.yaml`. Context never downloads, installs or captures them; it only knows where they are so pages and packages can link to them.

| You need | Use |
| --- | --- |
| A link readers can follow | An external entrance |
| A conclusion that must be traceable and tracked for change | A registered, captured source — see [Choosing How to Add Material](source-batches.md) |
| Docs or Skills in this same repository | [Linking Existing Docs and Skills](same-repository-docs.md) |
<!-- /context:section -->

<!-- context:section id="declare" -->
## Declare an entrance

Ask the Agent when you want a lasting association; quick lookups while answering a question do not register anything.

```text
Add our engineering handbook at https://docs.example.org/engineering/ as an
external entrance called engineering-guide, described as "Engineering conventions".
```

Each entrance has a stable ID and a URL. A kind (such as knowledge or Skill), title, description, path and version are optional hints. URLs must be HTTP(S) without credentials — never put access tokens in query strings. When the target's identity changes, use a new ID.
<!-- /context:section -->

<!-- context:section id="link" -->
## Link to it from a page

Ask the Agent to link the entrance where readers need it. In the page source the link names the entrance by ID:

```markdown
See the [Engineering guide](context:import/engineering-guide).
```

The build turns this into the declared URL as-is; it never guesses addresses, adds paths or rewrites the version. An unknown ID keeps the label as plain text and produces a build warning.

To give readers a directory of all entrances, ask the Agent to add an entrances page to the package, and optionally to the website navigation. The page lists the declared details only, so check that every entrance suits the audience before exposing private ones.
<!-- /context:section -->

<!-- context:section id="evidence" -->
## Entrances are not evidence

An entrance is never cited and adds nothing to a page's references. When you ask the Agent to check entrances, it compares current versions with the declared ones using its own authorized tools; a target it cannot reach is reported as "version unknown", never as a change. Context itself never contacts these services.

When you first assemble a knowledge base and collect originals by hand, see [Cold-Starting a Knowledge Base](../practices/cold-start.md) for how entrances, sources and hand-collected material fit together.
<!-- /context:section -->
