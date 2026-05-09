The [[Card-Optimizer]] is a core logic component of the [[Croe-Backend]] that determines the credit card offering the highest return for a specific transaction category. Its primary purpose is to cross-reference the user's available cards against known reward structures to maximize cashback or points. It is used both in real-time merchant search (via the `/v1/categorize` endpoint) and in the [[Plaid-Integration|Insights Engine]] for retrospective analysis of actual vs. optimal spending.

## How It Works
The optimizer functions by evaluating a transaction's category and comparing it to the reward profiles of the cards in the user's wallet.

1. **Card Data Source**: Uses `CREDIT_CARDS` and `SUPPORTED_CARDS` loaded from static resource files (`resources/cardRewardsData.ts`). Now supports **dynamic overrides** where user-specific card data (e.g., custom multipliers for Venmo or Zolve) is merged with static definitions.
2. **Reward Calculation**: Uses the `getCashback(cardKey, categoryKey, userCustomRewards)` function. This calculation evaluates multipliers in strict precedence:
   1. **User Custom/Dynamic Rewards**: Overrides static values based on user configuration.
   2. **Dynamic Potential**: Highest potential rate if no specific override exists.
   3. **Special Rewards**: Fixed promotional or quarterly bonus categories.
   4. **Standard Rewards**: Base category multiplier with fallback logic (e.g., `HOTEL` and `CAR_RENTAL` fall back to general `TRAVEL`).
   5. **Base Rate**: `OTHER` category rate fallback.
3. **Wallet Filtering**: When `findBestCardsForUser` is invoked with a user's wallet, it filters to valid cards and iterates over all categories to determine the highest yielding card.

## Usage in Insights Engine
The optimizer is also used by the [[Plaid-Integration|Insights Engine]] to compute:
- **Actual Earnings**: Based on real transaction data and user-defined card mappings.
- **Wallet Optimal**: The best rate across the user's current wallet.
- **Global Optimal**: The best rate across *all* supported cards (including new cards like Venmo and Zolve).
- **Incremental Card Value**: Powering the "Best New Card" suggestion by analyzing potential gains from adding a specific card to the wallet.

## Categorization Pipeline
The categorizer (`categorizer.ts`) feeds categories to the optimizer via a two-stage process:

1. **Local Brand Rule Engine** (`brandCategoryMap.ts`): ~900+ entries with exact, domain, substring, and fuzzy matching. Returns immediately for known brands.
2. **Google Places API Fallback** (`placesService.ts`): Queries the Places API, maps returned MCC/place types to internal categories.
3. **Plaid Category Mapping** (`plaidCategoryMap.ts`): For transaction-based analysis (insights), maps Plaid's `primaryPersonalFinanceCategory` to internal categories with high-value merchant name overrides.

## Dependencies
- Relies on the categorization engine (`categorizer.ts`, `brandCategoryMap.ts`, `placesService.ts`, `plaidCategoryMap.ts`) to provide an accurate category for the business.
- Requires up-to-date credit card reward data. A potential area for improvement (as noted in My Interests in AGENTS.md) is adding or updating credit card rewards data to keep the engine accurate.