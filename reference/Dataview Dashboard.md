---
WHAT: "A minimal Dataview dashboard (inbox, recency, missing metadata, orphans) that makes review and hygiene one click."
aliases:
- Dataview dashboard
- PKM dashboard
tags:
- queries
- automation
- retrieval
---

> [!summary]
> A dashboard makes review one click.

> [!When to use]
> When you keep hunting for the same notes or your review queues are manual and inconsistent.

### Dashboard
# Dataview Dashboard (Minimal)

> [!summary]
> A small set of queries that surfaces what matters without manual hunting.

## Inbox (unprocessed)
```dataview
LIST
FROM ""
WHERE contains(tags, "inbox")
SORT file.mtime desc
LIMIT 30
```

## Recently edited (what you are actually working on)
```dataview
LIST
FROM ""
SORT file.mtime desc
LIMIT 20
```

## Notes missing a WHAT (metadata hygiene)
```dataview
LIST
FROM ""
WHERE !WHAT
SORT file.mtime desc
```

## Orphans (notes with no links)
```dataview
LIST
FROM ""
WHERE length(file.outlinks) = 0 AND length(file.inlinks) = 0
SORT file.mtime desc
LIMIT 50
```

> [!note]
> Dataview field names depend on your frontmatter keys. See [[Frontmatter Conventions]].

### Failure mode and fix
Failure mode: You build complex queries and never use them.

Fix: keep 3-5 queries that you run weekly. Delete the rest.

### Covers / Does not cover
- Covers: A small default dashboard for surfacing important queues.
- Does not cover: Advanced Dataview scripting.

## Next action
- Add one Dataview query to your weekly review note and use it this week.
