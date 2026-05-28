# ADR-0004: Integrate Plaid Transactions Sync API for Bank Connectivity

* **Status**: Accepted (Retroactive)
* **Date**: 2026-05-27
* **Deciders**: AI Agent, Akhil Daphara

## Context and Problem Statement

To provide automated and accurate credit card rewards optimization, Monet needs continuous, secure access to user transaction histories across their various credit card and bank accounts. 

We need a reliable aggregator that supports major banks, handles multi-factor authentication (MFA) seamlessly, secures sensitive financial data, and provides an incremental transaction sync mechanism. Polling a bank's ledger iteratively is inefficient, resource-intensive, and prone to race conditions.

## Decision Drivers

* **Reliability and Bank Coverage**: High support rate and stable connections for top credit-card-issuing banks (Chase, Amex, Citi, Capital One).
* **Developer Integration**: Snappy Link UI components for the iOS frontend and a robust backend SDK.
* **Security & Compliance**: Secure storage of banking credentials and token encryption.
* **Efficient Ingestion**: Ability to incrementally fetch transaction additions, modifications, and deletions without re-downloading entire historic files.

## Considered Options

1. **Option 1: Legacy Plaid Transactions Pull API (`/transactions/get`)**
2. **Option 2: Modern Plaid Transactions Sync API (`/transactions/sync`)**
3. **Option 3: Yodlee or Finicity integration**

## Decision Outcome

Chosen Option: **Option 2: Modern Plaid Transactions Sync API (`/transactions/sync`)** using Plaid as our financial data provider.

Instead of the legacy `/transactions/get` endpoint (which requires continuous date polling and is highly vulnerable to sync misses), we adopted the `/transactions/sync` cursor-based API. This endpoint treats transaction ingestion as a logical stream: it provides a stateful `cursor` that we pass on subsequent requests to receive exactly what has been added, modified, or deleted since the last sync.

### Implementation Specifics
- **Link Token Exchange**: Users connect their accounts via Plaid Link in the `swift-app` client. The public token is exchanged backend-side for an `access_token`.
- **Token Security**: All Plaid `access_token`s are encrypted at rest using **AES-256-CBC** (implemented in `src/dao.ts`) before being stored in the `MonetUsers` table inside DynamoDB.
- **Incremental Cursor Sync**: We persist the unique `cursor` returned by Plaid in the user's item list. Future updates simply request modifications relative to this cursor.
- **Sync Triggering**: Incremental sync is triggered proactively on user login (`/auth/sync`), on token exchange, or in the background upon receiving an AWS Lambda webhook callback from Plaid on our public endpoint (`POST /plaid/webhook`).
- **Data Pruning**: To save database costs and keep insights computational times bounded, we apply a strict **180-day retention filter**; only transactions from the last 180 days are stored or processed.

## Consequences

* **Good**: State-aware syncing ensures high data integrity (handles transaction removals, updates, and pending transactions perfectly).
* **Good**: Greatly reduced network overhead compared to date-range polling.
* **Good**: Access tokens are never stored as plain text, reducing security risks.
* **Bad**: Dependent on Plaid's availability and pricing tiers.
* **Bad**: Complex custom categorization mapping (`src/resources/plaidCategoryMap.ts`) is required to clean Plaid's general personal finance categories and align them with Monet's granular reward-multiplier categories (such as specific dining, grocery, or travel categories).
