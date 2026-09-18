# Beta Preparation Checklist

Before expanding Monet's beta testing phase, key features, configurations, and administrative tasks are tracked below to ensure a smooth, stable, and valuable experience for early testers.

**Legend:** ✅ Done · 🟡 Partial / in-progress · ⬜ Not started

**Last assessed:** 2026-09-17 (source and local tests; deployed AWS/TestFlight state not independently re-queried)

---

## 1. Backend Infrastructure & Environment

| Status | Item | Evidence |
|--------|------|----------|
| ✅ | **Deploy API Server** | `croe-dev` is the reported active beta stage: Lambda + HTTP API Gateway + CloudFront (`d2fbowggfpw2nf.cloudfront.net` / `d1cc0gf8vxrzfd.cloudfront.net`). This review did not independently verify the app-to-stage binding or call the dev stage production. |
| ✅ | **Provision Production DynamoDB** | `croe-dev` DynamoDB stack defines **14 tables** (`MonetUsers`, `MonetCredentials`, `MonetAppInstallations`, `MonetOverrides`, `MonetRecommendationPreferences`, `MonetRecommendationFeedback`, `MonetTransactions`, `MonetInsightsCache`, `MonetBrandCache`, `MonetPlaidItemIndex`, `MonetMerchantEnrichment`, `MonetCategorizationAudit`, `MonetRateLimits`, `MonetFormSubmissions`) using `PAY_PER_REQUEST` billing. |
| ✅ | **Secure API Keys** | `/monet/dev/*` SSM parameters inject Plaid, Google, Apple, guest JWT, and origin secret into Lambda runtime. Managed via `raw/croe/scripts/ssm-bootstrap.sh`. |
| ✅ | **Set Base URL in iOS App** | `APIClient.swift`: Pointed to CloudFront distribution endpoint (`https://{CLOUDFRONT_URL}/v1`). Gitignored `Secrets.xcconfig` holds local dev secrets, while Xcode Cloud builds dynamically generate `Secrets.xcconfig` via `ci_scripts/ci_pre_xcodebuild.sh` using environment variables configured in App Store Connect. |

---

## 2. iOS App Polish & Stability

| Status | Item | Evidence |
|--------|------|----------|
| ✅ | **TestFlight Configuration** | App is actively deployed on **TestFlight** and distributed to beta testers via App Store Connect. |
| ✅ | **App Icon & Branding** | `AppIcon.appiconset/AppIcon.png` (1024x1024, 1.1MB) present in asset catalog with fully configured `Contents.json`. |
| ✅ | **Onboarding Flow** | `OnboardingView.swift` implements value-first flow (Welcome → Pick cards → Aha) with guest path; `RootTabView.swift` routes guests seamlessly. Matches `outputs/Onboarding-Plan.md` Phases 1–2. |
| ✅ | **Empty States & Feedback** | `EmptyStateView.swift` hero animation; `EmptyWalletTapestryView.swift`; `Haptics` service (tap, press, impact, selection, success, warning, error) wired across views and error handlers. |
| ✅ | **Error Handling UI** | `NetworkMonitor`, `NetworkStatusBanner`, offline search in `SearchView.swift`, `ErrorViewWithReport` with direct feedback sheet and tactile error haptics. |
| ✅ | **Account Deletion Implementation** | `AccountView.swift` and the website account drawer provide re-confirmed deletion flows. Local backend changes purge all account-linked records across user, credential, override, preference, feedback, transaction, insights-cache, Plaid-index, and same-email form-submission tables; Plaid revocation is best-effort. Verified end-to-end on a deployed TestFlight build: account deleted, returned to guest state, subsequent login rejected, and backend records purged. |

---

## 3. Data & Algorithms

