# Button

Triggers an action; a pill with a 2px border, bold 14px label, 32px tall.

**Vue:** `<CsButton variant="primary" :disabled :loading icon-name="add-plus" @click>Launch instance</CsButton>` → `<button class="cs-btn cs-btn--primary">`. `variant`: `normal` (default) · `primary` · `link` · `icon` (needs `ariaLabel`). Slot = label. `href` renders an `<a>` with the same classes.

- One `primary` per page or modal: the action the view exists for.
- `link` variant for low-emphasis actions next to a primary (modal "Cancel").
- Icon-only buttons always carry `aria-label`.
- `loading`: keep the width, swap the icon for `status-in-progress` spinning, set `aria-disabled="true"`.
- Don't: change radius, use custom colors, or put two primaries side by side.
