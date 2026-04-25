Monet is a credit card rewards optimizer application that helps users maximize their cashback and rewards based on their purchases. It consists of three main components: the [[Monet-iOS-App]], which serves as the frontend UI for users to interact with; the [[Croe-Backend]], which is the backend server that handles data processing, API requests, and integrations; and the [[Monet-Website]], a public-facing landing page for the product.

The platform uses a [[Card-Optimizer]] to determine the best credit card for a given purchase. The [[Plaid-Integration]] enables automatic bank account linking, transaction syncing (via the Transactions Sync API and webhooks), and personalized spending insights that compare actual rewards earned against wallet-optimal and globally-optimal strategies. The entire system is built to ensure API efficiency and scalability, while maintaining a top-notch UI/UX for end users. The application also allows users to configure business category overrides, giving them fine-grained control over how their transactions are categorized and which cards are recommended.

## System Components
- [[Monet-iOS-App]]: A Swift/SwiftUI iOS application with merchant search, spending insights, wallet management, and bank connection management.
- [[Croe-Backend]]: A modular Node.js/Express backend with domain-specific API routes, authentication middleware, and Plaid webhook processing.
- [[Monet-Website]]: A Next.js landing page showcasing the app's features and collecting waitlist signups.
- [[Database-Schema]]: AWS DynamoDB tables for Users, Overrides, and Transactions.

## Core Features
- Credit card reward optimization based on user wallet.
- Merchant search with ranked card recommendations (via Google Places API and local brand rules).
- Automatic bank account linking via Plaid with multi-institution support.
- Spending insights with actual vs. wallet-optimal vs. global-optimal earnings comparison.
- "Best New Card" recommendation based on incremental value analysis.
- Custom business overrides for transaction categorization.
- Network-aware UI with connectivity banners and automatic retry.