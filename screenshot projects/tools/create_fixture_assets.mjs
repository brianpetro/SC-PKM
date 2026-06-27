import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

const workspace_root = process.cwd();
const fixture_root = path.join(workspace_root, "Smart Connections Demo");
const snapshot_root = path.join(
  workspace_root,
  "screenshot projects",
  "fixtures",
  "snapshots",
  "smart-connections-demo-v2"
);
const fixtures_root = path.join(workspace_root, "screenshot projects", "fixtures");

const snapshot_ids = [
  "v2-base-unlinked",
  "v2-post-link",
  "v2-bases-unscored",
  "v2-bases-scored"
];

const profile_records = {
  "sc-core-clean.md": `---
record_type: profile_contract
profile_id: sc-core-clean
fixture_id: smart-connections-demo-v2
state: target-contract
verified: false
created_on: 2026-06-23
updated_on: 2026-06-23
---

# sc-core-clean

## purpose

AG1 Smart Connections Core evidence without Pro, Smart Lookup, Smart Context, Smart Graph, project-record, or full-vault leakage.

## enabled plugins

- Smart Environment
- Smart Connections Core

## disabled or absent plugins

- Connections Pro
- Smart Lookup
- Smart Context
- Smart Graph

## required state

- tier label must not imply a Pro-only capture
- source/index scope includes only the restored \`Smart Connections Demo/\` fixture corpus
- \`screenshot projects/\`, \`outputs/\`, \`runs/\`, \`archive/\`, \`reference/\`, and \`demos/\` are excluded from semantic indexing
- Connections result type: Sources
- Current-note Connections and Footer Connections available where required by scene
- index state complete and stable before capture

## verification note

This is a profile contract. It is not proof that the current Obsidian session is in this profile.
`,
  "sc-pro-clean.md": `---
record_type: profile_contract
profile_id: sc-pro-clean
fixture_id: smart-connections-demo-v2
state: target-contract
verified: false
created_on: 2026-06-23
updated_on: 2026-06-23
---

# sc-pro-clean

## purpose

AG3 Connections Pro evidence with Core plus Pro features, excluding companion-plugin leakage.

## enabled plugins

- Smart Environment
- Smart Connections Core
- Connections Pro

## disabled or absent plugins

- Smart Lookup
- Smart Context
- Smart Graph

## required state

- observed tier label and plugin versions recorded before each capture
- source/index scope includes only the restored \`Smart Connections Demo/\` fixture corpus
- block embeddings complete before inline captures
- inline connections enabled and threshold recorded
- Bases commands available
- no loading, progress, stale-state, or embedding-error messages visible

## verification note

This is a profile contract. It is not proof that the current Obsidian session is in this profile.
`,
  "sc-context-addendum.md": `---
record_type: profile_contract
profile_id: sc-context-addendum
fixture_id: smart-connections-demo-v2
state: target-contract
verified: false
created_on: 2026-06-23
updated_on: 2026-06-23
---

# sc-context-addendum

## purpose

AG3 support/addendum captures for Smart Context handoff surfaces.

## enabled plugins

- Smart Environment
- Smart Connections Core
- Connections Pro
- Smart Context

## disabled or absent plugins

- Smart Lookup
- Smart Graph, unless the specific capture is a combined graph/context QA shot

## required state

- explicit addendum approval recorded before use in AG3
- source picker must show current fixture-note Connections results
- no empty Context state as final primary evidence
- no account details or personal data
- all transferred items must come from the fixture corpus
`,
  "sc-graph-addendum.md": `---
record_type: profile_contract
profile_id: sc-graph-addendum
fixture_id: smart-connections-demo-v2
state: target-contract
verified: false
created_on: 2026-06-23
updated_on: 2026-06-23
---

# sc-graph-addendum

## purpose

AG3 support/addendum captures for Smart Graph visual proof.

## enabled plugins

- Smart Environment
- Smart Connections Core
- Connections Pro
- Smart Graph

## disabled or absent plugins

- Smart Lookup
- Smart Context, unless the specific capture is an approved combined workflow support shot

## required state

- explicit addendum approval recorded before use in AG3
- selected node, graph matches, ranked list, and action controls visible together
- graph/index state must be fixture-only or explicitly labeled as support-only
- no generic graph beauty shot without source/output relationship
`
};

