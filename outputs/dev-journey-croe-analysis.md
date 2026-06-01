# Monet Backend (croe) — Git History Analysis

> **Generated from:** `git -C raw/croe log main` on branch `main` only  
> **Analysis date:** 2026-05-31  
> **HEAD:** `8a0892b` — feat: aggregate descendant category spend for cap tracking in fallback-resolved reward calculations

---

## 1. Overview Stats

| Metric | Value |
|--------|-------|
| **Total commits on main** | 137 |
| **First commit** | 2026-01-24 (`b18c92a` — Initial commit) |
| **Last commit** | 2026-05-31 (`8a0892b` — aggregate descendant category spend for cap tracking) |
| **Time span** | 127 days (Jan 24 → May 31, 2026) |
| **Unique authors** | 1 — Akhil Daphara (137 commits) |
| **Git tags / releases** | **None** (`git tag -l` returned empty) |
| **Tracked files (HEAD)** | 204 |
| **Total tracked lines (HEAD)** | 31,864 |
| **Application code (excl. `.agents/`)** | 21,590 lines |
| **`.agents/` skill docs contribution** | 10,274 lines (added in commit `f204a06`) |

### Lines of Code by Language (HEAD, `git ls-files` + line counts)

| Language / Extension | Files | Lines | Notes |
|---------------------|-------|-------|-------|
| TypeScript (`.ts`) | 124 | 12,057 | Primary application code |
| Markdown (`.md`) | 65 | 10,421 | Mostly `.agents/` AWS skill docs |
| JSON (`.json`) | 4 | 8,295 | Mostly `package-lock.json` |
| YAML (`.yml`) | 1 | 469 | `serverless.yml` |
| Shell (`.sh`) | 1 | 250 | AWS login script |
| JavaScript (`.js`) | 4 | 218 | Legacy dev/test scripts |
| YAML (`.yaml`) | 1 | 57 | |
| Python (`.py`) | 1 | 49 | |
| Other | 4 | 48 | `.gitignore`, `.env.example`, `.prettierrc` |

**Application-focused LOC (excluding `.agents/` markdown):**

| Extension | Lines |
|-----------|-------|
| TypeScript | 11,952 |
| JSON | 8,295 |
| YAML (yml+yaml) | 526 |
| Shell | 250 |
| JavaScript | 218 |
| Markdown (app docs) | 358 |

---

## 2. Timeline of Commits

### 2.1 Commits per Month

| Month | Count |
|-------|-------|
| 2026-01 | 7 |
| 2026-02 | 9 |
| 2026-03 | 6 |
| 2026-04 | 55 |
| 2026-05 | 60 |
| **Total** | **137** |

**Pattern:** Slow start (22 commits in Jan–Mar), then explosive growth in April (55) and May (60). April 27 alone had 14 commits — a single-day refactor marathon after Plaid went live.

### 2.2 Commits per Week

| Week | Count |
|------|-------|
| 2026-W03 | 4 |
| 2026-W04 | 3 |
| 2026-W05 | 4 |
| 2026-W08 | 5 |
| 2026-W09 | 3 |
| 2026-W10 | 3 |
| 2026-W13 | 1 |
| 2026-W15 | 3 |
| 2026-W16 | 15 |
| 2026-W17 | 36 |
| 2026-W18 | 13 |
| 2026-W21 | 47 |

Peak activity: **2026-W21** (47 commits, May 19–25 window overlapping May 27–31 burst) and **2026-W17** (36 commits, Apr 21–27 — Plaid + serverless sprint).

### 2.3 Cumulative Commit Count Over Time

| Date | Cumulative Commits |
|------|-------------------|
| 2026-01-24 | 4 |
| 2026-01-28 | 7 |
| 2026-02-07 | 11 |
| 2026-02-23 | 12 |
| 2026-02-24 | 16 |
| 2026-03-05 | 19 |
| 2026-03-09 | 22 |
| 2026-04-04 | 23 |
| 2026-04-15 | 26 |
| 2026-04-24 | 30 |
| 2026-04-25 | 38 |
| 2026-04-26 | 41 |
| 2026-04-27 | 56 |
| 2026-04-28 | 66 |
| 2026-04-29 | 77 |
| 2026-05-05 | 78 |
| 2026-05-07 | 81 |
| 2026-05-08 | 83 |
| 2026-05-09 | 87 |
| 2026-05-10 | 90 |
| 2026-05-27 | 95 |
| 2026-05-28 | 105 |
| 2026-05-29 | 116 |
| 2026-05-30 | 121 |
| 2026-05-31 | 137 |

### 2.4 Complete Chronological Commit List (all 137)

