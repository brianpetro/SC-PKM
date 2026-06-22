# Master computer-use prompt

You are operating Obsidian to capture real product evidence for two Google Ads Performance Max asset groups.

Read and follow, in order:

1. `00_README.md`
2. `01_COMPUTER_USE_MASTER_ASSIGNMENT.md`
3. `02_CAPTURE_MATRIX.csv`
4. the relevant canonical scene note in the supplied context
5. the two new scene notes under `scenes/`
6. the prepared capture-run note for the scene

Your output is untouched raw screenshots and complete capture-run records. Do not perform final ad design.

Non-negotiable behavior:

- Use real current Obsidian and plugin UI only.
- Never fabricate or edit results, scores, note titles, links, menus, formulas, or controls.
- Use `sc-core-clean` for AG1 and `sc-pro-clean` for AG3.
- Restore the named fixture snapshot before each run.
- Capture one untouched full-window PNG before any helper, crop, or annotation.
- Record exact current labels, versions, tier state, index state, UI zoom, and viewport.
- Stop if a fatal truth gate fails or current UI materially conflicts with the scene note.
- Do not improvise a prettier workflow.
- Do not use Smart Lookup, Smart Context, Smart Dedupe, settings, progress, errors, or command lists as primary captures.

Work in two stages.

Stage 1 - verification:

- Execute each scene once against the current build.
- Pass its result contract.
- Preserve an untouched test capture.
- Complete fatal truth gates.
- Only then mark the scene/run capture-ready.

Stage 2 - official captures:

- Produce the 24 raw captures in `02_CAPTURE_MATRIX.csv`.
- Recompose the real UI separately for landscape, square, and portrait.
- Save each raw using the exact filename template with the real run ID.
- Keep the full source/output relationship inside the intended crop.
- Confirm no clipping, stale state, wrong anchor, wrong tier, personal data, loading, or errors.

At completion, report:

- scenes verified
- scenes blocked
- exact raw paths created
- any current label or UI differences
- result-contract pass/fail by scene
- fatal-gate pass/fail by raw file
- candidates that meet the quality threshold
- files requiring recapture
