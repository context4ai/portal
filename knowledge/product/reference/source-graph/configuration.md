---
title: Configuration
description: Every Source Graph setting in one place — environment variables,
  build-time deployment settings, runtime site settings, repository policies,
  plugin limits and the data directory layout.
type: Wiki
timestamp: 2026-10-12T17:40:29.856Z
---
# Configuration

<!-- context:section id="layers" -->
Source Graph is configured in four layers, each with a different owner and lifetime:

| Layer | Where | Changed by | Takes effect |
| --- | --- | --- | --- |
| Environment variables | Process environment, for example Fly.io secrets or a container env file | Operator | On restart |
| Deployment settings | `config/deployment.json`, embedded at build time | Whoever builds the image | On the next build |
| Site settings | Database, edited on the **Settings** page | Administrators | Immediately, with revision checks |
| Repository policy | Database, set per repository at registration or later | Administrators | On the next synchronization |

Secrets — Git tokens, OAuth client secrets, the service token, the credential key and database URLs with passwords — belong only in environment variables or the database, never in the deployment file or the image. For deployment steps see [Self-hosting](../../../sop/source-graph/self-hosting.md).
<!-- /context:section -->

<!-- context:section id="environment" -->
## Environment variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `SOURCEGRAPH_LISTEN` | `0.0.0.0:8080` | Listen address |
| `SOURCEGRAPH_ORIGIN` | `http://localhost:8080` | Public origin, used for sign-in callbacks and links |
| `SOURCEGRAPH_DATA_ROOT` | `/data` | Data directory; must be absolute |
| `SOURCEGRAPH_DATABASE` | `sqlite` | `sqlite`, `postgres` or `mongodb` |
| `DATABASE_URL` | `<data root>/sourcegraph.db` for SQLite | Database location or connection string |
| `SOURCEGRAPH_MIN_FREE_BYTES` | `1073741824` (1 GiB) | Free-space floor below which fetching and indexing stop with `INSUFFICIENT_STORAGE` |
| `SOURCEGRAPH_API_TOKEN` | Unset | Optional service token of at least 32 characters; a matching bearer token gets full HTTP API access, except site settings, which require a browser session. The CLI reads the same variable |
| `SOURCEGRAPH_CREDENTIAL_KEY` | Generated `code-credentials.key` in the data root | Base64 of 32 bytes; encrypts stored code-host credentials |
| `SOURCEGRAPH_GIT_TOKEN` | Unset | Legacy global GitHub credential, used only while no global `github` credential has been saved |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Unset | Google sign-in |
| `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` | Unset | GitHub sign-in |
| `SOURCEGRAPH_SEED_DEMO` | Unset | `true` registers `context4ai/context` and `context4ai/sourcegraph` at startup if they are missing |

Changing `SOURCEGRAPH_CREDENTIAL_KEY` after credentials have been stored makes them unreadable; keep the key with the database backup. With PostgreSQL or MongoDB, several instances can share one database while each keeps its own data directory.
<!-- /context:section -->

<!-- context:section id="deployment" -->
## Deployment settings

`config/deployment.json` is compiled into the binaries and describes what this deployment is, not how it is secured:

| Field | Community default | Meaning |
| --- | --- | --- |
| `code_host` | `https://github.com` | Code host that registrations and credentials target |
| `example_repo` | `context4ai/context` | Repository used in interface examples |
| `public_url` | `https://context4ai.org/sourcegraph` | Public address shown in links and connection snippets |
| `source_repository` | `https://github.com/context4ai/sourcegraph` | Source link shown in the interface |
| `sso` | Google issuer and endpoints, empty client ID | Sign-in provider metadata, plus `registration_url`, the provider console where an operator creates the OAuth client; no secrets |

A fork that deploys under its own name or address edits this file and rebuilds; sign-in client IDs and secrets still come from the environment.
<!-- /context:section -->

<!-- context:section id="site" -->
## Site settings

Administrators edit two sections on the **Settings** page or through `/api/admin/settings`. Each save carries the section's current revision; a stale revision is rejected so two administrators cannot silently overwrite each other.

