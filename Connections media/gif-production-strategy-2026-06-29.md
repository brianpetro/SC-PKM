---
state: ready_for_recapture
created: 2026-06-29
scope: Smart Connections media GIF strategy
---

# GIF production strategy

## Ruthless critique

No current GIF is production-usable.

Primary failures:

- Too slow: current GIFs run 8 to 34.5 seconds, with multiple seconds where nothing meaningful changes.
- Cursor drag: several captures show a pointer sitting still or drifting without helping the viewer understand the action.
- Weak action grammar: recordings mix drag, menu copy, paste, graph open, and graph exploration in one sequence, so the viewer cannot name the payoff quickly.
- Truth-gate drag risk: mini-graph node insertion cannot be shown until the live drag writes a verified Markdown link.
- Too much workspace: some GIFs include file navigation, unrelated panes, or full-vault graph context before the user understands the main claim.
- Wrong medium: many previous GIFs are really still screenshots with minor frame changes.

## Current library decision

- `Connections media/usable/`: keep only strong still assets with readable proof.
- `Connections media/archive/`: all GIFs, raw videos, QA contact sheets, failed/fallback captures, duplicates, and weaker stills.
- Manifest: `Connections media/media-asset-review-2026-06-29.tsv`

## New GIF rules

Every new GIF must satisfy all gates:

- 4 to 7 seconds final duration.
- 12 to 15 fps.
- One user action, one visible payoff.
- No file nav unless the action specifically needs it.
- Cursor starts near the click target, moves deliberately, then exits the crop or remains meaningfully placed.
- No static cursor for more than 0.5 seconds unless it is visibly hovering a target.
- No command palette, settings, progress, notifications, or unrelated menus.
- Final crop keeps the action target and payoff inside the center 80%.
- Export both `.mp4` and `.gif`; use GIF only where the delivery surface requires it.
- Verify the result outside the GIF:
  - Markdown file changed for insertions.
  - Clipboard changed for copy actions.
  - Smart Graph tab/title/state changed for graph actions.

## Recommended capture set

### GIF 1 - Connections result to note link

Belief:

`A related note can become a real Obsidian link immediately.`

Action:

- Start with `Information Overload` note open and Connections panel visible.
- Drag or click a Connections result into the `Related:` line.
- End on the inserted `[[Focus on Relevance]]` link visible in the note while the source result remains visible.

Gate:

- `reference/PKM/Avoiding Information Overload.md` must contain the inserted link after capture.
- If mini-graph node drag still does not write a link, do not use mini-graph drag for this GIF.

### GIF 2 - Copy ranked Connections into note

Belief:

`The ranked list can be copied into working notes.`

Action:

- Open Connections menu.
- Click `Copy as list of links`.
- Paste below `Ranked links:`.
- End when 5 to 8 pasted links are visible.

Gate:

- Clipboard contains Obsidian links.
- Markdown file contains the pasted list.

### GIF 3 - Open result set in Smart Graph

Belief:

`Connections results can become an explorable graph.`

Action:

- Open Connections menu.
- Click `Explore in Smart Graph`.
- End on graph clusters plus the ranked Connections panel.

Gate:

- Tab title or status references `Connections results for Avoiding Information Overload.md`.

### GIF 4 - Smart Graph focus

Belief:

`A noisy graph can narrow to the relevant cluster.`

Action:

- Start already in Smart Graph results.
- Click one clear cluster/node.
- Click `Focus cluster`.
- End on the narrowed cluster, not the whole vault.

Gate:

- Status text or visible graph must change from result set to focused scope.

### GIF 5 - Smart Graph copy links

Belief:

`Graph discoveries can become copyable note links.`

Action:

- Start in a focused graph cluster.
- Click `Copy links`.
- Paste 3 to 6 copied links into the note or a visible scratch section.

Gate:

- Clipboard contains graph links.
- Pasted links are visible.

## Capture mechanics

- Use a smaller Obsidian window than the previous wide captures.
- Record only the Obsidian window.
- Record raw `.mov` with normal speed, then trim and speed up in export.
- Remove dead frames before and after each click.
- Preferred export transform:

```sh
ffmpeg -ss START -t DURATION -i raw.mov \
  -vf "setpts=0.55*PTS,fps=15,scale=980:-1:flags=lanczos" \
  output.mp4
```

Then create GIF only after the MP4 passes:

```sh
ffmpeg -i output.mp4 \
  -filter_complex "fps=15,scale=980:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=160:stats_mode=diff[p];[s1][p]paletteuse=dither=bayer:bayer_scale=3" \
  output.gif
```

## Recapture order

1. GIF 2 - copy ranked Connections into note.
2. GIF 3 - open result set in Smart Graph.
3. GIF 4 - Smart Graph focus.
4. GIF 1 - result to note link, only after insertion is verified.
5. GIF 5 - graph copy links, only if the paste proof is readable in 7 seconds or less.
