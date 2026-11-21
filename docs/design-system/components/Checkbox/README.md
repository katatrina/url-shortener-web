# Checkbox

Binary choice that is applied on submit; 16px box, 3px corner, check stroke 2px.

**Vue:** `<CsCheckbox v-model="checked" :indeterminate :disabled :description>Label</CsCheckbox>`. Native `<input type="checkbox">` visually hidden, styled sibling `.cs-checkbox__box` with the inline SVG `polyline 3.5,8 7,11 12,4` (indeterminate: `3.5,8 12.5,8`).

- Checked: `color-background-control-checked` fill, `color-border-control-checked` stroke, `color-foreground-control-default` tick.
- Use Toggle instead when the change takes effect immediately.
