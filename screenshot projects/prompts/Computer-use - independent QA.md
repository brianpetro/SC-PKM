---
state: ready
alignment:
  - "[[Computer-use - screenshot prompt library]]"
  - "[[Plugins - screenshots SOP]]"
record_type: prompt
project_id: smart-plugin-screenshots
prompt_id: screenshot-independent-qa
mode: REVIEW_CAPTURE
input_record_types:
  - capture_run
  - asset
output_record_types:
  - qa_run
  - capture_run
  - asset
  - content_kit
  - decision
allowed_write_roots:
  - screenshot projects/runs/qa
  - screenshot projects/records/assets
  - screenshot projects/records/content-kits
  - screenshot project record frontmatter
terminal_states:
  - approved
  - approved-with-restrictions
  - needs-recapture
  - needs-decision
---

# Computer-use - independent QA

## use when

- an official capture run produced unreviewed assets
- an archived real capture may be reusable
- a static or motion claim needs independent proof review
- a content kit must be approved before placement

## do not use when

- operating the plugin to repair the scene
- editing the image to make it pass
- deciding unresolved product ownership
- placing the asset in content

## required dispatch inputs

```yaml
project_id:
campaign_id:
scene_id:
scene_note:
campaign_note:
presentation_guide:
capture_run:
asset_records: []
target_publication_locations: []
target_render_widths: []
reviewer:
reviewer_independent: true
next_prompt: Computer-use - content placement
```

## computer-use prompt

<!-- PROMPT START -->

# MODE: REVIEW_CAPTURE

## objective

Independently decide which exact assets, claims, captions, and publication contexts are approved.

Do not operate the product UI to recreate or repair evidence.

Do not modify image pixels, crop, annotation, or motion.

## independence rule

Record:

```yaml
reviewer: "{{reviewer}}"
reviewer_independent: "{{reviewer_independent}}"
```

WHEN `reviewer_independent` is not true THEN:

- create the QA record
- set its disposition to `needs-decision`
- do not grant approval
- stop before scoring or creating a content kit

## authorities to read

1. `{{scene_note}}`
2. `{{campaign_note}}`
3. `{{presentation_guide}}`
4. `{{capture_run}}`
5. all `{{asset_records}}`
6. source raw assets and every derivative
7. current product-capability/tier decision records
8. `screenshot projects/Plugins - screenshots SOP.md`
9. this prompt note

WHEN product ownership sources conflict THEN use `needs-decision`.

Do not choose the most convenient interpretation.

## output record

Create:

```text
screenshot projects/runs/qa/{review_id}.md
```

Use frontmatter:

```yaml
record_type: qa_run
project_id: "{{project_id}}"
campaign_id: "{{campaign_id}}"
state: prepared
gate: independent-QA
review_id: "{{review_id}}"
capture_run: "[[{{capture_run}}]]"
scene_id: "{{scene_id}}"
reviewer: "{{reviewer}}"
reviewer_independent: "{{reviewer_independent}}"
asset_ids: []
fatal_gates_passed: false
quality_score:
target_width_results: []
disposition:
content_kit:
created_on: "{{current_date}}"
updated_on: "{{current_date}}"
```

Set `state: reviewing` when review begins.

Update only the reviewed asset records, source capture-run review fields, and an approved content-kit record.

## write boundary

You may write only:

- the QA review note
- asset approval fields and restrictions
- capture-run reviewer/review status fields
- a new or updated content-kit note
- scene approved-assets/content-kit operational fields
- blocker/decision records
- Base record status fields

You may not:

- modify product captures or derivatives
- create replacement crops
- operate the plugin to fill missing evidence
- change scene truth, campaign claims, or tier ownership
- alter raw hashes
- place content in a repository
- mark a placement published

## review sequence

### 1. Validate provenance

For each asset:

- file exists
- hash matches the asset record
- dimensions/duration match
- source raw mapping is complete
- raw evidence predates helpers and derivatives
- capture environment and fixture are recorded
- capture run is `captured`
- selected scene/variant matches the asset

A provenance failure is fatal.

### 2. Audit fatal truth gates

Evaluate each asset independently.

