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
  - `plaidItems` (List of Objects): Array of connected Plaid bank connections. Each item contains:
    - `accessToken` (String): **AES-256-CBC encrypted** Plaid access token.
    - `itemId` (String): Plaid's unique item identifier.
    - `cursor` (String, optional): Plaid Transactions Sync cursor for incremental syncing.
  - `plaidAccessToken` (String, optional): Legacy single-connection encrypted token (maintained for backward compatibility).
  - `plaidItemId` (String, optional): Legacy single-connection item ID.

### 2. MonetOverrides Table
Stores custom business categorization rules defined by the user. If a user manually overrides a merchant's category in the [[Monet-iOS-App]], it is saved here to bypass the default `categorizer.ts` logic.
- **Primary Key**:
  - Partition Key: `userId` (String) — To fetch all overrides for a specific user.
  - Sort Key: `merchantId` (String) — The lowercased business name.
- **Attributes**:
  - `category` (String): The custom `Category` enum value the user assigned to the merchant.

### 3. MonetTransactions Table
Stores Plaid transaction records synced via the Transactions Sync API and webhooks. The [[Croe-Backend]] reads from this table (not the live Plaid API) when computing [[Plaid-Integration|spending insights]].
- **Primary Key**:
  - Partition Key: `userId` (String) — To fetch all transactions for a specific user.
  - Sort Key: `transactionId` (String) — Plaid's unique transaction identifier.
- **Attributes**:
  - `accountId` (String): The Plaid account the transaction belongs to.
  - `amount` (Number): Transaction amount.
  - `date` (String): Transaction date in `YYYY-MM-DD` format.
  - `name` (String): Transaction description from the bank.
  - `merchantName` (String, nullable): Cleaned merchant name from Plaid.
  - `category` (String Array, nullable): Plaid's legacy category classification.
  - `primaryPersonalFinanceCategory` (String, nullable): Plaid's primary personal finance category (used by `plaidCategoryMap.ts` for mapping to internal categories).

## Security
- Plaid access tokens are encrypted at rest using **AES-256-CBC** encryption via the `PLAID_ENCRYPTION_KEY` environment variable. Tokens are encrypted before DynamoDB writes and decrypted transparently after reads. Legacy unencrypted tokens are handled via a fallback check in `decryptToken()`.
- Batch writes to the Transactions table respect DynamoDB's 25-item-per-request limit.