| # | Hash | Date | Author | Subject |
|---|------|------|--------|---------|
| 1 | `b18c92a` | 2026-01-24 | Akhil Daphara | Initial commit |
| 2 | `41ec8fd` | 2026-01-24 | Akhil Daphara | Initial commit |
| 3 | `5d86c50` | 2026-01-24 | Akhil Daphara | Merge branch 'main' of https://github.com/akhildaphara/croe |
| 4 | `813e9be` | 2026-01-24 | Akhil Daphara | clean gitIgnore |
| 5 | `e7c0635` | 2026-01-28 | Akhil Daphara | implement categorize endpoint, add node, doc update |
| 6 | `7bd199a` | 2026-01-28 | Akhil Daphara | change node type to module, log incoming request |
| 7 | `1531532` | 2026-01-28 | Akhil Daphara | update endpoint doc |
| 8 | `8bf64a2` | 2026-02-07 | Akhil Daphara | card rewards data, api docs update |
| 9 | `85a6859` | 2026-02-07 | Akhil Daphara | add findeBestCard for a user feature |
| 10 | `f5aa8cd` | 2026-02-07 | Akhil Daphara | separate data and optimizer |
| 11 | `31caf18` | 2026-02-07 | Akhil Daphara | move to TS |
| 12 | `b9b28d7` | 2026-02-23 | Akhil Daphara | feat: transfer brand categorizer and data from iOS app to backend. Implement user authentication, state management, and personalized category overrides with DynamoDB integration. |
| 13 | `660229e` | 2026-02-24 | Akhil Daphara | add new cards, rename MCCCategory to Category, minor improvements |
| 14 | `7f5a6a2` | 2026-02-24 | Akhil Daphara | enhance get cards endpoint to store all cards in backend |
| 15 | `34e2dfa` | 2026-02-24 | Akhil Daphara | fix infinity sign for chase |
| 16 | `6298a5b` | 2026-02-24 | Akhil Daphara | include speacial rewards like quarterly bonus |
| 17 | `10557e1` | 2026-03-05 | Akhil Daphara | add city state to categorize |
| 18 | `36aa871` | 2026-03-05 | Akhil Daphara | add lyft 5% on chase sp |
| 19 | `56dee70` | 2026-03-05 | Akhil Daphara | feat: Add local DynamoDB initialization script with data persistence and include selected card details in user API responses. |
| 20 | `0edef50` | 2026-03-09 | Akhil Daphara | spearate category for lyft and uber |
| 21 | `5b8003c` | 2026-03-09 | Akhil Daphara | feat: implement Plaid integration with new endpoints and user data fields. |
| 22 | `01a26ac` | 2026-03-09 | Akhil Daphara | feat: Add Plaid API endpoints for fetching user accounts and transactions. |
| 23 | `95a0200` | 2026-04-04 | Akhil Daphara | feat: Implement Plaid integration with endpoints for creating link tokens, exchanging public tokens, and fetching transactions; add transaction handling in DynamoDB. |
| 24 | `be4eae4` | 2026-04-15 | Akhil Daphara | remove plaid |
| 25 | `edaf384` | 2026-04-15 | Akhil Daphara | refactor: implement centralized error handling, type-safe request user IDs, and atomic database updates for user settings and cards |
| 26 | `117ffc6` | 2026-04-15 | Akhil Daphara | updated docs |
| 27 | `7088a5e` | 2026-04-24 | Akhil Daphara | add plaid |
| 28 | `51020b6` | 2026-04-24 | Akhil Daphara | db check at startup |
| 29 | `7dca850` | 2026-04-24 | Akhil Daphara | feat: add DELETE /v1/plaid/connection endpoint to remove Plaid items and local user data |
| 30 | `4779197` | 2026-04-24 | Akhil Daphara | feat: support multiple Plaid items per user by refactoring data structure and endpoints |
| 31 | `c6484f5` | 2026-04-25 | Akhil Daphara | feat: enrich account objects with institution names fetched from Plaid API |
| 32 | `d1625d1` | 2026-04-25 | Akhil Daphara | feat: implement Plaid transaction webhook handling, background synchronization, and endpoint for fetching institution details |
| 33 | `90e82d6` | 2026-04-25 | Akhil Daphara | feat: add configurable timeframe and global optimization logic to insights endpoint |
| 34 | `d7a5cc9` | 2026-04-25 | Akhil Daphara | feat: implement modular API routing, authentication middleware while refactoring categorization logic. Formatting |
| 35 | `a541b79` | 2026-04-25 | Akhil Daphara | feat: implement authentication middleware for card routes and update delete override to use merchantId path parameter |
| 36 | `aa0e699` | 2026-04-25 | Akhil Daphara | feat: implement DynamoDB-based insights caching and optimize transaction processing performance |
| 37 | `aaf5106` | 2026-04-25 | Akhil Daphara | feat: implement DynamoDB-based insights caching and optimize transaction processing performance |
| 38 | `7e143f3` | 2026-04-25 | Akhil Daphara | feat: add API endpoint for updating custom card rewards and register new credit card definitions (venmo, zolve) |
| 39 | `3de584c` | 2026-04-26 | Akhil Daphara | feat: implement dynamic credit card rewards and integrate user-specific card data into insights and categorization endpoints |
| 40 | `7f74180` | 2026-04-26 | Akhil Daphara | feat: implement serverless deployment configuration and support for AWS Lambda execution |
| 41 | `be655d1` | 2026-04-26 | Akhil Daphara | feat: migrate to CJS, downgrade to Node 20, and implement JWT authorizer with scoped IAM permissions |
| 42 | `03fc3cf` | 2026-04-27 | Akhil Daphara | feat: implement sanitizeUserForClient to scrub sensitive Plaid data from user responses across API endpoints |
| 43 | `89220cd` | 2026-04-27 | Akhil Daphara | feat: add transaction deletion support and improve sync logic for pending transactions and merchant names |
| 44 | `4e6aa77` | 2026-04-27 | Akhil Daphara | feat: add error handling for Plaid sync exceptions and improve webhook logging and event processing |
| 45 | `fa062da` | 2026-04-27 | Akhil Daphara | fix: implement retry logic for DynamoDB batch operations and add 5s timeout to Places API requests |
| 46 | `8a656da` | 2026-04-27 | Akhil Daphara | feat: add aws login script and update Plaid link token configuration for OAuth support |
| 47 | `510d22d` | 2026-04-27 | Akhil Daphara | fix: redact sensitive tokens from logs, remove unused android config, and ensure encryption key uses 32-byte hash |
| 48 | `77675ae` | 2026-04-27 | Akhil Daphara | feat: filter plaid transactions to include only the last 180 days |
| 49 | `b707633` | 2026-04-27 | Akhil Daphara | refactor: enable Plaid item access token updates and improve error handling during account synchronization |
| 50 | `36e01f6` | 2026-04-27 | Akhil Daphara | feat: trigger proactive transaction sync on token exchange and add account_id filtering to transaction retrieval |
| 51 | `e85b56e` | 2026-04-27 | Akhil Daphara | fix: await initial transaction sync and add delay to allow for database consistency |
| 52 | `f5d1fac` | 2026-04-27 | Akhil Daphara | feat: add sync-transactions endpoint to sync all Plaid items and improve logging and sync reliability |
| 53 | `855add1` | 2026-04-27 | Akhil Daphara | update db schema |
| 54 | `1b28e31` | 2026-04-27 | Akhil Daphara | feat: integrate detailed Plaid categories into transaction mapping and insight synchronization logic |
| 55 | `f55fb00` | 2026-04-27 | Akhil Daphara | refactor: migrate to unified transactions table and update transaction parsing and caching logic |
| 56 | `853f4da` | 2026-04-27 | Akhil Daphara | refactor: use parseDateAndId helper for transaction processing and add computedAt timestamp to insights cache |
| 57 | `84da485` | 2026-04-28 | Akhil Daphara | feat: refactor dynamic reward calculation to support manual card tracking and include insights in sync response |
| 58 | `eeebe8f` | 2026-04-28 | Akhil Daphara | refactor: implement repository pattern for data access and integrate with DynamoDB helper classes |
| 59 | `1cb18cc` | 2026-04-28 | Akhil Daphara | refactor: implement paginated queryAll and scanAll helpers in DynamoRepository and update repository usage |
| 60 | `c5906f6` | 2026-04-28 | Akhil Daphara | feat: define DynamoDB record schemas and centralize exports in dao.ts |
| 61 | `e5b783c` | 2026-04-28 | Akhil Daphara | use the new dynamo repository classes |
| 62 | `dc4aa2f` | 2026-04-28 | Akhil Daphara | refactor: migrate all project import paths to use absolute src/ aliases |
| 63 | `7f0a22f` | 2026-04-28 | Akhil Daphara | style: apply project-wide Prettier formatting changes |
| 64 | `e85f332` | 2026-04-28 | Akhil Daphara | refactor: enforce type-only imports, clean up code formatting, and simplify optional chaining logic |
| 65 | `e6d5592` | 2026-04-28 | Akhil Daphara | feat: replace categorize endpoint with modular recommendation routes and add wallet overview functionality |
| 66 | `a194500` | 2026-04-28 | Akhil Daphara | test: configure vitest, add testing dependencies, and implement initial unit and integration test suites. |
| 67 | `4781875` | 2026-04-29 | Akhil Daphara | refactor: modernize null coalescing and type safety |
| 68 | `964b3f3` | 2026-04-29 | Akhil Daphara | refactor: introduce centralized API request/response types and a route registry for improved type safety across all endpoints. |
| 69 | `88f6a8d` | 2026-04-29 | Akhil Daphara | feat: add type definitions for custom card rewards and implement runtime validation in updateCardRewards handler |
| 70 | `3fae7f6` | 2026-04-29 | Akhil Daphara | refactor: cleanup legacy aliases, modernize sync logic, and remove deprecated token handling |
| 71 | `9de0ed0` | 2026-04-29 | Akhil Daphara | refactor: replace transactionId with dateAndId as the DynamoDB sort key for MonetTransactions table |
| 72 | `91944be` | 2026-04-29 | Akhil Daphara | feat: implement Zod-based request validation middleware and apply to API routes |
| 73 | `a83000a` | 2026-04-29 | Akhil Daphara | refactor: consolidate logging middleware with improved redaction and concise request-response output |
| 74 | `87440fe` | 2026-04-29 | Akhil Daphara | refactor: consolidate AIRLINES category into TRAVEL and add fallback logic for travel sub-categories |
| 75 | `13f8778` | 2026-04-29 | Akhil Daphara | refactor: decouple transaction identification from date by replacing the composite sort key with transactionId and adding a DateIndex LSI. |
| 76 | `6ecc3f1` | 2026-04-29 | Akhil Daphara | refactor: centralize repository mocks in test setup and standardize mock clearing behavior |
| 77 | `6ca9f67` | 2026-04-29 | Akhil Daphara | fix: configure DynamoDBDocumentClient to strip undefined values and convert class instances |
| 78 | `972711a` | 2026-05-05 | Akhil Daphara | feat: update Discover gas rewards and add Bilt Blue, Bilt Obsidian, and Bilt Palladium credit cards |
| 79 | `5cbd76f` | 2026-05-07 | Akhil Daphara | remove gemini package |
| 80 | `ed23d8b` | 2026-05-07 | Akhil Daphara | feat: include transaction name in merchant name and category resolution logic |
| 81 | `991d701` | 2026-05-07 | Akhil Daphara | feat: restrict cache-miss transaction fetching to a 180-day window |
| 82 | `eccde37` | 2026-05-08 | Akhil Daphara | feat: add isNewUser flag to auth sync response and sanitize logic |
| 83 | `f204a06` | 2026-05-08 | Akhil Daphara | add aws agents |
| 84 | `58f9903` | 2026-05-09 | Akhil Daphara | feat: Bilt 2.0 Blueprint implementation |
| 85 | `bed535a` | 2026-05-09 | Akhil Daphara | eslint |
| 86 | `78800a9` | 2026-05-09 | Akhil Daphara | feat: calculate top user spending categories globally for reward optimization and add computed timestamp to insights cache |
| 87 | `8fc451b` | 2026-05-09 | Akhil Daphara | feat: implement state-aware reward optimization using user transaction history and robust card data validation |
| 88 | `b3f8fd8` | 2026-05-10 | Akhil Daphara | refactor: standardize code formatting and improve readability in syncInsights.ts |
| 89 | `2d35552` | 2026-05-10 | Akhil Daphara | refactor: migrate user plaidItems from array to record map and update rewards logic to support reward rate objects |
| 90 | `50cf03d` | 2026-05-10 | Akhil Daphara | feat: move health check endpoint before middleware for improved request handling efficiency |
| 91 | `7cdc1d4` | 2026-05-27 | Akhil Daphara | feat: add Uber/Lyft category fallback to Transit or Travel |
| 92 | `baece33` | 2026-05-27 | Akhil Daphara | refactor: extract category resolution logic to support display of fallback categories in recommendations |
| 93 | `95e764a` | 2026-05-27 | Akhil Daphara | refactor: remove legacy customCardRewards field in favor of per-card custom rewards structure |
| 94 | `77d9193` | 2026-05-27 | Akhil Daphara | test: implement comprehensive unit test suite for API controllers and DynamoDB repositories |
| 95 | `7865a57` | 2026-05-27 | Akhil Daphara | fix: grant dynamodb index access permissions to serverless functions |
| 96 | `d00de96` | 2026-05-28 | Akhil Daphara | feat: get 180 days data for new token |
| 97 | `0dd07e4` | 2026-05-28 | Akhil Daphara | feat: integrate AWS Bedrock to perform AI-based fallback categorization for transactions labeled as OTHER |
| 98 | `5f3aa87` | 2026-05-28 | Akhil Daphara | feat: implement global DynamoDB brand categorization cache with Bedrock LLM fallback for unrecognized merchants |
| 99 | `ff8d987` | 2026-05-28 | Akhil Daphara | refactor: consolidate Plaid transaction syncing into a unified process with optimized batch processing and brand cache integration |
| 100 | `67e063d` | 2026-05-28 | Akhil Daphara | feat: invalidate insights cache on transaction sync and update transportation category mapping |
| 101 | `7d9b1f5` | 2026-05-28 | Akhil Daphara | refactor: replace console logs with a centralized structured logger across Plaid sync and webhook services |
| 102 | `55f81a1` | 2026-05-28 | Akhil Daphara | refactor: improve observability by enhancing transaction sync and webhook logging with detailed context and data. |
| 103 | `7818006` | 2026-05-28 | Akhil Daphara | refactor: simplify insights sync logic by removing incremental transaction merging in favor of full-window cache hits |
| 104 | `4ac3214` | 2026-05-28 | Akhil Daphara | feat: implement RankedSpend dynamic card optimization logic and fix CloudWatch alarm math expression |
| 105 | `af4966b` | 2026-05-28 | Akhil Daphara | refactor: improve code formatting and add type safety to baseRate calculation in syncInsights |
| 106 | `3857206` | 2026-05-29 | Akhil Daphara | feat: integrate auto-rewards into card insights and persist updated card states atomically to the user record |
| 107 | `fcd673d` | 2026-05-29 | Akhil Daphara | refactor: separate earnings and recommendation logic to surface unmapped dynamic cards as category recommendations without affecting financial calculations |
| 108 | `b3d9283` | 2026-05-29 | Akhil Daphara | feat: add per-card spend and earnings breakdown to insights and filter out rent transactions |
| 109 | `d5d15cf` | 2026-05-29 | Akhil Daphara | fix: add BatchGetItem permission and deduplicate transaction removal IDs |
| 110 | `3a3c66a` | 2026-05-29 | Akhil Daphara | feat: add CloudWatch logging infrastructure for Amazon Bedrock and document configuration steps |
| 111 | `2048ed5` | 2026-05-29 | Akhil Daphara | feat: add email subscription to monet croe lambda alerts SNS topic |
| 112 | `12ec03c` | 2026-05-29 | Akhil Daphara | refactor: replace console logs with structured logger, optimize transaction fetching with date filters, and improve brand cache lookup efficiency. |
| 113 | `f2822a2` | 2026-05-29 | Akhil Daphara | feat: add plaidCardMappings support to user profiles and enable automated background insight pre-computation via webhooks |
| 114 | `c0bf3ae` | 2026-05-29 | Akhil Daphara | refactor: opus 4.8 review Backend fixes applied Critical / Security serverless.yml |
| 115 | `6f2fe97` | 2026-05-29 | Akhil Daphara | feat: replace O(N) full-table scan with O(1) index lookup for getUserByItemId using a new MonetPlaidItemIndex DynamoDB table. |
| 116 | `f330119` | 2026-05-29 | Akhil Daphara | feat: implement scoped logger with persistent metadata and automatic correlation IDs |
| 117 | `4cf6656` | 2026-05-30 | Akhil Daphara | refactor: implement category reward fallback logic and enhance logging with request summarization |
| 118 | `043c8cd` | 2026-05-30 | Akhil Daphara | feat: implement encrypted plaid token retrieval in UserRepository and add Plaid webhook signature verification tests |
| 119 | `60045ee` | 2026-05-30 | Akhil Daphara | refactor: replace heuristic brand matching with token-based scoring and add MCC-to-category resolution logic. |
| 120 | `356f1cf` | 2026-05-30 | Akhil Daphara | refactor: extract brand matching logic into dedicated BrandMatcher module and update cache persistence with source metadata |
| 121 | `353307b` | 2026-05-30 | Akhil Daphara | feat: add UTILITIES category and register telecom and utility brand match rules |
| 122 | `c61c1d1` | 2026-05-31 | Akhil Daphara | refactor: consolidate brand resolution into the shared matcher and implement spend-cap logic for cashback optimization. |
| 123 | `7e6332e` | 2026-05-31 | Akhil Daphara | feat: implement Apple Sign-In support and enable public access to the card catalog for guest mode |
| 124 | `097cd20` | 2026-05-31 | Akhil Daphara | feat: implement lambda authorizer with guest token support, origin secret enforcement, and dev key bypass |
| 125 | `8bcd6c2` | 2026-05-31 | Akhil Daphara | feat: implement global and route-specific API rate limiting using express-rate-limit |
| 126 | `a9dbd74` | 2026-05-31 | Akhil Daphara | feat: implement origin secret middleware to restrict direct API Gateway access and improve recommender logging privacy |
| 127 | `25032a6` | 2026-05-31 | Akhil Daphara | security: patch prototype pollution, pin dependency versions, and validate card identifiers against allowlist |
| 128 | `3adb688` | 2026-05-31 | Akhil Daphara | feat: add support for quarterly-rotating credit card bonus categories with dynamic date-based scheduling and updated card rewards data. |
| 129 | `f7bbed1` | 2026-05-31 | Akhil Daphara | feat: separate Prime and Amazon Visa rewards and implement calendar-period spend tracking in insights to support reward caps |
| 130 | `b495370` | 2026-05-31 | Akhil Daphara | feat: implement per-card spend tracking to enforce accurate spend caps for autoRewards and linked cards |
| 131 | `bcaf709` | 2026-05-31 | Akhil Daphara | fix: allow partial customRewards maps in Zod validation by switching to partialRecord |
| 132 | `ef0a0a4` | 2026-05-31 | Akhil Daphara | feat: revert Zolve rewards to 5%/3% RankedSpend structure and remove quarterly cap |
| 133 | `69b8b48` | 2026-05-31 | Akhil Daphara | fix: prevent RankedSpend cards from claiming categories already covered by RotatingCategory or CategorySpecial bonuses |
| 134 | `88dfb58` | 2026-05-31 | Akhil Daphara | refactor: centralize category claiming logic into new claimedCategories utility to simplify RankedSpend assignment |
| 135 | `0a4f9ec` | 2026-05-31 | Akhil Daphara | fix: move SNS email subscription to standalone resource to prevent deletion on stack updates |
| 136 | `f40762c` | 2026-05-31 | Akhil Daphara | refactor: rename UBER category display name to "Uber" to differentiate from RIDESHARE |
| 137 | `8a0892b` | 2026-05-31 | Akhil Daphara | feat: aggregate descendant category spend for cap tracking in fallback-resolved reward calculations |

