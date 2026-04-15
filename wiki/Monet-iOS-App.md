The [[Monet-iOS-App]] is the frontend user interface for the [[Monet-App-Overview]] application. Written entirely in Swift using SwiftUI, it provides users with an intuitive and smooth experience to manage their credit card wallet, view optimal card recommendations, review categorized transactions, and manage custom category overrides.

## Tech Stack
- **Platform**: iOS
- **Language**: Swift
- **UI Framework**: SwiftUI
- **Local Persistence**: SwiftData (used for models like `BusinessOverride`)
- **Authentication**: Google Sign-In SDK
- **Backend Communication**: A custom `APIClient` that communicates with the [[Croe-Backend]].

## Core Features & Views
- `RootTabView.swift`: The main navigation structure of the app.
- `LoginView.swift`: Handles Google Sign-In authentication.
- `ContentView.swift`: The dashboard, showing top-level summaries and recommendations.
- `CardWalletView.swift` & `CardDetailsView.swift`: UI components for users to add, remove, and view their currently held credit cards.
- `CategoriesView.swift` & `CategoryDetailsView.swift`: Interfaces for viewing business categories and mapping specific businesses to preferred categories.
- `InsightsView.swift`: Analytics and breakdowns of spending and rewards over time.
- `PlaidLinkView.swift`: Integrates the Plaid SDK for linking bank accounts securely.

## Services
The `Services` directory manages logic outside of the views, such as `APIClient.swift` for network requests, `GoogleSignInService.swift` for managing auth state, `CategorizerService.swift`, `BusinessSearchService.swift`, and `InsightsManager.swift`.