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
import CsButtonDropdown from '@/components/cs/CsButtonDropdown.vue'
import CsContainer from '@/components/cs/CsContainer.vue'
import CsCopyToClipboard from '@/components/cs/CsCopyToClipboard.vue'
import CsHeader from '@/components/cs/CsHeader.vue'
import DeleteLinkModal from '@/components/links/DeleteLinkModal.vue'
import LinkStatsSection from '@/components/links/LinkStatsSection.vue'
import { formatDate, formatTime, stripProtocol, urlDomain } from '@/utils/format'

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
  await router.replace({ name: 'links' })
  queryClient.removeQueries({ queryKey: linkKeys.detail(id) })
}
</script>

<template>
  <div class="link-detail">
    <CsBreadcrumbGroup :items="[{ text: 'Link', to: { name: 'links' } }, { text: title }]" />

    <CsHeader v-if="notFound || !link" variant="h1" :class="!error && 'link-detail__loading'">{{ title }}</CsHeader>
    <header v-else class="link-detail__header">
      <div class="link-detail__heading">
        <h1 class="link-detail__short">{{ stripProtocol(link.shortUrl) }}</h1>
        <div class="link-detail__meta">
          <b>{{ title }}</b>
          <a
            class="link-detail__url"
            :href="link.destinationUrl"
            target="_blank"
            rel="noopener noreferrer"
            :title="link.destinationUrl"
          >
            {{ stripProtocol(link.destinationUrl) }}<span class="cs-sr-only"> (mở tab mới)</span>
          </a>
          <span :title="`${formatDate(link.createdAt)} ${formatTime(link.createdAt)}`">
            Tạo ngày {{ formatDate(link.createdAt) }}
          </span>
        </div>
      </div>
      <div class="link-detail__actions">
        <CsCopyToClipboard variant="button" :text-to-copy="link.shortUrl">Copy link</CsCopyToClipboard>
        <CsButtonDropdown :items="[{ id: 'delete', text: 'Xóa', iconName: 'remove' }]" @item-click="deleteOpen = true">
          <template #trigger><CsButton variant="icon" icon-name="ellipsis" aria-label="Thao tác khác" /></template>
        </CsButtonDropdown>
      </div>
    </header>

    <CsContainer v-if="notFound">
      <div class="link-detail__not-found">
        <p>Link này không tồn tại hoặc đã bị xóa.</p>
        <CsButton @click="router.push({ name: 'links' })">Về trang Link</CsButton>
      </div>
    </CsContainer>

    <CsAlert v-else-if="error && !link" type="error" header="Không tải được thông tin link">
      {{ errorMessage(error) }}
      <template #action>
        <CsButton :loading="isFetching" @click="refetch()">Thử lại</CsButton>
      </template>
    </CsAlert>

    <template v-else>
      <LinkStatsSection :link-id="id" :total-clicks="link?.clicks" />
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
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-static-l);
}

/* As tall as the loaded header, so the stats below don't move. */
.link-detail__loading {
  min-height: 112px;
}

.link-detail__heading {
  min-width: 0;
}

.link-detail__short {
  margin: 0;
  color: var(--color-text-heading-default);
  font-size: 32px;
  line-height: 40px;
  font-weight: var(--font-weight-bold);
  letter-spacing: var(--letter-spacing-heading-xl);
  overflow-wrap: anywhere;
}

.link-detail__meta {
  display: flex;
  flex-direction: column;
  gap: var(--space-static-xxs);
  margin-top: var(--space-static-xxs);
  color: var(--color-text-body-secondary);
}

.link-detail__meta b {
  color: var(--color-text-body-default);
  overflow-wrap: anywhere;
}

.link-detail__url {
  overflow: hidden;
  color: inherit;
  text-decoration: none;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.link-detail__url:hover {
  color: var(--color-text-link-hover);
  text-decoration: underline;
}

.link-detail__actions {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: var(--space-static-xs);
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
</style>
