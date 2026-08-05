# Monet iOS App: Exhaustive Apple HIG Assessment & Guidelines

## Executive Summary
This document provides a comprehensive, deep-dive assessment of the **Apple Human Interface Guidelines (HIG)** across all iOS-specific domains. By adhering to these guidelines, Monet achieves the seamless, intuitive, and highly refined experience that iOS users expect. 

---

## 1. Foundations

### Typography & Dynamic Type
- [x] **Semantic Fonts:** Use semantic text styles (`.largeTitle`, `.title`, `.headline`, `.body`, `.caption`, etc.) instead of hardcoded point sizes to ensure compatibility with iOS Accessibility settings.
- [x] **Dynamic Type Testing:** Verify text scales up gracefully when "Larger Accessibility Sizes" are enabled in iOS Settings without breaking layouts or truncating critical financial data.
- [x] **Font Tracking & Leading:** Rely on the system `SF Pro` font which automatically adjusts tracking (letter spacing) and leading (line height) at different sizes.

### Color & Dark Mode
- [x] **System Colors:** Use system colors (like `.systemBackground`, `.secondarySystemBackground`) to ensure automatic, seamless switching between Light and Dark modes.
- [x] **Semantic Tints:** Ensure Monet's brand colors (e.g., `Theme.primaryGreen`) adapt dynamically between Light and Dark Mode to prevent eye strain and blooming against dark backgrounds.
- [x] **Contrast Ratios:** Verify that all text has a minimum contrast ratio of 4.5:1 against its background in both Light and Dark modes (`Theme.accessibleGreen`, `Theme.accessibleErrorRed`, `Theme.accessibleLink`).

### Materials & Depth (Spatial Design)
- [x] **Native Blurs:** Use native iOS Materials (`.ultraThinMaterial`, `.regularMaterial`, `.thickMaterial`) instead of custom semi-transparent opacities for overlays, sticky headers, and modal sheets to convey spatial hierarchy.
- [x] **Reduce Transparency:** Ensure the app remains entirely usable when the user enables "Reduce Transparency" in iOS Accessibility settings (materials will render as opaque colors).

### Layout & Safe Areas
- [x] **Safe Area Constraints:** Ensure content never clips under the Dynamic Island, sensor housing (notch), or the Home Indicator at the bottom of the screen.
- [x] **Layout Margins:** Adhere to standard iOS layout margins (16pt or 20pt on iPhones via `Theme.spacingMD` / `Theme.padding`). Avoid pushing text completely flush to the edges.
- [x] **Orientation Support:** Support landscape orientation gracefully, particularly on "Max" iPhones, by utilizing safe areas and flexible grids.

---

## 2. Interactions & Inputs

### Gestures & Navigation
- [x] **Swipe-to-Go-Back:** Ensure the standard left-edge swipe gesture works on all drill-down screens by using native `NavigationStack`.
- [x] **Pull-to-Refresh:** Use `Refreshable` (native pull-to-refresh) on transaction lists and card details to sync with Plaid, rather than a manual "Sync" button.
- [x] **Swipe Actions:** Use standard `.swipeActions()` on list rows for quick tasks (e.g., deleting a card, pinning a category) rather than hiding these actions behind a modal.

### Haptics & Feedback
- [x] **Ergonomic Confirmation:** Use `.sensoryFeedback(.success)` for task completions (e.g., adding a card) and `.sensoryFeedback(.selection)` for tactile actions like expanding lists.
- [x] **Warning/Error Feedback:** Fired `.warning` and `.error` haptics when actions fail or validation errors occur via `Haptics.error()` in `ErrorViewWithReport`.

### Keyboards & Data Entry
- [x] **Semantic Keyboards:** Always invoke the correct keyboard type for the context (e.g., `.numberPad` or `.decimalPad` for amounts, `.emailAddress` for login).
- [x] **AutoFill & Passwords:** Support iOS AutoFill for quick login. Avoid disabling paste in password or secure fields.
- [x] **Form Navigation:** Provide a clear "Next" or "Done" button on the keyboard accessory view or toolbar when filling out forms (like manual card entry).

