g# AWS Deployment Plan for Croe Backend

## Should we use the Serverless Framework?

**Yes, absolutely.** For a beta launch of a Node.js/Express backend, the Serverless Framework (deploying to AWS Lambda + API Gateway) is arguably the best approach for the following reasons:

1. **Cost-Effective:** Lambda charges per execution. During beta testing, where traffic is unpredictable or relatively low, your backend hosting costs will be close to $0. You avoid the fixed hourly costs of an always-on EC2 instance or AWS App Runner.
2. **Minimal Code Changes:** By using a wrapper like `serverless-http`, you can take your existing Express app and deploy it to Lambda with just 3-4 lines of code changes. You don't have to rewrite your existing routing logic.
3. **IAM & DynamoDB Integration:** Your app already uses DynamoDB. Serverless makes it incredibly easy to attach IAM permissions directly to your Lambda function within the `serverless.yml` configuration, ensuring your API has the exact permissions needed to read/write to `MonetUsers`, `MonetOverrides`, etc.
4. **Environment Variables:** Serverless integrates seamlessly with AWS Systems Manager (SSM) Parameter Store to securely inject your `GOOGLE_PLACES_API_KEY` and Plaid secrets at deploy time.

---

## Deployment Strategy & Plan

### Phase 1: Code Modifications (Adapting Express)

To make your Express app run on Lambda, you need to wrap it.

1. **Install Dependencies:** Run `npm install serverless-http` and `npm install -D serverless` in the `croe` directory.
2. **Update `src/index.ts`:**
   - Export your configured `app` instead of just running `app.listen()`.
   - Wrap the app: `export const handler = serverless(app);`.
   - _Tip:_ Keep `app.listen()` inside a check `if (process.env.NODE_ENV !== 'production')` so your `npm run dev` command still works perfectly for local development.

### Phase 2: Configuration (`serverless.yml`)

Create a `serverless.yml` file in the `croe` directory.

1. **Define the Provider:** Set the provider to `aws`, runtime to `nodejs20.x`, and region to `us-east-1` (or your preferred region).
2. **Define IAM Roles:** In the provider block, grant the Lambda function permissions (`dynamodb:PutItem`, `dynamodb:GetItem`, `dynamodb:Query`, etc.) specifically for your DynamoDB tables.
3. **Define Functions:** Map the `handler` you exported in Phase 1 to a wildcard HTTP event so API Gateway routes all traffic (`/{proxy+}`) to your Express app.

### Phase 3: Infrastructure & Security

1. **AWS Secrets:** Go to the AWS Console -> Systems Manager (SSM) -> Parameter Store. Add your production secrets (Google Client ID, Google Places API, Plaid Keys) as `SecureString`s.
2. **Inject Secrets:** Reference these SSM parameters in your `serverless.yml` environment block so they are securely injected into your Lambda function at runtime.
3. **Provision DynamoDB:** While you can manually create the tables (`MonetUsers`, `MonetOverrides`, `MonetTransactions`) in the AWS console, it's highly recommended to define them in the `resources` section of `serverless.yml`. Ensure `BillingMode` is set to `PAY_PER_REQUEST` to handle spikes without base costs.

### Phase 4: CI/CD & Deployment

1. **Initial Manual Deploy:** Run `npx serverless deploy` from your terminal to verify everything works. This will provision the API Gateway, package your code, and deploy the Lambda function.
2. **GitHub Actions:** Create a `.github/workflows/deploy.yml` file. Configure it to run `npx serverless deploy` automatically whenever code is pushed to the `main` branch. This requires adding AWS Credentials (Access Key / Secret Key) to your GitHub repository secrets.

### Phase 5: Client Integration

1. **Get the API URL:** After deploying, Serverless will output an API Gateway endpoint (e.g., `https://xxxxxxx.execute-api.us-east-1.amazonaws.com/dev`).
2. **Update iOS App:** Open `MonetApp/Services/APIClient.swift` and replace the local IP `http://100.115.243.9:3000/v1` with your new production API Gateway URL.
