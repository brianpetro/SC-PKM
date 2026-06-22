---
state: next
alignment:
  - "[[🧩 Smart Plugins]]"
timeliness: 8
impact: 8
---

# Plugins - screenshots SOP

## WHY

- Real product screenshots build trust by showing what the current plugin actually does.
- A screenshot scene should be reproducible by a delegated operator without requiring product, editorial, or design decisions during capture.
- One verified scene should support multiple campaigns, vaults, viewports, and publication formats without losing provenance.

## WDLL

- Every published product image maps to an untouched raw capture from the current real UI.
- Every scene proves one concrete user-visible outcome.
- A delegate can reach the scene's stop state using its scene note alone.
- Core, Pro, and cross-plugin dependencies are structurally separated rather than hidden during post-production.
- Semantic result expectations are expressed as resilient contracts, not fabricated scores or brittle exact rankings.
- Campaign briefs choose scenes and claims; they do not redefine product truth.
- Formatting, annotation, and capture helpers cannot alter or overrule the evidence.
- A manifest maps every scene, capture run, derivative, caption, and publication location.

## scope

This SOP governs screenshots that show Smart Plugin behavior inside Obsidian.

It covers:

- conversion and plugin-listing images
- feature documentation
- procedural documentation
- QA and provenance captures
- editorial or social derivatives that include real product UI

It does not contain:

- plugin-specific campaign strategy
- demo-vault content
- scene-specific access instructions
- presentation and annotation rules
- DOM, JavaScript, or CSS capture helpers
- unfinished production work

Those belong in linked notes.

## source-of-truth map

| Artifact | Owns | Must not own |
|---|---|---|
| This SOP | global production policy, lifecycle, truth gates, provenance | plugin campaigns, fixture content, scene steps, styling snippets |
| [[Plugins - screenshot scene template]] | required scene-note schema | plugin-specific scene data |
| [[Plugins - screenshot capture run template]] | per-run evidence and verification record | campaign strategy |
| [[Plugins - screenshot presentation guide]] | composition, annotation, crops, exports, visual QA | product claims or access instructions |
| [[Plugins - screenshot capture helpers]] | optional reversible capture utilities | canonical product behavior |
| [[Plugins - screenshot production backlog]] | unfinished campaigns, experiments, and capture inventory | canonical policy or verified scene instructions |
| Campaign brief | audience, sequence, claims, captions, public filenames, campaign thresholds | generic SOP rules |
| Scene manifest | map of scenes, dependencies, status, and publication eligibility | detailed steps or fixture prose |
| Scene note | one reproducible UI state and its access/recovery instructions | campaign ordering or styling |
| Fixture note | versioned demo data and deterministic starting states | scene-independent policy |
| Capture run | exact environment, raw files, derivatives, verification, publication uses | reusable scene definition |

### precedence when artifacts disagree

1. Observed current UI behavior and verified current tier ownership.
2. Fatal truth gates in this SOP.
3. The current verified scene note and fixture version.
4. Campaign claims and publication sequence.
5. Presentation guidance and optional helpers.

WHEN the current UI conflicts with documentation or a scene note THEN stop publication, preserve the evidence, and mark the scene `needs-review`.

WHY: presentation must never conceal a product-truth conflict.

## definitions

| Term | Meaning |
|---|---|
| Asset class | The publication job: conversion, feature explanation, procedural instruction, QA evidence, or editorial/social. |
| Campaign | An ordered selection of scenes and claims for one publication outcome. |
| Scene | A content-agnostic definition of the UI relationship that must remain stable across fixtures and variants. |
| Variant | A deliberate change that preserves the scene's outcome, such as desktop/mobile, source/block, or static/motion. |
| Fixture | Versioned demo data, plugin profile, settings, and snapshots that make a scene reproducible. |
| Capture run | One execution of one scene variant in a recorded environment. |
| Raw capture | Untouched evidence captured before cropping, annotation, retouching, or DOM/CSS helpers. |
| Derivative | Any crop, annotation, compressed export, social card, or other asset produced from a raw capture. |
| Result contract | Observable relevance conditions that must hold without requiring exact scores or exact rank order. |

## classify the asset before choosing a scene

| Asset class | Primary question | Suitable evidence | Common exclusions |
|---|---|---|---|
| Conversion | Why should a new user care now? | one outcome, input/output relationship, workflow payoff | setup, progress, dense settings, error states |
| Feature explanation | What does this surface do? | current context plus representative output and controls | unrelated features that dilute the explanation |
| Procedural instruction | How do I reach or configure this state? | settings, command palette, menu, intermediate steps | decorative claims that compete with the instruction |
| QA evidence | Did the current build behave correctly? | full-window provenance, version/state indicators, before/after evidence | aggressive crops that remove diagnostic context |
| Editorial/social | What story should be remembered? | real UI inside a clearly derivative treatment | generated or reconstructed product UI |

