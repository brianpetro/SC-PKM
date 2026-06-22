---
state: ready
alignment:
  - "[[Computer-use - screenshot prompt library]]"
  - "[[Plugins - screenshots SOP]]"
record_type: prompt
project_id: smart-plugin-screenshots
prompt_id: screenshot-scene-verification
mode: VERIFY_SCENE
input_record_types:
  - scene
  - fixture_run
output_record_types:
  - capture_run
  - decision
allowed_write_roots:
  - screenshot projects/runs/verification
  - screenshot projects/outputs
  - scene and manifest operational fields
terminal_states:
  - capture-ready
  - verified
  - needs-review
---

# Computer-use - scene verification

## use when

- a scene is `draft` or requires revalidation
- a passed fixture reset exists
- exact current UI labels or access behavior are not yet evidenced
- the result contract must be tested before official capture

## do not use when

- creating final publication assets
- changing campaign claims
- approving an asset
- rewriting a scene to match unexpected behavior without review

## required dispatch inputs

```yaml
project_id:
campaign_id:
scene_id:
scene_note:
scene_manifest:
fixture_note:
fixture_reset_record:
variant_id:
operator:
next_prompt: Computer-use - official capture
```

## computer-use prompt

<!-- PROMPT START -->

# MODE: VERIFY_SCENE

## objective

Verify one scene against the current real Obsidian and plugin UI.

Determine whether the scene is:

```text
capture-ready
verified but not capture-ready
needs-review
```

This run may produce untouched test evidence.

It may not produce or approve final publication assets.

## authorities to read

1. `{{scene_note}}`
2. the matching row in `{{scene_manifest}}`
3. `{{fixture_note}}`
4. `{{fixture_reset_record}}`
5. the current campaign note for eligibility and claim boundaries
6. `screenshot projects/Plugins - screenshots SOP.md`
7. this prompt note

Confirm the fixture-reset record is `passed`.

WHEN it is not `passed` THEN stop and set the next dispatch to fixture reset.

## required output record

Create:

```text
screenshot projects/runs/verification/{run_id}.md
```

Use the current capture-run template plus:

```yaml
record_type: capture_run
project_id: "{{project_id}}"
campaign_id: "{{campaign_id}}"
state: prepared
gate: scene-verification
run_id: "{{run_id}}"
run_mode: verification
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
review_status:
next_prompt:
created_on: "{{current_date}}"
updated_on: "{{current_date}}"
```

Set `state: verifying` when UI operation begins.

## write boundary

You may write only:

- the verification run note
- untouched test evidence under the run output folder
- exact observed labels and verification history in the scene note
- scene frontmatter fields: `state`, `verified_on`, `verified_build`, `result_contract_status`, `next_prompt`, `blocked_by`, `updated_on`
- the matching manifest status/next-gate cell
- blocker or decision records when needed

You may not modify:

- scene outcome, user belief, truth contract, result contract, ownership, tier, or publication eligibility
- fixture prose or fixture-controlled content
- campaign claims or sequence
- the canonical SOP
- plugin source
- final/public assets
- target website content

WHEN a material scene correction is required THEN record a recommended replacement in the verification run and mark the scene `needs-review`.

Do not silently apply it.

## execution

### 1. Verify environment equivalence

Compare the current environment with the passed fixture reset:

- vault
- profile
- plugin set
- plugin versions/builds
- tier/license state
- fixture version and snapshot
- embedding/index state
- ingestion include/exclude scope
- functional settings

WHEN a relevant value differs THEN stop and dispatch fixture reset or a new verification run.

### 2. Create provenance evidence

Before invoking the feature, preserve diagnostic evidence sufficient to prove:

- current Obsidian environment
- current plugin/tier ownership
- active fixture
- relevant index readiness

Diagnostic evidence is not a publication candidate.

### 3. Reach the scene start state

- Restore the exact start state specified by the scene.
- Close unrelated menus, dialogs, previews, and stale surfaces.
- Confirm no prior scene side effects remain.
- Confirm the active note, block, query, Base, or context is the required anchor.

Do not repair fixture content during verification.

### 4. Follow the scene access actions

- Execute each action in order.
- Record the exact current command, ribbon, menu, settings, header, icon, selector, and action labels observed.
- Use only documented minimum recoveries from the scene.
- Do not improvise a different workflow because it is easier or prettier.
- Do not apply formatting helpers, CSS, JavaScript, crops, annotation, or generated treatment.

WHEN the current UI materially differs from the scene instructions THEN:

- preserve full-window evidence
- record the first divergent step
- stop forcing the expected workflow
- continue only when the difference is label-only and does not change product meaning

### 5. Evaluate the stop state

Confirm every required visible or directly evidenced element.

Reject the stop state when:

- output belongs to a prior anchor
- a target control or popover is clipped
- loading/error/notice state remains
- Core/Pro ownership is ambiguous
- the visible relationship cannot support the scene's claim
- a transition is required but only a final static state was observed

### 6. Evaluate the result contract

Record:

- visible result titles/items
- bounded ranks required by the contract
- negative-control presence or absence
- exact real scores when useful
- whether semantic or functional membership conditions passed
- whether any result was manually affected

Never reorder, type, pin, hide, filter, or relabel output solely to pass the contract.

Use the fixture's documented recovery only.

### 7. Preserve untouched test evidence

Capture:

- at least one full-window test image of the valid stop state
- before/after or motion test evidence when the scene's interaction requires it
- any diagnostic image required to explain failure

Name verification evidence:

```text
{scene_id}--{variant_id}--{run_id}--verification--NN.png
```

or the corresponding motion extension.

Link every file from the run note.

### 8. Evaluate fatal truth gates

Mark each gate independently:

- real current UI
- correct ownership
- current source/output relationship
- unmodified product evidence
- claim/proof fit
- no sensitive data
- complete target UI
- complete provenance

One failed fatal gate prevents `capture-ready`.

### 9. Determine disposition

#### capture-ready

Use only when:

- current behavior and ownership match
- start and stop states are reproducible
- result contract passes
- required static/motion proof is achievable
- test evidence passes all fatal gates
- no unresolved deviation remains

Update the scene:

```yaml
state: capture-ready
verified_on: "{{current_date}}"
verified_build: "{{observed_build}}"
result_contract_status: passed
next_prompt: "[[{{next_prompt}}]]"
blocked_by: []
```

Set the run:

```yaml
state: captured
truth_gates_passed: true
review_status: verification-passed
next_prompt: "[[{{next_prompt}}]]"
```

#### verified

Use when feature behavior and ownership are confirmed, but the scene is not ready for official capture because:

- result contract fails
- fixture reset is insufficient
- required static/motion proof cannot yet be composed truthfully
- a recoverable scene instruction remains incomplete

Update:

```yaml
state: verified
result_contract_status: failed
next_prompt:
```

Link the specific next repair.

#### needs-review

Use when:

- ownership or tier is unclear
- current behavior materially contradicts the scene
- a truth gate fails
- the required correction changes scene meaning or campaign eligibility

Create a decision or blocker record and link it in `blocked_by`.

### 10. Complete the verification record

Include:

```md
## environment equivalence
## observed current labels
## action log
## stop-state evidence
## result-contract evidence
## fatal truth gates
## deviations
## recommended scene corrections
## disposition
## next dispatch
```

Do not score visual polish in this run.

## terminal response

Report:

- run ID
- scene and variant
- disposition
- exact observed labels
- result-contract result
- truth-gate result
- evidence record path
- blocker or next prompt

Do not describe a scene as capture-ready unless the record was updated accordingly.

<!-- PROMPT END -->
