// Types mirroring the backend DTOs (katatrina/url-shortener, branch main).
// Timestamps are RFC 3339 strings as serialized by Go's time.Time.

// ---- Envelope (internal/response) ----

export interface SuccessEnvelope<T> {
  data: T
}

export interface ErrorEnvelope {
  error: ErrorBody
}

export interface ErrorBody {
  code: ErrorCode
  message: string
  /** Omitted by the backend when empty. */
  fields?: FieldError[]
}

// ---- Errors (internal/apperror) ----

export type ErrorCode =
  | 'INVALID_JSON_FORMAT'
  | 'VALIDATION_FAILED'
  | 'EMAIL_ALREADY_EXISTS'
  | 'INTERNAL_SERVER_ERROR'
  | 'INCORRECT_CREDENTIALS'
  | 'UNAUTHORIZED'
  | 'PAYLOAD_TOO_LARGE'
  | 'SLUG_ALREADY_EXISTS'
  | 'LINK_QUOTA_EXCEEDED'
  | 'LINK_NOT_FOUND'
  | 'USER_NOT_FOUND'

export type FieldErrorCode = 'REQUIRED' | 'INVALID_FORMAT' | 'TOO_SHORT' | 'TOO_LONG' | 'INVALID'

export interface FieldError {
  field: string
  code: FieldErrorCode
  message: string
}

// ---- User (internal/user/dto.go) ----

export interface SignupRequest {
  email: string
  /** 8–32 characters, at most 72 bytes. */
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface User {
  id: string
  email: string
  fullName: string
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  accessToken: string
  user: User
}

// ---- Link (internal/link/dto.go) ----

export interface CreateLinkRequest {
  destinationUrl: string
  title?: string
  /** 3–30 characters. Omit for a generated slug. */
  slug?: string
}

export interface UpdateLinkRequest {
  destinationUrl?: string
  title?: string
}

export interface Link {
  id: string
  userId: string
  slug: string
  shortUrl: string
  destinationUrl: string
  title: string
  isCustomSlug: boolean
  clicks: number
  createdAt: string
  updatedAt: string
}

export interface ListLinksResponse {
  items: Link[]
}

/** Query `range` for GET /links/:id/stats. Defaults to 7d. */
export type StatsRange = '24h' | '7d' | '30d' | '90d'

export interface ClickSummary {
  clicks: number
  previousClicks: number | null
}

export interface TimePoint {
  timestamp: string
  clicks: number
}

export interface DimensionCount {
  /** "(unknown)" when the dimension was not recorded. */
  value: string
  clicks: number
}

export interface LinkStats {
  id: string
  range: string
  timezone: string
  granularity: string
  from: string
  to: string
  previousFrom: string
  previousTo: string
  summary: ClickSummary
  timeseries: TimePoint[]
  topCountries: DimensionCount[]
  topReferrers: DimensionCount[]
}
