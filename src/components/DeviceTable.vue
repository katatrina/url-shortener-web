<script setup lang="ts">
import { formatNumber } from '@/lib/formatters'
import type { DeviceStat } from '@/types'

defineProps<{
  items: DeviceStat[]
}>()
</script>

<template>
  <div>
    <h3 class="mb-3 text-sm font-semibold">Top Devices</h3>
    <div v-if="items.length === 0" class="text-sm text-muted-foreground">No device data yet</div>
    <div v-else class="space-y-2">
      <div
        v-for="item in items"
        :key="item.deviceType"
        class="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2 text-sm"
      >
        <span class="truncate">{{ item.deviceType || 'Unknown' }}</span>
        <span class="ml-4 shrink-0 font-medium">{{ formatNumber(item.clickCount) }}</span>
      </div>
    </div>
  </div>
</template>
