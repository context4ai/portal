---
title: CLI Commands
description: Every command and subcommand of the context CLI, grouped by
  purpose, with what each does and its key options.
type: Wiki
timestamp: 2026-10-28T09:46:19.242Z
---
# CLI Commands

<!-- context:section id="goal" -->
The `context` CLI holds the workflow state of a Context knowledge workspace. You rarely type these commands yourself: the Agent runs them, and most of them are returned by the current **Route** — the single next step that `context status` or a previous command hands back, often with an exact `--revision` to pass. Commands that drive the workflow print JSON with `--format json`, which is what the Agent reads.

Run `context <command> --help` for the full option list of any command. For the Skills that call these commands, see [Skills](./skills.md); for a short tour, see [Commands and Skills](../../getting-started/commands-and-skills.md).
<!-- /context:section -->

<!-- context:section id="setup" -->
## Setup

| Command | What it does | Key options |
| --- | --- | --- |
| `context entry [dir]` | Resolves the single Agent entry: plans initialization for a new directory or evaluates the workflow of an existing workspace | `--name`, `--language en\|zh-CN`, `--managed`, `--authority` |
| `context init [dir]` | Initializes a Context knowledge workspace in the directory | `--name`, `--language`, `--allow-nonempty` (after explicit confirmation) |
| `context plugin path` | Prints the bundled plugin root used by install | |
| `context plugin status` | Shows the bundled plugin root and which Agents have the plugin globally | |
| `context plugin install` | Installs the Agent plugin globally, or copies standalone Skills into a repository | `--agent claude\|codex\|cursor\|all`, `--local <repo>` (also `auto-detect`, `standalone`), `--dry-run` |
| `context evidence install [dir]` | Installs or safely upgrades the bundled remote code evidence plugin, without starting production | |
| `context clean-cache` | Removes orphaned Claude Code plugin caches | `--dry-run` |
<!-- /context:section -->

<!-- context:section id="workflow" -->
## Workflow

| Command | What it does | Key options |
| --- | --- | --- |
| `context status` | Prints the workspace overview and the next Route | `--format table\|json`, `--view summary\|full`, `--managed`, `--authority` |
| `context run [phase]` | Inspects or runs a declared phase; with no phase, advances deterministic Routes | `--list`, `--dry-run`, `--until blocked-or-complete`, `--max-steps`, `--deliver`, `--resume-writing` |
| `context resource acknowledge-current` | Records that every resource required by the current Route was read | |
| `context resource materialize <id>` | Writes one revision-bound Context view to a local file | |
| `context action prepare-current` | Prepares or retries the current production batch directories without resubmitting accepted articles | `--revision`, `--input` |
| `context action complete-current` | Submits the semantic output — a report decision, drafts, a Gate answer — for the exact current revision | `--revision`, `--input`, `--managed`, `--multi-agent`, `--preview` |
<!-- /context:section -->

<!-- context:section id="tasks" -->

## Tasks and maintenance

| Command | What it does |
| --- | --- |
| `context task prepare` | Previews or discards current task state; keeps knowledge, sources and other temporary files |
| `context task resume` | Explicitly reopens cleared production from registered requirements and retained knowledge |
| `context task adjust` | Adjusts current source and module inputs, or the knowledge map, without disturbing unrelated work (`--input`, `--schema`, `--inspect`) |
| `context task maintain` | Registers a scoped page revision, regeneration or approved-output rebuild |
| `context task advance-maintenance` | Executes the current maintenance transition |
| `context task maintenance-status` | Shows maintenance requests and the current cancellation revision |
| `context task cancel-maintenance <id>` | Cancels a pending maintenance request without discarding an active draft |
| `context task retire` | Previews or applies retirement of an approved article and cleanup of references to it |
| `context task recover` | Inspects or previews scoped recovery outside the normal Route |
| `context task rollback` | Previews exact user-selected reversions and discarded drafts; never resets the repository |
| `context task finish-rollback` | Finishes a rollback after close and all builds succeed |
| `context update` | Checks acquired source changes against approved knowledge in confirmed scopes (`--input`), or, with `--pending` and no input file, processes registered repositories whose commit moved past the processed version; pass exactly one of the two |
| `context revise <target>` | Repairs one draft or approved page through the Indexer lifecycle (`--instruction`, `--regenerate`, `--timing after-batch\|priority`, `--move-to`) |

