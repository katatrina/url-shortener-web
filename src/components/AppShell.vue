<script setup lang="ts">
// Layout for signed-in pages: top bar and sidebar around a scrolling content panel.
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { DropdownMenuItem, NavigationMenuItem } from '@nuxt/ui'
import AnimatedLinkIcon from '@/components/icons/AnimatedLinkIcon.vue'
import { BRAND_NAME } from '@/config/brand'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const toast = useToast()

const initial = computed(() => auth.user?.email.charAt(0).toUpperCase() ?? '')

const menuItems = computed<DropdownMenuItem[][]>(() => [
  [{ type: 'label', label: auth.user?.email ?? '' }],
  [{ label: 'Đăng xuất', icon: 'i-lucide-log-out', onSelect: logout }],
])

const navItems = computed<NavigationMenuItem[]>(() => {
  const active = route.path.startsWith('/links')
  return [
    {
      label: 'Link',
      icon: AnimatedLinkIcon,
      to: { name: 'links' },
      active,
      ui: { link: active ? 'before:bg-info/10' : '' },
    },
  ]
})

function logout() {
  auth.logout()
  router.push({ name: 'home' })
}

// Don't show the previous user's notifications after signing out.
watch(
  () => auth.token,
  (token) => {
    if (!token) toast.clear()
  },
)
</script>

<template>
  <div data-app-shell class="flex h-dvh flex-col bg-accented text-sm text-default">
    <header class="flex h-14 shrink-0 items-center justify-between px-6">
      <ULink :to="{ name: 'links' }" class="text-base font-semibold text-highlighted hover:text-highlighted">
        {{ BRAND_NAME }}
      </ULink>
      <UDropdownMenu :items="menuItems" :content="{ align: 'end' }" :modal="false" :ui="{ content: 'max-w-80' }">
        <UButton
          color="neutral"
          variant="ghost"
          square
          class="rounded-full p-1 data-[state=open]:bg-elevated"
          :aria-label="`Tài khoản ${auth.user?.email ?? ''}`"
        >
          <UAvatar :text="initial" size="sm" />
        </UButton>
      </UDropdownMenu>
    </header>
    <div class="flex min-h-0 flex-1 gap-2 px-2 pb-2">
      <!-- isolate: the menu draws its item background at z-index -1. -->
      <aside class="isolate w-56 shrink-0 rounded-lg bg-elevated p-3">
        <UNavigationMenu :items="navItems" orientation="vertical" color="info" aria-label="Điều hướng chính" />
      </aside>
      <main class="relative min-w-0 flex-1 overflow-y-auto rounded-lg bg-default">
        <slot />
      </main>
    </div>
  </div>
</template>