---

## 3. Lines of Code Over Time

Computed via `git log main --numstat --reverse`, accumulating net lines (additions − deletions) at each commit. No checkouts performed.

### 3.1 Cumulative Net LOC (month-end snapshots)

| Date | Cumulative Net Lines |
|------|---------------------|
| 2026-01-28 | 1,161 |
| 2026-02-24 | 5,458 |
| 2026-03-09 | 5,869 |
| 2026-04-29 | 14,813 |
| 2026-05-31 | 31,864 |

**Growth phases:**
- **Jan–Feb:** 0 → 5,458 (prototype + iOS migration)
- **Mar:** Plateau (+411 net) — refinement, minimal new code
- **Apr:** 5,869 → 14,813 (+8,944) — Plaid, serverless, repository refactor
- **May:** 14,813 → 31,864 (+17,051) — AI categorization, security hardening, `.agents/` docs, tests

> Note: May's net LOC includes ~10,274 lines from `.agents/` AWS skill markdown (`f204a06`). Excluding that commit, May application growth is ~7,000 net lines.

### 3.2 Additions / Deletions per Month

| Month | Additions | Deletions | Net |
|-------|-----------|-----------|-----|
| 2026-01 | 1,306 | 145 | +1,161 |
| 2026-02 | 5,188 | 891 | +4,297 |
| 2026-03 | 426 | 15 | +411 |
| 2026-04 | 13,819 | 4,875 | +8,944 |
| 2026-05 | 20,422 | 3,371 | +17,051 |

