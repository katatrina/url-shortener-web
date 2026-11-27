<script setup lang="ts">
import AnimatedCopyIcon from '@/components/icons/AnimatedCopyIcon.vue'
import { useCopy } from '@/composables/useCopy'

defineProps<{ text: string }>()

const { copiedText, copy } = useCopy()
</script>

<template>
  <UButton
    :icon="copiedText === text ? 'i-lucide-check' : AnimatedCopyIcon"
    color="neutral"
    variant="ghost"
    size="xs"
    :ui="{ leadingIcon: copiedText === text ? 'text-success' : '' }"
    :aria-label="copiedText === text ? `Đã copy ${text}` : `Copy ${text}`"
    @click="copy(text)"
  />
</template>
