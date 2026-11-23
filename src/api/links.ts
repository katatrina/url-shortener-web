import { api } from './client'
import type { CreateLinkRequest, Link, ListLinksResponse } from './types'

/** Matches the backend's MAX_LINKS_PER_USER. */
export const LINK_QUOTA = 10

export const SHORT_URL_BASE = (import.meta.env.VITE_SHORT_URL_BASE || 'http://short.localhost:8080').replace(/\/+$/, '')

export const linkKeys = {
  all: ['links'] as const,
}

/** Newest first. */
export async function listLinks(): Promise<Link[]> {
  const res = await api.get<ListLinksResponse>('/links')
  return res.items
}

export function createLink(body: CreateLinkRequest) {
  return api.post<Link>('/links', body)
}

export function deleteLink(id: string) {
  return api.delete(`/links/${encodeURIComponent(id)}`)
}
