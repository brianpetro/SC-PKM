---
state: next
alignment:
  - "[[Plugins - screenshots SOP]]"
record_type: specification
project_id: smart-plugin-screenshots
base_id: screenshot-projects
---

# Screenshot Projects - schema and views

## WHY

`Screenshot Projects.base` should expose the live state of screenshot production without duplicating project truth into manually maintained tables.

The Base is a view layer over Markdown record notes.

The records remain the source of truth.

## location

```text
Smart Vault/screenshot projects/Screenshot Projects.base
```

The Base includes Markdown records within:

```text
screenshot projects/
```

It excludes non-Markdown attachments from its dataset.

## operating contract

- One durable entity equals one Markdown record note.
- Frontmatter uses `snake_case`.
- Links between records use Obsidian links where practical.
- Assets have sidecar Markdown records because image files cannot hold the complete operational schema.
- The `.base` file contains filters, view definitions, display names, and simple formulas only.
- Complex or version-sensitive view presentation should be configured through the current Bases UI and then saved.
- The Base never replaces the canonical SOP, scene contract, fixture note, campaign brief, capture run, QA record, content kit, or placement record.

## record model

| `record_type` | One record represents | Primary identifier |
|---|---|---|
| `project` | a screenshot-production portfolio or plugin project | `project_id` |
| `campaign` | an ordered publication story | `campaign_id` |
| `scene` | one invariant product-evidence relationship | `scene_id` |
| `fixture` | a versioned demo corpus and profile contract | `fixture_id` |
| `fixture_run` | one reset/materialization execution | `reset_id` |
| `capture_run` | one verification or official capture execution | `run_id` |
| `qa_run` | one independent review execution | `review_id` |
| `asset` | one raw, motion, candidate, final, or editable file | `asset_id` |
| `content_kit` | approved claims and insertion blocks for one scene/run | `content_kit_id` |
| `placement` | one intended or completed use in content | `placement_id` |
| `decision` | one unresolved or resolved product/campaign question | `decision_id` |
| `prompt` | one reusable computer-use operating mode | `prompt_id` |
| `reference` | supporting policy, template, guide, or archive note | none |

## common schema

| Property | Type | Required | Meaning |
|---|---|---:|---|
| `record_type` | Text | yes for new records | entity type from the record model |
| `project_id` | Text | yes | owning screenshot project |
| `state` | Text | yes | current lifecycle status |
| `gate` | Text | active records | current operating gate |
| `priority` | Number | recommended | relative execution priority; higher means more important |
| `owner` | Text or Link | when assigned | accountable human or operating role |
| `campaign_id` | Text | when campaign-scoped | owning publication campaign |
| `review_id` | Text | QA records | independent review execution identifier |
| `plugin` | Text or List | when product-scoped | plugin or plugins represented |
| `tier` | Text or List | when product-scoped | Core, Pro, or mixed dependency boundary |
| `blocked_by` | List of Links | when blocked | decision or record preventing advancement |
| `next_prompt` | Link | when dispatchable | prompt note for the next computer-use action |
| `created_on` | Date | recommended | record creation date |
| `updated_on` | Date | recommended | last deliberate operational update |
| `last_verified` | Date | when verified | last evidence-based verification date |
| `verified_build` | Text | when verified | plugin/Obsidian build relevant to the record |
| `revalidate_after` | Date | published records | next review date when one is required |
| `revalidation_triggers` | List | verified/published records | product or content changes that invalidate approval |
| `notes` | Text | optional | short operational note; detailed evidence stays in the body |

## lifecycle vocabularies

### scenes

```text
draft
verified
capture-ready
captured
needs-review
published
retired
```

### fixture runs

```text
prepared
resetting
passed
failed
needs-review
```

### capture runs

```text
prepared
verifying
capturing
captured
failed
needs-review
```

### QA runs

```text
prepared
reviewing
approved
approved-with-restrictions
needs-recapture
needs-decision
```

### assets

Use `state` for production state:

```text
raw
candidate
final
published
retired
```

Use `approval_status` for review state:

```text
unreviewed
approved
approved-with-restrictions
needs-recapture
needs-decision
retired
```

### placements

```text
proposed
ready
placed
published
needs-review
retired
```

### decisions

```text
open
resolved
superseded
```

## record-specific schema

### project

| Property | Type | Required |
|---|---|---:|
| `project_id` | Text | yes |
| `active_campaign` | Link | recommended |
| `active_gate` | Text | recommended |
| `active_scene` | Link | recommended |
| `next_prompt` | Link | recommended |

### campaign

