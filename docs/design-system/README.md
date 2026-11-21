The visual language of the AWS Management Console after its 2024 visual refresh, packaged for a **Vue 3** frontend. It is Cloudscape (AWS's open-source design system) with its `visual-refresh` theme: thin 1px strokes instead of drop shadows, rounder shapes (pill buttons, 16px containers), denser layouts, a dark top navigation, and full light and dark modes. Every value in `tokens.json` is copied exactly from Cloudscape. Nothing is approximated.

Cloudscape ships React components only. In this system the components are **framework-free HTML + CSS** (`components/bundle.css`, classes prefixed `cs-`). A Vue app wraps each one in a single-file component. Port the markup in each `components/<Comp>/preview.html` and the prop shapes in `components/index.d.ts`. Do not import `@cloudscape-design/components`.

## Using this system in the Vue app

- Load `tokens.css` once, then `components/bundle.css`. In `main.ts`, import both before any component styles. Never paste raw hex values into components. Every color, space, radius and font size is a `var(--…)` named in `tokens.json`.
- Set the theme on `<html data-theme="light|dark">`. The first theme (`light`) is the fallback. Dark mode is a token swap only: component CSS never branches on the theme.
- **Top navigation is always dark.** Render it inside `data-theme="dark"`, whatever the page theme. Cloudscape does this through its top-navigation context.
- Density: the tokens hold **comfortable** values. Compact density changes only the `space-scaled-*`, `space-*-vertical` and `size-*` tokens. Each token's usage note gives its compact value. To support compact density, add a `[data-density="compact"]` block that overrides those custom properties. Never use it to change `space-static-*`.
- Recommended Vue structure: `src/components/cs/CsButton.vue`, `CsInput.vue` and so on, one per folder under `components/`. Each SFC renders the preview's markup and exposes the props in `index.d.ts`. Use `v-model` for Input, Select, Checkbox, Toggle and Tabs (`activeTabId`). Use slots for Header (`actions`, `description`, `counter`), Container (`header`, `footer`) and Modal (`footer`).
- The page scaffold is `AppLayout`: TopNavigation, then SideNavigation and main. Main holds BreadcrumbGroup, Flashbar, an h1 Header, then Containers. Keep this order on every page.

## Content fundamentals

- Sentence case everywhere: titles, buttons, tabs, column headers ("Launch instance", not "Launch Instance").
- Buttons start with a verb and name the object: "Create bucket", "Delete instance". The primary action of a page or modal is the only `cs-btn--primary`.
- Speak to the user as "you". Use present tense and active voice. No exclamation marks, no emoji, no "please".
- Errors say what happened and how to fix it: "Name can contain only letters, numbers and hyphens." Put them in the FormField `error` slot, never in an alert.
- Confirmations repeat the object: "Delete instance?" / "Permanently delete api-prod-1? You can't undo this action."
- Show IDs, ARNs, IPs and CLI output in the `code` text style.
- Show empty states as a centered `cs-table-empty` with one sentence and one action.

## Visual foundations

**Color.** Use semantic tokens only, grouped by role: `color-background-*`, `color-border-*`, `color-text-*`. Pairs:
- Text: body text uses `color-text-body-default` on `color-background-container-content` / `color-background-layout-main` (18.5:1 light, 10.0:1 dark). Secondary text uses `color-text-body-secondary`. Headings use `color-text-heading-default`.
- Links and accents: links use `color-text-link-default` (5.0:1 light, 7.4:1 dark). Selected and active elements use `color-text-accent` and `color-border-item-selected` on `color-background-item-selected`.
- Status: `color-text-status-success|error|warning|info|inactive`. Always pair them with a status icon and a word, never color alone.
- Exceptions to 4.5:1: disabled text tokens fall below it. That is WCAG-exempt, and each usage note says so. Breadcrumb chevrons use `color-text-breadcrumb-icon` (3:1, icons only).
- Charts: categorical series use `color-charts-palette-categorical-1…10`. Severity uses `color-charts-status-*`. Grid lines use `color-charts-line-*`.

**Type.**
- Font: Open Sans (variable, 300–800, Latin + Vietnamese) for everything, with `--font-base`. Monospace uses `--font-mono`.
- Headings: page title `heading-xl` (24/30, 700). Container title `heading-l` (20/24). Section and modal title `heading-m` (18/22). Labels and column headers `heading-xs` (14/18, 700).
- Body: body text `body-m` (14/20). Descriptions, constraints and badges `body-s` (12/16).
- Tabs and button labels are bold (`font-weight-button`, `font-weight-tabs`). Headings carry slightly negative tracking (`letter-spacing-heading-*`).

**Spacing.** There are two scales:
- `space-static-*` (2·4·8·12·16·20·24·32·40px) never changes with density. Use it for gaps between inline items and fixed insets.
- `space-scaled-*` shrinks in compact mode. Use it for vertical rhythm inside containers and tables.
- Fixed insets: container inline padding is `space-container-horizontal` (20px). Page main padding is `space-static-xxl` (32px) inline. Stack containers with `space-scaled-l` (20px).

**Shape.**
- Pills and corners: buttons are pills (`border-radius-button` 20px). Containers, cards and modals use `border-radius-container` (16px). Alerts and flashbars use `border-radius-alert` / `border-radius-flashbar` (12px).
- Small controls: inputs, dropdowns and options use `border-radius-input` / `border-radius-dropdown` / `border-radius-item` (8px). Badges use `border-radius-badge` (4px). Checkboxes use `border-radius-checkbox` (3px).
- Borders, not shadows: containers have a 1px `color-border-divider-default` stroke and **no shadow**. Shadows are reserved for floating layers: `shadow-dropdown` (dropdowns, popovers), `shadow-modal`, `shadow-flash-sticky` (flashbar).
- Buttons have a 2px border (`border-width-button`). Inputs have 1px (`border-width-field`). Invalid and warning inputs thicken the start edge to 8px (`border-width-field-status-inline-start`).

**States.**
- Hover, active and disabled each have their own token per component (`color-background-button-normal-hover`, …). Never darken with filters or opacity.
- Keyboard focus is a solid 2px ring in `color-border-item-focused` (#006ce0 light / #42b4ff dark, ≥3:1 on both grounds), offset 4px around buttons and 2px elsewhere. Use corner `border-radius-control-default-focus-ring`. Show it only on `:focus-visible`.

**Motion.**
- Quick and functional: 115ms `cubic-bezier(0, 0, 0, 1)` (motion-duration-responsive / motion-easing-responsive) for toggles, carets and hovers. 165ms `cubic-bezier(0.84, 0, 0.16, 1)` (expressive) for panels and flash entry. 250ms (complex) for multi-step transitions.
- Honor `prefers-reduced-motion` by setting all durations to 0ms.

**Layout.**
- Top navigation is 56px tall (`space-static-xxxl` + `space-scaled-m`).
- Side navigation is 280px wide with `space-panel-side-left` (28px) inset.
- Content is a single column of containers. Use a 2- to 4-column grid of key-value pairs inside "details" containers (label in `heading-xs` with `color-text-label`, value in `body-m`).

## Iconography

- Use Cloudscape's own icon set: 144 SVGs under `assets/Icons/`, all 16×16, 2px stroke, round joins, drawn in `currentColor`. Inline them, for example as a `CsIcon.vue` that renders the SVG markup by `name`, so they take the text color of their context. Shown here as `<img>`, they render black.
- Status icons always pair with their status color: `status-positive` uses success, `status-negative` error, `status-warning` warning, and `status-info` / `status-in-progress` info. `status-pending`, `status-stopped` and `status-not-started` use inactive.
- Chevrons: `caret-down-filled` for select and dropdown triggers. `angle-right` for breadcrumbs. `external` after links that leave the app.
- No emoji, no icon fonts, no other icon libraries.
- There is no logo in this system. The top navigation shows the product name in `heading-m`. Add the product's own mark when one exists.

## Licenses

The tokens and icons come from Cloudscape (Apache-2.0, © Amazon.com, Inc.); keep `assets/Licenses/` with the app. Open Sans is under the SIL Open Font License 1.1. The AWS console itself uses the proprietary "Amazon Ember" font, which is not used or included here.
