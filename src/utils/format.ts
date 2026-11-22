// Dates and times are shown in the viewer's local time zone.

const pad = (n: number) => String(n).padStart(2, '0')

function toDate(value: string | Date): Date | null {
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

/** `dd/mm/yyyy`, e.g. `23/05/2026`. */
export function formatDate(value: string | Date): string {
  const date = toDate(value)
  if (!date) return ''
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`
}

/** 24-hour `HH:mm`, e.g. `14:30`. */
export function formatTime(value: string | Date): string {
  const date = toDate(value)
  if (!date) return ''
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`
}

const numberFormat = new Intl.NumberFormat('en-US')

/** Comma thousands separator, e.g. `1,234`. */
export function formatNumber(value: number): string {
  return numberFormat.format(value)
}

/** Host name of a URL without `www.`, e.g. `example.com`. Returns the input when it is not a URL. */
export function urlDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}
