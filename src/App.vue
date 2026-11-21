<script setup lang="ts">
import { useRoute } from 'vue-router'
import AppShell from '@/components/AppShell.vue'

const route = useRoute()
</script>

<template>
  <AppShell v-if="route.meta.requiresAuth">
    <RouterView />
  </AppShell>
  <main v-else class="public-page">
    <RouterView />
  </main>
</template>
