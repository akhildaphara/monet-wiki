# State-Aware Optimizer & Bilt 2.0 Blueprint

This blueprint outlines the exact architectural changes, TypeScript interfaces, and DynamoDB schema updates required to transition the Monet backend from a static-multiplier engine to a **state-aware, marginal-utility optimizer**. This unifies all complex reward structures (Bilt 2.0, Venmo dynamic tiers, etc.) under a single polymorphic rules engine.

## 1. DynamoDB Schema Updates (`UserRecord.ts`)

To calculate marginal utility based on the spend-ratio (Bilt) or category rank (Venmo), the backend must track user spend state.

**Current File:** `raw/croe/src/dynamo/model/UserRecord.ts`

**Additions to `UserRecord` Interface:**
```typescript
export interface UserRecord {
  id: string;
  showGlobalBestCard: boolean;
  plaidItems?: PlaidItem[];
  
  // --- NEW FIELDS FOR STATE-AWARE DATA --- //
  
  /**
   * Replaces selectedCardIds and customCardRewards, integrating frontend card state.
   * Keyed by cardId -> CardOverrides
   */
  cards?: Record<string, {
    nickname?: string;
    last4?: string;
    cycleStartDate?: string;
    customRewards?: Record<string, number>;
  }>;
}
```

## 2. Updated Credit Card Interfaces (`cardRewardsData.ts`)

We convert all special reward logic into a polymorphic, flexible rules engine using a discriminated union (`SpecialRewardType`). This replaces legacy `dynamicRewards`, `allowedDynamicCategories`, and the old `specialRewards` object entirely.

**Current File:** `raw/croe/src/resources/cardRewardsData.ts`

**Updated Interfaces:**
```typescript
export type SpecialRewardType = "CategorySpecial" | "RankedSpend"; 

export interface BaseSpecialReward {
  type: SpecialRewardType;
}

/**
 * Represents static overrides for specific categories (e.g., Lyft = 5x on Chase Sapphire).
 */
export interface CategorySpecialReward extends BaseSpecialReward {
  type: "CategorySpecial";
  rewards: Partial<Record<Category, number>>;
}

/**
 * Migrates the legacy `dynamicRewards` and `allowedDynamicCategories`.
 * Represents rewards based on the rank of spend in a category (e.g., Venmo, Citi Custom Cash).
 */
export interface RankedSpendReward extends BaseSpecialReward {
  type: "RankedSpend";
  tiers: { rank: number; rate: number }[]; // e.g., rank 1 gets 0.03, rank 2 gets 0.02
  allowedCategories?: Category[];
}

// Union type for the rules engine
export type SpecialReward = CategorySpecialReward | RankedSpendReward;

export interface CreditCard {
  name: string;
  rewards: Partial<Record<Category, number>>;
  note?: string;
  applyUrl?: string;
  themeColorHex?: string;
  imageName?: string;
  
  /**
   * Flexible, polymorphic field for all complex reward structures.
   * The optimizer loops through these rules. If undefined, it evaluates base rewards only.
   */
  specialRewards?: SpecialReward[];
}
```

## 3. Card JSON Definitions

Here is how the new polymorphic rules engine looks for both the new Bilt 2.0 cards AND a migrated Venmo card.

```typescript
  BILT_BLUE: {
    name: "Bilt Mastercard® (Blue)",
    rewards: {
      [Category.OTHER]: 0.01,
    },
    note: "1x points everywhere + 4% Bilt Cash. Opt for Flexible Bilt Cash.",
    themeColorHex: "#111111",
    imageName: "b.circle.fill",
  },
  
  BILT_OBSIDIAN: {
    name: "Bilt Obsidian",
    rewards: {
      [Category.DINING]: 0.03,
      [Category.GROCERY]: 0.03,
      [Category.TRAVEL]: 0.02,
      [Category.OTHER]: 0.01,
    },
    note: "3x Dining/Grocery + 2x Travel + 4% Bilt Cash. Opt for Flexible Bilt Cash.",
    themeColorHex: "#000000",
    imageName: "b.circle.fill",
  },

  BILT_PALLADIUM: {
    name: "Bilt Palladium",
    rewards: {
      [Category.OTHER]: 0.02,
    },
    note: "2x points everywhere + 4% Bilt Cash. Opt for Flexible Bilt Cash.",
    themeColorHex: "#444444",
    imageName: "b.circle.fill",
  },
  
  VENMO_CREDIT_CARD: {
    name: "Venmo Credit Card",
    rewards: {
      [Category.OTHER]: 0.01,
    },
    specialRewards: [
      { 
        type: "RankedSpend", 
        tiers: [
          { rank: 1, rate: 0.03 },
          { rank: 2, rate: 0.02 }
        ],
        allowedCategories: [Category.DINING, Category.GROCERY, Category.GAS, /* ... */]
      }
    ],
    themeColorHex: "#008CFF",
    imageName: "v.circle.fill",
  }
```

