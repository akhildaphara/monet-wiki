---
name: Monet
description: Credit card rewards optimizer application
colors:
  primary: "#26ab59"           # oklch(0.65 0.17 152)
  secondary: "rgba(38, 171, 89, 0.15)"
  background-light: "#f2f2f7"
  background-dark: "#0d0d0d"
  card-background-light: "#ffffff"
  card-background-dark: "#1e1e1e"
  warning: "#f97316"           # orange — missed earnings, optimization nudges
  destructive: "#ef4444"       # red — sign out, remove, error states
  earned: "#26ab59"            # same as primary; positive balance signals
  missed: "#f97316"            # same as warning; unrealized potential
typography:
  display:
    fontFamily: "system-ui, -apple-system, sans-serif"
  body:
    fontFamily: "system-ui, -apple-system, sans-serif"
rounded:
  sm: "12px"                   # chips, inner badges
  card: "20px"                 # standard cards
  hero: "28px"                 # full-bleed hero result card
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "20px"                   # card-padding canonical
  xl: "24px"
  xxl: "32px"
motion:
  standard: "response: 0.4, dampingFraction: 0.7"
  fast:     "response: 0.3, dampingFraction: 0.7"
  enter:    "response: 0.6, dampingFraction: 0.8"
components:
  card:
    backgroundColor: "{colors.card-background-light}"
    rounded: "{rounded.card}"
    padding: "{spacing.lg}"
---

# Design System: Monet

## 1. Overview

**Creative North Star: "The Green Catalyst"**

Monet is a fresh, energetic approach to points and rewards optimization. The aesthetic is Soft & Tactile, relying on smooth continuous curves that feel soft but structured. The system builds trust immediately through expert confidence while keeping the UI frictionless and uncluttered. It explicitly rejects generic, machine-generated, or "AI slop" patterns in favor of bespoke, high-craft iOS-native elements.

**Key Characteristics:**
- Tactile and smooth (20pt continuous radii)
- Confident, vibrant green accents against clean backgrounds
- Deliberate, expert craft feeling

## 2. Colors

Vibrant Financial Green anchors the experience, providing trustworthy and energetic financial signals. Secondary colors are used strictly for categorization, not core UI backgrounds.

> **OKLCH note:** `#26ab59` ≈ `oklch(0.65 0.17 152)`. When specifying colors in code, keep RGB and hex in sync with `Theme.swift` as the canonical source of truth.

### Primary
- **Vibrant Financial Green** (`#26ab59`): Primary actions, positive reward balances, conveying financial growth.
- **Vibrant Financial Green (Tint)** (`rgba(38, 171, 89, 0.15)`): Secondary button backgrounds and subtle highlights.

### Categorical (Secondary Palette)
Used exclusively to categorize credit card networks or reward categories when the primary green is established.
- **Amex / Cashback:** `#FFEB69` (Bright Yellow)
- **Chase / Travel:** `#A0E1E1` (Bright Blue)
- **Capital One / Dining:** `#FFC091` (Bright Orange)
- **Discover / Groceries:** `#FFD7EF` (Bright Pink)

### Semantic
- **Warning / Missed** (`#f97316` — orange): Missed earnings, optimization nudges, manual-tracking indicators. Maps to `Theme.warningOrange`.
- **Destructive** (`#ef4444` — red): Sign out, remove-from-wallet, error states. Maps to `Theme.destructiveRed`.

### Neutral
- **Background Light** (`#f2f2f7`): System grouped background for high contrast with cards.
- **Background Dark** (`#0d0d0d`): Deep dark mode canvas.
- **Card Background Light** (`#ffffff`): Crisp white for distinct data separation.
- **Card Background Dark** (`#1e1e1e`): Elevated dark mode surface.

## 3. Typography

**Font:** System UI (San Francisco) for all text — clean, utilitarian, deeply native to iOS.

**Rule:** Never hardcode font point sizes in body text. Always use SwiftUI semantic font styles so Dynamic Type scales correctly.

