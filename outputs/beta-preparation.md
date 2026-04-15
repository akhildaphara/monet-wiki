# Beta Preparation Checklist

Before launching Monet into a beta testing phase, several key features, configurations, and administrative tasks need to be completed to ensure a smooth, stable, and valuable experience for early testers.

## 1. Backend Infrastructure & Environment
- [ ] **Deploy API Server:** Move the `croe` Node.js backend from a local `tsx watch` environment to a robust cloud provider (e.g., AWS Lambda with API Gateway, Heroku, or a managed Node.js container service like Render/Railway).
- [ ] **Provision Production DynamoDB:** Create the production DynamoDB tables (`MonetUsers`, `MonetOverrides`, `MonetTransactions`) in the target AWS account (e.g., `us-east-1`). Ensure BillingMode is set to `PAY_PER_REQUEST` (On-Demand) to handle beta traffic spikes cost-effectively.
- [ ] **Secure API Keys:** Ensure production environment variables (e.g., `GOOGLE_CLIENT_ID`, `GOOGLE_PLACES_API_KEY`, AWS Credentials) are securely stored in a secrets manager and injected into the production backend, replacing the `.env` local setup.
- [ ] **Set Base URL in iOS App:** Update the `baseURL` in `MonetApp/Services/APIClient.swift` from the local dev IP (`http://100.115.243.9:3000/v1`) to the new production/beta API domain (e.g., `https://api.croe.ai/v1`).

## 2. iOS App Polish & Stability
- [ ] **Testflight Configuration:** Set up the app in App Store Connect and create a TestFlight group for beta testers.
- [ ] **App Icon & Branding:** Ensure high-resolution production app icons (currently `AppIcon.appiconset`) and splash screens are correctly configured and look professional.
- [ ] **Onboarding Flow:** Create a brief, visually appealing 2-3 screen onboarding tutorial explaining *how* Monet works (Search -> Get Card -> Pay) before dropping the user into the Google Sign-In prompt.
- [ ] **Empty States & Feedback:** Ensure all empty states (e.g., an empty wallet in `CardWalletView`) have clear calls-to-action. Ensure haptic feedback (Taptic Engine) works reliably on manual overrides and successful categorizations.
- [ ] **Error Handling UI:** Verify that backend 500 errors or extreme latency gracefully degrade in the UI rather than trapping the user in infinite `ProgressView` spinners. The recent `ResolutionSource.fallback` offline implementation helps here, but visual communication of the offline state needs QA.

## 3. Data & Algorithms
- [ ] **Audit Card Catalog:** Review `cardRewardsData.ts`. Ensure the 14 currently supported cards (`CHASE_SAPPHIRE_PREFERRED`, `AMAZON_VISA`, `DISCOVER_IT`, etc.) have accurate, up-to-date reward multipliers and correctly mapped `Category` enums.
- [ ] **Handle "Apple Pay" Nuances:** Implement a way for the optimizer to know if a user intends to use Apple Pay (or assume they always do if the card supports it) to correctly calculate the Apple Card's 2% vs 1% return.
- [ ] **Dynamic Rotating Categories:** Discover `DISCOVER_IT` and Chase `CHASE_FREEDOM_FLEX` have rotating 5% quarterly categories. These are currently hardcoded. Before beta, either implement a dynamic cron-job to update these, or at least hardcode the correct categories for the *current* quarter of the beta test.

## 4. Analytics & Observability
- [ ] **Crash Reporting:** Integrate a lightweight crash reporter (e.g., Sentry, Firebase Crashlytics, or Apple's built-in MetricKit) to catch Swift 6 concurrency crashes or unexpected unwrapping failures in the wild.
- [ ] **Backend Logging:** Ensure the Express request/response logs in `index.ts` are being aggregated into a searchable service (e.g., CloudWatch Logs, Datadog) so backend failures can be traced back to specific `userId`s or `merchantName` queries during the beta.

## 5. Legal & Compliance
- [ ] **Privacy Policy & Terms of Service:** Draft basic Privacy Policy and Terms of Service documents. Google Sign-In requires a link to a Privacy Policy to verify the OAuth consent screen.
- [ ] **Google OAuth Verification:** Submit the Google OAuth consent screen for verification in the Google Cloud Console to remove the "Unverified App" warning for beta testers signing in.

## 6. Feedback Loop
- [ ] **In-App Feedback Mechanism:** Add a simple "Send Feedback" button in the `ProfileView` that opens an email draft to the developer or links to a simple Typeform/Google Form so testers can easily report missing cards, incorrect categorizations, or UI bugs.