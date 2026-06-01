# Monet iOS App — Git History Analysis (Development Journey)

**Repository:** `/Users/akhildaphara/Desktop/Monet/raw/swift-app`  
**Branch analyzed:** `main` only  
**Analysis date:** 2026-05-31  
**Methodology:** Read-only `git log`, `git shortlog`, `git ls-files` + `wc -l`, and cumulative `--numstat` parsing (no checkouts).

---

## 1. Overview Stats

| Metric | Value |
|--------|-------|
| **Total commits on main** | 225 |
| **First commit** | 2026-01-23 22:37:28 -0500 (`44bc780` — "Initial Commit") |
| **Last commit** | 2026-05-31 17:24:05 -0400 (`93f0a75` — "feat: implement category fallback chain in RewardStore…") |
| **Time span** | 128 days (~4 months, 8 days) |
| **Unique authors** | 1 — Akhil Daphara (225 commits, 100%) |
| **Git tags / releases** | None |
| **Tracked files (HEAD)** | 122 |
| **Swift source files** | 99 (app) + 12 (AppTests) |
| **Commit message prefixes (approx.)** | `feat:` 96, `refactor:` 63, `fix:` 15, `perf:` 1 |

### Lines of Code at HEAD (tracked files, `wc -l`)

| Language / category | Lines |
|---------------------|------:|
| Swift (app source) | 14,647 |
| Swift (AppTests) | 1,523 |
| Asset catalog JSON/metadata | 4,188 |
| Xcode project (`project.pbxproj`) | 697 |
| Markdown | 404 |
| Other (plist, entitlements, gitignore, misc.) | 455 |
| **Total tracked lines** | **20,414** |

> **Note on LOC metrics:** Current file line counts (20,414) differ from cumulative net `--numstat` (16,229 at HEAD) because numstat tracks historical add/delete deltas on text files only (binary/assets often show `-`), and renames/refactors can net differently than snapshot counts.

---

## 2. Timeline of Commits

### Commits per month

| Month | Commits |
|-------|--------:|
| 2026-01 | 5 |
| 2026-02 | 30 |
| 2026-03 | 12 |
| 2026-04 | 65 |
| 2026-05 | 113 |
| **Total** | **225** |

### Commits per week (ISO week)

| Week | Commits |
|------|--------:|
| 2026-W04 | 4 |
| 2026-W05 | 1 |
| 2026-W06 | 1 |
| 2026-W08 | 19 |
| 2026-W09 | 10 |
| 2026-W10 | 7 |
| 2026-W11 | 5 |
| 2026-W14 | 4 |
| 2026-W16 | 5 |
| 2026-W17 | 22 |
| 2026-W18 | 34 |
| 2026-W19 | 54 |
| 2026-W22 | 59 |

**Activity pattern:** Slow bootstrap in January, a massive single-day sprint on 2026-02-22 (19 commits), steady March, heavy April (Plaid + SwiftData arc), and an explosive May (113 commits — 50% of all history). Notable **18-day commit gap** from 2026-05-10 to 2026-05-28 (likely off-repo work or pause before final beta push).

### Cumulative commit count (month-end snapshots)

| Month-end date | Cumulative commits |
|----------------|-------------------:|
| 2026-01-28 | 5 |
| 2026-02-24 | 35 |
| 2026-03-09 | 47 |
| 2026-04-29 | 112 |
| 2026-05-31 | 225 |

### Full commit log (grouped by month)

#### 2026-01 (5 commits)

| Hash | Date | Author | Subject |
|------|------|--------|---------|
| `44bc780` | 2026-01-23 | Akhil Daphara | Initial Commit |
| `9a2d5cd` | 2026-01-24 | Akhil Daphara | init categorizer using gemini api |
| `b19a6ad` | 2026-01-24 | Akhil Daphara | fix .unknown picker error |
| `5314a26` | 2026-01-24 | Akhil Daphara | remove old file |
| `68970df` | 2026-01-28 | Akhil Daphara | use local api instead of gemini api |

#### 2026-02 (30 commits)

| Hash | Date | Author | Subject |
|------|------|--------|---------|
| `904dbd9` | 2026-02-07 | Akhil Daphara | use the get rewards for cards api and get the best card |
| `a8bb2ad` | 2026-02-18 | Akhil Daphara | add google sign in |
| `838757e` | 2026-02-18 | Akhil Daphara | use apple mlksearch for categorizer |
| `e6084d6` | 2026-02-18 | Akhil Daphara | hook card reccomendation based on category locally, remove reccomendation api call |
| `b5b5405` | 2026-02-22 | Akhil Daphara | places api integration with manual MCC code/categories, cached data |
| `400a5c5` | 2026-02-22 | Akhil Daphara | sunset ui overhaul |
| `ff88026` | 2026-02-22 | Akhil Daphara | card view update, add online brand categories |
| `bef8e1e` | 2026-02-22 | Akhil Daphara | change color to green, loginView improvements |
| `2ab63ca` | 2026-02-22 | Akhil Daphara | rearrange files |
| `6bb67e5` | 2026-02-22 | Akhil Daphara | add context docs |
| `db67841` | 2026-02-22 | Akhil Daphara | enum refactor, dead code removal, cache update, documentation updates, and DB options decision |
| `64579a8` | 2026-02-22 | Akhil Daphara | add logs for source of category |
| `39c02b4` | 2026-02-22 | Akhil Daphara | add source of category and reasoning |
| `55c1099` | 2026-02-22 | Akhil Daphara | expand brand database, implement fuzzy matching |
| `9831df1` | 2026-02-22 | Akhil Daphara | doc updates about recent changes |
| `84276cb` | 2026-02-22 | Akhil Daphara | feat: Add quick search chips, card details view, color scheme preference, card nicknames, and refactor profile and card navigation. fix: login screen flash |
| `18730a4` | 2026-02-22 | Akhil Daphara | improve app startup time |
| `9695877` | 2026-02-22 | Akhil Daphara | remove special prime toggle, split it into two cards |
| `c7575f6` | 2026-02-22 | Akhil Daphara | feat: hide 'Apply Now' button for cards already in the wallet |
| `6f47f8b` | 2026-02-22 | Akhil Daphara | ui improvements |
| `dc6153f` | 2026-02-23 | Akhil Daphara | update icon to green |
| `e0c9bd4` | 2026-02-23 | Akhil Daphara | refactor: Centralize API communication with new `APIClient`, replacing `PlacesService` and `BrandCategoryMap` for categorization |
| `e718a76` | 2026-02-24 | Akhil Daphara | use location to suggest nearby names, icon for debug app |
| `17ae9a2` | 2026-02-24 | Akhil Daphara | Stop tracking xcuserdata in Git |
| `70bedb7` | 2026-02-24 | Akhil Daphara | Stop tracking xcuserdata in Git |
| `2ea2b14` | 2026-02-24 | Akhil Daphara | rename MCCCategory to Category |
| `b333ac3` | 2026-02-24 | Akhil Daphara | move cards in backend |
| `be02e5e` | 2026-02-24 | Akhil Daphara | sync cards only once and sync new data every 30 days |
| `df54882` | 2026-02-24 | Akhil Daphara | refactor quaterly bonus to special rewards |
| `a3f8919` | 2026-02-24 | Akhil Daphara | hardcode popular categories, only sync user data every 24 hours, doc update |

