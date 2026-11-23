<script setup lang="ts">
import type { FlashItem } from '@/stores/flash'
import CsCopyToClipboard from './CsCopyToClipboard.vue'
import CsIcon from './CsIcon.vue'

defineProps<{ items: FlashItem[] }>()
defineEmits<{ dismiss: [id: number] }>()

const icons = {
  success: 'status-positive',
  error: 'status-negative',
  warning: 'status-warning',
  info: 'status-info',
} as const
</script>

<template>
  <ul v-if="items.length" class="cs-flashbar">
    <li
      v-for="item in items"
      :key="item.id"
      class="cs-flash"
      :class="`cs-flash--${item.type}`"
      :role="item.type === 'error' ? 'alert' : 'status'"
    >
      <CsIcon :name="icons[item.type]" />
      <div class="cs-flash__body">
        <span v-if="item.header" class="cs-flash__header">{{ item.header }}</span>
        {{ item.content }}
        <CsCopyToClipboard
          v-if="item.copyText"
          variant="inline"
          :text-to-copy="item.copyText"
          aria-label="Copy short link"
        />
      </div>
      <button class="cs-flash__dismiss" type="button" aria-label="Đóng thông báo" @click="$emit('dismiss', item.id)">
        <CsIcon name="close" />
      </button>
    </li>
  </ul>
</template>

<style scoped>
/* Buttons inside a flash take its text color instead of the link blue. */
.cs-flash :deep(.cs-btn--icon) {
  color: inherit;
  padding-block: 0;
}

.cs-flash :deep(.cs-btn--icon:hover) {
  color: inherit;
  background: transparent;
  border-color: transparent;
}
</style>
