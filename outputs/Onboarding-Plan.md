# Monet Onboarding Plan — Value-First, Sign-In-Last

**Goal:** Make setup as simple as possible so a new user can either set up the app quickly *or* test the core value immediately. Today the app puts a hard auth wall in front of all value. This plan reorders the flow so users hit the "aha" moment (a real card recommendation) in **under 60 seconds, before being asked to sign in.**

---

## 1. Current State Audit

### Flow today
1. `RootTabView` shows a branded splash while auth is checked, then branches: signed-in → tabs; not signed-in → `LoginView`.
2. `LoginView` is a **2-step value carousel** ("Monet" → "Maximize Rewards") that ends in a **single button: "Continue with Google."** There is no other way past this screen in production.
3. On first sign-in, `RootTabView` waits ~800ms for sync, then auto-presents `AddCardSheet` if the user is new and has no cards.
4. `AddCardSheet` is a **manual catalog search** ("Search cards by name") → tap a card → `CardSetupWalkthroughView` (nickname + optional last-4) → added to wallet.
5. The home tab (`SearchView`) is the real product: type a merchant → get the best card. But if the wallet is empty it just shows a **"No cards in wallet"** warning instead of a result.
6. Bank linking (`BankConnectionsView` → Plaid) lives under Wallet → Manage Connections. It is *not* part of onboarding (good).

### Key references
- Auth gate: `raw/swift-app/MonetApp/Views/RootTabView.swift` (lines 26–62, 74–84)
- Carousel + Google-only sign-in: `raw/swift-app/MonetApp/Views/LoginView.swift` (lines 30–98, 192–215)
- Auth service (Google only): `raw/swift-app/MonetApp/Services/GoogleSignInService.swift`
- New-user card prompt: `RootTabView.swift` lines 74–84
- Card picker / setup: `AddCardSheet.swift`, `Components/CardSetupWalkthroughView.swift`
- Core "aha" + empty state: `SearchView.swift` (lines 122–132, 220–246, 475–483)
- Catalog is server-fed and token-gated: `DataStore.syncWithBackend()` (`DataStore.swift` lines 591–634) only populates `cards` after `apiClient.syncAuth(idToken:)`.

### Diagnosed gaps
| # | Gap | Impact |
|---|-----|--------|
| G1 | **Hard auth wall** — no value visible before Google sign-in. | Highest-leverage drop-off point. Every barrier before the aha kills activation. |
| G2 | **Google is the only login.** No Sign in with Apple. | **App Store rejection risk (Guideline 4.8)** + lost conversion (iOS users strongly prefer Apple). Blocking for launch. |
| G3 | **No "first win" before commitment.** Core value requires cards already in wallet. | Users can't test the app "asap" as requested. |
| G4 | **Card setup is type-to-search a catalog.** No popular-card quick pick. | Tedious; high cognitive load on the very first task. |
| G5 | **Generic carousel** ("Maximize Rewards") with no personalization. | Misses the "1–2 quick questions" pattern that frames value. |
| G6 | Catalog only loads after authenticated sync. | Technical blocker for any guest/preview-of-value mode (see §5). |

---

## 2. Market Research: What Wins

### Direct competitors

| App | Sign-up to use? | Add cards | Bank link (Plaid) | Notable |
|-----|----------------|-----------|-------------------|---------|
| **CardPointers** | Account required, but offers **Apple + Google + email** | **Manual, no bank needed** — pick card, rewards auto-populate | Optional | "All without giving up any personal or banking details." Manual-catalog model = Monet's model. |
| **MaxRewards** | Account + **Plaid link required** | Via Plaid login | **Required** | Powerful but **high friction**: 24–72h sync, frequent re-auth/2FA (2–4×/month). The anti-pattern. |
| **Kudos** | Account, **no card required to sign up** | Plaid (optional) | Optional | **5-minute setup**, "zero ongoing maintenance" is its headline selling point. |