### Hierarchy (SwiftUI semantic styles)
| Level | SwiftUI | Usage |
|---|---|---|
| Display | `.system(size: 48, weight: .heavy)` | Hero numbers (login title, cashback %) |
| Large Title | `.largeTitle` | Navigation titles (large display mode) |
| Title 1 | `.title` | Section hero headings |
| Title 2 | `.title2` | Card titles, primary labels |
| Title 3 | `.title3` | Sub-section headings |
| Headline | `.headline` | Card headers, button labels |
| Body | `.body` | Primary readable text |
| Subheadline | `.subheadline` | Secondary descriptive text |
| Callout | `.callout` | Supporting detail |
| Footnote | `.footnote` | Meta, timestamps |
| Caption | `.caption` | Tertiary labels, tooltips |
| Caption 2 | `.caption2` | The finest detail level |

## 4. Elevation

The system relies on tonal layering and soft drop shadows to lift content off the canvas.

### Shadow Vocabulary
- **Card Shadow Light** (`shadow(color: .black.opacity(0.08), radius: 10, x: 0, y: 5)`): Separates white cards from the grouped background.
- **Card Shadow Dark** (`shadow(color: .black.opacity(0.3), radius: 10, x: 0, y: 5)`): Deeper shadow for dark mode contrast.
- **Hero Shadow** (`shadow(color: Theme.primaryGreen.opacity(0.3), radius: 20, x: 0, y: 10)`): Green glow under the full-bleed result card.

## 5. Dark Mode

Both light and dark appearances are first-class. Never use hardcoded colors that don't adapt.

- **Backgrounds:** Use `Color(uiColor: .systemGroupedBackground)` and `Color(uiColor: .systemBackground)` — they adapt automatically.
- **Cards:** Switch between `Theme.cardBackgroundLight` / `Theme.cardBackgroundDark` via the `monetCardStyle(colorScheme:)` modifier or environment.
- **Text:** Use `.primary` and `.secondary` — never `Color.black` or `Color.white` for body text.
- **Shadows:** Increase opacity in dark mode (0.08 → 0.3). The `Theme.cardShadow(colorScheme:)` helper encodes this.

## 6. Motion

All animations use SwiftUI spring physics. Three canonical presets cover all interactions:

| Token | Parameters | Usage |
|---|---|---|
| `standard` | `response: 0.4, dampingFraction: 0.7` | State transitions, category results, card reveals |
| `fast` | `response: 0.3, dampingFraction: 0.7` | Page-indicator dots, chips, toggle feedback |
| `enter` | `response: 0.6, dampingFraction: 0.8` | Full-screen entrance, login carousel scroll |

Respect `accessibilityReduceMotion` — always provide a `.none` animation fallback.

## 7. Components

### Cards / Containers
- **Shape:** Soft & Tactile, continuous curves (`RoundedRectangle(cornerRadius: 20, style: .continuous)`)
- **Background:** White in light mode, dark gray in dark mode
- **Shadow:** `monetCardStyle(colorScheme:)` view modifier
- **Internal Padding:** 20px
- **Hero Result Card:** `cornerRadius: 28`, green gradient fill, white text throughout
- **Small Card:** Used for nudges, alerts, and quick balances (e.g. "You're 200 points away").
- **Large Card:** Highlighted content needing stronger hierarchy (e.g. physical credit card carousel, main promotions).

### List Items
A standardized layout for transaction logs, reward categories, and card lists. Always composed of:
1.  **Leading Asset:** Icon or Avatar.
2.  **Title:** Primary text.
3.  **Subtitle:** Supporting detail.
4.  **Trailing Accessory:** Action button, switch, chevron, or value (e.g., "$5.00").
*Never mix different trailing accessory types in the same list.*

### Contextual Navigation
- **Bottom Sheets:** Use for complex, temporary workflows (e.g., selecting a category or editing a transaction). Keeps users anchored without pushing full screens.
- **Inline Prompts:** Use for educational nudges (e.g., "Use your Chase Sapphire here for 3x points").

