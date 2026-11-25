<script setup lang="ts">
import { onBeforeUnmount, onMounted, watch } from 'vue'
import { vi } from '@nuxt/ui/locale'
import { useRoute, useRouter } from 'vue-router'
import AppShell from '@/components/AppShell.vue'
import SessionError from '@/components/SessionError.vue'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const toaster = { duration: 4000, progress: false, ui: { viewport: 'toast-viewport sm:w-64' } }

// A focused toast never times out, so clicking one must not focus it. Keyboard focus still pauses it.
function onMouseDown(event: MouseEvent) {
  if (event.target instanceof Element && event.target.closest('.toast-viewport')) event.preventDefault()
}

// Reka stays paused when the last toast is closed under the pointer (by swiping), so the next one would never time out.
const { toasts, add: addToast } = useToast()
watch(
  () => toasts.value.length,
  (count, previous) => {
    if (previous > 0 || count === 0) return
    // Wait for the toast to mount.
    setTimeout(() => document.querySelector('.toast-viewport')?.dispatchEvent(new PointerEvent('pointerleave')), 100)
  },
)

// A page's code could not be loaded: offline, or a new version was deployed and the old files are gone.
const RELOADED_KEY = 'reloadedFor'
onBeforeUnmount(
  router.onError(async (error, to) => {
    if (!/dynamically imported module|importing a module script|preload CSS/i.test(String(error?.message))) return
    const online = await fetch(import.meta.env.BASE_URL, { method: 'HEAD', cache: 'no-store' }).then(
      (res) => res.ok,
      () => false,
    )
    // Reload to get the new version, but only once per page.
    if (online && sessionStorage.getItem(RELOADED_KEY) !== to.fullPath) {
      sessionStorage.setItem(RELOADED_KEY, to.fullPath)
      window.location.assign(to.fullPath)
      return
    }
    addToast({ id: 'page', title: 'Không mở được trang', icon: 'i-lucide-circle-alert', color: 'error', close: false })
  }),
)
onBeforeUnmount(router.afterEach((_to, _from, failure) => !failure && sessionStorage.removeItem(RELOADED_KEY)))

onMounted(() => document.addEventListener('mousedown', onMouseDown))
onBeforeUnmount(() => document.removeEventListener('mousedown', onMouseDown))
</script>

<template>
  <UApp :locale="vi" :toaster="toaster">
    <SessionError v-if="route.meta.requiresAuth && auth.restoreError" />
    <AppShell v-else-if="route.meta.requiresAuth">
      <RouterView :key="route.path" />
    </AppShell>
    <main v-else class="public-page">
      <RouterView />
    </main>
  </UApp>
</template>
