# Brand → Category → Card Pipeline: Assessment

A thorough review of how Monet's `croe` backend turns a merchant name (or Plaid transaction) into a reward **Category**, and then into a recommended **card**. Covers correctness bugs, robustness gaps, inefficiencies, and concrete options (libraries / datasets / APIs) to make it best-in-class.

> Status legend: ✅ fixed · ⚠️ open bug · 💡 recommendation

---

## 0. Changelog

**Session 1** (initial pass): word-boundary `CONTAINS` matching, `LOCAL_TRANSIT → TRAVEL` fallback, info-level request/response logging.

**Session 2** (see details inline):
- ✅ **Whole-token matcher** replaced the substring/word-boundary heuristic entirely. A brand now matches only as a *contiguous run of whole words* (single-word brands must be the leading significant token), with **specificity ranking** so the table's order no longer matters. No per-merchant special-casing — "MBTA Subway North Station" → `LOCAL_TRANSIT`, "Uber Eats" → `DINING`. (`src/resources/brandMatcher.ts`)
- ✅ **Matcher extracted** out of the data file: `brandCategoryMap.ts` is now data-only; the engine lives in `brandMatcher.ts`.
- ✅ **Unified the two resolvers.** `mapPlaidCategory` now runs `evaluateBrand` → MCC → Plaid PFC, so search and Plaid sync agree. This also fixed *Uber Eats → UBER* on the Plaid path (§2.4).
- ✅ **MCC → Category wired up** (`categoryFromMcc` in `categories.ts`).
- ✅ **`OTHER`/low-confidence cache** now uses a **7-day TTL** (was a 1-yr freeze) and records `source` + `confidence`; low-trust rows are never frozen in memory and expire for re-resolution (§2.5).
- ✅ **`RIDESHARE` + `UTILITIES` categories** added (end-to-end, incl. the iOS app); rideshare chain is now `UBER/LYFT → RIDESHARE → TRAVEL` (no longer through `LOCAL_TRANSIT`), so a transit-only bonus never leaks to rideshare (§2.2).
- ✅ **Bedrock throttling is now observable**: adaptive client retries + explicit fallback logging + a **log-based CloudWatch alarm** (the old Lambda-error alarms couldn't see a *caught* exception) (§7).
- ✅ **Golden + matrix tests**: `brandMatching.test.ts`, `brandCategories.test.ts` (brand→category) and `cardsForCategory.test.ts` (category→cards).
- ✅ Fixed 3 pre-existing failing tests (Plaid webhook signature x2, `UserRepository` decrypt).

**Session 3** (this pass — robustness/inefficiency cleanup + optimizer realism):
- ✅ **MCC overlap simplified at the source.** The only ambiguous code (lodging `7011`, previously listed under both `TRAVEL` and `HOTEL`) now lives **only under `HOTEL`**, so every MCC maps to exactly one category and the priority-order variable was deleted (§3).
- ✅ **Places no longer duplicates brand logic.** `PlacesService` defers all brand-name guesses to `evaluateBrand`; `mapTypes` is now purely Google-Place-*type* based (§3).
- ✅ **Dead `fuzzy` branch removed** — `MatchResult` is now a single `{category, brandName} | null` shape (§3).
- ✅ **Duplicate streaming rules de-duped** (§3).
- ✅ **`RankedSpend` over-promise fixed (§2.6):** the bonus now applies only to the user's actual top-ranked *eligible* category by spend; with no ranking it no longer stacks the top tier across categories.
- ✅ **Spend caps modeled (§2.8):** `RewardRate`/`RankedSpend` carry an optional `cap`, and the optimizer computes the **effective (post-cap) marginal rate** from the user's period-to-date spend (Amex BCP $6k/yr groceries, Citi Custom Cash $500/cycle, Discover rotating $1,500/qtr).
- ✅ **Inefficiencies (§4):** search path no longer makes a synchronous per-name LLM call (and no longer re-runs brand+cache lookups); `getUserOptimizerContext` reuses the already-loaded `user`.
- ✅ Suite: **315 tests passing**.

---

## 1. Pipeline overview

There are **two** independent categorization paths, plus one scoring engine:

**A. Name-based resolution — `categorize()` (`src/categorizer.ts`)**, used by `/v1/recommend`:
1. Local rule engine `evaluateBrand()` (`brandMatcher.ts` over the `brandCategoryMap.ts` table — whole-token matching + specificity ranking)
2. Global DynamoDB `MonetBrandCache` (self-learning, 1-yr TTL for confident rows, **7-day TTL for `OTHER`/low-confidence**, sliding window)
3. Google Places Text Search API (POI types → category; itself defers brand-name guesses back to `evaluateBrand`)
4. *No synchronous LLM call here (Session 3, §4)* — unknown names return `OTHER` and are learned asynchronously by the **bulk** LLM categorizer on the Plaid-sync path (B), which writes back to the shared cache for the next search.

**B. Transaction resolution — `mapPlaidCategory()` (`plaidCategoryMap.ts`)**, used during Plaid sync:
- `evaluateBrand()` → **MCC → Category** (`categoryFromMcc`) → Plaid detailed PFC map → Plaid primary PFC map → `OTHER`

**C. Scoring — `optimizer.ts`**: `Category` → best card via static `rewards`, `specialRewards` (`CategorySpecial`, `RankedSpend`), plus a parent-category fallback chain.

Paths A and B now **share the brand matcher** (`evaluateBrand`), so the same merchant categorizes identically whether it arrived via search or Plaid sync. B then adds the deterministic MCC signal before falling back to Plaid's own taxonomy.

---

## 2. Confirmed bugs

### 2.1 Greedy substring matching ✅ (fixed — superseded by whole-token matcher)
`isStrictMatch` used `input.includes(target)`, so short targets matched *inside unrelated words*. Verified misclassifications:

| Merchant | Old result | Cause |
|---|---|---|
| `T-Mobile` | **GAS** (ExxonMobil) | matched `"mobil"` inside `t-mo**bil**e` |
| `Bombshell Salon` | **GAS** (Shell) | matched `"shell"` inside `bomb**shell**` |
| `Seashell Cafe` | **GAS** (Shell) | matched `"shell"` inside `sea**shell**` |
| `MBTA Subway North Station` | **DINING** (Subway) | matched `"subway"` |

**Fix applied (Session 2):** the matcher (`brandMatcher.ts`) was rewritten to operate on **whole tokens**, not substrings. The merchant name is tokenized (noise tokens like `SQ`/`TST`/`POS`/store numbers stripped, apostrophes removed) and a brand matches only if its tokens appear as a **contiguous run of whole words**; a single-word brand must additionally be the **leading significant token**. A narrow plural/possessive tolerance (`mcdonald` ↔ `mcdonalds`) is the only loosening. Among all matches, the **most specific** (most/longest tokens) wins, so `"uber eats"` beats `"uber"` and **table order no longer affects correctness**.

Verified by the golden + matrix tests: T-Mobile/Bombshell/Seashell no longer match GAS; `MBTA Subway North Station` → `LOCAL_TRANSIT`; `Uber Eats` → `DINING`; descriptor noise (`SQ *STARBUCKS 0123`, `POS DEBIT NETFLIX.COM`) still resolves. The previously-latent ambiguous targets (`bp`, `target`, `american`, `national car`) are now handled by the leading-token rule rather than per-brand hacks.

💡 *Remaining:* Aho-Corasick/trie for O(n) scaling across thousands of brands is still a future optimization (the current linear scan is fine at the present rule count). See §5.1.

### 2.2 Niche categories didn't fall back to their parent ✅ (fixed)
`getCashback(CHASE_SAPPHIRE_PREFERRED, LOCAL_TRANSIT)` returned **1% (OTHER)** even though CSP earns **2× Travel** and transit/parking/tolls fall under Travel. Only `HOTEL/CAR_RENTAL → TRAVEL` and `UBER/LYFT → LOCAL_TRANSIT → TRAVEL` were handled; `LOCAL_TRANSIT → TRAVEL` itself was missing.

**Fix applied:** replaced the hardcoded branches with a data-driven `CATEGORY_FALLBACKS` chain walked until a defined rate is found. **Session 2** added a first-class `RIDESHARE` enum and re-routed rideshare so it no longer borrows a transit-only bonus:
```
UBER → RIDESHARE → TRAVEL
LYFT → RIDESHARE → TRAVEL
RIDESHARE → TRAVEL
LOCAL_TRANSIT → TRAVEL
HOTEL / CAR_RENTAL / CHASE_TRAVEL → TRAVEL
WHOLE_FOODS → GROCERY
```
Verified: CSP local-transit resolves to **2% (TRAVEL)**; Whole Foods on Amex Gold → **4% (GROCERY)**. Rideshare on a transit-only card (Amex BCP `LOCAL_TRANSIT` 3%, no Travel rate) correctly falls to **1% (OTHER)** rather than inheriting the transit bonus, because rideshare is a Travel concept, not a transit one. `WHOLESALE_CLUB` intentionally has **no** grocery fallback (issuers exclude warehouse clubs from grocery).

### 2.3 Production logs hid request/response detail ✅ (fixed)
The request body and response were logged via `logger.debug`, but production runs `LOG_LEVEL=info` (`serverless.yml`), so they were dropped — only bare "Incoming/Outgoing" lines survived. The generated `correlationId` also wasn't attached to those lines.

**Fix applied:** the logging middleware now emits a **request-scoped logger** (`correlationId`, `method`, `path`) and logs a redacted/array-collapsed request body and response summary at **info**. `/v1/recommend` also logs a one-line business summary (search input → resolved category → chosen card + rate).

### 2.4 `Uber Eats → UBER` on the Plaid path ✅ (fixed)
`mapPlaidCategory` previously did `if (lowerName.includes("uber")) return Category.UBER;`, which fired for **"Uber Eats"** and classified food delivery as rideshare.
**Fix applied:** `mapPlaidCategory` now delegates to the shared `evaluateBrand` matcher first, which resolves `"Uber Eats" → DINING` (more specific than `"uber"`) before any MCC/PFC logic. The two paths can no longer disagree on this.

### 2.5 `OTHER` is cached and short-circuits future improvement ✅ (fixed)
`BrandService.resolveBrandCategory` persisted whatever the LLM returned — **including `OTHER`** — for a full year, and `categorize()` treats a cached `OTHER` as a hit, freezing a momentary miss forever.
**Fix applied:** `BrandCacheRepository` now stores `source` (`bedrock`/`places`/…) and `confidence` on each row. `OTHER` **and** any row below the confidence threshold get a **7-day TTL** (vs. 1 year), are **never** placed in the in-process memory cache, and their TTL is **not** slid — so they expire and get re-resolved. Confident, resolved brands keep the 1-yr sliding window. (`BrandCacheRecord.ts`, `BrandCacheRepository.ts`)

### 2.6 Optimistic `RankedSpend` over-promised ✅ (fixed)
For "top-category" cards (Citi Custom Cash, Venmo, Zolve, Bilt Obsidian) without `context.userTopCategories`, the optimizer used to assign the **highest tier to every allowed category at once** — Citi Custom Cash showed **5% on dining AND gas AND grocery** simultaneously, even though the cardholder earns 5% on only **one** category per cycle.

**Fix applied (Session 3):** a `RankedSpend` tier is now granted **only to the category that actually sits at the matching rank in the user's spend**, and ranking is done **within the rule's eligible categories** so the user's #1 *eligible* category maps to tier rank 1 (even if a higher-spend ineligible category sits above it). When there is **no spend ranking**, no bonus is applied — the card falls back to its base rate rather than inflating every category. Verified: with `userTopCategories = [OTHER, DINING, GAS]`, Citi Custom Cash gives **5% on DINING** (top eligible) and **1% on GAS** (no rank-2 tier); with no context it gives **1%**, not 5% everywhere.

### 2.7 Rotating/quarterly categories are stale ⚠️ (open)
`DISCOVER_IT` encodes only `GAS` 5% and `CHASE_FREEDOM_FLEX` only `DINING/HEALTH`, but both are **rotating 5% quarterly** cards. Recommendations are wrong for whatever the current quarter actually is.
💡 Model rotating categories as time-bounded rules (`effectiveFrom/effectiveTo`) and update quarterly (good fit for a small scheduled job or a config table).

### 2.8 Spend caps were not modeled ✅ (fixed)
Amex BCP (6% groceries up to $6k/yr), Citi Custom Cash ($500/cycle), Discover/Chase rotating ($1,500/qtr) — none of the caps were represented, so the optimizer could recommend a card the user had already maxed.

**Fix applied (Session 3):**
- **Data model:** `RewardRate` and `RankedSpendReward` now carry an optional `cap: { maxSpend, period }` where `period` is `monthly | quarterly | annual`. Caps were added to Amex BCP grocery (`$6,000/annual`), Citi Custom Cash RankedSpend (`$500/monthly`), and Discover rotating gas (`$1,500/quarterly`).
- **Effective rates:** `OptimizerContext` gained `categorySpend` (current calendar month/quarter/year spend per category). When a capped rate's period-to-date spend has reached the cap, the optimizer **demotes that rate to the card's base (`OTHER`) rate** — i.e. it returns the *effective marginal rate for the next dollar of spend*. With **no spend data** the cap is assumed not-yet-reached (a new/unlinked user hasn't maxed anything), so the elevated rate still shows.
- **Context wiring:** `getUserOptimizerContext` derives `categorySpend` from the user's transactions in the same pass it already uses to rank categories.

> ⚠️ *Caveat / follow-up:* `categorySpend` is currently populated on the **transaction-scan path** only. On the fast/cached path (when `userTopCategories` is already stored on the user record) `categorySpend` is absent, so caps fall back to the optimistic "not reached" assumption. The clean fix is to also persist period spend during `/plaid/sync-insights` (alongside `userTopCategories`) so caps apply without a per-request scan. The cap logic, types, and card data are all in place — only the cached-path population is deferred.

---

## 3. Robustness gaps

- ✅ **Two divergent resolvers (A vs B).** *Fixed* — `mapPlaidCategory` now calls the same `evaluateBrand` matcher as `categorize()`, then layers MCC + Plaid PFC. One brand table, one matcher.
- ✅ **MCCs defined but unused.** *Fixed* — `categoryFromMcc` (in `categories.ts`) builds a reverse `MCC → Category` map and `mapPlaidCategory` uses it as the second signal after brand match. **Session 3:** the one MCC that was declared under two categories (lodging `7011`, under both `TRAVEL` and `HOTEL`) now lives **only under `HOTEL`**, so every MCC maps to exactly one category. With no remaining ambiguity, the lookup iterates categories in any order and the `MCC_SPECIFICITY_ORDER` priority variable was deleted (it added confusing, non-obvious coupling for a single overlap).
- ✅ **No normalization of raw descriptors.** *Partly fixed* — the matcher strips processor prefixes (`SQ`/`TST`/`PAYPAL`/`POS`/…), store numbers, and URL fragments before matching, so `SQ *STARBUCKS 0123` resolves. 💡 *Remaining:* still keying the **cache** on the raw/clean name rather than Plaid's `merchant_entity_id` (see §5.2).
- ✅ **Places "fast path" duplicated brand logic.** *Fixed (Session 3).* `PlacesService.resolveCategory` used to call `mapTypes([], name)` first, which re-implemented brand-name heuristics (Amazon, Whole Foods, Costco, Target, Uber, Netflix, …) that overlapped — and could disagree with — `evaluateBrand`. Now the fast path **calls `evaluateBrand` directly**, and `mapTypes` does only Google-Place-*type* mapping with **no brand-name string literals**. One brand list, one matcher, no divergence. (Added an `AMZN` alias to the brand table so the `"AMZN Mktp US"` descriptor still resolves to Amazon.)
- ✅ **Dead `fuzzy` branch removed.** *Fixed (Session 3).* `evaluateBrand` only ever returned `exact`; `MatchResult` is now a single `{ category, brandName } | null` shape and the `type === "exact"` guards across `categorizer`, `brandService`, `plaidCategoryMap` (and tests) are gone.
- ✅ **Duplicate rules de-duped.** *Fixed (Session 3).* `peacock`, `paramount+`, `apple tv`, `audible`, `tidal`, `sirius xm` were each listed twice; the duplicate "Extended Streaming Services" block was removed (keeping the unique `siriusxm`/`pandora` rules). Both `sirius xm` and `siriusxm` are intentionally kept because whole-token matching treats them as distinct spellings.

---

## 4. Inefficiencies

- ✅ **Redundant lookups in the LLM fallback.** *Fixed.* `categorize()` ran `evaluateBrand` + cache, then called `BrandService.resolveBrandCategory`, which ran `evaluateBrand` + cache **again** before hitting Bedrock. The search path no longer calls `resolveBrandCategory` at all (see next bullet), so the duplicate lookups are gone.
- ✅ **Per-name single-item LLM calls in the search path — now skipped (documented).** *Fixed.* The synchronous, per-name Bedrock call was the slowest, most expensive and most throttle-prone step on a latency-sensitive request. `categorize()` now stops after local rules → cache → Places and **returns `OTHER` instead of calling the LLM**. Unknown merchants are instead **learned asynchronously in bulk during Plaid sync** (`bulkCategorizeMerchants`), which writes the result to the shared brand cache — so a later search for the same name is an instant cache hit. The decision and rationale are documented in `categorizer.ts`. *(`BrandService.resolveBrandCategory` is retained for the bulk/test paths but is no longer on the search hot path.)*
- ✅ **`getUserOptimizerContext` re-fetched the user.** *Fixed.* `recommend()` (and `getWalletOverview()`) already load the user, then passed it into `getUserOptimizerContext(userId, user)` so context derivation no longer issues a second `getUser`.
- ✅ **180-day transaction scan fallback.** *Acknowledged + reused.* Still a rare path gated behind the `userTopCategories` cache. Session 3 makes that scan do double duty: it now also computes per-category period spend for cap evaluation (§2.8), so we don't add a second scan. Follow-up: persist both `userTopCategories` **and** period spend during `/plaid/sync-insights` so neither the ranking nor caps need a per-request scan.

---

## 5. Recommendations to make it best-in-class

### 5.1 Replace the matcher with a real engine ✅ (mostly done)
- ✅ **Specificity ranking** instead of array order, and whole-token matching (a stronger guarantee than per-rule WORD/PREFIX modes). 
- ✅ **Golden test set** of ambiguous merchants (T-Mobile, MBTA Subway, Uber Eats, Bombshell, noise-prefixed descriptors) locks behavior (`brandMatching.test.ts`, `brandCategories.test.ts`).
- 💡 *Remaining (defer):* **Aho-Corasick / trie** for O(n) matching only matters once the table grows to thousands of rules.

### 5.2 Lean on transaction enrichment data 💡 (partly done — rest needs review)

Plaid already returns rich enrichment on every `/transactions/sync` item that we are mostly **throwing away**. Today we read `personal_finance_category.primary/detailed` and `merchant_name`, but several higher-signal fields go unused. Using them well is the single highest-leverage accuracy win, because it lets us trust a deterministic signal instead of guessing with Places/LLM.

**What each field gives us and how to use it:**

- ✅ **MCC → Category** — *done.* `categoryFromMcc` turns the merchant category code into a `Category`. MCC is the most reliable structured signal we have because it comes from the card network, not a heuristic, and it's already layered in as the second signal in `mapPlaidCategory`.

- ⚠️ **`personal_finance_category.confidence_level`** (`VERY_HIGH | HIGH | MEDIUM | LOW | UNKNOWN`). Plaid tells us how confident *it* is in its own categorization. We currently ignore it and treat every PFC equally. **How to use it:** trust `VERY_HIGH`/`HIGH` PFC directly (skip Places/LLM entirely), and only fall through to Places/LLM for `MEDIUM`/`LOW`/`UNKNOWN`. This both improves accuracy (don't second-guess a confident Plaid label) and cuts cost/latency (fewer Places/LLM calls). It also feeds the cache `confidence` field we already added in §2.5, so a low-confidence row gets the short TTL and is re-resolved later.

- ⚠️ **`merchant_entity_id`** — Plaid's **stable, normalized merchant identifier** (e.g. every "STARBUCKS #1234", "SQ *STARBUCKS", "Starbucks.com" charge maps to the *same* entity id). This is the correct **cache key**. Today we key the brand cache on the raw/cleaned *name string*, so trivial descriptor variants ("SBX 0123" vs "Starbucks Store 555") each create a separate cache row and can resolve differently. **How to use it:** when `merchant_entity_id` is present, key the cache (and any global override — see §5.3) on it instead of the name. That collapses all descriptor variants of one merchant into a single learned mapping, dramatically improving cache hit rate and consistency. Fall back to the cleaned name only when the entity id is absent.

- ⚠️ **`merchant_name` (cleaned) vs `name` (raw)** — we already prefer the cleaned `merchant_name`, but the raw `name` is still useful as the input to `evaluateBrand` when the cleaned name is missing. Minor; mostly covered by the matcher's noise-stripping.

> *Needs review before building:* confirm which of these fields are populated on the **current Plaid plan/product** (Enrichment / Transactions). `merchant_entity_id` and `confidence_level` ship with standard Transactions for most accounts, but verify in the dashboard for our plan before wiring the cache key change, since changing the cache key is a migration.

**Beyond Plaid:**
- 💡 **Commercial enrichment APIs** (Ntropy, Spade, Heron, MX) provide turnkey merchant/category resolution with their own confidence scores and logos. Worth evaluating once Plaid's own enrichment is fully exploited — they mainly help with the long tail of merchants Plaid labels `UNKNOWN`. Evaluate cost per enrichment vs. our current Places + bulk-LLM cost.
- 💡 **Logos/metadata:** Brandfetch / Clearbit Logo API (or Plaid's `logo_url`/`website` enrichment fields) for the UI, so recommendations can show a merchant logo instead of a generic SF Symbol.

### 5.3 Harden the self-learning cache ✅ (partly done)
- ✅ Added `source` + `confidence`; `OTHER`/low-confidence rows now use a short (7-day) TTL and aren't frozen.
- **Do we need a separate global override table? — No.** The original suggestion was a new global table so one correction fixes a systematic miscategorization for *all* users (today `OverrideRepository` is intentionally per-user — it's where an individual user re-tags a merchant for themselves, and it should stay that way). But we don't need a new repository to get a global fix; we have **two existing mechanisms** that cover it:
  1. **The local brand map (`brandCategoryMap.ts`)** — for a *known, durable* brand correction ("Merchant X should be GROCERY"), just add/adjust a rule. It's version-controlled, reviewable, instant for every user, and needs no datastore. This is the right home for deliberate, vetted corrections and should be the default answer to "fix it for everyone."
  2. **The shared brand cache (`MonetBrandCache`)** — already global across users. A correction can be written here (with `source: "manual"` and high `confidence`) to override a learned value without a code deploy. Keyed on `merchant_entity_id` (§5.2) this becomes a clean global-correction surface for the long tail, reusing infrastructure we already run.
  
  So: **prefer editing the local brand map** for vetted brand rules; use a `source:"manual"` row in the existing cache for deploy-free global corrections. A third dedicated override table would duplicate both. *(If we ever want non-engineers to make global corrections through an admin UI, that UI should write `manual` cache rows — still not a new table.)*

### 5.4 Make the optimizer reflect reality 💡 (partly done)
- ✅ Model **caps** and compute **effective rates** from the user's actual spend (§2.8). *(Cached-path spend population is the remaining follow-up.)*
- ✅ Fix **RankedSpend** to not stack the top tier across categories without ranking context (§2.6).
- 💡 *Remaining:* Model **rotating categories** with effective dates (§2.7).
- 💡 *Remaining:* Add **points valuations** (the `RewardRate.pointValuation` field exists but isn't used in scoring) so a 2× points card can be compared fairly against flat cashback.

### 5.5 Unify the two resolution paths ✅ (done)
Both `/recommend` and Plaid sync now go through the same `evaluateBrand` matcher; the Plaid path additionally layers MCC then Plaid PFC. 💡 A single explicit `resolveCategory(input, { mcc, plaidPfc, merchantEntityId })` facade would make the shared contract more obvious — small refactor, deferred.

---

## 6. Quick wins (small, high value)

1. ✅ Whole-token matching with specificity ranking (done, §2.1).
2. ✅ `RIDESHARE`/`LOCAL_TRANSIT → TRAVEL` fallback chain (done, §2.2).
3. ✅ Info-level request/response logging with correlationId (done).
4. ✅ Fix `Uber Eats → DINING` in `mapPlaidCategory` (done, §2.4).
5. ✅ Short TTL + `source`/`confidence` for `OTHER` (done, §2.5).
6. ✅ MCC → Category wired up (done, §3).
7. ✅ ERROR-log CloudWatch alarm so caught failures (Bedrock throttle) page someone (done, §7).
8. ✅ De-dupe streaming rules; delete the dead `fuzzy` branch; Places defers to `evaluateBrand` (done, §3).
9. ✅ Pass the already-loaded `user` into `getUserOptimizerContext` (done, §4).
10. ✅ Model spend **caps** and fix **RankedSpend** over-promise (done, §2.6 & §2.8). ⚠️ **Rotating** categories with effective dates still open (§2.7).
11. ✅ Skip the synchronous per-name LLM call on the search path; learn in bulk during sync instead (done, §4).

---

## 7. AWS Bedrock throttling & alarming

### Why no alarm fired
`bulkCategorizeMerchants` **catches** the `ThrottlingException`, logs it, and returns an empty map so the sync still completes — the Lambda invocation **succeeds (200)**. The existing alarms (`LambdaFailureAlarm`, `LambdaErrorRateAlarm`) watch `AWS/Lambda Errors`, which only counts *unhandled* invocation failures. A caught-and-logged error is therefore invisible to them. That's the gap.

### What happens to throttled merchants (the fallback)
On throttle, the affected merchants stay `Category.OTHER` for that sync. With the Session-2 caching change they are **not** frozen: `OTHER` is written with a 7-day TTL (or left uncached), so the next sync re-attempts resolution once the token budget resets. The fallback is now explicitly logged.

### What was added (✅)
- **Adaptive retries** on the Bedrock client (`maxAttempts: 4`, `retryMode: "adaptive"`) to ride out transient throttles.
- **Explicit fallback logging** distinguishing a transient throttle from a daily-quota throttle, and logging which merchants were left `OTHER`/uncached.
- **`CroeErrorLogMetricFilter` + `CroeErrorLogAlarm`** in `serverless.yml`: a CloudWatch **Logs metric filter** on `{ $.level = "ERROR" }` over the Lambda log group → custom metric `Monet/Croe ErrorLogCount` → alarm at **threshold ≥ 1 over 60s**, wired to the existing `LambdaAlertsSnsTopic` (email to `akhildaphara@gmail.com`). Now *any* ERROR log — including a caught Bedrock throttle — emails you.

> Action required: after deploy, **confirm the SNS email subscription** (one-time click in the AWS confirmation email) or no mail is delivered.

### Do you need to raise a quota in the console?
Most likely **yes**. *"Too many tokens per day"* is an account-level **on-demand quota** for the specific model (here `amazon.nova-micro-v1:0`) in `us-east-1`, not a per-request limit — so even a single small query fails once the **daily token budget** is exhausted (and new/low-tier accounts start with a low default; bulk prompts at `maxTokens` burn through it fast). To fix:
1. **AWS Console → Service Quotas → Amazon Bedrock** (region `us-east-1`), search the model's *"…tokens per day"* / *"…tokens per minute"* on-demand quota and **request an increase**.
2. Reduce burn: smaller `bulkCategorizeMerchants` batches, lower `maxTokens`, and rely on the cache (Session-2 changes already cut repeat calls). Cross-region inference profiles or Provisioned Throughput are options if volume grows.
3. The local matcher + cache should keep the vast majority of merchants off Bedrock entirely, so the daily budget is reserved for genuinely-new names.
