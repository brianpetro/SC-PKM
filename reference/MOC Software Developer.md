---
WHAT: "Map of content for software developers: capturing technical context, decisions,"
aliases:
- Developer PKM
- PKM for Software Developers
tags:
- moc
- software
- professional
- reuse
---

> [!summary]
> Map of content for software developers: capturing technical context, decisions, and reusable knowledge for faster delivery.

> [!When to use]
> If dev context keeps evaporating between tasks, this map helps you capture decisions, runbooks, and reusable notes, even when you are shipping fast.

### Reading path
- [[Decision Logs]] -> capture rationale so future you can move faster
- [[Efficient Retrieval]] -> naming, tags, and queries for fast lookup
- [[Note Naming Conventions]] -> titles that survive refactors and onboarding
- [[Linking and Connecting Notes]] -> relationship sentences that make links meaningful
- [[Version Control for Notes]] -> safe edits, history, collaboration
- [[Note Refactoring and Maintenance]] -> keep runbooks and design notes current

### Dev pain points (context switching, onboarding, debugging) and PKM targets
- Returning to a codebase after weeks.
- Debugging without a history of reasoning.
- Onboarding into unfamiliar systems.

### Recommended note types (decision logs, snippets, design notes, runbooks) and linking rules
- Debug notes (symptoms, hypotheses, fix, prevention).
- Decision logs (why we chose X over Y).
- Design notes (context, constraints, approach).

### Retrieval setup (naming, tags, queries, MOCs) for fast lookup
- Use clear titles: "How to deploy service X safely" instead of "Deploy notes".
- Add a small set of tags for systems/components.
- Create MOCs per system: entry points to runbooks, decisions, incidents.

### Reuse loop (bugfix -> doc -> template) and keeping notes current
- Add a "Last verified" line to runbooks.
- During weekly review, pick one runbook to verify.
- When you change a system, update the relevant runbooks and decision logs.

### Pitfalls (over-snippeting, stale docs) and maintenance routines
- Fix: only keep snippets that include purpose, inputs/outputs, and context.
- Fix: add a verification cadence and link notes to the systems they describe.
- Fix: write decision logs for major changes and link them from design notes.


## Next action
Add a 'Now' link to one real piece of work (a project/course hub) so this MOC becomes your daily entry point.
