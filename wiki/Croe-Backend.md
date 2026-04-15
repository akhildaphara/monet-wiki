The [[Croe-Backend]] is the backend server for the [[Monet-App-Overview]] application. Built using Node.js and Express in TypeScript, it is responsible for providing all backend logic, serving APIs to the [[Monet-iOS-App]], handling user authentication via Google Auth, and managing data persistence through [[Database-Schema]] in AWS DynamoDB.

## Tech Stack
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: AWS DynamoDB (via `@aws-sdk/client-dynamodb` and `@aws-sdk/lib-dynamodb`)
- **Authentication**: Google Auth Library
- **External APIs**: Google Generative AI for certain data enrichment features.

## Architecture & Modules
- `index.ts`: The main Express server entry point, handling routing, middleware, and request logging.
- `optimizer.ts`: Contains the [[Card-Optimizer]] logic, finding the best credit cards for a given user transaction.
- `categorizer.ts`: Maps merchants and transactions to specific reward categories using `brandCategoryMap.js` and `categories.js`.
- `dao.ts` & `db.ts`: The Data Access Object layer that communicates with DynamoDB, managing users, transactions, and business overrides.

## Running the Backend
- Development: Uses `tsx watch src/index.ts` to run locally via `npm run dev`.
- Uses a local DynamoDB instance in development mode (`npm run init-db`).
- Configurable via `.env` variables.