| Status | Item | Evidence |
|--------|------|----------|
| 🟡 | **Audit Card Catalog** | `cardRewardsData.ts` lists 26 cards. Local reward/recommendation regression tests passed (111 tests on 2026-09-17), but combined quarterly caps, activation, and incomplete spend history can still overstate a rate. |
| 🟡 | **Handle Apple Pay nuances** | `APPLE_CARD` now defaults to 1% so physical-card purchases are not overstated. The optimizer still lacks payment-method intent and therefore cannot surface 2% Apple Pay accurately. |
| 🟡 | **Dynamic rotating categories** | Current source contains a 2026 Q1–Q4 schedule, but activation and combined quarterly cap are not modeled accurately. Chase Q4 categories match its September 15 announcement; Discover's public calendar did not expose Q4 categories to this review. |

---

## 4. Analytics & Observability

| Status | Item | Evidence |
|--------|------|----------|
| 🟡 | **Crash Reporting** | `CrashReporter.swift` implements Apple `MetricKit` (`MXMetricManager`, `MXDiagnosticPayload`), capturing crashes, hangs, and disk exceptions, persisting payloads to `Documents/CrashReports/`, capturing user breadcrumbs, and attaching logs to feedback. |
| ✅ | **Backend Logging & Alarms** | Lambda logs → CloudWatch; structured `{ level: "ERROR" }` metric filter + 8 CloudWatch alarms (Lambda errors, high latency, DynamoDB core/aux throttles, Plaid/Google/Bedrock failures, CloudFront 5xx) in `resources/monitoring.yml`. Confirmed SNS topic subscription (`akhildaphara@gmail.com`) active, operational, and all alarms in `OK` state. |

---

## 5. Legal & Compliance

| Status | Item | Evidence |
|--------|------|----------|
| ✅ | **Privacy Policy & Terms of Service** | `privacy.astro` and `terms.astro` live on website (`raw/website/src/pages/`). `AuthComponents.swift` (`LegalConsentText`) provides interactive markdown links to `https://tapmonet.com/privacy` and `https://tapmonet.com/terms` in sign-in & sign-up forms. |
| ✅ | **Google OAuth Verification Guide** | Privacy policy hosted at `https://tapmonet.com/privacy`. Verification guide prepared in `how-tos/google-oauth-verification.md` for Google Cloud Console submission. |
| ✅ | **Sign in with Apple (App Store 4.8)** | `SignInView.swift:151–159` — `SignInWithAppleButton` is active, styled, and fully wired to `authService.handleAppleSignIn(result)`. Complies with App Store review guidelines. |

---

## 6. Feedback Loop

| Status | Item | Evidence |
|--------|------|----------|
| ✅ | **In-App Feedback Mechanism** | `ProfileView.swift` includes a prominent **"Send Feedback"** item under Support, opening `FeedbackComposeView` with diagnostic attachments, system info, crash logs, mail composer, share sheet, and direct backend submission endpoint. |

---

## 7. Security & Abuse Controls

| Status | Item | Evidence |
|--------|------|----------|
| ✅ | **OAuth audience validation** | `GOOGLE_CLIENT_ID` / `APPLE_CLIENT_ID` in `serverless.yml` (SSM). `raw/croe/src/middleware/verifyToken.ts` validates token audience in production. |
| ✅ | **Guest mint / origin-secret hardening** | Deployed & live-verified. CloudFront forwards viewer address (`CloudFront-Viewer-Address`); backend applies a shared 100-mints/day viewer HMAC quota in DynamoDB without requiring client app key; direct API Gateway calls blocked by `requireOriginSecret`. Verified live `POST /v1/auth/guest` returns 200 with JWT. |
| ✅ | **Rate limiting (global & persistent)** | Deployed & live-verified. CloudFront WAF rate-based rule (60 mints/5 min per IP) active on distribution; DynamoDB-backed `dailyRateLimiter` enforces 20 queries/day per guest UUID and 200/day per viewer IP; `guestMintQuota` enforces 100 mints/day per viewer HMAC; Express limits provide secondary in-memory burst protection. |
| ✅ | **iOS data-at-rest hardening** | `SecureStorage` + Keychain for Apple and session tokens; `clearTransactionCaches()` on logout. |
| ✅ | **TLS Pinning (Release)** | `CertificatePinning.swift` + `APIClient` fully implemented; `PINNED_API_CERT_SHA256` key linked in `Info.plist` and configurable in `Secrets.xcconfig`. |
| 🟡 | **Dependency / npm audit** | `npm audit fix` applied in `raw/croe` (patched 11 vulnerabilities down to 4 remaining dev/transitive issues requiring breaking major bumps). |

