# AG1 computer-use prompt - First Useful Related Note

Capture only Smart Connections Core product truth.

Profile:

```text
sc-core-clean
```

Required fixture:

```text
smart-connections-demo-v2 / 2.0.0
```

Do not show Connections Pro, Smart Lookup, Smart Context, Smart Dedupe, settings, progress, errors, or command lists in final raw candidates.

Verify and then capture these evidence families:

1. `sc-current-note-related-notes` / ranked list
2. `sc-current-note-related-notes` / expanded result
3. `sc-related-result-to-note-link` / verified post-link state
4. `sc-footer-end-note-related-notes` / open Footer at note end

For each family, capture three separately composed raw variants:

- landscape for `1200 x 628`
- square for `1200 x 1200`
- portrait for `960 x 1200`

Use `02_CAPTURE_MATRIX.csv` for exact raw and final filenames.

Critical pass conditions:

- current anchor and result list belong together
- target results satisfy the fixture contract
- post-link still shows a real verified note link and matching result
- Footer is visibly attached to the active note ending
- Core profile contains no Pro surface or status
- every raw capture is untouched and fully traceable

Stop rather than repair a failed result contract in post-production.
