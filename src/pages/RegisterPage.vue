<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { register, login } from '@/api/auth'
import { isStrongPassword } from '@/lib/validators'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'
import Card from '@/components/ui/Card.vue'
import type { FieldError } from '@/types'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const fullName = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const fieldErrors = ref<FieldError[]>([])

async function handleSubmit() {
  error.value = ''
  fieldErrors.value = []

  if (!email.value || !fullName.value || !password.value) {
    error.value = 'Please fill in all fields'
    return
  }
  if (!isStrongPassword(password.value)) {
    error.value = 'Password must be at least 8 characters with uppercase, lowercase, number, and special character'
    return
  }

  loading.value = true
  try {
    await register({
      email: email.value,
      fullName: fullName.value,
      password: password.value,
    })

    // Auto-login after registration
    const loginRes = await login({ email: email.value, password: password.value })
    authStore.setAuth(loginRes.data.data.accessToken, loginRes.data.data.user)
    router.push('/dashboard')
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { message?: string; errors?: FieldError[] } } }
    if (axiosErr.response?.data?.errors) {
      fieldErrors.value = axiosErr.response.data.errors
    }
    error.value = axiosErr.response?.data?.message || 'Registration failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex items-center justify-center px-4 py-16">
    <Card class="w-full max-w-md p-8">
      <div class="mb-6 text-center">
        <h1 class="text-2xl font-bold">Create an account</h1>
        <p class="mt-1 text-sm text-muted-foreground">Start shortening and tracking your links</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-2">
          <Label>Email</Label>
          <Input v-model="email" type="email" placeholder="you@example.com" autocomplete="email" />
        </div>

        <div class="space-y-2">
          <Label>Full Name</Label>
          <Input v-model="fullName" type="text" placeholder="John Doe" autocomplete="name" />
        </div>

        <div class="space-y-2">
          <Label>Password</Label>
          <Input v-model="password" type="password" placeholder="Min 8 chars, mixed case, number & symbol" autocomplete="new-password" />
        </div>

        <p v-if="error" class="text-sm text-destructive">{{ error }}</p>
        <p v-for="fe in fieldErrors" :key="fe.field" class="text-sm text-destructive">{{ fe.message }}</p>

        <Button :loading="loading" class="w-full">Sign Up</Button>
      </form>

      <p class="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?
        <RouterLink to="/login" class="font-medium text-primary hover:underline">Log in</RouterLink>
      </p>
    </Card>
  </div>
</template>
