---
state: complete
run_id: live-captures-2026-06-27-100x
campaign: Smart Loop / PMax / Intent Ladder / Signup
created: 2026-06-27
operator: Codex + Computer Use
---

# LF/FT live recapture 100x run

## Environment

- App: Obsidian 1.13.1
- Vault: Smart Vault
- Primary Core profile intent: Core UI surfaces only
- Visible plugin/status label observed in full-window raws: `Pro v2.5.8`
- Index/sync state observed: `Fully synced`; after note edits, status briefly showed `Re-import (1)`
- View modes used: Live Preview for LF-02/LF-04/FT-03/FT-04, Reading for LF-05/LF-06
- Current UI zoom: no zoom commands were used during this run; Obsidian did not expose a numeric zoom label in the capture UI
- Raw capture viewport: macOS `screencapture -R 1756,181,1466,1055`
- Final exports: crop/resize/sharpen only from raw live Obsidian PNGs; no fabricated UI, labels, scores, titles, menus, or controls

## Result contracts

| Scene | Result | Notes |
|---|---|---|
| LF-02 | Pass | Current note, inserted link, footer graph, and ranked Connections results are visible. |
| LF-03 | Partial | Native hover preview did not appear in Live Preview or Reading mode after plain hover and command-hover attempts. No primary LF-03 preview final produced. |
| LF-04 | Fail for literal drag/drop; pass for fallback insertion | Dragging a Connections result produced a live drag payload but did not commit to the note file. A completed Obsidian link insertion was then verified on disk as fallback evidence. |
| LF-05 | Pass | `Resume auto-refresh` state held the `projects Plugin onboarding decision.md` anchor while `First-run confusion patterns` opened in the main pane. |
| LF-06 | Partial | The exact menu label `Refresh connections` was present, and the toggle returned to `Pause auto-refresh`, but the panel anchor stayed on `projects Plugin onboarding decision.md` after refresh. |
| FT-03 | Pass | Footer link insertion completed and was verified on disk; final proof crop keeps the inserted link and matching result visible. |
| FT-04 | Pass | Note bottom and Footer Connections location are visible together; corrected crop includes `Smart Connections` footer evidence. |

## Fatal gates

| File | Gate result | Notes |
|---|---|---|
| `raw/LF-04-drag-payload-no-commit-internal-qa.png` | Fail | Drag payload appeared, but no note-file insertion occurred. |
| `raw/LF-04-second-drag-payload-no-commit-internal-qa.png` | Fail | Second tighter drag also did not commit. |
| `raw/LF-04-fallback-completed-link-insertion-verified.png` | Pass as fallback only | `projects/Plugin onboarding decision.md` contains `[[Decision Logs]]`; not a drag/drop pass. |
| `raw/LF-05-after-browse-paused-anchor-still-plugin.png` | Pass | Open note changed while Connections anchor stayed on plugin note. |
| `raw/LF-06-after-refresh-anchor-still-plugin-partial.png` | Partial | Refresh did not switch anchor to current note. |
| `raw/FT-03-footer-link-inserted-result-visible-verified.png` | Pass | `Meetings/Docs cleanup follow-up.md` contains `[[Docs should teach recurring work moments]]`. |
| `raw/FT-04-footer-location-bottom-visible-before-link.png` | Pass | Footer location is visible at the bottom of the active note. |

## Best candidates

- `final/LF-02-landscape-note-link-footer-ranked-results.png`
- `final/LF-05-landscape-paused-anchor-while-browsing.png`
- `final/LF-05-paused-anchor-while-browsing.gif`
- `final/FT-03-landscape-footer-link-inserted-result-visible.png`
- `final/FT-03-footer-link-inserted-result-visible.gif`
- `final/FT-04-landscape-footer-location-bottom-visible.png`

## Internal QA only

- `final/LF-04-internal-qa-drag-no-commit-then-verified-fallback.gif`
- `final/LF-04-landscape-completed-link-fallback.png`
- `final/LF-04-square-completed-link-fallback.png`
- `final/LF-06-landscape-refresh-control-partial.png`

## Contact sheets

- `qa/landscape-contact-sheet-safe-area-gates.png`
- `qa/square-contact-sheet-safe-area-gates.png`
- `qa/portrait-contact-sheet-safe-area-gates.png`

## Current UI differences and issues

- Literal Connections-result drag/drop still did not commit into the editor, even with the cursor placed under `Related`.
- Native hover preview did not appear for `Decision Logs` in either Live Preview or Reading mode.
- The right Connections pane refresh menu exposes `Refresh connections`, but refresh kept the stale plugin-note anchor after opening `First-run confusion patterns`.
- Full-window raws include a bottom `Pro v2.5.8` status label. Final crops exclude the status bar when possible; raw provenance keeps it visible.
- Root-level `100x-*` copies were added for the strongest new media, while the dated run folder keeps the full raw/output relationship.
