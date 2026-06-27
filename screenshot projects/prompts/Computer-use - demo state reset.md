---
state: ready
alignment:
  - "[[Computer-use - screenshot prompt library]]"
  - "[[Plugins - screenshots SOP]]"
record_type: prompt
project_id: smart-plugin-screenshots
prompt_id: screenshot-demo-state-reset
mode: DEMO_STATE_RESET
input_record_types:
  - scene
  - fixture
output_record_types:
  - fixture_run
  - decision
allowed_write_roots:
  - screenshot projects/capture_runs
  - demo paths supplied by dispatch
  - dispatched isolated Obsidian profile configuration
  - screenshot project record frontmatter
terminal_states:
  - passed
  - failed
  - needs-review
---

# Computer-use - demo state reset

## use when

- a scene requires a named demo snapshot
- the demo source may have drifted
- the profile or ingestion boundary is unverified
- an official verification or capture needs a deterministic start

## do not use when

- deciding what the fixture should mean
- changing a result contract
- improving weak semantic output by manipulating unrelated notes
- repairing product behavior
- producing publication assets

## required dispatch inputs

```yaml
project_id:
campaign_id:
scene_id:
scene_note:
fixture_note:
fixture_id:
fixture_version:
profile_id:
target_snapshot:
reset_strategy: restore
allow_materialize_from_fixture_spec: false
operator:
allowed_demo_paths:
next_prompt: Computer-use - scene verification
```

`reset_strategy` must be one of:

```text
restore
materialize
validate-only
```

## computer-use prompt

Copy from `PROMPT START` through `PROMPT END`.

<!-- PROMPT START -->

# MODE: DEMO_STATE_RESET

## objective

Restore or validate one exact screenshot demo state and profile so the linked scene can be verified without semantic contamination or hidden tier leakage.

This run does not verify the scene and does not produce publication assets.

## authorities to read

Read only the materials needed for this reset:

1. `{{scene_note}}`
2. `{{fixture_note}}`
3. `screenshot projects/Plugins - screenshots SOP.md`
4. `screenshot projects/Screenshot Projects - schema and views.md`
5. this prompt note

Extract:

- reference demo source location
- exact inventory
- target snapshot invariants
- profile plugin/tier contract
- functional settings
- ingestion include/exclude scope
- expected index readiness
- any checksum or snapshot artifact already present

## required output record

Create before changing the demo state:

```text
screenshot projects/capture_runs/demo-state-reset--{reset_id}.md
```

Use frontmatter:

```yaml
record_type: fixture_run
project_id: "{{project_id}}"
campaign_id: "{{campaign_id}}"
state: prepared
gate: demo-state-reset
reset_id: "{{reset_id}}"
scene_id: "{{scene_id}}"
fixture_id: "{{fixture_id}}"
fixture_version: "{{fixture_version}}"
profile_id: "{{profile_id}}"
target_snapshot: "{{target_snapshot}}"
reset_strategy: "{{reset_strategy}}"
operator: "{{operator}}"
ingestion_scope_verified: false
inventory_verified: false
index_state:
evidence: []
next_prompt:
created_on: "{{current_date}}"
updated_on: "{{current_date}}"
```

Immediately change `state` to `resetting` when execution begins.

## write boundary

You may write only:

- `{{allowed_demo_paths}}`
- isolated profile settings required by the dispatched fixture/profile contract
- the new fixture-run record
- evidence attachments linked from that record
- frontmatter fields in the linked fixture or scene record that only report observed reset state
- Base-record status fields required to expose this run

You may not modify:

- the canonical execution SOP
- campaign claims or sequence
- scene outcome, truth contract, result contract, or publication eligibility
- plugin source code
- content outside the dispatched demo paths
- prior raw evidence or approved assets
- archived project notes
- target website content

## execution

### 1. Confirm vault and profile identity

- Confirm the open vault is the dispatched demo environment.
- Confirm the active profile is `{{profile_id}}`.
- Record Obsidian version, operating system, enabled plugins, plugin builds, and Core/Pro/license state.
- Compare the enabled plugin set with the fixture profile matrix.
- Disable only plugins explicitly prohibited by the dispatched profile.
- Do not hide tier indicators as a substitute for the correct profile.

WHEN profile ownership cannot be made truthful without changing product licensing or source code THEN mark the run `needs-review` and stop.

### 2. Verify the ingestion boundary before indexing

