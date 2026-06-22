---
state: draft
alignment:
  - "[[Smart Connections - screenshot scene manifest]]"
scene_id: lookup-question-meaning-ranked-results
plugin: Smart Lookup
tier: Core
surface: Lookup view
asset_classes:
  - ecosystem conversion
  - feature documentation
  - QA evidence
fixture: "[[Smart Connections - screenshot fixture]]"
fixture_state: v2-base-unlinked
verified_docs_on: 2026-06-22
verified_build:
revalidation_triggers:
  - Smart Lookup access changes
  - result settings move or change
  - standalone plugin ownership changes
  - query/result contract changes
---

# Smart Lookup scene - 03 question to meaning-ranked results

## outcome

```md
natural-language question -> meaning-ranked notes
```

## user belief

> When a question is the anchor, Smart Lookup can recover useful notes even when I do not remember their exact wording.

## publication eligibility

| Context | Eligibility | Constraint |
|---|---|---|
| Smart Connections-only conversion | no | Smart Lookup is a standalone plugin |
| Smart Plugins ecosystem | yes | name Smart Lookup explicitly |
| Smart Lookup conversion/docs | yes | use Smart Lookup public filename and caption |
| Procedural documentation | yes | separate access images may show ribbon/command palette |
| QA evidence | yes | preserve full-window state and plugin versions |

## truth contract

- The query, not an active note, is the retrieval anchor.
- The results are produced by the current standalone Smart Lookup Core plugin.
- At least one strong result demonstrates semantic retrieval beyond exact phrase repetition.
- Scores and ordering are real output.
- The scene must not imply that Smart Lookup is a current Smart Connections Core surface.

## prerequisites

### profile

- Restore `lookup-core-clean`.
- Enable Smart Environment and Smart Lookup Core.
- Disable Smart Connections, Connections Pro, and Smart Context in this profile unless a current dependency requires otherwise and is recorded.
- Confirm indexing is complete.
- Restore source-level Lookup results in the current Smart Lookup settings when that option is available.

### fixture

- Restore `smart-connections-demo-v2` at `v2-base-unlinked`.
- Confirm all target and negative-control notes are indexed.

## start state

- No Lookup query is active.
- No Connections pane is being presented as the active feature.
- No settings, command palette, indexing notice, or prior result preview is open.

## access actions

1. Open Smart Lookup using one current verified route:
	- click its ribbon action,
	- open the command palette, search `Lookup`, and select the Smart Lookup command that opens the Lookup view, or
	- use the verified Smart Lookup hotkey assigned to that command.
2. Confirm the opened surface is Smart Lookup and contains a query input plus semantic result area.
3. Clear any prior query and results.
4. Enter this fixture query exactly:

```text
What have I learned about information overload and protecting focus?
```

5. Submit the query using the current Lookup control or keyboard behavior.
6. Wait until the ranked results stop changing and no loading state remains.
7. Expand the strongest promising result long enough to verify its snippet supports the query.
8. Collapse the result again if the primary static target is the ranked list; retain it expanded only for a separately named result-anatomy variant.
9. Evaluate the result contract before capture.

Record the exact current command/ribbon label and query-submit behavior in the first verification run.

## stop state

The primary scene is ready only when:

- the Smart Lookup identity or unmistakable Lookup surface is visible
- the complete natural-language query is visible
- ranked source-level results are visible with titles and useful snippets or scores
- no loading, settings, command palette, or transient preview obscures the evidence

## result contract

- The visible top 6 contains at least 3 of:
	- `Avoiding Information Overload`
	- `Deep Work`
	- `Digital Minimalism`
	- `Attention Residue`
	- `Focus & Attention`
	- `Building a Second Brain`
- The top 3 includes `Avoiding Information Overload` or `Focus & Attention`.
- At least one strong visible result supports the idea without repeating both exact phrases `information overload` and `protecting focus`.
- No negative-control note appears in the top 5.
- Exact scores and ordering remain untouched.

## must show

- Smart Lookup surface identity
- full natural-language query
- ranked result titles
- enough result evidence to infer meaning-based retrieval
- enough Obsidian context to establish the product environment

## must not show

- Smart Lookup labeled or captioned as Smart Connections Core
- a Connections current-note pane presented as the query result surface
- exact-search syntax, regex, filename filters, or tag search
- loading, settings, command palette, errors, or notices
- fabricated result order, titles, snippets, or scores
- a negative-control result in the visible top 5

## recovery

| Symptom | Minimum recovery | Escalate when |
|---|---|---|
| Lookup command or ribbon action is absent | Confirm Smart Lookup Core is installed/enabled and reload the profile. | the current plugin exposes no verified opening route |
| Results are empty | Confirm Smart Environment readiness and fixture indexing, then resubmit. | indexing is complete and repeated queries remain empty |
| Results are too broad | Verify exact query and source-level setting; restore fixture and reindex. | the contract fails in a clean profile |
| Results are too narrow | Verify no stale filters or Pro-only ranking state; restore Core defaults. | current Core behavior cannot satisfy the fixture contract |
| Results look like exact keyword matches only | Expand the top candidates and verify semantic relevance; if absent, revise fixture prose rather than the screenshot. | no semantic evidence can be produced truthfully |
| Smart Connections branding causes ownership ambiguity | Use the standalone Lookup identity in the scene and caption; do not publish in a Smart Connections-only set. | the current UI cannot make ownership truthful |
| Prior query remains | Clear the query and reopen Lookup before re-entering the fixture query. | the surface preserves stale results after reset |

## variants

| Variant ID | What changes | What remains invariant | Eligible asset classes |
|---|---|---|---|
| `query-ranked-sources` | source-level ranked list | question is anchor and results are semantic | ecosystem conversion, docs |
| `query-expanded-result` | strongest result expanded | query and source verification remain visible | feature docs |
| `motion-query-to-result` | records entry, submit, and results | standalone Smart Lookup ownership | docs/editorial motion |

## verification gate

- [ ] standalone Smart Lookup Core ownership verified
- [ ] exact opening route and labels recorded
- [ ] source-level fixture query executed
- [ ] result contract passed
- [ ] semantic evidence inspected in an expanded result
- [ ] public filename uses `smart-lookup`
- [ ] untouched test capture preserved
- [ ] all fatal truth gates passed
- [ ] scene promoted to `capture-ready`

## capture runs

| Run | Variant | Raw evidence | Status | Publication locations |
|---|---|---|---|---|
|  |  |  |  |  |

## source references

```text
/smart-lookup/
/smart-lookup/search/
/smart-lookup/releases/0-1/
/smart-connections/releases/4-5/
```
