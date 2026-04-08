<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
} from 'chart.js'
import { format, fromUnixTime } from 'date-fns'
import type { DailyClick } from '@/types'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler)

const props = defineProps<{
  dailyClicks: DailyClick[]
}>()

const chartData = computed(() => ({
  labels: props.dailyClicks.map((d) => format(fromUnixTime(d.date), 'MMM d')),
  datasets: [
    {
      label: 'Clicks',
      data: props.dailyClicks.map((d) => d.clickCount),
      borderColor: 'hsl(222, 47%, 11%)',
      backgroundColor: 'hsla(222, 47%, 11%, 0.1)',
      fill: true,
      tension: 0.3,
      pointRadius: 3,
      pointHoverRadius: 6,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'hsl(222, 47%, 11%)',
      titleFont: { size: 13 },
      bodyFont: { size: 12 },
      padding: 10,
      cornerRadius: 6,
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: 'hsl(215, 16%, 47%)', font: { size: 11 } },
    },
    y: {
      beginAtZero: true,
      grid: { color: 'hsl(214, 32%, 91%)' },
      ticks: {
        color: 'hsl(215, 16%, 47%)',
        font: { size: 11 },
        precision: 0,
      },
    },
  },
}
</script>

<template>
  <div class="h-64 w-full sm:h-80">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>
