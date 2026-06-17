---
created: 2026-06-15
status: review
smart_chat: skipped
source_package: outputs/smart-plugins-surfaces-screenshots-v3
---

# Smart Plugin Screenshot Review - No Smart Chat

Decision: keep Smart Chat out of this review until there is a real model-backed answer. The current Chat capture only proves missing setup, not product value.

The strongest story is:

```md
Open a note -> see related notes -> search by meaning -> build context -> rank or transform the result.
```

## Review Contact Sheet

![[no-chat-review-contact-sheet.png]]

## Recommended Publishing Order

1. `01-smart-connections-view.png`
2. `02-smart-lookup-results.png`
3. `05-smart-context-copy-depth-menu.png`
4. `10-bases-score-column-pro.png`
5. `08-smart-templates-selected-template.png`

Use `03-inline-connections-popover.png` only after recapturing it in the same demo vault, or label it as a reused real UI capture from the earlier production set.

## Publication Candidates

### 01 - Smart Connections View

![[01-smart-connections-view.png]]

Use: lead proof for Smart Connections.

Visible outcome: the current note anchors a ranked list of related notes.

Caption: Open any note. Smart Connections surfaces related notes from your vault.

Critique: strongest core-value screenshot. The only issue is Core/Pro boundary risk because the app status area may expose Pro. Crop or recapture if this is used in a Core-only listing.

### 02 - Smart Lookup Results

![[02-smart-lookup-results.png]]

Use: semantic search proof.

Visible outcome: a natural-language question returns meaning-ranked notes.

Caption: Use Lookup when the question is the anchor.

Critique: useful and believable. The query panel is narrow, but the question/result relationship is clear. Keep for the main sequence.

### 03 - Inline Connections Popover

![[03-inline-connections-popover.png]]

Use: Pro inline-writing proof.

Visible outcome: related context appears beside the paragraph while writing.

Caption: Connections Pro shows related blocks while you write.

Critique: real UI, but it is reused from the prior production capture and does not visually match the current demo vault. Recapture in this vault before using in a same-story carousel.

### 04 - Smart Context Builder With Source

![[04-smart-context-builder-named-with-source.png]]

Use: context-building workflow proof.

Visible outcome: the current note is saved into a named context with token/character count.

Caption: Save the right sources into a reusable context.

Critique: real and useful, but the Duplicate Detector behind the modal adds noise. Recapture over a neutral note or crop tighter around the builder.

### 05 - Smart Context Copy Depth Menu

![[05-smart-context-copy-depth-menu.png]]

Use: strongest Context workflow screenshot.

Visible outcome: the user chooses copy depth and can include links/backlinks.

Caption: Copy the current note as structured context.

Critique: keep. This has the clearest action surface because the menu shows concrete options and output size.

### 06 - Smart Context Saved Context Detail

![[06-smart-context-saved-context-detail.png]]

Use: named-context management proof.

Visible outcome: a saved context contains the selected note and can accept more sources.

Caption: Reuse saved contexts when the same source set matters again.

Critique: good for docs, weaker for marketing. It proves state, not payoff. Use after the copy-depth shot.

### 07 - Smart Graph Whole Vault

![[07-smart-graph-whole-vault.png]]

Use: visual relationship proof.

Visible outcome: related note clusters appear in the graph surface.

Caption: See semantic clusters across the vault.

Critique: visually distinct and helpful for advanced users, but less actionable than result lists. Use as a secondary Pro/suite image, not the lead.

### 08 - Smart Templates Selected Template

![[08-smart-templates-selected-template.png]]

Use: template-to-prompt workflow proof.

Visible outcome: a selected template can use the active context and copy a prompt.

Caption: Turn selected context into reusable prompts.

Critique: useful and concrete. The background Duplicate Detector still creates visual noise, but the selected template and copy action are readable.

### 09 - Duplicate Detector Real Matches

![[09-duplicate-detector-real-matches.png]]

Use: specialized cleanup proof.

Visible outcome: exact and semantic duplicate matches are found in the vault.

Caption: Find exact and semantic duplicates when the vault gets noisy.

Critique: real and much improved over empty-state captures. Do not lead with this for Smart Connections because it reframes the product as cleanup software.

### 10 - Bases Score Column Pro

![[10-bases-score-column-pro.png]]

Use: Pro power-user proof.

Visible outcome: a Base is sorted by semantic connection score.

Caption: Connections Pro can score and sort Bases by semantic relevance.

Critique: strong advanced screenshot. It is from the earlier production vault, so recapture in the current vault if one-vault coherence is mandatory.

## Docs-Only And Support Surfaces

### 00 - Smart Plugin Ribbon And Status

![[00-smart-plugin-ribbon-and-status.png]]

Use: entry-point documentation.

Visible outcome: ribbon commands and Smart status are visible.

Critique: not a marketing image. It shows where features live, not why they matter.

### 01 - Footer Connections

