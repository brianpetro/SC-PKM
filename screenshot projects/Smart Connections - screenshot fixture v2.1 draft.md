---
state: draft
alignment:
  - "[[Smart Connections - screenshot fixture]]"
fixture_id: smart-connections-demo-v2.1
fixture_version: 2.1.0-draft
provenance: v2 kept untouched; this is a new draft fixture
reference_demo_source_target: "reference/Smart Connections Demo/smart-connections-demo-v2.1"
created_on: 2026-06-23
updated_on: 2026-06-26
---

# Smart Connections - screenshot fixture v2.1 draft

## WHY

v2.1 strengthens semantic contrast without changing product behavior. The goal is not to stuff keywords or force ranking. The goal is a cleaner human-readable source note where the best related notes are obviously useful before Smart Connections runs.

Keep the v2 fixture untouched for provenance. Do not rename, rewrite, or repurpose `Smart Connections Demo/` when testing this draft. Create the v2.1 reference source under `reference/Smart Connections Demo/`, not under `screenshot projects/`.

## fixture contract

- Demo note root after restore: `Smart Connections Demo v2.1/`
- Reference source target: `reference/Smart Connections Demo/smart-connections-demo-v2.1/`
- Snapshot IDs:
  - `v2.1-base-unlinked`
  - `v2.1-post-link`
  - `v2.1-bases-unscored`
  - `v2.1-bases-scored`
- Expected profile contracts mirror v2:
  - `sc-core-clean`
  - `sc-pro-clean`
  - `sc-context-addendum`
  - `sc-graph-addendum`
- The source/index boundary must exclude v2, screenshot project records, reference notes outside the selected demo source, prior outputs, and QA notes.

## anchor note

File:

```text
Smart Connections Demo v2.1/How I avoid losing context while writing.md
```

Content for `v2.1-base-unlinked`:

```md
# How I avoid losing context while writing

I am drafting a product note and the hardest part is not finding more information. The hard part is staying with the paragraph in front of me while still noticing the older notes that would make it stronger.

When a useful idea is hidden three folders away, I either interrupt myself with a search or keep writing without the context. Both choices are expensive. Search breaks flow. Ignoring the prior note makes the new draft weaker.

The better workflow is just-in-time context. While I write about reducing context switching, I want nearby notes about attention residue, deep work, information overload, and deliberate linking to appear beside the draft. I can inspect one candidate, decide whether it truly helps, and only then turn it into a durable link.

That keeps the system honest. The related note is a suggestion, not an automatic decision. I still choose the relationship, but I no longer have to remember every useful source before I can use it.

## Active paragraph

The moment that matters is the paragraph where attention is at risk. If context appears there, I can connect the draft to previous thinking without opening a search tab, scanning folders, or rebuilding the same idea from scratch.

## Review

At the end of the note, I want a small set of high-signal related notes. A good result should help me continue writing, reduce duplicated thinking, or reveal a connection that deserves a real link.

### Related
```

Content difference for `v2.1-post-link`:

```md
### Related
- [[Smart Connections Demo v2.1/Related/Attention Residue and Writing Flow|Attention Residue and Writing Flow]]
```

## related notes

### Attention Residue and Writing Flow

```md
# Attention Residue and Writing Flow

Attention residue appears when part of the mind remains attached to the previous task. In writing, every unnecessary switch leaves behind a small cost that makes the next sentence harder to finish.

A good note system should reduce switching at the moment of composition. It should bring nearby context into view without forcing the writer to leave the draft.
```

### Deep Work During Drafting

```md
# Deep Work During Drafting

Deep work depends on protecting the active thread of attention. When a tool asks the writer to search, sort, and compare too early, the tool becomes part of the distraction.

The best retrieval workflow appears close to the active paragraph and gives just enough context to decide whether a source deserves a full read.
```

### Information Overload Triage

```md
# Information Overload Triage

Information overload is not solved by collecting more inputs. It is reduced by choosing which signals matter for the decision at hand.

During writing, the useful signal is the note that changes the current paragraph. Everything else can wait until review.
```

### Deliberate Linking

```md
# Deliberate Linking

A durable link should express a relationship worth revisiting. Automatic suggestions are useful only when they make the decision easier without replacing judgment.

The writer should inspect the candidate, understand why it relates, and then choose whether the connection belongs in the note.
```

### Just-in-Time Context

```md
# Just-in-Time Context

Just-in-time context appears when it can change the next action. It is different from a dashboard, archive, or search result page because it stays close to the work already underway.

For knowledge work, this means the active paragraph can pull in prior notes without turning the session into a separate research task.
```

### Review Loops for Knowledge Work

```md
# Review Loops for Knowledge Work

A review loop turns scattered notes into usable memory. The loop is strongest when it asks what the current work needs, not what the archive happens to contain.

Small linking passes at the end of a note can improve future retrieval while preserving the momentum of the original writing session.
```

## negative controls

### Printer Cartridge Inventory

```md
# Printer Cartridge Inventory

The office printer uses black and cyan cartridges. Check the supply shelf before ordering replacements and recycle the empty package after installation.
```

### Weekend Grocery Plan

```md
# Weekend Grocery Plan

Buy oats, spinach, apples, rice, and coffee. Confirm the pantry before leaving so duplicate ingredients do not crowd the shelf.
```

### Hotel Loyalty Numbers

```md
# Hotel Loyalty Numbers

Store confirmation numbers and loyalty program IDs in the travel folder. Verify the check-in time before departure.
```

## expected result contracts

| Scene | Fixture result contract |
|---|---|
| Current note Connections | At least 3 of the top 5 are from the v2.1 related-note set; no negative control in top 5. |
| Insert link | `Attention Residue and Writing Flow` is visible as a result and a real action inserts the link. |
| Footer related notes | Top visible footer results include at least 3 v2.1 related notes and no negative control. |
| Inline popover | Active paragraph shows an inline affordance and at least 3 fixture related results. |
| Bases score | At least 4 related notes score above every negative control. |
| Context addendum | Picker receives at least 3 current-note fixture results, including one top-3 result. |

## production note

This draft is meant to make the screenshot story more legible:

- source problem: losing context while writing
- product output: relevant prior notes appear beside the draft
- action: inspect, link, sort, or add to context

Do not use v2.1 for official capture until its own reference source has been created and verified.
