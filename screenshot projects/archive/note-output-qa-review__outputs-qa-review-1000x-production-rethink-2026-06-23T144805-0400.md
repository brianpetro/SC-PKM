---
record_type: qa_review
project_id: smart-plugin-screenshots
campaign_id: smart-loop-pmax-intent-ladder-signup
state: production-rethink
run_id: 2026-06-23T144805-0400
scope: AG1/AG3 promoted 1000X production value critique
operator: Codex
created_on: 2026-06-23
updated_on: 2026-06-23
---

# 1000X production rethink - 2026-06-23T144805-0400

## blunt read

The current 100X pass is useful QA, not production-grade ad evidence.

It shows the product has depth, but it does not yet make a buyer feel the payoff in one second. Most frames still look like a dark Obsidian workspace with dense plugin panels. The user has to work too hard to infer the claim.

1000X production value is not more screenshots, more settings, or heavier post-production. It is a cleaner truth system that lets one frame prove:

- what the user is working on
- what the product discovered
- why the match matters
- what action is now possible

The best frame should make the caption almost unnecessary.

## ruthless critique

| Area | Current state | Production decision |
|---|---|---|
| Truth | No named snapshot restore, wrong profile isolation, full-vault results visible. | Stop treating current-state captures as official candidates. They are QA only until fixture restore passes. |
| Visual story | Many frames show panels, menus, settings, or empty Context states. | Primary ads must show user work plus product output in the same frame. |
| First-glance clarity | Text is small, dark, and spread across panes. | Capture in smaller, purpose-built windows per aspect ratio with one obvious focal action. |
| Evidence quality | Results include `demos/`, `reference/`, and `screenshot projects/` items. | Exclude project/reference/demo noise from the semantic dataset before any official capture. |
| Candidate selection | Settings and Store are mixed with product-output scenes. | Settings/Store are support evidence only. Do not promote them into primary AG1/AG3 creative. |
| Context surfaces | Builder and picker are strong, but Smart Context is excluded from `sc-pro-clean`. | Either approve a separate Context addendum profile or remove Context from official AG3 captures. |
| Graph surfaces | Graph is visually strong, but sometimes disconnected from source/output proof. | Use Graph only when selected node, match list, and action controls are all visible. |
| PMax fit | Landscape, square, and portrait are often crops of the same composition. | Compose the real UI separately for each aspect ratio before capture. |
| Post-production | Crops improve readability but cannot fix weak source provenance. | Post-production begins only after raw capture gates pass. |

## kill list

Do not use these as primary AG1/AG3 production frames:

- General settings or account surfaces.
- Plugin settings as primary evidence.
- Store/catalog as primary evidence.
- Empty Context builder or empty named-context states.
- Command palettes, command lists, or generic menus.
- Progress, errors, warnings, crash dialogs, stale indexing, or loading states.
- Graph-only beauty shots with no active source/output relationship.
- Any result list containing `screenshot projects/`, prior run notes, QA records, or unrelated vault material.

## what 1000X should look like

1000X is a controlled real-product scene where the product payoff is visible before the viewer reads the caption.

The production frame should have:

- A real source note with a visible, human-readable intent.
- A visible ranked result or graph match that obviously relates to that intent.
- One action affordance in frame: expand, insert link, sort, add to context, or open related source.
- No personal data, no unrelated vault folders, no QA notes, no stale state.
- A readable crop at final ad size without relying on zooming.

The visual hierarchy should be:

1. Source note title and active paragraph.
2. Product-discovered related item with score or match.
3. Action outcome or next action.
4. Product identity/tier as a quiet supporting signal.

## revised 8-shot hero set

