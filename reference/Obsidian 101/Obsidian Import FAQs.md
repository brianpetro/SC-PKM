# Obsidian import and migration FAQ (new user edition)

## Objective
- Understand what new Obsidian users need to successfully migrate notes, links, attachments, and metadata into Obsidian with minimal rework.

## Core mental model

### Q: What is a vault, and how does Obsidian store notes?
A: Obsidian stores your notes as Markdown plain text files inside a vault, which is just a folder on your file system. The vault also contains attachments and an `.obsidian` configuration folder. Avoid putting a vault inside another vault because internal links are scoped to a single vault and may not update correctly.

### Q: What does "importing into Obsidian" actually mean?
A: Importing usually means either moving your existing Markdown/text files into the vault or converting exports from another app into Markdown files plus attachments and placing the results in the vault.

### Q: What are the main migration lanes into Obsidian?
A: Most migrations fall into these lanes:
- Direct file move for Markdown files and folders
- Importer plugin for supported apps and formats
- Export + convert pipeline for unsupported apps (export to Markdown, HTML, CSV, etc., then import)

### Q: What should I expect a migration to change, even when it "works"?
A: Assume a migration is a conversion, not a perfect clone. These are normal outcomes:
- Attachments become separate files in your vault (Obsidian is file-based, not database-based).
- Some internal links may not reconcile automatically if the source app uses app-specific link IDs or URI schemes.
- Some rich formatting may drift (tables, callouts, highlights, embeds) because different apps have different document models.
- Some app-specific metadata does not map 1:1 (reminders, assignments, access control, proprietary block types).

