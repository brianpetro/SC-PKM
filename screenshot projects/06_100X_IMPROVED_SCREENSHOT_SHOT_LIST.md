---
state: next
record_type: reference
project_id: smart-plugin-screenshots
assignment_id: ag1-ag3-100x-improved-shot-list
campaign: Smart Loop / PMax / Intent Ladder / Signup
created: 2026-06-25
updated: 2026-06-27
---

# 100X improved screenshot shot list

## WDLL

- AG1 and AG3 each have a 20-image managed PMax candidate set: 8 landscape, 8 square, and 4 portrait images.
- The launch set is the first 12 images per asset group. The scale set adds 8 more only after the launch scenes pass.
- Every image maps to a real current Obsidian UI state, one scene, one demo snapshot state, and one capture run.
- Every final image keeps critical product evidence inside the center 80% safe area.
- No settings, command palette, progress modal, generic hero art, or fabricated UI is used as a primary ad image.

## Why this is 100X better than the previous shot list

| Upgrade | Why it matters |
|---|---|
| Full PMax candidate coverage | Each asset group gets enough managed creative depth without padding with lifestyle or generic art. |
| Tiered launch vs scale | The operator captures the highest-conversion proof first instead of treating all shots as equal. |
| Evidence families, not just sizes | Each shot owns a distinct user belief, then gets recomposed for the useful ad formats. |
| Static claim limits | Still images never claim drag, hover, or handoff unless motion evidence exists. |
| Real Core/Pro boundary | AG1 uses Core-only Smart Connections; AG3 uses actual Connections Pro surfaces. |
| Rejection gates per shot | Bad captures are killed immediately instead of polished into misleading assets. |
| No screenshot-as-texture | Every shot must stay readable at ad size, not merely look like product UI. |

## Google Ads production frame

Final exports use these recommended PMax image sizes:

| Format | Aspect ratio | Final export | Minimum candidate coverage in this list |
|---|---:|---:|---:|
| Landscape | 1.91:1 | 1200 x 628 | 8 per asset group |
| Square | 1:1 | 1200 x 1200 | 8 per asset group |
| Portrait | 4:5 | 960 x 1200 | 4 per asset group |

Use JPG or PNG exports under 5 MB, keep critical product evidence inside the center 80% safe area, and export at the dimensions above.

## Capture philosophy

Do not capture prettier screenshots. Capture more obvious proof.

A shot is accepted only when a first-time Obsidian user can state the user belief in 5 seconds:

```md
AG1: My current note can surface useful related notes and turn one into structure.
AG3: Pro brings related context closer to the paragraph and turns relevance into sortable workflows.
```

## AG1 - First Useful Related Note

| Order | Tier | Shot | Scene | Profile | Formats | Impact | Visible proof | Reject if |
|---:|---|---|---|---|---|---:|---|---|
| 1 | T1 Launch | Hero: current note -> ranked related notes | `sc-current-note-related-notes` | `sc-core-clean` | Landscape, Square, Portrait | 100 | Active anchor note and ranked Smart Connections source results visible together | A viewer cannot tell the list belongs to the current note within 5 seconds |
| 2 | T1 Launch | Trust: expanded result preview/detail | `sc-current-note-related-notes` | `sc-core-clean` | Landscape, Square, Portrait | 96 | One top result expanded with real snippet or detail while anchor remains visible | The expanded result looks like random text rather than evidence of relevance |
| 3 | T1 Launch | Payoff: result inserted as note link | `sc-related-result-to-note-link` | `sc-core-clean` | Landscape, Square, Portrait | 99 | The current note contains a real Obsidian link to a visible matching Connections result | The link is visible but the source result is not visible or the link target is not verified |
| 4 | T1 Launch | End-of-note: Footer connections | `sc-footer-end-note-related-notes` | `sc-core-clean` | Landscape, Square, Portrait | 91 | End of the active note and Footer Connections results are visible together | The footer looks like a separate dashboard instead of the bottom of the active note |
| 5 | T2 Scale | Confidence: native hover preview | `sc-related-result-to-note-link` | `sc-core-clean` | Landscape, Square | 87 | A real native Obsidian hover preview confirms the selected result before opening | Static crop implies a hover interaction but the relation between result and preview is ambiguous |
| 6 | T2 Scale | Workflow: copy ranked links | `sc-copy-results-as-links` | `sc-core-clean` | Landscape, Square | 82 | The Connections list action/control supports copying ranked results as Obsidian links | The shot becomes a controls screenshot rather than a workflow payoff |
| 7 | T2 Scale | Context: mini-graph plus ranked list | `sc-current-note-related-notes` | `sc-core-clean` | Landscape, Square | 73 | Connections list includes visual relationship context plus ranked notes for the active anchor | Graph visual becomes decoration and hides result titles |
| 8 | T2 Scale | Footer payoff: expanded result at note end | `sc-footer-end-note-related-notes` | `sc-core-clean` | Landscape, Square | 78 | Footer result is expanded at the end of the note so relevance can be judged before linking | The expanded result is too small to read at final size |

## AG3 - Pro Trial / Large Vault Upgrade

