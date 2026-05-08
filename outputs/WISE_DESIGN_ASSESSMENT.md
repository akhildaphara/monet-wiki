# Monet iOS App: Wise Design System Assessment & Integration Plan

## Executive Summary
This document provides a thorough assessment of the **Wise Design System** and a phased implementation plan to elevate the **Monet iOS App** (a credit card rewards optimizer) to a more professional, energetic, and accessible standard. 

Wise's design system excels through **vibrant color contrasts**, **expressive typography paired with high legibility**, and **structured, semantic spacing**. By applying these principles, Monet can transition from a standard utility app into a premium, trustworthy financial tool that users love to engage with.

---

## 1. Foundational Design Assessment

### What We Learned from Wise (Core Foundations)
- **Color:** Wise uses a bold primary pairing (Bright Green background + Forest Green text) for high contrast and energy, complemented by secondary colors (Orange, Yellow, Blue, Pink) only when the primary identity is established.
- **Typography:** Functionality meets expression. `Inter` is used for all functional UI components due to its legibility, while a bold display font (`Wise Sans` equivalent) is reserved for loud, celebratory headlines.
- **Spacing:** A strict 4px/8px incremental scale (4, 8, 12, 16, 24, 32...) that scales dynamically based on accessibility settings.
- **Tone of Voice:** "Delightfully simple" and "Universally authentic." Strict adherence to sentence case, active voice, and conversational contractions (e.g. "We're" instead of "We are"). Write headlines as if subcopy is illegal.
- **Motion:** A specific mix: 60% Snappy, 30% Fluid, 10% Intuitive. Snappy transitions (like flipping a coin) provide satisfaction, while fluid layers add depth without being erratic.

### What We Learned from Wise (Continued: Foundations)
- **Radius & Padding:** Wise scales radii and padding dynamically between Mobile and Desktop. For mobile, they use tighter radii (10px, 16px, 24px) compared to desktop (16px, 20px, 30px). They explicitly forbid custom padding, enforcing semantic tokens (8px, 16px, 24px, 32px).
- **Icons:** "Less is more." Solid lines, simple shapes, no unnecessary parts. Icons should be universally understood (no clever metaphors). They are meant to complement the typography perfectly. They strictly separate when to use an Icon (for product functions) vs. an Illustration/Tapestry (for moments of celebration).
- **Tapestries & Illustrations:** Wise uses "Tapestries" (fusing color, imagery, and texture) and illustrations to inject energy into the product, especially for "moments of magic" and empty states.
- **Vocabulary:** Wise has a strict ban list and specific usage rules. For example, they strictly forbid calling themselves a "bank" or using "banking" terms. They also standardize terms like "Customer Support team" over "agent", and "Account details" over bank numbers.

### Application to Monet
- **Color Palette:** Monet will stick to our established "Vibrant Financial Green" (`#26ab59`) as the core identity, but use Wise's philosophy of introducing secondary colors (Yellow, Blue, Orange, Pink) exclusively to categorize different credit card networks (Visa, Mastercard, Amex) or reward types (Cashback, Points, Miles) once the primary green identity is established.
- **Typography Standardization:** We will strictly enforce Apple's `SF Pro` using semantic scaling (matching iOS standards) to maintain the bespoke native feel, rejecting custom display fonts for standard UI.
- **Spacing System:** Implement a unified spacing protocol across all SwiftUI views using an enum or extension (`Spacing.sm`, `Spacing.md`, etc.) to eliminate hard-coded padding.
- **UX Writing Protocol:** Monet must eliminate jargon. Instead of "Optimize Portfolio Utilization," use "Get more from your cards." Use sentence case for all buttons and headers, maintaining an energetic, modern tone.
- **Motion Alignment:** Monet's existing spring parameters (`response: 0.4`, `damping: 0.7`) actually perfectly match Wise's "Snappy/Intuitive" requirement. We just need to enforce this strictly.

### Application to Monet (Continued)
- **Padding Enforcement:** We must enforce our `Spacing` tokens (`xs`, `sm`, `md`, `lg`) across all components, strictly prohibiting hardcoded `.padding(15)`.
- **Iconography Strategy:** Monet should rely heavily on Apple's `SF Symbols` as they align perfectly with the "Solid lines, simple shapes, matches typography" rule from Wise. We will avoid complex, multi-colored icons for standard UI functions.
- **Tapestry / Empty States:** We need to design "Tapestries" for Monet—rich, textural empty states or celebration screens. For example, when a user has no cards, instead of a boring "No Cards Added" screen, we show a tapestry of generic, floating card primitives.
- **Vocabulary Ban List:** Monet is an "optimizer" or "wallet", not a bank. We will implement strict vocabulary rules (e.g., use "Rewards" instead of "Rebates", "Cards" instead of "Accounts").

