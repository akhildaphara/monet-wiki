# Supporting the New Bilt 2.0 Ecosystem

In early 2026, Bilt introduced "Bilt 2.0", a major overhaul of their rewards structure and credit card lineup. The core concept fundamentally changed from a flat 1x on rent to a **dynamic, sliding-scale earning rate** that depends entirely on a user's *non-housing* (everyday) spend relative to their rent/mortgage payment.

This creates a unique challenge for the Monet app's `Card-Optimizer` engine, which currently assumes credit cards have fixed, static multipliers.

## The Bilt 2.0 Problem

Bilt now offers three card tiers (Blue, Obsidian, Palladium) alongside the Legacy Wells Fargo Bilt World Elite Mastercard.

For the new Bilt 2.0 cards (Blue, Obsidian, Palladium), the earning rate on rent/mortgage isn't fixed at 1x. Instead, it's determined by the following formula:

**Automatic Tiered Housing Rewards**
*   **Spend <25% of rent on other purchases:** Earn flat 250 points total.
*   **Spend 25% of rent on other purchases:** Earn 0.5x points on rent.
*   **Spend 50% of rent on other purchases:** Earn 0.75x points on rent.
*   **Spend 75% of rent on other purchases:** Earn 1.0x points on rent.
*   **Spend 100%+ of rent on other purchases:** Earn 1.2x points on rent.

*(Note: The new cards also use a parallel "Bilt Cash" system where non-housing spend earns 4% Bilt Cash, which can be applied directly to rent, but for the sake of points optimization, the sliding scale above is the primary mechanic).*

### Why this breaks the current Monet Optimizer

The current Monet architecture in `raw/croe/src/optimizer.ts` uses static multipliers:

```typescript
export const CREDIT_CARDS: Record<string, CreditCard> = {
  BILT_MASTERCARD: {
    name: "Bilt World Elite Mastercard®",
    rewards: {
      [Category.DINING]: 0.03,
      [Category.TRAVEL]: 0.02,
      [Category.OTHER]: 0.01,
      // How do we handle [Category.RENT]? It depends on the user's *other* spending!
    }
  }
}
```

The optimizer evaluates a single transaction in a vacuum. It asks: *"For this $50 dining transaction, what is the best card?"* 

It does **not** look at the user's broader spending history to say: *"You need to spend $300 more on your Bilt card this month to hit your 75% rent threshold, so you should sacrifice the 4x Dining on Amex Gold and use Bilt here to unlock thousands of rent points."*

## Proposed Solution & Action Plan

To support Bilt 2.0 (and similar complex, conditional reward structures like minimum spend bonuses), we need to evolve the backend from a stateless, static optimizer to a **state-aware, holistic optimizer**.

### Phase 1: Database & Model Updates
We must know the user's rent amount and track their current monthly spend on the Bilt card.

1.  **Update `UserContext` (`dao.ts`)**:
    *   Add fields for `rentAmount: number`.
    *   Add tracking for `currentBiltSpend: number` (reset monthly).
2.  **Update `CardRewardsData.ts`**:
    *   Create new entries for `BILT_BLUE`, `BILT_OBSIDIAN`, and `BILT_PALLADIUM`.
    *   Introduce a new property in the `CreditCard` interface: `isDynamicTarget: boolean` or `targetCondition: Goal`.

### Phase 2: Enhancing the Optimizer Engine (`optimizer.ts`)
The optimizer must calculate the **marginal utility** of using the Bilt card for a non-rent transaction.

1.  **The Marginal Value Calculation**: 
    If a user's rent is $2,000, and they have spent $450 on Bilt this month:
    *   They are currently at the `<25%` tier (flat 250 points).
    *   If they spend $50 more, they cross the 25% threshold ($500), unlocking `0.5x` on their $2,000 rent = 1,000 points.
    *   Therefore, the *true* value of that $50 transaction on the Bilt card isn't just $50 * 1x base = 50 points. It's 50 base points + 750 unlocked rent points = **800 points**.
    *   800 points on a $50 transaction is a **16x multiplier**. The Bilt card should *win* the recommendation over an Amex Gold (4x).

2.  **New Recommendation Logic**:
    *   When the user asks for a card recommendation (`/v1/card/recommend`), the engine must:
        *   Check if the user holds a Bilt 2.0 card.
        *   Calculate the base rewards for all cards in their wallet.
        *   Calculate the marginal "unlock" value if the transaction is put on the Bilt card.
        *   If `(Base Bilt Points + Unlocked Rent Points) > (Base Points of Best Alternative Card)`, recommend Bilt.

### Phase 3: Plaid Integration Dependency
To make Phase 2 work automatically, we **must** restore the Plaid Integration (`v1/plaid/transactions`). 
Without Plaid, Monet has no way of knowing how much the user has *already* spent on their Bilt card this month in the real world. We would have to rely on the user manually inputting their current Bilt statement balance, which creates too much friction.

*   *Alternative (Manual Mode)*: We could add a slider in the iOS `ProfileView` asking: *"Are you actively trying to hit a Bilt rent tier?"* If yes, the app artificially inflates the Bilt card's value for the rest of the month, but this is clunky.

### Phase 4: UI Updates (`Monet-iOS-App`)
1.  **Add Target Tracking UI**: If the user has a Bilt card, add a progress bar to the `ContentView` or `CardWalletView` showing how close they are to their next rent multiplier tier (e.g., *"Spend $140 more on Bilt to unlock 0.75x on rent"*).
2.  **Reasoning Context**: When the optimizer recommends Bilt for a generic category because of the marginal value, the reasoning string returned to the UI must explicitly state: *"Recommended because this purchase helps you hit your 0.5x Rent multiplier, yielding massive marginal value."*

## Summary Checklist for Implementation
- [ ] Add `BILT_BLUE`, `BILT_OBSIDIAN`, and `BILT_PALLADIUM` to static card data.
- [ ] Update DynamoDB `MonetUsers` schema to store `rentAmount`.
- [ ] Rewrite `optimizer.ts` to calculate marginal utility thresholds for dynamic cards.
- [ ] Restore Plaid integration to pull live statement balances.
- [ ] Build iOS UI components to visualize progress toward Bilt spend tiers.