| Order | Tier | Shot | Scene | Profile | Formats | Impact | Visible proof | Reject if |
|---:|---|---|---|---|---|---:|---|---|
| 1 | T1 Launch | Hero: inline related blocks while writing | `sc-inline-block-related-results` | `sc-pro-clean` | Landscape, Square, Portrait | 100 | Target paragraph, inline Connections icon, and real block-level popover are visible together | The popover appears detached from the paragraph or looks like a separate dashboard |
| 2 | T1 Launch | Depth: inline result detail or full list | `sc-inline-block-related-results` | `sc-pro-clean` | Landscape, Square, Portrait | 88 | The inline block can open a fuller current list/detail view with source snippets and scores | The shot no longer proves block-level anchoring |
| 3 | T1 Launch | Power: Bases score column sorted | `sc-bases-reference-relevance-score` | `sc-pro-clean` | Landscape, Square, Portrait | 96 | A Base table is sorted descending by a populated Connections score column against a fixed reference | A viewer cannot tell what the scores are measured against |
| 4 | T1 Launch | Power: Bases related link trails | `sc-bases-related-list-column` | `sc-pro-clean` | Landscape, Square, Portrait | 90 | A Base row contains real related link trails generated by Connections Pro | The cell content becomes a dense unreadable wall |
| 5 | T2 Scale | Pro renderer: denser result cards | `sc-pro-connections-list-renderer` | `sc-pro-clean` | Landscape, Square | 76 | Connections Pro result rendering shows richer metadata/snippets for current related results | Looks like a settings feature rather than a product outcome |
| 6 | T2 Scale | Reference proof: note plus scored Base split | `sc-bases-reference-relevance-score` | `sc-pro-clean` | Landscape, Square | 84 | Reference note and relevance-sorted Base are visible in the same Obsidian workspace | Both panes become too small; if so, keep this as landscape only |
| 7 | T2 Scale | Inline payoff: related source opened beside paragraph | `sc-inline-block-related-results` | `sc-pro-clean` | Landscape, Square | 80 | A source from the inline result is opened beside the paragraph that triggered it | Viewer cannot see that the opened source came from the inline result |
| 8 | T2 Scale | Large-vault proof: many-row Base ranked cleanly | `sc-bases-reference-relevance-score` | `sc-pro-clean` | Landscape, Square | 79 | Many candidate rows are visibly ordered by score with weak/noisy notes lower in the table | At ad size it becomes an unreadable spreadsheet |

## Launch set

Capture first:

```text
AG1-01 through AG1-04 in Landscape, Square, Portrait
AG3-01 through AG3-04 in Landscape, Square, Portrait
```

This produces 24 final assets. It is the minimum high-quality launch set.

## Scale set

Capture only after launch scenes pass:

```text
AG1-05 through AG1-08 in Landscape and Square
AG3-05 through AG3-08 in Landscape and Square
```

This adds 16 final assets and brings each asset group to 20 managed candidate images.

## Scene contract readiness

| Shot | Tier | Scene | Current contract status |
|---|---|---|---|
| AG1-01 | T1 Launch | sc-current-note-related-notes | Existing scene draft; must pass demo state reset, verification, and fatal gates before official capture |
| AG1-02 | T1 Launch | sc-current-note-related-notes | Existing scene plus expanded-result addendum; apply/verify addendum before capture |
| AG1-03 | T1 Launch | sc-related-result-to-note-link | Existing scene draft; static proof uses verified post-link state; motion required for drag claim |
| AG1-04 | T1 Launch | sc-footer-end-note-related-notes | Existing scene draft; must pass demo state reset, verification, and fatal gates before official capture |
| AG1-05 | T2 Scale | sc-related-result-to-note-link | Blocked: current canonical scene forbids open hover preview in final static state; author and verify a native-hover-preview variant first |
| AG1-06 | T2 Scale | sc-copy-results-as-links | Blocked: scene note missing; create and verify current UI contract before capture |
| AG1-07 | T2 Scale | sc-current-note-related-notes | Blocked until current-note scene adds and verifies a mini-graph-ranked-list variant |
| AG1-08 | T2 Scale | sc-footer-end-note-related-notes | Existing footer-expanded-result variant; verification required before scale capture |
| AG3-01 | T1 Launch | sc-inline-block-related-results | Existing scene draft; must pass Pro demo state reset, verification, and fatal gates before official capture |
| AG3-02 | T1 Launch | sc-inline-block-related-results | Existing inline-open-full-list addendum; verify block anchoring survives in current UI before capture |
| AG3-03 | T1 Launch | sc-bases-reference-relevance-score | Existing scene draft; static capture needs verified fixed-reference identity and scored state |
| AG3-04 | T1 Launch | sc-bases-related-list-column | Existing scene draft; must pass Pro demo state reset, verification, and fatal gates before official capture |
| AG3-05 | T2 Scale | sc-pro-connections-list-renderer | Blocked: scene note missing; create and verify Pro renderer contract before capture |
| AG3-06 | T2 Scale | sc-bases-reference-relevance-score | Blocked until Bases scene adds and verifies note-plus-scored-Base split variant; keep landscape if square becomes unreadable |
| AG3-07 | T2 Scale | sc-inline-block-related-results | Blocked until inline scene adds and verifies source-opened-beside-paragraph variant with action provenance |
| AG3-08 | T2 Scale | sc-bases-reference-relevance-score | Blocked until Bases scene adds and verifies many-row ranked variant; do not claim speed or universal quality |

## Global rejection rules

Reject the raw capture when any are true:

- product output is stale or belongs to a different note, block, query, or Base
- Core screenshots show Pro indicators
- Pro screenshots could be mistaken for Core
- command palette, settings, progress, errors, or generic menus dominate the shot
- the action claim requires motion but only a still exists
- relevant titles, snippets, scores, or links are unreadable at final size
- the shot proves a feature exists but not why it matters
- annotation would be required to rescue the basic meaning

## File map

Use `02_100X_SHOT_MATRIX.csv` as the complete capture/import matrix.

Use `03_PRIORITIZED_CAPTURE_ORDER.csv` when delegating to a computer-use operator.
