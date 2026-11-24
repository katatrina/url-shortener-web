import { api } from './client'
import type { CreateLinkRequest, Link, LinkStats, ListLinksResponse, StatsRange } from './types'

/** Matches the backend's MAX_LINKS_PER_USER. */
export const LINK_QUOTA = 10

export const SHORT_URL_BASE = (import.meta.env.VITE_SHORT_URL_BASE || 'http://short.localhost:8080').replace(/\/+$/, '')

export const linkKeys = {
  all: ['links'] as const,
  // Not under 'links', so invalidating the list doesn't refetch a link that was just deleted.
  detail: (id: string) => ['link', id] as const,
  stats: (id: string, range: StatsRange) => ['link', id, 'stats', range] as const,
}

/** Newest first. */
export async function listLinks(): Promise<Link[]> {
  const res = await api.get<ListLinksResponse>('/links')
  return res.items
}

export function getLink(id: string) {
  return api.get<Link>(`/links/${encodeURIComponent(id)}`)
}

/** The backend only takes "UTC" or "Area/City" names. */
function browserTimeZone(): string {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
  return tz?.includes('/') ? tz : 'UTC'
}

export function getLinkStats(id: string, range: StatsRange) {
  return api.get<LinkStats>(`/links/${encodeURIComponent(id)}/stats`, { query: { range, tz: browserTimeZone() } })
}

export function createLink(body: CreateLinkRequest) {
  return api.post<Link>('/links', body)
}

export function deleteLink(id: string) {
  return api.delete(`/links/${encodeURIComponent(id)}`)
}
