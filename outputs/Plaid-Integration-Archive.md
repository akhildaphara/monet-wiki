# Plaid Integration Archive

The Plaid integration was removed from the codebase to simplify the initial production release. This document serves as a guide on how Plaid was previously integrated and how to restore it when viable.

## Backend (`raw/croe`)

### 1. Dependencies
The `plaid` package was installed via `package.json`:
```json
"dependencies": {
  "plaid": "^41.4.0"
}
```

### 2. Database Schema (`dao.ts`)
The `UserContext` interface included Plaid identifiers:
```typescript
export interface UserContext {
  id: string; // google sub
  selectedCardIds: string[];
  showGlobalBestCard: boolean;
  plaidAccessToken?: string | null;
  plaidItemId?: string | null;
}
```

### 3. Plaid Configuration (`plaid.ts`)
```typescript
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import dotenv from "dotenv";

dotenv.config();

const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV || "sandbox"],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
      "PLAID-SECRET": process.env.PLAID_SECRET,
    },
  },
});

export const plaidClient = new PlaidApi(configuration);
```

### 4. API Endpoints (`index.ts`)
The backend exposed several endpoints to manage Plaid:
- `POST /v1/plaid/create_link_token`: Generated a token to initialize the Plaid Link UI.
- `POST /v1/plaid/exchange_public_token`: Exchanged the client's `public_token` for an `access_token` and saved it to the user.
- `GET /v1/plaid/status`: Checked if the user had a linked Plaid account.
- `GET /v1/plaid/accounts`: Retrieved the user's connected bank and credit card accounts.
- `GET /v1/plaid/transactions`: Retrieved the user's transactions.
- `POST /v1/plaid/insights/sync`: Performed complex analysis on the user's Plaid transactions to calculate actual earnings, optimal earnings, and missed rewards based on their current wallet (`selectedCardIds`) and account mappings (`plaidCardMappings`).

## Frontend (`raw/Monet`)

### 1. Dependencies
The Plaid SDK was included via Swift Package Manager in Xcode:
`https://github.com/plaid/plaid-link-ios`

### 2. UI Components
- **`PlaidLinkView.swift`**: A `UIViewControllerRepresentable` that wrapped the Plaid Link SDK to display the bank linking modal.
- **`InsightsView.swift`**: A dedicated tab that displayed transaction insights, missed rewards, and spending breakdowns using data from the `POST /v1/plaid/insights/sync` endpoint.
- **`InsightsManager.swift`**: An `ObservableObject` that managed fetching and caching the insights data.

### 3. Wallet Integration (`CardWalletView.swift` & `CardDetailsView.swift`)
- `CardWalletView.swift` managed the `isPlaidConnected` state and displayed a "Connect Bank Account" button.
- It also handled mapping Plaid account IDs to Monet's internal credit card IDs using the `@AppStorage("plaidCardMappings")` variable.
- `CardDetailsView.swift` checked if a card was mapped to a Plaid account, and if so, fetched and displayed its recent transactions via the `GET /v1/plaid/transactions?account_id=` endpoint.

### 4. API Client (`APIClient.swift`)
The `APIClient` included functions to communicate with all Plaid backend endpoints and defined the corresponding Codable structs (`PlaidLinkTokenResponse`, `PlaidStatusResponse`, `PlaidAccountsResponse`, `PlaidTransactionsResponse`, and `InsightsSummaryResponse`).

## Restoration Steps
1. Re-add the `plaid` dependency to the Node backend.
2. Restore the `plaid.ts` configuration and `dao.ts` schema fields.
3. Add back the endpoints in `index.ts`.
4. Add the `plaid-link-ios` Swift Package to the Xcode project.
5. Recreate `PlaidLinkView.swift`, `InsightsView.swift`, and `InsightsManager.swift`.
6. Integrate the link button back into `CardWalletView.swift` and transaction list in `CardDetailsView.swift`.
7. Re-add the `Insights` tab to `RootTabView.swift`.