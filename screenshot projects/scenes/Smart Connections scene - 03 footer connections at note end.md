---
state: draft
alignment:
  - "[[Smart Connections - screenshot scene manifest]]"
scene_id: sc-footer-end-note-related-notes
plugin: Smart Connections
tier: Core
surface: Footer connections
asset_classes:
  - conversion
  - feature documentation
  - QA evidence
fixture: "[[Smart Connections - screenshot fixture]]"
fixture_state: v2-base-unlinked
verified_docs_on: 2026-06-22
verified_build:
revalidation_triggers:
  - Footer connections access or appearance changes
  - Footer enablement control changes
  - Core/Pro ownership changes
  - fixture or embedding configuration changes
---

# Smart Connections scene - 03 footer connections at note end

## outcome

```md
finish note -> scroll to note end -> review related notes in Footer connections
```

## user belief

> Smart Connections can surface useful related notes at the moment I finish writing, without requiring a separate sidebar workflow.

## publication eligibility

| Context | Eligibility | Constraint |
|---|---|---|
| Smart Connections conversion | yes | use a Core-only profile |
| Smart Connections-only listing | yes | intended Core replacement for the mixed-product Lookup scene |
| Smart Plugins ecosystem | yes | keep Smart Connections ownership explicit |
| Feature documentation | yes | settings may be captured separately for procedural documentation |
| QA evidence | yes | preserve full-window state and current control labels |

## truth contract

- Footer connections is produced by Smart Connections Core in the current build.
- The active note is the retrieval anchor.
- The footer appears at the end of that note and contains current real results.
- The still proves the open footer state, not that the user dragged, expanded, or opened a result.
- The scene must not imply that Footer connections is Pro.

## prerequisites

### profile

- Restore `sc-core-clean`.
- Enable Smart Environment and Smart Connections Core.
- Disable or remove Connections Pro, Smart Lookup, and Smart Context.
- Confirm indexing is complete.

### fixture

- Restore `smart-connections-demo-v2` at `v2-base-unlinked`.
- Confirm the anchor ends with an empty `### Related` section.
- Confirm all related and negative-control notes are indexed.

### functional state

1. Open `Settings` -> `Community plugins` -> `Smart Connections`.
2. Enable the current control labeled `Show footer connections`, or record the verified equivalent label.
3. Keep Connections results in `Sources` mode.
4. Close Settings before the official capture.

Settings are setup evidence only and must not appear in the primary conversion screenshot.

## start state

- Active file: `Smart Connections Demo/How I build context in my notes.md`.
- Footer connections enabled.
- Main Connections pane closed unless needed during verification.
- Note positioned above the end so Footer is not yet visible.
- No settings, command palette, indexing, notice, error, or menu is open.

## access actions

1. Open the anchor note and click inside it so it is the active file.
2. Scroll to the end of the note until Footer connections appears.
3. Expand the Footer header if the current UI opens it collapsed.
4. If a current Refresh control exists in the Footer, use it once after the anchor is active.
5. Wait until result titles, snippets, and scores stop changing.
6. Confirm the result contract.
7. Keep the end-of-note content and the Footer relationship visible together.

Record the exact enablement control, Footer header, expand/collapse behavior, and any update control in the first verification run.

## stop state

The scene is ready only when:

- `How I build context in my notes` is visibly active
- the final note section and end-of-note boundary are visible
- Footer connections is expanded below the note body
- at least 3 real related results are visible
- the Footer is stable, not loading, and not clipped
- no main Connections sidebar is required to understand the proof

## result contract

- At least 2 of these appear in the visible top 4:
	- `Avoiding Information Overload`
	- `Building a Second Brain`
	- `Weekly Review System`
	- `Progressive Summarization`
	- `Focus & Attention`
	- `Deep Work`
- At least 3 target related notes are visible.
- No negative-control note is visible in the top 5.
- Every visible result is plausibly related to the anchor.
- Scores and exact ordering remain current product output.

## must show

- active note ending
- Footer connections identity/header
- at least 3 useful result titles
- enough note content to establish the finish-this-note context
- visible current results, not empty or loading state

## must not show

- Connections Pro labels, controls, or status
- Smart Lookup or Smart Context as the active feature
- settings, command palette, indexing progress, errors, or notices
- a result manually inserted or reordered for the screenshot
- a footer detached from the active note
- a caption claiming drag or automatic linking from a static still

## recovery

| Symptom | Minimum recovery | Escalate when |
|---|---|---|
| Footer does not appear | Confirm enablement, reactivate the anchor, scroll fully to the note end, and reload the note once. | Footer remains absent in the current Core build |
| Footer is collapsed | Use the current Footer header control to expand it. | no expand control exists and the required results cannot be shown |
| Results are empty | Confirm Smart Environment readiness and fixture indexing, then reactivate the anchor. | indexing is complete but Footer remains empty |
| Results belong to another note | Close and reopen the anchor, wait for update, then use Refresh if available. | the Footer remains stale |
| Target results rank weakly | Restore exact fixture, confirm Sources mode, and reindex cleanly. | the result contract still fails |
| Negative control appears in top 5 | Preserve evidence and mark the scene `needs-review`. | the behavior repeats in a clean profile |
| Pro UI is visible | Stop and restore `sc-core-clean`. | Pro cannot be removed without altering product behavior |

## variants

| Variant ID | What changes | What remains invariant | Eligible asset classes |
|---|---|---|---|
| `footer-open-landscape` | wide composition | note end causes current Footer results | conversion, docs |
| `footer-open-square` | square-focused composition | note end causes current Footer results | conversion, docs |
| `footer-open-portrait` | narrow composition | note end causes current Footer results | conversion, docs |
| `footer-expanded-result` | one result is expanded | active note and current Footer relationship | feature docs |
| `footer-drag-link-motion` | records real drag from Footer into note | real result becomes a real note link | motion/docs only |

## verification gate

- [ ] current Core ownership verified
- [ ] exact enablement and Footer labels recorded
- [ ] fixture restored from `v2-base-unlinked`
- [ ] result contract passed
- [ ] untouched full-window test capture preserved
- [ ] all fatal truth gates passed
- [ ] scene promoted to `capture-ready`

## capture runs

| Run | Variant | Raw evidence | Status | Publication locations |
|---|---|---|---|---|
|  |  |  |  |  |

## source references

```text
/smart-connections/footer/
/smart-connections/settings/#footer-connections
/smart-connections/list-feature/#footer-connections
```
