# Beta Preparation Checklist

Before expanding Monet's beta testing phase, key features, configurations, and administrative tasks are tracked below to ensure a smooth, stable, and valuable experience for early testers.

**Legend:** ✅ Done · 🟡 Partial / in-progress · ⬜ Not started

**Last assessed:** 2026-08-05 (Audited & aligned with live TestFlight + `croe-dev` environment)

---

## 1. Backend Infrastructure & Environment

| Status | Item | Evidence |
|--------|------|----------|
| ✅ | **Deploy API Server** | `croe-dev` stack is live (`UPDATE_COMPLETE`) and designated as the active Beta/Production server environment: Lambda + HTTP API Gateway + CloudFront (`d2fbowggfpw2nf.cloudfront.net`). Serves live TestFlight testers. |
| ✅ | **Provision Production DynamoDB** | `croe-dev` DynamoDB tables (`MonetUsers`, `MonetOverrides`, `MonetTransactions`, `MonetInsightsCache`, `MonetBrandCache`, `MonetPlaidItemIndex`) use `PAY_PER_REQUEST` auto-scaling, serving active TestFlight beta users seamlessly without capacity bottlenecks. |
| ✅ | **Secure API Keys** | `/monet/dev/*` SSM parameters inject Plaid, Google, Apple, guest JWT, and origin secret into Lambda runtime. Managed via `raw/croe/scripts/ssm-bootstrap.sh`. |
| ✅ | **Set Base URL in iOS App** | `APIClient.swift`: Pointed to CloudFront distribution endpoint (`https://{CLOUDFRONT_URL}/v1`) for live TestFlight release builds. |

---

## 2. iOS App Polish & Stability

| Status | Item | Evidence |
|--------|------|----------|
| ✅ | **TestFlight Configuration** | App is actively deployed on **TestFlight** and distributed to beta testers via App Store Connect. |
| ✅ | **App Icon & Branding** | `AppIcon.appiconset/AppIcon.png` (1024x1024, 1.1MB) present in asset catalog with fully configured `Contents.json`. |
| ✅ | **Onboarding Flow** | `OnboardingView.swift` implements value-first flow (Welcome → Pick cards → Aha) with guest path; `RootTabView.swift` routes guests seamlessly. Matches `outputs/Onboarding-Plan.md` Phases 1–2. |
| ✅ | **Empty States & Feedback** | `EmptyStateView.swift` hero animation; `EmptyWalletTapestryView.swift`; `Haptics` service (tap, press, impact, selection, success, warning, error) wired across views and error handlers. |
| ✅ | **Error Handling UI** | `NetworkMonitor`, `NetworkStatusBanner`, offline search in `SearchView.swift`, `ErrorViewWithReport` with direct feedback sheet and tactile error haptics. |

---

## 3. Data & Algorithms

| Status | Item | Evidence |
|--------|------|----------|
| 🟡 | **Audit Card Catalog** | Curated catalog in `cardRewardsData.ts` (`SUPPORTED_CARDS`): industry refresh 2026-05-31; caps, Bilt 2.0, Prime Visa split. Backend tests: 500 passing (`raw/croe/changelog.md`). Catalog grows dynamically via backend deploy. |
| ⬜ | **Handle "Apple Pay" Nuances** | `APPLE_CARD` uses flat `[Category.OTHER]: 0.02` with note "2% with Apple Pay" — payment method intent flag not yet modeled in optimizer. |
| ✅ | **Dynamic Rotating Categories** | Full 2026 Q1–Q4 schedule for Discover it (Q4: Amazon & Target) and Chase Freedom Flex (Q4: PayPal & Wholesale Clubs) data-driven and active in `cardRewardsData.ts`. Verified by 500 test suite. |

---

## 4. Analytics & Observability

| Status | Item | Evidence |
|--------|------|----------|
| 🟡 | **Crash Reporting** | `CrashReporter.swift` implements Apple `MetricKit` (`MXMetricManager`, `MXDiagnosticPayload`), capturing crashes, hangs, and disk exceptions, persisting payloads to `Documents/CrashReports/`, capturing user breadcrumbs, and attaching logs to feedback. |
| 🟡 | **Backend Logging** | Lambda logs → CloudWatch; structured `{ level: "ERROR" }` metric filter + SNS alarms in `serverless.yml` (HLD §Monitoring). |

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
| ✅ | **OAuth audience validation** | `GOOGLE_CLIENT_ID` / `APPLE_CLIENT_ID` in `serverless.yml` (SSM). `verifyToken.ts` validates token audience in production. |
| ✅ | **Guest mint / origin-secret hardening** | `requireOriginSecret` on `POST /v1/auth/guest`; authorizer uses timing-safe comparison. |
| 🟡 | **Rate limiting (global)** | Express limiters in `rateLimit.ts` (HLD §Rate Limits). In-memory per Lambda instance. |
| ✅ | **iOS data-at-rest hardening** | `SecureStorage` + Keychain for Apple and session tokens; `clearTransactionCaches()` on logout. |
| ✅ | **TLS Pinning (Release)** | `CertificatePinning.swift` + `APIClient` fully implemented; `PINNED_API_CERT_SHA256` key linked in `Info.plist` and configurable in `Secrets.xcconfig`. |
| 🟡 | **Dependency / npm audit** | `npm audit` clean in `raw/croe`. |

---

## 8. Testing & CI

| Status | Item | Evidence |
|--------|------|----------|
| ✅ | **Backend automated tests** | Vitest suite: 51 test files, 500 tests passing (`raw/croe/tests/`). |
| ✅ | **iOS automated tests** | 11 `AppTests` targets + `UITests` (`APIClientTests`, `DataStoreTests`, `SecureStorageTests`, etc.). |
| ⬜ | **CI/CD pipeline** | No `.github/workflows` or equivalent pipeline. Manual deploy via `npm run deploy:dev`. |

---

## 9. App Store & Marketing Assets

| Status | Item | Evidence |
|--------|------|----------|
| ⬜ | **App Store listing assets** | Screenshots, description, keywords, and age rating artifacts pending public launch. |
| 🟡 | **Custom API Domain** | CloudFront default domain active (`d2fbowggfpw2nf.cloudfront.net`). |
| ✅ | **Marketing website** | `raw/website` Astro v5 landing page live on Firebase Hosting (`monet-3d69d.web.app`) with app preview, dev journey, contact form, Privacy Policy, and Terms of Service. |

---

## Readiness Snapshot

| Category | Done | Partial | Not started |
|----------|------|---------|-------------|
| Backend infra | 4 | 0 | 0 |
| iOS polish | 5 | 0 | 0 |
| Data/algorithms | 1 | 1 | 1 |
| Observability | 0 | 2 | 0 |
| Legal/compliance | 3 | 0 | 0 |
| Feedback | 1 | 0 | 0 |
| Security | 4 | 2 | 0 |
| Testing/CI | 2 | 0 | 1 |
| App Store/marketing | 1 | 1 | 1 |
| **Total (32 items)** | **21** | **7** | **4** |

**Overall Beta Status: ACTIVE ON TESTFLIGHT (~80% Readiness)**
- **TestFlight Beta:** Live and active with real testers using `croe-dev` backend.
- **Backend Architecture:** `croe-dev` serverless infrastructure (Lambda + DynamoDB `PAY_PER_REQUEST` + CloudFront CDN) auto-scales effortlessly for all beta users.
- **Next Horizon for Public App Store Release:** Custom API domain, CI/CD automated pipeline, and App Store screenshots/listing copy.
