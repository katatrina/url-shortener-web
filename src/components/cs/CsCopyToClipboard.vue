<script setup lang="ts">
// Not in the design system yet: Cloudscape's CopyToClipboard pattern, a copy icon button that
// briefly shows "Đã copy" in a popover.
import { onBeforeUnmount, ref } from 'vue'
import { PopoverAnchor, PopoverContent, PopoverPortal, PopoverRoot } from 'reka-ui'
import CsButton from './CsButton.vue'
import CsIcon from './CsIcon.vue'

const STATUS_MS = 2000

const props = withDefaults(
  defineProps<{
    textToCopy: string
    /** `inline` shows the text before the button; `button` is a primary button labeled by the slot. */
    variant?: 'icon' | 'inline' | 'button'
    ariaLabel?: string
  }>(),
  { variant: 'icon', ariaLabel: 'Copy' },
)

const status = ref<'success' | 'error' | null>(null)
let timer: ReturnType<typeof setTimeout> | undefined

async function copy() {
  try {
    await navigator.clipboard.writeText(props.textToCopy)
    status.value = 'success'
  } catch {
    status.value = 'error'
  }
  clearTimeout(timer)
  timer = setTimeout(() => (status.value = null), STATUS_MS)
}

function onOpenChange(open: boolean) {
  if (!open) status.value = null
}

onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <span class="cs-copy">
    <span v-if="variant === 'inline'" class="cs-copy__text">{{ textToCopy }}</span>
    <PopoverRoot :open="status !== null" @update:open="onOpenChange">
      <PopoverAnchor as-child>
        <CsButton v-if="variant === 'button'" variant="primary" icon-name="copy" @click="copy"><slot /></CsButton>
        <CsButton v-else variant="icon" icon-name="copy" :aria-label="ariaLabel" @click="copy" />
      </PopoverAnchor>
      <PopoverPortal>
        <PopoverContent
          class="cs-copy__popover"
          side="top"
          :side-offset="4"
          role="status"
          @open-auto-focus.prevent
          @close-auto-focus.prevent
        >
          <CsIcon :name="status === 'error' ? 'status-negative' : 'status-positive'" :class="`cs-copy__icon--${status}`" />
          {{ status === 'error' ? 'Không copy được' : 'Đã copy' }}
        </PopoverContent>
      </PopoverPortal>
    </PopoverRoot>
  </span>
</template>

<style scoped>
.cs-copy {
  display: inline-flex;
  align-items: center;
  gap: var(--space-static-xxs);
}

.cs-copy__text {
  overflow-wrap: anywhere;
}

/* Global: Reka puts the scope id on its positioning wrapper, not on the popover. */
:global(.cs-copy__popover) {
  z-index: 6000;
  display: inline-flex;
  align-items: center;
  gap: var(--space-static-xxs);
  padding: var(--space-static-xxs) var(--space-static-xs);
  border: 1px solid var(--color-border-popover);
  border-radius: var(--border-radius-popover);
  background: var(--color-background-popover);
  box-shadow: var(--shadow-dropdown);
  color: var(--color-text-body-default);
  font-size: var(--font-size-body-s);
  line-height: var(--line-height-body-s);
  white-space: nowrap;
}

.cs-copy__icon--success {
  color: var(--color-text-status-success);
}

.cs-copy__icon--error {
  color: var(--color-text-status-error);
}
</style>
