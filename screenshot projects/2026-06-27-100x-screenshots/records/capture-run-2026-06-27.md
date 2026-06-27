---
state: qa-only
run_id: 2026-06-27-100x-screenshots
created: 2026-06-27
campaign: Smart Loop / PMax / Intent Ladder / Signup
---

# Capture run - 2026-06-27 100X screenshots

## Current UI record

| Field | Observed value |
|---|---|
| App | Obsidian |
| App version | 1.13.1 |
| Vault | Smart Vault |
| Plugin/tier label | Pro v2.5.8 |
| Sync label | Fully synced |
| Index/action label | Re-import (1) visible on Base captures |
| Primary note | Smart Connections Demo / How I build context in my notes |
| Base | Smart Connections Demo / Smart Connections Relevance.base |
| Capture method | Untouched macOS full-window screencapture |
| Capture viewport | 3840 x 2160 PNG |
| UI zoom | Not changed during this run; not verified through settings |

## Run decision

These captures are preserved as internal QA evidence only. They should not be promoted into the official AG1/AG3 matrix without a clean rerun.

Blocking issues:

- AG1 Core shots visibly show Pro v2.5.8.
- Related results include duplicate demo-source variants and unrelated reference/demo material.
- Base captures show Re-import (1), so the index/import state is not clean.
- Earlier Base captures also include a filter evaluation error.
- Several shots prove the surface exists, but not all prove the intended user belief at ad size.

## Raw files

| Raw file | Scene | Result contract | Fatal gate |
|---|---|---|---|
| raw/diagnostic-current-smart-graph-stale-index-2026-06-27.png | Diagnostic graph/current index | N/A | Fail - index contamination visible |
| raw/ag1-01-current-note-ranked-list-gate-fail-stale-reference-index-2026-06-27.png | AG1-01 current note ranked list | Partial pass | Fail - Pro tier label and index contamination |
| raw/ag1-04-footer-connections-end-note-gate-fail-pro-tier-index-contamination-2026-06-27.png | AG1-04 footer connections | Partial pass | Fail - Pro tier label and index contamination |
| raw/ag1-08-footer-expanded-results-gate-fail-pro-tier-index-contamination-2026-06-27.png | AG1-08 footer expanded/results | Partial pass | Fail - Pro tier label, index contamination, partial footer title visibility |
| raw/ag3-01-inline-block-popover-gate-fail-stale-reference-index-2026-06-27.png | AG3-01 inline block popover | Partial pass | Fail - index contamination |
| raw/ag3-03-bases-score-sorted-gate-fail-filter-error-reimport-2026-06-27.png | AG3-03 Base scored/sorted | Partial pass | Fail - filter error and Re-import (1) |
| raw/ag3-03-bases-score-sorted-current-state-gate-fail-reimport-index-contamination-2026-06-27.png | AG3-03 Base scored/sorted | Partial pass | Fail - Re-import (1) and index contamination |
| raw/ag3-04-bases-related-link-trails-gate-fail-filter-error-reimport-2026-06-27.png | AG3-04 Base related link trails | Partial pass | Fail - filter error and Re-import (1) |

## Internal QA candidates

| Candidate | Keep reason |
|---|---|
| raw/ag3-01-inline-block-popover-gate-fail-stale-reference-index-2026-06-27.png | Strongest action shot: real inline block icon and popover are anchored to the writing surface. |
| raw/ag3-03-bases-score-sorted-current-state-gate-fail-reimport-index-contamination-2026-06-27.png | Best Pro table evidence: score column, sorted rows, and related connection trails are visible without the earlier toast. |
| raw/ag1-04-footer-connections-end-note-gate-fail-pro-tier-index-contamination-2026-06-27.png | Shows the end-of-note footer surface and graph context together. |
| raw/ag1-08-footer-expanded-results-gate-fail-pro-tier-index-contamination-2026-06-27.png | Shows footer graph plus the start of ranked footer result titles. |

## Required recapture conditions

- Use a clean Core profile for AG1 where no Pro label or Pro-only controls are visible.
- Use a clean Pro profile for AG3 with no queued Re-import label.
- Rebuild or refresh the semantic index until results belong to the intended current note, block, or Base reference.
- Confirm no filter error appears before any Base capture.
- Capture separate landscape, square, and portrait compositions after the raw state passes gates.
