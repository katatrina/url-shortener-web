<script setup lang="ts">
defineProps<{ label: string }>()
const emit = defineEmits<{ delete: [] }>()

// Emit after the menu has closed and focus is back on its button, so closing the dialog returns focus there.
let deletePending = false

function onClosed() {
  if (!deletePending) return
  deletePending = false
  setTimeout(() => emit('delete'), 20)
}
</script>

<template>
  <UDropdownMenu
    :items="[{ label: 'Xóa', icon: 'i-lucide-trash-2', color: 'error', onSelect: () => { deletePending = true } }]"
    :content="{ align: 'end', onCloseAutoFocus: onClosed }"
    :modal="false"
  >
    <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" :aria-label="label" />
  </UDropdownMenu>
</template>
