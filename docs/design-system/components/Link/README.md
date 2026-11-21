# Link

Navigates; inline underlined text in `color-text-link-default`.

**Vue:** `<CsLink :href variant="primary|secondary|info" :external>` → `<a class="cs-link">`. `external` appends the `external` icon and `target="_blank" rel="noopener"`.

- `primary` (underlined) inside running text; `secondary` (underline on hover) in tables and key-value lists; `info` is the bold "Info" link beside a label that opens the help panel.
- Link text names the destination — never "click here".
