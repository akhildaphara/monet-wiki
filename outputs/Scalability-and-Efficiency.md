# API Efficiency & Scalability Suggestions

The `croe` Node.js backend handles Plaid syncs, DynamoDB interactions, and Google Places API calls. Here is how we can scale it effectively:

## 1. Caching Google Places API Calls
The `categorizer.ts` uses Google Places API as a fallback when a business isn't locally mapped. To prevent massive Google API bills and speed up requests:
- **Implement a Redis or DynamoDB Cache layer**: When Google Places returns a category for "Starbucks", save it centrally so subsequent queries by any user for "Starbucks" hit the database instead of the external API.

## 2. Plaid Webhooks for Transactions
Currently, it appears the app might sync transactions on demand. 
- Implement **Plaid Webhooks** (`SYNC_UPDATES_AVAILABLE`). Instead of polling, Plaid will POST to an endpoint when new transactions are ready. The backend can then fetch, categorize, and store them asynchronously, keeping the iOS app feeling instant.

## 3. Serverless Deployment
The Express app runs via `node dist/index.js`. 
- To scale seamlessly, consider wrapping the Express app with `serverless-http` and deploying it to **AWS Lambda**. This pairs perfectly with DynamoDB, meaning you'll have near-zero costs when traffic is low, and infinite scalability when traffic spikes, without managing a container/EC2 instance.

## 4. DynamoDB Query Optimization
- For `getTransactions` and `getOverrides`, ensure you are using Query operations with proper indexes (e.g., Global Secondary Indexes if querying by merchant instead of user) rather than full table Scans.
- Use BatchGetItem when a user's wallet has many cards to fetch their details efficiently.