#### 2026-03 (12 commits)

| Hash | Date | Author | Subject |
|------|------|--------|---------|
| `9948272` | 2026-03-05 | Akhil Daphara | feat: Enhance categorization by including location context and remove the 'Best Card by Category' UI. |
| `f8d7bed` | 2026-03-05 | Akhil Daphara | feat: Improve API robustness with timeouts and retries, enhance categorization loading and error feedback, and refactor location geocoding. |
| `b2ead63` | 2026-03-05 | Akhil Daphara | displace best card for each category |
| `5f4412c` | 2026-03-05 | Akhil Daphara | feat: Improve search bar UX with explicit clear buttons, immediate keyboard dismissal, and refined focus management. |
| `7284a09` | 2026-03-05 | Akhil Daphara | feat: Cache remote card data in UserDefaults immediately after sign-in and card synchronization. |
| `04afc12` | 2026-03-05 | Akhil Daphara | refactor: remove redundant card data caching and immediately restore auth token upon sign-in. |
| `63184b0` | 2026-03-05 | Akhil Daphara | feat: Add `fastCategorize` to `CategorizerService` for immediate local category resolution, improving responsiveness in content views. |
| `39594fe` | 2026-03-09 | Akhil Daphara | spearate category for lyft and uber |
| `2e37ce8` | 2026-03-09 | Akhil Daphara | feat: Implement network monitoring and offline support with corresponding UI feedback for connectivity status. |
| `e158832` | 2026-03-09 | Akhil Daphara | feat: Implement category sorting in the wallet view and add a dedicated category details view. |
| `08d7222` | 2026-03-09 | Akhil Daphara | feat: add Plaid Link integration to connect bank accounts and check connection status. |
| `32e4dbf` | 2026-03-09 | Akhil Daphara | feat: Implement Plaid API integration to fetch and display account transactions in card details and store card masks. |

#### 2026-04 (65 commits)

| Hash | Date | Author | Subject |
|------|------|--------|---------|
| `3e24961` | 2026-04-04 | Akhil Daphara | Refactor UI and add Plaid insights view |
| `ee19bf2` | 2026-04-04 | Akhil Daphara | Add API retries and background refresh for insights |
| `4e075fa` | 2026-04-04 | Akhil Daphara | Improve InsightsView UI state to retain previous data on network failure |
| `9353491` | 2026-04-04 | Akhil Daphara | Fix search delays, add pull to refresh on Home, improve Insights offline UX |
| `22ec315` | 2026-04-14 | Akhil Daphara | feat: implement RootTabView, CategoriesView, and InsightsView while optimizing Plaid connection handling and Info.plist security settings. |
| `259c975` | 2026-04-15 | Akhil Daphara | remove plaid |
| `e5eb5f8` | 2026-04-15 | Akhil Daphara | feat: implement SwiftData persistence layer (DataStore) and integrate with backend synchronization |
| `de043b6` | 2026-04-15 | Akhil Daphara | refactor: centralize data synchronization logic in DataStore with throttling and event-driven triggers |
| `6776a05` | 2026-04-15 | Akhil Daphara | refactor: centralize API mutations in DataStore with debounced sync tasks |
| `2222666` | 2026-04-24 | Akhil Daphara | add plaid |
| `baa9073` | 2026-04-24 | Akhil Daphara | refactor: centralize Plaid account management into DataStore and inject InsightsManager into the environment |
| `9da6bf2` | 2026-04-24 | Akhil Daphara | feat: implement reusable NetworkStatusBanner and integrate connectivity-aware synchronization logic |
| `224753f` | 2026-04-24 | Akhil Daphara | feat: add functionality to disconnect Plaid bank accounts via API and UI confirmation dialog |
| `be1eb69` | 2026-04-24 | Akhil Daphara | feat: upgrade Plaid integration to support multiple bank accounts and per-item authentication updates. |
| `67aee6e` | 2026-04-25 | Akhil Daphara | feat: improve Plaid connection UI with loading states and grouped bank account management |
| `c690396` | 2026-04-25 | Akhil Daphara | feat: implement bank connection management, custom card mapping, and Plaid account linking functionality |
| `c78342b` | 2026-04-25 | Akhil Daphara | refactor: extract CardRowView and implement automated Plaid account mapping logic |
| `ca1bfed` | 2026-04-25 | Akhil Daphara | feat: add configurable time ranges for transaction insights and automate data refresh on state changes |
| `b43b0eb` | 2026-04-25 | Akhil Daphara | feat: implement offline-resilient networking with request gating, debounced UI refreshes, and background mutation queuing |
| `bbb4852` | 2026-04-25 | Akhil Daphara | feat: implement local caching with 24-hour TTL for insights data in InsightsManager |
| `7ee1488` | 2026-04-25 | Akhil Daphara | feat: add wallet optimization summary, category breakdown, and toggleable global best metrics to InsightsView |
| `57e433e` | 2026-04-25 | Akhil Daphara | refactor: replace local state with DataStore for BankConnectionsView and implement refreshable data fetching |
| `6490968` | 2026-04-25 | Akhil Daphara | feat: implement persistent storage for Plaid accounts and refactor insights caching to use standard UserDefaults accessors |
| `1e662e9` | 2026-04-25 | Akhil Daphara | feat: prune orphaned plaid mappings and add empty state view for unlinked accounts in Insights |
| `dc61a5e` | 2026-04-25 | Akhil Daphara | feat: add custom card rewards configuration with local persistence and backend synchronization |
| `c1b7c33` | 2026-04-25 | Akhil Daphara | feat: refactor card customization into EditCardRewardsView |
| `aedb2d9` | 2026-04-26 | Akhil Daphara | feat: integrate server-side best card recommendations and implement automatic insights refreshing upon mapping updates |
| `0059192` | 2026-04-26 | Akhil Daphara | chore: update API base URL, enhance network logging, and remove obsolete Plaid test file |
| `876b4b5` | 2026-04-26 | Akhil Daphara | feat: add toggle in developer settings to switch APIClient between AWS and localhost endpoints |
| `25e5c85` | 2026-04-26 | Akhil Daphara | feat: implement no-cards warning state and redirect to add-card sheet when user wallet is empty |
| `ca1e437` | 2026-04-26 | Akhil Daphara | feat: implement automatic JWT refresh on 401 response and clean up network status UI |
| `1d5e49a` | 2026-04-27 | Akhil Daphara | refactor: centralize design tokens in Theme.swift and apply standardized styling across all views |
| `f32d770` | 2026-04-27 | Akhil Daphara | style: update Insights icon to chart.pie, adjust Profile list spacing, and redesign best card UI in ContentView |
| `d0d3955` | 2026-04-27 | Akhil Daphara | refactor: wrap profile header in section and update layout spacing in ProfileView |
| `3bdec9f` | 2026-04-27 | Akhil Daphara | refactor: remove accessToken property from RemotePlaidItem model |
| `37cf6f9` | 2026-04-27 | Akhil Daphara | feat: configure associated domains in new entitlements file for oauth |
| `550c4c0` | 2026-04-27 | Akhil Daphara | fix: refine network reachability status updates by correctly identifying server response states in APIClient |
| `71b4185` | 2026-04-27 | Akhil Daphara | refactor: increase transaction cache limit, simplify error handling, and clean up bank connection UI and project entitlements, redesign login screen with animations and update authentication flow to handle auth state transitions |
| `158c440` | 2026-04-27 | Akhil Daphara | fix: prevent unnecessary re-fetches only when transactions are cached in CardDetailsView |
| `3708cd9` | 2026-04-27 | Akhil Daphara | feat: add SwiftUI previews for all primary application views |
| `a461b01` | 2026-04-27 | Akhil Daphara | feat: replace logo with animated credit card stack in LoginView and update layout styling |
| `977277c` | 2026-04-27 | Akhil Daphara | style: update LoginView title gradient and button appearance using theme colors |
| `b1eb40a` | 2026-04-27 | Akhil Daphara | refactor: unify theme colors across views and update iconography styling |
| `3712f01` | 2026-04-27 | Akhil Daphara | feat: migrate transaction fetching to async/await and add pull-to-refresh functionality |
| `8024313` | 2026-04-27 | Akhil Daphara | feat: update AWS endpoint and add syncAllPlaidTransactions method to refresh data on pull-to-refresh |
| `6b94ef0` | 2026-04-27 | Akhil Daphara | feat: add pull-to-refresh state management to BankConnectionsView |
| `94bef62` | 2026-04-27 | Akhil Daphara | feat: add and display computedAt timestamp for insights data |
| `8697fd2` | 2026-04-27 | Akhil Daphara | fix: ensure cache restoration success before returning from InsightsManager fetch |
| `4ce109c` | 2026-04-27 | Akhil Daphara | feat: increase timeout to 30 seconds for plaid insights sync request |
| `95ba96b` | 2026-04-28 | Akhil Daphara | feat: add dynamic card insights support to API and UI display |
| `7e11b34` | 2026-04-28 | Akhil Daphara | feat: implement account switching logic to clear local data upon user sign-in change |
| `3adf53e` | 2026-04-28 | Akhil Daphara | refactor: replace dynamic API environment toggle with static conditional compilation for localhost support |
| `10c4570` | 2026-04-28 | Akhil Daphara | refactor: update APIClient and CategorizerService to use recommendation-based categorization and expand card data models with dynamic reward support |
| `8ce8b53` | 2026-04-28 | Akhil Daphara | feat: initialize unit testing target, mock URL protocol, and add initial test suites for data models and API services. |
| `7dc23b4` | 2026-04-29 | Akhil Daphara | feat: implement UI testing suite, snapshot testing framework, and API client concurrency refinements. |
| `e893776` | 2026-04-29 | Akhil Daphara | refactor: update transaction schema to parse date from dateAndId and remove legacy Plaid fields |
| `a834f33` | 2026-04-29 | Akhil Daphara | refactor: update PlaidTransaction id to derive from dateAndId suffix |
| `e1dbc0c` | 2026-04-29 | Akhil Daphara | style: remove chevron icon from CardWalletView list items |
| `94f5dd1` | 2026-04-29 | Akhil Daphara | feat: add card customization walkthrough to CardWalletView and improve quick chip layout responsiveness while removing snapshot tests |
| `a0e4e40` | 2026-04-29 | Akhil Daphara | feat: add loading state to card categorization and reset recommendation fields on trigger |
| `de7994b` | 2026-04-29 | Akhil Daphara | refactor: remove airlines category and update related view mapping |
| `ff550d6` | 2026-04-29 | Akhil Daphara | feat: add sync state tracking, improved mapping guardrails, and empty transaction handling in Insights view |
| `c2d455d` | 2026-04-29 | Akhil Daphara | refactor: update PlaidTransaction model to use explicit transactionId and add missing fields |
| `453c903` | 2026-04-29 | Akhil Daphara | refactor: implement centralized InsightsManager singleton with task coalescing and event-driven backend syncing |
| `f1462e1` | 2026-04-29 | Akhil Daphara | refactor: migrate insights cache to a per-key dictionary and enforce consistent sync handling |

