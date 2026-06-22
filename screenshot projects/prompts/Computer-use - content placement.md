---
state: ready
alignment:
  - "[[Computer-use - screenshot prompt library]]"
  - "[[Plugins - screenshots SOP]]"
record_type: prompt
project_id: smart-plugin-screenshots
prompt_id: screenshot-content-placement
mode: PLACE_APPROVED_ASSET
input_record_types:
  - content_kit
  - placement
output_record_types:
  - placement
allowed_write_roots:
  - explicitly dispatched target repository files
  - screenshot projects/runs/placement
  - screenshot projects/records/placements
terminal_states:
  - placed
  - published
  - needs-review
---

# Computer-use - content placement

## use when

- independent QA approved an exact asset and content kit
- a target repository, file, section, and public asset path are specified
- the goal is to turn evidence into plugin content

## do not use when

- the asset is unreviewed
- the claim or product ownership is unresolved
- no target file or section is specified
- the task is broad content strategy without an approved evidence package

## required dispatch inputs

```yaml
project_id:
campaign_id:
content_kit:
placement_id:
target_repository:
target_files: []
target_sections: []
target_surface:
public_asset_directory:
publish_now: false
operator:
```

## computer-use prompt

<!-- PROMPT START -->

# MODE: PLACE_APPROVED_ASSET

## objective

Place approved screenshot evidence into specified plugin content with exact claim/proof fit.

The approved content kit controls the asset, caption, alt text, eligibility, and prohibited claims.

## preconditions

Confirm:

- content-kit record exists
- content-kit state is `ready`
- every selected asset is `approved` or `approved-with-restrictions`
- target repository/file/section is explicit
- target use satisfies every approval restriction
- source asset exists and hash matches

WHEN any precondition fails THEN create or update the placement record with `state: needs-review` and stop before editing target content.

## authorities to read

1. `{{content_kit}}`
2. approved asset records
3. source capture-run and QA record
4. target files and surrounding sections
5. campaign note
6. canonical execution SOP
7. this prompt note

The target content cannot broaden the approved claim.

## output record

Create or update:

```text
screenshot projects/records/placements/{{placement_id}}.md
```

Frontmatter:

```yaml
record_type: placement
project_id: "{{project_id}}"
campaign_id: "{{campaign_id}}"
state: proposed
gate: content-placement
placement_id: "{{placement_id}}"
content_kit: "[[{{content_kit}}]]"
asset_id:
target_repository: "{{target_repository}}"
target_file:
target_section:
target_surface: "{{target_surface}}"
public_asset_path:
placed_on:
published_on:
verification_evidence: []
operator: "{{operator}}"
next_prompt:
created_on: "{{current_date}}"
updated_on: "{{current_date}}"
```

## write boundary

You may write only:

- explicitly dispatched target files
- explicitly dispatched public asset directory
- the placement record
- placement-run evidence
- asset publication-location fields
- content-kit placement list
- Base operational fields

You may not:

- change the approved image pixels
- select a different unapproved asset
- alter approved claims, captions, alt text, or restrictions
- change product/tier ownership
- rewrite unrelated content
- modify scene, fixture, run, or QA truth
- mark publication complete without actual publication evidence

## placement sequence

### 1. Inspect target context

For each target file:

- locate the exact target section
- read enough surrounding content to understand the user's question
- identify existing screenshot references and asset conventions
- verify whether static or motion evidence best fits
- confirm the placement does not introduce a plugin/tier contradiction
- confirm the target width satisfies approval restrictions

WHEN the specified section no longer exists THEN do not choose a distant substitute silently.

Record `needs-review` with the closest candidate anchors.

### 2. Select the approved block

Use the content kit's exact:

- asset
- public filename
- static or motion claim
- caption
- alt text
- eligibility
- prohibited claims
- README or HTML insertion pattern

Prefer:

```md
first-value evidence
-> workflow continuation
-> advanced/Pro evidence
-> configuration
```

Do not place advanced settings before the page establishes user value unless the target page is specifically procedural.

### 3. Copy or synchronize the asset

- Copy only the approved derivative to `{{public_asset_directory}}`.
- Preserve the approved public filename.
- Verify the copied hash matches the approved asset.
- Do not publish the raw source file unless the content kit explicitly approves it.
- Do not overwrite a different asset without recording what it supersedes.

### 4. Edit target content

Make the minimum coherent change.

The insertion must include:

- valid asset path
- approved alt text
- approved caption when the surface uses captions
- enough surrounding prose to make the visible relationship clear
- no claim beyond the evidence

Preserve the target file's current format, heading style, links, comments, and voice.

Do not add a redundant explanation when the screenshot and caption already prove the point.

### 5. Validate the integration

Check:

- target file parses
- asset path resolves
- image or motion loads
- alt text is present
- caption matches the selected asset kind
- target-width readability remains valid
- surrounding product/tier language is consistent
- no duplicate or stale screenshot remains in the same role
- no unrelated formatting changed

When a local preview/build is available, run it and preserve evidence.

### 6. Record the placement

Include in the placement note:

```md
## target context
## selected approved asset
## inserted content block
## surrounding-copy changes
## path and hash validation
## render/build validation
## superseded assets
## restrictions
## disposition
```

Set:

```yaml
state: placed
placed_on: "{{current_date}}"
updated_on: "{{current_date}}"
```

Update:

- asset publication locations
- content-kit placements
- target file/section
- public asset path

### 7. Publication state

WHEN `publish_now` is false or no actual deployment/publish action occurs THEN stop at:

```yaml
state: placed
```

WHEN the content is actually published and public/rendered evidence is preserved THEN set:

```yaml
state: published
published_on: "{{current_date}}"
verification_evidence:
  - ...
```

Do not equate a local file edit with publication.

### 8. Failure handling

Use `needs-review` when:

- target section is missing or semantically wrong
- approval restrictions conflict with the destination
- surrounding content makes an unsupported claim
- asset path or build cannot be validated
- a different asset is required
- ownership/tier language conflicts
- publication evidence is unavailable but `publish_now` was required

Do not repair these by loosening the approved claim.

## terminal response

Report:

- placement ID
- asset and content-kit IDs
- target files and sections changed
- public asset path
- validation result
- terminal state: placed, published, or needs-review
- blockers or next publication/revalidation action

<!-- PROMPT END -->
