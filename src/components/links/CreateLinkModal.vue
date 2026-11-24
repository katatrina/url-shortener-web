<script setup lang="ts">
import { h, ref, useId, watch } from 'vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { ApiError } from '@/api/client'
import { errorMessage, fieldErrors, fieldMessage, type FieldMessageOverrides } from '@/api/errors'
import { createLink, linkKeys, SHORT_URL_BASE } from '@/api/links'
import type { CreateLinkRequest, FieldErrorCode, Link } from '@/api/types'
import UIcon from '@nuxt/ui/components/Icon.vue'
import AnimatedCopyIcon from '@/components/icons/AnimatedCopyIcon.vue'
import { useCopy } from '@/composables/useCopy'
import { useFieldValidation } from '@/composables/useFieldValidation'
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
const props = defineProps<{ initialUrl?: string }>()
const emit = defineEmits<{ created: [link: Link] }>()

const queryClient = useQueryClient()
const toast = useToast()
const { copiedText, copy } = useCopy()
const formId = useId()

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
  Object.assign(values.value, { destinationUrl: props.initialUrl ?? '', title: '', slug: '' })
  reset()
  formError.value = null
})

const { mutate, isPending } = useMutation({
  mutationFn: createLink,
  onSuccess: (link) => {
    queryClient.invalidateQueries({ queryKey: linkKeys.all })
    visible.value = false
    toast.add({
      title: 'Đã tạo link',
      description: link.shortUrl,
      icon: 'i-lucide-circle-check',
      color: 'success',
      actions: [
        {
          label: 'Copy',
          // A render function, so the icon follows `copiedText` while the toast is open.
          icon: () => h(UIcon, { name: copiedText.value === link.shortUrl ? 'i-lucide-check' : AnimatedCopyIcon }),
          color: 'neutral',
          variant: 'outline',
          closeOnClick: false,
          onClick: () => copy(link.shortUrl),
        },
      ],
    })
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
  <UModal v-model:open="visible" title="Tạo link mới" :ui="{ content: 'max-w-2xl', footer: 'bg-muted' }">
    <template #body>
      <UForm :id="formId" :state="values" novalidate class="flex flex-col gap-4" @submit="onSubmit">
        <UAlert
          v-if="formError"
          role="alert"
          color="error"
          variant="subtle"
          icon="i-lucide-circle-alert"
          :title="formError"
        />

        <UFormField label="URL đích" required :error="errors.destinationUrl">
          <UInput
            v-model="values.destinationUrl"
            type="url"
            placeholder="https://example.com/trang-can-rut-gon"
            autofocus
            class="w-full"
            @blur="onBlur('destinationUrl')"
          />
        </UFormField>

        <UFormField
          label="Slug"
          description="Để trống để tự sinh."
          :help="`${SLUG_MIN_LENGTH}–${SLUG_MAX_LENGTH} ký tự: chữ cái, số, dấu - và _.`"
          :error="errors.slug"
        >
          <UFieldGroup class="w-full">
            <UBadge color="neutral" variant="outline" :label="SHORT_DOMAIN" />
            <UInput
              v-model="values.slug"
              placeholder="my-link"
              class="w-full"
              :aria-label="`Slug sau ${SHORT_DOMAIN}/`"
              @blur="onBlur('slug')"
            />
          </UFieldGroup>
        </UFormField>

        <UFormField label="Tiêu đề" description="Để trống thì hiển thị “Untitled” trong danh sách." :error="errors.title">
          <UInput v-model="values.title" class="w-full" @blur="onBlur('title')" />
        </UFormField>
      </UForm>
    </template>

    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton color="neutral" variant="ghost" @click="visible = false">Hủy</UButton>
        <UButton type="submit" :form="formId" :loading="isPending">Tạo</UButton>
      </div>
    </template>
  </UModal>
</template>
