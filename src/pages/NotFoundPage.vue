<script setup lang="ts">
import { RouterLink } from 'vue-router'
import Button from '@/components/ui/Button.vue'
import { Home } from 'lucide-vue-next'
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center px-4 text-center">
    <h1 class="text-6xl font-bold text-muted-foreground">404</h1>
    <p class="mt-4 text-xl font-semibold">Page not found</p>
    <p class="mt-2 text-muted-foreground">The page you're looking for doesn't exist.</p>
    <RouterLink to="/" class="mt-6">
      <Button>
        <Home class="mr-2 h-4 w-4" />
        Go Home
      </Button>
    </RouterLink>
  </div>
</template>
