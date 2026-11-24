<script setup lang="ts">
defineProps<{ label: string }>()
</script>

<template>
  <div class="flex min-w-0 flex-col gap-1 px-6 py-4">
    <div class="text-muted">{{ label }}</div>
    <div class="truncate text-3xl font-semibold text-highlighted"><slot /></div>
    <div v-if="$slots.detail" class="text-muted"><slot name="detail" /></div>
  </div>
</template>
