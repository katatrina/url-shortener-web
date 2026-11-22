<script setup lang="ts">
// Always rendered in the dark theme, whatever the page theme.
import type { RouteLocationRaw } from 'vue-router'
import CsIcon from './CsIcon.vue'

export interface TopNavigationIdentity {
  title: string
  /** In-app destination of the product title. */
  to: RouteLocationRaw
}

export interface TopNavigationUtility {
  id: string
  /** `button` is clickable and emits `utility-click`; `text` only displays (e.g. the signed-in email). */
  type: 'button' | 'text'
  text?: string
  iconName?: string
  ariaLabel?: string
}

defineProps<{
  identity: TopNavigationIdentity
  utilities?: TopNavigationUtility[]
}>()

const emit = defineEmits<{ 'utility-click': [id: string] }>()
</script>

<template>
  <header class="cs-topnav" data-theme="dark">
    <div class="cs-topnav__bar">
      <RouterLink class="cs-topnav__identity" :to="identity.to">
        <span class="cs-topnav__title">{{ identity.title }}</span>
      </RouterLink>

      <div v-if="$slots.search" class="cs-topnav__search">
        <slot name="search" />
      </div>

      <div v-if="utilities?.length" class="cs-topnav__utilities">
        <template v-for="utility in utilities" :key="utility.id">
          <button
            v-if="utility.type === 'button'"
            class="cs-topnav__utility"
            type="button"
            :aria-label="utility.ariaLabel"
            @click="emit('utility-click', utility.id)"
          >
            <CsIcon v-if="utility.iconName" :name="utility.iconName" />
            <span v-if="utility.text">{{ utility.text }}</span>
          </button>
          <span v-else class="cs-topnav__utility cs-topnav__utility--static" :aria-label="utility.ariaLabel">
            <CsIcon v-if="utility.iconName" :name="utility.iconName" />
            <span v-if="utility.text" class="cs-topnav__utility-text">{{ utility.text }}</span>
          </span>
        </template>
      </div>
    </div>
  </header>
</template>

<style scoped>
.cs-topnav {
  position: sticky;
  top: 0;
  z-index: 1000;
}

.cs-topnav__utility--static,
.cs-topnav__utility--static:hover {
  color: var(--color-text-body-default);
  font-weight: var(--font-weight-normal);
  cursor: default;
}

.cs-topnav__utility-text {
  max-width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cs-topnav__utility:focus-visible,
.cs-topnav__identity:focus-visible {
  outline: 2px solid var(--color-border-item-focused);
  outline-offset: 2px;
  border-radius: var(--border-radius-control-default-focus-ring);
}
</style>
