g# AWS Deployment Plan for Croe Backend (Dual-Mode)

## Overview

The goal is to maintain a single codebase that runs:

1.  **Locally:** Using standard Express and a local DynamoDB instance for rapid development.
2.  **AWS (Serverless):** Using AWS Lambda + API Gateway for dev/prod environments, taking advantage of pay-as-you-go scaling.

---

## Architecture: Dual-Mode Execution

We use `serverless-http` to wrap the Express application. The entry point (`src/index.ts`) detects the environment to decide whether to start a long-running server or export a Lambda handler.

### 1. Code Adaptation (`src/index.ts`)

Update the main entry point to support both modes:

```typescript
import serverless from "serverless-http";
import app from "./app.js";

// Export the handler for AWS Lambda
export const handler = serverless(app);

// Start the local server ONLY if running locally
if (process.env.NODE_ENV !== "production" && !process.env.LAMBDA_TASK_ROOT) {
  const PORT = Number(process.env.PORT) || 3000;
  const HOST = "0.0.0.0";
  app.listen(PORT, HOST, () => {
    console.log(`🚀 Local Croe API server running on http://${HOST}:${PORT}`);
  });
}
```

### 2. Database Connectivity

The `db.ts` should dynamically choose the endpoint based on the environment:

- **Local:** `endpoint: "http://localhost:8000"`
- **AWS:** No endpoint specified (defaults to the region's DynamoDB service).

---

## Configuration (`serverless.yml`)

With **Serverless v4**, TypeScript is supported natively. We do **not** need `serverless-plugin-typescript`.

```yaml
service: croe-backend

provider:
  name: aws
  runtime: nodejs20.x
  region: us-east-1
  stage: ${opt:stage, 'dev'}
  environment:
    NODE_ENV: production
    # Reference AWS SSM Parameters for secrets
    PLAID_CLIENT_ID: ${ssm:/monet/${self:provider.stage}/plaid-client-id}
    # ... other vars

functions:
  api:
    handler: src/index.handler
    events:
      - httpApi: "*" # Routes all traffic to Express
```

---

## Development Workflow

### Local Development

1.  **Start Local DB:** `docker run -p 8000:8000 amazon/dynamodb-local`
2.  **Run API:** `npm run dev`
    - Uses `.env` for configuration.
    - Connects to `localhost:8000`.

### AWS Deployment

1.  **Configure AWS:** Ensure your CLI is authenticated (`aws login --profile dev`).
2.  **Deploy to Dev:** `npx serverless deploy --stage dev --profile dev`
3.  **Deploy to Prod:** `npx serverless deploy --stage prod --profile dev` (or appropriate profile)

---

## Infrastructure & Security

1.  **IAM Permissions:** Define specific permissions in `serverless.yml` so the Lambda can only access necessary DynamoDB tables (`MonetUsers`, `MonetOverrides`).
2.  **Secrets Management:**
    - Store secrets in **AWS SSM Parameter Store** (e.g., `/monet/dev/google-api-key`).
    - The `serverless.yml` will inject these into the Lambda environment variables at deploy time.
3.  **VPC (Optional):** For beta, we can run in the default VPC. For high security later, we might move Lambda into a private VPC with a NAT Gateway.

---

## Updated NPM Scripts

Add these to `package.json`:

- `"dev": "tsx watch src/index.ts"` (Local execution)
- `"deploy:dev": "serverless deploy --stage dev"`
- `"deploy:prod": "serverless deploy --stage prod"`
- `"info": "serverless info"`
