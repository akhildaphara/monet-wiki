# Monet Current-State Alignment and Action Items

**Original source review:** 2026-09-15 · **Priority-item update:** 2026-09-17
**Scope:** local `croe`, `swift-app`, and `website` source, focused tests, and read-only dev-stage AWS alarm inspection. Firebase, App Store Connect, and TestFlight behavior were not independently verified.

## Executive summary

Monet is a working three-client system: an Astro 5 marketing site and installable PWA, a SwiftUI iOS app, and a Node 20/Express API on Lambda. The backend compiles and the current unit suite passes (43 files / 471 tests); the website previously produced all six static routes. The iOS app has five tabs (Search, Insights, Calculator, Wallet, Settings), guest/Google/Apple/native email authentication, Plaid-backed insights, offline recommendation behavior, MetricKit telemetry, and a widget surface.

The documentation had drifted most in four areas: the DynamoDB schema (14 tables, not four or five), authentication and endpoint coverage, iOS navigation/features, and infrastructure controls. Historical output files remain useful as design context, but this report and `wiki-html/Current-State.html` are the current snapshot.

## Highest-priority action items

### P0 — Public App Store compliance: account deletion simulator smoke test passed; TestFlight verification remains

Registered users can delete their account from iOS or the website through authenticated, re-confirmed flows. The local `DELETE /v1/account` implementation now purges credentials, linked user profiles, transactions, overrides, preferences, feedback, insights caches, all Plaid index rows owned by those users, and form submissions matching the account email. It revokes Plaid items best-effort and keeps identity rows until secondary cleanup succeeds so failures can be retried. On 2026-09-17, an iPhone 17 Pro simulator running MonetRelease 0.8.0 (1) against `api.tapmonet.com` deleted a user-approved disposable account, returned to onboarding, and rejected a subsequent sign-in. That test predates these backend changes and does not prove table-by-table erasure. Seed and verify each account-owned table on a deployed stage, then repeat the flow on an installed TestFlight build before public submission under [Apple App Review Guideline 5.1.1(v)](https://developer.apple.com/app-store/review/guidelines/). Installation, global cache/audit, and IP-rate-limit rows have no account linkage and are not deleted by this route.

### P0 — Remove verification codes from logs — completed 2026-08-13

`raw/croe/src/api/auth.ts` now logs only a generic delivery failure and never includes signup, resend, or password-reset codes. A focused unit test covers the email-delivery failure path.

### P0 — Deploy and validate guest abuse controls before app-key rollout

The local guest-token route no longer requires `X-Monet-App-Key`; the website no longer sends the source-visible value; and backend/iOS CI source fallbacks have been removed. The backend now enforces a shared 100-mints/day quota per trusted CloudFront viewer, 20 queries/day per guest ID plus a 200/day per-viewer ceiling, and fail-closed guest quota errors. A path-scoped CloudFront WAF rule blocks bursts over 60 guest-mint requests per five minutes per IP. These controls are **implemented locally, not deployed or live-verified**. Deploy backend/WAF before the website, smoke-test normal and abusive guest flows including IPv6 and shared networks, and rotate the deployed SSM app key only with existing TestFlight builds and Xcode Cloud accounted for. The remaining install-telemetry key only gates first-install metrics/email; it is not client authentication.

Security design: guest minting is public but abuse-limited, not dependent on an extractable shared client value. The durable viewer key is a server-side HMAC of the CloudFront-generated IP, so raw IPs are not stored in the rate-limit table; shared networks may share a quota. WAF adds a separate edge burst control and AWS charges. [Apple App Attest](https://developer.apple.com/documentation/DeviceCheck/establishing-your-app-s-integrity) could later provide stronger iOS-only assurance with an unsupported-device path, but cannot authenticate the website. [AWS warns against treating API keys as authentication](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-usage-plans.html).

### P1 — Make the API contract executable — completed 2026-08-13

`src/api/routeRegistry.ts` now covers the live route set with explicit auth metadata. `tests/unit/routeRegistry.test.ts` fails when the registry and nested Express routers diverge. OpenAPI generation and the duplicated category/brand maps remain optional follow-up work.

### P1 — Finish observability before wider launch — alert definitions completed 2026-08-13

The backend now includes Plaid/Google/Bedrock failure-rate alarms, core and auxiliary DynamoDB throttle alarms, CloudFront 5xx monitoring, and an operations runbook. On 2026-09-17, the deployed dev-stage SNS email subscription was confirmed and eight alarms were enabled, connected to that topic, and `OK`. Read-only alarm history and SNS delivery metrics did not establish actual notification receipt. Remaining work is a controlled delivery/recovery test, crash-ingestion verification, and escalation ownership.

### P1 — Audit catalog correctness and automate time-sensitive rewards — risks identified

The backend's Apple Card fallback is now the conservative 1%; the prior 2% statement was stale. Remaining wrong-card risks: rotating-category caps are tracked per category instead of the issuer's combined quarterly pool; activation is not an optimizer input; and missing spend history is treated as under-cap. The current Q4 Discover schedule could not be confirmed from Discover's publicly accessible calendar on 2026-09-17. Add effective dates/source metadata, quarterly issuer checks, and regression fixtures for combined caps, activation, payment method, network acceptance, and issuer caveats before claiming catalog correctness.

### P2 — Resolve release-process ambiguity

The local repository proves build/test configuration, not that a specific deployment or TestFlight build is live. Record stage, API domain, app version/build, deployment commit, schema migration status, and smoke-test timestamp in a release manifest. Stop calling the `dev` stack “production” in planning artifacts even if beta users currently use it.

### P2 — Add first-class web testing

The Astro site builds successfully but has no lint or test scripts. Add at least static checks plus browser smoke tests for `/`, `/app`, guest-token failure/degraded mode, wallet persistence, search, privacy/terms links, and responsive/accessibility basics.

## Verified inventory

| Area | Current implementation |
|---|---|
| Backend | TypeScript/Express, Node 20, Lambda via `serverless-http`, API Gateway HTTP API, CloudFront, DynamoDB, Plaid, Google Places/Knowledge Graph, Bedrock Nova Micro, SES |
| API protection | Lambda authorizer for protected gateway routes; guest, Google, Apple, custom JWT, and dev-key flows; Express auth/registered-user checks; global burst limiting; DynamoDB daily quota |
| Data | 14 DynamoDB tables; PITR/deletion protection on durable production tables; TTL on audit/rate-limit data; AES-256-GCM token writes with legacy CBC read migration |
| iOS | SwiftUI/SwiftData, five tabs, guest/Google/Apple/email auth, Plaid Link and Insights, offline/local recommender, Calculator, widget UI, MetricKit crash capture |
| Website | Astro 5, Tailwind 4, vanilla modules, six routes, Firebase static output, PWA guest flow, local wallet, search and category overview |
| Catalog | 26 supported cards; 32 backend/iOS category values |
| Verification | Backend TypeScript build, lint, and unit suite passed; 43 files / 471 unit tests passed; website Astro build previously passed with six generated pages |

## Documentation policy

Use `wiki-html/Current-State.html` for current architecture and readiness. Treat roadmap, assessment, launch, and design files in `outputs/` as dated artifacts unless their header says they were revalidated on or after this report.
