import type { LocationQueryValue } from 'vue-router'

/**
 * Returns `value` when it is an in-app path, else null.
 * Accepts only paths starting with "/" and rejects protocol-relative ("//evil.com")
 * and backslash ("/\evil.com") forms, which browsers treat as another origin.
 */
export function safeRedirect(value: LocationQueryValue | LocationQueryValue[] | undefined): string | null {
  const path = Array.isArray(value) ? value[0] : value
  if (typeof path !== 'string') return null
  if (!path.startsWith('/') || path.startsWith('//') || path.startsWith('/\\')) return null
  return path
}
