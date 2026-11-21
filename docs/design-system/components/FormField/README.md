# FormField

Wraps one control with its label, description, constraint and error.

**Vue:** `<CsFormField label="Instance name" description :constraint-text :error-text>` with the control in the default slot and an optional `info` slot. Generates ids and wires `for`/`aria-describedby`.

- Label `font-weight-bold` 14px; description and constraint `body-s` in `color-text-form-secondary`.
- `errorText` replaces nothing — it sits under the control with the `status-warning` icon in `color-text-status-error`; also set the control's `invalid`.
- Stack fields with `space-scaled-l` (20px).
