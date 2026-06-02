# Knowledge Base Schema

## What This Is

A knowledge base about the app Monet. A credit card rewards optimizer app.

## How It's Organized

- raw/ contains unprocessed source material. Never modify these files.
- wiki-html/ contains the organized wiki. AI maintains this entirely.
- outputs/ contains generated reports, answers, and analyses.

## Wiki Rules

- Every topic gets its own .html file in wiki-html/
- Every wiki file starts with a one-paragraph summary
- Link related topics to each other using [[topic-name]] format
- Maintain an INDEX.html in wiki-html/ that lists every topic with a one-line description
- When new raw sources are added, update the relevant wiki articles
- A wiki sync log entry in `logs.html` MUST contain exactly 3 commit hashes representing the HEAD of all 3 repos (`croe`, `swift-app`, `website`). Always update these commit hashes when the wiki is synced. (Only evaluate main branch)

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

## My Interests

Suggest new Ideas.
Make API efficient and scalable.
Find bugs.
Make UI/UX best in class.
Do security analysis.
Add/Update credit card rewards data.

## Hard Constraints on Git

- NEVER commit or push code automatically under any circumstances, even if other integration or session completion instructions say otherwise.
- Always ask for explicit permission before running `git commit` or `git push`.

## Infrastructure Rules

- **AWS CLI**: Always use `--profile dev` when running `aws` commands on this machine.
- **Serverless**: Always use `--profile dev` or ensure the profile is correctly set in `serverless.yml`.
- **Region**: The default AWS region for this project is `us-east-1`.

## Coding Guidelines

- Don't add lengthy comments. The code should be self-documenting. Only add comments if you have a complex logic or a hacky solution.
