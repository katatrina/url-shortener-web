<script setup lang="ts">
import { ref, watch } from 'vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { ApiError } from '@/api/client'
import { errorMessage } from '@/api/errors'
import { deleteLink, linkKeys } from '@/api/links'
import type { Link } from '@/api/types'
import { useDelayedFlag } from '@/composables/useDelayedFlag'
import { stripProtocol } from '@/utils/format'

const props = defineProps<{ link: Link | null }>()
const visible = defineModel<boolean>('visible', { required: true })
const emit = defineEmits<{ deleted: []; /** The modal has closed after a delete. */ closed: [] }>()

const queryClient = useQueryClient()
const toast = useToast()
const error = ref<string | null>(null)
let deleted = false

watch(visible, (open) => {
  if (open) error.value = null
})

const { mutate, isPending } = useMutation({
  mutationFn: deleteLink,
  onSuccess: (_data, id) => onDeleted(id),
  onError: (err, id) => {
    // Already deleted somewhere else: same result for the user.
    if (err instanceof ApiError && err.code === 'LINK_NOT_FOUND') return onDeleted(id)
    error.value = errorMessage(err)
  },
})

// The lock below is immediate; only the look of it waits.
const showPending = useDelayedFlag(isPending)

function close() {
  if (!isPending.value) visible.value = false
}

function onDeleted(id: string) {
  // Update the list right away, so it's correct even if the refetch fails.
  queryClient.setQueryData<Link[]>(linkKeys.all, (links) => links?.filter((link) => link.id !== id))
  queryClient.invalidateQueries({ queryKey: linkKeys.all })
  deleted = true
  visible.value = false
  toast.add({ title: 'Đã xóa link', icon: 'i-lucide-circle-check', color: 'success', close: false })
  emit('deleted')
}

function onAfterLeave() {
  if (!deleted) return
  deleted = false
  // After the modal has given focus back to the menu button, which is about to disappear.
  setTimeout(() => emit('closed'), 20)
}

function onDelete() {
  if (!props.link || isPending.value || deleted) return
  error.value = null
  mutate(props.link.id)
}
</script>

<template>
  <UModal
    :open="visible"
    title="Xóa link này?"
    :dismissible="!isPending"
    :close="{ disabled: showPending }"
    :ui="{ footer: 'bg-muted' }"
    @update:open="(open) => !open && close()"
    @after:leave="onAfterLeave"
  >
    <template #body>
      <div class="flex flex-col gap-4">
        <UAlert v-if="error" role="alert" color="error" variant="subtle" icon="i-lucide-circle-alert" :title="error" />
        <div v-if="link" class="rounded-lg border border-default px-4 py-3 text-sm">
          <div class="line-clamp-2 font-semibold wrap-anywhere text-highlighted">{{ link.title || stripProtocol(link.shortUrl) }}</div>
          <div v-if="link.title" class="wrap-anywhere">{{ stripProtocol(link.shortUrl) }}</div>
          <div class="flex items-center gap-1 text-muted">
            <UIcon name="i-lucide-corner-down-right" class="size-4 shrink-0" />
            <span class="truncate">{{ stripProtocol(link.destinationUrl) }}</span>
          </div>
        </div>
        <p class="text-sm">Toàn bộ thống kê của link này cũng sẽ bị xóa. Không thể khôi phục.</p>
      </div>
    </template>

    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton color="neutral" variant="ghost" :disabled="showPending" @click="close">Hủy</UButton>
        <UButton color="error" :loading="showPending" @click="onDelete">Xóa</UButton>
      </div>
    </template>
  </UModal>
</template>