const unscored_base = `views:
  - type: table
    name: Relevance
    filters:
      and:
        - or:
            - file.folder == "Smart Connections Demo/Related"
            - file.folder == "Smart Connections Demo/Negative Controls"
    order:
      - file.name
    sort:
      - property: file.name
        direction: ASC
`;

const v2_1_note = `---
state: draft
alignment:
  - "[[Smart Connections - screenshot fixture]]"
fixture_id: smart-connections-demo-v2.1
fixture_version: 2.1.0-draft
provenance: v2 kept untouched; this is a new draft fixture
created_on: 2026-06-23
updated_on: 2026-06-23
---

# Smart Connections - screenshot fixture v2.1 draft

## WHY

v2.1 strengthens semantic contrast without changing product behavior. The goal is not to stuff keywords or force ranking. The goal is a cleaner human-readable source note where the best related notes are obviously useful before Smart Connections runs.

Keep the v2 fixture untouched for provenance. Do not rename, rewrite, or repurpose \`Smart Connections Demo/\` when testing this draft.

## fixture contract

- Fixture folder: \`Smart Connections Demo v2.1/\`
- Snapshot IDs:
  - \`v2.1-base-unlinked\`
  - \`v2.1-post-link\`
  - \`v2.1-bases-unscored\`
  - \`v2.1-bases-scored\`
- Expected profile contracts mirror v2:
  - \`sc-core-clean\`
  - \`sc-pro-clean\`
  - \`sc-context-addendum\`
  - \`sc-graph-addendum\`
- The source/index boundary must exclude v2, screenshot project records, reference notes, prior outputs, and QA notes.

## anchor note

File:

\`\`\`text
Smart Connections Demo v2.1/How I avoid losing context while writing.md
\`\`\`

Content for \`v2.1-base-unlinked\`:

\`\`\`md
# How I avoid losing context while writing

I am drafting a product note and the hardest part is not finding more information. The hard part is staying with the paragraph in front of me while still noticing the older notes that would make it stronger.

When a useful idea is hidden three folders away, I either interrupt myself with a search or keep writing without the context. Both choices are expensive. Search breaks flow. Ignoring the prior note makes the new draft weaker.

The better workflow is just-in-time context. While I write about reducing context switching, I want nearby notes about attention residue, deep work, information overload, and deliberate linking to appear beside the draft. I can inspect one candidate, decide whether it truly helps, and only then turn it into a durable link.

That keeps the system honest. The related note is a suggestion, not an automatic decision. I still choose the relationship, but I no longer have to remember every useful source before I can use it.

## Active paragraph

The moment that matters is the paragraph where attention is at risk. If context appears there, I can connect the draft to previous thinking without opening a search tab, scanning folders, or rebuilding the same idea from scratch.

## Review

At the end of the note, I want a small set of high-signal related notes. A good result should help me continue writing, reduce duplicated thinking, or reveal a connection that deserves a real link.

### Related
\`\`\`

Content difference for \`v2.1-post-link\`:

\`\`\`md
### Related
- [[Smart Connections Demo v2.1/Related/Attention Residue and Writing Flow|Attention Residue and Writing Flow]]
\`\`\`

## related notes

### Attention Residue and Writing Flow

\`\`\`md
# Attention Residue and Writing Flow

Attention residue appears when part of the mind remains attached to the previous task. In writing, every unnecessary switch leaves behind a small cost that makes the next sentence harder to finish.

A good note system should reduce switching at the moment of composition. It should bring nearby context into view without forcing the writer to leave the draft.
\`\`\`

### Deep Work During Drafting

\`\`\`md
# Deep Work During Drafting

Deep work depends on protecting the active thread of attention. When a tool asks the writer to search, sort, and compare too early, the tool becomes part of the distraction.

The best retrieval workflow appears close to the active paragraph and gives just enough context to decide whether a source deserves a full read.
\`\`\`

### Information Overload Triage

\`\`\`md
# Information Overload Triage

Information overload is not solved by collecting more inputs. It is reduced by choosing which signals matter for the decision at hand.

During writing, the useful signal is the note that changes the current paragraph. Everything else can wait until review.
\`\`\`

### Deliberate Linking

\`\`\`md
# Deliberate Linking

A durable link should express a relationship worth revisiting. Automatic suggestions are useful only when they make the decision easier without replacing judgment.

The writer should inspect the candidate, understand why it relates, and then choose whether the connection belongs in the note.
\`\`\`

### Just-in-Time Context

\`\`\`md
# Just-in-Time Context

Just-in-time context appears when it can change the next action. It is different from a dashboard, archive, or search result page because it stays close to the work already underway.

For knowledge work, this means the active paragraph can pull in prior notes without turning the session into a separate research task.
\`\`\`

### Review Loops for Knowledge Work

\`\`\`md
# Review Loops for Knowledge Work

A review loop turns scattered notes into usable memory. The loop is strongest when it asks what the current work needs, not what the archive happens to contain.

Small linking passes at the end of a note can improve future retrieval while preserving the momentum of the original writing session.
\`\`\`

## negative controls

### Printer Cartridge Inventory

\`\`\`md
# Printer Cartridge Inventory

The office printer uses black and cyan cartridges. Check the supply shelf before ordering replacements and recycle the empty package after installation.
\`\`\`

### Weekend Grocery Plan

\`\`\`md
# Weekend Grocery Plan

Buy oats, spinach, apples, rice, and coffee. Confirm the pantry before leaving so duplicate ingredients do not crowd the shelf.
\`\`\`

### Hotel Loyalty Numbers

\`\`\`md
# Hotel Loyalty Numbers

Store confirmation numbers and loyalty program IDs in the travel folder. Verify the check-in time before departure.
\`\`\`

## expected result contracts

| Scene | Fixture result contract |
|---|---|
| Current note Connections | At least 3 of the top 5 are from the v2.1 related-note set; no negative control in top 5. |
| Insert link | \`Attention Residue and Writing Flow\` is visible as a result and a real action inserts the link. |
| Footer related notes | Top visible footer results include at least 3 v2.1 related notes and no negative control. |
| Inline popover | Active paragraph shows an inline affordance and at least 3 fixture related results. |
| Bases score | At least 4 related notes score above every negative control. |
| Context addendum | Picker receives at least 3 current-note fixture results, including one top-3 result. |

## production note

This draft is meant to make the screenshot story more legible:

- source problem: losing context while writing
- product output: relevant prior notes appear beside the draft
- action: inspect, link, sort, or add to context

Do not use v2.1 for official capture until its own snapshot pack is materialized and verified.
`;

