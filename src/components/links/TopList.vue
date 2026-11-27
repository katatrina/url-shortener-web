<script setup lang="ts">
import { formatNumber } from '@/utils/format'

defineProps<{
  items: { key: string; text: string; clicks: number }[]
  /** Clicks in the whole range; bars and percentages are shares of it. */
  total: number
}>()
</script>

<template>
  <ol class="flex flex-col gap-1">
    <li v-for="item in items" :key="item.key" class="relative flex items-center justify-between gap-4 px-3 py-2">
      <div
        class="absolute inset-y-0 left-0 rounded-md bg-info/10"
        aria-hidden="true"
        :style="{ width: `${(item.clicks / total) * 100}%` }"
      />
      <span class="relative min-w-0 truncate" :title="item.text">{{ item.text }}</span>
      <span class="relative whitespace-nowrap font-medium text-highlighted">
        {{ formatNumber(item.clicks) }}
        <span class="font-normal text-muted">({{ Math.round((item.clicks / total) * 100) }}%)</span>
      </span>
    </li>
  </ol>
</template>
