<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMutation } from '@tanstack/vue-query'
import { signup } from '@/api/auth'
import { ApiError } from '@/api/client'
import { errorMessage, fieldErrors, fieldMessage, type FieldMessageOverrides } from '@/api/errors'
import type { FieldErrorCode } from '@/api/types'
import AuthForm from '@/components/AuthForm.vue'
import CsAlert from '@/components/cs/CsAlert.vue'
import CsButton from '@/components/cs/CsButton.vue'
import CsFormField from '@/components/cs/CsFormField.vue'
import CsInput from '@/components/cs/CsInput.vue'
import { useFieldValidation } from '@/composables/useFieldValidation'
import { safeRedirect } from '@/router/redirect'
import { useAuthStore } from '@/stores/auth'
import {
  charCount,
  checkEmail,
  checkPassword,
  EMAIL_MAX_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from '@/utils/validation'

type Field = 'email' | 'password'

const LABELS: Record<Field, string> = { email: 'Email', password: 'Mật khẩu' }
const PASSWORD_LENGTH_MESSAGE = `Mật khẩu cần từ ${PASSWORD_MIN_LENGTH} đến ${PASSWORD_MAX_LENGTH} ký tự.`
const MESSAGES: FieldMessageOverrides = {
  email: { TOO_LONG: `Email tối đa ${EMAIL_MAX_LENGTH} ký tự.` },
  password: { TOO_SHORT: PASSWORD_LENGTH_MESSAGE, TOO_LONG: PASSWORD_LENGTH_MESSAGE },
}

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const form = reactive({ email: '', password: '' })
const formError = ref<string | null>(null)

function message(field: Field, code: FieldErrorCode, value: string): string {
  // Within 32 characters but over the 72-byte limit (e.g. many emoji).
  if (field === 'password' && code === 'TOO_LONG' && charCount(value) <= PASSWORD_MAX_LENGTH) {
    return 'Mật khẩu quá dài, hãy bớt ký tự đặc biệt hoặc emoji.'
  }
  return MESSAGES[field]?.[code] ?? fieldMessage(code, LABELS[field])
}

const { errors, onBlur, validateAll, setErrors } = useFieldValidation<Field>({
  fields: ['email', 'password'],
  value: (field) => (field === 'email' ? form.email.trim() : form.password),
  check: (field, value) => {
    const code = field === 'email' ? checkEmail(value) : checkPassword(value)
    return code && message(field, code, value)
  },
})

// The email the backend said is taken; the error (and its login link) goes away once the email changes.
const takenEmail = ref<string | null>(null)
const emailTaken = computed(() => Boolean(errors.value.email) && takenEmail.value === form.email.trim())
const redirectQuery = computed(() => (route.query.redirect ? { redirect: route.query.redirect } : {}))

const { mutate, isPending } = useMutation({
  mutationFn: signup,
  onSuccess: ({ accessToken, user }) => {
    auth.setSession(accessToken, user)
    router.replace(safeRedirect(route.query.redirect) ?? { name: 'dashboard' })
  },
  onError: (error) => {
    if (error instanceof ApiError && error.code === 'EMAIL_ALREADY_EXISTS') {
      takenEmail.value = form.email.trim()
      setErrors({ email: errorMessage(error) })
      formError.value = null
      return
    }
    setErrors(fieldErrors(error, LABELS, MESSAGES))
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
  <AuthForm title="Đăng ký" @submit="onSubmit">
    <CsAlert v-if="formError" type="error">{{ formError }}</CsAlert>

    <CsFormField label="Email" required :error-text="errors.email">
      <CsInput
        v-model="form.email"
        type="email"
        autocomplete="email"
        placeholder="ban@example.com"
        autofocus
        @blur="onBlur('email')"
      />
      <template v-if="emailTaken" #error>
        {{ errors.email }}
        <RouterLink class="cs-link" :to="{ name: 'login', query: redirectQuery }">Đăng nhập</RouterLink>
      </template>
    </CsFormField>

    <CsFormField
      label="Mật khẩu"
      required
      :constraint-text="`${PASSWORD_MIN_LENGTH}–${PASSWORD_MAX_LENGTH} ký tự`"
      :error-text="errors.password"
    >
      <CsInput
        v-model="form.password"
        type="password"
        autocomplete="new-password"
        @blur="onBlur('password')"
      />
    </CsFormField>

    <template #actions>
      <CsButton variant="primary" form-action="submit" :loading="isPending">Đăng ký</CsButton>
    </template>

    <template #footer>
      Đã có tài khoản?
      <RouterLink class="cs-link" :to="{ name: 'login', query: redirectQuery }">Đăng nhập</RouterLink>
    </template>
  </AuthForm>
</template>
