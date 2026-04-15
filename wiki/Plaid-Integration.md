# Plaid Integration

> **Status: Removed** — Stripped out April 2026. Too complex for current production stage. Full record kept here for future re-implementation.

Plaid was integrated to enable automatic bank account sync: users could link their bank via the Plaid Link in-app OAuth flow, and the app would pull real transactions, map them to wallet cards, and compute insights (actual vs. optimal rewards earnings per category and globally).

---

## Architecture

### iOS (Swift) — `raw/Monet`

#### Dependency
- **LinkKit** (Plaid's iOS SDK) — added via Swift Package Manager  
  `https://github.com/plaid/plaid-link-ios`  
  Import: `import LinkKit`

#### Files Modified / Deleted
| File | Status | Role |
|------|--------|------|
| `MonetApp/Services/APIClient.swift` | Modified | Plaid API call methods + response models |
| `MonetApp/Views/CardWalletView.swift` | Modified | Bank Connections section + account↔card mapper |
| `MonetApp/Views/CardDetailsView.swift` | Modified | Recent transactions list per card |
| `MonetApp/Views/PlaidLinkView.swift` | **Deleted** | `UIViewControllerRepresentable` wrapping Plaid's `LinkViewController` |
| `MonetApp/Views/InsightsView.swift` | **Deleted** | Full insights dashboard tab |
| `MonetApp/Views/RootTabView.swift` | Modified | Removed "Insights" tab (sparkles icon) |
| `MonetApp/Services/InsightsManager.swift` | **Deleted** | `@Observable` class managing insights state |

---

#### `APIClient.swift` — Plaid Methods

```swift
func createPlaidLinkToken() async throws -> String
// POST /plaid/create_link_token → returns link_token

func exchangePlaidPublicToken(publicToken: String) async throws
// POST /plaid/exchange_public_token { public_token }

func checkPlaidStatus() async throws -> Bool
// GET /plaid/status → { connected: Bool, item_id: String? }

func fetchPlaidAccounts() async throws -> [PlaidAccount]
// GET /plaid/accounts → { accounts: [PlaidAccount] }

func fetchPlaidTransactions(accountId: String) async throws -> [PlaidTransaction]
// GET /plaid/transactions?account_id=<id>

func fetchInsights(plaidCardMappings: [String: String], selectedCardIds: [String]) async throws -> InsightsSummaryResponse
// POST /plaid/insights/sync { plaidCardMappings, selectedCardIds }
```

#### Plaid Models (were in `APIClient.swift`)
```swift
struct PlaidLinkTokenResponse: Codable { let link_token: String }
struct PlaidStatusResponse: Codable { let connected: Bool; let item_id: String? }
struct PlaidAccount: Codable, Identifiable {
    let id, name, type: String
    let officialName, mask, subtype: String?
    let balance, availableBalance, limit: Double?
}
struct PlaidTransaction: Codable, Identifiable {
    let id, accountId, date, name: String
    let amount: Double
    let merchantName: String?
    let category: [String]?
    let primaryPersonalFinanceCategory: String?
}
```

#### `CardWalletView.swift` — State Added
```swift
@AppStorage("plaidCardMappings") private var plaidCardMappingsData: Data = Data()
// Maps Plaid account ID → Monet SupportedCard ID

@State private var showPlaidLink = false
@State private var plaidLinkToken: String?
@AppStorage("plaidConnected") private var isPlaidConnected: Bool = false
@State private var plaidAccounts: [PlaidAccount] = []
@State private var isLoadingPlaidAccounts = false
```

`CardWalletView` had a **"Bank Connections"** List section showing:
- A row with a "Link" button (if not connected) or "Bank Connected" status
- Per-account rows (name, last-4 mask, balance) each with a `Picker` to map the Plaid account to a wallet card

On connect success, `isPlaidConnected = true` triggered `fetchAccounts()`, which also used `ScrollViewReader { scrollProxy in }` to scroll to the newly-loaded accounts.

#### `PlaidLinkView.swift` (deleted)
`UIViewControllerRepresentable` wrapping `PLKPlaidLink`. Presented as a `.sheet`. Callbacks:
- `onSuccess: (LinkSuccess) -> Void` — exchanges the public token
- `onExit: (LinkExit?) -> Void` — dismisses sheet on user exit/error

#### `InsightsView.swift` + `InsightsManager.swift` (deleted)
Full "Insights" tab showing:
- Total 30-day spend, actual earnings, optimal earnings, missed earnings
- Per-category breakdown (spend / actual / optimal / missed / best card)
- Global card recommendations (cards not in wallet that would earn more)

Relied on `POST /plaid/insights/sync` with `plaidCardMappings` and `selectedCardIds`.

---

### Backend (TypeScript) — `raw/croe`

#### Dependency
- **`plaid`** npm package — removed from `package.json`

#### Files Modified / Deleted
| File | Status | Role |
|------|--------|------|
| `src/plaid.ts` | **Deleted** | Plaid client singleton |
| `src/index.ts` | Modified | 5 Plaid route handlers removed |
| `src/dao.ts` | Modified | `plaidAccessToken` + `plaidItemId` fields removed from `UserContext` |

#### `src/plaid.ts` (deleted)
```typescript
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
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

#### Backend Routes (removed from `src/index.ts`)
| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/v1/plaid/create_link_token` | Creates Plaid `link_token` for iOS SDK |
| `POST` | `/v1/plaid/exchange_public_token` | Exchanges public token → stores `access_token` + `item_id` in DynamoDB |
| `GET`  | `/v1/plaid/status` | Returns `{ connected, item_id }` |
| `GET`  | `/v1/plaid/accounts` | Fetches accounts via `plaidClient.accountsGet` |
| `GET`  | `/v1/plaid/transactions` | Fetches + caches 30-day transactions to DynamoDB |
| `POST` | `/v1/plaid/insights/sync` | Computes full InsightsSummary server-side |

#### `src/dao.ts` — Fields Removed
```typescript
interface UserContext {
  plaidAccessToken?: string | null;
  plaidItemId?: string | null;
}
```

#### Environment Variables (needed when re-enabling)
```
PLAID_CLIENT_ID=
PLAID_SECRET=
PLAID_ENV=sandbox   # or development / production
```

#### Insights Computation Logic (`/plaid/insights/sync`)
1. Fetches + caches transactions (30-day window, up to 500 per call)
2. Maps Plaid `primaryPersonalFinanceCategory` → Monet `Category` enum
3. Name-based fallback matching for Uber, Lyft, Amazon, Whole Foods
4. Groups spend by category — computes actual (using `plaidCardMappings`) vs. optimal (best card in wallet)
5. Generates global recommendations: cards NOT in wallet that earn ≥3% in high-spend categories

---

## Re-enabling Checklist

When ready to bring Plaid back:

1. **Backend**: `npm install plaid` in `raw/croe`
2. **Backend**: Restore `src/plaid.ts`
3. **Backend**: Restore the 5 route handlers in `src/index.ts`
4. **Backend**: Re-add `plaidAccessToken` + `plaidItemId` to `UserContext` in `dao.ts`
5. **Backend**: Add env vars `PLAID_CLIENT_ID`, `PLAID_SECRET`, `PLAID_ENV`
6. **iOS**: Add LinkKit via SPM (`https://github.com/plaid/plaid-link-ios`)
7. **iOS**: Restore `PlaidLinkView.swift`, `InsightsView.swift`, `InsightsManager.swift`
8. **iOS**: Restore Plaid state vars + Bank Connections section in `CardWalletView.swift` (re-add `ScrollViewReader` for scroll-to-account)
9. **iOS**: Restore transaction list section in `CardDetailsView.swift`
10. **iOS**: Re-add Insights tab in `RootTabView.swift`
11. **iOS**: Restore Plaid API methods + response models in `APIClient.swift`
12. **Plaid Dashboard**: Register redirect URI (OAuth), set allowed products (`auth`, `transactions`)

---

## Related Topics
- [[card-wallet]] — CardWalletView, card management
- [[croe-backend]] — Backend architecture