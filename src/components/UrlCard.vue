<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { toast } from 'vue-sonner'
import { useRouter } from 'vue-router'
import { Copy, Check, BarChart3, Trash2, ExternalLink } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import { formatNumber, formatTimeAgo, truncateUrl } from '@/lib/formatters'
import type { UrlResponse } from '@/types'

const props = defineProps<{
  url: UrlResponse
}>()

const emit = defineEmits<{
  delete: [code: string]
}>()

const router = useRouter()
const { copy, copied } = useClipboard()

function handleCopy() {
  copy(props.url.shortUrl)
  toast.success('Copied to clipboard!')
}
</script>

<template>
  <div class="flex flex-col gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between">
    <div class="min-w-0 flex-1 space-y-1">
      <div class="flex items-center gap-2">
        <a
          :href="url.shortUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="font-mono text-sm font-semibold text-primary hover:underline"
        >
          /{{ url.shortCode }}
        </a>
        <button
          @click="handleCopy"
          class="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          title="Copy short URL"
        >
          <Check v-if="copied" class="h-3.5 w-3.5 text-success" />
          <Copy v-else class="h-3.5 w-3.5" />
        </button>
      </div>
      <div class="flex items-center gap-1 text-sm text-muted-foreground">
        <ExternalLink class="h-3 w-3 shrink-0" />
        <span class="truncate">{{ truncateUrl(url.longUrl) }}</span>
      </div>
    </div>

    <div class="flex items-center gap-4">
      <div class="text-right">
        <p class="text-sm font-medium">{{ formatNumber(url.clickCount) }} clicks</p>
        <p class="text-xs text-muted-foreground">{{ formatTimeAgo(url.createdAt) }}</p>
      </div>

      <div class="flex items-center gap-1">
        <Button variant="ghost" size="icon" title="View analytics" @click="router.push(`/dashboard/${url.shortCode}`)">
          <BarChart3 class="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" title="Delete" @click="emit('delete', url.shortCode)">
          <Trash2 class="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </div>
  </div>
</template>
