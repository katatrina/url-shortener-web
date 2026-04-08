import client from './client'
import type { ApiResponse, UrlStatsResponse } from '@/types'

export function getUrlStats(code: string, days: number = 30) {
  return client.get<ApiResponse<UrlStatsResponse>>(`/me/urls/${code}/stats`, {
    params: { days },
  })
}
