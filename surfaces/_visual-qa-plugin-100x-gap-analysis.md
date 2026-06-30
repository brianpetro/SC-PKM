---
WHAT: "100X gap analysis for plugin screenshot utility and campaign evidence."
record_type: surface_visual_qa_gap_analysis
created_on: 2026-06-30
updated_on: 2026-06-30
surface_type: "plugin"
status: "active"
---
# Plugin screenshot 100X gap analysis

> [!summary]
> This note defines what is missing from the current plugin screenshots and what 100X should mean before another capture pass adds more images.

## WDLL

```md
A reviewer can tell whether a screenshot explains a PKM outcome, decide what to recapture next, and avoid promoting images that only prove a UI exists.
```

## What is missing

| Gap | Why it matters | Current symptom |
|---|---|---|
| Outcome proof | The audience cares about retrieval, synthesis, reuse, and publishing, not chrome. | Many screenshots show panes, menus, or settings without the user outcome after the click. |
| State transitions | A single static UI often misses the "before to after" value. | Smart Graph search was stronger after Select matches because actions appeared. |
| Action surfaces | Campaign images should show what the user can do next. | Buttons like Add to context, Focus cluster, Copy links, and Open are easy to miss unless deliberately captured. |
| Connected workflows | Smart Plugins are strongest as a system: Connections to Graph to Context to output. | Current notes mostly bucket individual surfaces, so the cross-plugin story is underdeveloped. |
| Settings-to-runtime pairing | Settings screenshots explain control, but not value. | Settings images are useful support evidence but need a paired runtime surface. |
| Format variants | Publication needs landscape, square, portrait, and raw provenance. | Most promoted assets are landscape-only. |
| Archive discipline | Weak images keep resurfacing because they remain next to better candidates. | Empty states, no-match searches, and stale raw menu captures are still indexed near stronger replacements. |
| Note role separation | Surface notes are becoming galleries plus critique plus campaign notes. | High-volume notes such as footer, current note results, and contact sheets are already large. |

## What 100X looks like

| Surface family | 10X capture | 100X capture |
|---|---|---|
| Smart Graph search | Query field plus highlighted node. | Query, selected matches, action bar, scoped count, and a related named context or note visible. |
| Smart Graph tab menu | Menu open over graph. | Menu open as a bridge to the actual split-right result, with a follow-up image showing graph and PKM note side by side. |
| Smart Context named contexts | A saved context card. | Saved context, item count, action menu, and an opened builder/details view that reveals the reusable source bundle. |
| Smart Context builder | Source list with a context name. | Clean saved bundle, token/source weighting, no milestone toast, and a visible next action such as Copy text or Add source. |
| Smart Connections results | Related notes list. | Source note, ranked related result, selected/expanded result, and insertion or preview action visible. |
| Settings surfaces | Focused settings crop. | Settings crop paired with the runtime surface it controls. |
| Smart Plugins catalog | Active/Enable/Install state. | Catalog row used only as availability evidence, never as runtime proof. |

## New 100X evidence

The selected-match recapture shows why a screenshot can move from "pretty graph" to "action proof": after selecting matches, the graph exposes Open, Copy links, Add to context, Focus cluster, Neighborhood, and a scoped node count.

![[assets/plugin-surface-100x-audit-2026-06-30/contact-sheets/graph-context-100x-gap-contact-sheet-2026-06-30.png]]

### Smart Graph selected actions

Caption: Smart Graph search: selected matches become PKM actions.

![[assets/plugin-surface-100x-audit-2026-06-30/campaign/campaign-smart-graph-search-selected-actions-1200x628-2026-06-30.png]]

### Smart Context and Connections PKM staging

Caption: Smart Context Builder: a reusable PKM bundle with source weighting and token scope.

![[assets/plugin-context-100x-recaptures-2026-06-30/campaign/campaign-smart-context-builder-pkm-synthesis-detail-1200x628-2026-06-30.png]]

Caption: Smart Context source picker: choose live PKM reference notes as reusable context.

![[assets/plugin-context-100x-recaptures-2026-06-30/campaign/campaign-smart-context-source-picker-reference-pkm-1200x628-2026-06-30.png]]

Caption: Smart Connections codeblock: a PKM note renders related output notes inline.

![[assets/plugin-context-100x-recaptures-2026-06-30/campaign/campaign-smart-connections-codeblock-creating-output-1200x628-2026-06-30.png]]

## 100X capture rules

1. Capture the user consequence, not only the surface.
2. Include the next action when the surface is action-oriented.
3. Prefer PKM fixture notes from `reference/PKM/` and reusable named contexts over generic notes.
4. Keep raw full-window evidence, but promote only the most explanatory crop.
5. Treat empty states, no-match states, and catalog rows as support evidence unless the scene specifically documents that state.
6. Pair settings with runtime evidence before calling them campaign-ready.
7. Use the smallest note that can hold the decision: bucket, critique, archive queue, campaign shortlist, or format variant note.

## Related

- [[_visual-qa-plugin-archive-recapture-queue]]
- [[_visual-qa-plugin-raw-archive-manifest]]
- [[_visual-qa-plugin-smart-graph-100x-recaptures]]
- [[_visual-qa-plugin-context-100x-recaptures]]
- [[_visual-qa-plugin-note-architecture]]
- [[_visual-qa-plugin-campaign-shortlist]]
- [[_visual-qa-plugin-ruthless-critique]]
