# Monet Current-State Alignment and Action Items

**Verified:** 2026-08-05  
**Scope:** local `main` branches for `croe`, `swift-app`, and `website`; executable source and infrastructure configuration. Deployed AWS, Firebase, App Store Connect, and TestFlight state were not independently queried.

## Executive summary

Monet is a working three-client system: an Astro 5 marketing site and installable PWA, a SwiftUI iOS app, and a Node 20/Express API on Lambda. The backend compiles and all 504 Vitest tests pass; the website produces all six static routes. The iOS app has five tabs (Search, Insights, Calculator, Wallet, Settings), guest/Google/Apple/native email authentication, Plaid-backed insights, offline recommendation behavior, MetricKit telemetry, and a widget surface.

The documentation had drifted most in four areas: the DynamoDB schema (13 tables, not four or five), authentication and endpoint coverage, iOS navigation/features, and infrastructure controls. Historical output files remain useful as design context, but this report and `wiki-html/Current-State.html` are the current snapshot.

## Highest-priority action items

### P0 — Public App Store compliance: implement account deletion

Registered users can create native accounts and connect Plaid, but there is no in-app Delete Account control and no backend deletion endpoint. Implement an authenticated, re-confirmed deletion workflow that removes credentials, user profile, Plaid items/tokens, transactions, overrides, preferences, feedback associations, cached insights, item-index records, and local app data. Define retention for telemetry and form submissions. This is the clearest release-blocking product gap under [Apple App Review Guideline 5.1.1(v)](https://developer.apple.com/app-store/review/guidelines/) and Apple's [account-deletion guidance](https://developer.apple.com/support/offering-account-deletion-in-your-app/).

### P0 — Remove verification codes from logs

`raw/croe/src/api/auth.ts` still contains a TODO and logs a generated email verification code when delivery fails. That creates a credential exposure path in CloudWatch. Never log production OTPs; keep deterministic test codes confined to tests or an explicit local-only branch.

### P0 — Rotate and redesign the app-key control

The fallback `X-Monet-App-Key` value is present in backend and website source and in the iOS CI template. A value shipped in a public web bundle or app binary cannot prove client authenticity. Remove production fallbacks, rotate the current key, and treat this header only as a low-confidence abuse signal. For stronger iOS attestation, add App Attest/DeviceCheck with server-side verification. Avoid describing the current header as a security boundary.

### P1 — Make the API contract executable

`src/api/routeRegistry.ts` omits native auth, forms, crash telemetry, and some recommendation endpoints, and its auth labels do not fully describe the API Gateway authorizer plus Express middleware split. Either generate an OpenAPI document from the live router/Zod schemas or add a CI test that fails when router paths and the registry diverge. Do the same for the duplicated 33-value Category enum and cross-repository popular-brand maps.

### P1 — Finish observability before wider launch

The backend has structured logs, API Lambda alarms, MetricKit ingestion, persistent daily quotas, API Gateway throttling, and reserved Lambda concurrency. Remaining gaps are dependency-specific alerting and operations: Plaid/Google/Bedrock error rates, DynamoDB throttles, CloudFront 5xx, crash ingestion health, a verified alert escalation path, and a short incident/runbook checklist.

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
| Verification | Backend TypeScript build passed; 52 files / 504 Vitest tests passed; website Astro build passed with six generated pages |

## Documentation policy

Use `wiki-html/Current-State.html` for current architecture and readiness. Treat roadmap, assessment, launch, and design files in `outputs/` as dated artifacts unless their header says they were revalidated on or after this report.