### Refs
- [How Obsidian stores data](https://help.obsidian.md/data-storage)
- [Manage vaults](https://help.obsidian.md/manage-vaults)
- [Import notes](https://help.obsidian.md/import)
- [Importer plugin](https://help.obsidian.md/plugins/importer)
- [Import from Notion](https://help.obsidian.md/import/notion)
- [Import from Google Keep](https://help.obsidian.md/import/google-keep)

## Picking the right import method

### Q: When should I just copy files into my vault?
A: If you already have Markdown files or can export clean Markdown, copying files and folders into your vault is often the simplest option. After import, you can normalize formatting with Format converter if needed.

### Q: When should I use the Importer plugin?
A: Use Importer when you need app-specific conversion (Notion, OneNote, Evernote, etc.) or format conversion (HTML, CSV, Textbundle, and other supported formats). If your problem is primarily link-style normalization inside an existing vault (for example, Zettelkasten UID-only links), that is handled by Format converter, not Importer.

### Q: Is Importer an official tool?
A: Yes. Importer is an official community plugin made by the Obsidian team, and the code is open source.

### Q: What import paths are officially documented?
A: Obsidian's official "Import notes" guide documents import workflows for:
- Apps: Notion, Microsoft OneNote, Evernote, Apple Notes, Google Keep, Bear, Craft, Roam Research
- Formats: HTML, CSV, Markdown, Textbundle
- Link-style migration: Zettelkasten notes (via Format converter)

### Refs
- [Import Markdown files](https://help.obsidian.md/import/markdown)
- [Format converter](https://help.obsidian.md/plugins/format-converter)
- [Importer plugin](https://help.obsidian.md/plugins/importer)
- [Import notes](https://help.obsidian.md/import)
- [Import Zettelkasten notes](https://help.obsidian.md/import/zettelkasten)
- [obsidianmd/obsidian-importer](https://github.com/obsidianmd/obsidian-importer)

## Pre-flight decisions that prevent the most migration pain

### Q: What should I decide before importing anything?
A: Decide these early to avoid large-scale cleanup later:
- Link format: Wikilinks vs Markdown links
- Link path strategy: shortest path vs relative vs absolute
- Attachment location policy
- Metadata policy: what becomes Properties and how tags should look
- Whether to pilot in a fresh vault first

### Q: Should I import into a fresh vault first?
A: Usually yes. A pilot import into a clean vault lets you validate link behavior, attachment placement, folder structure, search behavior, and Properties mapping before committing to a full migration.

### Q: Do I need a backup before I run any conversion steps?
A: Yes. Obsidian explicitly recommends backing up before running vault-wide conversions (like Format converter). Also, syncing is not a backup.

### Q: Should I keep my old system after importing?
A: Yes. Keep the original app data and export files until you have validated:
- Notes count and folder structure look right
- Attachments render correctly in Obsidian
- Links reconcile the way you expect
- Tags and Properties are usable

### Refs
- [Internal links](https://help.obsidian.md/links)
- [Settings](https://help.obsidian.md/settings)
- [Attachments](https://help.obsidian.md/attachments)
- [Properties](https://help.obsidian.md/properties)
- [Tags](https://help.obsidian.md/tags)
- [Manage vaults](https://help.obsidian.md/manage-vaults)
- [How Obsidian stores data](https://help.obsidian.md/data-storage)
- [Search](https://help.obsidian.md/plugins/search)
- [Format converter](https://help.obsidian.md/plugins/format-converter)
- [Back up your Obsidian files](https://help.obsidian.md/backup)

## Links, filenames, and path behavior

### Q: What is the difference between wikilinks and Markdown links in Obsidian?
A: Obsidian supports both internal link styles:
- Wikilinks: `[[Note name]]`
- Markdown links: `[Note name](Note%20name.md)`
You can choose which style Obsidian auto-generates via settings.

### Q: If I disable wikilinks, do I lose the `[[` autocomplete workflow?
A: No. Even with wikilinks disabled, you can still type `[[` for autocomplete and Obsidian will insert a Markdown link instead.

### Q: Why do Markdown links contain `%20`?
A: Markdown link destinations should be URL encoded, so spaces become `%20`.

### Q: Will Obsidian update links if I rename or move files after import?
A: Obsidian can automatically update internal links when you rename files. This is configurable in Settings.

### Q: How does Obsidian decide what path to insert for new links?
A: The "New link format" setting controls whether Obsidian inserts the shortest unique path, a path relative to the current file, or an absolute path from the vault root.

### Q: What filename characters commonly break links?
A: Obsidian warns that strings containing these characters may not work as links: `# | ^ : %% [[ ]]`.

### Q: Why do links sometimes not reconcile after import, even though the target note exists?
A: Common causes:
- The source app used link IDs (not titles) so the import could not map them to filenames.
- There are duplicate note titles, so the imported filenames diverged.
- Filenames contain invalid characters, or were normalized differently between systems.
- You imported only part of the dataset, so cross-links point to notes that are not present.

### Q: Can I link to and embed non-Markdown files (like images or PDFs)?
A: Yes. For non-Markdown files you generally include the extension, for example `[[Figure 1.png]]` or `[[Paper.pdf]]`. Prefix a link with `!` to embed it.

### Q: I want to link to files Obsidian cannot open. Can I still see and link them?
A: Yes. There is a "Show all file types" setting so those files appear in File Explorer and can be linked. If Obsidian cannot open the file, it will typically hand it off to your system default app.

### Refs
- [Internal links](https://help.obsidian.md/links)
- [Basic formatting syntax](https://help.obsidian.md/syntax)
- [Settings](https://help.obsidian.md/settings)
- [How Obsidian stores data](https://help.obsidian.md/data-storage)
- [Import from Notion](https://help.obsidian.md/import/notion)
- [Accepted file formats](https://help.obsidian.md/file-formats)

## Attachments and media

### Q: Where do attachments go by default?
A: By default, attachments are added to the root of your vault, but you can change the default attachment location in settings.

### Q: What attachment location options are available?
A: Obsidian supports these default attachment locations:
- Vault folder (vault root)
- A specified folder
- Same folder as current file
- A subfolder under the current folder (created when needed)

### Q: What happens when I paste or drag files into a note?
A: Obsidian copies the file into the default attachment location and embeds it in the note.

### Q: How do I prevent "attachment sprawl" during migration?
A: Set your default attachment location before importing or doing heavy paste/drag workflows. Many messy migrations are just the default behavior (vault root) applied at scale.

### Q: Why did my import create an attachments folder or a references folder?
A: Many importers place embedded images and files into a dedicated folder so links remain stable and your Markdown stays readable. This is normal in a file-based system: the note is Markdown text, and attachments are separate files referenced by links.

### Refs
- [Attachments](https://help.obsidian.md/attachments)
- [Accepted file formats](https://help.obsidian.md/file-formats)
- [How Obsidian stores data](https://help.obsidian.md/data-storage)

## Properties and tags

### Q: What are Properties in Obsidian?
A: Properties are structured data attached to a note, such as text, links, dates, checkboxes, and numbers.

### Q: Why did my import create lots of Properties?
A: Imports from structured systems (Notion databases, CSV, etc.) typically map fields into Properties so the data remains queryable and usable for views.

### Q: How should tags look in Obsidian, and how do imports map them?
A: Tags can be inline (like `#meeting`) or stored in YAML frontmatter using the `tags` property as a list.

### Refs
- [Properties](https://help.obsidian.md/properties)
- [Import CSV files](https://help.obsidian.md/import/csv)
- [Import from Notion](https://help.obsidian.md/import/notion)
- [Tags](https://help.obsidian.md/tags)

## Bases (important for Notion and CSV migrations)

### Q: What are Bases, and why do they matter for migrations?
A: Bases is a core plugin that creates database-like views of your notes using their Properties. The data remains in your Markdown files; the Base defines the view and can be saved as a `.base` file.

### Q: How does Notion API import relate to Bases?
A: Obsidian's Notion API import preserves databases and formulas by converting them into Bases. Databases are represented as folders with a `.base` file inside.

### Q: What does CSV import produce?
A: CSV import generates Markdown files for each row and a Base file that displays the imported files as a table. It also supports templating via `{{column_name}}` variables.

### Refs
- [Introduction to Bases](https://help.obsidian.md/bases)
- [Import from Notion](https://help.obsidian.md/import/notion)
- [Import CSV files](https://help.obsidian.md/import/csv)

## Search and validation (common new-user surprises)

### Q: Can Obsidian search inside PDFs and other attachments?
A: By default, Obsidian only searches the contents of notes and canvases. You can still find attachments by filename and path using search operators like `file:` and `path:`.

### Q: How do I validate a migration before I delete anything?
A: A fast validation pass looks like this:
- Spot-check notes that contain images, PDFs, and other attachments to confirm they render.
- Search for obvious "old-system" link patterns (example: `evernote://`) and decide how you will handle them.
- Use Search operators to sanity-check file presence (example: `file:.pdf`, `file:.png`, `path:"Attachments"`).
- Confirm tags and Properties are in the shape you want before doing any vault-wide conversions.

### Refs
- [Search](https://help.obsidian.md/plugins/search)
- [Accepted file formats](https://help.obsidian.md/file-formats)
- [Back up your Obsidian files](https://help.obsidian.md/backup)
- [Attachments](https://help.obsidian.md/attachments)

## App-specific import FAQs
- These sections assume you are following the official "Import notes" workflows unless stated otherwise.

### Refs
- [Import notes](https://help.obsidian.md/import)

## Notion

### Q: What are the official ways to import from Notion?
A: Obsidian provides two Notion import methods:
- API import: preserves workspace structure including databases and formulas (converted to Bases), requires an integration token and internet access
- File import: imports from a Notion export zip and does not preserve databases, no API token required

### Q: For Notion file import, should I export Markdown or HTML?
A: Obsidian recommends exporting your entire Notion workspace as HTML and explicitly recommends not using Notion's Markdown export because it omits important data.

### Q: Should I import all Notion content at once or in parts?
A: Obsidian recommends importing all Notion at once so internal links can be reconciled correctly.

### Q: What are common Notion API import limitations?
A: Obsidian documents Notion API constraints such as primary view only for databases, linked data sources not imported (Notion API limitation), and some formula functions unavailable. Large workspaces may take a long time due to Notion API rate limits.

### Q: My Notion export has nested zip parts and import fails. What do I do?
A: Obsidian notes that large Notion exports may contain nested zip files; the workaround is to unzip the outer export and import the nested part zip files.

### Q: Why did a Notion "folder with content" import differently?
A: Obsidian notes that Notion allows content inside folders, but Obsidian does not; those pages are added as subpages under the folder during import.

### Refs
- [Import from Notion](https://help.obsidian.md/import/notion)
- [Introduction to Bases](https://help.obsidian.md/bases)

## Evernote

### Q: What format should I export from Evernote?
A: Export Evernote notebooks as `.enex` files and import them using Importer.

### Q: Can I preserve Evernote tag hierarchy?
A: Evernote export does not keep tag hierarchy. Obsidian suggests flattening hierarchy into a single tag using `/`, for example `ParentTag/ChildTag`.

### Q: Can I preserve Evernote notebook stacks?
A: Obsidian describes a filename convention to recreate stacks as folders by renaming the export file to `StackName@@@NotebookName`.

### Q: What should I check if Evernote links feel "broken" after import?
A: If you used lots of internal links in Evernote, spot-check them. Some Evernote link types do not map cleanly to file-based links, and may remain as Evernote URI links in Markdown. Search for `evernote://` and decide whether to leave them, replace them, or re-link. If you need more advanced options than the default import provides, Obsidian points to Yarle as an alternative route.

### Refs
- [Import from Evernote](https://help.obsidian.md/import/evernote)
- [Importer plugin](https://help.obsidian.md/plugins/importer)

## Microsoft OneNote

### Q: Why does OneNote import require sign-in and web access?
A: The OneNote importer uses a browser sign-in flow to access notebooks and sections from your Microsoft account.

### Q: What OneNote accounts are supported?
A: Obsidian warns that only notebooks owned by your personal account can be imported. Shared notebooks or work and school accounts are not supported.

### Q: Importer shows no notebooks or sections. What is usually wrong?
A: Obsidian says notebooks must be synced to OneDrive and visible in OneNote Web, must be owned by you, and locked sections are invisible until unlocked.

### Q: Some imported OneNote notes are empty or missing content. What is the recommended fix?
A: Obsidian provides a recovery flow using OneNote Web export, unzip, re-upload via OneNote import/export, then retry import.

### Q: What is the privacy model for OneNote import?
A: Obsidian states Importer uses OAuth, receives a short-term access token used only from your computer, and the token is never stored.

### Refs
- [Import from Microsoft OneNote](https://help.obsidian.md/import/onenote)

## Apple Notes

### Q: Can I import Apple Notes on iPhone or iPad?
A: Not via the official importer. Obsidian says Apple Notes import is supported on macOS only and not available on iOS yet.

### Q: What Apple Notes content is supported?
A: Obsidian says Importer supports virtually all Apple Notes content types, including tables, images, drawings, scans, PDFs, and links introduced in iOS 17.

### Q: Why were some Apple Notes skipped?
A: Password-protected notes must be unlocked before import or they will be skipped.

### Q: If Apple Notes has no native export, what are my options?
A: Obsidian notes third-party exporters exist, but warns they may be limited and often work best for mostly text-only notes. Depending on the tool, export may be Markdown or HTML, which you then import accordingly.

### Refs
- [Import from Apple Notes](https://help.obsidian.md/import/apple-notes)
- [Import HTML files](https://help.obsidian.md/import/html)
- [Import Markdown files](https://help.obsidian.md/import/markdown)

## Google Keep

### Q: How do I export Google Keep for Obsidian?
A: Use Google Takeout to export Keep, then import the resulting zip with Importer.

### Q: Why did my checklists lose indentation?
A: Obsidian notes Google Keep does not export indentation information, so checklists import as top-level items.

### Q: Why are reminders and assignments missing?
A: Obsidian notes these features are not imported because they are not supported by Obsidian.

### Refs
- [Import from Google Keep](https://help.obsidian.md/import/google-keep)

## Bear

### Q: What do I export from Bear?
A: Create a Bear backup `.bear2bk` file and import it with Importer.

### Refs
- [Import from Bear](https://help.obsidian.md/import/bear)

## Craft

### Q: How do I migrate from Craft?
A: Export from Craft as Markdown, then import those Markdown files into your vault.

### Q: Why are some Craft links broken after import?
A: Obsidian notes Craft uses non-standard syntax for certain links and points to references in the Importer repository.

### Refs
- [Import from Craft](https://help.obsidian.md/import/craft)
- [Import Markdown files](https://help.obsidian.md/import/markdown)
- [Importer issue reference](https://github.com/obsidianmd/obsidian-importer/issues/27)

## Roam Research

### Q: What export format should I use from Roam?
A: Export Roam data as JSON and import the JSON using Importer.

### Q: Can I import Roam attachments?
A: Yes. The Roam import flow includes an option to download all attachments.

### Refs
- [Import from Roam Research](https://help.obsidian.md/import/roam)

## Format and file-type imports
- These sections cover imports where the source is already a file format, not an app database.

### Refs
- [Import notes](https://help.obsidian.md/import)

## Markdown

### Q: I already have Markdown files. How do I import them?
A: Add Markdown files by dragging folders into File Explorer or by moving files directly into the vault folder via your system file manager.

### Q: My Markdown looks "off" after import. Why?
A: Obsidian uses Obsidian Flavored Markdown, and other apps may use slightly different Markdown conventions.

### Q: How do I normalize Markdown syntax across the vault?
A: Use the Format converter core plugin, but back up first because it can convert your entire vault. Avoid running vault-wide conversions until your import output looks correct.

### Refs
- [Import Markdown files](https://help.obsidian.md/import/markdown)
- [How Obsidian stores data](https://help.obsidian.md/data-storage)
- [Format converter](https://help.obsidian.md/plugins/format-converter)
- [Back up your Obsidian files](https://help.obsidian.md/backup)

## HTML

### Q: Can I import saved web pages or app exports in HTML?
A: Yes. Importer can convert individual HTML files or entire folders of HTML into Markdown.

### Q: How do I avoid importing tons of tiny icons and logos from HTML?
A: Use the HTML import settings such as minimum image size to skip small images, and attachment size limit to skip large attachments.

### Refs
- [Import HTML files](https://help.obsidian.md/import/html)

## CSV

### Q: I have spreadsheets (Excel, Google Sheets, Airtable exports). What is the best path?
A: Use CSV import. It generates notes with Properties plus a Base file to view the results as a table.

### Refs
- [Import CSV files](https://help.obsidian.md/import/csv)
- [Introduction to Bases](https://help.obsidian.md/bases)

## Textbundle

### Q: What is Textbundle, and why would I use it?
A: Textbundle packages Markdown text plus referenced images into a single bundle, which helps when exporting from sandboxed apps.

### Q: Why can I only select one Textbundle file sometimes?
A: Obsidian documents that Textbundle import can import one Textbundle at a time, and only on Mac devices, with a workaround to zip multiple Textbundles and import the zip.

### Refs
- [Import Textbundle files](https://help.obsidian.md/import/textbundle)

## Zettelkasten UID links

### Q: Why do links like `[[UID]]` break when filenames include both UID and title?
A: Obsidian resolves links based on file names. If your file is named `UID Title.md` but your links are `[[UID]]`, those links may not resolve as intended.

### Q: How do I fix Zettelkasten-style UID-only links across a vault?
A: Use the Zettelkasten link fixer in Format converter to rewrite `[[UID]]` links to use the full note name. Format converter can also beautify display text.

### Refs
- [Import Zettelkasten notes](https://help.obsidian.md/import/zettelkasten)
- [Internal links](https://help.obsidian.md/links)
- [Format converter](https://help.obsidian.md/plugins/format-converter)

## Post-import cleanup and normalization

### Q: What is Format converter, and when should I run it?
A: Format converter is a core plugin that converts Markdown from other applications into Obsidian format and can also convert certain Properties to newer required formats. It can operate across the entire vault, so back up first. Run it only after you are satisfied with your import output.

### Refs
- [Format converter](https://help.obsidian.md/plugins/format-converter)
- [Back up your Obsidian files](https://help.obsidian.md/backup)

## Sync, conflicts, and backup during migration

### Q: Can I use Obsidian Sync alongside iCloud, Dropbox, OneDrive, or Google Drive for the same vault?
A: Obsidian does not recommend syncing the same files with multiple sync solutions at once because it can cause conflicts.

### Q: What is "double-syncing" and why does it matter?
A: Obsidian calls out double-syncing as a common cause of missing files or odd behavior, when Obsidian Sync runs alongside another syncing service.

### Q: Why do I need to keep cloud-synced vault files "Available Offline"?
A: Obsidian needs access to the entire vault for features like updating links on rename. If OneDrive or iCloud offloads files (Files On-Demand / Optimize Storage), Obsidian may not be able to access them and you can get sync issues. Mark the vault as kept on device.

### Q: How does Obsidian Sync handle conflicts?
A: Obsidian Sync merges Markdown conflicts using Google's diff-match-patch algorithm. For other file types, it typically uses a last-modified-wins approach. Conflict resolution settings are device-specific.

### Q: Is syncing a backup?
A: No. Obsidian explicitly states syncing is not a backup and recommends using a dedicated backup tool that makes one-way copies.

### Refs
- [Switch to Obsidian Sync](https://help.obsidian.md/sync/switch)
- [Sync your notes across devices](https://help.obsidian.md/sync-notes)
- [Troubleshoot Obsidian Sync](https://help.obsidian.md/sync/troubleshoot)
- [Back up your Obsidian files](https://help.obsidian.md/backup)

## Troubleshooting common import problems

### Q: Notion import freezes or seems stuck. What should I try?
A: Obsidian suggests these first moves:
- Confirm you exported HTML (not Notion Markdown) for file import
- Disable other community plugins and retry if Obsidian appears to freeze
- If the export is huge and contains nested zip parts, import the part zip files

### Q: OneNote import shows no notebooks or sections.
A: Verify notebooks are synced to OneDrive and visible in OneNote Web, that they are owned by your personal account, and that sections are not locked.

### Q: HTML import created too many junk images.
A: Use the minimum image size setting to skip tiny images, and consider attachment size limit to skip huge references.

### Q: Links do not resolve after import.
A: Check for invalid characters in filenames and confirm your link format choices. Also ensure you are not nesting vaults within vaults.

### Refs
- [Import from Notion](https://help.obsidian.md/import/notion)
- [Import from Microsoft OneNote](https://help.obsidian.md/import/onenote)
- [Import HTML files](https://help.obsidian.md/import/html)
- [Internal links](https://help.obsidian.md/links)
- [How Obsidian stores data](https://help.obsidian.md/data-storage)

## Unsupported sources and "my app is not listed"

### Q: My source app is not supported by Importer. What now?
A: Use an export + convert path:
- Export Markdown if available, then copy into the vault
- Export HTML and import HTML files
- Export CSV if the source is tabular, then import CSV into notes + Base
Then normalize formatting with Format converter if needed.

### Q: I have Google Docs or Word documents. What is the common migration path?
A: Obsidian does not provide an official Word or Google Docs importer. Common approaches:
- Export to `.docx` or HTML, then convert to Markdown using an external converter
- Copy/paste for small volumes, then clean up Markdown formatting
A: If you go this route, do it in a pilot vault first because image handling and table formatting vary between converters.

### Q: Where can I find community migration guides for unsupported apps?
A: Obsidian links community-shared guides (examples include Day One, Logseq, Remnote, Samsung Notes, TiddlyWiki, Ulysses, Zim, and others) from the Import notes page.

### Refs
- [Import notes](https://help.obsidian.md/import)
- [Import Markdown files](https://help.obsidian.md/import/markdown)
- [Import HTML files](https://help.obsidian.md/import/html)
- [Import CSV files](https://help.obsidian.md/import/csv)
- [Format converter](https://help.obsidian.md/plugins/format-converter)
- [How Obsidian stores data](https://help.obsidian.md/data-storage)

