# BreadcrumbGroup

Shows where the page sits in the hierarchy, at the top of the main area.

**Vue:** `<CsBreadcrumbGroup :items="[{ text, href }]" @follow>` → `<nav aria-label="Breadcrumbs"><ol>`; last item is `aria-current="page"`, bold and not a link.

- Links underline only on hover; `angle-right` separators in `color-text-breadcrumb-icon`.
- Build items from the Vue Router matched routes.