A rule for one asset class is not automatically a global rule.

Example: settings are usually poor conversion assets but are valid procedural documentation.

## production lifecycle

### Phase 1 - Define the publication outcome

- Name the asset class, audience, publication location, and user belief.
- Write one observable job for each proposed scene.
- Determine whether the publication is plugin-specific or an ecosystem story.
- Verify every plugin and tier claim against the current product.
- Create or update the campaign brief.

Exit condition:

- Every proposed image has one job and one truthful publication context.

### Phase 2 - Specify and qualify the scene

- Create the scene from [[Plugins - screenshot scene template]].
- Give it a stable `scene_id` that does not depend on note titles or fixture prose.
- Define the start state, access actions, stop state, result contract, must-show evidence, exclusions, and recovery paths.
- Link a versioned fixture state.
- Perform one local test execution against the current build.

Scene states:

```md
draft -> verified -> capture-ready -> captured -> published
                       |                    |
                       +----> needs-review <-+
```

Only a `capture-ready` scene may be delegated for official capture.

`verified` means the feature and access path were observed.

`capture-ready` additionally means the fixture produced the result contract and a test capture passed the fatal truth gates.

### Phase 3 - Prepare isolated product profiles

Use separate Obsidian profiles or reproducible plugin states for:

- Core-only scenes
- Pro scenes
- cross-plugin scenes

Do not rely on cropping, hiding, or DOM removal to make a Pro environment look like Core.

Record:

- Obsidian version
- plugin names and versions/builds
- license/tier state
- Smart Environment/index state
- fixture version and snapshot
- relevant functional settings

Exit condition:

- The profile itself cannot leak an incorrect tier claim into the scene.

### Phase 4 - Reach the scene stop state

- Restore the scene's exact fixture start state.
- Follow only the access actions in the scene note.
- Use the smallest recovery that matches a documented symptom.
- Do not improvise a different workflow merely because it creates a prettier state.
- Do not edit scores, labels, result order, or plugin output.

Exit condition:

- The stop state and result contract are visibly satisfied.

### Phase 5 - Capture raw evidence

- Capture an untouched full-window image first.
- Preserve the active source, destination, menu, popover, or output required to prove the scene.
- Create a capture run from [[Plugins - screenshot capture run template]].
- Record the raw filename immediately.
- Apply no annotation, crop, CSS, JavaScript, generated treatment, or content-aware editing before the raw evidence exists.

Exit condition:

- A reviewer can audit the final derivative back to a real current UI state.

### Phase 6 - Pass truth gates

Every gate below is mandatory.

| Fatal gate | Pass condition |
|---|---|
| Real UI | The product surface and output came from the current plugin UI, not a mockup or generated reconstruction. |
| Correct ownership | The plugin, Core/Pro tier, and cross-plugin dependencies are accurately represented. |
| Current relationship | The visible output belongs to the active note, block, query, base, or selected context. |
| Unmodified product evidence | UI labels, scores, results, controls, and output were not invented or altered. |
| Claim/proof fit | The caption claims only what the still image or motion asset visibly proves. |
| No sensitive data | No private, licensed, secret, or user-identifying content is exposed. |
| Complete target UI | The target control, menu, popover, result, or output is not clipped, stale, obscured, or in an error state. |
| Provenance | The raw capture, environment, fixture, and scene are recorded in a capture run. |

A failed fatal gate cannot be compensated for by a high visual-quality score.

### Phase 7 - Produce derivatives

Follow [[Plugins - screenshot presentation guide]].

- Work only from a verified raw capture.
- Preserve the source raw file.
- Keep every derivative mapped to its source.
- Use generated imagery only outside the product UI and only where the derivative is plainly editorial.

Exit condition:

- The treatment amplifies already-valid evidence without changing its meaning.

### Phase 8 - Publish and map usage

- Use descriptive, stable public filenames.
- Add caption and alt text from the campaign brief.
- Record every publication location in the capture run and scene manifest.
- Review the rendered asset at its actual publication width.
- Mark the scene and run with the resulting status.

Exit condition:

- The public image, caption, alt text, and provenance all refer to the same demonstrated outcome.

## default documentation coverage

A plugin or major feature usually benefits from these evidence roles after its first-value scene is clear.

