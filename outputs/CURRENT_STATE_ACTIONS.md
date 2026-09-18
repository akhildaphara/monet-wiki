# Monet Current-State Alignment and Action Items

**Original source review:** 2026-09-15 · **Priority-item update:** 2026-09-17
**Scope:** local `croe`, `swift-app`, and `website` source, focused tests, and read-only dev-stage AWS alarm inspection. Firebase, App Store Connect, and TestFlight behavior were not independently verified.

## Executive summary

Monet is a working three-client system: an Astro 5 marketing site and installable PWA, a SwiftUI iOS app, and a Node 20/Express API on Lambda. The backend compiles and the current unit suite passes (43 files / 471 tests); the website previously produced all six static routes. The iOS app has five tabs (Search, Insights, Calculator, Wallet, Settings), guest/Google/Apple/native email authentication, Plaid-backed insights, offline recommendation behavior, MetricKit telemetry, and a widget surface.

The documentation had drifted most in four areas: the DynamoDB schema (14 tables, not four or five), authentication and endpoint coverage, iOS navigation/features, and infrastructure controls. Historical output files remain useful as design context, but this report and `wiki-html/Current-State.html` are the current snapshot.

## 2. Active Priorities (Open Items)

### P0 — Apple Developer Organization Account Transition
* **Status:** ⬜ Not started
* **Context:** [Apple App Review Guideline 5.2.1 / Financial Data](https://developer.apple.com/app-store/review/guidelines/)
* **Action:** Apple routinely rejects third-party card recommendation and personal banking aggregators linking live banking data (via Plaid) if submitted under an Individual developer account. Transition or register the developer portal under an Organization account (requires a D-U-N-S number) before final public App Store submission.
* **Reference:** `wiki-html/Apple-Developer-Org-Registration.html`

### P1 — Reconcile Rotating Category Caps & Payment Method Intent
* **Status:** 🟡 Partial / in-progress
* **Context:** `raw/croe/src/resources/cardRewardsData.ts` and recommendation engine
* **Action:**
  1. **Combined Quarterly Caps:** Chase Freedom Flex and Discover 5% rotating quarterly categories currently model caps per-category instead of against the issuer's **combined $1,500 quarterly limit**. Update the optimizer to track against the shared quarterly pool.
  2. **Activation State:** Model category activation requirements rather than assuming rotating categories are unconditionally active.
  3. **Payment Method Intent:** Apple Card fallback was conservatively set to 1% physical rate. Incorporate payment method intent (Apple Pay vs. physical card swipe) so 2% can be surfaced when Apple Pay is applicable.
  4. **Issuer Terms Freshness:** Validate Q4 Discover schedule once exposed on Discover's public calendar.

### P2 — App Store Public Launch Assets
* **Status:** ⬜ Not started
* **Action:** Prepare public App Store screenshots (6.9" and 6.3" display sizes), promotional copy, keywords, and App Store Connect privacy questionnaire responses.

### P2 — Engineering Hygiene & Stability
* **Status:** 🟡 Partial
* **Action:**
  1. **Local DB Parity:** Add `MonetFormSubmissions` table definition into `raw/croe/src/init-db.ts` to match the deployed 14-table schema locally.
  2. **Website Testing:** Add linting and browser smoke tests for the Astro site (verifying `/`, `/app`, offline wallet persistence, and guest fallback).
  3. **Release Manifest:** Stop referring to `croe-dev` as "production" in planning documents; establish a release manifest documenting commit hashes, app build numbers, and API stages.

## 3. Completed & Verified Milestones

* ✅ **In-App Account Deletion (Completed 2026-09-17):**
  Authenticated `DELETE /v1/account` implemented and verified end-to-end on a deployed TestFlight build. Purges user profile, credentials, overrides, preferences, feedback, transactions, insights cache, Plaid indexes, and form submissions, with best-effort Plaid item revocation. Verified on-device: returns app to guest onboarding, rejects subsequent login attempts, and clears backend tables. Complies with Apple Guideline 5.1.1(v).
* ✅ **Guest Abuse Controls & CloudFront WAF (Completed 2026-09-17):**
  Deployed and live-verified against `api.tapmonet.com`. CloudFront WAF rate-based rule blocks bursts exceeding 60 req/5 min/IP on `POST /v1/auth/guest`. Backend enforces 100 guest-mints/day per viewer IP (HMAC-SHA256 of `CloudFront-Viewer-Address`), 20 queries/day per guest UUID, and a 200 queries/day viewer ceiling in DynamoDB `MonetRateLimits`. Keyless guest minting verified returning HTTP 200 with JWT; `X-Monet-App-Key` requirement removed.
* ✅ **Observability & CloudWatch Alarms (Completed 2026-09-17):**
  8 CloudWatch alarms provisioned and active (`OK` state) in `resources/monitoring.yml`: Lambda backend errors/crash logs, p99 latency, DynamoDB core throttles, DynamoDB aux throttles, Plaid failure rate, Google Places failure rate, Bedrock failure rate, and CloudFront 5xx errors. SNS alert topic email subscription (`akhildaphara@gmail.com`) confirmed and operational.
* ✅ **Verification Codes Removed from Logs (Completed 2026-08-13):**
  `raw/croe/src/api/auth.ts` emits generic delivery failure messages without logging verification or password reset codes; verified with dedicated unit tests.
* ✅ **Executable API Contract Parity Test (Completed 2026-08-13):**
  `src/api/routeRegistry.ts` covers live routes with explicit auth metadata. Automated test `tests/unit/routeRegistry.test.ts` fails if Express routes and registry diverge.

## 4. Readiness Snapshot (31 Items)

| Category | Done | Partial | Not started |
|---|:---:|:---:|:---:|
| Backend Infrastructure | 4 | 0 | 0 |
| iOS App Polish & Stability | 6 | 0 | 0 |
| Data & Rewards Algorithms | 0 | 3 | 0 |
| Analytics & Observability | 1 | 1 | 0 |
| Legal & Compliance | 3 | 0 | 0 |
| User Feedback Loop | 1 | 0 | 0 |
| Security & Abuse Controls | 5 | 1 | 0 |
| Testing & CI/CD | 3 | 0 | 0 |
| App Store & Marketing | 2 | 0 | 1 |
| **Total (31 items)** | **25** | **5** | **1** |

### Itemized Verification

| Category | Status | Item | Notes / Verification |
|---|:---:|---|---|
| **Backend Infra** | ✅ | Deploy API Server | Lambda + HTTP API Gateway + CloudFront (`api.tapmonet.com`) active. |
| **Backend Infra** | ✅ | Provision DynamoDB | 14 on-demand tables (`PAY_PER_REQUEST`) with encryption and PITR. |
| **Backend Infra** | ✅ | Secure API Keys | SSM Parameter Store (`/monet/dev/*`) runtime injection. |
| **Backend Infra** | ✅ | Base URL in iOS App | CloudFront endpoint configured; Secrets generated in Xcode Cloud. |
| **iOS Polish** | ✅ | TestFlight Configuration | Actively distributed to beta testers via App Store Connect. |
| **iOS Polish** | ✅ | App Icon & Branding | 1024x1024 asset configured in asset catalog. |
| **iOS Polish** | ✅ | Onboarding Flow | Value-first welcome, card selection, and guest path active. |
| **iOS Polish** | ✅ | Empty States & Haptics | Hero animations, empty wallet tapestry, tactile haptics across views. |
| **iOS Polish** | ✅ | Error Handling UI | Network status banners, offline search, direct error feedback sheet. |
| **iOS Polish** | ✅ | Account Deletion | Full in-app flow verified end-to-end on TestFlight (Apple 5.1.1(v)). |
| **Data & Rewards** | 🟡 | Audit Card Catalog | 26 cards supported; combined quarterly caps and activation pending. |
| **Data & Rewards** | 🟡 | Apple Pay Nuances | Apple Card defaults to 1% physical rate; payment intent pending. |
| **Data & Rewards** | 🟡 | Rotating Categories | Chase Q4 schedule updated; Discover Q4 calendar verification pending. |
| **Observability** | 🟡 | Crash Reporting | MetricKit (`MXMetricManager`) active on iOS; App Store telemetry pending public launch. |
| **Observability** | ✅ | Backend Logging & Alarms | CloudWatch structured logs, 8 active alarms in `OK`, confirmed SNS email. |
| **Compliance** | ✅ | Privacy Policy & Terms | Hosted live at `/privacy` and `/terms`, linked in app auth views. |
| **Compliance** | ✅ | Google OAuth Verification | Verification documentation prepared for Google Cloud Console. |
| **Compliance** | ✅ | Sign in with Apple | Native `SignInWithAppleButton` wired (Apple Guideline 4.8). |
| **Feedback** | ✅ | In-App Feedback | Dedicated support composer with system diagnostics and direct submission. |
| **Security** | ✅ | OAuth Audience Validation | Client IDs validated in authorizer/token verification. |
| **Security** | ✅ | Guest Mint Hardening | CloudFront viewer HMAC quota (100/day), origin secret protection. |
| **Security** | ✅ | Rate Limiting | CloudFront WAF burst rule, 20/day guest query limit, 200/day viewer ceiling. |
| **Security** | ✅ | Data-at-Rest Hardening | Keychain storage for tokens, cache purge on logout. |
| **Security** | ✅ | TLS Pinning | Implemented in iOS `APIClient` via `CertificatePinning.swift`. |
| **Security** | 🟡 | Dependency Audit | Patched vulnerabilities; 4 minor dev-transitive issues remain. |
| **Testing/CI** | ✅ | Backend Unit Tests | Vitest suite: 43 test files, 471 tests passing. |
| **Testing/CI** | ✅ | iOS Automated Tests | Unit and UI test targets configured in Xcode project. |
| **Testing/CI** | ✅ | CI/CD Pipeline | GitHub Actions workflow active for backend verification. |
| **Marketing** | ⬜ | App Store Listing Assets | Screenshots, keywords, and description pending public launch. |
| **Marketing** | ✅ | Custom API Domain | CloudFront distribution with ACM certificate for `api.tapmonet.com`. |
| **Marketing** | ✅ | Marketing Website | Astro 5 landing page live on Firebase Hosting (`monet-3d69d.web.app`). |

---

## 5. Verified System Inventory

| Area | Deployed Implementation |
|---|---|
| **Backend** | TypeScript/Express on Node 20, Lambda via `serverless-http`, API Gateway HTTP API, CloudFront, 14 DynamoDB tables, Plaid, Google Places/KG, Bedrock Nova Micro, SES. |
| **API Protection** | Lambda authorizer, CloudFront WAF rate limiting, viewer HMAC quotas, DynamoDB daily rate limiting, origin secret verification. |
| **Data Stores** | 14 DynamoDB tables (`MonetUsers`, `MonetCredentials`, `MonetAppInstallations`, `MonetOverrides`, `MonetRecommendationPreferences`, `MonetRecommendationFeedback`, `MonetTransactions`, `MonetInsightsCache`, `MonetBrandCache`, `MonetPlaidItemIndex`, `MonetMerchantEnrichment`, `MonetCategorizationAudit`, `MonetRateLimits`, `MonetFormSubmissions`). |
| **iOS Client** | SwiftUI/SwiftData, 5 tabs, guest/Google/Apple/email auth, Plaid Link & Insights, offline recommender, Calculator, widgets, MetricKit telemetry. |
| **Web Client** | Astro 5 + Tailwind 4, 6 routes, Firebase static hosting, PWA guest flow, local wallet persistence, category overview. |
| **Card Catalog** | 26 supported cards, 32 category taxonomy values. |
| **Test Verification** | 43 backend test files / 471 unit tests passing; iOS unit/UI test targets; Astro static build verified. |

---

## 6. Documentation Policy

This document (`outputs/CURRENT_STATE_ACTIONS.md`) is the **single source of truth** for active engineering priorities, release readiness, and verified inventory. Static HTML documentation in `wiki-html/` provides technical and architectural reference. Historical one-off task artifacts in `outputs/` are retired or consolidated here.

