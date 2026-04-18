---
WHAT: "A minimal metadata schema and rules so notes stay queryable and dashboards work, without turning writing into admin."
aliases:
- YAML conventions
- Metadata conventions
- Properties schema
tags:
- metadata
- standards
- quality
---

> [!summary]
> A small schema makes search and dashboards reliable.

> [!When to use]
> When metadata feels inconsistent or you want queries/dashboards to work reliably.

### Schema
# Frontmatter Conventions (Minimal)

> [!summary]
> A small schema so notes are queryable without becoming forms.

## Required (for most reference notes)
- WHAT: one sentence promise (human scan)
- aliases: 0-3 realistic search phrases
- tags: 0-4 canonical tags

## Optional (use only when you query it)
- status: draft | stable
- reviewed: YYYY-MM-DD
- area: {area name}
- source: URL or citation key

## Rules
- Keep keys stable (changing keys breaks queries).
- Prefer links over tags for meaning.
- If you add a new key, also add:
	- one query that uses it, or
	- one workflow that depends on it.

## Dataview note
If you use Dataview, design queries around these keys (see [[Dataview Dashboard]]).

### Failure mode and fix
Failure mode: You add too many fields and stop writing.

Fix: keep only the fields you query and review regularly.

### Covers / Does not cover
- Covers: Minimal frontmatter keys and rules.
- Does not cover: Complex database-like metadata systems.

## Next action
- Add a 'WHAT' property to 3 notes you use often.
