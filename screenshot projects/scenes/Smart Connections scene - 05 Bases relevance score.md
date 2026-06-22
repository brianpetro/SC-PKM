---
state: draft
alignment:
  - "[[Smart Connections - screenshot scene manifest]]"
scene_id: sc-bases-reference-relevance-score
plugin: Connections Pro
tier: Pro
surface: Obsidian Bases
asset_classes:
  - ecosystem conversion
  - Pro conversion
  - feature documentation
  - procedural documentation
  - QA evidence
fixture: "[[Smart Connections - screenshot fixture]]"
fixture_state: v2-bases-unscored
verified_docs_on: 2026-06-22
verified_build:
revalidation_triggers:
  - Bases command label changes
  - Base reference selector changes
  - score column or formula behavior changes
  - Obsidian Bases sorting changes
---

# Smart Connections scene - 05 Bases relevance score

## outcome

```md
reference note -> semantic score column -> relevance-sorted Base
```

## user belief

> Connections Pro can rank a collection against the meaning of one reference note.

## publication eligibility

| Context | Eligibility | Constraint |
|---|---|---|
| Smart Connections Core conversion | no | Bases integration is Pro |
| Smart Plugins ecosystem | yes | label Connections Pro |
| Connections Pro conversion/docs | yes | fixed reference and sorted score must be truthful |
| Procedural documentation | yes | command and reference picker may be separate assets |
| QA evidence | yes | record Base state, command, formulas, and score output |

## truth contract

- The score column is added by the current Connections Pro Bases workflow.
- Scores compare each candidate row with the selected fixed reference note.
- The displayed order is a real descending sort of the current scores.
- Scores are ranking signals for this Base and run, not universal grades.
- The scene does not present the integration as Core.

## prerequisites

### profile

- Restore `sc-pro-clean`.
- Enable Smart Environment, Smart Connections Core, and Connections Pro.
- Disable Smart Lookup and Smart Context.
- Confirm indexing is complete for all Base candidate notes and the reference note.

### fixture

- Restore `smart-connections-demo-v2` at `v2-bases-unscored`.
- Confirm `Smart Connections Relevance.base` exists.
- Confirm the Base includes related and negative-control notes but excludes the anchor note.
- Confirm no Connections score column exists.

## start state

- `Smart Connections Relevance.base` is the active file in the main workspace.
- All fixture rows are loaded.
- No command palette, property editor, filter editor, or score column is open.
- No prior Connections score column or score sort remains.

## access actions

1. Open `Smart Connections Demo/Smart Connections Relevance.base` as the active file in the main workspace.
2. Confirm the candidate rows include fixture related notes and negative controls and do not include `How I build context in my notes`.
3. Open the command palette.
4. Run this current Connections Pro command exactly:

```text
Smart Connections Pro: Add: Connections score bases column
```

5. If the command is absent, close the palette and reconfirm that the active file is a `.base` file before retrying.
6. In the reference-note selector, choose the fixed note:

```text
How I build context in my notes
```

7. Do not choose `Current/active file (dynamic)` for this scene.
8. Wait for the Base to refresh and the new Connections score column to populate.
9. Open the score column's current sort control.
10. Set the score sort to descending so the highest current scores appear first.
11. Wait until every visible score and row position is stable.
12. Evaluate the result contract before capture.
13. Save the successful result as `v2-bases-scored` only after the command and sort have worked in the current build.

Record the exact generated column label, reference-selection UI, formula/property added, and sort interaction in the first verification run.

## stop state

The scene is ready only when:

- the Obsidian Base is visibly open
- the generated Connections score column is visible and populated
- the fixed reference note is visible through current column metadata, a reference indicator, or a paired/motion proof
- rows are sorted descending by that score
- related-note titles appear above negative controls
- the command palette and reference selector are closed
- no score is loading, blank, or in an error state

## result contract

- At least 3 target related notes rank above every negative-control note.
- The top 3 includes `Avoiding Information Overload` or `Focus & Attention`.
- At least 5 candidate rows have populated numeric scores.
- The sort direction is demonstrably descending.
- The anchor note is not a candidate row and therefore cannot create a self-score at the top.
- Exact scores and exact ordering among relevant notes remain current product output.

## must show

- Base/table identity
- note-title rows
- generated Connections score column
- visible reference-note identity when the current UI exposes it; otherwise the paired/motion asset that proves the selection
- populated scores
- descending relevance order
- enough rows to compare strong matches with weaker candidates

## must not show

- Core-only labeling or implication
- command palette or reference selector in the primary final state
- the anchor note as a candidate row
- blank, error, NaN, or loading scores
- ascending or unsorted score order
- a manually typed score column presented as product output
- altered scores or reordered rows outside the real Base sort

## recovery

| Symptom | Minimum recovery | Escalate when |
|---|---|---|
| Command is absent | Make the `.base` file active in the main workspace and confirm Connections Pro is enabled. | command remains absent in the documented current build |
| Duplicate score columns exist | Restore `v2-bases-unscored` rather than deleting fields ad hoc during the run. | the clean snapshot still contains generated columns |
| Reference picker cannot find anchor | Confirm exact fixture path, indexing, and note title. | the current picker cannot select a fixed Markdown note |
| Scores remain blank/loading | Wait for indexing and Base refresh, then reopen the Base once. | scores fail after a clean indexed profile |
| Anchor appears as a row | Restore Base filters to exclude it before adding the score column. | current Base filtering cannot express the fixture contract |
| Negative controls rank above most target notes | Verify fixture, fixed reference, model/config, and descending sort. | the result contract fails after clean reindexing |
| Sort direction is unclear | Reset the score sort and apply descending once using the current column control. | the Base UI cannot visibly establish order |
| Dynamic reference was chosen | Restore `v2-bases-unscored` and repeat with the fixed anchor note. | the picker no longer supports fixed references |

Do not manually edit formulas or scores to rescue the scene.

WHEN the official command generates a different but truthful current workflow THEN update and reverify the scene before capture.

## variants

| Variant ID | What changes | What remains invariant | Eligible asset classes |
|---|---|---|---|
| `fixed-reference-sorted` | fixed anchor and descending score; eligible as one still only when reference identity remains visible | collection ranked by semantic relevance | conversion, feature docs |
| `motion-add-and-sort` | records command, reference choice, and sort | real Pro workflow creates final table | procedural docs |
| `dynamic-reference` | uses current/active file option | score changes with external active context | separate advanced scene only |
| `list-connections-column` | adds related-link trails per row | Bases integration remains real Pro output | separate advanced docs scene |

## verification gate

- [ ] current command label observed exactly
- [ ] command available only with active Base as expected
- [ ] fixed reference selector observed
- [ ] generated column/formula recorded
- [ ] reference-note identity is visible in the still or proved by a paired/motion asset
- [ ] scores populated for fixture rows
- [ ] descending result contract passed
- [ ] `v2-bases-scored` saved after real workflow
- [ ] untouched test capture preserved
- [ ] all fatal truth gates passed
- [ ] scene promoted to `capture-ready`

## capture runs

| Run | Variant | Raw evidence | Status | Publication locations |
|---|---|---|---|---|
|  |  |  |  |  |

## source references

```text
/smart-connections/bases/
/smart-connections/settings/
```
