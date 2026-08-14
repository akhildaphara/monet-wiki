# API Efficiency & Scalability Suggestions

> Revalidated 2026-08-13. The original Lambda/caching proposals have largely shipped; dependency monitoring is now defined. Open scalability work is load testing, deployed-alert verification, and cache/limit tuning. See [CURRENT_STATE_ACTIONS.md](./CURRENT_STATE_ACTIONS.md).

The `croe` Node.js backend handles DynamoDB interactions, and Google Places API calls. Here is how we can scale it effectively:

## 1. Centralized Caching for Google Places API
The `categorizer.ts` uses Google Places API as a fallback when a business isn't locally mapped. To prevent massive Google API bills and speed up requests:
- **Current state**: `BrandCacheRepository` provides DynamoDB-backed shared brand/category caching plus an in-process L1 layer. Measure hit rate, TTL effectiveness, and Google/Bedrock spend before adding another cache technology.

## 2. Serverless Deployment
The Express app already uses `serverless-http` on AWS Lambda. API Gateway throttling and reserved concurrency bound scaling, so capacity is intentionally finite rather than “infinite.” Load-test those limits against target beta/public traffic.

## 3. DynamoDB Query Optimization
- For `getTransactions` and `getOverrides`, ensure you are using Query operations with proper indexes (e.g., Global Secondary Indexes if querying by merchant instead of user) rather than full table Scans.
- Use `BatchGetItem` when a user's wallet has many cards to fetch their details efficiently if the card catalog ever moves entirely to the database instead of the hardcoded static `cardRewardsData.ts`.

---

## Recently Implemented Scalability Fixes

During the latest refactoring phase, several critical optimizations were introduced:

- **Atomic User State Updates:** `POST /v1/user/cards` and `/settings` endpoints were refactored from an inefficient `GetItem -> modify -> PutItem` loop into a single atomic `UpdateCommand`. This not only eliminated read-modify-write race conditions but halved the DynamoDB RCUs consumed per request.
- **Batch Transactions:** `putTransactions` was updated to utilize DynamoDB's `BatchWriteCommand`, processing up to 25 transaction inserts in a single network round-trip.
- **iOS App Request Coalescing:** The "thundering herd" problem of simultaneous `/auth/sync` calls firing across SwiftUI views on launch was mitigated by task coalescing within `APIClient` and event-driven `DataStore` synchronization.
- **Incremental Insights Fetching:** Optimized the backend `syncInsights` endpoint to fetch only the last 180 days of transactions on cache misses (using the `DateIndex` LSI), preventing massive memory/bandwidth usage for long-term users.
