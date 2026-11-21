# Header

Title row for a page (h1), container (h2) or section (h3) with optional counter, description and actions.

**Vue:** `<CsHeader variant="h1|h2|h3" :counter="'(24)'" description>Instances<template #actions>…buttons…</template></CsHeader>`.

- h1 `heading-xl`, h2 `heading-l`, h3 `heading-m`; counter in `color-text-counter`, normal weight; description `color-text-heading-secondary`.
- Actions align right, gap `space-static-xs`, primary last (rightmost).
- One h1 per page.
