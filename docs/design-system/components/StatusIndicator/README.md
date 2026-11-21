# StatusIndicator

Resource state as a colored status icon plus a word.

**Vue:** `<CsStatusIndicator type="success|error|warning|info|in-progress|pending|stopped|not-started" :colored-text="false">Running</CsStatusIndicator>`.

- Icon carries the color; text stays `color-text-body-default` (use `--colored` only for short standalone states).
- `in-progress` spins the `status-in-progress` icon (honor reduced motion).
- Never rely on color alone — the word is required.
