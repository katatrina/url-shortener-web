<script setup lang="ts">
// Layout for signed-in pages: dark top navigation, then a centered column.
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import CsButtonDropdown from '@/components/cs/CsButtonDropdown.vue'
import CsFlashbar from '@/components/cs/CsFlashbar.vue'
import CsTopNavigation from '@/components/cs/CsTopNavigation.vue'
import { BRAND_NAME } from '@/config/brand'
import { useAuthStore } from '@/stores/auth'
import { useFlashStore } from '@/stores/flash'

const auth = useAuthStore()
const flash = useFlashStore()
const router = useRouter()

const initial = computed(() => auth.user?.email.charAt(0).toUpperCase() ?? '')

function onMenuClick(id: string) {
  if (id !== 'logout') return
  auth.logout()
  router.push({ name: 'home' })
}
</script>

<template>
  <div class="cs-app">
    <CsTopNavigation :identity="{ title: BRAND_NAME, to: { name: 'links' } }">
      <template #utilities>
        <CsButtonDropdown :items="[{ id: 'logout', text: 'Đăng xuất', iconName: 'sign-out' }]" @item-click="onMenuClick">
          <template #trigger>
            <button class="app-shell__avatar" type="button" :aria-label="`Tài khoản ${auth.user?.email ?? ''}`">{{ initial }}</button>
          </template>
          <template #header>{{ auth.user?.email }}</template>
        </CsButtonDropdown>
      </template>
    </CsTopNavigation>
    <div class="cs-app__body">
      <main class="cs-app__main app-shell__main">
        <CsFlashbar :items="flash.items" @dismiss="flash.dismiss" />
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-shell__main {
  max-width: 1080px;
  margin: 0 auto;
  padding-top: var(--space-scaled-xxl);
}

.app-shell__avatar {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid var(--color-border-segment-wrapper);
  border-radius: 50%;
  background: none;
  color: var(--color-text-body-default);
  font: inherit;
  font-weight: var(--font-weight-bold);
  cursor: pointer;
}

.app-shell__avatar:hover {
  background: var(--color-background-dropdown-item-hover);
}

.app-shell__avatar:focus-visible {
  outline: 2px solid var(--color-border-item-focused);
  outline-offset: 2px;
}
</style>
