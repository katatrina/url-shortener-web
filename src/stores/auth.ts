import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { getMe } from '@/api/auth'
import { ApiError } from '@/api/client'
import { queryClient } from '@/api/queryClient'
import type { User } from '@/api/types'

const TOKEN_KEY = 'accessToken'

function readToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

function writeToken(token: string | null): void {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    // Storage unavailable (private mode, blocked site data): keep the session in memory only.
  }
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(readToken())
  const user = ref<User | null>(null)

  const isAuthenticated = computed(() => token.value !== null && user.value !== null)

  function setSession(nextToken: string, nextUser: User): void {
    token.value = nextToken
    user.value = nextUser
    writeToken(nextToken)
  }

  function logout(): void {
    token.value = null
    user.value = null
    writeToken(null)
    // Drop cached data of the previous user.
    queryClient.clear()
  }

  /** Loads the user for a stored token. Clears the token when the backend rejects it. */
  async function restore(): Promise<void> {
    if (!token.value) return
    try {
      user.value = await getMe({ skipUnauthorizedHandler: true })
    } catch (err) {
      if (err instanceof ApiError && (err.status === 401 || err.code === 'USER_NOT_FOUND')) {
        logout()
        return
      }
      // Network or server error: keep the token so a reload can retry, but stay signed out for now.
      user.value = null
      console.warn('Could not restore session', err)
    }
  }

  return { token, user, isAuthenticated, setSession, logout, restore }
})
