# Native Apple Intelligence Roadmap

Future implementation brief for Monet's privacy-first native Apple intelligence features.

## Scope

This document covers three connected capabilities:

1. Merchant and category clarification.
2. Siri and Spotlight actions.
3. Offline explanations based on cached wallet and recommendation data.

The guiding principle is:

> Apple's on-device model understands the user's language; Monet's existing deterministic engine decides the financial answer.

Foundation Models should interpret, classify, and explain. It must not independently calculate reward rates, caps, eligibility, or card rankings.

## Existing Monet foundations

The implementation should reuse the current sources of truth:

- `MonetApp/Services/CategorizerService.swift` — categorization orchestration.
- `MonetApp/Models/PlacesCache.swift` — local merchant/category cache.
- `MonetApp/Models/BusinessOverride.swift` — user corrections.
- `MonetApp/Models/LocalRecommender.swift` — offline best-card calculation.
- `MonetApp/Models/RewardStore.swift` — cached card reward data.
- `MonetApp/Services/InsightsManager.swift` — cached Insights responses.
- `MonetApp/Models/DataStore.swift` — wallet, account, and local app state.
- `Monet Widget/` — existing widget extension and App Intent configuration surface.

The app currently targets iOS 26.1, making the Foundation Models and modern App Intents APIs viable for the primary release target.

## Proposed architecture

Add a small local intelligence layer in the iOS app:

```text
MonetApp/
├── Services/
│   ├── MerchantClarificationService.swift
│   ├── RecommendationExplanationService.swift
│   └── MonetIntentRouter.swift
└── Models/
    └── MonetIntelligenceModels.swift
```

### `MerchantClarificationService`

Responsibilities:

- Check user overrides, local cache, and known category synonyms first.
- Use Foundation Models only for unknown or ambiguous natural-language input.
- Return typed structured output.
- Ask for confirmation when confidence is low.
- Persist confirmed choices through the existing override flow.

### `RecommendationExplanationService`

Responsibilities:

- Accept deterministic recommendation facts.
- Generate concise, user-facing explanations with Foundation Models.
- Use only cached wallet/card/recommendation data for offline explanations.
- Fall back to existing static reasoning when the model is unavailable.

### `MonetIntentRouter`

Responsibilities:

- Receive App Intent requests.
- Invoke the same clarification and recommendation services used by the main app.
- Route foreground requests to Search or Insights.
- Return short inline results when the request can be completed safely in the background.

Business logic should remain in shared services, not inside a widget extension or individual App Intent.

## Feature 1: Merchant and category clarification

### User problem

Users do not always enter a merchant name that maps cleanly to one category:

- `Whole Foods`
- `Apple`
- `Uber`
- `Target`
- `coffee`
- `my flight`

The system should understand the likely meaning without replacing Monet's existing rules, cache, or manual correction system.

### Proposed model

```swift
struct MerchantClarification: Codable, Equatable, Sendable {
    let merchantName: String?
    let category: Category
    let confidence: Double
    let alternatives: [Category]
    let needsConfirmation: Bool
    let explanation: String?
}
```

The model should produce guided structured output rather than free-form text.

### Resolution order

```text
User override
    ↓
Local PlacesCache / known merchant map
    ↓
Category synonym and direct-match rules
    ↓
Foundation Models clarification
    ↓
Existing backend categorizer, when online and appropriate
    ↓
Manual category picker
```

The model should not run for every search. Existing deterministic paths are faster, cheaper, and more predictable.

### Example behavior

For `Uber Eats`:

```text
We think this is Dining
Uber Eats · 92% confidence

[Use Dining] [Choose another category]
```

For `Apple`:

```text
Which type of Apple purchase was this?

[Electronics] [Streaming / Subscription] [Other]
```

For `my flight`:

```text
We think this is Travel / Airline

[Use Travel] [Choose another category]
```

### Confidence behavior

Suggested starting thresholds:

- `0.90+`: resolve automatically, with an unobtrusive correction option.
- `0.70–0.89`: show the proposed category and request confirmation.
- `< 0.70`: show alternatives or use the manual category picker.

