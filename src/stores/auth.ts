import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getMe } from '@/api/auth'
import type { UserResponse } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<UserResponse | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const initialized = ref(false)

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  async function initialize() {
    if (!token.value) {
      initialized.value = true
      return
    }
    try {
      const res = await getMe()
      user.value = res.data.data
    } catch {
      token.value = null
      localStorage.removeItem('token')
    } finally {
      initialized.value = true
    }
  }

  function setAuth(accessToken: string, userData: UserResponse) {
    token.value = accessToken
    user.value = userData
    localStorage.setItem('token', accessToken)
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  return { user, token, initialized, isAuthenticated, initialize, setAuth, logout }
})
