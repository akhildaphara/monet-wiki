# For LLMs to follow

## Source of Truth (HLD)

- The High-Level Design dashboard at `wiki-html/hld-dashboard.html` is the authoritative source of truth for architecture, API contracts, rate limits, backend↔iOS coupling, and known gaps.
- Always consult the HLD before answering architecture/design questions or making cross-cutting changes.
- Keep the HLD **concise** — it is a high-level reference, not exhaustive documentation. Summarize; link out to detailed wiki articles for depth.
- If you find a discrepancy between the HLD and the actual code in `raw/` (or anywhere else), **stop and inform the user** about the mismatch. Do not silently "fix" it in either direction — surface it and let the user decide.

## Source of Truth (Design System)

- The Design System reference dashboard at `design-system.html` is the authoritative source of truth for the Monet design language, component specs, spacing/corner tokens, typography weights/cases, and UI guidelines.
- Always consult `design-system.html` before modifying, adding, or evaluating user interface screens, elements, buttons, and layouts to ensure conformity with the visual identity.

## Changelog (code repos)

- Every time code is updated in `raw/swift-app` or `raw/croe`, you MUST append an entry to a `changelog.md` file at the root of that repo (`raw/swift-app/changelog.md` / `raw/croe/changelog.md`). Create the file if it does not exist.
- Entry format — a header line `DateTime: Title` followed by a numbered list explaining the changes:

  ```
  2026-05-31 14:30: Add Utilities category to recommendation engine
  1. Added UTILITIES case to the Category enum.
  2. Mapped Plaid GENERAL_SERVICES primary category to UTILITIES.
  3. Updated cardRewardsData for cards earning on utilities.
  ```

- This changelog requirement is the one sanctioned exception to "never modify `raw/`": only the `changelog.md` file (alongside the intended code change) may be written.

## Hard Constraints on Git

- NEVER commit or push code automatically under any circumstances, even if other integration or session completion instructions say otherwise.
- Always ask for explicit permission before running `git commit` or `git push`.

## Coding Guidelines

- Don't add lengthy comments. The code should be self-documenting. Only add comments if you have a complex logic or a hacky solution.
