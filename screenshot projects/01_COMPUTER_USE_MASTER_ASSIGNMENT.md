---
state: next
alignment:
  - "[[Plugins - screenshots SOP]]"
  - "[[Smart Connections - screenshot campaign]]"
assignment_id: ag1-ag3-real-ui-pmax-capture-v1
campaign: Smart Loop / PMax / Intent Ladder / Signup
fixture_id: smart-connections-demo-v2
fixture_version: 2.0.0
---

# Computer-use assignment - AG1 and AG3 real UI captures

## objective

Produce auditable raw screenshots for:

- AG1: `First Useful Related Note`
- AG3: `Pro Trial / Large Vault Upgrade`

The agent is capturing product truth, not designing advertisements.

## non-negotiable truth rules

1. Use the current real Obsidian UI and current real plugin output.
2. Preserve one untouched full-window raw capture before any crop, annotation, CSS, JavaScript, or generated treatment.
3. Never type, reorder, relabel, redraw, or retouch product results, scores, menus, links, formulas, or controls.
4. Use `sc-core-clean` for AG1 and `sc-pro-clean` for AG3.
5. Never hide Pro indicators to make a Pro profile appear Core.
6. Restore the named fixture snapshot before each verification or official run.
7. A static still may claim only the visible final state. Motion is required to claim drag, hover activation, or transition.
8. Stop when the current UI materially differs from the scene note, ownership is uncertain, output is stale, a target is clipped, or a fatal truth gate fails.
9. Do not use Smart Lookup, Smart Context, Smart Dedupe, settings screens, progress modals, error states, or command lists as primary AG1/AG3 campaign images.
10. Do not proceed from verification to official capture for a failed scene.

## output structure

```text
outputs/smart-connections-pmax-ag1-ag3-production/
  README.md
  manifest.csv
  capture-runs/
  source/
    raw/
      ag1/
      ag3/
  final/
    ag1/
    ag3/
  editable/
  contact-sheet.png
```

Use the structure already created in this package under `outputs/`.

## stage 0 - record environment

Before interacting with a scene, create or update its capture-run note.

Record:

| Field | Required value |
|---|---|
| Obsidian version | exact installed version |
| Operating system | exact OS version |
| Profile ID | `sc-core-clean` or `sc-pro-clean` |
| Plugin versions/builds | Smart Environment, Smart Connections, Connections Pro where applicable |
| License/tier state | explicit Core or Pro |
| Fixture | `smart-connections-demo-v2` |
| Fixture version | `2.0.0` |
| Snapshot | scene-specific |
| Theme | Default Obsidian Dark or current near-default dark profile |
| UI zoom | record exact value |
| Editor font size | record exact value |
| Window/viewport | record actual dimensions |
| Embedding/index state | complete and current |

Create a temporary lowercase intake note per scene/run, for example:

```text
sc-current-note-related-notes--2026-06-22
```

## stage 1 - verify scenes before official capture

For every scene family below:

1. Restore the exact profile.
2. Restore the exact fixture snapshot.
3. Follow only the scene access actions.
4. Record the exact current command, menu, icon, header, or property labels encountered.
5. Confirm the result contract without editing product output.
6. Capture one untouched full-window test image.
7. Complete all fatal truth gates.
8. Mark the capture run `verified` only if every fatal gate passes.
9. Mark the scene `capture-ready` only after the current behavior and test capture are recorded.

Existing scenes requiring verification:

- `sc-current-note-related-notes`
- `sc-related-result-to-note-link`
- `sc-inline-block-related-results`
- `sc-bases-reference-relevance-score`

New scenes requiring verification:

- `sc-footer-end-note-related-notes`
- `sc-bases-related-list-column`

## stage 2 - standard capture setup

### profile and fixture isolation

AG1:

- Profile: `sc-core-clean`
- Enabled: Smart Environment, Smart Connections Core
- Disabled or absent: Connections Pro, Smart Lookup, Smart Context

AG3:

- Profile: `sc-pro-clean`
- Enabled: Smart Environment, Smart Connections Core, Connections Pro
- Disabled or absent: Smart Lookup, Smart Context

### capture baseline

| Setting | Standard |
|---|---|
| Raw image | untouched full Obsidian window PNG |
| Minimum raw pixels | at least `2560 x 1600`; Retina/2x preferred |
| Preferred logical window | approximately `1700 x 1060` |
| Theme | Default Obsidian Dark or near-default dark |
| UI zoom | 125-150% only as needed; lock it for the whole campaign |
| File tree | retain only when it helps prove Obsidian context |
| Status bar | retain only when truthful and useful; do not hide wrong-tier evidence |
| Menus/popovers | fully visible and not clipped |
| Cursor | keep off critical text unless hover must remain active |
| Personal data | none |

### aspect-specific composition

