---
record_type: capture_run
project_id: smart-plugin-screenshots
campaign_id: smart-loop-pmax-intent-ladder-signup
state: captured-with-failed-gates
gate: official-capture
run_id: 2026-06-22T210759-0400
run_mode: official_capture_rerun_after_index_fix_override
scene_id: ag1-ag3-all-scenes
profile_id: sc-core-clean / sc-pro-clean requested; current profile not isolated
fixture_id: smart-connections-demo-v2
fixture_version: 2.0.0
fixture_state: materialized-from-spec; not restored from named snapshot
operator: Codex Computer Use
captured_on: 2026-06-22T21:07:59-0400
raw_assets_count: 24
truth_gates_passed: false
review_status: requires-recapture
created_on: 2026-06-22
updated_on: 2026-06-22
---

# Official capture rerun - 2026-06-22T210759-0400

## override note

The user instructed that pre-flight checks should not prevent assignment completion. This run therefore produced all 24 raw PNGs from the current Obsidian UI after indexing was reported fixed.

These files are raw product evidence of the observed current state. They are not approved publication candidates because fatal truth gates still failed.

## environment

| Field | Value |
|---|---|
| Obsidian version | UI window title reported `Obsidian 1.13.1` |
| Operating system | macOS 26.2, build 25C56 |
| Vault | `Smart Vault` |
| Window/viewport | Obsidian window logical bounds observed as `2560 x 1600`; native captures saved at `2672 x 1712` |
| Theme | Default Obsidian dark; `.obsidian/appearance.json` has `theme: obsidian`, `cssTheme: ""`, `baseFontSize: 14` |
| UI zoom | Not separately verified in settings; no zoom command or custom CSS change was applied during this run |
| Enabled plugins from config | `smart-connections`, `smart-graph`, `smart-context` |
| Installed plugin manifest versions | Smart Connections Pro `4.6.1`; Smart Environment v3 `0.0.1`; Smart Context Pro `3.2.2`; Smart Graph Pro `1.0.2`; Smart Lookup `0.1.7` installed but disabled |
| Observed tier/status label | `Pro v2.5.8`; later status also showed `Re-import (1)` and `2 unseen notifications` |
| Index state | Current/inline results loaded after index fix; Base negative-control rows still showed `No embedding for: Smart Connections Demo/Negative Controls/...`; status returned to `Fully synced` before Base links capture |
| Capture tool | macOS `screencapture -x -l 4599` |

## fixture actions

- Restored the fixture content as closely as possible from the local fixture spec, not from a named profile snapshot.
- For AG1 post-link, inserted `[[Smart Connections Demo/Related/Avoiding Information Overload|Avoiding Information Overload]]` through the current note UI because the required drag source was not visible as a current related result.
- Ran `Smart Connections Pro: Add: Connections score bases column` through the current command UI and selected `Smart Connections Demo/How I build context in my notes.md` as the fixed reference.
- Added the `Related connections` Bases formula through the current Bases UI: Properties -> Add formula -> `file.list_connections()`.

## observed current labels

- Ribbon: `Smart Connections: Open connections view`
- Ribbon: `Toggle Inline Connections`
- Ribbon: `Toggle Footer Connections`
- Connections pane control: `Pause auto-refresh`
- Bases table view: `Relevance`
- Bases toolbar: `Sort`, `Filter`, `Properties`, `Search`, `New`
- Bases score command: `Smart Connections Pro: Add: Connections score bases column`
- Bases added score column label: `How I build context in my notes`
- Bases sort state: property `How I build context in my notes`, direction `1 -> 0`
- Bases formula UI label: `Add formula`
- Bases formula validation label: `Valid formula`
- Bases related formula column label: `Related connections`
- Bases related formula autocomplete included `list_connections()`
- Persisted Base formula identifier: `formula.Related connections`

## result-contract status by scene

