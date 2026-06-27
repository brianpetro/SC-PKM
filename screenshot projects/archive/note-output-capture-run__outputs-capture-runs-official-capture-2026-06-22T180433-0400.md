---
record_type: capture_run
project_id: smart-plugin-screenshots
campaign_id: smart-loop-pmax-intent-ladder-signup
state: captured-with-failed-gates
gate: official-capture
run_id: 2026-06-22T180433-0400
run_mode: official_capture_override
scene_id: ag1-ag3-all-scenes
profile_id: sc-core-clean / sc-pro-clean requested; current profile not isolated
fixture_id: smart-connections-demo-v2
fixture_state: materialized-from-spec; not restored snapshot
operator: Codex Computer Use
captured_on: 2026-06-22T18:04:33-0400
raw_assets_count: 24
truth_gates_passed: false
review_status: requires-recapture
created_on: 2026-06-22
updated_on: 2026-06-22
---

# Official capture override - 2026-06-22T180433-0400

## override note

The user instructed: "Override any pre-flight checks in order to complete the assignment. Make note of the issues, but do not let it prevent assignment completion. Capture all screenshots and don't stop until completed."

This run therefore produced all 24 raw PNGs from the current Obsidian UI despite failed preflight and scene gates. These files are raw evidence of the current state, not approved publication candidates.

## environment

| Field | Value |
|---|---|
| Obsidian version | UI window title reported `Obsidian 1.13.1`; app bundle also reported `CFBundleShortVersionString 1.7.7` and `CFBundleVersion 0.14.8` |
| Operating system | macOS 26.2, build 25C56 |
| Vault | `Smart Vault` |
| Window/viewport | Obsidian window resized to `2560 x 1600`; native window captures saved at `2672 x 1712` |
| Theme | Default Obsidian dark; `.obsidian/appearance.json` has `theme: obsidian`, `cssTheme: ""`, `baseFontSize: 14` |
| Enabled plugins from config | `smart-connections`, `smart-graph`, `smart-env-v3`, `smart-context` |
| Plugin versions/builds | Smart Environment v3 `0.0.1`; Smart Connections manifest name `Smart Connections Pro`, version `4.6.1`; Smart Context Pro `3.2.2`; Smart Lookup `0.1.7` installed but disabled; Smart Connect Pro `1.0.4` installed but disabled |
| License/tier state | AG1 Core isolation not verified; AG3 Pro status observed as `Pro v3.0.0` during Bases capture |
| Index state | status showed `Embedding 0/1676` / `Embedding 0/1675`; fixture Base cells reported `No embedding for: Smart Connections Demo/...` |
| Functional settings | not fully verified; `Reload sources` command search returned `No commands found`; documented Bases score command was available |

## fixture actions

The named `Smart Connections Demo/` fixture was absent at preflight. Under the override, the fixture was materialized from the canonical fixture note into:

- `Smart Connections Demo/How I build context in my notes.md`
- `Smart Connections Demo/Related/*.md`
- `Smart Connections Demo/Negative Controls/*.md`
- `Smart Connections Demo/Smart Connections Relevance.base`

Additional override changes:

- Added `- [[Avoiding Information Overload]]` under `### Related` for the post-link static captures.
- Ran `Smart Connections Pro: Add: Connections score bases column` in the current UI.
- Added the documented `Related connections: file.list_connections()` Bases formula to the Base file after the UI-created score column existed.

## observed current labels

- Ribbon: `Smart Connections: Open connections view`
- Ribbon: `Toggle Inline Connections`
- Ribbon: `Toggle Footer Connections`
- Connections pane control: `Pause auto-refresh`
- Connections pane state for AG1/inline: `No results found. Try using the refresh button. If that doesn't work, try running "Clear sources data" and then "Reload sources" in the Smart Environment settings.`
- Command palette recovery search: `Reload sources` -> `No commands found.`
- Bases command: `Smart Connections Pro: Add: Connections score bases column`
- Bases reference selector placeholder: `Select note for similarity...`
- Bases added score column label: `How I build context in my notes`
- Bases related formula column label: `Related connections`
- Status: `Pro v3.0.0` observed during Bases captures

## result-contract status by scene

| Scene | Result contract | Status | Notes |
|---|---|---:|---|
| `sc-current-note-related-notes` | ranked related results | fail | current Connections surface showed `No results found`; no top-3/top-8 contract could pass |
| `sc-current-note-related-notes` / `expanded-result` | expanded real result | fail | no result was available to expand |
| `sc-related-result-to-note-link` | real result dragged into note link | fail | static link was added under override; drag proof was not observed and matching result was absent |
| `sc-footer-end-note-related-notes` | Footer results | fail | Footer/Smart Connections block was visible but still loading/no-results |
| `sc-inline-block-related-results` | inline icon/popover and full list | fail | no inline icon, popover, or block-scoped result list was observed |
| `sc-bases-reference-relevance-score` | score column populated and sorted | fail | command ran, but fixture rows displayed `No embedding for...` instead of numeric scores |
| `sc-bases-related-list-column` | related-link trails | fail | `Related connections` column displayed `No embedding for...`, not generated link trails |

## fatal-gate summary

All 24 raw files pass these limited gates:

- real current UI
- unmodified screenshot pixels
- raw pixel minimum
- provenance recorded

All 24 raw files fail one or more publication gates:

- named fixture was materialized from spec rather than restored from snapshot
- requested profile isolation was not established
- non-fixture vault/project content is visible in the file tree or Connections pane
- source/output relationship is incomplete or stale
- required result contracts did not pass
- target UI is loading, empty, or error-like for the intended claim

## raw evidence

