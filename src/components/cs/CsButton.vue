<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import CsIcon from './CsIcon.vue'

// Show the spinner only if loading lasts this long, to avoid a flash on fast requests.
const LOADING_DELAY_MS = 200

const props = withDefaults(
  defineProps<{
    variant?: 'normal' | 'primary' | 'link' | 'icon'
    disabled?: boolean
    loading?: boolean
    iconName?: string
    iconAlign?: 'left' | 'right'
    ariaLabel?: string
    formAction?: 'submit' | 'none'
  }>(),
  { variant: 'normal', iconAlign: 'left', formAction: 'none' },
)

const emit = defineEmits<{ click: [event: MouseEvent] }>()

const showLoading = ref(false)
let loadingTimer: ReturnType<typeof setTimeout> | undefined

watch(
  () => props.loading,
  (loading) => {
    clearTimeout(loadingTimer)
    if (!loading) showLoading.value = false
    else if (!showLoading.value) loadingTimer = setTimeout(() => (showLoading.value = true), LOADING_DELAY_MS)
  },
  { immediate: true },
)

onBeforeUnmount(() => clearTimeout(loadingTimer))

function onClick(event: MouseEvent) {
  if (props.loading) {
    event.preventDefault()
    return
  }
  emit('click', event)
}
</script>

<template>
  <button
    class="cs-btn"
    :class="variant !== 'normal' && `cs-btn--${variant}`"
    :type="formAction === 'submit' ? 'submit' : 'button'"
    :disabled="disabled"
    :aria-disabled="showLoading || undefined"
    :aria-busy="loading || undefined"
    :aria-label="ariaLabel"
    @click="onClick"
  >
    <!-- The spinner replaces the icon, or covers the label, so the width stays the same. -->
    <template v-if="iconName && iconAlign === 'left'">
      <CsIcon v-if="showLoading" name="status-in-progress" class="cs-btn__spinner" />
      <CsIcon v-else :name="iconName" />
    </template>
    <span v-if="$slots.default" class="cs-btn__label" :class="showLoading && !iconName && 'cs-btn__label--hidden'">
      <slot />
    </span>
    <template v-if="iconName && iconAlign === 'right'">
      <CsIcon v-if="showLoading" name="status-in-progress" class="cs-btn__spinner" />
      <CsIcon v-else :name="iconName" />
    </template>
    <CsIcon v-if="showLoading && !iconName" name="status-in-progress" class="cs-btn__spinner cs-btn__spinner--overlay" />
  </button>
</template>

<style scoped>
/* Transparent, not hidden, so screen readers still read the label. */
.cs-btn__label--hidden {
  color: transparent;
}

.cs-btn__spinner {
  animation: cs-btn-spin 0.7s linear infinite;
}

.cs-btn__spinner--overlay {
  position: absolute;
  inset: 0;
  margin: auto;
}

@keyframes cs-btn-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