#### 2026-05 (113 commits)

| Hash | Date | Author | Subject |
|------|------|--------|---------|
| `384e3c2` | 2026-05-05 | Akhil Daphara | refactor: migrate from foregroundColor to foregroundStyle across UI components. swiftui-pro first pass |
| `0b06f56` | 2026-05-05 | Akhil Daphara | refactor: modernize UI components by migrating to `foregroundStyle` and `LazyVStack` |
| `0328d11` | 2026-05-05 | Akhil Daphara | refactor: update UI styling across views and remove redundant Plaid error alerts |
| `bb752ce` | 2026-05-05 | Akhil Daphara | feat: overhaul LoginView with a premium, animated parallax carousel and interactive auto-scroll support |
| `2d1b1d1` | 2026-05-05 | Akhil Daphara | refactor: standardize design tokens, animations, and haptic feedback across the application and update UI components accordingly. |
| `7736958` | 2026-05-05 | Akhil Daphara | refactor: modularize ContentView by extracting search, result card, and empty state components into dedicated views |
| `1758e3c` | 2026-05-05 | Akhil Daphara | refactor: modularize UI components and modernize async task handling and button styling |
| `e911ed7` | 2026-05-05 | Akhil Daphara | feat: implement cinematic entry animations and numeric content transitions for insights hero section and charts |
| `9a7597b` | 2026-05-05 | Akhil Daphara | refactor: remove animation modifiers from EmptyStateView and add transition to ProfileView avatar |
| `03a9753` | 2026-05-06 | Akhil Daphara | feat: use gemini design research, implement automated onboarding, refresh splash screen branding, and add prominent bank re-authentication UI, insights view iomprovements |
| `5998ba8` | 2026-05-06 | Akhil Daphara | refactor: fix override category ui updates |
| `8f2f436` | 2026-05-07 | Akhil Daphara | chore: remove GoogleGenerativeAI Swift package dependency from project |
| `b2cc028` | 2026-05-07 | Akhil Daphara | feat: implement reusable MonetListItem and MonetCard components and refactor ProfileView UI |
| `eddf5d2` | 2026-05-07 | Akhil Daphara | feat: modularize wallet empty state and update MonetListItem styling and profile UI components |
| `ccdb685` | 2026-05-07 | Akhil Daphara | refactor: standardize UI components, implement theme helpers, and add error/success feedback views |
| `1befea5` | 2026-05-07 | Akhil Daphara | feat: add category icons to InsightsView and update display logic in CardDetailsView |
| `dc02102` | 2026-05-07 | Akhil Daphara | feat: implement card-added success state in CardWalletView and update onboarding UI components |
| `2930fa9` | 2026-05-07 | Akhil Daphara | feat: introduce dual-mode MonetSuccessView and refine UI text and components 678y2 |
| `ef5e712` | 2026-05-07 | Akhil Daphara | can run over network |
| `576892e` | 2026-05-07 | Akhil Daphara | feat: introduce MonetNudge and MonetSegmentedControl components while updating UI copy and styles ahkadh4 |
| `0af4012` | 2026-05-07 | Akhil Daphara | feat: introduce standardized UI components and apply global state animations to InsightsManager. |
| `a0ba378` | 2026-05-07 | Akhil Daphara | ui: unify primary green branding across login, navigation, and empty state views |
| `394a0e5` | 2026-05-07 | Akhil Daphara | refactor: enhance empty state animation, update insight tab iconography, and improve MonetHeroSimple flexibility |
| `8d7ade0` | 2026-05-07 | Akhil Daphara | refactor: remove hero and rewards chart, and redesign market best suggestion card in InsightsView |
| `1d8a438` | 2026-05-07 | Akhil Daphara | feat: display confirmation message in ResultCardView when user already possesses the best market rate |
| `450ed81` | 2026-05-07 | Akhil Daphara | feat: replace reasoning row with an interactive wallet comparison section in ResultCardView |
| `33cb3c8` | 2026-05-07 | Akhil Daphara | refactor: replace ContentView with SearchView in tab navigation and update documentation accordingly |
| `d4fb489` | 2026-05-07 | Akhil Daphara | refactor: update tab bar icons and remove RootTabView preview |
| `29a5137` | 2026-05-07 | Akhil Daphara | chore: add SwiftUI previews for core application views |
| `1ff2f8c` | 2026-05-07 | Akhil Daphara | refactor: migrate from EnvironmentObject to @Environment and implement iOS 18 TabView syntax |
| `beb531b` | 2026-05-08 | Akhil Daphara | refactor: modernize view components and navigation logic while standardizing percentage formatting and async task handling |
| `a17d46b` | 2026-05-08 | Akhil Daphara | refactor: modernize UI components, add sensory feedback, refactor concurrency in InsightsManager, and expand core model and view structures |
| `1b84eeb` | 2026-05-08 | Akhil Daphara | refactor: rename project targets, restructure file groups, and update asset references, rename files |
| `8d48948` | 2026-05-08 | Akhil Daphara | refactor: enforce @MainActor on UI components and consolidate Google Sign-In task handling |
| `651462d` | 2026-05-08 | Akhil Daphara | refactor: modularize API models and implement network state monitoring for improved service resilience |
| `0197ce8` | 2026-05-08 | Akhil Daphara | refactor: update typography styles to remove rounded font design across components |
| `07c386d` | 2026-05-08 | Akhil Daphara | feat: integrate rate limiting state into network monitoring and add UI warnings for connectivity issues |
| `bf078d4` | 2026-05-08 | Akhil Daphara | refactor: implement network connection success notifications, add request rate limiting, and optimize UI components |
| `0205a18` | 2026-05-08 | Akhil Daphara | refactor: optimize data fetching and improve network state handling across views |
| `31f056e` | 2026-05-08 | Akhil Daphara | feat: improve Insights refresh logic and add market best card recommendation UI |
| `7c3d4a2` | 2026-05-08 | Akhil Daphara | feat: add isNewUser flag to User model and update onboarding flow conditional logic |
| `d855e7b` | 2026-05-08 | Akhil Daphara | style: update typography and customize navigation bar titles for Wallet, Insights, and Profile views |
| `0eec42c` | 2026-05-08 | Akhil Daphara | feat: implement image caching service and update UI components to use cached profile images |
| `8d2d41a` | 2026-05-08 | Akhil Daphara | refactor: unify view corner radius values using theme constants |
| `d6ff2f4` | 2026-05-09 | Akhil Daphara | refactor: modularize UI components with AppBanner and update visual styles to use rounded rectangles |
| `533499c` | 2026-05-09 | Akhil Daphara | feat: Bilt 2.0 Blueprint implementation for iOS |
| `3466454` | 2026-05-09 | Akhil Daphara | refactor: update special rewards to support polymorphic types via SpecialReward enum and provide a flattened interface for legacy compatibility |
| `855e930` | 2026-05-09 | Akhil Daphara | fix: resolve memory leaks and UI layout issues across network, image caching, and insight components |
| `9763d98` | 2026-05-09 | Akhil Daphara | refactor: remove global best card toggle and update UI components for suggested card display |
| `86060ee` | 2026-05-09 | Akhil Daphara | refactor: migrate dynamic rewards logic to support RankedSpend special rewards and update card override sync |
| `845f46f` | 2026-05-10 | Akhil Daphara | refactor: support multiple ranked spend rules per card and clean up category validation logic |
| `510bebc` | 2026-05-10 | Akhil Daphara | refactor: update dynamic rewards logic to derive tiers and categories from rankedSpendRules |
| `7da8ab2` | 2026-05-10 | Akhil Daphara | refactor: replace selected card IDs with a dictionary of user card overrides across data models, services, and views |
| `2b7ecaa` | 2026-05-10 | Akhil Daphara | refactor: improve APIClient retry logic and token refresh handling by migrating to a while loop and increasing health check retries |
| `b1a067c` | 2026-05-28 | Akhil Daphara | feat: implement color scheme persistence and streamline the onboarding flow in LoginView |
| `74c8370` | 2026-05-28 | Akhil Daphara | feat: implement paginated transaction list with show more/less controls and updated sync timestamp display |
| `866b2e3` | 2026-05-28 | Akhil Daphara | feat: add corner radius to insight bars, dynamic label naming, and conditional stroke cap for optimization ring |
| `f74cccb` | 2026-05-28 | Akhil Daphara | feat: add popular brands list and integrate into BusinessSearchService for improved autocomplete suggestions |
| `1cf1aa4` | 2026-05-28 | Akhil Daphara | feat: implement optimized fuzzy local brand search using pre-cached tokenization and Damerau-Levenshtein distance scoring |
| `57cd9fa` | 2026-05-28 | Akhil Daphara | refactor: remove CategoryInsightRow expansion state and optimize transaction data revalidation logic |
| `cb962ca` | 2026-05-28 | Akhil Daphara | feat: track search progress state to handle UI display during active queries |
| `bb35b51` | 2026-05-28 | Akhil Daphara | refactor: increase currency precision to two decimal places and shorten optimization advice text in CategoryInsightRow |
| `bcf15c9` | 2026-05-28 | Akhil Daphara | refactor: hide insight section when optimal usage matches actual spend |
| `a9eaabb` | 2026-05-28 | Akhil Daphara | refactor: replace Swift Charts with custom geometry-based progress bars in CategoryInsightRow and simplify stroke cap in InsightsView |
| `0ac3b58` | 2026-05-28 | Akhil Daphara | fix: update InsightsView to use suggestion.additionalEarnings instead of global market potential |
| `68a911c` | 2026-05-28 | Akhil Daphara | feat: integrate backend-computed dynamic reward rates into RewardStore, CardDetailsView, and EditCardRewardsView |
| `78c2b19` | 2026-05-28 | Akhil Daphara | feat: add Category resolution logic and include category matching in search results |
| `6586cc9` | 2026-05-29 | Akhil Daphara | feat: integrate auto-calculated rewards into card reward logic and UI overrides |
| `236ea3f` | 2026-05-29 | Akhil Daphara | feat: implement tabbed insights navigation, update reward application UI, and refine dynamic suggestion messaging |
| `a159822` | 2026-05-29 | Akhil Daphara | feat: introduce CardInsightRowView component to display card breakdown and dynamic reward tiers in InsightsView |
| `2b9b410` | 2026-05-29 | Akhil Daphara | refactor: replace Task-based debouncing with Combine and optimize card mapping performance |
| `9f1bf36` | 2026-05-29 | Akhil Daphara | feat: integrate Plaid card mappings into backend synchronization and user profile updates |
| `820d0d8` | 2026-05-29 | Akhil Daphara | feat: implement comprehensive unit test suite and add backend synchronization logic for Plaid card mappings. |
| `2b12629` | 2026-05-29 | Akhil Daphara | perf: optimize CategoriesView performance and centralize color scheme management with custom view modifier and improved API session handling |
| `b4d7334` | 2026-05-29 | Akhil Daphara | refactor: replace NotificationCenter event bus with Observable state and closures for reactive updates and lifecycle management. |
| `bce7dd8` | 2026-05-30 | Akhil Daphara | fix: update UI labels to use Title Case for consistency |
| `60a1277` | 2026-05-30 | Akhil Daphara | feat: implement incremental Plaid transaction syncing with delta merging and automatic card mask backfilling |
| `5f4d5e7` | 2026-05-30 | Akhil Daphara | feat: add rideshare and utilities categories with fallback decoding to Category model |
| `01254d0` | 2026-05-31 | Akhil Daphara | feat: implement global haptics service, persistent button press feedback, and stable color hashing |
| `e999ff0` | 2026-05-31 | Akhil Daphara | feat: add focus binding and accessibility motion support to UI components and animations |
| `b1c401d` | 2026-05-31 | Akhil Daphara | fix: prevent race-condition-induced data loss of card last4 digits during backend sync and update UI to display plaid connection status |
| `3ec3d4a` | 2026-05-31 | Akhil Daphara | refactor: replace blocking analysis overlay with progress bar and optimize date range switching in InsightsManager |
| `926c752` | 2026-05-31 | Akhil Daphara | refactor: replace GoogleSignInService with custom AuthService and introduce FlexibleRewardValue model for improved authentication and flexible reward parsing. Add Guest mode |
| `ebda337` | 2026-05-31 | Akhil Daphara | feat: implement guest JWT authentication, CloudFront API integration, and sign-in gating for InsightsView |
| `e32c246` | 2026-05-31 | Akhil Daphara | feat: implement structured API error handling with rate-limit recovery and offline category search fallback |
| `8ffed1a` | 2026-05-31 | Akhil Daphara | feat: add data-merge prompt to allow users to preserve guest session data when signing in |
| `6376601` | 2026-05-31 | Akhil Daphara | fix: prevent guest tokens from triggering authenticated backend synchronization in DataStore |
| `d1424a9` | 2026-05-31 | Akhil Daphara | feat: implement sign-in gating for bank connections and update UI components to support unauthenticated states |
| `2725c20` | 2026-05-31 | Akhil Daphara | fix: manage isCheckingAuth state within restoreNonGoogleSession to prevent premature onboarding screen flashes |
| `fe10ba6` | 2026-05-31 | Akhil Daphara | refactor: rewrite WalletView and AddCardSheet UI components to improve layout and user experience |
| `b50ef06` | 2026-05-31 | Akhil Daphara | refactor: update UI layout for sign-in and card management views |
| `84d7d33` | 2026-05-31 | Akhil Daphara | feat: add post-sign-in data merge flow for onboarding users and expand AHA categories |
| `bc252f8` | 2026-05-31 | Akhil Daphara | remove sparkle |
| `cd31565` | 2026-05-31 | Akhil Daphara | feat: implement SSL certificate pinning and migrate sensitive user tokens to secure keychain storage |
| `1472c3c` | 2026-05-31 | Akhil Daphara | fix: update Keychain to use secure user-presence authentication |
| `86e417a` | 2026-05-31 | Akhil Daphara | fix: delay merge prompts and dismiss SignInView to prevent alert suppression during guest-to-account transition |
| `4102816` | 2026-05-31 | Akhil Daphara | feat: parameterize SignInView by purpose and improve post-sign-in sync reliability |
| `7f3a024` | 2026-05-31 | Akhil Daphara | fix: update SignInView title capitalization and document recent guest sign-in improvements in changelog |
| `e978be7` | 2026-05-31 | Akhil Daphara | build: integrate Secrets.xcconfig into build configurations to enable CloudFront routing |
| `8d7e5cb` | 2026-05-31 | Akhil Daphara | feat: add support for quarterly rotating bonus categories in card rewards and UI |
| `1588c3b` | 2026-05-31 | Akhil Daphara | feat: add support for reward spend caps with new RewardCap model and UI disclaimer tracking |
| `b353b0b` | 2026-05-31 | Akhil Daphara | feat: parse and log Zod validation details from API error responses for improved debugging and UI feedback |
| `3d05a69` | 2026-05-31 | Akhil Daphara | feat: add AppSnackbar component and expand Theme with new size tokens |
| `325ec33` | 2026-05-31 | Akhil Daphara | feat: implement AvatarSize system, add sync progress indicators, and wire card-removal snackbars |
| `292f24f` | 2026-05-31 | Akhil Daphara | fix: prevent spurious merge prompt during async Google session restoration in RootTabView |
| `a8bfff4` | 2026-05-31 | Akhil Daphara | refactor: introduce reusable SectionHeader component and improve Plaid link connection feedback flow. |
| `0425b23` | 2026-05-31 | Akhil Daphara | fix: move padding modifier inside ProgressView block in InsightsView to resolve compilation error |
| `011b98c` | 2026-05-31 | Akhil Daphara | feat: introduce didSignInInteractively flag to distinguish session restoration from interactive sign-in and prevent spurious merge prompts |
| `bb80e04` | 2026-05-31 | Akhil Daphara | feat: integrate Plaid account management section into WalletView |
| `5f31fa7` | 2026-05-31 | Akhil Daphara | feat: add card-linking menu to wallet rows and fix cloud sync discarding card changes during onboarding |
| `aa7e3af` | 2026-05-31 | Akhil Daphara | feat: implement provider-agnostic guest-to-account merge flow and harden data integrity during account switching |
| `941a55d` | 2026-05-31 | Akhil Daphara | refactor: replace guest/onboarding merge alerts with an automatic post-sign-in wallet union in RootTabView |
| `93f0a75` | 2026-05-31 | Akhil Daphara | feat: implement category fallback chain in RewardStore, rename Uber category, and add offline search UI state |