async function ensure_dir(dir_path) {
  await fs.mkdir(dir_path, { recursive: true });
}

async function path_exists(file_path) {
  try {
    await fs.access(file_path);
    return true;
  } catch {
    return false;
  }
}

async function list_files(dir_path) {
  const entries = await fs.readdir(dir_path, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const entry_path = path.join(dir_path, entry.name);
    if (entry.isDirectory()) {
      files.push(...await list_files(entry_path));
    } else if (entry.isFile()) {
      files.push(entry_path);
    }
  }
  return files;
}

function normalize_unlinked_anchor(content) {
  return content.replace(
    /\n### Related\n\n- \[\[Smart Connections Demo\/Related\/Avoiding Information Overload\|Avoiding Information Overload\]\]\s*$/u,
    "\n### Related\n"
  );
}

function normalize_post_link_anchor(content) {
  const unlinked = normalize_unlinked_anchor(content);
  return `${unlinked.trimEnd()}\n\n- [[Smart Connections Demo/Related/Avoiding Information Overload|Avoiding Information Overload]]\n`;
}

async function copy_snapshot(snapshot_id) {
  const dest_root = path.join(snapshot_root, snapshot_id, "Smart Connections Demo");
  await fs.rm(dest_root, { recursive: true, force: true });
  await fs.cp(fixture_root, dest_root, { recursive: true });

  const anchor_path = path.join(dest_root, "How I build context in my notes.md");
  const anchor_content = await fs.readFile(anchor_path, "utf8");
  const next_anchor = snapshot_id === "v2-post-link"
    ? normalize_post_link_anchor(anchor_content)
    : normalize_unlinked_anchor(anchor_content);
  await fs.writeFile(anchor_path, next_anchor);

  const base_path = path.join(dest_root, "Smart Connections Relevance.base");
  if (snapshot_id === "v2-bases-unscored" || snapshot_id === "v2-base-unlinked" || snapshot_id === "v2-post-link") {
    await fs.writeFile(base_path, unscored_base);
  }
}

