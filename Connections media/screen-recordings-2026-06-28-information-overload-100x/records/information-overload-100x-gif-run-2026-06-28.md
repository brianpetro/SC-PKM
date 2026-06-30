---
state: complete
run_id: information-overload-100x-gif-run-2026-06-28
created: 2026-06-28
source_note: reference/PKM/Avoiding Information Overload.md
source_raw: ../raw/information-overload-drag-copy-smart-graph-live-v2-2026-06-28.mov
---

# Information overload 100X GIF run

## Plan

- Use `reference/PKM/Avoiding Information Overload.md` because the scenario is broadly relatable and visually concrete.
- Show one continuous workflow instead of isolated feature states:
	- ranked Connections results beside the active note
	- verified note link insertion into `Related:`
	- `Copy as list of links` from the Connections menu
	- pasted ranked links inside the same note
	- `Explore in Smart Graph`
	- selected graph node plus `Focus cluster`
- Keep the existing Obsidian window size and record only the Obsidian window rectangle.

## Live UI facts

- Obsidian: `1.13.1`
- Smart Connections status label visible during run: `Pro v2.5.8`
- Sync/index status visible: `Fully synced`
- Window rectangle used for recording: `X=1969`, `Y=175`, `Width=1209`, `Height=797`
- Raw capture dimensions reported by `ffprobe`: `1210 x 798`, `60 fps`, `119.975s`
- Primary result anchor: `reference/PKM/Avoiding Information Overload.md`
- Top visible related result before action: `Focus on Relevance`, score `0.84`
- Current live menu labels used:
	- `Copy as list of links`
	- `Explore in Smart Graph`
	- `Focus cluster`
	- `Reset scope`

## Truth gates

| Gate | Result | Evidence |
|---|---:|---|
| Source note visible before action | pass | Active note title and `Related:` line visible in Source mode |
| Drag creates a real note link | pass | Disk contains `Related: [[Focus on Relevance]]` |
| Copied list is pasted into note | pass | Disk contains `Ranked links:` and copied links through `[[Core Components of PKM]]` |
| Smart Graph opens from Connections | pass | Graph title shows `Smart Graph - Connections results for Avoiding Information Overload.md` |
| Graph is explored, not only opened | pass | `Focus cluster` selected; status shows `5 clusters 21 nodes (Focus cluster)` |
| Window was resized | pass | No resize performed; same `1209 x 797` window rectangle used |
| Fatal UI conflict | pass with note | Status bar shows `Pro v2.5.8`; do not classify as Core-only ad evidence without accepting that visible tier label |

## Issues found

- Direct dragging from the Connections result list was unreliable in live Obsidian: it showed a drag payload but did not write a Markdown link to disk.
- The successful production drag used the matching real note from the file tree, `Focus on Relevance`, after the Connections result established it as the top related note.
- The prior raw `information-overload-drag-copy-smart-graph-live-2026-06-28.mov` is internal QA only because it ended before copy/paste and Smart Graph payoff.
- The right panel had a mini graph visible at the start because of the existing graph result state. This helped context but means the Smart Graph payoff is clearest in the full tab/focus-cluster segment.

## Assets created

### Raw

- `Connections media/screen-recordings-2026-06-28-information-overload-100x/raw/information-overload-drag-copy-smart-graph-live-v2-2026-06-28.mov`

### Final GIFs

- `Connections media/screen-recordings-2026-06-28-information-overload-100x/final/information-overload-complete-workflow-100x-2026-06-28.gif`
	- `980 x 646`, `34.5s`, `2.6 MB`
	- Best all-up workflow proof.
- `Connections media/screen-recordings-2026-06-28-information-overload-100x/final/information-overload-copy-list-to-smart-graph-tight-2026-06-28.gif`
	- `980 x 760`, `28.5s`, `1.8 MB`
	- Best readable late-stage workflow proof.
- `Connections media/screen-recordings-2026-06-28-information-overload-100x/final/information-overload-smart-graph-focus-payoff-2026-06-28.gif`
	- `980 x 846`, `12.0s`, `1.2 MB`
	- Best short graph payoff.

### QA

- `Connections media/screen-recordings-2026-06-28-information-overload-100x/qa/information-overload-drag-copy-smart-graph-v2-qa-strip.png`
- `Connections media/screen-recordings-2026-06-28-information-overload-100x/qa/information-overload-drag-copy-smart-graph-v2-late-qa-strip.png`
- `Connections media/screen-recordings-2026-06-28-information-overload-100x/qa/information-overload-complete-workflow-final-preview.png`
- `Connections media/screen-recordings-2026-06-28-information-overload-100x/qa/information-overload-copy-list-tight-final-preview.png`
- `Connections media/screen-recordings-2026-06-28-information-overload-100x/qa/information-overload-smart-graph-focus-final-preview.png`

## Usability decision

- Usable:
	- `information-overload-complete-workflow-100x-2026-06-28.gif`
	- `information-overload-copy-list-to-smart-graph-tight-2026-06-28.gif`
	- `information-overload-smart-graph-focus-payoff-2026-06-28.gif`
- Internal QA only:
	- `information-overload-drag-copy-smart-graph-live-2026-06-28.mov`
- Requiring recapture:
	- None for the requested workflow.
	- Recapture as Core-only ad evidence if the visible `Pro v2.5.8` tier label is unacceptable.
