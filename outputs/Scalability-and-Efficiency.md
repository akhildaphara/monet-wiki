# API Efficiency & Scalability Suggestions

The `croe` Node.js backend handles DynamoDB interactions, and Google Places API calls. Here is how we can scale it effectively:

## 1. Centralized Caching for Google Places API
The `categorizer.ts` uses Google Places API as a fallback when a business isn't locally mapped. To prevent massive Google API bills and speed up requests:
- **Implement a Redis or DynamoDB Cache layer**: While the iOS app now implements local caching via `PlacesCache.swift` to prevent redundant network calls from the same device, a centralized cache on the backend would prevent multiple *different* users from triggering the same external API call for popular merchants like "Starbucks".

## 2. Serverless Deployment
The Express app runs via `node dist/index.js`. 
- To scale seamlessly, consider wrapping the Express app with `serverless-http` and deploying it to **AWS Lambda**. This pairs perfectly with DynamoDB, meaning you'll have near-zero costs when traffic is low, and infinite scalability when traffic spikes, without managing a container/EC2 instance.

## 3. DynamoDB Query Optimization
- For `getTransactions` and `getOverrides`, ensure you are using Query operations with proper indexes (e.g., Global Secondary Indexes if querying by merchant instead of user) rather than full table Scans.
- Use `BatchGetItem` when a user's wallet has many cards to fetch their details efficiently if the card catalog ever moves entirely to the database instead of the hardcoded static `cardRewardsData.ts`.

---

## Recently Implemented Scalability Fixes

During the latest refactoring phase, several critical optimizations were introduced:

- **Atomic User State Updates:** `POST /v1/user/cards` and `/settings` endpoints were refactored from an inefficient `GetItem -> modify -> PutItem` loop into a single atomic `UpdateCommand`. This not only eliminated read-modify-write race conditions but halved the DynamoDB RCUs consumed per request.
- **Batch Transactions:** `putTransactions` was updated to utilize DynamoDB's `BatchWriteCommand`, processing up to 25 transaction inserts in a single network round-trip.
- **iOS App Request Coalescing:** The "thundering herd" problem of simultaneous `/auth/sync` calls firing across SwiftUI views on launch was mitigated by task coalescing within `APIClient` and event-driven `DataStore` synchronization.