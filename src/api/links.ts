import { api } from './client'
import type { Link, ListLinksResponse } from './types'

export const linkKeys = {
  all: ['links'] as const,
}

/** Newest first. */
export async function listLinks(): Promise<Link[]> {
  const res = await api.get<ListLinksResponse>('/links')
  return res.items
}
