The [[Database-Schema]] for the [[Monet-App-Overview]] application is implemented using AWS DynamoDB, managed via the `dao.ts` and `db.ts` files in the [[Croe-Backend]].

## Setup and Environments
The database operates in two modes:
- **Local Development**: Uses a local DynamoDB instance running on `http://127.0.0.1:8000`, initialized via the `init-db.ts` script.
- **Production**: Uses AWS DynamoDB in the `us-east-1` region.

## Tables and Data Models

### 1. Users Table
Stores information about the app's users, their preferences, and integration tokens.
- **Primary Key**: `id` (String) - Mapped to the user's Google Auth `sub` identifier.
- **Attributes**:
  - `selectedCardIds` (String Array): The credit cards the user has added to their wallet.
  - `showGlobalBestCard` (Boolean): User preference toggle.
  - `plaidAccessToken` (String, Optional): The access token to pull Plaid transactions.
  - `plaidItemId` (String, Optional): The associated Plaid item identifier.

### 2. Overrides Table
Stores custom business categorization rules defined by the user. If a user manually overrides a merchant's category in the [[Monet-iOS-App]], it is saved here to bypass the default `categorizer.ts` logic.
- **Primary Key**:
  - Partition Key: `userId` (String) - To fetch all overrides for a specific user.
  - Sort Key: `merchantId` (String) - The lowercased business name.
- **Attributes**:
  - `category` (String): The custom `Category` enum value the user assigned to the merchant.

### 3. Transactions
While transaction fetching logic is present in the Plaid layer, transactions and synced cursor data are also persisted (as seen with `getTransactions`, `putTransactions`, and `MonetTransaction` references in `dao.ts`) to avoid re-fetching historical data unnecessarily.