**Takeaway:** Monet already has CardPointers' best property — a **manual card catalog that needs no bank link**. The core recommendation works with just a few tapped cards. Plaid is only needed for transaction tracking/insights and should stay **optional and deferred**, never an onboarding gate. MaxRewards shows what *not* to do.

### Cross-industry onboarding principles (fintech, 2026)
1. **First win in <60 seconds**, value *before* account creation. "Every barrier before value destroys completion rates."
2. **3–5 screens, not 10.** Personalize with 1–2 quick questions.
3. **Guest / no-login preview** captures users who bounce at a login wall; prompt sign-up *after* value is shown ("Create an account to save your wallet & sync").
4. **Progressive disclosure** — ask only what's needed now; defer the rest (~40% less perceived friction).
5. **Justify friction** — one sentence of "why" before any sensitive step; show security cues.
6. **Defer permissions** (location, notifications) until after value.
7. **Sign in with Apple is mandatory** when any third-party login is offered (App Store Guideline 4.8); it must allow private email relay.

---

## 3. Proposed Onboarding: "Try first, sign in last"

Two entry intents, one flow. The user reaches a real recommendation before any account is required; sign-in is offered the moment they'd want to *save* it.

```
Launch
  └─ Welcome (1 screen, single value prop)  ──►  [Get started]
        └─ Pick your cards (popular grid, multi-select, optional search)
              └─ AHA: instant best-card result for a sample merchant
                    └─ Soft prompt: "Save your wallet" → Sign in with Apple / Google
                          └─ (optional, later) Connect a bank for auto-tracking
```

### Step 1 — Welcome (replaces the 2-page carousel)
- **One** screen, not two. Single promise: *"Always know which card to reach for."* Primary CTA **"Get started"**; secondary text link **"I already have an account → Sign in."**
- No sign-in button as the only path. Reduce `LoginView` to this single screen or fold it into a dedicated onboarding container.

