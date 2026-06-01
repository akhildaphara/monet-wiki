# New Ideas and Features for Monet

Based on the current architecture of Monet, here are a few ideas to expand the feature set:

1. **Location-Based Recommendations (Push Notifications)**:
   Since the app runs on iOS and maps business names to categories, we could integrate CoreLocation. When a user enters a known store (like a grocery store or gas station), Monet sends a quiet local notification: "Use your Amex Blue Cash Preferred here for 6% cash back."
2. **"Pay with Points" Calculator**:
   Some cards (like Chase Sapphire Preferred) offer multipliers when points are redeemed for travel (e.g., 1.25x or 1.5x). The app currently optimizes for raw earning, but it could also guide users on the best card to _spend_ points on.

3. **Sign-up Bonus Tracking**:
   Users often get new cards that require spending $4,000 in the first 3 months to earn a bonus. A feature that tracks progress toward this goal, and temporarily overrides the "Best Card" algorithm to recommend the new card until the bonus is met.

4. **Multiplayer / Household Wallet**:
   If a couple shares finances, they could link their accounts so that the optimizer knows about _all_ available cards in the household, rather than just an individual's wallet.

5. **Annual Fee vs. Value Dashboard**:
   Monet could calculate if a user's spending habits actually justify the annual fee on premium cards (like Amex Gold or Venture X) and recommend downgrading or upgrading.

6. **Use Spade**

Spade is a data company that collects and analyzes transaction data to provide insights to businesses.
Monet could use Spade to get additional transaction data to improve its recommendations.
Spade's APIs: https://docs.spade.com/reference/introduction

7. **Use Credit Karma**

Credit Karma is a personal finance company that provides free credit scores, credit reports, and financial insights to consumers. Credit Karma's APIs can be used to get additional transaction data to improve its recommendations.

APIs: https://developer.creditkarma.com/docs
