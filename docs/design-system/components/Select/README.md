# Select

Choose one option from a list; an input-shaped trigger opening a dropdown.

**Vue:** `<CsSelect v-model="selected" :options="[{ value, label, description, disabled }]" placeholder="Choose a type" :invalid>`. Trigger = `.cs-select__trigger` with `caret-down-filled`; list = `.cs-dropdown` of `.cs-option` (`role="listbox"/"option"`).

- Dropdown: 2px `color-border-dropdown-container`, `border-radius-dropdown`, `shadow-dropdown`, 4px offset below the trigger, teleported to `body` when inside overflow containers.
- Highlighted option: `color-background-dropdown-item-hover` + 2px `color-border-dropdown-item-hover`; selected: `color-background-dropdown-item-selected` + `color-border-item-selected` + `check` icon.
- Keyboard: ↑/↓ move highlight, Enter selects, Esc closes, typing jumps.