- Open the current Smart Environment ingestion/index scope.
- Verify `screenshot projects/` and its subfolders are excluded.
- Verify raw assets, outputs, runs, archives, prompts, campaigns, scenes, and control notes cannot enter the semantic dataset.
- Verify the intended demo corpus is included.
- Record the exact include/exclude values and current UI labels in the fixture-run note.
- Preserve diagnostic evidence showing the boundary.

WHEN project notes cannot be excluded from ingestion in this profile THEN mark the run `needs-review` and stop.

Do not use Connections result filters as a substitute for ingestion isolation.

### 3. Preserve pre-reset state

Record:

- current demo inventory
- current snapshot indicators
- current file hashes when a checksum manifest exists
- uncommitted or unexpected demo-source changes
- current index state

Do not overwrite unexpected user-authored material.

WHEN content exists inside the dispatched demo paths but is not part of the named demo state and cannot be safely isolated THEN mark the run `needs-review`.

### 4. Apply the dispatched reset strategy

#### restore

- Locate the reference copy for `{{target_snapshot}}`.
- Restore it exactly into the dispatched demo paths.
- Do not reconstruct missing files from memory.

WHEN the snapshot artifact is unavailable:

- if `allow_materialize_from_fixture_spec` is false, mark the run `failed`, create a blocker describing the missing artifact, and stop
- if `allow_materialize_from_fixture_spec` is true, execute the `materialize` procedure below and record the actual strategy as `materialize-from-spec`

#### materialize

This strategy is allowed only when `allow_materialize_from_fixture_spec` is true.

- Create the demo state only from the canonical fixture note.
- Preserve exact paths, titles, prose, Base invariants, and negative controls.
- Create a checksum manifest for all demo-controlled files.
- Record that this is the first materialization of the snapshot.
- Do not add content merely to force desired rankings.

#### validate-only

- Do not change demo content.
- Compare existing files and settings with the snapshot contract.
- Continue only if every invariant already passes.

### 5. Restore functional profile state

Restore only settings required by the demo state and linked scene, including when applicable:

- result type
- result limit
- sidebar location
- block embedding availability
- inline enablement and verified threshold
- Footer enablement
- Base starting state
- companion-plugin enablement

Record exact observed settings labels and values.

Do not tune semantic algorithms, feedback, filters, or ranking unless the canonical contract explicitly requires them.

### 6. Rebuild or refresh the index

- Use the minimum current product action that makes the restored demo state current.
- Wait until the product reports a complete, stable index state.
- Record source/block counts and any model/config relevant to the scene.
- Confirm excluded project records are absent from the indexed dataset when the UI exposes that evidence.
- Preserve diagnostic evidence.

Do not declare readiness while progress, errors, or stale-state warnings remain.

### 7. Validate snapshot invariants

Check every invariant specified for `{{target_snapshot}}`.

At minimum:

- exact controlled file inventory
- expected anchor state
- expected Base state
- negative controls present
- prohibited links or generated columns absent
- no duplicate-titled demo files
- no screenshot-project records inside the indexed corpus
- all required files indexed
- checksum manifest matches when one exists

Do not execute the scene result contract in this reset mode beyond a basic readiness check.

### 8. Finalize the reset record

Set:

```yaml
ingestion_scope_verified: true
inventory_verified: true
index_state: complete
state: passed
next_prompt: "[[{{next_prompt}}]]"
updated_on: "{{current_date}}"
```

Link all evidence.

Include sections:

```md
## environment
## ingestion boundary
## pre-reset state
## reset actions
## inventory and checksum result
## index readiness
## deviations
## disposition
## next dispatch
```

WHEN any mandatory invariant fails after the documented minimum recovery THEN use:

```yaml
state: failed
```

WHEN truth, ownership, or safe-write scope is ambiguous THEN use:

```yaml
state: needs-review
```

Never use `passed` with unresolved deviations.

## terminal response

Report only:

- reset ID
- terminal state
- demo state/profile/snapshot
- evidence record path
- blockers or deviations
- exact next prompt when passed

Do not claim that the scene itself is verified.

<!-- PROMPT END -->

## success output

```md
demo state reset `passed`
-> scene remains `draft` or `verified`
-> next prompt is scene verification
```

## failure output

```md
demo state reset `failed` or `needs-review`
-> blocker/decision linked
-> no scene verification or official capture begins
```