| Role | Evidence job | Typical visible elements |
|---|---|---|
| Default workflow | show current context and primary plugin output together | active note/file/block/query plus at least 3 useful results or generated items |
| Result anatomy | make one high-quality result inspectable | title, score/confidence when present, snippet/preview, source/path/metadata when useful |
| Action controls | show how output becomes workflow | refresh, preview, copy, insert, send, save, apply, filter, or rerank controls |
| Workflow payoff | show output becoming useful structure | inserted links, saved summary, updated Base/Canvas/Graph, copied context, or created actions |
| Optional advanced feature | show depth only after the core loop is understood | filters, inline rendering, Bases, templates, ranking, Graph handoff, or alternative modes |

These are coverage roles, not a mandatory five-image campaign.

Reuse verified scenes where possible rather than creating a second scene definition for the same invariant workflow.

## scene requirements

Every scene note must define:

- stable `scene_id`
- plugin and tier ownership
- eligible asset classes and publication restrictions
- user-visible outcome and belief
- truth contract
- profile and fixture prerequisites
- start state
- access actions
- stop state
- semantic or functional result contract
- must-show and must-not-show evidence
- minimum recovery paths
- variants
- verification record and revalidation triggers

Scene names describe the invariant workflow, not the demo note content.

Good:

```md
current note -> related notes
related result -> inserted note link
question -> meaning-ranked results
```

Avoid:

```md
How I build context screenshot
Information overload screenshot
purple sidebar screenshot
```

## semantic result contracts

Semantic output will vary with fixture wording, index state, model, and plugin version.

Therefore:

- require meaningful top-result membership rather than exact rank order
- define a bounded visible range such as `top 3`, `top 6`, or `visible results`
- require all visible results to support the scene's story
- use exact scores only as captured evidence, never as acceptance targets
- compare scores only within the same run and result list
- never type, reorder, or relabel results to satisfy a contract

Example:

```md
- At least 2 target notes appear in the top 3.
- At least 4 target notes appear in the visible top 8.
- No visible top-5 result is unrelated to the anchor.
- Scores are whatever the current product returns.
```

WHEN a contract fails THEN repair the fixture, index, or verified functional settings.

Do not repair a failed result contract with post-production.

## raw and public naming

### raw capture

```text
{scene_id}--{variant_id}--{run_id}--raw.png
```

Example:

```text
sc-current-note-related-notes--desktop-sources--2026-06-22T143000-0400--raw.png
```

### derivative

```text
{scene_id}--{variant_id}--{run_id}--{derivative_id}.{ext}
```

### public asset

Use the descriptive stable filename defined by the campaign brief.

Example:

```text
smart-connections-01-current-note-related-notes.png
```

Timestamp-oriented names are appropriate for raw evidence and internal archives.

They are not the canonical public filename.

## map of images

The scene manifest is the durable map of image intentions.

Each capture run is the durable map of produced files.

At minimum, record:

| Field | Purpose |
|---|---|
| `scene_id` and `variant_id` | what invariant workflow was captured |
| `run_id` | unique execution |
| raw path | source evidence |
| derivative paths | every published or candidate output |
| campaign/public filename | intended claim and ordering |
| publication locations | where the asset is used |
| current status | captured, approved, published, needs-review, retired |
| revalidation trigger | why the asset must be checked again |

## revalidation triggers

Mark a published scene `needs-review` when any of these changes:

- target UI label, layout, control, menu, or workflow
- plugin ownership or Core/Pro tier
- plugin or Obsidian behavior relevant to the proof
- fixture content, embedding model, or index method
- caption or marketing claim
- destination publication dimensions that may break readability
- a linked helper selector used by the derivative

Do not overwrite the prior raw capture.

Create a new run and retain the historical mapping.

## stop and escalate

Stop the capture run when:

- the current UI differs materially from the scene note
- tier ownership is uncertain
- the output appears stale or belongs to another anchor
- the required result can be achieved only by fabricating or editing product output
- a menu, popover, or target control cannot be fully shown
- sensitive data appears
- the scene is not `capture-ready`

Record the blocker in the scene note or capture run.

The scene author, not the capture operator, resolves product, fixture, or campaign ambiguity.

## linked operating notes

- [[Plugins - screenshot scene template]]
- [[Plugins - screenshot capture run template]]
- [[Plugins - screenshot presentation guide]]
- [[Plugins - screenshot capture helpers]]
- [[Plugins - screenshot production backlog]]
- [[Smart Connections - screenshot campaign]]
- [[Smart Connections - screenshot fixture]]
- [[Smart Connections - screenshot scene manifest]]
