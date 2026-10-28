---
title: Configuration
description: Every Source Graph setting in one place — environment variables,
  build-time deployment settings, code sources, runtime site settings,
  repository policies, plugin limits and the data directory layout.
type: Wiki
timestamp: 2026-10-28T10:00:11.296Z
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

Code sources combine deployment defaults, the website's custom Git settings and an optional startup file; see [Code sources](#code-sources).

Secrets — GitHub and custom Git tokens, OAuth client secrets, the service token, the credential key and database URLs with passwords — belong only in environment variables or the database, never in the deployment file, the startup file or the image. For deployment steps see [Self-hosting](../../../sop/source-graph/self-hosting.md).
<!-- /context:section -->

<!-- context:section id="environment" -->

## Environment variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `SOURCEGRAPH_LISTEN` | `0.0.0.0:8080` | Listen address |
| `SOURCEGRAPH_ORIGIN` | `http://localhost:8080` | Public origin, used for sign-in callbacks and links |
| `SOURCEGRAPH_DATA_ROOT` | `/data` | Data directory for Git mirrors, indexes and manifests; must be absolute |
| `SOURCEGRAPH_DATABASE` | `sqlite` | `sqlite`, `postgres` or `mongodb` |
| `DATABASE_URL` | `<data root>/sourcegraph.db` for SQLite | Database location or connection string |
| `SOURCEGRAPH_MIN_FREE_BYTES` | `1073741824` (1 GiB) | Free-space floor below which fetching and indexing stop with `INSUFFICIENT_STORAGE` |
| `SOURCEGRAPH_API_TOKEN` | Generated if absent | Seeds the service credential on first start (at least 32 characters); after that the value saved in the database is used. A matching bearer token gets full HTTP API access, except site settings, which require a browser session. The CLI reads the same variable |
| `SOURCEGRAPH_CREDENTIAL_KEY` | Unset | Base64 of 32 bytes, read once when upgrading an instance whose code tokens were encrypted with it; otherwise an existing `code-credentials.key` is imported, and a fresh database generates its own key. The key then lives in the database |
| `SOURCEGRAPH_GITHUB_TOKEN` | Unset | GitHub token used only while no global GitHub token has been saved; the earlier `SOURCEGRAPH_GIT_TOKEN` is still read while this is unset |
| `SOURCEGRAPH_CUSTOM_GIT_TOKEN` | Unset | Custom Git token used only while no global custom Git token has been saved |
| `SOURCEGRAPH_CONFIG_FILE` | Unset | Path of a JSON startup file that overrides code sources; see [Code sources](#code-sources) |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Unset | Google sign-in, imported together into the database on first configuration |
| `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` | Unset | GitHub sign-in, imported together into the database on first configuration |
| `SOURCEGRAPH_SEED_DEMO` | Unset | `true` registers `context4ai/context` and `context4ai/sourcegraph` at startup if they are missing |

The database is authoritative for these secrets: once a value is saved, changing its environment variable does not rotate it, and a replacement host needs only the database and non-secret configuration. Back up the whole database, secrets included. See [Self-Hosting](../../../sop/source-graph/self-hosting.md) for upgrades. With PostgreSQL or MongoDB, several instances can share one database while each keeps its own data directory.

<!-- /context:section -->

<!-- context:section id="deployment" -->
## Deployment settings

`config/deployment.json` is compiled into the binaries and describes what this deployment is, not how it is secured:

| Field | Community default | Meaning |
| --- | --- | --- |
| `code_sources` | GitHub, then a custom Git source with no host | The code sources this build offers, in display order, each with `id`, `name`, `host`, `username`, `token_env`, `anonymous` and `editable` |
| `example_repo` | `context4ai/context` | Repository used in interface examples |
| `public_url` | `https://context4ai.org/sourcegraph` | Public address shown in links and connection snippets |
| `source_repository` | `https://github.com/context4ai/sourcegraph` | Source link shown in the interface |
| `sso` | Google issuer and endpoints, empty client ID | Sign-in provider metadata, plus `registration_url`, the provider console where an operator creates the OAuth client; no secrets |

A fork that deploys under its own name or address edits this file and rebuilds; sign-in client IDs and secrets still come from the environment.
<!-- /context:section -->

<!-- context:section id="code-sources" -->
## Code sources

Each instance offers exactly two code sources: GitHub, then a custom Git host such as a self-hosted Gitea or GitLab. Their fields combine three layers, later non-empty values winning:

1. **Deployment defaults** — `code_sources` in `config/deployment.json` decides which sources exist and their order. The custom source has no host by default.
2. **Website** — administrators edit the custom source's name, host and HTTPS username on its card under **System settings › Code sources**, the same card that holds its global token. Changes apply immediately.
3. **Startup file** — the JSON file named by `SOURCEGRAPH_CONFIG_FILE` overrides fields by source id when the service starts.

```json
{"code_sources": {"git": {"name": "Gitea", "host": "https://git.example.com", "username": "oauth2", "token_env": "SOURCEGRAPH_CUSTOM_GIT_TOKEN"}}}
```

| Field | Rules |
| --- | --- |
| `name` | Display name |
| `host` | HTTPS origin without path, user, query or fragment; stored in lowercase |
| `username` | Git username sent with the token, 1–64 of letters, digits, `.`, `_`, `@` and `-`; default `oauth2` |
| `token_env` | Name of the environment variable holding the default token, uppercase letters, digits and `_`; the website cannot set it. The GitHub default is `SOURCEGRAPH_GITHUB_TOKEN`, with `legacy_token_env` `SOURCEGRAPH_GIT_TOKEN` read while it is unset; a startup file that sets `token_env` stops reading the earlier name |

- The startup file can only override existing ids; an unknown id or invalid value stops startup. Tokens never go in the file.
- Fields set in the startup file are read-only on the website; changing them there returns `409 CODE_SOURCE_LOCKED`.
- Repositories keep the host recorded at registration (`code_host`). On startup, records without one get the current host; a recorded host is never rewritten, and a mismatch with the current configuration is only logged.
- While any repository record, including deleted ones, uses the custom source, changing its host returns `409 CODE_SOURCE_IN_USE`. The name and username can still change.
- `GET /sourcegraph/v1/code-sources` returns the effective sources in order, with `locked` listing fields set by the startup file; it never returns tokens or variable names.
<!-- /context:section -->

<!-- context:section id="site" -->

## Site settings

Administrators edit three sections on the **Settings** page or through `/api/admin/settings`. Each save carries the section's current revision; a stale revision is rejected so two administrators cannot silently overwrite each other.

| Section | Field | Default | Meaning |
| --- | --- | --- | --- |
| `repository_defaults` | `git_timeout_minutes` | 15 | Default Git fetch and hydration timeout: 15, 30, 45 or 60 minutes. A repository inherits it unless it sets its own; new tasks take the value current when they start |
| | `retention_mode` | `days` | Default retention for new registrations: `days` or `count` |
| | `retention_days` | 30 | Days of history kept, 1–365 |
| | `retention_count` | 20 | Commits kept per branch, 1–4,096 |
| `access` | `public_read` | `true` | Whether anonymous visitors can search and read public repositories |
| | `allow_registration` | `false` | Whether a first-time sign-in creates an account |
| | `registration_notice_zh`, `registration_notice_en` | A built-in notice | Text shown to people who cannot register |
| | `allow_user_repositories` | `false` | Whether signed-in users can register repositories; each registrant becomes the repository's manager |
| `code_source` | `name`, `host`, `username` | Empty, so the deployment values apply | The custom Git source; see [Code sources](#code-sources) |

Requests to `/api/admin/settings` must use a browser session; requests carrying an `Authorization` header are refused. Global code tokens are saved separately on the same page. The **Storage** page separately moves where Git mirrors are kept; see [Operations](../../../sop/source-graph/operations.md).

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
| Git timeout (`git_timeout_minutes`) | 0 to inherit the site default, or 15, 30, 45 or 60 | Inherit |
| Managers | Up to 50 signed-in users who can manage the repository besides administrators | The registrant |
| Public read | On or off | On |
| Code source (`code_provider`) | `github` or `git`, fixed at registration; the registrant's own token for that source is tried first, then the global one | `github` |
| Code host (`code_host`) | The source's host at registration, kept for every later fetch | — |

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
| `sourcegraph.db` | SQLite database: users, keys, settings, registrations, credentials and the application secrets with their encryption key | No |
| `code-credentials.key` | Present only on instances upgraded from versions that kept the credential key on disk; imported into the database on first start, then kept only to restore backups taken before the upgrade. Fresh databases create no key file | No, until the upgrade is verified |
| `storage.json` | Where Git mirrors are stored on this machine | No |
| `space/` | Bare Git mirrors, unless moved on the **Storage** page | Yes, from the remotes |
| `index/`, `manifests/` | Search index shards and the manifests that describe them | Yes, by indexing again |

The container runs as an unprivileged user (uid 10001) and needs write access to the whole data root.

<!-- /context:section -->
