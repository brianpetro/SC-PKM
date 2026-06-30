---
WHAT: "Screenshot index for Native Obsidian - tabs."
record_type: surface
surface_type: native
surface_id: native-tabs
aliases: ["Native Obsidian - tabs"]
obsidian_surface_id: "tabs"
enabled_in_vault: true
status: "enabled"
source_state: "screenshots indexed"
created_on: 2026-06-29
updated_on: 2026-06-29
---

# Native Obsidian - tabs

> [!summary]
> Tabs, tab groups, and pane controls.

## WHY

Keep only the top current screenshots for this native Obsidian surface in the bucket. Legacy, weak, duplicate, or support-only native evidence belongs in [[_visual-qa-native-raw-archive-manifest]] so this note stays useful as a surface index, not a gallery dump.

## WDLL

```md
A reviewer can open this note, see the current screenshots for this native Obsidian surface, and follow the How section to produce a fixture-safe capture.
```

## Screenshots

#### tabs 2026 06 29

![[assets/native-obsidian-surfaces-2026-06-29/native-tabs-2026-06-29.png]]

## How

1. Open a safe multi-tab workspace, show tab titles and pane controls, and avoid private note names.
2. Use a fixture-safe note or workspace so the screenshot explains the surface without exposing private vault content.
3. Preserve the full-window raw capture first, then add only the top current raw, crop, final, or publication derivative back to this note.
4. If the surface is disabled in this vault, record the enablement state and capture from an isolated fixture profile.

## Capture checklist

- [ ] Full-window raw capture is preserved before crop or annotation.
- [ ] Surface identity, active context, and target output are visible together.
- [ ] No account details, private note content, notices, errors, or loading states are exposed.
- [ ] Plugin, Core/Pro, and native Obsidian ownership are captioned truthfully.
- [ ] Screenshot path is added back to this surface note after capture.

## Blindspots

- Current native buckets are intentionally capped at the top 1-3 screenshots; move weak or superseded references to [[_visual-qa-native-raw-archive-manifest]].
- If a plugin overlay appears, recapture or move the image to the plugin surface note instead.

## Related

- [[_visual-qa-native-publication-candidates]]
- [[_visual-qa-native-raw-archive-manifest]]
- [[13 Workspaces & Bookmarks - Your Control Surface]]
- [[Plugins - screenshots SOP]]
- [[Plugins - screenshot scene template]]
- [[Screenshot Projects - schema and views]]