| Scene | Result contract | Status | Notes |
|---|---|---:|---|
| `sc-current-note-related-notes` | ranked related-note list | fail | Results loaded, but top ranks included full-vault/non-fixture and self/demo material; target top-3/top-8 contract did not pass. |
| `sc-current-note-related-notes` / `expanded-result` | expanded real ranked result | fail | Expanded evidence came from non-fixture/full-vault result context, not the required fixture target relationship. |
| `sc-related-result-to-note-link` | current result dragged into note link | fail | Link is visible in the note, but required drag provenance failed because `Avoiding Information Overload` was not available as the visible current drag source. |
| `sc-footer-end-note-related-notes` | footer current-note results | fail | Footer/Connections evidence is real but polluted by non-fixture results and does not satisfy target ranking constraints. |
| `sc-inline-block-related-results` | inline icon/popover and full list | fail | Inline popover opened, but visible results were mixed full-vault results and target-match count was insufficient. |
| `sc-bases-reference-relevance-score` | populated score column sorted descending | fail | Score column was generated and sorted descending for scored rows, but negative-control rows showed `No embedding for...` errors. |
| `sc-bases-related-list-column` | `file.list_connections()` related-link trails | fail | Formula was accepted and populated many link trails, but visible negative-control rows still showed `No embedding for...` errors and full-vault/non-fixture links appeared. |

## fatal-gate summary

All 24 raw files pass these limited gates:

- real current Obsidian UI
- unmodified screenshot pixels
- raw pixel minimum
- run, scene, variant, and raw filename traceability

All 24 raw files fail one or more publication gates:

- requested profile isolation was not established
- `sc-core-clean` and `sc-pro-clean` ownership could not be proven from an isolated profile
- non-fixture vault/project content is visible in the file tree or Connections pane
- fixture was materialized/restored locally rather than restored from a named snapshot
- scene result contracts did not pass
- some variants were captured from the same full-window composition instead of separately recomposed for final crop shape
- Base captures expose `No embedding for...` errors for negative controls

## raw evidence

