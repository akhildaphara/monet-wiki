# Plaid Integration

> **Status: Active & Mature** — The Plaid integration is fully implemented across the iOS frontend (`MonetApp`), the Node.js backend (`croe`), and the DynamoDB data layer.

Plaid enables automatic bank account sync: users link their banks via the Plaid Link in-app OAuth flow, and the backend pulls real transactions (via the Transactions Sync API and webhooks), maps them to wallet cards, and computes spending insights including actual vs. optimal rewards earnings per category and globally. The integration supports multiple bank connections per user, encrypted access token storage, and a dedicated connection management UI.

---

## Current Architecture

### Backend (TypeScript) — `raw/croe`

#### Plaid Client
- `src/plaid.ts`: Initializes the `PlaidApi` client using `PLAID_CLIENT_ID`, `PLAID_SECRET`, and `PLAID_ENV` environment variables.

#### API Routes (`src/api/plaid/`)
All routes are mounted under `/v1/plaid`. Authenticated routes use the `authenticateUser` middleware.

| Endpoint | Auth | Description |
|---|---|---|
| `POST /plaid/webhook` | Public | Receives Plaid webhook events. On `TRANSACTIONS.SYNC_UPDATES_AVAILABLE`, `INITIAL_UPDATE`, `HISTORICAL_UPDATE`, or `DEFAULT_UPDATE`, triggers background transaction sync for the affected item. |
| `POST /plaid/create_link_token` | ✅ | Creates a Plaid Link token. Supports `updateItemId` for re-authentication flows. |
| `POST /plaid/exchange_public_token` | ✅ | Exchanges the Plaid `public_token` for an `access_token`, stores it encrypted in DynamoDB, and triggers initial transaction sync. |
| `DELETE /plaid/connection/:itemId` | ✅ | Removes a Plaid item from the user's account and cleans up legacy fields. |
| `GET /plaid/institutions/:id` | ✅ | Fetches institution details (name, logo) from Plaid's API. |
| `GET /plaid/status` | ✅ | Returns a list of the user's connected Plaid item IDs. |
| `GET /plaid/accounts` | ✅ | Fetches all accounts across all connected items, enriched with institution names. Returns `409` with `ITEM_LOGIN_REQUIRED` if a connection needs re-authentication. |
| `GET /plaid/transactions` | ✅ | Returns stored transactions from DynamoDB (not live Plaid API). |
| `POST /plaid/insights/sync` | ✅ | Computes spending insights from stored transactions. See [[#Insights Engine]] below. |

#### Transaction Sync (`src/api/plaid/utils.ts`)
- Uses the **Plaid Transactions Sync API** (`/transactions/sync`) with cursor-based incremental syncing.
- Background sync is triggered by webhooks or initial token exchange — the frontend never blocks on Plaid's API.
- Transactions are stored in the `MonetTransactions` DynamoDB table.
- Cursors are persisted per-item in the user's `plaidItems` array.

#### Plaid Category Mapping (`src/resources/plaidCategoryMap.ts`)
Maps Plaid's `primaryPersonalFinanceCategory` to the internal `Category` enum:
- `FOOD_AND_DRINK` → Dining, `GROCERIES` → Grocery, `GAS_STATIONS` → Gas, `TRAVEL` → Travel, etc.
- High-value merchant name overrides for: Uber, Lyft, Amazon, Whole Foods, streaming services (Netflix/Spotify/Hulu/Disney+), wholesale clubs (Costco/Sam's Club).

#### Token Encryption (`src/dao.ts`)
- All Plaid `access_token`s are encrypted at rest using **AES-256-CBC** with a configurable `PLAID_ENCRYPTION_KEY`.
- Encryption/decryption is transparent — tokens are encrypted before DynamoDB writes and decrypted after reads.
- Legacy unencrypted tokens are handled gracefully via a fallback check.

### Insights Engine

The `POST /v1/plaid/insights/sync` endpoint accepts `plaidCardMappings` (mapping Plaid account IDs to user card IDs), `selectedCardIds`, and an optional `days` parameter (default: 30).

It computes:
1. **Actual Earnings**: Cashback earned based on the card the user *actually used* (per the mapping).
2. **Wallet Optimal Earnings**: What they *could have earned* using the best card in their current wallet.
3. **Global Optimal Earnings**: What the best card *across all supported cards* would have earned.
4. **Missed Earnings**: `walletOptimalEarnings - actualEarnings`.
5. **Suggested Card**: Iterates all cards the user doesn't own, ranks them by incremental value over actual earnings, and suggests the single best card to add.
6. **Per-Category Breakdown**: Spend, actual, optimal, and best card per category.

### iOS (Swift) — `raw/Monet`

#### Views
- **`PlaidLinkView.swift`**: `UIViewControllerRepresentable` wrapping Plaid's `LinkViewController`. Supports both new connections and update-mode re-authentication (via `updateItemId`).
- **`BankConnectionsView.swift`**: Dedicated connection management UI. Lists connected items grouped by institution. Each item expands to show accounts with Picker-based card mapping. Auto-suggests mappings by matching Plaid account last-4 mask to card masks. Shows broken connection warnings with "Fix Now" buttons. Supports adding new banks and disconnecting existing ones.
- **`InsightsView.swift`**: Rich analytics dashboard using Swift Charts. Features:
  - Configurable time range (30d / 90d / 180d) via toolbar capsule buttons
  - Actual vs. Wallet Best vs. Global Best bar chart
  - "Top Recommendation" card with apply link
  - Per-category breakdown with stacked progress bars
  - Auto-refresh on card changes, mapping changes, and account refreshes via `NotificationCenter`

#### Services
- **`InsightsManager.swift`**: `@ObservableObject` owning the insights lifecycle. Persists `plaidCardMappings` in `@AppStorage`. Handles `ITEM_LOGIN_REQUIRED` errors with user-facing guidance.
- **`APIClient.swift`**: Network methods for all Plaid endpoints.

---

## Previous Improvement Plan — Status

| Phase | Item | Status |
|---|---|---|
| 1 | Token Encryption (AES-256) | ✅ Implemented |
| 1 | Transactions Sync API & Webhooks | ✅ Implemented |
| 1 | Decouple Insights from live Plaid API | ✅ Implemented (reads from DynamoDB) |
| 2 | BankConnectionsView | ✅ Implemented |
| 2 | Smooth re-authentication (update mode) | ✅ Implemented |
| 2 | Multi-institution support | ✅ Implemented |
| 3 | Swift Charts adoption | ✅ Implemented |
| 3 | Account mapping UI with auto-suggest | ✅ Implemented (mask matching) |
| 3 | Historical timeline chart | ❌ Not yet implemented |

---

## Sandbox Testing Credentials
- **Institution**: Tartan Bank
- **Username**: `user_good`
- **Password**: `pass_good`