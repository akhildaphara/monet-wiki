# Wise Design System

Monet adopts the **Wise Design System** (formerly TransferWise) as its primary aesthetic and functional framework to deliver a premium, energetic, and accessible financial tool.

The system is defined by **vibrant color contrasts**, **expressive typography paired with high legibility**, and **structured, semantic spacing**. By applying these principles, Monet transitions from a standard utility app into a trustworthy financial optimizer.

## Core Foundations

### 1. Color Strategy
Monet uses a **Restrained** color strategy. While "Vibrant Financial Green" (`#26ab59`) anchors the identity, secondary categorical colors are used exclusively to distinguish credit card networks or reward categories.

#### Brand Category Mappings:
- **Bright Yellow** (`#FFEB69`): Amex / Cashback
- **Bright Blue** (`#A0E1E1`): Chase / Travel
- **Bright Orange** (`#FFC091`): Capital One / Dining
- **Bright Pink** (`#FFD7EF`): Discover / Groceries

### 2. Typography
We strictly utilize Apple's **SF Pro** font family with semantic scaling. To mimic Wise's "celebratory" feel without custom font files, we lean into **System Rounded** and **Black/Heavy** weights for major headlines and magic moments.

### 3. Spacing & Radius
A strict 4px/8px incremental scale is enforced. Hardcoded padding is prohibited in favor of semantic tokens (`Spacing.sm`, `Spacing.md`, etc.). Radii are standardized at 20pt for cards and 28pt for hero elements.

### 4. Motion System
Monet's motion follows the **60/30/10 rule**:
- **60% Snappy:** Fast, satisfying transitions (flipping a card).
- **30% Fluid:** Smooth layers that add depth.
- **10% Intuitive:** Physics-based responses (springs) that feel physical.

## Patterns

### The "Analyzing" Transition
To mitigate the **Doherty Threshold**, Monet uses context-aware overlays instead of full-screen loaders during data refreshes. The `AnalyzingTapestryView` provides a rhythmic, rhythmic animation that maintains user momentum while the backend computes insights.

### Celebration Success
High-value actions (e.g., adding a new card) trigger a full-screen celebration background with primary gradients and white text, leveraging the **Peak-End Rule** to synthesize positive memories.

### Contextual Metaphors
Error states map to specific SF Symbols (e.g., `powerplug` for connection issues, `magnifyingglass` for missing data) to reduce cognitive load and provide empathetic feedback.

## Implementation Progress
Most core components (`MonetButton`, `MonetCard`, `MonetListItem`, `MonetNudge`) are already integrated into the `MonetApp` codebase. For a full audit, see [[WISE_DESIGN_ASSESSMENT.md]].
