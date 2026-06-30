---
state: complete
run_id: connections-only-100x-gif-run-2026-06-28
created: 2026-06-28
source_note: reference/PKM/Avoiding Information Overload.md
source_raw: ../raw/information-overload-connections-only-hover-drag-copy-live-2026-06-28.mov
---

# Connections-only 100X GIF run

## Review

- Previous GIFs failed the new gate because the verified drag source was the file navigation pane.
- File navigation was closed for this run.
- The active note was `reference/PKM/Avoiding Information Overload.md`.
- The Connections panel remained the only visible link source.

## Plan

- Keep the Obsidian window size unchanged: `1209 x 797`.
- Start from a clean `Related:` line.
- Pause on a mini-graph node in the Connections view for recognition.
- Pause on the matching `Focus on Relevance` result in the Connections list.
- Drag the Connections result into `Related:` and verify the Markdown file changes.
- Encode final GIFs only from verified footage.

## Live UI facts

- Obsidian: `1.13.1`
- Smart Connections status label visible: `Pro v2.5.8`
- Sync/index status visible: `Fully synced`
- Window rectangle: `X=1969`, `Y=175`, `Width=1209`, `Height=797`
- Raw video: `1210 x 798`, `60 fps`, `119.978333s`
- Top result at capture time: `Focus on Relevance`, score `0.84`
- Connections menu label used during run: `Copy as list of links`

## Truth gates

| Gate | Result | Evidence |
|---|---:|---|
| File nav closed | pass | Capture shows only the left ribbon; file tree is not visible |
| All production link sources from Connections view | pass | Final GIF drag source is the Connections result list |
| Mini-graph hover shown | pass | Final GIF starts with the cursor paused over the Connections mini-graph |
| Mini-graph node drag creates link | fail | Tested in Live Preview and Source mode; disk stayed `Related:` blank |
| Connections-result drag creates link | pass | Disk contains `Related: [[Focus on Relevance]]` |
| Copied list came from Connections | pass | Disk contains `Ranked links:` through `[[Core Components of PKM]]` after `Copy as list of links` |
| Final GIFs avoid failed action claim | pass | Final GIFs show mini-graph hover, then the verified Connections-result drag |

## Assets created

### Raw

- `Connections media/screen-recordings-2026-06-28-information-overload-connections-only-100x/raw/information-overload-connections-only-hover-drag-copy-live-2026-06-28.mov`

### Final GIFs

- `Connections media/screen-recordings-2026-06-28-information-overload-connections-only-100x/final/information-overload-connections-only-hover-drag-link-100x-2026-06-28.gif`
	- `980 x 646`, `27.0s`, `1.3 MB`
	- Best full-context Connections-only proof.
- `Connections media/screen-recordings-2026-06-28-information-overload-connections-only-100x/final/information-overload-connections-only-hover-drag-link-tight-2026-06-28.gif`
	- `980 x 607`, `18.91s`, `815 KB`
	- Best tighter production candidate.
- `Connections media/screen-recordings-2026-06-28-information-overload-connections-only-100x/final/information-overload-connections-only-drag-payload-proof-2026-06-28.gif`
	- `980 x 417`, `11.93s`, `710 KB`
	- Best short proof cut.

### QA

- `Connections media/screen-recordings-2026-06-28-information-overload-connections-only-100x/qa/connections-only-hover-drag-copy-raw-qa-strip.png`
- `Connections media/screen-recordings-2026-06-28-information-overload-connections-only-100x/qa/connections-only-hover-drag-copy-early-qa-strip.png`
- `Connections media/screen-recordings-2026-06-28-information-overload-connections-only-100x/qa/connections-only-hover-drag-copy-10s-timeline.png`
- `Connections media/screen-recordings-2026-06-28-information-overload-connections-only-100x/qa/connections-only-hover-drag-65-100s-strip.png`
- `Connections media/screen-recordings-2026-06-28-information-overload-connections-only-100x/qa/final-preview-hover-drag-link-full.png`
- `Connections media/screen-recordings-2026-06-28-information-overload-connections-only-100x/qa/final-preview-hover-drag-link-tight.png`
- `Connections media/screen-recordings-2026-06-28-information-overload-connections-only-100x/qa/final-preview-drag-payload-proof.png`

## Usability decision

- Usable:
	- `information-overload-connections-only-hover-drag-link-100x-2026-06-28.gif`
	- `information-overload-connections-only-hover-drag-link-tight-2026-06-28.gif`
	- `information-overload-connections-only-drag-payload-proof-2026-06-28.gif`
- Internal QA only:
	- The direct mini-graph-node drag attempts.
	- The raw section after 100s, because the copied-list paste landed after the useful final-GIF window.
- Requiring recapture:
	- Only if the product must prove literal mini-graph-node drag. In the current live build, that action does not pass the disk truth gate.
