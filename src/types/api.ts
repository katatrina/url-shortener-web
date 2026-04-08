export interface ApiResponse<T> {
  success: boolean
  code: string
  message: string
  data: T
  meta: {
    requestId: string
    timestamp: number
    pagination?: Pagination
  }
  errors?: FieldError[]
}

export interface Pagination {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface FieldError {
  field: string
  value: unknown
  code: string
  message: string
}

export interface UrlResponse {
  shortCode: string
  shortUrl: string
  longUrl: string
  clickCount: number
  expiresAt: number | null
  createdAt: number
}

export interface UserResponse {
  id: string
  email: string
  fullName: string
  createdAt: number
}

export interface LoginResponse {
  accessToken: string
  accessTokenExpiresAt: number
  user: UserResponse
}

export interface UrlStatsResponse {
  totalClicks: number
  dailyClicks: DailyClick[]
  topReferrers: ReferrerStat[]
  topCountries: CountryStat[]
  topOSes: OSStat[]
  topBrowsers: BrowserStat[]
  topDevices: DeviceStat[]
}

export interface DailyClick {
  date: number
  clickCount: number
}

export interface ReferrerStat {
  referer: string
  clickCount: number
}

export interface CountryStat {
  country: string
  clickCount: number
}

export interface OSStat {
  os: string
  clickCount: number
}

export interface BrowserStat {
  browser: string
  clickCount: number
}

export interface DeviceStat {
  deviceType: string
  clickCount: number
}

export interface ShortenRequest {
  longUrl: string
  customAlias?: string
  expiresAt?: number
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  fullName: string
  password: string
}
