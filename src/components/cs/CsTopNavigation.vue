<script setup lang="ts">
// Always rendered in the dark theme, whatever the page theme.
import type { RouteLocationRaw } from 'vue-router'

defineProps<{ identity: { title: string; to: RouteLocationRaw } }>()
</script>

<template>
  <header class="cs-topnav" data-theme="dark">
    <div class="cs-topnav__bar">
      <RouterLink class="cs-topnav__identity" :to="identity.to">
        <span class="cs-topnav__title">{{ identity.title }}</span>
      </RouterLink>
      <div v-if="$slots.utilities" class="cs-topnav__utilities"><slot name="utilities" /></div>
    </div>
  </header>
</template>

<style scoped>
.cs-topnav {
  position: sticky;
  top: 0;
  z-index: 1000;
}

/* Lines up with the page column. */
.cs-topnav__bar {
  box-sizing: border-box;
  max-width: calc(1080px + 2 * var(--space-static-xxl));
  margin: 0 auto;
  padding: 0 var(--space-static-xxl);
}

.cs-topnav__title {
  font-size: var(--font-size-heading-xl);
  line-height: var(--line-height-heading-xl);
  font-weight: 800;
}

.cs-topnav__identity:focus-visible {
  outline: 2px solid var(--color-border-item-focused);
  outline-offset: 2px;
  border-radius: var(--border-radius-control-default-focus-ring);
}
</style>
