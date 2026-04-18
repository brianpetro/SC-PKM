---
WHAT: "Why and how to use version control (Git) for notes: history, recovery, and safer refactors, with cautions about sensitive data."
aliases:
- Git for Notes
- Note Versioning
tags:
- version-control
- git
- backup
- history
---

> [!summary]
> Use versioning (e.g., Git) to track changes, recover mistakes, and collaborate safely.

> [!When to use]
> If you fear losing changes or breaking notes, this note shows how version control lets you recover and collaborate safely, even if you work solo.

### What version control enables for notes
- History: see how notes evolved.
- Recovery: undo accidental deletions or bad edits.
- Review: compare versions (diff) to learn how your thinking changed.

### Basic workflow (commit, diff, restore)
- Make changes.
- Commit changes with a short message.
- Review diffs when needed.

### Collaboration patterns and conflict handling
- Solo: local repo with occasional pushes to a private remote.
- Team: shared repo for a public knowledge base or playbook.
- Conflicts happen when two people edit the same lines.

### Backup and audit trail benefits
- A repo may store sensitive content forever (even if deleted later). Align with [[Privacy and Security in PKM]] and do not commit secrets.
- Audit trail: who changed what (useful for shared knowledge bases).
- Recovery beyond sync: you can roll back to any commit.

### When version control is overkill
- your vault is tiny and single-device,
- you do not need history,
- you rarely refactor.


## Next action
Pick one note you touched this week and upgrade it using this note's main rule (1 pass only).
