# AppLayout

The page scaffold every screen uses: dark TopNavigation, SideNavigation panel, then the main column.

**Vue:** `App.vue` renders `<CsTopNavigation>` and a `<CsAppLayout>` with `#navigation` (SideNavigation), `#breadcrumbs`, `#notifications` (Flashbar) and the default slot holding `<router-view>`.

- Main order: breadcrumbs → flashbar → h1 Header → containers, stacked with `space-scaled-l`.
- Main padding `space-static-xxl` inline; `color-background-layout-main` behind everything.
- Panels (navigation, tools) collapse below 688px wide.
