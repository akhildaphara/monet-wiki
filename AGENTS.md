# Monet repository instructions

## Repository layout

- `raw/croe`, `raw/website`, and `raw/swift-app` are independent Git submodules; make and commit changes in the owning submodule, not from the wrapper repository.
- Backend entrypoint: `raw/croe/src/index.ts` (Express locally, `serverless-http` on Lambda). Website entrypoint: `raw/website/src/pages/app.astro`.
- Read the component-specific instructions before editing: `raw/swift-app/AGENTS.md` and `raw/website/AGENTS.md`.

## Commands

- Backend: run commands from `raw/croe`. `npm run dev` starts on port 3000 and requires DynamoDB Local on port 8000; run `npm run init-db` after starting DynamoDB Local. Use `npm run lint`, `npm run build`, `npm test`, `npm run test:unit`, or `npm run test:integration` for focused verification. Deploy with `npm run deploy` (dev) or `npm run deploy:prod` (prod).
- Website: run commands from `raw/website`. The executable source is `package.json`, not the stale Next.js/Vercel `README.md`: this is Astro v5, dev/preview use port 3001, `npm run build` writes `out/`, and `npm run deploy` publishes to Firebase Hosting.
- iOS: use the simulator, scheme, secrets, and `xcodebuild` commands documented in `raw/swift-app/AGENTS.md`; do not invent a different device or scheme.

## Cross-cutting rules

- Consult `wiki-html/hld-dashboard.html` before architecture, API-contract, rate-limit, or backend↔iOS changes. If it conflicts with code, stop and surface the discrepancy.
- Consult `design-system.html` before UI work. Website UI uses the child website instructions, including the 16px `rounded-card` standard radius.
- Website code changes require synchronized semver updates to `raw/website/package.json` and `raw/website/src/utils/version.js`; update the displayed version as required by `raw/website/AGENTS.md`.
- Any new request header must also be added to `raw/croe/src/app.ts`'s `Access-Control-Allow-Headers`; after changing it, tell the user that `sls deploy` is required.
- Any code change in a submodule requires a root-level entry in that submodule's `changelog.md`, using its existing timestamp/title plus numbered-list format.
- Never commit or push without explicit user permission.
