---
state: complete_with_blocked_mini_graph_insertion
assignment_id: mini-graph-retest-copyable-actions-100x
created: 2026-06-28
vault: Smart Vault
scene_note: reference/PKM/Avoiding Information Overload.md
---

# Mini-graph retest + copyable actions run

## Environment

- App: Obsidian 1.13.1
- Plugin label: Smart Connections Pro v2.5.8
- Sync/index state: Fully synced
- Window capture rectangle: `1969,175,1209,797`
- Recorded area: selected Obsidian window only
- File nav: closed
- Active note: `reference/PKM/Avoiding Information Overload.md`
- Connections anchor: `reference › PKM Avoiding Information Overload.md`
- Current result set included `Focus on Relevance`, `Fleeting Notes`, `Capturing Information`, `PKM Daily Review`, and `Core Components of PKM`

## Mini-graph insertion gate

Result: FAIL

Literal mini-graph node drag was retested before final recording. The drag did not write an Obsidian link into the target note, so no production GIF was created for graph-node insertion. The action remains blocked until the live UI writes a verified Markdown link from a graph node drop.

Rejected action claim:

- "Mini-graph node drag creates a link in the note"

Reason:

- The target note remained unchanged after attempted graph-node drags.
- A production GIF would imply a successful insertion that the live Markdown did not confirm.

## Accepted GIFs

### 1. Copy Connections list into note

Final:

`Connections media/screen-recordings-2026-06-28-mini-graph-retest-copyable-actions-100x/final/information-overload-copy-connections-list-to-note-2026-06-28.gif`

Raw:

`Connections media/screen-recordings-2026-06-28-mini-graph-retest-copyable-actions-100x/raw/copy-list-to-note-raw-2026-06-28.mov`

Truth gate: PASS

Proof:

- The live `Copy as list of links` menu action copied ranked Connections links to the clipboard.
- The note now contains a `Ranked links:` section with links including `[[Focus on Relevance]]`, `[[Fleeting Notes]]`, `[[Capturing Information]]`, `[[PKM Daily Review]]`, and `[[Core Components of PKM]]`.

### 2. Open Connections results in Smart Graph

Final:

`Connections media/screen-recordings-2026-06-28-mini-graph-retest-copyable-actions-100x/final/information-overload-open-connections-in-smart-graph-2026-06-28.gif`

Raw:

`Connections media/screen-recordings-2026-06-28-mini-graph-retest-copyable-actions-100x/raw/explore-smart-graph-raw-2026-06-28.mov`

Truth gate: PASS

Proof:

- The live Connections menu exposed `Explore in Smart Graph`.
- The resulting tab title was `Smart Graph - Connections results for Avoiding Information Overload.md`.
- The graph displayed result clusters while the Connections panel still showed the same ranked note set.

### 3. Smart Graph copy/focus/reset actions

Final:

`Connections media/screen-recordings-2026-06-28-mini-graph-retest-copyable-actions-100x/final/information-overload-smart-graph-copy-focus-reset-2026-06-28.gif`

Raw:

`Connections media/screen-recordings-2026-06-28-mini-graph-retest-copyable-actions-100x/raw/smart-graph-actions-raw-2026-06-28.mov`

Truth gate: PASS

Proof:

- The Smart Graph toolbar action `Copy links` wrote graph links to the clipboard.
- Clipboard proof included `[[Deep Work]]`, `[[Habit Tracker]]`, `[[PKM Daily Review]]`, `[[Core Components of PKM]]`, `[[Avoiding Information Overload]]`, and `[[Focus on Relevance]]`.
- The GIF shows graph scope actions, including a focused cluster and reset to whole-vault graph.

## Rejected raws

- `Connections media/screen-recordings-2026-06-28-mini-graph-retest-copyable-actions-100x/raw/rejected-copy-list-to-note-paste-failed-2026-06-28.mov`

Reason:

- The first copy-list attempt copied the links to the clipboard but failed to paste them into the note and split the `Related:` line. It was not promoted.

## QA artifacts

- `Connections media/screen-recordings-2026-06-28-mini-graph-retest-copyable-actions-100x/qa/menu-location-probe.png`
- `Connections media/screen-recordings-2026-06-28-mini-graph-retest-copyable-actions-100x/qa/contact-copy-list-to-note.jpg`
- `Connections media/screen-recordings-2026-06-28-mini-graph-retest-copyable-actions-100x/qa/contact-explore-smart-graph.jpg`
- `Connections media/screen-recordings-2026-06-28-mini-graph-retest-copyable-actions-100x/qa/contact-smart-graph-actions.jpg`
- `Connections media/screen-recordings-2026-06-28-mini-graph-retest-copyable-actions-100x/qa/final-contact-copy-list-to-note.jpg`
- `Connections media/screen-recordings-2026-06-28-mini-graph-retest-copyable-actions-100x/qa/final-contact-open-smart-graph.jpg`
- `Connections media/screen-recordings-2026-06-28-mini-graph-retest-copyable-actions-100x/qa/final-contact-smart-graph-actions.jpg`

## Current UI differences and notes

- A Smart Milestone toast appeared during pre-capture hover testing. It was dismissed before accepted captures.
- Smart Graph produced a product notification after `Copy links`; it was retained because it is a real confirmation of the copied action, not an error or fabricated overlay.
- The active note was intentionally left with the verified `Ranked links:` insertion created during the accepted copy-list GIF.
