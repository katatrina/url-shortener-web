<script setup lang="ts">
import { formatNumber } from '@/lib/formatters'
import type { ReferrerStat } from '@/types'

defineProps<{
  referrers: ReferrerStat[]
}>()
</script>

<template>
  <div>
    <h3 class="mb-3 text-sm font-semibold">Top Referrers</h3>
    <div v-if="referrers.length === 0" class="text-sm text-muted-foreground">No referrer data yet</div>
    <div v-else class="space-y-2">
      <div
        v-for="r in referrers"
        :key="r.referer"
        class="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2 text-sm"
      >
        <span class="truncate">{{ r.referer || 'Direct' }}</span>
        <span class="ml-4 shrink-0 font-medium">{{ formatNumber(r.clickCount) }}</span>
      </div>
    </div>
  </div>
</template>
