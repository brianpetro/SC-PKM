---
WHAT: "Archive and recapture queue for plugin screenshot evidence."
record_type: surface_visual_qa_archive_queue
created_on: 2026-06-30
updated_on: 2026-06-30
surface_type: "plugin"
status: "active"
---
# Plugin archive and recapture queue

> [!summary]
> Decisions for which screenshots should be archived, demoted, or recaptured so weak evidence stops competing with campaign-ready assets.

## WDLL

```md
A reviewer can see the exact image, why it should not remain a top candidate, and what stronger capture should replace it.
```

## Archive or demote

| Image | Disposition | Why | Replacement |
|---|---|---|---|
| `assets/plugin-surface-recapture-2026-06-30-graph-context/plugin-smart-context-builder-over-graph-empty-2026-06-30.png` | Archive as raw support | Empty builder state explains entry but not value. | Saved PKM bundle builder capture. |
| `assets/plugin-surface-recapture-2026-06-30-graph-context/plugin-smart-graph-search-note-query-no-matches-2026-06-30.png` | Archive as diagnostic support | No-match search is truthful but weak for campaign use. | Deep Work selected-actions capture. |
| `assets/plugin-surface-recapture-2026-06-30-graph-context/plugin-smart-graph-tab-menu-over-graph-2026-06-30.png` | Archive as superseded | Similar menu but weaker staging. | Deep Work tab-menu capture. |
| `assets/plugin-surface-recapture-2026-06-30-graph-context/plugin-smart-context-builder-pkm-synthesis-saved-2026-06-30.png` | Keep raw, recapture clean | Strong source bundle, but milestone toast contaminates the raw full-window proof. | Clean builder after notification dismissal. |
| `assets/plugin-surface-recapture-2026-06-30-graph-context/plugin-smart-context-named-context-actions-menu-pkm-2026-06-30.png` | Support only | Useful action evidence, but menu is too narrow for hero use. | Named context card plus opened builder/details view. |
| `assets/plugin-surface-recapture-2026-06-30-graph-context/campaign/campaign-smart-graph-search-deep-work-1200x628-2026-06-30.png` | Demote from best search candidate | Shows active search but not the richer action state. | `assets/plugin-surface-100x-audit-2026-06-30/campaign/campaign-smart-graph-search-selected-actions-1200x628-2026-06-30.png`. |
| `assets/plugin-surface-recapture-2026-06-30-graph-context/campaign/campaign-smart-graph-tab-menu-split-1200x628-2026-06-30.png` | Keep as docs-only | Tab menu is too small and only explains split affordance. | Actual split-right workspace capture. |
| `screenshot projects/archive/raw-100x-surfaces__sc-smart-graph-search-nodes-note-2026-06-23T085041-0400-raw.png` | Legacy archive | Raw, old staging, weaker than selected-actions state. | Deep Work selected-actions capture. |
| `screenshot projects/archive/raw-100x-surfaces__sc-menu-smart-graph-tab-options-2026-06-23T085041-0400-raw.png` | Legacy archive | Raw menu-only evidence. | Deep Work tab-menu capture or split-right result. |
| `screenshot projects/archive/raw-100x-surfaces__sc-smart-context-named-contexts-empty-2026-06-23T085041-0400-raw.png` | Legacy archive | Empty state is not campaign evidence. | PKM Synthesis Bundle named-context capture. |
| `assets/06-smart-context-saved-context-detail.png` | Demote to legacy support | Saved context evidence exists, but current PKM fixture is more audience-aligned. | PKM Synthesis Bundle named-context capture. |
| `assets/smart-plugins-carousel-03-copy-current-note-as-context.png` | Demote to legacy support | Carousel art explains concept but does not prove the live source picker. | `assets/plugin-context-100x-recaptures-2026-06-30/campaign/campaign-smart-context-source-picker-reference-pkm-1200x628-2026-06-30.png`. |
| `assets/smart-connections-surfaces-2026-06-17/04-smart-connections-codeblock.png` | Demote to legacy support | Thin legacy codeblock evidence lacks PKM context and visible result interpretation. | `assets/plugin-context-100x-recaptures-2026-06-30/campaign/campaign-smart-connections-codeblock-creating-output-1200x628-2026-06-30.png`. |
| `screenshot projects/archive/final-enhanced-100x-surfaces__sc-smart-context-builder-menu-source-note-clean-2026-06-23T085041-0400-landscape-enhanced.png` | Demote to legacy support | Good older builder crop, but weaker than the current PKM Synthesis Bundle detail view. | `assets/plugin-context-100x-recaptures-2026-06-30/campaign/campaign-smart-context-builder-pkm-synthesis-detail-1200x628-2026-06-30.png`. |
| `screenshot projects/archive/final-enhanced-100x-surfaces__sc-smart-context-builder-menu-source-note-clean-2026-06-23T085041-0400-square-enhanced.png` | Demote to legacy support | Good older builder crop, but no longer top-three for the surface. | `assets/plugin-context-100x-recaptures-2026-06-30/campaign/campaign-smart-context-builder-add-named-context-1200x628-2026-06-30.png`. |

