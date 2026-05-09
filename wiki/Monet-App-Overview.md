Monet is a credit card rewards optimizer application that helps users maximize their cashback and rewards based on their purchases. It consists of three main components: the [[Monet-iOS-App]], which serves as the frontend UI for users to interact with; the [[Croe-Backend]], which is the backend server that handles data processing, API requests, and integrations; and the [[Monet-Website]], a public-facing landing page for the product.

The platform uses a [[Card-Optimizer]] to determine the best credit card for a given purchase. The [[Plaid-Integration]] enables automatic bank account linking, transaction syncing (via the Transactions Sync API and webhooks), and personalized spending insights that compare actual rewards earned against wallet-optimal and globally-optimal strategies. The entire system is built to ensure API efficiency and scalability, while maintaining a top-notch UI/UX for end users. The application also allows users to configure business category overrides, giving them fine-grained control over how their transactions are categorized and which cards are recommended.

## System Components
- [[Monet-iOS-App]]: A Swift/SwiftUI iOS application with merchant search, spending insights, wallet management, and bank connection management. Hosted in the `raw/swift-app` directory. Redesigned for standard theme tokens and improved animations.
- [[Croe-Backend]]: A modular Node.js/Express backend running on Node 20 / CJS and deployed via Serverless (AWS Lambda).
- [[Monet-Website]]: A Next.js landing page with Universal Link support.
- [[Database-Schema]]: AWS DynamoDB tables for Users, Overrides, Transactions, and Insights Caching.

## Core Features
- **Dynamic Reward Optimization**: Credit card reward calculation based on both static data and user-specific custom multipliers.
- **Advanced Merchant Search**: Ranked card recommendations using Google Places API and a local engine with 900+ brand rules.
- **Robust Bank Linking**: Multi-institution Plaid support with proactive transaction syncing and a unified table structure.
- **Deep Spending Insights**: Actual vs. wallet-optimal vs. global-optimal earnings with 24h caching (DynamoDB + local) and detailed Plaid category mapping.
- **Personalized Recommendations**: "Best New Card" analysis based on real historical spending.
- **Offline Resilience**: Network-aware UI with request gating, debounced refreshes, and automatic JWT recovery.
- **Cross-Platform Sync**: Custom card rewards and categorization overrides synced across all user devices.