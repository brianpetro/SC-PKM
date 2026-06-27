---
record_type: capture_run
project_id: smart-plugin-screenshots
campaign_id: smart-loop-pmax-intent-ladder-signup
state: needs-review
gate: scene-verification
run_id: 2026-06-22T175519-0400
run_mode: verification
scene_id: sc-current-note-related-notes
variant_id: verification-preflight
profile_id: sc-core-clean
fixture_id: smart-connections-demo-v2
fixture_state: v2-base-unlinked
fixture_reset: "[[sc-ag1-ag3-demo-state-reset--2026-06-22T175519-0400]]"
operator: Codex Computer Use
captured_on: 2026-06-22T17:55:19-0400
raw_assets: []
truth_gates_passed: false
review_status: blocked
next_prompt: Computer-use - demo state reset
created_on: 2026-06-22
updated_on: 2026-06-22
---

# Capture run - sc-current-note-related-notes - 2026-06-22T175519-0400

## environment

| Field | Value |
|---|---|
| Obsidian version | UI window title reported `Obsidian 1.13.1`; app bundle also reported `CFBundleShortVersionString 1.7.7` and `CFBundleVersion 0.14.8` |
| Operating system | macOS 26.2, build 25C56 |
| Profile ID | expected `sc-core-clean`; not verified |
| Plugin versions/builds | Smart Environment v3 `0.0.1`; Smart Connections manifest name `Smart Connections Pro`, version `4.6.1`; Smart Context Pro `3.2.2`; Smart Lookup `0.1.7` installed but disabled; Smart Connect Pro `1.0.4` installed but disabled |
| Core/Pro/license state | failed; current enabled plugins were `smart-connections`, `smart-graph`, `smart-env-v3`, `smart-context`, so Core-only ownership was not established |
| Smart Environment/index state | failed; visible status bar showed `Embedding 0/1539`; Connections pane showed no results |
| Embedding model/config relevant to scene | not observed; stopped before settings because fixture restore failed |
| Functional plugin settings | not changed or verified |
| Theme | Default Obsidian dark from `.obsidian/appearance.json`: `theme: obsidian`, `cssTheme: ""` |
| UI zoom | not verified |
| Editor font size | `14` from `.obsidian/appearance.json` |
| Window/viewport | Computer Use app-state screenshot viewport `1144 x 768`; official raw minimum not attempted |

## fixture

| Field | Value |
|---|---|
| Fixture note | [[Smart Connections - screenshot fixture]] |
| Fixture version | 2.0.0 |
| Start snapshot | `v2-base-unlinked` |
| Content hash or commit | unavailable; workspace is not a Git repository |
| Reset completed | no |

## execution

- Scene note: [[Smart Connections scene - 01 current note related notes]]
- Variant: verification preflight only
- Access actions followed without deviation: none; stopped before scene execution because demo state reset failed
- Recovery used, if any: none; no named snapshot artifact was available to restore
- Observed UI differences: current vault has no `Smart Connections Demo/` folder; current index state showed `Embedding 0/1539`; current enabled plugin set does not match `sc-core-clean`

## raw evidence

| Raw file | Captured state | Untouched | Notes |
|---|---|---:|---|
| none | no scene capture | n/a | official capture blocked before verification |

## fatal truth gates

| Gate | Pass | Evidence/notes |
|---|---:|---|
| Real current UI | yes | Obsidian state was inspected through Computer Use |
| Correct plugin/tier ownership | no | Core-only `sc-core-clean` state was not verified |
| Current source/output relationship | no | named fixture anchor was unavailable and Connections results were empty |
| Unmodified product evidence | yes | no product output was edited |
| Claim/proof fit | no | no ranked-list stop state was reached |
| No sensitive data | yes | no official raw was preserved |
| Complete target UI | no | scene target UI was not reached |
| Provenance complete | yes | blocker is linked to the failed demo state reset record |

Any `no` blocks approval.

## result contract

Decision: fail before evaluation. No scene result contract was tested because the named fixture snapshot could not be restored.

## quality review

Campaign threshold: `15/16` for ranked list.

Decision: blocked; no candidate raw exists.
