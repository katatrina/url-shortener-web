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

/** Vietnamese country name of an ISO 3166-1 alpha-2 code. */
export function countryName(code: string): string {
  if (!/^[A-Za-z]{2}$/.test(code)) return 'Không xác định'
  return new Intl.DisplayNames(['vi'], { type: 'region' }).of(code.toUpperCase()) ?? code
}

export function stripProtocol(url: string): string {
  return url.replace(/^https?:\/\//i, '')
}
