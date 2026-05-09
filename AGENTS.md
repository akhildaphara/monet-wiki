# Knowledge Base Schema

## What This Is

A knowledge base about the app Monet. A credit card rewards optimizer app.

## How It's Organized

- raw/ contains unprocessed source material. Never modify these files.
- wiki/ contains the organized wiki. AI maintains this entirely.
- outputs/ contains generated reports, answers, and analyses.

## Wiki Rules

- Every topic gets its own .md file in wiki/
- Every wiki file starts with a one-paragraph summary
- Link related topics to each other using [[topic-name]] format
- Maintain an INDEX.md in wiki/ that lists every topic with a one-line description
- When new raw sources are added, update the relevant wiki articles
- When a git resource is updated, resync the wiki and add the commit hash in the logs.md (Only evaluate main branch)

## My Interests

Suggest new Ideas.
Make API efficient and scalable.
Find bugs.
Make UI/UX best in class.
Do security analysis.
Add/Update credit card rewards data.

## Infrastructure Rules

- **AWS CLI**: Always use `--profile dev` when running `aws` commands on this machine.
- **Serverless**: Always use `--profile dev` or ensure the profile is correctly set in `serverless.yml`.
- **Region**: The default AWS region for this project is `us-east-1`.
