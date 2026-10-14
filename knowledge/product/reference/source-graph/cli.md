---
title: CLI
description: Commands, flags, environment variables, output and exit codes of
  sourcegraph-cli, and what the Git credential helper does.
type: Wiki
timestamp: 2026-10-14T02:19:13.383Z
---
# CLI

<!-- context:section id="goal" -->
`sourcegraph-cli` is a small, bounded HTTP client for a Source Graph instance. It sends one request per invocation to the routes described in [HTTP and MCP](http-and-mcp.md), prints the JSON response and exits; it never clones repositories or installs anything. It is built with the service into `output/bin/` and is included in the container image.

```text
sourcegraph-cli <command> [flags] [arguments]
```
<!-- /context:section -->

<!-- context:section id="env" -->
## Environment

| Variable | Default | Rules |
| --- | --- | --- |
| `SOURCEGRAPH_URL` | `https://context4ai.org/sourcegraph` | The instance's `/sourcegraph` base address. Must be an HTTPS URL without user information, query or fragment |
| `SOURCEGRAPH_API_TOKEN` | — | Optional bearer credential — a personal API key or the service token. At least 32 characters when set |

Because the address must be HTTPS, a local instance on `http://localhost` needs a TLS-terminating proxy in front of it for CLI use.
<!-- /context:section -->

<!-- context:section id="commands" -->
## Commands

| Command | Route | Flags used |
| --- | --- | --- |
| `repositories` | `GET /v1/repos` | `-after` |
| `availability` | `GET /v1/repo/availability` | `-repo` |
| `resolve` | `POST /v1/repo/resolve` | `-repo`, `-revision` |
| `search` | `POST /api/search` | `-repo`, `-revision`, `-e`, `-F`, `-i`, `-l`, `-g`; then `PATTERN [PATH...]` |
| `read` | `POST /v1/repo/read` | `-repo`, `-revision`, `-path`, `-start-line`, `-end-line` |
| `list` | `POST /v1/repo/list` | `-repo`, `-revision`, `-path`, `-first`, `-after` |
| `diff` | `POST /v1/repo/diff` | `-repo`, `-base`, `-head`, `-first`, `-after` |
| `prepare` | `POST /api/admin/v1/repo/prepare` | `-repo`, `-revision`, `-kind`, `-key` |

There is no `read_many` command; use several `read` calls or the MCP tool. `diff` compares all registered paths, and `prepare` targets all path groups. `prepare` is a management route, so it needs the service token.
<!-- /context:section -->

<!-- context:section id="flags" -->
## Flags

Flags use Go syntax: one or two leading dashes both work (`-repo` or `--repo`), and every flag must come before positional arguments.

| Flag | Default | Meaning |
| --- | --- | --- |
| `-repo` | — | Repository key, `owner/repository` |
| `-revision` | — | A monitored branch or a full SHA; omitted means the default branch. For `prepare`, the commit to prepare |
| `-e` | — | Search pattern, like `rg -e`; otherwise the first positional argument |
| `-F` | `false` | Match the pattern as literal text, like `rg -F` |
| `-i` | `false` | Ignore case, like `rg -i` |
| `-l` | `false` | Print only matching paths, like `rg -l` |
| `-g` | — | Include, or `!`-exclude, files by glob, like `rg -g`; repeatable |
| `-path` | — | Repository-relative file or directory |
| `-start-line` | `1` | First line to read |
| `-end-line` | `100` | Last line to read |
| `-first` | `100` | Page size for `list` (1–1000) and `diff` (1–100) |
| `-after` | — | Cursor from the previous page |
| `-base`, `-head` | — | The two revisions for `diff` |
| `-key` | — | Idempotency key sent as `Idempotency-Key` for `prepare` |
| `-kind` | `index` | `index` or `sync`, for `prepare` |

Search arguments after the pattern are directories to search within, like `rg`'s `PATH` arguments.
<!-- /context:section -->

<!-- context:section id="output" -->
## Output and exit codes

The CLI writes the response body — always JSON — to standard output unchanged, up to 3 MiB, and diagnostics to standard error. Each request has a 35-second timeout, and redirects are refused.

| Exit code | Meaning |
| --- | --- |
| `0` | Success |
| `1` | Request failed, timed out, returned an invalid or oversized body, or a non-2xx status |
| `2` | Usage error: unknown command, bad flags, missing pattern, invalid `SOURCEGRAPH_URL` or token |
| `3` | Accepted but not ready yet — `202 Accepted`, or `409 INDEX_NOT_READY` |

After a timeout, delivery is unknown; inspect `availability` before retrying a `prepare`.
<!-- /context:section -->

<!-- context:section id="examples" -->
## Examples

```bash
export SOURCEGRAPH_URL="https://context4ai.org/sourcegraph"

# Literal search in TypeScript files under packages/
sourcegraph-cli search -repo context4ai/context -F -g '*.ts' 'defineProject' packages

# Read lines 1–40 at the commit returned in Meta.Commit
sourcegraph-cli read -repo context4ai/context -revision <commit> -path README.md -end-line 40

# List the repository root
sourcegraph-cli list -repo context4ai/context -first 50

# Ask an instance you administer to index a commit (service token required)
SOURCEGRAPH_API_TOKEN=... sourcegraph-cli prepare -repo acme/app -revision <full-sha> -key index-<full-sha>
```
<!-- /context:section -->

<!-- context:section id="helper" -->
## Git credential helper

`git-credential-sourcegraph` is used by the service itself, not by people. For every Git fetch, the service picks a token from the repository's code source — the creator's own token, then the global one, then the source's environment token, and for GitHub finally anonymous access, as described in [Registering Repositories](../../../sop/source-graph/registering-repositories.md#tokens-for-private-repositories). It then runs Git with three environment variables:

| Variable | Value |
| --- | --- |
| `SOURCEGRAPH_GIT_TOKEN` | The selected token; empty for an anonymous attempt |
| `SOURCEGRAPH_GIT_HOST` | The host of the remote being fetched |
| `SOURCEGRAPH_GIT_USERNAME` | The code source's Git username |

The helper answers only Git's `get` action, and only for HTTPS requests whose host equals `SOURCEGRAPH_GIT_HOST`. It returns the username — `oauth2` when unset — and the token as the password. It prints nothing when the host does not match, the token is empty, or either value contains line breaks or NUL characters, so a token is never offered to another host.
<!-- /context:section -->