April had the highest **deletion** count (4,875) — evidence of major refactors (Plaid removal/re-add, monolith → modular routes, sort-key experiments).

---

## 4. Major Milestones & Feature Arc

### Phase 1: Prototype (Jan 24 – Feb 7, 2026)

**`b18c92a` — Initial commit (2026-01-24)**  
Only `.gitignore` (139 lines) and `README.md`. Empty scaffold.

**`e7c0635` — implement categorize endpoint, add node, doc update (2026-01-28)**  
First real backend: Node.js Express-style server with `categorizer.js`, `index.js`, `constants.js`. +1,040 lines across 7 files. The `/categorize` endpoint is born.

**Feb 7 burst (4 commits):** Card rewards data, `findBestCard` optimizer, separation of data/optimizer modules, TypeScript migration (`move to TS`).

### Phase 2: iOS → Backend Migration (Feb 23 – Mar 9, 2026)

**`b9b28d7` — transfer brand categorizer and data from iOS app to backend (2026-02-23)**  
Largest feature commit of early history (+3,543 / −429, 18 files). Added:
- `brandCategoryMap.ts` (288 lines of brand→category mappings)
- `placesService.ts` (Google Places integration)
- DynamoDB layer (`dao.ts`, `db.ts`)
- User auth, category overrides, local DynamoDB setup scripts

