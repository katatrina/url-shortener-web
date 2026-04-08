import client from './client'
import type { ApiResponse, LoginResponse, UserResponse, LoginRequest, RegisterRequest } from '@/types'

export function login(data: LoginRequest) {
  return client.post<ApiResponse<LoginResponse>>('/auth/login', data)
}

export function register(data: RegisterRequest) {
  return client.post<ApiResponse<UserResponse>>('/auth/register', data)
}

export function getMe() {
  return client.get<ApiResponse<UserResponse>>('/me/profile')
}
