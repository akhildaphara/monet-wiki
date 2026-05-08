# UI/UX Top-Notch Suggestions

To elevate Monet from a functional utility to a premium financial app, consider the following UI/UX improvements:

## 1. Card Art and Theming

The `cardRewardsData.ts` defines `themeColorHex` and `imageName`.

- **Action**: Render the cards in the `CardWalletView.swift` to look exactly like the physical cards. Apple Wallet does this beautifully. A gradient mesh based on the `themeColorHex` with a subtle glassmorphism effect (using `.ultraThinMaterial` in SwiftUI) will make the wallet feel premium.

## 2. Interactive "Where am I?" Search Bar

When users are standing in a checkout line, they need answers fast.

- **Action**: The `SearchView` should feature a prominent, large search bar. As the user types (e.g., "Tar..."), it should instantly auto-suggest "Target" and immediately flash the best card in their wallet, perhaps utilizing the Taptic Engine for haptic feedback when the best card is found.

## 3. Visualizing Missed Rewards (Plaid Integration)

The `InsightsView.swift` was recently archived/removed to simplify the initial production release, but when Plaid is re-enabled, it's critical to make the data actionable.

- **Action**: When the Insights dashboard returns, don't just show what the user earned. Show what they _could have_ earned. Display a metric: "You lost $14.50 this month by using the wrong card at CVS." Loss aversion is a powerful motivator, and it proves the value of the app instantly.

## 4. Confetti and Micro-interactions

When a user manually overrides a category or adds a new card to their wallet, use SwiftUI animations.

- **Action**: Add a subtle spring animation (`.spring()`) when adding a card, and perhaps a small particle effect when they hit a 5% cash back milestone for the month.

---

## Recently Implemented Enhancements

During the latest refactoring phase, several critical UX features were solidified:

- **Offline Fallback**: If the user has poor cell service inside a big-box store (very common), the iOS app no longer stalls. `CategorizerService.swift` now implements a `ResolutionSource.fallback` utilizing SwiftData `BusinessOverride` models and the local `PlacesCache.swift`. If the API request fails, it instantly processes categorization offline and returns the best card based on cached local intelligence.
- **Background Sync Throttling**: Toggling settings or reopening the app no longer flashes blocking `ProgressView` elements indiscriminately. The centralized `DataStore` limits background auth syncs to once every 24 hours, ensuring the UI remains highly responsive across app lifecycle transitions.
