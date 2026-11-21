import type { ErrorCode, FieldError } from './types'

const DEFAULT_API_URL = 'http://localhost:8080'

export const API_URL = (import.meta.env.VITE_API_URL || DEFAULT_API_URL).replace(/\/+$/, '')

/** Client-side codes for failures that never produced a backend error body. */
export type ClientErrorCode = 'NETWORK_ERROR' | 'INVALID_RESPONSE'

export class ApiError extends Error {
  readonly status: number
  readonly code: ErrorCode | ClientErrorCode
  readonly fields: FieldError[]

  constructor(status: number, code: ErrorCode | ClientErrorCode, message: string, fields: FieldError[] = []) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.fields = fields
  }
}

interface ClientConfig {
  /** Returns the current access token, or null when signed out. */
  getToken: () => string | null
  /** Called when an authenticated request (one that sent a token) gets a 401. */
  onUnauthorized: () => void
}

let config: ClientConfig = {
  getToken: () => null,
  onUnauthorized: () => {},
}

export function configureApiClient(next: ClientConfig): void {
  config = next
}

export interface RequestOptions {
  body?: unknown
  query?: Record<string, string | number | boolean | undefined>
  /** Send the Authorization header when a token exists. Default true. */
  auth?: boolean
  /** Do not trigger the global 401 handler (used by the session restore on startup). */
  skipUnauthorizedHandler?: boolean
  signal?: AbortSignal
}

export async function request<T>(method: string, path: string, options: RequestOptions = {}): Promise<T> {
  const { body, query, auth = true, skipUnauthorizedHandler = false, signal } = options

  const url = new URL(API_URL + path)
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) url.searchParams.set(key, String(value))
    }
  }

  const headers: Record<string, string> = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  const token = auth ? config.getToken() : null
  if (token) headers.Authorization = `Bearer ${token}`

  let res: Response
  try {
    res = await fetch(url, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    })
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') throw err
    throw new ApiError(0, 'NETWORK_ERROR', 'Không thể kết nối tới máy chủ. Hãy kiểm tra mạng và thử lại.')
  }

  if (res.status === 204) return undefined as T

  const payload = await readJson(res)

  if (!res.ok) {
    if (res.status === 401 && token && !skipUnauthorizedHandler) config.onUnauthorized()

    const error = isRecord(payload) && isRecord(payload.error) ? payload.error : null
    if (error && typeof error.code === 'string' && typeof error.message === 'string') {
      const fields = Array.isArray(error.fields) ? (error.fields as FieldError[]) : []
      throw new ApiError(res.status, error.code as ErrorCode, error.message, fields)
    }
    throw new ApiError(res.status, 'INVALID_RESPONSE', `Máy chủ trả về lỗi ${res.status}.`)
  }

  if (isRecord(payload) && 'data' in payload) return payload.data as T
  throw new ApiError(res.status, 'INVALID_RESPONSE', 'Phản hồi từ máy chủ không hợp lệ.')
}

async function readJson(res: Response): Promise<unknown> {
  const text = await res.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export const api = {
  get: <T>(path: string, options?: Omit<RequestOptions, 'body'>) => request<T>('GET', path, options),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) => request<T>('POST', path, { ...options, body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) => request<T>('PATCH', path, { ...options, body }),
  delete: <T = void>(path: string, options?: Omit<RequestOptions, 'body'>) => request<T>('DELETE', path, options),
}
