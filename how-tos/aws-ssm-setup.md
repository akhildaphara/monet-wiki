# AWS SSM Parameter Store Setup

This guide explains how to store the necessary environment variables and secrets in AWS Systems Manager (SSM) Parameter Store for the Croe backend.

## Prerequisites

- AWS CLI installed and configured.
- Access to the `dev` AWS profile (`aws login --profile dev`).
- Region set to `us-east-1`.

## Storing Parameters (Dev Stage)

Replace `VALUE_HERE` with the actual values from your local `.env` file.

```bash
# Google Places API Key
aws ssm put-parameter \
  --name "/monet/dev/google-places-api-key" \
  --value "VALUE_HERE" \
  --type "SecureString" \
  --overwrite \
  --profile dev

# Plaid Client ID
aws ssm put-parameter \
  --name "/monet/dev/plaid-client-id" \
  --value "VALUE_HERE" \
  --type "SecureString" \
  --overwrite \
  --profile dev

# Plaid Secret
aws ssm put-parameter \
  --name "/monet/dev/plaid-secret" \
  --value "VALUE_HERE" \
  --type "SecureString" \
  --overwrite \
  --profile dev

# Plaid Environment
aws ssm put-parameter \
  --name "/monet/dev/plaid-env" \
  --value "sandbox" \
  --type "String" \
  --overwrite \
  --profile dev

# Plaid Encryption Key
aws ssm put-parameter \
  --name "/monet/dev/plaid-encryption-key" \
  --value "VALUE_HERE" \
  --type "SecureString" \
  --overwrite \
  --profile dev
```

## Storing Parameters (Prod Stage)

When you are ready for production, repeat the commands above but change the name path from `/dev/` to `/prod/` and provide your production credentials.

```bash
# Example for Prod Plaid Secret
aws ssm put-parameter \
  --name "/monet/prod/plaid-secret" \
  --value "PROD_SECRET_HERE" \
  --type "SecureString" \
  --overwrite \
  --profile dev
```

## Verification

To verify that the parameters have been stored correctly:

```bash
aws ssm get-parameters-by-path \
  --path "/monet/dev/" \
  --with-decryption \
  --profile dev
```