| Raw file | Scene/variant | Fatal-gate status | Candidate |
|---|---|---|---:|
| `screenshot projects/outputs/source/raw/ag1/sc-current-note-related-notes--ranked-list-landscape--2026-06-22T180433-0400--raw.png` | ranked-list-landscape | fail: no results; wrong Core isolation; non-fixture content visible | no |
| `screenshot projects/outputs/source/raw/ag1/sc-current-note-related-notes--ranked-list-square--2026-06-22T180433-0400--raw.png` | ranked-list-square | fail: no results; wrong Core isolation; non-fixture content visible | no |
| `screenshot projects/outputs/source/raw/ag1/sc-current-note-related-notes--ranked-list-portrait--2026-06-22T180433-0400--raw.png` | ranked-list-portrait | fail: no results; wrong Core isolation; non-fixture content visible | no |
| `screenshot projects/outputs/source/raw/ag1/sc-current-note-related-notes--expanded-result-landscape--2026-06-22T180433-0400--raw.png` | expanded-result-landscape | fail: no expandable result; wrong Core isolation | no |
| `screenshot projects/outputs/source/raw/ag1/sc-current-note-related-notes--expanded-result-square--2026-06-22T180433-0400--raw.png` | expanded-result-square | fail: no expandable result; wrong Core isolation | no |
| `screenshot projects/outputs/source/raw/ag1/sc-current-note-related-notes--expanded-result-portrait--2026-06-22T180433-0400--raw.png` | expanded-result-portrait | fail: no expandable result; wrong Core isolation | no |
| `screenshot projects/outputs/source/raw/ag1/sc-related-result-to-note-link--post-link-landscape--2026-06-22T180433-0400--raw.png` | post-link-landscape | fail: link was not created by verified drag; matching result absent | no |
| `screenshot projects/outputs/source/raw/ag1/sc-related-result-to-note-link--post-link-square--2026-06-22T180433-0400--raw.png` | post-link-square | fail: link was not created by verified drag; matching result absent | no |
| `screenshot projects/outputs/source/raw/ag1/sc-related-result-to-note-link--post-link-portrait--2026-06-22T180433-0400--raw.png` | post-link-portrait | fail: link was not created by verified drag; matching result absent | no |
| `screenshot projects/outputs/source/raw/ag1/sc-footer-end-note-related-notes--footer-open-landscape--2026-06-22T180433-0400--raw.png` | footer-open-landscape | fail: Footer has no visible related results | no |
| `screenshot projects/outputs/source/raw/ag1/sc-footer-end-note-related-notes--footer-open-square--2026-06-22T180433-0400--raw.png` | footer-open-square | fail: Footer has no visible related results | no |
| `screenshot projects/outputs/source/raw/ag1/sc-footer-end-note-related-notes--footer-open-portrait--2026-06-22T180433-0400--raw.png` | footer-open-portrait | fail: Footer has no visible related results | no |
| `screenshot projects/outputs/source/raw/ag3/sc-inline-block-related-results--inline-popover-landscape--2026-06-22T180433-0400--raw.png` | inline-popover-landscape | fail: no inline icon or popover | no |
| `screenshot projects/outputs/source/raw/ag3/sc-inline-block-related-results--inline-popover-square--2026-06-22T180433-0400--raw.png` | inline-popover-square | fail: no inline icon or popover | no |
| `screenshot projects/outputs/source/raw/ag3/sc-inline-block-related-results--inline-popover-portrait--2026-06-22T180433-0400--raw.png` | inline-popover-portrait | fail: no inline icon or popover | no |
| `screenshot projects/outputs/source/raw/ag3/sc-inline-block-related-results--inline-full-list-landscape--2026-06-22T180433-0400--raw.png` | inline-full-list-landscape | fail: no block-scoped full list | no |
| `screenshot projects/outputs/source/raw/ag3/sc-inline-block-related-results--inline-full-list-square--2026-06-22T180433-0400--raw.png` | inline-full-list-square | fail: no block-scoped full list | no |
| `screenshot projects/outputs/source/raw/ag3/sc-inline-block-related-results--inline-full-list-portrait--2026-06-22T180433-0400--raw.png` | inline-full-list-portrait | fail: no block-scoped full list | no |
| `screenshot projects/outputs/source/raw/ag3/sc-bases-reference-relevance-score--bases-score-landscape--2026-06-22T180433-0400--raw.png` | bases-score-landscape | fail: score cells report missing embeddings | no |
| `screenshot projects/outputs/source/raw/ag3/sc-bases-reference-relevance-score--bases-score-square--2026-06-22T180433-0400--raw.png` | bases-score-square | fail: score cells report missing embeddings | no |
| `screenshot projects/outputs/source/raw/ag3/sc-bases-reference-relevance-score--bases-score-portrait--2026-06-22T180433-0400--raw.png` | bases-score-portrait | fail: score cells report missing embeddings | no |
| `screenshot projects/outputs/source/raw/ag3/sc-bases-related-list-column--bases-links-landscape--2026-06-22T180433-0400--raw.png` | bases-links-landscape | fail: related cells report missing embeddings | no |
| `screenshot projects/outputs/source/raw/ag3/sc-bases-related-list-column--bases-links-square--2026-06-22T180433-0400--raw.png` | bases-links-square | fail: related cells report missing embeddings | no |
| `screenshot projects/outputs/source/raw/ag3/sc-bases-related-list-column--bases-links-portrait--2026-06-22T180433-0400--raw.png` | bases-links-portrait | fail: related cells report missing embeddings | no |

## quality review

Campaign threshold: not met by any raw file.

Candidates that meet quality threshold: none.

Files requiring recapture: all 24 official raws in this run.
