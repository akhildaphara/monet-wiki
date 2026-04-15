The [[Card-Optimizer]] is a core logic component of the [[Croe-Backend]] that determines the credit card offering the highest return for a specific transaction category. Its primary purpose is to cross-reference the user's available cards against known reward structures to maximize cashback or points.

## How It Works
The optimizer functions by evaluating a transaction's category (as determined by the `categorizer.ts` service, which maps business names to categories via local rules and the Google Places API) and comparing it to the reward profiles of the cards in the user's wallet.

1. **Card Data Source**: Uses `CREDIT_CARDS` and `SUPPORTED_CARDS` loaded from static resource files (`resources/cardRewardsData.js`).
2. **Reward Calculation**: Uses the `getCashback(cardKey, categoryKey)` function to find the exact percentage or points multiplier a specific card offers for a category. This calculation factors in special bonus categories (e.g., rotating quarterly categories like Discover or Chase Freedom).
3. **Wallet Filtering**: When `findBestCardsForUser` is invoked with a user's wallet (an array of card keys), it filters to valid cards and iterates over all defined `Category` enums to determine the highest yielding card for each possible transaction type.

## Dependencies
- Relies on the categorization engine (`categorizer.ts`, `brandCategoryMap.js`, `placesService.js`) to provide an accurate category for the business.
- Requires up-to-date credit card reward data. A potential area for improvement (as noted in My Interests in AGENTS.md) is adding or updating credit card rewards data to keep the engine accurate.