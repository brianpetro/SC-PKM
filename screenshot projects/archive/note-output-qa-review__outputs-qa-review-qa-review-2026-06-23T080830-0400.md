---
record_type: qa_review
project_id: smart-plugin-screenshots
campaign_id: smart-loop-pmax-intent-ladder-signup
source_run_id: 2026-06-22T210759-0400
recapture_run_id: 2026-06-23T080830-0400
state: internal-qa-only
reviewed_on: 2026-06-23
operator: Codex Computer Use
truth_gates_passed: false
publication_candidates: 0
internal_qa_keepers: 21
recaptures_created: 7
---

# QA review - 2026-06-23T080830-0400

## review outcome

The 24 raw captures from `2026-06-22T210759-0400` were reviewed for internal QA value.

No file is a publication candidate. The original fatal-gate failures remain valid: profile isolation was not proven, full-vault/non-fixture content is visible, some result contracts failed, and Base captures show `No embedding for...` errors.

Marked as internal-QA-only:

- 21 of 24 original raws
- 7 smaller-window recaptures

Marked recapture-only / not useful enough to retain as QA evidence:

- 3 expanded-result raws from the original run

## useful QA evidence

| Evidence family | QA value | Still blocks publication |
|---|---|---|
| Bases score | Shows generated score column, descending score state, and current error behavior | Negative-control `No embedding for...` cells; non-isolated Pro profile |
| Bases related links | Shows `file.list_connections()` accepted and hydrated link trails | Negative-control errors; full-vault/non-fixture links |
| Inline popover | Shows inline icon, `Connections` popover, and `Lines 13-14` label | Mixed full-vault results and insufficient target-match count |
| Inline full list | Shows inline icons and current right-pane list together | Mixed full-vault results |
| Current note ranked list | Shows current note plus current Connections list | Full-vault pollution; result contract fail |
| Post-link | Shows the visible note link state | Link was manually inserted; drag provenance not proven |
| Footer | Shows end-of-note plus Footer/Connections surface | Full-vault pollution; result contract fail |

## smaller-window recaptures

The focused recaptures were taken at `1582 x 1185`, materially tighter than the original `2672 x 1712` raws.

| File | QA status | Reason |
|---|---|---|
| `screenshot projects/outputs/source/raw/qa-small-window/sc-bases-reference-relevance-score--bases-score-small-window--2026-06-23T080830-0400--raw.png` | internal-qa-preferred | Tighter view of score column and sorted Base state |
| `screenshot projects/outputs/source/raw/qa-small-window/sc-bases-related-list-column--bases-links-small-window--2026-06-23T080830-0400--raw.png` | internal-qa-preferred | Tighter view of `Related connections` link trails |
| `screenshot projects/outputs/source/raw/qa-small-window/sc-current-note-related-notes--ranked-list-small-window--2026-06-23T080830-0400--raw.png` | internal-qa-preferred | Tighter current-note/list state |
| `screenshot projects/outputs/source/raw/qa-small-window/sc-related-result-to-note-link--post-link-small-window--2026-06-23T080830-0400--raw.png` | internal-qa-preferred | Tighter visible post-link state |
| `screenshot projects/outputs/source/raw/qa-small-window/sc-footer-end-note-related-notes--footer-open-small-window--2026-06-23T080830-0400--raw.png` | internal-qa-preferred | Tighter end-of-note/footer state |
| `screenshot projects/outputs/source/raw/qa-small-window/sc-inline-block-related-results--inline-full-list-small-window--2026-06-23T080830-0400--raw.png` | internal-qa-preferred | Tighter inline-icons plus right-list state |
| `screenshot projects/outputs/source/raw/qa-small-window/sc-inline-block-related-results--inline-popover-small-window--2026-06-23T080830-0400--raw.png` | internal-qa-preferred | Tighter inline popover with `Lines 13-14` visible |

## supporting files

- Contact sheet for original 24: `screenshot projects/outputs/qa-review/contact-sheet--2026-06-22T210759-0400.png`
- Contact sheet for small-window recaptures: `screenshot projects/outputs/qa-review/contact-sheet--small-window--2026-06-23T080830-0400.png`
- QA CSV: `screenshot projects/outputs/qa-review/qa-review--2026-06-23T080830-0400.csv`

## next action

Use the seven smaller-window files for internal product QA review only. For ad production, recapture from isolated `sc-core-clean` and `sc-pro-clean` profiles after the fixture/indexing issues are fixed.
