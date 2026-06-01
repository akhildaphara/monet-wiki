# Beta Preparation Checklist

Before launching Monet into a beta testing phase, several key features, configurations, and administrative tasks need to be completed to ensure a smooth, stable, and valuable experience for early testers.

**Legend:** ✅ Done · 🟡 Partial / in-progress · ⬜ Not started

**Last assessed:** 2026-05-31 (code + HLD + AWS `croe-dev` stack verified)

---

## 1. Backend Infrastructure & Environment

| Status | Item | Evidence |
|--------|------|----------|
| 🟡 | **Deploy API Server** | `croe-dev` stack is live (`UPDATE_COMPLETE`): Lambda + HTTP API Gateway + CloudFront (`d2fbowggfpw2nf.cloudfront.net`). HLD §Architecture. **Gap:** no `croe-prod` stack; checklist originally assumed first deploy. |
| 🟡 | **Provision Production DynamoDB** | All tables defined in `raw/croe/serverless.yml` (`MonetUsers`, `MonetOverrides`, `MonetTransactions`, `MonetInsightsCache`, `MonetBrandCache`, `MonetPlaidItemIndex`) with `PAY_PER_REQUEST`. **Deployed for `dev` stage only** — prod tables/SSM path not provisioned (`/monet/prod` empty). HLD §Schema. |
| 🟡 | **Secure API Keys** | Dev SSM parameters exist (`/monet/dev/*`); `serverless.yml` injects Plaid, Google, guest JWT, origin secret from SSM. Bootstrap script: `raw/croe/scripts/ssm-bootstrap.sh`, `how-tos/aws-ssm-setup.md`. **Gap:** prod SSM not bootstrapped; `LOG_LEVEL: debug` still in `serverless.yml:38`. |
| 🟡 | **Set Base URL in iOS App** | `APIClient.swift`: Debug → `http://{LOCAL_API_HOST}/v1`; Release → `https://{CLOUDFRONT_URL}/v1` with fallback to `tp6uftgjud.execute-api.us-east-1.amazonaws.com`. CloudFront domain from deploy output must be set in `Secrets.xcconfig` → `CLOUDFRONT_URL`. HLD §Architecture. **Gap:** Release builds silently use API Gateway fallback if xcconfig unset (bypasses CloudFront edge cache + origin secret on client path). |

---

## 2. iOS App Polish & Stability

| Status | Item | Evidence |
|--------|------|----------|
| ⬜ | **TestFlight Configuration** | No App Store Connect / TestFlight artifacts in repo. Requires Apple Developer Program enrollment (Sign in with Apple is also blocked on this). |
| 🟡 | **App Icon & Branding** | `AppIcon.appiconset/Contents.json` references `AppIcon_Original.png` but **the PNG is not present** in the asset catalog (only `Contents.json` on disk). `AppIconDev.appiconset` exists for dev builds. |
| ✅ | **Onboarding Flow** | `OnboardingView.swift` implements value-first flow (Welcome → Pick cards → Aha) with guest path; `RootTabView.swift` routes guests to main tabs. Matches `outputs/Onboarding-Plan.md` Phases 1–2. |
| 🟡 | **Empty States & Feedback** | `WalletView.swift` empty state + "Add your first card" CTA; `SearchView.swift` still shows "No cards in wallet" warning; haptics centralized in `Haptics.swift` + `.sensoryFeedback` across components. Needs device QA on overrides/categorization. |
| 🟡 | **Error Handling UI** | `NetworkMonitor`, `NetworkStatusBanner`, offline category search in `SearchView.swift`; `CategorizerService.swift` fast-path + offline fallback; `ErrorView.swift` / rate-limit handling in `APIClient.swift`. Infinite-spinner paths reduced but not formally QA'd for 500/latency. |

---

## 3. Data & Algorithms

| Status | Item | Evidence |
|--------|------|----------|
| 🟡 | **Audit Card Catalog** | Curated catalog in `cardRewardsData.ts` (`SUPPORTED_CARDS`): industry refresh 2026-05-31; caps, Bilt 2.0, Prime Visa split. Backend tests: 363 passing (`raw/croe/changelog.md`). Catalog grows over time via backend deploy — no fixed count in marketing. Manual spot-check of issuer pages still recommended before beta. |
| ⬜ | **Handle "Apple Pay" Nuances** | `APPLE_CARD` still uses flat `[Category.OTHER]: 0.02` with note "2% with Apple Pay" — no Apple Pay intent flag in optimizer (`Bug-Hunt.md` §2; HLD does not model payment method). |
| 🟡 | **Dynamic Rotating Categories** | `RotatingCategory` type + date-resolved `schedule` for `DISCOVER_IT` and `CHASE_FREEDOM_FLEX` (Q1–Q2 2026 in `cardRewardsData.ts`). iOS mirrors via `SpecialReward.rotatingCategory`. HLD §Rotating categories: **Q3/Q4 2026 TBA**; activation not modeled; cap is per-category not issuer pool. |

---

## 4. Analytics & Observability

| Status | Item | Evidence |
|--------|------|----------|
| ⬜ | **Crash Reporting** | No Sentry, Crashlytics, or MetricKit in `raw/swift-app`. |
| 🟡 | **Backend Logging** | Lambda logs → CloudWatch; structured `{ level: "ERROR" }` metric filter + SNS alarms in `serverless.yml` (HLD §Monitoring). **Gaps:** `LOG_LEVEL: debug` in prod deploy config; no Plaid/Google/CloudFront alarms; single email SNS subscriber. |

---

## 5. Legal & Compliance

