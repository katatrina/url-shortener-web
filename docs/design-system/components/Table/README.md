# Table

Tabular data with a bold column-header row and hairline row dividers, inside a Container.

**Vue:** `<CsTable :items :columns="[{ id, header, cell: item => …, sortable }]" :selection-type="'single'|'multi'" v-model:selected-items :loading :empty>` with an `#header` slot (a `CsHeader variant="h2"` with counter) — renders the markup in the preview.

- Column headers `heading-xs` weight in `color-text-column-header`, short vertical dividers between them.
- Rows: hover `color-background-dropdown-item-hover`; selected `color-background-item-selected` with `color-border-item-selected` above and below.
- First column is the resource name as a secondary Link; IDs in `code`; state as StatusIndicator.
- Pagination, preferences and text filter sit in the header's tools row (not built here).