---

## 3. Lines of Code Over Time

**Method:** Parsed `git log main --numstat --reverse` and accumulated `(additions − deletions)` per commit. No working-tree checkouts performed.

### Cumulative net lines (month-end)

| Date | Cumulative net lines |
|------|---------------------:|
| 2026-01-28 | 721 |
| 2026-02-24 | 3,519 |
| 2026-03-09 | 4,629 |
| 2026-04-29 | 7,925 |
| 2026-05-31 | 16,229 |

### Additions / deletions per month

| Month | Additions | Deletions | Net |
|-------|----------:|----------:|----:|
| 2026-01 | 853 | 132 | +721 |
| 2026-02 | 5,758 | 2,960 | +2,798 |
| 2026-03 | 1,279 | 169 | +1,110 |
| 2026-04 | 7,464 | 4,168 | +3,296 |
| 2026-05 | 16,842 | 8,538 | +8,304 |
| **Total churn** | **32,196** | **15,967** | **+16,229** |

May had the highest churn: +16,842 / −8,538 lines touched — consistent with large refactors (design system, component extraction) alongside new features.

### Sampled cumulative net lines (~22 evenly spaced commits)

| Date | Hash | Cumulative net lines |
|------|------|---------------------:|
| 2026-01-23 | `44bc780` | 447 |
| 2026-02-22 | `400a5c5` | 2,177 |
| 2026-02-22 | `84276cb` | 3,590 |
| 2026-02-24 | `2ea2b14` | 3,409 |
| 2026-03-05 | `04afc12` | 3,749 |
| 2026-04-04 | `9353491` | 5,299 |
| 2026-04-24 | `be1eb69` | 5,291 |
| 2026-04-25 | `1e662e9` | 5,952 |
| 2026-04-27 | `d0d3955` | 6,686 |
| 2026-04-27 | `3712f01` | 6,853 |
| 2026-04-28 | `8ce8b53` | 7,441 |
| 2026-04-29 | `453c903` | 7,922 |
| 2026-05-05 | `9a7597b` | 8,482 |
| 2026-05-07 | `ef5e712` | 9,529 |
| 2026-05-07 | `29a5137` | 10,497 |
| 2026-05-08 | `0205a18` | 10,563 |
| 2026-05-09 | `9763d98` | 10,874 |
| 2026-05-28 | `1cf1aa4` | 11,386 |
| 2026-05-29 | `236ea3f` | 11,823 |
| 2026-05-31 | `01254d0` | 13,281 |
| 2026-05-31 | `2725c20` | 14,850 |
| 2026-05-31 | `e978be7` | 15,441 |
| 2026-05-31 | `bb80e04` | 16,223 |
| 2026-05-31 | `93f0a75` | 16,229 |