These values should be treated as product defaults and validated with real user corrections rather than assumed to be model truth.

### Correction and learning

Confirmed choices should use the existing `BusinessOverride` and backend synchronization paths. Do not create a second AI-specific correction store.

The app may use corrections to improve local matching and analytics, but should not silently retrain or alter reward rules.

## Feature 2: Siri and Spotlight actions

### Initial App Intent surface

Start with two user-facing actions and one navigation intent.

#### `FindBestCardIntent`

Example requests:

```text
Hey Siri, what is my best Monet card for dining?
Show me the best card for groceries.
```

Parameters:

- `category: Category` using `AppEnum` where practical.
- Optional merchant name.

This can normally complete from cached wallet and reward data.

#### `CheckMerchantIntent`

Example requests:

```text
Which Monet card should I use at Starbucks?
Which card should I use for a $500 hotel booking?
```

Parameters:

- `merchantText: String`.
- Optional `amount`.
- Optional `category`.
- Optional purchase date.

The intent should call the same flow as Search:

```text
App Intent
    ↓
MerchantClarificationService
    ↓
LocalRecommender / existing reward engine
    ↓
Recommendation result
```

#### `OpenInsightsIntent`

Opens Monet directly to the Insights tab. It should not expose transaction-level data through a locked or background system surface.

### App Shortcuts

Provide a small set of explicit shortcuts:

- `Find the best card for dining`.
- `Find the best card for groceries`.
- `Check a purchase in Monet`.
- `Open Monet Insights`.

Phrases should be concrete and task-oriented. Do not expose every Monet screen as an intent.

### Spotlight

Spotlight should make these discoverable:

- Monet categories.
- Common merchants.
- Best-card actions for common categories.
- A Search action that opens Monet with the merchant prefilled.

Do not index raw transactions, account identifiers, balances, or missed-reward totals.

Use small system-facing entities rather than exposing the full `Card`, `User`, Plaid, or transaction models:

```swift
struct MonetCategoryEntity: AppEntity {
    let id: String
    let displayName: String
}
```

### Widget integration

The existing widget target contains sample timer-oriented App Intents. Replace or supplement those with Monet-specific actions after the shared service layer exists.

Potential widget actions:

- Best card for a selected category.
- Open a planned purchase flow.
- Open Search with a merchant prefilled.

The widget should display category-level recommendations and avoid sensitive transaction-level explanations on the lock screen.

### Foreground and background policy

| Action | Background-safe | Required behavior |
|---|---:|---|
| Best card for Dining | Yes | Return cached wallet recommendation |
| Best card for a merchant | Usually | Use cached merchant/category data |
| Category clarification | Usually | Return clarification or open the app for confirmation |
| Monthly missed rewards | Prefer no | Open Monet and require app unlock |
| Recent transaction explanation | No | Require foreground and app unlock |
| Change wallet or preference | No | Require foreground confirmation |

Use modern App Intents execution modes rather than relying on deprecated `openAppWhenRun` behavior.

## Feature 3: Offline explanations

### User problem

Monet already knows why a card won, but the explanation should be understandable and available when the device is offline.

### Explanation input

The model should receive a compact, already-computed context:

```swift
struct RecommendationExplanationContext: Codable, Sendable {
    let merchant: String?
    let category: Category
    let winningCardName: String
    let winningRate: Double
    let alternatives: [CardRate]
    let assumptions: [String]
    let source: String
}
```

For Insights:

```swift
struct InsightsExplanationContext: Codable, Sendable {
    let totalSpend: Double
    let actualEarnings: Double
    let optimalEarnings: Double
    let missedEarnings: Double
    let topOpportunities: [CategoryOpportunity]
    let periodDescription: String
}
```

The model should not receive raw transaction history unless a future feature explicitly requires it.

### Example recommendation explanation

```text
Use Freedom Flex for this purchase. It earns 5% in your current grocery category, compared with 1% on Sapphire Preferred.
```

### Example Insights explanation

