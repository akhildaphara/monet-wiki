# Bug Hunt & Code Improvements

**Revalidated:** 2026-09-15 against local `main` branches.
**Verification:** account-deletion source and focused tests were inspected; backend build/lint and 43 files / 471 unit tests were previously verified. This is static/local evidence, not a deployed-environment audit.

## Highest-impact open findings

### 1. Account deletion — resolved & verified 2026-09-17

The iOS Account screen and website account drawer provide re-confirmed deletion flows, and the backend exposes authenticated `DELETE /v1/account`. Focused tests cover user-scoped deletion, linked identities, best-effort Plaid revocation, and failure handling. End-to-end deletion was verified on a deployed TestFlight build on 2026-09-17 with local state reset and backend data erasure confirmed.

### 2. Verification-code logging — resolved 2026-08-13

`raw/croe/src/api/auth.ts` now emits generic delivery-failure messages without verification or reset codes. A focused unit test verifies that the code is absent when email delivery fails.

### 3. The app key is source-visible and is not client attestation

The fallback `X-Monet-App-Key` value appears in backend and website source and the iOS CI template. Anything embedded in a web bundle or app can be recovered, so the key should not be described as proving a request came from an authentic client. Remove production fallback values, rotate the current key, and consider App Attest/DeviceCheck for iOS.

### 4. Documentation registry parity — resolved 2026-08-13

`raw/croe/src/api/routeRegistry.ts` now covers the live endpoints and `tests/unit/routeRegistry.test.ts` compares it with the nested Express routers. OpenAPI generation remains a future enhancement.

### 5. Local DynamoDB bootstrap is missing one production table

CloudFormation provisions 13 tables, including `MonetFormSubmissions`, while `src/init-db.ts` creates 12 and omits that table. Add it to local initialization or make the local mocking boundary explicit.

### 6. Reward accuracy still lacks payment-method context

Apple Card is modeled with a 2% base rate even though that rate depends on Apple Pay; a physical card transaction can earn less. Add a payment-method/merchant-wallet-acceptance input or conservatively model the physical rate and explain the Apple Pay upside.

### 7. Website has no automated lint or browser test scripts

The Astro project builds, but `package.json` only exposes dev/build/preview/deploy. Add static checks and browser smoke coverage for guest bootstrap, wallet persistence, search, degraded API behavior, legal links, accessibility, and responsive layout.

## Previously reported findings that are now stale

- DynamoDB local/prod switching no longer depends on `NODE_ENV`; `db.ts` checks `LAMBDA_TASK_ROOT`.
- Discover and Freedom Flex rotating categories are data-driven rather than one hardcoded grocery category.
- The Plaid webhook has a dedicated public gateway event and verifies Plaid's signature/body hash.
- API Gateway throttling, Lambda reserved concurrency, Express burst limiting, and a persistent daily DynamoDB quota are all present. Monitoring and capacity validation remain open.
- Plaid token writes now use AES-256-GCM; AES-256-CBC remains only as a legacy read-migration path.
