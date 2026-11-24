<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { ApiError } from '@/api/client'
import { errorMessage } from '@/api/errors'
import { getLink, linkKeys } from '@/api/links'
import AnimatedCopyIcon from '@/components/icons/AnimatedCopyIcon.vue'
import DeleteLinkModal from '@/components/links/DeleteLinkModal.vue'
import LinkActionsMenu from '@/components/links/LinkActionsMenu.vue'
import LinkStatsSection from '@/components/links/LinkStatsSection.vue'
import { useCopy } from '@/composables/useCopy'
import { formatDate, formatTime, stripProtocol } from '@/utils/format'

const route = useRoute()
const router = useRouter()
const queryClient = useQueryClient()
const { copiedText, copy } = useCopy()

// Fixed for this instance: the page is keyed by path, and leaving it must not refetch with an empty id.
const id = String(route.params.id)

const { data: link, error, refetch, isFetching } = useQuery({
  queryKey: linkKeys.detail(id),
  queryFn: () => getLink(id),
})

const notFound = computed(() => error.value instanceof ApiError && error.value.code === 'LINK_NOT_FOUND')
const title = computed(() => {
  if (notFound.value) return 'Không tìm thấy link'
  // A link without a title goes by its short link.
  return link.value ? link.value.title || stripProtocol(link.value.shortUrl) : 'Chi tiết link'
})

const deleteOpen = ref(false)

async function onDeleted() {
  // Replace, so Back doesn't return to a deleted link.
  await router.replace({ name: 'links' })
  queryClient.removeQueries({ queryKey: linkKeys.detail(id) })
}
</script>

<template>
  <div>
    <header class="border-b border-default">
      <div class="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6">
        <UBreadcrumb
          class="min-w-0"
          color="neutral"
          :ui="{ item: 'first:shrink-0' }"
          :items="[{ label: 'Link', to: { name: 'links' } }, { label: title }]"
        />
        <div v-if="link && !notFound" class="flex shrink-0 items-center gap-2">
          <UButton
            :icon="copiedText === link.shortUrl ? 'i-lucide-check' : AnimatedCopyIcon"
            :aria-label="copiedText === link.shortUrl ? 'Đã copy link' : 'Copy link'"
            @click="copy(link.shortUrl)"
          >
            Copy link
          </UButton>
          <LinkActionsMenu label="Thao tác khác" @delete="deleteOpen = true" />
        </div>
      </div>
    </header>

    <div class="mx-auto flex max-w-7xl flex-col gap-6 p-6">
      <UEmpty
        v-if="notFound"
        icon="i-lucide-link"
        :title="title"
        description="Link này không tồn tại hoặc đã bị xóa."
        :actions="[{ label: 'Về trang Link', to: { name: 'links' }, color: 'neutral', variant: 'outline' }]"
      />

      <UAlert
        v-else-if="error && !link"
        role="alert"
        color="error"
        variant="subtle"
        icon="i-lucide-circle-alert"
        title="Không tải được thông tin link"
        :description="errorMessage(error)"
        orientation="horizontal"
      >
        <template #actions>
          <UButton color="neutral" variant="outline" :loading="isFetching" @click="refetch()">Thử lại</UButton>
        </template>
      </UAlert>

      <template v-else>
        <!-- As tall as the loaded header, so the stats below don't move. -->
        <div v-if="!link" role="status" class="flex min-h-20 items-center gap-2 text-muted">
          <UIcon name="i-lucide-loader-circle" class="size-4 animate-spin" />
          Đang tải link
        </div>
        <div v-else class="flex min-h-20 flex-col justify-center gap-1">
          <h1 class="text-2xl font-semibold wrap-anywhere text-highlighted">{{ title }}</h1>
          <div class="flex items-center gap-1 text-muted">
            <span v-if="link.title" class="shrink-0 text-default">{{ stripProtocol(link.shortUrl) }}</span>
            <UIcon name="i-lucide-corner-down-right" class="size-4 shrink-0" />
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
          <div class="text-muted" :title="`${formatDate(link.createdAt)} ${formatTime(link.createdAt)}`">
            Tạo ngày {{ formatDate(link.createdAt) }}
          </div>
        </div>
        <LinkStatsSection :link-id="id" :total-clicks="link?.clicks" />
      </template>
    </div>

    <DeleteLinkModal v-model:visible="deleteOpen" :link="link ?? null" @deleted="onDeleted" />
  </div>
</template>
