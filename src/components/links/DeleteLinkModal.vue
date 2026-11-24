<script setup lang="ts">
import { ref, watch } from 'vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { errorMessage } from '@/api/errors'
import { deleteLink, linkKeys } from '@/api/links'
import type { Link } from '@/api/types'
import { stripProtocol } from '@/utils/format'

const props = defineProps<{ link: Link | null }>()
const visible = defineModel<boolean>('visible', { required: true })
const emit = defineEmits<{ deleted: [] }>()

const queryClient = useQueryClient()
const toast = useToast()
const error = ref<string | null>(null)

watch(visible, (open) => {
  if (open) error.value = null
})

const { mutate, isPending } = useMutation({
  mutationFn: deleteLink,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: linkKeys.all })
    visible.value = false
    toast.add({
      title: 'Đã xóa link',
      description: props.link?.shortUrl,
      icon: 'i-lucide-circle-check',
      color: 'success',
    })
    emit('deleted')
  },
  onError: (err) => {
    error.value = errorMessage(err)
  },
})

function onDelete() {
  if (props.link && !isPending.value) mutate(props.link.id)
}
</script>

<template>
  <UModal v-model:open="visible" title="Xóa link này?" :ui="{ footer: 'bg-muted' }">
    <template #body>
      <div class="flex flex-col gap-4">
        <UAlert v-if="error" role="alert" color="error" variant="subtle" icon="i-lucide-circle-alert" :title="error" />
        <div v-if="link" class="rounded-lg border border-default px-4 py-3 text-sm">
          <div class="font-semibold wrap-anywhere text-highlighted">{{ link.title || stripProtocol(link.shortUrl) }}</div>
          <div v-if="link.title" class="wrap-anywhere">{{ stripProtocol(link.shortUrl) }}</div>
          <div class="flex items-center gap-1 text-muted">
            <UIcon name="i-lucide-corner-down-right" class="size-4 shrink-0" />
            <span class="truncate">{{ stripProtocol(link.destinationUrl) }}</span>
          </div>
        </div>
        <p class="text-sm">Link sẽ bị xóa vĩnh viễn. Không thể khôi phục.</p>
      </div>
    </template>

    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton color="neutral" variant="ghost" @click="visible = false">Hủy</UButton>
        <UButton color="error" :loading="isPending" @click="onDelete">Xóa</UButton>
      </div>
    </template>
  </UModal>
</template>
