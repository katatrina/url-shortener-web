import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    /** Only signed-in users may visit; others go to /login?redirect=<path>. */
    requiresAuth?: boolean
    /** Only signed-out users may visit; signed-in users go to /dashboard. */
    guestOnly?: boolean
  }
}

export {}
