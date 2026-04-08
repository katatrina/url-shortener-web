<script setup lang="ts">
import Button from '@/components/ui/Button.vue'

const props = defineProps<{
  modelValue: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const options = [
  { label: '7d', value: 7 },
  { label: '30d', value: 30 },
  { label: '90d', value: 90 },
]
</script>

<template>
  <div class="flex gap-1">
    <Button
      v-for="opt in options"
      :key="opt.value"
      :variant="props.modelValue === opt.value ? 'default' : 'outline'"
      size="sm"
      @click="emit('update:modelValue', opt.value)"
    >
      {{ opt.label }}
    </Button>
  </div>
</template>
