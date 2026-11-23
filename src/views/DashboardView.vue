<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { errorMessage } from '@/api/errors'
import { LINK_QUOTA, linkKeys, listLinks } from '@/api/links'
import type { Link } from '@/api/types'
import CsAlert from '@/components/cs/CsAlert.vue'
import CsButton from '@/components/cs/CsButton.vue'
import CsCopyToClipboard from '@/components/cs/CsCopyToClipboard.vue'
import CsHeader from '@/components/cs/CsHeader.vue'
import CsIcon from '@/components/cs/CsIcon.vue'
import CsTable, { type TableColumn } from '@/components/cs/CsTable.vue'
import CreateLinkModal from '@/components/links/CreateLinkModal.vue'
import DeleteLinkModal from '@/components/links/DeleteLinkModal.vue'
import { formatDate, formatNumber, formatTime, urlDomain } from '@/utils/format'

const HIGHLIGHT_MS = 3000

const { data: links, isPending, isError, error, refetch, isFetching } = useQuery({
  queryKey: linkKeys.all,
  queryFn: listLinks,
})

const counter = computed(() => (links.value ? `(${links.value.length}/${LINK_QUOTA})` : undefined))
const quotaReached = computed(() => (links.value?.length ?? 0) >= LINK_QUOTA)

const createOpen = ref(false)
const deleteOpen = ref(false)
const linkToDelete = ref<Link | null>(null)

function confirmDelete(link: Link) {
  linkToDelete.value = link
  deleteOpen.value = true
}

// Briefly highlight a newly created link so it's easy to spot.
const highlightId = ref<string | null>(null)
let highlightTimer: ReturnType<typeof setTimeout> | undefined

function onCreated(link: Link) {
  clearTimeout(highlightTimer)
  highlightId.value = link.id
  highlightTimer = setTimeout(() => (highlightId.value = null), HIGHLIGHT_MS)
}

onBeforeUnmount(() => clearTimeout(highlightTimer))

const columns: TableColumn<Link>[] = [
  { id: 'shortUrl', header: 'Link rút gọn' },
  { id: 'title', header: 'Tiêu đề' },
  { id: 'destinationUrl', header: 'URL đích' },
  { id: 'clicks', header: 'Tổng lượt click', cell: (link) => formatNumber(link.clicks), align: 'end' },
  { id: 'createdAt', header: 'Ngày tạo' },
  { id: 'actions', header: 'Thao tác', headerHidden: true },
]
</script>

<template>
  <div class="dashboard">
    <template v-if="isError">
      <CsHeader variant="h1">Dashboard</CsHeader>
      <CsAlert type="error" header="Không tải được danh sách link">
        {{ errorMessage(error) }}
        <template #action>
          <CsButton :loading="isFetching" @click="refetch()">Thử lại</CsButton>
        </template>
      </CsAlert>
    </template>

    <template v-else>
      <CsTable
        :items="links ?? []"
        :columns="columns"
        track-by="id"
        :loading="isPending"
        loading-text="Đang tải link"
        :row-class="(link) => (link.id === highlightId ? 'dashboard__row--new' : undefined)"
      >
        <template #header>
          <CsHeader variant="h1" :counter="counter">
            Dashboard
            <template #actions>
              <CsButton variant="primary" :disabled="quotaReached" @click="createOpen = true">
                Tạo link mới
              </CsButton>
            </template>
          </CsHeader>
        </template>

        <template #cell-shortUrl="{ item }">
          <span class="dashboard__short">
            <RouterLink class="cs-link cs-link--secondary" :to="{ name: 'link-detail', params: { id: item.id } }">
              {{ item.shortUrl.replace(/^https?:\/\//, '') }}
            </RouterLink>
            <CsCopyToClipboard :text-to-copy="item.shortUrl" :aria-label="`Copy ${item.shortUrl}`" />
          </span>
        </template>

        <template #cell-title="{ item }">
          <template v-if="item.title">{{ item.title }}</template>
          <span v-else class="dashboard__fallback" title="Chưa đặt tiêu đề, đang hiện domain của URL đích">
            {{ urlDomain(item.destinationUrl) }}
          </span>
        </template>

        <template #cell-destinationUrl="{ item }">
          <a
            class="cs-link dashboard__url"
            :href="item.destinationUrl"
            target="_blank"
            rel="noopener noreferrer"
            :title="item.destinationUrl"
          >
            <span class="dashboard__url-text">{{ item.destinationUrl }}</span>
            <CsIcon name="external" />
            <span class="cs-sr-only">(mở tab mới)</span>
          </a>
        </template>

        <template #cell-createdAt="{ item }">
          <span :title="`${formatDate(item.createdAt)} ${formatTime(item.createdAt)}`">{{ formatDate(item.createdAt) }}</span>
        </template>

        <template #empty>
          <div class="dashboard__empty">
            <div>
              <b>Chưa có link nào</b>
              <p class="dashboard__empty-text">Tạo link rút gọn đầu tiên để bắt đầu theo dõi lượt click.</p>
            </div>
            <CsButton @click="createOpen = true">Tạo link đầu tiên</CsButton>
          </div>
        </template>

        <template #cell-actions="{ item }">
          <CsButton variant="icon" icon-name="remove" :aria-label="`Xóa ${item.shortUrl}`" @click="confirmDelete(item)" />
        </template>
      </CsTable>
    </template>

    <CreateLinkModal v-model:visible="createOpen" @created="onCreated" />
    <DeleteLinkModal v-model:visible="deleteOpen" :link="linkToDelete" />
  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: var(--space-scaled-l);
}

.dashboard__short {
  display: inline-flex;
  align-items: center;
  gap: var(--space-static-xxs);
  white-space: nowrap;
}

/* Icon buttons sit inside the cell's padding instead of growing the row. */
.dashboard :deep(.cs-table td .cs-btn--icon) {
  margin-block: calc(-1 * var(--space-button-vertical));
}

.dashboard__fallback {
  color: var(--color-text-body-secondary);
}

.dashboard__url {
  display: inline-flex;
  align-items: center;
  gap: var(--space-static-xxs);
  max-width: 320px;
  vertical-align: top;
}

.dashboard__url-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dashboard :deep(.dashboard__row--new td) {
  animation: dashboard-row-new 3s ease-in;
}

@keyframes dashboard-row-new {
  from {
    background: var(--color-background-item-selected);
  }
}

.dashboard__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-scaled-s);
}

.dashboard__empty b {
  color: var(--color-text-body-default);
}

.dashboard__empty-text {
  margin: var(--space-static-xxxs) 0 0;
}
</style>