### Largest commits by churn (add + delete)

| Hash | Date | + | − | Churn | Subject (abbrev.) |
|------|------|--:|--:|------:|-------------------|
| `a17d46b` | 2026-05-08 | 1,174 | 1,305 | 2,479 | Mass UI modularization — extract 15+ components from monolithic views |
| `ccdb685` | 2026-05-07 | 705 | 531 | 1,236 | Standardize UI components, theme helpers |
| `926c752` | 2026-05-31 | 1,007 | 169 | 1,176 | AuthService + Guest mode + OnboardingView |
| `e0c9bd4` | 2026-02-23 | 347 | 779 | 1,126 | APIClient centralization; delete PlacesService/BrandCategoryMap |
| `3e24961` | 2026-04-04 | 866 | 245 | 1,111 | InsightsView + tab refactor |
| `0af4012` | 2026-05-07 | 843 | 219 | 1,062 | Standardized UI component library |
| `259c975` | 2026-04-15 | 4 | 975 | 979 | **remove plaid** — deleted entire Plaid/Insights stack |
| `7736958` | 2026-05-05 | 520 | 446 | 966 | Modularize ContentView → SearchView extraction |
| `820d0d8` | 2026-05-29 | 946 | 7 | 953 | Comprehensive unit test suite (+946 lines) |
| `b5b5405` | 2026-02-22 | 675 | 233 | 908 | Places API + MCC categorization |