async function write_profile_records() {
  const profiles_dir = path.join(snapshot_root, "profiles");
  await ensure_dir(profiles_dir);
  for (const [file_name, content] of Object.entries(profile_records)) {
    await fs.writeFile(path.join(profiles_dir, file_name), content);
  }
}

async function write_readme() {
  const readme = `# smart-connections-demo-v2 snapshot pack

Generated: 2026-06-23

This pack materializes the required v2 snapshots without modifying the canonical v2 fixture note.

## snapshots

- \`v2-base-unlinked\`: anchor has an empty \`### Related\`; Base is unscored.
- \`v2-post-link\`: anchor contains the \`Avoiding Information Overload\` related link; Base is unscored.
- \`v2-bases-unscored\`: Base filters fixture candidates and has no score/list formulas.
- \`v2-bases-scored\`: Base contains the current scored/list formula state copied from the fixture corpus.

## profiles

Profile files are target contracts, not proof that the current Obsidian UI is in that profile.

Official capture still requires a reset record proving the matching profile is active in Obsidian and the fixture snapshot has been restored.
`;
  await fs.writeFile(path.join(snapshot_root, "README.md"), readme);
}

async function write_checksums() {
  const files = [
    ...await list_files(snapshot_root)
  ].filter((file_path) => !file_path.endsWith("checksums.sha256"));
  const lines = [];
  for (const file_path of files.sort()) {
    const buffer = await fs.readFile(file_path);
    const hash = crypto.createHash("sha256").update(buffer).digest("hex");
    const rel_path = path.relative(snapshot_root, file_path).split(path.sep).join("/");
    lines.push(`${hash}  ${rel_path}`);
  }
  await fs.writeFile(path.join(snapshot_root, "checksums.sha256"), `${lines.join("\n")}\n`);
}

async function main() {
  if (!await path_exists(fixture_root)) {
    throw new Error(`Missing fixture root: ${fixture_root}`);
  }

  await ensure_dir(snapshot_root);
  for (const snapshot_id of snapshot_ids) {
    await copy_snapshot(snapshot_id);
  }
  await write_profile_records();
  await write_readme();
  await write_checksums();
  await fs.writeFile(
    path.join(fixtures_root, "Smart Connections - screenshot fixture v2.1 draft.md"),
    v2_1_note
  );

  console.log(JSON.stringify({
    snapshot_root,
    snapshot_count: snapshot_ids.length,
    profile_count: Object.keys(profile_records).length,
    v2_1_draft: path.join(fixtures_root, "Smart Connections - screenshot fixture v2.1 draft.md")
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
