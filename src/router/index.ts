import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/PublicLayout.vue'),
      children: [
        { path: '', name: 'landing', component: () => import('@/pages/LandingPage.vue') },
        {
          path: 'login',
          name: 'login',
          component: () => import('@/pages/LoginPage.vue'),
          meta: { guestOnly: true },
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('@/pages/RegisterPage.vue'),
          meta: { guestOnly: true },
        },
      ],
    },
    {
      path: '/dashboard',
      component: () => import('@/layouts/DashboardLayout.vue'),
      meta: { requireAuth: true },
      children: [
        { path: '', name: 'dashboard', component: () => import('@/pages/DashboardPage.vue') },
        { path: ':code', name: 'analytics', component: () => import('@/pages/AnalyticsPage.vue') },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/NotFoundPage.vue'),
    },
  ],
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  // Wait for auth initialization
  if (!authStore.initialized) {
    await authStore.initialize()
  }

  if (to.meta.requireAuth && !authStore.isAuthenticated) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return { path: '/dashboard' }
  }
})

router.afterEach((to) => {
  const titles: Record<string, string> = {
    landing: 'URL Shortener',
    login: 'Login — URL Shortener',
    register: 'Register — URL Shortener',
    dashboard: 'Dashboard — URL Shortener',
    analytics: 'Analytics — URL Shortener',
  }
  document.title = titles[to.name as string] ?? 'URL Shortener'
})

export default router
