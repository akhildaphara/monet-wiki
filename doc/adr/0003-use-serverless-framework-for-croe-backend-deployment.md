# ADR-0003: Use Serverless Framework (AWS Lambda) for Croe Backend Deployment

* **Status**: Accepted (Retroactive)
* **Date**: 2026-05-27
* **Deciders**: AI Agent, Akhil Daphara

## Context and Problem Statement

The Monet backend application (`croe`) provides REST APIs to the iOS frontend client. It manages user authentication, user credit card wallets, recommendation engines, and background Plaid transaction syncing. 

In the early stages of a consumer-facing application, traffic is highly variable and unpredictable. Running a traditional, always-on server instance (like AWS EC2, Elastic Beanstalk, or containerized ECS) is expensive because we pay for idle compute time. We need a hosting solution that automatically scales to handle traffic spikes, costs nothing when idle, and minimizes infrastructure maintenance overhead.

## Decision Drivers

* **Operational Overhead**: Avoid maintaining virtual machines, operating system patches, and container scaling policies.
* **Cost Efficiency**: Pay only for active compute time used during API calls.
* **Scaling**: Seamlessly and instantaneously handle rapid scaling from zero requests to thousands of concurrent API requests.
* **Developer Velocity**: Infrastructure-as-Code (IaC) configurations should be simple and integrated directly into the backend code repository.

## Considered Options

1. **Option 1: Traditional Virtual Machines (AWS EC2 / Elastic Beanstalk)**
2. **Option 2: Containerized Application (AWS ECS on Fargate)**
3. **Option 3: Serverless Functions (AWS Lambda deployed via Serverless Framework)**

## Decision Outcome

Chosen Option: **Option 3: Serverless Functions (AWS Lambda deployed via Serverless Framework)**.

We selected AWS Lambda for its zero-maintenance, scale-to-zero execution model. To deploy and manage these functions, we chose the **Serverless Framework** (`serverless.yml`) because it wraps the complex AWS CloudFormation configurations into a simple, developer-friendly YAML syntax, enabling quick deployment of API Gateway, IAM execution roles, and environment variables.

### Implementation Details
- **Framework**: Express.js is wrapped using a serverless adapter (e.g., `serverless-http`), allowing the entire Express modular routing system to execute inside a single AWS Lambda function handle. This preserves the local development experience (running `src/index.ts` as a local Express server) while deploying seamlessly as serverless API endpoints.
- **Runtime**: Node.js 20 on TypeScript (compiled to CommonJS).
- **Region**: `us-east-1` with specific dev-scoped AWS profiles (`--profile dev`).

## Consequences

* **Good**: Scale-to-zero model results in near-zero hosting costs during development and low-traffic periods.
* **Good**: Built-in high availability and auto-scaling managed completely by AWS.
* **Good**: All environment variables, API Gateway routes, and AWS IAM permissions are declared declaratively in `serverless.yml` inside the repo.
* **Bad**: **Cold Starts**: Cold container initializations can cause latency spikes (up to 1–2 seconds) on the first request after an idle period.
* **Bad**: **Execution Limits**: AWS API Gateway enforces a maximum execution timeout of 29 seconds. Any heavy background data computations (such as deep spending insights or historic Plaid syncs) must be handled asynchronously or optimized to execute rapidly.
* **Bad**: Vendor lock-in to AWS-specific serverless infrastructure (Lambda, API Gateway).