![[01-footer-connections.png]]

Use: secondary surface documentation.

Visible outcome: related results are visible in the footer/sidebar style surface.

Critique: useful for docs, but redundant beside the stronger Connections and Lookup shots.

### 02 - Smart Environment Status Menu

![[02-smart-environment-status-menu.png]]

Use: support documentation.

Visible outcome: the Smart Environment menu exposes stats, exports, milestones, notifications, and plugin browsing.

Critique: desktop background and menu UI make it unsuitable for listing assets. Keep for help docs.

### 03 - Smart Environment Notifications Feed

![[03-smart-environment-notifications-feed.png]]

Use: diagnostics and support docs.

Visible outcome: event and notification feed is visible with filters.

Critique: too internal for conversion. It proves observability, not user value.

### 04 - Smart Environment Stats

![[04-smart-environment-stats.png]]

Use: support and QA.

Visible outcome: source/block counts and embedding coverage are visible.

Critique: valuable for troubleshooting, weak for marketing. Do not include in the first screenshot set.

### 05 - Smart Environment Milestones

![[05-smart-environment-milestones.png]]

Use: onboarding and docs.

Visible outcome: installation and workflow milestones are tracked.

Critique: better than a settings page, but still setup-oriented. Use only after value screenshots.

### 06 - Smart Plugins Browser

![[06-smart-plugins-browser.png]]

Use: product-suite documentation.

Visible outcome: Smart Plugins are listed with active settings controls.

Critique: good suite-management proof. Do not use in a single-plugin store carousel unless the point is ecosystem breadth.

## Missing On Purpose

Smart Chat is intentionally omitted. The available capture showed `MISSING MODEL (open_router)` and no real answer, so it should stay out of any public screenshot set until a real configured model produces a note-grounded response.

## Next Improvement Pass

1. Recapture Inline Connections in this exact demo vault.
2. Recapture Bases score column in this exact demo vault.
3. Recapture Context Builder over a neutral current note instead of Duplicate Detector.
4. Crop Core screenshots to remove Pro-only status indicators when building Core-first store assets.

## Final Plugin-Store Carousel

This is the final five-image carousel built from the strongest non-Chat screenshots in this review. It is a Smart Plugins suite carousel, not a Core-only Smart Connections carousel.

### 01 - Current Note To Related Notes

![[Plugin Store Carousel/smart-plugins-carousel-01-current-note-related-notes.png]]

Caption: Open any note. Smart Connections surfaces related notes from your vault.

Alt text: Smart Connections showing related notes beside the current Obsidian note.

Why it ships: this is the clearest first-glance proof that the current note becomes the anchor for useful related notes.

### 02 - Lookup Question By Meaning

![[Plugin Store Carousel/smart-plugins-carousel-02-lookup-question-by-meaning.png]]

Caption: Use Lookup when the question is the anchor.

Alt text: Smart Lookup showing meaning-ranked results for a natural-language question in Obsidian.

Why it ships: it shows semantic search without making the user read settings or ranking internals.

### 03 - Copy Current Note As Context

![[Plugin Store Carousel/smart-plugins-carousel-03-copy-current-note-as-context.png]]

Caption: Copy the current note as structured context.

Alt text: Smart Context copy depth menu for copying the current note as structured context.

Why it ships: it turns plugin output into an obvious workflow action.

### 04 - Bases Score Column Pro

![[Plugin Store Carousel/smart-plugins-carousel-04-bases-score-column-pro.png]]

Caption: Connections Pro can score and sort Bases by semantic relevance.

Alt text: Connections Pro Bases table sorted by semantic relevance score.

Why it ships: it is the strongest advanced/proof-for-power-users screenshot in the set.

### 05 - Context To Template Prompt

![[Plugin Store Carousel/smart-plugins-carousel-05-context-to-template-prompt.png]]

Caption: Turn selected context into a reusable prompt.

Alt text: Smart Templates using selected context to copy a reusable prompt.

Why it ships: it extends the story from discovery and context into a concrete prompt workflow.

## Final Carousel README Block

```md
![Smart Connections showing related notes beside the current note](final/smart-plugins-carousel-01-current-note-related-notes.png)

Open any note. Smart Connections surfaces related notes from your vault.

![Smart Lookup showing meaning-ranked results for a natural language question](final/smart-plugins-carousel-02-lookup-question-by-meaning.png)

Use Lookup when the question is the anchor.

![Smart Context copy depth menu for copying the current note as structured context](final/smart-plugins-carousel-03-copy-current-note-as-context.png)

Copy the current note as structured context.

![Connections Pro Bases table sorted by semantic connection score](final/smart-plugins-carousel-04-bases-score-column-pro.png)

Connections Pro can score and sort Bases by semantic relevance.

![Smart Templates using selected context to copy a reusable prompt](final/smart-plugins-carousel-05-context-to-template-prompt.png)

Turn selected context into a reusable prompt.
```
