---
WHAT: "The minimum milestone path that creates 3 compounding artifacts: durable links, reusable context, and closed-loop threads."
aliases: [Smart Plugins milestones, Smart Ecosystem milestones, Smart Plugins quickstart]
tags: [workflow, smart-tools]
---

> [!summary]
> This path is designed to create stickiness fast by producing 3 artifacts you will miss if you stop using the system: durable links, reusable context, and closed-loop threads.

> [!tip] When to use
> Right after install, after changing Smart Environment settings, or anytime Connections/Lookup feel empty or random.

## What you are building (the 3 artifacts)
1. Durable links in real notes (compounds retrieval)
2. Reusable context packs (kills re-explaining)
3. Closed-loop threads (kills tab chaos)

> [!warning] Fast fix map
> - Connections/Lookup are empty -> embeddings are not ready or scope is wrong: see [Smart Environment settings](https://smartconnections.app/smart-environment/settings/)
> - Results feel random/noisy -> adjust granularity/filters: see [Connections settings](https://smartconnections.app/smart-connections/settings/)
> - You want query-first semantic search -> use [Smart Lookup](https://smartconnections.app/smart-connections/lookup/)

## Milestones

### 1) Embeddings are ready (signal exists)

- [ ] DO: Confirm Smart Environment is indexing what you care about and embeddings have completed.
	- Reference: [Smart Environment settings](https://smartconnections.app/smart-environment/settings/)
- Success looks like: Connections and Lookup return relevant items for your anchor note (not blank).
- Output artifact: the semantic layer exists (everything downstream can have signal).

### 2) Open the Connections view (make the core loop visible)

- [ ] DO: Open the Connections view and keep it visible while you switch notes.
	- Quick path: [Getting started with Smart Connections](https://smartconnections.app/smart-connections/getting-started/)
	- Actions + workflows: [Exploring the Connections view](https://smartconnections.app/smart-connections/list-feature/)
- Success looks like: the ranked list updates when you change notes (unless paused).
- Output artifact: the "scan -> confirm -> act" surface is now part of your writing flow.

### 3) Trust check (preview before you link)

- [ ] DO: Preview 1-2 top results and confirm relevance before you commit.
* Success looks like: you can explain "why this is related" in one sentence.
* If stuck: results feel random -> switch Sources vs Blocks and tune filters/limits in [Connections settings](https://smartconnections.app/smart-connections/settings/).
	* start with Sources, switch to Blocks when you need precision
* Output artifact: trust in results (prevents junk-linking).

### 4) First durable link (the compounding moment)

* [ ] DO: Drag 1 connection result into your anchor note to create a real Obsidian link.
	- Put it under `## Related` so reopening the note gives instant re-entry.
	- Reference: [Exploring the Connections view](https://smartconnections.app/smart-connections/list-feature/)
- Success looks like: reopening the anchor note makes the next step obvious (no searching).
- Output artifact: at least one note now has a durable link trail.

> [!tip] The minimum "act" loop (repeatable)
> Scan -> preview -> drag 1 link -> hide noise -> pin 1 essential.
> This is how the system starts paying you back.

### 5) Save a reusable context pack (kills re-explaining)

Pick one path. All three produce the same artifact: a context bundle you can reuse.

**Path A: Discovery -> pack (highest leverage)**

- [ ] DO: From Connections, send the best results into Smart Context, prune noise, then save as a named context.
- Reference: [Smart Context Builder](https://smartconnections.app/smart-context/builder/)

**Path B: You already know what matters**

- [ ] DO: Use the Builder to select 1 anchor + 2-5 supporting items (use blocks for precision), then name and save it.
- Reference: [Smart Context Builder](https://smartconnections.app/smart-context/builder/)

**Path C: Your project lives in a folder**

- [ ] DO: Copy folder contents or multi-select notes from the file explorer to export a clean bundle fast.
- References: [Smart Context file nav actions](https://smartconnections.app/smart-context/file-nav-actions/) and [Smart Context Clipboard](https://smartconnections.app/smart-context/clipboard/)

Success looks like:

- you can re-apply the same context next time without rebuilding, or
- you can export the same bundle predictably without manual trimming

Output artifact: one reusable context pack.

> [!tip] Naming that stays clean
>
> - `<Project Name> - Working Set`
> - `<Project or Topic> - Constraints`
> - `<Series Name> - Meeting`

### 6) Start a note-anchored chat thread (thread becomes an artifact)

- [ ] DO: In the same anchor note, start a Smart Chat thread using your context pack (or pasted clipboard export).
- References: [Smart Chat](https://smartconnections.app/smart-chat/) and [Smart Chat codeblock workflow](https://smartconnections.app/smart-chat/codeblock/)
- Success looks like: the thread is attached to the note so you can resume without hunting browser tabs.
- Output artifact: one chat thread anchored to the work it references.

### 7) Close one loop (prevent AI debt)

- [ ] DO: When the work item is complete, mark the thread done.
- Reference: [Smart Chat codeblock workflow](https://smartconnections.app/smart-chat/codeblock/)
- Success looks like: you can scan notes and instantly tell what is open vs closed.
- Output artifact: one closed loop (threads do not accumulate silently).

## Definition of done (measurable)

- Your anchor note contains at least 1 durable link under `## Related`
- You have 1 named context pack you will reuse
- You have 1 Smart Chat thread marked done inside the anchor note

## Optional upgrades (only after Milestones 1-4 feel good)

- Inline, in-editor discovery: [Inline connections](https://smartconnections.app/smart-connections/inline/)
- Query-first discovery: [Smart Lookup](https://smartconnections.app/smart-connections/lookup/)
- Turn relevance into prioritization tables: [Connections in Bases](https://smartconnections.app/smart-connections/bases/)
- Keep top connections visible while drafting: see Footer section in [Exploring the Connections view](https://smartconnections.app/smart-connections/list-feature/)

> [!note]- Ref
> ![[plugins-milestones-2025-12-30.png]]

Covers: the minimum onboarding path across Smart Environment, Smart Connections, Smart Context, and Smart Chat.
Does not cover: advanced ranking algorithms, multi-provider routing, or deep Pro configuration.

## Next action

- Open a note you care about and drag 1 Connections result into `## Related`.
