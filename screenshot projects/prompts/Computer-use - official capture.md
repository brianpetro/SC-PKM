---
state: ready
alignment:
  - "[[Computer-use - screenshot prompt library]]"
  - "[[Plugins - screenshots SOP]]"
record_type: prompt
project_id: smart-plugin-screenshots
prompt_id: screenshot-official-capture
mode: CAPTURE_SCENE
input_record_types:
  - scene
  - fixture_run
output_record_types:
  - capture_run
  - asset
allowed_write_roots:
  - screenshot projects/runs/capture
  - screenshot projects/records/assets
  - screenshot projects/outputs
  - dispatched isolated profile visual/workspace state
  - scene and manifest operational fields
terminal_states:
  - captured
  - failed
  - needs-review
---

# Computer-use - official capture

## use when

- the scene is `capture-ready`
- a passed fixture reset matches the verified environment
- a specific scene variant has been selected for official evidence

## do not use when

- the scene is still `draft` or merely `verified`
- product/tier ownership is unresolved
- fixture state has drifted
- the goal is only to review or place an existing asset

## required dispatch inputs

```yaml
project_id:
campaign_id:
scene_id:
scene_note:
scene_manifest:
campaign_note:
presentation_guide:
fixture_reset_record:
variant_id:
operator:
required_asset_kinds:
  - static
target_public_filename:
next_prompt: Computer-use - independent QA
```

## computer-use prompt

<!-- PROMPT START -->

# MODE: CAPTURE_SCENE

## objective

Produce official real-UI evidence for exactly one verified scene variant.

This run ends with captured assets.

It does not approve them for publication.

## preconditions

Confirm:

- scene frontmatter says `state: capture-ready`
- `{{variant_id}}` exists in the scene
- fixture-reset record is `passed`
- verification build and current build match in all relevant ways
- campaign eligibility includes this scene/variant
- static versus motion requirements are explicit

WHEN any precondition fails THEN create a capture-run record with `state: needs-review`, record the mismatch, and stop before official capture.

## authorities to read

1. `{{scene_note}}`
2. `{{scene_manifest}}`
3. `{{campaign_note}}`
4. `{{presentation_guide}}`
5. `{{fixture_reset_record}}`
6. the successful scene-verification run
7. `screenshot projects/Plugins - screenshots SOP.md`
8. this prompt note

## output roots

Create:

```text
screenshot projects/outputs/{{campaign_id}}/{{scene_id}}/{{run_id}}/
  source/raw/
  source/motion/
  final/
  editable/
```

Create the run note:

```text
screenshot projects/runs/capture/{run_id}.md
```

Create one sidecar record per produced asset:

```text
screenshot projects/records/assets/{asset_id}.md
```

## capture-run frontmatter

```yaml
record_type: capture_run
project_id: "{{project_id}}"
campaign_id: "{{campaign_id}}"
state: prepared
gate: official-capture
run_id: "{{run_id}}"
run_mode: official_capture
scene_id: "{{scene_id}}"
variant_id: "{{variant_id}}"
profile_id:
fixture_id:
fixture_state:
fixture_reset: "[[{{fixture_reset_record}}]]"
operator: "{{operator}}"
captured_on:
raw_assets: []
truth_gates_passed: false
review_status: unreviewed
next_prompt:
created_on: "{{current_date}}"
updated_on: "{{current_date}}"
```

Set `state: capturing` before UI operation.

## write boundary

You may write only:

- the capture-run note
- isolated profile visual/workspace settings required by the verified capture variant
- raw, motion, candidate, and editable files under this run root
- asset sidecar notes
- scene operational fields for captured variants and next prompt
- manifest operational status
- a blocker or decision record

You may not modify:

- product output, scores, ordering, labels, or controls
- scene truth/result contract
- campaign claims or eligibility
- fixture-controlled content
- canonical SOP
- plugin source
- prior runs or approved assets
- target content repositories

## execution

### 1. Reconfirm verified environment

