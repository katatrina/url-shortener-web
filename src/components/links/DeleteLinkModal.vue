<script setup lang="ts">
import { ref, watch } from 'vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { errorMessage } from '@/api/errors'
import { deleteLink, linkKeys } from '@/api/links'
import type { Link } from '@/api/types'
import CsAlert from '@/components/cs/CsAlert.vue'
import CsButton from '@/components/cs/CsButton.vue'
import CsModal from '@/components/cs/CsModal.vue'
import { useFlashStore } from '@/stores/flash'

const props = defineProps<{ link: Link | null }>()
const visible = defineModel<boolean>('visible', { required: true })
const emit = defineEmits<{ deleted: [] }>()

const queryClient = useQueryClient()
const flash = useFlashStore()
const error = ref<string | null>(null)

watch(visible, (open) => {
  if (open) error.value = null
})

const { mutate, isPending } = useMutation({
  mutationFn: deleteLink,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: linkKeys.all })
    visible.value = false
    flash.push({ type: 'success', header: 'Đã xóa link', content: props.link?.shortUrl })
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
  <CsModal v-model:visible="visible" header="Xóa link này?" size="small">
    <div class="delete-link">
      <CsAlert v-if="error" type="error">{{ error }}</CsAlert>
      <p>Xóa vĩnh viễn <b class="delete-link__url">{{ link?.shortUrl }}</b>? Không thể khôi phục.</p>
    </div>

    <template #footer>
      <CsButton variant="link" @click="visible = false">Hủy</CsButton>
      <CsButton variant="primary" :loading="isPending" @click="onDelete">Xóa</CsButton>
    </template>
  </CsModal>
</template>

<style scoped>
.delete-link {
  display: flex;
  flex-direction: column;
  gap: var(--space-scaled-s);
}

.delete-link p {
  margin: 0;
}

.delete-link__url {
  overflow-wrap: anywhere;
}
</style>
