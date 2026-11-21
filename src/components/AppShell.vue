<script setup lang="ts">
// Page scaffold for signed-in pages (docs/design-system/components/AppLayout/preview.html):
// dark TopNavigation, then the main column.
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import CsTopNavigation, { type TopNavigationUtility } from '@/components/cs/CsTopNavigation.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const utilities = computed<TopNavigationUtility[]>(() => [
  {
    id: 'user',
    type: 'text',
    iconName: 'user-profile',
    text: auth.user?.email,
    ariaLabel: auth.user ? `Đã đăng nhập: ${auth.user.email}` : undefined,
  },
  { id: 'logout', type: 'button', iconName: 'sign-out', text: 'Đăng xuất' },
])

function onUtilityClick(id: string) {
  if (id === 'logout') {
    auth.logout()
    router.push({ name: 'login' })
  }
}
</script>

<template>
  <div class="cs-app app-shell">
    <CsTopNavigation
      :identity="{ title: 'URL Shortener', to: { name: 'dashboard' } }"
      :utilities="utilities"
      @utility-click="onUtilityClick"
    />
    <div class="cs-app__body">
      <main class="cs-app__main">
        <slot />
      </main>
    </div>
  </div>
</template>
