Your goal: use a small set of default hotkeys (pre-set in this vault) to format, reorder, and navigate notes without touching menus.

This note focuses on how to USE the hotkeys, not memorizing them.

## Hotkey legend
- `Mod` means:
	- macOS: Cmd
	- Windows/Linux: Ctrl
- `Alt` means:
	- macOS: Option
	- Windows/Linux: Alt

## The 4 moves these hotkeys unlock
Think in moves, not shortcuts.

### Move 1: Format fast (turn raw text into structure)
Use this when you have messy capture and want it to become a clean note.

**A. Convert lines into lists**
- Numbered list: `Mod+Shift+7`
- Bullet list: `Mod+Shift+8`

How to use it:
- Select multiple lines you want to become a list.
- Press the hotkey.
- Press again to toggle it off.

Example (2-minute cleanup on any capture):
- Paste raw notes like:
	- "Ideas"
	- "Constraints"
	- "Next steps"
- Select the lines under each and toggle bullets or numbers.

**B. Convert action lines into checkboxes**
- Toggle checklist status: `Mod+L`
- Toggle checklist status (alternate): `Mod+Shift+9`

How to use it:
- Put the cursor on a line (or select multiple lines).
- Press the hotkey to turn them into tasks.
- In Reading view, click the checkbox to complete.

Practical pattern:
- During a meeting: capture as bullets.
- Right after: select the true actions and convert to checkboxes.

**C. Mark something as "no longer true" without deleting it**
- Strikethrough: `Mod+Shift+5`

How to use it:
- Select a word/phrase.
- Strike it instead of deleting when you want history, not erasure.
- This is useful in decision notes and evolving plans.

**D. Promote a line into a section**
- Heading 1: `Alt+Mod+1`

How to use it:
- Put the cursor on a line that names a section (ex: "Actions").
- Press the hotkey to make it a heading.
- Then your note becomes foldable and scannable.

Common usage:
- Turn "Actions", "Notes", "Decisions" into headings so you can fold and jump.

> [!tip]
> Hotkeys work best on selections. If you want to format multiple lines, select them first.

### Move 2: Reorder fast (keep thinking flow, fix order later)
Use this when the right idea arrives out of order.

- Move line up: `Alt+ArrowUp`
- Move line down: `Alt+ArrowDown`

How to use it:
- Put the cursor on the line (or select multiple lines).
- Tap up/down until the order matches your intent.

Practical pattern:
- While outlining: dump bullets quickly, then reorder into a clean sequence.
- While writing procedures: reorder steps until it reads like a checklist.

### Move 3: Navigate long notes (fold to reduce cognitive load)
Use this when the note is longer than the screen.

- Fold all: `Alt+Mod+ArrowUp`
- Unfold all: `Alt+Mod+ArrowDown`
- Toggle fold (current section): `Mod+ArrowUp` or `Mod+ArrowDown`

How to use it (fast "scan mode"):
1) Fold all.
2) Expand only the section you care about (toggle fold on that heading).
3) Work only inside that section.

Failure mode:
- If Toggle fold seems to do nothing, you probably do not have headings yet. Create headings (use `Alt+Mod+1`), then folding becomes useful.

### Move 4: File operations (powerful, use intentionally)
Use these when you want to create, move, or delete files without menus.

- New note (File explorer): `Alt+N`
- Move current file: `Mod+M`
- Delete current file: `Mod+Shift+D`

How to use them safely:
- New note (`Alt+N`): use when you want a new scratch note immediately.
  - If it does nothing, click the File Explorer pane once (to focus it) and try again.
- Move file (`Mod+M`): use after a note becomes "real" and should live somewhere stable.
  - Type a folder name, then choose it from the picker.
- Delete file (`Mod+Shift+D`): use only when you truly want it gone.
  - Depending on your settings, you may see a confirmation. If you do not, treat this shortcut as hazardous.

> [!warning]
> If you are new to Obsidian, consider avoiding the delete hotkey until you trust your backups and workflow.

## The default utilization routine (a 3-minute cleanup pass)
Do this on any raw capture to make it usable.

1) Create structure
	- Turn section labels into headings: put cursor on "Notes", "Actions", "Decisions" -> `Alt+Mod+1`

2) Normalize lists
	- Select related lines -> bullets (`Mod+Shift+8`) or numbers (`Mod+Shift+7`)

3) Extract actions
	- Select only true actions -> convert to tasks (`Mod+L`)

4) Fix order
	- Move important bullets/actions into the right place (`Alt+ArrowUp` / `Alt+ArrowDown`)

5) Reduce noise
	- Fold all, then open only the section you need (`Alt+Mod+ArrowUp`, then toggle fold)

6) Put it where it belongs
	- Move the file to the right folder (`Mod+M`)

## Drills (build muscle memory)
### Drill 1: Format a messy note (60 seconds)
- [ ] Paste 6-10 raw lines into a note
- [ ] Select all -> make bullets (`Mod+Shift+8`)
- [ ] Select 2 action lines -> make them tasks (`Mod+L`)
- [ ] Turn "Actions" into a heading (`Alt+Mod+1`)
- [ ] Strike one obsolete line (`Mod+Shift+5`)

### Drill 2: Reorder for clarity (30 seconds)
- [ ] Write 5 bullets in the wrong order on purpose
- [ ] Reorder them using `Alt+ArrowUp` / `Alt+ArrowDown` until it reads cleanly

### Drill 3: Scan a long note (30 seconds)
- [ ] Create 3 headings and add content under each
- [ ] Fold all (`Alt+Mod+ArrowUp`)
- [ ] Open only one section with Toggle fold (`Mod+ArrowUp` / `Mod+ArrowDown`)
- [ ] Unfold all (`Alt+Mod+ArrowDown`)

## Reference: hotkeys included in this vault
These are the hotkeys explicitly set in `.obsidian/hotkeys.json`.

Lists and formatting
- Toggle bullet list: `Mod+Shift+8`
- Toggle numbered list: `Mod+Shift+7`
- Toggle checklist status: `Mod+L`
- Toggle checklist status (alternate): `Mod+Shift+9`
- Toggle strikethrough: `Mod+Shift+5`
- Set Heading 1: `Alt+Mod+1`

Editing
- Move current line up: `Alt+ArrowUp`
- Move current line down: `Alt+ArrowDown`

Folding
- Fold all: `Alt+Mod+ArrowUp`
- Unfold all: `Alt+Mod+ArrowDown`
- Toggle fold (current section): `Mod+ArrowUp` or `Mod+ArrowDown`

File actions
- New note (File explorer): `Alt+N`
- Move current file: `Mod+M`
- Delete current file: `Mod+Shift+D`

## Related
- [[11 Command Palette & Plugins - Operate at Keyboard Speed]]
- [[01 Markdown Basics - Writing in Obsidian]]

## Next action
- Use the 3-minute cleanup pass on the next messy note you create, using only these hotkeys.
