import axios from 'axios'
import { toast } from 'vue-sonner'
import router from '@/router'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + '/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      toast.error('Network error, check your connection')
      return Promise.reject(error)
    }

    const status = error.response.status
    const code = error.response.data?.code

    if (status === 401 && code !== 'INVALID_CREDENTIALS') {
      localStorage.removeItem('token')
      const currentRoute = router.currentRoute.value
      if (currentRoute.path !== '/login') {
        router.push({ path: '/login', query: { redirect: currentRoute.fullPath } })
      }
    } else if (status === 429) {
      toast.error('Rate limit exceeded, try again later')
    } else if (status >= 500) {
      toast.error('Something went wrong')
    }

    return Promise.reject(error)
  }
)

export default client
