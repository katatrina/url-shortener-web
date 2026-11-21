# SideNavigation

Service-level navigation in the left panel: header, links, expandable sections, dividers.

**Vue:** `<CsSideNavigation :header="{ text, href }" :items="[{ type: 'link'|'section'|'divider', text, href, items }]" :active-href="$route.path" @follow>`.

- Links `color-text-body-secondary`; active link `color-text-side-navigation-item-active` + bold; section titles bold `color-text-heading-default`.
- 280px wide, `space-panel-side-left` inset; collapsible on small screens.
