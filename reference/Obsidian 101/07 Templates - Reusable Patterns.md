Your goal: stop rewriting the same structure and start reusing it.

## Create a templates folder (example)
Templates/

## Example template: Meeting Note
Create a note inside your Templates folder named "T - Meeting Note" with this content:

---
type: meeting
date: "{{date}}"
time: "{{time}}"
tags:
  - meeting
---

# {{title}}

## Outcome
- [ ]

## Notes

## Actions
- [ ] Follow up with [[Person - ]]

## Use it
- [ ] Enable the Templates core plugin
- [ ] Set the Template folder location
- [ ] Insert the template into a new note

## Related
- [[08 Daily Notes - A Simple Habit Loop]]
- [[05 Tags & Properties - Findability and Structure]]
