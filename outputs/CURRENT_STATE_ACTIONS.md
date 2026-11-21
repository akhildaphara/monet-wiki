# Monet Current-State Alignment and Action Items

**Original source review:** 2026-09-15 · **Priority-item update:** 2026-11-21
**Scope:** local `croe`, `swift-app`, and `website` source, focused tests, and read-only dev-stage AWS alarm inspection. Firebase, App Store Connect, and TestFlight behavior were not independently verified.

## Executive summary

Monet is a working three-client system: an Astro 5 marketing site and installable PWA, a SwiftUI iOS app, and a Node.js 24/Express API on Lambda. The backend compiles and passes its unit and DynamoDB integration suites, and the website passes lint, unit, browser smoke, and static build checks. The iOS app has five tabs (Search, Insights, Calculator, Wallet, Settings), guest/Google/Apple/native email authentication, Plaid-backed insights, offline recommendation behavior, MetricKit telemetry, and a widget surface.

The documentation had drifted most in four areas: the DynamoDB schema (14 tables, not four or five), authentication and endpoint coverage, iOS navigation/features, and infrastructure controls. Historical output files remain useful as design context, but this report and `wiki-html/Current-State.html` are the current snapshot.

## 2. Active Priorities (Open Items)

### P0 — Apple Developer Organization Account Transition
* **Status:** ⬜ Not started
* **Context:** [Apple App Review Guideline 5.2.1 / Financial Data](https://developer.apple.com/app-store/review/guidelines/)
* **Action:** Apple routinely rejects third-party card recommendation and personal banking aggregators linking live banking data (via Plaid) if submitted under an Individual developer account. Transition or register the developer portal under an Organization account (requires a D-U-N-S number) before final public App Store submission.
* **Reference:** `wiki-html/Apple-Developer-Org-Registration.html`

### P1 — Reconcile Rotating Category Caps & Card Terms
* **Status:** 🟡 Addressed locally (deployment & minor edge cases remaining)
* **Context:** `raw/croe/src/resources/cardRewardsData.ts`, `raw/croe/src/optimizer.ts`, and `raw/swift-app`
* **Action:**
  1. ✅ **Combined Quarterly Caps:** The local backend now evaluates one $1,500 pool per card across the quarter’s bonus categories, including Chase’s qualifying merchant offers. It uses linked per-card spend and existing cached totals (`cardSpendSnapshot`), expires spend buckets by period, and ignores remapped accounts. iOS now applies Freedom Flex stacking in its catalog estimates and uses cached server wallet winners only on the day they were fetched. *(Remaining: client-only estimates still lack spend tracking.)*
  2. ⬜ **Activation State:** Tracking is deferred. Estimates assume activation, and Card Details reminds users to activate with their issuer.
  3. ✅ **Apple Card Terms:** Card Details explains 1% with the physical card, 2% with Apple Pay and 3% at eligible partners. Recommendations use the 1% catalog baseline.
  4. ✅ **Issuer Terms Freshness:** Discover confirmed restaurants, qualifying entertainment and utilities for Q4 2026. Added Chase’s announced Q1 2027 schedule for select streaming and groceries, excluding Walmart and Target. *(Remaining: Monet’s generic categories approximate issuer-specific exclusions.)* [Discover calendar](https://www.discover.com/credit-cards/cash-back/cashback-calendar.html) · [Chase announcement](https://media.chase.com/news/chase-freedom-flex-more-travel-value)

### P2 — App Store Public Launch Assets
* **Status:** 🟡 In progress
* **Assets:** [listing copy](../marketing/app-store-launch/Listing.md), [privacy questionnaire](../marketing/app-store-launch/Privacy-Questionnaire.md), and [6.9-inch and 6.3-inch screenshots](../marketing/app-store-launch/Screenshots.md).
* **Remaining:** Capture 13-inch iPad screenshots (if targeting iPad), verify the final archive’s data collection, and upload the approved assets in App Store Connect.

### P2 — Engineering Hygiene & Stability
* **Status:** ✅ Addressed locally (deployed-stage confirmation in release manifest)
* **Action:**
  1. ✅ **Local DB Parity:** `raw/croe/src/init-db.ts` defines all 14 local tables. Verified on an isolated DynamoDB Local instance that initialization creates `MonetFormSubmissions` with both indexes.
  2. ✅ **Website Testing:** Added ESLint, Vitest unit tests, and Chrome browser smoke coverage for `/`, `/app`, offline wallet persistence after the service worker has cached the app, and the guest fallback when the API is unavailable.
  3. ✅ **Release Manifest:** The [release manifest](RELEASE_MANIFEST.md) records the local revisions and build, separates `dev` from `prod`, and identifies the deployment records to verify.

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
| **Data & Rewards** | 🟡 | Audit Card Catalog | Backend shared caps implemented locally. Issuer activation tracking is deferred. |
| **Data & Rewards** | 🟡 | Apple Pay Nuances | Apple Card payment terms appear in iOS Card Details. |
| **Data & Rewards** | 🟡 | Rotating Categories | Discover Q4 verified against the issuer. Chase Q1 2027 categories added locally. |
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
| **Security** | 🟡 | Dependency Audit | See the current audit results in the [release manifest](RELEASE_MANIFEST.md). |
| **Testing/CI** | ✅ | Backend Unit Tests | Vitest unit and isolated DynamoDB integration suites passing. |
| **Testing/CI** | ✅ | iOS Automated Tests | Unit and UI test targets configured in Xcode project. |
| **Testing/CI** | ✅ | CI/CD Pipeline | GitHub Actions workflow active for backend verification. |
| **Marketing** | 🟡 | App Store Listing Assets | Both iPhone screenshot sizes prepared. Listing and privacy responses drafted. iPad assets and submission pending. |
| **Marketing** | ✅ | Custom API Domain | CloudFront distribution with ACM certificate for `api.tapmonet.com`. |
| **Marketing** | ✅ | Marketing Website | Astro 5 landing page live on Firebase Hosting (`monet-3d69d.web.app`). |

---

## 5. Verified System Inventory

| Area | Deployed Implementation |
|---|---|
| **Backend** | TypeScript/Express on Node.js 24, Lambda via `serverless-http`, API Gateway HTTP API, CloudFront, 14 DynamoDB tables, Plaid, Google Places/KG, Bedrock Nova Micro, SES. |
| **API Protection** | Lambda authorizer, CloudFront WAF rate limiting, viewer HMAC quotas, DynamoDB daily rate limiting, origin secret verification. |
| **Data Stores** | 14 DynamoDB tables (`MonetUsers`, `MonetCredentials`, `MonetAppInstallations`, `MonetOverrides`, `MonetRecommendationPreferences`, `MonetRecommendationFeedback`, `MonetTransactions`, `MonetInsightsCache`, `MonetBrandCache`, `MonetPlaidItemIndex`, `MonetMerchantEnrichment`, `MonetCategorizationAudit`, `MonetRateLimits`, `MonetFormSubmissions`). |
| **iOS Client** | SwiftUI/SwiftData, 5 tabs, guest/Google/Apple/email auth, Plaid Link & Insights, offline recommender, Calculator, widgets, MetricKit telemetry. |
| **Web Client** | Astro 5 + Tailwind 4, 6 routes, Firebase static hosting, PWA guest flow, local wallet persistence, category overview. |
| **Card Catalog** | 26 supported cards, 32 category taxonomy values. |
| **Test Verification** | Backend Vitest unit & DynamoDB integration suites; website ESLint, unit, browser smoke, and Astro build; iOS unit/UI test targets. |

---

## 6. Documentation Policy

This document (`outputs/CURRENT_STATE_ACTIONS.md`) is the **single source of truth** for active engineering priorities, release readiness, and verified inventory. Static HTML documentation in `wiki-html/` provides technical and architectural reference. Historical one-off task artifacts in `outputs/` are retired or consolidated here.

