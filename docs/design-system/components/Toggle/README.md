# Toggle

On/off switch that takes effect immediately; 24×16 track, 12px handle sliding 8px.

**Vue:** `<CsToggle v-model="on" :disabled :description>Auto-scaling</CsToggle>` → `<input type="checkbox" role="switch">` + `.cs-toggle__track`.

- Off track `color-background-toggle-default`; on `color-background-control-checked`; checked-disabled `color-background-toggle-checked-disabled`.
- Label states the setting, not the action ("Auto-scaling", not "Turn on auto-scaling").
