<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { login } from '@/api/auth'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'
import Card from '@/components/ui/Card.vue'
import type { FieldError } from '@/types'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const fieldErrors = ref<FieldError[]>([])

async function handleSubmit() {
  error.value = ''
  fieldErrors.value = []

  if (!email.value || !password.value) {
    error.value = 'Please fill in all fields'
    return
  }

  loading.value = true
  try {
    const res = await login({ email: email.value, password: password.value })
    authStore.setAuth(res.data.data.accessToken, res.data.data.user)
    const redirect = (route.query.redirect as string) || '/dashboard'
    router.push(redirect)
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { message?: string; errors?: FieldError[] } } }
    if (axiosErr.response?.data?.errors) {
      fieldErrors.value = axiosErr.response.data.errors
    }
    error.value = axiosErr.response?.data?.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex items-center justify-center px-4 py-16">
    <Card class="w-full max-w-md p-8">
      <div class="mb-6 text-center">
        <h1 class="text-2xl font-bold">Welcome back</h1>
        <p class="mt-1 text-sm text-muted-foreground">Sign in to your account</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-2">
          <Label>Email</Label>
          <Input v-model="email" type="email" placeholder="you@example.com" autocomplete="email" />
        </div>

        <div class="space-y-2">
          <Label>Password</Label>
          <Input v-model="password" type="password" placeholder="Enter your password" autocomplete="current-password" />
        </div>

        <p v-if="error" class="text-sm text-destructive">{{ error }}</p>
        <p v-for="fe in fieldErrors" :key="fe.field" class="text-sm text-destructive">{{ fe.message }}</p>

        <Button :loading="loading" class="w-full">Log In</Button>
      </form>

      <p class="mt-6 text-center text-sm text-muted-foreground">
        Don't have an account?
        <RouterLink to="/register" class="font-medium text-primary hover:underline">Sign up</RouterLink>
      </p>
    </Card>
  </div>
</template>
