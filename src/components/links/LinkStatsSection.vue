<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { errorMessage } from '@/api/errors'
import { getLinkStats, linkKeys } from '@/api/links'
import type { StatsRange } from '@/api/types'
import CsAlert from '@/components/cs/CsAlert.vue'
import CsBarChart, { type BarChartItem } from '@/components/cs/CsBarChart.vue'
import CsButton from '@/components/cs/CsButton.vue'
import CsContainer from '@/components/cs/CsContainer.vue'
import CsHeader from '@/components/cs/CsHeader.vue'
import CsSegmentedControl from '@/components/cs/CsSegmentedControl.vue'
import CsSpinner from '@/components/cs/CsSpinner.vue'
import StatCard from '@/components/StatCard.vue'
import { countryName, formatDate, formatNumber, formatTime } from '@/utils/format'
import TopList from './TopList.vue'

const UNKNOWN = '(unknown)'

const RANGES: { id: StatsRange; text: string }[] = [
  { id: '24h', text: '24 giờ' },
  { id: '7d', text: '7 ngày' },
  { id: '30d', text: '30 ngày' },
  { id: '90d', text: '90 ngày' },
]

/** `totalClicks` is all-time; unknown while the link loads. */
const props = defineProps<{ linkId: string; totalClicks?: number }>()

const route = useRoute()
const router = useRouter()

const queryRange = () => RANGES.find((option) => option.id === route.query.range)?.id ?? '7d'

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

const rangeText = computed(() => RANGES.find((option) => option.id === range.value)?.text)

const comparison = computed(() => {
  const previous = stats.value?.summary.previousClicks
  if (previous === null || previous === undefined) return null
  if (previous === 0) return clicks.value > 0 ? 'Khoảng trước chưa có lượt click nào' : null
  const versus = `so với khoảng trước (${formatNumber(previous)})`
  if (clicks.value === previous) return `Không đổi ${versus}`
  const percent = formatNumber(Math.round((Math.abs(clicks.value - previous) / previous) * 100))
  return `${clicks.value > previous ? '▲ Tăng' : '▼ Giảm'} ${percent}% ${versus}`
})

const chartItems = computed<BarChartItem[]>(() => {
  const hourly = stats.value?.granularity === 'hour'
  return (stats.value?.timeseries ?? []).map(({ timestamp, clicks: value }) => ({
    key: timestamp,
    label: hourly ? formatTime(timestamp) : formatDate(timestamp).slice(0, 5),
    title: hourly ? `${formatTime(timestamp)} ${formatDate(timestamp)}` : formatDate(timestamp),
    value,
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
  <section class="stats" aria-label="Thống kê">
    <CsHeader variant="h2">
      Thống kê
      <template #actions>
        <CsSegmentedControl
          :selected-id="range"
          :options="RANGES"
          label="Khoảng thời gian"
          @update:selected-id="selectRange"
        />
      </template>
    </CsHeader>

    <CsAlert v-if="error && !stats" type="error" header="Không tải được thống kê">
      {{ errorMessage(error) }}
      <template #action>
        <CsButton :loading="isFetching" @click="refetch()">Thử lại</CsButton>
      </template>
    </CsAlert>

    <div v-else class="stats__grid" :class="isPlaceholderData && 'stats__grid--stale'" :aria-busy="isFetching">
      <StatCard :label="`Lượt click trong ${rangeText} qua`">
        {{ stats ? formatNumber(clicks) : '–' }}
        <template #detail>{{ comparison ?? '\u00a0' }}</template>
      </StatCard>
      <StatCard label="Tổng lượt click">
        {{ totalClicks === undefined ? '–' : formatNumber(totalClicks) }}
        <template #detail>Toàn thời gian</template>
      </StatCard>

      <CsContainer class="stats__chart">
        <template #header><CsHeader variant="h3">Lượt click theo thời gian</CsHeader></template>
        <CsSpinner v-if="!stats" />
        <CsBarChart
          v-else-if="clicks"
          :items="chartItems"
          label="Lượt click theo thời gian"
          category-label="Thời gian"
          value-label="lượt click"
        />
        <div v-else class="stats__empty">Chưa có lượt click nào</div>
      </CsContainer>

      <CsContainer>
        <template #header><CsHeader variant="h3">Top quốc gia</CsHeader></template>
        <CsSpinner v-if="!stats" />
        <TopList v-else-if="clicks" :items="countries" :total="clicks" />
        <div v-else class="stats__empty">Chưa có lượt click nào</div>
      </CsContainer>

      <CsContainer>
        <template #header><CsHeader variant="h3">Top nguồn truy cập</CsHeader></template>
        <CsSpinner v-if="!stats" />
        <TopList v-else-if="clicks" :items="referrers" :total="clicks" />
        <div v-else class="stats__empty">Chưa có lượt click nào</div>
      </CsContainer>
    </div>
  </section>
</template>

<style scoped>
.stats {
  display: flex;
  flex-direction: column;
  gap: var(--space-scaled-l);
}

.stats__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-scaled-l);
}

.stats__grid--stale {
  opacity: 0.6;
}

.stats__chart {
  grid-column: 1 / -1;
}

.stats__empty {
  color: var(--color-text-empty);
}
</style>
