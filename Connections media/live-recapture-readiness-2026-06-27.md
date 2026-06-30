---
state: blocked
created: 2026-06-27
campaign: Smart Connections docs media
source_spec: Connections media
---

# Live recapture readiness - 2026-06-27

## Decision

Do not recapture live Obsidian visuals yet.

The storyboard visuals in this folder are now the target spec for a later live recapture, but the current Obsidian state is not a clean Core state. Capturing from it would violate the supplied storyboard rules and produce misleading docs media.

## Current UI check

Observed through Computer Use on 2026-06-27:

| Field | Current value |
|---|---|
| App | Obsidian |
| App version | 1.13.1 |
| Vault | Smart Vault |
| Current window | Smart Graph - Smart Vault - Obsidian 1.13.1 |
| Visible status/tier | Pro v2.5.8 |
| Active surface | Smart Graph - Whole vault |
| Connections side pane anchor | Smart Connections Demo / Smart Connections Relevance.base |
| Sync state | Fully synced |

## Blocking gates

| Gate | Status | Evidence |
|---|---|---|
| Core-only UI | Fail | Visible status/tier shows Pro v2.5.8. |
| No wrong first-use surface | Fail | Active surface is Smart Graph, which the storyboard forbids for first-use list/footer visuals. |
| Clean current-note anchor | Fail | Connections pane is anchored to Smart Connections Relevance.base, not `Projects/Plugin onboarding decision.md` or `Meetings/Docs cleanup follow-up.md`. |
| Clean related results | Fail | Results still include duplicate demo-source/reference material and prior Smart Connections Demo rows. |
| Target notes ready | Unknown | Target notes were not verified open in a clean Core state. |
| Footer Core label | Unknown | Footer label/package state was not verified clean. |
| Drag-to-link behavior | Unknown | Current product behavior was not verified in a clean Core state. |

## Live recapture target rules

Use the existing synthetic storyboard visuals as composition targets, not as final docs evidence.

For each live recapture:

- Start from the active note, not from Search, Smart Graph, Lookup, Smart Context, Settings, or a whole-vault view.
- Keep one result as the proof point.
- Preview or expand before adding a link or sentence.
- End with the current note visibly improved.
- Show exact current labels only.
- Reject immediately if any Pro label, Pro-only control, graph surface, settings panel, command palette, error, queued import state, personal data, or stale result appears.

## Minimum live recapture order

Capture these first after the Core state passes all gates:

1. `LF-01` -> `live-connections-list-quick-start-preview-apply-2026-06-27.gif`
2. `LF-04` -> `live-connections-list-drag-result-into-related-section-2026-06-27.gif`
3. `FT-01` -> `live-connections-footer-finish-review-add-link-2026-06-27.gif`
4. `FT-02` -> `live-connections-footer-orientation-bottom-of-note-2026-06-27.png`

Only continue to LF-02, LF-03, LF-05, LF-06, FT-03, FT-04, WF-01, and WF-02 after the minimum set passes.

## Target demo notes

| Note | Use |
|---|---|
| `Projects/Plugin onboarding decision.md` | Active note for Connections List visuals. |
| `Support/First-run confusion patterns.md` | Primary related result for list visuals. |
| `Research/Knowledge resurfacing and rework.md` | Alternate related result for list visuals. |
| `Meetings/Docs cleanup follow-up.md` | Active note for Footer visuals. |
| `Decisions/Docs should teach recurring work moments.md` | Primary related result for Footer visuals. |

## Output convention

When the Core state is clean, write live recaptures into:

```text
Connections media/live-captures-2026-06-27/
```

Use filenames from `live-recapture-matrix-2026-06-27.csv`.

Keep untouched raw recordings/screenshots under:

```text
Connections media/live-captures-2026-06-27/raw/
```

Keep cropped/annotated exports under:

```text
Connections media/live-captures-2026-06-27/final/
```

## Target spec files

Use these synthetic visuals as the storyboard target:

- `connections-list-quick-start-preview-apply-2026-06-27.gif`
- `connections-list-preview-without-leaving-note-2026-06-27.gif`
- `connections-list-drag-result-into-related-section-2026-06-27.gif`
- `connections-list-pause-holds-anchor-while-browsing-2026-06-27.gif`
- `connections-list-orientation-current-note-result-preview-action-2026-06-27.png`
- `connections-list-play-pause-refresh-recovery-2026-06-27.png`
- `connections-footer-finish-review-add-link-2026-06-27.gif`
- `connections-footer-mobile-no-sidebar-linking-2026-06-27.gif`
- `connections-footer-orientation-bottom-of-note-2026-06-27.png`
- `connections-footer-enable-and-bottom-visibility-2026-06-27.png`
- `connections-workflow-end-of-note-linking-pass-2026-06-27.gif`
- `connections-workflow-choose-deliberately-add-or-skip-2026-06-27.png`