| Property | Type | Required |
|---|---|---:|
| `campaign_id` | Text | yes |
| `project_id` | Text | yes |
| `audience` | Text | yes |
| `publication_targets` | List | yes |
| `campaign_owner` | Text or Link | recommended |
| `scene_sequence` | List of Links | yes |

### scene

| Property | Type | Required |
|---|---|---:|
| `scene_id` | Text | yes |
| `campaign_id` | Text | when campaign-scoped |
| `surface` | Text | yes |
| `profile_id` | Text | yes |
| `fixture_id` | Text | yes |
| `fixture_state` | Text | yes |
| `variant_ids` | List | recommended |
| `required_static` | Checkbox | yes |
| `required_motion` | Checkbox | yes |
| `result_contract_status` | Text | after verification |
| `captured_variants` | List | after capture |
| `approved_assets` | List of Links | after QA |
| `content_kit` | Link | after QA |
| `publication_locations` | List | after placement |

### fixture

| Property | Type | Required |
|---|---|---:|
| `fixture_id` | Text | yes |
| `fixture_version` | Text | yes |
| `reference_demo_source` | Text | yes |
| `snapshot_ids` | List | yes |
| `ingestion_include` | List | yes |
| `ingestion_exclude` | List | yes |
| `checksum_manifest` | Link | when a reference source exists |
| `profile_ids` | List | yes |

### fixture run

| Property | Type | Required |
|---|---|---:|
| `reset_id` | Text | yes |
| `fixture_id` | Text | yes |
| `fixture_version` | Text | yes |
| `profile_id` | Text | yes |
| `target_snapshot` | Text | yes |
| `reset_strategy` | Text | yes |
| `ingestion_scope_verified` | Checkbox | yes |
| `inventory_verified` | Checkbox | yes |
| `index_state` | Text | yes |
| `evidence` | List of Links | yes |
| `next_prompt` | Link | when passed |

### capture run

| Property | Type | Required |
|---|---|---:|
| `run_id` | Text | yes |
| `run_mode` | Text | yes: `verification` or `official_capture` |
| `scene_id` | Text | yes |
| `variant_id` | Text | yes |
| `profile_id` | Text | yes |
| `fixture_id` | Text | yes |
| `fixture_state` | Text | yes |
| `fixture_reset` | Link | yes |
| `operator` | Text or Link | yes |
| `captured_on` | Date and time | when executed |
| `raw_assets` | List of Links | after capture |
| `truth_gates_passed` | Checkbox | after evaluation |
| `quality_score` | Number | after QA when applicable |
| `reviewer` | Text or Link | after QA |
| `review_status` | Text | after QA |

### QA run

| Property | Type | Required |
|---|---|---:|
| `review_id` | Text | yes |
| `capture_run` | Link | yes |
| `scene_id` | Text | yes |
| `reviewer` | Text or Link | yes |
| `reviewer_independent` | Checkbox | yes |
| `asset_ids` | List | yes |
| `fatal_gates_passed` | Checkbox | yes |
| `quality_score` | Number | after review |
| `target_width_results` | List | after review |
| `disposition` | Text | yes |
| `content_kit` | Link | when approved |

### asset

| Property | Type | Required |
|---|---|---:|
| `asset_id` | Text | yes |
| `scene_id` | Text | yes |
| `run_id` | Text | yes |
| `variant_id` | Text | yes |
| `asset_kind` | Text | yes |
| `asset_path` | Text or Link | yes |
| `source_asset` | Link | derivatives only |
| `public_filename` | Text | final assets |
| `sha256` | Text | yes |
| `pixel_dimensions` | Text | raster assets |
| `duration_seconds` | Number | motion assets |
| `claim` | Text | candidate/final assets |
| `caption` | Text | candidate/final assets |
| `alt_text` | Text | candidate/final assets |
| `approval_status` | Text | yes |
| `approval_restrictions` | List | when restricted |
| `approved_on` | Date | when approved |
| `preview_image` | Link | recommended for card view |
| `content_kit` | Link | after QA |
| `publication_locations` | List | after placement |

### content kit

| Property | Type | Required |
|---|---|---:|
| `content_kit_id` | Text | yes |
| `scene_id` | Text | yes |
| `source_run` | Link | yes |
| `approved_static` | List of Links | when available |
| `approved_motion` | List of Links | when available |
| `claim_static` | Text | when static approved |
| `claim_motion` | Text | when motion approved |
| `caption_static` | Text | when static approved |
| `caption_motion` | Text | when motion approved |
| `alt_text` | Text | yes |
| `eligible_pages` | List | yes |
| `ineligible_pages` | List | when constrained |
| `readme_block` | Text | recommended |
| `html_figure` | Text | recommended |
| `placements` | List of Links | after placement |

