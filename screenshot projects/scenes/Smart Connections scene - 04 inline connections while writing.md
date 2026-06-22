---
state: draft
alignment:
  - "[[Smart Connections - screenshot scene manifest]]"
scene_id: sc-inline-block-related-results
plugin: Connections Pro
tier: Pro
surface: inline editor connections
asset_classes:
  - ecosystem conversion
  - Pro conversion
  - feature documentation
  - QA evidence
fixture: "[[Smart Connections - screenshot fixture]]"
fixture_state: v2-base-unlinked
verified_docs_on: 2026-06-22
verified_build:
revalidation_triggers:
  - inline icon or popover behavior changes
  - settings labels or command changes
  - threshold behavior changes
  - block embedding behavior changes
---

# Smart Connections scene - 04 inline connections while writing

## outcome

```md
active editor block -> inline related-results popover
```

## user belief

> Connections Pro brings related context close to the exact paragraph I am writing.

## publication eligibility

| Context | Eligibility | Constraint |
|---|---|---|
| Smart Connections Core conversion | no | feature is Pro |
| Smart Plugins ecosystem | yes | label Connections Pro |
| Connections Pro conversion/docs | yes | preserve editor/block relationship |
| Procedural documentation | yes | settings and toggle steps may be separate assets |
| QA evidence | yes | record threshold and block-index configuration |

## truth contract

- The inline icon is produced by Connections Pro for the visible target block.
- The popover results are current real matches for that block.
- The block-level relationship remains visible.
- The scene does not present the feature as Core.
- A static image proves the open inline state; motion is required to prove hover activation.

## prerequisites

### profile

- Restore `sc-pro-clean`.
- Enable Smart Environment, Smart Connections Core, and Connections Pro.
- Disable Smart Lookup and Smart Context for this profile.
- Confirm block embeddings are available and current.

### fixture and calibration

- Restore `v2-base-unlinked`.
- Complete [[Smart Connections - screenshot fixture#inline calibration]].
- Record the verified inline threshold, embedding model/config, and current build.
- Use the paragraph under `## Linking at the moment of use` as the target block.

### functional settings

1. Open `Settings` -> `Community plugins`.
2. Open the current settings entry that contains Connections list and Inline connections controls. It may be labeled `Smart Connections` or `Connections Pro`; record the observed label.
3. Set Connections results to `Blocks` when required by the current inline workflow.
4. Enable `Show inline connections`.
5. Restore the fixture-verified `Inline connections score threshold`.
6. Leave `Skip code blocks` enabled if present; the target is prose.
7. Close Settings.

## start state

- Anchor note open in an editable mode.
- Target paragraph visible under `## Linking at the moment of use`.
- Inline connections enabled.
- No settings, command palette, main Connections pane, or prior popover is open.

## access actions

1. Click inside the target paragraph so the correct editor block is active.
2. Wait for inline decorators to finish appearing.
3. Locate the Connections inline icon at the end of the target block.
4. If inline decorators were intentionally toggled off, open the command palette, search `inline connections`, and run the verified Connections Pro toggle command once.
5. Return to the same target block and wait for its icon.
6. Hover the inline Connections icon without moving into unrelated editor controls.
7. Keep the pointer on the icon or popover activation region until the related-results popover is fully open and stable.
8. Verify the popover belongs to the target block by inspecting its header/line reference when present and by checking the returned result content.
9. Confirm the result contract before capture.

Record the exact current toggle command, icon behavior, and popover header in the first verification run.

## stop state

The scene is ready only when:

- the target paragraph is visible in the editor
- its inline Connections icon is visible
- the related-results popover is open beside that block
- at least 3 real related results are visible
- the popover is stable and not clipped, loading, or attached to another block

## result contract

- The popover contains at least 3 real matches.
- At least 2 matches come from blocks in:
	- `Avoiding Information Overload`
	- `Deep Work`
	- `Focus & Attention`
	- `Zettelkasten Method`
- At least one visible result supports reduced context switching or just-in-time linking.
- No negative-control result is visible.
- Scores and exact order remain current product output.

## must show

- target paragraph/block
- inline Connections icon or marker belonging to it
- open related-results popover
- real result titles/block labels and scores when the UI provides them
- enough editor context to establish that retrieval is inline

## must not show

- Core-only labeling or implication
- Settings, command palette, threshold control, or setup state in the primary image
- a popover belonging to a different block
- stale, empty, clipped, or loading popover
- manually authored popover items or scores
- the main Connections dashboard as the primary proof

## recovery

| Symptom | Minimum recovery | Escalate when |
|---|---|---|
| No inline icon | Confirm Pro enabled, block indexing complete, Show inline connections on, verified threshold restored, and target block active. | the calibrated fixture no longer produces an icon |
| Icons are globally toggled off | Run the verified inline-toggle command once, then reactivate the block. | the command is absent or has changed semantics |
| Icon appears but popover does not | Hover the icon deliberately and wait; avoid moving off its activation area. | the current build no longer opens a popover from hover |
| Popover belongs to another block | Close it, click the target paragraph, then hover only that block's icon. | block identity remains ambiguous |
| Results are broad or unrelated | Verify block result mode, exact fixture, block embeddings, and calibrated threshold. | result contract fails after clean reindexing |
| Popover closes during capture | Reopen it and use the capture method without moving focus away from the hover region. | the current UI cannot preserve a truthful stable state |
| Core/Pro status is ambiguous | Stop and restore the isolated Pro profile; use the Pro caption. | ownership cannot be established |

Do not lower the threshold during an official run solely to fill the popover.

Recalibration belongs to fixture verification and creates a new verified fixture state.

## variants

| Variant ID | What changes | What remains invariant | Eligible asset classes |
|---|---|---|---|
| `inline-popover-static` | popover already open | target block and real matches visible | conversion, feature docs |
| `inline-hover-motion` | records icon hover and popover opening | same target block/result relationship | docs/editorial motion |
| `inline-open-full-list` | activates the popover header to open full list | block remains the retrieval anchor | procedural/feature docs |

## verification gate

- [ ] Connections Pro ownership verified
- [ ] block embeddings complete
- [ ] threshold calibrated and recorded
- [ ] exact inline toggle and settings labels recorded
- [ ] target block icon observed
- [ ] popover result contract passed
- [ ] untouched test capture preserved
- [ ] all fatal truth gates passed
- [ ] scene promoted to `capture-ready`

## capture runs

| Run | Variant | Raw evidence | Status | Publication locations |
|---|---|---|---|---|
|  |  |  |  |  |

## source references

```text
/smart-connections/inline/
/smart-connections/settings/#inline-connections
```
