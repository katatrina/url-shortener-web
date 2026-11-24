<script setup lang="ts" generic="Id extends string">
defineProps<{ options: { id: Id; text: string }[]; label: string }>()

const selectedId = defineModel<Id>('selectedId', { required: true })
</script>

<template>
  <div class="cs-segmented" role="group" :aria-label="label">
    <button
      v-for="option in options"
      :key="option.id"
      class="cs-segmented__segment"
      type="button"
      :aria-pressed="option.id === selectedId"
      @click="selectedId = option.id"
    >
      {{ option.text }}
    </button>
  </div>
</template>

<style scoped>
.cs-segmented {
  display: inline-flex;
  border: 1px solid var(--color-border-segment-wrapper);
  border-radius: var(--border-radius-input);
  background: var(--color-background-segment-wrapper);
}

.cs-segmented__segment {
  position: relative;
  padding: var(--space-static-xxs) var(--space-static-m);
  border: 0;
  border-radius: calc(var(--border-radius-input) - 1px);
  background: var(--color-background-segment-default);
  color: var(--color-text-segment-default);
  font: inherit;
  font-weight: var(--font-weight-bold);
  white-space: nowrap;
  cursor: pointer;
}

.cs-segmented__segment:hover {
  background: var(--color-background-segment-hover);
  color: var(--color-text-segment-hover);
}

.cs-segmented__segment[aria-pressed='true'] {
  background: var(--color-background-segment-active);
  color: var(--color-text-segment-active);
}

.cs-segmented__segment:focus-visible {
  z-index: 1;
  outline: 2px solid var(--color-border-item-focused);
  outline-offset: 2px;
}
</style>