**Feb 24:** Card catalog expansion, `MCCCategory` renamed to `Category`, quarterly bonus rewards, Chase infinity symbol fix.

**Mar 5–9:** City/state in categorization, Lyft/Uber category split, local DynamoDB init script, early Plaid endpoint stubs (`5b8003c`, `01a26ac`).

### Phase 3: The Plaid Roller Coaster (Apr 4 – Apr 15, 2026)

**`95a0200` — Implement Plaid integration (2026-04-04)**  
+503 lines: link token, public token exchange, transaction fetch, DynamoDB transaction storage, `init-db.js`.

**`be4eae4` — remove plaid (2026-04-15)**  
−598 lines. Deleted all Plaid code from `index.ts`, `plaid.ts`, docs. **11-day experiment abandoned.**

**Same day (`edaf384`):** Refactored error handling, type-safe user IDs, atomic DB updates — building foundations while Plaid was out.

**`7088a5e` — add plaid (2026-04-24)**  
Plaid re-added (+439 lines) 9 days later, with `plaidCategoryMap.ts` for Plaid→Monet category mapping.

### Phase 4: Production Sprint (Apr 24 – Apr 29, 2026) — 48 commits in 6 days

This is the architectural turning point. Key commits examined via `git show --stat`:

**Apr 24 — Plaid hardening:**
- Multi-item support per user (`4779197`)
- DELETE connection endpoint (`7dca850`)
- DB health check at startup (`51020b6`)

