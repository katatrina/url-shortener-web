<script setup lang="ts">
import CsIcon from './CsIcon.vue'

withDefaults(defineProps<{ text?: string }>(), { text: 'Đang tải' })
</script>

<template>
  <div class="cs-spinner" role="status">
    <CsIcon name="status-in-progress" class="cs-spinner__icon" />
    {{ text }}
  </div>
</template>

<style scoped>
.cs-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-static-xs);
  padding: var(--space-scaled-l) 0;
  color: var(--color-text-empty);
}

.cs-spinner__icon {
  animation: cs-spinner-spin 0.7s linear infinite;
}

@keyframes cs-spinner-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
