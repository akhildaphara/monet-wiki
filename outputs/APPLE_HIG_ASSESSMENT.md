# Monet iOS App: Exhaustive Apple HIG Assessment & Guidelines

## Executive Summary
This document provides a comprehensive, deep-dive assessment of the **Apple Human Interface Guidelines (HIG)** across all iOS-specific domains. By adhering to these guidelines, Monet will achieve the seamless, intuitive, and highly refined experience that iOS users expect. 

---

## 1. Foundations

### Typography & Dynamic Type
- [x] **Semantic Fonts:** Use semantic text styles (`.largeTitle`, `.title`, `.headline`, `.body`, `.caption`, etc.) instead of hardcoded point sizes to ensure compatibility with iOS Accessibility settings.
- [x] **Dynamic Type Testing:** Verify text scales up gracefully when "Larger Accessibility Sizes" are enabled in iOS Settings without breaking layouts or truncating critical financial data.
- [ ] **Font Tracking & Leading:** Rely on the system `SF Pro` font which automatically adjusts tracking (letter spacing) and leading (line height) at different sizes.

### Color & Dark Mode
- [x] **System Colors:** Use system colors (like `.systemBackground`, `.secondarySystemBackground`) to ensure automatic, seamless switching between Light and Dark modes.
- [ ] **Semantic Tints:** Ensure Monet's brand colors (e.g., Vibrant Green) are adjusted for Dark Mode (desaturated slightly) to prevent eye strain and blooming against dark backgrounds.
- [ ] **Contrast Ratios:** Verify that all text has a minimum contrast ratio of 4.5:1 against its background in both Light and Dark modes.

### Materials & Depth (Spatial Design)
- [x] **Native Blurs:** Use native iOS Materials (`.ultraThinMaterial`, `.regularMaterial`, `.thickMaterial`) instead of custom semi-transparent opacities for overlays, sticky headers, and modal sheets to convey spatial hierarchy.
- [x] **Reduce Transparency:** Ensure the app remains entirely usable when the user enables "Reduce Transparency" in iOS Accessibility settings (materials will render as opaque colors).

### Layout & Safe Areas
- [ ] **Safe Area Constraints:** Ensure content never clips under the Dynamic Island, sensor housing (notch), or the Home Indicator at the bottom of the screen.
- [ ] **Layout Margins:** Adhere to standard iOS layout margins (16pt or 20pt on iPhones). Avoid pushing text completely flush to the edges.
- [ ] **Orientation Support:** Support landscape orientation gracefully, particularly on "Max" iPhones, by utilizing safe areas and flexible grids.

---

## 2. Interactions & Inputs

### Gestures & Navigation
- [ ] **Swipe-to-Go-Back:** Ensure the standard left-edge swipe gesture works on all drill-down screens. Avoid custom back buttons that disable this native gesture.
- [x] **Pull-to-Refresh:** Use `Refreshable` (native pull-to-refresh) on transaction lists and card details to sync with Plaid, rather than a manual "Sync" button.
- [x] **Swipe Actions:** Use standard `.swipeActions()` on list rows for quick tasks (e.g., deleting a card, pinning a category) rather than hiding these actions behind a modal.

### Haptics & Feedback
- [x] **Ergonomic Confirmation:** Use `.sensoryFeedback(.success)` for task completions (e.g., adding a card) and `.sensoryFeedback(.selection)` for tactile actions like expanding lists.
- [ ] **Warning/Error Feedback:** Use `.warning` or `.error` haptics when an action fails (e.g., a Plaid sync failure).

### Keyboards & Data Entry
- [x] **Semantic Keyboards:** Always invoke the correct keyboard type for the context (e.g., `.numberPad` or `.decimalPad` for amounts, `.emailAddress` for login).
- [x] **AutoFill & Passwords:** Support iOS AutoFill for quick login. Avoid disabling paste in password or secure fields.
- [x] **Form Navigation:** Provide a clear "Next" or "Done" button on the keyboard accessory view or toolbar when filling out forms (like manual card entry).

