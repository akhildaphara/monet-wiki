# Monet release manifest

## November 21, 2026 local verification

| Component | Checked-out commit | Version / target |
| --- | --- | --- |
| Croe API | `37c7899ca2a3a44675a91df18a16a00f32a42fd9` | Package 1.0.0. Local changes pending commit. |
| Website/PWA | `359a2d4ad5f2b0704cee116527907caab3d39b90` | PWA 0.7.5. Local tooling changes pending commit. Firebase project `monet-3d69d`. |
| iOS | `433c118417356ee3eb46b11f717f62dc55bd22df` | `MonetRelease`, `akhil.Monet`, 0.8.0 (local build 1). App Store Connect and TestFlight build numbers remain unverified. |

These commits identify the local checkout. Record the final immutable commit, archive version/build, and destination from the deployment or Xcode Cloud record when promoting a release.

| API environment | Configuration | Deployed revision |
| --- | --- | --- |
| Local | Express port 3000, DynamoDB Local port 8000, unsuffixed tables | Working tree |
| Dev / beta | Serverless stage `dev`, stack `croe-dev`, `/monet/dev/` parameter namespace. Prior launch notes identify this stage behind `api.tapmonet.com`. | Confirm against AWS deployment record |
| Production | Serverless stage `prod`, stack `croe-prod`, `/monet/prod/` namespace | Confirm deployment, API origin/custom domain, and iOS archive configuration before public release |

## Public crash-report verification

The native app subscribes to MetricKit and can upload saved crash reports to `POST /v1/telemetry/crash` on physical devices when telemetry is enabled. The simulator disables collection. For the first public build, record the App Store Connect build number and release date, verify access to crash reports for that build, and confirm symbolication in Xcode Organizer when reports appear. Verify the Monet backend upload path separately against the same release and API stage. Record first observed reports and the verification date here.

[Apple crash report guidance](https://developer.apple.com/documentation/xcode/acquiring-crash-reports-and-diagnostic-logs)

## Dependency audit

Registry results for the local lockfiles on November 21, 2026. Counts are npm's affected package entries and can include both a direct dependency and its transitive dependency.

| Component | Full dependency tree | Excluding development dependencies |
| --- | --- | --- |
| Croe | 8 entries, seven moderate and one low | 0 |
| Website | 5 entries, one critical, three high, one low | 5 |

Croe’s runtime fixes include the patched Nodemailer release and compatible dependency updates. The remaining backend findings are in lint and build tooling. The patched TypeScript ESLint release expands enum checks and fails the existing backend lint baseline, so this change keeps the established version. The website’s compatible updates clear its Vitest findings. npm points to an Astro major upgrade for the remaining entries. Firebase publishes the static `out/` directory, while Astro and those dependencies are present during the build.

Reproduce from each submodule with `npm audit` and `npm audit --omit=dev`.

## Verification

- Croe lint and TypeScript build passed. The standard suite passed 651 tests and the isolated DynamoDB suite passed 66 tests. A clean DynamoDB Local instance created all 14 tables, and a schema query confirmed the forms table’s primary key and both indexes. Re-running initialization preserved the tables and printed an already-enabled TTL warning for the categorization audit table.
- Website lint, static build, 57 unit tests, and three Chrome browser smoke tests passed. The offline smoke test uses a warmed service-worker cache.
- The iOS `MonetRelease` simulator build passed for iPhone 18 Pro. Live guest entry could not be verified because the build could not reach the configured API from this environment. The screenshot set uses local demo data in the current interface.
