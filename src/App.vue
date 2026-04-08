<script setup lang="ts">
import { RouterView } from 'vue-router'
import { Toaster } from 'vue-sonner'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
authStore.initialize()
</script>

<template>
  <Toaster position="top-right" :duration="3000" rich-colors />
  <RouterView />
</template>
