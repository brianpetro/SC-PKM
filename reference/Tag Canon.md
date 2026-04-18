---
WHAT: "The official tag taxonomy for this vault: when to tag, which"
aliases:
- Tags
- Tag Taxonomy
- Tags and Links
tags:
- tags
- metadata
- organization
- standards
- linking
- connectivity
---

> [!summary]
> The official tag taxonomy for this vault: when to tag, which tags to use, and how.

> [!When to use]
> If tags keep multiplying and search stops working, this note gives you a small canonical tag set and rules, without turning tagging into policing.
> If you are unsure when to tag and when to link, this note gives simple rules that keep the vault navigable, without drowning in metadata.

### Roles of tags vs links and when to use each
- grouping (topics, categories),
- queues (review, draft, inbox),
- status flags.

### What tags are for vs not for (grouping vs relationships)
- Use a link sentence like "This supports [[Focus on Relevance]] because ____" to represent a relationship.
- Buckets: "all notes about X"
- Queues: "notes to review" or "notes to process"

### Canonical tag naming rules
- lowercase
- kebab-case (use hyphens, not spaces)
- prefer nouns (review, decisions) over adjectives (useful, interesting)

### Tag schema rules (small, consistent, meaningful)
- Keep tags few (0-4 per note).
- Prefer stable nouns (review, source, decision) over vague adjectives (interesting, important).
- Do not create a tag for a one-off note. Wait until you have 5+ notes that need it.

### Default tag patterns for this vault
- Workflow queues: inbox, review, draft (use sparingly and consistently).
- Durable topics/domains: prefer links and MOCs first; use tags only when they improve retrieval.
- Status tags: only if you can query them and they reduce friction.

### Examples of high-signal tags and link sentences
- "[[Processing and Organizing Notes]] depends on [[Capturing Information]] being a single trusted capture point."
- workflows (inbox, review, draft),
- roles (writer, project-manager),

### Linking rules (contextual, relationship-aware)
- Instead of "See also: [[Focus on Relevance]]", write: "This filter supports [[Focus on Relevance]] by preventing low-value capture."
- Link inline where the relationship is expressed.
- Add a short relationship sentence for important links.

### Adding or deprecating tags safely
- Safe add process: 1) Create the tag in this Tag Canon first.
- 2) Apply it to 5+ notes where it clearly improves retrieval.
- 3) Add at least one saved search or MOC link that uses it.

### Maintenance routines to prevent tag bloat
- Treating maintenance as a cleanup marathon. Fix: do small consolidation during reviews.
- Weekly: consolidate any new tags that are synonyms.
- Monthly: remove tags used once or twice unless they are truly necessary.

### Tag review and saved-search pairing
- Adding tags with no retrieval plan. If you never query it, it is probably not worth tagging.
- Every recurring tag should have a quick way to surface the notes.
- Examples (adapt to your tool): tag:#inbox tag:#review If you use metadata fields, build queries that combine tags with fields (date, status, project).

### Complete canonical tag list
- `academia`
- `actionable`
- `actions`


## Next action
Audit 10 recent notes: keep only canonical tags and update [[Tag Canon]] if a new tag is truly necessary.
