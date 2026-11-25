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

  /** Why a stored token could not be checked (network or server error); the token is kept. */
  const restoreError = ref<unknown>(null)

  const isAuthenticated = computed(() => token.value !== null && user.value !== null)

  function setSession(nextToken: string, nextUser: User): void {
    token.value = nextToken
    user.value = nextUser
    restoreError.value = null
    writeToken(nextToken)
  }

  function logout(): void {
    token.value = null
    user.value = null
    restoreError.value = null
    writeToken(null)
    // Drop cached data of the previous user.
    queryClient.clear()
  }

  /** Loads the user for a stored token. Clears the token when the backend rejects it. */
  async function restore(): Promise<void> {
    if (!token.value) return
    try {
      user.value = await getMe({ skipUnauthorizedHandler: true })
      restoreError.value = null
    } catch (err) {
      if (err instanceof ApiError && (err.status === 401 || err.code === 'USER_NOT_FOUND')) {
        logout()
        return
      }
      // Network or server error: keep the token, so the user can retry.
      user.value = null
      restoreError.value = err
    }
  }

  return { token, user, restoreError, isAuthenticated, setSession, logout, restore }
})