---

## 2. Component Integration Plan

### Phase 1: The Building Blocks (Next Sprint)
Focus on replacing the most frequently used elements with standardized components.
1. **Buttons:**
   - **Primary Buttons:** High contrast, rounded corners, used exactly once per screen.
   - **Secondary/Negative Buttons:** Clear visual hierarchy indicating less importance or destructive actions.
2. **List Items:**
   - Standardize transaction logs and card lists. 
   - Ensure a uniform layout: Leading Icon/Avatar, Title, Subtitle, Trailing Accessory (Chevron, Switch, or Value).
3. **Cards:**
   - Implement "Small" and "Large" card variants.
   - **Small Cards:** Used for quick balance glances or nudges (e.g., "You're 200 points away from a reward").
   - **Large Cards:** Used for highlighting the user's actual Credit Cards in a carousel, showing network, art, and current multiplier.

---

---

## 3. Pattern Analysis & Complex Interactions

### What We Learned from Wise (Patterns)
- **Success Screens:** 
    - **Celebration Type:** Full-screen green background used for high-value moments (adding a new card, hitting a savings goal). High-energy brand moment.
    - **Confirmation Type:** Standard white or green background for admin tasks (updating a nickname, linking an account).
- **Error Screens:** Highly contextual illustrations. Instead of generic "Error," Wise uses specific visual metaphors:
    - *Electric Plug* (`powerplug`) for network issues.
    - *Magnifying Glass (Red)* (`magnifyingglass`) for "Page not found."
    - *Sand Timer* (`hourglass`) for pending states or upcoming features.
- **Validation Messages:** Zero belittling language. No "Oops!" or "Uh-oh." Uses full sentences and a "Sorry" if it's the system's fault. 
- **Empty States:** Integrated into the page layout, not just floating. Maximum of two buttons. Never use sticky footers for integrated empty states.

### Application to Monet (Patterns)
- **Adding a Card:** When a user finishes the "Add Card" flow, we will use a **Celebration Success Screen** (Vibrant Green background) with a "Card Added!" title.
- **Network Errors:** When the API fails, we will use the **Electric Plug** pattern with a clear, punctuation-free title like "Connection lost."
- **Empty Wallet:** We already implemented the **Tapestry** approach, but we will ensure it follows the "No sticky footer" rule.
- **Login/Onboarding:** We will use the confirmation pattern for successful logins.

---

## 4. New Opportunities for Improvement

### High-Energy Celebration Screens
We can elevate "moments of magic" by introducing a full-screen variant for `MonetSuccessView`. For high-value actions like successfully adding a credit card or reaching a reward milestone, the entire background should transition to `Theme.primaryGreenGradient` with white text. This creates a powerful brand moment that feels rewarding.

### Contextual Visual Metaphors
Standardize `MonetErrorView` to use contextual SF Symbols that map to Wise's metaphors. This reduces cognitive load as users begin to associate specific icons with specific types of issues (e.g., connection vs. data not found).

### Celebratory Typography
While we use `SF Pro` for consistency, we should lean into **System Rounded** and **Black/Heavy** weights for celebratory headlines. This mimics the "Wise Sans" expressive feel without introducing custom font files.

### Vocabulary Governance
Strictly audit the app for "bank-speak". 
- Replace "Rebate" or "Cashback" with "Rewards" in general contexts unless referring to a specific card's feature.
- Ensure "Add card" is used instead of "Link account" for credit cards to feel more physical and tangible.

---

## Implementation Progress

We have actively started implementing these findings into the iOS codebase (`raw/Monet`):
- [x] **Theme.swift Update:** Added Categorical Palette (Yellow, Blue, Orange, Pink).
- [x] **MonetButton:** Built strict primary, secondary, and destructive button styles using the `monetFast` spring animation for interactions.
- [x] **MonetCard:** Implemented `.small` (16px radius, 16px padding) and `.large` (24px radius, 20px padding) variants.
- [x] **MonetListItem:** Created the unified layout system with `systemIcon` and `navigation` convenience initializers.
- [x] **MonetAvatar:** Built a standardized avatar component for user profiles and institution logos.
- [x] **MonetSuccessView Enhancement:** Added a `celebration` mode with a full-screen green gradient for high-energy moments.
- [x] **MonetErrorView Enhancement:** Standardized on contextual metaphors like `powerplug` for connection issues and `magnifyingglass` for missing data.
- [x] **ProfileView Refactor:** Replaced generic iOS `Form` with `MonetCard` and `MonetListItem`. Integrated `MonetAvatar`.
- [x] **Sentence Case Audit:** Performed a wide-scale audit to ensure all headers, buttons, and labels follow Wise's sentence case rule (e.g., "Bank connections" vs "Bank Connections").
- [x] **Vocabulary Update:** Replaced "cashback" with "rewards" in primary UI labels to align with a broader financial optimizer identity.
- [x] **CardWalletView Refactor:** Integrated the new `.celebration` success screen when a card is added.

