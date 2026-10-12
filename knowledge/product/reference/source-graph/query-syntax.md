---
title: Query Syntax
description: How Source Graph searches are written — rg-style patterns, literal
  and case options, globs and paths — and how the website, HTTP, MCP and CLI
  spell the same request.
type: Wiki
timestamp: 2026-10-12T17:40:29.856Z
---
# Query Syntax

<!-- context:section id="goal" -->
A Source Graph search is not a query language with filters. It is a small set of structured fields that mean what the matching `rg` options mean: a pattern matched line by line against file contents, plus switches for literal matching, case folding, globs and directories. The service compiles them into its own engine query; callers never write engine syntax, and text such as `file:` or `lang:` inside a pattern is matched literally.

| Meaning | `rg` | HTTP body | MCP `search` | CLI | Website |
| --- | --- | --- | --- | --- | --- |
| Pattern | `PATTERN`, `-e` | `Pattern` | `pattern` | `PATTERN` or `-e` | Search box |
| Literal text | `-F` | `FixedStrings: true` | `fixed_strings` | `-F` | **Regular expression** toggle off |
| Ignore case | `-i` | `IgnoreCase: true` | `ignore_case` | `-i` | **Match case** toggle off |
| Globs | `-g` | `Glob: [...]` | `glob` | `-g`, repeatable | Include and exclude fields |
| Directories | `PATH...` | `Paths: [...]` | `paths` | Arguments after the pattern | — |
| Paths only | `-l` | `Output: "files"` | `output: "files"` | `-l` | — |
| Revision | — | `Revision` | `revision` | `-revision` | Branch or commit selector |
<!-- /context:section -->

<!-- context:section id="pattern" -->
## Patterns

- A pattern is an RE2 regular expression, close to `rg`'s default syntax, matched against **file contents**, never against paths.
- Matching is **line-oriented**, like `rg` without `-U`: a pattern that could match a newline is rejected. Search for each line separately.
- A pattern must consume at least one character. Patterns that match the empty string, or only zero-width assertions, are rejected.
- Lookaround and backreferences are not supported; use `FixedStrings` to match such text literally.
- The pattern must be non-empty valid UTF-8 of at most 8,192 bytes.
- Searches are **case-sensitive by default**. `IgnoreCase` folds case for the whole pattern.

Invalid patterns return `400 INVALID_PATTERN` with the reason.
<!-- /context:section -->

<!-- context:section id="globs" -->
## Globs

Globs follow `rg -g` and gitignore conventions:

| Glob | Matches |
| --- | --- |
| `*.go` | Files named `*.go` at any depth — a glob without `/` matches names anywhere |
| `src/**/*.ts` | TypeScript files under `src/`, anchored at the repository root because it contains `/` |
| `!**/*_test.go` | Excludes test files |
| `!vendor/` | Excludes everything under any `vendor` directory |
| `*.{ts,tsx}` | Either extension |

`*` and `?` never cross `/`, `**` spans directories, and `[...]` character classes are supported. When includes are given, a file must match at least one of them; when includes and excludes overlap, the later glob wins, as in `rg`. An include glob ending in `/` is rejected — use `Paths`, or append `/**`. Up to 64 globs of at most 1,024 bytes each are allowed; bad ones return `400 INVALID_GLOB`. On the website, the include and exclude fields take comma-separated globs; commas inside `{a,b}` belong to the glob.
<!-- /context:section -->

<!-- context:section id="paths" -->
## Paths and output

`Paths` lists repository-relative directories to search, like `rg`'s trailing `PATH` arguments, up to 64. In a monorepo registration they must lie inside the registered path groups (`PATH_NOT_REGISTERED` otherwise); omitting them searches every registered group at the same commit, never mixing versions.

`Output` is `content` (the default), returning matching lines, or `files`, returning only paths, like `rg -l`. Over MCP, `max_lines_per_file` (1–1000, default 10) bounds how many matching lines are shown per file in content mode.
<!-- /context:section -->

<!-- context:section id="results" -->
## Reading the results

Each result names its `Repository` and `Commit`; read surrounding code at that same commit. Results are a bounded first page — up to 100 files and 1,000 matches with two context lines, reduced automatically if the response would exceed 2 MiB — so check the metadata before drawing conclusions:

| Field | Meaning |
| --- | --- |
| `Partial` | The engine stopped early, for example at its 10,000-match cap or because shards were skipped |
| `Truncated` | More files or matches existed than were returned |
| `Coverage` | What the index covers: index mode, registered paths and groups, text-only profile without symbols, and skipped unsupported paths |

A search with no hits is not proof of absence outside that coverage or beyond the limits. Text files the index skipped, such as generated or very large files, can still be read directly at that commit within the read limits.
<!-- /context:section -->

<!-- context:section id="web" -->
## Website search links

The website's search page encodes the same request in its address, using the API field names: `repo`, `pattern`, `fixed_strings=1`, `ignore_case=1`, repeated `glob`, and either `commit` (a full SHA) or `revision` (a branch). Code pages accept `repo`, `path` and `commit` or `revision`, with a line range in the fragment such as `#L20-L40`. Links copied from the website therefore reproduce the exact search or read at the same commit.
<!-- /context:section -->

<!-- context:section id="examples" -->
## Examples

| Goal | HTTP body | CLI |
| --- | --- | --- |
| Find a function call | `{"Pattern":"WithTimeout\\("}` | `sourcegraph-cli search -repo R 'WithTimeout\('` |
| Literal text, any case | `{"Pattern":"todo:","FixedStrings":true,"IgnoreCase":true}` | `sourcegraph-cli search -repo R -F -i 'todo:'` |
| Only Go files, no tests | `{"Pattern":"func New","Glob":["*.go","!*_test.go"]}` | `sourcegraph-cli search -repo R -g '*.go' -g '!*_test.go' 'func New'` |
| Within two directories | `{"Pattern":"retry","Paths":["internal/service","cmd"]}` | `sourcegraph-cli search -repo R retry internal/service cmd` |
| List matching files | `{"Pattern":"deprecated","Output":"files"}` | `sourcegraph-cli search -repo R -l deprecated` |
<!-- /context:section -->
