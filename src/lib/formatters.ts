import { format, formatDistanceToNow, fromUnixTime } from 'date-fns'

export function formatDate(timestamp: number): string {
  return format(fromUnixTime(timestamp), 'MMM d, yyyy')
}

export function formatTimeAgo(timestamp: number): string {
  return formatDistanceToNow(fromUnixTime(timestamp), { addSuffix: true })
}

export function formatNumber(n: number): string {
  return n.toLocaleString()
}

export function truncateUrl(url: string, maxLength: number = 50): string {
  if (url.length <= maxLength) return url
  return url.slice(0, maxLength) + '...'
}
