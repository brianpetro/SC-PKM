---
state: draft
alignment:
  - "[[Smart Connections - screenshot scene manifest]]"
scene_id: sc-current-note-related-notes
plugin: Smart Connections
tier: Core
surface: Connections view
asset_classes:
  - conversion
  - feature documentation
  - QA evidence
fixture: "[[Smart Connections - screenshot fixture]]"
fixture_state: v2-base-unlinked
verified_docs_on: 2026-06-22
verified_build:
revalidation_triggers:
  - Connections view access changes
  - list header or update controls change
  - Core/Pro ownership changes
  - fixture or embedding configuration changes
---

# Smart Connections scene - 01 current note related notes

## outcome

```md
current note -> ranked related notes
```

## user belief

> Smart Connections understands what I am working on and surfaces useful notes I may have forgotten.

## publication eligibility

| Context | Eligibility | Constraint |
|---|---|---|
| Smart Connections conversion | yes | use a Core-only profile |
| Smart Plugins ecosystem | yes | keep Smart Connections ownership explicit |
| Feature documentation | yes | may pair with separate procedural images |
| Procedural documentation | yes | capture intermediate controls as separate assets |
| QA evidence | yes | preserve full-window state |

## truth contract

- The active note is the retrieval anchor.
- The list is produced by Smart Connections Core in the current build.
- Visible results belong to the active anchor, not a prior note.
- Scores and order are real current output.
- The still image proves note-first related-note discovery.
- It does not prove exact search, universal score quality, or Pro ranking behavior.

## prerequisites

### profile

- Restore `sc-core-clean`.
- Enable Smart Environment and Smart Connections Core.
- Disable or remove Connections Pro, Smart Lookup, and Smart Context for this profile.
- Confirm Smart Environment indexing is complete.

### fixture

- Restore `smart-connections-demo-v2` at `v2-base-unlinked`.
- Confirm the anchor has no related-note links beneath `### Related`.
- Confirm all related and negative-control notes are indexed.

### functional state

In Obsidian:

1. Open `Settings` -> `Community plugins` -> `Smart Connections`.
2. Under the Connections list settings, choose `Sources` as the result type.
3. Set the results limit to `8` when the current Core build exposes that control; otherwise retain the verified default and evaluate the visible top 8.
4. Close Settings.

Do not open or tune Pro-only filters, scoring, ranking, or renderers.

## start state

- Active file: `Smart Connections Demo/How I build context in my notes.md`.
- Connections view is closed or not yet anchored.
- Anchor note is in `v2-base-unlinked` state.
- No indexing, error, settings, or command surface is open.

## access actions

1. Open the anchor note and click inside it so it is the active file.
2. Open the Connections view using either verified Core route:
	- click the Smart Connections ribbon action that opens Connections, or
	- open the command palette, search `Connections`, and choose the Smart Connections command that opens the Connections view.
3. Confirm the opened pane is the Connections view, not Lookup, Dedupe, Graph, Settings, or Smart Context.
4. If the list has a Play/Pause control, put it in the updating/Play state.
5. Keep the anchor note active until the Connections list identifies it as the current context or visibly refreshes for it.
6. Use the Connections list `Refresh` action once after the anchor is active.
7. Wait until result titles, snippets, and scores stop changing.
8. Compare the list with the result contract before capture.

Record the exact observed command or ribbon label in the first verification run.

## stop state

The scene is ready only when:

- `How I build context in my notes` is visibly the active note
- the Connections view is open beside it
- the pane contains stable source-level related-note results
- result titles and enough real snippets or scores are visible to establish ranking
- no transient preview, command palette, menu, notice, or indexing state covers the evidence

## result contract

- At least 2 of these appear in the top 3:
	- `Avoiding Information Overload`
	- `Building a Second Brain`
	- `Weekly Review System`
	- `Progressive Summarization`
	- `Focus & Attention`
	- `Deep Work`
- At least 4 target related notes appear in the visible top 8.
- No negative-control note appears in the top 5.
- Every visible top-5 result is plausibly related to the anchor.
- Scores and exact ordering remain whatever the current product returns.

## must show

- active anchor note title
- meaningful anchor prose
- Connections pane identity/header
- at least 3 useful result titles
- visible evidence that the list is current rather than an empty or loading state

## must not show

- Connections Pro labels, settings, controls, or status
- Smart Lookup presented as the active surface
- settings, command palette, scan/index progress, errors, or notices
- an existing inserted related-note link beneath `### Related`
- stale results that belong to another active note
- manually edited scores, ordering, titles, or snippets

## recovery

| Symptom | Minimum recovery | Escalate when |
|---|---|---|
| No results | Confirm Smart Environment readiness and fixture indexing, then reopen the anchor and Refresh. | indexing reports complete but the list remains empty |
| Results do not change with the anchor | Put the list in Play/update mode, reactivate the anchor, then Refresh. | the pane still shows another note's context |
| Results are blocks instead of notes | Restore `Sources` in Connections settings and Refresh. | the current Core build no longer exposes the expected result type |
| Target notes rank weakly | Verify exact fixture version, model/config, no existing anchor links, and complete reindexing. | the result contract still fails after a clean rebuild |
| A negative control enters top 5 | Confirm no fixture text or model changed; preserve evidence and mark the scene `needs-review`. | the behavior repeats in a clean profile |
| Pro UI is visible | Stop and restore `sc-core-clean`. | Pro cannot be removed without changing product behavior |
| Pane is clipped or covered | Close transient menus/notices and reopen the view. | the current UI cannot expose the required proof together |

## variants

| Variant ID | What changes | What remains invariant | Eligible asset classes |
|---|---|---|---|
| `desktop-sources` | desktop Connections pane | active note causes ranked related notes | all |
| `footer-core` | Footer connections replaces sidebar | current note causes related notes | feature/docs; requires its own verified scene before campaign use |
| `motion-updates` | anchor prose changes while list updates | list visibly follows current note | editorial/docs motion |

## verification gate

- [ ] current Core access route observed
- [ ] exact command/ribbon label recorded
- [ ] Core-only profile verified
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
/smart-connections/getting-started/
/smart-connections/list-feature/
/smart-connections/settings/
```