| Raw file | Scene/variant | Fatal-gate status | Candidate |
|---|---|---|---:|
| `screenshot projects/outputs/source/raw/ag1/sc-current-note-related-notes--ranked-list-landscape--2026-06-22T210759-0400--raw.png` | ranked-list-landscape | fail: full-vault/non-fixture results; wrong Core isolation | no |
| `screenshot projects/outputs/source/raw/ag1/sc-current-note-related-notes--ranked-list-square--2026-06-22T210759-0400--raw.png` | ranked-list-square | fail: full-vault/non-fixture results; wrong Core isolation | no |
| `screenshot projects/outputs/source/raw/ag1/sc-current-note-related-notes--ranked-list-portrait--2026-06-22T210759-0400--raw.png` | ranked-list-portrait | fail: full-vault/non-fixture results; wrong Core isolation | no |
| `screenshot projects/outputs/source/raw/ag1/sc-current-note-related-notes--expanded-result-landscape--2026-06-22T210759-0400--raw.png` | expanded-result-landscape | fail: expanded context not required fixture target; wrong Core isolation | no |
| `screenshot projects/outputs/source/raw/ag1/sc-current-note-related-notes--expanded-result-square--2026-06-22T210759-0400--raw.png` | expanded-result-square | fail: expanded context not required fixture target; wrong Core isolation | no |
| `screenshot projects/outputs/source/raw/ag1/sc-current-note-related-notes--expanded-result-portrait--2026-06-22T210759-0400--raw.png` | expanded-result-portrait | fail: expanded context not required fixture target; wrong Core isolation | no |
| `screenshot projects/outputs/source/raw/ag1/sc-related-result-to-note-link--post-link-landscape--2026-06-22T210759-0400--raw.png` | post-link-landscape | fail: link visible but drag provenance failed; matching source result absent | no |
| `screenshot projects/outputs/source/raw/ag1/sc-related-result-to-note-link--post-link-square--2026-06-22T210759-0400--raw.png` | post-link-square | fail: link visible but drag provenance failed; matching source result absent | no |
| `screenshot projects/outputs/source/raw/ag1/sc-related-result-to-note-link--post-link-portrait--2026-06-22T210759-0400--raw.png` | post-link-portrait | fail: link visible but drag provenance failed; matching source result absent | no |
| `screenshot projects/outputs/source/raw/ag1/sc-footer-end-note-related-notes--footer-open-landscape--2026-06-22T210759-0400--raw.png` | footer-open-landscape | fail: full-vault/non-fixture footer results; wrong Core isolation | no |
| `screenshot projects/outputs/source/raw/ag1/sc-footer-end-note-related-notes--footer-open-square--2026-06-22T210759-0400--raw.png` | footer-open-square | fail: full-vault/non-fixture footer results; wrong Core isolation | no |
| `screenshot projects/outputs/source/raw/ag1/sc-footer-end-note-related-notes--footer-open-portrait--2026-06-22T210759-0400--raw.png` | footer-open-portrait | fail: full-vault/non-fixture footer results; wrong Core isolation | no |
| `screenshot projects/outputs/source/raw/ag3/sc-inline-block-related-results--inline-popover-landscape--2026-06-22T210759-0400--raw.png` | inline-popover-landscape | fail: insufficient target matches; full-vault/non-fixture results visible | no |
| `screenshot projects/outputs/source/raw/ag3/sc-inline-block-related-results--inline-popover-square--2026-06-22T210759-0400--raw.png` | inline-popover-square | fail: insufficient target matches; full-vault/non-fixture results visible | no |
| `screenshot projects/outputs/source/raw/ag3/sc-inline-block-related-results--inline-popover-portrait--2026-06-22T210759-0400--raw.png` | inline-popover-portrait | fail: insufficient target matches; full-vault/non-fixture results visible | no |
| `screenshot projects/outputs/source/raw/ag3/sc-inline-block-related-results--inline-full-list-landscape--2026-06-22T210759-0400--raw.png` | inline-full-list-landscape | fail: full list mixed with full-vault/non-fixture results | no |
| `screenshot projects/outputs/source/raw/ag3/sc-inline-block-related-results--inline-full-list-square--2026-06-22T210759-0400--raw.png` | inline-full-list-square | fail: full list mixed with full-vault/non-fixture results | no |
| `screenshot projects/outputs/source/raw/ag3/sc-inline-block-related-results--inline-full-list-portrait--2026-06-22T210759-0400--raw.png` | inline-full-list-portrait | fail: full list mixed with full-vault/non-fixture results | no |
| `screenshot projects/outputs/source/raw/ag3/sc-bases-reference-relevance-score--bases-score-landscape--2026-06-22T210759-0400--raw.png` | bases-score-landscape | fail: negative-control embedding errors visible; profile isolation not verified | no |
| `screenshot projects/outputs/source/raw/ag3/sc-bases-reference-relevance-score--bases-score-square--2026-06-22T210759-0400--raw.png` | bases-score-square | fail: negative-control embedding errors visible; profile isolation not verified | no |
| `screenshot projects/outputs/source/raw/ag3/sc-bases-reference-relevance-score--bases-score-portrait--2026-06-22T210759-0400--raw.png` | bases-score-portrait | fail: negative-control embedding errors visible; profile isolation not verified | no |
| `screenshot projects/outputs/source/raw/ag3/sc-bases-related-list-column--bases-links-landscape--2026-06-22T210759-0400--raw.png` | bases-links-landscape | fail: related column populated but visible embedding errors and non-fixture links remain | no |
| `screenshot projects/outputs/source/raw/ag3/sc-bases-related-list-column--bases-links-square--2026-06-22T210759-0400--raw.png` | bases-links-square | fail: related column populated but visible embedding errors and non-fixture links remain | no |
| `screenshot projects/outputs/source/raw/ag3/sc-bases-related-list-column--bases-links-portrait--2026-06-22T210759-0400--raw.png` | bases-links-portrait | fail: related column populated but visible embedding errors and non-fixture links remain | no |

## quality review

Campaign threshold: not met by any raw file.

Candidates that meet quality threshold: none.

Files requiring recapture: all 24 official raws in this run.

## internal QA review - 2026-06-23

Reviewed the 24 raw captures for internal QA value after the user requested a QA-only pass.

Marked as internal-QA-only:

- ranked-list variants
- post-link variants
- footer variants
- inline-popover variants
- inline-full-list variants
- bases-score variants
- bases-links variants

Marked recapture-only / not useful enough to retain as QA evidence:

- expanded-result variants

Created seven smaller-window QA recaptures at `1582 x 1185` under:

```text
screenshot projects/outputs/source/raw/qa-small-window/
```

Detailed QA markings:

```text
screenshot projects/outputs/qa-review/qa-review--2026-06-23T080830-0400.csv
```
