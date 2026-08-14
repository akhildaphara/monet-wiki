# Bug Hunt & Code Improvements

**Revalidated:** 2026-08-05 against local `main` branches.
**Verification:** backend build passed; 52 files / 504 tests passed; website build passed. This is static/local evidence, not a deployed-environment audit.

## Highest-impact open findings

### 1. No registered-user account deletion flow (release blocker)

The iOS Settings/Profile UI offers sign-out but no Delete Account action, and the backend exposes no account-erasure endpoint. A complete workflow must remove credentials, the user profile, Plaid connections and tokens, transactions, overrides, recommendation preferences/feedback associations, insights cache, Plaid item indexes, and local data. Retention rules are also needed for telemetry and form submissions.

### 2. Verification code can reach production logs

`raw/croe/src/api/auth.ts` logs the generated verification code when signup email delivery fails, with a TODO to remove it. This can expose an authentication secret in CloudWatch. Production paths should never log OTPs; any local/test disclosure should require an explicit local-only guard.

### 3. The app key is source-visible and is not client attestation

The fallback `X-Monet-App-Key` value appears in backend and website source and the iOS CI template. Anything embedded in a web bundle or app can be recovered, so the key should not be described as proving a request came from an authentic client. Remove production fallback values, rotate the current key, and consider App Attest/DeviceCheck for iOS.

### 4. Documentation registry does not match the live router

`raw/croe/src/api/routeRegistry.ts` omits native auth routes, forms, crash telemetry, and other live endpoints from `src/api/routes.ts` / `src/api/auth.ts`. Generate OpenAPI from the router/Zod schemas or add a parity test so clients and documentation cannot silently drift.

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
