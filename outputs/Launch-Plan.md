# Monet Launch Plan & Timeline

**Prepared:** 2026-05-31 · **Last updated:** 2026-05-31 19:32  
**Baseline:** [beta-preparation.md](./beta-preparation.md) (annotated checklist)  
**Architecture source of truth:** [wiki-html/hld-dashboard.html](../wiki-html/hld-dashboard.html)

**Team assumption:** Small team / solo developer (~15–25 hrs/week). Durations scale linearly with headcount. All week numbers are **calendar weeks from "start now" (W1)**.

---

## Readiness Summary

| Metric | Value |
|--------|-------|
| **Overall readiness** | **~70%** (up from ~65% — xcloud CI build passing, `ci_pre_xcodebuild.sh` shipped) |
| **Backend (dev)** | Deployed and functional — `croe-dev` on AWS (`d2fbowggfpw2nf.cloudfront.net`) |
| **Backend (prod)** | Not deployed — no `/monet/prod` SSM, no `croe-prod` stack |
| **iOS core product** | Feature-complete for manual wallet + search + optional Plaid insights; guest onboarding shipped |
| **Biggest blockers** | (1) Apple Developer + Sign in with Apple, (2) ~~legal pages + OAuth verification~~ ✅ done, (3) TestFlight/release config, (4) prod environment, (5) ~~crash reporting + feedback loop~~ ✅ done |

### What shipped 2026-05-31

| Item | Status |
|------|--------|
| `Secrets.xcconfig` with `CLOUDFRONT_URL` | ✅ Already present |
| xcloud CI build passing (`ci_pre_xcodebuild.sh`) | ✅ Build green |
| App icon (`AppIcon_Original.png`) | ✅ Already tracked in git |
| Privacy Policy live at `/privacy` | ✅ `monet-3d69d.web.app/privacy` |
| Terms of Service live at `/terms` | ✅ `monet-3d69d.web.app/terms` |
| Footer links on homepage | ✅ deployed |
| Firebase routing fix (`cleanUrls`, removed catch-all rewrite) | ✅ deployed |
| `SignInView` consent text links to hosted pages | ✅ |
| Google OAuth consent screen — privacy URL ready to submit | ⏳ manual: add URL in Cloud Console |
| MetricKit crash reporting (`CrashReporter.swift`) | ✅ |
| "Send Feedback" in ProfileView (mailto, crash count in subject) | ✅ |

### Critical path

```text
Apple Developer enrollment         ← PENDING (purchase)
  → Sign in with Apple + TestFlight build
    → ✅ Privacy/Terms hosted + OAuth consent screen submitted
      → Closed beta (10–30 testers)
        → Security/observability hardening + prod stage
          → Open beta / App Store
```

Parallel work that does **not** block the critical path: card catalog audit, Apple Pay modeling, rotating Q3/Q4 schedules, shared rate-limit store, CI pipeline.

---

## Phase 0 — Foundations & Infra Hardening

**Goal:** A stable, observable **dev** environment that external testers can hit from Release iOS builds; close high-severity security gaps.

### Entry criteria
- `croe-dev` deployed (already met)
- Dev SSM populated (already met)

### Key tasks

| Area | Tasks | Est. |
|------|-------|------|
| **Backend** | ~~Set `LOG_LEVEL: info` for deployed stages~~ — keeping `debug` during early beta for full visibility | ✅ decided |
| **Backend** | Confirm latest security hardening deploy (`GOOGLE_CLIENT_ID`, guest origin-secret, webhook `iat`) is live; run full `npm test` before each deploy | 0.5 wk |
| **Backend** | Document and run `sls deploy --stage dev` smoke test: `/health`, guest mint + origin secret, `/recommend`, `/cards` cache headers | 0.5 wk |
| **Backend** | Decide beta target stage: **dev-only** (faster) vs **prod** stack + `/monet/prod` SSM bootstrap | 0.5 wk |
| **iOS** | ✅ `Secrets.xcconfig` with `CLOUDFRONT_URL=d2fbowggfpw2nf.cloudfront.net` — already present | done |
| **iOS** | After deploy, populate `PINNED_API_CERT_SHA256` in Info.plist (optional but recommended for beta) | 0.5 wk |
| **iOS** | ✅ `AppIcon_Original.png` tracked in git | done |
| **Ops** | Confirm SNS alert email receives Lambda error alarms; add Slack/PagerDuty if available | 0.25 wk |
| **Security** | Re-run spot checks from [Security-Review-Summary.md](./Security-Review-Summary.md) against post-changelog code; file any regressions | 0.5 wk |

