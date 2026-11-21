# Alert

In-page message about the current view, with a 2px colored border and a tinted fill.

**Vue:** `<CsAlert type="info|success|warning|error" :header :dismissible @dismiss><template #action><CsButton>…</CsButton></template>Body</CsAlert>`.

- `role="alert"` for error, `role="status"` otherwise.
- Use for persistent, contextual information; use Flashbar for results of user actions; use FormField errors for validation.
