---
state: next
alignment:
  - "[[Plugins - screenshots SOP]]"
fixture_id: smart-connections-demo-v2
fixture_version: 2.0.0
---

# Smart Connections - screenshot fixture

## WHY

This fixture creates one coherent note cluster that can produce real, current Smart Connections, Smart Lookup, Connections Pro, Bases, and Smart Context output without rewriting product UI or depending on private vault data.

## fixture contract

- Use a dedicated vault named `Smart Connections Demo Vault`.
- Keep all fixture files under `Smart Connections Demo/`.
- Use the exact fixture version recorded by the capture run.
- Complete indexing before evaluating semantic results.
- Never manually edit scores or result order.
- Treat expected titles as a membership contract, not an exact ranking contract.
- Clone or restore the named snapshot before every official capture run.
- Store canonical scene notes, manifests, and image records in Smart Vault; keep demo content isolated in the dedicated fixture vault/profile.

## profile matrix

| Profile ID | Required plugins | Must be absent or disabled | Scenes |
|---|---|---|---|
| `sc-core-clean` | Smart Environment, Smart Connections Core | Connections Pro, Smart Lookup, Smart Context | 01, 02 |
| `lookup-core-clean` | Smart Environment, Smart Lookup Core | Smart Connections, Connections Pro, Smart Context | 03 |
| `sc-pro-clean` | Smart Environment, Smart Connections Core, Connections Pro | Smart Lookup, Smart Context | 04, 05 |
| `sc-context-core` | Smart Environment, Smart Connections Core, Smart Context Core | Connections Pro, Smart Lookup | 06 |

Use cloned Obsidian profiles or a reproducible plugin enablement record.

Do not create a Core screenshot by hiding Pro indicators from a Pro profile.

## result scoping policy

- Prefer a namespaced fixture folder and clean profile over retrieval filters.
- Core scenes must not depend on Pro include/exclude or frontmatter filters.
- Pro scenes may use a filter only when the filter itself is part of the verified scene or the campaign explicitly requires a scoped domain.
- Record every active result filter in the capture run.
- Never use a filter solely to hide a failed fixture result contract.

## folder structure

```text
Smart Connections Demo/
  How I build context in my notes.md
  Related/
    Avoiding Information Overload.md
    Meaningful Work & Purpose.md
    Meditation & Mindfulness.md
    Knowledge Categorization.md
    Weekly Review System.md
    Building a Second Brain.md
    Progressive Summarization.md
    Deep Work.md
    Focus & Attention.md
    Atomic Notes.md
    Zettelkasten Method.md
    Digital Minimalism.md
    Attention Residue.md
    Linking for Emergent Ideas.md
  Negative Controls/
    Garden Watering Schedule.md
    Travel Packing Checklist.md
    Recipe Experiments.md
  Smart Connections Relevance.base
```

## snapshot states

| Snapshot ID | Invariant state | Used by |
|---|---|---|
| `v2-base-unlinked` | anchor has an empty `### Related`; all notes indexed; no link has been inserted | 01, start of 02, 03, 04, 06 |
| `v2-post-link` | anchor contains `- [[Avoiding Information Overload]]` under `### Related` | end of 02 and static re-capture |
| `v2-bases-unscored` | Base exists, filters fixture candidate notes, excludes anchor, and has no Connections score column | start of 05 |
| `v2-bases-scored` | fixed-reference Connections score column exists and is sorted descending | end of 05 and static re-capture |

The post-action snapshots exist for deterministic static re-capture.

Motion assets must begin from the corresponding pre-action snapshot and show the real action.

## anchor note

File:

```text
Smart Connections Demo/How I build context in my notes.md
```

Content for `v2-base-unlinked`:

```md
# How I build context in my notes

I use notes to preserve decisions, explanations, and useful fragments of thought. The goal is not to collect as much as possible. The goal is to recover the right idea when it can improve what I am writing or deciding now.

My notes are spread across projects, reviews, reading, and personal reflection. Folders give them a home, but folders do not tell me which older note is useful for the paragraph in front of me. Manual links help after I remember a connection. They do not help when the relevant note has already fallen out of memory.

I therefore treat meaning as a second retrieval path. While I work, I want the current note to surface adjacent notes about attention, information overload, review habits, and reusable knowledge. I can inspect the strongest candidates, ignore weak matches, and turn only the useful relationships into durable links.

This changes the role of organization. I do not need to predict every future connection while capturing an idea. I can write clearly first, then make a short linking pass when the thought is mature enough to compare with the rest of the vault.

## Linking at the moment of use

While writing, I want related context to appear beside the paragraph that triggered it. Keeping the suggestion close to the active block reduces context switching and helps me notice prior work before I repeat it. I still review the source before linking because semantic relevance is a clue, not a verdict.

## Finishing the note

At the end of a note, I review a small number of related results. I prefer one strong link over a large automatic list. The best connection should clarify the note, recover useful context, or create a path I am likely to follow later.

Over time, this approach turns scattered writing into a context-aware system. The value compounds because each useful discovery can become structure without requiring a separate reorganization project.

### Related
```

