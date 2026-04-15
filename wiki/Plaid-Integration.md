The [[Plaid-Integration]] in the [[Monet-App-Overview]] application allows users to securely link their bank accounts and credit cards to automatically sync transaction data. This enables the app to analyze spending habits and provide real-world insights into missed rewards or optimized cashback using the [[Card-Optimizer]].

## Implementation Details

### Frontend ([[Monet-iOS-App]])
- Uses the `PlaidLinkView.swift` which integrates the Plaid SDK for iOS.
- Allows users to securely log into their financial institutions without passing credentials through the Monet servers.
- Upon successful linking, generates a `public_token` that is sent to the [[Croe-Backend]].

### Backend ([[Croe-Backend]])
- Managed through the `plaid.ts` module.
- Uses the Plaid Node.js SDK (`plaid` npm package).
- Exchanges the `public_token` for an `access_token` and `item_id`, which are securely stored in the [[Database-Schema]] under the user's profile.
- Plaid endpoints are used to fetch transactions (`/transactions/sync` or `/transactions/get`), which are then processed, categorized, and stored locally to power the `InsightsView` on the iOS app.