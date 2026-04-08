<script setup lang="ts">
import { formatNumber } from '@/lib/formatters'
import type { CountryStat } from '@/types'

defineProps<{
  countries: CountryStat[]
}>()
</script>

<template>
  <div>
    <h3 class="mb-3 text-sm font-semibold">Top Countries</h3>
    <div v-if="countries.length === 0" class="text-sm text-muted-foreground">No country data yet</div>
    <div v-else class="space-y-2">
      <div
        v-for="c in countries"
        :key="c.country"
        class="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2 text-sm"
      >
        <span>{{ c.country || 'Unknown' }}</span>
        <span class="ml-4 shrink-0 font-medium">{{ formatNumber(c.clickCount) }}</span>
      </div>
    </div>
  </div>
</template>
