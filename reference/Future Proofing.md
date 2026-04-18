---
WHAT: "Make your PKM durable over years with portability, dependency audits, backups with restore tests, and clean archiving habits."
aliases:
- Future-proofing
- Dependency Minimization
- Tool Risk Management
tags:
- maintenance
- backup
- archiving
- portability
- resilience
- dependencies
- tooling
---

> [!summary]
> Keep your PKM durable through backups, archives, portability, and upkeep.

> [!When to use]
> If you worry your notes will not survive tool changes, this note shows how to make your PKM durable with backups and portability, even if you are not technical.
> If plugins break and your workflow collapses, this note helps you reduce fragile dependencies so your PKM survives, without giving up useful power.

### Portability principles (plain text, exports)
- Building critical workflows on fragile plugins with no fallback. Counter with [[Future Proofing]].
- Prefer plain Markdown and stable filenames.
- Keep attachments in standard formats (PDF, PNG, etc).
- Plain Markdown files.
- Simple YAML frontmatter.
- Portable images/attachments (with predictable folders).

### Identify high-risk dependencies and points of failure
- A plugin that stores critical data in a proprietary format.
- A vendor feature you cannot reproduce elsewhere (AI summaries, sync, task management).
- A workflow that breaks if one hotkey or one service is down.

### Tool change plan and dependency audit
- Which plugins are required for core workflows?
- Which data formats are plugin-specific?
- What breaks if a plugin is removed?

### Plugin and vendor audit checklist
- What does this tool store that I would lose?
- Can I export it in plain text?
- What is the fallback if it stops working tomorrow?

### Fallback workflows when tools break
- If sync breaks, you still have local backups and Git (see [[Version Control for Notes]]).
- If AI plugins break, you still have backlinks, MOCs, and search.
- If a plugin breaks formatting, disable it without losing content.

### Backup strategy and recovery testing
- At least one local backup and one offsite backup.
- Keep multiple versions (point-in-time snapshots).
- Automate the backups if possible.

### Archive rules and sunsetting content
- Archive finished projects as a folder move (Projects -> Archive).
- Keep a short "project summary" note at the top so future you knows what happened.
- Do not keep "active" tags on archived work.

### Maintenance cadence to prevent rot
- Weekly: fix obvious broken links, keep inbox under control.
- Monthly: archive stale work, consolidate tags, review plugin list.
- Quarterly: test restore, revisit dependency audit, prune unused templates.

### When to accept dependencies intentionally
- Fix: use the tool, but keep core data portable and documented.
- The value is high and frequent.
- The export path is clear.


## Next action
Pick one note you touched this week and upgrade it using this note's main rule (1 pass only).
