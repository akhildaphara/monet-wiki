# Comprehensive Testing Strategy — Monet

Updated 2026-09-18 after completing Phase 1.

This plan prioritizes testing work by risk, blast radius, and setup cost. It covers the three independent submodules: `raw/croe` (backend), `raw/website` (website/PWA), and `raw/swift-app` (iOS).

## Current state

| Layer | Unit tests | Integration tests | E2E/UI tests | Current assessment |
|---|---:|---:|---:|---|
| Backend | Existing suite | Existing route tests mock persistence | None | Good handler coverage, but no real DynamoDB contract coverage |
| Website | **57 tests in 9 suites** | None | None | Phase 1 complete; business-logic coverage is now established |
| iOS app | Existing service tests | Limited | 2 UI tests use hardcoded stubs | Critical financial and auth logic still needs direct tests |

The exact backend and iOS file counts in the original plan should be treated as estimates, not acceptance criteria. Recalculate them when each phase starts rather than carrying stale counts forward.

## Phase 1 — Website unit tests ✅ Complete

### Delivered

- Added `raw/website/vitest.config.ts` with jsdom, aliases, test discovery, and isolated mocks.
- Added Vitest, jsdom, and V8 coverage dependencies and `test`, `test:watch`, and `test:coverage` scripts.
- Added tests for:
  - merchant/category search and Damerau-Levenshtein behavior;
  - icon rendering and category fallback;
  - browser/device form metadata;
  - JWT parsing and user initials;
  - recommendation rate, card, and network formatting;
  - nearby distance and fuzzy corpus search;
  - rewards rate evaluation, rotating categories, and wallet ranking;
  - wallet persistence/deduplication and sample-wallet seeding;
  - referral URL and local-storage fallback behavior.
- Exported the rewards overview’s pure evaluators for direct testing without changing runtime behavior.
- Fixed punctuation-only merchant queries returning fuzzy matches.

### Verification

- `npm test`: **57 passing tests**
- `npm run test:coverage`: passing
- `npm run build`: passing

### Follow-up improvements before Phase 2

1. Exclude generated `out/`, Astro, and static page files from coverage instrumentation. The current report is useful as a baseline, but its aggregate percentage is diluted by generated and untested page files.
2. Add a small coverage policy for the tested logic only. Start with a non-blocking baseline, then enforce thresholds after the next test batch; do not introduce an arbitrary global threshold now.
3. Add tests for the remaining high-value pure paths (`calculator.js`, selected `wallet.js` helpers, and API error parsing) when they are touched by future work.
4. Keep tests deterministic: use fake dates for quarter/rotating rewards and avoid real network, geolocation, or browser timing in unit suites.

## Phase 2 — Backend persistence and route contract tests

**Priority: High.** The existing backend integration tests mock repositories, so they cannot catch DynamoDB key, index, projection, conditional-write, or serialization mistakes.

### 2.1 Establish a safe DynamoDB Local harness

Before adding repository cases:

- Add `tests/dynamo-integration/setup.ts` that connects to a dedicated local endpoint and creates tables from the same authoritative schema used by deployment.
- Prefer an explicit test table prefix or isolated local database over deleting broadly named tables.
- Add `cleanTables()` that deletes test items between tests without dropping/recreating tables for every case.
- Add a readiness check with a bounded timeout and a clear skip/failure message when DynamoDB Local is unavailable.
- Keep the existing mocked test setup out of this config; use a separate `vitest.config.dynamo.ts` and `test:dynamo` script.
- Make encryption tests assert round-trip behavior and that stored values are not plaintext; never log tokens or secrets.

### 2.2 Start with the highest-risk repository contracts

Implement these first, in this order:

1. `UserRepository`: put/get, card updates, Plaid item add/remove, GSI lookup, and account data shape.
2. `CredentialsRepository`: put/get, first-login idempotency, and delete.
3. `TransactionRepository`: batch writes, date filtering, and pagination.
4. `OverrideRepository`: CRUD and user isolation.
5. Rate-limit and insights-cache repositories: counter semantics, key rotation, TTL attributes, and cache round-trip.

Each suite should verify both returned values and the persisted state after a fresh repository instance reads it back. TTL tests should verify the written TTL attribute; waiting for DynamoDB Local to expire an item is unnecessary and flaky.

### 2.3 Close the route holes with focused handler tests

Add unit coverage for:

- `GET /v1/brands/search` query parsing, response shape, and authorization/rate-limit behavior;
- `GET /v1/cards` anonymous access and catalog response shape;
- `DELETE /v1/plaid/connection/:itemId` success, ownership, not-found, and guest-token rejection.

Do this before broad route expansion so the only currently untested route is covered early.

## Phase 3 — Backend HTTP integration coverage

**Priority: High.** Use Supertest against the real app wiring, while mocking only external providers such as Plaid and email delivery.

### 3.1 Auth lifecycle

Cover signup, verification, login, refresh, password reset, duplicate users, invalid/expired codes, resend limits, malformed input, token rotation, and invalid/expired tokens.

### 3.2 User, override, telemetry, and Plaid routes

Cover persistence-visible settings and override flows, account deletion cascades, telemetry validation, Plaid link/exchange/remove/status/accounts/transactions/sync/webhook behavior, and authorization guards.

Avoid testing provider SDK behavior itself. Use deterministic mocks and assert the application’s request mapping, error mapping, and persistence effects.

## Phase 4 — iOS critical business logic and services

**Priority: Medium-high.** Use the simulator/scheme documented in `raw/swift-app/AGENTS.md`.

### 4.1 Highest-risk pure logic

- `BiltCalculator`: housing tiers, cash/points calculations, ratios, next-tier targets, segment reallocation, and all Bilt card variants.
- `CardRewardsResolver`: dynamic insights/tier/rate resolution and fallbacks.
- `Category`: forward-compatible Codable decoding, resolution, and display names.

### 4.2 Service boundaries

Add protocol-backed tests for widget data fallback, API auth/error parsing, token refresh/storage, and certificate-pinning failure behavior. Prefer injected clocks, stores, and clients over global state so tests do not depend on simulator persistence.

## Phase 5 — Cross-layer smoke and E2E coverage

Add a small number of high-value flows only after unit and contract tests are stable:

- Website: load `/app`, search a merchant/category, view a recommendation, manage wallet, and exercise auth boundaries.
- Backend: health, anonymous cards/search, auth lifecycle, and one Plaid test using a provider mock.
- iOS: launch with sample data, search/recommendation, wallet edit, and sign-in boundary.

Use stable fixtures and test accounts. Do not make third-party production APIs part of CI.

## Recommended delivery order

1. Website follow-up: coverage exclusions and baseline reporting.
2. Backend DynamoDB Local harness and `UserRepository` contract suite.
3. Remaining repository contract suites and the untested Plaid-delete route.
4. Backend auth and route integration flows.
5. iOS calculator/rewards/category tests.
6. Cross-layer smoke/E2E flows.

## Definition of done for each phase

- Tests run from the submodule’s documented working directory.
- The normal focused command passes in a clean checkout.
- External services are mocked or locally isolated.
- New code-change notes are added to the owning submodule’s `changelog.md`.
- No secrets, generated artifacts, debug files, staging, commits, or pushes are introduced without explicit approval.