**Apr 25 — The big refactor (`d7a5cc9`):**  
+3,752 / −1,161 across **48 files**. Monolithic `index.ts` (826 lines removed) split into modular API:
- `src/api/plaid/*`, `src/api/user/*`, `src/api/routes.ts`, `src/app.ts`
- Auth middleware, logging middleware
- Expanded `brandCategoryMap.ts` (+894 lines)
- Insights caching introduced (`aa0e699`: +230 lines in `syncInsights.ts`)

**Apr 25–26 — Insights & deployment:**
- Webhook handling + background sync (`d1625d1`)
- Global optimization in insights (`90e82d6`)
- Dynamic per-user card rewards (`3de584c`)
- **`7f74180` — serverless.yml created (+102 lines)** — first AWS Lambda deployment config
- **`be655d1` — JWT authorizer**, Node 20, CJS migration, scoped IAM

**Apr 27 — Plaid sync marathon (14 commits):**  
Security (`sanitizeUserForClient`, token redaction), 180-day transaction window, OAuth link tokens, unified transactions table, proactive sync on token exchange, race-condition fix (`e85b56e`: "await initial transaction sync and add delay to allow for database consistency").

**Apr 28–29 — Architecture maturation:**
- Repository pattern (`eeebe8f`: DynamoRepository, UserRepository, TransactionRepository)
- Vitest test suite (`a194500`: +3,160 lines)
- Zod validation middleware (`91944be`)
- Route registry + typed API contracts (`964b3f3`)
- **Sort key flip-flop:** `9de0ed0` switched to `dateAndId` composite key, then **`13f8778` same day** reverted to `transactionId` + DateIndex LSI — classic schema iteration under load

### Phase 5: Reward Engine Evolution (May 5 – May 10, 2026)

- Bilt card family added (`972711a`)
- Gemini package removed (`5cbd76f`) — pivot away from Google AI
- **`58f9903` — Bilt 2.0 Blueprint implementation** (+480/−126): complex multi-card Bilt rewards modeling
- **`8fc451b` — state-aware reward optimization** using transaction history
- **`78800a9` — global top spending categories** for portfolio-level optimization
- Plaid items migrated from array to record map (`2d35552`)

**17-day gap (May 10 → May 27):** No commits — likely iOS integration / manual testing period.

### Phase 6: AI, Scale & Beta Hardening (May 27 – May 31, 2026) — 47 commits

**Categorization intelligence:**
- **`0dd07e4` / `5f3aa87` — AWS Bedrock LLM fallback** for `OTHER` transactions + global DynamoDB brand cache (+615 and +599 lines)
- Token-based brand matching replaces heuristics (`60045ee`, `356f1cf`)
- UTILITIES category added (`353307b`)

**Recommendation engine:**
- **`4ac3214` — RankedSpend dynamic card optimization** in `syncInsights.ts` (+83 lines of core optimizer logic)
- Auto-rewards integration (`3857206`)
- Earnings vs. recommendations decoupled (`fcd673d`)
- Quarterly rotating bonus categories (`3adb688`)
- Spend cap tracking (`f7bbed1`, `b495370`, `c61c1d1`)
- Category claiming logic centralized after bug (`69b8b48`, `88dfb58`)
- Latest: descendant category aggregation for caps (`8a0892b`)

**Performance / scaling:**
- **`6f2fe97` — O(N) scan → O(1) index lookup** via `MonetPlaidItemIndex` table for webhook user resolution
- Insights cache simplified to full-window hits (`7818006`) — removed incremental merge complexity
- 180-day windows enforced consistently across sync and cache-miss paths