Content difference for `v2-post-link`:

```md
### Related
- [[Avoiding Information Overload]]
```

Do not add other links to the anchor before Scenes 01 or 02.

WHY: existing outlinks weaken the before/after proof and can change result behavior.

## related-note content

### Avoiding Information Overload

```md
# Avoiding Information Overload

Information overload happens when inputs arrive faster than I can interpret or use them. More capture is not the answer. Better filtering, clear stopping rules, and deliberate review keep the useful signal visible.

## Filtering before capture

I ask whether an input changes a decision, supports current work, or deserves a durable reference. Everything else can remain outside the vault. This protects attention and keeps retrieval from becoming another sorting task.

## Takeaway

A knowledge system should reduce the number of choices required to resume meaningful work. The strongest link is often the one that removes noise rather than adding another source.
```

### Meaningful Work & Purpose

```md
# Meaningful Work & Purpose

Meaningful work connects daily action to an outcome that matters over a longer horizon. Purpose is useful as a filter: it helps decide which ideas deserve attention and which attractive distractions should be ignored.

A review system becomes more valuable when it asks whether current notes, projects, and commitments still support that direction. Relevance is not only topical similarity. It is also whether an idea changes what should happen next.
```

### Meditation & Mindfulness

```md
# Meditation & Mindfulness

Mindfulness reduces mental noise by making attention observable. Instead of following every new input, I can notice distraction, return to the current object, and choose whether a thought deserves action.

That same pause improves note review. A calmer attention system makes it easier to distinguish a genuinely useful relationship from a merely interesting association.
```

### Knowledge Categorization

```md
# Knowledge Categorization

Categories give notes a stable home, but over-organizing creates maintenance work and brittle boundaries. I use broad folders for ownership and retrieval by meaning for relationships that cross those folders.

The test is practical: a category is useful when it reduces ambiguity about where something belongs. It is harmful when I spend more time maintaining the taxonomy than using the knowledge inside it.
```

### Weekly Review System

```md
# Weekly Review System

A weekly review reconnects projects, notes, and commitments before they drift apart. I revisit unfinished writing, inspect loose ideas, and decide what should become action, context, reference, or deletion.

## Review behavior

I keep the pass small: confirm the desired outcome, surface the most relevant supporting notes, and add only the links that will make the next review easier. The review is a decision process, not an archive-cleaning ritual.
```

### Building a Second Brain

```md
# Building a Second Brain

A second brain is useful when captured ideas become connected, reusable, and easy to recover during real work. Storage alone does not create leverage. Retrieval and application do.

## Note-making system

My system separates capture from connection. I preserve the thought while it is fresh, then use review and semantic retrieval to discover where it belongs. Durable links are created when the relationship has earned its place.
```

### Progressive Summarization

```md
# Progressive Summarization

Progressive summarization turns long notes into layers of recoverable meaning. The first pass preserves the source. Later passes emphasize the sentences that support decisions, writing, or explanation.

This reduces the cost of returning to old material. A related-note result becomes more actionable when the note exposes its strongest ideas quickly instead of requiring a complete reread.
```

### Deep Work

```md
# Deep Work

Deep work depends on reducing context switching and protecting attention from low-value input. Every unnecessary search, notification, or tool transition increases the cost of returning to the original problem.

## Reducing context switching

Useful retrieval should appear close to the work, provide enough context to judge relevance, and let me continue without opening several unrelated views. The system should support focus rather than become another source of interruption.
```

### Focus & Attention

```md
# Focus & Attention

Attention is a limited resource. Systems should reduce unnecessary decisions and make the next useful action easier to see.

I protect focus by narrowing the active context, limiting candidate results, and reviewing one promising source before opening more. Relevance is valuable when it helps attention converge, not when it produces an endless feed of adjacent ideas.
```

### Atomic Notes

```md
# Atomic Notes

An atomic note develops one idea far enough that it can be understood and reused independently. Atomicity is not a word-count rule. It is a boundary that keeps the note's claim clear.

Smaller notes can improve retrieval because the matching context is less diluted. They still need meaningful titles and enough explanation to remain useful outside the moment of capture.
```

### Zettelkasten Method

```md
# Zettelkasten Method

The Zettelkasten method treats notes as a network of developed ideas rather than a warehouse of excerpts. A link should express a relationship worth revisiting, not merely prove that two notes share a topic.

## Linking at the moment of use

I create links when one note changes how another can be understood or used. Just-in-time linking keeps the graph meaningful because the connection is made in the context where its value is visible.
```

### Digital Minimalism

```md
# Digital Minimalism

Digital minimalism asks which tools and information sources genuinely support valued activity. Removing low-value inputs creates more room for deliberate work and better thinking.

In a note system, this means fewer default feeds, fewer automatic links, and more intentional review. The tool should surface candidates without demanding attention from every possible connection.
```

