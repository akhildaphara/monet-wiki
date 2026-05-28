# ADR-0002: Use AWS DynamoDB for Data Persistence

* **Status**: Accepted (Retroactive)
* **Date**: 2026-05-27
* **Deciders**: AI Agent, Akhil Daphara

## Context and Problem Statement

The Monet credit card rewards optimizer application requires a data persistence layer to store user profiles, card wallets, custom reward overrides, synced bank transactions, and cached spending insights. 

The backend (`croe`) runs on a Serverless infrastructure (AWS Lambda). A standard relational database (like PostgreSQL or MySQL) presents scaling and structural issues in Serverless environments. Specifically, Lambda’s ephemeral container model can easily exhaust relational database connection pools during traffic spikes. Additionally, user data, merchant category overrides, and credit card transactions fit well into a flexible, document-like NoSQL structure.

## Decision Drivers

* **Serverless Compatibility**: Must handle thousands of concurrent, ephemeral connections from AWS Lambda without connection pool exhaustion.
* **Low Latency & High Throughput**: Fast read/write performance for transaction synchronization and real-time card recommendation queries.
* **Cost Effectiveness**: Minimize baseline infrastructure costs; exploit the AWS free tier during development and early production.
* **Flexible Schema**: User profiles, card preferences, and Plaid connections change over time; a NoSQL structure accommodates these modifications without database migrations.

## Considered Options

1. **Option 1: Relational Database (Amazon RDS - PostgreSQL)**
2. **Option 2: Document Database (MongoDB Atlas / Amazon DocumentDB)**
3. **Option 3: Amazon DynamoDB (NoSQL key-value store)**

## Decision Outcome

Chosen Option: **Option 3: Amazon DynamoDB** because of its native, HTTP-based API that eliminates connection pooling limitations in AWS Lambda, its predictable single-digit millisecond latency, and its zero-maintenance, scale-to-zero pricing.

### Core Data Models & Key Schema

To optimize for performance and cost, we established the following table designs:

1. **`MonetUsers` Table**:
   - *Primary Key*: `id` (String) — Mapped to the user's Google Auth `sub` identifier.
   - *Concurrency*: Employs atomic DynamoDB `UpdateCommand` expressions to prevent read-modify-write race conditions when toggling card preferences or adding cards to the wallet.
2. **`MonetOverrides` Table**:
   - *Partition Key*: `userId` (String) — Used to fetch all overrides for a specific user.
   - *Sort Key*: `merchantId` (String) — The lowercased, normalized merchant name to bypass the default classification engine.
3. **`MonetTransactions` Table**:
   - *Partition Key*: `userId` (String)
   - *Sort Key*: `transactionId` (String)
   - *Description*: Unified table storing synced Plaid transactions from the last 180 days across all connected accounts for a user.
4. **`MonetInsightsCache` Table**:
   - *Partition Key*: `userId` (String)
   - *Description*: Caches pre-computed spending insights to optimize dashboard performance.

### Consequences

* **Good**: Native, seamless integration with AWS IAM for security and credential management.
* **Good**: Single-digit millisecond performance on primary key lookups (`userId`, `merchantId`, `transactionId`).
* **Good**: No database connection pools to manage or scale.
* **Bad**: Restricted query capability; complex multi-attribute queries, aggregation, and full-text searches require secondary indexes (GSIs) or client-side filtering.
* **Bad**: Single-table design and partition key design require careful up-front planning; schema modifications are manual and require code-level data transformations.
