# Comprehensive Testing Strategy Plan for Monet

> **Last Updated:** 2026-04-28 (Updated for `e6d5592` croe, `10c4570` MonetApp)  
> **Status:** Ready for Implementation

Transitioning from manual testing to an automated testing suite will significantly improve the stability, maintainability, and development speed of the Monet application. This plan covers the **Croe backend** (Node.js/TypeScript) and the **MonetApp frontend** (iOS/SwiftUI) with robust tooling, detailed setup steps, and concrete test examples.

---

## 1. Backend Testing Strategy (Croe — Node.js/TypeScript)

### 1.1 Tooling Selection

| Tool                          | Purpose                        | Why                                                                                                                                                            |
| ----------------------------- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Vitest**                    | Test runner + assertions       | Native ESM & TypeScript support, blazing fast (uses Vite's transformer), Jest-compatible API, built-in coverage via `v8`. No `ts-jest` or babel config needed. |
| **Supertest**                 | HTTP integration testing       | Make HTTP assertions against Express without starting a real server.                                                                                           |
| **DynamoDB Local**            | Database for integration tests | Already available at `localhost:8000` via `npm run init-db`. Tests run against real DynamoDB queries, not mocks.                                               |
| **MSW (Mock Service Worker)** | External API mocking           | Intercept outbound HTTP at the network level for Plaid & Google Places calls. No source-code changes needed.                                                   |

> **Why Vitest over Jest?** The Croe project uses ESM (`"module": "NodeNext"`) and TypeScript path aliases (`src/*`). Vitest handles both natively — no `ts-jest`, no `babel`, no `moduleNameMapper` hacks. It's also 2–5× faster for watch mode.

### 1.2 Setup Instructions

#### Step 1 — Install Dependencies

```bash
cd raw/croe
npm install -D vitest @vitest/coverage-v8 supertest @types/supertest msw
```

#### Step 2 — Create `vitest.config.ts`

```ts
// raw/croe/vitest.config.ts
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      src: path.resolve(__dirname, "src"),
    },
  },
  test: {
    globals: true, // describe/it/expect without imports
    environment: "node",
    include: ["tests/**/*.test.ts"],
    setupFiles: ["tests/setup.ts"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      exclude: ["src/init-db.*", "src/index.ts", "src/resources/brandCategoryMap.ts"],
      thresholds: { lines: 80, functions: 80, branches: 70 },
    },
    poolOptions: { forks: { maxForks: 4 } },
  },
});
```

#### Step 3 — Create `tests/setup.ts`

```ts
// raw/croe/tests/setup.ts
import dotenv from "dotenv";
dotenv.config();

// Silence noisy console.log in tests
import { vi } from "vitest";
vi.spyOn(console, "log").mockImplementation(() => {});
vi.spyOn(console, "info").mockImplementation(() => {});
// Keep console.error and console.warn visible for debugging
```

#### Step 4 — Add npm Scripts

Update `package.json` scripts:

```jsonc
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:unit": "vitest run tests/unit",
    "test:integration": "vitest run tests/integration",
  },
}
```

Also update the `format` script to avoid the error when `tests/` is empty:

```jsonc
"format": "prettier --write 'src/**/*.ts' && prettier --write 'tests/**/*.{ts,js}' --ignore-unknown"
```

#### Step 5 — Update `tsconfig.json`

Add the test directory to the TypeScript include path:

```jsonc
{
  "include": ["src/**/*", "tests/**/*"],
  "exclude": ["node_modules", "dist"],
}
```

#### Step 6 — Directory Structure

```
raw/croe/tests/
├── setup.ts                          # Global test setup
├── helpers/
│   ├── fixtures.ts                   # Shared test data factories
│   └── msw-handlers.ts              # MSW request handlers for Plaid/Google
├── unit/
│   ├── optimizer.test.ts             # getCashback (incl. dynamic rewards), findBestCardsForUser
│   ├── categorizer.test.ts           # categorize() with mocked PlacesService
│   ├── placesService.test.ts         # mapTypes() pure logic
│   ├── auth.test.ts                  # authenticateUser + optionalAuthenticateUser middleware
│   └── dynamo/
│       └── DynamoRepository.test.ts  # batchWrite chunking & retry logic
├── integration/
│   ├── health.test.ts                # GET /health
│   ├── recommend.test.ts             # POST /v1/recommend (name, category, includeMarketBest)
│   ├── walletOverview.test.ts        # POST /v1/wallet-overview
│   ├── auth-sync.test.ts             # POST /v1/auth/sync
│   ├── cards.test.ts                 # POST /v1/cards, GET /v1/cards
│   └── plaid/
│       └── syncInsights.test.ts      # POST /v1/plaid/sync-insights
```

---

### 1.3 Unit Tests

Unit tests run in isolation — all external dependencies (DynamoDB, Plaid, Google) are mocked.

#### Target: `optimizer.ts`

The optimizer is pure computation — the highest-value, easiest-to-test module.
The latest commit adds a **dynamic rewards** step (step 2) that returns a card's highest
potential rate when the user hasn't configured custom rewards for that category.

```ts
// tests/unit/optimizer.test.ts
import { describe, it, expect } from "vitest";
import { getCashback, findBestCardForCategory, findBestCardsForUser } from "src/optimizer.js";
import { Category } from "src/resources/categories.js";

describe("getCashback", () => {
  it("returns the standard reward rate for a known card+category", () => {
    const rate = getCashback("CHASE_SAPPHIRE_PREFERRED", Category.DINING);
    expect(rate).toBe(0.03);
  });

  it("returns 0 for an unknown card key", () => {
    expect(getCashback("nonexistent-card", Category.DINING)).toBe(0);
  });

  it("prefers user custom rewards over standard rates", () => {
    const custom = { CHASE_SAPPHIRE_PREFERRED: { [Category.DINING]: 10 } };
    expect(getCashback("CHASE_SAPPHIRE_PREFERRED", Category.DINING, custom)).toBe(10);
  });

  it("falls back to OTHER rate when category is not mapped", () => {
    const rate = getCashback("CHASE_SAPPHIRE_PREFERRED", Category.PET);
    // CSP has [Category.OTHER] = 0.01
    expect(rate).toBe(0.01);
  });

  // --- Dynamic Rewards (Step 2 in optimizer) ---

  it("returns dynamic potential rate for allowed categories when no custom overrides exist", () => {
    // Venmo: dynamicRewards[0].rate = 0.03, DINING is in allowedDynamicCategories
    const rate = getCashback("VENMO_CREDIT_CARD", Category.DINING);
    expect(rate).toBe(0.03);
  });

  it("returns dynamic potential even when another category has a user override", () => {
    // User overrode GROCERY but not DINING — DINING should still show dynamic potential
    const custom = { VENMO_CREDIT_CARD: { [Category.GROCERY]: 0.05 } };
    // Step 1 checks DINING specifically — not found in custom, so falls through to step 2
    const rate = getCashback("VENMO_CREDIT_CARD", Category.DINING, custom);
    expect(rate).toBe(0.03);
  });

  it("uses user custom reward over dynamic potential when category IS overridden", () => {
    const custom = { VENMO_CREDIT_CARD: { [Category.DINING]: 0.08 } };
    const rate = getCashback("VENMO_CREDIT_CARD", Category.DINING, custom);
    expect(rate).toBe(0.08);
  });

  it("does NOT return dynamic rate for categories not in allowedDynamicCategories", () => {
    // Venmo does not list PET in allowedDynamicCategories
    const rate = getCashback("VENMO_CREDIT_CARD", Category.PET);
    // Falls through to step 4 (standard rewards → OTHER = 0.01)
    expect(rate).toBe(0.01);
  });

  // --- Special Rewards (Step 3) ---

  it("returns specialRewards rate for quarterly bonus categories", () => {
    // Discover It has specialRewards[GROCERY] = 0.05
    const rate = getCashback("DISCOVER_IT", Category.GROCERY);
    expect(rate).toBe(0.05);
  });
});

describe("findBestCardForCategory", () => {
  it("returns the card with the highest cashback for dining", () => {
    const result = findBestCardForCategory(Category.DINING);
    expect(result).not.toBeNull();
    expect(result!.cashback).toBeGreaterThan(0);
    expect(result!.cardKey).toBeTruthy();
  });
});

describe("findBestCardsForUser", () => {
  it("returns recommendations for each category the user can earn on", () => {
    const recs = findBestCardsForUser(["CHASE_SAPPHIRE_PREFERRED", "CITI_DOUBLE_CASH"]);
    expect(recs.length).toBeGreaterThan(0);
    recs.forEach((r) => {
      expect(r.category).toBeTruthy();
      expect(r.card).toBeTruthy();
      expect(r.rewards).toBeGreaterThan(0);
    });
  });

  it("returns empty array for no valid cards", () => {
    expect(findBestCardsForUser(["fake-card"])).toEqual([]);
    expect(findBestCardsForUser([])).toEqual([]);
  });

  it("respects custom rewards when choosing best card", () => {
    const custom = { CITI_DOUBLE_CASH: { [Category.DINING]: 99 } };
    const recs = findBestCardsForUser(["CHASE_SAPPHIRE_PREFERRED", "CITI_DOUBLE_CASH"], custom);
    const diningRec = recs.find((r) => r.category === "Dining & Restaurants");
    expect(diningRec?.card).toBe("CITI_DOUBLE_CASH");
    expect(diningRec?.rewards).toBe(99);
  });
});
```

#### Target: `PlacesService.mapTypes()` — Pure Logic

```ts
// tests/unit/placesService.test.ts
import { describe, it, expect } from "vitest";
import { PlacesService } from "src/resources/placesService.js";
import { Category } from "src/resources/categories.js";

describe("PlacesService.mapTypes", () => {
  it("maps restaurant types to DINING", () => {
    expect(PlacesService.mapTypes(["restaurant", "food"], "Chipotle")).toBe(Category.DINING);
  });

  it("detects Amazon by name regardless of types", () => {
    expect(PlacesService.mapTypes([], "AMZN Mktp US")).toBe(Category.AMAZON);
    expect(PlacesService.mapTypes(["store"], "Amazon.com")).toBe(Category.AMAZON);
  });

  it("maps gas_station type to GAS", () => {
    expect(PlacesService.mapTypes(["gas_station"], "Shell")).toBe(Category.GAS);
  });

  it("detects streaming services by name", () => {
    expect(PlacesService.mapTypes([], "Netflix")).toBe(Category.STREAMING);
    expect(PlacesService.mapTypes([], "Spotify")).toBe(Category.STREAMING);
  });

  it("returns OTHER for unrecognized types and names", () => {
    expect(PlacesService.mapTypes([], "Some Random Business")).toBe(Category.OTHER);
  });
});
```

#### Target: `categorizer.ts` — With Mocked PlacesService

```ts
// tests/unit/categorizer.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { categorize } from "src/categorizer.js";
import { Category } from "src/resources/categories.js";
import { PlacesService } from "src/resources/placesService.js";

vi.spyOn(PlacesService, "resolveCategory");

beforeEach(() => {
  vi.mocked(PlacesService.resolveCategory).mockReset();
});

describe("categorize", () => {
  it("returns OTHER for empty input", async () => {
    expect(await categorize("")).toBe(Category.OTHER);
    expect(await categorize("   ")).toBe(Category.OTHER);
  });

  it("matches known brands locally without calling Places API", async () => {
    const result = await categorize("Starbucks");
    expect(PlacesService.resolveCategory).not.toHaveBeenCalled();
    expect(result).toBe(Category.DINING);
  });

  it("falls back to Places API for unknown merchants", async () => {
    vi.mocked(PlacesService.resolveCategory).mockResolvedValue(Category.GROCERY);
    const result = await categorize("Obscure Local Market");
    expect(PlacesService.resolveCategory).toHaveBeenCalledWith("Obscure Local Market");
    expect(result).toBe(Category.GROCERY);
  });
});
```

#### Target: `middleware/auth.ts`

```ts
// tests/unit/auth.test.ts
import { describe, it, expect, vi } from "vitest";
import type { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "src/app.js";

vi.mock("google-auth-library", () => ({
  OAuth2Client: vi.fn().mockImplementation(() => ({
    verifyIdToken: vi.fn(),
  })),
}));

import { authenticateUser, optionalAuthenticateUser } from "src/middleware/auth.js";
import { OAuth2Client } from "google-auth-library";

function mockReqRes(authHeader?: string) {
  const req = { headers: { authorization: authHeader } } as AuthenticatedRequest;
  const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as unknown as Response;
  const next = vi.fn() as NextFunction;
  return { req, res, next };
}

describe("authenticateUser", () => {
  it("returns 401 when Authorization header is missing", async () => {
    const { req, res, next } = mockReqRes();
    await authenticateUser(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("returns 401 for non-Bearer scheme", async () => {
    const { req, res, next } = mockReqRes("Basic abc123");
    await authenticateUser(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });
});

describe("optionalAuthenticateUser", () => {
  it("calls next() without error when no auth header present", async () => {
    const { req, res, next } = mockReqRes();
    await optionalAuthenticateUser(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.userId).toBeUndefined();
  });
});
```

#### Target: `DynamoRepository.batchWrite` — Chunking & Retry Logic

```ts
// tests/unit/dynamo/DynamoRepository.test.ts
import { describe, it, expect, vi } from "vitest";
import { DynamoRepository } from "src/dynamo/repository/DynamoRepository.js";
import type { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

class TestRepository extends DynamoRepository {
  constructor(client: DynamoDBDocumentClient) {
    super("TestTable", client);
  }
  public testBatchWrite(requests: any[], tag: string) {
    return this.batchWrite(requests, tag);
  }
}

describe("DynamoRepository.batchWrite", () => {
  it("does nothing for empty requests", async () => {
    const mockClient = { send: vi.fn() } as unknown as DynamoDBDocumentClient;
    const repo = new TestRepository(mockClient);
    await repo.testBatchWrite([], "test");
    expect(mockClient.send).not.toHaveBeenCalled();
  });

  it("chunks requests into batches of 25", async () => {
    const mockClient = {
      send: vi.fn().mockResolvedValue({ UnprocessedItems: {} }),
    } as unknown as DynamoDBDocumentClient;
    const repo = new TestRepository(mockClient);

    const requests = Array.from({ length: 30 }, (_, i) => ({
      PutRequest: { Item: { id: `item-${i}` } },
    }));
    await repo.testBatchWrite(requests, "test");
    expect(mockClient.send).toHaveBeenCalledTimes(2);
  });

  it("throws after max retries on persistent unprocessed items", async () => {
    const mockClient = {
      send: vi.fn().mockResolvedValue({
        UnprocessedItems: { TestTable: [{ PutRequest: { Item: { id: "stuck" } } }] },
      }),
    } as unknown as DynamoDBDocumentClient;
    const repo = new TestRepository(mockClient);

    const requests = [{ PutRequest: { Item: { id: "stuck" } } }];
    await expect(repo.testBatchWrite(requests, "test")).rejects.toThrow("still unprocessed");
  });
});
```

---

### 1.4 Integration Tests

Integration tests hit the real Express app and a running local DynamoDB instance.

> **Prerequisite:** Local DynamoDB must be running before integration tests.
> Start it with: `npm run init-db` (creates tables on `localhost:8000`).

#### Shared Test Fixtures

```ts
// tests/helpers/fixtures.ts
import type { UserRecord } from "src/dynamo/model/UserRecord.js";
import type { TransactionRecord } from "src/dynamo/model/TransactionRecord.js";

export function createTestUser(overrides: Partial<UserRecord> = {}): UserRecord {
  return {
    id: "test-user-001",
    selectedCardIds: ["chase-sapphire-preferred", "citi-double-cash"],
    showGlobalBestCard: true,
    plaidItems: [],
    ...overrides,
  };
}

export function createTestTransaction(overrides: Partial<TransactionRecord> = {}): TransactionRecord {
  const txId = overrides.transactionId || `tx-${Date.now()}`;
  const date = "2026-04-15";
  return {
    userId: "test-user-001",
    transactionId: txId,
    accountId: "acct-001",
    amount: 25.0,
    dateAndId: `${date}#${txId}`,
    name: "CHIPOTLE ONLINE",
    merchantName: "Chipotle",
    plaidCategories: ["Food and Drink", "Restaurants"],
    primaryPersonalFinanceCategory: "FOOD_AND_DRINK",
    detailedPersonalFinanceCategory: "FOOD_AND_DRINK_RESTAURANTS",
    category: "DINING",
    pending: false,
    pendingTransactionId: null,
    ...overrides,
  };
}
```

#### Example: Health Check

```ts
// tests/integration/health.test.ts
import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "src/app.js";

