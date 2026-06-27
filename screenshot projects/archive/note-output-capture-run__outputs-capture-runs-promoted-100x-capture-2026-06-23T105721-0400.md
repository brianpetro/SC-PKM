---
record_type: capture_run
project_id: smart-plugin-screenshots
campaign_id: smart-loop-pmax-intent-ladder-signup
state: blocked-before-official-recapture
gate: promoted-100x-official-addendum
run_id: 2026-06-23T105721-0400
run_mode: promote_100x_candidates_and_attempt_fixture_recap
scene_id: promoted-100x-addendum
profile_id: sc-core-clean / sc-pro-clean requested; current profile not isolated
fixture_id: smart-connections-demo-v2
fixture_version: 2.0.0
fixture_state: materialized-folder-present; named snapshot artifacts not found
operator: Codex Computer Use
captured_on: 2026-06-23T10:57:21-0400
raw_assets_count: 0
truth_gates_passed: false
review_status: blocked
created_on: 2026-06-23
updated_on: 2026-06-23
---

# Promoted 100X capture addendum - 2026-06-23T105721-0400

## disposition

The eight strongest 100X candidates were promoted into a traceable addendum matrix:

- `screenshot projects/02_CAPTURE_MATRIX_100X_PROMOTED_ADDENDUM.csv`

The original `screenshot projects/02_CAPTURE_MATRIX.csv` was not overwritten. That file remains the 24-row primary AG1/AG3 matrix from the master assignment.

Official recapture was blocked before asset creation. The current vault has useful product UI, but it does not satisfy the fixture/profile truth gates required for official AG1/AG3 raw captures.

## environment observed

| Field | Value |
|---|---|
| Obsidian version | `Obsidian 1.13.1` from window title |
| Vault | `Smart Vault` |
| Observed enabled plugins from config | `smart-connections`, `smart-graph`, `smart-context` |
| Required AG1 profile | `sc-core-clean` |
| Required AG3 profile | `sc-pro-clean` |
| Installed Smart Connections manifest | `Smart Connections Pro` `4.6.1` |
| Observed status/tier label | `Pro v2.5.8` |
| Observed sync/index label | `Fully synced` |
| Active source note | `Smart Connections Demo/How I build context in my notes.md` |
| Current UI conflict | Smart Context and Smart Graph surfaces are enabled in the same active profile |

## fixture and profile blockers

| Gate | Status | Evidence |
|---|---:|---|
| Named snapshot artifact exists | fail | No files or folders matching `v2-base-unlinked`, `v2-post-link`, `v2-bases-unscored`, `v2-bases-scored`, `sc-core-clean`, `sc-pro-clean`, or `smart-connections-demo-v2` were found by filesystem search. |
| Restored from named snapshot before run | fail | No restore source was available. |
| `sc-core-clean` for AG1 | fail | Current enabled plugin config includes Smart Graph and Smart Context. |
| `sc-pro-clean` for AG3 | fail | Current enabled plugin config includes Smart Context, which the fixture profile matrix says must be absent or disabled for `sc-pro-clean`. |
| `v2-base-unlinked` invariant | fail | Active note currently contains `- Avoiding Information Overload` under `### Related`, which is the post-link state rather than the unlinked start state. |
| Ingestion boundary | fail | Current Connections results include `demos/`, `reference/`, and `screenshot projects/` entries, so the semantic dataset is not isolated to the fixture corpus. |
| Official recapture readiness | fail | The reset prompt requires `restore` to fail when the snapshot artifact is unavailable and materialization is not explicitly allowed. |

## promoted candidates

