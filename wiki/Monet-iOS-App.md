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
- **Centralized DataStore**: The `DataStore` acts as the single source of truth for the app's state (Users, Cards, Overrides, Plaid accounts, card mappings). It handles all backend synchronization, automatically triggering syncs via `NotificationCenter` events (`.authTokenAvailable` and `.networkRegained`), and enforces a 24-hour background sync throttle. Debouncing (1-second `Task.sleep`) prevents API spam for rapid user interactions like toggling cards or changing settings.
- **APIClient Task Coalescing**: To prevent the "thundering herd" problem, `APIClient` uses Swift 6 concurrency-safe locking (`taskLock.withLock`) to coalesce concurrent requests to `/auth/sync` and `/health` into a single shared `Task`.
- **InsightsManager**: An `@ObservableObject` that owns the insights lifecycle. Stores `plaidCardMappings` in `@AppStorage`, fetches insights from the backend with a configurable `selectedDays` (30/90/180), and publishes `summary` and `categoryInsights` for the UI. Handles `ITEM_LOGIN_REQUIRED` errors gracefully with user-facing guidance. Features a **dual-layer cache** with a 24-hour refresh cadence:
  - **Local (iOS)**: Caches the full insights response in `@AppStorage`, keyed by a hash of `selectedCardIds + plaidCardMappings + selectedDays`. On `fetchInsights()`, checks the local cache first — if valid (<24h and same key), displays cached data immediately with zero network calls. When offline, serves stale cached data as a graceful fallback.
  - **Backend (DynamoDB)**: The `MonetInsightsCache` table stores computed insights with a 24h DynamoDB TTL. If the iOS cache misses but the backend cache hits, computation is skipped. Cache key changes automatically when the user modifies their wallet or card mappings.

## Navigation Structure
The app uses a `RootTabView` with four tabs:

| Tab | View | Description |
|---|---|---|
| Search | `ContentView` | Merchant search dashboard — type a business name and see ranked card recommendations |
| Insights | `InsightsView` | Spending analytics powered by Plaid transaction data |
| Wallet | `CardWalletView` → `CardDetailsView` | Add/remove credit cards, manage bank connections |
| Profile | `ProfileView` | Account settings, appearance, sign-out |

A persistent `NetworkStatusBanner` sits above the tab bar showing three states: "No Internet Connection" (red), "Server Unreachable — Tap to retry" (orange, tappable), and "Syncing with server..." (gray, with spinner).

## Core Views

### Search & Categories
- `ContentView.swift`: The home screen dashboard. Relies entirely on `DataStore` for remote data rather than orchestrating its own API calls.
- `CategoriesView.swift` & `CategoryDetailsView.swift`: Browse all reward categories and see which card wins in each.

### Wallet & Cards
- `CardWalletView.swift`: Displays the user's selected cards. Includes a "Bank Connections" navigation link to `BankConnectionsView`.
- `CardDetailsView.swift`: Per-card detail showing category rewards breakdown and linked Plaid account info (with last-4 mask matching).
- `MiniCardView.swift`: A compact card preview used in recommendations and insights.

### Bank Connections & Insights
- `BankConnectionsView.swift`: Dedicated bank connection management. Lists all connected Plaid items grouped by institution name with account counts. Each item expands to show individual accounts with Picker-based card mapping (auto-suggests based on last-4 mask matching). Shows "Connection needs refreshing" banners with "Fix Now" buttons for broken items. Supports "Connect a New Bank" and per-item disconnect.
- `PlaidLinkView.swift`: A `UIViewControllerRepresentable` wrapping Plaid's `LinkViewController` for the OAuth flow. Supports both new connections and update-mode re-authentication.
- `InsightsView.swift`: Rich spending analytics view using Swift Charts. Features:
  - Configurable time range toolbar (30d / 90d / 180d capsule buttons)
  - Bar chart comparing Actual vs. Wallet Best vs. Global Best earnings
  - "Top Recommendation" card suggesting the single best card to add, with potential earnings delta and an apply link
  - Per-category breakdown rows with stacked bar charts showing earned vs. missed rewards
  - Empty state with Plaid Link onboarding flow
  - Pull-to-refresh, auto-refresh on card/mapping changes via `NotificationCenter`

### Authentication
- `LoginView.swift`: Google Sign-In flow.

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