---

## 4. Major Milestones & Feature Arc

The project evolved from a **Gemini-powered categorizer prototype** to a **production-shaped SwiftUI app** with Plaid bank linking, spend insights, guest mode, and hardened security — all in ~4 months, solo.

### Phase 1: Prototype & categorization experiments (Jan – early Feb 2026)

| When | Commit | What happened |
|------|--------|---------------|
| 2026-01-23 | `44bc780` | **Initial Commit** — bare Xcode scaffold: `ContentView`, `MonetApp`, app icon placeholders (447 lines). |
| 2026-01-24 | `9a2d5cd` | **Gemini API categorizer** — first real feature; renamed target to `MonetApp`. |
| 2026-01-28 | `68970df` | **Pivot away from Gemini** — "use local api instead of gemini api" (4 days after adopting Gemini). |
| 2026-02-07 | `904dbd9` | Card recommendation via backend rewards API. |
| 2026-02-18 | `a8bb2ade` | Google Sign-In + LoginView + ProfileView. |
| 2026-02-18 | `838757e` | Apple `MLKSearch` for on-device categorization. |
| 2026-02-18 | `e6084d6` | **Local card recommendation** — removed recommendation API call. |

**Diff insight (`9a2d5cd`):** Added `CategorizerService`, `BusinessOverride`, Gemini-driven categorization flow, `.gitignore`, and restructured from `Monet/` to `MonetApp/`.

### Phase 2: UI identity & architecture cleanup (Feb 22–24)

| When | Commit | What happened |
|------|--------|---------------|
| 2026-02-22 | `b5b5405` | Google Places API + MCC codes + `PlacesCache` (+675/−233). |
| 2026-02-22 | `400a5c5` | **"sunset ui overhaul"** — massive ContentView redesign (+352/−209), sunset app icon. |
| 2026-02-22 | `55c1099` | Fuzzy brand matching database. |
| 2026-02-22 | `84276cb` | Quick search chips, card details, nicknames, dark mode preference. |
| 2026-02-23 | `e0c9bd4` | **APIClient** replaces `PlacesService` + `BrandCategoryMap` (−779 lines deleted). |
| 2026-02-24 | `b333ac3` | Card catalog moved to backend; sync throttling (30-day card sync, 24-hour user sync). |

**Diff insight (`e0c9bd4`):** Deleted 315-line `BrandCategoryMap.swift` and 220-line `PlacesService.swift`; categorization moved server-side through unified `APIClient`. Major architectural simplification.

### Phase 3: Resilience & first Plaid integration (Mar 2026)

| When | Commit | What happened |
|------|--------|---------------|
| 2026-03-05 | `63184b0` | `fastCategorize` for instant local category display. |
| 2026-03-09 | `2e37ce8` | Network monitoring + offline UI. |
| 2026-03-09 | `08d7222` | **First Plaid Link integration** — `PlaidLinkView`, bank connection in wallet. |
| 2026-03-09 | `32e4dbf` | Plaid transactions in card details, card mask storage. |

### Phase 4: Insights, Plaid rollback, SwiftData (Apr 2026)

| When | Commit | What happened |
|------|--------|---------------|
| 2026-04-04 | `3e24961` | **InsightsView** (+397 lines), `RootTabView`, `CategoriesView` — major navigation restructure. |
| 2026-04-15 00:50 | `259c975` | **"remove plaid"** — deleted 975 lines (InsightsView, PlaidLinkView, API Plaid methods). *No revert commit; clean deletion.* |
| 2026-04-15 13:22 | `e5eb5f8` | **SwiftData `DataStore`** — persistence layer + backend sync (+384/−506 refactor). |
| 2026-04-24 | `2222666` | **"add plaid"** — Plaid re-added (+729 lines) now integrated through DataStore. |
| 2026-04-25 | (9 commits) | Plaid multi-account, bank mapping, offline-resilient networking, insights caching TTL. |
| 2026-04-27–29 | (20+ commits) | Theme system, JWT refresh, async/await migration, unit test target, InsightsManager singleton. |

**Diff insight (`259c975`):** Removed entire `InsightsView.swift` (436 lines), all Plaid API surface, and wallet Plaid UI — likely to rebuild on SwiftData foundation. Nine days later, Plaid returned cleaner.

