# Library Recommendations — Opus 4.8

## `@aws-lambda-powertools/*` — partial benefit captured, full library is worth it

**What we already got from upgrading `logger.ts`:** structured JSON output in Lambda, CloudWatch Log Insights queryable by level/message, error serialization with stack traces.

**What Powertools adds on top that we don't have:**

| Feature | Our `logger.ts` | Powertools Logger |
|---|---|---|
| Structured JSON | ✅ | ✅ |
| Cold-start marker | ❌ | ✅ |
| X-Ray trace correlation (`_X_Amzn_Trace_Id`) | ❌ | ✅ |
| Persistent log attributes (userId per request) | ❌ | ✅ `addPersistentLogAttributes` |
| Log sampling (debug at 10% in prod) | ❌ | ✅ |
| Tracer (`@middy/tracer` / `Tracer.getSegment`) | ❌ | ✅ |
| Metrics (custom CloudWatch EMF) | ❌ | ✅ |

The migration cost is real — every call site changes from `logger.info(message, obj)` to Powertools' `logger.info(message, { extra: obj })` with slightly different semantics. It's ~30 files. Worth doing as a dedicated PR once X-Ray tracing is enabled on the Lambda.

**Verdict:** plan for the next sprint. Don't block on it, but don't skip it forever — the X-Ray tracing and cold-start visibility are particularly valuable for diagnosing Plaid webhook latency.

---

## `@middy/core` — valid idea, wrong level of effort right now

Middy makes sense if you move to native Lambda handlers (one function per route). Right now the architecture is Express-in-Lambda via `serverless-http` — a single Lambda handles every route. Middy's middleware model (`httpEventNormalizer`, `httpJsonBodyParser`, `validator`, `httpErrorHandler`) replaces Express middleware.

**Benefits of migrating:**
- Remove Express (~400 KB cold-start weight), `serverless-http`, `body-parser`
- Middy's error middleware is cleaner than Express's 4-arg error handler
- Built-in Zod validation middleware

**Costs:**
- Rewrite every handler from `(req, res, next)` → `(event, context)` Lambda shape
- Lose `req.userId`, `req.rawBody` — need to thread those through Middy context
- API Gateway event shape is different from Express `req` — every test needs updates
- `serverless.yml` needs one function per route or you keep the proxy pattern

This is a quarter-level architectural decision, not a library swap. The existing Express-in-Lambda approach works fine and is easy to reason about. Middy is worth revisiting if you ever move to multi-function Serverless or need sub-100ms cold starts.

**Verdict:** future initiative. Not a quick win.

---

## `electrodb` / `dynamodb-toolbox` — highest long-term value, highest cost

These eliminate exactly the problems the codebase has: `as unknown as Record<string, unknown>` casts everywhere, no typed GSIs, `scanAll()` for `getUserByItemId` instead of a GSI query.

**What you'd get with electrodb:**

```ts
// Instead of this:
const allItems = await this.scanAll();
for (const item of allItems) {
  if ((item as UserRecord).plaidItems?.[itemId]) { ... }
}

// You'd write:
const { data } = await UserEntity.query.byPlaidItemId({ itemId }).go();
```

But this means rewriting all five repositories (`UserRepository`, `TransactionRepository`, `OverrideRepository`, `BrandCacheRepository`, `InsightsCacheRepository`), defining entity schemas, and adding the GSI for `getUserByItemId` in `serverless.yml`.

The immediate fix for the `getUserByItemId` scan doesn't require electrodb — it just requires a `MonetPlaidItemIndex` lookup table (`itemId → userId`). That's a `serverless.yml` resource definition, a constant in `db.ts`, and targeted changes to `addUserPlaidItem`, `removeUserPlaidItem`, and `getUserByItemId`. That's worth doing standalone.

**Verdict:** add the `MonetPlaidItemIndex` lookup table as a targeted fix. Adopt electrodb as part of a deliberate data-layer refactor — not incrementally.

---

## Summary

| Library | Status | Recommendation |
|---|---|---|
| `zod` deeper validation | ✅ Done | — |
| `Promise.allSettled` (parallel ops) | ✅ Done | — |
| `@aws-lambda-powertools/logger` | Partial (JSON structure done) | Next sprint — adds X-Ray, cold-start, sampling |
| `@aws-lambda-powertools/tracer` + metrics | ❌ | Same sprint as logger |
| `@middy/core` | ❌ | Future — requires ditching Express-in-Lambda |
| `electrodb` | ❌ | Future data-layer refactor |
| `MonetPlaidItemIndex` lookup table for `getUserByItemId` | ❌ | **Do this soon** — eliminates full-table scan without a big rewrite |
