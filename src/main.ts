// Design system first: tokens, then component styles (docs/design-system/README.md).
import './styles/tokens.css'
import './styles/cs.css'
import './styles/global.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'
import App from './App.vue'
import router from './router'
import { configureApiClient } from './api/client'
import { queryClient } from './api/queryClient'
import { useAuthStore } from './stores/auth'

const app = createApp(App)

app.use(createPinia())
app.use(VueQueryPlugin, { queryClient })

const auth = useAuthStore()

configureApiClient({
  getToken: () => auth.token,
  onUnauthorized: () => {
    // Several requests can fail at once; only the first one signs out and redirects.
    if (!auth.token) return
    auth.logout()
    const current = router.currentRoute.value
    if (current.name === 'login') return
    router.replace({ name: 'login', query: { redirect: current.fullPath } })
  },
})

app.use(router)
app.mount('#app')