## 4. State-Aware Optimizer Architecture (`optimizer.ts`)

The `/v1/card/recommend` logic iterates through the `specialRewards` array, handling the specific logic for `RankedSpend` or `CategorySpecial`.

**New Optimizer Context:**
```typescript
interface OptimizerContext {
  userTopCategories?: Category[]; // Pre-calculated top categories for RankedSpend
  transactionAmount?: number; // Optional: Required to calculate marginal unlocks in the future
}

/**
 * Stub for future Bilt 2.0 Insights Calculation.
 * Bilt has complex logic requiring total spend, rent amount, and cycle tracking
 * to determine points earned vs Bilt Cash thresholds.
 *
 * @param cardId "BILT_BLUE" | "BILT_OBSIDIAN" | "BILT_PALLADIUM"
 * @param totalCycleSpend The total amount spent on the card this cycle
 * @param transactionAmount The amount of the current transaction
 * @param rentAmount The user's rent amount
 */
/*
export function calculateBiltInsights(
  cardId: string, 
  totalCycleSpend: number, 
  transactionAmount: number, 
  rentAmount: number
) {
  // To be implemented later: calculate rent threshold progress, 
  // point unlock thresholds, and return marginal value for this transaction.
}
*/
```

**Marginal Utility Algorithm (Pseudo-code for `getCashback`):**

```typescript
function calculateEffectiveRate(
  cardId: string,
  card: CreditCard, 
  category: Category, 
  context: OptimizerContext
): number {
  let baseRate = card.rewards[category] || 0;
  
  if (!card.specialRewards) return baseRate;

  for (const rule of card.specialRewards) {
    switch (rule.type) {
      
      case "CategorySpecial":
         if (rule.rewards[category]) {
             baseRate = Math.max(baseRate, rule.rewards[category]);
         }
         break;

      case "RankedSpend":
        if (context && context.userTopCategories) {
          if (!rule.allowedCategories || rule.allowedCategories.includes(category)) {
            // Top categories are pre-calculated and sorted by the backend/frontend.
            // We just find the index to determine the rank (1-indexed).
            const currentRank = context.userTopCategories.indexOf(category) + 1;
            const matchedTier = rule.tiers.find(t => t.rank === currentRank);
            if (matchedTier) {
              baseRate = Math.max(baseRate, matchedTier.rate);
            }
          }
        }
        break;
    }
  }
  
  return baseRate;
}
```

## 5. Required Plaid Sync Updates (`syncInsights.ts`)

To support cycle-based insights, Plaid syncs should compute aggregates and save them to a separate Insights table (or a dedicated insights field, decoupled from the core UserRecord).
1. The `/v1/plaid/sync` webhook must aggregate transactions within the current billing cycle.
2. It aggregates a global spend sum for cards like Bilt (useful for UI banners, even if not used in the optimizer).
3. It aggregates category-specific spend sums for `RankedSpend` cards (used in the optimizer).
4. These states are saved via atomic DynamoDB commands to an Insights store.

## 6. iOS Codebase Updates

### 6.1 `MonetApp/Models/DataStore.swift`
- **Remove Legacy Logic**: The `biltRentThreshold` logic is removed from the client-side `DataStore`. Since the backend now calculates marginal utility and state-aware rewards, the frontend no longer needs to track rent thresholds locally.
- **State-Aware UI**: The `DataStore` will now refer to the `insights` field (fetched from the backend) to determine which banners or reward messages to display. This ensures the UI is always in sync with the backend's holistic view of the user's spend.

### 6.2 `MonetApp/Views/CardSetupWalkthroughView.swift` & `EditCardRewardsView.swift`
- **Backend Sync for Overrides**: `cardOverrides` (formerly `customCardRewards`) are no longer stored solely in local `UserDefaults`. 
- **Implementation**:
    - When a user sets a nickname or last 4 digits in `CardSetupWalkthroughView`, or modifies reward multipliers in `EditCardRewardsView`, the `DataStore` triggers an asynchronous sync to the backend.
    - This ensures that user customizations are persisted in the DynamoDB `UserRecord` under the `cardOverrides` field, making them available across devices and sessions.

### 6.3 Bilt 2.0 Card Presentation & Acquisition
- **Card Catalog Integration**: The Bilt 2.0 card family (Blue, Obsidian, Palladium) is added to the card selection UI.
- **Apply Links**: If a card definition in `cardRewardsData.ts` contains an `applyUrl`, the UI will display a "Learn More" or "Apply" button. This allows users to easily acquire the new Bilt 2.0 cards directly from the Monet app.
