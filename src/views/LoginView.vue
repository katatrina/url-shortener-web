<script setup lang="ts">
// Field errors show under their input; anything else (wrong credentials, network) in one Alert.
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMutation } from '@tanstack/vue-query'
import { login } from '@/api/auth'
import { errorMessage, fieldErrors, fieldMessage } from '@/api/errors'
import type { LoginRequest } from '@/api/types'
import CsAlert from '@/components/cs/CsAlert.vue'
import CsButton from '@/components/cs/CsButton.vue'
import CsContainer from '@/components/cs/CsContainer.vue'
import CsFormField from '@/components/cs/CsFormField.vue'
import CsHeader from '@/components/cs/CsHeader.vue'
import CsInput from '@/components/cs/CsInput.vue'
import { safeRedirect } from '@/router/redirect'
import { useAuthStore } from '@/stores/auth'

const FIELD_LABELS = { email: 'Email', password: 'Mật khẩu' }

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const form = reactive<LoginRequest>({ email: '', password: '' })
const errors = ref<Partial<Record<keyof LoginRequest, string>>>({})
const formError = ref<string | null>(null)

const { mutate, isPending } = useMutation({
  mutationFn: login,
  onSuccess: ({ accessToken, user }) => {
    auth.setSession(accessToken, user)
    router.replace(safeRedirect(route.query.redirect) ?? { name: 'dashboard' })
  },
  onError: (error) => {
    errors.value = fieldErrors(error, FIELD_LABELS)
    formError.value = Object.keys(errors.value).length ? null : errorMessage(error)
  },
})

function validate(body: LoginRequest): Partial<Record<keyof LoginRequest, string>> {
  const result: Partial<Record<keyof LoginRequest, string>> = {}
  if (!body.email) result.email = fieldMessage('REQUIRED', FIELD_LABELS.email)
  if (!body.password) result.password = fieldMessage('REQUIRED', FIELD_LABELS.password)
  return result
}

function onSubmit() {
  if (isPending.value) return
  const body = { email: form.email.trim(), password: form.password }
  const clientErrors = validate(body)
  // No email format check on login: a bad email just fails as wrong credentials.
  if (Object.keys(clientErrors).length) {
    errors.value = clientErrors
    formError.value = null
    return
  }
  // Keep old errors until the response replaces them, so the form doesn't jump.
  mutate(body)
}
</script>

<template>
  <div class="login">
    <CsHeader variant="h1">Đăng nhập</CsHeader>

    <CsContainer>
      <form class="login__form" novalidate @submit.prevent="onSubmit">
        <CsAlert v-if="formError" type="error">{{ formError }}</CsAlert>

        <CsFormField label="Email" :error-text="errors.email">
          <CsInput v-model="form.email" type="email" autocomplete="email" placeholder="ban@example.com" />
        </CsFormField>

        <CsFormField label="Mật khẩu" :error-text="errors.password">
          <CsInput v-model="form.password" type="password" autocomplete="current-password" />
        </CsFormField>

        <div class="login__actions">
          <CsButton variant="primary" form-action="submit" :loading="isPending">Đăng nhập</CsButton>
        </div>
      </form>
    </CsContainer>

    <p class="login__footer">
      Chưa có tài khoản?
      <RouterLink class="cs-link" :to="{ name: 'signup', query: route.query.redirect ? { redirect: route.query.redirect } : {} }">Đăng ký</RouterLink>
    </p>
  </div>
</template>

<style scoped>
.login {
  display: flex;
  flex-direction: column;
  gap: var(--space-scaled-l);
  max-width: 400px;
  margin: 0 auto;
}

.login__form {
  display: flex;
  flex-direction: column;
  gap: var(--space-scaled-l);
  padding-top: var(--space-scaled-l);
}

.login__actions {
  display: flex;
  justify-content: flex-end;
}

.login__footer {
  margin: 0;
  text-align: center;
}
</style>
