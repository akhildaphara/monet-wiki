The [[Database-Schema]] for the [[Monet-App-Overview]] application is implemented using AWS DynamoDB, managed via the `dao.ts` and `db.ts` files in the [[Croe-Backend]].

## Setup and Environments
The database operates in two modes:
- **Local Development**: Uses a local DynamoDB instance running on `http://127.0.0.1:8000`, initialized via the `init-db.ts` script (`npm run init-db`).
- **Production**: Uses AWS DynamoDB in the `us-east-1` region.

## Tables and Data Models

### 1. MonetUsers Table
Stores information about the app's users, their preferences, and Plaid integration data. Updates to this table (e.g., toggling cards or preferences) are performed using atomic DynamoDB `UpdateCommand` expressions to prevent read-modify-write race conditions.
- **Primary Key**: `id` (String) — Mapped to the user's Google Auth `sub` identifier.
- **Attributes**:
  - `selectedCardIds` (String Array): The credit cards the user has added to their wallet.
  - `showGlobalBestCard` (Boolean): User preference toggle.
  - `customCardRewards` (Map): User-defined reward-rate overrides keyed by `cardId -> category -> rate`.
  - `plaidItems` (List of Objects): Array of connected Plaid bank connections. Each item contains:
    - `accessToken` (String): **AES-256-CBC encrypted** Plaid access token.
    - `itemId` (String): Plaid's unique item identifier.
    - `cursor` (String, optional): Plaid Transactions Sync cursor for incremental syncing.

### 2. MonetOverrides Table
Stores custom business categorization rules defined by the user. If a user manually overrides a merchant's category in the [[Monet-iOS-App]], it is saved here to bypass the default `categorizer.ts` logic.
- **Primary Key**:
  - Partition Key: `userId` (String) — To fetch all overrides for a specific user.
  - Sort Key: `merchantId` (String) — The lowercased business name.
- **Attributes**:
  - `category` (String): The custom `Category` enum value the user assigned to the merchant.

### 3. MonetTransactions Table
Stores Plaid transaction records synced via the Transactions Sync API and webhooks. This is a **unified table** storing all transactions across all connected accounts for a user.
- **Primary Key**:
  - Partition Key: `userId` (String)
  - Sort Key: `transactionId` (String)
- **Attributes**:
  - `accountId` (String)
  - `amount` (Number)
  - `date` (String): `YYYY-MM-DD`
  - `name` (String): Transaction description
  - `merchantName` (String, nullable)
  - `primaryPersonalFinanceCategory` (String, nullable): Used for category mapping.
  - `computedAt` (Number, optional): Timestamp of when the transaction was last processed.

### 4. MonetInsightsCache Table
Stores pre-computed spending insights to optimize performance and reduce redundant calculations.
- **Primary Key**:
  - Partition Key: `userId` (String)
  - Sort Key: `cacheKey` (String): A hash of the user's wallet state, card mappings, and selected time range.
- **Attributes**:
  - `data` (Map): The serialized insights result (summary, category breakdowns).
  - `computedAt` (Number): ISO timestamp of computation.
  - `ttl` (Number): DynamoDB TTL (24 hours from computation).

## Security
- Plaid access tokens are encrypted at rest using **AES-256-CBC**.
- Sensitive tokens are redacted from application logs.
- AWS Lambda functions run with scoped IAM permissions, limited to the specific DynamoDB tables and external APIs required.