### Exit criteria
- Release iOS build successfully calls CloudFront dev API end-to-end (sign-in, recommend, sync)
- No `LOG_LEVEL: debug` in deployed Lambda env
- App icon asset compiles for Archive
- Alarm email confirmed working

### Duration
**2 weeks** (can overlap with Phase 1 enrollment wait)

---

## Phase 1 — Closed Beta (TestFlight, 10–30 testers)

**Goal:** Trusted testers on real devices; collect crashes, UX friction, and card/categorization errors.

### Entry criteria
- Phase 0 exit criteria met
- Apple Developer Program active
- Privacy Policy + Terms URLs live (can be minimal)

### Key tasks

| Area | Tasks | Est. |
|------|-------|------|
| **Legal** | ✅ `/privacy` and `/terms` live at `monet-3d69d.web.app`; linked from `SignInView` and footer | done |
| **Legal** | ⏳ Submit Google OAuth consent screen for verification — add `monet-3d69d.web.app/privacy` in Cloud Console project `729586971535` | manual (Google review 1–4 wks async) |
| **iOS** | ✅ Sign in with Apple enabled — `MainApp.entitlements` + `SignInWithAppleButton` uncommented; `APPLE_CLIENT_ID = "akhil.Monet"` already in SSM | done |
| **iOS** | ⚙️ App Store Connect: create app record (bundle ID `akhil.Monet`), enable Sign in with Apple + Associated Domains capabilities, generate dist certificate + provisioning profile | manual in Xcode/ASC |
| **iOS** | TestFlight internal → external group; beta app description + "What to test" notes | 0.5 wk |
| **iOS** | ✅ MetricKit crash reporting integrated (`CrashReporter.swift` — saves payloads to `Documents/CrashReports/`); optionally add Sentry free tier for remote dashboards | done |
| **iOS** | ✅ "Send Feedback" in `ProfileView` — mailto link with crash count in subject | done |
| **Backend** | If moving beyond dev: bootstrap `/monet/prod`, `sls deploy --stage prod`, Plaid production keys | 1 wk |
| **Data** | Card catalog spot-audit (full `SUPPORTED_CARDS` list); add Q3 2026 rotating schedules when issuers publish | 0.5 wk ongoing |
| **QA** | Manual test matrix: guest onboarding, Google sign-in, wallet CRUD, search online/offline, Plaid link (sandbox), insights sync | 1 wk |

### Exit criteria
- ≥10 external TestFlight installs
- Crash-free sessions >95% over 7 days (once crash tooling live)
- No P0 bugs (auth loop, data loss, blank wallet after sign-in)
- Feedback channel receiving ≥5 substantive reports
- Google OAuth unverified warning resolved **or** testers briefed to use "Advanced → Go to Monet"

### Duration
**4–5 weeks** (includes Apple enrollment + OAuth verification latency)

---

## Phase 2 — Open Beta (50–200 testers)

**Goal:** Scale feedback, harden abuse/cost controls, improve observability before public launch.

### Entry criteria
- Phase 1 exit criteria met
- Prod backend (recommended) or dev with strict rate limits

### Key tasks

