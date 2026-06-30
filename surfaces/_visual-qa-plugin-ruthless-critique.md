---
WHAT: "Ruthless utility critique for plugin surface screenshots."
record_type: surface_visual_qa_critique
created_on: 2026-06-30
updated_on: 2026-06-30
surface_type: "plugin"
surface_count: 34
---
# Plugin screenshot ruthless critique

> [!summary]
> Utility review of plugin screenshots for explaining surfaces to PKM-oriented Obsidian users.

## Rubric

| Verdict | Meaning |
|---|---|
| Keep | Explains the surface with a visible outcome, readable target UI, and minimal ambiguity. |
| Crop candidate | Useful content exists, but surrounding chrome or scale weakens comprehension. |
| Support only | Explains configuration, availability, or state, but does not prove the runtime surface. |
| Recapture | Weak, stale, raw, placeholder, overly dense, or not aligned to PKM user desires. |
| Blocked | The plugin is disabled or gated; capture requires an enabled fixture profile. |

## High-level critique

- The strongest screenshots show a PKM outcome: related notes, inline popovers beside meaningful prose, footer results at the bottom of a note, Bases columns, and context pickers that act on notes.
- The weakest screenshots are raw settings panes, menu placeholders, tab menus, and store/catalog rows. They document existence but do not explain what a user can do.
- Smart Graph visuals need special skepticism: a dense graph looks impressive, but without a selected note, visible match list, or scoped cluster, it explains less than a smaller action-oriented crop.
- Smart Plugins catalog captures are valuable for product matrix evidence, especially Core/Pro, Active, Enable, Install, and Learn more states. They should not be reused as runtime proof for Chat, Connect, TRMNL, Dataview, Excalidraw, or vConsole.
- Settings screenshots should be treated as companion evidence. They answer "can this be configured?" not "why does this surface matter?"

## Recaptures created

| Surface | New strongest evidence |
|---|---|
| [[plugin-smart-plugins-catalog]] | `assets/plugin-surface-recapture-2026-06-30/crops/plugin-smart-plugins-catalog-core-pro-active-disabled-modal-crop-2026-06-30.png` and lower-row crop. |
| [[plugin-smart-connections-settings]] | Results/display, component, and inline/footer focused crops. |
| [[plugin-smart-graph-settings]] | Help/scope focused crop showing scope modes and screenshot instructions. |
| [[plugin-smart-context-settings]] | External sources and templates focused crop. |
| [[plugin-smart-environment-index-settings]] | Source indexing crop plus embedding/chat model settings crop. |
| [[plugin-smart-graph-search]] | Captioned selected-actions campaign asset with active match, graph actions, scoped count, and saved named context visible. |
| [[plugin-smart-graph-tab-menu]] | Captioned tab-menu crop over the PKM-staged Smart Graph search surface. |
| [[plugin-smart-context-named-contexts]] | Captioned PKM Synthesis Bundle asset showing a reusable named context with 4 items. |
| [[plugin-smart-context-builder]] | Clean PKM Synthesis Bundle detail, Add named contexts, and source-bundle campaign assets showing reuse, source weights, and token scope without toast contamination. |
| [[plugin-smart-context-source-picker]] | Live `reference/PKM` source picker campaign asset replacing carousel evidence. |
| [[plugin-smart-connections-codeblock]] | Rendered `reference/PKM/Creating Output` codeblock campaign asset with graph, controls, and related result list. |

## Surface audit

