# Monet Knowledge Base Index

- [[Monet-App-Overview]]: A high-level overview of the Monet credit card rewards optimizer application and its system components.
- [[Monet-iOS-App]]: The Swift/SwiftUI frontend iOS application with merchant search, spending insights, wallet management, and bank connections.
- [[Croe-Backend]]: The modular Node.js/Express backend server handling API routing, authentication middleware, Plaid webhooks, and the insights engine.
- [[Card-Optimizer]]: The logic engine that determines the best credit card for a given category, used in both real-time search and retrospective spending analysis.
- [[Plaid-Integration]]: End-to-end bank account linking, transaction syncing (Sync API + webhooks), encrypted token storage, and the insights computation pipeline.
- [[Database-Schema]]: AWS DynamoDB tables for Users, Overrides, and Transactions — including encryption details and data models.
- [[Monet-Website]]: The Next.js public-facing landing page showcasing the app and collecting waitlist signups.