describe("GET /health", () => {
  it("returns 200 with status ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });
});
```

#### Example: Recommend Endpoint

The `/categorize` GET endpoint was replaced by the unified `POST /v1/recommend` endpoint.
It accepts `name`, `category`, and `includeMarketBest` in the request body and uses `optionalAuthenticateUser` middleware.

```ts
// tests/integration/recommend.test.ts
import { describe, it, expect, vi, beforeAll } from "vitest";
import request from "supertest";
import app from "src/app.js";
import { PlacesService } from "src/resources/placesService.js";

vi.spyOn(PlacesService, "resolveCategory");

beforeAll(() => {
  vi.mocked(PlacesService.resolveCategory).mockResolvedValue("DINING" as any);
});

describe("POST /v1/recommend", () => {
  it("returns 400 when neither name nor category is provided", async () => {
    const res = await request(app).post("/v1/recommend").send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('Either "name" or "category"');
  });

  it("returns a category for a known merchant by name", async () => {
    const res = await request(app).post("/v1/recommend").send({ name: "Starbucks" });
    expect(res.status).toBe(200);
    expect(res.body.category).toBeTruthy();
    expect(res.body.name).toBe("Starbucks");
  });

  it("accepts a pre-resolved category directly", async () => {
    const res = await request(app).post("/v1/recommend").send({ category: "DINING" });
    expect(res.status).toBe(200);
    expect(res.body.category).toBe("DINING");
  });

  it("returns 400 for an invalid category when no name is provided", async () => {
    const res = await request(app).post("/v1/recommend").send({ category: "INVALID" });
    expect(res.status).toBe(400);
  });

  it("includes marketBestCard when includeMarketBest is true", async () => {
    const res = await request(app).post("/v1/recommend").send({ name: "Starbucks", includeMarketBest: true });
    expect(res.status).toBe(200);
    expect(res.body.marketBestCard).toBeTruthy();
    expect(res.body.marketBestCard.rate).toBeGreaterThan(0);
  });

  it("omits marketBestCard when includeMarketBest is not set", async () => {
    const res = await request(app).post("/v1/recommend").send({ name: "Starbucks" });
    expect(res.status).toBe(200);
    expect(res.body.marketBestCard).toBeNull();
  });
});
```

#### Example: Wallet Overview Endpoint

`POST /v1/wallet-overview` is a new auth-required endpoint that returns the best card per category
for the user's entire wallet.

```ts
// tests/integration/walletOverview.test.ts
import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import app from "src/app.js";

describe("POST /v1/wallet-overview", () => {
  it("returns 401 when no auth token is provided", async () => {
    const res = await request(app).post("/v1/wallet-overview");
    expect(res.status).toBe(401);
  });

  // Integration tests with auth require seeding a test user via DynamoDB Local
  // and mocking the Google token verification. See tests/helpers/fixtures.ts.
});
```

---

### 1.5 MSW Setup for External API Mocking

Use [MSW](https://mswjs.io/) to intercept Plaid and Google Places network requests at the HTTP level — no source code changes required.

```ts
// tests/helpers/msw-handlers.ts
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

const handlers = [
  // Mock Google Places Text Search
  http.post("https://places.googleapis.com/v1/places:searchText", () => {
    return HttpResponse.json({
      places: [{ types: ["restaurant", "food"] }],
    });
  }),

  // Mock Plaid /transactions/sync
  http.post("https://sandbox.plaid.com/transactions/sync", () => {
    return HttpResponse.json({
      added: [],
      modified: [],
      removed: [],
      has_more: false,
      next_cursor: "cursor-abc",
    });
  }),
];

export const mswServer = setupServer(...handlers);
```

Wire it up in `tests/setup.ts`:

```ts
import { mswServer } from "./helpers/msw-handlers.js";
import { beforeAll, afterAll, afterEach } from "vitest";

beforeAll(() => mswServer.listen({ onUnhandledRequest: "warn" }));
afterEach(() => mswServer.resetHandlers());
afterAll(() => mswServer.close());
```

---

### 1.6 Coverage Targets

| Metric            | Target    | Rationale                                            |
| ----------------- | --------- | ---------------------------------------------------- |
| Line coverage     | **≥ 80%** | Strong baseline without chasing diminishing returns  |
| Function coverage | **≥ 80%** | Every public function should have at least one test  |
| Branch coverage   | **≥ 70%** | Error paths and edge cases covered                   |
| Critical modules  | **≥ 95%** | `optimizer.ts`, `categorizer.ts`, `placesService.ts` |

---

## 2. Frontend Testing Strategy (MonetApp — iOS/SwiftUI)

### 2.1 Unit Testing

| Tool                          | Purpose                                                                 |
| ----------------------------- | ----------------------------------------------------------------------- |
| **XCTest** (native)           | Assertions, async testing, performance benchmarks                       |
| **Swift Testing** (Xcode 17+) | Modern `@Test` macro syntax, parameterized tests — use alongside XCTest |

**Key Targets:**

- **`DataStore.swift`** — Test state mutations, background sync debouncing, and pending mutations queue.
- **`InsightsManager.swift`** — Test dual-layer caching (reads from local cache when valid, updates on backend response).
- **`APIClient.swift`** — Use `URLProtocol` subclass to intercept network requests. Verify:
  - `recommend()` sends `POST /recommend` with correct body (`name`, `category`, `includeMarketBest`, `city`, `state`).
  - `walletOverview()` sends `POST /wallet-overview` with auth header.
  - Retry logic with exponential backoff on 5xx.
  - Token refresh flow on 401.
- **`CategorizerService.swift`** — Test the 3-layer resolution pipeline:
  - `fastCategorize()` returns local cache/override hits.
  - `categorize()` falls back to the backend `recommend()` API when cache misses.
  - Network offline fast-path returns cached result or `.other`.
- **Data Models** — Test `Codable` conformance by decoding sample JSON responses, including:
  - `CategorizeResponse` with optional `marketBestCard`, `allRates`, and `categoryRecommendations`.
  - `RemoteCard` with `dynamicRewards` and `allowedDynamicCategories`.
  - `BestCardInfo` with optional `category` field.

#### URLProtocol Mock Pattern

```swift
// MonetAppTests/Helpers/MockURLProtocol.swift
class MockURLProtocol: URLProtocol {
    static var requestHandler: ((URLRequest) throws -> (HTTPURLResponse, Data))?

    override class func canInit(with request: URLRequest) -> Bool { true }
    override class func canonicalRequest(for request: URLRequest) -> URLRequest { request }

    override func startLoading() {
        guard let handler = Self.requestHandler else { fatalError("Handler not set") }
        do {
            let (response, data) = try handler(request)
            client?.urlProtocol(self, didReceive: response, cacheStoragePolicy: .notAllowed)
            client?.urlProtocol(self, didLoad: data)
            client?.urlProtocolDidFinishLoading(self)
        } catch {
            client?.urlProtocol(self, didFailWithError: error)
        }
    }

    override func stopLoading() {}
}
```

### 2.2 UI Testing (End-to-End)

| Tool                  | Purpose                                                      |
| --------------------- | ------------------------------------------------------------ |
| **XCUITest** (native) | Simulate real user taps, swipes, and text entry on simulator |

**Key Flows:**

1. **Onboarding/Login** — Verify login screen appears; handle mock auth.
2. **Tab Navigation** — Tap each tab, verify the correct view loads.
3. **Merchant Search** — Type a merchant name, tap search, verify recommendation card appears with best card and rate.
4. **Market Best Card** — When `showGlobalBestCard` is enabled, verify the "Market Best Alternative" section appears when the backend returns a `marketBestCard` with a higher rate.
5. **Manual Override** — Change category via picker, verify recommendation clears and the "Reset Override" button appears.
6. **Offline Fallback** — Disable network, verify the offline banner and manual categorize picker are shown.
7. **Card Wallet** — Add/remove cards, verify wallet updates.
8. **Dynamic Card Rewards** — Open a card with `dynamicRewards`, verify the `EditCardRewardsView` shows allowed categories.

> **Tip:** Pass a `-UITesting` launch argument. The app reads this and substitutes `APIClient` with a mock returning static JSON, making tests fast and deterministic.

### 2.3 Snapshot Testing

| Tool                                    | Purpose                                              |
| --------------------------------------- | ---------------------------------------------------- |
| **swift-snapshot-testing** (Point-Free) | Pixel-perfect regression detection for SwiftUI views |

Add via SPM: `https://github.com/pointfreeco/swift-snapshot-testing`

**Key Targets:** `MiniCardView`, `NetworkStatusBanner`, `InsightsView` charts, `CardWalletView`, `CategoryDetailsView`, `EditCardRewardsView`.

If padding, colors, or layout in `Theme.swift` change accidentally, the snapshot diff catches it immediately.

---

## 3. Implementation Roadmap

### Phase 1: Backend Foundation (1–2 Days)

| Step | Task                                                                                 |
| ---- | ------------------------------------------------------------------------------------ |
| 1    | Install `vitest`, `@vitest/coverage-v8`, `supertest`, `@types/supertest`, `msw`      |
| 2    | Create `vitest.config.ts`, `tests/setup.ts`, and `tests/helpers/`                    |
| 3    | Write unit tests for `optimizer.ts` — standard, dynamic, special, and fallback paths |
| 4    | Write unit tests for `PlacesService.mapTypes()`                                      |
| 5    | Write integration tests for `GET /health` and `POST /v1/recommend`                   |
| 6    | Add `test`, `test:watch`, `test:coverage` npm scripts                                |
| 7    | Verify `npm run format` no longer errors on `tests/`                                 |

### Phase 2: Backend Depth (2–3 Days)

| Step | Task                                                                |
| ---- | ------------------------------------------------------------------- |
| 1    | Write unit tests for `categorizer.ts` and `middleware/auth.ts`      |
| 2    | Write `DynamoRepository.batchWrite` unit tests (chunking, retries)  |
| 3    | Set up MSW handlers for Plaid and Google Places                     |
| 4    | Write integration tests for `POST /v1/auth/sync` and card endpoints |
| 5    | Write integration test for `POST /v1/wallet-overview`               |
| 6    | Write integration test for `POST /v1/plaid/sync-insights`           |
| 7    | Reach ≥ 80% line coverage                                           |

### Phase 3: iOS Business Logic (1–2 Days)

| Step | Task                                                                                                                        |
| ---- | --------------------------------------------------------------------------------------------------------------------------- |
| 1    | Add a **Unit Testing Bundle** target in Xcode                                                                               |
| 2    | Write XCTests for data model `Codable` conformance (`CategorizeResponse`, `RemoteCard` with dynamic fields, `BestCardInfo`) |
| 3    | Create `MockURLProtocol` and test `APIClient` — `recommend()`, `walletOverview()`, retry + token refresh                    |
| 4    | Write tests for `CategorizerService` — `fastCategorize()` and `categorize()` pipeline                                       |
| 5    | Write tests for `DataStore` state mutations                                                                                 |

### Phase 4: iOS UI & Visuals (2–3 Days)

| Step | Task                                                                                                       |
| ---- | ---------------------------------------------------------------------------------------------------------- |
| 1    | Add a **UI Testing Bundle** target in Xcode                                                                |
| 2    | Implement `-UITesting` launch argument with mock data                                                      |
| 3    | Write XCUITests for navigation, merchant search, market-best display, and offline fallback                 |
| 4    | Integrate `swift-snapshot-testing` for key views including `CategoryDetailsView` and `EditCardRewardsView` |

<!-- ### Phase 5: CI/CD Pipeline

#### GitHub Actions — Backend

```yaml
# .github/workflows/backend-tests.yml
name: Backend Tests
on:
  push:
    branches: [main]
    paths: ['raw/croe/**']
  pull_request:
    paths: ['raw/croe/**']

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      dynamodb:
        image: amazon/dynamodb-local:latest
        ports: ['8000:8000']
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
        working-directory: raw/croe
      - run: npm run init-db
        working-directory: raw/croe
      - run: npm run test:coverage
        working-directory: raw/croe
      - uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: raw/croe/coverage/
```

#### GitHub Actions — iOS

```yaml
# .github/workflows/ios-tests.yml
name: iOS Tests
on:
  push:
    branches: [main]
    paths: ['raw/MonetApp/**']
  pull_request:
    paths: ['raw/MonetApp/**']

jobs:
  test:
    runs-on: macos-15
    steps:
      - uses: actions/checkout@v4
      - run: |
          xcodebuild test \
            -project raw/MonetApp/MonetApp.xcodeproj \
            -scheme MonetApp \
            -destination 'platform=iOS Simulator,name=iPhone 16' \
            -resultBundlePath TestResults.xcresult
      - uses: actions/upload-artifact@v4
        with:
          name: test-results
          path: TestResults.xcresult
``` -->

---

## 4. Quick Reference: Commands

```bash
# Run all tests
npm run test

# Watch mode (re-runs on file changes)
npm run test:watch

# Unit tests only
npm run test:unit

# Integration tests only (requires local DynamoDB running)
npm run init-db   # Start DynamoDB Local + create tables
npm run test:integration

# Coverage report
npm run test:coverage
```