### placement

| Property | Type | Required |
|---|---|---:|
| `placement_id` | Text | yes |
| `content_kit` | Link | yes |
| `asset_id` | Text | yes |
| `target_repository` | Text | yes |
| `target_file` | Text | yes |
| `target_section` | Text | yes |
| `target_surface` | Text | yes |
| `public_asset_path` | Text | yes |
| `placed_on` | Date | when placed |
| `published_on` | Date | when published |
| `verification_evidence` | List of Links | after render review |

### decision

| Property | Type | Required |
|---|---|---:|
| `decision_id` | Text | yes |
| `question` | Text | yes |
| `decision_owner` | Text or Link | yes |
| `affects` | List of Links | yes |
| `resolution` | Text | when resolved |
| `resolved_on` | Date | when resolved |
| `supersedes` | Link | when applicable |

### prompt

| Property | Type | Required |
|---|---|---:|
| `prompt_id` | Text | yes |
| `mode` | Text | yes |
| `input_record_types` | List | yes |
| `output_record_types` | List | yes |
| `allowed_write_roots` | List | yes |
| `terminal_states` | List | yes |

## minimum frontmatter templates

### scene migration

```yaml
record_type: scene
project_id: smart-plugin-screenshots
campaign_id: smart-connections-primary-story
state: draft
gate: scene-verification
priority: 90
profile_id: sc-core-clean
required_static: true
required_motion: false
next_prompt: "[[Computer-use - scene verification]]"
blocked_by: []
```

Retain the scene's existing `scene_id`, `plugin`, `tier`, `surface`, `fixture`, `fixture_state`, verification fields, and revalidation triggers.

### fixture-run record

```yaml
record_type: fixture_run
project_id: smart-plugin-screenshots
campaign_id: smart-connections-primary-story
state: prepared
gate: fixture-reset
reset_id:
fixture_id:
fixture_version:
profile_id:
target_snapshot:
reset_strategy:
ingestion_scope_verified: false
inventory_verified: false
index_state:
evidence: []
next_prompt:
created_on:
updated_on:
```

### capture-run record

```yaml
record_type: capture_run
project_id: smart-plugin-screenshots
campaign_id:
state: prepared
gate:
run_id:
run_mode:
scene_id:
variant_id:
profile_id:
fixture_id:
fixture_state:
fixture_reset:
operator:
captured_on:
raw_assets: []
truth_gates_passed: false
quality_score:
reviewer:
review_status:
next_prompt:
```

### QA-run record

```yaml
record_type: qa_run
project_id: smart-plugin-screenshots
campaign_id:
state: prepared
gate: independent-QA
review_id:
capture_run:
scene_id:
reviewer:
reviewer_independent: true
asset_ids: []
fatal_gates_passed: false
quality_score:
target_width_results: []
disposition:
content_kit:
created_on:
updated_on:
```

### asset record

```yaml
record_type: asset
project_id: smart-plugin-screenshots
campaign_id:
state: raw
gate: independent-QA
asset_id:
scene_id:
run_id:
variant_id:
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
next_prompt: "[[Computer-use - independent QA]]"
```

### content-kit record

```yaml
record_type: content_kit
project_id: smart-plugin-screenshots
campaign_id:
state: ready
gate: content-placement
content_kit_id:
scene_id:
plugin:
tier:
source_run:
approved_static: []
approved_motion: []
claim_static:
claim_motion:
caption_static:
caption_motion:
alt_text:
eligible_pages: []
ineligible_pages: []
next_prompt: "[[Computer-use - content placement]]"
```

### placement record

```yaml
record_type: placement
project_id: smart-plugin-screenshots
campaign_id:
state: proposed
gate: content-placement
placement_id:
content_kit:
asset_id:
target_repository:
target_file:
target_section:
target_surface:
public_asset_path:
placed_on:
published_on:
verification_evidence: []
next_prompt: "[[Computer-use - content placement]]"
```

## view contract

The included `.base` file defines the views below using documented Bases YAML.

Apply the recommended sorts through the current Bases UI and save the Base. This lets Obsidian write any version-specific sort or layout settings.

