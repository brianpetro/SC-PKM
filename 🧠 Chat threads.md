
## active grouped by `mtime`
```dataview
LIST map(
	reverse(sort(rows, (r) => r.impact))
	, (r) => r.impact + " " + r.file.link
)
WHERE chat-active
GROUP BY file.mday AS g
SORT g DESC
```


## in progress
```dataview
LIST WITHOUT ID file.folder + " " + file.link + " " + file.mday 
WHERE chat-active!=null
SORT file.mtime DESC
```


## completed
```dataview
LIST choice(typeof(chat-done)="string", 1, length(chat-done))
WHERE chat-done
SORT choice(typeof(chat-done)="string", 1, length(chat-done)) DESC
```