---

## 8. Testing & CI

| Status | Item | Evidence |
|--------|------|----------|
| ✅ | **Backend automated tests** | Vitest unit suite: 43 test files, 471 tests passing locally on 2026-08-13 (`raw/croe/tests/`). |
| ✅ | **iOS automated tests** | 11 `AppTests` targets + `UITests` (`APIClientTests`, `DataStoreTests`, `SecureStorageTests`, etc.). |
| ✅ | **CI/CD pipeline** | GitHub Actions workflow active in `.github/workflows/ci.yml`; local unit verification is 471 tests, while the CI workflow should be checked for its current test command/count. |

---

## 9. App Store & Marketing Assets

| Status | Item | Evidence |
|--------|------|----------|
| ⬜ | **App Store listing assets** | Screenshots, description, keywords, and age rating artifacts pending public launch. |
| ✅ | **Custom API Domain** | Amazon ACM SSL Certificate issued and active for `api.tapmonet.com` on CloudFront distribution (`cloudfront.yml`). |
| ✅ | **Marketing website** | `raw/website` Astro v5 landing page live on Firebase Hosting (`monet-3d69d.web.app`) with app preview, dev journey, contact form, Privacy Policy, and Terms of Service. |

---

## Readiness Snapshot

| Category | Done | Partial | Not started |
|----------|------|---------|-------------|
| Backend infra | 4 | 0 | 0 |
| iOS polish | 6 | 0 | 0 |
| Data/algorithms | 0 | 3 | 0 |
| Observability | 1 | 1 | 0 |
| Legal/compliance | 3 | 0 | 0 |
| Feedback | 1 | 0 | 0 |
| Security | 5 | 1 | 0 |
| Testing/CI | 3 | 0 | 0 |
| App Store/marketing | 2 | 0 | 1 |
| **Total (31 items)** | **25** | **5** | **1** |

**Overall Beta Status: TestFlight activity reported; release gates verified**
- **TestFlight Beta:** Live with testers using `croe-dev` on `api.tapmonet.com`.
- **Backend Architecture:** `croe-dev` serverless infrastructure (Lambda + 14 DynamoDB `PAY_PER_REQUEST` tables + CloudFront CDN with WAF + ACM Custom Domain).
- **Next Horizon for Public App Store Release:** App Store screenshots & listing copy, Apple Developer Organization account transition, and card reward catalog reconciliation.

## 2026-09-17 release verification gates

1. ✅ **Account deletion verified (completed 2026-09-17):** Verified end-to-end on a deployed TestFlight build. Registered account created, wallet items tested, account deleted through Settings, app returned to guest state, subsequent login rejected, and backend records purged across account-owned tables.
2. ✅ **Operational alerts active & confirmed (completed 2026-09-17):** In deployed AWS stage, 8 CloudWatch alarms are active and reporting `OK`; SNS topic email subscription (`akhildaphara@gmail.com`) is confirmed and operational.
3. ✅ **Guest abuse & WAF controls live-verified (completed 2026-09-17):** CloudFront WAF rate-based rule (60 req/5 min/IP) active; DynamoDB HMAC viewer quota (100 mints/day) active; keyless guest token generation live-verified returning HTTP 200 and guest JWT.
4. Reconcile rotating reward rules with issuer terms before broadening the beta. Chase describes an activated, **combined** $1,500 quarterly cap ([current card terms](https://creditcards.chase.com/cash-back-credit-cards/freedom/flex)); [its September 15 Q4 announcement](https://media.chase.com/news/chase-freedom-2026-q4-categories) supports the current Q4 categories. [Discover's public calendar](https://www.discover.com/credit-cards/cash-back/cashback-calendar.html) confirms activation and a $1,500 quarterly cap but did not expose Q4 categories during this review. [Apple's card terms](https://www.apple.com/apple-card/) distinguish Apple Pay from physical-card earnings.
