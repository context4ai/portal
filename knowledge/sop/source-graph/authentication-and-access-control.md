---
title: "Ops: Sign-in and Permissions"
description: For administrators of a self-hosted Source Graph — set up Google or
  GitHub sign-in, understand how the first administrator is chosen, control who
  may sign in, and decide what anonymous visitors, API keys and the service
  token can do.
type: Guide
timestamp: 2026-11-07T13:27:05.988Z
---
# Ops: Sign-in and Permissions

<!-- context:section id="goal" -->

This page is for the administrators of a Source Graph instance. Every request is treated as exactly one kind of caller:

- **Anonymous**: no `Authorization` header, while public reading is on. Can run read-only operations on public repositories, within the anonymous rate limit.
- **Signed-in user**: a browser session after Google or GitHub sign-in. Can read public repositories and the private repositories they created or manage, create personal API keys and save personal GitHub or custom Git tokens.
- **Administrator**: a signed-in user with the administrator role. Can read every repository, register and maintain every repository and manage site settings, users and global credentials.
- **Repository manager**: a signed-in user listed as a manager of a repository. Can read and maintain that repository, as described in [Who may register repositories](#who-may-sign-in).
- **Personal API key** (`sgk_…`): for scripts and Agents acting as its owner; covered under [Sessions and API keys](#sessions-and-api-keys).
- **Service token**: the instance's service credential, seeded from `SOURCEGRAPH_API_TOKEN` on first start and then kept in the database, for automation you control. Grants every HTTP and MCP operation on every repository.

Which repositories each caller can see is described in [Public and private repositories](#public-and-private-repositories). Any other `Authorization` value is rejected with `401 AUTHENTICATION_REQUIRED`; an invalid credential never silently becomes anonymous access. For how callers obtain and send each credential, see [Choose a credential](connecting.md#choose-a-credential) in Connecting.

<!-- /context:section -->

<!-- context:section id="providers" -->

## Set up sign-in

Source Graph signs users in with Google (OpenID Connect) or GitHub (OAuth). A provider is enabled when both its client ID and client secret are set; with neither configured, the sign-in screen explains what is missing and the site stays anonymous and read-only.

| Provider | Environment variables | Callback URL | Scopes |
| --- | --- | --- | --- |
| Google | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | `<origin>/sourcegraph/auth/google/callback` | `openid`, `profile`, `email` |
| GitHub | `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` | `<origin>/sourcegraph/auth/github/callback` | `read:user` |

1. **Register the callback.** `<origin>` is the value of `SOURCEGRAPH_ORIGIN`, the public origin without a path. For Google, create an OAuth client of type **Web application** and add the callback as an authorized redirect URI; for GitHub, create an **OAuth App** and use it as the authorization callback URL.
2. **Store the secrets** in your platform's secret store and restart the service. On first start with both values of a provider, Source Graph imports them into encrypted database storage; after that the saved configuration is used even without the environment values, and database records take precedence over them.
3. **Sign in.** The first person to sign in becomes the administrator, as described below.

Sign-in must start on the configured site address, because the provider always returns there and the login cookie belongs to one host. A sign-in started on another address, such as the platform's own hostname, is first sent to the sign-in screen on the site address; a proxy in front of the service forwards the original host in `X-Forwarded-Host`.

When the public origin changes, for example when the service moves behind another domain, update `SOURCEGRAPH_ORIGIN` and both provider callbacks together.

GitHub sign-in only identifies users; it does not grant repository access. Tokens for private repositories are configured separately for each code source, as described in [Registering and Managing Repositories](registering-repositories.md#tokens-for-private-repositories).

<!-- /context:section -->

<!-- context:section id="admin" -->
## The first administrator

Users are identified by provider and that provider's stable subject ID. Matching email addresses never merge identities or grant administrator rights, so the same person signing in with Google and with GitHub becomes two separate users.

The first verified sign-in on a new instance atomically becomes the administrator. Configure one provider, complete the owner's first sign-in, and only then add a second provider or make the site public. Administrators can promote other users on the **Users** page; at least one enabled administrator must always remain, and administrators cannot demote themselves.
<!-- /context:section -->

<!-- context:section id="registration" -->

## Who may sign in

The site setting **Allow other users to sign in or register** is off by default. While it is off, only administrators can sign in. Anyone else is refused with a `403` page that shows the configurable notice in both languages, links to the project and returns to the previous page after five seconds. Turning the setting off also cuts off existing non-administrator sessions, and their personal API keys are refused with `REGISTRATION_CLOSED`.

Anonymous reading is independent of this setting: visitors can still read public repositories while public reading is enabled in the site's access settings. Anonymous traffic is rate-limited; the limits are listed in [Rate limits](operations.md#rate-limits) in Operations.

A separate setting, **Let signed-in users register repositories**, is also off by default; settings saved before it existed read as off. When it is on, any signed-in user can register a repository and becomes its manager. Managers and administrators can change that repository's settings, index and clean it up, cancel its jobs, delete it and add or remove managers, up to 50; everyone else gets `403 REPOSITORY_MANAGEMENT_DENIED`. Users, site settings and global code-source tokens stay administrator-only. Repositories a user registers are fetched with that user's own code-source token first, then the site-wide one, so turning the setting on lets signed-in users register any repository the site-wide token can read.

## Public and private repositories

Each repository is public or private, chosen with **Public repository** when it is registered or later in its settings (`public_read`, default `true`). Repositories registered before this choice existed stay public.

| Caller | Public repositories | Private repositories |
| --- | --- | --- |
| Anonymous | Readable while public reading is on | Not visible |
| Signed-in user | Readable | Only those they created or manage |
| Administrator, signed in on the website | Readable | All |
| Personal API key | Readable | Only those its owner created or manages, even when the owner is an administrator |
| Service token | Readable | All |

A private repository a caller cannot see behaves exactly like an unregistered name: details, search, read, list, diff, plugins, prepare and the MCP tools return `404 REPOSITORY_NOT_FOUND`, catalogs leave it out, and statistics omit its name. To give someone access, add them as a manager of the repository or make it public.

Registering a name that is already registered returns `409 REPOSITORY_EXISTS` with the registrant in `creator`. The website shows who registered it and suggests asking them to add you as a manager, or a site administrator when no registrant is recorded.

Background synchronization, indexing and cleanup run for every repository regardless of visibility.

<!-- /context:section -->

<!-- context:section id="sessions" -->

## Sessions and API keys

A browser session lasts 90 days in an HTTP-only, same-site cookie scoped to `/sourcegraph`, marked secure on HTTPS origins. Signing in again replaces the browser's previous session.

Personal API keys are for scripts and Agents acting as you. Create them in your user settings with a name and an optional expiry; each key starts with `sgk_` and can be copied later from the same page. Keys stop working when they expire, when you delete them, when your account is disabled, or when registration is closed and you are not an administrator.

A key reads what its owner can read as a signed-in user, except that an administrator's key does not see every repository: it sees public repositories and the private ones its owner created or manages. Besides reading, a key can call only index preparation, over MCP `prepare` or `POST /sourcegraph/api/admin/v1/repo/prepare`. It may prepare repositories its owner manages, or any repository it can see when its owner is currently an administrator; this is checked on every call. MCP lists the `prepare` tool only for keys whose owner is an administrator or manages at least one repository, refreshed within a minute. Keys are limited to 10 prepare calls a minute, as listed in [Ops: Day-to-Day Operations](operations.md#rate-limits); every other management route returns `403 ACCESS_DENIED`.

The service token, set with `SOURCEGRAPH_API_TOKEN` and at least 32 characters long, is compared in constant time and grants full access. Treat it like a root credential and keep it out of shared configuration.

<!-- /context:section -->

<!-- context:section id="errors" -->

## Access errors

These codes are specific to authentication and permissions. For rate limits and all other errors, see [Common errors](operations.md#common-errors) in Operations.

| Code | Status | Meaning |
| --- | --- | --- |
| `AUTHENTICATION_REQUIRED` | 401 | No usable credential, or an invalid, expired or disabled one |
| `ACCESS_DENIED` | 403 | The credential is valid but not allowed here, for example a personal key on a management route other than prepare |
| `REGISTRATION_CLOSED` | 403 | Sign-in is restricted to administrators |
| `REGISTRATION_DISABLED` | 403 | A non-administrator tried to register a repository while user repositories are off |
| `REPOSITORY_MANAGEMENT_DENIED` | 403 | The caller is neither a manager of this repository nor an administrator |
| `PREPARATION_NOT_ALLOWED` | 403 | Anonymous callers can never request indexing |
| `REPOSITORY_NOT_FOUND` | 404 | The repository is not registered, or it is private and the caller cannot see it |
| `REPOSITORY_EXISTS` | 409 | The name is already registered; `creator` names the registrant to ask for access |

<!-- /context:section -->
