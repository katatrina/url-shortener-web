import client from './client'
import type { ApiResponse, UrlResponse, ShortenRequest } from '@/types'

export function shortenUrl(data: ShortenRequest) {
  return client.post<ApiResponse<UrlResponse>>('/shorten', data)
}

export function listUrls(page: number = 1, pageSize: number = 10) {
  return client.get<ApiResponse<UrlResponse[]>>('/me/urls', {
    params: { page, pageSize },
  })
}

export function getUrl(code: string) {
  return client.get<ApiResponse<UrlResponse>>(`/me/urls/${code}`)
}

export function deleteUrl(code: string) {
  return client.delete(`/me/urls/${code}`)
}
