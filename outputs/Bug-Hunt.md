# Bug Hunt & Code Improvements

Based on a preliminary scan of the `croe` backend and `swift-app` frontend, here are a few potential bugs and architectural issues to look out for:

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

---

## Recently Resolved Architecture Bugs

During the latest refactoring phase, several critical architectural bugs were squashed:

- **The "Thundering Herd" Problem:** The iOS app previously fired concurrent `/auth/sync` and `/health` requests across multiple views on launch. This was resolved by implementing a centralized `DataStore` and task coalescing (`taskLock.withLock`) inside `APIClient`.
- **Swift 6 Concurrency Violations:** The use of traditional `NSLock` `lock()` and `unlock()` across asynchronous `await` boundaries caused compiler errors. This was fixed by adopting the `withLock` closure pattern to securely encapsulate state.
- **DynamoDB Race Conditions:** `POST /v1/user/cards` and `/settings` endpoints previously fetched a user record, modified it in memory, and wrote the whole object back (`PutCommand`), which risked data loss on concurrent requests. This was fixed by moving to atomic `UpdateCommand` expressions.
- **Unintended API Spam:** Toggling UI settings or typing in search triggered immediate, overlapping API requests. This was fixed by introducing a 1-second `Task.sleep` debounce in the iOS `DataStore` mutations.

