---
state: draft
alignment:
  - "[[Smart Connections - screenshot scene manifest]]"
scene_id: sc-related-result-to-note-link
plugin: Smart Connections
tier: Core
surface: Connections view and editor
asset_classes:
  - conversion
  - feature documentation
  - QA evidence
fixture: "[[Smart Connections - screenshot fixture]]"
fixture_state: v2-base-unlinked
verified_docs_on: 2026-06-22
verified_build:
revalidation_triggers:
  - drag behavior changes
  - editor link rendering changes
  - result item interaction changes
  - Core/Pro ownership changes
---

# Smart Connections scene - 02 related result to note link

## outcome

```md
related result -> real Obsidian note link
```

## user belief

> Smart Connections suggestions become durable, useful structure inside the note I am writing.

## publication eligibility

| Context | Eligibility | Constraint |
|---|---|---|
| Smart Connections conversion | yes | static caption describes the resulting link, not unshown motion |
| Smart Plugins ecosystem | yes | retain Smart Connections ownership |
| Feature documentation | yes | static or motion |
| Procedural documentation | yes | motion preferred for drag mechanics |
| QA evidence | yes | preserve before/action/after evidence |

## truth contract

- `Avoiding Information Overload` is a real current result for the active anchor.
- The destination link targets the actual fixture note.
- A static image proves the resulting note-link state.
- Only a motion asset may claim that the user dragged the result.
- Typing a fake link is not acceptable evidence for a drag-to-link asset.

## prerequisites

- Complete the prerequisites and result contract for [[Smart Connections scene - 01 current note related notes]].
- Restore `sc-core-clean`.
- Restore `v2-base-unlinked`, not the post-link snapshot, for an interaction run.
- Confirm the anchor ends with an empty `### Related` section.
- Use an editor mode in which a dropped result can create an Obsidian note link in the current build.

## start state

- Anchor note active and editable.
- Connections view open and stable for the anchor.
- `Avoiding Information Overload` visible as a result.
- No link exists under `### Related`.
- No hover preview, menu, or command palette is open.

## access actions

1. Follow Scene 01 until its stop state is reached.
2. Find `Avoiding Information Overload` in the visible Connections results.
3. Hold Cmd/Ctrl while hovering the result long enough to invoke Obsidian Hover Preview.
4. Verify the preview belongs to the fixture note and contains the expected information-overload prose.
5. Close the preview without opening or changing the anchor.
6. Scroll the anchor to `### Related` while keeping the Connections result visible.
7. Put the editor in the verified editable mode.
8. Create an empty list destination immediately beneath the heading by typing a hyphen followed by one space.
9. Drag the `Avoiding Information Overload` result from the Connections list to the empty list item.
10. Release only when the editor shows a valid drop target at that list item.
11. Wait for Obsidian to finish inserting/rendering the link.
12. Verify the inserted link resolves to `Avoiding Information Overload` using a brief native preview or open-and-return check.
13. Return to the final state with all previews closed and the matching Connections result still visible.
14. Save the resulting note as the `v2-post-link` snapshot only after the real interaction succeeds.

For a deterministic static re-capture, restore `v2-post-link` and verify the link target again.

Do not use the post-link snapshot as proof that drag itself worked.

## stop state

The scene is ready only when:

- the active anchor shows `### Related`
- a real link to `Avoiding Information Overload` is present beneath it
- the matching real result remains visible in the Connections list
- the note has visibly changed from the unlinked start state
- no preview, menu, drag ghost, command palette, or notice covers the final evidence

## result contract

- The inserted artifact resolves to `Smart Connections Demo/Related/Avoiding Information Overload.md`.
- The link is created through the product's current result interaction for the motion run.
- The matching result is still part of the active anchor's current list.
- No unrelated link is inserted.
- The surrounding anchor content remains unchanged except for the intended list item.

## must show

- `### Related`
- the inserted `Avoiding Information Overload` note link
- the matching Connections result
- enough active-note context to show the link belongs to the current note

## must not show

- a manually typed link presented as drag evidence
- a link to the wrong path or duplicate-titled note
- an open hover preview in the final static state
- command palette, settings, indexing progress, errors, or notices
- Pro-only controls or status
- a caption claiming drag on a static-only asset

## recovery

| Symptom | Minimum recovery | Escalate when |
|---|---|---|
| Result is missing | Restore Scene 01 state and result contract, then retry. | the verified fixture no longer returns the target result |
| Hover preview shows the wrong note | Stop; resolve duplicate titles or fixture paths before continuing. | the result item cannot be disambiguated truthfully |
| Drag opens the note instead of inserting a link | Undo side effects, reactivate the anchor in editable mode, and retry using a clear editor drop target. | the current build no longer supports drag-to-link from this surface |
| Drop inserts plain text or a malformed link | Undo, verify current editor mode and product behavior, then retry once. | the current build's output differs from the scene claim |
| Link is inserted but result list changes anchors | Return to the anchor, place Connections in Pause after it is correctly anchored, and retry the final state. | Pause cannot keep the correct source visible |
| Duplicate link appears | Restore `v2-base-unlinked` and repeat once. | the start snapshot was not clean |
| Static re-capture lacks interaction proof | Use the static caption only; create a separate motion run for drag. | the campaign requires a drag claim but no motion evidence exists |

## variants

| Variant ID | What changes | What remains invariant | Eligible asset classes |
|---|---|---|---|
| `static-post-link` | starts from verified `v2-post-link` | matching result and real link are visible | conversion, feature docs |
| `motion-drag-link` | records preview, drag, and final link | real result becomes real link | docs, README motion |
| `footer-drag-link` | result originates in Footer connections | real result becomes real link | separate Footer scene required |

## verification gate

- [ ] current result preview verified the exact fixture note
- [ ] real drag-to-link behavior observed in the current build
- [ ] inserted link target verified
- [ ] `v2-post-link` saved only after successful interaction
- [ ] untouched before and after evidence preserved
- [ ] static and motion claims separated
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
/smart-connections/footer/
```
