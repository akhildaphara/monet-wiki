# ADR-0001: Record Architecture Decisions

* **Status**: Accepted
* **Date**: 2026-05-27
* **Deciders**: AI Agent, Akhil Daphara

## Context and Problem Statement

As the Monet codebase grows and spans multiple distinct components (the modular Node.js/Express backend `croe`, the Swift/SwiftUI iOS frontend `swift-app`, and the Next.js landing page/website `website`), we need a lightweight, standard way to record and track major architectural decisions.

Without a formal process, technical decisions can become lost in commits, PR descriptions, or Slack messages. New contributors (including AI subagents) face difficulty understanding *why* certain patterns or tools were chosen, leading to architectural drift or redundant research.

## Decision Drivers

* **Transparency**: Keep a clear, readable trail of architectural rationale.
* **Developer Onboarding**: Reduce onboarding time for new humans and AI agents joining the project.
* **Alignment**: Standardize architecture across the frontend, backend, and infrastructure layers.
* **Git-adjacent**: Keep documentation close to the code, rather than in third-party wikis.

## Considered Options

1. **Option 1: Informal documentation (Commit messages/PR descriptions only)**
2. **Option 2: Wiki pages on Notion/GitHub Wiki**
3. **Option 3: Architectural Decision Records (ADRs) stored in a `doc/adr` directory in Git (Recommended)**

## Decision Outcome

Chosen Option: **Option 3** (Architectural Decision Records in `doc/adr`) because it treats architectural documentation as first-class code. It allows decisions to be reviewed alongside code changes during Pull Requests, stored offline, and tracked with git history.

### Consequences

* **Good**: All major decisions are version-controlled, visible, and searchable inside the main repository.
* **Good**: Architecture changes undergo the same PR/peer review process as code.
* **Bad**: Adds a small amount of documentation overhead when introducing major architectural shifts.
* **Follow-up Tasks**:
  - Add a standard `template.md` to `doc/adr/` (Completed).
  - Use this template when proposing new frameworks, core libraries, database schemas, or cross-cutting design patterns.
