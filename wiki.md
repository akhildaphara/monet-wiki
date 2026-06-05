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

## My Interests

Suggest new Ideas.
Make API efficient and scalable.
Find bugs.
Make UI/UX best in class.
Do security analysis.
Add/Update credit card rewards data.