**Diff insight (`e5eb5f8`):** Introduced `DataStore.swift` as central SwiftData persistence; gutted view-local state from `CardWalletView` (−263 net in that file alone).

### Phase 5: Design system & onboarding sprint (May 5–10)

| When | Commit | What happened |
|------|--------|---------------|
| 2026-05-05 | `384e3c2` | swiftui-pro first pass — `foregroundStyle` migration. |
| 2026-05-05 | `bb752ce` | Premium animated LoginView parallax carousel. |
| 2026-05-06 | `03a9753` | Automated onboarding, splash rebrand, bank re-auth UI. |
| 2026-05-07 | `8f2f436` | Removed GoogleGenerativeAI package (Gemini fully excised from dependencies). |
| 2026-05-07–08 | (30+ commits) | **Monet design system** — MonetListItem, MonetCard, MonetNudge, MonetSuccessView, Theme tokens, iOS 18 TabView. |
| 2026-05-08 | `a17d46b` | Largest refactor: extracted 15+ components from InsightsView/CardWalletView (+1,174/−1,305). |
| 2026-05-09 | `533499c` | Bilt 2.0 Blueprint card rewards implementation. |
| 2026-05-10 | `2b7ecaa` | APIClient retry loop hardening — last commit before 18-day gap. |

**Diff insight (`a17d46b`):** Created `CategoryInsightRow`, `InstitutionCardView`, `AddCardSheet`, `CardSetupWalkthroughView`, etc.; moved API models to `APIModels.swift`; InsightsView shrank by ~355 lines.

### Phase 6: Beta hardening (May 28–31)

| When | Commit | What happened |
|------|--------|---------------|
| 2026-05-28 | `1cf1aa4` | Damerau-Levenshtein fuzzy brand search optimization. |
| 2026-05-28 | `a9eaabb` | Replaced Swift Charts with custom geometry progress bars. |
| 2026-05-29 | `820d0d8` | **946 lines of unit tests** across APIClient, DataStore, InsightsManager, RewardStore. |
| 2026-05-29 | `b4d7334` | Replaced NotificationCenter event bus with Observable/closures. |
| 2026-05-30 | `60a1277` | Incremental Plaid transaction sync with delta merging. |
| 2026-05-31 | `926c752` | **Guest mode** — custom AuthService replaces GoogleSignInService; OnboardingView (+392 lines). |
| 2026-05-31 | `cd31565` | **SSL certificate pinning** + Keychain token storage. |
| 2026-05-31 | (10+ fixes) | Guest-to-account merge flow iteration (5 fix commits in one day). |
| 2026-05-31 | `941a55d` | Automatic post-sign-in wallet union (replaced merge alert UX). |

### Features searched but NOT found in history

- **Paywall / StoreKit / subscriptions** — no commits reference these.
- **Push notifications (APNs)** — only in-app "network connection success notifications" (`bf078d4`), not remote push.
- **Git tags/releases** — none.

---

## 5. Aha Moments & Lessons Learned

### Architecture pivots (with commit evidence)

1. **Gemini → local API → on-device ML → server categorization (Jan–Feb)**
   - `9a2d5cd`: "init categorizer using gemini api"
   - `68970df`: "use local api instead of gemini api" *(4 days later)*
   - `838757e`: "use apple mlksearch for categorizer"
   - `e6084d6`: "hook card reccomendation based on category locally, remove reccomendation api call"
   - `e0c9bd4`: Centralized `APIClient`; deleted local Places/brand maps
   - **Lesson:** Categorization bounced between cloud AI, local heuristics, and backend API before settling on server-side recommendation with local `fastCategorize` cache for UX.

2. **Plaid yo-yo (Apr 2026)**
   - `08d7222` → first integration (Mar 9)
   - `3e24961` → Insights built on Plaid (Apr 4)
   - `259c975`: **"remove plaid"** (−975 lines, middle of the night Apr 15)
   - `e5eb5f8` → SwiftData DataStore same day (afternoon)
   - `2222666`: **"add plaid"** (Apr 24, +729 lines)
   - **Lesson:** Plaid was torn out to introduce persistence-first architecture, then reintegrated through DataStore — a deliberate rebuild, not a git revert.

3. **NotificationCenter → Observable (May 29)**
   - `b4d7334`: "replace NotificationCenter event bus with Observable state and closures"
   - **Lesson:** Event-bus pattern didn't scale; moved to SwiftUI-native reactivity.

4. **Google Sign-In → AuthService + Guest JWT (May 31)**
   - `926c752`: "replace GoogleSignInService with custom AuthService… Add Guest mode"
   - `ebda337`: guest JWT + CloudFront API + sign-in gating
   - **Lesson:** Try-before-sign-up required a parallel auth path and careful sync gating.

### Bug discoveries & fix sequences

**Guest merge prompt whack-a-mole (May 31 — 6 related commits in ~6 hours):**

| Order | Commit | Message |
|------:|--------|---------|
| 1 | `8ffed1a` | feat: add data-merge prompt to preserve guest session data when signing in |
| 2 | `6376601` | fix: prevent guest tokens from triggering authenticated backend sync in DataStore |
| 3 | `2725c20` | fix: manage isCheckingAuth state… prevent premature onboarding screen flashes |
| 4 | `86e417a` | fix: delay merge prompts and dismiss SignInView to prevent alert suppression |
| 5 | `292f24f` | fix: prevent spurious merge prompt during async Google session restoration |
| 6 | `011b98c` | feat: introduce didSignInInteractively flag… prevent spurious merge prompts |
| 7 | `941a55d` | refactor: replace merge alerts with automatic post-sign-in wallet union |

**Lesson:** Distinguishing session restoration from interactive sign-in was the root cause; the team eventually abandoned prompts entirely for automatic wallet union.

**Data integrity hotfixes:**

- `b1c401d`: "fix: prevent race-condition-induced data loss of card last4 digits during backend sync"
- `5f31fa7`: "fix cloud sync discarding card changes during onboarding"
- `0ac3b58`: "fix: update InsightsView to use suggestion.additionalEarnings instead of global market potential" *(wrong metric displayed)*

**UI/performance wins:**

- `18730a4`: "improve app startup time"
- `1cf1aa4`: pre-cached tokenization + Damerau-Levenshtein for brand search
- `2b12629`: "perf: optimize CategoriesView performance"
- `855e930`: "fix: resolve memory leaks and UI layout issues across network, image caching, and insight components"

**Login flash (early UX bug):**

- `84276cb`: "fix: login screen flash" (bundled in larger feat commit, Feb 22)

### Reverts

**No commits with "revert" in the message.** The Plaid removal (`259c975`) functionally reversed prior Plaid work but was a forward deletion commit, not `git revert`.

### Notable one-liner commits (personality / milestones)

- `ef5e712` (2026-05-07): "can run over network" — device testing milestone
- `bc252f8` (2026-05-31): "remove sparkle" — UX simplification after onboarding polish
- `8f2f436`: removed last Gemini SDK dependency, closing the loop from Jan 24

---

## 6. Narrative Arc (Blog Summary)

