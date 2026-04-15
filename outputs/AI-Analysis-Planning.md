# Feature Plan: PDF Statement Analysis & AI Optimization Strategy

[Maybe I should just do this as a gemma/opal app within gemini?]
This document outlines the plan to implement a "Manual Analyze" feature for Monet. This feature leverages Gemini AI to solve the problem of **complex, dynamic reward structures** (like Bilt 2.0 rent tiers or "Highest Category" multipliers) that static optimizers struggle with. Users will be directed to a **companion web application** to upload 1-6 months of PDF statements, which Gemini will analyze to generate both a retrospective efficiency report and a forward-looking AI Strategy.

## 1. Feature Overview

The goal is to provide deep personalization by analyzing historical patterns to optimize for cards where the "Best Card" isn't static.

### Key Components:

- **Complex Reward Modeling**: Solving for cards like:
  - **Bilt 2.0**: Earning tiers (0.5x to 1.25x) based on non-rent spend.
  - **Highest-Spend Categories**: Cards like Citi Custom Cash (5x on your top category) or BoA Customized Cash.
- **Companion Web App**: A secure portal for desktop PDF uploads and Gemini processing.
- **Missed Rewards Report**: A retrospective analysis showing exactly how much cashback the user missed in previous months by using the wrong cards for their specific spending mix.
- **AI Strategy Map**: A JSON object synced to the iOS app that provides dynamic "overrides" based on the user's predictable monthly habits (e.g., "Use your Bilt card for all Dining this month to ensure you hit the 1.0x Rent multiplier").

## 2. Technical Architecture

### A. Backend (`Croe-Backend`)

- **Gemini Synthesis Pipeline**:
  - **Extraction**: Extract clean (Date, Merchant, Category, Amount) lists from PDF text.
  - **Back-Testing**: The engine runs the user's historical transactions against their wallet's reward rules to calculate the _theoretical maximum_ rewards vs. what they _likely_ earned.
  - **Dynamic Strategy Generation**: Gemini analyzes the user's monthly averages. If it sees the user consistently spends $600 on Groceries, it might generate a strategy: _"Set your BoA Customized Cash to 'Grocery' this month as it represents your highest potential variable return."_
- **Strategy Sync**: The "AI Strategy Map" is saved to the `UserContext` in DynamoDB.

### B. iOS Frontend (`Monet-iOS-App`)

- **UI Hook**: Button in `ProfileView` linking to the web portal.
- **AI-Augmented Recommendations**:
  - When `useAIStrategy` is enabled, the recommendation engine doesn't just look at the merchant category.
  - It consults the **AI Strategy Map**.
  - **Example**: If the user searches for a Restaurant, and the AI Strategy knows the user needs $200 more in "Everyday Spend" to unlock a Bilt rent tier, it will recommend the Bilt card even if another card has a higher base dining multiplier.
- **Reasoning UI**: Displays personalized strings like: _"AI Strategy: Use this card to hit your 75% Bilt Rent Tier (Value: $42 in unlocked points)."_

## 3. Data Flow & AI Logic

1.  **Ingestion (Web)**: User authenticates and uploads PDFs.
2.  **Analysis (Backend/Gemini)**:
    - **Step 1 (Cleaning)**: Standardize transaction history.
    - **Step 2 (Retrospective)**: Generate a Markdown report: "In November, you missed $24.10 in rewards. You used Card X at Starbucks, but because of your total spend, Card Y would have been better."
    - **Step 3 (Modeling)**: Calculate expected spending for the _next_ month based on historical averages.
    - **Step 4 (Strategy)**: Allocate the user's cards to categories to maximize return on dynamic/capped cards.
3.  **Application (iOS)**: The Strategy Map is applied to live searches to provide "pattern-aware" advice.

## 4. Implementation Phases

### Phase 1: Retrospective Report Engine

- Build PDF extraction and the Gemini prompt for the "Spending Overview & Missed Rewards" report.
- Deliver this as a viewable Markdown report in the Web Companion.

### Phase 2: Predictive Strategy Map

- Update the Gemini prompt to output a machine-readable JSON Strategy Map.
- This map will contain "Contextual Multipliers" (e.g., "BILT_BLUE: 8.5x (Marginal)") based on the user's predicted month-to-date progress.

### Phase 3: iOS Live Integration

- Update `DataStore.swift` and the iOS recommendation UI to prioritize AI Strategy insights over static mappings when enabled.

## 5. Security & Privacy

- PII scrubbing (Account numbers/Names) is performed via regex before Gemini ingestion.
- PDF data is processed ephemerally.
- AI Strategy is stored as an encrypted blob in DynamoDB.
