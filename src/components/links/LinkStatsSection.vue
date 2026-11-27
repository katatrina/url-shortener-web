<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { errorMessage } from '@/api/errors'
import { getLinkStats, linkKeys } from '@/api/links'
import type { StatsRange } from '@/api/types'
import StatCard from '@/components/StatCard.vue'
import { countryName, formatDate, formatNumber, formatTime } from '@/utils/format'
import TopList from './TopList.vue'

const UNKNOWN = '(unknown)'

const RANGES: { value: StatsRange; label: string }[] = [
  { value: '24h', label: '24 giờ' },
  { value: '7d', label: '7 ngày' },
  { value: '30d', label: '30 ngày' },
  { value: '90d', label: '90 ngày' },
]

/** `totalClicks` is all-time; unknown while the link loads. */
const props = defineProps<{ linkId: string; totalClicks?: number }>()

const route = useRoute()
const router = useRouter()

const queryRange = () => RANGES.find((option) => option.value === route.query.range)?.value ?? '7d'

// Ignore query changes caused by leaving the page, which would refetch for nothing.
const range = ref<StatsRange>(queryRange())
watch(
  () => route.query.range,
  () => {
    if (route.name === 'link-detail') range.value = queryRange()
  },
)

function selectRange(next: StatsRange) {
  router.replace({ query: { ...route.query, range: next } })
}

const {
  data: stats,
  error,
  refetch,
  isFetching,
  isPlaceholderData,
} = useQuery({
  queryKey: computed(() => linkKeys.stats(props.linkId, range.value)),
  queryFn: () => getLinkStats(props.linkId, range.value),
  // Keep showing the same link's previous range while the new one loads.
  placeholderData: (previous, previousQuery) => (previousQuery?.queryKey[1] === props.linkId ? previous : undefined),
})

const clicks = computed(() => stats.value?.summary.clicks ?? 0)

const rangeText = computed(() => RANGES.find((option) => option.value === range.value)?.label)

const comparison = computed(() => {
  const previous = stats.value?.summary.previousClicks
  if (previous === null || previous === undefined) return null
  if (previous === 0) return clicks.value > 0 ? 'Khoảng trước chưa có lượt click nào' : null
  const versus = `so với khoảng trước (${formatNumber(previous)})`
  if (clicks.value === previous) return `Không đổi ${versus}`
  const percent = formatNumber(Math.round((Math.abs(clicks.value - previous) / previous) * 100))
  return `${clicks.value > previous ? 'Tăng' : 'Giảm'} ${percent}% ${versus}`
})

const trendIcon = computed(() => {
  const previous = stats.value?.summary.previousClicks
  if (!previous || clicks.value === previous) return null
  return clicks.value > previous ? 'i-lucide-trending-up' : 'i-lucide-trending-down'
})

const chartItems = computed(() => {
  const hourly = stats.value?.granularity === 'hour'
  return (stats.value?.timeseries ?? []).map(({ timestamp, clicks: value }) => ({
    // Unique within a range: the 24 hour range needs the day too.
    time: hourly ? `${formatTime(timestamp)} ${formatDate(timestamp).slice(0, 5)}` : formatDate(timestamp).slice(0, 5),
    clicks: value,
  }))
})

const countries = computed(() =>
  (stats.value?.topCountries ?? []).map(({ value, clicks: count }) => ({
    key: value ?? '',
    text: countryName(value ?? ''),
    clicks: count,
  })),
)

const referrers = computed(() =>
  (stats.value?.topReferrers ?? []).map(({ value, clicks: count }) => ({
    key: value ?? '',
    text: !value || value === UNKNOWN ? 'Truy cập trực tiếp' : value,
    clicks: count,
  })),
)
</script>

<template>
  <section class="flex flex-col gap-4" aria-label="Thống kê">
    <div class="flex items-center justify-between gap-4">
      <h2 class="text-lg font-semibold text-highlighted">Thống kê</h2>
      <USelect
        :model-value="range"
        :items="RANGES"
        icon="i-lucide-calendar"
        color="neutral"
        class="w-40"
        aria-label="Khoảng thời gian"
        @update:model-value="selectRange"
      />
    </div>

    <UAlert
      v-if="error && !stats"
      role="alert"
      color="error"
      variant="subtle"
      icon="i-lucide-circle-alert"
      title="Không tải được thống kê"
      :description="errorMessage(error)"
      orientation="horizontal"
    >
      <template #actions>
        <UButton color="neutral" variant="outline" :loading="isFetching" @click="refetch()">Thử lại</UButton>
      </template>
    </UAlert>

    <div v-else class="grid grid-cols-2 gap-4" :class="isPlaceholderData && 'opacity-60'" :aria-busy="isFetching">
      <UCard class="col-span-2" :ui="{ header: 'p-0 sm:p-0' }">
        <template #header>
          <div class="grid grid-cols-2 divide-x divide-default">
            <StatCard :label="`Lượt click trong ${rangeText} qua`">
              {{ stats ? formatNumber(clicks) : '–' }}
              <template #detail>
                <span class="flex items-center gap-1">
                  <UIcon v-if="trendIcon" :name="trendIcon" class="size-4" />
                  {{ comparison ?? '\u00a0' }}
                </span>
              </template>
            </StatCard>
            <StatCard label="Tổng lượt click">
              {{ totalClicks === undefined ? '–' : formatNumber(totalClicks) }}
              <template #detail>Toàn thời gian</template>
            </StatCard>
          </div>
        </template>

        <div v-if="!stats" role="status" class="flex h-64 items-center justify-center gap-2 text-muted">
          <UIcon name="i-lucide-loader-circle" class="size-4 animate-spin" />
          Đang tải
        </div>
        <template v-else-if="clicks">
          <UChart
            type="area"
            :data="chartItems"
            index="time"
            :categories="[{ key: 'clicks', label: 'Lượt click' }]"
            :format="formatNumber"
            :height="256"
            aria-label="Lượt click theo thời gian"
          />
          <div class="sr-only">
            <table>
              <caption>Lượt click theo thời gian</caption>
              <thead>
                <tr><th scope="col">Thời gian</th><th scope="col">Lượt click</th></tr>
              </thead>
              <tbody>
                <tr v-for="item in chartItems" :key="item.time">
                  <th scope="row">{{ item.time }}</th>
                  <td>{{ formatNumber(item.clicks) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
        <div v-else class="flex h-64 items-center justify-center text-muted">Chưa có lượt click nào</div>
      </UCard>

      <UCard title="Top quốc gia">
        <div v-if="!stats" role="status" class="flex items-center justify-center gap-2 text-muted">
          <UIcon name="i-lucide-loader-circle" class="size-4 animate-spin" />
          Đang tải
        </div>
        <TopList v-else-if="clicks" :items="countries" :total="clicks" />
        <div v-else class="text-center text-muted">Chưa có lượt click nào</div>
      </UCard>

      <UCard title="Top nguồn truy cập">
        <div v-if="!stats" role="status" class="flex items-center justify-center gap-2 text-muted">
          <UIcon name="i-lucide-loader-circle" class="size-4 animate-spin" />
          Đang tải
        </div>
        <TopList v-else-if="clicks" :items="referrers" :total="clicks" />
        <div v-else class="text-center text-muted">Chưa có lượt click nào</div>
      </UCard>
    </div>
  </section>
</template>
