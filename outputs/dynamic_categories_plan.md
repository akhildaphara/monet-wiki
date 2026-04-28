# Implementation Plan: Dynamic Category Rewards

This plan outlines how to handle credit cards with dynamic rewards (e.g., Venmo, Zolve) where the cashback percentage depends on the user's top spending categories. We will leverage the existing Plaid integration to calculate top spending categories and use the `customCardRewards` field in `UserContext` to persist these dynamic rates.

## 1. Update Card Data Schema (`cardRewardsData.ts`)

First, we need to define the dynamic rules for these cards. We'll extend the `CreditCard` interface to support dynamic reward tiers and allowed categories.

```typescript
export interface DynamicRewardTier {
  rank: number; // 1 for top spend, 2 for second top spend, etc.
  rate: number; // The cashback percentage (e.g., 0.03 for 3%)
}

export interface CreditCard {
  // ... existing fields ...
  dynamicRewards?: DynamicRewardTier[];
  allowedDynamicCategories?: Category[];
}
```

**Implementation for Venmo and Zolve:**
```typescript
VENMO_CREDIT_CARD: {
  name: "Venmo Credit Card",
  rewards: { [Category.OTHER]: 0.01 },
  dynamicRewards: [
    { rank: 1, rate: 0.03 },
    { rank: 2, rate: 0.02 }
  ],
  allowedDynamicCategories: [
    Category.DINING, Category.TRAVEL, Category.GROCERY, 
    Category.GAS, Category.HEALTH, Category.ENTERTAINMENT
    // Add any specific allowed categories according to Venmo's terms
  ],
  // ...
},

ZOLVE_CREDIT_CARD: {
  name: "Zolve Credit Card",
  rewards: { [Category.OTHER]: 0.01 },
  dynamicRewards: [
    { rank: 1, rate: 0.05 },
    { rank: 2, rate: 0.03 }
  ],
  // Define allowed categories for Zolve...
}
```

## 2. Compute Top Spend Categories (`syncInsights.ts`)

We will use the `syncInsights` API as the trigger to calculate these dynamic rewards since it already fetches all user transactions and receives the `plaidCardMappings` (which links a Plaid `accountId` to a `cardId`).

**Algorithm:**
1. Check if any card in `plaidCardMappings` has `dynamicRewards` defined in `CREDIT_CARDS`.
2. For each dynamic card, filter the user's transactions for the specific `accountId` over the current billing cycle (e.g., past 30 days).
3. Group the transactions by category, summing the spend.
4. Filter out any categories not present in `allowedDynamicCategories`.
5. Sort the categories by total spend descending.
6. Map the top categories to their respective rates defined in `dynamicRewards` (e.g., Top 1 -> 3%, Top 2 -> 2%).

## 3. Persist Dynamic Rewards to DB (`UserContext`)

We can elegantly use the existing `customCardRewards` map in the `USERS_TABLE` to store these calculated rates.

```typescript
// Example calculated map for Venmo:
const calculatedRewards = {
  VENMO_CREDIT_CARD: {
    [Category.DINING]: 0.03, // Top spend
    [Category.GROCERY]: 0.02 // Second top spend
  }
};
```

During `syncInsights`, after calculating the new dynamic rewards:
1. Compare them against the user's existing `customCardRewards`.
2. If they have changed (e.g., the top spend category shifted from Dining to Grocery), call `updateUserCardRewards` to persist the new rates to the database.

## 4. Update the Optimizer (`optimizer.ts`)

The `getCashback` function needs to accept and prioritize the user's custom rewards so that both Insights and the Real-Time Categorizer can respect the newly calculated dynamic rates.

```typescript
export function getCashback(
  cardKey: string, 
  categoryKey: Category, 
  userCustomRewards?: Record<string, Record<string, number>>
): number {
  const card: CreditCard | undefined = CREDIT_CARDS[cardKey];
  if (!card) return 0;

  // 1. Check User Custom/Dynamic Rewards FIRST
  if (userCustomRewards && userCustomRewards[cardKey] && userCustomRewards[cardKey][categoryKey] !== undefined) {
    return userCustomRewards[cardKey][categoryKey];
  }

  // 2. Check special bonus categories
  if (card.specialRewards && card.specialRewards[categoryKey] !== undefined) {
    return card.specialRewards[categoryKey] as number;
  }

  // 3. Fallback to standard rewards
  return card.rewards[categoryKey] || card.rewards[Category.OTHER] || 0;
}
```

You will also need to update `findBestCardForCategory` and `findBestCardsForUser` to accept `userCustomRewards` and pass it down to `getCashback`.

## 5. Pass Custom Rewards to Endpoints

- **`/v1/insights` (`syncInsights.ts`)**: Since `syncInsights` computes or fetches the user's `customCardRewards`, it should pass them to `buildCategoryRateLookup`.
- **`/v1/categorize`**: This endpoint handles real-time merchant searches. It will need to fetch the `UserContext` from the DB (if it doesn't already) to pass `user.customCardRewards` to the optimizer, ensuring the UI shows the accurate 3% for Venmo when the user searches for a restaurant.
