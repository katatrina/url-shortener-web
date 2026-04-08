<script setup lang="ts">
const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

function onBackdrop() {
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div v-if="props.open" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="fixed inset-0 bg-black/50" @click="onBackdrop" />
        <div class="relative z-50 w-full max-w-lg rounded-lg border border-border bg-background p-6 shadow-lg">
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.15s ease;
}
.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}
</style>
