---
state: next
alignment:
  - "[[Plugins - screenshots SOP]]"
campaign_id: smart-loop-pmax-intent-ladder-signup
assignment_id: ag1-ag3-real-ui-pmax-capture-v1
fixture: "[[Smart Connections - screenshot fixture]]"
fixture_version: 2.0.0
prepared_on: 2026-06-22
---

# AG1 and AG3 computer-use screenshot assignment

## WHY

Replace generic campaign imagery with real, current, auditable Obsidian product evidence that matches the two PMax asset-group promises.

## WDLL

- AG1 produces 12 final images from four Smart Connections Core evidence families.
- AG3 produces 12 final images from four Connections Pro evidence families.
- Every final image maps to an untouched raw capture, a scene, a variant, a capture run, and a fixture snapshot.
- Core and Pro captures use isolated profiles. No crop, CSS, JavaScript, or hidden status element is used to disguise the wrong tier.
- No product UI, score, note title, result, command, menu, or state is fabricated.
- Every scene passes the fatal truth gates before official capture.
- Final PMax files use exact dimensions:
	- landscape: `1200 x 628`
	- square: `1200 x 1200`
	- portrait: `960 x 1200`
- Final files are PNG, sRGB, at most 5,120 KB each, with no upscaling from a smaller useful crop.

## critical operating decision

The supplied scene manifest marks the existing scenes as `draft` rather than `capture-ready`.

Therefore this is a two-stage computer-use assignment:

1. Verification run: observe the current UI, pass the fixture result contract, preserve one untouched test capture, and record the exact labels/builds.
2. Official capture run: proceed only for a scene whose fatal truth gates pass.

Do not skip directly to public captures.

## package map

| File | Purpose |
|---|---|
| `01_COMPUTER_USE_MASTER_ASSIGNMENT.md` | Full operating assignment and scene sequence |
| `02_CAPTURE_MATRIX.csv` | Exact 24-shot raw capture and final-export map |
| `03_FINAL_ASSET_MAP.csv` | Google Ads slot order and filenames |
| `04_TRUTH_GATES_AND_QA.csv` | Fatal gates plus visual score requirements |
| `05_RUTHLESS_REVIEW_AND_ITERATION.md` | Critique that produced the final architecture |
| `scenes/Smart Connections scene - 03 footer connections at note end.md` | New Core scene required by the campaign |
| `scenes/Smart Connections scene - 07 Bases related links column.md` | New Pro Bases scene for link-trail proof |
| `scenes/existing-scene-variant-addenda.md` | Variant additions for existing canonical scenes |
| `prompts/01_MASTER_COMPUTER_USE_PROMPT.md` | Single prompt for the delegated operator |
| `prompts/02_AG1_SCENE_PROMPT.md` | AG1-only prompt |
| `prompts/03_AG3_SCENE_PROMPT.md` | AG3-only prompt |
| `capture_runs/*.md` | Prepared capture-run records |

## import and publication warning

This package does not contain final screenshots and must not be used as a Google Ads image import package.

The official capture operator produces untouched raw evidence only. A separate post-production pass derives the exact PMax files from approved raw captures according to `02_CAPTURE_MATRIX.csv`.

## source references

- https://smartconnections.app/smart-connections/list-feature/
- https://smartconnections.app/smart-connections/footer/
- https://smartconnections.app/smart-connections/inline/
- https://smartconnections.app/smart-connections/bases/
- https://obsidian.md/help/plugins/command-palette
- https://obsidian.md/help/plugins/page-preview
- https://obsidian.md/help/drag-and-drop
- https://obsidian.md/help/bases/views
- https://support.google.com/google-ads/answer/14530211?hl=en