**Security & production readiness (May 31 burst — 15 commits in one day):**
- Apple Sign-In + guest mode (`7e6332e`)
- Lambda authorizer with guest tokens (`097cd20`)
- Rate limiting (`8bcd6c2`)
- Origin secret middleware (`a9dbd74`)
- Prototype pollution patch, pinned deps (`25032a6`)
- **`c0bf3ae` — opus 4.8 review Backend fixes** (28 files, security-focused serverless.yml changes)
- Plaid webhook signature verification tests (`043c8cd`)
- Encrypted token retrieval in UserRepository (`043c8cd`)

**Observability:**
- Structured logger with correlation IDs (`f330119`)
- CloudWatch alarms + SNS email alerts (`3a3c66a`, `2048ed5`, `0a4f9ec`)
- Bedrock CloudWatch logging (`3a3c66a`)

### Features NOT found in git history

- **Push notifications** — no commits
- **Payments / subscriptions** — no commits
- **Git tags or semver releases** — none

---

## 5. Aha Moments & Lessons Learned

### 5.1 Plaid: Add → Remove → Re-add

| Date | Commit | Message |
|------|--------|---------|
| 2026-04-04 | `95a0200` | feat: Implement Plaid integration… |
| 2026-04-15 | `be4eae4` | **remove plaid** |
| 2026-04-24 | `7088a5e` | **add plaid** |

**Lesson:** Early Plaid integration was ripped out entirely (−598 lines) before being rebuilt properly 9 days later with cleaner architecture. The second implementation came with multi-item support, webhooks, and modular routing already planned.

### 5.2 DynamoDB Sort Key Iteration (same day)

| Commit | Message |
|--------|---------|
| `9de0ed0` | replace transactionId with **dateAndId** as the DynamoDB sort key |
| `13f8778` | decouple transaction identification from date by replacing the composite sort key with **transactionId** and adding a DateIndex LSI |

**Lesson:** Composite sort keys seemed appealing for date-range queries but caused coupling problems; the team settled on `transactionId` + LSI within hours.

### 5.3 Race Conditions in Plaid Sync

> `e85b56e` — "fix: **await initial transaction sync and add delay to allow for database consistency**"

Classic distributed-systems learning: token exchange triggered sync before DynamoDB writes were visible.

### 5.4 Insights Caching Duplicate Commit

`aa0e699` (+230 lines, real implementation) followed by `aaf5106` (same message, only 5-line tweak in `auth/sync.ts`). Suggests a partial commit / amend pattern during intense Apr 25 sprint.

### 5.5 O(N) Webhook Lookup → O(1) Index

> `6f2fe97` — "feat: replace **O(N) full-table scan** with **O(1) index lookup** for getUserByItemId using a new MonetPlaidItemIndex DynamoDB table."

Clear scaling win discovered when Plaid webhooks needed to resolve users by `item_id`.

### 5.6 RankedSpend Category Collision Bug

Sequence on May 31:
1. `3adb688` — quarterly rotating bonus categories added
2. `ef0a0a4` — **revert Zolve rewards** to 5%/3% RankedSpend (card data was wrong)
3. `69b8b48` — **fix: prevent RankedSpend cards from claiming categories already covered by RotatingCategory or CategorySpecial bonuses**
4. `88dfb58` — centralize into `claimedCategories` utility

**Lesson:** Complex reward types (RotatingCategory, CategorySpecial, RankedSpend) interact; category "claiming" needed explicit coordination logic.

### 5.7 Security Review-Driven Changes

> `c0bf3ae` — "refactor: **opus 4.8 review Backend fixes applied Critical / Security serverless.yml**"

External AI security review triggered 28-file hardening pass — webhook validation, IAM scoping, logging redaction.

### 5.8 Gemini → Bedrock Pivot

> `5cbd76f` — "remove gemini package"  
> `0dd07e4` — "feat: integrate **AWS Bedrock** to perform AI-based fallback categorization"

Stuck with AWS-native AI after experimenting with Google Gemini.

### 5.9 Infrastructure Gotchas

> `0a4f9ec` — "fix: move SNS email subscription to **standalone resource to prevent deletion on stack updates**"

> `7865a57` — "fix: grant **dynamodb index access permissions** to serverless functions"

> `d5d15cf` — "fix: add **BatchGetItem permission** and deduplicate transaction removal IDs"

Serverless IAM permissions and CloudFormation lifecycle issues discovered in production-like deploys.

### 5.10 Incremental → Full-Window Cache Strategy

> `7818006` — "refactor: simplify insights sync logic by **removing incremental transaction merging** in favor of full-window cache hits"

**Lesson:** Incremental cache merging added complexity; a full 180-day recompute on cache miss was simpler and correct.

---

## 6. Narrative Arc (Blog Summary)

**Act I — "Can the backend categorize a merchant?" (Jan–Feb)**  
A solo developer bootstraps a Node.js categorize API, migrates to TypeScript, and pulls the entire brand-categorization brain trust out of the iOS app into a shared backend with DynamoDB.

**Act II — "Should we use Plaid?" (Mar–Apr)**  
Plaid gets wired up, ripped out, and rebuilt. April becomes a 55-commit sprint: modular Express routes, AWS Lambda deployment, JWT auth, webhooks, insights caching, repository pattern, and Vitest tests — transforming a prototype into a deployable service in ~6 days of intense coding.

**Act III — "Make the optimizer smart" (May)**  
The recommendation engine gains state-aware optimization, RankedSpend logic, Bilt 2.0 modeling, Bedrock AI for unknown merchants, spend-cap tracking, and quarterly rotating categories. The final week is a beta-readiness blitz: rate limiting, guest mode, Apple Sign-In, security patches, and observability.

