---
record_type: fixture_run
project_id: smart-plugin-screenshots
campaign_id: smart-loop-pmax-intent-ladder-signup
state: failed
gate: fixture-reset
reset_id: sc-ag1-ag3-demo-state-reset--2026-06-22T175519-0400
scene_id: ag1-ag3-common-preflight
fixture_id: smart-connections-demo-v2
fixture_version: 2.0.0
profile_id: sc-core-clean / sc-pro-clean
target_snapshot: v2-base-unlinked / v2-post-link / v2-bases-unscored / v2-bases-scored
reset_strategy: restore
operator: Codex Computer Use
ingestion_scope_verified: false
inventory_verified: false
index_state: "not ready; Obsidian status bar showed Embedding 0/1539"
evidence: []
next_prompt:
created_on: 2026-06-22
updated_on: 2026-06-22
---

# Demo state reset - AG1/AG3 common preflight - 2026-06-22T175519-0400

## decision

`failed`

The named fixture snapshot could not be restored or validated. Scene verification and official capture were stopped before interacting with product output.

## authorities read

- `screenshot projects/00_README.md`
- `screenshot projects/01_COMPUTER_USE_MASTER_ASSIGNMENT.md`
- `screenshot projects/02_CAPTURE_MATRIX.csv`
- `screenshot projects/04_TRUTH_GATES_AND_QA.csv`
- `screenshot projects/Smart Connections - screenshot fixture.md`
- AG1/AG3 scene notes under `screenshot projects/scenes/`
- prepared capture-run notes under `screenshot projects/capture_runs/`

## environment observed

| Field | Value |
|---|---|
| Obsidian version | UI window title reported `Obsidian 1.13.1`; app bundle also reported `CFBundleShortVersionString 1.7.7` and `CFBundleVersion 0.14.8` |
| Operating system | macOS 26.2, build 25C56 |
| Open vault | `Smart Vault` |
| Current enabled plugins | `smart-connections`, `smart-graph`, `smart-env-v3`, `smart-context` |
| Plugin versions/builds | Smart Environment v3 `0.0.1`; Smart Connections manifest name `Smart Connections Pro`, version `4.6.1`; Smart Context Pro `3.2.2`; Smart Lookup `0.1.7` installed but disabled; Smart Connect Pro `1.0.4` installed but disabled |
| Required AG1 profile | `sc-core-clean` |
| Required AG3 profile | `sc-pro-clean` |
| Profile/tier result | failed; current enabled plugin set does not match either isolated profile because Smart Context and Smart Graph are enabled, and Core-only ownership cannot be verified from the current state |
| Smart Environment/index state | failed; visible Obsidian status bar showed `Embedding 0/1539`; visible Connections pane showed `No results found. Try using the refresh button. If that doesn't work, try running "Clear sources data" and then "Reload sources" in the Smart Environment settings.` |
| Theme | Default Obsidian dark from `.obsidian/appearance.json`: `theme: obsidian`, `cssTheme: ""` |
| Editor font size | `.obsidian/appearance.json` `baseFontSize: 14` |
| UI zoom | not verified; stopped before settings inspection |
| Window/viewport | Computer Use app-state screenshot viewport `1144 x 768`; official raw minimum was not attempted |

## fixture restore check

| Check | Result | Evidence/notes |
|---|---:|---|
| Named demo note root `Smart Connections Demo/` exists | fail | `find` found no `Smart Connections Demo` note root |
| Named snapshot artifacts exist | fail | no `v2-base-unlinked`, `v2-post-link`, `v2-bases-unscored`, or `v2-bases-scored` artifacts were found |
| Similar folder can be used as replacement | fail | `demos/Screenshot Demo - Smart Connections/` exists but is not the target demo source and its anchor already contains related links, violating `v2-base-unlinked` |
| Snapshot can be restored without reconstruction | fail | no materialized snapshot artifact was available |
| Index ready for semantic result verification | fail | current UI reported `Embedding 0/1539` and empty Connections results |

## observed current UI labels

- Ribbon: `Open Smart Graph`
- Ribbon: `Toggle Inline Connections`
- Ribbon: `Open command palette`
- Ribbon: `Smart Connections: Open connections view`
- Ribbon: `Toggle Footer Connections`
- Ribbon: `Smart Connections: Open random connection`
- Ribbon: `Smart Context: Open Builder`
- Ribbon: `Smart Context: Copy to Clipboard (select depth)`
- Ribbon: `Smart Context: List Named Contexts`
- Right pane: `Connections`
- Right pane control: `Pause auto-refresh`
- Status bar: `Embedding 0/1539`

## fatal preflight gates

| Gate | Pass | Evidence/notes |
|---|---:|---|
| Real current UI | yes | Obsidian was inspected through Computer Use without scene manipulation |
| Correct plugin/tier ownership | no | current enabled plugin set is not `sc-core-clean` or `sc-pro-clean`; Core/Pro ownership is unresolved |
| Current source/output relationship | no | named fixture anchor was unavailable and Connections pane showed no results |
| Unmodified product evidence | yes | no product output was edited |
| Claim/proof fit | no | no verified scene stop state was reached |
| No sensitive data | yes | no official raw capture was preserved |
| Complete target UI | no | no scene target UI was reached |
| Provenance complete | yes | blocker, environment, and missing fixture evidence are recorded here |

## scenes blocked

| Scene ID | Required profile | Required snapshot | Result |
|---|---|---|---|
| `sc-current-note-related-notes` | `sc-core-clean` | `v2-base-unlinked` | blocked before verification |
| `sc-related-result-to-note-link` | `sc-core-clean` | `v2-base-unlinked` / `v2-post-link` | blocked before verification |
| `sc-footer-end-note-related-notes` | `sc-core-clean` | `v2-base-unlinked` | blocked before verification |
| `sc-inline-block-related-results` | `sc-pro-clean` | `v2-base-unlinked` | blocked before verification |
| `sc-bases-reference-relevance-score` | `sc-pro-clean` | `v2-bases-unscored` | blocked before verification |
| `sc-bases-related-list-column` | `sc-pro-clean` | `v2-bases-scored` | blocked before verification |

## raw evidence

No official raw files were created. A full-desktop diagnostic screenshot was created during preflight and deleted immediately because it included non-fixture desktop content and failed the no-sensitive-data gate.

## blocker

Official capture can resume only after a truthful materialized `smart-connections-demo-v2` fixture exists at the named paths, the requested isolated profile state can be verified, and Smart Environment reports a complete/current index for the fixture.
