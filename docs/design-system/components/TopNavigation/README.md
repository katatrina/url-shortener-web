# TopNavigation

The global header bar — product identity, search and utilities — always rendered in the dark theme.

**Vue:** `<CsTopNavigation :identity="{ title, href, logo }" :utilities="[{ type: 'button'|'menu-dropdown', iconName, text, items }]">` with an optional `#search` slot. Root element carries `data-theme="dark"`.

- 56px tall; title `heading-m` in `color-text-top-navigation-title`; utilities bold, separated by 1px dividers.
- Sticky at the top of the viewport; the AppLayout below scrolls.
- "Acme Cloud" in the preview is a placeholder: use the product's own name and mark.
