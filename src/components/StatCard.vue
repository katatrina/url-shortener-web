<script setup lang="ts">
import CsContainer from '@/components/cs/CsContainer.vue'

defineProps<{ label: string }>()
</script>

<template>
  <CsContainer class="stat-card">
    <div class="stat-card__label">{{ label }}</div>
    <div class="stat-card__value"><slot /></div>
    <div v-if="$slots.detail" class="stat-card__detail"><slot name="detail" /></div>
  </CsContainer>
</template>

<style scoped>
.stat-card :deep(.cs-container__content) {
  padding-block: var(--space-scaled-l);
}

.stat-card__label,
.stat-card__detail {
  color: var(--color-text-body-secondary);
}

.stat-card__value {
  overflow: hidden;
  color: var(--color-text-heading-default);
  font-size: 28px;
  line-height: 36px;
  font-weight: var(--font-weight-bold);
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
