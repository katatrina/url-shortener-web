<script setup lang="ts">
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuRoot, DropdownMenuTrigger } from 'reka-ui'
import CsIcon from './CsIcon.vue'

/** The `trigger` slot is the button; the `header` slot goes above the items. */
defineProps<{ items: { id: string; text: string; iconName?: string }[] }>()
const emit = defineEmits<{ 'item-click': [id: string] }>()

// Emit after the menu closes and focus is back on the trigger, so a modal opened by an item returns focus there.
let pending: string | null = null

function onCloseAutoFocus() {
  const id = pending
  pending = null
  if (id !== null) setTimeout(() => emit('item-click', id), 20)
}
</script>

<template>
  <DropdownMenuRoot :modal="false">
    <DropdownMenuTrigger as-child><slot name="trigger" /></DropdownMenuTrigger>
    <DropdownMenuPortal>
      <DropdownMenuContent class="cs-dropdown cs-menu" align="end" :side-offset="4" @close-auto-focus="onCloseAutoFocus">
        <div v-if="$slots.header" class="cs-menu__header"><slot name="header" /></div>
        <DropdownMenuItem v-for="item in items" :key="item.id" class="cs-option" @select="pending = item.id">
          <CsIcon v-if="item.iconName" :name="item.iconName" />
          {{ item.text }}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>

<!-- Not scoped: Reka puts the scope id on its positioning wrapper, not on the menu. -->
<style>
/* Reka positions the menu. */
.cs-dropdown.cs-menu {
  position: static;
  min-width: 160px;
  max-width: 320px;
  margin: 0;
}

.cs-menu .cs-option {
  outline: none;
  cursor: pointer;
}

.cs-menu .cs-option[data-highlighted] {
  background: var(--color-background-dropdown-item-hover);
  border-color: var(--color-border-dropdown-item-hover);
}

.cs-menu__header {
  margin-bottom: var(--space-static-xxs);
  padding: var(--space-static-xs) var(--space-static-m);
  border-bottom: 1px solid var(--color-border-divider-default);
  color: var(--color-text-body-secondary);
  overflow-wrap: anywhere;
}
</style>