Compare current state with the successful verification record.

Confirm:

- vault and profile
- plugin/tier state
- plugin and Obsidian builds
- fixture snapshot
- ingestion boundary
- index readiness
- functional settings
- target viewport/theme requirements from the campaign/presentation guide

A material difference requires a new scene verification.

### 2. Restore the exact start state

- Use the passed fixture reset.
- Confirm no side effects from a prior attempt remain.
- Close unrelated UI.
- Confirm the required anchor.
- Confirm the result contract before recording official evidence.

Do not tune or repair output during the official run.

### 3. Create untouched raw evidence first

Before any helper, crop, annotation, dimming, DOM mutation, or generated treatment:

- capture a full-window static provenance image
- capture additional full-window states required by the scene
- for an interaction scene, record motion from the verified initial state through the real action and stable final state
- preserve original recording/container files when possible

Use canonical raw naming:

```text
{scene_id}--{variant_id}--{run_id}--raw--NN.png
{scene_id}--{variant_id}--{run_id}--motion--NN.ext
```

Immediately create asset sidecar records with `state: raw` and `approval_status: unreviewed`.

### 4. Recheck truth before derivatives

Confirm that each raw candidate:

- came from the current real UI
- shows the correct ownership and tier
- belongs to the correct anchor
- contains unmodified product output
- supports only the intended static or motion claim
- exposes no sensitive data
- includes complete target UI
- maps to this run

WHEN a raw capture fails THEN preserve it as diagnostic evidence, mark it noncandidate, and repeat only from the verified start state.

### 5. Produce candidate derivatives

Only after valid raw evidence exists:

- follow the presentation guide
- create focused crops
- create required PNG/WebP or motion derivatives
- use annotation only where the campaign permits it
- preserve editable annotation source
- apply optional capture helpers only when already authorized and recorded
- map every derivative to one source raw asset

Do not alter product text, scores, item order, or UI controls.

Use the campaign's target public filename only for the candidate final derivative.

### 6. Create asset records

Each asset record must include:

```yaml
record_type: asset
project_id: "{{project_id}}"
campaign_id: "{{campaign_id}}"
state:
gate: independent-QA
asset_id:
scene_id: "{{scene_id}}"
run_id: "{{run_id}}"
variant_id: "{{variant_id}}"
asset_kind:
asset_path:
source_asset:
public_filename:
sha256:
pixel_dimensions:
duration_seconds:
claim:
caption:
alt_text:
approval_status: unreviewed
approval_restrictions: []
approved_on:
preview_image:
content_kit:
next_prompt: "[[{{next_prompt}}]]"
```

Calculate and record:

- SHA-256
- pixel dimensions
- duration for motion
- file size
- exact source mapping

### 7. Complete the capture run

Include:

```md
## environment
## verified-state comparison
## fixture and result-contract confirmation
## raw evidence
## motion evidence
## helper usage
## derivative map
## producer truth-gate check
## deviations
## disposition
## next dispatch
```

Set:

```yaml
state: captured
truth_gates_passed: true
review_status: unreviewed
next_prompt: "[[{{next_prompt}}]]"
```

`truth_gates_passed` here means the producer found no fatal defect.

Independent QA must still audit the asset.

Update the scene's `captured_variants`.

Set the scene itself to `captured` only when every required campaign variant has a successful official run.

Otherwise retain `capture-ready`.

### 8. Failure handling

Use `state: failed` when a repeatable operational action fails without a truth ambiguity.

Use `state: needs-review` when:

- current behavior differs from verification
- ownership/tier is uncertain
- fixture result contract drifts
- the required claim cannot be proven by the selected asset kind
- a helper changes product meaning
- safe provenance cannot be completed

Do not produce a final candidate from a failed run.

## terminal response

Report:

- run ID
- scene/variant
- terminal state
- raw and candidate asset IDs
- output root
- any motion/static restriction
- next prompt or blocker

Do not call the assets approved or published.

<!-- PROMPT END -->