```text
Dining was your biggest missed-reward category this month. You spent $326 and earned 1%, while another card in your wallet could have earned 3%.
```

### Explanation rules

- Never invent a reward rate.
- Never omit a material assumption.
- Use approximate language for estimates.
- Mention when a category was manually corrected.
- Mention when data is cached or stale.
- Keep explanations short by default.
- Offer a “Why?” expansion for more detail.

### Fallback hierarchy

```text
Foundation Models available
    → generate local explanation

Foundation Models unavailable
    → use deterministic static explanation templates

No network but cached wallet data available
    → local recommendation + local/static explanation

No network and no usable cache
    → show the existing offline state
```

Static fallback examples:

```text
Best card: Freedom Flex
Earns 5% for Grocery

This is based on your cached wallet and card reward data.
```

## Privacy and security requirements

- Keep merchant clarification and explanation on-device whenever possible.
- Do not send Plaid credentials, account IDs, card numbers, or raw transaction history to Foundation Models.
- Do not expose raw transactions through Spotlight.
- Require app unlock for transaction-level Insights and sensitive totals.
- Treat Siri and widget output as potentially visible outside the app.
- Clearly label stale cached data.
- Keep cloud Bedrock categorization separate from native on-device intelligence.
- Update the privacy policy to distinguish on-device AI from cloud AI processing.

## Availability and degradation

Foundation Models depends on Apple Intelligence-capable hardware, region, user settings, and model readiness. The app must check availability before creating a session.

The core app must remain fully functional without Foundation Models:

```text
Model available + online
    → local AI clarification/explanation, backend fallback as needed

Model available + offline
    → local AI clarification/explanation from cached data

Model unavailable + online
    → existing categorizer/backend and static explanations

Model unavailable + offline
    → existing category-only offline flow and deterministic explanations
```

The AI layer must never block Search, wallet access, or the existing offline recommendation path.

## Suggested implementation phases

### Phase 1: local clarification

1. Add `MonetIntelligenceModels.swift`.
2. Add `MerchantClarificationService.swift`.
3. Integrate it only after existing cache/rule resolution fails.
4. Add confidence and confirmation UI to Search.
5. Persist confirmed categories through existing overrides.
6. Add unavailable/offline fallback states.

### Phase 2: offline explanations

1. Add `RecommendationExplanationService.swift`.
2. Convert current recommendation output into a structured explanation context.
3. Generate short local explanations from cached data.
4. Add static templates as a reliable fallback.
5. Add a compact explanation section to `RecommendationCardView` and Insights.

### Phase 3: Siri and Spotlight

1. Add shared App Intent models and services.
2. Implement `FindBestCardIntent`.
3. Implement `CheckMerchantIntent`.
4. Implement `OpenInsightsIntent`.
5. Add `AppShortcutsProvider` phrases.
6. Add category entities for Spotlight.
7. Replace the sample widget intents with Monet actions.
8. Test foreground, background, locked, offline, and unavailable-model states.

## Validation checklist

### Merchant clarification

- Known merchant resolves without invoking the model.
- Ambiguous merchant shows alternatives.
- User confirmation creates the same override as manual categorization.
- Low-confidence output never silently changes the category.
- Model-unavailable behavior matches current manual flow.

### Siri and Spotlight

- Category recommendation works from cached wallet data.
- Merchant recommendation handles unknown merchants gracefully.
- Spotlight does not reveal private transaction data.
- Locked-device behavior is safe.
- Intent execution does not depend on a view being mounted.
- Intent business logic is shared with the main app.

### Offline explanations

- No network request is required.
- Explanations match deterministic reward calculations.
- Stale cache state is visible.
- Static fallback remains understandable.
- No sensitive raw transaction data is passed to the model.

## Success criteria

The implementation is successful when:

- Users can clarify ambiguous merchants with fewer manual corrections.
- Users can ask Siri for a card recommendation using cached wallet data.
- Monet appears in Spotlight for useful category and merchant actions.
- Recommendation explanations work offline.
- Every financial claim shown to the user can be traced to Monet's deterministic reward engine.
- The app remains useful on devices without Foundation Models.