| Surface | Verdict | Critique | Action |
|---|---|---|---|
| [[plugin-smart-connections-entry-points]] | Crop candidate | Shows access points, but utility is low unless paired with a result surface. | Crop around ribbon/status and caption as entry only. |
| [[plugin-smart-connections-current-note-results]] | Keep | Best audience fit: it shows related notes while the user is working in a note. | Keep live 100x ranked-results candidate. |
| [[plugin-smart-connections-filter-controls]] | Recapture | Current candidate is raw and reads like a control artifact, not a workflow. | Recapture with filter open over meaningful PKM results. |
| [[plugin-smart-connections-sort-menu]] | Keep | Menu is readable and specific enough for a small surface. | Keep the existing enhanced/wow crops. |
| [[plugin-smart-connections-inline-popover-pro]] | Keep | Strong because the trigger, source paragraph, and related results appear together. | Keep best runtime crops; settings crop is support only. |
| [[plugin-smart-connections-footer]] | Keep | Strong when the footer is visible at the end of a PKM note with a usable result. | Keep runtime footer candidates; settings evidence remains support only. |
| [[plugin-smart-connections-codeblock]] | Keep | New PKM-staged codeblock capture shows the note context, rendered graph/list output, and controls together. | Use the `Creating Output` campaign asset; keep the old 2026-06-17 codeblock image archived only. |
| [[plugin-smart-connections-bases-score-column-pro]] | Keep | Good Pro evidence because it explains semantic scoring inside Bases. | Keep. |
| [[plugin-smart-connections-bases-list-column-pro]] | Keep | Good Pro evidence because it shows related links in a table workflow. | Keep. |
| [[plugin-smart-connections-settings]] | Support only | Old settings screenshots were raw and over-chromed; new crops explain controls better. | Use new focused crops as settings companions. |
| [[plugin-smart-graph-whole-vault]] | Crop candidate | Whole-vault graph is visually impressive but can be too abstract. | Prefer selected-match or scoped graph screenshots for publication. |
| [[plugin-smart-graph-search]] | Keep | New Deep Work capture shows the query, active Select matches control, matched graph node, and named context side pane. | Use the captioned campaign asset; keep the no-match capture as support evidence only. |
| [[plugin-smart-graph-selected-matches]] | Keep | Stronger than whole-vault graph because it binds graph nodes to a selected note. | Keep. |
| [[plugin-smart-graph-tab-menu]] | Crop candidate | New crop shows Split right/down over a staged PKM graph, but the menu remains inherently small. | Use the captioned campaign asset only where tab-level affordances matter. |
| [[plugin-smart-graph-settings]] | Support only | New settings crop explains scope modes and screenshot behavior. | Use as settings companion, not graph outcome proof. |
| [[plugin-smart-context-builder]] | Keep | Strongest current evidence now shows the saved PKM Synthesis Bundle, four source notes, source weighting, token count, and Add named contexts path. | Use the two new campaign assets plus the prior PKM sources crop; keep legacy enhanced crops archived. |
| [[plugin-smart-context-source-picker]] | Keep | New live picker replaces marketing-style carousel evidence with an actual filtered `reference/PKM` source list. | Use the live source-picker campaign asset; keep carousel evidence archived only. |
| [[plugin-smart-context-source-connections-picker]] | Keep | Strong when Connections results feed context construction. | Keep the action-oriented graph/context picker candidate. |
| [[plugin-smart-context-named-contexts]] | Keep | New capture replaces the weak empty state with a reusable PKM Synthesis Bundle; the action-menu proof is useful but clipped. | Use the named-context campaign asset and builder detail campaign asset together; keep the clipped action-menu crop as support only. |
| [[plugin-smart-context-settings]] | Support only | New crop explains external sources and templates; not a runtime result. | Use as settings companion. |
| [[plugin-smart-lookup-view]] | Keep | Existing carousel evidence explains semantic lookup better than no active capture. | Recapture live when Lookup is enabled. |
| [[plugin-smart-environment-status]] | Recapture | Status/feed/stats are support surfaces and can look like generic telemetry. | Recapture with index health and relevant queued source context. |
| [[plugin-smart-environment-index-settings]] | Support only | New crops are materially clearer for source/index/model configuration. | Use new focused crops for settings coverage. |
| [[plugin-smart-plugins-catalog]] | Keep | New catalog crops strongly explain the Smart Plugins matrix and active/disabled states. | Keep both top and lower catalog crops. |
| [[plugin-smart-chat-codeblocks]] | Blocked | Catalog proves availability only; plugin is disabled, so no codeblock surface is shown. | Capture in an enabled fixture profile. |
| [[plugin-smart-chat-thread-dashboard]] | Recapture | Existing no-chat review sheet is negative-state evidence, not the dashboard surface. | Capture enabled dashboard or mark as disabled-state only. |
| [[plugin-smart-templates-selected-template]] | Recapture | Existing single screenshot is thin and lower catalog row only proves install state. | Capture a selected template applied in a note workflow. |
| [[plugin-smart-milestones]] | Recapture | Reference evidence may be useful, but it is not tied to current PKM staging. | Recapture milestone list/detail with meaningful progress context. |
| [[plugin-smart-connect-pro-bridge]] | Blocked | Catalog shows Enable state only; no bridge workflow is visible. | Capture after explicit approval to use enabled fixture profile. |
| [[plugin-smart-trmnl-sync]] | Blocked | No active UI captured. | Capture after explicit approval to enable or use fixture evidence. |
| [[plugin-dataview-rendered-query]] | Blocked | Installed inactive; no rendered query evidence. | Capture in enabled fixture profile with a PKM table/query. |
| [[plugin-excalidraw-drawing]] | Blocked | Installed inactive; no drawing canvas evidence. | Capture in enabled fixture profile with a PKM map/sketch. |
| [[plugin-vconsole-panel]] | Blocked | Installed inactive and developer-facing; not audience-relevant without a specific doc need. | Capture only if debugging docs require it. |
| [[plugin-duplicate-detector-results]] | Keep | Reference result evidence is useful if duplicates are real and non-private. | Keep, but recapture if current UI has changed. |

## Next recapture targets

1. Smart Connections filter controls over meaningful PKM results; the current UI path did not expose a clean filter panel during the latest pass.
2. Smart Graph search as a taller full-window selected-actions capture; current campaign evidence is strong but tightly cropped.
3. Disabled plugin surfaces in an isolated enabled fixture profile: Chat, Connect Pro, TRMNL, Dataview, Excalidraw, and vConsole.
