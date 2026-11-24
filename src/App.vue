<script setup lang="ts">
import { vi } from '@nuxt/ui/locale'
import { useRoute } from 'vue-router'
import AppShell from '@/components/AppShell.vue'

const route = useRoute()
</script>

<template>
  <UApp :locale="vi" :toaster="{ duration: 10000 }">
    <AppShell v-if="route.meta.requiresAuth">
      <RouterView :key="route.path" />
    </AppShell>
    <main v-else class="public-page">
      <RouterView />
    </main>
  </UApp>
</template>
