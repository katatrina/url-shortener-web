# Container

The basic content surface: white (dark: #161d26) card with a 1px `color-border-divider-default` stroke and 16px radius — no shadow.

**Vue:** `<CsContainer><template #header><CsHeader variant="h2">…</CsHeader></template>…<template #footer>…</template></CsContainer>`. `variant="stacked"` joins adjacent containers.

- Header padding 12/20/8, content padding 4/20/20, footer separated by a divider.
- Tables live inside a container; their header row runs edge to edge.
- Don't nest containers; use h3 sections inside instead.
