---
state: current
record_type: archive_index
updated_on: 2026-06-25
---

# Screenshot Project Archive Index

## Purpose

This folder stores material that should not be treated as the current publishable screenshot set.

Archive files are retained for provenance, comparison, and recovery only.

## Current Contents

- 115 archived image files.
- 28 archived historical records/tooling files, plus this index.
- Files are flattened at the archive root and renamed with provenance prefixes.

## Archived Image Prefixes

| Prefix | Reason archived |
|---|---|
| `final-1000x-hero__` | weak, empty, or superseded 1000x final derivative |
| `final-enhanced-100x-surfaces__` | weaker support-surface derivative |
| `final-enhanced-action-shots__` | weaker enhanced action-shot derivative |
| `final-wow-10__` | B-tier WOW final alternate |
| `qa-review...` | contact sheet or QA artifact, not a standalone production screenshot |
| `raw-1000x-hero__` | raw duplicate superseded by stronger final or official raw |
| `raw-100x-surfaces__` | weak or duplicate support-surface raw |
| `raw-action-shots__` | duplicate action-shot raw |
| `raw-ag1__` | older duplicate official raw matrix capture |
| `raw-ag3__` | older duplicate official raw matrix capture |
| `raw-diagnostic__` | diagnostic/window-capture test |
| `raw-wow-10__` | WOW raw/provenance copy not kept in the stricter usable set |

## Archived Note And Record Prefixes

| Prefix | Meaning |
|---|---|
| `note-output-capture-run__` | historical capture-run record formerly under `outputs/capture-runs/` |
| `note-output-qa-review__` | historical QA or review record formerly under `outputs/qa-review/` |
| `note-run-fixture__` | old demo state reset run record |
| `note-run-verification__` | old verification preflight run record |
| `note-legacy-project__` | legacy project note |
| `note-legacy-review__` | legacy review note |
| `csv-output-manifest__` | old output manifest |
| `csv-superseded-review-manifest__` | superseded image-sort manifest |
| `zip-output-qa-review__` | old QA/tooling zip artifact |

## Reuse Rule

Do not publish from this folder directly.

To reuse an archived file:

1. Read the filename prefix and, when present, the matching manifest row.
2. Reopen the archived record or raw file for provenance.
3. Reclassify it against the current truth gates.
4. Move or copy a reviewed candidate into `../usable/` only after that review.