### Attention Residue

```md
# Attention Residue

Attention residue is the part of the previous task that remains active after switching. Rapid transitions make it harder to think deeply because the mind continues processing the abandoned context.

A retrieval workflow should minimize unnecessary pane changes and provide enough preview to decide whether a source deserves a full context switch.
```

### Linking for Emergent Ideas

```md
# Linking for Emergent Ideas

Some useful relationships are visible only after several notes exist. Emergent links connect ideas that were captured for different reasons but now contribute to the same question or project.

I review suggested relationships as hypotheses. When a connection clarifies both notes or creates a useful path, I make it explicit. When it is only loosely adjacent, I leave it unlinked.
```

## negative controls

These notes make relevance and Bases sorting observable.

### Garden Watering Schedule

```md
# Garden Watering Schedule

Water the herb containers early on Tuesday and Friday. Check soil moisture before adding water and reduce the schedule after heavy rain.
```

### Travel Packing Checklist

```md
# Travel Packing Checklist

Pack identification, chargers, medication, weather-appropriate layers, and a reusable water bottle. Confirm transport details before leaving.
```

### Recipe Experiments

```md
# Recipe Experiments

Test one change per batch so the result is interpretable. Record oven temperature, timing, ingredient ratios, and texture after cooling.
```

## Base fixture

File:

```text
Smart Connections Demo/Smart Connections Relevance.base
```

Prepare the Base through the current Obsidian Bases UI and save it as `v2-bases-unscored` with these invariants:

- candidate rows are Markdown notes under `Smart Connections Demo/Related/` and `Smart Connections Demo/Negative Controls/`
- the anchor note is excluded from candidate rows
- note title/file is visible
- no Connections score column exists
- no sort depends on a Connections score
- all candidate rows load before the snapshot is saved

Do not hand-author undocumented `.base` syntax merely to make the fixture portable.

WHY: the real current Bases UI and schema are the source of truth.

## functional settings by scene

These are functional prerequisites, not presentation settings.

| Scene | Profile | Required functional state |
|---|---|---|
| 01 | `sc-core-clean` | Connections results type `Sources`; results updating; fixture indexed |
| 02 | `sc-core-clean` | same as 01; editor accepts a real dragged result as a note link |
| 03 | `lookup-core-clean` | Smart Lookup returns source-level results for the fixture query |
| 04 | `sc-pro-clean` | block embeddings available; Inline connections enabled; threshold calibrated to the target paragraph |
| 05 | `sc-pro-clean` | unscored Base active; Connections Pro Bases command available |
| 06 | `sc-context-core` | Connections results visible; Smart Context Core enabled; Send to Smart Context action available |

## inline calibration

Before marking Scene 04 `capture-ready`:

1. Complete block indexing for this fixture.
2. Enable Inline connections in Connections Pro.
3. Open the anchor note in editing mode.
4. Locate the paragraph under `## Linking at the moment of use`.
5. Adjust the inline score threshold only until the current build shows an inline icon on that paragraph with useful matches.
6. Record the actual threshold and model/config in the scene verification record.
7. Restore that verified setting for every official run.

Do not prescribe a universal threshold.

WHY: score ranges vary by embedding configuration and build.

## result contracts by scene

| Scene | Fixture result contract |
|---|---|
| 01 | At least 2 target related notes in top 3; at least 4 in visible top 8; no negative control in top 5. |
| 02 | `Avoiding Information Overload` is a visible result and a real drag inserts a link targeting that file. |
| 03 | Top 6 contains at least 3 of `Avoiding Information Overload`, `Deep Work`, `Digital Minimalism`, `Attention Residue`, `Focus & Attention`; at least one strong result does not repeat the query's exact wording. |
| 04 | Target paragraph has an inline icon; popover has at least 3 real matches; at least 2 come from `Avoiding Information Overload`, `Deep Work`, `Focus & Attention`, or `Zettelkasten Method`. |
| 05 | Descending score places at least 3 target related notes above every negative control; top 3 includes `Avoiding Information Overload` or `Focus & Attention`. |
| 06 | Smart Context receives at least 3 visible result notes from the active Connections list, including one of the top 3 from Scene 01. |

## fixture validation checklist

- [ ] all files exist under the namespaced fixture folder
- [ ] anchor is 250-500 words and contains no existing related-note links in `v2-base-unlinked`
- [ ] related notes contain distinct prose rather than repeated seed sentences
- [ ] negative controls exist
- [ ] indexing is complete in every required profile
- [ ] Scene 01 contract passes
- [ ] real drag-to-link passes from the unlinked snapshot
- [ ] Lookup contract passes in standalone Smart Lookup Core
- [ ] inline threshold is calibrated and recorded
- [ ] Base snapshot excludes the anchor and has no score column
- [ ] Send to Smart Context handoff is observed
- [ ] snapshot IDs and fixture version are recorded in test capture runs
