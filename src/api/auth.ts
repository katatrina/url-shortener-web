import { api, type RequestOptions } from './client'
import type { AuthResponse, LoginRequest, SignupRequest, User } from './types'

export function signup(body: SignupRequest) {
  return api.post<AuthResponse>('/auth/signup', body, { auth: false })
}

export function login(body: LoginRequest) {
  return api.post<AuthResponse>('/auth/login', body, { auth: false })
}

export function getMe(options?: Omit<RequestOptions, 'body'>) {
  return api.get<User>('/me', options)
}
