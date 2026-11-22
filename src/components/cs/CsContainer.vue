<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'default' | 'stacked'
    disableContentPaddings?: boolean
  }>(),
  { variant: 'default' },
)
</script>

<template>
  <div class="cs-container" :class="variant === 'stacked' && 'cs-container--stacked'">
    <div v-if="$slots.header" class="cs-container__header"><slot name="header" /></div>
    <div v-if="disableContentPaddings"><slot /></div>
    <div v-else class="cs-container__content"><slot /></div>
    <div v-if="$slots.footer" class="cs-container__footer"><slot name="footer" /></div>
  </div>
</template>
