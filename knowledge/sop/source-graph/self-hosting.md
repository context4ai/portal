---
title: Self-Hosting
description: Run your own Source Graph instance with Docker or from source, pick
  a database and back it up; see Deployment Recommendations for choosing between
  one instance and sharded instances.
type: Guide
timestamp: 2026-10-14T02:39:00.281Z
---
# Self-Hosting

<!-- context:section id="goal" -->
A Source Graph instance is one container or one process with a persistent data directory. The fastest way to try it is the Docker image built from the repository:

```bash
docker build -t context-sourcegraph .
docker volume create sourcegraph-data
docker run --rm -p 8080:8080 -v sourcegraph-data:/data \
  -e SOURCEGRAPH_ORIGIN=http://localhost:8080 \
  -e SOURCEGRAPH_SEED_DEMO=true \
  context-sourcegraph
```

Open `http://localhost:8080/sourcegraph/`. With `SOURCEGRAPH_SEED_DEMO=true` it registers two public example repositories; public GitHub repositories need no token, and a custom Git host can be added under Settings or in a startup file, as described in [Registering Repositories](registering-repositories.md#code-sources). Without sign-in providers the site is anonymous and read-only — add Google or GitHub sign-in to administer it, as described in [Authentication and Access Control](authentication-and-access-control.md).

The image contains four binaries — the service `repo-service`, the command-line client `sourcegraph-cli`, the Git credential helper and the Zoekt search server — and runs as an unprivileged user with `/data` as its data root and port 8080 exposed.
<!-- /context:section -->

<!-- context:section id="source" -->
## Build from source

Building locally needs Go 1.26 or later, Bun 1.3.9 and Git:

```bash
bun install --frozen-lockfile
bun run build:web
bun run build
SOURCEGRAPH_DATA_ROOT="$PWD/.tmp/data" SOURCEGRAPH_ORIGIN=http://localhost:8080 output/bin/repo-service
```

`output/bin` then holds the same four binaries. The service starts the search server itself and manages background indexing; there is nothing else to run. Every setting is an environment variable, and code sources can also be overridden by the startup file that `SOURCEGRAPH_CONFIG_FILE` names; all are listed in [Configuration](../../product/reference/source-graph/configuration.md). Put credentials only in environment variables or your platform's secret store, never in the deployment JSON, source code or images.
<!-- /context:section -->

<!-- context:section id="topology" -->
## Choose a topology

Source Graph runs either as one instance with a large disk, or as repository-sharded instances that share one PostgreSQL or MongoDB database and each own a disjoint set of repositories on their own volume. Each instance keeps its Git mirrors and indexes on local disk, so size by disk and place instances in the same region as their callers. [Deployment Recommendations](deployment-recommendations.md) covers how to choose, size and shard.
<!-- /context:section -->

<!-- context:section id="database" -->
## Choose a database

| Database | `SOURCEGRAPH_DATABASE` | Use when |
| --- | --- | --- |
| SQLite (default) | `sqlite` | One instance. The file defaults to `/data/sourcegraph.db`, with write-ahead logging and full synchronous commits |
| PostgreSQL | `postgres` | Shared state for sharded instances, or an existing managed database. Uses serializable transactions |
| MongoDB | `mongodb` | Shared state on MongoDB. Sign-in admission needs transactions, so use a replica set or a managed cluster |

Pass the connection in `DATABASE_URL`: a SQLite file path, a PostgreSQL DSN or a MongoDB URI. Changing the database does not migrate data — start with an empty destination or run a separately reviewed export and import. An external database never replaces the instance's persistent volume, which still holds Git, indexes and the credential key.
<!-- /context:section -->

<!-- context:section id="fly" -->
## Example: Fly.io

The repository's `fly.toml` deploys one instance with a `sourcegraph_data` volume mounted at `/data` and a health check on `/sourcegraph/healthz`. [Deployment Recommendations](deployment-recommendations.md) shows how the public demo is deployed on Fly.io from it, including the commands and the rules for serving Source Graph behind another site's reverse proxy.
<!-- /context:section -->

<!-- context:section id="backup" -->
## Back up and restore

Source Graph has no built-in backup job. Back up four things outside the machine, with restricted access: the database, the credential encryption key, the runtime storage configuration and the repository metadata. Indexes and bare Git mirrors can be rebuilt from the remotes; identities, settings, credentials and their key cannot.

- **SQLite:** use the online backup API — never copy a live `sourcegraph.db` on its own. For example: `sqlite3 /data/sourcegraph.db '.backup /data/sourcegraph-backup.db'`, then copy the result and the key and configuration files away. Alternatively stop the service and copy the database with its write-ahead log.
- **PostgreSQL:** `pg_dump`. **MongoDB:** your replica-set or managed-cluster backup.

To restore, stop the instance, restore the database together with its matching key and configuration, start one instance, and check administrator access, repository metadata and index recovery. Rolling back the image and restoring the database are separate operations; keep a known-good image and take a backup before upgrades.
<!-- /context:section -->
