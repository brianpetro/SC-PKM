---
state: current
alignment:
  - "[[Plugins - screenshots SOP]]"
campaign_id: smart-loop-pmax-intent-ladder-signup
assignment_id: ag1-ag3-real-ui-pmax-capture-v1
fixture: "[[Smart Connections - screenshot fixture]]"
fixture_version: 2.0.0
prepared_on: 2026-06-22
updated_on: 2026-06-26
---

# Screenshot Projects

## Current State

This folder contains the Smart Connections/Smart Plugins screenshot production package plus the reviewed image inventory.

Current image sort:

- `usable/`: 78 reviewed images, flattened at folder root, renamed with provenance prefixes.
- `archive/`: 115 archived images, flattened at folder root, plus historical notes/manifests/tooling artifacts.
- `screenshot-flatten-critical-manifest--2026-06-25T145420-0400.csv`: audit trail for the most recent image flattening and stricter usable/archive decisions.

No image files should remain under `outputs/`, `runs/`, or nested image folders.

Demo source notes and snapshot states do not belong in this folder. The current v2 reference source lives at:

```text
reference/Smart Connections Demo/smart-connections-demo-v2/
```

`screenshot projects/` should contain capture instructions, manifests, QA records, prompts, scenes, tools, reviewed image inventories, and demo contracts only.

## Important Path Rule

The original capture specs still describe intended official import paths such as:

```text
outputs/final/ag1/...
outputs/final/ag3/...
outputs/source/raw/...
```

Those paths are specification targets, not the current physical image layout.

Current reviewed images live only in:

```text
usable/
archive/
```

Use the flattened filename prefix to recover provenance:

| Prefix | Meaning |
|---|---|
| `final-wow-10__` | reviewed WOW final candidate |
| `final-1000x-hero__` | reviewed 1000x final hero candidate |
| `final-enhanced-action-shots__` | reviewed enhanced action-shot derivative |
| `final-enhanced-100x-surfaces__` | reviewed enhanced support-surface derivative |
| `raw-ag1__` | official later-run AG1 raw evidence |
| `raw-ag3__` | official later-run AG3 raw evidence |
| `raw-qa-small-window__` | small-window QA/action raw evidence |
| `qa-review...` | archived contact sheet or QA artifact |
| `raw-...` in `archive/` | archived duplicate, weak, diagnostic, or superseded raw capture |

## Active Package Map

| File or folder | Purpose |
|---|---|
| `01_COMPUTER_USE_MASTER_ASSIGNMENT.md` | Original operator assignment for AG1/AG3 capture. |
| `02_CAPTURE_MATRIX.csv` | Original 24-shot official capture matrix. |
| `02_100X_SHOT_MATRIX.csv` | Complete 40-image AG1/AG3 100X managed PMax candidate matrix. |
| `02_CAPTURE_MATRIX_100X_PROMOTED_ADDENDUM.csv` | Earlier promoted-candidate extension; treat as superseded by the 100X matrix unless recaptured from clean demo/profile gates. |
| `03_PRIORITIZED_CAPTURE_ORDER.csv` | Operator capture order for launch and scale 100X shots. |
| `03_FINAL_ASSET_MAP.csv` | Original Google Ads slot map and target filenames. |
| `04_TRUTH_GATES_AND_QA.csv` | Fatal gates and visual QA requirements. |
| `05_RUTHLESS_REVIEW_AND_ITERATION.md` | Reasoning record for primary scene architecture. |
| `06_100X_IMPROVED_SCREENSHOT_SHOT_LIST.md` | Current 100X shot-list strategy and scene readiness notes. |
| `99_MANIFEST.csv` | Current folder-level manifest after cleanup. |
| `Plugins - screenshots SOP.md` | Canonical screenshot production policy. |
| `Plugins - screenshot presentation guide.md` | Composition and derivative-production guidance. |
| `Plugins - screenshot capture helpers.md` | Optional helper utilities and constraints. |
| `Smart Connections - screenshot campaign.md` | Campaign story, claims, cut list, and publication constraints. |
| `Smart Connections - screenshot scene manifest.md` | Scene map and readiness status. |
| `Smart Connections - screenshot fixture.md` | Demo contract and result expectations. |
| `Smart Connections - screenshot fixture v2.1 draft.md` | Draft demo contract; create source notes outside `screenshot projects/`. |
| `reference/Smart Connections Demo/smart-connections-demo-v2/` | Reference v2 demo snapshot states and profile contracts. |
| `capture_runs/` | Prepared capture-run templates/records for future official capture. |
| `scenes/` | Canonical and added scene notes. |
| `prompts/` | Reusable Computer Use prompts. |
| `tools/` | Local helper scripts. |
| `usable/` | Reviewed images worth keeping for candidate, final, or raw-evidence work. |
| `archive/` | Archived images plus historical run notes, QA records, stale manifests, and old tool zips. |

## Current Truth Caveat

The usable folder is a reviewed candidate inventory, not a guarantee that every file is official AG1/AG3-ready.

Some usable files are polished candidates or support surfaces. Official ad-matrix promotion still requires:

- clean demo snapshot state restored
- correct `sc-core-clean` or `sc-pro-clean` profile
- indexing complete
- current UI labels and tier state recorded
- untouched raw captured before derivative work
- fatal truth gates passed

## Operating Order

For a fresh official capture pass:

1. Read `Plugins - screenshots SOP.md`.
2. Read `01_COMPUTER_USE_MASTER_ASSIGNMENT.md`.
3. Read `02_CAPTURE_MATRIX.csv`.
4. Read the relevant scene note under `scenes/`.
5. Restore the named demo/profile state from `Smart Connections - screenshot fixture.md` using the reference source under `reference/Smart Connections Demo/`.
6. Capture untouched raw evidence.
7. Produce derivatives only after raw/provenance gates pass.
8. Sort resulting images into `usable/` or `archive/` and update the flatten manifest.

## Archive Policy

Archived material is retained for provenance and QA comparison.

Archive entries include:

- old verification and fixture run notes
- old capture-run records from `outputs/`
- old QA/review notes and contact-sheet CSVs
- superseded image manifests
- diagnostics, contact sheets, duplicate raws, and weak candidate images
- old tool zip artifacts

Do not treat archived files as publishable without a new review.