| Priority | Asset group | Shot | Why it matters | Gate |
|---:|---|---|---|---|
| 1 | AG1 | Source note plus current Connections list plus mini graph | Best single-frame explanation of Smart Connections. | Requires `sc-core-clean`, `v2-base-unlinked`, fixture-only results. |
| 2 | AG1 | Real result inserted as note link with matching result still visible | Converts discovery into durable structure. | Requires verified drag/action provenance from clean pre-link snapshot. |
| 3 | AG1 | Footer related notes at the end of the source note | Shows passive payoff at the natural review moment. | Requires fixture-only footer results and no Pro leakage. |
| 4 | AG3 | Inline connection popover on the triggering paragraph | Strongest Pro story: context appears where writing happens. | Requires `sc-pro-clean`, calibrated inline threshold, block indexing complete. |
| 5 | AG3 | Bases score column sorted against fixed reference | Operational proof for larger vaults and structured workflows. | Requires clean `v2-bases-unscored` start, no embedding errors. |
| 6 | AG3 | Bases related-links/list column after score pass | Shows Pro output feeding a table, not just a sidebar. | Requires verified `v2-bases-scored` and clean related trails. |
| 7 | AG3 addendum | Smart Graph selected node plus ranked match list plus controls | High visual energy without abandoning product evidence. | Requires approved Graph addendum and fixture-only graph/index state. |
| 8 | AG3 addendum | Smart Context source-connections picker with selected items | Best cross-plugin workflow proof if Context is in scope. | Requires explicit Smart Context addendum profile. |

Store and settings remain support captures. They can help docs, launch pages, internal QA, and trust proof, but they should not be first-line ad creative.

## production architecture

The next run should be built like a small film shoot, not a scavenger hunt:

- Lock the fixture.
- Lock the profile.
- Lock the ingestion boundary.
- Lock the window dimensions.
- Compose the UI for the exact aspect ratio.
- Capture the raw.
- Confirm gates immediately.
- Only then crop and sharpen.

The capture operator should know the target frame before opening Obsidian.

## minimum unlock package

Create this before another official recapture:

```text
reference/Smart Connections Demo/
  smart-connections-demo-v2/
    v2-base-unlinked/
    v2-post-link/
    v2-bases-unscored/
    v2-bases-scored/
    checksums.sha256
    profiles/
      sc-core-clean.md
      sc-pro-clean.md
      sc-context-addendum.md
      sc-graph-addendum.md
```

Profile records must include:

- enabled plugins
- disabled plugins
- observed tier label
- plugin versions
- source/index include-exclude scope
- model/config relevant to the scene
- exact functional settings
- required index readiness label

This is the smallest addition with the largest effect. It turns the work from "maybe this UI is okay" into a reproducible production pipeline.

## fixture v2.1 proposal

If the current v2 fixture keeps ranking weakly after isolation, do not tune filters to hide the problem. Create a v2.1 fixture with stronger natural-language intent while preserving real product behavior.

The fixture should make the desired relationships obvious to a human before indexing:

- Anchor paragraph about avoiding context switching while writing.
- Related notes about information overload, attention residue, deep work, and just-in-time linking.
- Negative controls that are semantically far away and visually named as mundane non-matches.
- One Base where the negative controls are present but visibly below target notes after scoring.

Do not write repeated keyword stuffing. The goal is cleaner semantic contrast, not manipulated ranking.

## capture composition rules

| Format | Window plan | Crop plan |
|---|---|---|
| Landscape | Two-pane proof: source note left, product output right. | Keep title, one paragraph, top 5 results, and one action control. |
| Square | Compact split: source excerpt above or left, output beside or below. | Remove sidebars unless they prove product identity. |
| Portrait | Single workflow column: source at top, output/action below. | Never shrink a wide desktop into portrait. |

Use UI zoom only if recorded and restored. Prefer smaller window geometry over post-crop magnification.

## post-production standard

Allowed after raw gates pass:

- crop
- resize
- sRGB conversion
- light unsharp mask
- contact sheet
- filename normalization

Not allowed:

- fabricating results
- editing scores
- hiding wrong folders
- removing errors
- rewriting labels
- compositing unrelated UI states into one frame

## final quality bar

A production candidate must pass all of these:

- Truth gates pass.
- Result contract passes.
- Source/output relationship is visible without explanation.
- Final target size is readable at normal ad preview scale.
- The frame has one job.
- No user/private data or unrelated app UI appears.
- The candidate is stronger than the current 100X version in first-glance clarity.

Anything else is internal QA.

## immediate next move

Do not capture more official raws until the snapshot/profile pack exists or the dispatch explicitly authorizes first materialization from fixture spec.

The highest-value next action is not another screenshot. It is to create the reproducible fixture/profile restore package, then recapture only the revised 8-shot hero set.