| View | Shows | Primary action | Recommended group | Recommended sort |
|---|---|---|---|---|
| `Control - Active` | nonterminal scenes, runs, placements, and decisions | choose the one next dispatch | `gate` | `priority` descending, then `file.mtime` descending |
| `Projects - Campaigns` | project and campaign records | confirm portfolio ownership and active campaign | `state` | `priority` descending |
| `Demo Contracts` | demo contracts and current versions | inspect profile, snapshot, and ingestion contracts | `state` | `fixture_id`, then `fixture_version` |
| `Scenes - Pipeline` | all scene records | assess readiness and coverage | `state` | `priority` descending, then `scene_id` |
| `Ready - Dispatch` | records with a linked `next_prompt` that are not blocked | execute the next prompt | `gate` | `priority` descending |
| `Blocked - Needs Review` | blocked or `needs-review` records | resolve decision or repair contract | `state` | `priority` descending |
| `Demo State Resets` | reset executions | verify deterministic starting state | `profile_id` | `file.mtime` descending |
| `Capture Runs` | verification and official capture executions | inspect evidence and disposition | `state` | `captured_on` descending |
| `QA Runs` | independent review executions | inspect approval basis and restrictions | `state` | `file.mtime` descending |
| `Assets - Review Queue` | unreviewed or failed assets | dispatch independent QA or recapture | `approval_status` | `priority` descending, then `file.mtime` descending |
| `Assets - Approved` | approved assets | inspect reusable evidence | `plugin` | `approved_on` descending |
| `Content Kits - Ready` | approved claim/evidence packages | create placements for approved but unused evidence | `plugin` | `last_verified` descending |
| `Content - Placement Queue` | proposed, ready, or placed content uses | dispatch placement or publication review | `state` | `priority` descending |
| `Published - Revalidate` | published records whose revalidation date is due | verify current truth | `plugin` | `revalidate_after` ascending |
| `Decisions` | open and resolved decision records | resolve truth or campaign ambiguity | `state` | `priority` descending |
| `Prompt Library` | reusable computer-use prompts | open the correct mode | `mode` | `file.name` |

## view acceptance criteria

- The first view answers: `What record should advance next?`
- No view requires copying status into the Base file itself.
- A record appears because of its frontmatter, not because a filename was manually added to a table.
- Scene, run, asset, and placement states can be edited directly through table cells.
- Approved assets expose their source run and content kit.
- Placements expose approved-but-unused content kits.
- Published records expose their revalidation date.
- Open decisions remain visible until resolved or superseded.

## migration map for current project notes

| Current note type | Add |
|---|---|
| Smart Connections campaign | `record_type: campaign`, `project_id`, `gate`, `priority`, `next_prompt` |
| Smart Connections fixture | `record_type: fixture`, `project_id`, `reference_demo_source`, ingestion include/exclude, checksum manifest |
| Six scene notes | `record_type: scene`, `project_id`, `campaign_id`, `gate`, `priority`, `profile_id`, static/motion requirements, `next_prompt` |
| Prompt notes | metadata already supplied in the generated library |
| Capture-run template | retain as `record_type: reference` or template; instantiated runs use `capture_run` |
| Canonical SOP, presentation guide, helpers, backlog | `record_type: reference` when they should appear in inventory; otherwise leave unchanged |
| Archived project reviews | normalize individual reusable images into asset records; do not label archive prose as approved evidence |

## folder contract

```text
screenshot projects/
  Screenshot Projects.base
  Screenshot Projects - schema and views.md
  Smart Connections - screenshot fixture.md
  Smart Connections - screenshot fixture v2.1 draft.md
  capture_runs/
  prompts/
  scenes/
  usable/
  archive/
  tools/
```

Current image files are flattened into `usable/` and `archive/`.

Demo source notes and snapshot states live under `reference/Smart Connections Demo/`, not under `screenshot projects/`.

Historical `runs/` and `outputs/` records were archived and should not be recreated by default.

New capture-run records should use `capture_runs/`.

New image files should be sorted into `usable/` or `archive/` with provenance-bearing filenames.

Add new record folders only when a concrete Base view or workflow needs them.

## implementation notes

- Obsidian Bases reads note properties from Markdown frontmatter and stores view definitions in valid YAML `.base` files.
- Global filters apply to all views; view filters narrow individual views.
- The first view is the default view.
- Use `![[Screenshot Projects.base#View name]]` to embed a specific view inside a Smart Vault control note.
- Configure card image property, column widths, row heights, and view sorts through the current UI when the serialized key is not part of the stable documented syntax.
- After any UI configuration, inspect the resulting `.base` source before treating it as canonical.

## source references

- [Introduction to Bases](https://obsidian.md/help/bases)
- [Bases syntax](https://obsidian.md/help/bases/syntax)
- [Views](https://obsidian.md/help/bases/views)
- [Create a base](https://obsidian.md/help/bases/create-base)