| Area | Tasks | Est. |
|------|-------|------|
| **Backend** | Shared rate-limit store (DynamoDB) or CloudFront WAF rate rules (HLD Future §Throttling) | 1–2 wk |
| **Backend** | Restrict guest JWT from Plaid write routes (Security M-6) | 0.5 wk |
| **Backend** | Alarms: CloudFront 5xx, DynamoDB throttling, Plaid error rate (HLD §Monitoring gap) | 1 wk |
| **Backend** | Custom domain `api.croe.ai` + ACM (optional polish) | 0.5 wk |
| **iOS** | Migrate remaining Plaid/insights UserDefaults caches to encrypted storage | 1 wk |
| **iOS** | App Store assets: 6.7" screenshots, description, keywords | 1 wk |
| **Ops** | CI: GitHub Actions — `npm test` on croe, `xcodebuild test` on swift-app | 1 wk |
| **Data** | Apple Pay intent toggle or conservative Apple Card rate (1% default) | 1 wk |
| **Product** | Triage beta feedback → card additions, categorization fixes | ongoing |

### Exit criteria
- 50+ active testers / 2 weeks
- API cost within budget under load (Places/Bedrock not spiking from abuse)
- P0/P1 bug backlog <5 items
- TestFlight crash-free rate ≥98%

### Duration
**4–6 weeks**

---

## Phase 3 — Public Launch (App Store)

**Goal:** App Store submission and marketing site launch.

### Entry criteria
- Phase 2 exit criteria met
- Sign in with Apple + Google both working
- Privacy/Terms/OAuth verified
- Prod backend stable ≥2 weeks

### Key tasks

| Area | Tasks | Est. |
|------|-------|------|
| **iOS** | App Review submission; respond to review notes (finance/Plaid disclosure) | 1–2 wk |
| **Website** | Launch polish, App Store link, support email | 0.5 wk |
| **Backend** | Prod deploy, Plaid production, final security pass | 1 wk |
| **Ops** | Runbook: deploy, rollback, on-call, incident comms | 0.5 wk |
| **Legal** | Plaid/data retention policy review; CCPA basics if US-wide | 0.5 wk |

### Exit criteria
- App Store approved and live
- Prod monitoring green for 7 days post-launch

### Duration
**2–3 weeks** (App Review variable)

---

## Timeline (Gantt-style)

Assumes **W1 = start now**, solo/small team, Apple Developer enrollment submitted W1.

| Task | W1 | W2 | W3 | W4 | W5 | W6 | W7 | W8 | W9 | W10 | W11 | W12 | W13 | W14 |
|------|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:---:|:---:|:---:|:---:|:---:|
| **Phase 0** Release URL + icon + LOG_LEVEL + smoke tests | █ | █ | | | | | | | | | | | | |
| Apple Developer enrollment (async) | █ | █ | █ | | | | | | | | | | | |
| Privacy/Terms pages + OAuth submit | | █ | █ | █ | | | | | | | | | | |
| Sign in with Apple + TestFlight setup | | | █ | █ | █ | | | | | | | | | |
| Crash reporting + feedback button | | | | █ | █ | | | | | | | | | |
| **Phase 1** Closed beta (10–30) | | | | | █ | █ | █ | | | | | | | |
| Card audit + QA matrix | | | █ | █ | █ | | | | | | | | | |
| Prod stack (optional for closed beta) | | | | | | █ | █ | | | | | | | |
| **Phase 2** Rate limits + monitoring + CI | | | | | | | | █ | █ | █ | █ | | | |
| iOS storage hardening + App Store assets | | | | | | | | | █ | █ | █ | | | |
| **Phase 2** Open beta (50–200) | | | | | | | | | | | █ | █ | █ | |
| **Phase 3** App Review + public launch | | | | | | | | | | | | | █ | █ |

**Estimated total: 12–14 weeks** from W1 to App Store live (closed beta ~W6, open beta ~W10).

---

## Top Blockers to Start Now

