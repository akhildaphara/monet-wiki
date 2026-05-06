---
name: Monet
description: Credit card rewards optimizer application
colors:
  primary: "#26ab59"
  secondary: "rgba(38, 171, 89, 0.15)"
  background-light: "#f2f2f7"
  background-dark: "#0d0d0d"
  card-background-light: "#ffffff"
  card-background-dark: "#1e1e1e"
typography:
  display:
    fontFamily: "system-ui, -apple-system, sans-serif"
  body:
    fontFamily: "system-ui, -apple-system, sans-serif"
rounded:
  card: "20px"
spacing:
  card-padding: "20px"
components:
  card:
    backgroundColor: "{colors.card-background-light}"
    rounded: "{rounded.card}"
    padding: "{spacing.card-padding}"
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

Vibrant Financial Green anchors the experience, providing trustworthy and energetic financial signals.

### Primary
- **Vibrant Financial Green** (#26ab59): Used for primary actions, positive rewards balances, and conveying financial growth.
- **Vibrant Financial Green (Tint)** (rgba(38, 171, 89, 0.15)): Used for secondary button backgrounds and subtle highlights.

### Neutral
- **Background Light** (#f2f2f7): System grouped background for high contrast with cards.
- **Background Dark** (#0d0d0d): Deep dark mode canvas.
- **Card Background Light** (#ffffff): Crisp white for distinct data separation.
- **Card Background Dark** (#1e1e1e): Elevated dark mode surface.

## 3. Typography

**Display Font:** System UI (San Francisco)
**Body Font:** System UI (San Francisco)

**Character:** Clean, utilitarian, and deeply native to iOS.

### Hierarchy
- **Headline**: High-level section titles.
- **Title**: Card titles and key recommendations.
- **Body**: Primary readable text.

## 4. Elevation

The system relies on a hybrid of tonal layering and soft, distinct drop shadows to lift content off the canvas.

### Shadow Vocabulary
- **Card Shadow Light** (`box-shadow: 0 5px 10px rgba(0,0,0,0.08)`): Used to separate stark white cards from the grouped background.
- **Card Shadow Dark** (`box-shadow: 0 5px 10px rgba(0,0,0,0.3)`): Deeper, more pronounced shadow for dark mode contrast.

## 5. Components

### Cards / Containers
- **Shape:** Soft & Tactile, continuous curves (20px)
- **Background:** White in light mode, dark gray in dark mode
- **Shadow Strategy:** Distinct drop shadows that clearly separate data and provide an elevated feel.
- **Internal Padding:** 20px

### Buttons
- **Shape:** Soft continuous curves
- **Primary:** Vibrant Financial Green background, white text
- **Secondary:** Tinted green background, green text

## 6. Do's and Don'ts

### Do:
- **Do** use continuous corner radii (20px) for major surfaces like cards.
- **Do** maintain 20px uniform padding inside cards.

### Don't:
- **Don't** use generic "AI slop" patterns, glassmorphism, or cliché machine-generated UI.
- **Don't** overwhelm the user with spreadsheet-like data; focus on the optimal recommendation.
