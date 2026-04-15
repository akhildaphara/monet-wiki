# Bug Hunt & Code Improvements

Based on a preliminary scan of the `croe` backend and `MonetApp` frontend, here are a few potential bugs and architectural issues to look out for:

### 1. `findBestCardsForUser` Edge Case
In `raw/croe/src/optimizer.ts`, the `findBestCardsForUser` function skips a category if `highestCashback > 0` evaluates to false. 
- **Bug**: Some cards have a base cashback of 1%. If there is a missing fallback or the user only has a card that gives 0% for a specific edge-case category, the recommendation array drops the category entirely instead of returning a "best available" option. 

### 2. Apple Card "Apple Pay" Nuance
In `cardRewardsData.ts`, Apple Card is listed with:
```typescript
[Category.OTHER]: 0.02
```
- **Bug**: Apple Card only gives 2% if the purchase is made with **Apple Pay**. If a physical card is swiped, it's 1%. The categorizer or optimizer currently doesn't know if a merchant accepts Apple Pay, meaning it might over-recommend the Apple Card for physical swipes.

### 3. Discover Rotating Categories Hardcoding
In `cardRewardsData.ts`:
```typescript
DISCOVER_IT: { specialRewards: { [Category.GROCERY]: 0.05 } }
```
- **Bug**: Discover's 5% categories rotate every quarter. If this is hardcoded, it will become outdated quickly. 
- **Fix**: The backend should query a dynamic config or internal cron job that updates rotating categories based on the current date, rather than hardcoding them in the static file.

### 4. DynamoDB Local vs Prod Switch
In `db.ts`, the switch relies on `process.env.NODE_ENV !== "production"`. 
- **Caution**: Ensure that the iOS app's `APIClient.swift` correctly points to the ngrok/local IP during development, otherwise it might try to hit a production endpoint with test data, leading to a mismatch in expected DynamoDB tables.

### 5. Typos in Merchant Names
The `categorize` function in `categorizer.ts` notes:
> "We'll let Google Places handle typos naturally."
- **Bug**: If a user creates a local override for "mcdonalds", but Plaid imports a transaction as "macdnalds", the exact match local rule will fail, and Google Places might return a generic `Category.OTHER` instead of `Category.DINING`. 
- **Fix**: Implement a lightweight fuzzy string matching algorithm (like Levenshtein distance) for the user's personal Overrides table before falling back to Google Places.