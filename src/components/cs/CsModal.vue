<script setup lang="ts">
// Reka's Dialog gives the focus trap, Esc and click-outside; the markup is the cs-modal one.
import { ref, watch } from 'vue'
import { DialogContent, DialogOverlay, DialogPortal, DialogRoot, DialogTitle } from 'reka-ui'
import CsIcon from './CsIcon.vue'

withDefaults(
  defineProps<{
    header: string
    size?: 'small' | 'medium' | 'large'
    /** Wraps content and footer in a form, so Enter in an input emits `submit`. */
    form?: boolean
  }>(),
  { size: 'medium' },
)

const visible = defineModel<boolean>('visible', { required: true })
const emit = defineEmits<{ submit: [] }>()

// Reka only returns focus to a DialogTrigger, so remember the opener ourselves.
let opener: HTMLElement | null = null
watch(visible, (open) => {
  if (open) opener = document.activeElement as HTMLElement | null
})

const contentEl = ref<HTMLElement | null>(null)

function onOpenAutoFocus(event: Event) {
  const target = contentEl.value?.querySelector<HTMLElement>('[data-autofocus]')
  if (!target) return
  event.preventDefault()
  target.focus()
}

function onCloseAutoFocus(event: Event) {
  event.preventDefault()
  if (opener?.isConnected) opener.focus()
  opener = null
}
</script>

<template>
  <DialogRoot v-model:open="visible">
    <DialogPortal>
      <DialogOverlay class="cs-modal-backdrop">
        <DialogContent
          class="cs-modal"
          :class="size !== 'medium' && `cs-modal--${size}`"
          :aria-describedby="undefined"
          @open-auto-focus="onOpenAutoFocus"
          @close-auto-focus="onCloseAutoFocus"
        >
          <div class="cs-modal__header">
            <DialogTitle class="cs-modal__title">{{ header }}</DialogTitle>
            <button class="cs-btn cs-btn--icon" type="button" aria-label="Đóng" @click="visible = false">
              <CsIcon name="close" />
            </button>
          </div>
          <component
            :is="form ? 'form' : 'div'"
            ref="contentEl"
            :novalidate="form || undefined"
            @submit.prevent="emit('submit')"
          >
            <div class="cs-modal__content"><slot /></div>
            <div v-if="$slots.footer" class="cs-modal__footer"><slot name="footer" /></div>
          </component>
        </DialogContent>
      </DialogOverlay>
    </DialogPortal>
  </DialogRoot>
</template>
