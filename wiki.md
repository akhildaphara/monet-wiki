# Knowledge Base Schema

## What This Is

A knowledge base about the app Monet. A credit card rewards optimizer app.

## How It's Organized

- `raw/` contains the three implementation repositories. Treat executable code and infrastructure configuration as the product source of truth; edit a submodule only when the task explicitly includes code changes.
- `wiki-html/` contains the organized, current-state wiki. AI maintains this entirely.
- `outputs/` contains generated reports, answers, analyses, and dated planning artifacts. A dated artifact is historical unless it explicitly says it was revalidated.

## Source-of-Truth Order

1. Executable code and infrastructure (`src/`, `serverless.yml`, `resources/`, Xcode project/configuration, Astro/Firebase configuration).
2. Component `AGENTS.md` files and current tests.
3. `wiki-html/Current-State.html` and the component wiki pages.
4. Dated files under `outputs/`; these may describe proposals or past findings rather than shipped behavior.

The latest verified snapshot is `wiki-html/Current-State.html`. When a historical report conflicts with that page or with code, code wins.

## Wiki Rules

- Every topic gets its own .html file in wiki-html/
- Every wiki file starts with a one-paragraph summary
- Link related topics to each other using [[topic-name]] format
- Maintain an INDEX.html in wiki-html/ that lists every topic with a one-line description
- When new raw sources are added, update the relevant wiki articles
- A wiki sync log entry in `logs.html` MUST contain exactly 3 commit hashes representing the HEAD of all 3 repos (`croe`, `swift-app`, `website`). Always update these commit hashes when the wiki is synced. (Only evaluate main branch)
- Every sync should refresh `Current-State.html`, correct contradicted claims in topic pages, and record verification limitations (for example, local-only inspection versus deployed-environment confirmation).

## My Interests

Suggest new Ideas.
Make API efficient and scalable.
Find bugs.
Make UI/UX best in class.
Do security analysis.
Add/Update credit card rewards data.