---

## Appendix: Wise Design Skills File Checklist

### Foundations
- [x] foundations/cards.md
- [x] foundations/colour.md
- [ ] foundations/flags.md
- [ ] foundations/focus-states.md
- [x] foundations/grammar-and-style.md
- [ ] foundations/grid.md
- [x] foundations/icons.md
- [x] foundations/illustration.md
- [ ] foundations/logo.md
- [ ] foundations/markup.md
- [ ] foundations/mission.md
- [x] foundations/motion-system.md
- [x] foundations/padding.md
- [ ] foundations/photography.md
- [ ] foundations/promo-assets.md
- [x] foundations/radius.md
- [ ] foundations/size.md
- [x] foundations/spacing.md
- [x] foundations/tapestries.md
- [x] foundations/tone-of-voice.md
- [ ] foundations/transitions.md
- [x] foundations/typography.md
- [x] foundations/vocabulary.md

### Components
- [ ] components/action-prompt.md
- [x] components/avatar.md
- [x] components/bottom-sheet.md
- [x] components/button.md
- [x] components/card.md
- [ ] components/carousel-cards.md
- [ ] components/checkbox.md
- [ ] components/chip.md
- [ ] components/circular-button.md
- [ ] components/compact-date-input.md
- [ ] components/copy-block.md
- [ ] components/critical-banner.md
- [ ] components/date-input.md
- [ ] components/date-picker.md
- [ ] components/divider.md
- [ ] components/dropdown.md
- [ ] components/expressive-money-input.md
- [ ] components/icon-button.md
- [ ] components/image-ratios.md
- [ ] components/info-prompt.md
- [ ] components/inline-prompt.md
- [ ] components/instruction.md
- [ ] components/list-item-button.md
- [ ] components/list-item-checkbox.md
- [ ] components/list-item-icon-button.md
- [ ] components/list-item-navigation.md
- [ ] components/list-item-no-action.md
- [ ] components/list-item-radio.md
- [ ] components/list-item-switch.md
- [x] components/list-item.md
- [ ] components/media-button.md
- [ ] components/modal.md
- [ ] components/money-input.md
- [ ] components/navigation-option.md
- [ ] components/nudge.md
- [ ] components/password-input.md
- [ ] components/popover.md
- [ ] components/progress-bar.md
- [ ] components/progress-spinner.md
- [ ] components/promo-card.md
- [ ] components/radio.md
- [ ] components/screen-loader.md
- [ ] components/search-input.md
- [ ] components/section-header.md
- [ ] components/segmented-control.md
- [ ] components/select.md
- [ ] components/snackbar.md
- [ ] components/summary.md
- [ ] components/switch.md
- [ ] components/table.md
- [ ] components/tabs.md
- [ ] components/text-area.md
- [ ] components/text-input.md
- [ ] components/upload-input.md
- [ ] components/upload.md

### Patterns
- [ ] patterns/accordions.md
- [ ] patterns/banner-card.md
- [ ] patterns/banner-info.md
- [ ] patterns/callout-large.md
- [ ] patterns/callout-small.md
- [ ] patterns/card-cluster-image.md
- [ ] patterns/card-cluster.md
- [ ] patterns/carousel.md
- [x] patterns/empty-state-pattern.md
- [x] patterns/error-pattern.md
- [x] patterns/error-screen.md
- [ ] patterns/feature-section-grid.md
- [ ] patterns/feature-section-interactive.md
- [ ] patterns/feature-section-single.md
- [ ] patterns/feature-section-wide.md
- [ ] patterns/help-articles.md
- [ ] patterns/hero-interactive.md
- [ ] patterns/hero-large.md
- [ ] patterns/hero-simple.md
- [ ] patterns/hero-small.md
- [ ] patterns/highlight-product.md
- [ ] patterns/highlight-trust.md
- [ ] patterns/icon-divider.md
- [ ] patterns/icon-list.md
- [ ] patterns/icon-socials.md
- [ ] patterns/logo-grid.md
- [ ] patterns/notifications.md
- [ ] patterns/progress-screen.md
- [ ] patterns/quote-highlight.md
- [ ] patterns/quote-text.md
- [ ] patterns/tabs-data.md
- [ ] patterns/tabs-feature.md
- [ ] patterns/text-disclaimer.md
- [ ] patterns/text-fact.md
- [ ] patterns/text-headline.md
- [ ] patterns/text-intro.md
- [ ] patterns/text-stack.md
- [x] patterns/success-screen.md
- [x] patterns/validation-messages.md
- [ ] patterns/video-embed.md