## Completed recaptures

| Surface | Completed target | Campaign asset |
|---|---|---|
| [[plugin-smart-graph-selected-matches]] | Focus cluster and Neighborhood states after selecting Deep Work matches from the PKM Synthesis Bundle staging. | `assets/plugin-smart-graph-100x-recaptures-2026-06-30/campaign/campaign-smart-graph-focus-cluster-1200x628-2026-06-30.png`; `assets/plugin-smart-graph-100x-recaptures-2026-06-30/campaign/campaign-smart-graph-neighborhood-1200x628-2026-06-30.png` |
| [[plugin-smart-graph-tab-menu]] | Actual Split right result after using the tab menu, with scoped and whole-vault graph panes visible. | `assets/plugin-smart-graph-100x-recaptures-2026-06-30/campaign/campaign-smart-graph-split-right-result-1200x628-2026-06-30.png` |
| [[plugin-smart-context-builder]] | Clean PKM Synthesis Bundle detail view and Add named contexts picker after dismissing the toast-contaminated raw capture. | `assets/plugin-context-100x-recaptures-2026-06-30/campaign/campaign-smart-context-builder-pkm-synthesis-detail-1200x628-2026-06-30.png`; `assets/plugin-context-100x-recaptures-2026-06-30/campaign/campaign-smart-context-builder-add-named-context-1200x628-2026-06-30.png` |
| [[plugin-smart-context-named-contexts]] | Opened `PKM Synthesis Bundle` into builder/details; action-menu crop preserved as support evidence only because it is clipped. | `assets/plugin-context-100x-recaptures-2026-06-30/campaign/campaign-smart-context-builder-pkm-synthesis-detail-1200x628-2026-06-30.png` |
| [[plugin-smart-context-source-picker]] | Live source picker filtered to `reference/PKM`, replacing carousel evidence. | `assets/plugin-context-100x-recaptures-2026-06-30/campaign/campaign-smart-context-source-picker-reference-pkm-1200x628-2026-06-30.png` |
| [[plugin-smart-connections-codeblock]] | Rendered Smart Connections codeblock inside `reference/PKM/Creating Output`, with graph/list controls visible. | `assets/plugin-context-100x-recaptures-2026-06-30/campaign/campaign-smart-connections-codeblock-creating-output-1200x628-2026-06-30.png` |

## Recapture queue

| Priority | Surface | Recapture target | Why |
|---|---|---|---|
| P0 | [[plugin-smart-graph-search]] | Full-window or taller-window selected-actions state with title, query, action bar, named context, and scoped count all visible. | Current selected-actions capture is strongest, but the campaign crop is tight. |
| P1 | [[plugin-smart-connections-filter-controls]] | Filter controls open over meaningful related PKM results. | Current evidence is control-only. |
| P2 | [[plugin-smart-chat-codeblocks]] | Enabled fixture profile capture. | Currently blocked by inactive plugin state. |
| P2 | [[plugin-smart-connect-pro-bridge]] | Enabled fixture profile capture. | Catalog row is availability evidence only. |
| P2 | [[plugin-smart-trmnl-sync]] | Enabled fixture profile capture. | No active UI evidence. |
| P2 | [[plugin-dataview-rendered-query]] | Enabled fixture query over PKM notes. | No rendered query evidence. |
| P2 | [[plugin-excalidraw-drawing]] | Enabled fixture sketch/map of PKM concepts. | No drawing surface evidence. |
| P2 | [[plugin-vconsole-panel]] | Only if debugging docs require it. | Developer-facing surface has low campaign value. |

## Archive rule

Do not delete raw evidence during screenshot curation. Archive or demote by moving it out of publication candidates, adding it to this queue, and replacing it with a stronger asset path in the relevant shortlist or campaign note.

## Related

- [[_visual-qa-plugin-100x-gap-analysis]]
- [[_visual-qa-plugin-raw-archive-manifest]]
- [[_visual-qa-plugin-smart-graph-100x-recaptures]]
- [[_visual-qa-plugin-context-100x-recaptures]]
- [[_visual-qa-plugin-note-architecture]]
- [[_visual-qa-plugin-publication-candidates]]
- [[_visual-qa-plugin-ruthless-critique]]