**Act I — "Can AI tell me which card to use?" (Jan–Feb):** A solo developer ships a SwiftUI shell, tries Gemini for merchant categorization, quickly pivots to backend + on-device search, and spends one marathon February weekend (`2026-02-22`, 19 commits) building brand fuzzy matching, a sunset-themed UI, wallet features, and an APIClient refactor.

**Act II — "Connect the bank, see the damage" (Mar–Apr):** Plaid arrives, InsightsView is born, then **Plaid is deleted overnight** to make room for SwiftData. Nine days later Plaid returns, rebuilt on `DataStore`. April adds 65 commits — JWT refresh, theme system, tests, and transaction schema churn.

**Act III — "Make it feel like a real app" (May):** A design-system explosion (Monet* components, onboarding, iOS 18 APIs), Bilt 2.0 rewards modeling, then an 18-day pause. The final May 28–31 sprint adds fuzzy search, 1,500+ lines of tests, guest mode, certificate pinning, and a full day debugging guest-to-account merge edge cases.

**Headline numbers for the blog:** 225 commits · 128 days · 1 author · 14,647 lines of Swift · 16,229 net lines of churn · 0 releases tagged · Plaid integrated twice.

---

## Chart Data (JSON)

```json
{
  "commits_per_month": [
    {
      "month": "2026-01",
      "count": 5
    },
    {
      "month": "2026-02",
      "count": 30
    },
    {
      "month": "2026-03",
      "count": 12
    },
    {
      "month": "2026-04",
      "count": 65
    },
    {
      "month": "2026-05",
      "count": 113
    }
  ],
  "commits_per_week": [
    {
      "week": "2026-W04",
      "count": 4
    },
    {
      "week": "2026-W05",
      "count": 1
    },
    {
      "week": "2026-W06",
      "count": 1
    },
    {
      "week": "2026-W08",
      "count": 19
    },
    {
      "week": "2026-W09",
      "count": 10
    },
    {
      "week": "2026-W10",
      "count": 7
    },
    {
      "week": "2026-W11",
      "count": 5
    },
    {
      "week": "2026-W14",
      "count": 4
    },
    {
      "week": "2026-W16",
      "count": 5
    },
    {
      "week": "2026-W17",
      "count": 22
    },
    {
      "week": "2026-W18",
      "count": 34
    },
    {
      "week": "2026-W19",
      "count": 54
    },
    {
      "week": "2026-W22",
      "count": 59
    }
  ],
  "cumulative_commits_month_end": [
    {
      "month": "2026-01",
      "date": "2026-01-28",
      "cumulative_commits": 5
    },
    {
      "month": "2026-02",
      "date": "2026-02-24",
      "cumulative_commits": 35
    },
    {
      "month": "2026-03",
      "date": "2026-03-09",
      "cumulative_commits": 47
    },
    {
      "month": "2026-04",
      "date": "2026-04-29",
      "cumulative_commits": 112
    },
    {
      "month": "2026-05",
      "date": "2026-05-31",
      "cumulative_commits": 225
    }
  ],
  "cumulative_loc_over_time": [
    {
      "date": "2026-01-23",
      "hash": "44bc780",
      "cumulative_net_lines": 447
    },
    {
      "date": "2026-02-22",
      "hash": "400a5c5",
      "cumulative_net_lines": 2177
    },
    {
      "date": "2026-02-22",
      "hash": "84276cb",
      "cumulative_net_lines": 3590
    },
    {
      "date": "2026-02-24",
      "hash": "2ea2b14",
      "cumulative_net_lines": 3409
    },
    {
      "date": "2026-03-05",
      "hash": "04afc12",
      "cumulative_net_lines": 3749
    },
    {
      "date": "2026-04-04",
      "hash": "9353491",
      "cumulative_net_lines": 5299
    },
    {
      "date": "2026-04-24",
      "hash": "be1eb69",
      "cumulative_net_lines": 5291
    },
    {
      "date": "2026-04-25",
      "hash": "1e662e9",
      "cumulative_net_lines": 5952
    },
    {
      "date": "2026-04-27",
      "hash": "d0d3955",
      "cumulative_net_lines": 6686
    },
    {
      "date": "2026-04-27",
      "hash": "3712f01",
      "cumulative_net_lines": 6853
    },
    {
      "date": "2026-04-28",
      "hash": "8ce8b53",
      "cumulative_net_lines": 7441
    },
    {
      "date": "2026-04-29",
      "hash": "453c903",
      "cumulative_net_lines": 7922
    },
    {
      "date": "2026-05-05",
      "hash": "9a7597b",
      "cumulative_net_lines": 8482
    },
    {
      "date": "2026-05-07",
      "hash": "ef5e712",
      "cumulative_net_lines": 9529
    },
    {
      "date": "2026-05-07",
      "hash": "29a5137",
      "cumulative_net_lines": 10497
    },
    {
      "date": "2026-05-08",
      "hash": "0205a18",
      "cumulative_net_lines": 10563
    },
    {
      "date": "2026-05-09",
      "hash": "9763d98",
      "cumulative_net_lines": 10874
    },
    {
      "date": "2026-05-28",
      "hash": "1cf1aa4",
      "cumulative_net_lines": 11386
    },
    {
      "date": "2026-05-29",
      "hash": "236ea3f",
      "cumulative_net_lines": 11823
    },
    {
      "date": "2026-05-31",
      "hash": "01254d0",
      "cumulative_net_lines": 13281
    },
    {
      "date": "2026-05-31",
      "hash": "2725c20",
      "cumulative_net_lines": 14850
    },
    {
      "date": "2026-05-31",
      "hash": "e978be7",
      "cumulative_net_lines": 15441
    },
    {
      "date": "2026-05-31",
      "hash": "bb80e04",
      "cumulative_net_lines": 16223
    },
    {
      "date": "2026-05-31",
      "hash": "93f0a75",
      "cumulative_net_lines": 16229
    }
  ],
  "cumulative_loc_month_end": [
    {
      "date": "2026-01-28",
      "cumulative_net_lines": 721
    },
    {
      "date": "2026-02-24",
      "cumulative_net_lines": 3519
    },
    {
      "date": "2026-03-09",
      "cumulative_net_lines": 4629
    },
    {
      "date": "2026-04-29",
      "cumulative_net_lines": 7925
    },
    {
      "date": "2026-05-31",
      "cumulative_net_lines": 16229
    }
  ],
  "additions_deletions_per_month": [
    {
      "month": "2026-01",
      "additions": 853,
      "deletions": 132,
      "net": 721
    },
    {
      "month": "2026-02",
      "additions": 5758,
      "deletions": 2960,
      "net": 2798
    },
    {
      "month": "2026-03",
      "additions": 1279,
      "deletions": 169,
      "net": 1110
    },
    {
      "month": "2026-04",
      "additions": 7464,
      "deletions": 4168,
      "net": 3296
    },
    {
      "month": "2026-05",
      "additions": 16842,
      "deletions": 8538,
      "net": 8304
    }
  ],
  "loc_by_language": {
    "Swift": 14647,
    "SwiftTests": 1523,
    "Markdown": 404,
    "JSON": 89,
    "Plist": 40,
    "Entitlements": 25,
    "Assets_metadata_lines": 4188,
    "XcodeProject": 697,
    "GitIgnore": 91,
    "Other": 233,
    "TOTAL_tracked_files": 20414
  }
}
```