### Search Bar & Results
- **Search Input:** Standardized with `monetCard` style, featuring a subtle shadow and 20pt radius.
- **Hero Result Card:** `cornerRadius: 28`, green gradient fill, white text throughout. Uses `standard` spring for entrance.

### Success & Error Views
- **Pattern:** Full-screen immersive layouts featuring "Tapestries"—textural illustrations with generic 3D floating primitives.
- **Success:** Vibrant green backgrounds, central checkmark icon, and celebratory sparkles.
- **Error:** Toned-down backgrounds with `warningOrange` accents and contextual icons (e.g., triangle exclamation).
- **Analyzing:** A context-aware overlay pattern for data refreshes. Uses `AnalyzingTapestryView`—a rhythmic bar-scaling animation—to bridge the Doherty Threshold and provide visual delight during background processing.
- **Animation:** Uses a combination of `standard` for entrance and `fast` for internal element reveals.

### Onboarding Flow
- **Structure:** Multi-step "Snappy" onboarding tutorial before the primary sign-in prompt.
- **Visuals:** Each step features a dedicated Tapestry illustration and clear value-proposition copy.
- **Motion:** Enforces the `standard` spring for step transitions to provide a tactile, physical feel.

## 8. UX Writing & Voice

**Tone:** Delightfully simple, authentically expert, and highly energetic. Monet makes credit card optimization feel like magic, not accounting.

### Grammar & Copy Rules
- **Sentence Case:** Always use sentence case for headers, buttons, and list items. (e.g. "Add a card", not "Add A Card").
- **Active Voice:** "You earned $5.00" instead of "$5.00 was earned".
- **Contractions:** Use them to sound human. "We're", "You've", "Can't".
- **Conciseness:** Write headlines as if subcopy is illegal. Zero jargon.

### Strict Vocabulary List
- **Use:** "Rewards", "Cards", "Wallet", "Get more from your cards."
- **Banned:** "Bank", "Banking", "Agent" (use "Support Team"), "Optimize Portfolio Utilization" (too jargon-heavy), "Rebates."

## 9. Visual Assets

### Icons
Monet exclusively uses **SF Symbols** to ensure flawless alignment with iOS, maintaining strict visual rules:
- **Less is More:** Use the default standard weight. Avoid multi-colored or highly complex symbol variants for standard UI.
- **Clarity over Cleverness:** Icons must be universally understood instantly (e.g., a standard plus sign for adding a card, not a complex wallet metaphor).
- **Interactive vs. Informational:** Interactive icons (like a close button) use primary or neutral foreground colors; informational icons in lists should be secondary.

### Tapestries & Illustrations
For empty states (e.g., "No cards added") or moments of high celebration (e.g., "You earned a sign-up bonus!"), we do not use simple icons. Instead, we use "Tapestries"—rich, textural illustrations utilizing generic, 3D floating primitives or vibrant color meshes to inject energy and delight into the experience without relying on generic stock vectors.

## 10. Do's and Don'ts

### Do:
- **Do** use continuous corner radii for all surfaces (`style: .continuous`).
- **Do** use `Theme.primaryGreen` (not `Color.green`) everywhere the brand green appears.
- **Do** use `Theme.warningOrange` for missed-earnings and nudge states.
- **Do** maintain 20px uniform padding inside cards.
- **Do** use the canonical spring presets from the Motion section.

### Don't:
- **Don't** use gradient text (`foregroundStyle(gradient)` on `Text`). Banned.
- **Don't** use `Color.green`, `Color.orange`, `Color.red` directly — always use Theme tokens.
- **Don't** use `.cornerRadius(X)` (non-continuous) — always `.clipShape(RoundedRectangle(cornerRadius: X, style: .continuous))`.
- **Don't** use generic "AI slop" patterns, glassmorphism, or the hero-metric template (big number + small label + supporting stats).
- **Don't** overwhelm the user with spreadsheet-like data; focus on the optimal recommendation.

