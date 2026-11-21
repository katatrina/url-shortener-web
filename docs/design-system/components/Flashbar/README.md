# Flashbar

Stack of solid-color notifications at the top of the content area, reporting the result of an action.

**Vue:** `<CsFlashbar :items="[{ id, type: 'success|error|warning|info', header, content, dismissible, loading }]" @dismiss>` — keep items in a global store (e.g. Pinia) so any page can push one.

- White text (`color-text-notification-default`) on success/info/error; warning uses dark `color-text-notification-yellow`.
- Success messages may auto-dismiss after ~10s; errors stay until dismissed.
- Header bold, then one sentence; include the resource ID.
