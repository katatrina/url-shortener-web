<script setup lang="ts">
// Field errors show under their input; anything else (wrong credentials, network) in one Alert.
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMutation } from '@tanstack/vue-query'
import { login } from '@/api/auth'
import { errorMessage, fieldErrors, fieldMessage } from '@/api/errors'
import AuthForm from '@/components/AuthForm.vue'
import CsAlert from '@/components/cs/CsAlert.vue'
import CsButton from '@/components/cs/CsButton.vue'
import CsFormField from '@/components/cs/CsFormField.vue'
import CsInput from '@/components/cs/CsInput.vue'
import { useFieldValidation } from '@/composables/useFieldValidation'
import { safeRedirect } from '@/router/redirect'
import { useAuthStore } from '@/stores/auth'

type Field = 'email' | 'password'

const LABELS: Record<Field, string> = { email: 'Email', password: 'Mật khẩu' }

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const form = reactive({ email: '', password: '' })
const formError = ref<string | null>(null)

// No email format check on login: a bad email just fails as wrong credentials.
const { errors, onBlur, validateAll, setErrors } = useFieldValidation<Field>({
  fields: ['email', 'password'],
  value: (field) => (field === 'email' ? form.email.trim() : form.password),
  check: (field, value) => (value ? null : fieldMessage('REQUIRED', LABELS[field])),
})

const redirectQuery = computed(() => (route.query.redirect ? { redirect: route.query.redirect } : {}))

const { mutate, isPending } = useMutation({
  mutationFn: login,
  onSuccess: ({ accessToken, user }) => {
    auth.setSession(accessToken, user)
    router.replace(safeRedirect(route.query.redirect) ?? { name: 'links' })
  },
  onError: (error) => {
    setErrors(fieldErrors(error, LABELS))
    formError.value = Object.keys(errors.value).length ? null : errorMessage(error)
  },
})

function onSubmit() {
  if (isPending.value) return
  if (!validateAll()) {
    formError.value = null
    return
  }
  mutate({ email: form.email.trim(), password: form.password })
}
</script>

<template>
  <AuthForm title="Đăng nhập" @submit="onSubmit">
    <CsAlert v-if="formError" type="error">{{ formError }}</CsAlert>

    <CsFormField label="Email" :error-text="errors.email">
      <CsInput
        v-model="form.email"
        type="email"
        autocomplete="email"
        placeholder="ban@example.com"
        autofocus
        @blur="onBlur('email')"
      />
    </CsFormField>

    <CsFormField label="Mật khẩu" :error-text="errors.password">
      <CsInput
        v-model="form.password"
        type="password"
        autocomplete="current-password"
        @blur="onBlur('password')"
      />
    </CsFormField>

    <template #actions>
      <CsButton variant="primary" form-action="submit" :loading="isPending">Đăng nhập</CsButton>
    </template>

    <template #footer>
      Chưa có tài khoản?
      <RouterLink class="cs-link" :to="{ name: 'signup', query: redirectQuery }">Đăng ký</RouterLink>
    </template>
  </AuthForm>
</template>
