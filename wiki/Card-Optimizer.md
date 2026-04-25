The [[Card-Optimizer]] is a core logic component of the [[Croe-Backend]] that determines the credit card offering the highest return for a specific transaction category. Its primary purpose is to cross-reference the user's available cards against known reward structures to maximize cashback or points. It is used both in real-time merchant search (via the `/v1/categorize` endpoint) and in the [[Plaid-Integration|Insights Engine]] for retrospective analysis of actual vs. optimal spending.

## How It Works
The optimizer functions by evaluating a transaction's category (as determined by the `categorizer.ts` service, which maps business names to categories via local rules and the Google Places API) and comparing it to the reward profiles of the cards in the user's wallet.

1. **Card Data Source**: Uses `CREDIT_CARDS` and `SUPPORTED_CARDS` loaded from static resource files (`resources/cardRewardsData.ts`).
2. **Reward Calculation**: Uses the `getCashback(cardKey, categoryKey)` function to find the exact percentage or points multiplier a specific card offers for a category. This calculation factors in special bonus categories (e.g., rotating quarterly categories like Discover or Chase Freedom).
3. **Wallet Filtering**: When `findBestCardsForUser` is invoked with a user's wallet (an array of card keys), it filters to valid cards and iterates over all defined `Category` enums to determine the highest yielding card for each possible transaction type.

## Usage in Insights Engine
The optimizer is also used by the [[Plaid-Integration|Insights Engine]] (`syncInsights.ts`) to compute:
- **Actual Earnings**: `getCashback(mappedCardId, category) × amount` for the card the user actually used.
- **Wallet Optimal**: The best rate across the user's `selectedCardIds` for each transaction.
- **Global Optimal**: The best rate across *all* `SUPPORTED_CARDS` for each transaction.
- **Incremental Card Value**: For cards the user doesn't own, how much additional earnings each card would have generated — used to power the "Best New Card" suggestion.

## Categorization Pipeline
The categorizer (`categorizer.ts`) feeds categories to the optimizer via a two-stage process:

1. **Local Brand Rule Engine** (`brandCategoryMap.ts`): ~900+ entries with exact, domain, substring, and fuzzy matching. Returns immediately for known brands.
2. **Google Places API Fallback** (`placesService.ts`): Queries the Places API, maps returned MCC/place types to internal categories.
3. **Plaid Category Mapping** (`plaidCategoryMap.ts`): For transaction-based analysis (insights), maps Plaid's `primaryPersonalFinanceCategory` to internal categories with high-value merchant name overrides.

## Dependencies
- Relies on the categorization engine (`categorizer.ts`, `brandCategoryMap.ts`, `placesService.ts`, `plaidCategoryMap.ts`) to provide an accurate category for the business.
- Requires up-to-date credit card reward data. A potential area for improvement (as noted in My Interests in AGENTS.md) is adding or updating credit card rewards data to keep the engine accurate.