| Rank | Candidate | Official placement | Decision |
|---:|---|---|---|
| 1 | `sc-connections--source-note-results-mini-graph--2026-06-23T085041-0400--raw.png` | AG1 addendum | Best product-output improvement. Re-capture from `sc-core-clean` and `v2-base-unlinked` after fixture/profile reset passes. |
| 2 | `sc-smart-graph--selected-note-matches-controls--2026-06-23T085041-0400--raw.png` | AG3 addendum | Strong Pro visual. Needs explicit AG3 addendum approval because Smart Graph is outside the original primary scenes. |
| 3 | `sc-menu--connections-sort-options--2026-06-23T085041-0400--raw.png` | AG3 addendum | Useful action shot if menu is anchored to current fixture results and not used as a command-list substitute. |
| 4 | `sc-smart-context--source-connections-picker-scores--2026-06-23T085041-0400--raw.png` | AG3 support addendum | Strong workflow proof, but original AG3 primary profile excludes Smart Context. Requires scope exception. |
| 5 | `sc-smart-context--builder-menu-source-note-clean--2026-06-23T085041-0400--raw.png` | AG3 support addendum | Useful workflow support, same Smart Context scope exception. |
| 6 | `sc-store--smart-plugins-catalog-core-pro--2026-06-23T085041-0400--raw.png` | AG3 support addendum | Good packaging proof. Not product-output proof, so support-only. |
| 7 | `sc-settings--connections-pro-controls--2026-06-23T085041-0400--raw.png` | AG3 support addendum | Good current-label/tier proof. Settings are excluded from primary captures, so support-only. |
| 8 | `sc-settings--smart-environment-source-index-controls--2026-06-23T085041-0400--raw.png` | AG3 support addendum | Potentially useful if it shows stable complete index state and no account details/errors. Settings are support-only. |

## official recapture attempt

No official promoted raws were retained.

Attempted diagnostic capture was deleted because a macOS `AnyViewer quit unexpectedly` dialog remained over the Obsidian window. It was not suitable even for clean QA evidence.

## result-contract status

| Scene | Status | Notes |
|---|---:|---|
| `sc-100x-connections-source-mini-graph` | blocked before evaluation | Requires `sc-core-clean`, `v2-base-unlinked`, isolated fixture results, and complete current-note relationship in frame. |
| `sc-100x-smart-graph-selected-matches` | blocked before evaluation | Requires approved AG3 addendum scope, `sc-pro-clean`, and fixture-only graph/index state. |
| `sc-100x-connections-sort-options` | blocked before evaluation | Requires `sc-pro-clean`, `v2-base-unlinked`, and menu anchored to fixture-only Connections results. |
| `sc-100x-context-source-connections-picker` | blocked before evaluation | Requires explicit Smart Context scope exception and fixture-only scored Connections picker. |
| `sc-100x-context-builder-source-note` | blocked before evaluation | Requires explicit Smart Context scope exception and clean source-note builder state. |
| `sc-100x-store-smart-plugins-catalog` | blocked before evaluation | Support-only. Requires clean store/catalog state with no loading, personal data, or account details. |
| `sc-100x-settings-connections-pro-controls` | blocked before evaluation | Support-only. Requires plugin-specific settings only, no account details, and no primary-capture claim. |
| `sc-100x-settings-environment-index-controls` | blocked before evaluation | Support-only. Requires stable complete index state and no progress/errors/account details. |

## fatal gate status by retained raw

No retained official raw files were created in this run.

## what is missing

- Real restore artifacts for `v2-base-unlinked`, `v2-post-link`, `v2-bases-unscored`, and `v2-bases-scored`.
- A reproducible profile switch or cloned profile record for `sc-core-clean` and `sc-pro-clean`.
- A verified ingestion boundary that excludes `screenshot projects/`, `reference/`, `demos/`, outputs, archives, prompts, runs, and QA notes from the semantic dataset.
- Native portrait and square recompositions from the real UI after demo state reset, not crops of a stale desktop-wide state.
- A non-empty, resettable Context demo source if Smart Context is approved as an AG3 support addendum.
- A clean Graph/menu capture with no crash dialogs, desktop spillover, or unrelated app overlays.
- A final thumbnail QA pass at target PMax crop sizes before any design work.

## small addition with outsized impact

Create or update the reference demo source before the next capture run:

```text
reference/Smart Connections Demo/
  smart-connections-demo-v2/
    v2-base-unlinked/
    v2-post-link/
    v2-bases-unscored/
    v2-bases-scored/
    checksums.sha256
    profiles/
      sc-core-clean.md
      sc-pro-clean.md
```

Each snapshot should include a checksum manifest and a short profile record listing enabled plugins, disabled plugins, tier state, index scope, and required functional settings. This is the highest-leverage fix because every official capture failure traces back to ambiguous restore/profile provenance.

## next unlock condition

Run demo state reset in `restore` mode only after the reference demo source exists or after an explicit dispatch sets:

```yaml
allow_materialize_from_fixture_spec: true
```

Until then, promoted addendum captures remain blocked for official AG1/AG3 use.
