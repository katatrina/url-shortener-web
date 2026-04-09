<script setup lang="ts">
import { formatNumber } from '@/lib/formatters'
import type { OSStat } from '@/types'

defineProps<{
  oses: OSStat[]
}>()
</script>

<template>
  <div>
    <h3 class="mb-3 text-sm font-semibold">Top Operating Systems</h3>
    <div v-if="oses.length === 0" class="text-sm text-muted-foreground">No OS data yet</div>
    <div v-else class="space-y-2">
      <div
        v-for="item in oses"
        :key="item.os"
        class="flex oses-center justify-between rounded-md bg-muted/50 px-3 py-2 text-sm"
      >
        <span class="truncate">{{ item.os || 'Unknown' }}</span>
        <span class="ml-4 shrink-0 font-medium">{{ formatNumber(item.clickCount) }}</span>
      </div>
    </div>
  </div>
</template>
