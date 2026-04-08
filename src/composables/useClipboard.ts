import { useClipboard as useVueUseClipboard } from '@vueuse/core'
import { toast } from 'vue-sonner'

export function useCopyToClipboard() {
  const { copy, copied } = useVueUseClipboard()

  function copyWithToast(text: string) {
    copy(text)
    toast.success('Copied to clipboard!')
  }

  return { copy: copyWithToast, copied }
}