### Authentication
- [ ] **Face ID / Touch ID:** Integrate `LocalAuthentication` natively for securing sensitive financial data, utilizing the standard iOS biometric prompt.
- [ ] **Sign in with Apple:** If utilizing external accounts, provide "Sign in with Apple" as it is a mandatory HIG requirement for apps using third-party logins.

---

## 3. Components & UI Elements

### Buttons & Controls
- [x] **Touch Targets:** Strictly adhere to the minimum **44x44 points** tap area for all interactive elements, even if the visual icon is smaller (e.g., a 24x24 icon with 10pt padding).
- [x] **Button States:** Ensure buttons have clear visual states (Default, Pressed, Disabled). Disabled buttons should appear visually distinct (greyed out) but still explain why they are disabled if tapped.
- [ ] **Segmented Controls:** Use native segmented controls for mutually exclusive choices (e.g., 30 Days / 90 Days / 180 Days) rather than custom radio buttons.

### Menus & Alerts
- [ ] **Context Menus:** Use native `contextMenu` (long press) to reveal secondary actions for items (like copying a card number) instead of cluttering the UI with ellipsis (...) buttons everywhere.
- [ ] **Alerts:** Use alerts sparingly and ONLY for critical, actionable situations (e.g., destructive actions like "Delete Account"). 
- [ ] **Destructive Actions:** Ensure destructive buttons inside Alerts and Context Menus are styled with the `.destructive` role (red text).

### Modals & Navigation
- [ ] **Push vs. Modal:** Use Push navigation (`NavigationLink`) for hierarchical data (List -> Detail). Use Modals (`.sheet` or `.fullScreenCover`) for self-contained tasks (Add Card, Settings).
- [ ] **Modal Dismissal:** Always provide a clear "Cancel" or "Done" button in the top navigation bar of a modal sheet, in addition to supporting the native swipe-down-to-dismiss gesture.

---

## 4. App Architecture & Patterns

### Onboarding
- [ ] **Immediate Value:** Defer login or account creation as much as possible until the user understands the app's value. 
- [ ] **Contextual Permissions:** Never ask for Notifications or Face ID immediately upon launch. Ask for them contextually (e.g., "Enable notifications to get weekly spending summaries").

### Loading & Empty States
- [ ] **Skeleton Loaders / Progress:** Avoid locking the UI with a full-screen spinner if possible. Use skeleton loaders for data fetching or a subtle `ProgressView` in the navigation bar.
- [ ] **Actionable Empty States:** If a user has no cards, the empty state must clearly explain what to do next and provide a prominent, centered Call-To-Action (CTA) to add a card.

### System Integration
- [ ] **Widgets:** Consider providing an iOS Home Screen Widget for quick access to "Top Category to use today."
- [ ] **App Icon:** Ensure the App Icon does not contain transparent pixels, text (unless it's a logo), or complex UI elements. It should be scalable and distinct.
- [ ] **Settings App:** Place configuration settings that rarely change in the iOS Settings app bundle, but keep frequently used settings in-app.

---

## 5. Accessibility (A11y) & Localization

### VoiceOver & Screen Readers
- [x] **Semantic Labels:** Ensure all icons have an `.accessibilityLabel` (e.g., a gear icon reads as "Settings" not "gearshape.fill").
- [x] **Hidden Decorations:** Decorative images and background gradients must have `.accessibilityHidden(true)` to prevent VoiceOver clutter.
- [x] **Traits:** Interactive views acting as buttons must have `.accessibilityAddTraits(.isButton)`.

### Internationalization (i18n)
- [ ] **RTL Support:** Use `leading` and `trailing` instead of `left` and `right` for padding and alignment so the app mirrors correctly for Right-to-Left languages like Arabic and Hebrew.
- [ ] **String Flexibility:** Ensure UI components (especially buttons and tabs) do not break if localized text expands by up to 50% (common in languages like German or Russian).