1. **Apple Developer Program** — Blocks TestFlight, Sign in with Apple (Guideline 4.8), and App Store. Start enrollment immediately; lead time is often 1–2 weeks.

2. ~~**Legal pages + OAuth**~~ ✅ **Done** — Privacy Policy at `monet-3d69d.web.app/privacy`, Terms at `/terms`, both linked from `SignInView`. Submit Google OAuth consent screen verification in Cloud Console (project `729586971535`) — add the privacy URL and submit for review (1–4 weeks async).

3. ~~**Release iOS → CloudFront wiring**~~ ✅ **Done** — `Secrets.xcconfig` already has `CLOUDFRONT_URL = d2fbowggfpw2nf.cloudfront.net`.

4. ~~**App icon asset missing**~~ ✅ **Done** — `AppIcon_Original.png` is tracked and committed in `raw/swift-app`.

5. ~~**Crash reporting + feedback**~~ ✅ **Done** — `CrashReporter.swift` (MetricKit) integrated in `MainApp.init()`; "Send Feedback" in ProfileView with crash count in subject line.

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| App Store rejection (no Sign in with Apple) | High | Blocks public launch | Enable Apple sign-in before external TestFlight beyond friends-and-family |
| Google "Unverified App" scares testers | Medium | Drops sign-in conversion | Publish privacy policy; submit OAuth verification in Phase 1 W2 |
| API cost abuse via guest mint / Places / Bedrock | Medium | Bill shock | Origin-secret on guest mint (done); add WAF or DynamoDB rate limits before open beta |
| Wrong card recommendations (rotating Q3, Apple Pay) | Medium | Trust erosion | Label beta; quarterly schedule update process; conservative Apple Card default |
| Plaid sandbox vs production confusion | Medium | Broken bank link in prod | Keep closed beta on sandbox; switch Plaid env only with prod stack |
| HLD/docs drift (e.g. `/cards` auth badge) | Low | Agent/dev confusion | Fix HLD accordion; treat `hld-dashboard.html` as SoT per AGENTS.md |
| Solo dev bandwidth | High | Timeline slip | Ship closed beta on **dev** stage only; defer prod + CI to Phase 2 |
| Security review stale vs changelog fixes | Medium | False confidence | Re-verify deployed Lambda env vars and run targeted auth/rate-limit tests |

---

## Beta Launch Go / No-Go Checklist

Use this gate **before inviting external TestFlight testers** (Phase 1).

### Must pass (NO-GO if any fail)

- [x] Apple Developer account active
- [ ] App created in App Store Connect (bundle ID `akhil.Monet`, capabilities: Sign in with Apple, Associated Domains)
- [x] Sign in with Apple enabled in code (`MainApp.entitlements` + `SignInView.swift`)
- [x] Privacy Policy URL live and linked from sign-in screen — `monet-3d69d.web.app/privacy`
- [x] Release build uses CloudFront URL — `Secrets.xcconfig` has `CLOUDFRONT_URL = d2fbowggfpw2nf.cloudfront.net`
- [x] xcloud CI build green — `ci_pre_xcodebuild.sh` injects secrets at build time
- [ ] `/health` and core flows work on device: guest onboarding → pick cards → search → recommend
- [ ] Google (and Apple if enabled) sign-in completes without infinite spinner; wallet persists after sign-in
- [x] Crash reporting integrated — MetricKit `CrashReporter.swift` saves payloads to `Documents/CrashReports/`
- [x] Feedback mechanism reachable from Profile — "Send Feedback" mailto in ProfileView
- [x] App icon present in Archive build — `AppIcon_Original.png` committed
- [ ] SNS / email alert received from intentional test error in dev API

### Should pass (GO with documented exceptions)

