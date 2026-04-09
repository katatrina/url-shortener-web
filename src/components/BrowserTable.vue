<script setup lang="ts">
import { formatNumber } from '@/lib/formatters'
import type { BrowserStat } from '@/types'

defineProps<{
  browsers: BrowserStat[]
}>()
</script>

<template>
  <div>
    <h3 class="mb-3 text-sm font-semibold">Top Browsers</h3>
    <div v-if="browsers.length === 0" class="text-sm text-muted-foreground">No browser data yet</div>
    <div v-else class="space-y-2">
      <div
        v-for="item in browsers"
        :key="item.browser"
        class="flex browsers-center justify-between rounded-md bg-muted/50 px-3 py-2 text-sm"
      >
        <span class="truncate">{{ item.browser || 'Unknown' }}</span>
        <span class="ml-4 shrink-0 font-medium">{{ formatNumber(item.clickCount) }}</span>
      </div>
    </div>
  </div>
</template>
