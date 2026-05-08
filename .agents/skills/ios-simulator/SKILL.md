# iOS Simulator & Automation Skill

This skill provides instructions for AI agents on how to interact with, control, and automate iOS applications using the iOS Simulator and `xcodebuild` from the command line.

## Core Principles

1. **No GUI needed**: The agent interacts with the iOS Simulator entirely through terminal commands.
2. **XCUITest as Playwright**: To drive the UI (tapping, typing, swiping), the agent should write or modify XCUITests and execute them via `xcodebuild`.
3. **`simctl` for Device Management**: Use `xcrun simctl` to control the simulator state (booting, installing, simulating permissions).

---

## Tool 1: `xcrun simctl` (Simulator Control)

`simctl` is the command-line utility to control iOS simulators.

### Finding and Booting Simulators

- **List all available devices:**
  `xcrun simctl list devices available`
- **Boot a specific simulator** (by name or UUID):
  `xcrun simctl boot "iPhone 17 Pro"`
  _(If it's already booted, it will safely ignore or throw a benign error)._
- **Check booted status:**
  `xcrun simctl list devices | grep Booted`

### Interacting with the Booted Device

Once booted, you can interact with the active simulator (using the `booted` keyword instead of a specific UUID):

- **Install an app:**
  `xcrun simctl install booted /path/to/YourApp.app`
- **Launch an app:**
  `xcrun simctl launch booted com.yourcompany.YourApp`
- **Terminate an app:**
  `xcrun simctl terminate booted com.yourcompany.YourApp`
- **Uninstall an app:**
  `xcrun simctl uninstall booted com.yourcompany.YourApp`

### Simulating Device State

- **Set dark/light mode:**
  `xcrun simctl ui booted appearance dark`
  `xcrun simctl ui booted appearance light`
- **Trigger a deep link / URL:**
  `xcrun simctl openurl booted "monet://insights"`
- **Grant permissions (Location, Camera, etc.):**
  `xcrun simctl privacy booted grant location com.yourcompany.YourApp`
- **Take a screenshot:**
  `xcrun simctl io booted screenshot screenshot.png`

---

## Tool 2: `xcodebuild test` (UI Automation)

To interact with elements on the screen (tap buttons, enter text), use the XCUITest framework.

### 1. Identify the Workspace and Scheme

Always verify the workspace (`.xcworkspace`) or project (`.xcodeproj`) and the Scheme name. For Monet, the workspace is located at `raw/Monet/Monet.xcodeproj/project.xcworkspace` and the scheme is `Monet`.

- **List schemes:**
  `xcodebuild -workspace raw/Monet/Monet.xcodeproj/project.xcworkspace -list`

### 2. Running XCUITests

To run a specific UI test file or suite without launching the full Xcode GUI, use the `test` action.

- **Basic Test Command for Monet:**
  ```bash
  xcodebuild -workspace raw/Monet/Monet.xcodeproj/project.xcworkspace \
             -scheme Monet \
             -destination 'platform=iOS Simulator,name=iPhone 17 Pro' \
             test -only-testing:UITests
  ```
- **Run a specific test class or method:**
  Append the class or method to the `-only-testing` flag:
  `-only-testing:UITests/MerchantSearchUITests/testSuccessfulSearch`

### 3. Writing XCUITests to Drive the UI

When tasked with "testing a flow" or "interacting with a view", the agent should write a swift XCUITest file.

- **App Launch:** `let app = XCUIApplication(); app.launch()`
- **Finding Elements:** `app.buttons["Login"].tap()` or `app.textFields["Email"].typeText("test@example.com")`
- **Assertions:** `XCTAssertTrue(app.staticTexts["Welcome"].exists)`

### Troubleshooting Builds

- If `xcodebuild` fails with a bundle error, try running a clean build first:
  `xcodebuild ... clean test`
- If testing takes too long to build, use `test-without-building` if the app is already compiled.

---

## Typical Agent Workflow

1.  **Understand the Request:** The user asks to test a UI feature (e.g., "See if the checkout button works").
2.  **Locate/Write the Test:** Find the relevant `*UITests.swift` file. Write the XCUITest script to perform the UI actions.
3.  **Boot Simulator:** Run `xcrun simctl boot "iPhone 17 Pro"`.
4.  **Execute Test:** Run the `xcodebuild test` command.
5.  **Analyze Results:** Read the output logs to determine if the test passed, meaning the UI interaction was successful.
