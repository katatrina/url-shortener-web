<script setup lang="ts">
import { computed } from 'vue'

// Icons copied from docs/design-system/assets/Icons. Add a file to src/assets/icons to use a new one.
const files = import.meta.glob<string>('/src/assets/icons/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const icons: Record<string, string> = Object.fromEntries(
  Object.entries(files).map(([path, svg]) => [path.slice(path.lastIndexOf('/') + 1, -'.svg'.length), svg]),
)

const props = defineProps<{ name: string }>()

const svg = computed(() => {
  const markup = icons[props.name]
  if (!markup && import.meta.env.DEV) console.warn(`CsIcon: unknown icon "${props.name}"`)
  return markup ?? ''
})
</script>

<template>
  <!-- Markup comes from our own SVG files, so v-html is safe here. -->
  <span class="cs-icon" aria-hidden="true" v-html="svg"></span>
</template>
