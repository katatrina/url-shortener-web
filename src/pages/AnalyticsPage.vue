<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { toast } from 'vue-sonner'
import { getUrl } from '@/api/urls'
import { getUrlStats } from '@/api/analytics'
import { formatNumber, truncateUrl } from '@/lib/formatters'
import StatsChart from '@/components/StatsChart.vue'
import ReferrerTable from '@/components/ReferrerTable.vue'
import CountryTable from '@/components/CountryTable.vue'
import OsTable from '@/components/OsTable.vue'
import BrowserTable from '@/components/BrowserTable.vue'
import DeviceTable from '@/components/DeviceTable.vue'
import TimeRangeSelector from '@/components/TimeRangeSelector.vue'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Skeleton from '@/components/ui/Skeleton.vue'
import { ArrowLeft, ExternalLink } from 'lucide-vue-next'
import type { UrlResponse, UrlStatsResponse } from '@/types'

const route = useRoute()
const code = route.params.code as string

const url = ref<UrlResponse | null>(null)
const stats = ref<UrlStatsResponse | null>(null)
const days = ref(30)
const loadingUrl = ref(true)
const loadingStats = ref(true)

async function fetchUrl() {
  loadingUrl.value = true
  try {
    const res = await getUrl(code)
    url.value = res.data.data
  } catch {
    toast.error('URL not found')
  } finally {
    loadingUrl.value = false
  }
}

async function fetchStats() {
  loadingStats.value = true
  try {
    const res = await getUrlStats(code, days.value)
    stats.value = res.data.data
  } catch {
    toast.error('Failed to load analytics')
  } finally {
    loadingStats.value = false
  }
}

watch(days, fetchStats)

onMounted(() => {
  fetchUrl()
  fetchStats()
})
</script>

<template>
  <div>
    <RouterLink to="/dashboard">
      <Button variant="ghost" size="sm" class="mb-6">
        <ArrowLeft class="mr-2 h-4 w-4" />
        Back to Links
      </Button>
    </RouterLink>

    <!-- URL info -->
    <div v-if="loadingUrl" class="mb-8 space-y-2">
      <Skeleton class="h-8 w-64" />
      <Skeleton class="h-5 w-96" />
    </div>
    <div v-else-if="url" class="mb-8">
      <h1 class="text-2xl font-bold">
        Analytics for <span class="font-mono">/{{ code }}</span>
      </h1>
      <div class="mt-1 flex items-center gap-2 text-muted-foreground">
        <ExternalLink class="h-4 w-4 shrink-0" />
        <a :href="url.longUrl" target="_blank" rel="noopener noreferrer" class="truncate hover:underline">
          {{ truncateUrl(url.longUrl, 80) }}
        </a>
      </div>
      <p class="mt-2 text-lg font-semibold">
        Total Clicks: {{ formatNumber(stats?.totalClicks ?? url.clickCount) }}
      </p>
    </div>

    <!-- Time range -->
    <div class="mb-6 flex items-center justify-between">
      <h2 class="text-lg font-semibold">Daily Clicks</h2>
      <TimeRangeSelector v-model="days" />
    </div>

    <!-- Chart -->
    <Card class="mb-8 p-6">
      <div v-if="loadingStats" class="flex items-center justify-center py-16">
        <Skeleton class="h-64 w-full" />
      </div>
      <div v-else-if="stats && stats.dailyClicks.length > 0">
        <StatsChart :daily-clicks="stats.dailyClicks" />
      </div>
      <div v-else class="py-16 text-center text-muted-foreground">
        No click data for this time range
      </div>
    </Card>

    <!-- Referrers & Countries -->
    <div class="grid gap-6 sm:grid-cols-2">
      <Card class="p-6">
        <div v-if="loadingStats">
          <Skeleton class="mb-3 h-5 w-32" />
          <Skeleton v-for="i in 5" :key="i" class="mb-2 h-9 w-full" />
        </div>
        <ReferrerTable v-else-if="stats" :referrers="stats.topReferrers" />
      </Card>
      <Card class="p-6">
        <div v-if="loadingStats">
          <Skeleton class="mb-3 h-5 w-32" />
          <Skeleton v-for="i in 5" :key="i" class="mb-2 h-9 w-full" />
        </div>
        <CountryTable v-else-if="stats" :countries="stats.topCountries" />
      </Card>
    </div>

    <!-- OS, Browsers & Devices -->
    <div class="mt-6 grid gap-6 sm:grid-cols-3">
      <Card class="p-6">
        <div v-if="loadingStats">
          <Skeleton class="mb-3 h-5 w-32" />
          <Skeleton v-for="i in 5" :key="i" class="mb-2 h-9 w-full" />
        </div>
        <OsTable v-else-if="stats" :items="stats.topOSes" />
      </Card>
      <Card class="p-6">
        <div v-if="loadingStats">
          <Skeleton class="mb-3 h-5 w-32" />
          <Skeleton v-for="i in 5" :key="i" class="mb-2 h-9 w-full" />
        </div>
        <BrowserTable v-else-if="stats" :items="stats.topBrowsers" />
      </Card>
      <Card class="p-6">
        <div v-if="loadingStats">
          <Skeleton class="mb-3 h-5 w-32" />
          <Skeleton v-for="i in 5" :key="i" class="mb-2 h-9 w-full" />
        </div>
        <DeviceTable v-else-if="stats" :items="stats.topDevices" />
      </Card>
    </div>
  </div>
</template>
