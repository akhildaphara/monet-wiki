The [[Croe-Backend]] is the backend server for the [[Monet-App-Overview]] application. Built using Node.js and Express in TypeScript, it is responsible for providing all backend logic, serving APIs to the [[Monet-iOS-App]], handling user authentication via Google Auth, managing data persistence through [[Database-Schema]] in AWS DynamoDB, and powering the [[Plaid-Integration]] pipeline for transaction sync, webhook processing, and spending insights.

## Tech Stack
- **Language**: TypeScript (NodeNext Module Resolution)
- **Framework**: Express.js
- **Database**: AWS DynamoDB (via `@aws-sdk/client-dynamodb` and `@aws-sdk/lib-dynamodb`)
- **Authentication**: Google Auth Library (`google-auth-library`)
- **External APIs**: Google Places API (merchant categorization), Plaid API (bank account linking & transaction sync)
- **Linting**: ESLint

## Architecture & Modules

The codebase was refactored from a monolithic `index.ts` into a modular architecture:

### Entry Point
- `src/index.ts`: Performs a DynamoDB health check on startup (prints helpful recovery instructions if the local DB is unreachable) and starts the Express server on `0.0.0.0:3000`.
- `src/app.ts`: Constructs the Express application. Mounts global JSON parsing, the [[#Middleware|logging middleware]], the `/v1` API router, a root `/health` endpoint, and a global error handler.

### Middleware (`src/middleware/`)
- `auth.ts`: Google OAuth2 token verification middleware (`authenticateUser`). Verifies the `Authorization: Bearer <idToken>` header via `google-auth-library`, extracts the Google `sub` from the payload, and attaches it to `req.userId`.
- `logging.ts`: Request/response logging middleware. Logs method, URL, query params, body, and timestamps for incoming requests. Intercepts `res.json` to log outgoing response data, collapsing large card arrays to prevent terminal flooding.

### API Routes (`src/api/`)
All routes are mounted under the `/v1` prefix via a central `src/api/routes.ts` router that aggregates domain-specific sub-routers:

| Route Group | Module | Key Endpoints |
|---|---|---|
| Auth | `auth/` | `POST /auth/sync` — upserts the user record on login |
| Cards | `cards/` | `GET /cards`, `POST /cards` — list all supported cards; update user's selected cards |
| Categorize | `categorize/` | `GET /categorize?name=...&city=...&state=...` — categorize a merchant |
| Health | `health/` | `GET /health` |
| Overrides | `overrides/` | `POST /overrides`, `DELETE /overrides/:merchantId` — manage user-defined category overrides |
| Plaid | `plaid/` | See [[Plaid-Integration]] for full breakdown |
| Popular Categories | `popular-categories/` | `GET /popular-categories` — returns pre-computed top categories with best cards |
| User | `user/` | `PUT /user/cards`, `PUT /user/settings` |

### Core Logic
- `optimizer.ts`: The [[Card-Optimizer]] logic. `getCashback(cardKey, categoryKey)` returns the effective cashback rate. `findBestCardsForUser()` iterates all categories to find the highest-yielding card per category from the user's wallet.
- `categorizer.ts`: Two-stage merchant categorization: (1) local brand rule engine via `evaluateBrand()` with exact/domain/substring/fuzzy matching, (2) Google Places API fallback via `PlacesService.resolveCategory()`.

### Data Layer
- `dao.ts`: Data Access Object layer for DynamoDB. Uses atomic `UpdateCommand` for user mutations. Implements AES-256-CBC encryption/decryption for Plaid access tokens at rest. See [[Database-Schema]] for details.
- `db.ts`: DynamoDB client initialization with local/production mode switching.

### Resources (`src/resources/`)
- `cardRewardsData.ts`: Static credit card reward multiplier definitions (the `CREDIT_CARDS` and `SUPPORTED_CARDS` arrays).
- `categories.ts`: The `Category` enum and display name mappings.
- `brandCategoryMap.ts`: Local rule engine data mapping ~900+ brand names/domains/substrings to categories.
- `placesService.ts`: Google Places API integration with MCC-to-category bucket mapping.
- `plaidCategoryMap.ts`: Maps Plaid's `primaryPersonalFinanceCategory` values to the internal `Category` enum, with high-value merchant name overrides (Uber, Lyft, Amazon, Whole Foods, streaming services, wholesale clubs).

## Running the Backend
- Development: `npm run dev` → `tsx watch src/index.ts` (hot-reload).
- Database: Local DynamoDB instance on `http://127.0.0.1:8000`, initialized via `npm run init-db`.
- Configurable via `.env` variables (`GOOGLE_CLIENT_ID`, `PLAID_CLIENT_ID`, `PLAID_SECRET`, `PLAID_ENCRYPTION_KEY`, `GOOGLE_PLACES_API_KEY`).