### Step 2 — Pick your cards (the personalization step + the setup)
- Replace "type to search a catalog cold" with a **grid of the ~12–16 most popular cards** (Chase Sapphire Preferred/Reserve, Amex Gold/Platinum/Blue Cash, Citi Double Cash, Capital One Venture/SavorOne, Discover It, etc.) shown as tappable `MiniCardView`s with a checkmark on select.
- Keep the existing search as a **"+ Add another card"** affordance below the grid for the long tail.
- Skip the per-card nickname/last-4 step here (that's `CardSetupWalkthroughView`). Defer last-4/nickname to later — it's only needed for Plaid transaction mapping, which isn't part of onboarding.
- Microcopy: *"No bank login needed — just tap the cards you own."* (mirrors CardPointers' trust message and our actual capability.)

### Step 3 — The "aha" (first win, no account yet)
- The instant they've picked ≥1 card, show a real recommendation. Two options:
  - **(a)** A pre-filled sample result card: *"Dining? Use your Amex Gold — 4x points."* using the cards they just picked, or
  - **(b)** Drop them straight into `SearchView` with their wallet populated and a celebratory nudge to try a merchant (quick chips already exist: Target, Starbucks, Delta…).
- This is the moment that proves value. It must work **without sign-in**.

### Step 4 — Soft sign-in (deferred, contextual)
- Trigger when the user does something worth persisting (finishes picking cards / taps "Save my wallet" / opens a second session).
- Sheet copy: *"Create a free account to save your wallet and sync across devices."* Benefit-framed, not a wall.
- Buttons, in order on iOS: **Sign in with Apple** (primary), **Continue with Google**, optional email later.
- On sign-in, merge the locally-picked cards into the synced account (see §5).

### Step 5 — Bank connection (optional, never blocking)
- Keep where it is (`BankConnectionsView`). After first value, optionally surface a **single dismissible nudge**: *"Connect a bank to auto-track rewards and unlock Insights."* with the "why" stated. Never gate the app on it.

---

## 4. What changes per file (implementation sketch)

> Phased so each phase ships independently and is independently valuable.

### Phase 0 — Compliance unblock (do first; required for App Store)
- **Add Sign in with Apple** alongside Google.
  - New: `Services/AppleSignInService.swift` (or extend auth into an `AuthService` protocol so `GoogleSignInService` + Apple share `isSignedIn`/token plumbing used by `APIClient`).
  - `LoginView`/onboarding: add `SignInWithAppleButton` above the Google button.
  - Backend: `APIClient.syncAuth` must accept an Apple identity token / provider field (today it's `syncAuth(idToken:)` assuming a Google ID token). Confirm backend supports Apple tokens — likely the biggest backend change.
- **Add a Terms/Privacy link** that actually navigates (currently static caption text in `LoginView` lines 92–97).

### Phase 1 — Reorder to value-first (biggest activation win)
- Introduce an `OnboardingFlow` container (welcome → card pick → aha) presented when `!hasCompletedOnboarding`, decoupled from `authService.isSignedIn`.
- Trim `LoginView` carousel from 2 steps to 1 welcome screen; move sign-in out of the hard gate.
- Build **"Pick your cards"** as a popular-card grid (reuse `MiniCardView`, `ListItem`, selection logic from `AddCardSheet`). A curated `popularCardIds` list drives the grid.
- Replace the post-login `AddCardSheet` auto-present (`RootTabView` lines 74–84) with this in-flow step.

### Phase 2 — Guest mode (no-login value)
- Allow card selection + a recommendation **without a token**. Requires the catalog to be available unauthenticated (see §5).
- Persist guest wallet in SwiftData/`UserDefaults`; on later sign-in, push it via `DataStore.updateSelectedCards`.

### Phase 3 — Polish
- Defer location permission (currently requested on `SearchView.onAppear`, line 209) until first search.
- Add a slim progress indicator across onboarding steps (honest step count).
- First-result celebration already exists (`SearchView` `showFirstResultCelebration`) — reuse for the aha moment.

---

## 5. The one real architectural decision: the card catalog

Guest mode (Phase 2) hinges on this. Today `DataStore.cards` is populated **only** by `syncWithBackend()` after `apiClient.syncAuth(idToken:)` — i.e., **the catalog needs a logged-in token.** To show a recommendation before sign-in, the catalog of cards + their reward rates must be reachable without auth.

**Options:**
- **A. Public catalog endpoint** — add an unauthenticated `GET /cards` the app can call to populate the grid + run `CategorizerService` locally. Cleanest; recommended.
- **B. Bundle a cached catalog** in the app (JSON) for first-run, refresh after sign-in. Fastest to ship, risks staleness.
- **C. Keep auth required, but make Apple/Google sign-in the *only* friction** and rely on the popular-card grid + instant aha right after. (Phase 0 + Phase 1 without Phase 2.) Lowest effort; still a large improvement, just not true "no-login" testing.

If a true "test it asap without signing in" experience is the priority (as stated), pursue **A**. If launch speed matters more, ship **Phase 0 + 1 + C** now and add **A** next.

---

## 6. Success metrics
- **Time-to-first-recommendation** (target < 60s from launch).
- **Activation rate**: % of new users who see ≥1 recommendation in session 1.
- **Onboarding funnel step completion** (welcome → cards picked → aha → signed in) to find the biggest drop-off.
- **Sign-in conversion** after the aha vs. today's pre-value rate.
- **Apple vs. Google share** once both are offered.

## 7. Open questions
1. Does the backend already accept Apple identity tokens, or is `syncAuth` Google-only? (Determines Phase 0 backend scope.)
2. Is there (or can there be) an unauthenticated `/cards` endpoint for the guest catalog? (Determines whether true guest mode is feasible — §5 option A.)
3. Priority call: **true no-login test mode** (A) vs. **fastest launch** (Phase 0+1+C)?
4. Curated popular-card list — who owns the initial ~12–16 selection?

---

**One-line recommendation:** Ship Phase 0 (Sign in with Apple — compliance) + Phase 1 (welcome → popular-card grid → instant recommendation, with sign-in moved *after* the aha) immediately; add a public catalog endpoint to unlock true no-login testing as Phase 2.
