<script setup lang="ts">
import { formatNumber } from '@/utils/format'

defineProps<{
  items: { key: string; text: string; clicks: number }[]
  /** Clicks in the whole range; bars and percentages are shares of it. */
  total: number
}>()
</script>

<template>
  <ol class="top-list">
    <li v-for="item in items" :key="item.key">
      <div class="top-list__row">
        <span class="top-list__text">{{ item.text }}</span>
        <span class="top-list__value">
          {{ formatNumber(item.clicks) }}
          <span class="top-list__share">({{ Math.round((item.clicks / total) * 100) }}%)</span>
        </span>
      </div>
      <div class="top-list__track" aria-hidden="true">
        <div class="top-list__bar" :style="{ width: `${(item.clicks / total) * 100}%` }"></div>
      </div>
    </li>
  </ol>
</template>

<style scoped>
.top-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-scaled-s);
  margin: 0;
  padding: 0;
  list-style: none;
}

.top-list__row {
  display: flex;
  justify-content: space-between;
  gap: var(--space-static-m);
}

.top-list__text {
  min-width: 0;
  overflow-wrap: anywhere;
}

.top-list__value {
  white-space: nowrap;
}

.top-list__share {
  color: var(--color-text-body-secondary);
}

.top-list__track {
  margin-top: var(--space-static-xxs);
  border-radius: 4px;
  background: var(--color-background-progress-bar-default);
}

.top-list__bar {
  height: 12px;
  border-radius: 4px;
  background: var(--color-charts-palette-categorical-1);
}
</style>
