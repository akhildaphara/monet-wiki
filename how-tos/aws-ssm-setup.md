# AWS SSM Parameter Store Setup

This guide explains how to provision the required AWS SSM Parameter Store secrets for the Croe backend using the `ssm-bootstrap.sh` script.

## Prerequisites

- AWS CLI v2 installed and configured
- A named AWS profile with `ssm:PutParameter` and `kms:GenerateDataKey` permissions
- `openssl` available (used for auto-generating encryption keys)

## Bootstrap with the script

Run the script from the `raw/croe` directory:

```bash
# Dev stage
./scripts/ssm-bootstrap.sh --stage dev --profile dev

# Prod stage
./scripts/ssm-bootstrap.sh --stage prod --profile dev
```

The script walks you through each parameter interactively, shows you where to find each value, and auto-generates secrets (encryption key, JWT secret, origin secret) when you leave the prompt blank.

### Flags

| Flag | Default | Description |
|------|---------|-------------|
| `--stage` | *(required)* | `dev` or `prod` |
| `--profile` | `dev` | AWS named profile |
| `--region` | `us-east-1` | AWS region |
| `--overwrite` | off | Pass to update existing parameters; omit to skip them |

## Parameters provisioned

| SSM path | Type | Notes |
|----------|------|-------|
| `/monet/{stage}/google-client-id` | SecureString | Google OAuth iOS client ID |
| `/monet/{stage}/apple-client-id` | SecureString | iOS bundle ID (`akhil.Monet` / `akhil.Monet.dev`) |
| `/monet/{stage}/google-places-api-key` | SecureString | Google Places + Knowledge Graph API key |
| `/monet/{stage}/plaid-client-id` | SecureString | Plaid client ID |
| `/monet/{stage}/plaid-secret` | SecureString | Plaid sandbox or production secret |
| `/monet/{stage}/plaid-env` | SecureString | `sandbox` (dev) or `production` (prod) |
| `/monet/{stage}/plaid-encryption-key` | SecureString | 32-byte AES-256-GCM key — auto-generated if blank |
| `/monet/{stage}/guest-jwt-secret` | SecureString | HMAC secret for guest JWTs — auto-generated if blank |
| `/monet/{stage}/origin-secret` | SecureString | CloudFront → API Gateway header secret — auto-generated if blank |
| `/monet/{stage}/dev-api-key` | SecureString | Postman bypass key (dev stage only) — auto-generated if blank |

## Verification

```bash
aws ssm get-parameters-by-path \
  --profile dev \
  --region us-east-1 \
  --path "/monet/dev" \
  --recursive \
  --query "Parameters[*].Name" \
  --output table
```

## Next steps after bootstrap

1. Deploy the backend: `npx serverless deploy --stage dev --profile dev`
2. Copy the `CloudFrontDomain` stack output into `Secrets.xcconfig → CLOUDFRONT_URL`
3. If you auto-generated `origin-secret`, update the CloudFront origin custom header to match:
   ```bash
   aws ssm get-parameter --profile dev --region us-east-1 \
     --name "/monet/dev/origin-secret" --with-decryption \
     --query Parameter.Value --output text
   ```

## Security reminders

- **Never reuse** `plaid-encryption-key` between stages. Rotating it requires re-encrypting every stored Plaid access token in DynamoDB.
- **Restrict** `google-places-api-key` to your API Gateway origin in the GCP Console.
- `guest-jwt-secret` and `origin-secret` must differ per stage.
