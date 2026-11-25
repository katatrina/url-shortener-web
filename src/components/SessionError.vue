<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { errorMessage } from '@/api/errors'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const retrying = ref(false)

async function retry() {
  retrying.value = true
  await auth.restore()
  retrying.value = false
  // The token turned out to be invalid.
  if (!auth.token) router.replace({ name: 'login', query: { redirect: route.fullPath } })
}
</script>

<template>
  <main class="flex h-dvh flex-col items-center justify-center gap-4 bg-default p-6 text-center text-sm text-default">
    <UIcon name="i-lucide-circle-alert" class="size-8 text-muted" />
    <div>
      <h1 class="text-base font-medium text-highlighted">Không tải được tài khoản</h1>
      <p class="mt-1 text-muted">{{ errorMessage(auth.restoreError) }}</p>
    </div>
    <UButton size="lg" :loading="retrying" @click="retry">Thử lại</UButton>
  </main>
</template>
