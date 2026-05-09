# Plaid Integration

> **Status: Active & Mature** — The Plaid integration is fully implemented across the iOS frontend (`swift-app`), the Node.js backend (`croe`), and the DynamoDB data layer.

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
| `POST /plaid/webhook` | Public | Receives Plaid webhook events. Triggers background sync for affected items. |
| `POST /plaid/sync-transactions` | ✅ | Explicitly triggers a sync for all of a user's Plaid items. |
| `POST /plaid/create_link_token` | ✅ | Creates a Plaid Link token. Supports OAuth and update mode. |
| `POST /plaid/exchange_public_token` | ✅ | Exchanges `public_token`, stores encrypted `access_token`, and triggers proactive sync. |
| `DELETE /plaid/connection/:itemId` | ✅ | Removes a Plaid item and cleans up associated data. |
| `GET /plaid/accounts` | ✅ | Fetches all accounts across connected items. |
| `GET /plaid/insights` | ✅ | Returns pre-computed or on-demand spending insights. |

#### Transaction Sync (`src/api/plaid/utils.ts`)
- Uses the **Plaid Transactions Sync API** (`/transactions/sync`) with cursor-based incremental syncing.
- **Unified Table**: All transactions are stored in a unified `MonetTransactions` table.
- **180-Day Filter**: Only transactions from the last 180 days are ingested and processed.
- **Proactive Sync**: Triggered on token exchange and during user login (`/auth/sync`) to ensure data is fresh.
- Transactions are stored in the `MonetTransactions` DynamoDB table.

#### Plaid Category Mapping (`src/resources/plaidCategoryMap.ts`)
- Maps Plaid's `primaryPersonalFinanceCategory` to internal categories.
- Integrates **detailed Plaid categories** for more granular mapping.
- High-value merchant name overrides for: Uber, Lyft, Amazon, Whole Foods, streaming services, wholesale clubs.

#### Token Encryption (`src/dao.ts`)
- All Plaid `access_token`s are encrypted at rest using **AES-256-CBC**.
- Redacts sensitive tokens from logs to prevent exposure.

### Insights Engine

The insights engine computes spending analytics using stored transactions:
1. **Caching**: Results are cached in the `MonetInsightsCache` DynamoDB table (24h TTL) and locally in the iOS app.
2. **Metadata**: Includes a `computedAt` timestamp to inform the user of data freshness.
3. **Computation**:
   - **Actual Earnings**: Based on real transaction data and user-defined card mappings.
   - **Wallet Optimal Earnings**: Best possible earnings with current wallet.
   - **Global Optimal Earnings**: Best possible earnings across all supported cards.
   - **Suggested Card**: Ranks new cards by incremental value over actual earnings.
   - **Per-Category Breakdown**: Spend, actual, and optimal per category.

### iOS (Swift) — `raw/swift-app`

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