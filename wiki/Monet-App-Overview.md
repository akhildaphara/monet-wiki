Monet is a credit card rewards optimizer application that helps users maximize their cashback and rewards based on their purchases. It consists of two main components: the [[Monet-iOS-App]], which serves as the frontend UI for users to interact with, and the [[Croe-Backend]], which is the backend server that handles data processing, API requests, and integrations.

The platform integrates with [[Plaid-Integration]] to fetch user transactions and uses a [[Card-Optimizer]] to determine the best credit card for a given purchase. The entire system is built to ensure API efficiency and scalability, while maintaining a top-notch UI/UX for end users. The application also allows users to configure business category overrides, giving them fine-grained control over how their transactions are categorized and which cards are recommended.

## System Components
- [[Monet-iOS-App]]: A Swift-based iOS application that provides the user interface.
- [[Croe-Backend]]: A Node.js and Express backend that provides the core logic and API endpoints.

## Core Features
- Credit card reward optimization based on user wallet.
- Bank account linking via Plaid for transaction history.
- Custom business overrides for transaction categorization.
- Real-time best card recommendations.