| Section | Field | Default | Meaning |
| --- | --- | --- | --- |
| `repository_defaults` | `retention_mode` | `days` | Default retention for new registrations: `days` or `count` |
| | `retention_days` | 30 | Days of history kept, 1–365 |
| | `retention_count` | 20 | Commits kept per branch, 1–4,096 |
| `access` | `public_read` | `true` | Whether anonymous visitors can search and read public repositories |
| | `allow_registration` | `false` | Whether a first-time sign-in creates an account |
| | `registration_notice_zh`, `registration_notice_en` | A built-in notice | Text shown to people who cannot register |

Requests to `/api/admin/settings` must use a browser session; requests carrying an `Authorization` header are refused. The **Storage** page separately moves where Git mirrors are kept; see [Operations](../../../sop/source-graph/operations.md).
<!-- /context:section -->

<!-- context:section id="policy" -->
## Repository policy

Each registration has its own policy, initialized from the repository defaults:

| Setting | Range | Default |
| --- | --- | --- |
| Monitored branches | 1–8 | The default branch |
| Retention | Days 1–365 **or** commits 1–4,096, not both | Site default |
| Sync interval (minutes) | 1, 3, 5, 10, 30, 60, 180, 360, 720 or 1440 | 5 |
| Index mode | Whole repository, or registered path groups for a monorepo | Whole repository |
| Public read | On or off | On |
| Credential kind (`code_provider`) | `github` or `git`; the registrant's own credential of that kind is tried first, then the global one | `github` |

A repository with public read off is hidden from anonymous visitors only; every signed-in user can still read it. See [Registering repositories](../../../sop/source-graph/registering-repositories.md) for how branches and retention decide which commits are searchable.
<!-- /context:section -->

<!-- context:section id="plugins" -->
## Plugin limits

Wasm evidence plugins run inside the service under resource guards set by `SOURCEGRAPH_PLUGINS_*` variables. Invalid values stop startup rather than removing a guard.

| Variable suffix | Default | Limits |
| --- | --- | --- |
| `DISABLED` | Unset | `1` disables plugins |
| `TIMEOUT` | `10s` | Wall time per run (Go duration) |
| `MEMORY_MIB` | 256 | Memory per instance, at most 4,096 |
| `ARTIFACT_BYTES` | 32 MiB | Plugin module size |
| `METADATA_BYTES` | 256 KiB | Plugin metadata size |
| `FILE_BYTES` | 32 MiB | Size of one file the plugin reads |
| `READ_BYTES` | 128 MiB | Total bytes read per run |
| `READ_CALLS` | 1,024 | File reads per run |
| `OUTPUT_BYTES` | 2 MiB | Output size |
| `CONCURRENCY` | 8 | Concurrent runs |
| `CACHE_ENTRIES` | 16 | Compiled modules kept |
| `IDLE_INSTANCES` | 8 | Warm instances kept |
<!-- /context:section -->

<!-- context:section id="fixed" -->
## Built-in limits

Some limits are fixed in code and cannot be configured: request bodies up to 64 KiB, a 30-second request deadline, HTTP server timeouts of 5 seconds for headers, 120 seconds for reading and 125 seconds for writing, and the search, read, list and diff page sizes described in [HTTP and MCP](http-and-mcp.md). The search engine runs as a local helper on `127.0.0.1:6070` and is never exposed.
<!-- /context:section -->

<!-- context:section id="data" -->
## Data directory

| Path under the data root | Contents | Rebuildable |
| --- | --- | --- |
| `sourcegraph.db` | SQLite database: users, keys, settings, registrations, credentials | No |
| `code-credentials.key` | Generated credential key, when `SOURCEGRAPH_CREDENTIAL_KEY` is unset | No |
| `storage.json` | Where Git mirrors are stored on this machine | No |
| `space/` | Bare Git mirrors, unless moved on the **Storage** page | Yes, from the remotes |
| `index/`, `manifests/` | Search index shards and the manifests that describe them | Yes, by indexing again |

The container runs as an unprivileged user (uid 10001) and needs write access to the whole data root.
<!-- /context:section -->
