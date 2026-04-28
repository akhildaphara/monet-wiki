The [[Croe-Backend]] is the backend server for the [[Monet-App-Overview]] application. Built using Node.js and Express in TypeScript, it is responsible for providing all backend logic, serving APIs to the [[Monet-iOS-App]], handling user authentication via Google Auth, managing data persistence through [[Database-Schema]] in AWS DynamoDB, and powering the [[Plaid-Integration]] pipeline for transaction sync, webhook processing, and spending insights.

## Tech Stack
- **Language**: TypeScript (CommonJS / CJS)
- **Runtime**: Node.js 20
- **Framework**: Express.js
- **Deployment**: Serverless Framework (AWS Lambda)
- **Database**: AWS DynamoDB (via `@aws-sdk/client-dynamodb` and `@aws-sdk/lib-dynamodb`)
- **Authentication**: Google Auth Library (`google-auth-library`) & JWT Authorizer
- **External APIs**: Google Places API (merchant categorization), Plaid API (bank account linking & transaction sync)
- **Linting**: ESLint

## Infrastructure
- **AWS Profile**: Always use `--profile dev` for CLI operations.
- **Region**: `us-east-1` (default).
- **Deployment**: Managed via `serverless.yml` with scoped IAM permissions for Lambda functions.

## Architecture & Modules

The codebase is structured as a modular Express application designed for Lambda execution:

### Entry Point
- `src/index.ts`: Local development entry point. Performs a DynamoDB health check and starts the Express server on `0.0.0.0:3000`.
- `src/app.ts`: Constructs the Express application. Mounts global JSON parsing, the [[#Middleware|logging middleware]], the `/v1` API router, a root `/health` endpoint, and a global error handler.
- `serverless.yml`: Defines the Lambda handlers, API Gateway events, and environment-specific configurations.

### Middleware (`src/middleware/`)
- `auth.ts`: Authentication middleware. Verifies the `Authorization: Bearer <token>` header. Supports JWT-based authentication with automatic refresh logic in the [[Monet-iOS-App]].
- `logging.ts`: Request/response logging middleware. Logs method, URL, query params, body, and timestamps. Redacts sensitive tokens (Plaid/Auth) from logs to ensure security.

### API Routes (`src/api/`)
All routes are mounted under the `/v1` prefix via a central `src/api/routes.ts` router that aggregates domain-specific sub-routers:

| Route Group | Module | Key Endpoints |
|---|---|---|
| Auth | `auth/` | `POST /auth/sync` — upserts the user record on login; triggers proactive Plaid sync |
| Cards | `cards/` | `GET /cards`, `POST /cards` — list all supported cards; update user's selected cards |
| Categorize | `categorize/` | `GET /categorize` — categorize a merchant via brand rules or Google Places |
| Health | `health/` | `GET /health` |
| Overrides | `overrides/` | `POST /overrides`, `DELETE /overrides/:merchantId` — manage user category overrides |
| Plaid | `plaid/` | `POST /plaid/sync-transactions` — syncs all Plaid items for a user. See [[Plaid-Integration]] for full breakdown |
| Popular Categories | `popular-categories/` | `GET /popular-categories` — returns pre-computed top categories |
| User | `user/` | `PUT /user/cards`, `PUT /user/settings`, `POST /user/custom-rewards` |

### Core Logic
- `optimizer.ts`: The [[Card-Optimizer]] logic. Supports **dynamic reward structures** allowing users to override specific card multipliers (e.g., Bilt rent tiers).
- `categorizer.ts`: Two-stage merchant categorization: (1) local brand rule engine via `evaluateBrand()`, (2) Google Places API fallback. Now integrates **detailed Plaid categories** for transaction processing.
- `dao.ts`: Data Access Object layer for DynamoDB. Uses atomic `UpdateCommand` for user mutations. Implements AES-256-CBC encryption for Plaid tokens. Manages the `MonetInsightsCache` for pre-computed analytics.

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