# Tabs

Switches between peer views of the same resource; bold 16px labels with a 4px rounded underline on the active tab.

**Vue:** `<CsTabs v-model:active-tab-id="tab" :tabs="[{ id, label, disabled }]">` with a slot per tab id. Use `role="tablist"`, roving tabindex and ←/→ keys.

- Active label `color-text-accent`, underline `color-border-tabs-underline`; short `color-border-tabs-divider` rules between labels.
- Sync the active tab to the route query so it survives reloads.
