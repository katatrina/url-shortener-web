<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { ApiError } from '@/api/client'
import { errorMessage } from '@/api/errors'
import { getLink, linkKeys } from '@/api/links'
import CsAlert from '@/components/cs/CsAlert.vue'
import CsBreadcrumbGroup from '@/components/cs/CsBreadcrumbGroup.vue'
import CsButton from '@/components/cs/CsButton.vue'
import CsContainer from '@/components/cs/CsContainer.vue'
import CsCopyToClipboard from '@/components/cs/CsCopyToClipboard.vue'
import CsHeader from '@/components/cs/CsHeader.vue'
import CsIcon from '@/components/cs/CsIcon.vue'
import CsKeyValuePairs from '@/components/cs/CsKeyValuePairs.vue'
import CsSpinner from '@/components/cs/CsSpinner.vue'
import DeleteLinkModal from '@/components/links/DeleteLinkModal.vue'
import LinkStatsSection from '@/components/links/LinkStatsSection.vue'
import { formatDate, formatNumber, formatTime, urlDomain } from '@/utils/format'

const route = useRoute()
const router = useRouter()
const queryClient = useQueryClient()

// Fixed for this instance: the page is keyed by path, and leaving it must not refetch with an empty id.
const id = String(route.params.id)

const { data: link, error, refetch, isFetching } = useQuery({
  queryKey: linkKeys.detail(id),
  queryFn: () => getLink(id),
})

const notFound = computed(() => error.value instanceof ApiError && error.value.code === 'LINK_NOT_FOUND')
const title = computed(() => {
  if (notFound.value) return 'Không tìm thấy link'
  return link.value ? link.value.title || urlDomain(link.value.destinationUrl) : 'Chi tiết link'
})

const deleteOpen = ref(false)

async function onDeleted() {
  // Replace, so Back doesn't return to a deleted link.
  await router.replace({ name: 'dashboard' })
  queryClient.removeQueries({ queryKey: linkKeys.detail(id) })
}

const INFO = [
  { id: 'shortUrl', label: 'Link rút gọn' },
  { id: 'destinationUrl', label: 'URL đích' },
  { id: 'createdAt', label: 'Ngày tạo' },
  { id: 'clicks', label: 'Tổng lượt click' },
]
</script>

<template>
  <div class="link-detail">
    <CsBreadcrumbGroup :items="[{ text: 'Dashboard', to: { name: 'dashboard' } }, { text: title }]" />

    <CsHeader variant="h1" class="link-detail__header">
      {{ title }}
      <template v-if="link && !notFound" #actions>
        <CsButton @click="deleteOpen = true">Xóa</CsButton>
      </template>
    </CsHeader>

    <CsContainer v-if="notFound">
      <div class="link-detail__not-found">
        <p>Link này không tồn tại hoặc đã bị xóa.</p>
        <CsButton @click="router.push({ name: 'dashboard' })">Về Dashboard</CsButton>
      </div>
    </CsContainer>

    <CsAlert v-else-if="error && !link" type="error" header="Không tải được thông tin link">
      {{ errorMessage(error) }}
      <template #action>
        <CsButton :loading="isFetching" @click="refetch()">Thử lại</CsButton>
      </template>
    </CsAlert>

    <template v-else>
      <CsContainer>
        <template #header><CsHeader variant="h2">Thông tin link</CsHeader></template>
        <CsSpinner v-if="!link" />
        <CsKeyValuePairs v-else :items="INFO">
          <template #value-shortUrl>
            <CsCopyToClipboard variant="inline" :text-to-copy="link.shortUrl" :aria-label="`Copy ${link.shortUrl}`" />
          </template>
          <template #value-destinationUrl>
            <a
              class="cs-link link-detail__url"
              :href="link.destinationUrl"
              target="_blank"
              rel="noopener noreferrer"
              :title="link.destinationUrl"
            >
              <span class="link-detail__url-text">{{ link.destinationUrl }}</span>
              <CsIcon name="external" />
              <span class="cs-sr-only">(mở tab mới)</span>
            </a>
          </template>
          <template #value-createdAt>
            <span :title="`${formatDate(link.createdAt)} ${formatTime(link.createdAt)}`">{{ formatDate(link.createdAt) }}</span>
          </template>
          <template #value-clicks>{{ formatNumber(link.clicks) }}</template>
        </CsKeyValuePairs>
      </CsContainer>

      <LinkStatsSection :link-id="id" />
    </template>

    <DeleteLinkModal v-model:visible="deleteOpen" :link="link ?? null" @deleted="onDeleted" />
  </div>
</template>

<style scoped>
.link-detail {
  display: flex;
  flex-direction: column;
  gap: var(--space-scaled-l);
}

.link-detail__header {
  overflow-wrap: anywhere;
}

.link-detail__url {
  display: inline-flex;
  align-items: center;
  gap: var(--space-static-xxs);
  max-width: 100%;
}

.link-detail__url-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.link-detail__not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-scaled-s);
  padding: var(--space-scaled-l) 0;
}

.link-detail__not-found p {
  margin: 0;
}

.link-detail :deep(.cs-kv .cs-btn--icon) {
  margin-block: calc(-1 * var(--space-button-vertical));
}
</style>
