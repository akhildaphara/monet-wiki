# Product

## Register

product

## Users

**Primary — The Multi-Card Optimizer:** People who own 3+ credit cards and are unsure which to swipe at checkout. They want an instant, authoritative answer — not a spreadsheet. They trust the app completely once it earns that trust on the first recommendation.

**Secondary — The Transaction-Aware Optimizer:** Users who have connected their bank accounts and want to see how much cashback they actually earned vs. how much they left on the table. They check Insights monthly and use the missed-earnings data to decide whether to upgrade or swap a card.

## Product Purpose
Monet is a credit card rewards optimizer application that helps users maximize their cashback and rewards based on their purchases. It provides correct and best card recommendations to remove the guesswork from point optimization.

## Brand Personality
Modern, Privacy-First, Authoritative.

**Tone vocabulary:** Confident, precise, warm, direct, expert.

Examples:
- ✅ "Your best card is Chase Sapphire Reserve. It earns 3% here."
- ❌ "We think the Chase Sapphire Reserve might be a good choice."
- ✅ "You left $48 on the table last month. Here's why."
- ❌ "Insights detected potential reward optimization opportunities."

The UI should exude the high craft and polish of an elite engineering team — every margin, every transition, every word is deliberate.

## Anti-references
Must explicitly avoid looking like "AI Slop". It should not feel generic, machine-generated, or rely on cliché AI patterns. It should look bespoke and highly crafted.

**Positive references:**
- **Robinhood** — result clarity and authority; the recommendation card is a statement, not a suggestion.
- **Monzo** — transaction detail pages with personality; data presented with warmth, not clinical distance.
- **Streaks (iOS app)** — premium iOS-native craft: purposeful motion, squircle shapes everywhere, no foreign web patterns.

## Design Principles
1. **Expert Confidence**: The app must provide recommendations with absolute clarity and authority, building trust immediately.
2. **Clarity over Clutter**: Focus on the optimal recommendation; avoid overwhelming the user with spreadsheet-like data.
3. **Impeccable Craft**: Every interaction, margin, and typography choice should feel deliberately crafted by experts, not generated.
4. **Frictionless Utility**: Point maximization should feel effortless, not like a chore.

## Accessibility & Inclusion
Standard iOS accessibility considerations apply. Specific commitments already implemented:
- **Dynamic Type:** All text uses semantic font styles (`.headline`, `.body`, `.caption`) — no hardcoded point sizes in body content.
- **Reduce Motion:** `LoginView` and all entrance animations respect `@Environment(\.accessibilityReduceMotion)`.
- **VoiceOver:** Key interactive elements carry `.accessibilityIdentifier` and `.accessibilityLabel`. Custom buttons declare roles.
- **Haptics:** All significant interactions trigger `UIImpactFeedbackGenerator` or `UINotificationFeedbackGenerator` for users relying on tactile feedback.
