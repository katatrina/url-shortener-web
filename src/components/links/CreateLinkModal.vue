<script setup lang="ts">
import { ref, watch } from 'vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { ApiError } from '@/api/client'
import { errorMessage, fieldErrors, fieldMessage, type FieldMessageOverrides } from '@/api/errors'
import { createLink, linkKeys, SHORT_URL_BASE } from '@/api/links'
import type { CreateLinkRequest, FieldErrorCode, Link } from '@/api/types'
import CsAlert from '@/components/cs/CsAlert.vue'
import CsButton from '@/components/cs/CsButton.vue'
import CsFormField from '@/components/cs/CsFormField.vue'
import CsInput from '@/components/cs/CsInput.vue'
import CsModal from '@/components/cs/CsModal.vue'
import { useFieldValidation } from '@/composables/useFieldValidation'
import { useFlashStore } from '@/stores/flash'
import { formatNumber } from '@/utils/format'
import {
  checkDestinationUrl,
  checkSlug,
  checkTitle,
  SLUG_MAX_LENGTH,
  SLUG_MIN_LENGTH,
  TITLE_MAX_LENGTH,
  URL_MAX_LENGTH,
} from '@/utils/validation'

type Field = 'destinationUrl' | 'title' | 'slug'

const LABELS: Record<Field, string> = { destinationUrl: 'URL đích', title: 'Tiêu đề', slug: 'Slug' }

const SLUG_LENGTH_MESSAGE = `Slug cần từ ${SLUG_MIN_LENGTH} đến ${SLUG_MAX_LENGTH} ký tự.`

const MESSAGES: FieldMessageOverrides = {
  destinationUrl: {
    REQUIRED: 'Nhập URL đích.',
    INVALID_FORMAT: 'Nhập URL đầy đủ, bắt đầu bằng http:// hoặc https://.',
    TOO_LONG: `URL đích tối đa ${formatNumber(URL_MAX_LENGTH)} ký tự.`,
  },
  title: { TOO_LONG: `Tiêu đề tối đa ${TITLE_MAX_LENGTH} ký tự.` },
  slug: {
    TOO_SHORT: SLUG_LENGTH_MESSAGE,
    TOO_LONG: SLUG_LENGTH_MESSAGE,
    INVALID_FORMAT: 'Slug chỉ gồm chữ cái, số, dấu - và _.',
  },
}

const SHORT_DOMAIN = SHORT_URL_BASE.replace(/^https?:\/\//, '')

const visible = defineModel<boolean>('visible', { required: true })
const emit = defineEmits<{ created: [link: Link] }>()

const queryClient = useQueryClient()
const flash = useFlashStore()

const values = ref({ destinationUrl: '', title: '', slug: '' })
const formError = ref<string | null>(null)

const CHECKS: Record<Field, (value: string) => FieldErrorCode | null> = {
  destinationUrl: checkDestinationUrl,
  title: checkTitle,
  slug: checkSlug,
}

const { errors, onBlur, validateAll, setErrors, reset } = useFieldValidation<Field>({
  fields: ['destinationUrl', 'title', 'slug'],
  value: (field) => values.value[field].trim(),
  check: (field, value) => {
    const code = CHECKS[field](value)
    return code && (MESSAGES[field]?.[code] ?? fieldMessage(code, LABELS[field]))
  },
})

watch(visible, (open) => {
  if (!open) return
  Object.assign(values.value, { destinationUrl: '', title: '', slug: '' })
  reset()
  formError.value = null
})

const { mutate, isPending } = useMutation({
  mutationFn: createLink,
  onSuccess: (link) => {
    queryClient.invalidateQueries({ queryKey: linkKeys.all })
    visible.value = false
    flash.push({ type: 'success', header: 'Đã tạo link', copyText: link.shortUrl })
    emit('created', link)
  },
  onError: (error) => {
    if (error instanceof ApiError && error.code === 'SLUG_ALREADY_EXISTS') {
      setErrors({ slug: errorMessage(error) })
      formError.value = null
      return
    }
    if (error instanceof ApiError && error.code === 'LINK_QUOTA_EXCEEDED') {
      // The link list's count is stale; refresh it so the quota state shows there too.
      queryClient.invalidateQueries({ queryKey: linkKeys.all })
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
  const body = {
    destinationUrl: values.value.destinationUrl.trim(),
    title: values.value.title.trim(),
    slug: values.value.slug.trim(),
  }

  // An empty slug must be left out: the backend rejects "" as too short.
  const request: CreateLinkRequest = { destinationUrl: body.destinationUrl, title: body.title }
  if (body.slug) request.slug = body.slug
  mutate(request)
}
</script>

<template>
  <CsModal v-model:visible="visible" header="Tạo link mới" form @submit="onSubmit">
    <div class="create-link">
      <CsAlert v-if="formError" type="error">{{ formError }}</CsAlert>

      <CsFormField label="URL đích" required :error-text="errors.destinationUrl">
        <CsInput
          v-model="values.destinationUrl"
          type="url"
          placeholder="https://example.com/trang-can-rut-gon"
          autofocus
          @blur="onBlur('destinationUrl')"
        />
      </CsFormField>

      <CsFormField label="Tiêu đề" description="Để trống thì hiển thị domain của URL đích." :error-text="errors.title">
        <CsInput v-model="values.title" @blur="onBlur('title')" />
      </CsFormField>

      <CsFormField
        label="Slug"
        description="Để trống để tự sinh."
        :constraint-text="`${SLUG_MIN_LENGTH}–${SLUG_MAX_LENGTH} ký tự: chữ cái, số, dấu - và _.`"
        :error-text="errors.slug"
      >
        <div class="create-link__slug">
          <span class="create-link__domain">{{ SHORT_DOMAIN }}</span>
          <span aria-hidden="true">/</span>
          <CsInput
            v-model="values.slug"
            placeholder="my-link"
            :aria-label="`Slug sau ${SHORT_DOMAIN}/`"
            @blur="onBlur('slug')"
          />
        </div>
      </CsFormField>
    </div>

    <template #footer>
      <CsButton variant="link" @click="visible = false">Hủy</CsButton>
      <CsButton variant="primary" form-action="submit" :loading="isPending">Tạo</CsButton>
    </template>
  </CsModal>
</template>

<style scoped>
.create-link {
  display: flex;
  flex-direction: column;
  gap: var(--space-scaled-l);
}

.create-link__slug {
  display: flex;
  align-items: center;
  gap: var(--space-static-xs);
}

.create-link__domain {
  color: var(--color-text-form-secondary);
  white-space: nowrap;
}
</style>
