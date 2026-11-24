<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { errorMessage } from '@/api/errors'
import { LINK_QUOTA, linkKeys, listLinks } from '@/api/links'
import type { Link } from '@/api/types'
import CsAlert from '@/components/cs/CsAlert.vue'
import CsButton from '@/components/cs/CsButton.vue'
import CsContainer from '@/components/cs/CsContainer.vue'
import CsHeader from '@/components/cs/CsHeader.vue'
import CsSpinner from '@/components/cs/CsSpinner.vue'
import CreateLinkModal from '@/components/links/CreateLinkModal.vue'
import DeleteLinkModal from '@/components/links/DeleteLinkModal.vue'
import LinkRow from '@/components/links/LinkRow.vue'

const HIGHLIGHT_MS = 3000

const { data: links, isError, error, refetch, isFetching } = useQuery({
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
</script>

<template>
  <div class="links-page">
    <CsHeader variant="h1" :counter="counter" description="">
      Link
      <template #actions>
        <CsButton variant="primary" :disabled="quotaReached" @click="createOpen = true">Tạo link mới</CsButton>
      </template>
    </CsHeader>

    <CsAlert v-if="isError && !links" type="error" header="Không tải được danh sách link">
      {{ errorMessage(error) }}
      <template #action>
        <CsButton :loading="isFetching" @click="refetch()">Thử lại</CsButton>
      </template>
    </CsAlert>

    <CsContainer v-else disable-content-paddings>
      <CsSpinner v-if="!links" text="Đang tải link" />
      <div v-else-if="!links.length" class="links-page__empty">
        <div>
          <b>Chưa có link nào</b>
          <p>Tạo link rút gọn đầu tiên để bắt đầu theo dõi lượt click.</p>
        </div>
        <CsButton @click="createOpen = true">Tạo link đầu tiên</CsButton>
      </div>
      <table v-else class="cs-table links-page__table" aria-label="Danh sách link">
        <thead>
          <tr>
            <th scope="col"><span><span class="cs-sr-only">Link</span></span></th>
            <th scope="col" class="links-page__col-url"><span>URL đích</span></th>
            <th scope="col" class="links-page__col-date"><span>Ngày tạo</span></th>
            <th scope="col" class="links-page__col-clicks"><span>Tổng lượt click</span></th>
            <th scope="col" class="links-page__col-actions"><span><span class="cs-sr-only">Thao tác</span></span></th>
          </tr>
        </thead>
        <tbody>
          <LinkRow
            v-for="link in links"
            :key="link.id"
            :class="link.id === highlightId && 'links-page__row--new'"
            :link="link"
            @delete="confirmDelete(link)"
          />
        </tbody>
      </table>
    </CsContainer>

    <CreateLinkModal v-model:visible="createOpen" @created="onCreated" />
    <DeleteLinkModal v-model:visible="deleteOpen" :link="linkToDelete" />
  </div>
</template>

<style scoped>
.links-page {
  display: flex;
  flex-direction: column;
  gap: var(--space-scaled-xl);
}

.links-page__table {
  table-layout: fixed;
}

.links-page__col-url {
  width: 28%;
}

.links-page__col-date {
  width: 130px;
}

.links-page__table .links-page__col-clicks {
  width: 150px;
  text-align: end;
}

.links-page__col-actions {
  width: 72px;
}

/* Some column names are hidden, so the vertical dividers would float next to empty cells. */
.links-page__table thead th:not(:last-child) > span::after {
  content: none;
}

/* Keep cell backgrounds inside the container's rounded corners. */
.links-page__table th:first-child {
  border-start-start-radius: var(--border-radius-container);
}

.links-page__table th:last-child {
  border-start-end-radius: var(--border-radius-container);
}

.links-page__table :deep(tbody tr:last-child td:first-child) {
  border-end-start-radius: var(--border-radius-container);
}

.links-page__table :deep(tbody tr:last-child td:last-child) {
  border-end-end-radius: var(--border-radius-container);
}

.links-page__table :deep(.links-page__row--new td) {
  animation: links-item-new 3s ease-in;
}

@keyframes links-item-new {
  from {
    background: var(--color-background-item-selected);
  }
}

.links-page__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-scaled-s);
  padding: var(--space-scaled-xxxl) var(--space-container-horizontal);
  color: var(--color-text-empty);
  text-align: center;
}

.links-page__empty b {
  color: var(--color-text-body-default);
}

.links-page__empty p {
  margin: var(--space-static-xxxs) 0 0;
}
</style>