| Gate | Required evidence |
|---|---|
| Real current UI | raw capture and current run provenance |
| Correct ownership | plugin/tier UI plus authoritative current decision |
| Current relationship | active note, block, query, Base, or destination visibly causes the output |
| Unmodified evidence | derivative comparison with raw; no invented text, scores, items, or controls |
| Claim/proof fit | static claim describes visible state; motion claim describes observed transition |
| No sensitive data | full raw and derivative inspection |
| Complete target UI | no clipped, stale, covered, loading, or error state |
| Provenance | scene, fixture, run, raw, derivative, and hash chain complete |

Any failed fatal gate requires `needs-recapture` or `needs-decision`.

Do not offset a failed gate with a high visual score.

### 3. Review static and motion separately

For static assets:

- state only what is visible
- do not claim drag, hover, automatic update, handoff, or sort action unless the state itself is the claim

For motion assets:

- verify the recording begins from the required start state
- verify the real interaction is visible
- verify the final state stabilizes
- reject motion that hides a failed intermediate state through cuts

### 4. Review at destination size

For every `{{target_render_widths}}`:

- render or inspect at the exact width
- do not zoom to rescue readability
- verify titles, key evidence, and primary action remain legible
- record pass/fail by destination

WHEN an asset works for docs but not a plugin listing THEN approve only with that restriction.

### 5. Score quality

After fatal gates pass, score 0-2:

- first-glance clarity
- one job
- readability
- source/output relationship
- action or payoff clarity
- demo coherence
- caption proof fit
- publication suitability

Use the campaign threshold.

Record the first user belief communicated within three seconds.

Compare it with the scene's intended user belief.

A material mismatch fails the asset for that use.

### 6. Decide asset disposition

#### approved

Use when all gates pass, threshold passes, and no use restriction remains.

```yaml
approval_status: approved
approved_on: "{{current_date}}"
approval_restrictions: []
```

#### approved-with-restrictions

Use when all truth gates pass but publication suitability is bounded.

Examples:

- docs only
- motion only for interaction claim
- not eligible for Core-only listing
- eligible only above a minimum render width
- ecosystem page only

```yaml
approval_status: approved-with-restrictions
approval_restrictions:
  - ...
```

#### needs-recapture

Use for evidence, readability, composition, or interaction-proof defects that a new capture can solve.

Do not describe pixel edits as the remedy.

Write an exact recapture brief:

```md
- restore state:
- retain:
- remove:
- prove:
- target dimensions:
- required static/motion:
```

#### needs-decision

Use when approval depends on unresolved product ownership, tier, campaign claim, data boundary, or policy truth.

Create and link a decision record.

### 7. Create or update the content kit

Only for approved assets.

Create:

```text
screenshot projects/records/content-kits/{content_kit_id}.md
```

Frontmatter:

```yaml
record_type: content_kit
project_id: "{{project_id}}"
campaign_id: "{{campaign_id}}"
state: ready
gate: content-placement
content_kit_id: "{{content_kit_id}}"
scene_id: "{{scene_id}}"
plugin:
tier:
source_run: "[[{{capture_run}}]]"
approved_static: []
approved_motion: []
claim_static:
claim_motion:
caption_static:
caption_motion:
alt_text:
eligible_pages: []
ineligible_pages: []
next_prompt: "[[{{next_prompt}}]]"
last_verified: "{{current_date}}"
verified_build:
```

The body must include:

```md
## user belief
## approved static claim
## approved motion claim
## caption and alt text
## eligibility and restrictions
## approved assets
## Markdown README block
## HTML figure block
## long-form explanatory copy
## prohibited claims
## suggested placements
```

Do not broaden campaign claims.

### 8. Update records

Finalize the QA record with:

```yaml
state: "{{qa_terminal_state}}"
fatal_gates_passed: "{{fatal_gates_passed}}"
quality_score: "{{quality_score}}"
target_width_results:
  - ...
disposition: "{{asset_disposition}}"
content_kit:
updated_on: "{{current_date}}"
```

Update the source capture run:

```yaml
reviewer: "{{reviewer}}"
review_status:
quality_score:
```

Update the scene:

- add approved asset links
- link the content kit
- keep `captured` unless actual publication completes
- set `needs-review` only when the scene itself, not one asset attempt, is invalid

## terminal response

Report:

- review ID
- disposition per asset
- fatal-gate failures, if any
- quality score and target-width results
- approved claim restrictions
- content-kit path when created
- exact next prompt or recapture/decision blocker

Do not modify or place the assets.

<!-- PROMPT END -->
