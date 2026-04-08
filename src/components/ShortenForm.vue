<script setup lang="ts">
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import { useClipboard } from '@vueuse/core'
import { shortenUrl } from '@/api/urls'
import { isValidUrl } from '@/lib/validators'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import { Copy, Check, ExternalLink } from 'lucide-vue-next'
import type { UrlResponse, FieldError } from '@/types'

const props = withDefaults(defineProps<{
  showAdvanced?: boolean
}>(), {
  showAdvanced: false,
})

const emit = defineEmits<{
  created: [url: UrlResponse]
}>()

const url = ref('')
const customAlias = ref('')
const loading = ref(false)
const result = ref<UrlResponse | null>(null)
const error = ref('')
const fieldErrors = ref<FieldError[]>([])

const { copy, copied } = useClipboard()

async function handleSubmit() {
  error.value = ''
  fieldErrors.value = []

  if (!url.value.trim()) {
    error.value = 'Please enter a URL'
    return
  }
  if (!isValidUrl(url.value.trim())) {
    error.value = 'Please enter a valid HTTP or HTTPS URL'
    return
  }

  loading.value = true
  try {
    const res = await shortenUrl({
      longUrl: url.value.trim(),
      customAlias: props.showAdvanced && customAlias.value.trim() ? customAlias.value.trim() : undefined,
    })
    result.value = res.data.data
    emit('created', res.data.data)
    toast.success('URL shortened successfully!')
    url.value = ''
    customAlias.value = ''
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { message?: string; errors?: FieldError[] } } }
    if (axiosErr.response?.data?.errors) {
      fieldErrors.value = axiosErr.response.data.errors
    }
    error.value = axiosErr.response?.data?.message || 'Failed to shorten URL'
  } finally {
    loading.value = false
  }
}

function handleCopy() {
  if (result.value) {
    copy(result.value.shortUrl)
    toast.success('Copied to clipboard!')
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="w-full space-y-4">
    <div class="flex flex-col gap-2 sm:flex-row">
      <Input
        v-model="url"
        type="url"
        placeholder="Paste your long URL here..."
        class="flex-1"
      />
      <Button :loading="loading" class="sm:w-auto">
        Shorten
      </Button>
    </div>

    <div v-if="showAdvanced" class="flex gap-2">
      <Input
        v-model="customAlias"
        placeholder="Custom alias (optional)"
        class="max-w-xs"
      />
    </div>

    <p v-if="error" class="text-sm text-destructive">{{ error }}</p>
    <p v-for="fe in fieldErrors" :key="fe.field" class="text-sm text-destructive">
      {{ fe.message }}
    </p>

    <div
      v-if="result"
      class="flex items-center justify-between gap-4 rounded-lg border border-border bg-muted/50 p-4"
    >
      <div class="flex items-center gap-2 truncate">
        <ExternalLink class="h-4 w-4 shrink-0 text-muted-foreground" />
        <a
          :href="result.shortUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="truncate font-medium text-primary hover:underline"
        >
          {{ result.shortUrl }}
        </a>
      </div>
      <Button variant="outline" size="sm" @click="handleCopy" type="button">
        <Check v-if="copied" class="mr-1 h-4 w-4 text-success" />
        <Copy v-else class="mr-1 h-4 w-4" />
        {{ copied ? 'Copied' : 'Copy' }}
      </Button>
    </div>
  </form>
</template>
