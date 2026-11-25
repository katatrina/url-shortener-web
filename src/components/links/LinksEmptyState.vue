<script setup lang="ts">
const emit = defineEmits<{ create: [] }>()

// Placeholder cards. The set is rendered twice, so the scroll loops without a jump.
const BAR_WIDTHS = ['w-24', 'w-32', 'w-20']
</script>

<template>
  <div class="flex min-h-125 flex-col items-center justify-center gap-6 px-4 py-10">
    <div class="preview h-36 w-full max-w-64 overflow-hidden" aria-hidden="true">
      <div class="preview-cards flow-root">
        <div
          v-for="(width, i) in [...BAR_WIDTHS, ...BAR_WIDTHS]"
          :key="i"
          class="mt-4 flex items-center gap-3 rounded-lg border border-default bg-default p-4"
        >
          <UIcon name="i-lucide-link" class="size-4 shrink-0 text-muted" />
          <div class="h-2.5 rounded-sm bg-accented" :class="width" />
          <UIcon name="i-lucide-mouse-pointer-click" class="ms-auto size-4 shrink-0 text-dimmed" />
        </div>
      </div>
    </div>

    <div class="flex flex-col items-center gap-4">
      <div class="max-w-sm text-center text-pretty">
        <h2 class="text-base font-medium text-highlighted">Chưa có link nào</h2>
        <!-- <p class="mt-2 text-muted">Rút gọn một URL để bắt đầu theo dõi lượt click.</p> -->
      </div>
      <UButton size="lg" @click="emit('create')">
        Tạo link
        <template #trailing><UKbd value="c" variant="subtle" size="sm" /></template>
      </UButton>
    </div>
  </div>
</template>

<style scoped>
.preview {
  mask-image: linear-gradient(transparent, black 10%, black 90%, transparent);
}

.preview-cards {
  animation: preview-scroll 40s linear infinite;
}

@keyframes preview-scroll {
  to {
    transform: translateY(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .preview-cards {
    animation: none;
  }
}
</style>
