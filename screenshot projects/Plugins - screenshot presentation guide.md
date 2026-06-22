---
state: next
alignment:
  - "[[Plugins - screenshots SOP]]"
---

# Plugins - screenshot presentation guide

## WHY

Presentation should make valid product evidence legible and immediately understandable without changing what the evidence means.

This note owns formatting, composition, annotation, export, and visual review rules.

It does not own product claims, tier boundaries, fixture data, or scene access instructions.

## default visual baseline

| Setting | Default |
|---|---|
| Demo vault | Smart Vault or the campaign's isolated demo vault |
| Obsidian theme | Default dark or a near-default dark theme |
| Capture window | approximately 1490x1055, 1600x1000, or 1700x1060 |
| Source export | PNG, generally 1400-1700px wide after useful crop |
| UI zoom | 125-150% only when needed for publication readability |
| Editor font size | large enough that titles, result names, and actions remain readable at target width |
| Sidebar/file tree | retain only when it proves Obsidian context or the workflow relationship |
| Status bar | retain only when it adds truthful evidence; never use cropping to disguise the wrong tier profile |
| Annotation accent | use the plugin's existing accent; use purple for the Smart Connections campaign |
| Web derivative | optional WebP after the PNG source is preserved |

Campaigns may override these defaults without changing scene truth.

## composition rules

Prefer focused evidence over decorative polish.

Use:

- one visible claim per image
- an obvious source -> output or action -> payoff relationship
- tight crops of the real feature
- enough surrounding UI to establish Obsidian and the active context
- large readable result titles, snippets, controls, or output
- 16:9 for docs, landing pages, and blog headers when the placement benefits
- 4:5 for social and carousel derivatives when the placement benefits

Avoid:

- shrinking a full Obsidian window until the product becomes texture
- empty vaults, lorem ipsum, or generic sample output
- decorative framing that compensates for weak product evidence
- unrelated lower-ranked results that dilute the scene
- menus or popovers clipped by the capture edge
- multiple competing actions in one image
- one-note color treatment that makes every asset visually identical

## crops

- Preserve the untouched full-window raw capture.
- Crop unused desktop space, redundant file-tree width, and irrelevant status elements from derivatives.
- Keep every element required by the scene's truth contract.
- Never crop away evidence that the active note, query, block, base, or destination caused the visible output.
- Review the crop at the exact width used by the destination page.

## annotations

Annotations clarify a relationship; they do not explain the whole feature.

Approved defaults:

- one thin accent rectangle around the primary result, action, or output
- one curved or dashed arrow when the interaction path would otherwise be ambiguous
- one small tier label only when the campaign requires it and the product UI does not already make the tier clear

Maximum:

- one primary annotation treatment per screenshot
- one arrow per screenshot

Good labels:

```md
ranked matches
preview before opening
saved as Obsidian links
copy as list of links
current note
```

Avoid:

```md
powerful AI workflow
semantic intelligence
smart productivity
knowledge graph magic
```

Do not add:

- fake UI labels
- fake commands
- fake scores
- giant text boxes
- numbered callouts around every control
- marketing slogans inside the product capture

Captions belong beside the published image unless the publication format requires embedded text.

## static versus motion

A still image may claim only the visible state it proves.

Example:

- Static proof: a result is now an Obsidian link in the note.
- Motion proof: the result was dragged from the list into the note.

Use GIF or video when the value depends on:

- drag and drop
- hover activation
- automatic updates while typing
- a transition between two surfaces
- changing sort or filter state

Do not use an arrow to imply an interaction that was not captured or verified.

## image generation policy

Generated imagery may support presentation but may not reconstruct product behavior.

Allowed:

- subtle backgrounds
- editorial frames
- abstract textures
- social-card treatments outside the product UI
- non-product decorative elements

Not allowed:

- fake Obsidian panels
- fake plugin results
- fake scores
- fake menus
- generated screenshots presented as real product UI
- generated content-aware replacement inside the product surface

The final product UI must trace to a real raw capture.

## annotated derivative record

Every annotated screenshot has a corresponding note or capture-run section containing:

- `WHAT`: the visible relationship the annotation clarifies
- `WHY`: why that relationship matters to the scene outcome
- source raw-capture link
- annotated derivative link
- annotation color key when more than one semantic color is used
- editable source link when available

Scope reference:

- [[annotated screenshots.base]]

## post-production rules

| Item | Standard |
|---|---|
| Source preservation | Keep the untouched PNG raw capture. |
| Border | Optional subtle 1px border when the image blends into the destination background. |
| Caption | Stored in the campaign brief, not baked into the source image by default. |
| Alt text | Describes the visible workflow and outcome, not only the product name. |
| Compression | Preserve PNG source; export optimized WebP only as a derivative. |
| Editable source | Preserve SVG or the editable annotation source when used. |
| Contact sheet | Include for multi-asset campaigns. |
| README | Explain the scenario, critique, recommended files, and any publication restrictions. |
| Handoff package | Include the manifest, README, sources, final exports, editable assets, and contact sheet in a ZIP. |
| Traceability | Every derivative maps to one capture run and raw file. |

## quality scorecard

Score only after all fatal truth gates in [[Plugins - screenshots SOP#Phase 6 - Pass truth gates]] pass.

| Dimension | 0 | 1 | 2 |
|---|---|---|---|
| First-glance clarity | unclear without explanation | understandable after caption | outcome is obvious immediately |
| One job | competing features | mostly focused | one clear outcome |
| Readability | important text unreadable | primary labels readable | titles, evidence, and action readable at target width |
| Source/output relationship | anchor or trigger is missing | relationship is inferable | relationship is directly visible |
| Action or payoff clarity | feature merely exists | usefulness is plausible | the next useful action or payoff is obvious |
| Demo coherence | random or contradictory content | mostly coherent | one believable scenario across the set |
| Caption proof fit | caption overclaims or mismatches | caption helps | caption exactly names the visible proof |
| Publication suitability | needs substantial cleanup | usable with caveats | ready for its actual destination |

Generic pass threshold:

```md
14/16
```

Campaigns may require a higher threshold for flagship assets.

## ruthless review

Inspect every final image at full size and its actual publication size.

Reject or revise when:

- the active source and output do not match
- stale results are visible
- important text is unreadable
- unrelated results dominate
- a menu or popover is clipped
- annotations cover the product evidence
- the image proves a feature exists but not why it matters
- the caption requires an interaction the static image cannot prove
- the public filename does not describe the asset
- the image needs verbal rescue from the reviewer

A reviewer who did not author the scene should be able to state the intended user belief within 3 seconds.

A materially different answer fails the review.

## recommended output structure

```text
outputs/{plugin-name}-{campaign}/
  README.md
  manifest.md
  source/
    raw/
    focused-crops/
  final/
    *.png
    *.webp
  editable/
    *.svg
  contact-sheet.png
  {campaign}.zip
```

Campaign-specific structures may extend this pattern.
