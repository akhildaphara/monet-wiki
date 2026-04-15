The [[Monet-iOS-App]] is the frontend user interface for the [[Monet-App-Overview]] application. Written entirely in Swift using SwiftUI, it provides users with an intuitive and smooth experience to manage their credit card wallet, view optimal card recommendations, review categorized transactions, and manage custom category overrides.

## Tech Stack
- **Platform**: iOS
- **Language**: Swift 6
- **UI Framework**: SwiftUI
- **Local Persistence**: SwiftData (used for centralized models: `User`, `Card`, and `BusinessOverride`)
- **Authentication**: Google Sign-In SDK
- **Backend Communication**: A custom `APIClient` that communicates with the [[Croe-Backend]], orchestrated by a centralized `DataStore`.

## Core Architecture
- **Centralized DataStore**: The `DataStore` acts as the single source of truth for the app's state (Users, Cards, Overrides). It handles all backend synchronization, automatically triggering syncs via `NotificationCenter` events (`.authTokenAvailable` and `.networkRegained`), and enforces a 24-hour background sync throttle. It also implements debouncing (1-second `Task.sleep`) for rapid user interactions like toggling cards or changing settings to prevent API spam.
- **APIClient Task Coalescing**: To prevent the "thundering herd" problem, `APIClient` uses Swift 6 concurrency-safe locking (`taskLock.withLock`) to coalesce concurrent requests to `/auth/sync` and `/health` into a single shared `Task`.

## Core Features & Views
- `RootTabView.swift`: The main navigation structure of the app.
- `LoginView.swift`: Handles Google Sign-In authentication.
- `ContentView.swift`: The dashboard, showing top-level summaries and recommendations. Relies entirely on `DataStore` for remote data rather than orchestrating its own API calls.
- `CardWalletView.swift` & `CardDetailsView.swift`: UI components for users to add, remove, and view their currently held credit cards.
- `CategoriesView.swift` & `CategoryDetailsView.swift`: Interfaces for viewing business categories and mapping specific businesses to preferred categories.

## Services
The `Services` directory manages logic outside of the views, such as `APIClient.swift` for network requests, `GoogleSignInService.swift` for managing auth state, `CategorizerService.swift`, and `BusinessSearchService.swift`. `NetworkMonitor` tracks connectivity state and broadcasts network restoration events.