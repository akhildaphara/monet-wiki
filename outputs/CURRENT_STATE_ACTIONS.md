# Monet Current-State Alignment and Action Items

**Verified:** 2026-09-15
**Scope:** local `main` branches for `croe`, `swift-app`, and `website`; executable source and infrastructure configuration. Deployed AWS, Firebase, App Store Connect, and TestFlight state were not independently queried.

## Executive summary

Monet is a working three-client system: an Astro 5 marketing site and installable PWA, a SwiftUI iOS app, and a Node 20/Express API on Lambda. The backend compiles and the current unit suite passes (43 files / 471 tests); the website previously produced all six static routes. The iOS app has five tabs (Search, Insights, Calculator, Wallet, Settings), guest/Google/Apple/native email authentication, Plaid-backed insights, offline recommendation behavior, MetricKit telemetry, and a widget surface.

The documentation had drifted most in four areas: the DynamoDB schema (13 tables, not four or five), authentication and endpoint coverage, iOS navigation/features, and infrastructure controls. Historical output files remain useful as design context, but this report and `wiki-html/Current-State.html` are the current snapshot.

## Highest-priority action items

### P0 — Public App Store compliance: account deletion implemented; release verification remains

Registered users can delete their account from iOS or the website through authenticated, re-confirmed flows. `DELETE /v1/account` removes credentials, user profiles, linked Plaid items on a best-effort basis, transactions, overrides, preferences, feedback associations, cached insights, and known Plaid item-index records; clients clear local session data after success. Complete a deployed-device/TestFlight verification before public submission under [Apple App Review Guideline 5.1.1(v)](https://developer.apple.com/app-store/review/guidelines/).

### P0 — Remove verification codes from logs — completed 2026-08-13

`raw/croe/src/api/auth.ts` now logs only a generic delivery failure and never includes signup, resend, or password-reset codes. A focused unit test covers the email-delivery failure path.

### P0 — Rotate and redesign the app-key control

The fallback `X-Monet-App-Key` value is present in backend and website source and in the iOS CI template. A value shipped in a public web bundle or app binary cannot prove client authenticity. Remove production fallbacks, rotate the current key, and treat this header only as a low-confidence abuse signal. For stronger iOS attestation, add App Attest/DeviceCheck with server-side verification. Avoid describing the current header as a security boundary.

### P1 — Make the API contract executable — completed 2026-08-13

`src/api/routeRegistry.ts` now covers the live route set with explicit auth metadata. `tests/unit/routeRegistry.test.ts` fails when the registry and nested Express routers diverge. OpenAPI generation and the duplicated category/brand maps remain optional follow-up work.

### P1 — Finish observability before wider launch — alert definitions completed 2026-08-13

The backend now includes Plaid/Google/Bedrock failure-rate alarms, core and auxiliary DynamoDB throttle alarms covering all 13 tables, CloudFront 5xx monitoring, and an operations runbook. Remaining work is deployed-stage verification of SNS delivery, crash-ingestion health, and escalation ownership.

### P1 — Audit catalog correctness and automate time-sensitive rewards

The current backend exposes 26 supported cards and 33 categories. Payment method is still not an optimizer input, so Apple Card's 2% Apple Pay rate can be overstated for physical-card purchases. Add effective dates/source metadata to reward rules, automated quarterly schedule checks, and regression fixtures for caps, rotating categories, network acceptance, and issuer-specific caveats.

### P2 — Resolve release-process ambiguity

The local repository proves build/test configuration, not that a specific deployment or TestFlight build is live. Record stage, API domain, app version/build, deployment commit, schema migration status, and smoke-test timestamp in a release manifest. Stop calling the `dev` stack “production” in planning artifacts even if beta users currently use it.

### P2 — Add first-class web testing

The Astro site builds successfully but has no lint or test scripts. Add at least static checks plus browser smoke tests for `/`, `/app`, guest-token failure/degraded mode, wallet persistence, search, privacy/terms links, and responsive/accessibility basics.

## Verified inventory

| Area | Current implementation |
|---|---|
| Backend | TypeScript/Express, Node 20, Lambda via `serverless-http`, API Gateway HTTP API, CloudFront, DynamoDB, Plaid, Google Places/Knowledge Graph, Bedrock Nova Micro, SES |
| API protection | Lambda authorizer for protected gateway routes; guest, Google, Apple, custom JWT, and dev-key flows; Express auth/registered-user checks; global burst limiting; DynamoDB daily quota |
| Data | 13 DynamoDB tables; PITR/deletion protection on durable production tables; TTL on audit/rate-limit data; AES-256-GCM token writes with legacy CBC read migration |
| iOS | SwiftUI/SwiftData, five tabs, guest/Google/Apple/email auth, Plaid Link and Insights, offline/local recommender, Calculator, widget UI, MetricKit crash capture |
| Website | Astro 5, Tailwind 4, vanilla modules, six routes, Firebase static output, PWA guest flow, local wallet, search and category overview |
| Catalog | 26 supported cards; 32 backend/iOS category values |
| Verification | Backend TypeScript build, lint, and unit suite passed; 43 files / 471 unit tests passed; website Astro build previously passed with six generated pages |

## Documentation policy

Use `wiki-html/Current-State.html` for current architecture and readiness. Treat roadmap, assessment, launch, and design files in `outputs/` as dated artifacts unless their header says they were revalidated on or after this report.
