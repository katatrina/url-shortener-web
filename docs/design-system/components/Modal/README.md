# Modal

A blocking dialog for a short, focused decision.

**Vue:** `<CsModal v-model:visible="open" header="Delete instance?" size="small|medium|large">body<template #footer>…</template></CsModal>` — teleported to `body`, focus-trapped, Esc and the close button dismiss.

- Backdrop `color-background-backdrop`; dialog 2px `color-border-dialog`, `border-radius-container`, `shadow-modal`.
- Footer: right-aligned, `link` Cancel then the `primary` action.
- Destructive confirmations name the resource and say it can't be undone.