- [ ] `LOG_LEVEL: debug` kept for early beta — flip to `info` before open beta
- [ ] OAuth consent screen submitted — add `monet-3d69d.web.app/privacy` in Cloud Console and hit Submit (even if Google review pending)
- [ ] Backend test suite green (`npm test`)
- [ ] iOS unit tests green (`xcodebuild test`)
- [ ] Card catalog spot-checked for top 10 user-reported cards
- [ ] Plaid Link tested end-to-end in sandbox
- [ ] Offline search degrades gracefully (no infinite ProgressView)
- [ ] `npm audit --audit-level=high` clean or exceptions documented

### Nice to have (defer to Phase 2)

- [ ] Prod AWS stage deployed
- [ ] TLS certificate pinning enabled
- [ ] Shared global rate limits / WAF
- [ ] CI pipeline
- [ ] Custom API domain
- [ ] Apple Pay modeling for Apple Card

---

## Assumptions & Out of Scope

- **Assumption:** Closed beta uses **`dev` AWS stage** and Plaid **sandbox** unless otherwise noted.
- **Assumption:** Testers are US-based with cards in the current 19-card catalog.
- **Out of scope for this plan:** Android, web app beyond marketing site, paid subscriptions, App Check / device attestation.
- **Discrepancy flag:** Original checklist referenced local IP `100.115.243.9:3000` — current code uses `LOCAL_API_HOST` / `192.168.0.13:3000` default in Debug only; Release path is CloudFront-aware.

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [AppStore-Listing.md](./AppStore-Listing.md) | App Store + TestFlight copy, keywords, "what to test", reviewer notes |
| [beta-preparation.md](./beta-preparation.md) | Item-level status with evidence |
| [Security-Review-Summary.md](./Security-Review-Summary.md) | Cross-cutting security themes |
| [Onboarding-Plan.md](./Onboarding-Plan.md) | Onboarding design (largely implemented) |
| [Testing-Strategy-Plan.md](./Testing-Strategy-Plan.md) | Test tooling roadmap |
| [aws-deployment-plan.md](./aws-deployment-plan.md) | Dual-mode local/Lambda architecture |
| [wiki-html/hld-dashboard.html](../wiki-html/hld-dashboard.html) | Architecture, API, known gaps |

---

## Beta Data & Observability (gap analysis — 2026-05-31)

**Backend (croe):** Strong *operational* logging — structured JSON w/ correlationId, Lambda failure + error-rate alarms, ERROR-log metric filter, SNS email. **Missing:** product/funnel metrics (guest mints, sign-in conversion, /recommend count + latency, search terms, Plaid success rate), latency/DynamoDB-throttle/CloudFront-5xx alarms, and a CloudWatch dashboard.

**iOS (swift-app):** Only `CrashReporter` (MetricKit). All other instrumentation is `print()`, invisible from TestFlight devices. **Action before external TestFlight:** add a product-analytics layer (TelemetryDeck recommended for privacy-first iOS, or PostHog).

### What to gather during beta

| Category | Specific signals |
|----------|------------------|
| **Stability** | Crash-free session rate (target >95% closed, >98% open), MetricKit hangs/disk-write, top crash stacks |
| **Funnel** | Onboarding completion, guest→account conversion, sign-in success by provider (Apple/Google), Plaid link success/failure |
| **Core value** | # searches, # recommendations, **wrong-recommendation reports** (highest-value), offline vs online usage, categories searched |
| **Data quality** | Most-requested missing cards, miscategorized merchants, rotating-category errors |
| **Cost/abuse** | Places API call volume, Bedrock invocations, guest-mint rate (bill-shock watch) |
| **Qualitative** | In-app "Send Feedback" emails, TestFlight feedback screenshots, "what to test" responses |

### Suggested next implementation tasks
1. Backend EMF custom metrics + CloudWatch dashboard + latency/throttle/5xx alarms.
2. iOS analytics SDK (TelemetryDeck/PostHog) wired to key events: search, recommend, sign-in, plaid_link, wrong_rec_report.
3. App icon: remove AI watermark, export clean 1024px master.
4. Screenshots: 6.7"/6.9" sets via simulator + Fastlane frameit (see `ios-simulator` skill).
