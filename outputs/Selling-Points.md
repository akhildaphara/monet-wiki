# Monet — Selling Points & Positioning

## Elevator Pitch

Monet is a credit card rewards optimizer that tells you exactly which card to swipe — before you pay. Add your wallet, search any merchant or category, and get an authoritative recommendation backed by a real rewards engine, not guesswork. Connect your bank via Plaid and Monet shows what you actually earned versus what you left on the table, so every purchase earns more next time.

---

## Target Audience & Market

**Primary — The Multi-Card Optimizer:** People who carry three or more credit cards and freeze at checkout. They want one instant, trustworthy answer — not a spreadsheet or a blog post from 2019. They become loyal once the first recommendation is right.

**Secondary — The Transaction-Aware Optimizer:** Users who link bank accounts and review Insights monthly. They use missed-earnings data to decide whether to change habits, swap a card, or apply for a better one.

**Market context:** U.S. credit card rewards are fragmented across rotating categories, tiered caps, and merchant-specific bonuses. Most cardholders leave meaningful cashback on the table because no human can hold 20 reward structures in working memory at the register.

---

## Features & Selling Points

### Core Optimization

- **Instant best-card recommendations** — Search a merchant name or pick a category; Monet ranks your wallet and returns the highest-earning card with a clear rate.
- **Wallet overview by category** — See your best card for every spending category at a glance (`POST /v1/wallet-overview`).
- **Market-best discovery** — Optional "global best" card surfaces cards you don't own yet, turning every lookup into a discovery moment.
- **All rates, not just the winner** — Every recommendation includes your full wallet ranked for that purchase, so power users can verify the math.
- **Reasoning you can trust** — Recommendations explain why a card won (base rate, special bonus, rotating category, cap status).

### Insights & Analytics

- **Actual vs. optimal earnings** — Plaid-linked Insights compare what you earned on each transaction against what your wallet could have earned.
- **Missed rewards, dollar by dollar** — Summary shows total spend, actual earnings, wallet-optimal earnings, and the gap — the number that changes behavior.
- **Category breakdown** — Per-category spend with actual vs. optimal bars and the best card for each bucket.
- **Dynamic card intelligence** — RankedSpend cards (Citi Custom Cash, Venmo, Zolve) resolve their active tier from your real spending history during Insights sync.
- **Upgrade suggestions** — When no wallet card earns well in a category, Monet flags a market-best card and estimated additional earnings.

### Bank Connectivity & Data

- **Plaid bank linking** — Connect credit card accounts securely; only credit accounts are surfaced.
- **Automatic account mapping** — Link Plaid accounts to wallet cards via last-four matching or manual picker.
- **Transaction sync & cache** — Transactions persist in DynamoDB; Insights reuse cached data for fast repeat loads.
- **Plaid webhooks** — Background sync keeps transaction data current without manual refresh.

### Categorization & Merchant Intelligence

- **29-category spending taxonomy** — Granular categories (Dining, Grocery, Chase Travel, Whole Foods, Utilities, and more) map to real issuer reward buckets.
- **Multi-layer merchant resolution** — User overrides → brand rule engine (~100 mapped merchants) → Google Places → AWS Bedrock bulk categorization, with DynamoDB brand cache (365-day TTL for confident hits).
- **Merchant overrides** — Pin any merchant to a category; overrides sync across devices and take priority on future lookups.
- **Fuzzy brand matching** — Exact, domain, substring, and Levenshtein-distance rules catch typos and variations ("unietd airlines" → Travel).
- **Popular brand seed cache** — Edge-cached `GET /v1/popular-categories` plus on-device Places cache for zero-latency lookups on common merchants.

### Breadth of Card Data

- **Curated, growing card catalog** — Major U.S. rewards cards across Chase, Amex, Capital One, Citi, Discover, Wells Fargo, Apple, Bilt, Amazon/Prime, Venmo, and Zolve; new cards ship via backend without an App Store release.
- **Rotating quarterly categories** — Discover it and Chase Freedom Flex schedules are data-driven and resolved to the current calendar quarter automatically.
- **Tiered & capped rewards** — RankedSpend, CategorySpecial, and RotatingCategory reward shapes with spend-cap demotion in Insights (per-card when linked via Plaid).
- **Hot-swappable card catalog** — `GET /v1/cards` serves the master catalog; iOS caches it (24-hour TTL) so reward updates ship without an App Store release.
- **Prime-aware Amazon rates** — Surfaces Prime vs. non-Prime earning differences when relevant.

### Privacy & Security

- **Privacy-first architecture** — Plaid access tokens encrypted at rest (AES-256-GCM); secrets in AWS SSM Parameter Store; API origin protected by CloudFront `X-Origin-Secret`.
- **Fail-closed auth** — Lambda authorizer validates Google, Apple, or guest JWT on every protected route; no IDOR on user data.
- **Guest mode** — Try recommendations without signing in; guest JWT minted via `POST /v1/auth/guest`.
- **Minimal PII exposure** — Plaid tokens stripped from API responses; public endpoints limited to health, guest auth, card catalog, and popular categories.

### Craft & UX

- **The Result Card** — A bold, gradient recommendation card (Robinhood-level clarity) that states the answer, not a suggestion.
- **Works offline** — On-device `LocalRecommender` + Places cache + SwiftData overrides deliver recommendations without network when category is known.
- **Premium iOS native feel** — Semantic Dynamic Type, Reduce Motion support, VoiceOver labels, haptic feedback on key interactions.
- **Frictionless flow** — Wallet → (optional) Plaid → Spend: three steps from signup to checkout confidence.
- **Delightful loading states** — "Analyzing" animations mask backend latency at the register.

### Platform & Infrastructure

