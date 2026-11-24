<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { errorMessage } from '@/api/errors'
import { LINK_QUOTA, linkKeys, listLinks } from '@/api/links'
import type { Link } from '@/api/types'
import CreateLinkModal from '@/components/links/CreateLinkModal.vue'
import DeleteLinkModal from '@/components/links/DeleteLinkModal.vue'
import LinkRow from '@/components/links/LinkRow.vue'
import { isHttpUrl } from '@/utils/validation'

const HIGHLIGHT_MS = 3000

const { data: links, isError, error, refetch, isFetching } = useQuery({
  queryKey: linkKeys.all,
  queryFn: listLinks,
})

const quotaReached = computed(() => (links.value?.length ?? 0) >= LINK_QUOTA)

const createOpen = ref(false)
const deleteOpen = ref(false)
const linkToDelete = ref<Link | null>(null)

const heading = ref<HTMLElement | null>(null)

function confirmDelete(link: Link) {
  linkToDelete.value = link
  deleteOpen.value = true
}

const initialUrl = ref('')

function openCreate(url = '') {
  if (quotaReached.value || createOpen.value || deleteOpen.value) return
  initialUrl.value = url
  createOpen.value = true
}

// Plain "c" only: defineShortcuts ignores it while typing in an input.
defineShortcuts({ c: () => openCreate() })

// Pasting a URL anywhere on the page opens the form with it.
function onPaste(event: ClipboardEvent) {
  const target = event.target
  if (target instanceof HTMLElement && target.closest('input, textarea, [contenteditable]')) return
  const text = event.clipboardData?.getData('text').trim() ?? ''
  if (isHttpUrl(text)) openCreate(text)
}

onMounted(() => document.addEventListener('paste', onPaste))

// Briefly highlight a newly created link so it's easy to spot.
const highlightId = ref<string | null>(null)
let highlightTimer: ReturnType<typeof setTimeout> | undefined

function onCreated(link: Link) {
  clearTimeout(highlightTimer)
  highlightId.value = link.id
  highlightTimer = setTimeout(() => (highlightId.value = null), HIGHLIGHT_MS)
}

onBeforeUnmount(() => {
  clearTimeout(highlightTimer)
  document.removeEventListener('paste', onPaste)
})
</script>

<template>
  <div>
    <header class="border-b border-default">
      <div class="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6">
        <h1 ref="heading" tabindex="-1" class="text-lg font-semibold text-highlighted outline-none">
          Link
          <span v-if="links" class="font-normal text-muted">({{ links.length }}/{{ LINK_QUOTA }})</span>
        </h1>
        <UButton :disabled="quotaReached" @click="openCreate()">
          Tạo link mới
          <template #trailing><UKbd value="c" variant="subtle" size="sm" /></template>
        </UButton>
      </div>
    </header>

    <div class="mx-auto max-w-7xl p-6">
      <UAlert
        v-if="isError && !links"
        role="alert"
        color="error"
        variant="subtle"
        icon="i-lucide-circle-alert"
        title="Không tải được danh sách link"
        :description="errorMessage(error)"
        orientation="horizontal"
      >
        <template #actions>
          <UButton color="neutral" variant="outline" :loading="isFetching" @click="refetch()">Thử lại</UButton>
        </template>
      </UAlert>

      <div v-else-if="!links" role="status" class="flex items-center justify-center gap-2 p-6 text-muted">
        <UIcon name="i-lucide-loader-circle" class="size-4 animate-spin" />
        Đang tải link
      </div>

      <UEmpty
        v-else-if="!links.length"
        icon="i-lucide-link"
        title="Tạo link rút gọn đầu tiên để bắt đầu theo dõi lượt click"
        :actions="[{ label: 'Tạo link đầu tiên', color: 'neutral', variant: 'outline', onClick: () => openCreate() }]"
      />

      <ul v-else class="flex flex-col gap-2" aria-label="Danh sách link">
        <LinkRow
          v-for="link in links"
          :key="link.id"
          :link="link"
          :highlighted="link.id === highlightId"
          @delete="confirmDelete(link)"
        />
      </ul>
    </div>

    <CreateLinkModal v-model:visible="createOpen" :initial-url="initialUrl" @created="onCreated" />
    <DeleteLinkModal v-model:visible="deleteOpen" :link="linkToDelete" @closed="heading?.focus()" />
  </div>
</template>
