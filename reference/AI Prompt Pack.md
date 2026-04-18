---
WHAT: "A curated set of PKM prompts that use AI to structure, link, and scaffold drafts while keeping truth verification on you."
aliases:
- AI prompts for notes
- PKM AI prompts
tags:
- ai
- workflow
- templates
---

> [!summary]
> Use AI for structure, not for truth.

> [!When to use]
> When you want faster note structuring, link suggestions, or draft scaffolding.

### Prompt pack
# AI Prompt Pack (for PKM)

> [!summary]
> Use AI to create structure and suggestions, then verify before trusting.

## 1) Turn a highlight into an atomic note
Prompt:
"Turn this into one atomic note. Output:
- Title
- WHAT
- 5-bullet outline
- 1 example
- 1 failure mode + fix
Keep it in plain language."

## 2) Suggest links with relationships
Prompt:
"Given this note, suggest 3 links to existing concepts and write one relationship sentence for each (supports/contrasts/depends-on/example-of)."

## 3) Create a checklist from repeated mistakes
Prompt:
"Extract the recurring failure modes from this text and propose a 7-step checklist that prevents them."

## 4) Draft a short output from a cluster
Prompt:
"Using these notes, create a 6-section outline and write a 150-word draft. Include where each section is supported by which note title."

## Guardrail
Always run [[Verification Checklist]] before treating AI output as true.

### Failure mode and fix
Failure mode: You paste AI output into the vault and never verify it.

Fix: treat AI output as a draft. Verify, then edit into your words.

### Covers / Does not cover
- Covers: Common AI-assisted PKM tasks and prompts.
- Does not cover: Automated truth verification.

## Next action
- Use one prompt to create an atomic note draft, then verify and edit it into your own words.