All three aspect captures are separate raw captures from the same scene stop state. Recompose the real UI; do not stretch one finished image into three formats.

| Variant | Composition target | Final export |
|---|---|---:|
| Landscape | Critical proof fits inside a centered `1.91:1` crop | `1200 x 628` |
| Square | Critical proof fits inside a centered `1:1` crop | `1200 x 1200` |
| Portrait | Critical proof fits inside a centered `4:5` crop without shrinking the full desktop UI into texture | `960 x 1200` |

For every raw capture, keep the complete source/output relationship within the intended crop zone. The post-production operator may crop and downsample but may not reconstruct UI.

## AG1 - First Useful Related Note

### campaign truth

AG1 must communicate this sequence without another product:

```md
current note -> related notes -> inspect one result -> turn it into a link -> finish with Footer connections
```

Do not use Smart Lookup or Smart Context in AG1.

### AG1-A - current note -> ranked related notes

Scene: `sc-current-note-related-notes`

Profile/snapshot:

- `sc-core-clean`
- `v2-base-unlinked`

Access summary:

1. Open `Smart Connections Demo/How I build context in my notes.md`.
2. Click inside it so it is the active file.
3. Open the current Smart Connections Core Connections view using the verified command or ribbon route.
4. Confirm result type is Sources.
5. Put the list in updating/Play state if that control exists.
6. Refresh once after the anchor is active.
7. Wait until titles, snippets, and scores stop changing.
8. Confirm the Scene 01 result contract.

Stop state:

- active anchor title and meaningful prose visible
- Connections identity/header visible
- at least 3 useful result titles visible
- at least 2 target notes in the top 3
- at least 4 target notes in the visible top 8
- no negative control in the top 5
- no settings, loading, errors, transient preview, command palette, or Pro UI

Capture three raw variants:

- `ranked-list-landscape`
- `ranked-list-square`
- `ranked-list-portrait`

### AG1-B - expanded result anatomy

Scene: `sc-current-note-related-notes`

Variant: `expanded-result`

Start from AG1-A's verified current list.

Access summary:

1. Keep the anchor active and list correctly anchored.
2. Expand `Avoiding Information Overload`, or the strongest verified target result if its current product control differs.
3. Keep the expanded result title, score when present, and meaningful snippet visible.
4. Keep the active anchor title visible.
5. Leave at least 1-2 neighboring results visible so the user understands it is a ranked list.

Stop state:

- one real result is expanded using the current UI
- expanded content matches the real fixture note
- active note remains visible
- no native preview, menu, or popover clips the result
- no fabricated labels or annotations

Capture three raw variants:

- `expanded-result-landscape`
- `expanded-result-square`
- `expanded-result-portrait`

### AG1-C - real result -> real note link

Scene: `sc-related-result-to-note-link`

Profile/snapshot:

- verification interaction starts from `v2-base-unlinked`
- official static capture may restore verified `v2-post-link`

Verification requirement:

1. Confirm `Avoiding Information Overload` is a real current result.
2. Perform the real drag-to-editor interaction in the current build.
3. Verify the inserted link resolves to the fixture note.
4. Preserve before/action/after evidence.
5. Save or restore `v2-post-link` only after the interaction has worked.

Official static stop state:

- `### Related` visible
- real link to `Avoiding Information Overload` visible beneath it
- matching Connections result visible
- enough anchor content visible to prove the link belongs to the active note
- no claim of drag is baked into the still

Capture three raw variants:

- `post-link-landscape`
- `post-link-square`
- `post-link-portrait`

### AG1-D - finish note -> Footer connections

Scene: `sc-footer-end-note-related-notes`

Profile/snapshot:

- `sc-core-clean`
- `v2-base-unlinked`

Use the scene note in this package.

Stop state:

- end of the active anchor note is visible
- Footer connections is expanded at the bottom of the note
- at least 3 useful current results visible
- no main Connections sidebar is needed for the proof
- Footer is clearly part of the note-ending workflow
- no Pro UI, settings, progress, or error state

Capture three raw variants:

- `footer-open-landscape`
- `footer-open-square`
- `footer-open-portrait`

## AG3 - Pro Trial / Large Vault Upgrade

### campaign truth

AG3 must show Pro as additive depth after Core value:

```md
paragraph -> inline context
block -> full ranked list
reference note -> relevance-sorted Base
Base row -> related-link trail
```

The images may prove advanced Pro workflows. A static screenshot must not claim measured speed, a guaranteed scale limit, or a universal score.

### AG3-A - inline related results beside a paragraph

Scene: `sc-inline-block-related-results`

Profile/snapshot:

- `sc-pro-clean`
- `v2-base-unlinked`

Access summary:

1. Restore the fixture-verified inline threshold and block embedding state.
2. Open the anchor in editing mode.
3. Click the target paragraph under `## Linking at the moment of use`.
4. Wait for its inline Connections icon.
5. Hover the icon until the related-results popover is fully open.
6. Confirm at least 3 real matches and the scene result contract.

Stop state:

- target paragraph visible
- its inline icon visible
- popover open beside the target block
- at least 3 real related results visible
- popover not clipped, loading, or attached to another block
- Pro ownership recorded in the run

Capture three raw variants:

- `inline-popover-landscape`
- `inline-popover-square`
- `inline-popover-portrait`

### AG3-B - inline block -> full Connections list

Scene: `sc-inline-block-related-results`

Variant: `inline-open-full-list`

Access summary:

1. Reach AG3-A's verified inline popover.
2. Click the current popover header that opens the full list for that block.
3. Confirm the resulting Connections view remains anchored to the target block or line range.
4. Keep the target paragraph visible when the current layout permits it.
5. Wait for the list to stabilize.

Stop state:

- full Connections list for the block is visible
- block or line identity is visible through the current header or surrounding editor context
- at least 3 useful results visible
- no settings, command palette, loading, or unrelated anchor

Capture three raw variants:

- `inline-full-list-landscape`
- `inline-full-list-square`
- `inline-full-list-portrait`

### AG3-C - fixed note -> relevance-sorted Base

Scene: `sc-bases-reference-relevance-score`

Profile/snapshot:

- `sc-pro-clean`
- `v2-bases-unscored`

Access summary:

1. Open `Smart Connections Demo/Smart Connections Relevance.base`.
2. Confirm related and negative-control rows are loaded and the anchor is excluded.
3. Run the verified command `Smart Connections Pro: Add: Connections score bases column`.
4. Pick `How I build context in my notes` as the fixed reference.
5. Wait for populated scores.
6. Sort the score column descending using the current Bases sort control.
7. Confirm the scene result contract.

Stop state:

- Base identity visible
- generated score column populated
- descending ordering visually clear
- at least 5 numeric scores visible
- at least 3 target notes rank above every negative control
- no command palette, picker, loading, blank, NaN, or error state
- reference identity is visible if current UI exposes it; otherwise provenance is established through the verification run and the static claim remains limited to score-based sorting

Capture three raw variants:

- `bases-score-landscape`
- `bases-score-square`
- `bases-score-portrait`

### AG3-D - Base row -> related-link trail

Scene: `sc-bases-related-list-column`

Profile/snapshot:

- `sc-pro-clean`
- verified `v2-bases-scored` start

Use the scene note in this package.

Stop state:

- Base identity and note rows visible
- `list_connections`-derived column visible
- at least 4 rows contain real related-link trails
- no formula error, loading, clipped menu, or fabricated link
- enough row labels and links remain readable at the intended crop

Capture three raw variants:

- `bases-links-landscape`
- `bases-links-square`
- `bases-links-portrait`

## stage 3 - raw naming

Use:

```text
{scene_id}--{variant_id}--{run_id}--raw.png
```

Example:

```text
sc-current-note-related-notes--ranked-list-landscape--2026-06-22T143000-0400--raw.png
```

Do not rename the raw file to the public campaign filename.

The final PMax filename is assigned later through `02_CAPTURE_MATRIX.csv` and `03_FINAL_ASSET_MAP.csv`.

## stage 4 - fatal truth gates

Every raw capture must pass:

- real current UI
- correct plugin and tier ownership
- current source/output relationship
- unmodified product evidence
- claim/proof fit
- no sensitive data
- complete target UI
- complete provenance

Any `no` blocks approval.

## stage 5 - visual quality review

After fatal gates pass, score each candidate 0-2 on:

- first-glance clarity
- one job
- readability
- source/output relationship
- action or payoff clarity
- demo coherence
- caption proof fit
- publication suitability

Thresholds:

- AG1 ranked list and post-link: at least `15/16`
- all other images: at least `14/16`

Review at full size and at final PMax thumbnail size.

## stage 6 - derivative handoff

The computer-use operator stops after approved raw captures and run records.

The post-production operator:

1. Crops only from approved raw files.
2. Preserves the source/output relationship.
3. Adds no fake product UI or marketing CTA.
4. Exports exact final sizes from `03_FINAL_ASSET_MAP.csv`.
5. Preserves PNG sources and creates WebP only as an optional web derivative.
6. Creates a contact sheet and manifest.

## stop and report blockers

Stop immediately and record the blocker when:

- a scene remains `draft` because verification failed
- current labels or controls materially differ from the scene note
- tier ownership is unclear
- results are stale or belong to another anchor
- the fixture contract fails after a clean restore and reindex
- the required state can be reached only by manually editing results or output
- a popover/menu cannot remain fully visible
- sensitive content appears
- a final crop would require upscaling or would make critical text unreadable
