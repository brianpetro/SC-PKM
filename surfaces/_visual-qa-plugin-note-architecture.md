---
WHAT: "Note architecture for plugin screenshot evidence without surface-note bloat."
record_type: surface_visual_qa_note_architecture
created_on: 2026-06-30
updated_on: 2026-06-30
surface_type: "plugin"
status: "active"
---
# Plugin screenshot note architecture

> [!summary]
> This note defines where screenshot evidence, critique, archive decisions, campaign assets, and future recapture instructions should live.

## WDLL

```md
Surface notes stay small enough to act as capture contracts, while campaign and QA notes hold the heavier review, curation, and archive decisions.
```

## Current bloat signals

| Signal | Evidence | Risk |
|---|---|---|
| Long contact sheets | `_visual-qa-plugin-contact-sheet.md` is around 500 lines. | Hard to review and easy to miss new assets. |
| High-volume surface buckets | Footer, current-note results, inline popover, Bases columns, and graph surfaces have many embedded screenshots. | Bucket notes become galleries instead of capture contracts. |
| Strategy in bucket notes | Blindspots and How sections are expanding to include campaign decisions. | Surface ownership, QA, and campaign strategy blur together. |
| Weak images beside strong ones | Empty/no-match/raw menu captures remain adjacent to promoted assets. | Reviewers may accidentally reuse stale evidence. |

## Note roles

| Note type | Owns | Does not own |
|---|---|---|
| Surface bucket note | Surface definition, How, checklist, top current evidence, and links to deeper galleries. | Full archive history, campaign strategy, or every failed capture. |
| Contact sheet | Scannable grouped evidence. | Detailed critique or recapture rationale. |
| Publication-candidate sheet | Best 1-3 candidates per surface. | Every crop variant or raw provenance image. |
| Campaign shortlist | Launch-ready cross-surface story assets. | Full surface inventory. |
| 100X gap analysis | What is missing and what better looks like. | Raw screenshot archive. |
| Archive/recapture queue | Exact demotions, superseded paths, and recapture targets. | Surface How instructions except by reference. |
| Format variants note | Landscape, square, portrait, and caption variants for a specific campaign set. | Broad QA critique. |
| Settings companion note | Runtime screenshot paired with the setting that controls it. | Active workflow hero selection. |

## Notes created in this pass

| Note | Purpose |
|---|---|
| [[_visual-qa-plugin-100x-gap-analysis]] | Defines what is missing and what 100X should look like. |
| [[_visual-qa-plugin-archive-recapture-queue]] | Lists images to archive, demote, or recapture. |
| [[_visual-qa-plugin-note-architecture]] | Keeps note responsibilities explicit. |
| [[_visual-qa-plugin-campaign-shortlist]] | Keeps the best campaign assets out of the heavier publication-candidate sheet. |
| [[_visual-qa-plugin-raw-archive-manifest]] | Preserves demoted screenshot paths without embedding old evidence in surface buckets. |
| [[_visual-qa-plugin-smart-graph-100x-recaptures]] | Holds raw/crop/campaign evidence for the Smart Graph Focus cluster, Neighborhood, and Split right recaptures. |

## Notes to create when needed

| Proposed note | Trigger | Purpose |
|---|---|---|
| `_visual-qa-plugin-format-variants-YYYY-MM-DD.md` | A campaign asset needs square/portrait/social variants. | Avoid stuffing variants into every surface bucket. |
| `_visual-qa-plugin-settings-companions.md` | Settings screenshots exceed support-only use. | Pair each settings crop with the runtime surface it controls. |
| `_visual-qa-plugin-workflow-storyboards.md` | Campaign needs multi-step stories. | Show end-to-end PKM flows across Smart Connections, Smart Graph, and Smart Context. |
| `_visual-qa-plugin-disabled-fixture-plan.md` | Inactive plugins need capture without contaminating the main vault. | Plan enabled fixture profiles for Chat, Connect Pro, TRMNL, Dataview, Excalidraw, and vConsole. |

## Surface-note budget

| Section | Budget |
|---|---|
| Screenshots | Top 3 current assets plus one raw provenance link when needed. |
| How | 4-6 procedural bullets. |
| Blindspots | 2-4 durable capture warnings. |
| Related | Links to QA, archive queue, and campaign notes. |

When a surface exceeds the budget, move older assets into a gallery/archive note and leave a single link from the surface bucket.

## Related

- [[_visual-qa-plugin-100x-gap-analysis]]
- [[_visual-qa-plugin-raw-archive-manifest]]
- [[_visual-qa-plugin-smart-graph-100x-recaptures]]
- [[_visual-qa-plugin-archive-recapture-queue]]
- [[_visual-qa-plugin-campaign-shortlist]]
- [[_visual-qa-plugin-publication-candidates]]
