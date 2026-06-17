## active grouped by latest `chat-active`
```dataview
LIST map(
	reverse(sort(rows, (r) => r.mtime))
	, (r) => r.file.link
)
WHERE chat-active
FLATTEN max(map(flat(list(chat-active)), (c) => number(c))) AS latest_chat_active
FLATTEN date(string(latest_chat_active * 1000), "x") AS latest_chat_active_date
GROUP BY striptime(latest_chat_active_date) AS g
SORT g DESC
```

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