- **Serverless AWS backend** — Express on Lambda, DynamoDB, CloudFront edge cache, API Gateway — scales to zero, scales on demand.
- **Cross-device sync** — One `POST /v1/auth/sync` bootstraps wallet, overrides, and settings on login.
- **Custom reward overrides** — Users can set personal multipliers per category on any card in their wallet.

---

## What Makes Monet Stand Out

### 1. Transaction-aware missed earnings (not just "what to use next")

Most competitors stop at pre-purchase lookup. Monet's Plaid Insights pipeline computes **actual earnings vs. wallet-optimal earnings** per transaction and aggregates missed rewards by category. That turns Monet from a lookup tool into a habit-changing feedback loop — the secondary persona's monthly ritual.

### 2. A rewards engine that handles real-world complexity

Rotating quarterly categories (Discover, Freedom Flex), RankedSpend tier resolution (Citi Custom Cash, Venmo, Zolve), spend caps with per-card tracking, and Prime-boosted Amazon rates are modeled in code — not approximated. Competitors often treat every card as flat multipliers; Monet's optimizer understands **when a 5% tier is active, capped, or demoted**.

### 3. Authoritative UX, not spreadsheet energy

The Result Card, direct copy ("Your best card is…"), and category-grouped wallet overview follow a Robinhood/Monzo design philosophy: one clear answer, warm data presentation, zero clutter. CardPointers and MaxRewards skew utilitarian; Monet aims for **expert confidence at the speed of checkout**.

### 4. Works before you commit (guest + offline)

Guest JWT auth plus on-device `LocalRecommender` and brand cache mean users get value **before Google Sign-In or Plaid linking**. Competitors typically gate everything behind account creation. Monet earns trust on the first recommendation, then deepens with Insights.

### 5. Merchant intelligence stack competitors can't easily replicate

The pipeline — overrides → 100+ brand rules with fuzzy matching → Google Places → Bedrock categorization → 365-day brand cache — resolves "Whole Foods" vs. "Amazon Fresh" vs. generic Grocery with issuer-specific precision. Spreadsheets and simpler apps rely on coarse MCC codes or manual category picks.

### 6. Hot-swappable card catalog

Reward structures live on the backend and sync to iOS. When Chase publishes Q3 rotating categories or Monet adds a new card, users get updates without waiting for App Store review. Static-app competitors require app updates for every issuer change.

### 7. User corrections that stick

Merchant category overrides persist locally (SwiftData) and sync to DynamoDB. Once you teach Monet that a specific merchant is Dining, every future lookup respects it. This closes the loop on categorization errors that plague automated tools.

### 8. Built for the multi-card majority

Monet targets the **3+ card wallet** where optimization pain is highest — cardholders juggling rotating categories, tiered caps, and merchant-specific bonuses across a growing curated catalog and 29 spending categories.

---

## Roadmap (Not Yet Shipped)

These appear in product ideation or strategy docs but are **not** fully implemented today:

- **Location-based push notifications** — Geofenced "use this card here" alerts (Ideas-and-Features).
- **Sign-up bonus tracking** — Temporarily prioritize a new card until minimum spend is met (Ideas-and-Features).
- **Household / shared wallet** — Optimize across a couple's combined card pool (Ideas-and-Features).
- **Annual fee vs. value dashboard** — Justify or downgrade premium cards based on actual spend (Ideas-and-Features).
- **Bilt 2.0 rent-tier marginal utility** — Sliding-scale rent multipliers based on non-housing spend (Bilt-2.0-Strategy; cards exist, holistic optimizer does not).
- **Apple Pay detection for Apple Card** — 2% via Apple Pay vs. 1% physical swipe (beta-preparation checklist).
- **Pay-with-points calculator** — Optimize redemption value, not just earning (Ideas-and-Features).
- **iOS home screen widget** — Quick lookup without opening the app (CurrentFeature roadmap).
- **Push alerts for quarterly category rotations** — Remind users when 5% categories activate (CurrentFeature roadmap).

---

## Marketing vs. Code — Flagged Discrepancies

| Claim (marketing / docs) | Reality (HLD / code) | Status |
|---|---|---|
| Website: transactions sync "**in real-time**" | Plaid sync via webhooks and manual sync; not instant at point of sale. | **Fixed** — website copy updated to "spending history" / periodic sync. |
| Card-Reward-Catalog: Citi Custom Cash needs "**AI Strategy Engine**" | **Shipped** as RankedSpend with tier resolved from Plaid Insights spend data. | Doc stale — update `Card-Reward-Catalog.md` when next synced. |
| Bilt-2.0-Strategy: rent multiplier optimization | Bilt 2.0 **cards exist** with static everyday rates; **rent sliding-scale marginal utility is not implemented**. | Open gap — tracked in HLD §Future Considerations. |
| CurrentFeature roadmap: "Add Amex Gold, Citi Double Cash…" | **Already in catalog** — roadmap doc is stale. | Doc stale. |
| UI-UX-Improvements: "InsightsView archived/removed" | **Stale** — InsightsView is active in `RootTabView` (sign-in required). | Doc stale. |
| Apple Card 3% at Apple / 2% Apple Pay | Catalog models 2% base + 3% streaming; **Apple Pay vs. physical swipe not distinguished** in optimizer. | Open gap — tracked in HLD §Future Considerations (Payment method). |
| `GET /v1/cards` auth in HLD API accordion | Was marked "Auth: Required" while Auth section listed it public. | **Fixed** — HLD accordion now matches code (public, edge-cached). |
| Security review: missing OAuth `aud` check | `serverless.yml` + `verifyToken.ts` hardened 2026-05-31; SSM-backed client IDs in deployed env. | **Addressed in code** — re-verify on each stage deploy; summary updated. |
