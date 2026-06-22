---
state: draft
alignment:
  - "[[Smart Connections - screenshot scene manifest]]"
scene_id: sc-results-to-smart-context
plugin:
  - Smart Connections
  - Smart Context
tier:
  - Core
surface: Connections list to Smart Context handoff
asset_classes:
  - ecosystem feature documentation
  - workflow documentation
  - QA evidence
fixture: "[[Smart Connections - screenshot fixture]]"
fixture_state: v2-base-unlinked
verified_docs_on: 2026-06-22
verified_build:
revalidation_triggers:
  - Connections menu changes
  - Smart Context handoff changes
  - plugin dependency or tier changes
  - transferred-set behavior changes
---

# Smart Connections scene - 06 send results to Smart Context

## outcome

```md
ranked Connections results -> reviewable Smart Context set
```

## user belief

> After finding useful notes, I can continue with the strongest matches as reviewable AI-ready context instead of rebuilding the set manually.

## publication eligibility

| Context | Eligibility | Constraint |
|---|---|---|
| Smart Connections primary top five | no | introduces another plugin too early |
| Smart Connections feature docs | yes | identify Smart Context as a dependency/destination; one still must show matching source and destination titles |
| Smart Plugins ecosystem | yes | use after the core discovery proof |
| Smart Context docs | yes | show the originating Connections list when useful |
| QA evidence | yes | preserve source list and transferred set |

## truth contract

- Smart Connections produces the source result list.
- Smart Context is a separate enabled Core plugin and receives the handoff.
- The transferred notes correspond to visible current Connections results.
- The destination remains reviewable before copying or sending onward.
- The scene does not imply that context has been transmitted to an AI provider.

## prerequisites

### profile

- Restore `sc-context-core`.
- Enable Smart Environment, Smart Connections Core, and Smart Context Core.
- Disable Connections Pro and Smart Lookup.
- Confirm indexing is complete.

### fixture

- Restore `v2-base-unlinked`.
- Confirm Scene 01's result contract passes in this profile.
- Configure a bounded visible Connections list appropriate to the current Core controls; prefer 5-8 useful results.

## start state

- Anchor note active.
- Connections list open, current, and stable.
- Smart Context is enabled but its Builder/selector is closed.
- No result has been copied or sent to a provider.
- No settings, command palette, menu, or notice is open.

## access actions

1. Open `How I build context in my notes` and reach the Scene 01 result state in `sc-context-core`.
2. Verify that the top visible results satisfy Scene 01's contract.
3. Use Pause in the Connections list so the anchor remains fixed while the handoff is initiated.
4. Open the Connections list controls/menu.
5. Choose the current action labeled `Send to Smart Context` or the verified equivalent that explicitly sends the result list to Smart Context.
6. Wait for the Smart Context review surface to open and hydrate the transferred items.
7. Verify that the destination contains notes from the active visible Connections results.
8. Remove an item only if the current documented handoff workflow requires demonstrating curation; otherwise leave the transferred set unchanged for provenance.
9. Do not copy, paste, invoke Smart Chat, or submit the context to a provider.
10. Leave the reviewable Smart Context set open once all item titles and any size/count state have stabilized.
11. Evaluate the result contract before capture.

Record the exact current menu label, destination surface name, transferred-item defaults, and whether hidden/pinned items affect the handoff in the first verification run.

## stop state

The scene is ready only when:

- Smart Context is visibly open as the destination
- at least 3 transferred result notes are visible and ready for review
- transferred titles correspond to the source Connections list
- no AI response, provider submission, clipboard completion, loading state, or error is shown
- the cross-plugin relationship is truthful and unambiguous

## result contract

- Smart Context receives at least 3 notes from the active Connections results.
- The transferred set includes at least one of the top 3 Scene 01 results.
- No negative-control note is transferred.
- The destination exposes a reviewable set before any external send.
- Item titles and counts are current product output.
- For a single-still asset, matching source Connections results remain visible behind or beside the Smart Context destination.
- When the current UI cannot show both surfaces, use motion or a labeled before/after pair rather than claiming the transition from one still.

## must show

- Smart Context destination identity
- transferred note titles
- enough destination state to show the set is reviewable
- cross-plugin handoff result rather than an empty selector
- matching source-result titles in the same still, or a paired/motion asset that proves the handoff

## must not show

- Smart Context presented as built into Smart Connections
- Connections Pro or Context Pro controls in the Core cross-plugin scene
- AI-generated answer or provider UI
- a claim that notes were uploaded merely because the set is prepared
- manually re-created context items presented as transferred output
- empty, loading, stale, or error state
- negative-control notes

## recovery

| Symptom | Minimum recovery | Escalate when |
|---|---|---|
| Send action is absent | Confirm Smart Context Core is installed/enabled, reopen Connections, and inspect the current list menu. | current builds no longer expose the documented handoff |
| Wrong anchor/results are sent | Close Smart Context without copying, return to anchor, Pause the correct list, and retry. | transferred items still do not correspond to the source list |
| Destination opens empty | Confirm result list is populated and Smart Context is ready, then repeat once from a clean profile. | the cross-plugin handoff consistently loses the set |
| Negative control is transferred | Restore the fixture and Scene 01 contract; do not curate it away solely for the screenshot. | source list truthfully includes the negative control in the sent set |
| Pro-only destination controls appear | Stop and restore `sc-context-core`. | the handoff requires Pro in the current product |
| Copy/provider action fires automatically | Preserve evidence, stop, and reverify the current data boundary before publication. | the workflow no longer offers a review-before-send state |
| Source relationship is visually unclear | Use a separate motion or before/after pair; do not invent a connector in the UI. | the campaign requires a single still to prove an unobservable transition |

## variants

| Variant ID | What changes | What remains invariant | Eligible asset classes |
|---|---|---|---|
| `context-review-static` | destination already populated while matching source titles remain visible | transferred notes are reviewable before send | docs/ecosystem bonus |
| `motion-send-to-context` | records source menu and destination hydration | same real transferred set | workflow docs |
| `curated-context-set` | one noisy item is removed after transfer | initial handoff remains evidenced | Smart Context docs |

## verification gate

- [ ] Smart Connections Core and Smart Context Core ownership verified
- [ ] exact Send to Smart Context action observed
- [ ] destination surface and defaults recorded
- [ ] transferred set matches current source results
- [ ] source and destination are both visible in the still or proved by a paired/motion asset
- [ ] review-before-copy/send boundary observed
- [ ] no provider transmission occurred
- [ ] untouched source and destination test captures preserved
- [ ] all fatal truth gates passed
- [ ] scene promoted to `capture-ready`

## capture runs

| Run | Variant | Raw evidence | Status | Publication locations |
|---|---|---|---|---|
|  |  |  |  |  |

## source references

```text
/smart-connections/list-feature/#send-to-context
/smart-context/
/smart-context/builder/
```