| Status | Item | Evidence |
|--------|------|----------|
| ⬜ | **Privacy Policy & Terms of Service** | `SignInView.swift` / `LoginView.swift` show static caption text only — **not tappable links**. No `/privacy` or `/terms` routes in `raw/website` (only marketing copy "Privacy First" on landing page). |
| ⬜ | **Google OAuth Verification** | Not verifiable from repo. Required to remove "Unverified App" warning for external testers. Needs hosted privacy policy URL on OAuth consent screen. |
| ⬜ | **Sign in with Apple (App Store 4.8)** | `SignInView.swift:75–85` — Apple button **commented out** ("disabled until paid Apple Developer Program enrollment"). Google-only sign-in is an **App Store rejection risk** for public launch. |

---

## 6. Feedback Loop

| Status | Item | Evidence |
|--------|------|----------|
| ⬜ | **In-App Feedback Mechanism** | `ProfileView.swift` has preferences, sign-in/out, debug preview — **no "Send Feedback"** button, mailto, or form link. |

---

## 7. Security & Abuse Controls *(added from security reviews, 2026-05-31)*

| Status | Item | Evidence |
|--------|------|----------|
| 🟡 | **OAuth audience validation** | `GOOGLE_CLIENT_ID` / `APPLE_CLIENT_ID` now in `serverless.yml` (SSM). `verifyToken.ts` rejects missing audience in production. **Verify deployed Lambdas picked up latest deploy** (`croe-dev-api:50`). |
| 🟡 | **Guest mint / origin-secret hardening** | `requireOriginSecret` on `POST /v1/auth/guest` per `changelog.md`; authorizer uses timing-safe compare. Security review M-2 partially addressed — confirm API Gateway direct URL still reachable for other public routes. |
| 🟡 | **Rate limiting (global)** | Express limiters in `rateLimit.ts` (HLD §Rate Limits). **Still in-memory per Lambda instance** — not shared; no API Gateway/WAF throttling. |
| 🟡 | **iOS data-at-rest hardening** | `SecureStorage` + Keychain for Apple token; `clearTransactionCaches()` on logout. Plaid accounts/insights still largely in `UserDefaults` (`Security-Review-iOS.md` H-4). |
| 🟡 | **TLS pinning (Release)** | `CertificatePinning.swift` + `APIClient` wired; **`PINNED_API_CERT_SHA256` empty** in `Info.plist` — pinning disabled until hash configured post-deploy. |
| 🟡 | **Dependency / npm audit** | `changelog.md` notes axios bump + audit fixes; no CI gate enforcing `npm audit --audit-level=high`. |

---

## 8. Testing & CI *(added from Testing-Strategy-Plan.md)*

| Status | Item | Evidence |
|--------|------|----------|
| 🟡 | **Backend automated tests** | Vitest suite: 40 test files, 363 tests passing (`raw/croe/tests/`). No coverage threshold enforced in CI. |
| 🟡 | **iOS automated tests** | 11 `AppTests` targets + `UITests` (`APIClientTests`, `DataStoreTests`, `SecureStorageTests`, etc.). Not wired to CI. |
| ⬜ | **CI/CD pipeline** | No `.github/workflows` or equivalent in Monet knowledge-base repos. Manual deploy via `npm run deploy:dev`. |

---

## 9. App Store & Marketing Assets *(added)*

| Status | Item | Evidence |
|--------|------|----------|
| ⬜ | **App Store listing assets** | No screenshots, description, keywords, or age rating artifacts in repo. |
| ⬜ | **Custom API domain** | CloudFront default domain only (`*.cloudfront.net`). No `api.croe.ai` custom domain / ACM cert referenced in `serverless.yml`. |
| 🟡 | **Marketing website** | `raw/website` Next.js landing page exists; lacks legal pages and deep links for OAuth privacy URL. |

---

## HLD ↔ Code Discrepancies (do not assume — track explicitly)

| Topic | HLD says | Code says | Action |
|-------|----------|-----------|--------|
| `GET /v1/cards` auth | ~~API accordion badge: "Auth: Required"~~ | Public route, no authorizer (`serverless.yml:82–84`); edge-cached | **Resolved 2026-05-31** — HLD accordion + compact table now mark Public |
| OAuth audience | Security review (pre-fix) flagged missing env | `serverless.yml:39–40` + `verifyToken.ts` hardening + changelog | **Addressed in code** — re-verify SSM values on each stage deploy |
| Rotating categories | Was "hardcoded" in original checklist | Now data-driven end-to-end | Update mental model; remaining gap is Q3/Q4 schedule + activation |
| iOS pinning / ATS | Security review flagged global ATS + no pinning | `Info.plist` has no global ATS; Debug-only exception in `project.pbxproj`; pinning optional | Configure `PINNED_API_CERT_SHA256` + `CLOUDFRONT_URL` for Release beta builds |

---

## Readiness Snapshot

| Category | Done | Partial | Not started |
|----------|------|---------|-------------|
| Backend infra | 0 | 4 | 0 |
| iOS polish | 1 | 4 | 1 |
| Data/algorithms | 0 | 2 | 1 |
| Observability | 0 | 1 | 1 |
| Legal/compliance | 0 | 0 | 3 |
| Feedback | 0 | 0 | 1 |
| Security | 0 | 6 | 0 |
| Testing/CI | 0 | 2 | 1 |
| App Store/marketing | 0 | 1 | 2 |
| **Total (32 items)** | **1** | **20** | **11** |

**Rough readiness: ~55%** (1 full ✅ + 20 partial at ~50% each ≈ 11 "equivalent done" of 32). **Closed beta with dev backend + trusted testers:** achievable in ~4–6 weeks. **Public App Store beta:** blocked primarily by Apple Developer enrollment, Sign in with Apple, legal pages, and TestFlight setup.
