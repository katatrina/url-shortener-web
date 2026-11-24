<script setup lang="ts">
/** Values come from the `value-<id>` slots. */
withDefaults(defineProps<{ items: { id: string; label: string }[]; columns?: number }>(), { columns: 4 })
</script>

<template>
  <dl class="cs-kv" :style="{ '--cs-kv-columns': columns }">
    <div v-for="item in items" :key="item.id" class="cs-kv__pair">
      <dt class="cs-kv__label">{{ item.label }}</dt>
      <dd class="cs-kv__value"><slot :name="`value-${item.id}`" /></dd>
    </div>
  </dl>
</template>

<style scoped>
.cs-kv {
  display: grid;
  grid-template-columns: repeat(var(--cs-kv-columns), minmax(0, 1fr));
  gap: var(--space-scaled-l);
  margin: 0;
}

.cs-kv__label {
  color: var(--color-text-label);
  font-size: var(--font-size-heading-xs);
  line-height: var(--line-height-heading-xs);
  font-weight: var(--font-weight-heading-xs);
}

.cs-kv__value {
  margin: 0;
}
</style>
