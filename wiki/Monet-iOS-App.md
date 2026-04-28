The [[Monet-iOS-App]] is the frontend user interface for the [[Monet-App-Overview]] application. Written entirely in Swift using SwiftUI, it provides users with an intuitive experience to manage their credit card wallet, view optimal card recommendations, connect bank accounts via [[Plaid-Integration]], track real spending insights, and manage custom category overrides.

## Tech Stack
- **Platform**: iOS
- **Language**: Swift 6
- **UI Framework**: SwiftUI
- **Charts**: Swift Charts (native, for Insights visualizations)
- **Local Persistence**: SwiftData (centralized models: `User`, `Card`, `BusinessOverride`)
- **Authentication**: Google Sign-In SDK
- **Bank Linking**: LinkKit (Plaid iOS SDK)
- **Backend Communication**: Custom `APIClient` communicating with the [[Croe-Backend]], orchestrated by `DataStore`.

## Core Architecture
- **Centralized DataStore**: The `DataStore` acts as the single source of truth. It handles all backend synchronization, automatically triggering syncs via `NotificationCenter` events (`.authTokenAvailable` and `.networkRegained`), and enforces a 24-hour background sync throttle. Debouncing prevents API spam.
- **Theme & Design Tokens**: All styling is centralized in `Theme.swift`, defining standard colors, gradients, and spacing used across the app for a unified look and feel.
- **APIClient Task Coalescing**: Uses Swift 6 concurrency-safe locking to coalesce concurrent requests to `/auth/sync` and `/health`. Implements **automatic JWT refresh** on 401 responses.
- **InsightsManager**: Owns the insights lifecycle. Features a **dual-layer cache** with a 24-hour refresh cadence:
  - **Local (iOS)**: Caches full insights response in `@AppStorage`. Keyed by wallet state and time range. Displays cached data immediately on load.
  - **Backend (DynamoDB)**: Hits the `MonetInsightsCache` if the local cache misses but the user state hasn't changed.

## Navigation Structure
The app uses a `RootTabView` with four tabs:

| Tab | View | Description |
|---|---|---|
| Search | `ContentView` | Merchant search dashboard with ranked card recommendations |
| Insights | `InsightsView` | Spending analytics powered by Plaid transaction data |
| Wallet | `CardWalletView` | Manage credit cards and bank connections |
| Profile | `ProfileView` | Account settings and developer tools |

### Developer Tools
A hidden developer menu (accessed via Profile) allows switching between AWS Production and Localhost backend endpoints for testing.

## Core Views

### Authentication
- `LoginView.swift`: Google Sign-In flow. Redesigned with an **animated credit card stack** logo, brand gradients, and standard theme components.

### Search & Categories
- `ContentView.swift`: Home dashboard. Uses a `chart.pie` icon for insights. Standardized typography and layout.
- `CategoriesView.swift` & `CategoryDetailsView.swift`: Browse reward categories.

### Wallet & Cards
- `CardWalletView.swift`: Displays the user's wallet. Shows a "No Cards" empty state with a call-to-action to add cards.
- `EditCardRewardsView.swift`: New view allowing users to **manually configure reward multipliers** for specific cards, which are then synced to the backend and factored into optimization.
- `CardDetailsView.swift`: Per-card detail showing rewards and linked Plaid accounts. Features persistent caching to prevent unnecessary re-fetches.

### Bank Connections & Insights
- `BankConnectionsView.swift`: Grouped by institution. Features **pull-to-refresh** to trigger a full Plaid transaction sync across all connected items.
- `InsightsView.swift`: Rich spending analytics using Swift Charts. Now displays a `computedAt` timestamp for the data. Configurable time ranges (30d/90d/180d).

## Services
- `APIClient.swift`: All network requests to the [[Croe-Backend]], including Plaid endpoints (`createPlaidLinkToken`, `exchangePlaidPublicToken`, `fetchPlaidAccounts`, `fetchInsights`, `checkPlaidStatus`, `disconnectPlaid`). Task coalescing for auth sync and health checks. Exposes `canMakeRequests()` helper that gating all view-level fetches.
- `GoogleSignInService.swift`: Manages Google auth state and token refresh.
- `InsightsManager.swift`: Insights data lifecycle manager (see Architecture section above).
- `CategorizerService.swift` & `BusinessSearchService.swift`: Client-side merchant categorization utilities.
- `NetworkMonitor`: Tracks connectivity state via `NWPathMonitor`, broadcasts `.networkRegained` notifications, and exposes `isConnected`, `isServerReachable`, and `isActivelyConnecting` states. Supports manual `retryConnection()`.

## Offline Handling

All views gate API calls through `APIClient.shared.canMakeRequests()` before touching the network:

| View / Service | Behavior When Offline |
|---|---|
| `CardWalletView.onAppear` | Skips `fetchPlaidAccounts()` — no banner flash |
| `BankConnectionsView.task` | Shows a user-friendly "You're Offline" state with Retry button |
| `InsightsView.onAppear` | Skips insights fetch; `InsightsManager` sets a friendly error message |
| `InsightsView.refreshInsights()` | Debounced 500ms + offline guard — prevents 3× chain-fire during sync |
| `DataStore.saveOverride` / `deleteOverride` | Queued in `pendingMutations` array; flushed on `.networkRegained` |
| `CategorizerService.categorize` | Returns `.fallback` immediately if offline or server unreachable |
| `DataStore.syncWithBackend` | Throttled 5-min + checks `isServerReachable` before any network call |

The `executeDataTask` fast-fail (checking `isConnected` before incrementing the active request counter) ensures the "Syncing" banner doesn't flash for immediately-rejected requests.