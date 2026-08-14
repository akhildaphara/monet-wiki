# Improvements

> Historical suggestions, reviewed 2026-08-05. Endpoint references and priorities in this file may be superseded by [CURRENT_STATE_ACTIONS.md](./CURRENT_STATE_ACTIONS.md).

## swift-app (iOS)

### Suggested Improvements

1.  **Improve Error Handling in `InsightsView.swift`**: When fetching a Plaid link token fails, a generic "Connection Error" is shown. It would be more user-friendly to display a more specific error message based on the actual error received from the API.
2.  **Add Comments to Complex Logic**: The caching logic in `InsightsManager.swift` and the debouncing logic in `DataStore.swift` are quite complex. Adding comments to explain _why_ these implementations were chosen would improve code clarity and maintainability.

## croe (Backend)

### Suggested Improvements

1.  **Refactor `syncInsights.ts`**: The `syncInsights` function is very long and has a high level of complexity. It would be beneficial to break it down into smaller, more focused functions. For example, the dynamic rewards calculation could be extracted into a separate module.
2.  **Optimize Best Card Calculation**: `POST /v1/recommend` calculates the user's best card for a merchant/category. Measure latency and cache only if profiling shows optimizer work—not Places/brand resolution—is material; wallet-overview and insights already have cache-oriented paths.