### Authentication
- [x] **Face ID / Touch ID:** Integrate `LocalAuthentication` natively for securing sensitive financial data, utilizing the standard iOS biometric prompt (`LAContext`).
- [x] **Sign in with Apple:** Standard HIG-compliant `SignInWithAppleButton` provided in `SignInView.swift`.

---

## 3. Components & UI Elements

### Buttons & Controls
- [x] **Touch Targets:** Strictly adhere to the minimum **44x44 points** tap area for all interactive elements, even if the visual icon is smaller (e.g., a 24x24 icon with 10pt padding).
- [x] **Button States:** Ensure buttons have clear visual states (Default, Pressed, Disabled). Disabled buttons should appear visually distinct (greyed out) but still explain why they are disabled if tapped.
- [x] **Segmented Controls:** Native `SegmentedControl` component for mutually exclusive choices using `systemGray6` capsule container, matched geometry transitions, and haptic feedback.

### Menus & Alerts
- [x] **Context Menus:** Native `.contextMenu` (long press) used on card rows and item lists to reveal secondary actions without cluttering UI.
- [x] **Alerts:** Use alerts sparingly and ONLY for critical, actionable situations (e.g., destructive actions like "Delete Account"). 
- [x] **Destructive Actions:** Destructive buttons inside Alerts and Context Menus are explicitly styled with `role: .destructive` (red text).

### Modals & Navigation
- [x] **Push vs. Modal:** Push navigation (`NavigationLink`) for hierarchical data (List -> Detail). Modals (`.sheet` or `.fullScreenCover`) for self-contained tasks (Add Card, Settings, Authentication).
- [x] **Modal Dismissal:** Clear "Cancel" or "Done" button in top navigation toolbar of modal sheets (`AddCardSheet`), supporting native swipe-down-to-dismiss gesture.

---

## 4. App Architecture & Patterns

### Onboarding
- [x] **Immediate Value:** Defer login or account creation so users can search merchants and discover credit card recommendations immediately.
- [x] **Contextual Permissions:** Biometrics (Face ID) and Notifications requested contextually when enabling app lock or alerts rather than at initial app launch.

### Loading & Empty States
- [x] **Skeleton Loaders / Progress:** Avoid locking UI with full-screen spinners. Skeleton loaders (`AnalyzingTapestryView`) and subtle `ProgressView` in navigation bar are used.
- [x] **Actionable Empty States:** Empty states (`EmptyStateView`, `EmptyWalletTapestryView`) provide engaging hero animations, clear copy, and centered call-to-action buttons.

### System Integration
- [x] **Widgets:** iOS Home Screen Widget provided (`MonetWidgetView`, `WidgetDataProvider`) showcasing top recommended category and card details.
- [x] **App Icon:** High-resolution scalable App Icon formatted without transparent pixels or clutter.
- [x] **Settings App:** Configuration options and color scheme preferences managed cleanly between app settings and iOS system preferences.

---

## 5. Accessibility (A11y) & Localization

### VoiceOver & Screen Readers
- [x] **Semantic Labels:** Ensure all icons have an `.accessibilityLabel` (e.g., a gear icon reads as "Settings" not "gearshape.fill").
- [x] **Hidden Decorations:** Decorative images and background gradients have `.accessibilityHidden(true)` to prevent VoiceOver clutter.
- [x] **Traits:** Interactive views acting as buttons have `.accessibilityAddTraits(.isButton)`.

### Internationalization (i18n)
- [x] **RTL Support:** Standard SwiftUI layout containers (`HStack`, `.padding(.leading)`, `.padding(.trailing)`) mirror automatically for Right-to-Left languages like Arabic and Hebrew.
- [x] **String Flexibility:** UI components (buttons, cards, banners) feature multi-line wrapping and flexible stack widths accommodating localized string expansion up to 50%.
