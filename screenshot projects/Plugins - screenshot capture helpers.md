---
state: next
alignment:
  - "[[Plugins - screenshots SOP]]"
---

# Plugins - screenshot capture helpers

## WHY

Optional capture helpers can reduce irrelevant visual noise, but they are brittle and must never become part of the product truth being demonstrated.

## safety rules

- Preserve an untouched full-window raw capture before using any helper.
- Use helpers only in an isolated demo vault/profile.
- Do not remove, rewrite, or fabricate any element required by the scene truth contract.
- Do not use a helper to make a Pro profile appear to be Core.
- Record the helper name, selector, and tested plugin/Obsidian version in the capture run.
- Revalidate selectors after relevant UI changes.
- Prefer a clean profile or a crop over DOM mutation.

## batch capture intake note

WHEN initiating multiple captures in one run THEN create a temporary intake note named with the scene/run prefix.

Example:

```text
sc-current-note-related-notes--2026-06-22
```

Use lowercase, hyphenated text so Paste Image Rename or equivalent capture tooling produces easy-to-map raw names.

After capture, map every attachment to the canonical raw filename in the capture run.

The temporary note name is an intake convenience, not the public asset name.

## helper record template

| Field | Value |
|---|---|
| Helper ID |  |
| Purpose |  |
| Scene/variant |  |
| Selector or script |  |
| Tested Obsidian version |  |
| Tested plugin build |  |
| Raw capture created first |  |
| Reversal/reset method |  |

## remove non-Smart Environment status-bar elements

Use only when the status bar itself is part of the intended evidence and a clean profile cannot provide the state.

```js
const status_bar = document.querySelector('.status-bar');

if (status_bar) {
  const target = status_bar.querySelector('.smart-env-status-container');

  [...status_bar.children].forEach((child) => {
    if (!child.contains(target)) child.remove();
  });
}
```

Reset by reloading the Obsidian window or restarting the application.

Original reference:

```md
Remove non smart-env status bar elms
```

## dim leaf elements outside a target

These selectors affect leaf elements and depend on current DOM structure.

Apply only after preserving raw evidence.

Disable the CSS snippet to reset.

### Smart Environment status

```css
*:not(:has(*)):not(.smart-env-status-container *) {
  filter: brightness(0.5);
}
```

### Smart Context codeblock container

```css
*:not(:has(*)):not(.sc-context-codeblock-container *) {
  filter: brightness(0.5);
}
```

### Smart Context codeblock plus transient UI

```css
*:not(:has(*)):not(.sc-context-codeblock-container *):not(.menu *):not(.notice-container *):not(.HyperMD-codeblock *):not(.modal-container *) {
  filter: brightness(0.5);
}
```

## known target selector

```text
sc-contexts-dashboard
```

## limitations

- `:has()` support and Obsidian DOM structure may change.
- Leaf-only selectors can dim text or icons unexpectedly.
- Removing status-bar children mutates the live DOM for the current session.
- A helper can produce an attractive but nonrepresentative state.

WHEN a helper changes the apparent feature behavior or tier boundary THEN discard the derivative and return to the untouched raw capture.
