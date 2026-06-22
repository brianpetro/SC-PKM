---
state: next
alignment:
  - "[[Plugins - screenshots SOP]]"
  - "[[Smart Connections - screenshot campaign]]"
manifest_id: smart-connections-scenes-v2
verified_docs_on: 2026-06-22
---

# Smart Connections - screenshot scene manifest

## purpose

This is the map of image intentions for the Smart Connections primary story.

It owns scene identity, dependencies, eligibility, and readiness status.

Detailed access and recovery instructions live in the linked scene notes.

Fixture content lives in [[Smart Connections - screenshot fixture]].

## status rule

The instructions below are specification-complete, but a scene remains `draft` until its current UI path and fixture result contract are observed in the target Obsidian environment.

Only a scene with a preserved test capture and all fatal truth gates passed may become `capture-ready`.

## scene manifest

| Order | Scene ID | Scene note | Product/tier | Profile | Fixture start | Stop-state proof | Publication eligibility | Status / next gate |
|---:|---|---|---|---|---|---|---|---|
| 01 | `sc-current-note-related-notes` | [[Smart Connections scene - 01 current note related notes]] | Smart Connections Core | `sc-core-clean` | `v2-base-unlinked` | active note and current-note Connections results are visible together | Smart Connections listing, ecosystem, docs | `draft`: run local fixture test and preserve raw evidence |
| 02 | `sc-related-result-to-note-link` | [[Smart Connections scene - 02 related result to note link]] | Smart Connections Core | `sc-core-clean` | `v2-base-unlinked` | expected result remains visible and the note contains its real link | Smart Connections listing, ecosystem, docs | `draft`: verify real drag output in current editor mode |
| 03 | `lookup-question-meaning-ranked-results` | [[Smart Lookup scene - 03 question to meaning-ranked results]] | Smart Lookup Core, standalone | `lookup-core-clean` | `v2-base-unlinked` | natural-language query and relevant ranked results are visible | ecosystem and Smart Lookup docs only | `draft`: verify query contract; never label as Smart Connections Core |
| 04 | `sc-inline-block-related-results` | [[Smart Connections scene - 04 inline connections while writing]] | Connections Pro | `sc-pro-clean` | `v2-base-unlinked` | target block, inline icon, and real results popover are visible | ecosystem, Connections Pro listing/docs | `draft`: calibrate threshold and preserve test popover capture |
| 05 | `sc-bases-reference-relevance-score` | [[Smart Connections scene - 05 Bases relevance score]] | Connections Pro | `sc-pro-clean` | `v2-bases-unscored` | Base has a populated score column sorted descending against a fixed note | ecosystem, Connections Pro listing/docs | `draft`: verify command, reference selector, and sort in current Base UI |
| 06 | `sc-results-to-smart-context` | [[Smart Connections scene - 06 send results to Smart Context]] | Smart Connections Core + Smart Context Core | `sc-context-core` | `v2-base-unlinked` | Smart Context opens with transferred Connections results ready for review | ecosystem/docs bonus only | `draft`: verify cross-plugin action label and transferred set |

## campaign sequencing

### Smart Plugins ecosystem

```md
01 -> 02 -> 03 -> 04 -> 05 -> optional 06
```

### Smart Connections-only listing

```md
01 -> 02 -> Footer Core replacement -> 04 -> 05
```

Scene 03 is excluded because Smart Lookup is now a standalone plugin.

Scene 06 is excluded from the first five because it introduces Smart Context before the Smart Connections value loop is complete.

## scene invariants

| Scene | Invariant | Fixture-dependent details that may change |
|---|---|---|
| 01 | active note causes ranked related notes to appear | note title, snippets, exact scores/order |
| 02 | a real result becomes a real note link | chosen result title and rendered link style |
| 03 | a natural-language question causes meaning-ranked results | query wording, result titles, exact rank |
| 04 | a block-level inline signal opens related results beside the block | target paragraph and matched blocks |
| 05 | a Base can be scored and sorted against a reference note | Base rows, scores, fixed reference title |
| 06 | Connections results transfer into Smart Context for review | selected/transferred note titles and count |

## asset map

| Scene | Required static | Recommended motion | Public filename |
|---|---:|---:|---|
| 01 | yes | optional automatic-update demo | `smart-connections-01-current-note-related-notes.png` |
| 02 | yes | yes, to prove drag | `smart-connections-02-result-inserted-as-note-link.png` |
| 03 | yes | optional query/expand flow | `smart-lookup-03-question-by-meaning.png` |
| 04 | yes | optional hover activation | `smart-connections-04-inline-connections-pro.png` |
| 05 | yes | recommended when reference identity is not visible in one still | `smart-connections-05-bases-score-column-pro.png` |
| 06 | conditional: source and destination must both remain visible | recommended cross-plugin handoff | `smart-connections-06-send-results-to-smart-context.png` |

## dependency boundaries

| Scene | Required dependency truth |
|---|---|
| 01-02 | Core profile contains no Connections Pro surface or status. |
| 03 | Smart Lookup is installed and named as its own Core plugin. |
| 04-05 | Connections Pro is active and the scene is explicitly labeled Pro. |
| 06 | Smart Connections and Smart Context are separate enabled Core plugins; the scene does not imply provider transmission. |

## shared preflight

- [ ] correct profile restored
- [ ] exact fixture version restored
- [ ] indexing complete
- [ ] scene-specific functional settings restored
- [ ] no private vault content present
- [ ] current plugin/tier ownership rechecked
- [ ] scene note access actions match the current UI
- [ ] result contract passes without editing product output
- [ ] untouched test capture preserved
- [ ] scene promoted to `capture-ready`

## source pages used for current specification

```text
/smart-connections/list-feature/
/smart-connections/settings/
/smart-connections/footer/
/smart-connections/inline/
/smart-connections/bases/
/smart-lookup/
/smart-lookup/search/
/smart-connections/releases/4-5/
/smart-context/
```

## next scene required for Smart Connections-only campaign

```md
Footer connections at the end of the current note
```

Intended invariant:

```md
finish note -> scroll to note end -> review related notes without opening a sidebar
```

This scene is not silently substituted into the numbered manifest until it has its own scene note, fixture contract, verification record, and test capture.
