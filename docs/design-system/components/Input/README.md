# Input

Single-line text entry; 32px tall, 8px radius, 1px `color-border-input-default` stroke that turns `color-border-input-focused` with a 1px ring on focus.

**Vue:** `<CsInput v-model :type :placeholder :disabled :invalid :warning icon-name="search" :aria-describedby>` → `.cs-input` wrapping a bare `<input>`. Modifiers: `cs-input--invalid`, `--warning`, `--disabled`.

- Always inside a FormField (or with an `aria-label` for search boxes).
- `invalid` thickens the start edge to 8px red — pair with the FormField `error` text.
- Placeholders are italic examples ("Enter a name"), never the label.
