<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Link } from '@/api/types'
import AnimatedClickIcon from '@/components/icons/AnimatedClickIcon.vue'
import { faviconUrl } from '@/utils/favicon'
import { formatDate, formatNumber, formatTime, stripProtocol } from '@/utils/format'
import CopyButton from './CopyButton.vue'
import LinkActionsMenu from './LinkActionsMenu.vue'

const props = defineProps<{ link: Link; highlighted?: boolean }>()
const emit = defineEmits<{ delete: [] }>()

// For screen readers: an untitled link goes by its short link.
const name = computed(() => props.link.title || stripProtocol(props.link.shortUrl))
// Google answers with a blurry 16px globe when a site has no favicon; ours is sharper.
const tooSmall = ref<string | null>(null)
const favicon = computed(() => {
  const url = faviconUrl(props.link.destinationUrl)
  return url && url !== tooSmall.value ? url : undefined
})

// UAvatar also passes this to the globe icon, which emits its own `load` without an event.
function onFaviconLoad(event: Event | string) {
  if (typeof event === 'string' || !(event.target instanceof HTMLImageElement)) return
  if (event.target.naturalWidth <= 16) tooSmall.value = favicon.value ?? null
}

const detail = computed(() => ({ name: 'link-detail', params: { id: props.link.id } }))
</script>

<template>
  <li
    class="flex items-center gap-4 rounded-lg border border-default px-4 py-3 transition hover:shadow-md"
    :class="highlighted && 'bg-elevated'"
  >
    <!-- Falls back to the globe when there is no favicon or it can't be loaded. -->
    <UAvatar
      :src="favicon"
      alt=""
      icon="i-lucide-globe"
      loading="lazy"
      referrerpolicy="no-referrer"
      @load="onFaviconLoad"
      class="size-10 border border-default bg-default"
      :ui="{ image: 'size-5 rounded-none object-contain', icon: 'size-5' }"
    />

    <div class="min-w-0 flex-1">
      <ULink
        :to="detail"
        :title="link.title || undefined"
        class="block w-fit max-w-full truncate py-0.5 text-base hover:underline"
        :class="link.title ? 'font-semibold text-highlighted hover:text-highlighted' : 'font-normal text-muted hover:text-muted'"
      >
        {{ link.title || 'untitled' }}
      </ULink>
      <div class="flex items-center gap-1">
        <span class="max-w-1/2 shrink-0 truncate" :title="link.shortUrl">{{ stripProtocol(link.shortUrl) }}</span>
        <CopyButton :text="link.shortUrl" />
        <UIcon name="i-lucide-arrow-right" class="size-4 shrink-0 text-muted" />
        <!-- relative: keeps the sr-only text inside the truncated box, so it can't widen the page. -->
        <ULink
          :to="link.destinationUrl"
          external
          target="_blank"
          rel="noopener noreferrer"
          :title="link.destinationUrl"
          class="relative truncate text-muted hover:text-highlighted hover:underline"
        >
          {{ stripProtocol(link.destinationUrl) }}<span class="sr-only"> (mở tab mới)</span>
        </ULink>
      </div>
    </div>

    <span class="shrink-0 text-muted tabular-nums" :title="`Ngày tạo: ${formatDate(link.createdAt)} ${formatTime(link.createdAt)}`">
      {{ formatDate(link.createdAt) }}
    </span>
    <!-- Fixed width, so the dates line up across rows. -->
    <div class="flex w-40 shrink-0 justify-end">
      <UButton
        :to="detail"
        :icon="AnimatedClickIcon"
        color="neutral"
        variant="outline"
        size="sm"
        class="tabular-nums"
        :ui="{ leadingIcon: 'text-info' }"
      >
        {{ formatNumber(link.clicks) }} lượt click
      </UButton>
    </div>
    <LinkActionsMenu :label="`Thao tác với ${name}`" @delete="emit('delete')" />
  </li>
</template>
