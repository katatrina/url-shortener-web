<script setup lang="ts">
import CsIcon from './CsIcon.vue'

withDefaults(
  defineProps<{
    type?: 'info' | 'success' | 'warning' | 'error'
    header?: string
    dismissible?: boolean
  }>(),
  { type: 'info' },
)

defineEmits<{ dismiss: [] }>()

const icons = {
  info: 'status-info',
  success: 'status-positive',
  warning: 'status-warning',
  error: 'status-negative',
} as const
</script>

<template>
  <div
    class="cs-alert"
    :class="type !== 'info' && `cs-alert--${type}`"
    :role="type === 'error' ? 'alert' : 'status'"
  >
    <CsIcon :name="icons[type]" />
    <div class="cs-alert__body">
      <div v-if="header" class="cs-alert__header">{{ header }}</div>
      <slot />
    </div>
    <div v-if="$slots.action" class="cs-alert__action"><slot name="action" /></div>
    <button
      v-if="dismissible"
      class="cs-btn cs-btn--icon"
      type="button"
      aria-label="Đóng thông báo"
      @click="$emit('dismiss')"
    >
      <CsIcon name="close" />
    </button>
  </div>
</template>
