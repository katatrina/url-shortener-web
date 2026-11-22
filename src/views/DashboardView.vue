<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { errorMessage } from '@/api/errors'
import { linkKeys, listLinks } from '@/api/links'
import type { Link } from '@/api/types'
import CsAlert from '@/components/cs/CsAlert.vue'
import CsButton from '@/components/cs/CsButton.vue'
import CsHeader from '@/components/cs/CsHeader.vue'
import CsTable, { type TableColumn } from '@/components/cs/CsTable.vue'
import { formatDate, formatNumber, urlDomain } from '@/utils/format'

const router = useRouter()

const { data: links, isPending, isError, error, refetch, isFetching } = useQuery({
  queryKey: linkKeys.all,
  queryFn: listLinks,
})

const counter = computed(() => (links.value ? `(${links.value.length})` : undefined))

const columns: TableColumn<Link>[] = [
  { id: 'shortUrl', header: 'Link rút gọn' },
  { id: 'title', header: 'Tiêu đề', cell: (link) => link.title || urlDomain(link.destinationUrl) },
  { id: 'destinationUrl', header: 'URL đích' },
  { id: 'clicks', header: 'Tổng lượt click', cell: (link) => formatNumber(link.clicks), align: 'end' },
  { id: 'createdAt', header: 'Ngày tạo', cell: (link) => formatDate(link.createdAt) },
]

function openLink(link: Link) {
  router.push({ name: 'link-detail', params: { id: link.id } })
}
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

    <CsTable
      v-else
      :items="links ?? []"
      :columns="columns"
      track-by="id"
      :loading="isPending"
      loading-text="Đang tải link"
      clickable-rows
      @row-click="openLink"
    >
      <template #header>
        <CsHeader variant="h1" :counter="counter">Dashboard</CsHeader>
      </template>

      <template #cell-shortUrl="{ item }">
        <RouterLink class="cs-link cs-link--secondary" :to="{ name: 'link-detail', params: { id: item.id } }">
          {{ item.shortUrl.replace(/^https?:\/\//, '') }}
        </RouterLink>
      </template>

      <template #cell-destinationUrl="{ item }">
        <span class="dashboard__url" :title="item.destinationUrl">{{ item.destinationUrl }}</span>
      </template>

      <template #empty>
        <div class="dashboard__empty">
          <div>
            <b>Chưa có link nào</b>
            <p class="dashboard__empty-text">Tạo link rút gọn đầu tiên để bắt đầu theo dõi lượt click.</p>
          </div>
          <CsButton>Tạo link đầu tiên</CsButton>
        </div>
      </template>
    </CsTable>
  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: var(--space-scaled-l);
}

.dashboard__url {
  display: inline-block;
  max-width: 320px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: top;
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
