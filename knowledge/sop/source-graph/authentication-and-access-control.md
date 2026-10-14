---
title: Authentication and Access Control
description: Set up Google or GitHub sign-in, understand how the first
  administrator is chosen, control who may register, and decide what anonymous
  visitors, API keys and the service token can do.
type: Guide
timestamp: 2026-10-14T02:19:13.383Z
---
# Authentication and Access Control

<!-- context:section id="goal" -->
Source Graph has five kinds of caller, and every request is treated as exactly one of them:

| Caller | How it is recognized | Can do |
| --- | --- | --- |
| Anonymous | No `Authorization` header, while public reading is on | Read-only operations on repositories marked public; rate-limited |
| Signed-in user | A browser session after Google or GitHub sign-in | Read every registered repository; create personal API keys; save personal GitHub or custom Git tokens |
| Administrator | A signed-in user with the administrator role | Everything a user can, plus registering and maintaining repositories, site settings, users and global credentials |
| Personal API key | `Authorization: Bearer sgk_…` | Its owner's reads over HTTP and MCP; administrator keys created with prepare permission may also request indexing over MCP |
| Service token | `Authorization: Bearer <SOURCEGRAPH_API_TOKEN>` | Every HTTP and MCP operation, for automation |

Any other `Authorization` value is rejected with `401 AUTHENTICATION_REQUIRED`; an invalid credential never silently becomes anonymous access.
<!-- /context:section -->

<!-- context:section id="providers" -->
## Set up sign-in

Source Graph signs users in with Google (OpenID Connect) or GitHub (OAuth). A provider is enabled when both its client ID and client secret are set; with neither configured, the sign-in screen explains what is missing and the site stays anonymous and read-only.

| Provider | Environment variables | Callback URL | Scopes |
| --- | --- | --- | --- |
| Google | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | `<origin>/sourcegraph/auth/google/callback` | `openid`, `profile`, `email` |
| GitHub | `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` | `<origin>/sourcegraph/auth/github/callback` | `read:user` |

`<origin>` is the value of `SOURCEGRAPH_ORIGIN`, the public origin without a path. Register exactly that callback with the provider: for Google, create an OAuth client of type **Web application** and add it as an authorized redirect URI; for GitHub, create an **OAuth App** and use it as the authorization callback URL. Store the secrets in your platform's secret store, restart the service, and sign in. When the public origin changes — for example when the service moves behind another domain — update `SOURCEGRAPH_ORIGIN` and both provider callbacks together.

GitHub sign-in only identifies users; it does not grant repository access. Tokens for private repositories are configured separately for each code source, as described in [Registering Repositories](registering-repositories.md#tokens-for-private-repositories).
<!-- /context:section -->

<!-- context:section id="admin" -->
## The first administrator

Users are identified by provider and that provider's stable subject ID. Matching email addresses never merge identities or grant administrator rights, so the same person signing in with Google and with GitHub becomes two separate users.

The first verified sign-in on a new instance atomically becomes the administrator. Configure one provider, complete the owner's first sign-in, and only then add a second provider or make the site public. Administrators can promote other users on the **Users** page; at least one enabled administrator must always remain, and administrators cannot demote themselves.
<!-- /context:section -->

<!-- context:section id="registration" -->
## Who may sign in

The site setting **Allow other users to sign in or register** is off by default. While it is off, only administrators can sign in. Anyone else is refused with a server-rendered `403` page that shows the configurable notice in both languages, links to the project and returns to the previous page after five seconds. Turning the setting off also cuts off existing non-administrator sessions, and their personal API keys are refused with `REGISTRATION_CLOSED`.

Anonymous reading is independent of this setting: visitors can still read repositories marked public while public reading is enabled in the site's access settings. A repository registered with `public_read: false` is hidden from anonymous visitors only — every admitted signed-in user can read it.
<!-- /context:section -->

<!-- context:section id="sessions" -->
## Sessions and API keys

A browser session lasts 90 days in an HTTP-only, same-site cookie scoped to `/sourcegraph`, marked secure on HTTPS origins. Signing in again replaces the browser's previous session.

Personal API keys are for scripts and Agents acting as you. Create them in your user settings with a name and an optional expiry; each key starts with `sgk_` and can be copied later from the same page. Keys stop working when they expire, when you delete them, when your account is disabled, or when registration is closed and you are not an administrator.

Personal keys are read-only over HTTP. Over MCP they get the read-only tools, unless an administrator created the key with **Prepare index** permission — then the `prepare` tool is also available, limited to 10 requests per minute per key and 60 per minute in total. The permission is re-checked on every request, so it lapses if the owner stops being an administrator.

The service token, set with `SOURCEGRAPH_API_TOKEN` and at least 32 characters long, is compared in constant time and grants full access. Treat it like a root credential and keep it out of shared configuration.
<!-- /context:section -->

<!-- context:section id="errors" -->
## Access errors

| Code | Status | Meaning |
| --- | --- | --- |
| `AUTHENTICATION_REQUIRED` | 401 | No usable credential, or an invalid, expired or disabled one |
| `ACCESS_DENIED` | 403 | The credential is valid but not allowed here — for example a personal key on a management route |
| `ADMIN_REQUIRED` | 403 | A non-administrator tried to create a key with prepare permission |
| `REGISTRATION_CLOSED` | 403 | Sign-in is restricted to administrators |
| `PREPARATION_NOT_ALLOWED` | 403 | Anonymous callers can never request indexing |
| `RATE_LIMITED` | 429 | An anonymous or prepare rate limit was reached; retry after the `Retry-After` interval |
<!-- /context:section -->
