# App Store Connect privacy questionnaire

Draft for Monet iOS 0.8.0 · November 21, 2026

| Question | Draft answer |
| --- | --- |
| Do you or your third-party partners collect data from this app? | **Yes** |
| Do you or your third-party partners use this data to track users? | **No**, based on source review. Confirm that vendors and launch-stage settings restrict use to service delivery, analytics, and diagnostics. |
| Privacy policy URL | https://tapmonet.com/privacy |
| Privacy choices URL | https://tapmonet.com/contact, if it remains the contact point for privacy requests. The app also exposes account deletion and bank disconnection. |

For each row, select the listed purposes in App Store Connect. The draft assumes Plaid Insights, account sync, feedback, TelemetryDeck and crash-report uploads are enabled in the public build. Check the production archive and partner settings before publishing the label.

| Apple data type | Linked to identity | Purpose | Basis |
| --- | --- | --- | --- |
| Name and Email Address | Yes | App Functionality | Native signup, Apple and Google sign-in, account management, support |
| User ID | Yes | App Functionality, Analytics | Account and guest identifiers, plus the stable hashed identifier sent to TelemetryDeck |
| Device ID | Yes | App Functionality, Analytics | Install deduplication and stable vendor-derived analytics identifier for guests |
| Payment Info | Yes | App Functionality, Product Personalization | Issuer and product selections in synced wallets and linked card/account metadata |
| Other Financial Info | Yes | App Functionality, Product Personalization | Optional Plaid account and transaction data used in Insights |
| Purchase History | Yes | App Functionality, Product Personalization | Imported merchant, date, amount, and category records associated with the account |
| Search History | Yes | App Functionality, Product Personalization | Merchant names in signed-in overrides and feedback, plus the categorization audit for some recommendation requests |
| Precise Location | Yes | App Functionality | The recommendation audit can retain coordinates and a request correlation ID when a merchant search includes location |
| Other User Content | Yes | App Functionality, Product Personalization | Saved reward and category overrides and submitted recommendation corrections |
| Customer Support | Yes | App Functionality | Submitted feedback and diagnostics included with support requests |
| Product Interaction | Yes | Analytics | App lifecycle and feature events with a stable analytics identifier |
| Crash Data, Performance Data, and Other Diagnostic Data | Yes | App Functionality, Analytics | The crash endpoint can log a user ID alongside report summaries, crashes and hangs, and include user ID and breadcrumbs in notification emails |

### Confirm against the release configuration

- **Location.** Check Google Places retention and any collection of approximate location or address-only data in the release configuration. Select Coarse Location as well if that data is collected separately.
- **Diagnostics.** Check Lambda crash-log and email retention, access scope, and payload fields. Source review found a signed-in user ID in the server-side crash log.
- **Partner practices.** Check the submitted archive’s privacy report, Plaid Link, Google Sign-In and Places, and TelemetryDeck collection. Hashing a stable analytics identifier alone does not make it unlinked.
- **Policy consistency.** Reconcile the public policy’s analytics and authentication descriptions with stable hashed analytics IDs, native email signup, and crash reports that can be associated with an account. Confirm data retention, deletion, and the public support address.

[Apple’s App Privacy questionnaire guidance](https://developer.apple.com/app-store/app-privacy-details/)
