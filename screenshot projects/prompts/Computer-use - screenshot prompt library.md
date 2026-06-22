---
state: ready
alignment:
  - "[[Plugins - screenshots SOP]]"
record_type: prompt
project_id: smart-plugin-screenshots
prompt_id: screenshot-prompt-library
mode: INDEX
input_record_types:
  - project
  - campaign
  - scene
  - fixture
  - capture_run
  - asset
  - content_kit
  - placement
output_record_types: []
allowed_write_roots: []
terminal_states:
  - ready
---

# Computer-use - screenshot prompt library

## WHY

Use one constrained computer-use mode for one lifecycle transition.

Do not send the entire screenshot project as an undifferentiated prompt.

A dispatch should combine:

```md
one input record
+ one operating prompt
+ only the linked source-of-truth notes
+ explicit write boundaries
+ explicit terminal states
```

## prompt selection

| Current gate | Prompt | Input record | Expected terminal state |
|---|---|---|---|
| fixture is absent, contaminated, or not deterministic | [[Computer-use - fixture reset]] | scene plus fixture | fixture run `passed`, `failed`, or `needs-review` |
| scene behavior or exact labels are unverified | [[Computer-use - scene verification]] | scene plus passed fixture run | scene `capture-ready`, `verified`, or `needs-review` |
| verified scene needs official evidence | [[Computer-use - official capture]] | capture-ready scene | capture run `captured` or `needs-review` |
| candidate asset needs approval | [[Computer-use - independent QA]] | asset plus source run | asset `approved`, restricted, recapture, or decision |
| approved evidence needs to create content value | [[Computer-use - content placement]] | approved content kit plus placement | placement `placed`, `published`, or `needs-review` |

## dispatch envelope

Every run begins with a filled envelope.

```yaml
project_id:
campaign_id:
prompt_id:
operator:
input_record:
input_record_path:
scene_id:
variant_id:
profile_id:
fixture_id:
fixture_version:
fixture_state:
source_run:
asset_ids: []
content_kit:
placement_id:
target_repository:
target_files: []
allowed_write_roots: []
```

Remove fields that do not apply.

Do not leave a required field as a guessed value.

## input-resolution precedence

1. Current Base record frontmatter.
2. Linked scene, fixture, campaign, run, asset, content-kit, and placement notes.
3. Canonical execution SOP.
4. Observed current UI behavior.

Observed UI behavior may identify a mismatch.

It may not silently rewrite product ownership, campaign claims, scene truth, or fixture meaning.

WHEN required inputs remain unresolved THEN create a blocker or decision record and stop that lifecycle transition.

## shared authority order

1. Real current product behavior and verified ownership.
2. Fatal truth gates in [[Plugins - screenshots SOP]].
3. Current verified scene and fixture.
4. Campaign claim and publication restrictions.
5. Presentation guide and optional helpers.
6. This prompt's operating procedure.

## shared non-negotiables

- Operate one scene, run, asset, or placement at a time.
- Confirm the correct vault and profile before changing state.
- Verify `screenshot projects/` is excluded from Smart Environment ingestion for screenshot profiles.
- Preserve real output; do not type, relabel, reorder, or retouch product evidence.
- Preserve raw evidence before helpers or derivatives.
- Write only inside the prompt's allowed roots.
- Do not modify plugin source code.
- Do not publish through a failed truth gate.
- Do not claim a transition from a static image.
- Record uncertainty and failure instead of fabricating completion.

## normalized output roots

```text
screenshot projects/
  runs/
    fixture/
    verification/
    capture/
    qa/
    placement/
  records/
    assets/
    content-kits/
    decisions/
    placements/
  outputs/
    {campaign_id}/
      {scene_id}/
        {run_id}/
          source/raw/
          source/motion/
          final/
          editable/
```

## run identifiers

Use local timestamp with timezone:

```text
YYYY-MM-DDTHHmmssZZ
```

Examples:

```text
2026-06-22T143000-0400
2026-06-22T183000+0000
```

### reset ID

```text
{fixture_id}--{profile_id}--{target_snapshot}--{timestamp}
```

### capture run ID

```text
{scene_id}--{variant_id}--{mode}--{timestamp}
```

### asset ID

```text
{run_id}--{asset_kind}--{sequence}
```

## state transitions

```md
fixture_run:
prepared -> resetting -> passed
                     -> failed
                     -> needs-review

scene:
draft -> verified -> capture-ready
                   -> needs-review

capture_run:
prepared -> verifying/capturing -> captured
                                -> failed
                                -> needs-review

qa_run:
prepared -> reviewing -> approved
                      -> approved-with-restrictions
                      -> needs-recapture
                      -> needs-decision

asset:
raw -> candidate -> approved
                 -> approved-with-restrictions
                 -> needs-recapture
                 -> needs-decision

placement:
proposed -> ready -> placed -> published
                         -> needs-review
```

Only independent QA may approve an asset.

Only an actual publication action may mark a placement `published`.

## completion rule

A prompt is complete only when:

- its output records exist
- every written file is linked from the output record
- the terminal state is explicit
- the next prompt or blocker is explicit
- no unsupported claim of success remains

## prompt notes

- [[Computer-use - fixture reset]]
- [[Computer-use - scene verification]]
- [[Computer-use - official capture]]
- [[Computer-use - independent QA]]
- [[Computer-use - content placement]]
