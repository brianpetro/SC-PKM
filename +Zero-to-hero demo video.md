1) What are we about to witness or participate in during the next hour and what's the goal?
	- utilizing Smart Plugins, starting with a clean slate
2) Should we ask questions throughout and if so how (blurt out, raise hand, chat, etc.)?
	- yes
3) In terms of archiving what happens, will there be a recording? Would you like me or others to take notes? Will the things you create be shared to download by others?
	- Would love to publish recording
## Smart Connect 
- [ ] set inbox folder
```
📥 inbox
```
- [ ] init custom GPT: Minimal necessary actions and predefined system prompt may reduce errors
	- *alignment*
	- *retrieve*
	- *list folders*
	- *draft change*
	- *draft move*

## Custom GPT Instructions
```
Important:
- Start by retrieving Alignment action to get the folder structure.
- Minimize the amount of original text you repeat. Only include what is necessary as anchor lines.
- Follow the user's change instructions carefully.
- Anchor lines:
	- Provide necessary surrounding context (stable lines above and below your edit).
	- One or two lines before and after the edit is typically enough for the anchoring logic.
	- Use anchor lines to prevent repeating all of the original text.
- Place ellipsis before, after, and/or inbetween anchor lines (ex. "\n...\n") to represent unchanged original text.
- Keep anchor lines (stable, unchanged lines) exactly the same as the current text. Avoid reformatting or reindenting lines that haven't changed. This ensures clear anchor lines.
- Place newly added or modified content between these stable anchors. Ex. Draft "Anchor 1\nNew content\nAnchor 2" replaces "Old content" with "New content" in "Anchor 1\nOld content\nAnchor 2".
- DO NOT headings unless explicitly instructed to change them.
- DO NOT output frontmatter: Frontmatter will be automatically removed.
- DO NOT repeat the full original text verbatim in your response, use anchor lines and ellipsis to prevent this.
	- For example, place ellipsis between headings (anchors lines) where the content under the first heading is unchanged.
- DO NOT change headings unless specifically instructed to do so.
```



## old

1. Start without any plugins in Smart Vault
2. Install Smart Connections
	1. Login as supporter (use main key since saved as password)
		- WHY: easy and secure
	2. Install plugins used in demos
		- Smart Editor
		- Smart Chat
		- Smart Context Early
		- Smart ChatGPT
		- Smart Sources
	3. Configure plugins
		- add OpenAI key to Smart Sources OP
3. Add context to chat (drag-and-drop) and trigger additional lookup
4. Use Smart Context to summarize via ChatGPT (*init example*)
5. Draft (editor) note improvement with context ("add links")
6. Install SC App (prior settings cleared) and set up Smart Vault environment
	1. init custom GPT: Minimal necessary actions and predefined system prompt may reduce errors
		- *retrieve*
		- *list folders*
		- *draft change*
		- *draft move*
7. Open SC GPT in [Webviewer](https://chatgpt.com) in Obsidian
	1. First, re-organize items in a single folder to other existing folders (may use to organize inbox)
	2. Finally, use voice to "improve the notes"


```
- Keep stable, unchanged lines exactly the same as the current text. Avoid reformatting or reindenting lines that haven't changed. This ensures clear "anchor" lines.
- Place newly added or modified content between these stable anchors. Ex. Draft "Anchor 1\nNew content\nAnchor 2" replaces "Old content" with "New content" in "Anchor 1\nOld content\nAnchor 2".
- When rewriting a paragraph or block of text, include at least one unchanged line above and below it so the diff process can find stable anchor lines and parse the in-between edits correctly.
- Avoid adding or retaining frontmatter in the draft. Frontmatter in drafts will be automatically removed.
- Provide enough surrounding context (stable lines above and below your edit) so that the diff can match your draft lines correctly. One or two lines before and after the edit is typically enough for the anchoring logic.
- If you only want to append text to the end, place a clear anchor sourced from near the bottom (e.g., last heading) and then your new lines. Likewise, for prepend, place an anchor sourced near the top, following your new content (places the new content before the anchor).
- Avoid changing headings unless explicitly instructed to change them.
```