**Headline stats for the blog:**
- **137 commits in 127 days** by a single author
- **0 → 31,864 tracked lines** (12K TypeScript)
- **84% of commits** happened in the last 2 months (Apr–May)
- **No releases tagged** — continuous deployment mindset

---

## Chart Data (JSON)

```json
{
  "commitsPerMonth": [
    {
      "month": "2026-01",
      "count": 7
    },
    {
      "month": "2026-02",
      "count": 9
    },
    {
      "month": "2026-03",
      "count": 6
    },
    {
      "month": "2026-04",
      "count": 55
    },
    {
      "month": "2026-05",
      "count": 60
    }
  ],
  "commitsPerWeek": [
    {
      "week": "2026-W03",
      "count": 4
    },
    {
      "week": "2026-W04",
      "count": 3
    },
    {
      "week": "2026-W05",
      "count": 4
    },
    {
      "week": "2026-W08",
      "count": 5
    },
    {
      "week": "2026-W09",
      "count": 3
    },
    {
      "week": "2026-W10",
      "count": 3
    },
    {
      "week": "2026-W13",
      "count": 1
    },
    {
      "week": "2026-W15",
      "count": 3
    },
    {
      "week": "2026-W16",
      "count": 15
    },
    {
      "week": "2026-W17",
      "count": 36
    },
    {
      "week": "2026-W18",
      "count": 13
    },
    {
      "week": "2026-W21",
      "count": 47
    }
  ],
  "cumulativeLocOverTime": [
    {
      "date": "2026-01-28",
      "cumulativeNetLines": 1161
    },
    {
      "date": "2026-02-24",
      "cumulativeNetLines": 5458
    },
    {
      "date": "2026-03-09",
      "cumulativeNetLines": 5869
    },
    {
      "date": "2026-04-29",
      "cumulativeNetLines": 14813
    },
    {
      "date": "2026-05-31",
      "cumulativeNetLines": 31864
    }
  ],
  "additionsVsDeletionsPerMonth": [
    {
      "month": "2026-01",
      "additions": 1306,
      "deletions": 145,
      "net": 1161
    },
    {
      "month": "2026-02",
      "additions": 5188,
      "deletions": 891,
      "net": 4297
    },
    {
      "month": "2026-03",
      "additions": 426,
      "deletions": 15,
      "net": 411
    },
    {
      "month": "2026-04",
      "additions": 13819,
      "deletions": 4875,
      "net": 8944
    },
    {
      "month": "2026-05",
      "additions": 20422,
      "deletions": 3371,
      "net": 17051
    }
  ],
  "cumulativeCommitsOverTime": [
    {
      "date": "2026-01-24",
      "cumulativeCommits": 4
    },
    {
      "date": "2026-01-28",
      "cumulativeCommits": 7
    },
    {
      "date": "2026-02-07",
      "cumulativeCommits": 11
    },
    {
      "date": "2026-02-23",
      "cumulativeCommits": 12
    },
    {
      "date": "2026-02-24",
      "cumulativeCommits": 16
    },
    {
      "date": "2026-03-05",
      "cumulativeCommits": 19
    },
    {
      "date": "2026-03-09",
      "cumulativeCommits": 22
    },
    {
      "date": "2026-04-04",
      "cumulativeCommits": 23
    },
    {
      "date": "2026-04-15",
      "cumulativeCommits": 26
    },
    {
      "date": "2026-04-24",
      "cumulativeCommits": 30
    },
    {
      "date": "2026-04-25",
      "cumulativeCommits": 38
    },
    {
      "date": "2026-04-26",
      "cumulativeCommits": 41
    },
    {
      "date": "2026-04-27",
      "cumulativeCommits": 56
    },
    {
      "date": "2026-04-28",
      "cumulativeCommits": 66
    },
    {
      "date": "2026-04-29",
      "cumulativeCommits": 77
    },
    {
      "date": "2026-05-05",
      "cumulativeCommits": 78
    },
    {
      "date": "2026-05-07",
      "cumulativeCommits": 81
    },
    {
      "date": "2026-05-08",
      "cumulativeCommits": 83
    },
    {
      "date": "2026-05-09",
      "cumulativeCommits": 87
    },
    {
      "date": "2026-05-10",
      "cumulativeCommits": 90
    },
    {
      "date": "2026-05-27",
      "cumulativeCommits": 95
    },
    {
      "date": "2026-05-28",
      "cumulativeCommits": 105
    },
    {
      "date": "2026-05-29",
      "cumulativeCommits": 116
    },
    {
      "date": "2026-05-30",
      "cumulativeCommits": 121
    },
    {
      "date": "2026-05-31",
      "cumulativeCommits": 137
    }
  ],
  "locByLanguage": [
    {
      "extension": "ts",
      "language": "TypeScript",
      "lines": 12057
    },
    {
      "extension": "md",
      "language": "Markdown",
      "lines": 10421
    },
    {
      "extension": "json",
      "language": "JSON",
      "lines": 8295
    },
    {
      "extension": "yml",
      "language": "YAML",
      "lines": 469
    },
    {
      "extension": "sh",
      "language": "Shell",
      "lines": 250
    },
    {
      "extension": "js",
      "language": "JavaScript",
      "lines": 218
    },
    {
      "extension": "yaml",
      "language": "YAML",
      "lines": 57
    },
    {
      "extension": "py",
      "language": "Python",
      "lines": 49
    },
    {
      "extension": "gitignore",
      "language": "gitignore",
      "lines": 20
    },
    {
      "extension": "example",
      "language": "example",
      "lines": 17
    },
    {
      "extension": "prettierrc",
      "language": "prettierrc",
      "lines": 11
    }
  ]
}
```
