*Answers and notes inline, relevant screenshots towards the bottom*


> Forgive me for being daft; for the life of me I cannot figure out how to use the Send results to Smart Context option from the dropdown menu in Connections list in the right panel. 

> When I click Send results to Smart Context, the pop up shows documents - is this list the same as the documents listed in the right side panel for the source document?

Yes, these are the same results translated into a new context. Individual items can be added or removed.

> I do not understand how to use the Context name... textbox - how does this work? Where do I refer to the name I type in the there? In the Chat? Where in the Chat? How do I save the Context Name?

Typing in the box should automatically save the name and make it available in the named contexts lists (both sidebar and modal versions screenshotted below).

The Smart Chat currently doesn't have a way to directly access the named contexts. 

> When I click Copy Text button, is that similar to Copy folder contents to clipboard except is copies the connected documents only?

Yes, the Copy Text button will copy all items in the current context as if they were all in the same folder.

> Do I then select Chat to use the Context or is that named Context found/used elsewhere?

> Once in Chat, how to use the contents of my clipboard? Where do I paste it, into the main chat textbox? Is that all? Yes, I see the templatized (new word LOL) context. 

Currently in Smart Chat there isn't a way to access the *named contexts* directly, so the contents copied to clipboard should be pasted directly into the chat box. This flow will be improved in the future.

Alternatively, if using the Smart Chat API integration, contexts can be built inside the chat interface.

> One issue I think I found, the copied Clipboard does not include the source document for all of the Connections (I pasted into Notepad - can't find it). So I must manually add the source document to the Chat plus plate the clipboard?

I'm not exactly sure what might be happening here because all connections should be included in the pasted context after using the "Send to context" feature. If you're able to give me more details about reproducing the issue, I can investigate it further. Ex. Is this happening exclusively with Source (full file) or Block (note sections) connections results?

> Is this the usage flow for the integration of Connections and Context? I tried finding a video on YT about Context but I think it is too new and I read the entire documentation and perhaps that's the daft part, I don't see how to actually use it given the above. Thank you in advance for your guidance.

The most up-to-date documentation should be available via the help icons inside the app. Producing more useful documentation is still an active effort. Additionally, I'm working on more workflow-oriented documentation (will first be published as a series of emails) that will probably be of interest to you.

In the meantime, here's a quick insight into what I've long considered my most valuable workflow (and how I personally utilize the context plugin everyday with various chat platforms, but primarily ChatGPT and the Codex agent harness):

1. I organize my notes around a specific outcome, for example, let's imagine a new outcome called "Feature A," the "Feature A" note includes:
	- an inbox where any relevant captured notes are funneled
	- a "What Done Looks Like (WDLL)" section
	- a "Context" section with links to any relevant notes, and in code/development notes, a "smart-context" codeblock for attributing sources that exist outside of the Obsidian vault (i.e. code files)
		- the codeblock could be replaced with a named context, but there currently isn't a good way to attribute named contexts to a specific note
	- a "Chat" section containing a Smart Chat codeblock for maintaining relevant threads in the note
	- a "Next Actions" section for organizing checklist items (based on the inbox and WDLL sections)
2. I use the "Copy current note" command to copy the current note and linked notes to clipboard.
	- I paste this context directly into the chat codeblock (usually using ChatGPT Pro, sometimes Codex)
	- If there is a specific task I want to focus on, I paste the relevant checklist item in two places, Once before AND once after the pasted context (this helps focus the AI)
	- Then I submit the chat message
3. At this point, before I receive a response (which often takes up to 30 minutes with ChatGPT Pro and Codex), I move to another outcome-oriented note and repeat steps 1-2.
	- Whether I revisit the "Feature A" note today or tomorrow, I know the last chat thread I worked on will be waiting in the chat codeblock where it was submitted

This workflow reflects some fundamental beliefs I have regarding how to use Obsidian with AI, so how well it works may depend on your current usage of both. Those beliefs:

1. My Obsidian notes are my single-source-of-truth
2. My Obsidian notes are used to drive progress on my desired outcomes
3. Outcome notes in my Obsidian map to real world outcomes
4. Obsidian serves as a control center for delegating and working with AI

The currently available Smart Plugins are largely designed to facilitate the above. And I will be producing more material on these methods (another currently in-progress effort).

## Screenshots

Connections scores displayed in context tree
![[Pasted image 20251226090425.png]]



Accessing named contexts via the sidebar (use command on left to open sidebar on right)
![[Pasted image 20251226090512.png]]


Accessing named contexts via modal (allows both editing and copying context with depth selection)
![[Pasted image 20251226090645.png]]
![[Pasted image 20251226090745.png]]