<!-- /context:section -->

<!-- context:section id="review" -->
## Review

| Command | What it does | Key options |
| --- | --- | --- |
| `context review html [collection]` | Renders a self-contained local review report | `--all`, `--out`, `--open` |
| `context review list [collection]` | Lists draft candidates in the terminal | |
| `context review apply <file>` | Applies scoped JSON or JSONL decisions and revision instructions | |
| `context review approve-all [collection]` | Approves the whole current review scope | `--all`, `--confirmed` (your confirmation), `--managed` |
| `context review approve <id>` / `reject <id>` | Approves or rejects one draft candidate | |
| `context review deprecate <article-id>` | Marks an approved page deprecated without deleting it | |
<!-- /context:section -->

<!-- context:section id="delivery" -->

## Delivery

| Command | What it does | Key options |
| --- | --- | --- |
| `context close` | Closes approved knowledge: derives `structure.yaml` and runs final verification | `--format` |
| `context verify` | Validates the workspace | `--compact`, `--view diagnostics`, `--page-size`, `--page-token` |
| `context build` | Builds the declared packages and sites | `--verbose` |
| `context translate status` | Reports translation freshness per locale | |
| `context translate prepare` | Writes a draft per pending article — its stale translation, or the approved source when missing — with a `source_diff` when Git history holds the version it was translated from, plus a submission file | |
| `context translate submit` | Validates and saves translated articles and navigation titles | `--input` |
| `context translate skip` | Publishes pending translations in the primary language for now | |

<!-- /context:section -->

<!-- context:section id="versions" -->
## Versions and packages

| Command | What it does | Key options |
| --- | --- | --- |
| `context version inspect` | Shows formal changes since the current version tag or a given ref | `--base` |
| `context version record` | Records the workspace SemVer and changelog entry | `--input` |
| `context package site-url <package> <url>` | Records a deployed site root in the site maps, without network checks | |
| `context package template accept [package]` | Explicitly accepts an unchanged generated starter template | |
<!-- /context:section -->

<!-- context:section id="sources" -->
## Sources and Indexers

| Command | What it does |
| --- | --- |
| `context source add repo\|file\|lark [date]` | Registers a repository, local file or Lark document module under a `YYYYMMDD` batch |
| `context source add repo [date] --module <name>` | Registers or updates a repository module. `--local <path>` reads the remote and current commit from a checkout and may point at a monorepo package directory; `--remote <url>` and `--ref <sha>` pin it without a checkout; `--subpath <dir>` names a repository-relative package directory together with `--remote`/`--ref` or a `--local` repository root (a different directory than a `--local` package path is rejected) |
| `context source add batch [date]` | Registers several modules under one batch from a YAML/JSON `--input`. Repo items accept `type`, `module`, `local`, `remote`, `ref` and `subpath`; an unsupported field is rejected with the list of fields that item type accepts |
| `context source import` | Imports managed Markdown (notes, session summaries) or prefetched Lark content, singly or in a batch |
| `context source discover` / `fetch` | Discovers a source inventory, or fetches a portable snapshot, without registering anything |
| `context source batch-status <job-id>` | Reads a saved registration checkpoint |
| `context source list` / `get <id>` | Lists registry entries, or shows one |
| `context source rename <id>` | Renames a note or session summary and updates its references |
| `context source remove <id>` | Previews or removes an unreferenced source and its snapshot |
| `context source inspect [name]` | Shows repository module boundaries without extraction |
| `context source ensure [name]` | Checks repository checkouts without cloning, checking out or resetting |
| `context source recovery-plan [name]` | Plans recovery of missing repository checkouts without changing files |
| `context source restore` | Restores repository checkouts from explicit local or clone decisions |
| `context indexer catalog` | Lists bundled Skill names, descriptions and entries |
| `context indexer report-benchmark` | Builds a forward-test report from an independently loaded oracle |
<!-- /context:section -->

<!-- context:section id="debug" -->
## Diagnostics

| Command | What it does |
| --- | --- |
| `context debug enable` / `disable` | Turns workspace-local tracing on or off; disabling keeps existing traces |
| `context debug status` | Shows debug configuration, counts and trace paths |
| `context debug export` | Builds a replay projection from the event stream |

Tracing can also be enabled at creation with `context init --debug`.
<!-- /context:section -->
