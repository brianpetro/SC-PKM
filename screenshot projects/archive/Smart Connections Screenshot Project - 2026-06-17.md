---
created: 2026-06-17
status: captured
plugin: Smart Connections Pro
plugin_version: 4.6.1
source_vault: Smart Vault
asset_folder: assets/smart-connections-surfaces-2026-06-17
---

# Smart Connections Screenshot Project - 2026-06-17

Decision: this capture set covers Smart Connections Pro surfaces only. Smart Lookup is documented as a moved surface in settings, not treated as an active Smart Connections feature.

## WDLL

```md
A current screenshot project note with fresh Obsidian captures from the Smart Vault, showing every user-facing Smart Connections Pro surface and identifying which images should ship first.
```

## Capture Package

Source folder: `assets/smart-connections-surfaces-2026-06-17`

Plugin source: `.obsidian/plugins/smart-connections/manifest.json`

Plugin version: `4.6.1`

## Surface Coverage

- Ribbon commands and status entry points
- Connections pane with graph and ranked results
- Inline Connections popover
- Footer Connections
- `smart-connections` codeblock
- Bases `score_connection(...)`
- Bases `list_connections()`
- Settings for result lists, display, scoring, ranking, filters, inline, and footer controls
- Smart Lookup migration callout

## Recommended Publishing Order

1. `01-entry-status-connections-pane.png`
2. `02-inline-connections-popover.png`
3. `03-footer-connections.png`
4. `04-smart-connections-codeblock.png`
5. `05-bases-score-connection.png`
6. `06-bases-list-connections.png`

Use the settings captures for docs, support, and release notes. They prove coverage and configuration, but the product story is stronger when it leads with visible connection outcomes.

## Capture Prep

The demo Bases were updated before capture so the formulas point at real Smart Vault paths and produce visible values:

- `demos/Screenshot Demo - Smart Connections/Connection Scores.base`
- `demos/Bases score connections.base`
- `demos/Bases list connections.base`

## Publication Candidates

### 01 - Entry Points And Connections Pane

![[assets/smart-connections-surfaces-2026-06-17/01-entry-status-connections-pane.png]]

Use: lead screenshot for the core Smart Connections surface.

Visible outcome: ribbon commands, the Smart status entry point, inline markers, and the Connections side pane are visible in one working vault view.

Caption: Open a note and Smart Connections surfaces related notes from the vault.

Critique: best overview image. It includes several entry points without becoming a settings screenshot.

### 02 - Inline Connections Popover

![[assets/smart-connections-surfaces-2026-06-17/02-inline-connections-popover.png]]

Use: strongest Pro writing-surface proof.

Visible outcome: a block-level inline marker opens related connections with scores beside the paragraph being edited.

Caption: See related blocks while writing, without leaving the note.

Critique: keep for product storytelling. It shows the action surface and the payoff in the same frame.

### 03 - Footer Connections

![[assets/smart-connections-surfaces-2026-06-17/03-footer-connections.png]]

Use: secondary note-surface proof.

Visible outcome: the note footer renders Smart Connections results and graph context below the note body.

Caption: Add connections to the bottom of each note for review and discovery.

Critique: useful for docs and feature completeness. It is less immediate than inline because the reader has to notice the footer context.

### 04 - Smart Connections Codeblock

![[assets/smart-connections-surfaces-2026-06-17/04-smart-connections-codeblock.png]]

Use: advanced embedded-workflow proof.

Visible outcome: a `smart-connections` codeblock renders a live graph and ranked list inside a note.

Caption: Embed connection results directly into notes.

Critique: strong for power users and documentation. Use after the basic note surfaces.

### 05 - Bases Score Connection

![[assets/smart-connections-surfaces-2026-06-17/05-bases-score-connection.png]]

Use: Pro power-user proof.

Visible outcome: an Obsidian Base shows numeric semantic connection scores across note rows.

Caption: Score Base rows by semantic connection strength.

Critique: strongest advanced screenshot because it turns connections into sortable structured data.

### 06 - Bases List Connections

![[assets/smart-connections-surfaces-2026-06-17/06-bases-list-connections.png]]

Use: Pro data-surface proof.

Visible outcome: an Obsidian Base column lists related connections and scores for each row.

Caption: List related notes directly inside Bases.

Critique: pairs well with the score column screenshot. Use as an advanced follow-up, not the first image.

## Docs And Support Surfaces

### 07 - Settings: Lists, Display, Scoring, Ranking, Filters

![[assets/smart-connections-surfaces-2026-06-17/07-connections-settings-lists.png]]

Use: docs, support, and release notes.

Visible outcome: Smart Lookup migration callout, connection result list settings, display options, scoring, ranking, and filters are visible.

Caption: Configure results, display, scoring, ranking, and filters from Connections Pro settings.

Critique: important for completeness. Do not use as a lead marketing screenshot because configuration is not the primary payoff.

### 08 - Settings: Inline And Footer Connections

![[assets/smart-connections-surfaces-2026-06-17/08-connections-settings-inline-footer.png]]

Use: docs and feature-configuration proof.

Visible outcome: inline connection toggles, threshold, code-block exclusion, and footer connection controls are visible.

Caption: Tune inline and footer connection behavior from Connections Pro settings.

Critique: keep as a support asset. It proves the surfaces are configurable.

## Out Of Scope

- Smart Chat
- Smart Context
- Smart Graph
- Smart Environment, except where needed as the underlying indexing environment
- Smart Connect
- Smart Templates
- Duplicate Detector

## Blindspots

- These are dark-theme desktop captures. A light-theme pass may be needed for docs that require visual parity across themes.
- The settings screenshots include Smart Lookup as an install callout because Lookup has moved to a dedicated plugin.
- The Bases captures depend on Smart Environment data being available in this vault.
