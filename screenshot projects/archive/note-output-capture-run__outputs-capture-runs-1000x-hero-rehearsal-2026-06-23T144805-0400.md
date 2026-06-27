---
record_type: capture_run
project_id: smart-plugin-screenshots
campaign_id: smart-loop-pmax-intent-ladder-signup
state: captured-rehearsal-with-failed-official-gates
gate: 1000x-hero-rehearsal
run_id: 2026-06-23T144805-0400
run_mode: revised_8_shot_hero_rehearsal
fixture_id: smart-connections-demo-v2
fixture_version: 2.0.0
operator: Codex Computer Use
captured_on: 2026-06-23T14:48:05-0400
raw_assets_count: 8
final_derivatives_count: 24
truth_gates_passed: false
review_status: internal-qa-only
created_on: 2026-06-23
updated_on: 2026-06-23
---

# 1000X hero rehearsal - 2026-06-23T144805-0400

## scope

This run captured only the revised 8-shot hero set from live Obsidian UI. It is a production rehearsal, not an approved official AG1/AG3 capture run.

## artifacts

| Artifact | Path |
|---|---|
| Raw captures | `screenshot projects/outputs/source/raw/1000x-hero/` |
| Final derivatives | `screenshot projects/outputs/final/1000x-hero/` |
| QA contact sheet | `screenshot projects/outputs/qa-review/1000x-hero/contact-sheet--hero-thumbnails--2026-06-23T144805-0400.png` |
| QA contact CSV | `screenshot projects/outputs/qa-review/1000x-hero/contact-sheet--hero-thumbnails--2026-06-23T144805-0400.csv` |
| Reference demo source | `reference/Smart Connections Demo/smart-connections-demo-v2/` |
| Fixture v2.1 draft | `screenshot projects/Smart Connections - screenshot fixture v2.1 draft.md` |

## environment observed

| Field | Value |
|---|---|
| Obsidian version | `1.13.1` |
| Vault | `Smart Vault` |
| Window bounds | `980,120,2560,1600` |
| Observed tier/status | `Pro v2.5.8`; later `Re-import (1)` appeared in some shots |
| Current profile status | not isolated as `sc-core-clean` or `sc-pro-clean` |
| Current addendum plugins visible | Smart Graph and Smart Context both enabled |
| Current index boundary | failed; legacy screenshot-project demo-source files and `screenshot projects/` appeared in product results |

## raw captures

| Shot | Raw file | Official gate |
|---:|---|---|
| 1 | `sc-1000x-01-source-note-connections-mini-graph--2026-06-23T144805-0400--raw.png` | fail: result pollution and profile not `sc-core-clean` |
| 2 | `sc-1000x-02-result-inserted-link--2026-06-23T144805-0400--raw.png` | fail: drag/action provenance not rerun and result pollution visible |
| 3 | `sc-1000x-03-footer-related-notes--2026-06-23T144805-0400--raw.png` | fail: profile not `sc-core-clean`; result pollution visible |
| 4 | `sc-1000x-04-inline-popover-triggering-paragraph--2026-06-23T144805-0400--raw.png` | fail: result pollution visible; addendum quality strong |
| 5 | `sc-1000x-05-bases-score-column--2026-06-23T144805-0400--raw.png` | fail: current profile not isolated; `Re-import` state visible in status area |
| 6 | `sc-1000x-06-bases-related-links-column--2026-06-23T144805-0400--raw.png` | fail: current profile not isolated; dense list readability needs recomposition |
| 7 | `sc-1000x-07-smart-graph-selected-matches--2026-06-23T144805-0400--raw.png` | support-only: strong visual, but whole-vault graph and addendum scope |
| 8 | `sc-1000x-08-context-source-connections-picker--2026-06-23T144805-0400--raw.png` | support-only: strongest workflow proof, but snapshot-pack pollution is visible |

## creative read

The strongest production directions are:

- Smart Graph selected matches: best first-glance visual energy.
- Smart Context source-connections picker: best cross-plugin workflow proof.
- Inline popover: best "context appears while writing" story.
- Bases score/list columns: strongest Pro utility proof, but needs a cleaner, narrower Base composition.

The weakest directions are the first three AG1 captures in the current environment. They are conceptually right, but the contaminated result list makes them look like generic vault search rather than a precise product payoff.

## fatal blockers

- Legacy screenshot-project demo-source entries were indexed by the current profile.
- Removed screenshot-project demo-source entries appeared as product results.
- `screenshot projects/scenes/...`, `reference/`, and `demos/` entries remain visible.
- `sc-core-clean` is not proven.
- `sc-pro-clean` is not proven.
- Some captures show `Re-import`.
- Current AG1 shots are too wide/dense for final ad readability without real UI recomposition.

## next production adjustment

Move snapshot artifacts outside the indexed corpus or exclude `screenshot projects/` from Smart Environment before running official captures.

Then recapture the same 8-shot set with:

- one profile per shot family
- one aspect-specific UI composition per format
- no snapshot-pack, QA, scene, or reference notes in result lists
- Graph and Context clearly labeled as AG3 addendum/support

## disposition

Keep these raws and derivatives for internal QA and creative direction only. Do not publish as official AG1/AG3 evidence.
