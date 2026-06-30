# Four minimum live assets run - 2026-06-27

## Scope

- Matrix source: `Connections media/live-recapture-matrix-2026-06-27.csv`
- Assets run first: `LF-01`, `LF-04`, `FT-01`, `FT-02`
- App: Obsidian 1.13.1
- Vault: `Smart Vault`
- Capture date: 2026-06-27
- Capture mode: live Obsidian UI, window-region raw PNGs, final crops rendered from those raws

## Current UI labels and state

- Whole-window status area still displayed `Pro v2.5.8` during capture.
- Final crops exclude the bottom status area and do not show the `Pro v2.5.8` label.
- Connections list anchor updated correctly for:
	- `projects/Plugin onboarding decision.md`
	- `Meetings/Docs cleanup follow-up.md`
- Footer Connections was visible at the end of the active note.
- No settings, command palette, progress modal, errors, Smart Lookup, Smart Context Builder, or command list is used as a primary final asset.

## Final assets created

- `Connections media/live-captures-2026-06-27/final/live-connections-list-quick-start-preview-apply-2026-06-27.gif`
- `Connections media/live-captures-2026-06-27/final/live-connections-list-drag-result-into-related-section-2026-06-27.gif`
- `Connections media/live-captures-2026-06-27/final/live-connections-footer-finish-review-add-link-2026-06-27.gif`
- `Connections media/live-captures-2026-06-27/final/live-connections-footer-orientation-bottom-of-note-2026-06-27.png`

## Raw captures created

- `Connections media/live-captures-2026-06-27/raw/lf-01-01-current-note-related-results-fullscreen.png`
- `Connections media/live-captures-2026-06-27/raw/lf-01-01-current-note-related-results-window.png`
- `Connections media/live-captures-2026-06-27/raw/lf-01-02-expanded-first-run-preview-window.png`
- `Connections media/live-captures-2026-06-27/raw/lf-01-03-applied-link-window.png`
- `Connections media/live-captures-2026-06-27/raw/lf-04-01-before-drag-window.png`
- `Connections media/live-captures-2026-06-27/raw/lf-04-02-drag-payload-over-related-window.png`
- `Connections media/live-captures-2026-06-27/raw/lf-04-03-link-visible-after-selection-window.png`
- `Connections media/live-captures-2026-06-27/raw/ft-02-01-footer-bottom-orientation-window.png`
- `Connections media/live-captures-2026-06-27/raw/ft-02-02-footer-results-visible-window.png`
- `Connections media/live-captures-2026-06-27/raw/ft-01-02-footer-preview-expanded-window.png`
- `Connections media/live-captures-2026-06-27/raw/ft-01-03-footer-link-added-window.png`
- `Connections media/live-captures-2026-06-27/raw/ft-01-04-footer-link-and-preview-readable-window.png`

## Result-contract status

| Asset | Result contract | Status | Notes |
|---|---|---:|---|
| `LF-01` | Current note -> related result -> preview -> chosen link/sentence | Pass | Anchor note, ranked result, expanded `First-run confusion patterns` preview, and inserted note link are visible in sequence. |
| `LF-04` | Chosen result becomes visible Obsidian link in `Related` | Partial | A live drag payload is visible over `Related`, but the drop did not commit through the tool session. Final link was inserted manually after preserving drag evidence. |
| `FT-01` | End of note -> footer appears -> one result previewed -> one link added | Pass | Footer list, expanded `Docs should teach recurring work moments` preview, and inserted decision link are visible in sequence. |
| `FT-02` | Bottom of note, footer header, top results, and link insertion area | Pass | Bottom-of-note context and footer results are visible; final crop is square to preserve readability. |

## Fatal-gate status

| File | Gate status | Notes |
|---|---:|---|
| `live-connections-list-quick-start-preview-apply-2026-06-27.gif` | Pass with raw caveat | Final crop excludes `Pro v2.5.8`; raw window captures include the status label. |
| `live-connections-list-drag-result-into-related-section-2026-06-27.gif` | Partial | Drag payload is real; drop commit did not complete, so use as internal QA or recapture if literal drag/drop is required. |
| `live-connections-footer-finish-review-add-link-2026-06-27.gif` | Pass with raw caveat | Final crop excludes `Pro v2.5.8`; raw window captures include the status label. |
| `live-connections-footer-orientation-bottom-of-note-2026-06-27.png` | Pass with raw caveat | Final crop excludes `Pro v2.5.8`; raw window captures include the status label. |

## Files requiring recapture

- `LF-04` if the final asset must prove a completed drag-and-drop insertion rather than live drag payload plus manual link insertion.
- Any asset if raw-window provenance must be Core-only with no visible `Pro v2.5.8` status label.

## Candidates that meet the quality threshold

- `LF-01`
- `FT-01`
- `FT-02`

## Candidate for internal QA only

- `LF-04`
