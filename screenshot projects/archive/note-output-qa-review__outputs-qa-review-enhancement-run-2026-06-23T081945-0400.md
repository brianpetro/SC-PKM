---
record_type: enhancement_run
project_id: smart-plugin-screenshots
campaign_id: smart-loop-pmax-intent-ladder-signup
source_run_id: 2026-06-22T210759-0400
recapture_run_id: 2026-06-23T080830-0400
enhancement_run_id: 2026-06-23T081945-0400
state: enhanced-internal-qa-only
operator: Codex Computer Use
created_on: 2026-06-23
raw_captures_created: 5
carried_forward_raw_sources: 2
enhanced_outputs_created: 18
truth_gates_passed: false
publication_candidates: 0
internal_quality_candidates: 15
---

# Enhancement run - 2026-06-23T081945-0400

## outcome

Created a stronger internal QA enhancement set from real Obsidian UI evidence.

This run improves visibility with tighter crops, exact aspect-ratio exports, and mild sharpening only. It does not modify, fabricate, or annotate product UI, note text, scores, links, titles, formulas, menus, controls, or tier labels.

The enhanced outputs are not publication candidates. The original publication blockers still apply: profile isolation was not proven, full-vault/non-fixture content remains visible, some scene result contracts remain failed, and Base views can expose `No embedding for...` rows.

## environment observed

| Field | Value |
|---|---|
| App | Obsidian |
| Obsidian version | `Obsidian 1.13.1` from window title |
| Vault | `Smart Vault` |
| Window/raw size | Small-window raws saved at `1582 x 1185` |
| Tier/status labels observed | `Pro v2.5.8`; transient `Re-import (1)` appeared during Base indexing state and later returned to `Pro v2.5.8` |
| Index state | Note and Base results loaded; Base negative-control rows still showed `No embedding for: Smart Connections Demo/Negative Controls/...` |
| Capture tool | `screencapture -x -l 4599` |
| Post-production | ImageMagick crop, resize, `sRGB`, mild `unsharp`, metadata strip |

## new raw captures

| Raw file | Scene | Fatal gates | Internal QA value |
|---|---|---|---|
| `screenshot projects/outputs/source/raw/action-shots/sc-current-note-related-notes--note-list-action--2026-06-23T081945-0400--raw.png` | current-note related list | fail: profile isolation not proven; full-vault results visible | Good working-note plus graph/list evidence |
| `screenshot projects/outputs/source/raw/action-shots/sc-current-note-related-notes--expanded-result-action--2026-06-23T081945-0400--raw.png` | expanded Connections result | fail: profile isolation not proven; full-vault results visible | Best new AG1 action shot; source note and expanded result preview remain in frame |
| `screenshot projects/outputs/source/raw/action-shots/sc-bases-related-list-column--bases-table-action--2026-06-23T081945-0400--raw.png` | Bases related links table | fail: negative-control embedding rows visible; profile isolation not proven | Good AG3 table shot with score and related-link columns |
| `screenshot projects/outputs/source/raw/action-shots/sc-bases-reference-relevance-score--sorted-table-action--2026-06-23T081945-0400--raw.png` | Bases sorted table | fail: negative-control embedding rows visible; profile isolation not proven | Useful partial sorted-state evidence; footer showed transient `Re-import (1)` |
| `screenshot projects/outputs/source/raw/action-shots/sc-bases-reference-relevance-score--score-sorted-pro-action--2026-06-23T081945-0400--raw.png` | Bases score-sorted table | fail: negative-control embedding rows visible; profile isolation not proven | Best new AG3 sorted-score shot; footer shows `Pro v2.5.8` |

## carried-forward raw sources

| Raw file | Source run | Reason carried forward |
|---|---|---|
| `screenshot projects/outputs/source/raw/qa-small-window/sc-inline-block-related-results--inline-popover-small-window--2026-06-23T080830-0400--raw.png` | `2026-06-23T080830-0400` | It remains the best available popover action state with `Connections` and `Lines 13-14` visible |
| `screenshot projects/outputs/source/raw/qa-small-window/sc-footer-end-note-related-notes--footer-open-small-window--2026-06-23T080830-0400--raw.png` | `2026-06-23T080830-0400` | It remains the best available end-of-note footer/graph state |

## enhanced outputs

All enhanced files are in:

`screenshot projects/outputs/final/enhanced/action-shots/`

Created one landscape `1200 x 628`, one square `1200 x 1200`, and one portrait `960 x 1200` output for each of these evidence families:

- `sc-current-note-related-notes--note-list-action-enhanced`
- `sc-current-note-related-notes--expanded-result-action-enhanced`
- `sc-inline-block-related-results--inline-popover-carried-forward-enhanced`
- `sc-footer-end-note-related-notes--footer-open-carried-forward-enhanced`
- `sc-bases-related-list-column--bases-table-action-enhanced`
- `sc-bases-reference-relevance-score--score-sorted-pro-action-enhanced`

## quality candidates

Internal quality threshold met:

- `sc-current-note-related-notes--expanded-result-action-enhanced` all 3 aspect ratios
- `sc-inline-block-related-results--inline-popover-carried-forward-enhanced` all 3 aspect ratios
- `sc-footer-end-note-related-notes--footer-open-carried-forward-enhanced` all 3 aspect ratios
- `sc-bases-related-list-column--bases-table-action-enhanced` all 3 aspect ratios
- `sc-bases-reference-relevance-score--score-sorted-pro-action-enhanced` all 3 aspect ratios

Internal quality threshold partial:

- `sc-current-note-related-notes--note-list-action-enhanced` all 3 aspect ratios; useful but less action-oriented than the expanded-result set

Publication threshold met: none.

## current UI differences and limitations

- The Base footer temporarily showed `Re-import (1)` during the table action sequence, then returned to `Pro v2.5.8`.
- The current Base table still includes `No embedding for...` rows for negative controls.
- The current Connections and Base results still include non-fixture/full-vault paths.
- Computer Use successfully read Obsidian state, but direct action calls repeatedly rejected the current app identifier after `get_app_state`. Narrow macOS UI actions were used for local Obsidian clicks and keypresses.
- A Sort popover and Properties panel were not cleanly captured in this enhancement pass. The kept Base action shots show real sorted/table states instead.

## supporting files

- Contact sheet: `screenshot projects/outputs/qa-review/contact-sheet--enhanced-action-shots--2026-06-23T081945-0400.png`
- CSV index: `screenshot projects/outputs/qa-review/enhancement-run--2026-06-23T081945-0400.csv`

## recapture requirements

For official ad use, recapture all candidate scenes from verified isolated `sc-core-clean` and `sc-pro-clean` profiles, with the named fixture snapshot restored before each run and without full-vault/non-fixture content in frame.
