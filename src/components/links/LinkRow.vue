<script setup lang="ts">
import { computed } from 'vue'
import type { Link } from '@/api/types'
import CsButton from '@/components/cs/CsButton.vue'
import CsButtonDropdown from '@/components/cs/CsButtonDropdown.vue'
import CsCopyToClipboard from '@/components/cs/CsCopyToClipboard.vue'
import { formatDate, formatNumber, formatTime, stripProtocol, urlDomain } from '@/utils/format'

const props = defineProps<{ link: Link }>()
const emit = defineEmits<{ delete: [] }>()

const title = computed(() => props.link.title || urlDomain(props.link.destinationUrl))
</script>

<template>
  <tr class="link-row">
    <td>
      <RouterLink class="link-row__title" :to="{ name: 'link-detail', params: { id: link.id } }">{{ title }}</RouterLink>
      <div class="link-row__short">
        <span>{{ stripProtocol(link.shortUrl) }}</span>
        <CsCopyToClipboard :text-to-copy="link.shortUrl" :aria-label="`Copy ${link.shortUrl}`" />
      </div>
    </td>
    <td>
      <a class="link-row__url" :href="link.destinationUrl" target="_blank" rel="noopener noreferrer" :title="link.destinationUrl">
        {{ stripProtocol(link.destinationUrl) }}<span class="cs-sr-only"> (mở tab mới)</span>
      </a>
    </td>
    <td>
      <span :title="`${formatDate(link.createdAt)} ${formatTime(link.createdAt)}`">{{ formatDate(link.createdAt) }}</span>
    </td>
    <td class="link-row__clicks">{{ formatNumber(link.clicks) }}</td>
    <td class="link-row__actions">
      <CsButtonDropdown :items="[{ id: 'delete', text: 'Xóa', iconName: 'remove' }]" @item-click="emit('delete')">
        <template #trigger>
          <CsButton variant="icon" icon-name="ellipsis" :aria-label="`Thao tác với ${title}`" />
        </template>
      </CsButtonDropdown>
    </td>
  </tr>
</template>

<style scoped>
.link-row td {
  vertical-align: middle;
}

.link-row__title {
  display: block;
  overflow: hidden;
  color: var(--color-text-heading-default);
  font-size: var(--font-size-heading-s);
  line-height: var(--line-height-heading-s);
  font-weight: var(--font-weight-bold);
  text-decoration: none;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.link-row__title:hover {
  color: var(--color-text-link-hover);
  text-decoration: underline;
}

.link-row__short {
  display: flex;
  align-items: center;
  gap: var(--space-static-xxs);
}

.link-row__short > span:first-child {
  overflow-wrap: anywhere;
}

.link-row__url {
  display: block;
  overflow: hidden;
  color: inherit;
  text-decoration: none;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.link-row__url:hover {
  color: var(--color-text-link-hover);
  text-decoration: underline;
}

.link-row td.link-row__clicks {
  font-weight: var(--font-weight-bold);
  text-align: end;
}

.link-row__actions {
  text-align: end;
}

.link-row a:focus-visible {
  outline: 2px solid var(--color-border-item-focused);
  outline-offset: -2px;
}
</style>
