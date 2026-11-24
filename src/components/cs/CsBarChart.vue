<script setup lang="ts">
// Single-series column chart. Screen readers get the same data as a table.
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { formatNumber } from '@/utils/format'

export interface BarChartItem {
  key: string
  /** Short axis label. */
  label: string
  /** Full label for the tooltip and the table. */
  title: string
  value: number
}

const props = defineProps<{ items: BarChartItem[]; label: string; categoryLabel: string; valueLabel: string }>()

const HEIGHT = 240
const TOP = 12
const BOTTOM = 24
const MIN_LABEL_WIDTH = 48
const MAX_BAR_WIDTH = 24
const RADIUS = 4
const PLOT_BOTTOM = HEIGHT - BOTTOM

const root = ref<HTMLElement | null>(null)
const width = ref(0)
const active = ref<number | null>(null)
let observer: ResizeObserver | undefined

onMounted(() => {
  if (!root.value) return
  width.value = root.value.clientWidth
  observer = new ResizeObserver(() => (width.value = root.value?.clientWidth ?? 0))
  observer.observe(root.value)
})
onBeforeUnmount(() => observer?.disconnect())

/** Whole-number steps of 1, 2 or 5 × 10ⁿ, about four per axis. */
const ticks = computed(() => {
  const max = Math.max(1, ...props.items.map((item) => item.value))
  const raw = Math.max(1, max / 4)
  const power = 10 ** Math.floor(Math.log10(raw))
  const step = ([1, 2, 5, 10].find((n) => n * power >= raw) ?? 10) * power
  return Array.from({ length: Math.ceil(max / step) + 1 }, (_, i) => i * step)
})
const axisMax = computed(() => ticks.value[ticks.value.length - 1] ?? 1)
const left = computed(() => formatNumber(axisMax.value).length * 7 + 12)
const band = computed(() => Math.max(0, width.value - left.value) / Math.max(1, props.items.length))
const labelEvery = computed(() => Math.max(1, Math.ceil(MIN_LABEL_WIDTH / Math.max(1, band.value))))

const y = (value: number) => PLOT_BOTTOM - (value / axisMax.value) * (PLOT_BOTTOM - TOP)

const bars = computed(() => {
  const barWidth = Math.max(1, Math.min(MAX_BAR_WIDTH, band.value - 2, band.value * 0.7))
  return props.items.map((item, i) => {
    const center = left.value + (i + 0.5) * band.value
    const x0 = center - barWidth / 2
    const x1 = center + barWidth / 2
    const top = y(item.value)
    const r = Math.min(RADIUS, barWidth / 2, PLOT_BOTTOM - top)
    const path =
      item.value > 0
        ? `M${x0} ${PLOT_BOTTOM}V${top + r}Q${x0} ${top} ${x0 + r} ${top}H${x1 - r}Q${x1} ${top} ${x1} ${top + r}V${PLOT_BOTTOM}Z`
        : ''
    return { ...item, center, top, path }
  })
})

const activeBar = computed(() => (active.value === null ? undefined : bars.value[active.value]))
// Keep the tooltip inside the chart near either edge.
const tooltipStyle = computed(() => {
  const bar = activeBar.value
  if (!bar) return undefined
  const ratio = width.value ? bar.center / width.value : 0.5
  const shift = ratio < 0.15 ? '0%' : ratio > 0.85 ? '-100%' : '-50%'
  return { left: `${bar.center}px`, top: `${bar.top - 8}px`, transform: `translate(${shift}, -100%)` }
})
</script>

<template>
  <div ref="root" class="cs-chart">
    <svg v-if="width" :width="width" :height="HEIGHT" aria-hidden="true" @mouseleave="active = null">
      <g v-for="tick in ticks" :key="tick">
        <line class="cs-chart__grid" :x1="left" :x2="width" :y1="y(tick)" :y2="y(tick)" />
        <text class="cs-chart__text" :x="left - 8" :y="y(tick)" text-anchor="end" dominant-baseline="middle">
          {{ formatNumber(tick) }}
        </text>
      </g>
      <g v-for="(bar, index) in bars" :key="bar.key">
        <path v-if="bar.path" class="cs-chart__bar" :class="active !== null && active !== index && 'cs-chart__bar--dim'" :d="bar.path" />
        <text v-if="index % labelEvery === 0" class="cs-chart__text" :x="bar.center" :y="HEIGHT - 6" text-anchor="middle">
          {{ bar.label }}
        </text>
        <rect
          class="cs-chart__hit"
          :x="left + index * band"
          :y="0"
          :width="band"
          :height="PLOT_BOTTOM"
          @mouseenter="active = index"
        />
      </g>
    </svg>
    <div v-if="activeBar" class="cs-chart__tooltip" aria-hidden="true" :style="tooltipStyle">
      <b>{{ formatNumber(activeBar.value) }} {{ valueLabel }}</b>
      <div>{{ activeBar.title }}</div>
    </div>
    <div class="cs-sr-only">
      <table>
        <caption>{{ label }}</caption>
        <thead>
          <tr><th scope="col">{{ categoryLabel }}</th><th scope="col">{{ valueLabel }}</th></tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.key"><th scope="row">{{ item.title }}</th><td>{{ formatNumber(item.value) }}</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.cs-chart {
  position: relative;
  min-height: 240px;
}

.cs-chart svg {
  position: absolute;
  inset: 0 auto auto 0;
  overflow: visible;
}

.cs-chart__grid {
  stroke: var(--color-charts-line-grid);
}

.cs-chart__text {
  fill: var(--color-text-body-secondary);
  font-size: var(--font-size-body-s);
}

.cs-chart__bar {
  fill: var(--color-charts-palette-categorical-1);
}

.cs-chart__bar--dim {
  opacity: 0.5;
}

.cs-chart__hit {
  fill: transparent;
}

.cs-chart__tooltip {
  position: absolute;
  z-index: 1;
  padding: var(--space-static-xxs) var(--space-static-xs);
  border: 1px solid var(--color-border-popover);
  border-radius: var(--border-radius-popover);
  background: var(--color-background-popover);
  box-shadow: var(--shadow-dropdown);
  font-size: var(--font-size-body-s);
  line-height: var(--line-height-body-s);
  white-space: nowrap;
  pointer-events: none;
}
</style>
